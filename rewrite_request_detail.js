const fs = require('fs');
const path = require('path');

const reqDetailPath = path.join(__dirname, 'hr', 'warehouse', 'request-detail.html');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Detail - REQ-8890 | Cosmix ERP</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; rounded: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
</head>
<body class="bg-gray-50 h-screen overflow-hidden">
    <div id="app-layout"></div>
    <script src="../../assets/js/shared.js"></script>
    <script>
        renderLayout('outward');
        setPageContent('Request Detail: REQ-8890', \`
            <div class="mb-4 flex items-center justify-between">
                <div>
                    <a href="outward.html" class="text-sm text-indigo-600 hover:underline mb-2 inline-block"><i class="fas fa-arrow-left mr-1"></i> Back to Pending Demands</a>
                    <div class="flex items-center gap-3">
                        <h2 class="text-2xl font-bold text-gray-800">REQ-8890</h2>
                        <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-200">Pending Fulfillment</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- Left Content: Request Info & Items -->
                <div class="lg:col-span-3 space-y-6">
                    
                    <!-- Site & Approval Info -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row gap-6">
                        <div class="flex-1">
                            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">Site Information</h3>
                            <p class="font-bold text-gray-900 text-lg">DHA Phase 8 Site (HVAC & MEP Work)</p>
                            <p class="text-sm text-gray-600 mt-1"><i class="fa-regular fa-user mr-2 w-4 text-center"></i> <strong>Supervisor:</strong> Ali Raza</p>
                            <p class="text-sm text-gray-600 mt-1"><i class="fa-regular fa-calendar mr-2 w-4 text-center"></i> <strong>Requested On:</strong> 10-Sep-2026</p>
                        </div>
                        <div class="flex-1 border-l border-gray-100 pl-6">
                            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">Approval Timeline</h3>
                            <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <i class="fas fa-check-circle text-emerald-500"></i>
                                <span>Supervisor Submitted (10-Sep 09:45 AM)</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <i class="fas fa-check-circle text-emerald-500"></i>
                                <span>Project Mgr Approved (10-Sep 10:30 AM)</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600 font-bold">
                                <i class="fas fa-clock text-amber-500"></i>
                                <span class="text-amber-600">Pending Warehouse Issuance</span>
                            </div>
                        </div>
                    </div>

                    <!-- Requested Items Table -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div class="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 class="font-bold text-gray-800"><i class="fas fa-list mr-2 text-[#242b5f]"></i> Requested Items List</h3>
                            <div class="text-xs text-gray-500 bg-white px-3 py-1 rounded border border-gray-200 shadow-sm">
                                <i class="fas fa-info-circle text-blue-500 mr-1"></i> Select items below to add to Purchase Requisition (PR)
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left text-gray-600">
                                <thead class="bg-white text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
                                    <tr>
                                        <th class="px-4 py-3 w-10 text-center">
                                            <input type="checkbox" id="selectAll" class="rounded border-gray-300 text-[#242b5f] focus:ring-[#242b5f]" onchange="toggleAllCheckboxes(this)">
                                        </th>
                                        <th class="px-4 py-3">Item Description</th>
                                        <th class="px-4 py-3 text-center">Req Qty</th>
                                        <th class="px-4 py-3 text-center">Stock</th>
                                        <th class="px-4 py-3 text-center">Status</th>
                                        <th class="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr class="hover:bg-indigo-50/30 transition-colors">
                                        <td class="px-4 py-4 text-center">
                                            <input type="checkbox" class="item-checkbox rounded border-gray-300 text-[#242b5f] focus:ring-[#242b5f]" value="Copper Coil Tube 5/8\\" data-qty="10 Coils" onchange="updatePRList()">
                                        </td>
                                        <td class="px-4 py-4">
                                            <p class="font-bold text-gray-900">Copper Coil Tube 5/8"</p>
                                            <p class="text-xs text-gray-500">HVAC Piping</p>
                                        </td>
                                        <td class="px-4 py-4 text-center font-bold text-gray-900">10 Coils</td>
                                        <td class="px-4 py-4 text-center font-bold text-red-600">2 Coils</td>
                                        <td class="px-4 py-4 text-center">
                                            <span class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Shortage</span>
                                        </td>
                                        <td class="px-4 py-4 text-right">
                                            <button onclick="markForPR(this)" class="text-xs bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-2.5 py-1 rounded font-semibold transition">Add to PR</button>
                                        </td>
                                    </tr>
                                    <tr class="hover:bg-indigo-50/30 transition-colors">
                                        <td class="px-4 py-4 text-center">
                                            <input type="checkbox" class="item-checkbox rounded border-gray-300 text-[#242b5f] focus:ring-[#242b5f]" value="Refrigerant Gas R-410A" data-qty="5 Cyls" onchange="updatePRList()">
                                        </td>
                                        <td class="px-4 py-4">
                                            <p class="font-bold text-gray-900">Refrigerant Gas R-410A</p>
                                            <p class="text-xs text-gray-500">10kg Cylinders</p>
                                        </td>
                                        <td class="px-4 py-4 text-center font-bold text-gray-900">5 Cyls</td>
                                        <td class="px-4 py-4 text-center font-bold text-emerald-600">15 Cyls</td>
                                        <td class="px-4 py-4 text-center">
                                            <span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Available</span>
                                        </td>
                                        <td class="px-4 py-4 text-right">
                                            <button class="text-xs bg-[#242b5f] text-white hover:bg-blue-800 px-2.5 py-1 rounded font-semibold transition">Allocate</button>
                                        </td>
                                    </tr>
                                    <tr class="hover:bg-indigo-50/30 transition-colors">
                                        <td class="px-4 py-4 text-center">
                                            <input type="checkbox" class="item-checkbox rounded border-gray-300 text-[#242b5f] focus:ring-[#242b5f]" value="Aeroflex Insulation 5/8\\" data-qty="20 Pcs" onchange="updatePRList()">
                                        </td>
                                        <td class="px-4 py-4">
                                            <p class="font-bold text-gray-900">Aeroflex Insulation 5/8"</p>
                                            <p class="text-xs text-gray-500">Piping Insulation</p>
                                        </td>
                                        <td class="px-4 py-4 text-center font-bold text-gray-900">20 Pcs</td>
                                        <td class="px-4 py-4 text-center font-bold text-amber-600">0 Pcs</td>
                                        <td class="px-4 py-4 text-center">
                                            <span class="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Out of Stock</span>
                                        </td>
                                        <td class="px-4 py-4 text-right">
                                            <button onclick="markForPR(this)" class="text-xs bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-2.5 py-1 rounded font-semibold transition">Add to PR</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <span class="text-xs text-gray-500">Note: Items marked with shortage must be procured before full dispatch.</span>
                            <button onclick="alert('Opening partial dispatch gateway...')" class="bg-[#242b5f] text-white px-4 py-2 rounded text-sm font-bold shadow-sm hover:bg-blue-800 transition">
                                Dispatch Available Items <i class="fas fa-truck-fast ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Right Sidebar: Inventory Search & Procurement Queue -->
                <div class="lg:col-span-1 space-y-6 flex flex-col h-full">
                    
                    <!-- Quick Stock Check -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 shrink-0">
                        <h3 class="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center"><i class="fas fa-search text-gray-400 mr-2"></i> Live Stock Check</h3>
                        <div class="relative">
                            <i class="fas fa-box absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input type="text" id="stockSearch" placeholder="Search Master Inventory..." onkeyup="mockSearch()" class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#242b5f]">
                        </div>
                        <div id="searchResults" class="mt-3 hidden bg-slate-50 border border-slate-200 rounded p-2 text-xs space-y-2">
                            <div class="flex justify-between items-center border-b border-slate-200 pb-1">
                                <span class="font-bold text-gray-700">Copper Coil 5/8"</span>
                                <span class="text-red-600 font-bold">2 in stock</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-bold text-gray-700">Copper Coil 3/8"</span>
                                <span class="text-emerald-600 font-bold">45 in stock</span>
                            </div>
                        </div>
                    </div>

                    <!-- Procurement Queue -->
                    <div class="bg-white rounded-xl shadow-sm border border-[#242b5f] flex-1 flex flex-col overflow-hidden">
                        <div class="p-4 bg-[#242b5f] text-white flex justify-between items-center">
                            <h3 class="text-sm font-bold uppercase tracking-wider"><i class="fas fa-shopping-cart mr-2"></i> Purchase Queue</h3>
                            <span id="prBadge" class="bg-white text-[#242b5f] text-[10px] font-bold px-2 py-0.5 rounded-full">0</span>
                        </div>
                        <div class="p-4 flex-1 bg-indigo-50/20 flex flex-col">
                            <p class="text-xs text-gray-500 mb-3">Items selected from the request table will appear here for purchasing.</p>
                            
                            <!-- Dynamic PR List -->
                            <div id="prList" class="flex-1 overflow-y-auto custom-scrollbar space-y-2 max-h-[300px]">
                                <div id="emptyPRState" class="text-center py-6 text-gray-400">
                                    <i class="fas fa-inbox text-3xl mb-2 opacity-50"></i>
                                    <p class="text-xs">No items selected</p>
                                </div>
                                <!-- List items injected here by JS -->
                            </div>
                            
                        </div>
                        <div class="p-4 bg-white border-t border-gray-200 shrink-0">
                            <button id="sendAdminBtn" disabled onclick="sendToAdmin()" class="w-full bg-gray-300 text-gray-500 font-bold py-2.5 rounded text-sm transition flex items-center justify-center gap-2 cursor-not-allowed">
                                <span>Send to Administrator</span>
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        \`);

        // JS for interactivity in the detail page
        window.toggleAllCheckboxes = function(source) {
            const checkboxes = document.querySelectorAll('.item-checkbox');
            checkboxes.forEach(cb => cb.checked = source.checked);
            window.updatePRList();
        };

        window.markForPR = function(btn) {
            const row = btn.closest('tr');
            const checkbox = row.querySelector('.item-checkbox');
            checkbox.checked = true;
            window.updatePRList();
        };

        window.updatePRList = function() {
            const checkboxes = document.querySelectorAll('.item-checkbox:checked');
            const prList = document.getElementById('prList');
            const emptyState = document.getElementById('emptyPRState');
            const badge = document.getElementById('prBadge');
            const sendBtn = document.getElementById('sendAdminBtn');
            
            badge.innerText = checkboxes.length;
            
            if(checkboxes.length === 0) {
                prList.innerHTML = '';
                prList.appendChild(emptyState);
                emptyState.classList.remove('hidden');
                
                sendBtn.disabled = true;
                sendBtn.classList.remove('bg-indigo-600', 'text-white', 'hover:bg-indigo-700', 'cursor-pointer');
                sendBtn.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            } else {
                emptyState.classList.add('hidden');
                prList.innerHTML = '';
                
                checkboxes.forEach(cb => {
                    const itemName = cb.value;
                    const reqQty = cb.getAttribute('data-qty');
                    
                    const div = document.createElement('div');
                    div.className = 'bg-white p-2.5 rounded border border-indigo-100 shadow-sm text-xs flex justify-between items-center';
                    div.innerHTML = \`
                        <div class="w-2/3">
                            <p class="font-bold text-gray-800 truncate" title="\${itemName}">\${itemName}</p>
                            <p class="text-indigo-600 font-semibold mt-0.5">Req: \${reqQty}</p>
                        </div>
                        <button onclick="removePRItem(this)" class="text-gray-400 hover:text-red-500 p-1"><i class="fas fa-times"></i></button>
                    \`;
                    prList.appendChild(div);
                });
                
                sendBtn.disabled = false;
                sendBtn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
                sendBtn.classList.add('bg-indigo-600', 'text-white', 'hover:bg-indigo-700', 'cursor-pointer');
            }
        };

        window.removePRItem = function(btn) {
            const itemName = btn.closest('.bg-white').querySelector('p').innerText;
            const checkboxes = document.querySelectorAll('.item-checkbox');
            checkboxes.forEach(cb => {
                if(cb.value === itemName) {
                    cb.checked = false;
                }
            });
            window.updatePRList();
        };

        window.sendToAdmin = function() {
            const checkboxes = document.querySelectorAll('.item-checkbox:checked');
            if(checkboxes.length > 0) {
                alert(\`Purchase Requisition (PR) generated for \${checkboxes.length} item(s) and forwarded to System Administrator for procurement.\`);
                // Reset
                document.getElementById('selectAll').checked = false;
                checkboxes.forEach(cb => cb.checked = false);
                window.updatePRList();
            }
        };

        window.mockSearch = function() {
            const val = document.getElementById('stockSearch').value;
            const res = document.getElementById('searchResults');
            if(val.length > 2) {
                res.classList.remove('hidden');
            } else {
                res.classList.add('hidden');
            }
        };
    </script>
</body>
</html>`;

fs.writeFileSync(reqDetailPath, htmlContent);
console.log('request-detail.html rewritten successfully.');
