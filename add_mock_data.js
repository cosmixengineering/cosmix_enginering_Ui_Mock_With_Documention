const fs = require('fs');
const file = 'assets/js/inventory-store.js';
let content = fs.readFileSync(file, 'utf8');

const newPurchases = `purchases: [
                { id: 'PUR-001', po: 'PO-2026-088', request: 'REQ-8880', vendor: 'Al-Fatah Hardware & Steels', site: 'Clifton Commercial Tower', purchaser: 'Bilal Ahmed  Company Purchaser', amount: 150000, date: '2026-09-01', expected: '2026-09-05', status: 'Delivered', lines: [{item: 'EL-001', qty: 100}, {item: 'SF-001', qty: 20}] },
                { id: 'PUR-002', po: 'PO-2026-090', request: 'REQ-8885', vendor: 'Al-Fatah Hardware & Steels', site: 'Warehouse', purchaser: 'Ahmed Raza  Company Purchaser', amount: 45000, date: '2026-09-08', expected: '2026-09-12', status: 'Pending delivery', lines: [{item: 'TL-001', qty: 1}] },
                { id: 'PUR-003', po: 'PO-2026-089', request: 'REQ-8890', vendor: 'Karachi HVAC Supplies', site: 'Warehouse', purchaser: 'Bilal Ahmed  Company Purchaser', amount: 211000, date: '2026-09-09', expected: '2026-09-11', status: 'Going for delivery', lines: [{item: 'HV-001', qty: 10}, {item: 'HV-003', qty: 40}] }
            ],`;

const newInwards = `inwards: [
                { id: 'IN-0091', type: 'Vendor delivery', reference: 'PO-2026-089', vendor: 'Karachi HVAC Supplies', date: '2026-09-11', status: 'Pending receipt', lines: [{ item: 'HV-001', qty: 10, received: 0 }, { item: 'HV-003', qty: 40, received: 0 }] },
                { id: 'IN-0085', type: 'Vendor delivery', reference: 'PO-2026-088', vendor: 'Al-Fatah Hardware & Steels', date: '2026-09-05', status: 'Received', lines: [{ item: 'EL-001', qty: 100, received: 100 }, { item: 'SF-001', qty: 20, received: 20 }] }
            ],`;

content = content.replace(/purchases:\s*\[\s*\],/, newPurchases);
content = content.replace(/inwards:\s*\[[\s\S]*?\] \}\],/, newInwards);

fs.writeFileSync(file, content);
console.log('Mock data added!');
