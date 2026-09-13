const fs = require('fs');
const path = require('path');

const sharedJsPath = path.join(__dirname, 'assets', 'js', 'shared.js');
let sharedJs = fs.readFileSync(sharedJsPath, 'utf8');

// The current path resolution logic in shared.js looks something like:
// const pathNorm = window.location.pathname.replace(/\\/g, '/');
// const matched = pathNorm.match(/\/(hr|sales|finance|accounts|inventory|admin|administrator|engineering|procurement)(\/|$)/i);
// const currentDeptId = matched ? matched[1].toLowerCase() : (pathNorm.includes('/accounts/') ? 'accounts' : (pathNorm.includes('/hr/') ? 'hr' : 'root'));

const newPathLogic = `
    const pathNorm = window.location.pathname.replace(/\\\\/g, '/');
    let currentDeptId = 'root';
    if (pathNorm.includes('/warehouse/')) {
        currentDeptId = 'warehouse';
    } else if (pathNorm.includes('/accounts/') || pathNorm.includes('/finance/')) {
        currentDeptId = 'accounts';
    } else if (pathNorm.includes('/hr/')) {
        currentDeptId = 'hr';
    } else {
        const matched = pathNorm.match(/\\/(sales|admin|administrator|engineering|procurement)(\\/|$)/i);
        currentDeptId = matched ? matched[1].toLowerCase() : 'root';
    }
    const isSubfolder = pathNorm.includes('/hr/') || pathNorm.includes('/accounts/') || pathNorm.includes('/warehouse/');
`;

// We'll replace lines 2 to 6 with the new logic.
const regex = /const pathNorm = window\.location\.pathname\.replace.*?const isSubfolder =.*?;/s;
if (regex.test(sharedJs)) {
    sharedJs = sharedJs.replace(regex, newPathLogic.trim());
    fs.writeFileSync(sharedJsPath, sharedJs);
    console.log('Fixed path resolution in shared.js');
} else {
    console.log('Could not find the regex match for path resolution.');
}
