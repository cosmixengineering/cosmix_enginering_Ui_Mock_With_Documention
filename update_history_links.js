const fs = require('fs');
const path = require('path');

const sharedPath = path.join(__dirname, 'assets', 'js', 'shared.js');
let shared = fs.readFileSync(sharedPath, 'utf8');

// Add to sidebar
const equipmentLink = "activePage === 'equipment', { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', label: 'Assign' })}";
const newLink = equipmentLink + "\n                  ${createNavLink(p + 'hr/warehouse/history.html', 'Stock History & Ledger', 'fas fa-history', activePage === 'history')}";

if (!shared.includes('history.html')) {
    shared = shared.replace(equipmentLink, newLink);
    
    const equipmentActive = "activePage = 'equipment';\n    }";
    const historyActive = "activePage = 'equipment';\n    } else if (pathNorm.includes('/warehouse/history.html')) {\n        activePage = 'history';\n    }";
    shared = shared.replace(equipmentActive, historyActive);
    
    fs.writeFileSync(sharedPath, shared);
    console.log('shared.js updated with History link.');
}

// Update inventory.html
const inventoryPath = path.join(__dirname, 'hr', 'warehouse', 'inventory.html');
let inventory = fs.readFileSync(inventoryPath, 'utf8');
inventory = inventory.replace(/onclick="alert\('Available Actions:[^']+'\)"/g, 'onclick="window.location.href=\\\'history.html\\\'"');
fs.writeFileSync(inventoryPath, inventory);
console.log('inventory.html updated to link to history.');
