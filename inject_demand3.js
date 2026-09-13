const fs = require('fs');

let c = fs.readFileSync('hr/warehouse/outward.html', 'utf8'); 

c = c.replace('<!-- Dispatch Modal -->', `<!-- Demand 3 -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row mb-6">
                    <div class="bg-indigo-50 border-r border-gray-200 p-6 md:w-1/4 flex flex-col justify-center">
                        <div class="flex items-center gap-2 mb-2">
                            <a href="request-detail.html" class="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1">REQ-8896</a>
                        </div>
                        <h4 class="font-bold text-gray-900 text-lg mb-2">Bahria Town HQ Site</h4>
                        <p class="text-sm text-gray-600"><i class="fa-regular fa-user mr-1"></i> Supervisor: Naveed Ahmed</p>
                        <p class="text-sm text-gray-600 mt-1"><i class="fa-regular fa-calendar mr-1"></i> Date: 11-Sep-2026</p>
                        <a href="request-detail.html" class="mt-4 inline-block text-center bg-white border border-indigo-200 text-indigo-700 font-bold text-xs px-3 py-1.5 rounded hover:bg-indigo-50 transition shadow-sm w-full">View Full Request Details <i class="fas fa-arrow-right ml-1"></i></a>
                        <span class="inline-block mt-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded text-center">Approved by HO</span>
                    </div>
                    <div class="p-6 md:w-2/4">
                        <h5 class="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide border-b pb-2">Requested Items</h5>
                        <ul class="space-y-3">
                            <li class="flex justify-between items-center text-sm">
                                <div class="flex items-center gap-2">
                                    <i class="fa-solid fa-box text-gray-400"></i>
                                    <span class="font-medium text-gray-800">GI Sheet (22 Gauge)</span>
                                </div>
                                <span class="font-bold">200 Sheets</span>
                            </li>
                            <li class="flex justify-between items-center text-sm">
                                <div class="flex items-center gap-2">
                                    <i class="fa-solid fa-box text-gray-400"></i>
                                    <span class="font-medium text-gray-800">Digital Manifold Gauge</span>
                                </div>
                                <span class="font-bold">2 Units</span>
                            </li>
                        </ul>
                    </div>
                    <div class="bg-gray-50 border-l border-gray-200 p-6 md:w-1/4 flex flex-col justify-center items-center gap-3">
                        <div class="w-full text-center">
                            <p class="text-xs text-gray-500 mb-1">Assign Delivery / Handover</p>
                            <select class="w-full border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2">
                                <option>Select Supply Guy...</option>
                                <option>Imran Khan (Rider)</option>
                            </select>
                            <button onclick="openModal('dispatchModal')" class="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm text-xs mb-2">
                                Hand Over Delivery
                            </button>
                            <button class="w-full bg-white border border-red-200 text-red-600 font-semibold py-2 rounded-md hover:bg-red-50 transition-colors shadow-sm text-xs">
                                Send to Administrator (Purchase)
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Dispatch Modal -->`); 
                
fs.writeFileSync('hr/warehouse/outward.html', c);
