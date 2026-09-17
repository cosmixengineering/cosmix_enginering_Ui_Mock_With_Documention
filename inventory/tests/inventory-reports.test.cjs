const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');

function loadMockup() {
    const storage = new Map();
    const context = {
        console,
        setTimeout,
        clearTimeout,
        Blob,
        URL,
        localStorage: {
            getItem: key => storage.get(key) || null,
            setItem: (key, value) => storage.set(key, value)
        }
    };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/inventory-store.js'), 'utf8'), context);
    const h = value => String(value == null ? '' : value);
    context.Inv = {
        S: context.InventoryStore,
        h,
        n: value => String(Number(value || 0)),
        money: value => 'Rs. ' + Number(value || 0).toLocaleString('en-PK'),
        badge: h,
        btn: h,
        field: h,
        select: h,
        table: (_headers, rows) => rows.join(''),
        panel: (_title, body) => body,
        notice: h,
        pages: {},
        actions: {}
    };
    vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/inventory-reports.js'), 'utf8'), context);
    return context;
}

test('unified register derives operational documents and only evidenced vendor invoices', () => {
    const context = loadMockup();
    const docs = context.Inv.reportDocuments();
    const keys = docs.map(doc => doc.key);

    assert.equal(new Set(keys).size, keys.length, 'every generated document key must be unique');
    assert.ok(docs.some(doc => doc.type === 'Request Note'));
    assert.ok(docs.some(doc => doc.type === 'Material Issue Slip'));
    assert.ok(docs.some(doc => doc.type === 'Goods Received Note (GRN)'));
    assert.ok(docs.some(doc => doc.type === 'Tool Issue / Custody Note'));

    const invoices = docs.filter(doc => doc.type === 'Vendor Purchase Invoice');
    assert.deepEqual(Array.from(invoices, doc => doc.related).sort(), ['PO-2026-088', 'PO-2026-089']);
    assert.ok(invoices.every(doc => doc.evidence.length > 0));
    assert.ok(!invoices.some(doc => doc.related === 'PO-2026-090'));
});

test('partial physical receipts append separate GRNs and preserve report history', () => {
    const context = loadMockup();
    const store = context.InventoryStore;

    const first = store.receiveInward('IN-0091', {
        receiver: 'Warehouse Officer',
        reference: 'DC-001',
        reason: '',
        lines: [{ item: 'HV-001', good: 4, held: 0 }, { item: 'HV-003', good: 0, held: 0 }]
    });
    const second = store.receiveInward('IN-0091', {
        receiver: 'Warehouse Officer',
        reference: 'DC-002',
        reason: '',
        lines: [{ item: 'HV-001', good: 6, held: 0 }, { item: 'HV-003', good: 40, held: 0 }]
    });

    assert.notEqual(first, second);
    assert.equal(store.data.inwards.find(row => row.id === 'IN-0091').receipts.length, 2);
    const grns = context.Inv.reportDocuments().filter(doc => doc.key.startsWith('GRN:IN-0091:'));
    assert.equal(grns.length, 2);
    assert.deepEqual(Array.from(grns, doc => doc.ref), [first, second]);
});

test('tool return remains pending until physical receipt creates a return GRN', () => {
    const context = loadMockup();
    const store = context.InventoryStore;
    const returnId = store.returnTool('TOOL-033', {
        condition: 'Needs repair',
        reason: 'Returned from site for inspection',
        photo: { name: 'tool-return.jpg' }
    });

    let docs = context.Inv.reportDocuments();
    assert.ok(docs.some(doc => doc.key === 'IN:' + returnId && doc.type === 'Tool / Site Return Note'));
    assert.ok(!docs.some(doc => doc.key.startsWith('GRN:' + returnId + ':')));

    const grn = store.receiveInward(returnId, {
        receiver: 'Warehouse Officer',
        reference: 'SITE-RETURN-01',
        reason: 'Connector held for inspection',
        lines: [{ item: 'TL-002', good: 0, held: 1 }]
    });

    docs = context.Inv.reportDocuments();
    const receipt = docs.find(doc => doc.key === 'GRN:' + returnId + ':' + grn);
    assert.equal(receipt.type, 'Return Receiving Note / GRN');
    assert.equal(receipt.lines[0].held, 1);
    assert.equal(store.data.assets.find(row => row.id === 'TOOL-033').status, 'Under inspection');
});
