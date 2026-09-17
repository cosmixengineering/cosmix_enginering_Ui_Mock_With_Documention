const fs = require('fs');
let c = fs.readFileSync('assets/js/shared.js', 'utf8');

c = c.replace(/menuLabel\.classList\.add\('opacity-0', 'h-0', 'overflow-hidden', 'mb-0'\);/g, "if(menuLabel) menuLabel.classList.add('opacity-0', 'h-0', 'overflow-hidden', 'mb-0');");
c = c.replace(/menuLabel\.classList\.remove\('opacity-0', 'h-0', 'overflow-hidden', 'mb-0'\);/g, "if(menuLabel) menuLabel.classList.remove('opacity-0', 'h-0', 'overflow-hidden', 'mb-0');");

c = c.replace(/menuTexts\.forEach/g, "document.querySelectorAll('.menu-text').forEach");

fs.writeFileSync('assets/js/shared.js', c);
console.log('shared.js updated');
