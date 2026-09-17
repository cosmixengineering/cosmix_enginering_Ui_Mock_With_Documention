const fs = require('fs');
let c = fs.readFileSync('assets/js/inventory-ui.js', 'utf8');

const targetStr = '<td class="num">${money(i.price)}</td><td class="num">${n(i.stock)}</td>';
const replacementStr = '<td>${money(i.price)}</td><td>${n(i.stock)}</td>';

if (c.includes(targetStr)) {
    c = c.replace(targetStr, replacementStr);
    fs.writeFileSync('assets/js/inventory-ui.js', c);
    console.log('Fixed alignment!');
} else {
    console.log('Target string not found!');
}
