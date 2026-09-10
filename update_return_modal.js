const fs = require('fs');

let c = fs.readFileSync('hr/warehouse/equipment.html', 'utf8');

const oldModalStart = '<!-- Return Tool Modal -->';
const newModal = `<!-- Return Tool Modal -->
            <div id="returnToolModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden z-50 flex items-center justify-center transition-opacity p-4">
                <div class="bg-white w-full max-w-md rounded-xl shadow-xl flex flex-col overflow-hidden">
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 class="font-bold text-gray-800"><i class="fas fa-undo mr-2 text-indigo-600"></i> Tool Return & Documentation</h3>
                        <button onclick="closeModal('returnToolModal')" class="text-gray-400 hover:text-red-500 transition-colors"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="p-5 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                        <div class="bg-indigo-50 border border-indigo-100 p-3 rounded text-sm text-indigo-900">
                            <div class="flex justify-between items-start">
                                <div>
                                    <strong>AST-WLD-092</strong> - Inverter Welding Machine
                                    <div class="text-xs mt-1 text-indigo-700"><i class="fas fa-user-hard-hat mr-1"></i> Assigned to: Usman Tariq</div>
                                    <div class="text-xs text-indigo-700"><i class="fas fa-map-marker-alt mr-1"></i> Site: DHA Phase 8</div>
                                </div>
                                <span class="bg-indigo-200 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">#RET-NEW</span>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Reason for Return <span class="text-red-500">*</span></label>
                            <select class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#242b5f]">
                                <option>Job / Task Completed</option>
                                <option>Tool Faulty / Needs Repair</option>
                                <option>Site Closed / Suspended</option>
                                <option>Worker Transferred / Resigned</option>
                                <option>Routine Audit Check-in</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Physical Condition <span class="text-red-500">*</span></label>
                            <div class="grid grid-cols-2 gap-2">
                                <label class="border border-gray-200 rounded p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="condition" checked class="text-indigo-600 focus:ring-indigo-500">
                                    <span class="text-xs font-semibold text-gray-700">Good / Working</span>
                                </label>
                                <label class="border border-gray-200 rounded p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="condition" class="text-amber-500 focus:ring-amber-500">
                                    <span class="text-xs font-semibold text-gray-700">Needs Minor Repair</span>
                                </label>
                                <label class="border border-gray-200 rounded p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="condition" class="text-red-600 focus:ring-red-500">
                                    <span class="text-xs font-semibold text-gray-700">Damaged / Broken</span>
                                </label>
                                <label class="border border-gray-200 rounded p-2 flex items-center gap-2 cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="condition" class="text-gray-600 focus:ring-gray-500">
                                    <span class="text-xs font-semibold text-gray-700">Lost / Missing parts</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Attach Photo / Handover Slip</label>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 cursor-pointer transition">
                                <i class="fas fa-cloud-upload-alt text-gray-400 text-xl mb-1"></i>
                                <p class="text-xs text-gray-500 font-semibold">Click to upload condition proof</p>
                                <p class="text-[10px] text-gray-400">JPG, PNG or PDF (Max 2MB)</p>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">Detailed Remarks & Documentation</label>
                            <textarea rows="3" placeholder="Explain exact condition, reason, or any missing accessories (e.g., Welding cables were damaged by heavy load)..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#242b5f]"></textarea>
                        </div>
                    </div>
                    <div class="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
                        <button onclick="closeModal('returnToolModal')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 font-semibold text-sm transition shadow-sm">Cancel</button>
                        <button onclick="alert('Tool Return Receipt (TRR) generated successfully and saved to History Ledger.'); closeModal('returnToolModal')" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold text-sm transition shadow-sm flex items-center gap-2">
                            <i class="fas fa-file-invoice"></i> Confirm & Generate Receipt
                        </button>
                    </div>
                </div>
            </div>`;

// I will extract everything between `<!-- Return Tool Modal -->` and `\`);` at the end
const parts = c.split(oldModalStart);
if(parts.length > 1) {
    const endPart = parts[1].split('`);');
    const finalHTML = parts[0] + newModal + '\n        `);' + endPart[1];
    fs.writeFileSync('hr/warehouse/equipment.html', finalHTML);
    console.log('Return Modal updated with documentation fields.');
} else {
    console.log('Could not find modal.');
}
