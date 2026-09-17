const fs = require('fs');
const c = fs.readFileSync('assets/js/inventory-ui.js', 'utf8');
const idx = c.indexOf("actions['vendor-edit']");
console.log(c.substring(idx, idx + 800));
