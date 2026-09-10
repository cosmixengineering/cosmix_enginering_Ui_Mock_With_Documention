const fs = require('fs');

let html = fs.readFileSync('hr/warehouse/request-detail.html', 'utf8');

const oldButtonHtml = `<div class="p-4 bg-white border-t border-gray-200 shrink-0">
                            <button id="sendAdminBtn" disabled onclick="sendToAdmin()" class="w-full bg-gray-300 text-gray-500 font-bold py-2.5 rounded text-sm transition flex items-center justify-center gap-2 cursor-not-allowed">
                                <span>Send to Administrator</span>
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>`;

const newButtonHtml = `<div class="p-4 bg-white border-t border-gray-200 shrink-0 space-y-2">
                            <button id="sendAdminBtn" disabled onclick="sendToAdmin()" class="w-full bg-gray-300 text-gray-500 font-bold py-2 rounded text-sm transition flex items-center justify-center gap-2 cursor-not-allowed">
                                <i class="fas fa-paper-plane"></i>
                                <span>Send to Administrator</span>
                            </button>
                            <button id="sendDirectorBtn" disabled onclick="sendToDirector()" class="w-full bg-gray-300 text-gray-500 font-bold py-2 rounded text-sm transition flex items-center justify-center gap-2 cursor-not-allowed border border-gray-300">
                                <i class="fas fa-user-tie"></i>
                                <span>Send to Director (Approval)</span>
                            </button>
                        </div>`;

html = html.replace(oldButtonHtml, newButtonHtml);

// Update JS for updatePRList
const oldJs1 = `                sendBtn.disabled = true;
                sendBtn.classList.remove('bg-indigo-600', 'text-white', 'hover:bg-indigo-700', 'cursor-pointer');
                sendBtn.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');`;

const newJs1 = `                document.getElementById('sendAdminBtn').disabled = true;
                document.getElementById('sendAdminBtn').className = 'w-full bg-gray-300 text-gray-500 font-bold py-2 rounded text-sm transition flex items-center justify-center gap-2 cursor-not-allowed';
                
                document.getElementById('sendDirectorBtn').disabled = true;
                document.getElementById('sendDirectorBtn').className = 'w-full bg-gray-300 border border-gray-300 text-gray-500 font-bold py-2 rounded text-sm transition flex items-center justify-center gap-2 cursor-not-allowed';`;

const oldJs2 = `                sendBtn.disabled = false;
                sendBtn.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
                sendBtn.classList.add('bg-indigo-600', 'text-white', 'hover:bg-indigo-700', 'cursor-pointer');`;

const newJs2 = `                document.getElementById('sendAdminBtn').disabled = false;
                document.getElementById('sendAdminBtn').className = 'w-full bg-indigo-600 text-white font-bold py-2 rounded text-sm transition flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-sm cursor-pointer';
                
                document.getElementById('sendDirectorBtn').disabled = false;
                document.getElementById('sendDirectorBtn').className = 'w-full bg-white border border-indigo-600 text-indigo-700 font-bold py-2 rounded text-sm transition flex items-center justify-center gap-2 hover:bg-indigo-50 shadow-sm cursor-pointer';`;

html = html.replace(oldJs1, newJs1);
html = html.replace(oldJs2, newJs2);

// Inject sendToDirector
const oldAdminFunc = `        window.sendToAdmin = function() {`;
const newAdminFunc = `        window.sendToDirector = function() {
            const checkboxes = document.querySelectorAll('.item-checkbox:checked');
            if(checkboxes.length > 0) {
                alert(\`Purchase Requisition (PR) generated for \${checkboxes.length} item(s) and forwarded directly to the DIRECTOR for special approval.\`);
                // Reset
                document.getElementById('selectAll').checked = false;
                checkboxes.forEach(cb => cb.checked = false);
                window.updatePRList();
            }
        };

        window.sendToAdmin = function() {`;

html = html.replace(oldAdminFunc, newAdminFunc);

fs.writeFileSync('hr/warehouse/request-detail.html', html);
console.log('Done.');
