/* Local HTML demonstration only. No API, mobile synchronization or financial posting. */
(function (global) {
    'use strict';
    const KEY = 'cosmix.inventory.demo.v1';
    const clone = value => JSON.parse(JSON.stringify(value));
    const round = value => Math.round(value * 100) / 100;
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    const number = value => Number.isFinite(Number(value)) && Number(value) >= 0;
    function seed() {
        return {
            version: 1, sequence: 4200,
            items: [
                { id: 'HV-001', name: 'Copper Coil Tube 5/8"', category: 'HVAC', unit: 'Coils', vendorId: 'V-02', stock: 2, held: 0, min: 10, bin: 'A-01', price: 18500 },
                { id: 'HV-002', name: 'Refrigerant Gas R-410A', category: 'HVAC', unit: 'Cylinders', vendorId: 'V-02', stock: 15, held: 0, min: 5, bin: 'A-04', price: 24000 },
                { id: 'HV-003', name: 'Aeroflex Insulation 5/8"', category: 'HVAC', unit: 'Pieces', vendorId: 'V-02', stock: 0, held: 0, min: 25, bin: 'A-05', price: 650 },
                { id: 'SF-001', name: 'Safety Helmet', category: 'Safety', unit: 'Pieces', vendorId: 'V-01', stock: 12, held: 0, min: 10, bin: 'B-02', price: 850 },
                { id: 'EL-001', name: 'Electrical Cable 4 mm', category: 'Electrical', unit: 'Metres', vendorId: 'V-01', stock: 120, held: 0, min: 50, bin: 'C-03', price: 380 },
                { id: 'TL-001', name: 'Bosch Rotary Hammer', category: 'Tools', unit: 'Units', vendorId: 'V-01', stock: 3, held: 0, min: 2, bin: 'T-01', price: 42000 },
                { id: 'TL-002', name: 'Welding Machine 250A', category: 'Tools', unit: 'Units', vendorId: 'V-01', stock: 1, held: 0, min: 1, bin: 'T-02', price: 68000 }
            ],
            sites: ['DHA Phase 8 — HVAC & MEP', 'Clifton Commercial Tower', 'Korangi Workshop'],
            riders: [{ id: 'R-01', name: 'Imran — Office Rider', phone: '0300-0000001' }, { id: 'R-02', name: 'Nadeem — Company Driver', phone: '0300-0000002' }],
            purchasers: ['Bilal Ahmed — Company Purchaser', 'Ahmed Raza — Company Purchaser'],
            vendors: [
                { id: 'V-01', name: 'Al-Fatah Hardware & Steels', contact: 'Sales Desk', phone: '021-00000001', category: 'Hardware', address: 'Karachi', status: 'Active' },
                { id: 'V-02', name: 'Karachi HVAC Supplies', contact: 'Sales Desk', phone: '021-00000002', category: 'HVAC', address: 'Karachi', status: 'Active' }
            ],
            requests: [
                { id: 'REQ-8890', site: 'DHA Phase 8 — HVAC & MEP', supervisor: 'Ali Raza', date: '2026-09-10', needed: '2026-09-11', priority: 'Urgent', reason: 'AC installation on floors 3 and 4.', checked: false, lines: [{ item: 'HV-001', qty: 10, allocated: 0, dispatched: 0 }, { item: 'HV-002', qty: 5, allocated: 0, dispatched: 0 }, { item: 'HV-003', qty: 20, allocated: 0, dispatched: 0 }], timeline: [{ text: 'Supervisor submitted from mobile directly to Inventory', time: '10 Sep 2026, 09:45' }] },
                { id: 'REQ-8891', site: 'Clifton Commercial Tower', supervisor: 'Usman Tariq', date: '2026-09-10', needed: '2026-09-12', priority: 'Normal', reason: 'Safety equipment for six new site workers.', checked: false, lines: [{ item: 'SF-001', qty: 6, allocated: 0, dispatched: 0 }], timeline: [{ text: 'Supervisor submitted from mobile directly to Inventory', time: '10 Sep 2026, 10:15' }] },
                { id: 'REQ-8888', site: 'Korangi Workshop', supervisor: 'Farhan Ali', date: '2026-09-09', needed: '2026-09-10', priority: 'Normal', reason: 'Workshop cable replacement.', checked: true, lines: [{ item: 'EL-001', qty: 20, allocated: 0, dispatched: 20 }], timeline: [{ text: 'Dispatched with company rider; awaiting site confirmation', time: '10 Sep 2026, 08:30' }] }
            ],
            purchases: [],
            deliveries: [{ id: 'DEL-4200', request: 'REQ-8888', source: 'Warehouse', reference: 'MIS-4200', site: 'Korangi Workshop', receiver: 'Farhan Ali', rider: 'Nadeem — Company Driver', phone: '0300-0000002', date: '2026-09-10', status: 'OUT FOR DELIVERY', lines: [{ item: 'EL-001', qty: 20 }], remarks: 'Deliver to workshop store.', receipt: null }],
            inwards: [{ id: 'IN-0091', type: 'Vendor delivery', reference: 'PO-2026-089', vendor: 'Karachi HVAC Supplies', date: '2026-09-11', status: 'Pending receipt', lines: [{ item: 'HV-001', qty: 10, received: 0 }, { item: 'HV-003', qty: 40, received: 0 }] }],
            assets: [{ id: 'TOOL-033', item: 'TL-002', serial: 'WM-250-033', person: 'Usman Tariq', site: 'Clifton Commercial Tower', issued: '2026-09-07', due: '2026-09-12', status: 'Assigned' }],
            issues: [{ id: 'DMG-009', type: 'Site damage report', site: 'Clifton Commercial Tower', reporter: 'Usman Tariq', item: 'TL-002', qty: 1, reason: 'Welding cable connector damaged during site work. Tool isolated for inspection.', photo: { name: 'welding-connector-damage.jpg', sample: true }, status: 'Open', asset: 'TOOL-033', date: '2026-09-10' }],
            ledger: [{ id: 'MOV-4200', date: '2026-09-10', item: 'EL-001', type: 'Warehouse dispatch', qty: -20, held: 0, reference: 'MIS-4200', detail: 'Korangi Workshop · Nadeem', balance: 120 }]
        };
    }
    let data;
    let storageAvailable = true;
    try { data = JSON.parse(global.localStorage.getItem(KEY)); } catch (_) { data = null; }
    if (!data || data.version !== 1) data = seed();
    const item = id => { const found = data.items.find(i => i.id === id); assert(found, 'Item was not found.'); return found; };
    const request = id => { const found = data.requests.find(r => r.id === id); assert(found, 'Request was not found.'); return found; };
    const id = prefix => prefix + '-' + (++data.sequence);
    const today = () => new Date().toISOString().slice(0, 10);
    const now = () => new Date().toLocaleString('en-GB');
    function event(r, text) { r.timeline.push({ text, time: now() }); }
    function transaction(action) {
        const previous = clone(data);
        try {
            const result = action();
            // Local HTML may run with browser storage disabled. Keep buttons usable
            // in memory; same-document navigation keeps this session's records.
            try { global.localStorage.setItem(KEY, JSON.stringify(data)); storageAvailable = true; }
            catch (_) { storageAvailable = false; }
            return result;
        }
        catch (error) { data = previous; throw error; }
    }
    function reserved(itemId) { return round(data.requests.reduce((n, r) => n + r.lines.filter(l => l.item === itemId).reduce((s, l) => s + l.allocated, 0), 0)); }
    function available(itemId) { return round(Math.max(0, item(itemId).stock - reserved(itemId))); }
    function purchased(requestId, itemId) { return round(data.purchases.filter(p => p.request === requestId && p.status !== 'Rejected').reduce((n, p) => n + p.lines.filter(l => l.item === itemId).reduce((s, l) => s + l.qty - (l.released || 0), 0), 0)); }
    function uncovered(r, l) { return round(Math.max(0, l.qty - l.allocated - l.dispatched - purchased(r.id, l.item))); }
    function reserveAvailable(r) {
        let total = 0;
        r.lines.forEach(l => { const qty = Math.min(uncovered(r, l), available(l.item)); l.allocated = round(l.allocated + qty); total += qty; });
        r.checked = true;
        event(r, total ? 'Inventory checked and reserved available stock; shortages calculated' : 'Inventory checked stock; no additional available quantities to reserve');
        return total;
    }
    function requestStatus(r) {
        if (data.issues.some(i => i.request === r.id && i.status !== 'Resolved')) return 'Issue reported';
        const deliveries = data.deliveries.filter(d => d.request === r.id);
        if (r.lines.every(l => l.qty <= l.dispatched + purchased(r.id, l.item)) && deliveries.length && deliveries.every(d => ['RECEIVED', 'RESOLVED'].includes(d.status)) && data.purchases.filter(p => p.request === r.id && p.status !== 'Rejected').every(p => ['Received', 'Resolved'].includes(p.status))) return 'Completed';
        if (deliveries.some(d => ['OUT FOR DELIVERY', 'GOING FOR DELIVERY'].includes(d.status))) return 'Awaiting site receipt';
        if (r.lines.some(l => l.allocated > 0)) return 'Ready to dispatch';
        if (data.purchases.some(p => p.request === r.id && p.status === 'Pending approval')) return 'Awaiting purchase approval';
        if (data.purchases.some(p => p.request === r.id && ['Approved', 'Purchasing'].includes(p.status))) return 'With purchaser';
        return r.checked ? 'Stock checked' : 'New request';
    }
    function movement(itemId, qty, held, type, reference, detail) { data.ledger.unshift({ id: id('MOV'), date: today(), item: itemId, qty, held, type, reference, detail, balance: item(itemId).stock }); }
    function releaseDemand(delivery, lines) {
        const r = request(delivery.request);
        lines.forEach(l => {
            if (delivery.source === 'Warehouse') r.lines.find(x => x.item === l.item).dispatched = round(r.lines.find(x => x.item === l.item).dispatched - l.qty);
            else { const p = data.purchases.find(x => x.id === delivery.purchase); const pl = p.lines.find(x => x.item === l.item); pl.released = round((pl.released || 0) + l.qty); }
        });
        event(r, 'Disputed quantities reopened for replenishment after Inventory review');
    }
    const api = {
        get data() { return data; }, get storageAvailable() { return storageAvailable; }, item, request, available, reserved, purchased, uncovered, requestStatus, today,
        reset() { return transaction(() => { data = seed(); }); },
        addRequest(input) { return transaction(() => {
            assert(input.supervisor.trim() && input.reason.trim() && input.needed && data.sites.includes(input.site), 'Complete supervisor, site, required date and reason.');
            assert(input.lines.length && input.lines.every(l => number(l.qty) && Number(l.qty) > 0), 'Enter at least one positive requested quantity.');
            assert(new Set(input.lines.map(l => l.item)).size === input.lines.length, 'Combine duplicate items into one line.');
            input.lines.forEach(l => item(l.item));
            const r = { id: id('REQ'), site: input.site, supervisor: input.supervisor.trim(), date: today(), needed: input.needed, priority: input.priority, reason: input.reason.trim(), checked: false, lines: input.lines.map(l => ({ item: l.item, qty: round(Number(l.qty)), allocated: 0, dispatched: 0 })), timeline: [{ time: now(), text: 'Supervisor submitted from mobile directly to Inventory (demo event)' }] };
            data.requests.unshift(r); return r.id;
        }); },
        allocate(requestId) { return transaction(() => {
            reserveAvailable(request(requestId));
        }); },
        createPurchase(requestId, approver, remarks, selectedLines) { return transaction(() => {
            const r = request(requestId);
            assert(['Administrator', 'Director'].includes(approver), 'Choose one purchase approver.');
            reserveAvailable(r);
            const selected = selectedLines === undefined ? r.lines.map(l => ({ item: l.item, qty: uncovered(r, l) })).filter(l => l.qty > 0) : selectedLines;
            assert(Array.isArray(selected), 'Select the items to purchase.');
            assert(new Set(selected.map(l => l.item)).size === selected.length, 'Select each purchase item only once.');
            const lines = selected.map(l => {
                const requested = r.lines.find(x => x.item === l.item);
                assert(requested && number(l.qty) && Number(l.qty) > 0 && round(Number(l.qty)) > 0, 'Select a request item and enter a positive purchase quantity.');
                assert(Number(l.qty) <= uncovered(r, requested), 'Purchase quantity exceeds the remaining shortage. Refresh the request and review its stock or existing purchases.');
                return { item: l.item, qty: round(Number(l.qty)), released: 0 };
            });
            assert(lines.length, 'There is no uncovered shortage. Existing purchase requests already cover it.');
            const p = { id: id('PR'), request: r.id, approver, remarks, lines, status: 'Pending approval', date: today(), site: r.site, purchaser: '', vendor: '', events: [{ time: now(), text: 'Inventory sent shortage request to ' + approver }] };
            data.purchases.unshift(p); event(r, p.id + ' sent to ' + approver + ' for shortage approval'); return p.id;
        }); },
        approval(purchaseId, input) { return transaction(() => {
            const p = data.purchases.find(x => x.id === purchaseId); assert(p && p.status === 'Pending approval', 'This request is no longer awaiting approval.');
            if (input.decision === 'Rejected') { assert(input.reason.trim(), 'A rejection reason is required.'); p.status = 'Rejected'; p.reason = input.reason.trim(); }
            else {
                assert(input.decision === 'Approved' && data.purchasers.includes(input.purchaser) && data.vendors.some(v => v.name === input.vendor && v.status === 'Active'), 'Select an active vendor and company purchaser.');
                p.status = 'Approved'; p.purchaser = input.purchaser; p.vendor = input.vendor; p.po = id('PO');
            }
            p.events.push({ time: now(), text: p.approver + ': ' + p.status + (p.reason ? ' — ' + p.reason : ' · ' + p.purchaser) });
            event(request(p.request), p.id + ' ' + p.status.toLowerCase() + ' by ' + p.approver + ' (demo event)');
        }); },
        purchaserDispatch(purchaseId, input) { return transaction(() => {
            const p = data.purchases.find(x => x.id === purchaseId); assert(p && ['Approved', 'Purchasing'].includes(p.status), 'Purchase must be approved before dispatch.');
            assert(input.bill && input.material && input.bill.name && input.material.name, 'Vendor bill and purchased material photos are required.');
            assert(['Deliver by me', 'Third-party rider'].includes(input.method), 'Choose a delivery method.');
            assert(['Not applicable', 'Pending', 'Confirmed'].includes(input.payment), 'Select payment status.');
            if (input.method === 'Third-party rider') assert(input.rider.trim() && input.phone.trim() && number(input.charges) && Number(input.charges) > 0, 'Enter rider name, contact and exact positive delivery charges.');
            p.status = 'Going for delivery'; p.bill = input.bill; p.material = input.material; p.payment = input.payment; p.method = input.method; p.charges = input.method === 'Third-party rider' ? Number(input.charges) : 0;
            const r = request(p.request);
            const d = { id: id('DEL'), request: r.id, purchase: p.id, source: 'Vendor → Site', reference: p.po, site: r.site, receiver: r.supervisor, rider: input.method === 'Deliver by me' ? p.purchaser : input.rider, phone: input.method === 'Deliver by me' ? 'Company purchaser' : input.phone, date: today(), status: 'GOING FOR DELIVERY', lines: p.lines.map(l => ({ item: l.item, qty: l.qty })), receipt: null, remarks: 'Direct site purchase. Central warehouse stock is unchanged.' };
            data.deliveries.unshift(d); p.delivery = d.id; p.events.push({ time: now(), text: 'Purchaser uploaded evidence and dispatched to site (demo event)' }); event(r, d.id + ' going for delivery from vendor'); return d.id;
        }); },
        dispatch(requestId, input) { return transaction(() => {
            const r = request(requestId); const rider = data.riders.find(x => x.id === input.rider);
            assert(rider && input.date && input.picked, 'Select an internal rider, dispatch date and confirm the picked items.');
            const lines = input.lines.filter(l => Number(l.qty) > 0).map(l => ({ item: l.item, qty: round(Number(l.qty)) }));
            assert(lines.length, 'Enter at least one quantity to issue.');
            assert(new Set(lines.map(l => l.item)).size === lines.length, 'Duplicate dispatch items are not allowed.');
            lines.forEach(l => { const rl = r.lines.find(x => x.item === l.item); assert(rl && number(l.qty) && l.qty <= rl.allocated && l.qty <= item(l.item).stock, 'Issue quantity cannot exceed this request’s reserved stock.'); });
            const reference = id('MIS'); const d = { id: id('DEL'), request: r.id, source: 'Warehouse', reference, site: r.site, receiver: r.supervisor, rider: rider.name, phone: rider.phone, date: input.date, status: 'OUT FOR DELIVERY', lines, remarks: input.remarks, receipt: null };
            lines.forEach(l => { const rl = r.lines.find(x => x.item === l.item); rl.allocated = round(rl.allocated - l.qty); rl.dispatched = round(rl.dispatched + l.qty); item(l.item).stock = round(item(l.item).stock - l.qty); movement(l.item, -l.qty, 0, 'Warehouse dispatch', reference, r.site + ' · ' + rider.name); });
            data.deliveries.unshift(d); event(r, reference + ' handed to ' + rider.name + '; awaiting supervisor receipt'); return d.id;
        }); },
        receiveDelivery(deliveryId, input) { return transaction(() => {
            const d = data.deliveries.find(x => x.id === deliveryId);
            assert(d && !d.receipt, 'This delivery has already been received.');
            assert(input.material && input.challan && input.material.name && input.challan.name && input.receiver.trim(), 'Receiver, material photo and signed challan photo are required.');
            assert(input.lines.length === d.lines.length && new Set(input.lines.map(l => l.item)).size === d.lines.length, 'Record the received quantity for every item.');
            const discrepancies = [];
            d.lines.forEach(l => { const result = input.lines.find(x => x.item === l.item); assert(result && number(result.accepted) && Number(result.accepted) <= l.qty, 'Accepted quantities must be between zero and dispatched quantity.'); const qty = round(l.qty - Number(result.accepted)); if (qty > 0) discrepancies.push({ item: l.item, qty }); });
            const damaged = discrepancies.length > 0 || input.quality !== 'Correct & undamaged';
            if (damaged) assert(input.reason.trim(), 'Explain the damage, shortage or incorrect items.');
            d.receipt = { ...input, date: now() }; d.status = damaged ? 'DAMAGED' : 'RECEIVED';
            if (d.purchase) data.purchases.find(p => p.id === d.purchase).status = damaged ? 'Issue reported' : 'Received';
            if (damaged) data.issues.unshift({ id: id('ISS'), type: 'Delivery discrepancy', request: d.request, delivery: d.id, site: d.site, reporter: input.receiver, reason: input.reason, photo: input.material, lines: discrepancies, status: 'Open', date: today() });
            event(request(d.request), d.id + ': ' + d.status + ' · supervisor receipt recorded (demo event)');
        }); },
        receiveInward(inwardId, input) { return transaction(() => {
            const receipt = data.inwards.find(x => x.id === inwardId); assert(receipt && receipt.status !== 'Received', 'This inward is already complete.');
            assert(input.receiver.trim() && input.reference.trim(), 'Enter the receiving officer and supplier challan / return reference.');
            assert(input.lines.length === receipt.lines.length && new Set(input.lines.map(l => l.item)).size === receipt.lines.length, 'Record every inward item once.');
            let total = 0;
            input.lines.forEach(l => { const line = receipt.lines.find(x => x.item === l.item); assert(line && number(l.good) && number(l.held) && Number(l.good) + Number(l.held) <= round(line.qty - line.received), 'Received quantities cannot exceed the outstanding delivery.'); total += Number(l.good) + Number(l.held); });
            assert(total > 0, 'Enter a physically received quantity.');
            if (input.lines.some(l => Number(l.held) > 0)) assert(input.reason.trim(), 'Enter a reason for holding damaged or rejected stock.');
            const reference = id('GRN');
            input.lines.forEach(l => { const good = Number(l.good), held = Number(l.held); if (!good && !held) return; const line = receipt.lines.find(x => x.item === l.item); line.received = round(line.received + good + held); item(l.item).stock = round(item(l.item).stock + good); item(l.item).held = round(item(l.item).held + held); movement(l.item, good, held, receipt.type === 'Vendor delivery' ? 'Goods receipt' : 'Site / tool return', reference, input.receiver + ' · ' + input.reference + (held ? ' · Held: ' + input.reason : '')); });
            receipt.status = receipt.lines.every(l => l.received === l.qty) ? 'Received' : 'Partially received'; receipt.lastGRN = reference;
            if (receipt.asset && receipt.status === 'Received') data.assets.find(a => a.id === receipt.asset).status = input.lines.some(l => Number(l.held) > 0) ? 'Under inspection' : 'Returned';
            if (receipt.issue && receipt.status === 'Received') { const issue = data.issues.find(i => i.id === receipt.issue); issue.status = 'Resolved'; issue.resolution = 'Return physically received. ' + (input.lines.some(l => Number(l.held) > 0) ? 'Held for inspection.' : 'Accepted into available stock.'); }
            return reference;
        }); },
        resolveIssue(issueId, action, note) { return transaction(() => {
            const issue = data.issues.find(x => x.id === issueId); assert(issue && issue.status === 'Open', 'This report already has a follow-up.'); assert(note.trim(), 'Record the inspection or follow-up remarks.');
            assert(['Accepted after review', 'Replacement required', 'Arrange physical return'].includes(action), 'Choose a follow-up action.');
            const delivery = issue.delivery ? data.deliveries.find(d => d.id === issue.delivery) : null;
            const lines = delivery ? issue.lines : [{ item: issue.item, qty: issue.qty }];
            if (action !== 'Accepted after review') assert(lines.length && lines.some(l => l.qty > 0), 'This report has no disputed quantity. Record acceptance after review.');
            if (action === 'Replacement required') assert(delivery, 'For damaged assigned tools, arrange a return and raise a separate material request if needed.');
            if (delivery && action !== 'Accepted after review') releaseDemand(delivery, lines);
            if (action === 'Arrange physical return') {
                if (issue.asset) assert(data.assets.find(a => a.id === issue.asset).status === 'Assigned', 'This tool already has a return in progress.');
                const inward = { id: id('RET'), type: 'Site return', reference: issue.id, vendor: issue.site, date: today(), status: 'Pending receipt', lines: lines.map(l => ({ ...l, received: 0 })), issue: issue.id, asset: issue.asset || null };
                data.inwards.unshift(inward); issue.returnRef = inward.id; issue.status = 'Return arranged';
                if (issue.asset) data.assets.find(a => a.id === issue.asset).status = 'Return pending';
            } else issue.status = 'Resolved';
            issue.resolution = action + ' · ' + note;
            if (delivery) { delivery.status = 'RESOLVED'; if (delivery.purchase) data.purchases.find(p => p.id === delivery.purchase).status = 'Resolved'; }
        }); },
        saveItem(input) { return transaction(() => {
            const existing = input.id ? item(input.id) : null;
            const code = String(input.materialCode || '').trim().toUpperCase();
            assert(code, 'Material code is required.');
            assert(input.name.trim() && input.category && input.unit.trim() && input.bin.trim() && number(input.min) && String(input.price).trim() !== '' && number(input.price), 'Complete item name, category, unit, bin and valid stock / per-unit price values.');
            const vendor = data.vendors.find(v => v.id === input.vendorId && v.status === 'Active');
            assert(vendor, 'Select an active preferred vendor.');
            const variations = input.hasVariations ? (input.variations || []).map(v => ({ code: String(v.code || '').trim().toUpperCase(), type: String(v.type || 'Other').trim(), name: String(v.name || '').trim(), price: Number(v.price) })) : [];
            if (input.hasVariations) {
                assert(variations.length, 'Add at least one variation or turn variations off.');
                assert(variations.every((v, index) => v.code && v.name && String(input.variations[index].price).trim() !== '' && number(v.price)), 'Every variation needs a unique code, description and valid per-unit price.');
            }
            const codes = [code, ...variations.map(v => v.code)];
            assert(new Set(codes).size === codes.length, 'Material and variation codes must be different.');
            const otherCodes = new Set(data.items.filter(i => i.id !== input.id).flatMap(i => [i.id, i.materialCode || i.id, ...(i.variations || []).map(v => v.code)]).map(c => String(c).toUpperCase()));
            assert(codes.every(c => !otherCodes.has(c)), 'This material or variation code is already used by another product.');
            const values = { materialCode: code, name: input.name.trim(), description: String(input.description || '').trim(), category: input.category, vendorId: vendor.id, unit: input.unit.trim(), min: Number(input.min), bin: input.bin.trim(), price: Number(input.price), hasVariations: !!input.hasVariations, variations };
            if (existing) Object.assign(existing, values);
            else { assert(number(input.stock), 'Opening stock must be zero or higher.'); const record = { ...values, id: id('ITM'), stock: Number(input.stock), held: 0 }; data.items.push(record); if (record.stock) movement(record.id, record.stock, 0, 'Opening stock', record.id, 'Opening balance entered in demo'); }
        }); },
        saveVendor(input) { return transaction(() => { assert(input.name.trim() && input.phone.trim() && input.contact.trim(), 'Vendor name, contact person and phone are required.'); const v = input.id ? data.vendors.find(x => x.id === input.id) : { id: id('V') }; assert(v, 'Vendor not found.'); Object.assign(v, input, { id: v.id || id('V') }); if (!input.id) data.vendors.push(v); }); },
        assignTool(input) { return transaction(() => {
            assert(item(input.item).category === 'Tools' && available(input.item) >= 1, 'Choose a tool with available stock.'); assert(input.person.trim() && input.serial.trim() && input.due && data.sites.includes(input.site), 'Complete custodian, serial, site and return date.');
            assert(!data.assets.some(a => a.serial.toLowerCase() === input.serial.trim().toLowerCase() && ['Assigned', 'Return pending', 'Under inspection'].includes(a.status)), 'This serial number is already assigned or held.');
            const asset = { id: id('TOOL'), item: input.item, serial: input.serial.trim(), person: input.person.trim(), site: input.site, due: input.due, issued: today(), status: 'Assigned' }; data.assets.unshift(asset); item(input.item).stock--; movement(input.item, -1, 0, 'Tool assignment', asset.id, asset.person + ' · ' + asset.site);
        }); },
        returnTool(assetId, input) { return transaction(() => {
            const a = data.assets.find(x => x.id === assetId); assert(a && a.status === 'Assigned', 'This tool already has a return in progress.'); assert(input.reason.trim() && input.photo, 'Return reason and condition photo / handover slip are required.');
            const report = data.issues.find(i => i.asset === a.id && i.status === 'Open');
            const inward = { id: id('RET'), type: 'Tool return', reference: a.id, vendor: a.site, date: today(), status: 'Pending receipt', lines: [{ item: a.item, qty: 1, received: 0 }], asset: a.id, reason: input.reason, photo: input.photo, condition: input.condition, issue: report ? report.id : null };
            data.inwards.unshift(inward); a.status = 'Return pending'; if (report) { report.status = 'Return arranged'; report.returnRef = inward.id; } return inward.id;
        }); }
    };
    global.InventoryStore = api;
})(typeof window === 'undefined' ? globalThis : window);
