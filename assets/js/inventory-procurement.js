/* Inventory-facing purchase, delivery and exception mockups. Other-role actions are labelled simulations. */
(function (global) {
    'use strict';
    const I = global.Inv;
    const S = I.S;
    const h = I.h;
    const n = I.n;
    const purchase = id => S.data.purchases.find(record => record.id === id);
    const delivery = id => S.data.deliveries.find(record => record.id === id);
    const issue = id => S.data.issues.find(record => record.id === id);
    const href = (page, id) => page + '.html' + (id ? '?id=' + encodeURIComponent(id) : '');
    const requestLink = id => I.link(id, href('request-detail', id));
    const itemLabel = id => { const item = S.item(id); return '<strong>' + h(item.name) + '</strong><span class="sub">' + h(item.id) + ' · ' + h(item.unit) + '</span>'; };
    const meta = (label, value) => '<div><span class="meta">' + h(label) + '</span><p><strong>' + h(value || 'Not recorded') + '</strong></p></div>';
    const head = (title, subtitle, actions) => '<div class="page-head"><div>' + (title ? '<h2>' + h(title) + '</h2>' : '') + '<p class="meta">' + h(subtitle) + '</p></div><div class="actions">' + (actions || '') + '</div></div>';
    const empty = (title, text, label, path) => '<div class="empty"><strong>' + h(title) + '</strong><p>' + h(text) + '</p><div style="margin-top:14px">' + I.link(label, path, 'primary') + '</div></div>';
    const timeline = events => '<ul class="timeline">' + (events || []).map(event => '<li>' + h(event.text) + '<small>' + h(event.time) + '</small></li>').join('') + '</ul>';
    const counts = values => '<div class="actions" style="margin:0 0 12px">' + values.map(value => '<span class="badge">' + h(value[0]) + ': ' + n(value[1]) + '</span>').join('') + '</div>';
    const demoNext = (role, body) => I.demo('<span class="meta">' + h(role) + ' simulation</span>' + body);
    const photos = body => '<details class="pad"><summary>View photo evidence</summary><div class="grid two" style="margin-top:10px">' + body + '</div></details>';
    const recordAttrs = (record, more) => ' data-record data-status="' + h(record.status) + '" data-search="' + h([record.id, record.request, record.site, record.status, more || ''].join(' ')) + '"';
    const linesTable = (lines, quantityTitle) => I.table(['Item / unit', quantityTitle || 'Quantity'], lines.map(line => '<tr><td class="wrap">' + itemLabel(line.item) + '</td><td class="num">' + n(line.qty) + ' ' + h(S.item(line.item).unit) + '</td></tr>'));
    function readOnlyDialog(title, body) { I.dialog(title, body, '', null); }
    function requireRecord(record, label) { if (!record) throw new Error(label + ' was not found. Refresh this page and select a current record.'); return record; }

    function purchaseDetail(p) {
        const released = p.lines.some(line => (line.released || 0) > 0);
        const rows = p.lines.map(line => '<tr><td class="wrap">' + itemLabel(line.item) + '</td><td class="num">' + n(line.qty) + '</td>' + (released ? '<td class="num">' + n(line.released || 0) + '</td><td class="num">' + n(line.qty - (line.released || 0)) + '</td>' : '') + '</tr>');
        let controls = '';
        if (p.status === 'Pending approval') {
            controls = demoNext(p.approver, I.btn('Approve · demo', 'pr-approve', p.id, 'primary') + I.btn('Reject · demo', 'pr-reject', p.id, 'danger'));
        } else if (['Approved', 'Purchasing'].includes(p.status)) {
            controls = demoNext('Company purchaser', I.btn('Upload & dispatch · demo', 'pr-dispatch', p.id, 'primary'));
        }
        const logistics = p.purchaser ? '<div class="form-grid">' + meta('Company purchaser', p.purchaser) + meta('Vendor', p.vendor) + (p.method ? meta('Payment status', p.payment) + meta('Delivery', p.method + (p.charges ? ' · ' + I.money(p.charges) : '')) : '') + '</div>' : '<p class="meta">Purchaser and vendor assignment follows approval.</p>';
        return controls + I.panel('Purchase request', '<div class="pad"><div class="row">' + I.badge(p.status) + '<span class="meta">' + h(p.date) + (p.po ? ' · ' + h(p.po) : '') + '</span></div><div class="form-grid">' + meta('Approver', p.approver) + meta('Delivery site', p.site) + '</div>' + logistics + (p.remarks ? '<p><strong>Remarks:</strong> ' + h(p.remarks) + '</p>' : '') + (p.reason ? '<p><strong>Rejection:</strong> ' + h(p.reason) + '</p>' : '') + '<p class="meta">Vendor → site · Warehouse stock unchanged</p></div>', requestLink(p.request) + (p.delivery ? I.link('View delivery', href('deliveries', p.delivery), 'primary') : '')) +
            I.panel('Items to purchase', I.table(released ? ['Item / unit', 'PR quantity', 'Reopened', 'Covered'] : ['Item / unit', 'PR quantity'], rows) + (released ? '<p class="pad meta">Reopened quantities can be requested again from the original demand.</p>' : '')) +
            (p.bill || p.material ? I.panel('Purchase evidence', photos(I.evidence(p.bill, 'Vendor bill') + I.evidence(p.material, 'Purchased material'))) : '') +
            (p.status === 'Rejected' ? '<p class="meta">Review the original request to resubmit the shortage to one approver.</p>' : '') +
            '<details class="panel"><summary class="pad">Activity history</summary><div class="pad">' + timeline(p.events) + '</div></details>';
    }

    I.pages.purchases = function () {
        const selectedId = I.query('id');
        const selected = selectedId && purchase(selectedId);
        if (selected) return head(selected.id, 'Purchase request and purchaser handoff', I.link('All purchase requests', href('purchases'))) + purchaseDetail(selected);
        const records = S.data.purchases;
        const rows = records.map(p => '<tr' + recordAttrs(p, [p.approver, p.purchaser, p.vendor, p.po, p.lines.map(l => S.item(l.item).name).join(' ')].join(' ')) + '><td><strong>' + h(p.id) + '</strong><span class="sub">' + h(p.date) + '</span></td><td class="wrap">' + h(p.site) + '<span class="sub">' + h(p.request) + ' · ' + p.lines.length + ' item(s)</span></td><td><strong>' + h(p.approver) + '</strong><span class="sub">One selected approver</span></td><td class="wrap">' + h(p.purchaser || 'Awaiting assignment') + '<span class="sub">' + h(p.vendor || 'Vendor not assigned') + '</span></td><td>' + I.badge(p.status) + '</td><td>' + I.btn('View progress', 'pr-view', p.id) + '</td></tr>');
        return head('', 'Shortage approvals, company purchaser updates and vendor-to-site deliveries.', I.link('Site requests', href('outward'))) +
            (selectedId ? I.notice('That purchase request is not available in the current demo. Select a record below.') : '') +
            counts([
                ['Pending approval', records.filter(p => p.status === 'Pending approval').length],
                ['With purchaser', records.filter(p => ['Approved', 'Purchasing'].includes(p.status)).length],
                ['In transit', records.filter(p => p.status === 'Going for delivery').length],
                ['Issues', records.filter(p => ['Rejected', 'Issue reported'].includes(p.status)).length]
            ]) +
            (records.length ? I.filters(['Pending approval', 'Approved', 'Purchasing', 'Going for delivery', 'Received', 'Issue reported', 'Rejected', 'Resolved']) + I.panel('Purchase requests', I.table(['Reference', 'Request / site', 'Approval recipient', 'Purchaser / vendor', 'Status', 'Action'], rows)) : I.panel('Purchase requests', empty('No purchase requests yet', 'Open a site demand, check warehouse stock and send its uncovered shortage to one approver.', 'Review site requests', href('outward'))));
    };
    I.actions['pr-view'] = id => readOnlyDialog(id + ' · Purchase progress', purchaseDetail(requireRecord(purchase(id), 'Purchase request')));
    I.actions['pr-approve'] = id => {
        const p = requireRecord(purchase(id), 'Purchase request');
        I.dialog('Demo · ' + p.approver + ' approval', '<p class="meta">Proposed handoff: assign the purchaser and vendor with approval.</p><div class="form-grid">' + I.select('Company purchaser', 'purchaser', [{ value: '', label: 'Choose company purchaser' }].concat(S.data.purchasers), '', 'required') + I.select('Active vendor', 'vendor', [{ value: '', label: 'Choose vendor' }].concat(S.data.vendors.filter(v => v.status === 'Active').map(v => v.name)), '', 'required') + '</div>' + linesTable(p.lines, 'Approved quantity'), 'Simulate approval', form => {
            S.approval(id, { decision: 'Approved', purchaser: I.val(form, 'purchaser'), vendor: I.val(form, 'vendor'), reason: '' });
            I.toast('Demo approval recorded. The company purchaser can now submit a delivery update.');
            return { navigate: href('purchases', id) };
        });
    };
    I.actions['pr-reject'] = id => {
        const p = requireRecord(purchase(id), 'Purchase request');
        I.dialog('Demo · ' + p.approver + ' rejection', I.area('Reason for rejection', 'reason', '', 'required'), 'Record demo rejection', form => {
            S.approval(id, { decision: 'Rejected', reason: I.val(form, 'reason') });
            I.toast('Rejection recorded. Review the original request before resubmitting.');
            return { navigate: href('purchases', id) };
        });
    };
    I.actions['pr-dispatch'] = id => {
        const p = requireRecord(purchase(id), 'Purchase request');
        const body = '<p><strong>' + h(p.purchaser) + '</strong></p><p class="meta">' + h(p.vendor) + ' → ' + h(p.site) + '</p>' +
            '<div class="grid two">' + I.upload('Vendor bill / invoice photo', 'bill', true) + I.upload('Purchased material photo', 'material', true) + '</div>' +
            '<div class="form-grid">' + I.select('Company payment status', 'payment', [{ value: '', label: 'Select payment status' }, 'Not applicable', 'Pending', 'Confirmed'], '', 'required') + I.select('Delivery method', 'method', ['Deliver by me', 'Third-party rider'], 'Deliver by me', 'required') + '</div>' +
            '<div data-rider-fields hidden><div class="form-grid">' + I.field('Rider / service name', 'rider', '', 'text', 'disabled') + I.field('Rider contact', 'phone', '', 'tel', 'disabled') + I.field('Exact rider charges (PKR)', 'charges', '', 'number', 'disabled min="0.01" step="0.01"') + '</div></div>' +
            linesTable(p.lines, 'Quantity dispatched');
        I.dialog('Demo · Purchaser dispatch', body, 'Mark going for delivery', form => {
            const deliveryId = S.purchaserDispatch(id, { bill: I.proof(form, 'bill'), material: I.proof(form, 'material'), payment: I.val(form, 'payment'), method: I.val(form, 'method'), rider: I.val(form, 'rider'), phone: I.val(form, 'phone'), charges: I.val(form, 'charges') });
            I.toast('Purchaser dispatch recorded. Awaiting supervisor receipt.');
            return { navigate: href('deliveries', deliveryId) };
        });
        const form = global.document?.getElementById?.('inv-dialog')?.querySelector('form');
        if (form) {
            const method = form.elements.namedItem('method');
            const fields = form.querySelector('[data-rider-fields]');
            const syncRider = () => {
                const required = method.value === 'Third-party rider';
                fields.hidden = !required;
                fields.querySelectorAll('input').forEach(input => { input.disabled = !required; input.required = required; });
            };
            method.addEventListener('change', syncRider);
            syncRider();
        }
    };

    function deliveryDetail(d) {
        const p = d.purchase && purchase(d.purchase);
        const related = S.data.issues.filter(report => report.delivery === d.id);
        const receiptRows = d.lines.map(line => {
            const received = d.receipt && d.receipt.lines.find(row => row.item === line.item);
            return '<tr><td class="wrap">' + itemLabel(line.item) + '</td><td class="num">' + n(line.qty) + '</td><td class="num">' + (received ? n(received.accepted) : '—') + '</td><td class="num">' + (received ? n(line.qty - Number(received.accepted)) : '—') + '</td></tr>';
        });
        const receipt = d.receipt ? I.panel('Site receipt', '<div class="pad"><div class="row">' + meta('Received by', d.receipt.receiver) + meta('Recorded at', d.receipt.date) + meta('Quality', d.receipt.quality) + '</div>' + (d.receipt.reason ? '<p><strong>Comments:</strong> ' + h(d.receipt.reason) + '</p>' : '') + '</div>' + photos(I.evidence(d.receipt.material, 'Items received') + I.evidence(d.receipt.challan, 'Signed challan'))) : '';
        const controls = !d.receipt ? demoNext('Site Supervisor', I.btn('Receive delivery · demo', 'del-receive', d.id, 'primary')) : '';
        return controls +
            I.panel('Delivery details', '<div class="pad"><div class="row">' + I.badge(d.status) + '<span class="meta">' + h(d.reference) + ' · ' + h(d.date) + '</span></div><div class="form-grid">' + meta('Site', d.site) + meta('Supervisor', d.receiver) + meta('Delivery person', d.rider) + meta('Contact', d.phone) + '</div>' + (d.remarks ? '<p><strong>Remarks:</strong> ' + h(d.remarks) + '</p>' : '') + '<p class="meta">' + (d.source === 'Warehouse' ? 'Warehouse → site · Internal rider · No purchasing or billing' : 'Vendor → site · Warehouse stock unchanged') + '</p></div>', requestLink(d.request) + (d.source === 'Warehouse' ? I.btn('Print issue slip', 'del-print', d.id) : p ? I.link('View purchase', href('purchases', p.id)) : '')) +
            I.panel('Items', d.receipt ? I.table(['Item / unit', 'Dispatched', 'Accepted', 'Disputed'], receiptRows) : linesTable(d.lines, 'Dispatched quantity')) + receipt +
            (related.length ? I.panel('Reported issues & follow-up', '<div class="pad">' + related.map(report => '<div class="row"><div><strong>' + h(report.id) + '</strong> ' + I.badge(report.status) + '<p>' + h(report.reason) + '</p>' + (report.resolution ? '<p class="meta">' + h(report.resolution) + '</p>' : '') + '</div>' + I.link('Review issue', href('exceptions', report.id)) + '</div>').join('') + '</div>') : '') +
            (!d.receipt ? '<p class="meta">Awaiting supervisor quantities, material photo and signed challan.</p>' : '');
    }
    I.pages.deliveries = function () {
        const selectedId = I.query('id');
        const selected = selectedId && delivery(selectedId);
        if (selected) return head(selected.id, 'Delivery tracking and supervisor proof of receipt', I.link('All deliveries', href('deliveries'))) + deliveryDetail(selected);
        const records = S.data.deliveries;
        const rows = records.map(d => '<tr' + recordAttrs(d, [d.source, d.reference, d.rider, d.receiver].join(' ')) + '><td><strong>' + h(d.id) + '</strong><span class="sub">' + h(d.reference) + ' · ' + h(d.date) + '</span></td><td>' + h(d.source) + '</td><td class="wrap">' + h(d.site) + '<span class="sub">' + h(d.receiver) + '</span></td><td class="wrap">' + h(d.rider) + '<span class="sub">' + h(d.phone) + '</span></td><td>' + I.badge(d.status) + '<span class="sub">' + (d.receipt ? 'Receipt proof recorded' : 'Awaiting supervisor receipt') + '</span></td><td>' + I.btn('View delivery', 'del-view', d.id) + '</td></tr>');
        return head('', 'Track internal rider and purchaser deliveries through supervisor verification.', I.link('Prepare warehouse dispatch', href('outward'))) +
            (selectedId ? I.notice('That delivery is not available in the current demo. Select a record below.') : '') +
            counts([
                ['Warehouse in transit', records.filter(d => d.status === 'OUT FOR DELIVERY').length],
                ['Purchases in transit', records.filter(d => d.status === 'GOING FOR DELIVERY').length],
                ['Received', records.filter(d => d.status === 'RECEIVED').length],
                ['Issues', records.filter(d => d.status === 'DAMAGED').length]
            ]) +
            (records.length ? I.filters(['OUT FOR DELIVERY', 'GOING FOR DELIVERY', 'RECEIVED', 'DAMAGED', 'RESOLVED']) + I.panel('Delivery register', I.table(['Reference', 'Source', 'Site / receiver', 'Delivery person', 'Status', 'Action'], rows)) : I.panel('Delivery register', empty('No deliveries yet', 'Dispatch reserved warehouse items or record an approved purchaser delivery to start tracking.', 'Open site requests', href('outward'))));
    };
    I.actions['del-view'] = id => readOnlyDialog(id + ' · Delivery details', deliveryDetail(requireRecord(delivery(id), 'Delivery')));
    I.actions['del-print'] = id => {
        const d = requireRecord(delivery(id), 'Delivery');
        if (d.source !== 'Warehouse') throw new Error('A warehouse material issue slip is available only for warehouse dispatches.');
        I.print('Material Issue Slip · ' + d.reference, '<p><strong>Delivery:</strong> ' + h(d.id) + ' · <strong>Request:</strong> ' + h(d.request) + '</p><p><strong>From:</strong> Central Warehouse · <strong>To:</strong> ' + h(d.site) + '</p><p><strong>Date:</strong> ' + h(d.date) + '</p><p><strong>Internal delivery person:</strong> ' + h(d.rider) + ' · ' + h(d.phone) + '</p><p><strong>Site Supervisor:</strong> ' + h(d.receiver) + '</p>' + linesTable(d.lines, 'Issued quantity') + '<p><strong>Remarks:</strong> ' + h(d.remarks || '—') + '</p><p>Internal material movement. No purchase, vendor billing or payment.</p><p style="margin-top:42px">Issued by: ____________________ &nbsp; Rider handover: ____________________</p><p style="margin-top:30px">Site receiver: ____________________ &nbsp; Date / time: ____________________</p><p>Supervisor to upload received material photo and signed challan photo in the mobile application.</p><p><small>HTML mockup · Local demonstration record</small></p>');
    };
    I.actions['del-receive'] = id => {
        const d = requireRecord(delivery(id), 'Delivery');
        const rows = d.lines.map((line, index) => '<tr><td class="wrap">' + itemLabel(line.item) + '</td><td class="num">' + n(line.qty) + '</td><td>' + I.field('Accepted quantity', 'accepted-' + index, line.qty, 'number', 'required min="0" max="' + h(line.qty) + '" step="0.01"') + '</td></tr>');
        I.dialog('Demo · Supervisor receipt for ' + d.id, '<p class="meta">' + h(d.site) + ' · Accept only correct, undamaged quantities.</p>' +
            '<div class="form-grid">' + I.field('Receiving supervisor', 'receiver', d.receiver, 'text', 'required') + I.select('Quality check', 'quality', ['Correct & undamaged', 'Damaged / broken', 'Missing / short quantity', 'Incorrect items'], 'Correct & undamaged', 'required') + '</div>' + I.table(['Item / unit', 'Dispatched', 'Accepted at site'], rows) +
            '<div class="grid two" style="margin:16px 0">' + I.upload('Photo of received items / damage evidence', 'material', true) + I.upload('Photo of signed delivery challan', 'challan', true) + '</div>' +
            I.area('Issue reason / comments', 'reason') + '<p class="meta">Reason required for damage, shortage or incorrect items. Both photos are required.</p>', 'Record supervisor receipt', form => {
                S.receiveDelivery(id, { receiver: I.val(form, 'receiver'), quality: I.val(form, 'quality'), material: I.proof(form, 'material'), challan: I.proof(form, 'challan'), reason: I.val(form, 'reason'), lines: d.lines.map((line, index) => ({ item: line.item, accepted: I.val(form, 'accepted-' + index) })) });
                I.toast(delivery(id).status === 'DAMAGED' ? 'Receipt recorded with an issue. Inventory follow-up is required.' : 'Supervisor receipt and both proofs recorded.');
                return { navigate: href('deliveries', id) };
            });
        const form = global.document?.getElementById?.('inv-dialog')?.querySelector('form');
        if (form) {
            const syncQuality = () => {
                const hasIssue = form.elements.namedItem('quality').value !== 'Correct & undamaged' || d.lines.some((line, index) => Number(form.elements.namedItem('accepted-' + index).value) < line.qty);
                form.elements.namedItem('reason').required = hasIssue;
                const submit = form.querySelector('[type="submit"]');
                if (submit) submit.textContent = hasIssue ? 'Record issue · demo' : 'Record received · demo';
            };
            form.addEventListener('input', syncQuality);
            form.addEventListener('change', syncQuality);
            syncQuality();
        }
    };

    function issueLines(report) { return report.lines || (report.item ? [{ item: report.item, qty: report.qty }] : []); }
    function issueDetail(report) {
        const lines = issueLines(report);
        const d = report.delivery && delivery(report.delivery);
        return I.panel('Report details', '<div class="pad"><div class="row">' + I.badge(report.status) + '<span class="meta">' + h(report.type) + ' · ' + h(report.date) + '</span></div><div class="form-grid">' + meta('Reported by', report.reporter) + meta('Site', report.site) + '</div><p>' + h(report.reason) + '</p><div class="actions" style="margin-top:10px">' + (report.request ? requestLink(report.request) : '') + (report.delivery ? I.link('Open delivery', href('deliveries', report.delivery)) : '') + (report.asset ? I.link(report.asset + ' · Tool custody', href('equipment')) : '') + '</div></div>', report.status === 'Open' ? I.btn('Record follow-up', 'issue-resolve', report.id, 'primary') : '') +
            I.panel('Disputed items', lines.length ? linesTable(lines, 'Disputed quantity') : '<p class="pad meta">All quantities were accepted. Review the reported quality issue.</p>') +
            I.panel('Evidence', photos(I.evidence(report.photo, 'Damage / discrepancy photo') + (d && d.receipt ? I.evidence(d.receipt.challan, 'Signed challan') : ''))) +
            (report.resolution ? I.panel('Recorded follow-up', '<div class="pad"><p>' + h(report.resolution) + '</p>' + (report.returnRef ? '<p><strong>Return:</strong> ' + h(report.returnRef) + '</p>' + I.link('Receive return', href('inward'), 'primary') : '') + '</div>') : '<p class="meta">Proposed follow-up options need staff validation. Returns add stock only after physical receiving.</p>');
    }
    I.pages.exceptions = function () {
        const selectedId = I.query('id');
        const selected = selectedId && issue(selectedId);
        if (selected) return head(selected.id, 'Site damage, receiving discrepancy and return follow-up', I.link('All reports', href('exceptions'))) + issueDetail(selected);
        const records = S.data.issues;
        const rows = records.map(report => '<tr' + recordAttrs(report, [report.type, report.reporter, report.reason, report.delivery || '', issueLines(report).map(l => S.item(l.item).name).join(' ')].join(' ')) + '><td><strong>' + h(report.id) + '</strong><span class="sub">' + h(report.date) + '</span></td><td class="wrap">' + h(report.type) + '<span class="sub">' + h(report.delivery || report.asset || 'Site report') + '</span></td><td class="wrap">' + h(report.site) + '<span class="sub">' + h(report.reporter) + '</span></td><td class="wrap">' + h(report.reason) + '</td><td>' + I.badge(report.status) + '</td><td>' + I.btn('Review report', 'issue-view', report.id) + '</td></tr>');
        return head('', 'Review site reports, delivery discrepancies and physical return follow-up.', I.link('Delivery register', href('deliveries'))) +
            (selectedId ? I.notice('That report is not available in the current demo. Select a record below.') : '') +
            counts([
                ['Open', records.filter(report => report.status === 'Open').length],
                ['Delivery discrepancies', records.filter(report => report.type === 'Delivery discrepancy' && report.status === 'Open').length],
                ['Returns arranged', records.filter(report => report.status === 'Return arranged').length],
                ['Resolved', records.filter(report => report.status === 'Resolved').length]
            ]) +
            (records.length ? I.filters(['Open', 'Return arranged', 'Resolved']) + I.panel('Reports & follow-up', I.table(['Reference', 'Report type', 'Site / reporter', 'Issue', 'Status', 'Action'], rows)) : I.panel('Reports & follow-up', empty('No damage or discrepancy reports', 'Site damage reports and delivery receiving issues will appear here for Inventory review.', 'View deliveries', href('deliveries'))));
    };
    I.actions['issue-view'] = id => readOnlyDialog(id + ' · Report review', issueDetail(requireRecord(issue(id), 'Issue report')));
    I.actions['issue-resolve'] = id => {
        const report = requireRecord(issue(id), 'Issue report');
        const quantities = issueLines(report);
        const options = ['Accepted after review'];
        if (quantities.some(line => line.qty > 0)) {
            if (report.delivery) options.push('Replacement required');
            options.push('Arrange physical return');
        }
        I.dialog('Record follow-up · ' + id, '<p class="meta">Proposed options for staff review.</p>' +
            '<div class="form-grid">' + I.select('Follow-up action', 'action', options, options[0], 'required') + '</div>' +
            '<p class="meta">Replacement reopens disputed quantities. Returns await physical receiving.</p>' +
            (!report.delivery ? '<p class="meta">For a replacement tool, raise a separate site request.</p>' : '') +
            I.area('Inspection / follow-up remarks', 'note', '', 'required'), 'Save follow-up', form => {
                const action = I.val(form, 'action');
                S.resolveIssue(id, action, I.val(form, 'note'));
                I.toast(action === 'Arrange physical return' ? 'Return arranged. Receive it physically in Inward / GRN before stock changes.' : 'Inventory follow-up recorded.');
                return { navigate: href('exceptions', id) };
            });
    };
})(window);
