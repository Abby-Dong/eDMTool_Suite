(function (global) {
  'use strict';

  function loadProjects() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      CPB.state.projects = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(CPB.state.projects)) CPB.state.projects = [];
      CPB.state.projects = CPB.state.projects.filter(project => !(project && project.__masScoped));
      CPB.state.projects.forEach(project => {
        if (project && typeof project === 'object') {
          project.store = normalizeStoreValue(project.store);
        }
      });
    } catch (e) {
      CPB.state.projects = [];
    }
  }

  function saveProjects() {
    if (window.__cpbEmbedMode) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(CPB.state.projects));
  }

  function newUid() {
    return 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function newProjectId() {
    return 'p' + Date.now().toString(36);
  }

  function confirmNewProject() {
    const name = document.getElementById('newProjectName').value.trim();
    if (!name || !CPB.state.pickerSelectedStyle) return;
    const prefixRaw = document.getElementById('newProjectPrefix').value.trim();
    const cssPrefix = slugifyPrefix(prefixRaw) || slugifyPrefix(name) || 'page';
    const proj = {
      id: newProjectId(),
      name,
      cssPrefix,
      styleId: CPB.state.pickerSelectedStyle,
      store: 'EU',
      sections: [],
      created: Date.now(),
      updated: Date.now()
    };
    CPB.state.projects.push(proj);
    saveProjects();
    closeNewProjectModal();
    openProject(proj.id);
  }

  function confirmRename() {
    const name = document.getElementById('renameInput').value.trim();
    const proj = CPB.state.projects.find(p => p.id === CPB.state.renameTargetId);
    if (!name || !proj) return;
    if (CPB.state.renameMode === 'rename') {
      proj.name = name;
      proj.updated = Date.now();
    } else {
      const copy = JSON.parse(JSON.stringify(proj));
      copy.id = newProjectId();
      copy.name = name;
      copy.created = Date.now();
      copy.updated = Date.now();
      copy.sections.forEach(s => s.uid = newUid());
      CPB.state.projects.push(copy);
    }
    saveProjects();
    closeRenameModal();
    renderGallery();
    toast(CPB.state.renameMode === 'rename' ? 'Renamed' : 'Duplicated', 'check_circle');
  }

  function deleteProject(pid) {
    const proj = CPB.state.projects.find(p => p.id === pid);
    if (!proj) return;
    if (!confirm(`Delete "${proj.name}"? This cannot be undone.`)) return;
    CPB.state.projects = CPB.state.projects.filter(p => p.id !== pid);
    saveProjects();
    renderGallery();
    toast('Project deleted', 'delete');
  }

  function openProject(pid) {
    const proj = CPB.state.projects.find(p => p.id === pid);
    if (!proj) return;
    proj.store = normalizeStoreValue(proj.store);
    CPB.state.currentProject = proj;
    localStorage.setItem(STORAGE_LAST_PROJ, pid);
    CPB.state.history = [];
    CPB.state.historyIndex = -1;
    pushHistory();
    CPB.state.selectedSectionUid = null;

    document.getElementById('projectGallery').classList.add('hidden');
    document.getElementById('builderView').classList.add('visible');
    document.getElementById('breadcrumbBar').classList.add('visible');
    document.getElementById('breadcrumbName').textContent = proj.name;
    document.getElementById('saveBtn').style.display = 'flex';
    document.getElementById('backBtn').style.display = 'flex';

    renderStyleSelect();
    renderSectionCatalog();
    renderCanvas();
    renderProperties();
    updateUndoRedoButtons();
  }

  function backToGallery() {
    saveCurrentProject(true);
    CPB.state.currentProject = null;
    CPB.state.selectedSectionUid = null;
    document.getElementById('projectGallery').classList.remove('hidden');
    document.getElementById('builderView').classList.remove('visible');
    document.getElementById('breadcrumbBar').classList.remove('visible');
    document.getElementById('saveBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'none';
    renderGallery();
  }

  function saveCurrentProject(silent) {
    if (!CPB.state.currentProject) return;
    CPB.state.currentProject.updated = Date.now();
    const idx = CPB.state.projects.findIndex(p => p.id === CPB.state.currentProject.id);
    if (idx >= 0) CPB.state.projects[idx] = CPB.state.currentProject;
    saveProjects();
    if (!silent) toast('Saved', 'check_circle');
  }

  function snapshotState() {
    if (!CPB.state.currentProject) return null;
    return JSON.stringify({
      sections: CPB.state.currentProject.sections,
      styleId: CPB.state.currentProject.styleId,
      store: getCurrentStore()
    });
  }

  function pushHistory() {
    if (!CPB.state.currentProject) return;
    const snap = snapshotState();
    if (snap === CPB.state.history[CPB.state.historyIndex]) return;
    CPB.state.history = CPB.state.history.slice(0, CPB.state.historyIndex + 1);
    CPB.state.history.push(snap);
    if (CPB.state.history.length > HISTORY_MAX) CPB.state.history.shift();
    CPB.state.historyIndex = CPB.state.history.length - 1;
    updateUndoRedoButtons();
  }

  let _historyDebounceTimer = null;
  function pushHistoryDebounced() {
    clearTimeout(_historyDebounceTimer);
    _historyDebounceTimer = setTimeout(pushHistory, 600);
  }

  function undoBuilder() {
    if (CPB.state.historyIndex <= 0) return;
    CPB.state.historyIndex--;
    applyHistory();
  }

  function redoBuilder() {
    if (CPB.state.historyIndex >= CPB.state.history.length - 1) return;
    CPB.state.historyIndex++;
    applyHistory();
  }

  function applyHistory() {
    const snap = CPB.state.history[CPB.state.historyIndex];
    if (!snap || !CPB.state.currentProject) return;
    const data = JSON.parse(snap);
    CPB.state.currentProject.sections = data.sections;
    CPB.state.currentProject.styleId = data.styleId;
    CPB.state.currentProject.store = normalizeStoreValue(data.store || CPB.state.currentProject.store);
    if (!CPB.state.currentProject.sections.find(s => s.uid === CPB.state.selectedSectionUid)) CPB.state.selectedSectionUid = null;
    const styleSelect = document.getElementById('styleSelect');
    if (styleSelect) styleSelect.value = CPB.state.currentProject.styleId;
    renderCanvas();
    renderProperties();
    saveCurrentProject(true);
    updateUndoRedoButtons();
  }

  function updateUndoRedoButtons() {
    document.getElementById('undoBtn').disabled = CPB.state.historyIndex <= 0;
    document.getElementById('redoBtn').disabled = CPB.state.historyIndex >= CPB.state.history.length - 1;
  }

  global.loadProjects = loadProjects;
  global.saveProjects = saveProjects;
  global.newUid = newUid;
  global.newProjectId = newProjectId;
  global.confirmNewProject = confirmNewProject;
  global.confirmRename = confirmRename;
  global.deleteProject = deleteProject;
  global.openProject = openProject;
  global.backToGallery = backToGallery;
  global.saveCurrentProject = saveCurrentProject;
  global.snapshotState = snapshotState;
  global.pushHistory = pushHistory;
  global.pushHistoryDebounced = pushHistoryDebounced;
  global.undoBuilder = undoBuilder;
  global.redoBuilder = redoBuilder;
  global.applyHistory = applyHistory;
  global.updateUndoRedoButtons = updateUndoRedoButtons;
})(window);
