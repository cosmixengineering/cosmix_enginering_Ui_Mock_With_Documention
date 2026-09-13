const fs = require('fs');
const path = require('path');

const sharedJsPath = path.join(__dirname, 'assets', 'js', 'shared.js');
let sharedJs = fs.readFileSync(sharedJsPath, 'utf8');

// 1. Add isWarehouse flag
sharedJs = sharedJs.replace(
    "const isAccounts = (currentDeptId === 'accounts' || currentDeptId === 'finance');",
    "const isAccounts = (currentDeptId === 'accounts' || currentDeptId === 'finance');\n    const isWarehouse = (currentDeptId === 'warehouse' || currentDeptId === 'inventory');"
);

// 2. Change navItemsHTML ternary to if/else chain
const warehouseNavItems = `
        <div>
            <div class="flex items-center justify-between px-2 mb-2">
                <p id="menu-label" class="text-[10px] text-slate-400 font-bold uppercase tracking-wider transition-opacity duration-300">Warehouse Module</p>
                <span class="menu-text text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 transition-opacity duration-300">STORES</span>
            </div>
            <nav class="space-y-1">
                \${createNavLink(p + 'hr/warehouse/index.html', 'Dashboard', 'fas fa-chart-pie', activePage === 'dashboard')}
                \${createNavLink(p + 'hr/warehouse/inventory.html', 'Master Inventory', 'fas fa-boxes-stacked', activePage === 'inventory', { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: '1,245' })}
                \${createNavLink(p + 'hr/warehouse/inward.html', 'Inward (GRN)', 'fas fa-arrow-right-to-bracket', activePage === 'inward')}
                \${createNavLink(p + 'hr/warehouse/outward.html', 'Outward (Dispatch)', 'fas fa-truck-ramp-box', activePage === 'outward', { bg: 'bg-red-50 border border-red-200', text: 'text-red-700', label: '12' })}
                <div class="pt-2 mt-2 border-t border-slate-100">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 menu-text">Connected Modules</p>
                    \${createNavLink(p + 'hr/index.html', 'HR Operations Portal', 'fas fa-users-cog', false, { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-600', label: 'HR' })}
                    \${createNavLink(p + 'accounts/index.html', 'Accounts & Finance', 'fas fa-file-invoice-dollar', false, { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700', label: 'Accounts' })}
                </div>
            </nav>
        </div>
`;

sharedJs = sharedJs.replace(
    "const navItemsHTML = isAccounts ?",
    "const navItemsHTML = isWarehouse ? `" + warehouseNavItems.trim() + "` : isAccounts ?"
);

// 3. Fix the Top Bar Quick Links for warehouse
sharedJs = sharedJs.replace(
    "${isAccounts ? `",
    "${isWarehouse ? `\n                        ${createTopBarLink(p + 'hr/warehouse/inward.html', 'fas fa-arrow-right-to-bracket', activePage === 'inward', 'Inward (Receive)')}\n                        ${createTopBarLink(p + 'hr/warehouse/outward.html', 'fas fa-truck-ramp-box', activePage === 'outward', 'Outward (Dispatch)')}\n                    ` : isAccounts ? `"
);

// 4. Update the path depth logic because hr/warehouse/ is 2 levels deep!
// Find the `isSubfolder` logic
sharedJs = sharedJs.replace(
    "const p = isSubfolder ? '../' : './';",
    "const p = pathNorm.includes('/warehouse/') ? '../../' : isSubfolder ? '../' : './';"
);

fs.writeFileSync(sharedJsPath, sharedJs);
console.log('Updated shared.js successfully.');

// --- NOW FIX THE WAREHOUSE HTML FILES ---

const htmlTemplate = (pageTitle, activePage, mainContent) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>html { font-size: 13px !important; } body { font-family: 'Inter', sans-serif; } table th { padding: 0.4rem 0.75rem !important; font-size: 0.72rem !important; } table td { padding: 0.45rem 0.75rem !important; font-size: 0.78rem !important; }</style>
</head>
<body class="text-gray-800">
    <div id="app-layout" class="flex min-h-screen"></div>
    <link rel="stylesheet" href="../../assets/css/style.css">
    <script src="../../assets/js/shared.js"></script>
    <script>
        renderLayout('${activePage}');
        setPageContent('${pageTitle.split('|')[0].trim()}', \`
${mainContent}
        \`);
    </script>
</body>
</html>`;

const warehouseDir = path.join(__dirname, 'hr', 'warehouse');
const files = ['index.html', 'inventory.html', 'inward.html', 'outward.html'];
const activePages = {
    'index.html': 'dashboard',
    'inventory.html': 'inventory',
    'inward.html': 'inward',
    'outward.html': 'outward'
};

files.forEach(file => {
    const filePath = path.join(warehouseDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extract main content, assuming it is inside `<main...>` -> `<div class="flex-1 overflow-y-auto p-6">`
    // Or just grab everything after `<header...>` and inside `<main>`
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    let innerHTML = mainMatch ? mainMatch[1] : '';
    
    // Strip header if it exists
    innerHTML = innerHTML.replace(/<header[^>]*>[\s\S]*?<\/header>/i, '').trim();
    
    // Strip wrapping container
    innerHTML = innerHTML.replace(/<div class="flex-1 overflow-y-auto p-6">([\s\S]*?)<\/div>$/i, '$1').trim();
    
    // Also remove any "Warehouse Dashboard" H2 because setPageContent adds a title, or we can just let it be.
    // Let's generate the new file content
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'Warehouse | Cosmix ERP';
    
    const newHTML = htmlTemplate(title, activePages[file], innerHTML);
    fs.writeFileSync(filePath, newHTML);
    console.log('Updated ' + file);
});

