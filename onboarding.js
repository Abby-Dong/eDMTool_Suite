// ══════════════════════════════════════
// Onboarding Tour — Interactive Guide
// ══════════════════════════════════════

var Onboarding = (function() {
  'use strict';

  var STORAGE_KEY = 'edm_onboarding_complete';
  var currentStep = -1;
  var isRunning = false;

  // ─── Internal tour language (separate from app language) ───
  var tourLang = null;

  // ─── i18n Strings ───
  var TOUR_I18N = {
    en: {
      'tour.welcome': 'Welcome to eDM Tool Suite!',
      'tour.welcomeDesc': 'Simplify your MCE workflow — build professional eDMs in minutes with drag-and-drop, then copy straight to Free Form.',
      'tour.welcomeSubtitle': 'No coding required. Outlook-ready HTML.',
      'tour.step1': 'Create Project',
      'tour.step2': 'Drag Components',
      'tour.step3': 'Arrange & Edit',
      'tour.step4': 'Brand Colors',
      'tour.step5': 'Export HTML',
      'tour.time': 'Takes about 3 minutes',
      'tour.skip': 'Skip Tour',
      'tour.start': 'Start Tour',
      'tour.next': 'Next',
      'tour.prev': 'Back',
      'tour.finish': 'Got it!',
      'tour.complete': "You're all set!",
      'tour.completeDesc': "You've learned the basics. Start creating your first eDM now!",
      'tour.startBuilding': 'Start Building',
      'tour.learnSurvey': 'Learn about Survey Forms',
      // Step content
      'tour.createTitle': 'Create Your First Project',
      'tour.createDesc': 'Click here to create a new eDM project. Give it a name and select your target region.',
      'tour.layoutTitle': 'Meet the Builder',
      'tour.layoutDesc': 'The builder has 3 main areas: Components (left), Canvas (center), and Settings (right).',
      'tour.dragTitle': 'Try It: Drag & Drop',
      'tour.dragDesc': 'Drag "Image | Text Split" onto the canvas to add it to your eDM.',
      'tour.dragTip': 'Go ahead — drag it now to continue!',
      'tour.dragWait': 'Waiting for you to drop the component...',
      'tour.editTitle': 'Edit Content',
      'tour.editDesc': 'Click any text to edit. You can change images, update links, and format text (bold, italic, etc.).',
      'tour.editTip': 'Double-click images to replace them!',
      'tour.reorderTitle': 'Component Toolbar',
      'tour.reorderDesc': 'Each component has a toolbar: Move Up, Move Down, Delete, and Duplicate. Watch the demo!',
      'tour.reorderTip': 'Hover over icons to see their function!',
      'tour.toggleTitle': 'Toggle Optional Elements',
      'tour.toggleDesc': 'Components have optional elements. Watch as we toggle them on and off!',
      'tour.toggleTip': 'Gray = hidden, Colored = visible',
      'tour.colorTitle': 'Brand Colors',
      'tour.colorDesc': 'Your brand colors are here. Watch as we switch themes!',
      'tour.colorTip': 'Blue and Orange themes available!',
      'tour.exportTitle': 'Copy HTML to MCE',
      'tour.exportDesc': 'When done, click "Copy Full HTML" to copy the email code. Then paste it into MCE\'s Free Form content block.',
      'tour.exportTip': 'The HTML is optimized for all email clients including Outlook!',
      'tour.helpBtn': 'Need help? Click to restart the tour'
    },
    'zh-TW': {
      'tour.welcome': '歡迎使用 eDM Tool Suite！',
      'tour.welcomeDesc': '簡化您的 MCE 流程 — 用拖拉方式快速製作專業 eDM，完成後直接複製到 Free Form。',
      'tour.welcomeSubtitle': '無需寫程式，Outlook 相容 HTML。',
      'tour.step1': '建立專案',
      'tour.step2': '拖拉元件',
      'tour.step3': '調整與編輯',
      'tour.step4': '品牌色彩',
      'tour.step5': '匯出 HTML',
      'tour.time': '約需 3 分鐘',
      'tour.skip': '跳過教學',
      'tour.start': '開始教學',
      'tour.next': '下一步',
      'tour.prev': '上一步',
      'tour.finish': '了解！',
      'tour.complete': '大功告成！',
      'tour.completeDesc': '您已學會基本操作，現在就開始製作您的第一封 eDM 吧！',
      'tour.startBuilding': '開始製作',
      'tour.learnSurvey': '了解 Survey 表單設定',
      'tour.createTitle': '建立您的第一個專案',
      'tour.createDesc': '點擊這裡建立新的 eDM 專案。輸入名稱並選擇目標地區。',
      'tour.layoutTitle': '認識編輯器',
      'tour.layoutDesc': '編輯器分為三個區域：元件庫（左）、畫布（中）、設定面板（右）。',
      'tour.dragTitle': '試試看：拖拉元件',
      'tour.dragDesc': '將「Image | Text Split」拖拉到畫布上，加入您的 eDM。',
      'tour.dragTip': '現在就試試 — 拖它來繼續！',
      'tour.dragWait': '等待您拖放元件中...',
      'tour.editTitle': '編輯內容',
      'tour.editDesc': '點擊任何文字即可編輯。您可以更換圖片、修改連結、設定文字格式（粗體、斜體等）。',
      'tour.editTip': '雙擊圖片可以更換圖片！',
      'tour.reorderTitle': '元件工具列',
      'tour.reorderDesc': '每個元件都有工具列：上移、下移、刪除、複製。看示範！',
      'tour.reorderTip': '滑鼠移到圖示上可查看功能說明！',
      'tour.toggleTitle': '開關可選元素',
      'tour.toggleDesc': '元件有可選元素。看我們示範開關它們！',
      'tour.toggleTip': '灰色 = 隱藏，彩色 = 顯示',
      'tour.colorTitle': '品牌色彩',
      'tour.colorDesc': '您的品牌色彩在此。看我們切換主題！',
      'tour.colorTip': '提供藍色和橘色主題！',
      'tour.exportTitle': '複製 HTML 到 MCE',
      'tour.exportDesc': '完成後點擊「Copy Full HTML」複製郵件程式碼，然後貼到 MCE 的 Free Form 內容區塊。',
      'tour.exportTip': 'HTML 已針對所有郵件客戶端優化，包括 Outlook！',
      'tour.helpBtn': '需要幫助？點擊重新觀看教學'
    },
    ko: {
      'tour.welcome': 'eDM Tool Suite에 오신 것을 환영합니다!',
      'tour.welcomeDesc': 'MCE 워크플로우를 간소화하세요 — 드래그 앤 드롭으로 전문적인 eDM을 만들고 Free Form에 바로 복사하세요.',
      'tour.welcomeSubtitle': '코딩 불필요. Outlook 호환 HTML.',
      'tour.step1': '프로젝트 생성',
      'tour.step2': '구성 요소 드래그',
      'tour.step3': '정렬 및 편집',
      'tour.step4': '브랜드 색상',
      'tour.step5': 'HTML 내보내기',
      'tour.time': '약 3분 소요',
      'tour.skip': '건너뛰기',
      'tour.start': '시작하기',
      'tour.next': '다음',
      'tour.prev': '이전',
      'tour.finish': '완료!',
      'tour.complete': '모든 준비가 완료되었습니다!',
      'tour.completeDesc': '기본 사항을 배웠습니다. 지금 첫 번째 eDM을 만들어 보세요!',
      'tour.startBuilding': '만들기 시작',
      'tour.learnSurvey': 'Survey 양식 설정 알아보기',
      'tour.createTitle': '첫 번째 프로젝트 만들기',
      'tour.createDesc': '여기를 클릭하여 새 eDM 프로젝트를 만드세요.',
      'tour.layoutTitle': '빌더 소개',
      'tour.layoutDesc': '빌더는 3개의 주요 영역으로 구성됩니다: 구성 요소(왼쪽), 캔버스(중앙), 설정(오른쪽).',
      'tour.dragTitle': '시도해 보세요: 드래그 앤 드롭',
      'tour.dragDesc': '"Image | Text Split"를 캔버스에 드래그하여 eDM에 추가하세요.',
      'tour.dragTip': '지금 바로 드래그하여 계속하세요!',
      'tour.dragWait': '구성 요소를 드롭하기를 기다리는 중...',
      'tour.editTitle': '콘텐츠 편집',
      'tour.editDesc': '텍스트를 클릭하여 편집하세요. 이미지 변경, 링크 수정, 텍스트 서식(굵게, 기울임 등)을 설정할 수 있습니다.',
      'tour.editTip': '이미지를 더블 클릭하여 교체하세요!',
      'tour.reorderTitle': '구성 요소 도구 모음',
      'tour.reorderDesc': '각 구성 요소에는 도구 모음이 있습니다: 위로 이동, 아래로 이동, 삭제, 복제. 데모를 보세요!',
      'tour.reorderTip': '아이콘 위에 마우스를 올려 기능을 확인하세요!',
      'tour.toggleTitle': '선택적 요소 전환',
      'tour.toggleDesc': '구성 요소에는 선택적 요소가 있습니다. 토글하는 것을 보세요!',
      'tour.toggleTip': '회색 = 숨김, 컬러 = 표시',
      'tour.colorTitle': '브랜드 색상',
      'tour.colorDesc': '브랜드 색상이 여기에 있습니다. 테마 전환을 보세요!',
      'tour.colorTip': '블루와 오렌지 테마 사용 가능!',
      'tour.exportTitle': 'MCE로 HTML 복사',
      'tour.exportDesc': '완료되면 "Copy Full HTML"을 클릭하여 코드를 복사하고 MCE의 Free Form 블록에 붙여넣으세요.',
      'tour.exportTip': 'HTML은 Outlook을 포함한 모든 이메일 클라이언트에 최적화되어 있습니다!',
      'tour.helpBtn': '도움이 필요하세요? 클릭하여 투어를 다시 시작하세요'
    }
  };

  // ─── Tour Steps Definition ───
  var STEPS = [
    {
      id: 'welcome',
      type: 'modal'
    },
    {
      id: 'create',
      type: 'highlight',
      target: '.proj-gallery-card-new',
      icon: 'add_circle',
      titleKey: 'tour.createTitle',
      descKey: 'tour.createDesc',
      placement: 'right',
      fallbackTarget: '#createNewCard'
    },
    {
      id: 'layout',
      type: 'info',
      icon: 'dashboard',
      titleKey: 'tour.layoutTitle',
      descKey: 'tour.layoutDesc',
      placement: 'center'
    },
    {
      id: 'drag',
      type: 'interactive', // Allow interaction - no overlay blocking
      target: '.builder-left .bci-item[data-id="image-text-split"]',
      icon: 'drag_indicator',
      titleKey: 'tour.dragTitle',
      descKey: 'tour.dragDesc',
      placement: 'right',
      waitForAction: 'drop', // Wait for user to drop a component
      fallbackTarget: '.builder-left'
    },
    {
      id: 'edit',
      type: 'highlight',
      target: '#builderCanvas',
      icon: 'edit',
      titleKey: 'tour.editTitle',
      descKey: 'tour.editDesc',
      placement: 'left',
      autoDemo: 'edit'
    },
    {
      id: 'reorder',
      type: 'highlight',
      target: '.bsi-toolbar',
      icon: 'tune',
      titleKey: 'tour.reorderTitle',
      descKey: 'tour.reorderDesc',
      placement: 'left',
      fallbackTarget: '.builder-stack-item .bsi-toolbar',
      autoDemo: 'reorder'
    },
    {
      id: 'toggle',
      type: 'highlight',
      target: '.builder-right .sidebar-toggle-ctrl',
      icon: 'toggle_on',
      titleKey: 'tour.toggleTitle',
      descKey: 'tour.toggleDesc',
      placement: 'left',
      fallbackTarget: '.builder-right .toggle-switch',
      autoDemo: 'toggle'
    },
    {
      id: 'color',
      type: 'highlight',
      target: '.builder-right .sidebar-color-ctrl',
      icon: 'palette',
      titleKey: 'tour.colorTitle',
      descKey: 'tour.colorDesc',
      placement: 'left',
      fallbackTarget: '.builder-right .ctrl-swatch',
      autoDemo: 'color'
    },
    {
      id: 'export',
      type: 'highlight',
      target: '#copyFullHtmlBtn',
      icon: 'content_copy',
      titleKey: 'tour.exportTitle',
      descKey: 'tour.exportDesc',
      placement: 'left',
      fallbackTarget: '.builder-copy-btn',
      autoDemo: 'export'
    },
    {
      id: 'complete',
      type: 'modal'
    }
  ];

  // ─── State for waiting actions ───
  var dropListener = null;
  var initialComponentCount = 0;

  // ─── DOM Elements ───
  var overlay = null;
  var spotlight = null;
  var tooltip = null;
  var welcomeModal = null;
  var helpBtn = null;

  // ─── Helper: Get localized string ───
  function tt(key) {
    // Use tour's internal lang, fallback to app lang, then 'en'
    var lang = tourLang || (typeof currentLang !== 'undefined' ? currentLang : 'en');
    var strings = TOUR_I18N[lang] || TOUR_I18N['en'];
    return strings[key] || TOUR_I18N['en'][key] || key;
  }

  // ─── Get current tour language ───
  function getTourLang() {
    return tourLang || (typeof currentLang !== 'undefined' ? currentLang : 'en');
  }

  // ─── Create DOM Structure ───
  function createElements() {
    // Overlay
    overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.innerHTML = '<div class="tour-spotlight"></div>';
    document.body.appendChild(overlay);
    spotlight = overlay.querySelector('.tour-spotlight');

    // Tooltip
    tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip';
    tooltip.innerHTML = '<div class="tour-tooltip-arrow"></div><div class="tour-tooltip-inner"></div>';
    document.body.appendChild(tooltip);

    // Welcome Modal
    welcomeModal = document.createElement('div');
    welcomeModal.className = 'tour-welcome-modal';
    welcomeModal.id = 'tourWelcomeModal';
    document.body.appendChild(welcomeModal);

    // Help Button (only visible in Gallery)
    helpBtn = document.createElement('button');
    helpBtn.className = 'tour-help-btn';
    helpBtn.innerHTML = '<span class="mi">help</span>';
    helpBtn.title = tt('tour.helpBtn');
    helpBtn.onclick = function() { restart(); };
    document.body.appendChild(helpBtn);

    // Update help button visibility when view changes
    updateHelpBtnVisibility();
  }

  // ─── Check if in Gallery view ───
  function isInGallery() {
    var galleryView = document.getElementById('galleryView');
    return galleryView && !galleryView.classList.contains('hidden');
  }

  // ─── Update help button visibility ───
  function updateHelpBtnVisibility() {
    if (!helpBtn) return;
    if (isComplete() && isInGallery()) {
      helpBtn.classList.add('visible');
    } else {
      helpBtn.classList.remove('visible');
    }
  }

  // ─── Show Welcome Modal ───
  function showWelcome() {
    var lang = getTourLang();
    
    welcomeModal.innerHTML = 
      '<div class="tour-welcome-content">' +
        '<div class="tour-lang-switcher">' +
          '<button class="tour-lang-btn' + (lang === 'en' ? ' active' : '') + '" onclick="Onboarding.setLang(\'en\')">EN</button>' +
          '<button class="tour-lang-btn' + (lang === 'zh-TW' ? ' active' : '') + '" onclick="Onboarding.setLang(\'zh-TW\')">繁中</button>' +
          '<button class="tour-lang-btn' + (lang === 'ko' ? ' active' : '') + '" onclick="Onboarding.setLang(\'ko\')">한국어</button>' +
        '</div>' +
        '<div class="tour-welcome-emoji">🎉</div>' +
        '<h2 class="tour-welcome-title">' + tt('tour.welcome') + '</h2>' +
        '<p class="tour-welcome-desc">' + tt('tour.welcomeDesc') + '</p>' +
        '<p class="tour-welcome-subtitle">' + tt('tour.welcomeSubtitle') + '</p>' +
        '<div class="tour-welcome-actions">' +
          '<button class="tour-welcome-skip" onclick="Onboarding.skip()">' + tt('tour.skip') + '</button>' +
          '<button class="tour-welcome-start" onclick="Onboarding.next()"><span class="mi">play_arrow</span>' + tt('tour.start') + '</button>' +
        '</div>' +
      '</div>';
    welcomeModal.classList.add('visible');
  }

  // ─── Set Language and refresh welcome modal ───
  function setLang(lang) {
    tourLang = lang;
    // Re-render welcome modal with new language
    showWelcome();
  }

  // ─── Show Completion Modal ───
  function showComplete() {
    welcomeModal.innerHTML = 
      '<div class="tour-complete-content">' +
        '<div class="tour-complete-emoji">🎊</div>' +
        '<h2 class="tour-complete-title">' + tt('tour.complete') + '</h2>' +
        '<p class="tour-complete-desc">' + tt('tour.completeDesc') + '</p>' +
        '<div class="tour-complete-actions">' +
          '<button class="tour-complete-btn" onclick="Onboarding.finish()">' + tt('tour.startBuilding') + '</button>' +
        '</div>' +
      '</div>';
    welcomeModal.classList.add('visible');
  }

  // ─── Hide Welcome/Complete Modal ───
  function hideModal() {
    welcomeModal.classList.remove('visible');
  }

  // ─── Position Tooltip ───
  function positionTooltip(targetEl, placement) {
    var arrow = tooltip.querySelector('.tour-tooltip-arrow');
    
    if (!targetEl) {
      // Center in viewport
      tooltip.style.left = '50%';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
      tooltip.setAttribute('data-placement', 'center');
      // Show arrow at bottom center for dialog style
      if (arrow) {
        arrow.style.display = 'block';
        arrow.style.top = '';
        arrow.style.left = '50%';
      }
      return;
    }

    if (arrow) arrow.style.display = 'block';
    
    var rect = targetEl.getBoundingClientRect();
    var tipRect = tooltip.getBoundingClientRect();
    var gap = 16;

    tooltip.style.transform = '';
    tooltip.setAttribute('data-placement', placement);

    // Calculate target center
    var targetCenterX = rect.left + rect.width / 2;
    var targetCenterY = rect.top + rect.height / 2;

    switch (placement) {
      case 'right':
        tooltip.style.left = (rect.right + gap) + 'px';
        tooltip.style.top = (rect.top + rect.height / 2 - tipRect.height / 2) + 'px';
        break;
      case 'left':
        tooltip.style.left = (rect.left - tipRect.width - gap) + 'px';
        tooltip.style.top = (rect.top + rect.height / 2 - tipRect.height / 2) + 'px';
        break;
      case 'bottom':
        tooltip.style.left = (rect.left + rect.width / 2 - tipRect.width / 2) + 'px';
        tooltip.style.top = (rect.bottom + gap) + 'px';
        break;
      case 'top':
        tooltip.style.left = (rect.left + rect.width / 2 - tipRect.width / 2) + 'px';
        tooltip.style.top = (rect.top - tipRect.height - gap) + 'px';
        break;
      default: // center
        tooltip.style.left = '50%';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
    }

    // Keep tooltip in viewport
    var tipNewRect = tooltip.getBoundingClientRect();
    if (tipNewRect.left < 10) tooltip.style.left = '10px';
    if (tipNewRect.right > window.innerWidth - 10) tooltip.style.left = (window.innerWidth - tipRect.width - 10) + 'px';
    if (tipNewRect.top < 10) tooltip.style.top = '10px';
    if (tipNewRect.bottom > window.innerHeight - 10) tooltip.style.top = (window.innerHeight - tipRect.height - 10) + 'px';

    // Update arrow position to point at target center
    if (arrow) {
      var finalTipRect = tooltip.getBoundingClientRect();
      // Reset all positioning
      arrow.style.marginLeft = '';
      arrow.style.marginTop = '';
      arrow.style.left = '';
      arrow.style.top = '';
      arrow.style.right = '';
      arrow.style.bottom = '';
      
      if (placement === 'left') {
        // Tooltip on left, arrow on right side pointing right
        arrow.style.right = '-7px';
        var arrowY = targetCenterY - finalTipRect.top - 7;
        arrowY = Math.max(20, Math.min(arrowY, finalTipRect.height - 34));
        arrow.style.top = arrowY + 'px';
      } else if (placement === 'right') {
        // Tooltip on right, arrow on left side pointing left
        arrow.style.left = '-7px';
        var arrowY = targetCenterY - finalTipRect.top - 7;
        arrowY = Math.max(20, Math.min(arrowY, finalTipRect.height - 34));
        arrow.style.top = arrowY + 'px';
      } else if (placement === 'top') {
        // Tooltip on top, arrow on bottom pointing down
        arrow.style.bottom = '-7px';
        var arrowX = targetCenterX - finalTipRect.left - 7;
        arrowX = Math.max(20, Math.min(arrowX, finalTipRect.width - 34));
        arrow.style.left = arrowX + 'px';
      } else if (placement === 'bottom') {
        // Tooltip on bottom, arrow on top pointing up
        arrow.style.top = '-7px';
        var arrowX = targetCenterX - finalTipRect.left - 7;
        arrowX = Math.max(20, Math.min(arrowX, finalTipRect.width - 34));
        arrow.style.left = arrowX + 'px';
      }
    }
  }

  // ─── Position Spotlight ───
  function positionSpotlight(targetEl) {
    if (!targetEl) {
      spotlight.style.display = 'none';
      return;
    }
    var rect = targetEl.getBoundingClientRect();
    var pad = 8;
    spotlight.style.display = 'block';
    spotlight.style.left = (rect.left - pad) + 'px';
    spotlight.style.top = (rect.top - pad) + 'px';
    spotlight.style.width = (rect.width + pad * 2) + 'px';
    spotlight.style.height = (rect.height + pad * 2) + 'px';
    spotlight.classList.add('pulse');
  }

  // ─── Render Progress Dots ───
  function renderProgress() {
    var totalSteps = STEPS.length - 2; // Exclude welcome & complete modals
    var html = '';
    for (var i = 0; i < totalSteps; i++) {
      var cls = 'tour-progress-dot';
      if (i < currentStep - 1) cls += ' done';
      else if (i === currentStep - 1) cls += ' active';
      html += '<div class="' + cls + '"></div>';
    }
    return '<div class="tour-progress">' + html + '</div>';
  }

  // ─── Show Step ───
  function showStep(idx) {
    currentStep = idx;
    var step = STEPS[idx];

    if (!step) {
      finish();
      return;
    }

    // Welcome modal
    if (step.id === 'welcome') {
      hideTooltip();
      overlay.classList.remove('visible');
      showWelcome();
      return;
    }

    // Complete modal
    if (step.id === 'complete') {
      hideTooltip();
      overlay.classList.remove('visible');
      showComplete();
      return;
    }

    hideModal();

    // Find target element
    var targetEl = null;
    if (step.target) {
      targetEl = document.querySelector(step.target);
      if (!targetEl && step.fallbackTarget) {
        targetEl = document.querySelector(step.fallbackTarget);
      }
    }
    
    // For reorder step, spotlight the whole toolbar, not just one button
    var spotlightEl = targetEl;
    if (step.id === 'reorder' && targetEl) {
      // Find the parent toolbar for spotlight - it's already the toolbar
      var toolbar = targetEl.closest('.bsi-toolbar') || targetEl;
      spotlightEl = toolbar;
      // Make sure the first stack item is selected to show toolbar
      var canvasItem = document.querySelector('#builderCanvas .builder-stack-item');
      if (canvasItem) {
        canvasItem.classList.add('selected');
      }
    }

    // Show overlay & spotlight (but not for interactive steps)
    if (step.type === 'interactive') {
      // For drag step - show spotlight on the component to drag, but allow interaction
      overlay.classList.add('visible');
      overlay.style.pointerEvents = 'none'; // Allow clicks through
      tooltip.classList.add('interactive-mode');
      if (spotlightEl) {
        positionSpotlight(spotlightEl);
        // Make spotlight allow pointer events through
        spotlight.style.pointerEvents = 'none';
      }
    } else {
      overlay.classList.add('visible');
      overlay.style.pointerEvents = 'auto';
      tooltip.classList.remove('interactive-mode');
      spotlight.style.pointerEvents = 'none';
      if (step.type === 'highlight' && spotlightEl) {
        positionSpotlight(spotlightEl);
      } else {
        spotlight.style.display = 'none';
      }
    }

    // Build tooltip content
    var tipHtml = step.tipKey ? '<div class="tour-tooltip-tip"><span class="mi">lightbulb</span>' + tt(step.tipKey) + '</div>' : '';
    var isLast = idx === STEPS.length - 2;
    var isFirst = idx === 1;
    var waitingForDrop = step.waitForAction === 'drop';

    var actionsHtml;
    if (waitingForDrop) {
      // Show waiting indicator instead of next button
      actionsHtml = 
        '<div class="tour-tooltip-actions">' +
          '<button class="tour-btn tour-btn-skip" onclick="Onboarding.skip()">' + tt('tour.skip') + '</button>' +
          '<div class="tour-waiting-indicator"><span class="mi rotating">sync</span>' + tt('tour.dragWait') + '</div>' +
        '</div>';
    } else {
      actionsHtml = 
        '<div class="tour-tooltip-actions">' +
          (isFirst ? '<button class="tour-btn tour-btn-skip" onclick="Onboarding.skip()">' + tt('tour.skip') + '</button>' : '<button class="tour-btn tour-btn-prev" onclick="Onboarding.prev()">' + tt('tour.prev') + '</button>') +
          '<button class="tour-btn tour-btn-next" onclick="Onboarding.next()">' + (isLast ? tt('tour.finish') : tt('tour.next')) + (isLast ? '' : '<span class="mi">arrow_forward</span>') + '</button>' +
        '</div>';
    }

    tooltip.querySelector('.tour-tooltip-inner').innerHTML = 
      '<div class="tour-tooltip-icon"><span class="mi">' + (step.icon || 'info') + '</span></div>' +
      '<h4 class="tour-tooltip-title">' + tt(step.titleKey) + '</h4>' +
      '<p class="tour-tooltip-desc">' + tt(step.descKey) + '</p>' +
      tipHtml +
      renderProgress() +
      actionsHtml;

    // Position tooltip
    positionTooltip(targetEl, step.placement || 'bottom');
    tooltip.classList.add('visible');

    // Set up listeners for interactive actions
    if (waitingForDrop) {
      setupDropListener();
    }
    
    // Run auto-demo if specified
    if (step.autoDemo) {
      runAutoDemo(step.autoDemo);
    }
  }

  // ─── Auto Demo Runner ───
  function runAutoDemo(demoType) {
    // Delay to let the spotlight/tooltip settle
    setTimeout(function() {
      console.log('[Onboarding] Running auto demo:', demoType);
      switch (demoType) {
        case 'edit':
          runEditDemo();
          break;
        case 'reorder':
          runReorderDemo();
          break;
        case 'toggle':
          runToggleDemo();
          break;
        case 'color':
          runColorDemo();
          break;
        case 'export':
          runExportDemo();
          break;
      }
    }, 800);
  }

  // ─── Edit Demo: 3 sub-steps - Text (2s), Link (2s), Image (6s) ───
  function runEditDemo() {
    console.log('[Onboarding] Edit Demo starting...');
    
    // Step 1: Text editing (2 seconds)
    runEditDemo_Text(function() {
      // Step 2: Link editing (2 seconds)
      runEditDemo_Link(function() {
        // Step 3: Image replacement (6 seconds)
        runEditDemo_Image();
      });
    });
  }
  
  // ─── Edit Demo Step 1: Text - Select, Bold, Deselect (2s) ───
  function runEditDemo_Text(callback) {
    console.log('[Onboarding] Edit Demo: Text step');
    var editableEl = document.querySelector('#builderCanvas .builder-canvas-item [contenteditable="true"]');
    if (!editableEl) {
      editableEl = document.querySelector('#builderCanvas [contenteditable="true"]');
    }
    
    if (editableEl) {
      editableEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      editableEl.classList.add('tour-edit-highlight');
      
      setTimeout(function() {
        // Focus and click
        editableEl.focus();
        editableEl.click();
        
        // Select some text
        var range = document.createRange();
        var text = editableEl.firstChild || editableEl;
        if (text.nodeType === Node.TEXT_NODE && text.textContent.length > 0) {
          var endPos = Math.min(8, text.textContent.length);
          range.setStart(text, 0);
          range.setEnd(text, endPos);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        
        // After 600ms, click Bold button
        setTimeout(function() {
          var boldBtn = document.querySelector('.ql-bold, [data-cmd="bold"], button[title*="Bold"]');
          if (boldBtn) {
            boldBtn.classList.add('tour-btn-demo');
            setTimeout(function() {
              boldBtn.click();
              boldBtn.classList.remove('tour-btn-demo');
            }, 300);
          }
          
          // After another 600ms, deselect and close toolbar
          setTimeout(function() {
            window.getSelection().removeAllRanges();
            editableEl.classList.remove('tour-edit-highlight');
            editableEl.blur();
            
            // Click elsewhere to close text toolbar
            var canvas = document.querySelector('#builderCanvas');
            if (canvas) {
              canvas.click();
            }
            
            // Also try to close any floating toolbar
            var textToolbar = document.querySelector('.ql-toolbar, .text-toolbar, .editor-toolbar');
            if (textToolbar && textToolbar.style) {
              textToolbar.style.display = 'none';
            }
            
            // Callback to next step
            setTimeout(callback, 400);
          }, 600);
        }, 600);
      }, 300);
    } else {
      setTimeout(callback, 500);
    }
  }
  
  // ─── Edit Demo Step 2: Link - Double-click CTA to open Edit Link (2s) ───
  function runEditDemo_Link(callback) {
    console.log('[Onboarding] Edit Demo: Link step');
    // Find a CTA button/link in the canvas
    var ctaEl = document.querySelector('#builderCanvas a[href], #builderCanvas .cta-btn, #builderCanvas [data-link]');
    if (!ctaEl) {
      ctaEl = document.querySelector('#builderCanvas td a, #builderCanvas .builder-canvas-item a');
    }
    
    if (ctaEl) {
      ctaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      ctaEl.classList.add('tour-edit-highlight');
      
      setTimeout(function() {
        // Double-click to open link editor
        var dblClickEvent = new MouseEvent('dblclick', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        ctaEl.dispatchEvent(dblClickEvent);
        
        // Keep highlighted for 1.2s, then close
        setTimeout(function() {
          ctaEl.classList.remove('tour-edit-highlight');
          
          // Close link editor modal/popup
          var closeBtns = document.querySelectorAll('.link-editor-close, .modal-close, [data-dismiss="modal"], .swal2-close, .popup-close, .close-btn');
          closeBtns.forEach(function(btn) { btn.click(); });
          
          // Press Escape to close any modal
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
          
          // Click cancel button if exists
          var cancelBtn = document.querySelector('.btn-cancel, [data-action="cancel"], .cancel-btn');
          if (cancelBtn) cancelBtn.click();
          
          // Click outside to close
          var overlay = document.querySelector('.modal-overlay, .popup-overlay, .swal2-container');
          if (overlay) overlay.click();
          
          setTimeout(callback, 400);
        }, 1200);
      }, 300);
    } else {
      setTimeout(callback, 500);
    }
  }
  
  // ─── Edit Demo Step 3: Image - Just swap the image (6s) ───
  function runEditDemo_Image() {
    console.log('[Onboarding] Edit Demo: Image step');
    var demoImageUrl = 'https://irp.cdn-website.com/56869327/dms3rep/multi/截圖+2026-03-05+上午11.21.23.png';
    
    // Find an image in the canvas
    var imgEl = document.querySelector('#builderCanvas .builder-canvas-item img');
    if (!imgEl) {
      imgEl = document.querySelector('#builderCanvas img');
    }
    
    if (imgEl) {
      imgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      imgEl.classList.add('tour-edit-highlight');
      
      // Store original src for restoration
      var originalSrc = imgEl.src;
      
      // After a moment, swap the image
      setTimeout(function() {
        // Change the image source with a nice transition
        imgEl.style.transition = 'opacity 0.3s ease';
        imgEl.style.opacity = '0.5';
        
        setTimeout(function() {
          imgEl.src = demoImageUrl;
          imgEl.style.opacity = '1';
          
          // Keep the new image visible for 3 seconds
          setTimeout(function() {
            // Fade and restore original
            imgEl.style.opacity = '0.5';
            
            setTimeout(function() {
              imgEl.src = originalSrc;
              imgEl.style.opacity = '1';
              
              // Cleanup
              setTimeout(function() {
                imgEl.style.transition = '';
                imgEl.classList.remove('tour-edit-highlight');
                console.log('[Onboarding] Edit Demo complete');
              }, 300);
            }, 300);
          }, 3000);
        }, 300);
      }, 500);
    } else {
      console.log('[Onboarding] Edit Demo: No image found');
    }
  }

  // ─── Reorder Demo: Highlight all 4 toolbar buttons ───
  function runReorderDemo() {
    // First, make sure the first canvas item is selected/hovered to show toolbar
    var canvasItem = document.querySelector('#builderCanvas .builder-stack-item');
    if (canvasItem) {
      canvasItem.classList.add('selected');
    }
    
    // Find the toolbar (.bsi-toolbar)
    var toolbar = document.querySelector('.bsi-toolbar');
    if (!toolbar && canvasItem) {
      toolbar = canvasItem.querySelector('.bsi-toolbar');
    }
    
    if (toolbar) {
      // Force toolbar to be visible
      toolbar.style.display = 'flex';
      
      // Highlight the entire toolbar
      toolbar.classList.add('tour-edit-highlight');
      
      // Highlight all 4 buttons at once
      var btns = toolbar.querySelectorAll('button');
      btns.forEach(function(btn) {
        btn.classList.add('tour-btn-demo');
      });
      
      // Keep highlighted for 3 seconds then remove
      setTimeout(function() {
        toolbar.classList.remove('tour-edit-highlight');
        btns.forEach(function(btn) {
          btn.classList.remove('tour-btn-demo');
        });
      }, 3000);
    }
  }

  // ─── Toggle Demo: Auto-click a toggle switch ───
  function runToggleDemo() {
    // Find a toggle in the right panel (.sidebar-toggle-ctrl contains .toggle-switch)
    var toggleCtrl = document.querySelector('.builder-right .sidebar-toggle-ctrl');
    if (!toggleCtrl) {
      toggleCtrl = document.querySelector('#builderRight .sidebar-toggle-ctrl');
    }
    
    if (toggleCtrl) {
      // Highlight the toggle control row
      toggleCtrl.classList.add('tour-edit-highlight');
      
      // Find the actual toggle switch inside
      var toggleSwitch = toggleCtrl.querySelector('.toggle-switch');
      var checkbox = toggleCtrl.querySelector('input[type="checkbox"]');
      
      if (toggleSwitch) {
        toggleSwitch.classList.add('tour-btn-demo');
      }
      
      setTimeout(function() {
        // Click the checkbox/toggle
        if (checkbox) {
          checkbox.click();
        } else if (toggleSwitch) {
          toggleSwitch.click();
        }
        
        setTimeout(function() {
          // Click again to toggle back
          if (checkbox) {
            checkbox.click();
          } else if (toggleSwitch) {
            toggleSwitch.click();
          }
          
          if (toggleSwitch) {
            toggleSwitch.classList.remove('tour-btn-demo');
          }
          
          setTimeout(function() {
            toggleCtrl.classList.remove('tour-edit-highlight');
          }, 400);
        }, 800);
      }, 600);
    }
  }

  // ─── Color Demo: Auto-click theme switcher ───
  function runColorDemo() {
    // Find color control in right panel (.sidebar-color-ctrl)
    var colorCtrl = document.querySelector('.builder-right .sidebar-color-ctrl');
    if (!colorCtrl) {
      colorCtrl = document.querySelector('#builderRight .sidebar-color-ctrl');
    }
    
    // Find the color swatch
    var colorSwatch = colorCtrl ? colorCtrl.querySelector('.ctrl-swatch') : document.querySelector('.ctrl-swatch');
    
    if (colorCtrl) {
      colorCtrl.classList.add('tour-edit-highlight');
    }
    
    if (colorSwatch) {
      setTimeout(function() {
        // Highlight the swatch
        colorSwatch.classList.add('tour-btn-demo');
        
        setTimeout(function() {
          // Click to open color popup
          colorSwatch.click();
          
          setTimeout(function() {
            colorSwatch.classList.remove('tour-btn-demo');
            
            // Close the color popup
            var closeColorPopup = window.closeColorPopup;
            if (typeof closeColorPopup === 'function') {
              closeColorPopup();
            } else {
              // Try to click overlay to close
              var overlay = document.querySelector('.color-popup-overlay, #colorPopupOverlay');
              if (overlay) overlay.click();
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
            }
            
            if (colorCtrl) {
              colorCtrl.classList.remove('tour-edit-highlight');
            }
          }, 1500);
        }, 400);
      }, 600);
    } else if (colorCtrl) {
      // No swatch found, just show the control highlighted
      setTimeout(function() {
        colorCtrl.classList.remove('tour-edit-highlight');
      }, 2500);
    }
  }

  // ─── Export Demo: Highlight the Copy HTML button ───
  function runExportDemo() {
    // Find the Copy HTML button
    var copyBtn = document.querySelector('#copyFullHtmlBtn');
    if (!copyBtn) {
      copyBtn = document.querySelector('.builder-copy-btn');
    }
    if (!copyBtn) {
      copyBtn = document.querySelector('.builder-right button');
    }
    
    if (copyBtn) {
      // Highlight the button
      copyBtn.classList.add('tour-edit-highlight');
      copyBtn.classList.add('tour-btn-demo');
      
      // Keep highlighted for 3 seconds
      setTimeout(function() {
        copyBtn.classList.remove('tour-edit-highlight');
        copyBtn.classList.remove('tour-btn-demo');
      }, 3000);
    }
  }

  function setupDropListener() {
    // Record initial component count
    initialComponentCount = (typeof builderStack !== 'undefined') ? builderStack.length : 0;
    
    // Poll for new components
    if (dropListener) clearInterval(dropListener);
    dropListener = setInterval(function() {
      var currentCount = (typeof builderStack !== 'undefined') ? builderStack.length : 0;
      if (currentCount > initialComponentCount) {
        // Component was added!
        clearInterval(dropListener);
        dropListener = null;
        // Brief delay to let the render complete
        setTimeout(function() {
          showStep(currentStep + 1);
        }, 400);
      }
    }, 200);
  }

  var toggleListener = null;
  
  function setupToggleListener() {
    // Listen for clicks on toggle buttons in the right panel
    if (toggleListener) {
      document.removeEventListener('click', toggleListener);
    }
    
    toggleListener = function(e) {
      var toggle = e.target.closest('.toggle-sub-row');
      if (toggle) {
        document.removeEventListener('click', toggleListener);
        toggleListener = null;
        // Brief delay for visual feedback
        setTimeout(function() {
          showStep(currentStep + 1);
        }, 300);
      }
    };
    
    document.addEventListener('click', toggleListener);
  }

  function clearToggleListener() {
    if (toggleListener) {
      document.removeEventListener('click', toggleListener);
      toggleListener = null;
    }
  }

  function clearDropListener() {
    if (dropListener) {
      clearInterval(dropListener);
      dropListener = null;
    }
  }

  function hideTooltip() {
    tooltip.classList.remove('visible');
    spotlight.classList.remove('pulse');
  }

  // ─── Public API ───

  function init() {
    createElements();
    // Watch for view changes to toggle help button
    var galleryView = document.getElementById('galleryView');
    if (galleryView) {
      var observer = new MutationObserver(function() {
        updateHelpBtnVisibility();
      });
      observer.observe(galleryView, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    helpBtn.classList.remove('visible');
    showStep(0);
  }

  function next() {
    var step = STEPS[currentStep];
    
    // If current step is waiting for action, don't allow manual next
    if (step && step.waitForAction) {
      return;
    }
    
    // Special handling for 'create' step - enter Builder before showing next step
    if (step && step.id === 'create') {
      // Hide current tooltip/overlay temporarily
      hideTooltip();
      overlay.classList.remove('visible');
      
      // Create a demo project and enter builder (but don't add components - user will drag)
      if (typeof resetCanvasToBlank === 'function') {
        resetCanvasToBlank();
      }
      window._currentProjectSite = 'Global';
      if (typeof enterBuilder === 'function') {
        enterBuilder();
      }
      
      // Continue to next step after builder is ready
      setTimeout(function() {
        showStep(currentStep + 1);
      }, 400);
      return;
    }
    
    showStep(currentStep + 1);
  }

  function prev() {
    clearDropListener();
    clearToggleListener();
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  }

  function skip() {
    clearDropListener();
    clearToggleListener();
    markComplete();
    cleanup();
    // Navigate back to Gallery and reload
    location.reload();
  }

  function finish() {
    clearDropListener();
    clearToggleListener();
    markComplete();
    cleanup();
    // Navigate back to Gallery and reload
    location.reload();
  }

  function cleanup() {
    clearDropListener();
    clearToggleListener();
    isRunning = false;
    currentStep = -1;
    hideModal();
    hideTooltip();
    overlay.classList.remove('visible');
    updateHelpBtnVisibility();
  }

  function restart() {
    localStorage.removeItem(STORAGE_KEY);
    start();
  }

  function isComplete() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  function markComplete() {
    localStorage.setItem(STORAGE_KEY, 'true');
  }

  function shouldShowTour() {
    return !isComplete();
  }

  // ─── Auto-start for new users ───
  function autoStart() {
    if (shouldShowTour()) {
      // Small delay to let page fully render
      setTimeout(function() {
        start();
      }, 500);
    }
  }

  return {
    init: init,
    start: start,
    next: next,
    prev: prev,
    skip: skip,
    finish: finish,
    restart: restart,
    autoStart: autoStart,
    shouldShowTour: shouldShowTour,
    setLang: setLang
  };

})();

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', function() {
  Onboarding.init();
});
