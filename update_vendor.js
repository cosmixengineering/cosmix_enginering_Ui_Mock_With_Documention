const fs = require('fs');

// 1. Update shared.js
let shared = fs.readFileSync('assets/js/shared.js', 'utf8');
const historyLink = "activePage === 'history')}";
const vendorLink = historyLink + "\n                  ${createNavLink(p + 'hr/warehouse/vendors.html', 'Vendor Directory', 'fas fa-handshake', activePage === 'vendors')}";

if (!shared.includes('vendors.html')) {
    shared = shared.replace(historyLink, vendorLink);
    const historyActive = "activePage = 'history';\n    }";
    const vendorActive = "activePage = 'history';\n    } else if (pathNorm.includes('/warehouse/vendors.html')) {\n        activePage = 'vendors';\n    }";
    shared = shared.replace(historyActive, vendorActive);
    fs.writeFileSync('assets/js/shared.js', shared);
    console.log('shared.js updated');
}

// 2. Update inventory.html
let inv = fs.readFileSync('hr/warehouse/inventory.html', 'utf8');
const priceBlockEnd = `                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Item Description</label>`;
                                
const insertVendor = `                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Primary Vendor / Supplier</label>
                                    <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>Select Vendor...</option>
                                        <option>Daikin MEA</option>
                                        <option>Popular Pipes</option>
                                        <option>Master Cables</option>
                                        <option>Gree HVAC Supplies</option>
                                        <option>National Steel & Copper</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase">Item Description</label>`;

if (!inv.includes('Primary Vendor / Supplier')) {
    inv = inv.replace(priceBlockEnd, insertVendor);
    fs.writeFileSync('hr/warehouse/inventory.html', inv);
    console.log('inventory.html updated');
}
