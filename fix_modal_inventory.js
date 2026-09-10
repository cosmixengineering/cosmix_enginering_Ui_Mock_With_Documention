const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname, 'hr', 'warehouse', 'inventory.html');
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

if (!inventoryHtml.includes('<!-- Add Item Modal -->')) {
    inventoryHtml = inventoryHtml.replace(
        "        `);\n        window.openModal = function(id) {",
        inventoryModal + "\n        `);\n        window.openModal = function(id) {"
    );
    fs.writeFileSync(inventoryPath, inventoryHtml);
    console.log('Injected missing Master Inventory Modal.');
} else {
    console.log('Modal already exists.');
}
