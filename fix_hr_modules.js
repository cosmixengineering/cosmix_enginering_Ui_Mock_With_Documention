const fs = require('fs');
const path = require('path');

const sharedJsPath = path.join(__dirname, 'assets', 'js', 'shared.js');
let sharedJs = fs.readFileSync(sharedJsPath, 'utf8');

// Use exact string replacement for the HR section.
const searchStr = "${createNavLink(p + 'accounts/index.html', 'Accounts & Finance', 'fas fa-file-invoice-dollar', false, { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700', label: 'Accounts' })}\n                </div>\n            </nav>\n        </div>\n    `;";
const replacementStr = "${createNavLink(p + 'accounts/index.html', 'Accounts & Finance', 'fas fa-file-invoice-dollar', false, { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700', label: 'Accounts' })}\n                    ${createNavLink(p + 'hr/warehouse/index.html', 'Warehouse & Stock', 'fas fa-boxes', false, { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: 'Stores' })}\n                </div>\n            </nav>\n        </div>\n    `;";

if (sharedJs.includes(searchStr)) {
    sharedJs = sharedJs.replace(searchStr, replacementStr);
    fs.writeFileSync(sharedJsPath, sharedJs);
    console.log('Fixed HR connected modules links.');
} else {
    console.log('String not found.');
}
