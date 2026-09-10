const fs = require('fs');
const path = require('path');

const sharedPath = path.join(__dirname, 'assets', 'js', 'shared.js');
let shared = fs.readFileSync(sharedPath, 'utf8');

const targetLink = "activePage === 'outward', { bg: 'bg-red-50 border border-red-200', text: 'text-red-700', label: '12' })}";
const newLink = "activePage === 'outward', { bg: 'bg-red-50 border border-red-200', text: 'text-red-700', label: '12' })}\n                  ${createNavLink(p + 'hr/warehouse/equipment.html', 'Tools & Equipment', 'fas fa-tools', activePage === 'equipment', { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', label: 'Assign' })}";

if (!shared.includes('equipment.html')) {
    shared = shared.replace(targetLink, newLink);
    
    // Also, handle the activePage deduction logic in shared.js
    const activeLogicMatch = `else if (pathNorm.includes('/warehouse/outward.html')) {
        activePage = 'outward';
    }`;
    const activeLogicReplacement = `else if (pathNorm.includes('/warehouse/outward.html')) {
        activePage = 'outward';
    } else if (pathNorm.includes('/warehouse/equipment.html')) {
        activePage = 'equipment';
    }`;
    
    shared = shared.replace(activeLogicMatch, activeLogicReplacement);
    
    fs.writeFileSync(sharedPath, shared);
    console.log('shared.js updated with Tools & Equipment link.');
} else {
    console.log('shared.js already contains Tools & Equipment link.');
}
