const fs = require('fs');
let c = fs.readFileSync('assets/css/inventory.css', 'utf8');

if (!c.includes('#menu-label')) {
    c += '\n.inventory-app #sidebar[class~="w-[64px]"] #menu-label, .inventory-app #sidebar[class~="w-[64px]"] .menu-text { display: none !important; }\n';
    fs.writeFileSync('assets/css/inventory.css', c);
    console.log('CSS updated');
} else {
    console.log('CSS already updated');
}
