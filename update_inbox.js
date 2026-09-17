const fs = require('fs');
let c = fs.readFileSync('assets/js/inventory-requests.js', 'utf8');

// The line for items:
// cell(r.lines.map(l => h(S.item(l.item).name) + ' <strong>' + n(l.qty) + '</strong> <small>' + h(S.item(l.item).unit) + '</small>').join('<br>'), 'wrap')
const oldItemsLine = "cell(r.lines.map(l => h(S.item(l.item).name) + ' <strong>' + n(l.qty) + '</strong> <small>' + h(S.item(l.item).unit) + '</small>').join('<br>'), 'wrap')";
const newItemsLine = "cell('<strong>' + r.lines.length + '</strong> distinct item' + (r.lines.length === 1 ? '' : 's'))";

// The line for Review request:
// cell(I.link('Review request', href('request-detail', r.id))) + '</tr>';
const oldActionLine = "cell(I.link('Review request', href('request-detail', r.id))) + '</tr>';";
const newActionLine = "cell(I.link('Review detail', href('request-detail', r.id))) + '</tr>';";

c = c.replace(oldItemsLine, newItemsLine);
c = c.replace(oldActionLine, newActionLine);

fs.writeFileSync('assets/js/inventory-requests.js', c);
console.log('updated inventory-requests.js');
