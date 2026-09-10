const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname, 'hr', 'warehouse', 'inventory.html');
let html = fs.readFileSync(inventoryPath, 'utf8');

// 1. Replace action buttons with functional ones
html = html.replace(/<button class="text-gray-400 hover:text-\[\#242b5f\] mr-3" title="Print Barcode"><i class="fa-solid fa-barcode"><\/i><\/button>/g,
    `<button onclick="openBarcodeModal()" class="text-gray-400 hover:text-[#242b5f] mr-3" title="Print Barcode"><i class="fa-solid fa-barcode"></i></button>`);

html = html.replace(/<button class="text-blue-600 hover:text-blue-800 mr-3" title="Edit Item"><i class="fa-solid fa-pen-to-square"><\/i><\/button>/g,
    `<button onclick="openModal('addItemModal')" class="text-blue-600 hover:text-blue-800 mr-3" title="Edit Item"><i class="fa-solid fa-pen-to-square"></i></button>`);

html = html.replace(/<button class="text-gray-400 hover:text-gray-600" title="More Actions"><i class="fa-solid fa-ellipsis-vertical"><\/i><\/button>/g,
    `<button onclick="alert('Available Actions:\\n- View Stock Ledger\\n- Physical Stock Verification\\n- Deactivate Item')" class="text-gray-400 hover:text-gray-600" title="More Actions"><i class="fa-solid fa-ellipsis-vertical"></i></button>`);

// 2. Add Barcode Modal HTML before </body> or inside the template literal
// Since it's inside setPageContent, we need to inject it before the backtick closes.
const barcodeModalHTML = `
            <!-- Barcode Modal -->
            <div id="barcodeModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden z-50 flex items-center justify-center transition-opacity">
                <div class="bg-white w-full max-w-sm rounded-xl shadow-xl flex flex-col overflow-hidden">
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-[#242b5f] text-white">
                        <h3 class="font-bold text-sm"><i class="fas fa-barcode mr-2"></i> Print Item Barcode</h3>
                        <button onclick="closeModal('barcodeModal')" class="text-gray-300 hover:text-white transition-colors"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="p-8 flex flex-col items-center justify-center bg-gray-50">
                        <div class="bg-white p-4 border border-gray-200 shadow-sm text-center">
                            <p class="font-bold text-gray-800 text-sm mb-2">Cosmix Engineering</p>
                            <img src="https://barcode.tec-it.com/barcode.ashx?data=ITM-HVAC-001&code=Code128&translate-esc=on" alt="Barcode" class="h-20 object-contain mb-2">
                            <p class="text-xs font-mono text-gray-500">ITM-HVAC-001</p>
                        </div>
                    </div>
                    <div class="p-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                        <button onclick="closeModal('barcodeModal')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 font-semibold text-sm transition">Cancel</button>
                        <button onclick="alert('Sending to connected Zebra label printer...'); closeModal('barcodeModal');" class="px-4 py-2 bg-[#242b5f] hover:bg-blue-800 text-white rounded-md font-semibold text-sm transition shadow-sm"><i class="fas fa-print mr-1"></i> Print Label</button>
                    </div>
                </div>
            </div>
`;

// Insert the barcode modal just before the closing backtick of setPageContent
html = html.replace(
    '        `);',
    barcodeModalHTML + '\n        `);'
);

// 3. Add openBarcodeModal to window scope
const jsFunction = `
        window.openBarcodeModal = function() {
            const modal = document.getElementById('barcodeModal');
            if(modal) { modal.classList.remove('hidden'); }
        };
`;

html = html.replace(
    'window.openModal = function(id) {',
    jsFunction + '\n        window.openModal = function(id) {'
);

fs.writeFileSync(inventoryPath, html);
console.log('Action buttons made functional and Barcode modal added.');
