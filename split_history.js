const fs = require('fs');

// 1. Add route name in inventory-ui.js
let ui = fs.readFileSync('assets/js/inventory-ui.js', 'utf8');
ui = ui.replace("'request-detail': 'Site Request Detail',", "'request-detail': 'Site Request Detail', 'request-history': 'Site Request History',");
fs.writeFileSync('assets/js/inventory-ui.js', ui);

// 2. Modify inventory-requests.js
let reqJs = fs.readFileSync('assets/js/inventory-requests.js', 'utf8');

// The original line:
// '<details class="panel"><summary class="pad" style="cursor:pointer;font-weight:600">Stock details & request history</summary><div class="pad"><p class="meta">Stock is checked and reserved automatically when preparing dispatch or sending a purchase request.</p>' + I.table(['Item', 'On hand', 'All reservations', 'This request', 'Held'], auditRows) + '<br><ol class="timeline">' + r.timeline.slice().reverse().map(e => '<li>' + h(e.text) + '<small>' + h(e.time) + '</small></li>').join('') + '</ol></div></details>';

// Let's find and replace it with a panel containing just the button.
const targetLineRegex = /'<details class="panel">.*?<\/details>';/s;

const newButtonCode = `
    I.panel('Request Actions', '<div class="pad" style="display:flex; justify-content:space-between; align-items:center;"><div><strong>View detailed history</strong><br><small>See all stock reservations and the full timeline of this request.</small></div>' + I.link('View Request History & Stock', 'request-history.html?id=' + r.id, 'primary') + '</div>');
`;

reqJs = reqJs.replace(targetLineRegex, newButtonCode);

// 3. Add the pages.request-history logic
const historyPageLogic = `
    I.pages['request-history'] = () => {
        const id = I.query('id');
        const r = S.data.requests.find(x => x.id === id);
        if (!r) return I.notice('Request not found.');

        const auditRows = r.lines.map(l => {
            const i = S.item(l.item);
            return '<tr><td>' + h(i.name) + '</td><td class="num">' + n(i.stock) + '</td><td class="num">' + n(S.reserved(i.id)) + '</td><td class="num">' + n(l.allocated) + '</td><td class="num">' + n(i.held) + '</td></tr>';
        });

        return I.panel('Request Information', '<div class="pad grid four"><div><small>Request ID</small><br><strong>' + h(r.id) + '</strong></div><div><small>Site / Project</small><br><strong>' + h(r.site) + '</strong></div><div><small>Supervisor</small><br><strong>' + h(r.supervisor) + '</strong></div><div><small>Status</small><br>' + I.badge(S.requestStatus(r)) + '</div></div>') + 
            I.panel('Stock Reservation Details', '<div class="pad"><p class="meta">Stock is checked and reserved automatically when preparing dispatch or sending a purchase request.</p>' + I.table(['Item', 'On hand', 'All reservations', 'This request', 'Held'], auditRows) + '</div>') + 
            I.panel('Full Request Timeline', '<div class="pad"><ol class="timeline">' + r.timeline.slice().reverse().map(e => '<li>' + h(e.text) + '<small>' + h(e.time) + '</small></li>').join('') + '</ol></div>') + 
            '<div style="margin-top:16px;">' + I.link('← Back to Request Detail', 'request-detail.html?id=' + r.id) + '</div>';
    };
`;

// Append before })();
reqJs = reqJs.replace(/\}\)\(\);/g, historyPageLogic + '\n})();');

fs.writeFileSync('assets/js/inventory-requests.js', reqJs);
console.log('Modifications applied successfully!');
