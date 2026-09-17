const fs = require('fs');
let c = fs.readFileSync('assets/js/shared.js', 'utf8');

const oldCode1 = "sidebar.classList.add('w-[64px]');";
const newCode1 = "sidebar.classList.add('w-[64px]', 'overflow-x-hidden');";

const oldCode2 = "sidebar.classList.remove('w-[64px]');";
const newCode2 = "sidebar.classList.remove('w-[64px]', 'overflow-x-hidden');";

c = c.replace(oldCode1, newCode1).replace(oldCode2, newCode2);
fs.writeFileSync('assets/js/shared.js', c);
console.log('Shared.js updated');
