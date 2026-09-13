const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname, 'hr', 'warehouse', 'inventory.html');
let html = fs.readFileSync(inventoryPath, 'utf8');

// 1. Add Location header
html = html.replace('<th class="px-6 py-4">Unit</th>', '<th class="px-6 py-4">Unit</th>\n                                <th class="px-6 py-4">Location (Bin)</th>');

// 2. Add Location data to existing rows
html = html.replace(/<td class="px-6 py-4">Bags<\/td>/g, '<td class="px-6 py-4">Bags</td>\n                                <td class="px-6 py-4 text-xs font-mono text-gray-500">Zone-A / R-12</td>');
html = html.replace(/<td class="px-6 py-4">Coils<\/td>/g, '<td class="px-6 py-4">Coils</td>\n                                <td class="px-6 py-4 text-xs font-mono text-gray-500">Zone-B / R-04</td>');
html = html.replace(/<td class="px-6 py-4">Lengths<\/td>/g, '<td class="px-6 py-4">Lengths</td>\n                                <td class="px-6 py-4 text-xs font-mono text-gray-500">Yard / Y-01</td>');
html = html.replace(/<td class="px-6 py-4">Tons<\/td>/g, '<td class="px-6 py-4">Tons</td>\n                                <td class="px-6 py-4 text-xs font-mono text-gray-500">Yard / Y-02</td>');
html = html.replace(/<td class="px-6 py-4">Pcs<\/td>/g, '<td class="px-6 py-4">Pcs</td>\n                                <td class="px-6 py-4 text-xs font-mono text-gray-500">Zone-C / R-01</td>');
html = html.replace(/<td class="px-6 py-4">Sets<\/td>/g, '<td class="px-6 py-4">Sets</td>\n                                <td class="px-6 py-4 text-xs font-mono text-gray-500">Zone-C / R-02</td>');
html = html.replace(/<td class="px-6 py-4">Gallons<\/td>/g, '<td class="px-6 py-4">Gallons</td>\n                                <td class="px-6 py-4 text-xs font-mono text-gray-500">Zone-D / R-08</td>');

// 3. Update Actions to show Tooltips for ERP feel
html = html.replace(/<button class="text-blue-600 hover:text-blue-800 mr-3"><i class="fa-solid fa-pen-to-square"><\/i><\/button>\s*<button class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-ellipsis-vertical"><\/i><\/button>/g,
    `<button class="text-gray-400 hover:text-[#242b5f] mr-3" title="Print Barcode"><i class="fa-solid fa-barcode"></i></button>
                                    <button class="text-blue-600 hover:text-blue-800 mr-3" title="Edit Item"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="text-gray-400 hover:text-gray-600" title="More Actions"><i class="fa-solid fa-ellipsis-vertical"></i></button>`);

// 4. Update the Modal to ask for Location
html = html.replace(
    '<label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Opening Stock</label>',
    `<label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Opening Stock</label>`
);
// Actually, let's just insert it into the grid
html = html.replace(
    '<div>\n                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Opening Stock</label>',
    `<div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Location / Bin</label>
                                    <input type="text" placeholder="e.g. Zone-A / R-12" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Opening Stock</label>`
);
// Change grid-cols-3 to grid-cols-4 for the modal
html = html.replace('<div class="grid grid-cols-3 gap-4">', '<div class="grid grid-cols-4 gap-4">');

fs.writeFileSync(inventoryPath, html);
console.log('Inventory Deep Upgrade Applied');

