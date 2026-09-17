const fs = require('fs');
let c = fs.readFileSync('assets/js/inventory-ui.js', 'utf8');

const vendorCategories = "['HVAC', 'Hardware', 'Electrical', 'Plumbing', 'Civil & Construction', 'Tools & Machinery', 'Safety', 'Consumables', 'Stationery', 'IT & Tech', 'General / Other']";
const countries = "['Pakistan', 'United Arab Emirates', 'Saudi Arabia', 'China', 'United Kingdom', 'USA', 'Other']";

// 1. Update pages.vendors to include country
const oldVendorRow = '`<td class="wrap">${h(v.category)}<span class="sub">${h(v.address)}</span></td>`';
const newVendorRow = '`<td class="wrap">${h(v.category)}<span class="sub">${h(v.address)}${v.country ? \', \' + h(v.country) : \'\'}</span></td>`';
c = c.replace(oldVendorRow, newVendorRow); // just replace that bit

// Wait, let's just do a RegExp replace for the whole pages.vendors string to be safe.
const oldPagesVendors = /pages\.vendors = \(\) => filters\(\['Active', 'Inactive'\]\) \+ panel\('Vendor contacts', table\(\['Vendor', 'Contact', 'Phone', 'Category \/ address', 'Status', ''\], S\.data\.vendors\.map\(v => record\(`<td><strong>\$\{h\(v\.name\)\}.*?btn\('\+ Add vendor', 'vendor-edit', '', 'primary'\)\);/;

const newPagesVendors = `pages.vendors = () => filters(['Active', 'Inactive']) + panel('Vendor contacts', table(['Vendor', 'Contact', 'Phone', 'Category / address', 'Status', ''], S.data.vendors.map(v => record(\`<td><strong>\${h(v.name)}</strong><span class="sub">\${h(v.id)}</span></td><td>\${h(v.contact)}</td><td>\${h(v.phone)}</td><td class="wrap">\${h(v.category)}<span class="sub">\${h(v.address)}\${v.country ? ', ' + h(v.country) : ''}</span></td><td>\${badge(v.status)}</td><td><div class="actions">\${btn('Edit', 'vendor-edit', v.id)}\${btn('History', 'vendor-history', v.id)}</div></td>\`, [v.name, v.phone, v.category, v.contact].join(' '), v.status))), btn('+ Add vendor', 'vendor-edit', '', 'primary'));`;

c = c.replace(oldPagesVendors, newPagesVendors);

// 2. Update actions['vendor-edit']
const oldVendorEdit = /actions\['vendor-edit'\] = id => \{ const v = S\.data\.vendors\.find\(x => x\.id === id\) \|\| \{ name: '', contact: '', phone: '', category: 'HVAC', address: '', status: 'Active' \}; dialog\(id \? 'Edit vendor' : 'Add vendor', `<div class="form-grid">\$\{field\('Vendor name \*', 'name', v\.name, 'text', 'required'\)\}\$\{field\('Contact person \*', 'contact', v\.contact, 'text', 'required'\)\}\$\{field\('Phone \*', 'phone', v\.phone, 'tel', 'required'\)\}\$\{field\('Supply category', 'category', v\.category\)\}\$\{field\('Address', 'address', v\.address\)\}\$\{select\('Status', 'status', \['Active', 'Inactive'\], v\.status\)\}<\/div>`, 'Save vendor', form => S\.saveVendor\(\{ id, name: val\(form, 'name'\), contact: val\(form, 'contact'\), phone: val\(form, 'phone'\), category: val\(form, 'category'\), address: val\(form, 'address'\), status: val\(form, 'status'\) \}\)\); \};/;

const newVendorEdit = `actions['vendor-edit'] = id => { const v = S.data.vendors.find(x => x.id === id) || { name: '', contact: '', phone: '', category: 'Hardware', country: 'Pakistan', address: '', status: 'Active' }; dialog(id ? 'Edit vendor' : 'Add vendor', \`<div class="form-grid">\${field('Vendor name *', 'name', v.name, 'text', 'required')}\${field('Contact person *', 'contact', v.contact, 'text', 'required')}\${field('Phone *', 'phone', v.phone, 'tel', 'required')}\${select('Supply category *', 'category', ${vendorCategories}, v.category, 'required')}\${select('Country', 'country', ${countries}, v.country)}\${field('Address', 'address', v.address)}\${select('Status', 'status', ['Active', 'Inactive'], v.status)}</div>\`, 'Save vendor', form => S.saveVendor({ id, name: val(form, 'name'), contact: val(form, 'contact'), phone: val(form, 'phone'), category: val(form, 'category'), country: val(form, 'country'), address: val(form, 'address'), status: val(form, 'status') })); };`;

c = c.replace(oldVendorEdit, newVendorEdit);

fs.writeFileSync('assets/js/inventory-ui.js', c);
console.log('Vendor page and edit action updated!');
