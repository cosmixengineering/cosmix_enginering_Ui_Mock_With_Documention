const fs = require('fs');
let c = fs.readFileSync('assets/css/style.css', 'utf8');

c += '\n#sidebar.w-\\[64px\\] .menu-text, #sidebar.w-\\[64px\\] #menu-label { display: none !important; }\n';
fs.writeFileSync('assets/css/style.css', c);
console.log('style.css updated');
