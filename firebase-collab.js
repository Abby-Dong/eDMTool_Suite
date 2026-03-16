// ══════════════════════════════════════
// Firebase Collaboration Module
// ══════════════════════════════════════
// Provides: project list, save / load, share link, real-time sync.
// Depends on: firebase-config.js (window._db, window._fbReady)
//             NewsletterCustomizer.html globals:
//               builderStack, colorState, currentBuilderTheme,
//               renderBuilderPreview, renderBuilderRight, renderThemeSelect,
//               pushBuilderHistory, initState, THEMES, showToast,
//               COMPONENTS, buildComponentEditMap, _builderUid

(function () {
  'use strict';

  const COLLECTION = 'edm_projects';
  const PRESENCE_COL = 'presence';   // sub-collection under each project
  const GLOBAL_ONLINE_COL = 'edm_online'; // top-level collection for global presence
  let _currentProjectId = null;
  let _unsubscribe = null;          // Firestore onSnapshot listener
  let _unsubPresence = null;        // presence listener
  let _unsubGlobalPresence = null;  // global online listener
  let _globalHeartbeatTimer = null; // global heartbeat
  let _autoSaveTimer = null;
  let _heartbeatTimer = null;
  let _isSyncing = false;           // prevent echo loop
  let _lastSyncJson = '';           // de-dup identical saves
  let _presenceDismissed = false;   // user manually closed banner

  // Session identity
  const SESSION_ID = 'sess_' + Math.random().toString(36).slice(2, 10);
  const AVATAR_COLORS = ['#0059ff','#e03131','#2f9e44','#f08c00','#7048e8','#e64980','#0c8599','#e8590c'];

  function getSessionColor() {
    let hash = 0;
    for (let i = 0; i < SESSION_ID.length; i++) hash = ((hash << 5) - hash) + SESSION_ID.charCodeAt(i);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  }

  // ── helpers ──
  function db() { return window._db; }
  function ready() { return !!window._fbReady; }

  function generateShareId() {
    // 8-char URL-safe random id
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  }

  // ══════════════════════════════════════
  // Project Data Snapshot
  // ══════════════════════════════════════
  function captureSnapshot() {
    return {
      builderStack: JSON.parse(JSON.stringify(window.builderStack || [])),
      colorState: JSON.parse(JSON.stringify(window.colorState || {})),
      theme: window.currentBuilderTheme || 'light-blue',
      _builderUid: window._builderUid || 0
    };
  }

  function applySnapshot(snap) {
    if (!snap) return;

    // Restore theme first (resets colorState to defaults + overrides)
    if (snap.theme && window.THEMES && window.THEMES[snap.theme]) {
      window.currentBuilderTheme = snap.theme;
      window.initState();
      const theme = window.THEMES[snap.theme];
      if (theme && theme.overrides) {
        Object.entries(theme.overrides).forEach(([k, v]) => { window.colorState[k] = v; });
      }
    }

    // Overlay saved colorState on top
    if (snap.colorState) {
      Object.entries(snap.colorState).forEach(([k, v]) => { window.colorState[k] = v; });
    }

    // Restore builder stack
    if (snap.builderStack) {
      window.builderStack = JSON.parse(JSON.stringify(snap.builderStack));
    }
    if (typeof snap._builderUid === 'number') {
      window._builderUid = snap._builderUid;
    }

    // Re-render everything
    if (typeof window.renderThemeSelect === 'function') window.renderThemeSelect();
    if (typeof window.renderBuilderPreview === 'function') window.renderBuilderPreview();
    if (typeof window.renderBuilderRight === 'function') window.renderBuilderRight();

    // Reset local undo history to this new state (without triggering auto-save)
    if (typeof window.builderHistory !== 'undefined') {
      window.builderHistory = [JSON.parse(JSON.stringify(window.builderStack))];
      window.builderHistoryIdx = 0;
      if (typeof window.updateUndoRedoBtns === 'function') window.updateUndoRedoBtns();
    }

    _lastSyncJson = JSON.stringify(captureSnapshot());
    // NOTE: do NOT reset _isSyncing here — the caller (loadProject/saveProject/onSnapshot)
    // manages the sync lock to suppress onSnapshot echoes.

    // Flash sync indicator
    flashSyncDot();
  }

  // ══════════════════════════════════════
  // Save to Firestore
  // ══════════════════════════════════════
  async function saveProject(name) {
    if (!ready()) { showToast('<span class="mi">error</span>Firebase not configured'); return null; }
    const snap = captureSnapshot();
    const nowJson = JSON.stringify(snap);
    // If we already have a project open, just update it
    if (_currentProjectId) {
      if (nowJson === _lastSyncJson) {
        console.log('[Collab] skip save — no changes detected');
        return _currentProjectId;
      }
      _isSyncing = true; // suppress onSnapshot echo
      try {
        _loadProfile();
        await db().collection(COLLECTION).doc(_currentProjectId).update({
          builderStack: snap.builderStack,
          colorState:   snap.colorState,
          theme:        snap.theme,
          _builderUid:  snap._builderUid,
          lastEditBy:   _userName || 'Anonymous',
          lastEditEmoji: _userEmoji || '😀',
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        _lastSyncJson = nowJson;
        console.log('[Collab] ✅ saved —', snap.builderStack.length, 'components,',
                    Object.keys(snap.colorState).length, 'colors, theme:', snap.theme);
      } catch (e) {
        console.error('[Collab] ❌ save error', e);
        showToast('<span class="mi">error</span>Save failed — ' + e.message);
      }
      // Release sync lock after a short delay to let onSnapshot echo pass
      setTimeout(() => { _isSyncing = false; }, 800);
      return _currentProjectId;
    }
    // Create new project
    const id = generateShareId();
    _isSyncing = true; // suppress onSnapshot echo from startRealtimeSync
    try {
      _loadProfile();
      await db().collection(COLLECTION).doc(id).set({
        name: name || 'Untitled eDM',
        builderStack: snap.builderStack,
        colorState:   snap.colorState,
        theme:        snap.theme,
        _builderUid:  snap._builderUid,
        lastEditBy:   _userName || 'Anonymous',
        lastEditEmoji: _userEmoji || '😀',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      _currentProjectId = id;
      _lastSyncJson = nowJson;
      startRealtimeSync(id);
      updateProjectUI();
      console.log('[Collab] ✅ created project', id, '—', snap.builderStack.length, 'components');
      // Release sync lock after a short delay
      setTimeout(() => { _isSyncing = false; }, 800);
      return id;
    } catch (e) {
      _isSyncing = false;
      console.error('[Collab] ❌ create error', e);
      showToast('<span class="mi">error</span>Save failed — ' + e.message);
      return null;
    }
  }

  // ══════════════════════════════════════
  // Load from Firestore
  // ══════════════════════════════════════
  async function loadProject(id) {
    if (!ready()) return false;
    try {
      const doc = await db().collection(COLLECTION).doc(id).get();
      if (!doc.exists) {
        showToast('<span class="mi">error</span>Project not found');
        return false;
      }
      const record = doc.data();
      console.log('[Collab] raw Firestore doc fields:', Object.keys(record));
      // Build snapshot from native Firestore fields (new format)
      // Backward compat: fall back to legacy JSON string if new fields missing
      let snap;
      if (record.builderStack !== undefined) {
        snap = {
          builderStack: record.builderStack || [],
          colorState:   record.colorState   || {},
          theme:        record.theme        || 'light-blue',
          _builderUid:  typeof record._builderUid === 'number' ? record._builderUid : 0
        };
        console.log('[Collab] ✅ loaded (native format) —', snap.builderStack.length, 'components,',
                    Object.keys(snap.colorState).length, 'colors, theme:', snap.theme);
      } else if (record.data) {
        // Legacy format: single JSON string
        snap = JSON.parse(record.data);
        console.log('[Collab] ⚠️ loaded (legacy JSON format), will migrate on next save —',
                    snap.builderStack.length, 'components');
      } else {
        snap = { builderStack: [], colorState: {}, theme: 'light-blue', _builderUid: 0 };
        console.warn('[Collab] ⚠️ loaded empty project — no builderStack or data field found');
      }
      // Suppress onSnapshot echo during load
      _isSyncing = true;
      applySnapshot(snap);
      _currentProjectId = id;
      startRealtimeSync(id);
      updateProjectUI();
      // Release sync lock after onSnapshot echo passes
      setTimeout(() => { _isSyncing = false; }, 800);
      showToast('<span class="mi">folder_open</span>Opened: ' + (record.name || id));
      return true;
    } catch (e) {
      console.error('[Collab] ❌ load error', e);
      showToast('<span class="mi">error</span>Load failed — ' + e.message);
      return false;
    }
  }

  // ══════════════════════════════════════
  // Delete from Firestore
  // ══════════════════════════════════════
  async function deleteProject(id) {
    if (!ready()) return;
    try {
      await db().collection(COLLECTION).doc(id).delete();
      if (_currentProjectId === id) closeProject();
      showToast('<span class="mi">delete</span>Project deleted');
    } catch (e) { console.error('[Collab] delete error', e); }
  }

  // ══════════════════════════════════════
  // Close current project
  // ══════════════════════════════════════
  function closeProject() {
    stopRealtimeSync();
    _currentProjectId = null;
    _lastSyncJson = '';
    updateProjectUI();
  }

  // ══════════════════════════════════════
  // Real-time Sync (onSnapshot)
  // ══════════════════════════════════════
  function startRealtimeSync(id) {
    stopRealtimeSync();
    // Show green sync dot
    const dot = document.getElementById('collabSyncDot');
    if (dot) dot.classList.add('active');
    // Start presence tracking
    startPresence(id);

    _unsubscribe = db().collection(COLLECTION).doc(id).onSnapshot((doc) => {
      if (!doc.exists) return;
      if (_isSyncing) {
        console.log('[Collab] onSnapshot — suppressed (save/load in progress)');
        return;
      }
      const record = doc.data();
      if (!record) return;
      // Build snapshot from native fields (new) or legacy JSON string (old)
      let snap;
      if (record.builderStack !== undefined) {
        snap = {
          builderStack: record.builderStack || [],
          colorState:   record.colorState   || {},
          theme:        record.theme        || 'light-blue',
          _builderUid:  typeof record._builderUid === 'number' ? record._builderUid : 0
        };
      } else if (record.data) {
        snap = JSON.parse(record.data);
      } else {
        return; // no data at all
      }
      // Only apply if remote data is different from local
      const remoteJson = JSON.stringify(snap);
      if (remoteJson === _lastSyncJson) {
        console.log('[Collab] onSnapshot — skipped (data identical)');
        return;
      }
      _lastSyncJson = remoteJson;
      applySnapshot(snap);
      _isSyncing = false; // release lock after applying remote changes
      console.log('[Collab] 🔄 synced from collaborator —', snap.builderStack.length, 'components');
      if (typeof showToast === 'function') showToast('<span class="mi">sync</span>Synced from collaborator');
    }, (err) => {
      console.error('[Collab] sync error', err);
    });
  }

  function stopRealtimeSync() {
    if (_unsubscribe) { _unsubscribe(); _unsubscribe = null; }
    stopPresence();
    const dot = document.getElementById('collabSyncDot');
    if (dot) dot.classList.remove('active');
  }

  // ══════════════════════════════════════
  // Presence Tracking (with component-level editing info)
  // ══════════════════════════════════════
  let _editingUid = null;    // which builder stack uid this user is editing
  let _editingCompId = null; // which component type
  let _userName = null;      // display name for this session
  let _userEmoji = null;     // emoji avatar for this session
  let _remoteEditors = [];   // other sessions' editing info

  function _loadProfile() {
    if (_userName && _userEmoji) return;
    // Try localStorage first (set by profile modal)
    try {
      const saved = localStorage.getItem('edm_user_profile');
      if (saved) {
        const p = JSON.parse(saved);
        _userName = p.name || 'Anonymous';
        _userEmoji = p.emoji || '😀';
        return;
      }
    } catch (_) {}
    // Fallback to sessionStorage
    _userName = sessionStorage.getItem('collab_name') || 'Anonymous';
    _userEmoji = sessionStorage.getItem('collab_emoji') || '😀';
  }

  function startPresence(projectId) {
    console.log('[Presence] startPresence called for project:', projectId);
    stopPresence();
    _presenceDismissed = false;
    _loadProfile();
    // Write own presence doc
    const ref = db().collection(COLLECTION).doc(projectId).collection(PRESENCE_COL).doc(SESSION_ID);
    ref.set({
      sessionId: SESSION_ID,
      name: _userName,
      emoji: _userEmoji,
      color: getSessionColor(),
      editingUid: null,
      editingCompId: null,
      joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e => console.warn('[Presence] write error', e));

    // Show auto-sync badge
    const badge = document.getElementById('autoSyncBadge');
    if (badge) badge.classList.add('active');

    // Heartbeat every 15s — also sends current editing state
    _heartbeatTimer = setInterval(() => {
      ref.update({
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        editingUid: _editingUid,
        editingCompId: _editingCompId
      }).catch(() => {});
    }, 15000);

    // Listen to all presence docs
    _unsubPresence = db().collection(COLLECTION).doc(projectId).collection(PRESENCE_COL)
      .onSnapshot((snapshot) => {
        const now = Date.now();
        const others = [];
        const allOnline = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          const isSelf = (d.sessionId === SESSION_ID);
          // Consider stale if lastSeen > 30s ago
          // null lastSeen means serverTimestamp is pending — treat as alive
          const lastSeenTs = d.lastSeen ? d.lastSeen.toDate().getTime() : null;
          if (lastSeenTs !== null && now - lastSeenTs > 30000 && !isSelf) {
            // Clean up stale session
            doc.ref.delete().catch(() => {});
            return;
          }
          d._isSelf = isSelf;
          allOnline.push(d);
          if (!isSelf) others.push(d);
        });
        _remoteEditors = others;
        updatePresenceBanner(others);
        renderRemoteEditingIndicators(others);
        // Update top-bar online avatars (ALL users including self)
        if (typeof updateTopBarOnline === 'function') updateTopBarOnline(allOnline);
      }, (err) => console.warn('[Presence] listen error', err));

    // Clean up on page unload
    window.addEventListener('beforeunload', _cleanupPresence);
  }

  function stopPresence() {
    console.log('[Presence] stopPresence called', new Error().stack?.split('\n')[2]?.trim());
    if (_heartbeatTimer) { clearInterval(_heartbeatTimer); _heartbeatTimer = null; }
    if (_unsubPresence) { _unsubPresence(); _unsubPresence = null; }
    if (_currentProjectId) {
      db().collection(COLLECTION).doc(_currentProjectId).collection(PRESENCE_COL)
         .doc(SESSION_ID).delete().catch(() => {});
    }
    window.removeEventListener('beforeunload', _cleanupPresence);
    hidePresenceBanner();
    _remoteEditors = [];
    _editingUid = null;
    _editingCompId = null;
    renderRemoteEditingIndicators([]);
    // Reset top-bar online to show only self
    if (typeof updateTopBarOnline === 'function') updateTopBarOnline();
    const badge = document.getElementById('autoSyncBadge');
    if (badge) badge.classList.remove('active');
  }

  function _cleanupPresence() {
    // Best-effort delete on page close (sendBeacon not available for Firestore)
    if (_currentProjectId) {
      db().collection(COLLECTION).doc(_currentProjectId).collection(PRESENCE_COL)
         .doc(SESSION_ID).delete().catch(() => {});
    }
  }

  function updatePresenceBanner(others) {
    const banner = document.getElementById('presenceBanner');
    const avatarsEl = document.getElementById('presenceAvatars');
    const titleEl = document.getElementById('presenceTitle');
    const detailEl = document.getElementById('presenceDetail');
    if (!banner || !avatarsEl || !titleEl) return;

    if (others.length === 0 || _presenceDismissed) {
      banner.classList.remove('visible');
      return;
    }

    // Component names for display
    const COMP_NAMES = { header:'Header', banner:'Banner', 'top-news':'Top News', stats:'Stats',
      article:'Article', feature:'Feature', cards:'Cards', insight:'Insight' };

    // Build avatar circles with emoji
    let avatarHtml = '';
    const editingDetails = [];
    others.forEach((p, i) => {
      if (i < 5) {
        const emoji = p.emoji || '😀';
        avatarHtml += `<div class="presence-avatar" style="background:${p.color || '#0059ff'}" title="${escHtml(p.name || 'Anonymous')}">${emoji}</div>`;
      }
      if (p.editingCompId) {
        const compName = COMP_NAMES[p.editingCompId] || p.editingCompId;
        editingDetails.push((p.emoji || '') + ' ' + (p.name || 'Someone') + ' → ' + compName);
      }
    });
    avatarsEl.innerHTML = avatarHtml;

    // Title text
    const names = others.map(p => p.name || 'Anonymous');
    if (others.length === 1) {
      titleEl.textContent = names[0] + ' is editing with you';
    } else {
      titleEl.textContent = names.slice(0, 2).join(', ') + (others.length > 2 ? ' +' + (others.length - 2) : '') + ' are editing';
    }

    // Detail line — show what they're editing
    if (detailEl) {
      detailEl.textContent = editingDetails.length > 0 ? editingDetails.join(' · ') : 'Co-editing this project';
    }

    banner.classList.add('visible');
  }

  // ══════════════════════════════════════
  // Remote Editing Indicators on Canvas
  // ══════════════════════════════════════
  function renderRemoteEditingIndicators(others) {
    // Remove all existing remote indicators
    document.querySelectorAll('.builder-stack-item.remote-editing').forEach(el => {
      el.classList.remove('remote-editing');
      el.style.removeProperty('--remote-color');
    });
    document.querySelectorAll('.remote-edit-label').forEach(el => el.remove());

    if (!others || others.length === 0) return;

    const COMP_NAMES = { header:'Header', banner:'Banner', 'top-news':'Top News', stats:'Stats',
      article:'Article', feature:'Feature', cards:'Cards', insight:'Insight' };

    others.forEach(p => {
      if (!p.editingUid) return;
      const stackEl = document.querySelector(`.builder-stack-item[data-uid="${p.editingUid}"]`);
      if (!stackEl) return;

      const color = p.color || '#e03131';
      stackEl.classList.add('remote-editing');
      stackEl.style.setProperty('--remote-color', color);

      // Add name label (Google Docs style with emoji)
      const label = document.createElement('div');
      label.className = 'remote-edit-label';
      label.style.backgroundColor = color;
      const emojiSpan = p.emoji ? `<span class="remote-emoji">${p.emoji}</span>` : '';
      label.innerHTML = emojiSpan + (p.name || 'Anonymous') + ' is editing';
      stackEl.style.position = 'relative';
      stackEl.appendChild(label);
    });
  }

  // ══════════════════════════════════════
  // Update which component this user is editing
  // ══════════════════════════════════════
  function updateEditingComponent(uid, compId) {
    _editingUid = uid;
    _editingCompId = compId;
    // Immediately push to Firestore presence
    if (_currentProjectId && ready()) {
      const ref = db().collection(COLLECTION).doc(_currentProjectId).collection(PRESENCE_COL).doc(SESSION_ID);
      ref.update({
        editingUid: uid || null,
        editingCompId: compId || null,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(() => {});
    }
  }

  function hidePresenceBanner() {
    const banner = document.getElementById('presenceBanner');
    if (banner) banner.classList.remove('visible');
  }

  // Flash the green sync dot briefly
  function flashSyncDot() {
    const dot = document.getElementById('collabSyncDot');
    if (!dot) return;
    dot.style.transform = 'scale(1.8)';
    dot.style.boxShadow = '0 0 6px #27ae60';
    setTimeout(() => { dot.style.transform = ''; dot.style.boxShadow = ''; }, 400);
  }

  // ══════════════════════════════════════
  // Auto-save (debounced, called by host page on every edit)
  // ══════════════════════════════════════
  function triggerAutoSave() {
    if (!_currentProjectId || _isSyncing) return;
    clearTimeout(_autoSaveTimer);
    _autoSaveTimer = setTimeout(() => {
      saveProject().then(() => {
        flashSyncDot();
        // After auto-save succeeds, briefly show "saved" on Save button
        const btn = document.getElementById('collabSaveBtn');
        const dot = document.getElementById('collabUnsavedDot');
        if (dot) dot.classList.remove('visible');
        if (btn && btn.classList.contains('visible')) {
          btn.classList.remove('saving');
          btn.classList.add('saved');
          btn.innerHTML = '<span class="mi">check_circle</span> Saved';
          setTimeout(() => {
            btn.classList.remove('saved');
            btn.innerHTML = '<span class="mi">save</span> Save';
          }, 1200);
        }
      });
    }, 2000);
  }

  // ══════════════════════════════════════
  // Manual Save  (replaces auto-save flow)
  // ══════════════════════════════════════
  function markUnsaved() {
    // Show Save button even if no project yet (first save will create one)
    const dot  = document.getElementById('collabUnsavedDot');
    const btn  = document.getElementById('collabSaveBtn');
    if (dot) dot.classList.add('visible');
    if (btn) btn.classList.add('visible');
  }

  async function manualSave() {
    // If no project open yet, show naming modal → create new project
    if (!_currentProjectId) {
      if (window.openRenameModal) {
        window.openRenameModal({
          icon: 'add_circle',
          title: 'New Project',
          desc: 'Enter a name for your new project',
          value: 'Untitled eDM',
          placeholder: 'Project name',
          confirmText: 'Create',
          onConfirm: async function(name) {
            const btn = document.getElementById('collabSaveBtn');
            const dot = document.getElementById('collabUnsavedDot');
            if (btn) { btn.classList.add('saving'); btn.innerHTML = '<span class="mi">hourglass_empty</span> Creating…'; }
            try {
              const id = await saveProject(name.trim() || 'Untitled eDM');
              if (id) {
                if (dot) dot.classList.remove('visible');
                if (btn) {
                  btn.classList.remove('saving');
                  btn.classList.add('saved');
                  btn.innerHTML = '<span class="mi">check_circle</span> Created!';
                  setTimeout(() => {
                    btn.classList.remove('saved');
                    btn.innerHTML = '<span class="mi">save</span> Save';
                  }, 1500);
                }
                flashSyncDot();
                showToast('<span class="mi">check_circle</span>Project "' + escHtml(name) + '" created!');
              }
            } catch (e) {
              console.error('[Collab] create error', e);
              if (btn) { btn.classList.remove('saving'); btn.innerHTML = '<span class="mi">save</span> Save'; }
            }
          }
        });
      }
      return;
    }

    // Normal save (project already exists)
    const btn = document.getElementById('collabSaveBtn');
    const dot = document.getElementById('collabUnsavedDot');

    // Indicate "saving…"
    if (btn) { btn.classList.add('saving'); btn.innerHTML = '<span class="mi">hourglass_empty</span> Saving…'; }

    try {
      await saveProject();
      flashSyncDot();

      // Hide unsaved dot
      if (dot) dot.classList.remove('visible');

      // Show "Saved ✓" feedback
      if (btn) {
        btn.classList.remove('saving');
        btn.classList.add('saved');
        btn.innerHTML = '<span class="mi">check_circle</span> Saved';
        setTimeout(() => {
          btn.classList.remove('saved');
          btn.innerHTML = '<span class="mi">save</span> Save';
        }, 1500);
      }
    } catch (e) {
      console.error('[Collab] manual save error', e);
      if (btn) {
        btn.classList.remove('saving');
        btn.innerHTML = '<span class="mi">error</span> Error';
        setTimeout(() => { btn.innerHTML = '<span class="mi">save</span> Save'; }, 2000);
      }
    }
  }

  // ══════════════════════════════════════
  // List all projects
  // ══════════════════════════════════════
  async function listProjects() {
    if (!ready()) return [];
    try {
      const qs = await db().collection(COLLECTION).orderBy('updatedAt', 'desc').limit(50).get();
      const list = [];
      qs.forEach(doc => {
        const d = doc.data();
        // Extract component summary from native fields or legacy format
        let components = [];
        let theme = 'light-blue';
        let builderStack = [];
        let colorStateData = {};
        if (d.builderStack !== undefined) {
          builderStack = d.builderStack || [];
          components = builderStack.map(item => item.compId);
          theme = d.theme || 'light-blue';
          colorStateData = d.colorState || {};
        } else if (d.data) {
          try {
            const parsed = JSON.parse(d.data);
            builderStack = parsed.builderStack || [];
            components = builderStack.map(item => item.compId);
            theme = parsed.theme || 'light-blue';
            colorStateData = parsed.colorState || {};
          } catch (_) {}
        }
        list.push({
          id: doc.id,
          name: d.name,
          updatedAt: d.updatedAt ? d.updatedAt.toDate() : new Date(),
          componentCount: components.length,
          components: components,
          theme: theme,
          builderStack: builderStack,
          colorState: colorStateData,
          lastEditBy: d.lastEditBy || null,
          lastEditEmoji: d.lastEditEmoji || null
        });
      });
      return list;
    } catch (e) { console.error('[Collab] list error', e); return []; }
  }

  // ══════════════════════════════════════
  // Rename project
  // ══════════════════════════════════════
  async function renameProject(id, newName) {
    if (!ready()) return;
    try {
      await db().collection(COLLECTION).doc(id).update({ name: newName });
    } catch (e) { console.error('[Collab] rename error', e); }
  }

  // ══════════════════════════════════════
  // Duplicate project
  // ══════════════════════════════════════
  async function duplicateProject(id) {
    if (!ready()) return null;
    try {
      const doc = await db().collection(COLLECTION).doc(id).get();
      if (!doc.exists) { console.warn('[Collab] duplicate — source not found'); return null; }
      const d = doc.data();
      const newId = generateShareId();
      await db().collection(COLLECTION).doc(newId).set({
        name: (d.name || 'Untitled') + ' (copy)',
        builderStack: d.builderStack || [],
        colorState: d.colorState || {},
        theme: d.theme || 'light-blue',
        _builderUid: d._builderUid || 0,
        lastEditBy: d.lastEditBy || null,
        lastEditEmoji: d.lastEditEmoji || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('[Collab] ✅ duplicated', id, '→', newId);
      return newId;
    } catch (e) { console.error('[Collab] duplicate error', e); return null; }
  }

  // ══════════════════════════════════════
  // Share link
  // ══════════════════════════════════════
  function getShareUrl(projectId) {
    const base = window.location.origin + window.location.pathname;
    return base + '?project=' + (projectId || _currentProjectId);
  }

  // ══════════════════════════════════════
  // UI — Project Manager Modal
  // ══════════════════════════════════════
  function updateProjectUI() {
    const indicator = document.getElementById('collabProjectName');
    const shareBtn = document.getElementById('collabShareBtn');
    if (indicator) {
      if (_currentProjectId) {
        // Fetch name
        db().collection(COLLECTION).doc(_currentProjectId).get().then(doc => {
          const name = doc.exists ? (doc.data().name || _currentProjectId) : _currentProjectId;
          indicator.textContent = name;
          indicator.title = 'Project: ' + name;
        });
        indicator.style.display = '';
      } else {
        indicator.textContent = '';
        indicator.style.display = 'none';
      }
    }
    if (shareBtn) shareBtn.style.display = _currentProjectId ? '' : 'none';
    // Reset save button when switching projects
    const saveBtn = document.getElementById('collabSaveBtn');
    const unsavedDot = document.getElementById('collabUnsavedDot');
    if (saveBtn) { saveBtn.classList.remove('visible', 'saving', 'saved'); saveBtn.innerHTML = '<span class="mi">save</span> Save'; }
    if (unsavedDot) unsavedDot.classList.remove('visible');
  }

  async function openProjectManager() {
    if (!ready()) {
      showToast('<span class="mi">error</span>Firebase not configured — check config.js');
      return;
    }
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.classList.add('visible');
    await refreshProjectList();
  }

  function closeProjectManager() {
    const modal = document.getElementById('projectModal');
    if (modal) modal.classList.remove('visible');
  }

  async function refreshProjectList() {
    const listEl = document.getElementById('projectList');
    if (!listEl) return;
    listEl.innerHTML = '<div style="text-align:center;padding:24px;color:#bbb;">Loading…</div>';
    const projects = await listProjects();
    if (projects.length === 0) {
      listEl.innerHTML = '<div style="text-align:center;padding:24px;color:#bbb;">No saved projects yet</div>';
      return;
    }
    // Component ID → readable name map
    const COMP_NAMES = { header:'Header', banner:'Banner', 'top-news':'Top News', stats:'Stats',
      article:'Article', feature:'Feature', cards:'Cards', insight:'Insight' };

    let html = '';
    projects.forEach(p => {
      const active = p.id === _currentProjectId ? ' proj-item-active' : '';
      const dateStr = p.updatedAt ? p.updatedAt.toLocaleDateString() + ' ' + p.updatedAt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '';
      // Build component summary line
      let compSummary = '';
      if (p.componentCount > 0) {
        const compNames = p.components.map(c => COMP_NAMES[c] || c);
        // Deduplicate and show count if repeated
        const counts = {};
        compNames.forEach(n => { counts[n] = (counts[n] || 0) + 1; });
        const parts = Object.entries(counts).map(([n, c]) => c > 1 ? n + ' ×' + c : n);
        compSummary = '<span class="proj-item-comps">' + parts.join(' · ') + '</span>';
      } else {
        compSummary = '<span class="proj-item-comps proj-item-empty">Empty project</span>';
      }
      html += `<div class="proj-item${active}" data-id="${p.id}">
        <div class="proj-item-info" onclick="window.Collab.loadAndClose('${p.id}')">
          <span class="proj-item-name">${escHtml(p.name)}</span>
          <span class="proj-item-meta">${compSummary}<span class="proj-item-date">${dateStr}</span></span>
        </div>
        <div class="proj-item-actions">
          <button class="proj-item-btn" title="Copy share link" onclick="window.Collab.copyShareLink('${p.id}')">
            <span class="mi">link</span>
          </button>
          <button class="proj-item-btn proj-item-btn-del" title="Delete" onclick="window.Collab.confirmDelete('${p.id}','${escAttr(p.name)}')">
            <span class="mi">delete</span>
          </button>
        </div>
      </div>`;
    });
    listEl.innerHTML = html;
  }

  function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function escAttr(s) { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

  async function createNewProject() {
    const input = document.getElementById('newProjectName');
    const name = (input ? input.value.trim() : '') || 'Untitled eDM';
    // CRITICAL: close any open project so saveProject creates a NEW doc
    if (_currentProjectId) {
      stopRealtimeSync();
      _currentProjectId = null;
      _lastSyncJson = '';
    }
    // Reset canvas to blank for a truly new project
    if (typeof window.resetCanvasToBlank === 'function') {
      window.resetCanvasToBlank();
    }
    const id = await saveProject(name);
    if (id) {
      showToast('<span class="mi">check_circle</span>Project "' + escHtml(name) + '" created!');
      if (input) input.value = '';
      await refreshProjectList();
    }
  }

  async function loadAndClose(id) {
    const ok = await loadProject(id);
    if (ok) closeProjectManager();
  }

  function copyShareLink(id) {
    const url = getShareUrl(id);
    navigator.clipboard.writeText(url).then(() => {
      showToast('<span class="mi">check_circle</span>Share link copied!');
    });
  }

  function shareCurrentProject() {
    if (!_currentProjectId) return;
    copyShareLink(_currentProjectId);
  }

  async function confirmDelete(id, name) {
    if (!confirm('Delete project "' + name + '"?\nThis cannot be undone.')) return;
    await deleteProject(id);
    await refreshProjectList();
  }

  // ══════════════════════════════════════
  // Auto-load from URL ?project=XXXX
  // ══════════════════════════════════════
  function checkUrlProject() {
    if (!ready()) return;
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('project');
    if (pid) {
      loadProject(pid);
      // Clean URL without reload
      const clean = window.location.origin + window.location.pathname;
      window.history.replaceState({}, '', clean);
    }
  }

  // ══════════════════════════════════════
  // Global Online Presence (app-wide, independent of project)
  // ══════════════════════════════════════
  function startGlobalPresence() {
    if (!ready()) return;
    stopGlobalPresence();
    _loadProfile();
    const ref = db().collection(GLOBAL_ONLINE_COL).doc(SESSION_ID);
    ref.set({
      sessionId: SESSION_ID,
      name: _userName,
      emoji: _userEmoji,
      color: getSessionColor(),
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e => console.warn('[GlobalPresence] write error', e));

    // Heartbeat every 20s
    _globalHeartbeatTimer = setInterval(() => {
      ref.update({
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        name: _userName,
        emoji: _userEmoji
      }).catch(() => {});
    }, 20000);

    // Listen to all online users
    _unsubGlobalPresence = db().collection(GLOBAL_ONLINE_COL)
      .onSnapshot((snapshot) => {
        const now = Date.now();
        const allOnline = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          const isSelf = (d.sessionId === SESSION_ID);
          const lastSeenTs = d.lastSeen ? d.lastSeen.toDate().getTime() : null;
          // Stale if lastSeen > 45s ago (heartbeat is 20s, so 2x + margin)
          if (lastSeenTs !== null && now - lastSeenTs > 45000 && !isSelf) {
            doc.ref.delete().catch(() => {});
            return;
          }
          d._isSelf = isSelf;
          allOnline.push(d);
        });
        console.log('[GlobalPresence] online users:', allOnline.length);
        if (typeof updateTopBarOnline === 'function') updateTopBarOnline(allOnline);
      }, (err) => console.warn('[GlobalPresence] listen error', err));

    // Clean up on page unload
    window.addEventListener('beforeunload', _cleanupGlobalPresence);
  }

  function stopGlobalPresence() {
    if (_globalHeartbeatTimer) { clearInterval(_globalHeartbeatTimer); _globalHeartbeatTimer = null; }
    if (_unsubGlobalPresence) { _unsubGlobalPresence(); _unsubGlobalPresence = null; }
    db().collection(GLOBAL_ONLINE_COL).doc(SESSION_ID).delete().catch(() => {});
    window.removeEventListener('beforeunload', _cleanupGlobalPresence);
  }

  function _cleanupGlobalPresence() {
    if (ready()) {
      db().collection(GLOBAL_ONLINE_COL).doc(SESSION_ID).delete().catch(() => {});
    }
  }

  function refreshGlobalProfile() {
    // Called when user updates their profile — re-read and push to Firestore
    _userName = null;
    _userEmoji = null;
    _loadProfile();
    if (ready()) {
      db().collection(GLOBAL_ONLINE_COL).doc(SESSION_ID).update({
        name: _userName,
        emoji: _userEmoji,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(() => {});
    }
  }

  // ══════════════════════════════════════
  // Expose public API on window.Collab
  // ══════════════════════════════════════
  window.Collab = {
    save: saveProject,
    load: loadProject,
    close: closeProject,
    list: listProjects,
    rename: renameProject,
    duplicate: duplicateProject,
    delete: deleteProject,
    triggerAutoSave: triggerAutoSave,
    manualSave: manualSave,
    markUnsaved: markUnsaved,
    getShareUrl: getShareUrl,
    getCurrentProjectId: () => _currentProjectId,
    openManager: openProjectManager,
    closeManager: closeProjectManager,
    createNew: createNewProject,
    loadAndClose: loadAndClose,
    copyShareLink: copyShareLink,
    shareCurrentProject: shareCurrentProject,
    confirmDelete: confirmDelete,
    checkUrlProject: checkUrlProject,
    updateEditing: updateEditingComponent,
    getRemoteEditors: () => _remoteEditors,
    ready: ready,
    startGlobalPresence: startGlobalPresence,
    stopGlobalPresence: stopGlobalPresence,
    refreshGlobalProfile: refreshGlobalProfile
  };

})();
