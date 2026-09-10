const renderLayout = (activePage) => {
    // Determine path depth and active department
    const pathNorm = window.location.pathname.replace(/\\/g, '/');
    let currentDeptId = 'root';
    if (pathNorm.includes('/warehouse/')) {
        currentDeptId = 'warehouse';
    } else if (pathNorm.includes('/accounts/') || pathNorm.includes('/finance/')) {
        currentDeptId = 'accounts';
    } else if (pathNorm.includes('/hr/')) {
        currentDeptId = 'hr';
    } else {
        const matched = pathNorm.match(/\/(sales|admin|administrator|engineering|procurement)(\/|$)/i);
        currentDeptId = matched ? matched[1].toLowerCase() : 'root';
    }
    const isSubfolder = pathNorm.includes('/hr/') || pathNorm.includes('/accounts/') || pathNorm.includes('/warehouse/');
    const p = pathNorm.includes('/warehouse/') ? '../../' : isSubfolder ? '../' : './';

    const DEPARTMENTS = [
        { id: 'hr', name: 'Human Resources', badge: 'HR', icon: 'fas fa-users-cog', color: 'text-indigo-600', bg: 'bg-indigo-50', url: p + 'hr/index.html' },
        { id: 'accounts', name: 'Accounts & Finance', badge: 'Accounts', icon: 'fas fa-file-invoice-dollar', color: 'text-purple-600', bg: 'bg-purple-50', url: p + 'accounts/index.html' },
        { id: 'sales', name: 'Sales & CRM', badge: 'Sales', icon: 'fas fa-chart-line', color: 'text-emerald-600', bg: 'bg-emerald-50', url: p + 'sales/index.html' },
        { id: 'finance', name: 'Finance & Accounts', badge: 'Finance', icon: 'fas fa-calculator', color: 'text-purple-600', bg: 'bg-purple-50', url: p + 'accounts/index.html' },
        { id: 'warehouse', name: 'Warehouse & Stock', badge: 'Stores', icon: 'fas fa-boxes', color: 'text-amber-600', bg: 'bg-amber-50', url: p + 'hr/warehouse/index.html' },
        { id: 'admin', name: 'Admin & Fleet', badge: 'Admin', icon: 'fas fa-building', color: 'text-blue-600', bg: 'bg-blue-50', url: p + 'admin/index.html' },
        { id: 'administrator', name: 'System Administrator', badge: 'SuperAdmin', icon: 'fas fa-user-shield', color: 'text-red-600', bg: 'bg-red-50', url: p + 'administrator/index.html' },
        { id: 'engineering', name: 'MEP Operations', badge: 'Engr', icon: 'fas fa-hard-hat', color: 'text-orange-600', bg: 'bg-orange-50', url: p + 'engineering/index.html' },
        { id: 'procurement', name: 'Procurement & SCM', badge: 'Supply', icon: 'fas fa-truck-loading', color: 'text-teal-600', bg: 'bg-teal-50', url: p + 'procurement/index.html' }
    ];
    const isAccounts = (currentDeptId === 'accounts' || currentDeptId === 'finance');
    const isWarehouse = (currentDeptId === 'warehouse' || currentDeptId === 'inventory');
    const currentDept = DEPARTMENTS.find(d => d.id === currentDeptId) || (isAccounts ? DEPARTMENTS[1] : DEPARTMENTS[0]);

    // Ensure Font Awesome is always loaded across all pages
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    // Ensure JetBrains Mono is loaded for financial amounts & invoices
    if (!document.querySelector('link[href*="JetBrains+Mono"]')) {
        const jbLink = document.createElement('link');
        jbLink.rel = 'stylesheet';
        jbLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap';
        document.head.appendChild(jbLink);
    }

    // Inject global ultra-compact ERP styling across all pages
    if (!document.getElementById('cosmix-compact-css')) {
        const compactStyle = document.createElement('style');
        compactStyle.id = 'cosmix-compact-css';
        compactStyle.innerHTML = `
            html { font-size: 13px !important; }
            body { font-family: 'Inter', sans-serif !important; background-color: #f8fafc !important; }
            table th { padding: 0.4rem 0.75rem !important; font-size: 0.72rem !important; }
            table td { padding: 0.45rem 0.75rem !important; font-size: 0.78rem !important; }
            .dropdown-menu { display: none; }
            .dropdown.open > .dropdown-menu, .dropdown.open .dropdown-menu { display: block !important; opacity: 1 !important; visibility: visible !important; }
            .font-mono, [class*="font-mono"] { font-family: 'JetBrains Mono', monospace !important; font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
        `;
        document.head.appendChild(compactStyle);
    }

    const navItemsHTML = isWarehouse ? `<div>
            <div class="flex items-center justify-between px-2 mb-2">
                <p id="menu-label" class="text-[10px] text-slate-400 font-bold uppercase tracking-wider transition-opacity duration-300">Warehouse Module</p>
                <span class="menu-text text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 transition-opacity duration-300">STORES</span>
            </div>
            <nav class="space-y-1">
                ${createNavLink(p + 'hr/warehouse/index.html', 'Dashboard', 'fas fa-chart-pie', activePage === 'dashboard')}
                ${createNavLink(p + 'hr/warehouse/inventory.html', 'Master Inventory', 'fas fa-boxes-stacked', activePage === 'inventory', { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: '1,245' })}
                ${createNavLink(p + 'hr/warehouse/inward.html', 'Inward (GRN)', 'fas fa-arrow-right-to-bracket', activePage === 'inward')}
                ${createNavLink(p + 'hr/warehouse/outward.html', 'Outward (Dispatch)', 'fas fa-truck-ramp-box', activePage === 'outward', { bg: 'bg-red-50 border border-red-200', text: 'text-red-700', label: '12' })}
                  ${createNavLink(p + 'hr/warehouse/equipment.html', 'Tools & Equipment', 'fas fa-tools', activePage === 'equipment', { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', label: 'Assign' })}
                  ${createNavLink(p + 'hr/warehouse/history.html', 'Stock History & Ledger', 'fas fa-history', activePage === 'history')}
                <div class="pt-2 mt-2 border-t border-slate-100">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 menu-text">Connected Modules</p>
                    ${createNavLink(p + 'hr/index.html', 'HR Operations Portal', 'fas fa-users-cog', false, { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-600', label: 'HR' })}
                    ${createNavLink(p + 'accounts/index.html', 'Accounts & Finance', 'fas fa-file-invoice-dollar', false, { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700', label: 'Accounts' })}
                    ${createNavLink(p + 'hr/warehouse/index.html', 'Warehouse & Stock', 'fas fa-boxes', false, { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: 'Stores' })}
                </div>
            </nav>
        </div>` : isAccounts ? `
        <div>
            <div class="flex items-center justify-between px-2 mb-2">
                <p id="menu-label" class="text-[10px] text-slate-400 font-bold uppercase tracking-wider transition-opacity duration-300">Accounts & Finance</p>
                <span class="menu-text text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100 transition-opacity duration-300">ACCOUNTS</span>
            </div>
            <nav class="space-y-1">
                ${createNavLink(p + 'accounts/index.html', 'Dashboard', 'fas fa-chart-pie', activePage === 'dashboard')}
                ${createNavLink(p + 'accounts/invoices.html', 'Invoices & Billing', 'fas fa-file-invoice-dollar', activePage === 'invoices', { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700', label: 'Tax' })}
                ${createNavLink(p + 'accounts/purchases.html', 'Supply & Expenses', 'fas fa-shopping-cart', activePage === 'purchases', { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: '3 Slips' })}
                ${createNavLink(p + 'accounts/payroll.html', 'Payroll Disbursement', 'fas fa-money-check-alt', activePage === 'payroll', { bg: 'bg-blue-50 border border-blue-200', text: 'text-blue-700', label: 'Sep 26' })}
                ${createNavLink(p + 'accounts/attendance.html', 'Attendance & Roster', 'fas fa-user-clock', activePage === 'attendance', { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: 'Audit' })}
                ${createNavLink(p + 'accounts/workers.html', 'Worker Profiles', 'fas fa-id-badge', activePage === 'workers' || activePage === 'employee')}
                ${createNavLink(p + 'accounts/banking.html', 'Banking & Cash Flow', 'fas fa-university', activePage === 'banking')}
                <div class="pt-2 mt-2 border-t border-slate-100">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 menu-text">Connected Modules</p>
                    ${createNavLink(p + 'hr/index.html', 'HR Operations Portal', 'fas fa-users-cog', false, { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-600', label: 'HR' })}
                    ${createNavLink(p + 'hr/warehouse/index.html', 'Warehouse & Stock', 'fas fa-boxes', false, { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: 'Stores' })}
                </div>
            </nav>
        </div>
    ` : `
        <div>
            <div class="flex items-center justify-between px-2 mb-2">
                <p id="menu-label" class="text-[10px] text-slate-400 font-bold uppercase tracking-wider transition-opacity duration-300">HR Operations</p>
                <span class="menu-text text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${currentDept.bg} ${currentDept.color} border border-indigo-100 transition-opacity duration-300">${currentDept.badge}</span>
            </div>
            <nav class="space-y-1">
                ${createNavLink(p + 'hr/index.html', 'Dashboard', 'fas fa-th-large', activePage === 'dashboard')}
                ${createNavLink(p + 'hr/employee-master.html', 'Employee Master', 'fas fa-user-tie', activePage === 'employee')}
                ${createNavLink(p + 'hr/sites.html', 'Working Sites', 'fas fa-map-marked-alt', activePage === 'sites')}
                ${createNavLink(p + 'hr/attendance.html', 'Attendance & Roster', 'fas fa-user-clock', activePage === 'attendance', { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', label: 'Live' })}
                ${createNavLink(p + 'hr/shifts.html', 'Shift Management', 'fas fa-business-time', activePage === 'shifts', { bg: 'bg-indigo-50 border border-indigo-200', text: 'text-[#242b5f]', label: '4' })}
                ${createNavLink(p + 'hr/advance-salary.html', 'Advance & Loans', 'fas fa-hand-holding-usd', activePage === 'advance')}
                ${createNavLink(p + 'hr/leave-management.html', 'Leave Management', 'fas fa-calendar-minus', activePage === 'leave', { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: '3' })}
                ${createNavLink(p + 'hr/payroll.html', 'Payroll Engine', 'fas fa-file-invoice-dollar', activePage === 'payroll')}
                ${createNavLink(p + 'hr/salary-rules.html', 'Deductions & Rules', 'fas fa-sliders-h', activePage === 'rules')}
                ${createNavLink(p + 'hr/offboarding.html', 'Offboarding', 'fas fa-user-minus', activePage === 'offboarding')}
                ${createNavLink(p + 'hr/assets.html', 'Assets & Custody', 'fas fa-tools', activePage === 'assets')}
                ${createNavLink(p + 'hr/reports.html', 'Reports & Tax', 'fas fa-chart-bar', activePage === 'reports')}
                ${createNavLink(p + 'hr/flowchart.html', 'HR Flowchart', 'fas fa-diagram-project', activePage === 'flowchart', { bg: 'bg-indigo-50 border border-indigo-200', text: 'text-[#242b5f]', label: 'Map' })}
                <div class="pt-2 mt-2 border-t border-slate-100">
                    <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 menu-text">Connected Modules</p>
                    ${createNavLink(p + 'accounts/index.html', 'Accounts & Finance', 'fas fa-file-invoice-dollar', false, { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700', label: 'Accounts' })}
                    ${createNavLink(p + 'hr/warehouse/index.html', 'Warehouse & Stock', 'fas fa-boxes', false, { bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-800', label: 'Stores' })}
                </div>
            </nav>
        </div>
    `;

    const sidebarHTML = `
        <aside id="sidebar" class="bg-white border-r border-slate-200/80 text-slate-800 flex flex-col transition-all duration-300 w-[215px] h-screen shrink-0 relative z-20 shadow-[1px_0_4px_rgba(0,0,0,0.02)] select-none">
            <!-- Sidebar Header / Logo -->
            <div class="px-3.5 py-2.5 flex items-center justify-between border-b border-slate-100 h-[54px] bg-white">
                <a href="${isAccounts ? p + 'accounts/index.html' : p + 'hr/index.html'}" class="flex items-center gap-2 overflow-hidden whitespace-nowrap" title="Cosmix ERP">
                    <img id="logo-img" src="${p}assets/images/cosmix-logo.png" onerror="this.src='https://cosmixengineering.com/wp-content/uploads/2024/09/cropped-Cosmix-Logo-PNG-File-300x90.png'" alt="Cosmix Engineering" class="h-8 max-w-[130px] w-auto object-contain transition-all duration-300">
                </a>
                <button id="toggle-btn" onclick="toggleSidebar()" class="text-slate-400 hover:text-[#242b5f] hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200/70 transition-all shrink-0" title="Collapse / Expand Menu">
                    <i class="fas fa-bars text-xs"></i>
                </button>
            </div>
            
            <!-- Navigation Links -->
            <div class="p-2.5 flex-1 overflow-y-auto overflow-x-hidden space-y-3">
                ${navItemsHTML}
            </div>
            
            <!-- Sidebar Footer: Admin & Sign Out -->
            <div class="p-2.5 border-t border-slate-100 bg-slate-50/60 mt-auto shrink-0 space-y-1.5">
                <div class="menu-text flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white border border-slate-200/70 shadow-2xs transition-opacity duration-300">
                    <div class="w-6 h-6 rounded-full bg-[#242b5f] text-white flex items-center justify-center font-bold text-[9.5px] shrink-0">
                        CE
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="text-[11px] font-bold text-slate-800 truncate leading-tight">${isAccounts ? 'Accounts Desk' : 'HR Console'}</p>
                        <p class="text-[9px] text-emerald-600 font-semibold flex items-center gap-1 leading-tight">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ${isAccounts ? 'Finance Online' : 'HR Online'}
                        </p>
                    </div>
                </div>
                <a href="${p}login.html" class="flex items-center gap-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all px-2 py-1.5 rounded-lg group" title="Sign Out">
                    <div class="w-5 flex items-center justify-center shrink-0">
                        <i class="fas fa-sign-out-alt text-xs text-slate-400 group-hover:text-rose-600 transition-colors"></i>
                    </div>
                    <span class="menu-text transition-opacity duration-300 text-[11.5px] font-semibold text-slate-600 group-hover:text-rose-600">Sign Out</span>
                </a>
            </div>
        </aside>
    `;

    const createTopBarLink = (href, icon, isActive, title) => {
        const activeClass = isActive 
            ? 'bg-[#242b5f] text-white border-[#242b5f]' 
            : 'text-gray-500 hover:bg-gray-50 border-transparent hover:border-gray-200';
        return `
            <a href="${href}" title="${title}" class="w-7 h-7 rounded border flex items-center justify-center transition-all ${activeClass}">
                <i class="${icon} text-[11px]"></i>
            </a>
        `;
    };

    const headerHTML = `
        <header class="bg-white border-b border-gray-100 px-4 py-2 flex justify-between items-center z-10 shrink-0 h-[52px]">
            <!-- Left: Title & Department Switcher -->
            <div class="flex items-center gap-2.5">
                <h2 id="header-title" class="text-sm font-bold text-gray-800 truncate"></h2>
                
                <!-- Quick Department Switcher Dropdown -->
                <div class="relative dropdown hidden sm:block">
                    <button class="dropdown-toggle flex items-center gap-1.5 px-2 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-[10.5px] font-semibold text-gray-700 transition" onclick="toggleDropdown(this, event)">
                        <i class="${currentDept.icon} ${currentDept.color}"></i>
                        <span class="max-w-[120px] truncate">${currentDept.name}</span>
                        <i class="fas fa-chevron-down text-[8px] text-gray-400 ml-0.5"></i>
                    </button>
                    <div class="dropdown-menu absolute left-0 top-8 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                        <div class="px-3 py-1 border-b border-gray-50 flex items-center justify-between">
                            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Departments</span>
                            <span class="text-[8px] bg-blue-50 text-blue-700 px-1 rounded font-bold">${isAccounts ? 'Accounts Active' : 'HR Active'}</span>
                        </div>
                        <div class="py-1">
                            ${DEPARTMENTS.map(d => {
                                const isThisDeptActive = d.id === currentDeptId || (d.id === 'accounts' && isAccounts);
                                if (d.id === 'hr' || d.id === 'accounts' || d.id === 'finance' || d.id === 'warehouse') {
                                    const targetUrl = d.url;
                                    return `
                                        <a href="${targetUrl}" class="flex items-center gap-2.5 px-3 py-1.5 text-xs ${isThisDeptActive ? 'bg-blue-50/70 text-[#242b5f] font-bold' : 'text-gray-700 hover:bg-gray-50'} transition">
                                            <span class="w-5 h-5 rounded flex items-center justify-center ${d.bg} ${d.color} text-[10px]"><i class="${d.icon}"></i></span>
                                            <span class="flex-1 truncate">${d.name}</span>
                                            ${isThisDeptActive ? '<i class="fas fa-check text-[9px] text-[#242b5f]"></i>' : '<span class="text-[8px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-bold">Active</span>'}
                                        </a>
                                    `;
                                } else {
                                    return `
                                        <a href="javascript:void(0)" onclick="showToast('${d.name} panel will be activated soon', 'info')" class="flex items-center gap-2.5 px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-50 transition">
                                            <span class="w-5 h-5 rounded flex items-center justify-center bg-gray-100 text-gray-400 text-[10px]"><i class="${d.icon}"></i></span>
                                            <span class="flex-1 truncate">${d.name}</span>
                                            <span class="text-[8px] bg-amber-50 text-amber-700 px-1 py-0.2 rounded font-bold">Phase 2</span>
                                        </a>
                                    `;
                                }
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Center: Global Search with Live Filter & Shortcut -->
            <div class="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
                <div class="relative w-full">
                    <i class="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]"></i>
                    <input id="global-search-input" type="text" oninput="handleGlobalSearch(this)" placeholder="Search employees, sites, records (Ctrl+/)..." class="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-md pl-7 pr-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#242b5f] focus:bg-white transition-all">
                </div>
            </div>

            <!-- Right: Links, Notifications, Profile -->
            <div class="flex items-center gap-2.5 justify-end">
                <!-- Top Bar Quick Links -->
                <div class="hidden xl:flex items-center gap-1">
                    ${isWarehouse ? `
                        ${createTopBarLink(p + 'hr/warehouse/inward.html', 'fas fa-arrow-right-to-bracket', activePage === 'inward', 'Inward (Receive)')}
                        ${createTopBarLink(p + 'hr/warehouse/outward.html', 'fas fa-truck-ramp-box', activePage === 'outward', 'Outward (Dispatch)')}
                    ` : isAccounts ? `
                        ${createTopBarLink(p + 'accounts/invoices.html', 'fas fa-file-invoice-dollar', activePage === 'invoices', 'Invoices & Billing')}
                        ${createTopBarLink(p + 'accounts/purchases.html', 'fas fa-shopping-cart', activePage === 'purchases', 'Supply & Expenses')}
                        ${createTopBarLink(p + 'accounts/payroll.html', 'fas fa-money-check-alt', activePage === 'payroll', 'Payroll Disbursement')}
                        ${createTopBarLink(p + 'accounts/attendance.html', 'fas fa-user-clock', activePage === 'attendance', 'Attendance Audit')}
                        ${createTopBarLink(p + 'accounts/banking.html', 'fas fa-university', activePage === 'banking', 'Banking & Cash Flow')}
                    ` : `
                        ${createTopBarLink(p + 'hr/employee-master.html', 'fas fa-user-plus', activePage === 'employee', 'Add Employee')}
                        ${createTopBarLink(p + 'hr/attendance.html', 'fas fa-clock', activePage === 'attendance', 'Attendance')}
                        ${createTopBarLink(p + 'hr/payroll.html', 'fas fa-file-invoice-dollar', activePage === 'payroll', 'Payroll')}
                        ${createTopBarLink(p + 'hr/assets.html', 'fas fa-tools', activePage === 'assets', 'Asset Custody')}
                        ${createTopBarLink(p + 'hr/reports.html', 'fas fa-chart-bar', activePage === 'reports', 'Reports & Tax')}
                    `}
                </div>
                
                <div class="h-4 border-l border-gray-200 mx-1 hidden xl:block"></div>

                <div class="relative dropdown">
                    <button class="dropdown-toggle text-gray-400 hover:text-[#242b5f] relative p-1.5 rounded-md hover:bg-gray-50 transition focus:outline-none" onclick="toggleDropdown(this, event)" title="Notifications">
                        <i class="fas fa-bell text-[13px]"></i>
                        <span class="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                    </button>
                    <!-- Notifications Dropdown -->
                    <div class="dropdown-menu absolute right-0 top-9 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div class="px-3 py-1.5 border-b border-gray-50 flex justify-between items-center">
                            <p class="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Notifications</p>
                            <span class="text-[8.5px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">3 New</span>
                        </div>
                        <div class="max-h-60 overflow-y-auto">
                            <a href="${p}hr/attendance.html" class="block px-3 py-2 hover:bg-gray-50 border-b border-gray-50 transition">
                                <div class="flex items-start gap-2.5">
                                    <div class="w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5"><i class="fas fa-map-marker-alt text-[9px]"></i></div>
                                    <div>
                                        <p class="text-[11px] font-semibold text-gray-800">Attendance Exception</p>
                                        <p class="text-[9.5px] text-gray-500">Sara Ahmed checked in out of radius.</p>
                                        <p class="text-[8.5px] text-gray-400">10 mins ago</p>
                                    </div>
                                </div>
                            </a>
                            <a href="${p}hr/advance-salary.html" class="block px-3 py-2 hover:bg-gray-50 border-b border-gray-50 transition">
                                <div class="flex items-start gap-2.5">
                                    <div class="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 mt-0.5"><i class="fas fa-hand-holding-usd text-[9px]"></i></div>
                                    <div>
                                        <p class="text-[11px] font-semibold text-gray-800">New Advance Request</p>
                                        <p class="text-[9.5px] text-gray-500">Fahad Hussain requested Rs. 15,000.</p>
                                        <p class="text-[8.5px] text-gray-400">1 hour ago</p>
                                    </div>
                                </div>
                            </a>
                            <a href="${p}hr/leave-management.html" class="block px-3 py-2 hover:bg-gray-50 transition">
                                <div class="flex items-start gap-2.5">
                                    <div class="w-6 h-6 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 mt-0.5"><i class="fas fa-calendar-minus text-[9px]"></i></div>
                                    <div>
                                        <p class="text-[11px] font-semibold text-gray-800">Long Leave Request</p>
                                        <p class="text-[9.5px] text-gray-500">Zainab Ali requested 10 days leave.</p>
                                        <p class="text-[8.5px] text-gray-400">2 hours ago</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="px-3 py-1.5 border-t border-gray-50 text-center">
                            <a href="javascript:void(0)" onclick="openModal('All Live Notifications', '<div class=space-y-2><div class=\\\'p-2 bg-red-50 rounded border border-red-100 text-xs text-red-800\\\'><b>Biometric Geo-alert</b>: Sara Ahmed checked in 45m away from site.</div><div class=\\\'p-2 bg-orange-50 rounded border border-orange-100 text-xs text-orange-800\\\'><b>Advance Queue</b>: Fahad Hussain requested Rs. 15,000 for emergency.</div><div class=\\\'p-2 bg-purple-50 rounded border border-purple-100 text-xs text-purple-800\\\'><b>Leave Approval</b>: Zainab Ali submitted 10 days annual leave.</div></div>', null)" class="text-[9px] font-bold text-[#242b5f] hover:underline uppercase tracking-wider">View All Alerts</a>
                        </div>
                    </div>
                </div>

                <div class="h-4 border-l border-gray-200 mx-0.5"></div>

                <!-- User Profile Dropdown -->
                <div class="relative dropdown">
                    <button class="dropdown-toggle flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition focus:outline-none" onclick="toggleDropdown(this, event)">
                        <div class="w-6 h-6 rounded bg-[#242b5f] text-white flex items-center justify-center font-bold text-[10px]">
                            ${currentDept.badge.substring(0,2)}
                        </div>
                        <div class="hidden sm:block text-left">
                            <p class="text-[11px] font-bold text-gray-700 leading-tight">${currentDept.name}</p>
                            <p class="text-[8.5px] text-gray-400">Admin Desk</p>
                        </div>
                        <i class="fas fa-chevron-down text-gray-400 text-[8px]"></i>
                    </button>
                    <div class="dropdown-menu absolute right-0 top-9 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 text-left">
                        <div class="px-3 py-1.5 border-b border-gray-50">
                            <p class="text-xs font-bold text-gray-800">${currentDept.name}</p>
                            <p class="text-[9px] text-gray-400">admin@cosmixengineering.com</p>
                        </div>
                        <a href="${p}hr/employee-profile.html" class="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"><i class="fas fa-id-badge text-[#242b5f] w-4"></i> View Profile</a>
                        <button onclick="openModal('Cosmix ERP System Status', '<div class=space-y-2 text-xs><p class=font-bold text-gray-800>Cosmix Engineering ERP v2.4</p><p class=text-gray-600>Active Sites: 8 Industrial Sites Online<br>Database: SQLite Synced<br>Biometric Sync: Real-time Cloud API<br>Server Health: 99.98% SLA</p></div>', null)" class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"><i class="fas fa-server text-green-600 w-4"></i> System Status</button>
                        <div class="h-px bg-gray-100 my-1"></div>
                        <a href="${p}login.html" class="block px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"><i class="fas fa-sign-out-alt w-4"></i> Sign Out</a>
                    </div>
                </div>
            </div>
        </header>
    `;

    document.getElementById('app-layout').innerHTML = `
        ${sidebarHTML}
        <div class="flex-1 flex flex-col h-screen overflow-hidden bg-[#f8fafc]">
            ${headerHTML}
            <main id="main-content" class="flex-1 overflow-y-auto p-4 lg:p-5 pb-20 opacity-0 transition-opacity duration-500"></main>
        </div>
    `;

    // Add modal and toast container to body directly to avoid flex/stacking context issues
    if (!document.getElementById('global-modal')) {
        document.body.insertAdjacentHTML('beforeend', `
            <!-- Global Toast Container -->
            <div id="toast-container" class="fixed bottom-5 right-5 flex flex-col gap-2 pointer-events-none" style="z-index: 99999;"></div>

            <!-- Global Modal Container with Backdrop Click-to-Close -->
            <div id="global-modal" onclick="if(event.target === this) closeModal()" class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg transform scale-95 transition-transform duration-300 flex flex-col max-h-[90vh]" id="global-modal-content">
                    <div class="px-4 py-2.5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                        <h3 id="modal-title" class="text-sm font-bold text-gray-800"></h3>
                        <button onclick="closeModal()" class="text-gray-400 hover:text-red-500 transition focus:outline-none">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    </div>
                    <div id="modal-body" class="p-4 overflow-y-auto text-xs"></div>
                    <div class="px-4 py-2.5 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/50 rounded-b-xl" id="modal-footer">
                        <button onclick="closeModal()" class="px-3 py-1 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition">Cancel</button>
                        <button onclick="submitModal()" class="px-3 py-1 text-xs font-bold text-white bg-[#242b5f] rounded hover:opacity-90 transition shadow-sm">Confirm</button>
                    </div>
                </div>
            </div>
        `);
    }

    // Global Floating Round Flowchart Button (Fixed bottom-right across all pages)
    if (!document.getElementById('global-flowchart-btn')) {
        document.body.insertAdjacentHTML('beforeend', `
            <a href="${p}hr/flowchart.html" id="global-flowchart-btn" title="Open HR Process Flowchart" class="fixed bottom-6 right-6 z-[9990] w-14 h-14 rounded-full bg-gradient-to-tr from-[#242b5f] to-[#3b4594] text-white shadow-2xl hover:shadow-indigo-950/40 flex items-center justify-center text-xl border-2 border-white hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer" aria-label="HR Process Flowchart">
                <i class="fas fa-diagram-project transition-transform duration-300 group-hover:rotate-12"></i>
                <span class="absolute right-16 px-3 py-1.5 bg-slate-900/95 text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 border border-slate-700/50 flex items-center gap-2">
                    <i class="fas fa-sitemap text-indigo-400 text-xs"></i> HR Process Flowchart
                </span>
                <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
                </span>
            </a>
        `);
    }

    // Global Export / Import Handlers
    window.exportToExcel = (tableName = 'Records') => {
        showToast(`Exporting ${tableName} to Excel (.xlsx)...`, 'success');
    };

    window.exportToPDF = (tableName = 'Report') => {
        showToast(`Generating official ${tableName} PDF document...`, 'info');
    };

    window.openImportModal = (moduleName = 'Data') => {
        openModal(
            `Import ${moduleName} (Excel / CSV)`,
            `
                <div class="space-y-3">
                    <div class="border-2 border-dashed border-gray-300 hover:border-[#242b5f] rounded-lg p-5 text-center cursor-pointer transition bg-gray-50/60" onclick="document.getElementById('file-upload-input').click()">
                        <i class="fas fa-file-excel text-green-600 text-3xl mb-2"></i>
                        <p class="text-xs font-bold text-gray-700">Click or drag & drop .xlsx / .csv file here</p>
                        <p class="text-[10px] text-gray-400 mt-1">Supports biometric machine logs, attendance dumps, employee sheets</p>
                        <input type="file" id="file-upload-input" class="hidden" onchange="document.getElementById('chosen-file').innerText = this.files[0] ? this.files[0].name : ''">
                        <div id="chosen-file" class="text-xs font-bold text-[#242b5f] mt-2"></div>
                    </div>
                    <div class="flex items-center justify-between text-[10px] bg-blue-50/70 p-2 rounded border border-blue-100">
                        <span class="text-gray-600"><i class="fas fa-info-circle text-blue-600 mr-1"></i> Standard formatted template required</span>
                        <a href="javascript:void(0)" onclick="showToast('Sample template downloaded', 'success')" class="text-[#242b5f] font-bold hover:underline">Download Template</a>
                    </div>
                </div>
            `,
            () => showToast(`${moduleName} imported successfully! 48 records synced.`, 'success')
        );
    };

    // Global Dropdown Toggle Helper
    window.toggleDropdown = (btn, event) => {
        if (event) {
            event.stopPropagation();
        }
        const dropdown = btn.closest('.dropdown');
        if (!dropdown) return;
        const wasOpen = dropdown.classList.contains('open');
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
        if (!wasOpen) {
            dropdown.classList.add('open');
        }
    };

    // Close dropdowns on outside click or menu action click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-toggle')) {
            document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
        }
    });

    // Global Live Table Search Filter Helper
    window.filterTableRows = (input, tbodyId) => {
        const query = (input.value || '').toLowerCase().trim();
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            if (!query || text.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    };

    // Global Header Live Search Handler
    window.handleGlobalSearch = (input) => {
        const tbodies = [
            'employee-table-body',
            'sites-table-body',
            'rules-table-body',
            'attendance-table-body',
            'advance-table-body',
            'leave-table-body',
            'payroll-table-body',
            'offboarding-table-body',
            'assets-table-body',
            'reports-table-body'
        ];
        const activeTbody = tbodies.find(id => document.getElementById(id));
        if (activeTbody) {
            window.filterTableRows(input, activeTbody);
        }
    };

    // Global Hotkey Ctrl+/ to focus search input
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            const searchInp = document.getElementById('global-search-input');
            if (searchInp) searchInp.focus();
        }
    });

    // Global Month History Modal for Attendance
    window.openMonthHistoryModal = (empName, role, empId = 'EMP-1042') => {
        const days = Array.from({length: 30}, (_, i) => {
            const day = i + 1;
            const isSunday = (day % 7 === 6);
            let status = 'P';
            let color = 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
            let time = '09:00 AM';
            let outTime = '06:00 PM';
            if (isSunday) {
                status = 'OFF';
                color = 'bg-gray-100 text-gray-400 border-gray-200';
                time = 'Weekend';
                outTime = 'Rest';
            } else if (day === 7) {
                status = 'LATE';
                color = 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
                time = '10:00 AM';
                outTime = '06:00 PM';
            } else if (day === 14) {
                status = 'ABS';
                color = 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
                time = 'Absent';
                outTime = '-';
            } else if (day === 21) {
                status = 'LV';
                color = 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
                time = 'Casual Leave';
                outTime = '-';
            } else if (day === 25) {
                status = 'OT';
                color = 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
                time = '09:00 AM';
                outTime = '08:30 PM (+2.5h)';
            }
            return { day, status, color, time, outTime };
        });

        const gridHTML = days.map(d => `
            <div onclick="showToast('Date: ${d.day} Sep | In: ${d.time} | Out: ${d.outTime}', 'info')" class="border rounded p-1.5 text-center ${d.color} text-[10px] font-semibold cursor-pointer transition shadow-xs select-none">
                <div class="text-[9px] text-gray-500 font-bold">${d.day} Sep</div>
                <div class="font-extrabold text-[11px] my-0.5">${d.status}</div>
                <div class="text-[7.5px] opacity-80 leading-tight">${d.time}</div>
            </div>
        `).join('');

        const modalHTML = `
            <div class="space-y-3">
                <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-full bg-[#242b5f] text-white flex items-center justify-center font-bold text-xs shadow-sm">${empName.substring(0,2).toUpperCase()}</div>
                        <div>
                            <p class="font-bold text-gray-800 text-xs">${empName}</p>
                            <p class="text-[10px] text-gray-500">${role} • <span class="font-bold text-[#242b5f]">${empId}</span></p>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-1">
                        <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[9px] font-bold border border-green-200">22 Present</span>
                        <span class="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[9px] font-bold border border-orange-200">2 Lates</span>
                        <span class="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[9px] font-bold border border-red-200">1 Absent</span>
                        <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[9px] font-bold border border-purple-200">1 Leave</span>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-1.5">
                        <p class="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
                            <i class="fas fa-calendar-check text-[#242b5f]"></i> September 2026 Timecard Roster
                        </p>
                        <div class="flex gap-2 text-[10px] font-bold">
                            <button onclick="exportToExcel('Timecard_${empName}_Sep_2026')" class="text-green-700 hover:text-green-800 hover:underline flex items-center gap-1">
                                <i class="fas fa-file-excel"></i> Export Excel
                            </button>
                            <button onclick="exportToPDF('Timecard_${empName}_Sep_2026')" class="text-red-600 hover:text-red-700 hover:underline flex items-center gap-1">
                                <i class="fas fa-file-pdf"></i> PDF Card
                            </button>
                        </div>
                    </div>
                    <p class="text-[9px] text-gray-400 mb-2">Click any day tile below to inspect precise punch in/out stamps & geofence data:</p>
                    <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5 max-h-64 overflow-y-auto p-2 bg-gray-50/50 border border-gray-200 rounded-lg">
                        ${gridHTML}
                    </div>
                </div>

                <div class="p-2.5 bg-blue-50/60 border border-blue-100 rounded-lg flex items-center justify-between text-[10px]">
                    <div class="text-gray-600">
                        <span class="font-bold text-gray-800">Working Days:</span> 26 Days | <span class="font-bold text-gray-800">Total Hours:</span> 208 hrs | <span class="font-bold text-blue-700">Overtime:</span> 2.5 hrs
                    </div>
                    <span class="text-green-700 font-bold bg-green-100/80 px-2 py-0.5 rounded">Attendance: 95.8%</span>
                </div>
            </div>
        `;

        openModal(`Attendance Timecard: ${empName} (${empId})`, modalHTML, null);
    };

    // Global Salary Invoice & Payslip Modal
    window.openPayslipModal = (data = {}) => {
        const empName = data.name || 'Ali Khan';
        const role = data.role || 'HVAC Engineer';
        const empId = data.empId || 'EMP-1042';
        const month = data.month || 'September 2026';
        const site = data.site || 'Karachi High-Rise Project';
        const base = data.base || 85000;
        const hra = Math.round(base * 0.40);
        const medical = Math.round(base * 0.10);
        const ot = data.ot || 8000;
        const allowance = data.allowance || 5000;
        const gross = base + hra + medical + ot + allowance;
        
        const advanceEmi = data.advanceEmi || 5000;
        const tax = data.tax || 2500;
        const eobi = 580;
        const lateDed = data.lateDed || 0;
        const totalDed = advanceEmi + tax + eobi + lateDed;
        const net = gross - totalDed;
        const bank = data.bank || 'Meezan Bank Ltd';
        const iban = data.iban || 'PK36MEZN00010982347101';
        const payslipNo = data.slipNo || `PAY-SEP26-${empId.replace('EMP-', '')}`;

        const html = `
            <div class="space-y-3 print:p-0">
                <!-- Company Header & Invoice Identity -->
                <div class="border-b border-gray-200 pb-2.5 flex flex-wrap justify-between items-start gap-2">
                    <div class="flex items-center gap-2.5">
                        <img src="https://cosmixengineering.com/wp-content/uploads/2024/09/cropped-Cosmix-Logo-PNG-File-300x90.png" class="h-7 object-contain" alt="Cosmix Logo" onerror="this.outerHTML='<span class=\\'font-black text-[#242b5f] text-base tracking-widest\\'>COSMIX</span>'">
                        <div>
                            <p class="font-black text-xs text-[#242b5f] uppercase tracking-wide leading-tight">Cosmix Engineering (Pvt) Ltd</p>
                            <p class="text-[9px] text-gray-400">MEP Contracting & Industrial Engineering • NTN: 4129841-7</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="bg-[#242b5f] text-white text-[8.5px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Salary Invoice / Payslip</span>
                        <p class="text-[10px] font-bold text-gray-700 mt-0.5">Slip #: <span class="font-mono text-[#242b5f]">${payslipNo}</span></p>
                        <p class="text-[9px] text-gray-400">Period: ${month}</p>
                    </div>
                </div>

                <!-- Employee Information Card -->
                <div class="bg-gray-50 p-2.5 rounded-lg border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                        <p class="text-[8.5px] text-gray-400 font-bold uppercase">Employee Name</p>
                        <p class="font-bold text-gray-800 text-[11px]">${empName}</p>
                        <p class="text-[9px] text-[#242b5f] font-bold">${empId}</p>
                    </div>
                    <div>
                        <p class="text-[8.5px] text-gray-400 font-bold uppercase">Designation</p>
                        <p class="font-semibold text-gray-800 text-[11px]">${role}</p>
                        <p class="text-[9px] text-gray-500">MEP Operations</p>
                    </div>
                    <div>
                        <p class="text-[8.5px] text-gray-400 font-bold uppercase">Deployment Site</p>
                        <p class="font-semibold text-gray-800 text-[11px] truncate">${site}</p>
                        <p class="text-[9px] text-green-600 font-bold">26 Days Present</p>
                    </div>
                    <div>
                        <p class="text-[8.5px] text-gray-400 font-bold uppercase">Disbursal Account</p>
                        <p class="font-semibold text-[#242b5f] text-[11px]">${bank}</p>
                        <p class="text-[8.5px] font-mono text-gray-500 truncate" title="${iban}">${iban}</p>
                    </div>
                </div>

                <!-- Earnings vs Deductions Breakdown -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <!-- Earnings -->
                    <div class="border border-green-200 rounded-lg overflow-hidden">
                        <div class="bg-green-50 px-3 py-1.5 border-b border-green-100 flex justify-between items-center">
                            <span class="text-[10px] font-bold text-green-800 uppercase tracking-wider"><i class="fas fa-plus-circle mr-1"></i> Earnings & Allowances</span>
                            <span class="text-[8.5px] text-green-700 font-semibold">PKR (Rs.)</span>
                        </div>
                        <div class="p-2.5 space-y-1.5 text-xs">
                            <div class="flex justify-between text-gray-600"><span>Basic Pay (50%)</span><span class="font-semibold text-gray-800">Rs. ${base.toLocaleString()}</span></div>
                            <div class="flex justify-between text-gray-600"><span>House Rent Allowance</span><span class="font-semibold text-gray-800">Rs. ${hra.toLocaleString()}</span></div>
                            <div class="flex justify-between text-gray-600"><span>Medical Allowance</span><span class="font-semibold text-gray-800">Rs. ${medical.toLocaleString()}</span></div>
                            <div class="flex justify-between text-gray-600"><span>Site / Fuel Allowance</span><span class="font-semibold text-gray-800">Rs. ${allowance.toLocaleString()}</span></div>
                            <div class="flex justify-between text-gray-600"><span>Overtime (${data.otHours || '20h'} OT)</span><span class="font-bold text-green-700">+Rs. ${ot.toLocaleString()}</span></div>
                            <div class="border-t border-gray-200 pt-1.5 flex justify-between text-xs font-bold text-green-800">
                                <span>Gross Remuneration:</span>
                                <span>Rs. ${gross.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Deductions -->
                    <div class="border border-red-200 rounded-lg overflow-hidden">
                        <div class="bg-red-50 px-3 py-1.5 border-b border-red-100 flex justify-between items-center">
                            <span class="text-[10px] font-bold text-red-800 uppercase tracking-wider"><i class="fas fa-minus-circle mr-1"></i> Deductions & Recoveries</span>
                            <span class="text-[8.5px] text-red-700 font-semibold">PKR (Rs.)</span>
                        </div>
                        <div class="p-2.5 space-y-1.5 text-xs">
                            <div class="flex justify-between text-gray-600"><span>Advance Salary EMI</span><span class="font-semibold text-red-600">-Rs. ${advanceEmi.toLocaleString()}</span></div>
                            <div class="flex justify-between text-gray-600"><span>Income Tax (WHT FBR)</span><span class="font-semibold text-red-600">-Rs. ${tax.toLocaleString()}</span></div>
                            <div class="flex justify-between text-gray-600"><span>EOBI Contribution</span><span class="font-semibold text-red-600">-Rs. ${eobi.toLocaleString()}</span></div>
                            <div class="flex justify-between text-gray-600"><span>Late Attendance Penalties</span><span class="font-semibold text-gray-500">${lateDed > 0 ? '-Rs. ' + lateDed.toLocaleString() : 'Rs. 0 (Waived)'}</span></div>
                            <div class="flex justify-between text-gray-400 text-[10px] italic"><span>Provident Fund / Other</span><span>Rs. 0</span></div>
                            <div class="border-t border-gray-200 pt-1.5 flex justify-between text-xs font-bold text-red-700">
                                <span>Total Recoveries:</span>
                                <span>-Rs. ${totalDed.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Net Payable Highlight Banner -->
                <div class="bg-[#242b5f] text-white p-3 rounded-lg flex flex-wrap justify-between items-center gap-2 shadow-sm">
                    <div>
                        <p class="text-[8.5px] text-blue-200 font-bold uppercase tracking-wider">Net Bank Disbursal Amount</p>
                        <h4 class="text-lg font-black text-white">Rs. ${net.toLocaleString()}</h4>
                    </div>
                    <div class="text-right">
                        <span class="bg-green-500/20 text-green-300 text-[9px] px-2 py-0.5 rounded font-bold border border-green-500/30">Transferred via 1-Link</span>
                        <p class="text-[8.5px] text-gray-300 mt-0.5">Value Date: 01 Oct 2026</p>
                    </div>
                </div>

                <!-- Print & PDF Footer Controls -->
                <div class="flex justify-between items-center text-[9px] text-gray-400 pt-1 border-t border-gray-100">
                    <div>
                        <p><i class="fas fa-shield-alt text-green-600 mr-1"></i> Computer-generated document. Verified by Cosmix ERP Payroll System.</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.print()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1"><i class="fas fa-print"></i> Print</button>
                        <button onclick="showToast('Payslip PDF generated for ${empName}', 'success')" class="bg-[#242b5f] hover:opacity-90 text-white px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1"><i class="fas fa-file-pdf"></i> Download PDF</button>
                    </div>
                </div>
            </div>
        `;

        openModal(`Salary Invoice & Payslip: ${empName} (${month})`, html, null);
    };

    // Initialize global JS functions
    window.showToast = (message, type = 'success') => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-[#242b5f]';
        const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        
        toast.className = `${bgColor} text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transform translate-y-10 opacity-0 transition-all duration-300 max-w-xs text-xs`;
        toast.innerHTML = `<i class="fas ${icon} text-xs"></i> <span class="font-medium">${message}</span>`;
        
        container.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        });
        
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-x-10');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    window.openModal = (title, bodyHTML, onConfirm = null) => {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-body').innerHTML = bodyHTML;
        
        const modal = document.getElementById('global-modal');
        const content = document.getElementById('global-modal-content');
        const footer = document.getElementById('modal-footer');
        
        if (footer) {
            if (onConfirm) {
                footer.innerHTML = `
                    <button onclick="closeModal()" class="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition">Cancel</button>
                    <button onclick="submitModal()" class="px-3 py-1.5 text-xs font-bold text-white bg-[#242b5f] rounded hover:opacity-90 transition shadow-sm">Confirm</button>
                `;
            } else {
                footer.innerHTML = `
                    <button onclick="closeModal()" class="px-4 py-1.5 text-xs font-bold text-white bg-[#242b5f] rounded hover:opacity-90 transition shadow-sm">Close</button>
                `;
            }
        }
        
        modal.classList.remove('opacity-0', 'pointer-events-none');
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
        
        window.currentModalConfirm = onConfirm;
    };

    window.closeModal = () => {
        const modal = document.getElementById('global-modal');
        const content = document.getElementById('global-modal-content');
        
        modal.classList.add('opacity-0', 'pointer-events-none');
        content.classList.add('scale-95');
        content.classList.remove('scale-100');
    };

    window.submitModal = () => {
        if (window.currentModalConfirm) {
            window.currentModalConfirm();
        }
        closeModal();
    };

    // Sidebar Toggle Logic
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-btn');
    const logoImg = document.getElementById('logo-img');
    const menuLabel = document.getElementById('menu-label');
    const menuTexts = document.querySelectorAll('.menu-text');
    let isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

    const updateSidebarState = () => {
        if (isCollapsed) {
            sidebar.classList.remove('w-[215px]', 'w-[185px]');
            sidebar.classList.add('w-[64px]');
            logoImg.classList.add('opacity-0', 'w-0', 'hidden');
            menuLabel.classList.add('opacity-0', 'h-0', 'overflow-hidden', 'mb-0');
            menuTexts.forEach(el => el.classList.add('opacity-0', 'w-0', 'hidden'));
        } else {
            sidebar.classList.remove('w-[64px]');
            sidebar.classList.add('w-[215px]');
            logoImg.classList.remove('opacity-0', 'w-0', 'hidden');
            menuLabel.classList.remove('opacity-0', 'h-0', 'overflow-hidden', 'mb-0');
            menuTexts.forEach(el => el.classList.remove('opacity-0', 'w-0', 'hidden'));
        }
    };

    window.toggleSidebar = () => {
        isCollapsed = !isCollapsed;
        localStorage.setItem('sidebarCollapsed', isCollapsed);
        updateSidebarState();
    };

    // Initial state
    updateSidebarState();
};

const createNavLink = (href, text, icon, isActive, badge = null) => {
    const activeClass = isActive 
        ? 'bg-[#242b5f] text-white shadow-sm shadow-[#242b5f]/25 font-semibold' 
        : 'text-slate-600 hover:bg-slate-100/80 hover:text-[#242b5f] font-medium';
    
    const iconClass = isActive
        ? 'text-white'
        : 'text-slate-400 group-hover:text-[#242b5f]';

    const badgeHTML = badge ? `
        <span class="menu-text ml-auto ${badge.bg} ${badge.text} text-[9px] font-bold px-1.5 py-0.5 rounded-full transition-opacity duration-300 shrink-0">
            ${badge.label}
        </span>
    ` : '';

    return `
        <a href="${href}" class="group flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 ${activeClass}" title="${text}">
            <div class="w-5 h-5 flex items-center justify-center shrink-0">
                <i class="${icon} ${iconClass} text-xs transition-colors"></i>
            </div>
            <span class="menu-text transition-opacity duration-300 truncate text-[12px] tracking-normal">${text}</span>
            ${badgeHTML}
        </a>
    `;
};

const setPageContent = (title, contentHTML) => {
    document.getElementById('header-title').innerText = title;
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = contentHTML;
    
    // Trigger fade-in animation
    setTimeout(() => {
        mainContent.classList.remove('opacity-0');
    }, 50);

    // Ensure global dropdown menu logic and outside click handling
    if (!window.dropdownListenerAdded) {
        document.addEventListener('click', (e) => {
            // If clicked inside dropdown-menu action items, close open dropdowns
            if (e.target.closest('.dropdown-menu button, .dropdown-menu a')) {
                setTimeout(() => {
                    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
                }, 50);
                return;
            }

            // Identify if clicked a toggle button
            let toggleBtn = e.target.closest('.dropdown-toggle, [data-dropdown-toggle], .dropdown > button');
            if (!toggleBtn) {
                const btn = e.target.closest('button');
                if (btn && btn.closest('.dropdown') && !btn.closest('.dropdown-menu')) {
                    if (btn.querySelector('.fa-ellipsis-v, .fa-bell') || e.target.classList.contains('fa-ellipsis-v') || e.target.classList.contains('fa-bell')) {
                        toggleBtn = btn;
                    }
                }
            }

            const dropdown = toggleBtn ? toggleBtn.closest('.dropdown') : null;

            // Close all other dropdowns
            document.querySelectorAll('.dropdown.open').forEach(d => {
                if (dropdown && d === dropdown) return;
                if (!d.contains(e.target)) d.classList.remove('open');
            });

            if (toggleBtn && dropdown) {
                dropdown.classList.toggle('open');
            }
        });
        window.dropdownListenerAdded = true;
    }
};
