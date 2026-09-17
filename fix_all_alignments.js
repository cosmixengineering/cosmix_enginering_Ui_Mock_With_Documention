const fs = require('fs');

let ui = fs.readFileSync('assets/js/inventory-ui.js', 'utf8');
ui = ui.replace(/<td class="num">/g, '<td>');
fs.writeFileSync('assets/js/inventory-ui.js', ui);

let req = fs.readFileSync('assets/js/inventory-requests.js', 'utf8');
req = req.replace(/<td class="num">/g, '<td>');
fs.writeFileSync('assets/js/inventory-requests.js', req);

console.log('Fixed alignments by removing .num class');
