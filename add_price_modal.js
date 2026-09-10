const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname, 'hr', 'warehouse', 'inventory.html');
let html = fs.readFileSync(inventoryPath, 'utf8');

const targetSection = `<div class="grid grid-cols-4 gap-4">
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
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Location / Bin</label>
                                    <input type="text" placeholder="e.g. Zone-A / R-12" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Opening Stock</label>
                                    <input type="number" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>`;

const newSection = `<div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Unit of Measure</label>
                                    <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Pcs</option><option>Bags</option><option>Coils</option><option>Lengths</option><option>Tons</option><option>Gallons</option><option>Sets</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Purchase Price (Per Unit) *</label>
                                    <div class="relative">
                                        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 font-semibold text-sm">Rs.</span>
                                        <input type="number" placeholder="0.00" class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Min Stock Level</label>
                                    <input type="number" placeholder="e.g. 50" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Location / Bin</label>
                                    <input type="text" placeholder="e.g. Zone-A / R-12" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Opening Stock</label>
                                    <input type="number" value="0" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                            </div>`;

html = html.replace(targetSection, newSection);

fs.writeFileSync(inventoryPath, html);
console.log('Purchase Price added to Modal');
