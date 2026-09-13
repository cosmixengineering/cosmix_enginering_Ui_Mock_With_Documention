/* Inventory request screens. Local mock workflow; no live mobile connection. */
(function (global) {
    'use strict';
    const I = global.Inv;
    const S = I.S;
    const h = I.h;
    const n = I.n;
    const href = (page, id) => page + '.html?id=' + encodeURIComponent(id);
    const cell = (value, cls = '') => '<td class="' + cls + '">' + value + '</td>';
    const ready = (r, l) => l.allocated + Math.min(S.uncovered(r, l), S.available(l.item));
    const shortage = (r, l) => Math.max(0, Math.round((S.uncovered(r, l) - Math.min(S.uncovered(r, l), S.available(l.item))) * 100) / 100);
    const requestRows = () => S.data.requests.map(r => {
        const status = S.requestStatus(r);
        const itemNames = r.lines.map(l => S.item(l.item).name).join(' ');
        return '<tr data-record data-status="' + h(status) + '" data-search="' + h([r.id, r.site, r.supervisor, r.priority, itemNames].join(' ')) + '">' +
            cell('<a href="' + href('request-detail', r.id) + '">' + h(r.id) + '</a><span class="sub">' + h(r.date) + '</span>') +
            cell('<strong>' + h(r.site) + '</strong><span class="sub">' + h(r.supervisor) + ' · Mobile request</span>', 'wrap') +
            cell(r.lines.map(l => h(S.item(l.item).name) + ' <strong>' + n(l.qty) + '</strong> <small>' + h(S.item(l.item).unit) + '</small>').join('<br>'), 'wrap') +
            cell(h(r.needed) + '<span class="sub">' + h(r.priority) + '</span>') +
            cell(I.badge(status)) +
            cell(I.link('Review request', href('request-detail', r.id))) + '</tr>';
    });

    I.pages.outward = () => {
        const requests = S.data.requests;
        const statuses = [...new Set(requests.map(r => S.requestStatus(r)))];
        return '<div class="row" style="margin-bottom:10px"><p class="meta">Supervisor requests come directly to Inventory.</p>' +
            '<div class="actions">' + I.link('Delivery tracking', 'deliveries.html') + I.link('Purchase tracking', 'purchases.html') + '</div></div>' +
            I.panel('Supervisor request inbox', '<div class="pad">' + I.filters(statuses) + '</div>' + I.table(['Request', 'Site & supervisor', 'Requested items', 'Required by', 'Progress', 'Action'], requestRows(), 'No requests match these filters.')) +
            I.demo(I.btn('New supervisor request — demo', 'req-new', '', 'amber'));
    };

    function lineTable(r) {
        return I.table(['Select purchase items', 'Requested', 'From warehouse', 'Purchase quantity', 'Progress'], r.lines.map(l => {
            const item = S.item(l.item);
            const toBuy = shortage(r, l), fromStock = ready(r, l), covered = S.purchased(r.id, l.item);
            return '<tr data-req-row data-item="' + h(l.item) + '">' +
                cell('<label style="display:flex;align-items:center;gap:8px"><input type="checkbox" data-req-select aria-label="Select ' + h(item.name) + ' for purchase" ' + (toBuy > 0 ? 'checked' : 'disabled') + '><span><strong>' + h(item.name) + '</strong><span class="sub">' + h(item.unit) + '</span></span></label>', 'wrap') +
                cell(n(l.qty), 'num') +
                cell(fromStock > 0 ? '<strong>' + n(fromStock) + '</strong><span class="sub">Ready to dispatch</span>' : '<span class="meta">—</span>', 'num') +
                cell(toBuy > 0 ? '<input type="number" data-req-qty aria-label="Purchase quantity for ' + h(item.name) + '" value="' + toBuy + '" min="0.01" max="' + toBuy + '" step="0.01" style="width:80px;margin:0"><span class="sub">Shortage: ' + n(toBuy) + '</span>' : '<span class="meta">No purchase needed</span>') +
                cell((l.dispatched ? '<span class="sub">Dispatched: ' + n(l.dispatched) + '</span>' : '') + (covered ? '<span class="sub">Purchase requested: ' + n(covered) + '</span>' : '') + (!l.dispatched && !covered ? I.badge(toBuy > 0 ? 'Shortage' : 'In stock') : ''), 'wrap') + '</tr>';
        }));
    }

    I.pages['request-detail'] = () => {
        const id = I.query('id') || 'REQ-8890';
        const r = S.data.requests.find(record => record.id === id);
        if (!r) return '<div class="row"><h2>Request not found</h2></div>' + I.notice('This request is not present in the local demonstration records.') + I.link('Back to site requests', 'outward.html');
        const canDispatch = r.lines.some(l => ready(r, l) > 0);
        const eligible = r.lines.filter(l => shortage(r, l) > 0);
        const purchases = S.data.purchases.filter(p => p.request === r.id);
        const deliveries = S.data.deliveries.filter(d => d.request === r.id);
        const state = S.requestStatus(r);
        const links = purchases.map(p => '<span>' + I.link(p.id, href('purchases', p.id)) + ' ' + I.badge(p.status) + '</span>').concat(deliveries.map(d => '<span>' + I.link(d.reference, href('deliveries', d.id)) + ' ' + I.badge(d.status) + '</span>'));
        const auditRows = r.lines.map(l => '<tr>' + cell(h(S.item(l.item).name), 'wrap') + cell(n(S.item(l.item).stock), 'num') + cell(n(S.reserved(l.item)), 'num') + cell(n(l.allocated), 'num') + cell(n(S.item(l.item).held), 'num') + '</tr>');
        return '<div class="row" style="margin-bottom:10px"><div><a href="outward.html">← Requests</a> &nbsp; <strong>' + h(r.id) + '</strong><p class="meta">' + h(r.site) + ' · ' + h(r.supervisor) + ' · Required ' + h(r.needed) + ' · ' + h(r.priority) + '</p><p class="meta">' + h(r.reason) + '</p></div>' + I.badge(state) + '</div>' +
            I.panel('Requested items',
                '<div class="pad" style="padding-top:8px;padding-bottom:8px"><div class="row"><label class="check" style="padding:0"><input type="checkbox" data-req-all ' + (eligible.length ? 'checked' : 'disabled') + '> Select all purchase items</label><small id="req-selection-count">' + eligible.length + ' item(s) selected for purchasing</small></div></div>' +
                '<div id="req-purchase-items" data-request="' + h(r.id) + '">' + lineTable(r) + '</div>' +
                '<div class="pad"><div class="grid two"><div><h3>Available stock</h3><div class="actions">' + I.btn('Dispatch with office rider', 'req-dispatch', r.id, 'primary', !canDispatch) + '</div>' + (!canDispatch ? '<small>No available stock for this request.</small>' : '') + '</div><div><h3>Purchase selected items</h3><div class="actions">' + I.btn('Send to Administrator', 'req-pr-admin', r.id, 'primary', !eligible.length) + I.btn('Send to Director', 'req-pr-director', r.id, '', !eligible.length) + '</div><small>Choose one approver. Only selected quantities will be sent.</small></div></div><p id="req-selection-error" role="alert" style="color:#a22e35" hidden></p></div>') +
            (links.length ? I.panel('Purchase & delivery progress', '<div class="pad actions">' + links.join('') + '</div>') : '') +
            '<details class="panel"><summary class="pad" style="cursor:pointer;font-weight:600">Stock details & request history</summary><div class="pad"><p class="meta">Stock is checked and reserved automatically when preparing dispatch or sending a purchase request.</p>' + I.table(['Item', 'On hand', 'All reservations', 'This request', 'Held'], auditRows) + '<br><ol class="timeline">' + r.timeline.slice().reverse().map(e => '<li>' + h(e.text) + '<small>' + h(e.time) + '</small></li>').join('') + '</ol></div></details>';
    };

    I.actions['req-allocate'] = id => {
        S.allocate(id);
        I.toast('Stock checked. Available quantities are reserved for this request.');
        I.render();
    };

    function purchaseDialog(id, approver) {
        const r = S.request(id);
        const selected = [];
        const scope = document.getElementById('req-purchase-items');
        if (!scope || scope.dataset.request !== id) throw new Error('Open the request details and select the items to purchase.');
        const error = document.getElementById('req-selection-error');
        const showError = text => { if (error) { error.hidden = false; error.textContent = text; } I.toast(text); };
        for (const row of scope.querySelectorAll('[data-req-row]')) {
            if (!row.querySelector('[data-req-select]').checked) continue;
            const input = row.querySelector('[data-req-qty]');
            const qty = Number(input && input.value);
            if (!Number.isFinite(qty) || qty <= 0 || qty > Number(input.max)) { showError('Enter a purchase quantity between 0.01 and the shortage shown for each selected item.'); return; }
            selected.push({ item: row.dataset.item, qty });
        }
        if (!selected.length) { showError('Select at least one purchase item using the checkboxes.'); return; }
        if (error) error.hidden = true;
        const rows = selected.map(l => '<tr>' + cell(h(S.item(l.item).name), 'wrap') + cell(n(l.qty) + ' ' + h(S.item(l.item).unit), 'num') + '</tr>');
        I.dialog('Send shortage to ' + approver,
            '<p>Send these <strong>' + selected.length + ' selected item(s)</strong> to <strong>' + h(approver) + '</strong> for purchase approval.</p>' +
            '<p><strong>' + h(r.id) + '</strong> · ' + h(r.site) + '</p>' + I.table(['Shortage item', 'Purchase quantity'], rows) +
            I.area('Purchase instructions / urgency', 'remarks', '', 'maxlength="1000"'),
            'Confirm & send to ' + approver,
            form => {
                const reference = S.createPurchase(id, approver, I.val(form, 'remarks'), selected);
                I.toast(reference + ' sent to ' + approver + ' for approval.');
                return { navigate: href('purchases', reference) };
            });
    }
    I.actions['req-pr-admin'] = id => purchaseDialog(id, 'Administrator');
    I.actions['req-pr-director'] = id => purchaseDialog(id, 'Director');

    I.actions['req-dispatch'] = id => {
        S.allocate(id);
        const r = S.request(id);
        const lines = r.lines.filter(l => l.allocated > 0);
        if (!lines.length) { I.render(); I.toast('No warehouse stock is available for this request. Select shortage items for purchasing.'); return; }
        const rows = lines.map((l, index) => '<tr>' + cell(h(S.item(l.item).name) + '<span class="sub">' + h(S.item(l.item).unit) + '</span>', 'wrap') + cell(n(l.allocated), 'num') + cell(I.field('Issue quantity', 'qty-' + index, l.allocated, 'number', 'min="0" max="' + l.allocated + '" step="0.01" required'), 'num') + '</tr>');
        I.dialog('Warehouse handover · ' + r.id,
            '<p><strong>' + h(r.site) + '</strong><br><small>Receiving supervisor: ' + h(r.supervisor) + '</small></p>' +
            '<div class="form-grid">' + I.select('Internal company rider / driver', 'rider', [{ value: '', label: 'Select an office rider' }, ...S.data.riders.map(rider => ({ value: rider.id, label: rider.name + ' · ' + rider.phone }))], '', 'required') + I.field('Dispatch date', 'date', S.today(), 'date', 'required') + '</div>' +
            I.table(['Reserved item', 'Reserved quantity', 'Dispatch now'], rows) +
            '<p class="meta">Enter the quantity being handed over; use zero to leave an item for later.</p>' +
            I.area('Delivery / gate pass instructions', 'remarks', '', 'maxlength="1000"') +
            '<label class="check"><input type="checkbox" name="picked" required> Picked items and quantities have been checked for handover.</label>' +
            '<p class="meta">A Material Issue Slip is created on handover. The supervisor confirms receipt at the site.</p>',
            'Confirm handover & create MIS',
            form => {
                const quantities = lines.map((line, index) => ({ item: line.item, qty: Number(I.val(form, 'qty-' + index)) }));
                if (quantities.some(line => !Number.isFinite(line.qty) || line.qty < 0)) throw new Error('Enter zero or a positive dispatch quantity for every item.');
                const delivery = S.dispatch(id, { rider: I.val(form, 'rider'), date: I.val(form, 'date'), remarks: I.val(form, 'remarks'), picked: form.elements.namedItem('picked').checked, lines: quantities });
                I.toast('Warehouse handover recorded. ' + delivery + ' is awaiting site receipt.');
                return { navigate: href('deliveries', delivery) };
            });
    };

    I.actions['req-new'] = () => {
        const items = S.data.items.slice();
        const rows = items.map((item, index) => '<tr>' + cell(h(item.name) + '<span class="sub">' + h(item.unit) + '</span>', 'wrap') + cell(I.field('Requested quantity', 'item-' + index, 0, 'number', 'min="0" step="0.01" required'), 'num') + '</tr>');
        I.dialog('Demo · New supervisor mobile request',
            I.notice('Other-role simulation: this creates a local sample request as if submitted by a site supervisor. No live mobile submission or notification is sent.') +
            '<div class="form-grid">' + I.field('Supervisor name', 'supervisor', '', 'text', 'required maxlength="100"') + I.select('Assigned site', 'site', S.data.sites, S.data.sites[0], 'required') + I.field('Required by', 'needed', S.today(), 'date', 'required') + I.select('Priority', 'priority', ['Normal', 'Urgent'], 'Normal', 'required') + '</div>' +
            I.area('Work requirement / reason', 'reason', '', 'required maxlength="1000"') +
            '<h3 style="margin-top:18px">Required materials / tools</h3><p class="meta">Enter a positive quantity for each requested item. Leave other items at zero.</p>' + I.table(['Item', 'Quantity'], rows),
            'Simulate submission to Inventory',
            form => {
                const quantities = items.map((item, index) => ({ item: item.id, qty: Number(I.val(form, 'item-' + index)) }));
                if (quantities.some(line => !Number.isFinite(line.qty) || line.qty < 0)) throw new Error('Enter zero or a positive requested quantity for every item.');
                const id = S.addRequest({ supervisor: I.val(form, 'supervisor'), site: I.val(form, 'site'), needed: I.val(form, 'needed'), priority: I.val(form, 'priority'), reason: I.val(form, 'reason'), lines: quantities.filter(line => line.qty > 0) });
                I.toast(id + ' added directly to the Inventory inbox.');
                return { navigate: href('request-detail', id) };
            });
    };
    document.addEventListener('change', event => {
        if (!event.target.matches('[data-req-all], [data-req-select]')) return;
        const scope = document.getElementById('req-purchase-items');
        if (!scope) return;
        const boxes = [...scope.querySelectorAll('[data-req-select]:not(:disabled)')];
        if (event.target.matches('[data-req-all]')) boxes.forEach(box => { box.checked = event.target.checked; });
        boxes.forEach(box => { box.closest('[data-req-row]').querySelector('[data-req-qty]').disabled = !box.checked; });
        const count = boxes.filter(box => box.checked).length;
        const all = document.querySelector('[data-req-all]');
        if (all) { all.checked = count > 0 && count === boxes.length; all.indeterminate = count > 0 && count < boxes.length; }
        const caption = document.getElementById('req-selection-count');
        if (caption) caption.textContent = count + ' item(s) selected for purchasing';
        const error = document.getElementById('req-selection-error');
        if (error) error.hidden = true;
    });
})(window);
