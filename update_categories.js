const fs = require('fs');
let c = fs.readFileSync('assets/js/inventory-ui.js', 'utf8');

const oldCategories = "['Tools', 'Equipment', 'Safety', 'Consumables']";
const newCategories = "['Power Tools', 'Hand Tools', 'Measuring & Testing', 'Safety & PPE', 'Welding & Soldering', 'Heavy Machinery', 'Lifting & Rigging', 'Site Facilities', 'Consumables & Accessories', 'Tools', 'Equipment', 'Safety', 'Consumables']";

const oldUnits = "['Units', 'Pieces', 'Sets', 'Boxes']";
const newUnits = "['Units', 'Pieces', 'Sets', 'Pairs', 'Boxes', 'Packs', 'Rolls', 'Metres', 'Feet', 'Kilograms', 'Grams', 'Litres', 'Gallons', 'Dozens']";

// Use split/join to replace all occurrences globally
c = c.split(oldCategories).join(newCategories);
c = c.split(oldUnits).join(newUnits);

fs.writeFileSync('assets/js/inventory-ui.js', c);
console.log('Categories and Units updated!');
