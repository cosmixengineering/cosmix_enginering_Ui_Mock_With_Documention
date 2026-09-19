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
    assert.equal(store.state.substitutions.every(x => x.status === 'Management Approved'), true);
    assert.equal(store.state.approvalInbox.length, 4);
    assert.equal(store.state.approvalInbox.filter(x => x.unread).length, 2);
    assert.equal(store.state.tenderDocuments.templates.length, 3);
    assert.equal(store.state.tenderDocuments.workspace.documents.length, 6);
    assert.equal(store.state.costing.lines[0].source, 'Rate Book');
    assert.equal(store.state.manualQuotation.project, 'HVAC Equipment Quotation');
    assert.equal(store.state.costing.components.some(x => x.mode === 'Manual'), false);
    assert.equal(store.state.salesSetup.categories.length, 5);
    assert.equal(store.state.salesSetup.units.length, 5);
    assert.equal(store.state.salesSetup.vendors.length, 4);
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
    saved.manualQuotation.project = 'Manual HVAC Quotation';
    saved.costing.components[0].mode = 'Manual';
    saved.substitutions[0].status = 'Boss Approved';
    saved.costing.status = 'Boss Approval Pending';
    delete saved.approvalInbox;
    delete saved.salesSetup;
    storage.set('cosmix_sales_mock_v2', JSON.stringify(saved));

    const migrated = createStore(storage);
    assert.equal(migrated.state.inquiries[0].client, 'Saved Client');
    assert.equal(migrated.state.costing.lines[0].source, 'Rate Book');
    assert.equal(migrated.state.rateBook.edition, 'Rate Book · demonstration register');
    assert.equal(migrated.state.catalogImports[0].file, 'Rate_Book_Reference.xlsx');
    assert.equal(migrated.state.manualQuotation.project, 'HVAC Equipment Quotation');
    assert.equal(migrated.state.costing.components[0].mode, 'Entered amount');
    assert.equal(migrated.state.substitutions[0].status, 'Management Approved');
    assert.equal(migrated.state.costing.status, 'Management Review Pending');
    assert.equal(migrated.state.approvalInbox.length, 4);
    assert.equal(migrated.state.salesSetup.vendors.length, 4);
    assert.equal(storage.get('cosmix_sales_mock_v2').includes('CEO Rate Book'), false);
});

test('cost component mutation does not rewrite a submitted quotation snapshot', () => {
    const store = createStore();
    const before = store.state.quotations.find(x => x.id === 'QTN-2609-018').value;
    store.addComponent({ name: 'Freight / Logistics', mode: 'Fixed', value: 50000, base: 'Whole quotation', amount: 50000 });
    assert.equal(store.state.quotations.find(x => x.id === 'QTN-2609-018').value, before);
});

test('BOQ rate entry updates the line source evidence and recalculates the sheet amount', () => {
    const store = createStore();
    const before = store.state.costing.sourceTotal;
    const row = store.updateCostLine(28, {
        source: 'Vendor call / quotation',
        sourceRate: 15000,
        pkrRate: 15000,
        rateVendor: 'Market Vendor',
        rateReference: 'Phone response',
        rateValidUntil: '2026-09-30',
        rateNote: 'Rate confirmed for four panels.'
    });
    assert.equal(row.source, 'Vendor call / quotation');
    assert.equal(row.rateVendor, 'Market Vendor');
    assert.equal(store.state.costing.sourceTotal, before + 60000);
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

test('received management approval freezes the current costing status and review components', () => {
    const store = createStore();
    const blocked = store.approveCosting();
    assert.equal(blocked.ok, false);
    store.recordSelectionDecision('SEL-2609-014-R1', 'Exclude with reason', 'Client scope excludes air-flow panels.');
    const approved = store.approveCosting('Approved after accessory decision.');
    assert.equal(approved.ok, true);
    assert.equal(store.state.costing.status, 'Approved');
    assert.equal(store.state.costing.components.filter(x => x.status === 'Management Review').length, 0);
    assert.equal(store.state.costing.approvedSnapshots.length, 1);
    assert.equal(store.addComponent({ name: 'Late change', amount: 1 }), null);
});

test('Sales can receive, acknowledge and apply a management quotation decision', () => {
    const store = createStore();
    const before = store.findQuote('QTN-2609-019::R1');
    assert.equal(before.value, 27287895);
    const acknowledged = store.acknowledgeApproval('APR-2609-024');
    assert.equal(acknowledged.ok, true);
    assert.equal(acknowledged.row.unread, false);
    const applied = store.applyApprovalDecision('APR-2609-024');
    assert.equal(applied.ok, true);
    assert.equal(applied.quote.value, 26950000);
    assert.equal(applied.quote.status, 'Approved');
    assert.equal(applied.row.status, 'Applied');
    assert.ok(applied.row.appliedAt);
});

test('approval request submission is deduplicated while awaiting management', () => {
    const store = createStore();
    const before = store.state.approvalInbox.length;
    const first = store.submitApprovalRequest({ sourceRef: 'SEL-NEW-PANELS', type: 'Accessory Decision', client: 'Test Client' });
    const second = store.submitApprovalRequest({ sourceRef: 'SEL-NEW-PANELS', type: 'Accessory Decision', client: 'Test Client' });
    assert.equal(first.ok, true);
    assert.equal(first.existing, false);
    assert.equal(second.existing, true);
    assert.equal(store.state.approvalInbox.length, before + 1);
});

test('tender package keeps editable values, merge order, compression and build history', () => {
    const store = createStore();
    const before = store.tenderPackageTotals();
    assert.equal(before.documents, 6);
    assert.equal(before.sourceSizeMB, 270.2);
    assert.equal(store.updateTenderField('attention', 'Procurement Committee').value, 'Procurement Committee');
    store.updateTenderField('client', 'New Tender Client');
    assert.equal(store.state.tenderDocuments.workspace.client, 'New Tender Client');
    assert.equal(store.selectTenderTemplate('TPL-TND-002').revision, 'R2');
    assert.equal(store.state.tenderDocuments.workspace.sections.find(x => x.mode === 'Locked template').source, 'Template R2');
    const added = store.addTenderDocuments([{ name: 'Addendum-01.pdf', type: 'application/pdf', size: 2 * 1048576 }]);
    assert.equal(added.length, 1);
    assert.equal(store.state.tenderDocuments.workspace.documents.at(-1).name, 'Addendum-01.pdf');
    assert.equal(store.moveTenderDocument(added[0].id, -1), true);
    assert.equal(store.removeTenderDocument('DOC-001'), false);
    store.updateTenderCompression({ profile: 'Maximum', preserveOriginal: true });
    const compressed = store.tenderPackageTotals();
    assert.ok(compressed.outputSizeMB < before.outputSizeMB);
    const built = store.buildTenderPackage();
    assert.equal(built.ok, true);
    assert.equal(built.row.documents, 7);
    assert.equal(built.row.originalPreserved, true);
    assert.equal(store.state.tenderDocuments.workspace.status, 'Package prepared');

    const actual = store.buildTenderPackage({
        sourceSizeMB: 2.4,
        outputSizeMB: 1.1,
        pages: 8,
        status: 'Ready to download'
    });
    assert.equal(actual.ok, true);
    assert.equal(actual.row.sourceSizeMB, 2.4);
    assert.equal(actual.row.outputSizeMB, 1.1);
    assert.equal(actual.row.pages, 8);
    assert.equal(actual.row.status, 'Ready to download');
});

test('rate selection is isolated to one item and specification group', () => {
    const store = createStore();
    store.updateRate('VRQ-2609-008', { status: 'Selected' });
    store.selectRate('VRQ-2609-007');
    assert.equal(store.state.rates.find(x => x.id === 'VRQ-2609-007').status, 'Selected');
    assert.equal(store.state.rates.find(x => x.id === 'VRQ-2609-008').status, 'Selected');
});

test('vendor market update keeps the old dated rate and creates a new revision', () => {
    const store = createStore();
    const before = store.state.rates.length;
    const previous = store.state.rates.find(x => x.id === 'VRQ-2609-007');
    const revised = store.reviseRate(previous.id, {
        rate: 5100,
        rateDate: '2026-09-19',
        validUntil: '2026-10-03',
        evidence: 'Updated vendor call'
    });
    assert.equal(store.state.rates.length, before + 1);
    assert.equal(previous.status, 'Superseded');
    assert.equal(revised.parentRateId, previous.id);
    assert.equal(revised.revision, 2);
    assert.equal(revised.rate, 5100);
});

test('Sales master setup adds reusable categories, units and vendors without duplicates', () => {
    const store = createStore();
    const category = store.upsertSalesSetup('categories', { name: 'Fire Fighting' });
    const unit = store.upsertSalesSetup('units', { name: 'Running Foot', symbol: 'rft' });
    const vendor = store.upsertSalesSetup('vendors', { name: 'New Vendor', city: 'Karachi', categories: ['Fire Fighting'] });
    assert.equal(category.ok, true);
    assert.match(category.row.id, /^CAT-\d{3}$/);
    assert.equal(unit.row.symbol, 'rft');
    assert.equal(vendor.row.categories[0], 'Fire Fighting');
    assert.equal(store.upsertSalesSetup('categories', { name: 'fire fighting' }).ok, false);
    assert.equal(store.toggleSalesSetup('vendors', vendor.row.id).status, 'Inactive');
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

test('AUX selection pricing auto-fills exact rates and supports a reviewed replacement rate', () => {
    const store = createStore();
    const sheet = store.prepareSelectionPricing('SEL-2609-014-R1', [
        ['Outdoor Unit', 'ARV-H160/NR1A', 'MINI 50/60Hz', 2],
        ['Indoor Unit', 'ARVCA-H45/NR1DYBA', 'Compact 4-way cassette', 1]
    ]);
    assert.equal(sheet.lines[0].unitPrice, 726000);
    assert.equal(sheet.lines[0].status, 'Rate matched');
    assert.equal(sheet.lines[1].unitPrice, 0);
    assert.equal(store.selectionPricingTotals().unresolved, 1);
    const candidates = store.selectionPricingCandidates(sheet.lines[1].id);
    assert.equal(candidates[0].model, 'ARVCA-H45/NR3DQB');
    assert.equal(candidates[0].recommended, true);
    store.applySelectionPricingRate(sheet.lines[1].id, candidates[0].model);
    assert.equal(sheet.lines[1].unitPrice, 174900);
    assert.equal(sheet.lines[1].rateModel, 'ARVCA-H45/NR3DQB');
    assert.equal(store.selectionPricingTotals().subtotal, 1626900);
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
    for (const page of ['dashboard', 'inquiries', 'selection', 'selection-detail', 'selection-pricing', 'costing', 'approvals', 'catalog', 'quotation-builder', 'rates', 'master-data', 'quotations', 'quotation-detail', 'tender-documents', 'settings', 'workflow']) {
        window.location.search = page === 'quotation-detail' ? '?id=QTN-2609-019&rev=R1' : page === 'selection-detail' ? '?id=SEL-2609-014-R1' : '';
        window.renderSalesPage(page);
    }
    assert.equal(captured.length, 16);
    for (const result of captured) {
        assert.ok(result.title.length > 5);
        if (!['Quotation Builder','Product Catalogue & Import'].includes(result.title)) assert.ok(result.html.includes('Local mock data'));
        assert.ok(result.html.length > 1000);
    }
    const detail = captured.find(x => x.title === 'AUX Selection Detail');
    assert.ok(detail.html.includes('INDUS MOTOR, ADMIN BUILDING'));
    assert.ok(detail.html.includes('GF-CU-01'));
    assert.ok(detail.html.includes('80 in Costing'));
    assert.ok(detail.html.includes('Selection: 0 · fixed AUX values'));
    assert.ok(detail.html.includes('Prepare Pricing Sheet'));
    assert.equal((detail.html.match(/class="aux-system-card"/g) || []).length, 13);
    const dashboard = captured.find(x => x.title === 'Sales Operations Dashboard');
    const inquiries = captured.find(x => x.title === 'Inquiries & Tenders');
    const costing = captured.find(x => x.title === 'BOQ & Flexible Costing');
    const approvals = captured.find(x => x.title === 'Management Decisions');
    const builder = captured.find(x => x.title === 'Quotation Builder');
    const selectionPricing = captured.find(x => x.title === 'Selection Pricing Sheet');
    const vendorRates = captured.find(x => x.title === 'Vendor Rate Register');
    const masterData = captured.find(x => x.title === 'Sales Master Setup');
    const tenderDocuments = captured.find(x => x.title === 'Tender Documents');
    assert.ok(dashboard.html.includes('Sales overview'));
    assert.ok(dashboard.html.includes('Work queue'));
    assert.ok(inquiries.html.includes('sales-register-toolbar'));
    assert.ok(costing.html.includes('sales-cost-nav'));
    assert.ok(costing.html.includes('BOQ rate filling'));
    assert.ok(costing.html.includes('Client BOQ · Rate entry sheet'));
    assert.ok(costing.html.includes('Requirement sheet received'));
    assert.ok(costing.html.includes('Rate required 1'));
    assert.ok(costing.html.includes('Vendor call / quotation'));
    assert.ok(approvals.html.includes("salesReviewApproval('APR-2609-024')"));
    assert.ok(pagesSource.includes('Approved final'));
    assert.ok(pagesSource.includes('Boss / management response'));
    assert.ok(pagesSource.includes('Required Sales action'));
    assert.ok(pagesSource.includes('Decision trail'));
    assert.ok(pagesSource.includes('Acknowledge before applying'));
    assert.ok(builder.html.includes('<th colspan="8">Equipment</th>'));
    assert.ok(builder.html.includes('<th colspan="4">Remote / Controller</th>'));
    assert.ok(builder.html.includes('<th rowspan="2">Line Total</th>'));
    assert.ok(builder.html.includes('Not applicable'));
    assert.ok(builder.html.includes('Not selected'));
    assert.ok(builder.html.includes('Equipment Quotation Worksheet'));
    assert.equal(builder.html.includes('Manual Equipment Quotation'), false);
    assert.ok(selectionPricing.html.includes('Fill Rates'));
    assert.ok(selectionPricing.html.includes('Fill Rates (4)'));
    assert.ok(selectionPricing.html.includes('Download Excel'));
    assert.ok(selectionPricing.html.includes('Download Document'));
    assert.ok(vendorRates.html.includes('Saved vendor rates'));
    assert.ok(vendorRates.html.includes('Categories, units & vendors'));
    assert.ok(pagesSource.includes('Apply a saved vendor rate'));
    assert.ok(pagesSource.includes('salesApplySavedVendorRate'));
    assert.ok(masterData.html.includes('Item categories'));
    assert.ok(masterData.html.includes('Units of measure'));
    assert.ok(masterData.html.includes('Sales vendor directory'));
    assert.ok(tenderDocuments.html.includes('PDF merge order'));
    assert.ok(tenderDocuments.html.includes('Compression & output'));
    assert.ok(tenderDocuments.html.includes('Original PDFs'));
    assert.ok(tenderDocuments.html.includes('Working locally in this browser'));
    assert.ok(tenderDocuments.html.includes('Generate merged PDF'));
    assert.ok(pagesSource.includes('PDFDocument.load'));
    assert.ok(pagesSource.includes('copyPages'));
    assert.ok(pagesSource.includes('pdfjsLib.getDocument'));
    assert.ok(pagesSource.includes('embedJpg'));
    assert.ok(pagesSource.includes('URL.createObjectURL'));
    assert.ok(pagesSource.includes("cellStyles:true"));
    assert.ok(pagesSource.includes('-Equipment-Quotation.xlsx'));
    assert.equal(pagesSource.includes('-Manual-Quotation.xlsx'), false);
    assert.equal([dashboard, inquiries, costing].some(x => x.html.includes('HTML MOCKUP')), false);
});

test('management Review opens a complete read-only decision popup', () => {
    const storage = new Map();
    const window = {
        localStorage: {
            getItem: key => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, value)
        },
        location: { search: '' }
    };
    let modal = null;
    let modalWidth = '';
    const context = {
        window, console, Date, JSON, Math, Number, String, URLSearchParams, decodeURIComponent, encodeURIComponent,
        openModal(title, body, onConfirm) { modal = { title, body, onConfirm }; },
        setModalWidth(width) { modalWidth = width; },
        showToast() {}
    };
    vm.createContext(context);
    vm.runInContext(source, context, { filename: 'sales-store.js' });
    vm.runInContext(pagesSource, context, { filename: 'sales-pages.js' });

    window.salesReviewApproval('APR-2609-024');

    assert.equal(modal.title, 'Management decision · APR-2609-024');
    assert.equal(modalWidth, 'max-w-4xl');
    assert.ok(modal.body.includes('Final selling price, discount and dispatch clearance'));
    assert.ok(modal.body.includes('Issue the final quotation at Rs. 26,950,000'));
    assert.ok(modal.body.includes('Rs. 26,950,000'));
    assert.ok(modal.body.includes('15 days'));
    assert.ok(modal.body.includes('Acknowledge decision'));
    assert.ok(modal.body.includes('Open source record'));

    window.salesReviewApproval('APR-2609-023');
    assert.ok(modal.body.includes('Management response pending'));
    assert.equal(modal.body.includes('Approved final'), false);
});
