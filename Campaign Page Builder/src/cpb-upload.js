(function (global) {
  'use strict';

  let _cropCallback = null;
  let _cropSourceIsPng = false;
  let _cropAspectRatio = null;
  let _cropDragging = false, _cropDragOffsetX = 0, _cropDragOffsetY = 0;
  let _cropResizing = false, _cropResizeHandle = null, _cropResizeStart = null;
  let _cropStageRect = null;

  function showPreviewDimensions(img) {
    const dims = document.getElementById('pop-img-dims');
    if (dims) dims.textContent = img.naturalWidth + ' × ' + img.naturalHeight + ' px';
  }

  function updateImagePreview(url) {
    const box = document.getElementById('pop-img-preview');
    const dims = document.getElementById('pop-img-dims');
    if (!box) return;
    if (url && url.trim()) {
      if (dims) dims.textContent = '';
      box.innerHTML = `<img src="${escapeAttr(url.trim())}" alt="" onload="showPreviewDimensions(this)" onerror="this.parentNode.innerHTML='<span class=\\'preview-placeholder\\'>Image not found</span>';document.getElementById('pop-img-dims').textContent=''">`;
    } else {
      box.innerHTML = '<span class="preview-placeholder">No image URL</span>';
      if (dims) dims.textContent = '';
    }
  }

  async function _uploadCpbIconToCloudinary(fileOrBlob, filename) {
    const cloud = String(window.CLOUDINARY_CLOUD || '').trim();
    const preset = String(window.CLOUDINARY_PRESET || '').trim();
    if (!cloud || !preset || cloud === 'YOUR_CLOUD_NAME' || preset === 'YOUR_UPLOAD_PRESET') {
      throw new Error('Cloudinary config is missing. Load ../config.js and set CLOUDINARY_CLOUD / CLOUDINARY_PRESET.');
    }
    const formData = new FormData();
    formData.append('file', fileOrBlob, filename || 'upload.png');
    formData.append('upload_preset', preset);
    formData.append('folder', 'eDM/assets');
    const res = await fetch('https://api.cloudinary.com/v1_1/' + cloud + '/image/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      let detail = '';
      try {
        const text = await res.text();
        if (text) {
          try {
            const json = JSON.parse(text);
            detail = json?.error?.message || json?.message || text;
          } catch {
            detail = text;
          }
        }
      } catch {
        detail = '';
      }
      throw new Error('Upload failed (' + res.status + '): ' + (detail || 'Cloudinary rejected the request'));
    }
    const data = await res.json();
    const uploadedIsPng = (fileOrBlob instanceof Blob && fileOrBlob.type === 'image/png') || (typeof filename === 'string' && filename.toLowerCase().endsWith('.png'));
    const transform = uploadedIsPng ? 'f_png,q_auto' : 'f_auto,q_auto';
    return data.secure_url.replace('/upload/', '/upload/' + transform + '/');
  }

  function uploadCpbIcon() {
    const uploadBtn = document.getElementById('cpbIconUploadBtn');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg,image/svg+xml';
    input.style.display = 'none';
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      if (!file) { input.remove(); return; }
      if (file.size > 2 * 1024 * 1024) { toast('Icon must be under 2 MB', 'error'); input.remove(); return; }
      if (uploadBtn) {
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<span class="mi" style="animation:spin .8s linear infinite;display:inline-block">progress_activity</span>Uploading';
      }
      try {
        const url = await _uploadCpbIconToCloudinary(file, file.name);
        setEditValue(_cpbIconUid, _cpbIconKeyPath, url);
        pushHistory();
        renderCanvas();
        saveCurrentProject(true);
        closeCpbIconPicker();
        toast('Icon uploaded', 'check_circle');
      } catch (err) {
        console.error(err);
        toast('Icon upload failed. Check Cloudinary config.', 'error');
      } finally {
        const btn = document.getElementById('cpbIconUploadBtn');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span class="mi">upload</span>Upload';
        }
      }
      input.remove();
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  }

  function uploadHeroBgImage(uid) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpg,image/jpeg,image/png';
    input.style.display = 'none';
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      input.remove();
      if (!file) return;
      const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowed.includes(file.type)) { toast('Only JPG / PNG files are allowed.', 'error'); return; }
      if (file.size > 5 * 1024 * 1024) { toast('File must be under 5 MB.', 'error'); return; }
      _cropSourceIsPng = file.type === 'image/png';
      showCropModal(file, null, null, async (blob) => {
        await _doCloudinaryUpload(blob, _cropSourceIsPng ? 'bg-cropped.png' : 'bg-cropped.jpg', (url) => {
          setSectionEditValue(uid, 'bgImage', url);
          setSectionOption(uid, 'heroBgType', 'image');
        });
      });
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  }

  function uploadListFieldImage(uid, key, idx, fieldKey) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpg,image/jpeg,image/png';
    input.style.display = 'none';
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      input.remove();
      if (!file) return;
      const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowed.includes(file.type)) { toast('Only JPG / PNG files are allowed.', 'error'); return; }
      if (file.size > 5 * 1024 * 1024) { toast('File must be under 5 MB.', 'error'); return; }
      _cropSourceIsPng = file.type === 'image/png';
      showCropModal(file, null, null, async (blob) => {
        await _doCloudinaryUpload(blob, _cropSourceIsPng ? 'list-image-cropped.png' : 'list-image-cropped.jpg', (url) => {
          setListField(uid, key, idx, fieldKey, url);
          renderProperties();
        });
      });
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  }

  function uploadImageToInput(inputId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpg,image/jpeg,image/png';
    input.style.display = 'none';
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      input.remove();
      if (!file) return;
      const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowed.includes(file.type)) { toast('Only JPG / PNG files are allowed.', 'error'); return; }
      if (file.size > 5 * 1024 * 1024) { toast('File must be under 5 MB.', 'error'); return; }
      _cropSourceIsPng = file.type === 'image/png';
      showCropModal(file, null, null, async (blob) => {
        await _doCloudinaryUpload(blob, _cropSourceIsPng ? 'input-image-cropped.png' : 'input-image-cropped.jpg', (url) => {
          const targetInput = document.getElementById(inputId);
          if (targetInput) {
            targetInput.value = url;
            targetInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      });
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  }

  async function uploadToCloudinary(input) {
    const file = input.files[0];
    if (!file) return;
    const errEl = document.getElementById('pop-upload-error');
    const showUploadErr = (msg) => { if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); } };
    const clearUploadErr = () => { if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); } };

    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) { showUploadErr('Only JPG / PNG files are allowed.'); input.value = ''; return; }
    if (file.size > 5 * 1024 * 1024) { showUploadErr('File must be under 5 MB.'); input.value = ''; return; }
    clearUploadErr();
    input.value = '';

    _cropSourceIsPng = file.type === 'image/png';
    showCropModal(file, null, null, async (blob) => {
      await _doCloudinaryUpload(blob, _cropSourceIsPng ? 'cropped.png' : 'cropped.jpg', (url) => {
        const srcInput = document.getElementById('popImageUrl');
        if (srcInput) {
          srcInput.value = url;
          updateImagePreview(url);
        }
      });
    });
  }

  async function _doCloudinaryUpload(fileOrBlob, filename, onDone) {
    const btn = document.getElementById('pop-upload-btn');
    if (btn) {
      btn.innerHTML = '<span class="mi" style="animation:spin .8s linear infinite;display:inline-block">progress_activity</span>Uploading...';
      btn.style.pointerEvents = 'none';
    }
    try {
      const cloud = String(window.CLOUDINARY_CLOUD || '').trim();
      const preset = String(window.CLOUDINARY_PRESET || '').trim();
      if (!cloud || !preset || cloud === 'YOUR_CLOUD_NAME' || preset === 'YOUR_UPLOAD_PRESET') {
        throw new Error('Cloudinary config is missing. Load ../config.js and set CLOUDINARY_CLOUD / CLOUDINARY_PRESET.');
      }
      const formData = new FormData();
      formData.append('file', fileOrBlob, filename || 'upload.jpg');
      formData.append('upload_preset', preset);
      formData.append('folder', 'eDM/assets');
      const res = await fetch('https://api.cloudinary.com/v1_1/' + cloud + '/image/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        let detail = '';
        try {
          const text = await res.text();
          if (text) {
            try {
              const json = JSON.parse(text);
              detail = json?.error?.message || json?.message || text;
            } catch {
              detail = text;
            }
          }
        } catch {
          detail = '';
        }
        throw new Error('Upload failed (' + res.status + '): ' + (detail || 'Cloudinary rejected the request'));
      }
      const data = await res.json();
      const uploadedIsPng = (fileOrBlob instanceof Blob && fileOrBlob.type === 'image/png') || (typeof filename === 'string' && filename.toLowerCase().endsWith('.png'));
      const transform = uploadedIsPng ? 'f_png,q_auto' : 'f_auto,q_auto';
      const url = data.secure_url.replace('/upload/', '/upload/' + transform + '/');
      if (onDone) onDone(url);
      toast('Image uploaded', 'check_circle');
    } catch (err) {
      const errEl = document.getElementById('pop-upload-error');
      if (errEl) {
        errEl.textContent = err && err.message ? err.message : 'Upload failed. Check Cloudinary config.';
        errEl.classList.add('visible');
      }
      console.error(err);
    } finally {
      if (btn) {
        btn.innerHTML = '<span class="mi">upload</span>Upload Image';
        btn.style.pointerEvents = '';
      }
    }
  }

  function showCropModal(file, cropW, cropH, callback) {
    _cropCallback = callback;
    _cropAspectRatio = (cropW && cropH) ? cropW / cropH : null;
    const modal = document.getElementById('cropModal');
    const img = document.getElementById('cropSourceImg');
    const title = document.getElementById('cropModalTitle');
    if (title) title.textContent = cropW && cropH ? 'Crop - ' + cropW + 'x' + cropH + ' px' : 'Crop Image';
    const reader = new FileReader();
    reader.onload = ev => {
      img.onload = () => initCropBox(cropW, cropH);
      img.src = ev.target.result;
      modal.classList.add('visible');
    };
    reader.readAsDataURL(file);
  }

  function initCropBox(cropW, cropH) {
    const img = document.getElementById('cropSourceImg');
    const box = document.getElementById('cropBox');
    const dW = img.offsetWidth, dH = img.offsetHeight;
    let bW, bH;
    if (cropW && cropH) {
      const ratio = cropW / cropH;
      if (dW / dH >= ratio) { bH = dH; bW = bH * ratio; }
      else { bW = dW; bH = bW / ratio; }
    } else {
      bW = dW * 0.8;
      bH = dH * 0.8;
    }
    const imgLeft = img.offsetLeft, imgTop = img.offsetTop;
    box.style.cssText = 'width:' + bW + 'px;height:' + bH + 'px;left:' + (imgLeft + (dW - bW) / 2) + 'px;top:' + (imgTop + (dH - bH) / 2) + 'px;position:absolute;border:2px solid #F39800;cursor:move;box-sizing:border-box;box-shadow:0 0 0 9999px rgba(0,0,0,0.55);';
    box.dataset.cropRatioW = cropW || '';
    box.dataset.cropRatioH = cropH || '';
    box.innerHTML = '';
    ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].forEach(pos => {
      const h = document.createElement('div');
      h.className = 'crop-handle';
      h.dataset.handle = pos;
      box.appendChild(h);
    });
  }

  function cancelCrop() {
    document.getElementById('cropModal').classList.remove('visible');
    _cropCallback = null;
    const btn = document.getElementById('pop-upload-btn');
    if (btn) {
      btn.innerHTML = '<span class="mi">upload</span>Upload Image';
      btn.style.pointerEvents = '';
    }
  }

  function confirmCrop() {
    const img = document.getElementById('cropSourceImg');
    const box = document.getElementById('cropBox');
    const rW = parseInt(box.dataset.cropRatioW, 10);
    const rH = parseInt(box.dataset.cropRatioH, 10);
    const scaleX = img.naturalWidth / img.offsetWidth;
    const scaleY = img.naturalHeight / img.offsetHeight;
    const sw = parseFloat(box.style.width) * scaleX;
    const sh = parseFloat(box.style.height) * scaleY;
    const cW = rW || Math.round(sw);
    const cH = rH || Math.round(sh);
    const canvas = document.createElement('canvas');
    canvas.width = cW;
    canvas.height = cH;
    canvas.getContext('2d').drawImage(
      img,
      (parseFloat(box.style.left) - img.offsetLeft) * scaleX,
      (parseFloat(box.style.top) - img.offsetTop) * scaleY,
      sw,
      sh,
      0,
      0,
      cW,
      cH
    );
    const cropMime = _cropSourceIsPng ? 'image/png' : 'image/jpeg';
    const cropQuality = _cropSourceIsPng ? undefined : 0.92;
    canvas.toBlob(blob => {
      document.getElementById('cropModal').classList.remove('visible');
      if (_cropCallback) _cropCallback(blob);
      _cropCallback = null;
    }, cropMime, cropQuality);
  }

  document.addEventListener('mousedown', e => {
    const cropModal = document.getElementById('cropModal');
    if (cropModal && cropModal.classList.contains('visible')) return;
    if (!e.target.closest('.edit-popover')
      && !e.target.closest('img[data-cpb-edit]')
      && !e.target.closest('[data-cpb-edit-cta]')
      && !e.target.closest('.cpb-icon-popup')
      && !e.target.closest('.cpb-icon-overlay')) hideEditPopover();
  });

  document.addEventListener('mousedown', e => {
    const box = document.getElementById('cropBox');
    if (!box) return;
    const handleEl = e.target.closest('.crop-handle');
    if (handleEl) {
      e.preventDefault();
      e.stopPropagation();
      _cropResizing = true;
      _cropResizeHandle = handleEl.dataset.handle;
      _cropStageRect = document.getElementById('cropStage').getBoundingClientRect();
      _cropResizeStart = {
        x: e.clientX,
        y: e.clientY,
        left: parseFloat(box.style.left),
        top: parseFloat(box.style.top),
        width: parseFloat(box.style.width),
        height: parseFloat(box.style.height)
      };
      return;
    }
    if (!e.target.closest('#cropBox')) return;
    e.preventDefault();
    _cropDragging = true;
    _cropStageRect = document.getElementById('cropStage').getBoundingClientRect();
    _cropDragOffsetX = e.clientX - _cropStageRect.left - parseFloat(box.style.left);
    _cropDragOffsetY = e.clientY - _cropStageRect.top - parseFloat(box.style.top);
  });

  document.addEventListener('mousemove', e => {
    const box = document.getElementById('cropBox');
    const img = document.getElementById('cropSourceImg');
    if (!box || !img) return;
    if (_cropResizing && _cropResizeStart) {
      const dx = e.clientX - _cropResizeStart.x;
      const dy = e.clientY - _cropResizeStart.y;
      const { left: sL, top: sT, width: sW, height: sH } = _cropResizeStart;
      const MIN = 20;
      const imgW = img.offsetWidth, imgH = img.offsetHeight;
      const h = _cropResizeHandle;
      let nL = sL, nT = sT, nW = sW, nH = sH;
      if (h.includes('e')) nW = Math.max(MIN, sW + dx);
      if (h.includes('s')) nH = Math.max(MIN, sH + dy);
      if (h.includes('w')) { nW = Math.max(MIN, sW - dx); nL = sL + sW - nW; }
      if (h.includes('n')) { nH = Math.max(MIN, sH - dy); nT = sT + sH - nH; }
      if (_cropAspectRatio) {
        if (h === 'e' || h === 'w') nH = nW / _cropAspectRatio;
        else if (h === 'n' || h === 's') nW = nH * _cropAspectRatio;
        else { nH = nW / _cropAspectRatio; if (h.includes('n')) nT = sT + sH - nH; }
      }
      const imgLeft = img.offsetLeft, imgTop = img.offsetTop;
      nL = Math.max(imgLeft, nL);
      nT = Math.max(imgTop, nT);
      if (nL + nW > imgLeft + imgW) nW = imgLeft + imgW - nL;
      if (nT + nH > imgTop + imgH) nH = imgTop + imgH - nT;
      box.style.left = nL + 'px';
      box.style.top = nT + 'px';
      box.style.width = nW + 'px';
      box.style.height = nH + 'px';
      return;
    }
    if (!_cropDragging) return;
    const bW = parseFloat(box.style.width), bH = parseFloat(box.style.height);
    const imgLeft = img.offsetLeft, imgTop = img.offsetTop;
    box.style.left = Math.max(imgLeft, Math.min(imgLeft + img.offsetWidth - bW, e.clientX - _cropStageRect.left - _cropDragOffsetX)) + 'px';
    box.style.top = Math.max(imgTop, Math.min(imgTop + img.offsetHeight - bH, e.clientY - _cropStageRect.top - _cropDragOffsetY)) + 'px';
  });

  document.addEventListener('mouseup', () => {
    _cropDragging = false;
    _cropResizing = false;
    _cropResizeStart = null;
  });

  global.showPreviewDimensions = showPreviewDimensions;
  global.updateImagePreview = updateImagePreview;
  global.uploadCpbIcon = uploadCpbIcon;
  global.uploadHeroBgImage = uploadHeroBgImage;
  global.uploadListFieldImage = uploadListFieldImage;
  global.uploadImageToInput = uploadImageToInput;
  global.uploadToCloudinary = uploadToCloudinary;
  global._doCloudinaryUpload = _doCloudinaryUpload;
  global.showCropModal = showCropModal;
  global.initCropBox = initCropBox;
  global.cancelCrop = cancelCrop;
  global.confirmCrop = confirmCrop;
})(window);