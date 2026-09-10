const fs = require('fs');
['hr/warehouse/equipment.html', 'hr/warehouse/request-detail.html'].forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/\\\`\);/g, '`);');
    fs.writeFileSync(f, c);
    console.log('Fixed ' + f);
});
