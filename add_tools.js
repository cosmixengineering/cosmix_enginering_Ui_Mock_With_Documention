const fs = require('fs');
const file = 'assets/js/inventory-ui.js';
let content = fs.readFileSync(file, 'utf8');

const toolsLogic = `
    pages.tools = () => filters(['Tools', 'Equipment', 'Safety', 'Consumables']) + panel('Tools & Equipment Inventory', table(['Tool Name / Spec', 'Type', 'Category', 'Unit', 'Price', 'On hand', 'Bin', ''], S.data.items.filter(i => ['Tools', 'Equipment', 'Safety', 'Consumables'].includes(i.category)).map(i => record(\`<td class="wrap"><strong>\${h(i.name)}</strong><span class="sub">\${h(i.materialCode || i.id)}</span></td><td>\${badge(i.toolType || 'Reusable (Fixed Asset)')}</td><td>\${h(i.category)}</td><td>\${h(i.unit)}</td><td class="num">\${money(i.price)}</td><td class="num">\${n(i.stock)}</td><td>\${h(i.bin)}</td><td><div class="actions">\${btn('Edit', 'tool-inventory-edit', i.id)}</div></td>\`, [i.name, i.category, i.toolType].join(' '), i.category))), btn('+ Add New Tool', 'tool-inventory-edit', '', 'primary'));

    actions['tool-inventory-edit'] = id => {
        const i = id ? S.item(id) : { name: '', category: 'Tools', toolType: 'Reusable (Fixed Asset)', unit: 'Units', bin: '', min: 0, price: '', stock: 0 };
        const categories = ['Tools', 'Equipment', 'Safety', 'Consumables'];
        const types = ['Reusable (Fixed Asset)', 'Consumable (Wear & Tear)'];
        dialog(id ? 'Edit tool ' + (i.materialCode || i.id) : 'Add New Tool',
            \`<div class="form-grid">
            \${field('Tool Code / Asset No *', 'materialCode', i.materialCode || i.id || '', 'text', 'required maxlength="60"')}
            \${select('Tool Type *', 'toolType', types, i.toolType, 'required')}
            <div class="wide">\${field('Tool Name *', 'name', i.name, 'text', 'required')}</div>
            \${select('Category *', 'category', categories, i.category, 'required')}
            \${select('Unit *', 'unit', ['Units', 'Pieces', 'Sets', 'Boxes'], i.unit, 'required')}
            \${field('Unit Price (Rs.) *', 'price', i.price, 'number', 'required min="0" step="0.01"')}
            \${field('Minimum stock', 'min', i.min, 'number', 'required min="0"')}
            \${field('Location / bin *', 'bin', i.bin, 'text', 'required')}
            \${!id ? field('Opening stock', 'stock', 0, 'number', 'required min="0"') : ''}
            </div>\`,
            id ? 'Save changes' : 'Add Tool', form => S.saveItem({ id, materialCode: val(form, 'materialCode'), name: val(form, 'name'), category: val(form, 'category'), toolType: val(form, 'toolType'), unit: val(form, 'unit'), bin: val(form, 'bin'), min: val(form, 'min'), price: val(form, 'price'), stock: val(form, 'stock') })
        );
    };
`;

content = content.replace("names = { ", "names = { tools: 'Tools Inventory', ");
content = content.replace("['equipment', 'Tools & Custody', 'fa-tools'],", "['equipment', 'Tools & Custody', 'fa-tools'], ['tools', 'Tools Inventory', 'fa-wrench'],");
content = content.replace("})();", toolsLogic + "\n})();");

fs.writeFileSync(file, content);
console.log('Done!');
