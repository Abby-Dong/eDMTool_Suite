(function (global) {
  'use strict';

  const CPB = global.CPB = global.CPB || {};

  CPB.state = CPB.state || {
    projects: [],
    currentProject: null,
    history: [],
    historyIndex: -1,
    selectedSectionUid: null,
    pickerSelectedStyle: null,
    pageSettingsSelectedStyle: null,
    renameTargetId: null,
    renameMode: 'rename'
  };

  CPB.const = CPB.const || {
    STORAGE_KEY: 'cpb_projects_v1',
    STORAGE_LAST_PROJ: 'cpb_last_project_id',
    HISTORY_MAX: 50,
    CPB_STORE_OPTIONS: ['EU', 'KR', 'Global']
  };

  Object.defineProperty(global, 'STORAGE_KEY', {
    get() {
      return CPB.const.STORAGE_KEY;
    },
    configurable: true
  });

  Object.defineProperty(global, 'STORAGE_LAST_PROJ', {
    get() {
      return CPB.const.STORAGE_LAST_PROJ;
    },
    configurable: true
  });

  Object.defineProperty(global, 'HISTORY_MAX', {
    get() {
      return CPB.const.HISTORY_MAX;
    },
    configurable: true
  });

  Object.defineProperty(global, 'CPB_STORE_OPTIONS', {
    get() {
      return CPB.const.CPB_STORE_OPTIONS;
    },
    configurable: true
  });

  function normalizeStoreValue(raw) {
    const value = String(raw || '').trim();
    return CPB.const.CPB_STORE_OPTIONS.includes(value) ? value : 'EU';
  }

  function getCurrentStore() {
    return normalizeStoreValue(CPB.state.currentProject?.store);
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function escapeAttr(s) {
    return String(s == null ? '' : s).replace(/"/g, '&quot;');
  }

  global.normalizeStoreValue = normalizeStoreValue;
  global.getCurrentStore = getCurrentStore;
  global.escapeHtml = escapeHtml;
  global.escapeAttr = escapeAttr;
})(window);