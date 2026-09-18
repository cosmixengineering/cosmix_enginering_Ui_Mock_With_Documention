(function () {
    const state = {
        file: null, sourceBytes: null, pdf: null, viewport: null, displayWidth: 0, displayHeight: 0, outputScale: 2, page: 1, pages: 0, zoom: 1.15,
        textItems: [], selection: null, edits: [], selectedEditId: null, preview: null, output: null,
        dragging: false, dragStart: null, renderId: 0
    };

    const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const byId = id => document.getElementById(id);
    const fontCss = value => String(value || 'Arial').replace(/[^A-Za-z0-9 _.-]/g, '').trim() || 'Arial';

    function shell() {
        return `<div class="sales-page pdf-editor-page space-y-3">
            <section class="sales-workspace-head"><div><h1>PDF Editor</h1><p>PDF upload karein, existing text select karein ya area draw karein, aur replacement ko usi position par export karein.</p></div><div class="flex flex-wrap gap-2"><a href="tender-documents.html" class="sales-btn"><i class="fas fa-layer-group"></i> Tender Documents</a><button onclick="pdfEditorReset()" class="sales-btn"><i class="fas fa-rotate-left"></i> New PDF</button><button id="pdf-export-btn" onclick="pdfEditorExport()" class="sales-btn sales-btn-primary" disabled><i class="fas fa-download"></i> Export edited PDF</button></div></section>
            <div id="pdf-editor-empty" class="sales-panel"><div id="pdf-editor-drop" class="pdf-editor-drop" role="button" tabindex="0" aria-label="Choose or drop a PDF"><i class="fas fa-file-arrow-up"></i><strong>Upload a PDF to edit</strong><span>Text-based aur scanned dono PDFs supported hain. File isi browser mein process hogi.</span><div class="flex flex-wrap items-center justify-center gap-2"><button type="button" onclick="pdfEditorChoose(event)" class="sales-btn sales-btn-primary"><i class="fas fa-folder-open"></i> Choose PDF</button><span class="pdf-editor-drop-copy">or drop PDF here</span></div><input id="pdf-file-input" type="file" accept="application/pdf,.pdf" onchange="pdfEditorLoad(this.files && this.files[0])"></div></div>
            <div id="pdf-editor-workspace" class="hidden grid items-start gap-3 xl:grid-cols-[210px_minmax(560px,1fr)_290px]">
                <aside class="sales-panel pdf-editor-sidebar"><div class="sales-panel-head"><div><p class="sales-label">Document</p><h3 id="pdf-file-name">PDF</h3></div></div><div class="p-3"><div class="pdf-source-meta"><span>Pages</span><strong id="pdf-page-count">0</strong></div><div class="pdf-source-meta"><span>Detected text</span><strong id="pdf-text-count">0 items</strong></div><div id="pdf-page-list" class="pdf-page-list"></div></div><div class="border-t border-slate-100 p-3 text-[8.5px] leading-relaxed text-slate-500">Source PDF read-only rahegi. Export ek nayi edited copy banata hai.</div></aside>
                <main class="sales-panel min-w-0 overflow-hidden"><div class="pdf-editor-toolbar no-print"><div class="flex items-center gap-1"><button onclick="pdfEditorPage(-1)" class="sales-icon-btn" title="Previous page"><i class="fas fa-chevron-left"></i></button><span class="pdf-page-indicator">Page <strong id="pdf-current-page">1</strong> / <span id="pdf-total-pages">1</span></span><button onclick="pdfEditorPage(1)" class="sales-icon-btn" title="Next page"><i class="fas fa-chevron-right"></i></button></div><div class="flex items-center gap-1"><button onclick="pdfEditorZoom(-.15)" class="sales-icon-btn" title="Zoom out"><i class="fas fa-minus"></i></button><span id="pdf-zoom-label" class="pdf-page-indicator">115%</span><button onclick="pdfEditorZoom(.15)" class="sales-icon-btn" title="Zoom in"><i class="fas fa-plus"></i></button><span id="pdf-quality-label" class="sales-badge bg-slate-50 text-slate-600 border-slate-200">HD 2x</span></div><div class="pdf-editor-hint"><i class="fas fa-arrow-pointer"></i> Text par click karein ya mouse se rectangle draw karein</div></div><div id="pdf-view-scroll" class="pdf-view-scroll"><div id="pdf-stage" class="pdf-stage"><canvas id="pdf-canvas"></canvas><div id="pdf-text-layer" class="pdf-text-layer"></div><div id="pdf-edit-layer" class="pdf-edit-layer"></div><div id="pdf-selection-box" class="pdf-selection-box hidden"></div></div></div><div id="pdf-render-status" class="pdf-render-status">PDF upload karein</div></main>
                <aside class="space-y-3"><section class="sales-panel"><div class="sales-panel-head"><div><p class="sales-label">Replacement</p><h3>Selected text area</h3></div><span id="pdf-selection-status" class="sales-badge bg-slate-50 text-slate-500 border-slate-200">None</span></div><div class="space-y-3 p-3"><div class="sales-field"><label>Detected / original text</label><textarea id="pdf-original-text" class="sales-textarea" rows="2" readonly placeholder="Area select karein"></textarea></div><div id="pdf-format-summary" class="pdf-format-summary"><i class="fas fa-wand-magic-sparkles"></i> Text select karne par original formatting yahan detect hogi.</div><div class="sales-field"><label>Replacement text *</label><textarea id="pdf-replacement-text" oninput="pdfEditorLivePreview()" class="sales-textarea" rows="3" placeholder="Naya text yahan likhein"></textarea></div><div class="grid grid-cols-2 gap-2"><div class="sales-field"><label>Font family</label><select id="pdf-font-family" onchange="pdfEditorLivePreview()" class="sales-select"><option value="Inter">Inter</option><option value="JetBrains Mono">JetBrains Mono</option><option value="Arial">Arial</option><option value="Helvetica">Helvetica</option><option value="Times New Roman">Times New Roman</option><option value="Courier New">Courier New</option></select></div><div class="sales-field"><label>Font style</label><select id="pdf-font-style" onchange="pdfEditorLivePreview()" class="sales-select"><option value="400-normal">Regular</option><option value="500-normal">Medium</option><option value="600-normal">Semi Bold</option><option value="700-normal">Bold</option><option value="800-normal">Extra Bold</option><option value="400-italic">Italic</option><option value="700-italic">Bold Italic</option></select></div><div class="sales-field"><label>Font size</label><input id="pdf-font-size" oninput="pdfEditorLivePreview()" type="number" min="5" max="72" step="0.1" value="11" class="sales-input"></div><div class="sales-field"><label>Alignment</label><select id="pdf-text-align" onchange="pdfEditorLivePreview()" class="sales-select"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div><div class="sales-field"><label>Text colour</label><input id="pdf-text-color" oninput="pdfEditorLivePreview()" type="color" value="#111827" class="pdf-color-input"></div><div class="sales-field"><label>Area background</label><input id="pdf-background-color" oninput="pdfEditorLivePreview()" type="color" value="#ffffff" class="pdf-color-input"></div></div><label class="flex items-center gap-2 text-[9px] text-slate-600"><input id="pdf-cover-old" onchange="pdfEditorLivePreview()" type="checkbox" checked> Old text/background cover karein</label><div class="grid grid-cols-2 gap-2"><button onclick="pdfEditorApply()" class="sales-btn sales-btn-primary justify-center"><i class="fas fa-check"></i> Apply text</button><button onclick="pdfEditorDeleteSelected()" class="sales-btn justify-center"><i class="fas fa-trash"></i> Remove edit</button></div></div></section>
                    <section class="sales-panel"><div class="sales-panel-head"><div><p class="sales-label">Changes</p><h3>Replacement list</h3></div><span id="pdf-edit-count" class="sales-badge bg-slate-50 text-slate-600 border-slate-200">0</span></div><div id="pdf-edit-list" class="pdf-edit-list"><div class="pdf-empty-list">No replacements added</div></div><div class="border-t border-slate-100 p-3"><button onclick="pdfEditorUndo()" class="sales-btn w-full justify-center"><i class="fas fa-rotate-left"></i> Undo last change</button></div></section>
                    <div class="sales-note border-l-amber-500"><p class="font-bold">How replacement works</p><p class="mt-1 text-[8.5px] leading-relaxed text-slate-500">Editor original text ko Word ki tarah rewrite nahi karta. Selected area cover hota hai aur naya text same coordinates par paint hota hai. Scanned page par area manually draw karein. Signed PDF edit karne se digital signature valid nahi rahegi.</p></div>
                </aside>
            </div>
            <section id="pdf-output-panel" class="sales-panel hidden"><div class="sales-panel-head"><div><p class="sales-label">Output ready</p><h3 id="pdf-output-name">Edited PDF</h3></div><button onclick="pdfEditorDownload()" class="sales-btn sales-btn-primary"><i class="fas fa-download"></i> Download again</button></div><div class="grid gap-3 p-3 sm:grid-cols-3"><div class="pdf-output-stat"><span>Pages</span><strong id="pdf-output-pages">0</strong></div><div class="pdf-output-stat"><span>Replacements</span><strong id="pdf-output-edits">0</strong></div><div class="pdf-output-stat"><span>Output size</span><strong id="pdf-output-size">0 KB</strong></div></div></section>
        </div>`;
    }

    function init() {
        renderLayout('pdf-editor');
        setPageContent('PDF Editor', shell());
        if (!window.pdfjsLib || !window.PDFLib || !window.CosmixPdfEditorCore) {
            const drop = byId('pdf-editor-drop');
            if (drop) drop.innerHTML = '<i class="fas fa-triangle-exclamation text-rose-600"></i><strong>PDF tools could not start</strong><span>Required local PDF libraries are missing. Reload this folder copy and try again.</span>';
            showToast('PDF tools load nahi huay. Page reload karein.', 'error');
            return;
        }
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('../assets/vendor/pdf-tools/pdf.worker.min.js', window.location.href).href;
        bindUpload();
        bindStage();
    }

    function bindUpload() {
        const drop = byId('pdf-editor-drop');
        if (!drop) return;
        const stop = event => { event.preventDefault(); event.stopPropagation(); };
        ['dragenter', 'dragover'].forEach(name => drop.addEventListener(name, event => { stop(event); drop.classList.add('is-dragging'); }));
        ['dragleave', 'dragend'].forEach(name => drop.addEventListener(name, event => { stop(event); drop.classList.remove('is-dragging'); }));
        drop.addEventListener('drop', event => {
            stop(event); drop.classList.remove('is-dragging');
            const file = Array.from(event.dataTransfer?.files || []).find(row => row.type === 'application/pdf' || /\.pdf$/i.test(row.name));
            if (!file) { showToast('Drop ki hui files mein PDF nahi mili', 'warning'); return; }
            load(file);
        });
        drop.addEventListener('keydown', event => {
            if (event.target === drop && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); chooseFile(); }
        });
    }

    function chooseFile(event) {
        event?.preventDefault(); event?.stopPropagation();
        const input = byId('pdf-file-input');
        if (!input) { showToast('PDF file picker available nahi hai', 'error'); return; }
        input.value = '';
        input.click();
    }

    function readFile(file) {
        if (typeof file.arrayBuffer === 'function') return file.arrayBuffer();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error || new Error('PDF file read failed'));
            reader.readAsArrayBuffer(file);
        });
    }

    const hexByte = value => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');
    const toHex = color => `#${hexByte(color[0])}${hexByte(color[1])}${hexByte(color[2])}`;

    function fontMeta(page, item, style) {
        let pdfFont = null;
        try { pdfFont = page.commonObjs.get(item.fontName); } catch (_) {}
        const raw = String(pdfFont?.name || style?.fontFamily || 'Arial').replace(/^[A-Z]{6}\+/, '');
        const italic = /italic|oblique/i.test(raw) ? 'italic' : 'normal';
        const weight = /extra[- ]?bold|black|heavy/i.test(raw) ? 800 : /semi[- ]?bold/i.test(raw) ? 600 : /bold/i.test(raw) ? 700 : /medium/i.test(raw) ? 500 : 400;
        let family = raw.replace(/[- ]?(ExtraBold|SemiBold|Bold|Medium|Regular|Italic|Oblique|Black|Heavy).*$/i, '').replace(/MT$/i, '').trim();
        if (/jetbrains/i.test(raw)) family = 'JetBrains Mono';
        else if (/inter/i.test(raw)) family = 'Inter';
        else if (/arial/i.test(raw)) family = 'Arial';
        else if (/helvetica/i.test(raw)) family = 'Helvetica';
        else if (/times/i.test(raw)) family = 'Times New Roman';
        else if (/courier|mono/i.test(raw) || style?.fontFamily === 'monospace') family = 'Courier New';
        else if (!family || family === 'sans-serif') family = 'Arial';
        return { fontFamily: family, fontLabel: raw, fontWeight: weight, fontStyle: italic, pdfFontName: item.fontName };
    }

    function sampledColors(context, item) {
        const scale = state.outputScale;
        const x = clamp(Math.floor((item.x - 1) * scale), 0, context.canvas.width - 1);
        const y = clamp(Math.floor((item.y - 1) * scale), 0, context.canvas.height - 1);
        const width = clamp(Math.ceil((item.width + 2) * scale), 1, context.canvas.width - x);
        const height = clamp(Math.ceil((item.height + 2) * scale), 1, context.canvas.height - y);
        let pixels;
        try { pixels = context.getImageData(x, y, width, height).data; } catch (_) { return { textColor: '#111827', backgroundColor: '#ffffff' }; }
        const bins = new Map();
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] < 80) continue;
            const key = `${Math.round(pixels[i] / 16)}-${Math.round(pixels[i + 1] / 16)}-${Math.round(pixels[i + 2] / 16)}`;
            const bin = bins.get(key) || { count: 0, r: 0, g: 0, b: 0 };
            bin.count++; bin.r += pixels[i]; bin.g += pixels[i + 1]; bin.b += pixels[i + 2]; bins.set(key, bin);
        }
        const background = [...bins.values()].sort((a, b) => b.count - a.count)[0] || { count: 1, r: 255, g: 255, b: 255 };
        const bg = [background.r / background.count, background.g / background.count, background.b / background.count];
        let weightTotal = 0, red = 0, green = 0, blue = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] < 80) continue;
            const distance = Math.hypot(pixels[i] - bg[0], pixels[i + 1] - bg[1], pixels[i + 2] - bg[2]);
            if (distance < 28) continue;
            const weight = distance * distance;
            weightTotal += weight; red += pixels[i] * weight; green += pixels[i + 1] * weight; blue += pixels[i + 2] * weight;
        }
        const foreground = weightTotal ? [red / weightTotal, green / weightTotal, blue / weightTotal] : [17, 24, 39];
        return { textColor: toHex(foreground), backgroundColor: toHex(bg) };
    }

    function setBusy(message) {
        const status = byId('pdf-render-status');
        if (status) status.textContent = message;
    }

    async function load(file) {
        if (!file) return;
        if (!(file.type === 'application/pdf' || /\.pdf$/i.test(file.name))) { showToast('Sirf PDF file select karein', 'warning'); return; }
        resetRuntime();
        state.file = file;
        setBusy('Opening PDF...');
        try {
            const buffer = await readFile(file);
            state.sourceBytes = new Uint8Array(buffer.slice(0));
            const task = window.pdfjsLib.getDocument({ data: new Uint8Array(buffer.slice(0)), isEvalSupported: false, useWorkerFetch: false });
            state.pdf = await task.promise;
            state.pages = state.pdf.numPages;
            byId('pdf-editor-empty').classList.add('hidden');
            byId('pdf-editor-workspace').classList.remove('hidden');
            byId('pdf-file-name').textContent = file.name;
            byId('pdf-page-count').textContent = state.pages;
            byId('pdf-total-pages').textContent = state.pages;
            byId('pdf-export-btn').disabled = false;
            renderPageList();
            await renderPage();
            showToast(`${file.name} opened - ${state.pages} pages`, 'success');
        } catch (error) {
            console.error(error);
            const reason = /password/i.test(String(error?.message || '')) ? 'PDF password-protected hai.' : 'PDF open nahi hui. File damaged ho sakti hai.';
            showToast(reason, 'error');
            resetRuntime();
        }
    }

    async function renderPage() {
        if (!state.pdf) return;
        const request = ++state.renderId;
        setBusy(`Rendering page ${state.page}...`);
        const page = await state.pdf.getPage(state.page);
        const viewport = page.getViewport({ scale: state.zoom });
        state.viewport = viewport;
        state.displayWidth = viewport.width;
        state.displayHeight = viewport.height;
        state.outputScale = Math.min(2.5, Math.max(2, Number(window.devicePixelRatio || 1)));
        if (request !== state.renderId) return;
        const canvas = byId('pdf-canvas'), stage = byId('pdf-stage'), context = canvas.getContext('2d', { alpha: false });
        canvas.width = Math.ceil(viewport.width * state.outputScale); canvas.height = Math.ceil(viewport.height * state.outputScale);
        canvas.style.width = `${viewport.width}px`; canvas.style.height = `${viewport.height}px`;
        stage.style.width = `${viewport.width}px`; stage.style.height = `${viewport.height}px`;
        context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
        context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, viewport, transform: [state.outputScale, 0, 0, state.outputScale, 0, 0], background: 'rgb(255,255,255)' }).promise;
        const text = await page.getTextContent();
        state.textItems = text.items.filter(item => String(item.str || '').trim()).map((item, index) => {
            const transform = window.pdfjsLib.Util.transform(viewport.transform, item.transform);
            const fontHeight = Math.max(5, Math.hypot(transform[2], transform[3]));
            const row = { index, text: item.str, x: transform[4], y: transform[5] - fontHeight, width: Math.max(4, Number(item.width || 0) * state.zoom), height: fontHeight, ...fontMeta(page, item, text.styles?.[item.fontName]) };
            return { ...row, ...sampledColors(context, row) };
        });
        renderTextLayer(); renderEditLayer(); clearSelection(false); renderPageList();
        byId('pdf-current-page').textContent = state.page;
        byId('pdf-zoom-label').textContent = `${Math.round(state.zoom * 100)}%`;
        byId('pdf-quality-label').textContent = `HD ${state.outputScale % 1 ? state.outputScale.toFixed(1) : state.outputScale}x`;
        byId('pdf-text-count').textContent = `${state.textItems.length} items`;
        setBusy(state.textItems.length ? `${state.textItems.length} text items detected - click text or draw an area` : 'No selectable text detected - draw an area manually');
        page.cleanup();
    }

    function renderTextLayer() {
        const layer = byId('pdf-text-layer');
        layer.innerHTML = state.textItems.map(item => `<button type="button" class="pdf-detected-text" style="left:${item.x}px;top:${item.y}px;width:${item.width}px;height:${item.height}px" onclick="event.stopPropagation();pdfEditorSelectText(${item.index})" title="${esc(item.text)}"></button>`).join('');
    }

    function renderEditLayer() {
        const layer = byId('pdf-edit-layer'), width = state.displayWidth, height = state.displayHeight;
        const rows = state.preview ? [...state.edits.filter(edit => edit.id !== state.selectedEditId), state.preview] : state.edits;
        layer.innerHTML = rows.filter(edit => edit.page === state.page).map(edit => {
            const r = edit.rect, x = r.x * width, y = r.y * height, w = r.width * width, h = r.height * height;
            const draft = edit.id === '__preview__', selected = draft || state.selectedEditId === edit.id ? ' selected' : '';
            return `<button type="button" class="pdf-edit-preview${selected}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${edit.cover === false ? 'transparent' : edit.backgroundColor};color:${edit.textColor};font-family:'${fontCss(edit.fontFamily)}',sans-serif;font-size:${edit.fontSize * state.zoom}px;font-style:${edit.fontStyle||'normal'};font-weight:${edit.fontWeight||400};text-align:${edit.align};${draft?'pointer-events:none;':''}" ${draft?'':`onclick="event.stopPropagation();pdfEditorSelectEdit('${edit.id}')"`}>${esc(edit.text)}</button>`;
        }).join('');
        renderEditList();
    }

    function editFromControls(id = '__preview__') {
        const [fontWeight, fontStyle] = byId('pdf-font-style').value.split('-');
        return {
            id, page: state.page, rect: { ...state.selection }, original: byId('pdf-original-text').value,
            text: byId('pdf-replacement-text').value, fontFamily: byId('pdf-font-family').value,
            fontLabel: byId('pdf-font-family').value, fontWeight: Number(fontWeight || 400), fontStyle: fontStyle || 'normal',
            fontSize: clamp(Number(byId('pdf-font-size').value || 11), 5, 72), align: byId('pdf-text-align').value,
            textColor: byId('pdf-text-color').value, backgroundColor: byId('pdf-background-color').value,
            cover: byId('pdf-cover-old').checked
        };
    }

    function livePreview() {
        if (!state.selection) return;
        state.preview = byId('pdf-replacement-text').value ? editFromControls() : null;
        renderEditLayer();
    }

    function renderEditList() {
        const list = byId('pdf-edit-list');
        byId('pdf-edit-count').textContent = state.edits.length;
        list.innerHTML = state.edits.length ? state.edits.map((edit, index) => `<button onclick="pdfEditorGoToEdit('${edit.id}')" class="pdf-edit-list-row ${state.selectedEditId === edit.id ? 'active' : ''}"><span>${index + 1}</span><div><strong>Page ${edit.page}</strong><small>${esc(edit.text)}</small></div><i class="fas fa-chevron-right"></i></button>`).join('') : '<div class="pdf-empty-list">No replacements added</div>';
    }

    function renderPageList() {
        const list = byId('pdf-page-list');
        if (!list) return;
        list.innerHTML = Array.from({ length: state.pages }, (_, index) => `<button onclick="pdfEditorGoToPage(${index + 1})" class="pdf-page-button ${state.page === index + 1 ? 'active' : ''}"><span>${index + 1}</span><small>${state.edits.filter(edit => edit.page === index + 1).length} edits</small></button>`).join('');
    }

    function selectRect(rect, original = '', editId = null) {
        const box = byId('pdf-selection-box'), width = state.displayWidth, height = state.displayHeight;
        state.selection = { x: rect.x / width, y: rect.y / height, width: rect.width / width, height: rect.height / height };
        state.selectedEditId = editId;
        state.preview = null;
        box.classList.remove('hidden');
        Object.assign(box.style, { left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.width}px`, height: `${rect.height}px` });
        byId('pdf-original-text').value = original;
        byId('pdf-selection-status').textContent = editId ? 'Edit selected' : 'Area selected';
        if (!original && !editId && byId('pdf-format-summary')) byId('pdf-format-summary').innerHTML = '<i class="fas fa-pen-ruler"></i> Manual area: current font controls export par apply hongay.';
        renderEditLayer();
    }

    function selectText(index) {
        const item = state.textItems.find(row => row.index === index);
        if (!item) return;
        selectRect({ x: item.x - 2, y: item.y - 1, width: item.width + 4, height: item.height + 3 }, item.text);
        byId('pdf-replacement-text').value = item.text;
        setFontFamily(item.fontFamily);
        byId('pdf-font-style').value = `${item.fontWeight}-${item.fontStyle}`;
        byId('pdf-font-size').value = clamp(Number((item.height / state.zoom).toFixed(1)), 5, 72);
        byId('pdf-text-color').value = item.textColor;
        byId('pdf-background-color').value = item.backgroundColor;
        byId('pdf-format-summary').innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> Detected: <strong>${esc(item.fontLabel)}</strong> · ${Number((item.height / state.zoom).toFixed(1))} pt · ${esc(item.textColor)}`;
        livePreview();
    }

    function setFontFamily(value) {
        const select = byId('pdf-font-family'), family = fontCss(value);
        if (![...select.options].some(option => option.value === family)) select.add(new Option(family, family));
        select.value = family;
    }

    function selectEdit(id) {
        const edit = state.edits.find(row => row.id === id);
        if (!edit) return;
        selectRect({ x: edit.rect.x * state.displayWidth, y: edit.rect.y * state.displayHeight, width: edit.rect.width * state.displayWidth, height: edit.rect.height * state.displayHeight }, edit.original || '', edit.id);
        byId('pdf-replacement-text').value = edit.text;
        setFontFamily(edit.fontFamily || 'Arial');
        byId('pdf-font-style').value = `${edit.fontWeight||400}-${edit.fontStyle||'normal'}`;
        byId('pdf-font-size').value = edit.fontSize;
        byId('pdf-text-align').value = edit.align;
        byId('pdf-text-color').value = edit.textColor;
        byId('pdf-background-color').value = edit.backgroundColor;
        byId('pdf-cover-old').checked = edit.cover !== false;
        byId('pdf-format-summary').innerHTML = `<i class="fas fa-pen-ruler"></i> Applied: <strong>${esc(edit.fontLabel||edit.fontFamily||'Arial')}</strong> · ${edit.fontSize} pt · ${esc(edit.textColor)}`;
        livePreview();
    }

    function bindStage() {
        const stage = byId('pdf-stage');
        stage.addEventListener('pointerdown', event => {
            if (!state.pdf || event.target.closest('.pdf-detected-text,.pdf-edit-preview')) return;
            const rect = stage.getBoundingClientRect();
            state.dragging = true; state.dragStart = { x: clamp(event.clientX - rect.left, 0, rect.width), y: clamp(event.clientY - rect.top, 0, rect.height) };
            stage.setPointerCapture(event.pointerId);
            selectRect({ x: state.dragStart.x, y: state.dragStart.y, width: 1, height: 1 }, '');
        });
        stage.addEventListener('pointermove', event => {
            if (!state.dragging) return;
            const rect = stage.getBoundingClientRect(), x = clamp(event.clientX - rect.left, 0, rect.width), y = clamp(event.clientY - rect.top, 0, rect.height);
            selectRect({ x: Math.min(x, state.dragStart.x), y: Math.min(y, state.dragStart.y), width: Math.max(2, Math.abs(x - state.dragStart.x)), height: Math.max(2, Math.abs(y - state.dragStart.y)) }, '');
        });
        stage.addEventListener('pointerup', () => { state.dragging = false; });
    }

    function apply() {
        const text = byId('pdf-replacement-text').value.trim();
        if (!state.selection) { showToast('Pehle text ya page area select karein', 'warning'); return; }
        if (!text) { showToast('Replacement text likhein', 'warning'); return; }
        const row = editFromControls(state.selectedEditId || `EDIT-${Date.now()}`);
        row.text = text;
        if (state.viewport) {
            const x1 = row.rect.x * state.displayWidth, y1 = row.rect.y * state.displayHeight, x2 = (row.rect.x + row.rect.width) * state.displayWidth, y2 = (row.rect.y + row.rect.height) * state.displayHeight;
            const first = state.viewport.convertToPdfPoint(x1, y1), second = state.viewport.convertToPdfPoint(x2, y2);
            row.pdfRect = { x: Math.min(first[0], second[0]), y: Math.min(first[1], second[1]), width: Math.abs(second[0] - first[0]), height: Math.abs(second[1] - first[1]) };
        }
        const index = state.edits.findIndex(edit => edit.id === row.id);
        if (index >= 0) state.edits[index] = row; else state.edits.push(row);
        state.selectedEditId = row.id; state.preview = null; renderEditLayer(); renderPageList();
        byId('pdf-output-panel').classList.add('hidden');
        showToast(index >= 0 ? 'Replacement updated' : 'Replacement added', 'success');
    }

    async function exportPdf() {
        if (!state.sourceBytes) return;
        if (!state.edits.length) { showToast('Export se pehle kam az kam aik replacement add karein', 'warning'); return; }
        const button = byId('pdf-export-btn'); button.disabled = true; setBusy('Building edited PDF...');
        try {
            const bytes = await window.CosmixPdfEditorCore.createEditedPdfBytes(state.sourceBytes, state.edits);
            if (state.output?.url) URL.revokeObjectURL(state.output.url);
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const base = state.file.name.replace(/\.pdf$/i, '').replace(/[^A-Za-z0-9._-]+/g, '-');
            state.output = { url: URL.createObjectURL(blob), blob, name: `${base}-Edited.pdf` };
            byId('pdf-output-panel').classList.remove('hidden');
            byId('pdf-output-name').textContent = state.output.name;
            byId('pdf-output-pages').textContent = state.pages;
            byId('pdf-output-edits').textContent = state.edits.length;
            byId('pdf-output-size').textContent = blob.size < 1048576 ? `${Math.max(1, Math.round(blob.size / 1024))} KB` : `${(blob.size / 1048576).toFixed(1)} MB`;
            download(); setBusy('Edited PDF ready'); showToast('Edited PDF ready and downloaded', 'success');
        } catch (error) {
            console.error(error); showToast('Edited PDF export nahi hui. File protection check karein.', 'error'); setBusy('Export stopped');
        } finally { button.disabled = false; }
    }

    function download() {
        if (!state.output) return;
        const link = document.createElement('a'); link.href = state.output.url; link.download = state.output.name;
        document.body.appendChild(link); link.click(); link.remove();
    }

    function clearSelection(clearInputs = true) {
        state.selection = null; state.selectedEditId = null; state.preview = null;
        byId('pdf-selection-box')?.classList.add('hidden');
        const status = byId('pdf-selection-status'); if (status) status.textContent = 'None';
        if (clearInputs) {
            if (byId('pdf-original-text')) byId('pdf-original-text').value = '';
            if (byId('pdf-replacement-text')) byId('pdf-replacement-text').value = '';
            if (byId('pdf-format-summary')) byId('pdf-format-summary').innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Text select karne par original formatting yahan detect hogi.';
        }
    }

    function resetRuntime() {
        if (state.pdf) state.pdf.destroy().catch(() => {});
        if (state.output?.url) URL.revokeObjectURL(state.output.url);
        Object.assign(state, { file: null, sourceBytes: null, pdf: null, viewport: null, displayWidth: 0, displayHeight: 0, outputScale: 2, page: 1, pages: 0, zoom: 1.15, textItems: [], selection: null, edits: [], selectedEditId: null, preview: null, output: null, dragging: false, dragStart: null });
        byId('pdf-editor-empty')?.classList.remove('hidden'); byId('pdf-editor-workspace')?.classList.add('hidden'); byId('pdf-output-panel')?.classList.add('hidden');
        if (byId('pdf-export-btn')) byId('pdf-export-btn').disabled = true;
    }

    window.pdfEditorLoad = file => load(file);
    window.pdfEditorChoose = event => chooseFile(event);
    window.pdfEditorLivePreview = livePreview;
    window.pdfEditorReset = () => { resetRuntime(); showToast('PDF Editor cleared', 'success'); };
    window.pdfEditorSelectText = index => selectText(index);
    window.pdfEditorSelectEdit = id => selectEdit(id);
    window.pdfEditorApply = apply;
    window.pdfEditorDeleteSelected = () => { if (!state.selectedEditId) { showToast('Saved replacement select karein', 'warning'); return; } state.edits = state.edits.filter(edit => edit.id !== state.selectedEditId); clearSelection(); renderEditLayer(); renderPageList(); showToast('Replacement removed', 'success'); };
    window.pdfEditorUndo = () => { const row = state.edits.pop(); if (!row) { showToast('Undo ke liye koi change nahi', 'warning'); return; } clearSelection(); if (row.page === state.page) renderEditLayer(); else renderEditList(); renderPageList(); showToast('Last replacement removed', 'success'); };
    window.pdfEditorPage = direction => { if (!state.pdf) return; state.page = clamp(state.page + direction, 1, state.pages); renderPage(); };
    window.pdfEditorGoToPage = page => { state.page = clamp(page, 1, state.pages); renderPage(); };
    window.pdfEditorZoom = amount => { state.zoom = clamp(Math.round((state.zoom + amount) * 100) / 100, .6, 2); renderPage(); };
    window.pdfEditorGoToEdit = async id => { const edit = state.edits.find(row => row.id === id); if (!edit) return; if (edit.page !== state.page) { state.page = edit.page; await renderPage(); } selectEdit(id); };
    window.pdfEditorExport = exportPdf;
    window.pdfEditorDownload = download;
    window.CosmixPdfEditorState = state;

    init();
})();
