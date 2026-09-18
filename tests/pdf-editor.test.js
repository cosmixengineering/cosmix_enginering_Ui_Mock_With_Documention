const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const librarySource = fs.readFileSync(path.join(root, 'assets', 'vendor', 'pdf-tools', 'pdf-lib.min.js'), 'utf8');
const coreSource = fs.readFileSync(path.join(root, 'assets', 'js', 'pdf-editor-core.js'), 'utf8');
const pdfjs = require(path.join(root, 'assets', 'vendor', 'pdf-tools', 'pdf.min.js'));
pdfjs.GlobalWorkerOptions.workerSrc = path.join(root, 'assets', 'vendor', 'pdf-tools', 'pdf.worker.min.js');

function editorContext() {
    const context = { console, Date, Uint8Array, ArrayBuffer, TextEncoder, TextDecoder, setTimeout, clearTimeout };
    context.window = context;
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(librarySource, context, { filename: 'pdf-lib.min.js' });
    vm.runInContext(coreSource, context, { filename: 'pdf-editor-core.js' });
    return context;
}

test('PDF editor core paints replacements into a new readable PDF', async () => {
    const context = editorContext();
    const source = await context.PDFLib.PDFDocument.create();
    source.addPage();
    const sourceBytes = await source.save();
    const output = await context.CosmixPdfEditorCore.createEditedPdfBytes(sourceBytes, [{
        page: 1,
        rect: { x: .1, y: .1, width: .5, height: .05 },
        text: 'Replacement text', fontSize: 12, align: 'left', textColor: '#111827', backgroundColor: '#ffffff', cover: true
    }]);
    const reopened = await context.PDFLib.PDFDocument.load(output);
    assert.equal(reopened.getPageCount(), 1);
    assert.equal(reopened.getCreator(), 'Cosmix Engineering PDF Editor');
    assert.ok(output.length > sourceBytes.length);
});

test('bundled PDF viewer parses a real local PDF with its matching worker', async () => {
    const bytes = new Uint8Array(fs.readFileSync(path.join(root, 'output', 'pdf', 'Cosmix-PDF-Editor-Demo-Output.pdf')));
    const document = await pdfjs.getDocument({ data: bytes, isEvalSupported: false, useWorkerFetch: false }).promise;
    assert.equal(document.numPages, 3);
    const page = await document.getPage(1);
    const text = await page.getTextContent();
    assert.ok(text.items.length > 0);
    await document.destroy();
});

test('PDF editor page includes upload, selection, replacement and export controls', () => {
    const html = fs.readFileSync(path.join(root, 'sales', 'pdf-editor.html'), 'utf8');
    const ui = fs.readFileSync(path.join(root, 'assets', 'js', 'pdf-editor.js'), 'utf8');
    assert.ok(html.includes('pdf-editor-core.js'));
    assert.ok(html.includes('pdf-editor.js'));
    assert.ok(html.indexOf('pdf.worker.min.js') < html.indexOf('pdf.min.js'));
    assert.ok(ui.includes('Upload a PDF to edit'));
    assert.ok(ui.includes('onclick="pdfEditorChoose(event)"'));
    assert.ok(ui.includes("drop.addEventListener('drop'"));
    assert.ok(ui.includes("window.pdfEditorChoose"));
    assert.ok(ui.includes('window.devicePixelRatio'));
    assert.ok(ui.includes('transform: [state.outputScale'));
    assert.ok(ui.includes('HD ${state.outputScale'));
    assert.equal(ui.includes('rect.x / canvas.width'), false);
    assert.ok(ui.includes('Replacement text'));
    assert.ok(ui.includes('convertToPdfPoint'));
    assert.ok(ui.includes('Export edited PDF'));
    assert.ok(ui.includes('CosmixPdfEditorCore.createEditedPdfBytes'));
});
