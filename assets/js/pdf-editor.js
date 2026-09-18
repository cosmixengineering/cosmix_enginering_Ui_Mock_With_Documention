(function () {
    const state = {
        file: null, sourceBytes: null, pdf: null, viewport: null, page: 1, pages: 0, zoom: 1.15,
        textItems: [], selection: null, edits: [], selectedEditId: null, output: null,
        dragging: false, dragStart: null, renderId: 0
    };

    const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const byId = id => document.getElementById(id);

    function shell() {
        return `<div class="sales-page pdf-editor-page space-y-3">
            <section class="sales-workspace-head"><div><h1>PDF Editor</h1><p>PDF upload karein, existing text select karein ya area draw karein, aur replacement ko usi position par export karein.</p></div><div class="flex flex-wrap gap-2"><a href="tender-documents.html" class="sales-btn"><i class="fas fa-layer-group"></i> Tender Documents</a><button onclick="pdfEditorReset()" class="sales-btn"><i class="fas fa-rotate-left"></i> New PDF</button><button id="pdf-export-btn" onclick="pdfEditorExport()" class="sales-btn sales-btn-primary" disabled><i class="fas fa-download"></i> Export edited PDF</button></div></section>
            <div id="pdf-editor-empty" class="sales-panel"><div id="pdf-editor-drop" class="pdf-editor-drop" role="button" tabindex="0" aria-label="Choose or drop a PDF"><i class="fas fa-file-arrow-up"></i><strong>Upload a PDF to edit</strong><span>Text-based aur scanned dono PDFs supported hain. File isi browser mein process hogi.</span><div class="flex flex-wrap items-center justify-center gap-2"><button type="button" onclick="pdfEditorChoose(event)" class="sales-btn sales-btn-primary"><i class="fas fa-folder-open"></i> Choose PDF</button><span class="pdf-editor-drop-copy">or drop PDF here</span></div><input id="pdf-file-input" type="file" accept="application/pdf,.pdf" onchange="pdfEditorLoad(this.files && this.files[0])"></div></div>
            <div id="pdf-editor-workspace" class="hidden grid items-start gap-3 xl:grid-cols-[210px_minmax(560px,1fr)_290px]">
                <aside class="sales-panel pdf-editor-sidebar"><div class="sales-panel-head"><div><p class="sales-label">Document</p><h3 id="pdf-file-name">PDF</h3></div></div><div class="p-3"><div class="pdf-source-meta"><span>Pages</span><strong id="pdf-page-count">0</strong></div><div class="pdf-source-meta"><span>Detected text</span><strong id="pdf-text-count">0 items</strong></div><div id="pdf-page-list" class="pdf-page-list"></div></div><div class="border-t border-slate-100 p-3 text-[8.5px] leading-relaxed text-slate-500">Source PDF read-only rahegi. Export ek nayi edited copy banata hai.</div></aside>
                <main class="sales-panel min-w-0 overflow-hidden"><div class="pdf-editor-toolbar no-print"><div class="flex items-center gap-1"><button onclick="pdfEditorPage(-1)" class="sales-icon-btn" title="Previous page"><i class="fas fa-chevron-left"></i></button><span class="pdf-page-indicator">Page <strong id="pdf-current-page">1</strong> / <span id="pdf-total-pages">1</span></span><button onclick="pdfEditorPage(1)" class="sales-icon-btn" title="Next page"><i class="fas fa-chevron-right"></i></button></div><div class="flex items-center gap-1"><button onclick="pdfEditorZoom(-.15)" class="sales-icon-btn" title="Zoom out"><i class="fas fa-minus"></i></button><span id="pdf-zoom-label" class="pdf-page-indicator">115%</span><button onclick="pdfEditorZoom(.15)" class="sales-icon-btn" title="Zoom in"><i class="fas fa-plus"></i></button></div><div class="pdf-editor-hint"><i class="fas fa-arrow-pointer"></i> Text par click karein ya mouse se rectangle draw karein</div></div><div id="pdf-view-scroll" class="pdf-view-scroll"><div id="pdf-stage" class="pdf-stage"><canvas id="pdf-canvas"></canvas><div id="pdf-text-layer" class="pdf-text-layer"></div><div id="pdf-edit-layer" class="pdf-edit-layer"></div><div id="pdf-selection-box" class="pdf-selection-box hidden"></div></div></div><div id="pdf-render-status" class="pdf-render-status">PDF upload karein</div></main>
                <aside class="space-y-3"><section class="sales-panel"><div class="sales-panel-head"><div><p class="sales-label">Replacement</p><h3>Selected text area</h3></div><span id="pdf-selection-status" class="sales-badge bg-slate-50 text-slate-500 border-slate-200">None</span></div><div class="space-y-3 p-3"><div class="sales-field"><label>Detected / original text</label><textarea id="pdf-original-text" class="sales-textarea" rows="2" readonly placeholder="Area select karein"></textarea></div><div class="sales-field"><label>Replacement text *</label><textarea id="pdf-replacement-text" class="sales-textarea" rows="3" placeholder="Naya text yahan likhein"></textarea></div><div class="grid grid-cols-2 gap-2"><div class="sales-field"><label>Font size</label><input id="pdf-font-size" type="number" min="5" max="72" value="11" class="sales-input"></div><div class="sales-field"><label>Alignment</label><select id="pdf-text-align" class="sales-select"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div><div class="sales-field"><label>Text colour</label><input id="pdf-text-color" type="color" value="#111827" class="pdf-color-input"></div><div class="sales-field"><label>Area background</label><input id="pdf-background-color" type="color" value="#ffffff" class="pdf-color-input"></div></div><label class="flex items-center gap-2 text-[9px] text-slate-600"><input id="pdf-cover-old" type="checkbox" checked> Old text/background cover karein</label><div class="grid grid-cols-2 gap-2"><button onclick="pdfEditorApply()" class="sales-btn sales-btn-primary justify-center"><i class="fas fa-check"></i> Apply text</button><button onclick="pdfEditorDeleteSelected()" class="sales-btn justify-center"><i class="fas fa-trash"></i> Remove edit</button></div></div></section>
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
        if (request !== state.renderId) return;
        const canvas = byId('pdf-canvas'), stage = byId('pdf-stage'), context = canvas.getContext('2d', { alpha: false });
        canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        canvas.style.width = `${viewport.width}px`; canvas.style.height = `${viewport.height}px`;
        stage.style.width = `${viewport.width}px`; stage.style.height = `${viewport.height}px`;
        context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: context, viewport, background: 'rgb(255,255,255)' }).promise;
        const text = await page.getTextContent();
        state.textItems = text.items.filter(item => String(item.str || '').trim()).map((item, index) => {
            const transform = window.pdfjsLib.Util.transform(viewport.transform, item.transform);
            const fontHeight = Math.max(5, Math.hypot(transform[2], transform[3]));
            return { index, text: item.str, x: transform[4], y: transform[5] - fontHeight, width: Math.max(4, Number(item.width || 0) * state.zoom), height: fontHeight };
        });
        renderTextLayer(); renderEditLayer(); clearSelection(false); renderPageList();
        byId('pdf-current-page').textContent = state.page;
        byId('pdf-zoom-label').textContent = `${Math.round(state.zoom * 100)}%`;
        byId('pdf-text-count').textContent = `${state.textItems.length} items`;
        setBusy(state.textItems.length ? `${state.textItems.length} text items detected - click text or draw an area` : 'No selectable text detected - draw an area manually');
        page.cleanup();
    }

    function renderTextLayer() {
        const layer = byId('pdf-text-layer');
        layer.innerHTML = state.textItems.map(item => `<button type="button" class="pdf-detected-text" style="left:${item.x}px;top:${item.y}px;width:${item.width}px;height:${item.height}px" onclick="event.stopPropagation();pdfEditorSelectText(${item.index})" title="${esc(item.text)}"></button>`).join('');
    }

    function renderEditLayer() {
        const layer = byId('pdf-edit-layer'), width = byId('pdf-canvas').width, height = byId('pdf-canvas').height;
        layer.innerHTML = state.edits.filter(edit => edit.page === state.page).map(edit => {
            const r = edit.rect, x = r.x * width, y = r.y * height, w = r.width * width, h = r.height * height;
            const selected = state.selectedEditId === edit.id ? ' selected' : '';
            return `<button type="button" class="pdf-edit-preview${selected}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${edit.cover === false ? 'transparent' : edit.backgroundColor};color:${edit.textColor};font-size:${edit.fontSize * state.zoom}px;text-align:${edit.align}" onclick="event.stopPropagation();pdfEditorSelectEdit('${edit.id}')">${esc(edit.text)}</button>`;
        }).join('');
        renderEditList();
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
        const canvas = byId('pdf-canvas'), box = byId('pdf-selection-box');
        state.selection = { x: rect.x / canvas.width, y: rect.y / canvas.height, width: rect.width / canvas.width, height: rect.height / canvas.height };
        state.selectedEditId = editId;
        box.classList.remove('hidden');
        Object.assign(box.style, { left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.width}px`, height: `${rect.height}px` });
        byId('pdf-original-text').value = original;
        byId('pdf-selection-status').textContent = editId ? 'Edit selected' : 'Area selected';
        renderEditLayer();
    }

    function selectText(index) {
        const item = state.textItems.find(row => row.index === index);
        if (!item) return;
        selectRect({ x: item.x - 2, y: item.y - 1, width: item.width + 4, height: item.height + 3 }, item.text);
        byId('pdf-replacement-text').value = item.text;
        byId('pdf-font-size').value = clamp(Math.round(item.height / state.zoom), 5, 72);
    }

    function selectEdit(id) {
        const edit = state.edits.find(row => row.id === id);
        if (!edit) return;
        const canvas = byId('pdf-canvas');
        selectRect({ x: edit.rect.x * canvas.width, y: edit.rect.y * canvas.height, width: edit.rect.width * canvas.width, height: edit.rect.height * canvas.height }, edit.original || '', edit.id);
        byId('pdf-replacement-text').value = edit.text;
        byId('pdf-font-size').value = edit.fontSize;
        byId('pdf-text-align').value = edit.align;
        byId('pdf-text-color').value = edit.textColor;
        byId('pdf-background-color').value = edit.backgroundColor;
        byId('pdf-cover-old').checked = edit.cover !== false;
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
        const row = {
            id: state.selectedEditId || `EDIT-${Date.now()}`, page: state.page, rect: { ...state.selection },
            original: byId('pdf-original-text').value, text, fontSize: clamp(Number(byId('pdf-font-size').value || 11), 5, 72),
            align: byId('pdf-text-align').value, textColor: byId('pdf-text-color').value,
            backgroundColor: byId('pdf-background-color').value, cover: byId('pdf-cover-old').checked
        };
        if (state.viewport) {
            const canvas = byId('pdf-canvas'), x1 = row.rect.x * canvas.width, y1 = row.rect.y * canvas.height, x2 = (row.rect.x + row.rect.width) * canvas.width, y2 = (row.rect.y + row.rect.height) * canvas.height;
            const first = state.viewport.convertToPdfPoint(x1, y1), second = state.viewport.convertToPdfPoint(x2, y2);
            row.pdfRect = { x: Math.min(first[0], second[0]), y: Math.min(first[1], second[1]), width: Math.abs(second[0] - first[0]), height: Math.abs(second[1] - first[1]) };
        }
        const index = state.edits.findIndex(edit => edit.id === row.id);
        if (index >= 0) state.edits[index] = row; else state.edits.push(row);
        state.selectedEditId = row.id; renderEditLayer(); renderPageList();
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
        state.selection = null; state.selectedEditId = null;
        byId('pdf-selection-box')?.classList.add('hidden');
        const status = byId('pdf-selection-status'); if (status) status.textContent = 'None';
        if (clearInputs) { if (byId('pdf-original-text')) byId('pdf-original-text').value = ''; if (byId('pdf-replacement-text')) byId('pdf-replacement-text').value = ''; }
    }

    function resetRuntime() {
        if (state.pdf) state.pdf.destroy().catch(() => {});
        if (state.output?.url) URL.revokeObjectURL(state.output.url);
        Object.assign(state, { file: null, sourceBytes: null, pdf: null, viewport: null, page: 1, pages: 0, zoom: 1.15, textItems: [], selection: null, edits: [], selectedEditId: null, output: null, dragging: false, dragStart: null });
        byId('pdf-editor-empty')?.classList.remove('hidden'); byId('pdf-editor-workspace')?.classList.add('hidden'); byId('pdf-output-panel')?.classList.add('hidden');
        if (byId('pdf-export-btn')) byId('pdf-export-btn').disabled = true;
    }

    window.pdfEditorLoad = file => load(file);
    window.pdfEditorChoose = event => chooseFile(event);
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
