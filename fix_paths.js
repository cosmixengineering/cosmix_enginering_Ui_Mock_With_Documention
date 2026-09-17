const fs = require('fs');
const path = require('path');

const warehouseDir = path.join(__dirname, 'warehouse');

// 1. Fix HTML files in the warehouse folder
const files = fs.readdirSync(warehouseDir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(warehouseDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        // Fix asset paths
        content = content.replace(/..\/..\/assets\//g, '../assets/');
        fs.writeFileSync(filePath, content);
        console.log('Fixed paths in: ' + file);
    }
});

// 2. Fix shared.js
const sharedPath = path.join(__dirname, 'assets/js/shared.js');
if (fs.existsSync(sharedPath)) {
    let shared = fs.readFileSync(sharedPath, 'utf8');
    // Replace "hr/warehouse/" with "warehouse/"
    shared = shared.replace(/hr\/warehouse\//g, 'warehouse/');
    
    // Fix the pathNorm logic for warehouse
    shared = shared.replace(/pathNorm\.includes\('\/warehouse\/'\) \? '\.\.\/\.\.\/' : isSubfolder \? '\.\.\/' : '\.\/'/, "isSubfolder ? '../' : './'");
    
    fs.writeFileSync(sharedPath, shared);
    console.log('Fixed shared.js');
}

// 3. Fix any references in inventory JS
const invFiles = ['inventory-ui.js', 'inventory-store.js', 'inventory-procurement.js', 'inventory-requests.js'];
invFiles.forEach(f => {
    const p = path.join(__dirname, 'assets/js', f);
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/hr\/warehouse\//g, 'warehouse/');
        fs.writeFileSync(p, content);
        console.log('Fixed ' + f);
    }
});
