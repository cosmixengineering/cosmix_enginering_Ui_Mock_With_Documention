const fs = require('fs');
const path = require('path');

const sharedJsPath = path.join(__dirname, 'assets', 'js', 'shared.js');
let sharedJs = fs.readFileSync(sharedJsPath, 'utf8');

// For Accounts Connected Modules (around line 90 now)
sharedJs = sharedJs.replace(
    "${createNavLink(p + 'hr/index.html', 'HR Operations Portal', 'fas fa-users-cog', false, { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-600', label: 'HR' })}\n                </div>",
    "${createNavLink(p + 'hr/index.html', 'HR Operations Portal', 'fas fa-users-cog', false, { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-600', label: 'HR' })}\n                    ${createNavLink(p + 'hr/warehouse/index.html', 'Warehouse & Stock', 'fas fa-boxes', false, { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: 'Stores' })}\n                </div>"
);

// For HR Connected Modules (around line 116 now)
sharedJs = sharedJs.replace(
    "${createNavLink(p + 'accounts/index.html', 'Accounts & Finance', 'fas fa-file-invoice-dollar', false, { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700', label: 'Accounts' })}\n                </div>",
    "${createNavLink(p + 'accounts/index.html', 'Accounts & Finance', 'fas fa-file-invoice-dollar', false, { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700', label: 'Accounts' })}\n                    ${createNavLink(p + 'hr/warehouse/index.html', 'Warehouse & Stock', 'fas fa-boxes', false, { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: 'Stores' })}\n                </div>"
);

fs.writeFileSync(sharedJsPath, sharedJs);
console.log('Fixed connected modules links.');
