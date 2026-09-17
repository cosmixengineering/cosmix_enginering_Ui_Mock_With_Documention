const fs = require('fs');
let reqJs = fs.readFileSync('assets/js/inventory-requests.js', 'utf8');

const newLogic = `    I.pages['request-history'] = () => {
        const id = I.query('id');
        const r = S.data.requests.find(x => x.id === id);
        if (!r) return I.notice('Request not found.');

        const auditRows = r.lines.map(l => {
            const i = S.item(l.item);
            return '<tr><td>' + h(i.name) + '</td><td class="num">' + n(i.stock) + '</td><td class="num">' + n(S.reserved(i.id)) + '</td><td class="num">' + n(l.allocated) + '</td><td class="num">' + n(i.held) + '</td></tr>';
        });

        const siteTotals = {};
        S.data.deliveries.filter(d => d.site === r.site).forEach(d => {
            d.lines.forEach(line => {
                if (!siteTotals[line.item]) siteTotals[line.item] = 0;
                siteTotals[line.item] += Number(line.qty) || 0;
            });
        });

        const siteDeliveryRows = Object.keys(siteTotals).map(itemId => {
            const i = S.item(itemId);
            return '<tr><td><strong>' + h(i.name) + '</strong><span class="sub">' + h(i.materialCode || i.id) + '</span></td><td>' + h(i.category) + '</td><td>' + h(i.unit) + '</td><td class="num">' + n(siteTotals[itemId]) + '</td></tr>';
        });

        const supervisorRequests = S.data.requests.filter(req => req.supervisor === r.supervisor);
        const superRows = supervisorRequests.map(req => {
            const reqDate = req.timeline && req.timeline[0] ? req.timeline[0].time : 'Unknown date';
            return '<tr><td>' + I.link(req.id, 'request-detail.html?id=' + req.id) + '<span class="sub">' + h(reqDate) + '</span></td><td>' + h(req.site) + '</td><td>' + I.badge(req.priority) + '</td><td>' + I.badge(S.requestStatus(req)) + '</td></tr>';
        });

        return I.panel('Request Information', '<div class="pad grid four"><div><small>Request ID</small><br><strong>' + h(r.id) + '</strong></div><div><small>Site / Project</small><br><strong>' + h(r.site) + '</strong></div><div><small>Supervisor</small><br><strong>' + h(r.supervisor) + '</strong></div><div><small>Status</small><br>' + I.badge(S.requestStatus(r)) + '</div></div>') + 
            I.panel('Stock Reservation Details (This Request)', '<div class="pad"><p class="meta">Stock is checked and reserved automatically when preparing dispatch or sending a purchase request.</p>' + I.table(['Item', 'On hand', 'All reservations', 'This request', 'Held'], auditRows) + '</div>') + 
            I.panel('Site Material Delivery History', '<div class="pad"><p class="meta">Total materials dispatched and delivered to <strong>' + h(r.site) + '</strong> across all requests.</p>' + (siteDeliveryRows.length ? I.table(['Item / Material', 'Category', 'Unit', 'Total Delivered'], siteDeliveryRows) : '<p>No materials delivered to this site yet.</p>') + '</div>') +
            I.panel('Supervisor Request History', '<div class="pad"><p class="meta">All requests submitted by <strong>' + h(r.supervisor) + '</strong>.</p>' + (superRows.length ? I.table(['Request / Date', 'Site', 'Priority', 'Status'], superRows) : '<p>No other requests found.</p>') + '</div>') +
            I.panel('Full Request Timeline', '<div class="pad"><ol class="timeline">' + r.timeline.slice().reverse().map(e => '<li>' + h(e.text) + '<small>' + h(e.time) + '</small></li>').join('') + '</ol></div>') + 
            '<div style="margin-top:16px;">' + I.link('← Back to Request Detail', 'request-detail.html?id=' + r.id) + '</div>';
    };`;

const startIndex = reqJs.indexOf("I.pages['request-history'] = () => {");
const endIndex = reqJs.indexOf("})(window);");

reqJs = reqJs.substring(0, startIndex) + newLogic + '\n\n' + reqJs.substring(endIndex);

fs.writeFileSync('assets/js/inventory-requests.js', reqJs);
console.log('Site history and supervisor history panels added!');
