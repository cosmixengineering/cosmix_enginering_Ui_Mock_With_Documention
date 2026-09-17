/* Unified Inventory reports and printable business documents. Local HTML mockup only. */
(function (global) {
    'use strict';
    const I = global.Inv;
    const S = I.S;
    const h = I.h;
    const n = I.n;
    const money = I.money;

    const byId = (list, id) => list.find(row => row.id === id);
    const item = id => { try { return S.item(id); } catch (_) { return { id, materialCode: id, name: 'Unknown item', unit: '—', price: 0 }; } };
    const isoDate = value => {
        const text = String(value || '');
        if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
        const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
        return match ? match[3] + '-' + match[2] + '-' + match[1] : '';
    };
    const labelDate = value => value || 'Not recorded';
    const totalQty = lines => (lines || []).reduce((sum, row) => {
        if (row.good != null || row.held != null) return sum + Number(row.good || 0) + Number(row.held || 0);
        if (row.accepted != null || row.disputed != null) return sum + Number(row.accepted || 0) + Number(row.disputed || 0);
        const value = ['issued', 'ordered', 'approved', 'expected', 'requested', 'received', 'reviewed', 'allocated', 'dispatched'].find(key => row[key] != null);
        return sum + Number(value ? row[value] : 0);
    }, 0);
    const line = (itemId, values = {}) => ({ item: itemId, ...values });
    const evidence = file => file && file.name ? file.name : '';
    const createDocument = input => ({ amount: null, evidence: [], notes: '', related: '', from: '', to: '', lines: [], ...input, date: isoDate(input.date), displayDate: labelDate(input.displayDate || input.date) });

    function documents() {
        const docs = [];
        S.data.requests.forEach(request => {
            docs.push(createDocument({ key: 'REQ:' + request.id, ref: request.id, type: 'Request Note', group: 'Requests', date: request.date, status: S.requestStatus(request), site: request.site, party: request.supervisor, from: request.supervisor + ' · Site Supervisor', to: 'Inventory Desk', related: request.id, notes: request.reason, lines: request.lines.map(row => line(row.item, { requested: row.qty, allocated: row.allocated, dispatched: row.dispatched })) }));
        });

        S.data.purchases.forEach(purchase => {
            const request = byId(S.data.requests, purchase.request);
            docs.push(createDocument({ key: 'PR:' + purchase.id, ref: purchase.id, type: 'Purchase Requisition', group: 'Purchasing', date: purchase.date, status: purchase.status, site: purchase.site || request?.site || '', party: purchase.approver || 'Approval recipient not recorded', from: 'Inventory Desk', to: purchase.approver || 'Administrator / Director not recorded', related: purchase.request || '', notes: purchase.remarks || purchase.reason || '', lines: (purchase.lines || []).map(row => line(row.item, { requested: row.qty })) }));
            if (purchase.po) docs.push(createDocument({ key: 'PO:' + purchase.id, ref: purchase.po, type: 'Purchase Order', group: 'Purchasing', date: purchase.date, status: purchase.status, site: purchase.site || request?.site || '', party: purchase.vendor || 'Vendor not recorded', from: 'Cosmix Engineering', to: purchase.vendor || 'Selected vendor', related: purchase.id + (purchase.request ? ' · ' + purchase.request : ''), notes: 'Approver: ' + (purchase.approver || 'Not recorded') + ' · Purchaser: ' + (purchase.purchaser || 'Not assigned'), amount: purchase.amount ?? null, lines: (purchase.lines || []).map(row => { const stockItem = item(row.item); return line(row.item, { ordered: row.qty, rate: stockItem.price, lineAmount: Number(row.qty) * Number(stockItem.price || 0) }); }) }));
            if (purchase.bill || purchase.invoiceNo) docs.push(createDocument({ key: 'INV:' + purchase.id, ref: purchase.invoiceNo || ('Bill evidence · ' + (purchase.po || purchase.id)), type: 'Vendor Purchase Invoice', group: 'Invoices', date: purchase.invoiceDate || purchase.date, status: purchase.payment || purchase.status, site: purchase.site || request?.site || '', party: purchase.vendor || 'Vendor not recorded', from: purchase.vendor || 'Vendor', to: 'Cosmix Engineering', related: purchase.po || purchase.id, notes: 'Vendor invoice/bill evidence retained in this local demonstration.', amount: purchase.amount ?? null, evidence: [evidence(purchase.bill)].filter(Boolean), lines: (purchase.lines || []).map(row => { const stockItem = item(row.item); return line(row.item, { ordered: row.qty, rate: stockItem.price, lineAmount: Number(row.qty) * Number(stockItem.price || 0) }); }) }));
            if (purchase.status && purchase.status !== 'Pending approval') docs.push(createDocument({ key: 'DEC:' + purchase.id, ref: 'DEC-' + purchase.id, type: purchase.status === 'Rejected' ? 'Purchase Rejection Memo' : 'Purchase Approval Note', group: 'Purchasing', date: purchase.date, status: purchase.status, site: purchase.site || request?.site || '', party: purchase.approver || 'Approver not recorded', from: purchase.approver || 'Administrator / Director not recorded', to: 'Inventory Desk', related: purchase.id + (purchase.po ? ' · ' + purchase.po : ''), notes: purchase.reason || ('Assigned purchaser: ' + (purchase.purchaser || 'Not recorded') + ' · Vendor: ' + (purchase.vendor || 'Not recorded')), lines: (purchase.lines || []).map(row => line(row.item, { approved: row.qty })) }));
        });

        S.data.deliveries.forEach(delivery => {
            const warehouse = delivery.source === 'Warehouse';
            docs.push(createDocument({ key: 'DEL:' + delivery.id, ref: warehouse ? delivery.reference : delivery.id, type: warehouse ? 'Material Issue Slip' : 'Vendor Delivery Note', group: warehouse ? 'Dispatch' : 'Delivery', date: delivery.date, status: delivery.status, site: delivery.site, party: delivery.rider, from: warehouse ? 'Central Warehouse' : delivery.source, to: delivery.site + ' · ' + delivery.receiver, related: delivery.request + (delivery.purchase ? ' · ' + delivery.purchase : ''), notes: (delivery.remarks || '') + (warehouse ? ' Internal non-financial warehouse movement.' : ' Direct vendor-to-site movement; warehouse stock unchanged.'), lines: delivery.lines.map(row => line(row.item, { issued: row.qty })) }));
            if (delivery.receipt) {
                const receipt = delivery.receipt;
                docs.push(createDocument({ key: 'RCV:' + delivery.id, ref: 'RCV-' + delivery.id, type: 'Site Receiving Note', group: 'Receiving', date: receipt.date || delivery.date, displayDate: receipt.date || delivery.date, status: delivery.status, site: delivery.site, party: receipt.receiver, from: delivery.rider, to: receipt.receiver + ' · ' + delivery.site, related: delivery.reference + ' · ' + delivery.request, notes: receipt.quality + (receipt.reason ? ' · ' + receipt.reason : ''), evidence: [evidence(receipt.material), evidence(receipt.challan)].filter(Boolean), lines: delivery.lines.map(row => { const accepted = byId(receipt.lines || [], row.item)?.accepted ?? 0; return line(row.item, { issued: row.qty, accepted: Number(accepted), disputed: Number(row.qty) - Number(accepted) }); }) }));
            }
        });

        S.data.inwards.forEach(inward => {
            const returnType = /return/i.test(inward.type);
            docs.push(createDocument({ key: 'IN:' + inward.id, ref: inward.id, type: returnType ? 'Tool / Site Return Note' : 'Expected Inward Note', group: returnType ? 'Returns' : 'Receiving', date: inward.date, status: inward.status, site: returnType ? inward.vendor : 'Central Warehouse', party: inward.vendor, from: inward.vendor, to: 'Central Warehouse', related: inward.reference, notes: [inward.condition, inward.reason].filter(Boolean).join(' · '), evidence: [evidence(inward.photo)].filter(Boolean), lines: inward.lines.map(row => line(row.item, { expected: row.qty, received: row.received })) }));
            const receipts = (inward.receipts || []).slice();
            if (!receipts.length && inward.status === 'Received') receipts.push({ id: inward.lastGRN || inward.id, at: inward.date, receiver: 'Not recorded in sample', externalReference: inward.reference, reason: '', lines: inward.lines.map(row => ({ item: row.item, good: row.received, held: 0 })) });
            receipts.forEach(receipt => docs.push(createDocument({ key: 'GRN:' + inward.id + ':' + receipt.id, ref: receipt.id, type: returnType ? 'Return Receiving Note / GRN' : 'Goods Received Note (GRN)', group: returnType ? 'Returns' : 'Receiving', date: receipt.at || inward.date, displayDate: receipt.at || inward.date, status: inward.status, site: 'Central Warehouse', party: receipt.receiver, from: inward.vendor, to: 'Central Warehouse · ' + receipt.receiver, related: inward.id + ' · ' + (receipt.externalReference || inward.reference), notes: receipt.reason || (returnType ? 'Physical return received and inspected.' : 'Goods physically received at warehouse.'), lines: (receipt.lines || []).map(row => line(row.item, { good: row.good, held: row.held })) })));
        });

        S.data.assets.forEach(asset => docs.push(createDocument({ key: 'TOOL:' + asset.id, ref: asset.id, type: 'Tool Issue / Custody Note', group: 'Tools', date: asset.issued, status: asset.status, site: asset.site, party: asset.person, from: 'Central Warehouse', to: asset.person + ' · ' + asset.site, related: asset.serial, notes: 'Expected return: ' + asset.due + ' · Serial / asset: ' + asset.serial, lines: [line(asset.item, { issued: 1 })] })));

        S.data.issues.forEach(issue => {
            docs.push(createDocument({ key: 'ISS:' + issue.id, ref: issue.id, type: issue.type || 'Damage / Discrepancy Report', group: 'Damage & Returns', date: issue.date, status: issue.status, site: issue.site, party: issue.reporter, from: issue.reporter + ' · ' + issue.site, to: 'Inventory Desk', related: [issue.request, issue.delivery, issue.asset].filter(Boolean).join(' · '), notes: issue.reason, evidence: [evidence(issue.photo)].filter(Boolean), lines: (issue.lines || (issue.item ? [{ item: issue.item, qty: issue.qty }] : [])).map(row => line(row.item, { disputed: row.qty })) }));
            if (issue.resolution) docs.push(createDocument({ key: 'RES:' + issue.id, ref: 'RES-' + issue.id, type: 'Inspection / Resolution Note', group: 'Damage & Returns', date: issue.resolvedAt || issue.date, displayDate: issue.resolvedAt || issue.date, status: issue.status, site: issue.site, party: 'Inventory Desk', from: 'Inventory Desk', to: issue.reporter || issue.site, related: issue.id + (issue.returnRef ? ' · ' + issue.returnRef : ''), notes: issue.resolution, lines: (issue.lines || (issue.item ? [{ item: issue.item, qty: issue.qty }] : [])).map(row => line(row.item, { reviewed: row.qty })) }));
        });
        return docs.sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.ref.localeCompare(b.ref));
    }

    function itemSummary(doc) {
        const names = doc.lines.slice(0, 2).map(row => item(row.item).name);
        return names.join(', ') + (doc.lines.length > 2 ? ' +' + (doc.lines.length - 2) : '');
    }
    function quantitySummary(doc) {
        if (doc.amount != null) return money(doc.amount);
        return n(totalQty(doc.lines)) + (doc.lines.length === 1 ? ' ' + item(doc.lines[0].item).unit : ' total');
    }
    function documentTable(doc) {
        const keys = ['requested', 'allocated', 'ordered', 'approved', 'issued', 'expected', 'received', 'accepted', 'disputed', 'good', 'held', 'reviewed'];
        const active = keys.filter(key => doc.lines.some(row => row[key] != null));
        const financial = doc.lines.some(row => row.rate != null || row.lineAmount != null);
        const headers = ['Code / material', 'Unit', ...active.map(key => key.charAt(0).toUpperCase() + key.slice(1)), ...(financial ? ['Rate', 'Amount'] : [])];
        const rows = doc.lines.map(row => {
            const stockItem = item(row.item);
            return '<tr><td><strong>' + h(stockItem.materialCode || stockItem.id) + '</strong><span class="sub">' + h(stockItem.name) + '</span></td><td>' + h(stockItem.unit) + '</td>' + active.map(key => '<td class="num">' + (row[key] == null ? '—' : n(row[key])) + '</td>').join('') + (financial ? '<td class="num">' + (row.rate == null ? '—' : money(row.rate)) + '</td><td class="num">' + (row.lineAmount == null ? '—' : money(row.lineAmount)) + '</td>' : '') + '</tr>';
        });
        return I.table(headers, rows, 'No item lines recorded.');
    }
    function renderDocument(doc) {
        return '<article class="doc-sheet"><div class="doc-brand"><div><h2>COSMIX ENGINEERING</h2><p>Inventory & Warehouse Department</p></div><span>HTML MOCKUP · SAMPLE</span></div>' +
            '<div class="doc-title"><div><small>DOCUMENT TYPE</small><h3>' + h(doc.type) + '</h3></div><div><small>DOCUMENT NO.</small><strong>' + h(doc.ref) + '</strong></div></div>' +
            '<div class="doc-meta"><div><small>Date</small><strong>' + h(doc.displayDate) + '</strong></div><div><small>Status</small>' + I.badge(doc.status || 'Recorded') + '</div><div><small>Related reference</small><strong>' + h(doc.related || '—') + '</strong></div><div><small>Site / location</small><strong>' + h(doc.site || '—') + '</strong></div><div><small>From</small><strong>' + h(doc.from || '—') + '</strong></div><div><small>To / responsible person</small><strong>' + h(doc.to || doc.party || '—') + '</strong></div></div>' +
            documentTable(doc) +
            (doc.amount != null ? '<div class="doc-total"><span>Recorded total</span><strong>' + money(doc.amount) + '</strong></div>' : '') +
            (doc.notes ? '<div class="doc-notes"><small>Remarks / purpose</small><p>' + h(doc.notes) + '</p></div>' : '') +
            (doc.evidence.length ? '<div class="doc-notes"><small>Attached evidence</small><p>' + doc.evidence.map(h).join(' · ') + '</p></div>' : '') +
            '<div class="doc-signatures"><div>Prepared / issued by<br><span>________________________</span></div><div>Checked / approved by<br><span>________________________</span></div><div>Received / acknowledged by<br><span>________________________</span></div></div><p class="doc-footer">Local demonstration record · No live backend, accounting posting or mobile synchronization</p></article>';
    }

    function reportFilters(docs) {
        const types = [...new Set(docs.map(doc => doc.group))].sort();
        const statuses = [...new Set(docs.map(doc => doc.status).filter(Boolean))].sort();
        const sites = [...new Set(docs.map(doc => doc.site).filter(Boolean))].sort();
        return '<div class="filters report-filters"><label>Search documents<input id="inv-search" type="search" placeholder="Document, request, item, site or person…"></label>' +
            I.select('Document group', 'inv-type', [{ value: '', label: 'All document groups' }, ...types], '', 'id="inv-type"') +
            I.select('Status', 'inv-status', [{ value: '', label: 'All statuses' }, ...statuses], '', 'id="inv-status"') +
            I.select('Site / location', 'inv-site', [{ value: '', label: 'All sites / locations' }, ...sites], '', 'id="inv-site"') +
            I.field('From date', 'inv-date-from', '', 'date', 'id="inv-date-from"') + I.field('To date', 'inv-date-to', '', 'date', 'id="inv-date-to"') +
            '<div class="actions">' + I.btn('Clear', 'reports-clear') + I.btn('Export CSV', 'reports-export', '', 'primary') + '</div></div><div id="inv-filter-empty" class="notice" hidden>No documents match these filters.</div>';
    }
    function quickReports() {
        const reports = [
            ['stock', 'Stock Balance & Reorder', 'On-hand, reserved, available, held and reorder levels.'],
            ['movement', 'Stock Movement Ledger', 'All inward, dispatch, tool and return movements.'],
            ['site', 'Site Material Issue & Receipt', 'Site-wise dispatched and received material trail.'],
            ['purchase', 'Purchase & Vendor Register', 'PR, PO, vendor bill and delivery status.'],
            ['tools', 'Tool Custody & Returns', 'Assigned tools, return status and physical receipts.'],
            ['damage', 'Damage, Returns & Held Stock', 'Open issues, resolutions and held quantities.']
        ];
        return '<div class="report-quick">' + reports.map(([id, title, text]) => '<button type="button" data-action="reports-summary" data-id="' + id + '"><i class="fas fa-file-lines"></i><span><strong>' + h(title) + '</strong><small>' + h(text) + '</small></span></button>').join('') + '</div>';
    }

    I.pages.reports = function () {
        const docs = documents();
        const grns = docs.filter(doc => /GRN/.test(doc.type)).length;
        const outward = docs.filter(doc => ['Dispatch', 'Delivery', 'Receiving'].includes(doc.group)).length;
        const open = S.data.issues.filter(issue => issue.status !== 'Resolved').length + S.data.inwards.filter(row => /return/i.test(row.type) && row.status !== 'Received').length;
        const rows = docs.map(doc => '<tr data-record data-doc-row data-key="' + h(doc.key) + '" data-type="' + h(doc.group) + '" data-status="' + h(doc.status) + '" data-site="' + h(doc.site) + '" data-date="' + h(doc.date) + '" data-search="' + h([doc.ref, doc.type, doc.related, doc.site, doc.party, itemSummary(doc)].join(' ')) + '"><td><strong>' + h(doc.ref) + '</strong><span class="sub">' + h(doc.displayDate) + '</span></td><td class="wrap">' + h(doc.type) + '<span class="sub">' + h(doc.group) + '</span></td><td class="wrap">' + h(doc.related || '—') + '</td><td class="wrap">' + h(doc.from || '—') + '<span class="sub">→ ' + h(doc.to || doc.party || '—') + '</span></td><td class="wrap">' + h(itemSummary(doc) || 'No item lines') + '</td><td class="num">' + h(quantitySummary(doc)) + '</td><td>' + I.badge(doc.status || 'Recorded') + '</td><td><div class="actions">' + I.btn('View', 'reports-view', doc.key) + I.btn('Print', 'reports-print', doc.key) + '</div></td></tr>');
        return '<div class="kpis report-kpis">' +
            '<div class="kpi"><span>Total documents</span><strong>' + docs.length + '</strong><small>Live from Inventory records</small></div>' +
            '<div class="kpi"><span>GRN / return receipts</span><strong>' + grns + '</strong><small>Physical warehouse receiving</small></div>' +
            '<div class="kpi"><span>Dispatch & site receipts</span><strong>' + outward + '</strong><small>Warehouse and vendor routes</small></div>' +
            '<div class="kpi"><span>Open return / issues</span><strong>' + open + '</strong><small>Needs Inventory follow-up</small></div></div>' +
            I.panel('Quick operational reports', quickReports()) + reportFilters(docs) +
            I.panel('Inventory document register', I.table(['Document / date', 'Type', 'Related reference', 'From → to', 'Items', 'Quantity / amount', 'Status', 'Action'], rows, 'No Inventory documents recorded.')) +
            I.notice('Vendor invoices are financial documents. Warehouse dispatches, receipts, tools and returns are recorded as non-financial notes, slips or GRNs. All records on this HTML page are local mock data.');
    };

    function findDocument(key) { return documents().find(doc => doc.key === key); }
    I.actions['reports-view'] = key => {
        const doc = findDocument(key); if (!doc) throw new Error('Document is no longer available.');
        I.dialog(doc.type + ' · ' + doc.ref, renderDocument(doc) + '<div class="actions doc-preview-actions">' + I.btn('Print document', 'reports-print', key, 'primary') + '</div>', '', null);
        document.getElementById('inv-dialog')?.classList.add('document-dialog');
    };
    I.actions['reports-print'] = key => {
        const doc = findDocument(key); if (!doc) throw new Error('Document is no longer available.');
        I.print(doc.type + ' · ' + doc.ref, renderDocument(doc));
    };
    I.actions['reports-clear'] = () => {
        ['inv-search', 'inv-status', 'inv-type', 'inv-site', 'inv-date-from', 'inv-date-to'].forEach(id => { const control = document.getElementById(id); if (control) control.value = ''; });
        I.filterRows();
    };
    I.actions['reports-export'] = () => {
        const docs = documents();
        const rows = [['Document', 'Date', 'Type', 'Group', 'Related', 'Site', 'Party', 'Status', 'Quantity', 'Amount'], ...docs.map(doc => [doc.ref, doc.date, doc.type, doc.group, doc.related, doc.site, doc.party, doc.status, totalQty(doc.lines), doc.amount == null ? '' : doc.amount])];
        const csv = rows.map(row => row.map(value => '"' + String(value == null ? '' : value).replace(/^[=+@-]/, "'$&").replace(/"/g, '""') + '"').join(',')).join('\r\n');
        const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv' })); const a = document.createElement('a'); a.href = url; a.download = 'cosmix-inventory-documents-demo.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    function summaryReport(kind) {
        if (kind === 'stock') return { title: 'Stock Balance & Reorder Report', body: I.table(['Code / item', 'Unit', 'On hand', 'Reserved', 'Available', 'Held', 'Reorder', 'Bin'], S.data.items.map(stockItem => '<tr><td><strong>' + h(stockItem.materialCode || stockItem.id) + '</strong><span class="sub">' + h(stockItem.name) + '</span></td><td>' + h(stockItem.unit) + '</td><td class="num">' + n(stockItem.stock) + '</td><td class="num">' + n(S.reserved(stockItem.id)) + '</td><td class="num">' + n(S.available(stockItem.id)) + '</td><td class="num">' + n(stockItem.held) + '</td><td class="num">' + n(stockItem.min) + '</td><td>' + h(stockItem.bin) + '</td></tr>')) };
        if (kind === 'movement') return { title: 'Stock Movement Ledger Report', body: I.table(['Date / voucher', 'Item', 'Movement', 'Good qty', 'Held qty', 'Balance', 'Reference'], S.data.ledger.map(row => '<tr><td>' + h(row.date) + '<span class="sub">' + h(row.id) + '</span></td><td>' + h(item(row.item).name) + '</td><td>' + h(row.type) + '</td><td class="num">' + n(row.qty) + '</td><td class="num">' + n(row.held) + '</td><td class="num">' + n(row.balance) + '</td><td>' + h(row.reference) + '<span class="sub">' + h(row.detail) + '</span></td></tr>')) };
        if (kind === 'site') return { title: 'Site Material Issue & Receipt Report', body: I.table(['Date / delivery', 'Site', 'Source', 'Items / qty', 'Receiver', 'Status'], S.data.deliveries.map(row => '<tr><td>' + h(row.date) + '<span class="sub">' + h(row.reference) + '</span></td><td>' + h(row.site) + '</td><td>' + h(row.source) + '</td><td>' + row.lines.map(value => h(item(value.item).name) + ': ' + n(value.qty)).join('<br>') + '</td><td>' + h(row.receipt?.receiver || row.receiver) + '</td><td>' + I.badge(row.status) + '</td></tr>')) };
        if (kind === 'purchase') return { title: 'Purchase & Vendor Register', body: I.table(['Date / PR', 'PO / invoice', 'Vendor', 'Site', 'Purchaser', 'Amount', 'Status'], S.data.purchases.map(row => '<tr><td>' + h(row.date) + '<span class="sub">' + h(row.id) + '</span></td><td>' + h(row.po || '—') + '<span class="sub">' + h(row.invoiceNo || 'No invoice number') + '</span></td><td>' + h(row.vendor || 'Not assigned') + '</td><td>' + h(row.site || '—') + '</td><td>' + h(row.purchaser || 'Not assigned') + '</td><td class="num">' + (row.amount == null ? '—' : money(row.amount)) + '</td><td>' + I.badge(row.status) + '</td></tr>')) };
        if (kind === 'tools') return { title: 'Tool Custody & Return Report', body: I.table(['Asset / serial', 'Tool', 'Custodian / site', 'Issued', 'Due', 'Status'], S.data.assets.map(row => '<tr><td><strong>' + h(row.id) + '</strong><span class="sub">' + h(row.serial) + '</span></td><td>' + h(item(row.item).name) + '</td><td>' + h(row.person) + '<span class="sub">' + h(row.site) + '</span></td><td>' + h(row.issued) + '</td><td>' + h(row.due) + '</td><td>' + I.badge(row.status) + '</td></tr>')) + '<h3>Return receiving</h3>' + I.table(['Return', 'Source', 'Items', 'Status', 'GRN'], S.data.inwards.filter(row => /return/i.test(row.type)).map(row => '<tr><td>' + h(row.id) + '<span class="sub">' + h(row.reference) + '</span></td><td>' + h(row.vendor) + '</td><td>' + row.lines.map(value => h(item(value.item).name) + ': ' + n(value.qty)).join('<br>') + '</td><td>' + I.badge(row.status) + '</td><td>' + h(row.lastGRN || 'Pending') + '</td></tr>')) };
        return { title: 'Damage, Returns & Held Stock Report', body: I.table(['Report', 'Date', 'Site / reporter', 'Reason', 'Return reference', 'Status'], S.data.issues.map(row => '<tr><td>' + h(row.id) + '<span class="sub">' + h(row.type) + '</span></td><td>' + h(row.date) + '</td><td>' + h(row.site) + '<span class="sub">' + h(row.reporter) + '</span></td><td class="wrap">' + h(row.reason) + '</td><td>' + h(row.returnRef || '—') + '</td><td>' + I.badge(row.status) + '</td></tr>')) + '<h3>Held stock</h3>' + I.table(['Item', 'Held quantity', 'Bin'], S.data.items.filter(row => row.held > 0).map(row => '<tr><td>' + h(row.name) + '</td><td class="num">' + n(row.held) + '</td><td>' + h(row.bin) + '</td></tr>'), 'No stock is currently held.') };
    }
    I.actions['reports-summary'] = kind => {
        const report = summaryReport(kind);
        const body = '<article class="doc-sheet"><div class="doc-brand"><div><h2>COSMIX ENGINEERING</h2><p>Inventory & Warehouse Department</p></div><span>HTML MOCKUP · REPORT</span></div><div class="doc-title"><div><small>OPERATIONAL REPORT</small><h3>' + h(report.title) + '</h3></div><div><small>Generated</small><strong>' + h(S.today()) + '</strong></div></div>' + report.body + '<p class="doc-footer">Local demonstration report · Values are derived from current browser records</p></article>';
        I.dialog(report.title, body + '<div class="actions doc-preview-actions">' + I.btn('Print report', 'reports-summary-print', kind, 'primary') + '</div>', '', null);
        document.getElementById('inv-dialog')?.classList.add('document-dialog');
    };
    I.actions['reports-summary-print'] = kind => { const report = summaryReport(kind); I.print(report.title, report.body); };
    I.reportDocuments = documents;
})(window);
