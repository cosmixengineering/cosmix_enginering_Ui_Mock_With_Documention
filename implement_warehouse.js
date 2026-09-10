const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname, 'hr', 'warehouse', 'inventory.html');
const inwardPath = path.join(__dirname, 'hr', 'warehouse', 'inward.html');
const outwardPath = path.join(__dirname, 'hr', 'warehouse', 'outward.html');
const dashboardPath = path.join(__dirname, 'hr', 'warehouse', 'index.html');

// --- 1. Master Inventory Modal ---
let inventoryHtml = fs.readFileSync(inventoryPath, 'utf8');

const inventoryModal = `
                <!-- Add Item Modal -->
                <div id="addItemModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden z-50 flex items-center justify-center transition-opacity">
                    <div class="bg-white w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
                        <div class="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h3 class="font-bold text-gray-800 text-lg"><i class="fas fa-box-open mr-2 text-blue-600"></i> Add New Master Item</h3>
                            <button onclick="closeModal('addItemModal')" class="text-gray-400 hover:text-red-500 transition-colors"><i class="fas fa-times text-lg"></i></button>
                        </div>
                        <div class="p-6 overflow-y-auto space-y-4">
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">SKU / Code</label>
                                    <input type="text" value="ITM-AUTO-001" readonly class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-500 font-mono text-sm focus:outline-none">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Category *</label>
                                    <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Select Category...</option>
                                        <option>Civil & Construction</option>
                                        <option>Electrical</option>
                                        <option>Plumbing</option>
                                        <option>Tools & Equipment</option>
                                        <option>Consumables</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Item Name *</label>
                                <input type="text" placeholder="e.g. Paint Brush 4 inch" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Description</label>
                                <textarea rows="2" placeholder="Item specifications..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Unit of Measure</label>
                                    <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Pcs</option><option>Bags</option><option>Coils</option><option>Lengths</option><option>Tons</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Min Stock Level</label>
                                    <input type="number" placeholder="e.g. 50" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Opening Stock</label>
                                    <input type="number" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>
                        </div>
                        <div class="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                            <button onclick="closeModal('addItemModal')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 font-semibold text-sm transition">Cancel</button>
                            <button onclick="closeModal('addItemModal')" class="px-4 py-2 bg-[#242b5f] hover:bg-blue-800 text-white rounded-md font-semibold text-sm transition shadow-sm">Save & Add Item</button>
                        </div>
                    </div>
                </div>
`;

// Replace add button onclick
inventoryHtml = inventoryHtml.replace(
    '<button class="bg-[#242b5f] hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-2">',
    '<button onclick="openModal(\'addItemModal\')" class="bg-[#242b5f] hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-2">'
);

// Inject modal before the end of the template literal
if (!inventoryHtml.includes('addItemModal')) {
    inventoryHtml = inventoryHtml.replace(/\s*`\);\s*<\/script>/, `\n${inventoryModal}\n        \`);\n        function openModal(id) { document.getElementById(id).classList.remove('hidden'); }\n        function closeModal(id) { document.getElementById(id).classList.add('hidden'); }\n    </script>`);
}

fs.writeFileSync(inventoryPath, inventoryHtml);


// --- 2. Inward (GRN) Form Modal ---
let inwardHtml = fs.readFileSync(inwardPath, 'utf8');

const grnModal = `
                <!-- Receive GRN Modal -->
                <div id="grnModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden z-50 flex items-center justify-center transition-opacity">
                    <div class="bg-white w-full max-w-3xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
                        <div class="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h3 class="font-bold text-gray-800 text-lg"><i class="fas fa-file-signature mr-2 text-emerald-600"></i> Generate Goods Receipt Note (GRN)</h3>
                            <button onclick="closeModal('grnModal')" class="text-gray-400 hover:text-red-500 transition-colors"><i class="fas fa-times text-lg"></i></button>
                        </div>
                        <div class="p-6 overflow-y-auto space-y-4">
                            <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 flex justify-between items-center mb-2">
                                <div>
                                    <p class="text-xs text-blue-600 font-bold uppercase mb-1">Reference PO</p>
                                    <p class="font-mono text-gray-800 font-bold">PO-2026-089 (Al-Fatah Hardware)</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-xs text-blue-600 font-bold uppercase mb-1">Expected Date</p>
                                    <p class="text-gray-800 font-bold">Today, 10-Sep-2026</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Delivery Challan No. *</label>
                                    <input type="text" placeholder="Vendor's DC Number" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Vehicle / Driver Details</label>
                                    <input type="text" placeholder="e.g. KHI-1234, Driver: Ali" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>
                            
                            <h4 class="font-bold text-gray-800 mt-4 mb-2 text-sm border-b pb-2">Receiving Items</h4>
                            <table class="w-full text-sm text-left text-gray-600 border border-gray-200">
                                <thead class="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
                                    <tr>
                                        <th class="px-3 py-2">Item</th>
                                        <th class="px-3 py-2 text-center">Ordered</th>
                                        <th class="px-3 py-2">Received Qty</th>
                                        <th class="px-3 py-2">QC Check</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-t border-gray-200">
                                        <td class="px-3 py-2 font-semibold text-gray-800">Steel Rebar 60 Grade</td>
                                        <td class="px-3 py-2 text-center bg-gray-50">10 Tons</td>
                                        <td class="px-3 py-2"><input type="number" value="10" class="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"></td>
                                        <td class="px-3 py-2 text-center">
                                            <input type="checkbox" checked class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"> Pass
                                        </td>
                                    </tr>
                                    <tr class="border-t border-gray-200">
                                        <td class="px-3 py-2 font-semibold text-gray-800">Binding Wire</td>
                                        <td class="px-3 py-2 text-center bg-gray-50">50 kg</td>
                                        <td class="px-3 py-2"><input type="number" value="50" class="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"></td>
                                        <td class="px-3 py-2 text-center">
                                            <input type="checkbox" checked class="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"> Pass
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mt-4 mb-1 uppercase">Notes / Remarks</label>
                                <textarea rows="2" placeholder="Any damages or short supplies..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                        </div>
                        <div class="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                            <button onclick="closeModal('grnModal')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 font-semibold text-sm transition">Cancel</button>
                            <button onclick="closeModal('grnModal')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold text-sm transition shadow-sm">Confirm & Generate GRN</button>
                        </div>
                    </div>
                </div>
`;

inwardHtml = inwardHtml.replace(/<button class="w-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold py-2 rounded-md transition-colors">/g, 
    '<button onclick="openModal(\'grnModal\')" class="w-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold py-2 rounded-md transition-colors">');

if (!inwardHtml.includes('grnModal')) {
    inwardHtml = inwardHtml.replace(/\s*`\);\s*<\/script>/, `\n${grnModal}\n        \`);\n        function openModal(id) { document.getElementById(id).classList.remove('hidden'); }\n        function closeModal(id) { document.getElementById(id).classList.add('hidden'); }\n    </script>`);
}

fs.writeFileSync(inwardPath, inwardHtml);

// --- 3. Outward (Dispatch) Form Modal ---
let outwardHtml = fs.readFileSync(outwardPath, 'utf8');

const dispatchModal = `
                <!-- Dispatch Modal -->
                <div id="dispatchModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden z-50 flex items-center justify-center transition-opacity">
                    <div class="bg-white w-full max-w-3xl rounded-xl shadow-xl flex flex-col max-h-[90vh]">
                        <div class="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
                            <h3 class="font-bold text-gray-800 text-lg"><i class="fas fa-truck-fast mr-2 text-indigo-600"></i> Generate Material Issue Slip (MIS)</h3>
                            <button onclick="closeModal('dispatchModal')" class="text-gray-400 hover:text-red-500 transition-colors"><i class="fas fa-times text-lg"></i></button>
                        </div>
                        <div class="p-6 overflow-y-auto space-y-4">
                            <div class="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex justify-between items-center mb-2">
                                <div>
                                    <p class="text-xs text-indigo-600 font-bold uppercase mb-1">Requesting Site</p>
                                    <p class="font-bold text-gray-800">Site A (DHA Phase 8)</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-xs text-indigo-600 font-bold uppercase mb-1">Approved By</p>
                                    <p class="text-gray-800 font-bold">Engr. Salman</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Dispatch Date</label>
                                    <input type="date" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Vehicle / Driver Details</label>
                                    <input type="text" placeholder="e.g. Company Truck T-01" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>
                            
                            <h4 class="font-bold text-gray-800 mt-4 mb-2 text-sm border-b pb-2">Issuing Items</h4>
                            <table class="w-full text-sm text-left text-gray-600 border border-gray-200">
                                <thead class="bg-gray-50 text-xs uppercase font-semibold text-gray-700">
                                    <tr>
                                        <th class="px-3 py-2">Item</th>
                                        <th class="px-3 py-2 text-center">Requested</th>
                                        <th class="px-3 py-2 text-center">Current Stock</th>
                                        <th class="px-3 py-2">Issue Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-t border-gray-200">
                                        <td class="px-3 py-2 font-semibold text-gray-800">Cement Bags (OPC)</td>
                                        <td class="px-3 py-2 text-center bg-gray-50">200 Bags</td>
                                        <td class="px-3 py-2 text-center text-emerald-600 font-bold">1,250 Bags</td>
                                        <td class="px-3 py-2"><input type="number" value="200" max="1250" class="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mt-4 mb-1 uppercase">Gate Pass Remarks</label>
                                <textarea rows="2" placeholder="Add any special instructions for the gate..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                        </div>
                        <div class="p-5 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                            <button onclick="closeModal('dispatchModal')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 font-semibold text-sm transition">Cancel</button>
                            <button onclick="closeModal('dispatchModal')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-sm transition shadow-sm">Issue & Print MIS</button>
                        </div>
                    </div>
                </div>
`;

outwardHtml = outwardHtml.replace(/<button class="bg-[#242b5f] hover:bg-blue-800 text-white px-4 py-1\.5 rounded text-sm font-bold shadow-sm transition">Issue Now<\/button>/g,
    '<button onclick="openModal(\'dispatchModal\')" class="bg-[#242b5f] hover:bg-blue-800 text-white px-4 py-1.5 rounded text-sm font-bold shadow-sm transition">Issue Now</button>');

if (!outwardHtml.includes('dispatchModal')) {
    outwardHtml = outwardHtml.replace(/\s*`\);\s*<\/script>/, `\n${dispatchModal}\n        \`);\n        function openModal(id) { document.getElementById(id).classList.remove('hidden'); }\n        function closeModal(id) { document.getElementById(id).classList.add('hidden'); }\n    </script>`);
}

fs.writeFileSync(outwardPath, outwardHtml);

// --- 4. Dashboard Low Stock PR Action ---
let dashboardHtml = fs.readFileSync(dashboardPath, 'utf8');

dashboardHtml = dashboardHtml.replace(
    '<td class="px-4 py-3"><span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Critical</span></td>',
    '<td class="px-4 py-3"><span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Critical</span></td>\n                                <td class="px-4 py-3 text-right"><button class="text-xs font-bold text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 px-2 py-1 rounded transition">Generate PR</button></td>'
);

dashboardHtml = dashboardHtml.replace(
    '<td class="px-4 py-3"><span class="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">Warning</span></td>',
    '<td class="px-4 py-3"><span class="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">Warning</span></td>\n                                <td class="px-4 py-3 text-right"><button class="text-xs font-bold text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 px-2 py-1 rounded transition">Generate PR</button></td>'
);

// We also need to add the header column for "ACTION" in the Low Stock Alerts table
dashboardHtml = dashboardHtml.replace(
    '<th class="px-4 py-3">Status</th>\n                                </tr>',
    '<th class="px-4 py-3">Status</th>\n                                    <th class="px-4 py-3 text-right">Action</th>\n                                </tr>'
);

fs.writeFileSync(dashboardPath, dashboardHtml);
console.log('Successfully injected all Warehouse Modals and logic!');
