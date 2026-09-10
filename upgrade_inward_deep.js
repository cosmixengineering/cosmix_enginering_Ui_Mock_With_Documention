const fs = require('fs');
const path = require('path');

const inwardPath = path.join(__dirname, 'hr', 'warehouse', 'inward.html');
let html = fs.readFileSync(inwardPath, 'utf8');

const siteReturnCard = `
                    <!-- Site Return Card -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="bg-purple-50 px-5 py-3 border-b border-purple-100 flex justify-between items-center">
                            <span class="font-bold text-purple-900">RET-882 (Site Return)</span>
                            <span class="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">Awaiting Return</span>
                        </div>
                        <div class="p-5">
                            <p class="text-sm text-gray-500 mb-1">Returning Site</p>
                            <h3 class="font-bold text-gray-900 text-lg mb-4">Clifton Block 2 Site</h3>
                            
                            <div class="space-y-2 mb-4">
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">Scaffolding Pipes (Surplus)</span>
                                    <span class="font-bold text-purple-700">50 Pcs</span>
                                </div>
                                <div class="flex justify-between text-sm">
                                    <span class="text-gray-600">Unused Cement</span>
                                    <span class="font-bold text-purple-700">10 Bags</span>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-2 text-xs text-gray-500 mb-5">
                                <i class="fa-solid fa-truck-ramp-box"></i> Return Transit
                            </div>
                            
                            <button onclick="openModal('grnModal')" class="w-full bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-semibold py-2 rounded-md transition-colors">
                                Receive Return & Inward
                            </button>
                        </div>
                    </div>
`;

// Insert after Delivery Card 2 ends
html = html.replace(
    '                        </div>\n                    </div>\n                </div>\n\n                <!-- GRN History Table -->',
    '                        </div>\n                    </div>\n' + siteReturnCard + '\n                </div>\n\n                <!-- GRN History Table -->'
);

// Update title to be inclusive
html = html.replace(
    '<h3 class="text-lg font-bold text-gray-800 mb-4">Pending Deliveries (Against POs)</h3>',
    '<h3 class="text-lg font-bold text-gray-800 mb-4">Pending Deliveries & Site Returns</h3>'
);

fs.writeFileSync(inwardPath, html);
console.log('Inward upgraded with Site Returns');

