const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'sales-store.js'), 'utf8');
const pagesSource = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'sales-pages.js'), 'utf8');

function createStore(storage = new Map()) {
    const localStorage = {
        getItem(key) { return storage.get(key) ?? null; },
        setItem(key, value) { storage.set(key, value); }
    };
    const window = { localStorage };
    vm.runInNewContext(source, { window, console, Date, JSON, Math, Number, String }, { filename: 'sales-store.js' });
    return window.CosmixSales;
}

test('seed includes the confirmed sales workflow records', () => {
    const store = createStore();
    assert.equal(store.state.inquiries.length, 6);
    assert.equal(store.state.selections[0].systems, 13);
    assert.equal(store.state.selections[0].pieces, 127);
    assert.equal(store.state.costing.sourceTotal, 22777260);
    assert.equal(store.state.costing.lines.length, 28);
    assert.equal(store.state.costing.lines.reduce((sum, x) => sum + (x.qty * x.pkrRate), 0), 22777260);
    const cassette45 = store.state.costing.lines.find(x => x.model === 'ARVCA-H45/NR3DQB');
    const cassette71 = store.state.costing.lines.find(x => x.model === 'ARVCA-H71/NR3DQB');
    assert.equal(cassette45.baseUnitRate + cassette45.accessoryUnitRate, cassette45.pkrRate);
    assert.equal(cassette71.baseUnitRate + cassette71.accessoryUnitRate, cassette71.pkrRate);
    assert.equal(store.state.substitutions.every(x => x.status === 'Boss Approved'), true);
    assert.equal(store.state.costing.lines[0].source, 'Rate Book');
    assert.equal(JSON.stringify(store.state).includes('CEO Rate Book'), false);
});

test('legacy CEO rate-book labels migrate without resetting saved sales data', () => {
    const storage = new Map();
    const initial = createStore(storage);
    initial.addInquiry({ client: 'Saved Client', project: 'Saved Project' });
    const saved = JSON.parse(storage.get('cosmix_sales_mock_v2'));
    saved.costing.lines[0].source = 'CEO Rate Book';
    saved.rateBook.edition = 'CEO Printed Rate Book · demonstration register';
    saved.catalogImports[0].file = 'CEO_Rate_Book_Reference.xlsx';
    storage.set('cosmix_sales_mock_v2', JSON.stringify(saved));

    const migrated = createStore(storage);
    assert.equal(migrated.state.inquiries[0].client, 'Saved Client');
    assert.equal(migrated.state.costing.lines[0].source, 'Rate Book');
    assert.equal(migrated.state.rateBook.edition, 'Rate Book · demonstration register');
    assert.equal(migrated.state.catalogImports[0].file, 'Rate_Book_Reference.xlsx');
    assert.equal(storage.get('cosmix_sales_mock_v2').includes('CEO Rate Book'), false);
});

test('cost component mutation does not rewrite a submitted quotation snapshot', () => {
    const store = createStore();
    const before = store.state.quotations.find(x => x.id === 'QTN-2609-018').value;
    store.addComponent({ name: 'Freight / Logistics', mode: 'Fixed', value: 50000, base: 'Whole quotation', amount: 50000 });
    assert.equal(store.state.quotations.find(x => x.id === 'QTN-2609-018').value, before);
});

test('late quotation revision keeps the record and creates a controlled draft revision', () => {
    const store = createStore();
    const original = JSON.parse(JSON.stringify(store.findQuote('QTN-2604-006::R1')));
    const before = store.state.quotations.length;
    const row = store.createQuoteRevision('QTN-2604-006::R1');
    assert.equal(row.rev, 'R2');
    assert.equal(row.status, 'Draft');
    assert.equal(row.submitted, '');
    assert.equal(row.dispatch, 'Not sent');
    assert.equal(store.state.quotations.length, before + 1);
    assert.deepEqual(JSON.parse(JSON.stringify(store.findQuote('QTN-2604-006::R1'))), original);
});

test('boss approval freezes the current costing status and review components', () => {
    const store = createStore();
    const blocked = store.approveCosting();
    assert.equal(blocked.ok, false);
    store.recordSelectionDecision('SEL-2609-014-R1', 'Exclude with reason', 'Client scope excludes air-flow panels.');
    const approved = store.approveCosting('Approved after accessory decision.');
    assert.equal(approved.ok, true);
    assert.equal(store.state.costing.status, 'Approved');
    assert.equal(store.state.costing.components.filter(x => x.status === 'Boss Review').length, 0);
    assert.equal(store.state.costing.approvedSnapshots.length, 1);
    assert.equal(store.addComponent({ name: 'Late change', amount: 1 }), null);
});

test('rate selection is isolated to one item and specification group', () => {
    const store = createStore();
    store.updateRate('VRQ-2609-008', { status: 'Selected' });
    store.selectRate('VRQ-2609-007');
    assert.equal(store.state.rates.find(x => x.id === 'VRQ-2609-007').status, 'Selected');
    assert.equal(store.state.rates.find(x => x.id === 'VRQ-2609-008').status, 'Selected');
});

test('expired quotation acceptance is routed to commercial revalidation', () => {
    const store = createStore();
    const result = store.acceptQuote('QTN-2609-018::R2', { acceptedDate: '2026-10-15' });
    assert.equal(result.ok, false);
    assert.equal(result.late, true);
    assert.equal(store.findQuote('QTN-2609-018::R2').status, 'Commercial Revalidation Required');
});

test('manual cassette quotation adds base unit, grille and remote without double counting', () => {
    const store = createStore();
    const result = store.addManualQuoteItem('ARVCA-H45/NR3DQB', 2, { includeLinked: true, yJointModel: 'AFG-00B', yJointQty: 1 });
    assert.equal(result.ok, true);
    assert.equal(result.added.length, 1);
    assert.equal(store.state.manualQuotation.lines.length, 1);
    assert.equal(result.row.baseUnitPrice, 174900);
    assert.equal(result.row.grilleModel, 'MB10');
    assert.equal(result.row.grilleUnitPrice, 33000);
    assert.equal(result.row.controllerModel, 'YK-H');
    assert.equal(result.row.controllerUnitPrice, 6600);
    assert.equal(result.row.yJointModel, 'AFG-00B');
    assert.equal(store.manualQuoteTotals().subtotal, 438900);
});

test('manual package quantity updates linked columns and removal deletes one package row', () => {
    const store = createStore();
    const result = store.addManualQuoteItem('ARVMD-H100/4R1M', 2, { includeLinked: true });
    store.updateManualQuoteLine(result.row.id, { qty: 5 });
    assert.equal(result.row.controllerModel, 'XK-05A');
    assert.equal(result.row.controllerQty, 5);
    store.removeManualQuoteLine(result.row.id);
    assert.equal(store.state.manualQuotation.lines.length, 0);
});

test('catalogue imports become searchable quotation models with linked component prices', () => {
    const store = createStore();
    const result = store.upsertCatalogItems([{ Code: 'FAN-001', Category: 'Fan', Brand: 'Demo', Model: 'CF-900', Description: 'Commercial exhaust fan', Unit: 'pc', Price: '125,000', 'Controller Model': 'CTRL-9', 'Controller Price': '8,500' }], 'Fans.xlsx');
    assert.equal(result.added, 1);
    const item = store.manualCatalog().find(x => x.model === 'CF-900');
    assert.equal(item.price, 125000);
    assert.equal(store.manualLinkedItems('CF-900')[0].item.model, 'CTRL-9');
    assert.equal(store.state.catalogImports[0].file, 'Fans.xlsx');
});

test('reset restores seed after local mutations', () => {
    const store = createStore();
    store.addInquiry({ client: 'Temporary Client', project: 'Temporary Project' });
    assert.equal(store.state.inquiries.length, 7);
    store.reset();
    assert.equal(store.state.inquiries.length, 6);
    assert.equal(store.state.inquiries.some(x => x.client === 'Temporary Client'), false);
});

test('in-memory actions still work when localStorage is denied', () => {
    const window = { localStorage: { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } } };
    vm.runInNewContext(source, { window, console, Date, JSON, Math, Number, String }, { filename: 'sales-store.js' });
    window.CosmixSales.addInquiry({ client: 'Memory Client', project: 'Memory Project' });
    assert.equal(window.CosmixSales.state.inquiries[0].client, 'Memory Client');
    assert.equal(window.CosmixSales.storageAvailable, false);
});

test('all Sales screens render their main content without runtime errors', () => {
    const storage = new Map();
    const window = { localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }, location: { search: '?id=SEL-2609-014-R1' } };
    const captured = [];
    const context = {
        window, console, Date, JSON, Math, Number, String, URLSearchParams, decodeURIComponent, encodeURIComponent,
        renderLayout(page) { captured.push({ page }); },
        setPageContent(title, html) { captured.at(-1).title = title; captured.at(-1).html = html; }
    };
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'sales-store.js' });
    vm.runInContext(pagesSource, context, { filename: 'sales-pages.js' });
    window.CosmixSales.addManualQuoteItem('ARVWM-H022/NR1DJA', 1, { includeLinked: true });
    for (const page of ['dashboard', 'inquiries', 'selection', 'selection-detail', 'costing', 'catalog', 'manual-quotation', 'rates', 'quotations', 'quotation-detail', 'settings', 'workflow']) {
        window.location.search = page === 'quotation-detail' ? '?id=QTN-2609-019&rev=R1' : page === 'selection-detail' ? '?id=SEL-2609-014-R1' : '';
        window.renderSalesPage(page);
    }
    assert.equal(captured.length, 12);
    for (const result of captured) {
        assert.ok(result.title.length > 5);
        if (!['Manual Quotation Sheet','Product Catalogue & Import'].includes(result.title)) assert.ok(result.html.includes('Local mock data'));
        assert.ok(result.html.length > 1000);
    }
    const detail = captured.find(x => x.title === 'AUX Selection Detail');
    assert.ok(detail.html.includes('INDUS MOTOR, ADMIN BUILDING'));
    assert.ok(detail.html.includes('GF-CU-01'));
    assert.equal((detail.html.match(/class="aux-system-card"/g) || []).length, 13);
    const dashboard = captured.find(x => x.title === 'Sales Operations Dashboard');
    const inquiries = captured.find(x => x.title === 'Inquiries & Tenders');
    const costing = captured.find(x => x.title === 'BOQ & Flexible Costing');
    const manual = captured.find(x => x.title === 'Manual Quotation Sheet');
    assert.ok(dashboard.html.includes('Sales overview'));
    assert.ok(dashboard.html.includes('Work queue'));
    assert.ok(inquiries.html.includes('sales-register-toolbar'));
    assert.ok(costing.html.includes('sales-cost-nav'));
    assert.ok(manual.html.includes('<th colspan="8">Equipment</th>'));
    assert.ok(manual.html.includes('<th colspan="4">Remote / Controller</th>'));
    assert.ok(manual.html.includes('<th rowspan="2">Line Total</th>'));
    assert.ok(manual.html.includes('Not applicable'));
    assert.ok(manual.html.includes('Not selected'));
    assert.ok(pagesSource.includes("cellStyles:true"));
    assert.equal([dashboard, inquiries, costing].some(x => x.html.includes('HTML MOCKUP')), false);
});
