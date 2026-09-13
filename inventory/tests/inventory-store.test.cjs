/* Run with: node --test inventory/tests/inventory-store.test.cjs */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const script = name => fs.readFileSync(path.join(root, 'assets/js', name), 'utf8');
function boot() {
    const storage = new Map();
    const context = vm.createContext({
        localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
        document: { addEventListener() {} }, location: { search: '', hash: '' }, URLSearchParams, addEventListener() {},
        console, setTimeout, clearTimeout
    });
    context.window = context;
    vm.runInContext(script('inventory-store.js'), context);
    return { S: context.InventoryStore, context };
}
const snapshot = S => JSON.stringify(S.data);
test('delivery refresh completes when browser storage access is denied', () => {
    const { context } = boot();
    const nodes = new Map();
    const node = () => ({ innerHTML: '', innerText: '', style: {}, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } }, remove() {}, removeAttribute() {}, insertAdjacentHTML() {}, querySelectorAll() { return []; } });
    const byId = id => { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); };
    context.document = { getElementById: byId, querySelector: () => null, querySelectorAll: () => [], createElement: node, head: { appendChild() {} }, body: { insertAdjacentHTML() {} }, addEventListener() {} };
    context.location = { pathname: '/hr/warehouse/deliveries.html', search: '', hash: '#page=deliveries' };
    Object.defineProperty(context, 'localStorage', { get() { throw new Error('SecurityError: storage access denied'); } });
    for (const file of ['shared.js', 'inventory-store.js', 'inventory-ui.js', 'inventory-requests.js', 'inventory-procurement.js']) vm.runInContext(script(file), context);
    context.Inv.start('deliveries');
    assert.equal(byId('header-title').innerText, 'Delivery Tracking');
    assert.match(byId('main-content').innerHTML, /Delivery register/);
    assert.match(byId('main-content').innerHTML, /DEL-4200/);
    assert.doesNotThrow(() => context.toggleSidebar());
});
test('material form saves unique codes, per-unit prices, description and optional variations', () => {
    const { S } = boot();
    const input = { materialCode:'PIPE-01', name:'Pipe', category:'Plumbing', vendorId:'V-01', unit:'Pieces', bin:'A-10', min:2, price:100, stock:5, description:'Copper pipe', hasVariations:true, variations:[{code:'PIPE-01-15',type:'Size / Diameter',name:'15 mm',price:125},{code:'PIPE-01-20',type:'Size / Diameter',name:'20 mm',price:175}] };
    S.saveItem(input);
    const saved = S.data.items.find(i => i.materialCode === 'PIPE-01');
    assert.equal(saved.price, 100);
    assert.equal(saved.description, 'Copper pipe');
    assert.equal(saved.vendorId, 'V-01');
    assert.equal(saved.variations[0].type, 'Size / Diameter');
    assert.equal(saved.variations[1].price, 175);
    assert.equal(saved.stock, 5);
    const stableId = saved.id;
    S.saveItem({...input, id:stableId, materialCode:'PIPE-NEW', price:110, stock:999});
    assert.equal(S.item(stableId).materialCode, 'PIPE-NEW');
    assert.equal(S.item(stableId).stock, 5, 'Editing metadata must not change stock');
    rollback(S, () => S.saveItem({...input, materialCode:'pipe-01-15'}), /already used|different/);
    rollback(S, () => S.saveItem({...input, materialCode:'OTHER', variations:[{code:'SAME',name:'A',price:1},{code:'same',name:'B',price:2}]}), /different/);
    rollback(S, () => S.saveItem({...input, materialCode:'OTHER', vendorId:''}), /active preferred vendor/);
    rollback(S, () => S.saveItem({...input, materialCode:'OTHER', variations:[]}), /at least one/);
    rollback(S, () => S.saveItem({...input, materialCode:'OTHER', hasVariations:false, price:''}), /valid/);
    S.saveItem({...input, id:stableId, materialCode:'PIPE-NEW', hasVariations:false});
    assert.equal(S.item(stableId).variations.length, 0);
    assert.equal(S.item(stableId).hasVariations, false);
});
const quantities = S => S.data.items.map(i => [i.id, i.stock, i.held]);
function rollback(S, action, message) {
    const before = snapshot(S);
    assert.throws(action, message);
    assert.equal(snapshot(S), before, 'Rejected action must leave all records unchanged');
}
function demand(S, item = 'HV-001', qty = 4) {
    return S.addRequest({ supervisor: 'Test Supervisor', site: S.data.sites[1], needed: '2026-09-12', priority: 'Normal', reason: 'Additional site installation', lines: [{ item, qty }] });
}
function dispatch(S, id, lines, extra = {}) {
    return S.dispatch(id, { rider: 'R-01', date: '2026-09-10', picked: true, remarks: 'Test handover', lines, ...extra });
}
const photo = name => ({ name: name + '.jpg', sample: true });
function receipt(S, id, accepted, extra = {}) {
    const d = S.data.deliveries.find(d => d.id === id);
    return S.receiveDelivery(id, { receiver: d.receiver, material: photo('material'), challan: photo('signed-challan'), quality: 'Correct & undamaged', reason: '', lines: d.lines.map((l, i) => ({ item: l.item, accepted: accepted ? accepted[i] : l.qty })), ...extra });
}
function approvedPurchase(S) {
    S.allocate('REQ-8890');
    const id = S.createPurchase('REQ-8890', 'Administrator', 'Purchase shortage');
    S.approval(id, { decision: 'Approved', purchaser: S.data.purchasers[0], vendor: S.data.vendors[0].name, reason: '' });
    return id;
}
function marketDispatch(S, id, extra = {}) {
    return S.purchaserDispatch(id, { bill: photo('bill'), material: photo('purchased-material'), method: 'Deliver by me', payment: 'Not applicable', rider: '', phone: '', charges: 0, ...extra });
}

test('stock reservations are shared across requests and repeated checks do not double reserve', () => {
    const { S } = boot();
    S.allocate('REQ-8890');
    S.allocate('REQ-8890');
    const other = demand(S);
    S.allocate(other);
    assert.equal(S.request('REQ-8890').lines[0].allocated, 2);
    assert.equal(S.request(other).lines[0].allocated, 0);
    assert.equal(S.reserved('HV-001'), 2);
    assert.equal(S.available('HV-001'), 0);
    assert.equal(S.item('HV-001').stock, 2, 'Reservation does not physically issue stock');
});

test('purchase automatically checks stock, contains only shortage, and prevents duplicate approvers', () => {
    const { S } = boot();
    rollback(S, () => S.createPurchase('REQ-8890', 'Both', ''), /Choose one/);
    const id = S.createPurchase('REQ-8890', 'Director', 'Urgent');
    assert.equal(S.request('REQ-8890').checked, true);
    assert.equal(S.request('REQ-8890').lines[0].allocated, 2);
    const p = S.data.purchases.find(p => p.id === id);
    assert.equal(p.approver, 'Director');
    assert.equal(p.lines.length, 2);
    assert.equal(p.lines.find(l => l.item === 'HV-001').qty, 8);
    assert.equal(p.lines.find(l => l.item === 'HV-003').qty, 20);
    assert.equal(p.lines.some(l => l.item === 'HV-002'), false);
    rollback(S, () => S.createPurchase('REQ-8890', 'Administrator', ''), /no uncovered shortage/);
});

test('selected purchase sends only checked quantities and leaves the remaining shortage open', () => {
    const { S } = boot();
    const id = S.createPurchase('REQ-8890', 'Administrator', 'Copper first', [{ item: 'HV-001', qty: 3 }]);
    const p = S.data.purchases.find(p => p.id === id);
    assert.equal(p.lines.length, 1);
    assert.equal(p.lines[0].item, 'HV-001');
    assert.equal(p.lines[0].qty, 3);
    assert.equal(S.request('REQ-8890').lines[0].allocated, 2);
    assert.equal(S.purchased('REQ-8890', 'HV-003'), 0);
    assert.equal(S.uncovered(S.request('REQ-8890'), S.request('REQ-8890').lines[0]), 5);
    rollback(S, () => S.createPurchase('REQ-8890', 'Director', '', [{ item: 'HV-001', qty: 8 }]), /exceeds the remaining shortage/);
    S.createPurchase('REQ-8890', 'Director', '', [{ item: 'HV-003', qty: 20 }]);
    assert.equal(S.purchased('REQ-8890', 'HV-001'), 3);
    assert.equal(S.purchased('REQ-8890', 'HV-003'), 20);
});

test('invalid selected quantities rollback automatic reservation and prevent unneeded purchase', () => {
    const { S } = boot();
    rollback(S, () => S.createPurchase('REQ-8890', 'Administrator', '', [{ item: 'HV-001', qty: 10 }]), /exceeds the remaining shortage/);
    assert.equal(S.request('REQ-8890').checked, false);
    rollback(S, () => S.createPurchase('REQ-8890', 'Administrator', '', [{ item: 'HV-002', qty: 1 }]), /exceeds the remaining shortage/);
    rollback(S, () => S.createPurchase('REQ-8890', 'Administrator', '', [{ item: 'HV-001', qty: -1 }]), /positive purchase quantity/);
    rollback(S, () => S.createPurchase('REQ-8890', 'Administrator', '', [{ item: 'HV-001', qty: 2 }, { item: 'HV-001', qty: 2 }]), /only once/);
    rollback(S, () => S.createPurchase('REQ-8890', 'Administrator', '', []), /no uncovered shortage/);
});

test('denied browser storage preserves valid in-memory actions and still rejects invalid business changes', () => {
    const { S, context } = boot();
    context.localStorage.setItem = () => { throw new Error('Browser storage denied'); };
    const id = S.createPurchase('REQ-8890', 'Administrator', 'Session-only demo', [{ item: 'HV-001', qty: 8 }]);
    assert.equal(S.data.purchases.find(p => p.id === id).lines[0].qty, 8);
    assert.equal(S.request('REQ-8890').lines[0].allocated, 2);
    assert.equal(S.storageAvailable, false);
    rollback(S, () => S.createPurchase('REQ-8890', 'Director', '', [{ item: 'HV-001', qty: 1 }]), /exceeds the remaining shortage/);
    const delivery = dispatch(S, 'REQ-8890', [{ item: 'HV-001', qty: 1 }]);
    assert.equal(S.data.deliveries.find(d => d.id === delivery).status, 'OUT FOR DELIVERY');
    assert.equal(S.item('HV-001').stock, 1);
    assert.equal(S.storageAvailable, false);
});

test('rejected purchase reopens coverage and can be resubmitted once to one recipient', () => {
    const { S } = boot();
    S.allocate('REQ-8890');
    const first = S.createPurchase('REQ-8890', 'Administrator', '');
    rollback(S, () => S.approval(first, { decision: 'Rejected', reason: '' }), /reason/);
    S.approval(first, { decision: 'Rejected', reason: 'Confirm required specification' });
    assert.equal(S.purchased('REQ-8890', 'HV-001'), 0);
    const next = S.createPurchase('REQ-8890', 'Director', 'Specification confirmed');
    assert.notEqual(next, first);
    assert.equal(S.purchased('REQ-8890', 'HV-001'), 8);
    rollback(S, () => S.approval(first, { decision: 'Rejected', reason: 'Again' }), /no longer awaiting/);
});

test('dispatch rejects missing handover, duplicates and overissue without mutating stock', () => {
    const { S } = boot();
    S.allocate('REQ-8890');
    rollback(S, () => dispatch(S, 'REQ-8890', [{ item: 'HV-001', qty: 1 }], { picked: false }), /confirm the picked/);
    rollback(S, () => dispatch(S, 'REQ-8890', [{ item: 'HV-001', qty: 1 }], { rider: 'outside-rider' }), /internal rider/);
    rollback(S, () => dispatch(S, 'REQ-8890', [{ item: 'HV-001', qty: 3 }]), /cannot exceed/);
    rollback(S, () => dispatch(S, 'REQ-8890', [{ item: 'HV-001', qty: 1 }, { item: 'HV-001', qty: 1 }]), /Duplicate/);
    rollback(S, () => dispatch(S, 'REQ-8890', [{ item: 'HV-001', qty: 0 }]), /at least one/);
});

test('partial dispatch consumes only this allocation and remains pending supervisor receipt', () => {
    const { S } = boot();
    S.allocate('REQ-8890');
    const id = dispatch(S, 'REQ-8890', [{ item: 'HV-001', qty: 1 }]);
    assert.equal(S.item('HV-001').stock, 1);
    assert.equal(S.request('REQ-8890').lines[0].allocated, 1);
    assert.equal(S.request('REQ-8890').lines[0].dispatched, 1);
    assert.equal(S.available('HV-001'), 0);
    assert.equal(S.data.ledger[0].qty, -1);
    assert.equal(S.data.deliveries.find(d => d.id === id).status, 'OUT FOR DELIVERY');
    assert.notEqual(S.requestStatus(S.request('REQ-8890')), 'Completed');
});

test('GRN receives partial physical quantities and keeps damaged goods out of availability', () => {
    const { S } = boot();
    const input = { receiver: 'Stores officer', reference: 'CH-091', reason: 'One coil crushed', lines: [{ item: 'HV-001', good: 4, held: 1 }, { item: 'HV-003', good: 10, held: 0 }] };
    rollback(S, () => S.receiveInward('IN-0091', { ...input, lines: [{ item: 'HV-001', good: 11, held: 0 }, { item: 'HV-003', good: 0, held: 0 }] }), /cannot exceed/);
    rollback(S, () => S.receiveInward('IN-0091', { ...input, reason: '' }), /reason/);
    S.receiveInward('IN-0091', input);
    assert.equal(S.item('HV-001').stock, 6);
    assert.equal(S.item('HV-001').held, 1);
    assert.equal(S.available('HV-001'), 6);
    assert.equal(S.data.inwards[0].status, 'Partially received');
    assert.equal(S.data.inwards[0].lines[0].received, 5);
    S.receiveInward('IN-0091', { ...input, lines: [{ item: 'HV-001', good: 5, held: 0 }, { item: 'HV-003', good: 30, held: 0 }] });
    assert.equal(S.data.inwards[0].status, 'Received');
    assert.equal(S.item('HV-001').stock, 11);
    rollback(S, () => S.receiveInward('IN-0091', input), /already complete/);
});

test('approved vendor-to-site purchase requires evidence and never changes warehouse balances', () => {
    const { S } = boot();
    const id = approvedPurchase(S);
    const before = JSON.stringify(quantities(S));
    const ledgerCount = S.data.ledger.length;
    rollback(S, () => marketDispatch(S, id, { bill: null }), /photos are required/);
    rollback(S, () => marketDispatch(S, id, { method: 'Third-party rider', rider: 'Bykea rider', phone: '03001234567', charges: 0 }), /positive delivery charges/);
    const d = marketDispatch(S, id, { method: 'Third-party rider', rider: 'Bykea rider', phone: '03001234567', charges: 350 });
    assert.equal(S.data.deliveries.find(x => x.id === d).status, 'GOING FOR DELIVERY');
    assert.equal(S.data.purchases.find(p => p.id === id).charges, 350);
    receipt(S, d);
    assert.equal(JSON.stringify(quantities(S)), before);
    assert.equal(S.data.ledger.length, ledgerCount);
    rollback(S, () => marketDispatch(S, id), /approved before dispatch/);
});

test('site receipt requires both photos, valid quantities, and comments on discrepancy', () => {
    const { S } = boot();
    rollback(S, () => receipt(S, 'DEL-4200', null, { challan: null }), /photo are required/);
    rollback(S, () => receipt(S, 'DEL-4200', [21]), /between zero/);
    rollback(S, () => receipt(S, 'DEL-4200', [18]), /Explain/);
    receipt(S, 'DEL-4200', [18], { quality: 'Missing / short quantity', reason: 'Only eighteen metres arrived' });
    assert.equal(S.data.deliveries[0].status, 'DAMAGED');
    assert.equal(S.requestStatus(S.request('REQ-8888')), 'Issue reported');
    const issue = S.data.issues.find(i => i.delivery === 'DEL-4200');
    assert.equal(issue.lines[0].qty, 2);
    rollback(S, () => receipt(S, 'DEL-4200'), /already been received/);
});

test('replacement review reopens only disputed demand and does not return physical stock', () => {
    const { S } = boot();
    receipt(S, 'DEL-4200', [18], { reason: 'Two metres missing' });
    const issue = S.data.issues.find(i => i.delivery === 'DEL-4200');
    const stock = S.item('EL-001').stock;
    rollback(S, () => S.resolveIssue(issue.id, 'Replacement required', ''), /remarks/);
    S.resolveIssue(issue.id, 'Replacement required', 'Arrange remaining two metres');
    assert.equal(S.item('EL-001').stock, stock);
    assert.equal(S.request('REQ-8888').lines[0].dispatched, 18);
    assert.equal(S.uncovered(S.request('REQ-8888'), S.request('REQ-8888').lines[0]), 2);
    assert.notEqual(S.requestStatus(S.request('REQ-8888')), 'Completed');
    rollback(S, () => S.resolveIssue(issue.id, 'Replacement required', 'Again'), /already has a follow-up/);
    S.allocate('REQ-8888');
    const replacement = dispatch(S, 'REQ-8888', [{ item: 'EL-001', qty: 2 }]);
    receipt(S, replacement);
    assert.equal(S.requestStatus(S.request('REQ-8888')), 'Completed');
});

test('vendor replacement reduces purchase coverage without touching warehouse stock', () => {
    const { S } = boot();
    const p = approvedPurchase(S);
    const d = marketDispatch(S, p);
    const before = JSON.stringify(quantities(S));
    receipt(S, d, [7, 20], { quality: 'Damaged / broken', reason: 'One copper coil crushed' });
    const issue = S.data.issues.find(i => i.delivery === d);
    S.resolveIssue(issue.id, 'Replacement required', 'Replacement to follow');
    assert.equal(S.purchased('REQ-8890', 'HV-001'), 7);
    assert.equal(S.uncovered(S.request('REQ-8890'), S.request('REQ-8890').lines[0]), 1);
    assert.equal(JSON.stringify(quantities(S)), before);
});

test('physical return changes no stock until GRN and can hold a damaged returned tool', () => {
    const { S } = boot();
    const stock = S.item('TL-002').stock;
    S.resolveIssue('DMG-009', 'Arrange physical return', 'Bring isolated tool to the warehouse');
    const issue = S.data.issues.find(i => i.id === 'DMG-009');
    const inward = S.data.inwards.find(i => i.id === issue.returnRef);
    assert.equal(issue.status, 'Return arranged');
    assert.equal(S.item('TL-002').stock, stock);
    assert.equal(S.data.assets[0].status, 'Return pending');
    S.receiveInward(inward.id, { receiver: 'Stores officer', reference: inward.reference, reason: 'Damaged connector requires repair', lines: [{ item: 'TL-002', good: 0, held: 1 }] });
    assert.equal(S.item('TL-002').stock, stock);
    assert.equal(S.item('TL-002').held, 1);
    assert.equal(S.data.assets[0].status, 'Under inspection');
    assert.equal(S.data.issues.find(i => i.id === 'DMG-009').status, 'Resolved');
});

test('tool custody rejects duplicate active serials and closes existing site report on return request', () => {
    const { S } = boot();
    rollback(S, () => S.assignTool({ item: 'TL-002', serial: 'wm-250-033', person: 'Another worker', due: '2026-09-14', site: S.data.sites[0] }), /already assigned/);
    const stock = S.item('TL-002').stock;
    const id = S.returnTool('TOOL-033', { reason: 'Return for repair', photo: photo('condition'), condition: 'Damaged' });
    assert.equal(S.item('TL-002').stock, stock);
    assert.equal(S.data.issues.find(i => i.id === 'DMG-009').returnRef, id);
    rollback(S, () => S.returnTool('TOOL-033', { reason: 'Duplicate', photo: photo('condition') }), /already has a return/);
});

test('actual core and both page modules render all registered screens and escape supervisor input', () => {
    const { S, context } = boot();
    vm.runInContext(script('inventory-ui.js'), context);
    vm.runInContext(script('inventory-requests.js'), context);
    vm.runInContext(script('inventory-procurement.js'), context);
    const I = context.Inv;
    for (const [name, page] of Object.entries(I.pages)) {
        const html = page();
        assert.equal(typeof html, 'string', name);
        assert(!html.includes('undefined'), name + ' has undefined content');
    }
    const id = S.addRequest({ supervisor: '<img src=x onerror=alert(1)>', site: S.data.sites[0], needed: '2026-09-12', priority: 'Normal', reason: '<script>bad</script>', lines: [{ item: 'HV-001', qty: 2 }] });
    context.location.search = '?id=' + id;
    const html = I.pages['request-detail']();
    assert(html.includes('&lt;img'));
    assert(!html.includes('<script>bad</script>'));
    const p = approvedPurchase(S);
    context.location.search = '?id=' + p;
    assert(I.pages.purchases().includes(p));
    assert(I.pages.purchases().includes('Administrator'));
    const d = marketDispatch(S, p);
    context.location.search = '?id=' + d;
    assert(I.pages.deliveries().includes('GOING FOR DELIVERY'));
});
