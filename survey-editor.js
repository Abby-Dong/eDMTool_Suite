// ══════════════════════════════════════
// Survey Editor — External Module (4-Step Wizard)
// ══════════════════════════════════════
var _seTargetUid = null;       // which builder stack item we're editing
var _seQuestions = [];          // [{label, type, options:[], placeholder}]
var _seCurrentStep = 1;        // current wizard step (1-4)
var SE_TOUR_KEY = 'edmTool_surveyEditorToured';
var _seTourStep = 0;
var _seTourRunning = false;

/* ══════════════════════════════════════
   Step-by-Step Tutorial System
   ══════════════════════════════════════ */
var SE_TOUR_STEPS = [
  {
    target: '#seStepPill1',
    wizardStep: 1,
    icon: 'quiz',
    titleKey: 'survey.tour.step1Title',
    descKey: 'survey.tour.step1Desc',
    placement: 'bottom'
  },
  {
    target: '#seStepPill2',
    wizardStep: 2,
    icon: 'celebration',
    titleKey: 'survey.tour.step2Title',
    descKey: 'survey.tour.step2Desc',
    placement: 'bottom'
  },
  {
    target: '#seStepPill3',
    wizardStep: 3,
    icon: 'preview',
    titleKey: 'survey.tour.step3Title',
    descKey: 'survey.tour.step3Desc',
    placement: 'bottom'
  },
  {
    target: '#seStepPill4',
    wizardStep: 4,
    icon: 'cloud_upload',
    titleKey: 'survey.tour.step4Title',
    descKey: 'survey.tour.step4Desc',
    placement: 'bottom'
  }
];

var SE_TOUR_I18N = {
  en: {
    'survey.tour.step1Title': 'Step 1: Design Questions',
    'survey.tour.step1Desc': 'Add your survey questions here. You can use Radio, Checkbox, Star Rating, Dropdown, or Text input types. Max 7 questions.',
    'survey.tour.step2Title': 'Step 2: Thank You Page',
    'survey.tour.step2Desc': 'Customize the message shown after someone submits the survey.',
    'survey.tour.step3Title': 'Step 3: Preview',
    'survey.tour.step3Desc': 'Test your survey interactively before deploying.',
    'survey.tour.step4Title': 'Step 4: Export to SFMC',
    'survey.tour.step4Desc': 'Copy the CloudPage HTML, create a CloudPage in SFMC, then paste the published URL back here.',
    'survey.tour.skip': 'Skip',
    'survey.tour.next': 'Next',
    'survey.tour.done': 'Got it!'
  },
  'zh-TW': {
    'survey.tour.step1Title': '步驟 1：設計問題',
    'survey.tour.step1Desc': '在這裡新增問卷題目。可使用單選、複選、星等、下拉或文字輸入。最多 7 題。',
    'survey.tour.step2Title': '步驟 2：感謝頁面',
    'survey.tour.step2Desc': '自訂用戶提交問卷後顯示的訊息。',
    'survey.tour.step3Title': '步驟 3：預覽',
    'survey.tour.step3Desc': '在發布前先測試互動式問卷效果。',
    'survey.tour.step4Title': '步驟 4：匯出到 SFMC',
    'survey.tour.step4Desc': '複製 CloudPage HTML，在 SFMC 建立 CloudPage，然後將發布的 URL 貼回這裡。',
    'survey.tour.skip': '跳過',
    'survey.tour.next': '下一步',
    'survey.tour.done': '知道了！'
  },
  ko: {
    'survey.tour.step1Title': '1단계: 질문 디자인',
    'survey.tour.step1Desc': '여기서 설문 질문을 추가하세요. 라디오, 체크박스, 별점, 드롭다운, 텍스트 입력 유형을 사용할 수 있습니다. 최대 7개 질문.',
    'survey.tour.step2Title': '2단계: 감사 페이지',
    'survey.tour.step2Desc': '설문 제출 후 표시되는 메시지를 맞춤 설정하세요.',
    'survey.tour.step3Title': '3단계: 미리보기',
    'survey.tour.step3Desc': '배포 전에 설문을 대화형으로 테스트하세요.',
    'survey.tour.step4Title': '4단계: SFMC로 내보내기',
    'survey.tour.step4Desc': 'CloudPage HTML을 복사하고, SFMC에서 CloudPage를 만든 다음, 게시된 URL을 여기에 붙여넣으세요.',
    'survey.tour.skip': '건너뛰기',
    'survey.tour.next': '다음',
    'survey.tour.done': '알겠습니다!'
  }
};

function seTourT(key) {
  var lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
  var strings = SE_TOUR_I18N[lang] || SE_TOUR_I18N['en'];
  return strings[key] || SE_TOUR_I18N['en'][key] || key;
}

function seStartTourIfNew() {
  if (!localStorage.getItem(SE_TOUR_KEY)) {
    setTimeout(function() {
      seStartTour();
    }, 400);
  }
}

function seStartTour() {
  _seTourStep = 0;
  _seTourRunning = true;
  document.getElementById('seTourOverlay').classList.add('visible');
  seShowTourStep();
}

function seShowTourStep() {
  var step = SE_TOUR_STEPS[_seTourStep];
  if (!step) {
    seEndTour();
    return;
  }

  // Navigate to the wizard step
  seGoToStep(step.wizardStep);

  // Wait for DOM to update
  setTimeout(function() {
    var targetEl = document.querySelector(step.target);
    if (!targetEl) {
      seNextTourStep();
      return;
    }

    // Clear previous spotlight
    document.querySelectorAll('.se-tour-spotlight').forEach(function(el) {
      el.classList.remove('se-tour-spotlight');
    });

    // Apply spotlight
    targetEl.classList.add('se-tour-spotlight');

    // Position tooltip
    var tooltip = document.getElementById('seTourTooltip');
    var isLast = _seTourStep === SE_TOUR_STEPS.length - 1;

    // Build progress dots
    var progressHtml = '<div class="se-tour-progress">';
    for (var i = 0; i < SE_TOUR_STEPS.length; i++) {
      var dotClass = 'se-tour-dot';
      if (i < _seTourStep) dotClass += ' done';
      else if (i === _seTourStep) dotClass += ' active';
      progressHtml += '<div class="' + dotClass + '"></div>';
    }
    progressHtml += '</div>';

    tooltip.innerHTML = 
      '<div class="se-tour-tooltip-arrow"></div>' +
      '<div class="se-tour-tooltip-header">' +
        '<div class="se-tour-tooltip-icon"><span class="mi">' + step.icon + '</span></div>' +
        '<h4 class="se-tour-tooltip-title">' + seTourT(step.titleKey) + '</h4>' +
        '<span class="se-tour-tooltip-step">' + (_seTourStep + 1) + '/' + SE_TOUR_STEPS.length + '</span>' +
      '</div>' +
      '<p class="se-tour-tooltip-desc">' + seTourT(step.descKey) + '</p>' +
      '<div class="se-tour-tooltip-actions">' +
        '<button class="se-tour-btn-skip" onclick="seEndTour()">' + seTourT('survey.tour.skip') + '</button>' +
        '<button class="se-tour-btn-next" onclick="seNextTourStep()">' +
          (isLast ? seTourT('survey.tour.done') : seTourT('survey.tour.next')) +
          (isLast ? '' : '<span class="mi">arrow_forward</span>') +
        '</button>' +
      '</div>' +
      progressHtml;

    tooltip.setAttribute('data-placement', step.placement);
    tooltip.style.display = 'block';

    // Calculate position
    var rect = targetEl.getBoundingClientRect();
    var modalRect = document.querySelector('.survey-modal').getBoundingClientRect();
    var relTop = rect.top - modalRect.top;
    var relLeft = rect.left - modalRect.left;

    if (step.placement === 'bottom') {
      tooltip.style.top = (relTop + rect.height + 12) + 'px';
      tooltip.style.left = relLeft + 'px';
    } else if (step.placement === 'top') {
      tooltip.style.top = (relTop - tooltip.offsetHeight - 12) + 'px';
      tooltip.style.left = relLeft + 'px';
    }
  }, 150);
}

function seNextTourStep() {
  _seTourStep++;
  if (_seTourStep >= SE_TOUR_STEPS.length) {
    seEndTour();
  } else {
    seShowTourStep();
  }
}

function seEndTour() {
  _seTourRunning = false;
  localStorage.setItem(SE_TOUR_KEY, 'true');
  
  // Hide overlay and tooltip
  document.getElementById('seTourOverlay').classList.remove('visible');
  document.getElementById('seTourTooltip').style.display = 'none';
  
  // Remove spotlight
  document.querySelectorAll('.se-tour-spotlight').forEach(function(el) {
    el.classList.remove('se-tour-spotlight');
  });
  
  // Go back to step 1
  seGoToStep(1);
}

function openSurveyEditor(uid) {
  _seTargetUid = uid;
  var item = builderStack.find(function(b) { return b.uid === uid; });
  var opts = (item && item.options) || {};

  // Determine default site URL based on project site
  var siteUrlMap = {
    'Global': 'https://www.iotmart.com/en-en',
    'KR': 'https://www.iotmart.com/ko-kr',
    'EU': 'https://www.iotmart.com/en-eu'
  };
  var defaultSiteUrl = siteUrlMap[window._currentProjectSite] || 'https://www.iotmart.com/en-en';

  // Populate header fields
  document.getElementById('seEdmTitle').value = opts.edmTitle || 'Share Your Feedback';
  document.getElementById('seEyebrowText').value = opts.eyebrowText || 'Help Us Serve You Better';
  document.getElementById('seEdmDataName').value = opts.edmDataName || '';
  document.getElementById('seCloudPageUrl').value = opts.cloudPageUrl || '';
  document.getElementById('seSubmitText').value = opts.submitText || 'Submit';
  document.getElementById('seThanksTitle').value = opts.thanksTitle || 'Thank you!';
  document.getElementById('seThanksMsg').value = opts.thanksMsg || 'Your response has been recorded. We appreciate your time!';
  document.getElementById('seThanksCtaSite').value = opts.thanksCtaSite || defaultSiteUrl;

  // Populate questions from opts
  _seQuestions = [];
  var qCount = parseInt(opts.questionCount) || 0;
  for (var i = 1; i <= qCount; i++) {
    _seQuestions.push({
      label: opts['q' + i + 'Label'] || '',
      type: opts['q' + i + 'Type'] || 'radio',
      options: (opts['q' + i + 'Options'] || '').split('|||').map(function(s) { return s.trim(); }).filter(Boolean),
      placeholder: opts['q' + i + 'Placeholder'] || ''
    });
  }
  if (_seQuestions.length === 0) {
    _seQuestions.push({ label: '', type: 'radio', options: [''], placeholder: '' });
  }

  seRenderQuestions();
  seGoToStep(1);
  seCheckExportReady(); // Initialize DE name display based on site
  document.getElementById('surveyEditorOverlay').classList.add('open');
  
  // Show first-time step-by-step tutorial
  seStartTourIfNew();
}

function closeSurveyEditor() {
  // End tour if running
  if (_seTourRunning) {
    seEndTour();
  }
  
  // Save options back to builderStack item before closing
  if (_seTargetUid) {
    var item = builderStack.find(function(b) { return b.uid === _seTargetUid; });
    if (item) {
      item.options = seCollectOpts();
    }
  }
  document.getElementById('surveyEditorOverlay').classList.remove('open');
  
  // Check if this was opened from Component Library
  if (window._librarySurveyUid && _seTargetUid === window._librarySurveyUid) {
    if (typeof onLibrarySurveyEditorClose === 'function') {
      onLibrarySurveyEditorClose();
    }
  }
  
  _seTargetUid = null;
  _seCurrentStep = 1;
}

/* ── Wizard Step Navigation (4 steps) ── */
var _seTotalSteps = 4;

function seGoToStep(target) {
  var step;
  if (target === 'next') step = Math.min(_seCurrentStep + 1, _seTotalSteps);
  else if (target === 'prev') step = Math.max(_seCurrentStep - 1, 1);
  else step = parseInt(target) || 1;

  _seCurrentStep = step;

  // Update step content visibility
  for (var s = 1; s <= _seTotalSteps; s++) {
    var el = document.getElementById('seStep' + s);
    if (el) el.classList.toggle('active', s === step);
  }

  // Update step indicator pills
  for (var p = 1; p <= _seTotalSteps; p++) {
    var pill = document.getElementById('seStepPill' + p);
    if (!pill) continue;
    pill.classList.remove('active', 'done');
    if (p === step) pill.classList.add('active');
    else if (p < step) pill.classList.add('done');
  }

  // Update step connector lines
  var lines = document.querySelectorAll('.se-step-line');
  for (var l = 0; l < lines.length; l++) {
    lines[l].classList.toggle('done', l < step - 1);
  }

  // Update footer buttons
  document.getElementById('seBtnCancel').style.display = step === 1 ? '' : 'none';
  document.getElementById('seBtnBack').style.display = step > 1 ? '' : 'none';
  document.getElementById('seBtnNext').style.display = step < _seTotalSteps ? '' : 'none';
  document.getElementById('seBtnSave').style.display = step === _seTotalSteps ? '' : 'none';

  // Step 1: update email preview in right pane
  if (step === 1) {
    seUpdatePreview();
  }

  // Step 2: update thank you preview in right pane
  if (step === 2) {
    seUpdateThanksPreview();
  }

  // Step 3: render interactive CloudPage-style preview
  if (step === 3) {
    seRenderInteractivePreview();
  }

  // Step 4: check export readiness
  if (step === 4) {
    seCheckExportReady();
  }
}

/* ── Thank You preview (Step 2 right pane) ── */
function seUpdateThanksPreview() {
  var title = document.getElementById('seThanksTitle').value.trim() || 'Thank you!';
  var msg = document.getElementById('seThanksMsg').value.trim() || 'Your response has been recorded. We appreciate your time!';
  var ctaUrl = document.getElementById('seThanksCtaSite').value || 'https://www.iotmart.com/en-en';
  // Hardcoded style values
  var primaryColor = '#0059ff';
  var btnRadius = '0px';
  var frame = document.getElementById('seThanksFrame');
  if (!frame) return;
  frame.innerHTML =
    '<div style="text-align:center;padding:48px 24px;font-family:Arial,Helvetica,sans-serif;">' +
      '<div style="margin-bottom:16px;"><img src="https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773816144/check_circle_24dp_E3E3E3_FILL0_wght200_GRAD0_opsz24_gyprma.svg" alt="Success" style="width:56px;height:56px;filter:invert(56%) sepia(62%) saturate(5531%) hue-rotate(134deg) brightness(96%) contrast(90%);" /></div>' +
      '<h2 style="margin:0 0 10px;font-size:22px;font-weight:900;color:#07071a;">' + escHtml(title) + '</h2>' +
      '<p style="margin:0;font-size:14px;color:#888;line-height:1.5;">' + escHtml(msg) + '</p>' +
      '<a href="' + escHtml(ctaUrl) + '" target="_blank" style="display:inline-block;margin-top:24px;padding:12px 32px;background:' + primaryColor + ';color:#fff;font-size:14px;font-weight:700;text-decoration:none;border-radius:' + btnRadius + ';">Visit IoTMart</a>' +
    '</div>';
}

/* ── Interactive preview (Step 3) — real CloudPage-like form in iframe ── */
function seRenderInteractivePreview() {
  var opts = seCollectOpts();
  var title = opts.edmTitle || 'Survey';
  var eyebrowText = opts.eyebrowText || "We'd love your feedback";
  var submitText = opts.submitText || 'Submit';
  var thanksTitle = opts.thanksTitle || 'Thank you!';
  var thanksMsg = opts.thanksMsg || 'Your response has been recorded. We appreciate your time!';
  var thanksCtaUrl = opts.thanksCtaSite || 'https://www.iotmart.com/en-en';
  var qCount = parseInt(opts.questionCount) || 0;
  // Hardcoded style values
  var primaryColor = '#0059ff';
  var pageBg = '#f6f7f9';
  var footerBg = '#1a1a2e';
  var footerText = '#ffffff';
  var btnRadius = '0px';

  var formHtml = '';
  for (var i = 1; i <= qCount; i++) {
    var label = opts['q' + i + 'Label'] || 'Question ' + i;
    var type = opts['q' + i + 'Type'] || 'radio';
    var optStr = opts['q' + i + 'Options'] || '';
    var optArr = optStr ? optStr.split('|||').map(function(s) { return s.trim(); }).filter(Boolean) : [];
    formHtml += '<div class="q-card">';
    formHtml += '<div class="q-label">Q' + i + '. ' + escHtml(label) + '</div>';

    if (type === 'radio') {
      optArr.forEach(function(o) {
        formHtml += '<label style="display:flex;align-items:center;gap:10px;padding:10px 14px;margin-bottom:5px;border:1px solid #e5e7eb;cursor:pointer;font-size:14px;transition:all .15s;">' +
          '<input type="radio" name="q' + i + '" style="margin:0;accent-color:' + primaryColor + ';" /> ' + escHtml(o) + '</label>';
      });
    } else if (type === 'checkbox') {
      optArr.forEach(function(o) {
        formHtml += '<label style="display:flex;align-items:center;gap:10px;padding:10px 14px;margin-bottom:5px;border:1px solid #e5e7eb;cursor:pointer;font-size:14px;transition:all .15s;">' +
          '<input type="checkbox" style="margin:0;accent-color:' + primaryColor + ';" /> ' + escHtml(o) + '</label>';
      });
    } else if (type === 'dropdown') {
      formHtml += '<select style="width:100%;padding:10px 12px;border:1px solid #d0d4da;font-size:14px;background:#fff;"><option>-- Select --</option>';
      optArr.forEach(function(o) { formHtml += '<option>' + escHtml(o) + '</option>'; });
      formHtml += '</select>';
    } else if (type === 'text') {
      var ph = opts['q' + i + 'Placeholder'] || 'Type your answer...';
      formHtml += '<input type="text" placeholder="' + escHtml(ph) + '" style="width:100%;padding:10px 12px;border:1px solid #d0d4da;font-size:14px;box-sizing:border-box;" />';
    } else if (type === 'textarea') {
      var ph2 = opts['q' + i + 'Placeholder'] || 'Type your answer...';
      formHtml += '<textarea rows="3" placeholder="' + escHtml(ph2) + '" style="width:100%;padding:10px 12px;border:1px solid #d0d4da;font-size:14px;resize:vertical;box-sizing:border-box;"></textarea>';
    } else if (type === 'star') {
      formHtml += '<div class="star-group" data-q="' + i + '">' +
        '<input type="hidden" name="q' + i + '" id="sq' + i + '" value="" />' +
        '<span class="star" data-v="1" onclick="setStar(' + i + ',1)">★</span>' +
        '<span class="star" data-v="2" onclick="setStar(' + i + ',2)">★</span>' +
        '<span class="star" data-v="3" onclick="setStar(' + i + ',3)">★</span>' +
        '<span class="star" data-v="4" onclick="setStar(' + i + ',4)">★</span>' +
        '<span class="star" data-v="5" onclick="setStar(' + i + ',5)">★</span>' +
      '</div>';
    }
    formHtml += '</div>';
  }

  var iframeDoc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' +
    '*{box-sizing:border-box;margin:0;padding:0;}' +
    'body{font-family:Arial,Helvetica,sans-serif;background:' + pageBg + ';color:#07071a;padding:0;}' +
    '.page-wrap{max-width:600px;margin:0 auto;}' +
    '.survey-header{background:#fff;padding:16px 24px;text-align:center;border-bottom:1px solid #e5e7eb;}' +
    '.survey-header .header-inner{max-width:600px;margin:0 auto;}' +
    '.survey-header img{height:28px;}' +
    '.section-heading{text-align:center;padding:28px 20px 16px;background:' + pageBg + ';}' +
    '.section-heading .eyebrow{font-size:12px;font-weight:400;letter-spacing:2px;text-transform:uppercase;color:' + primaryColor + ';margin:0 0 4px;}' +
    '.section-heading h2{font-size:22px;font-weight:900;color:#07071a;margin:0;line-height:1.3;}' +
    '.form-area{padding:20px 24px;background:' + pageBg + ';}' +
    '.q-card{background:#fff;padding:24px;margin-bottom:16px;}' +
    '.q-label{font-weight:700;font-size:14px;color:#07071a;display:block;margin-bottom:10px;}' +
    '.option-list{list-style:none;padding:0;margin:0;}' +
    '.option-list li{padding:9px 0;font-size:13px;}' +
    '.option-list li label{cursor:pointer;display:flex;align-items:center;gap:10px;}' +
    '.option-list li input[type=radio],.option-list li input[type=checkbox]{width:18px;height:18px;accent-color:' + primaryColor + ';flex-shrink:0;}' +
    '.text-input,textarea.text-input{width:100%;padding:14px 16px;font-size:14px;font-family:Arial,sans-serif;border:2px solid #d0d5dd;background:#f9fafb;color:#07071a;outline:none;resize:vertical;}' +
    '.text-input:focus{border-color:' + primaryColor + ';background:#fff;}' +
    'label:has(input[type=radio]:checked),label:has(input[type=checkbox]:checked){border-color:' + primaryColor + '!important;background:#f0f5ff;}' +
    '.star-group{display:flex;gap:4px;padding:4px 0;}' +
    '.star{font-size:28px;color:#d0d0d0;cursor:pointer;transition:color .15s;line-height:1;user-select:none;}' +
    '.star.active{color:#f5a623;}' +
    '.submit-wrap{text-align:center;padding:12px 24px 32px;background:' + pageBg + ';}' +
    '.submit-btn{display:inline-block;width:100%;padding:14px 56px;background:' + primaryColor + ';color:#fff;font-size:16px;font-weight:bold;border:none;border-radius:' + btnRadius + ';cursor:pointer;}' +
    '.submit-btn:hover{background:#003dcc;}' +
    '.success{text-align:center;padding:60px 40px 80px;background:#fff;display:none;}' +
    '.success h2{font-size:24px;font-weight:bold;color:#07071a;margin:0 0 12px;}' +
    '.success p{color:#666;font-size:14px;margin:0 0 28px;}' +
    '.footer{background:' + footerBg + ';color:' + footerText + ';text-align:center;font-size:12px;padding:16px 24px;}' +
    '</style></head><body>' +
    '<div class="survey-header"><div class="header-inner">' +
      '<img src="https://irp.cdn-website.com/56869327/dms3rep/multi/ADVANTECH+IoTMart+LOGO.png" alt="Advantech IoTMart" />' +
    '</div></div>' +
    '<div class="page-wrap">' +
      '<div id="formView">' +
        '<div class="section-heading">' +
          '<p class="eyebrow">' + escHtml(eyebrowText) + '</p>' +
          '<h2>' + escHtml(title) + '</h2>' +
        '</div>' +
        '<div class="form-area">' + formHtml + '</div>' +
        '<div class="submit-wrap">' +
          '<button class="submit-btn" onclick="document.getElementById(\'formView\').style.display=\'none\';document.getElementById(\'thankView\').style.display=\'block\';">' + escHtml(submitText) + ' \u2192</button>' +
        '</div>' +
      '</div>' +
      '<div class="success" id="thankView">' +
        '<div style="margin-bottom:16px;"><img src="https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773816144/check_circle_24dp_E3E3E3_FILL0_wght200_GRAD0_opsz24_gyprma.svg" alt="Success" style="width:56px;height:56px;filter:invert(56%) sepia(62%) saturate(5531%) hue-rotate(134deg) brightness(96%) contrast(90%);" /></div>' +
        '<h2>' + escHtml(thanksTitle) + '</h2>' +
        '<p>' + escHtml(thanksMsg) + '</p>' +
        '<a href="' + escHtml(thanksCtaUrl) + '" target="_blank" style="display:inline-block;margin-top:24px;padding:12px 40px;background:' + primaryColor + ';color:#fff;font-size:14px;font-weight:700;text-decoration:none;border-radius:' + btnRadius + ';cursor:pointer;">Visit IoTMart \u2192</a>' +
      '</div>' +
    '</div>' +
    '<div class="footer">' +
      '<p>&copy; ' + new Date().getFullYear() + ' Advantech IoTMart. All rights reserved.</p>' +
      '<p style="margin-top:4px;">Your response is confidential and helps us improve our service.</p>' +
    '</div>' +
    '<script>function setStar(q,v){document.getElementById("sq"+q).value=v;var g=document.querySelector(".star-group[data-q=\'" +q+"\']" );if(!g)return;var stars=g.querySelectorAll(".star");for(var i=0;i<stars.length;i++){stars[i].classList.toggle("active",parseInt(stars[i].getAttribute("data-v"))<=v);}}</script>' +
    '</body></html>';

  var frame = document.getElementById('seInteractiveFrame');
  // Use an iframe for true isolation + interactivity
  frame.innerHTML = '<iframe id="seInteractiveIframe" style="width:100%;border:none;min-height:600px;border-radius:6px;" sandbox="allow-scripts allow-same-origin"></iframe>';
  var iframe = document.getElementById('seInteractiveIframe');
  iframe.onload = function() {
    // Auto-resize iframe to content
    try {
      var h = iframe.contentDocument.documentElement.scrollHeight;
      iframe.style.height = h + 'px';
    } catch(e) {}
  };
  iframe.srcdoc = iframeDoc;
}



function seRenderQuestions() {
  var list = document.getElementById('seQuestionList');
  var count = _seQuestions.length;
  document.getElementById('seQuestionCount').textContent = count + ' / 7';
  document.getElementById('seAddQuestionBtn').style.display = count >= 7 ? 'none' : '';

  list.innerHTML = _seQuestions.map(function(q, idx) {
    var num = idx + 1;
    var needsOptions = ['radio', 'checkbox', 'dropdown'].indexOf(q.type) >= 0;
    // Ensure at least one empty option field for option-based questions
    if (needsOptions && q.options.length === 0) {
      q.options.push('');
    }
    var optsHtml = needsOptions ? (
      '<div class="sq-opt-list">' +
      q.options.map(function(opt, oi) {
        return '<div class="sq-opt-row">' +
          '<input type="text" value="' + escHtml(opt) + '" oninput="seUpdateOption(' + idx + ',' + oi + ',this.value)" placeholder="Option ' + (oi + 1) + '" />' +
          '<button class="sq-opt-del" onclick="seRemoveOption(' + idx + ',' + oi + ')" title="Remove"><span class="mi" style="font-size:14px;">close</span></button>' +
        '</div>';
      }).join('') +
      '</div>' +
      (q.options.length < 10 ? '<button class="sq-add-opt" onclick="seAddOption(' + idx + ')"><span class="mi" style="font-size:13px;vertical-align:-2px;">add</span> Add Option</button>' : '')
    ) : '';

    var actionBtns = '';
    if (idx > 0) actionBtns += '<button class="sq-act-btn" onclick="event.stopPropagation();seMoveQuestion(' + idx + ',-1)" title="Move Up"><span class="mi">arrow_upward</span></button>';
    if (idx < count - 1) actionBtns += '<button class="sq-act-btn" onclick="event.stopPropagation();seMoveQuestion(' + idx + ',1)" title="Move Down"><span class="mi">arrow_downward</span></button>';
    if (count > 1) actionBtns += '<button class="sq-act-btn sq-act-del" onclick="event.stopPropagation();seRemoveQuestion(' + idx + ')" title="Delete"><span class="mi">delete</span></button>';

    var needsPlaceholder = ['text', 'textarea'].indexOf(q.type) >= 0;
    var placeholderHtml = needsPlaceholder ? (
      '<div class="survey-field-group"><label>Placeholder Text</label>' +
        '<input type="text" value="' + escHtml(q.placeholder || '') + '" oninput="seUpdateQ(' + idx + ',\'placeholder\',this.value)" placeholder="Type your answer..." />' +
      '</div>'
    ) : '';

    return '<div class="sq-item active" id="sqItem' + idx + '">' +
      '<div class="sq-header" onclick="seToggleQuestion(' + idx + ')">' +
        '<div class="sq-header-left">' +
          '<div class="sq-num">' + num + '</div>' +
          '<input type="text" class="sq-label-input" value="' + escHtml(q.label || 'Question ' + num) + '" placeholder="Question ' + num + '" onclick="event.stopPropagation()" oninput="seUpdateQ(' + idx + ',\'label\',this.value)" />' +
        '</div>' +
        '<div class="sq-header-right">' +
          '<select class="sq-type-select" onclick="event.stopPropagation()" onchange="seUpdateQ(' + idx + ',\'type\',this.value)">' +
            '<option value="radio"' + (q.type === 'radio' ? ' selected' : '') + '>Radio</option>' +
            '<option value="checkbox"' + (q.type === 'checkbox' ? ' selected' : '') + '>Checkbox</option>' +
            '<option value="dropdown"' + (q.type === 'dropdown' ? ' selected' : '') + '>Dropdown</option>' +
            '<option value="text"' + (q.type === 'text' ? ' selected' : '') + '>Text</option>' +
            '<option value="textarea"' + (q.type === 'textarea' ? ' selected' : '') + '>Textarea</option>' +
            '<option value="star"' + (q.type === 'star' ? ' selected' : '') + '>Star Rating</option>' +
          '</select>' +
          (actionBtns ? '<div class="sq-actions">' + actionBtns + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="sq-body">' +
        (needsOptions ? '<div class="survey-field-group"><label>Options (max 10)</label>' + optsHtml + '</div>' : '') +
        placeholderHtml +
      '</div>' +
    '</div>';
  }).join('');
}

function escHtml(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

function seToggleQuestion(idx) {
  var el = document.getElementById('sqItem' + idx);
  if (el) el.classList.toggle('active');
}

function seUpdateQ(idx, key, val) {
  if (_seQuestions[idx]) {
    _seQuestions[idx][key] = val;
    if (key === 'type') {
      var needsOpts = ['radio', 'checkbox', 'dropdown'].indexOf(val) >= 0;
      if (needsOpts && _seQuestions[idx].options.length === 0) {
        _seQuestions[idx].options = [''];
      }
      seRenderQuestions();
    }
    seUpdatePreview();
  }
}

function seUpdateOption(qIdx, oIdx, val) {
  if (_seQuestions[qIdx]) {
    _seQuestions[qIdx].options[oIdx] = val;
    seUpdatePreview();
  }
}

function seAddOption(qIdx) {
  if (_seQuestions[qIdx] && _seQuestions[qIdx].options.length < 10) {
    _seQuestions[qIdx].options.push('');
    seRenderQuestions();
    seUpdatePreview();
  }
}

function seRemoveOption(qIdx, oIdx) {
  if (_seQuestions[qIdx] && _seQuestions[qIdx].options.length > 1) {
    _seQuestions[qIdx].options.splice(oIdx, 1);
    seRenderQuestions();
    seUpdatePreview();
  }
}

function seAddQuestion() {
  if (_seQuestions.length < 7) {
    _seQuestions.push({ label: '', type: 'radio', options: [''], placeholder: '' });
    seRenderQuestions();
    seUpdatePreview();
    var pane = document.getElementById('surveyEditPane');
    setTimeout(function() { pane.scrollTop = pane.scrollHeight; }, 50);
  }
}

function seMoveQuestion(idx, dir) {
  var newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= _seQuestions.length) return;
  var temp = _seQuestions[idx];
  _seQuestions[idx] = _seQuestions[newIdx];
  _seQuestions[newIdx] = temp;
  seRenderQuestions();
  seUpdatePreview();
}

function seRemoveQuestion(idx) {
  if (_seQuestions.length > 1) {
    _seQuestions.splice(idx, 1);
    seRenderQuestions();
    seUpdatePreview();
  }
}

function seCollectOpts() {
  var opts = {
    edmTitle: document.getElementById('seEdmTitle').value.trim(),
    eyebrowText: document.getElementById('seEyebrowText').value.trim() || "We'd love your feedback",
    edmDataName: document.getElementById('seEdmDataName').value.trim(),
    cloudPageUrl: document.getElementById('seCloudPageUrl').value.trim(),
    submitText: document.getElementById('seSubmitText').value.trim() || 'Submit',
    thanksTitle: document.getElementById('seThanksTitle').value.trim() || 'Thank you!',
    thanksMsg: document.getElementById('seThanksMsg').value.trim() || 'Your response has been recorded. We appreciate your time!',
    thanksCtaSite: document.getElementById('seThanksCtaSite').value || 'https://www.iotmart.com/en-en',
    questionCount: String(_seQuestions.length)
  };
  _seQuestions.forEach(function(q, i) {
    var n = i + 1;
    opts['q' + n + 'Label'] = q.label;
    opts['q' + n + 'Type'] = q.type;
    opts['q' + n + 'Options'] = q.options.join('|||');
    if (q.placeholder) opts['q' + n + 'Placeholder'] = q.placeholder;
  });
  return opts;
}

function seUpdatePreview() {
  var frame = document.getElementById('sePreviewFrame');
  var opts = seCollectOpts();
  var comp = COMPONENTS.find(function(c) { return c.id === 'survey'; });
  if (comp) {
    // Apply theme colors (same as main builder preview)
    var item = _seTargetUid ? builderStack.find(function(b) { return b.uid === _seTargetUid; }) : null;
    var colored = (typeof applyColors === 'function')
      ? applyColors(comp.getHtml(opts), comp, item && item.edits)
      : comp.getHtml(opts);
    frame.innerHTML = '<div class="survey-preview-scaler">' + colored + '</div>';
  }
  // Scale to fit
  setTimeout(function() {
    var scaler = frame.querySelector('.survey-preview-scaler');
    if (scaler) {
      var available = frame.clientWidth;
      var scale = Math.min(1, available / 600);
      scaler.style.transform = 'scale(' + scale + ')';
      scaler.style.height = (scaler.scrollHeight * scale) + 'px';
    }
  }, 10);
}

function seSave() {
  if (!_seTargetUid) return;
  var opts = seCollectOpts();
  var item = builderStack.find(function(b) { return b.uid === _seTargetUid; });
  if (item) {
    item.options = Object.assign(item.options || {}, opts);
    renderBuilderPreview();
    renderBuilderRight();
    pushBuilderHistory();
    if (typeof Collab !== 'undefined') { Collab.markUnsaved(); Collab.triggerAutoSave(); }
    showToast('Survey saved');
  }
  closeSurveyEditor();
}

function seCheckExportReady() {
  var url = document.getElementById('seCloudPageUrl').value.trim();
  var card = document.getElementById('seEmailExportCard');
  if (!card) return;
  if (url) {
    card.classList.remove('disabled');
  } else {
    card.classList.add('disabled');
  }
  // Update the DE name display based on current site
  var site = (window._currentProjectSite || 'global').toLowerCase();
  var deName = site === 'global' ? 'Survey_Responses' : site.toUpperCase() + '-Survey_Responses';
  var deNameEl = document.getElementById('seTargetDeName');
  if (deNameEl) deNameEl.textContent = deName;
}

function seCopyHtml(type) {
  var opts = seCollectOpts();
  if (type === 'email' && !opts.cloudPageUrl) {
    showToast('Please fill in the CloudPage URL first.');
    return;
  }
  var html = '';
  if (type === 'email') {
    var comp = COMPONENTS.find(function(c) { return c.id === 'survey'; });
    if (comp) html = comp.getHtml(opts);
  } else {
    html = seGenerateCloudPageHtml(opts);
  }
  navigator.clipboard.writeText(html).then(function() {
    showToast(type === 'email' ? 'Email HTML copied!' : 'CloudPage HTML copied!');
    // Visual feedback on export card
    var cards = document.querySelectorAll('.se-export-card');
    var idx = type === 'email' ? 1 : 0;
    if (cards[idx]) {
      cards[idx].classList.add('copied');
      var copyIcon = cards[idx].querySelector('.se-export-copy');
      if (copyIcon) copyIcon.textContent = 'check_circle';
      setTimeout(function() {
        cards[idx].classList.remove('copied');
        if (copyIcon) copyIcon.textContent = 'content_copy';
      }, 2000);
    }
  });
}

function seGenerateCloudPageHtml(opts) {
  var edmTitle = opts.edmTitle || 'Survey';
  var eyebrowText = opts.eyebrowText || "We'd love your feedback";
  var edmDataName = opts.edmDataName || 'survey';
  var submitText = opts.submitText || 'Submit';
  var thanksTitle = opts.thanksTitle || 'Thank you!';
  var thanksMsg = opts.thanksMsg || 'Your response has been recorded. We appreciate your time!';
  var thanksCtaUrl = opts.thanksCtaSite || 'https://www.iotmart.com/en-en';
  var qCount = parseInt(opts.questionCount) || 0;
  // Get site from global (set by firebase-collab.js) and build DE name
  var site = (window._currentProjectSite || 'global').toLowerCase();
  var deName = site === 'global' ? 'Survey_Responses' : site.toUpperCase() + '-Survey_Responses';
  // Hardcoded style values
  var primaryColor = '#0059ff';
  var pageBg = '#f6f7f9';
  var footerBg = '#1a1a2e';
  var footerText = '#ffffff';
  var btnRadius = '0px';

  // Build AMPscript InsertData fields + checkbox combining logic (no JS needed)
  var insertFields = '';
  var cbAmpscript = '';
  var formFields = '';

  for (var i = 1; i <= qCount; i++) {
    var label = opts['q' + i + 'Label'] || 'Question ' + i;
    var type = opts['q' + i + 'Type'] || 'radio';
    var optStr = opts['q' + i + 'Options'] || '';
    var optArr = optStr ? optStr.split('|||').map(function(s) { return s.trim(); }).filter(Boolean) : [];

    // Q column always stores the question label
    insertFields += ',\n      "Q' + i + '", "' + label.replace(/"/g, '\\"') + '"';

    if (type === 'checkbox') {
      // Checkbox: each option has its own form name; combine via AMPscript
      insertFields += ',\n      "A' + i + '", @q' + i + '_answer';
      cbAmpscript += '\n    SET @q' + i + '_answer = ""\n';
      cbAmpscript += '    SET @q' + i + '_sep = ""\n';
      optArr.forEach(function(o, oi) {
        var pName = 'q' + i + '_' + (oi + 1);
        cbAmpscript += '    IF NOT EMPTY(RequestParameter("' + pName + '")) THEN\n';
        cbAmpscript += '      SET @q' + i + '_answer = CONCAT(@q' + i + '_answer, @q' + i + '_sep, RequestParameter("' + pName + '"))\n';
        cbAmpscript += '      SET @q' + i + '_sep = " | "\n';
        cbAmpscript += '    ENDIF\n';
      });
    } else {
      insertFields += ',\n      "A' + i + '", RequestParameter("q' + i + '")';
    }

    // ── Form fields (pure HTML, zero JavaScript) ──
    formFields += '      <div class="q-card">\n';
    formFields += '        <label class="q-label">Q' + i + '. ' + label + '</label>\n';

    if (type === 'radio') {
      formFields += '        <ul class="option-list">\n';
      optArr.forEach(function(o) {
        formFields += '          <li><label><input type="radio" name="q' + i + '" value="' + o.replace(/"/g, '&quot;') + '" /> ' + o + '</label></li>\n';
      });
      formFields += '        </ul>\n';
    } else if (type === 'checkbox') {
      formFields += '        <ul class="option-list">\n';
      optArr.forEach(function(o, oi) {
        formFields += '          <li><label><input type="checkbox" name="q' + i + '_' + (oi + 1) + '" value="' + o.replace(/"/g, '&quot;') + '" /> ' + o + '</label></li>\n';
      });
      formFields += '        </ul>\n';
    } else if (type === 'dropdown') {
      formFields += '        <select name="q' + i + '" class="text-input">\n';
      formFields += '          <option value="">-- Select --</option>\n';
      optArr.forEach(function(o) {
        formFields += '          <option value="' + o.replace(/"/g, '&quot;') + '">' + o + '</option>\n';
      });
      formFields += '        </select>\n';
    } else if (type === 'text') {
      var phText = opts['q' + i + 'Placeholder'] || 'Type your answer...';
      formFields += '        <input type="text" name="q' + i + '" class="text-input" placeholder="' + phText.replace(/"/g, '&quot;') + '" />\n';
    } else if (type === 'textarea') {
      var phArea = opts['q' + i + 'Placeholder'] || 'Type your answer...';
      formFields += '        <textarea name="q' + i + '" rows="3" class="text-input" placeholder="' + phArea.replace(/"/g, '&quot;') + '"></textarea>\n';
    } else if (type === 'star') {
      formFields += '        <ul class="option-list">\n';
      for (var s = 1; s <= 5; s++) {
        var starIcons = '';
        for (var si = 0; si < s; si++) starIcons += '\u2B50';
        formFields += '          <li><label><input type="radio" name="q' + i + '" value="' + s + '" /> ' + s + ' ' + starIcons + '</label></li>\n';
      }
      formFields += '        </ul>\n';
    }

    formFields += '      </div>\n';
  }

  return '%%[\n' +
    '/* ── Survey: ' + edmTitle + ' ── */\n' +
    'SET @submitted = RequestParameter("submitted")\n' +
    '\n' +
    'IF @submitted == "1" THEN\n' +
    '  SET @ts = Format(NOW(), "yyyyMMddHHmmss")\n' +
    '  SET @rand = Substring(GUID(), 1, 8)\n' +
    '  SET @edmName = "' + edmDataName + '"\n' +
    '  SET @responseId = CONCAT(@edmName, "_", @ts, "_", @rand)\n' +
    '\n' + cbAmpscript +
    '  InsertData(\n' +
    '    "' + deName + '",\n' +
    '    "ResponseId", @responseId,\n' +
    '    "SubscriberKey", RequestParameter("subkey"),\n' +
    '    "EmailAddress", RequestParameter("email"),\n' +
    '    "EdmName", @edmName,\n' +
    '    "SubmittedAt", NOW()' + insertFields + '\n' +
    '  )\n' +
    '  SET @showThankYou = "1"\n' +
    'ENDIF\n' +
    ']%%\n' +
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '  <meta charset="utf-8" />\n' +
    '  <meta name="viewport" content="width=device-width,initial-scale=1.0" />\n' +
    '  <title>' + edmTitle + '</title>\n' +
    '  <style>\n' +
    '    *{box-sizing:border-box;}\n' +
    '    body{background-color:' + pageBg + ';margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;color:#07071a;}\n' +
    '    .page-wrap{max-width:600px;margin:0 auto;}\n' +
    '    .survey-header{background-color:#ffffff;padding:16px 24px;text-align:center;border-bottom:1px solid #e5e7eb;}\n' +
    '    .survey-header .header-inner{max-width:600px;margin:0 auto;}\n' +
    '    .survey-header img{height:28px;}\n' +
    '    .section-heading{text-align:center;padding:28px 20px 16px 20px;background-color:' + pageBg + ';}\n' +
    '    .section-heading .eyebrow{font-size:12px;font-weight:400;letter-spacing:2px;text-transform:uppercase;color:' + primaryColor + ';margin:0 0 4px;}\n' +
    '    .section-heading h2{font-size:22px;font-weight:900;color:#07071a;margin:0;line-height:1.3;}\n' +
    '    .form-area{padding:20px 24px;background-color:' + pageBg + ';}\n' +
    '    .q-card{background:#fff;padding:24px;margin-bottom:16px;}\n' +
    '    .q-label{font-weight:700;font-size:14px;color:#07071a;display:block;margin-bottom:10px;}\n' +
    '    .option-list{list-style:none;padding:0;margin:0;}\n' +
    '    .option-list li{padding:9px 0;font-size:13px;}\n' +
    '    .option-list li label{cursor:pointer;display:flex;align-items:center;gap:10px;}\n' +
    '    .option-list li input[type="radio"],.option-list li input[type="checkbox"]{width:18px;height:18px;accent-color:' + primaryColor + ';flex-shrink:0;}\n' +
    '    .text-input,textarea.text-input{width:100%;padding:14px 16px;font-size:14px;font-family:Arial,sans-serif;border:2px solid #d0d5dd;background-color:#f9fafb;color:#07071a;outline:none;resize:vertical;}\n' +
    '    .text-input:focus{border-color:' + primaryColor + ';background-color:#fff;}\n' +
    '    .submit-wrap{text-align:center;padding:12px 24px 32px;background-color:' + pageBg + ';}\n' +
    '    .submit-btn{display:inline-block;width:100%;padding:14px 56px;background-color:' + primaryColor + ';color:#fff;font-size:16px;font-weight:bold;border:none;border-radius:' + btnRadius + ';cursor:pointer;}\n' +
    '    .submit-btn:hover{background-color:#003dcc;}\n' +
    '    .thank-you{text-align:center;padding:60px 40px 80px;background:#fff;}\n' +
    '    .thank-you h2{font-size:24px;color:#07071a;margin:0 0 12px;}\n' +
    '    .thank-you p{font-size:14px;color:#666;margin:0 0 28px;}\n' +
    '    .back-link{display:inline-block;padding:12px 40px;background-color:' + primaryColor + ';color:#fff;font-size:14px;font-weight:700;text-decoration:none;border-radius:' + btnRadius + ';}\n' +
    '    .survey-footer{background-color:' + footerBg + ';color:' + footerText + ';text-align:center;font-size:12px;padding:16px 24px;}\n' +
    '    @media screen and (max-width:480px){.page-wrap{width:100%!important;} .form-area,.submit-wrap{padding:16px;} .section-heading{padding:28px 20px 8px;} .q-card{padding:16px;}}\n' +
    '  </style>\n' +
    '</head>\n' +
    '<body>\n' +
    '<div class="survey-header">\n' +
    '  <div class="header-inner">\n' +
    '    <img src="https://irp.cdn-website.com/56869327/dms3rep/multi/ADVANTECH+IoTMart+LOGO.png" alt="Advantech IoTMart" />\n' +
    '  </div>\n' +
    '</div>\n' +
    '<div class="page-wrap">\n' +
    '\n' +
    '%%[ IF @showThankYou == "1" THEN ]%%\n' +
    '  <div class="thank-you">\n' +
    '    <div style="margin-bottom:16px;"><img src="https://res.cloudinary.com/dhj1ztoeu/image/upload/v1773816144/check_circle_24dp_E3E3E3_FILL0_wght200_GRAD0_opsz24_gyprma.svg" alt="Success" style="width:56px;height:56px;filter:invert(56%) sepia(62%) saturate(5531%) hue-rotate(134deg) brightness(96%) contrast(90%);" /></div>\n' +
    '    <h2>' + thanksTitle + '</h2>\n' +
    '    <p>' + thanksMsg + '</p>\n' +
    '    <a href="' + thanksCtaUrl + '" class="back-link">Visit IoTMart \u2192</a>\n' +
    '  </div>\n' +
    '%%[ ELSE ]%%\n' +
    '  <form method="POST" action="">\n' +
    '    <input type="hidden" name="submitted" value="1" />\n' +
    '    <input type="hidden" name="subkey" value="%%=v(@_subscriberkey)=%%" />\n' +
    '    <input type="hidden" name="email" value="%%=v(@emailaddr)=%%" />\n' +
    '    <div class="section-heading">\n' +
    '      <p class="eyebrow">' + eyebrowText + '</p>\n' +
    '      <h2>' + edmTitle + '</h2>\n' +
    '    </div>\n' +
    '    <div class="form-area">\n' +
    formFields +
    '    </div>\n' +
    '    <div class="submit-wrap">\n' +
    '      <button type="submit" class="submit-btn">' + submitText + ' \u2192</button>\n' +
    '    </div>\n' +
    '  </form>\n' +
    '%%[ ENDIF ]%%\n' +
    '</div>\n' +
    '<div class="survey-footer">\n' +
    '  <p>&copy; ' + new Date().getFullYear() + ' Advantech IoTMart. All rights reserved.</p>\n' +
    '  <p style="margin-top:4px;">Your response is confidential and helps us improve our service.</p>\n' +
    '</div>\n' +
    '</body>\n' +
    '</html>';
}
