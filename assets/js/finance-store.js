/**
 * Cosmix Hub - Finance & General Ledger State Manager
 * Pakistani 4-digit Chart of Accounts (1100-5400), Fiscal Periods with monthly locking,
 * Balanced Double-Entry Journal Entries (Dr = Cr validation), Automated Trial Balance,
 * 65/30/5 Contract Milestone Invoicing integration, and AR / AP Aging schedules (0-30, 31-60, 61-90, 91-120, 120+ days).
 */

const CosmixFinance = (() => {
    const STORAGE_KEY = 'cosmix_finance_state_v1';

    const defaultState = {
        fiscalYear: 'FY 2026-2027',
        fiscalPeriods: [
            { id: 'fp-2026-07', periodName: 'July 2026', startDate: '2026-07-01', endDate: '2026-07-31', status: 'Closed', closedBy: 'cfo@cosmixengineering.com', closedAt: '2026-08-05' },
            { id: 'fp-2026-08', periodName: 'August 2026', startDate: '2026-08-01', endDate: '2026-08-31', status: 'Closed', closedBy: 'cfo@cosmixengineering.com', closedAt: '2026-09-04' },
            { id: 'fp-2026-09', periodName: 'September 2026', startDate: '2026-09-01', endDate: '2026-09-30', status: 'Open', closedBy: null, closedAt: null },
            { id: 'fp-2026-10', periodName: 'October 2026', startDate: '2026-10-01', endDate: '2026-10-31', status: 'Future', closedBy: null, closedAt: null },
            { id: 'fp-2026-11', periodName: 'November 2026', startDate: '2026-11-01', endDate: '2026-11-30', status: 'Future', closedBy: null, closedAt: null },
            { id: 'fp-2026-12', periodName: 'December 2026', startDate: '2026-12-01', endDate: '2026-12-31', status: 'Future', closedBy: null, closedAt: null }
        ],

        // 4-Digit Chart of Accounts (COA) - Perfectly Balanced
        chartOfAccounts: [
            // ASSETS (1000s)
            { code: '1100', name: 'Cash & Bank Accounts (Meezan & HBL Current)', type: 'Asset', normalBalance: 'Debit', balancePkr: 18950000, isControl: false },
            { code: '1200', name: 'Accounts Receivable (Trade Debtors)', type: 'Asset', normalBalance: 'Debit', balancePkr: 24850000, isControl: true },
            { code: '1300', name: 'Sales Tax Recoverable (Input GST/SST Claims)', type: 'Asset', normalBalance: 'Debit', balancePkr: 3840000, isControl: false },
            { code: '1400', name: 'Client Retention Money Receivable (5% Held)', type: 'Asset', normalBalance: 'Debit', balancePkr: 2432500, isControl: true },
            { code: '1500', name: 'Inventory & Stores Stock (Dual-Store Raw Materials)', type: 'Asset', normalBalance: 'Debit', balancePkr: 30167500, isControl: true },
            { code: '1600', name: 'Property, Plant & Workshop Machinery', type: 'Asset', normalBalance: 'Debit', balancePkr: 45000000, isControl: false },

            // LIABILITIES (2000s)
            { code: '2100', name: 'Accounts Payable (Trade Creditors)', type: 'Liability', normalBalance: 'Credit', balancePkr: 16900000, isControl: true },
            { code: '2200', name: 'Output Sales Tax & WHT Payable (SRB/PRA/KPRA/FBR)', type: 'Liability', normalBalance: 'Credit', balancePkr: 3450000, isControl: false },
            { code: '2300', name: 'Salaries & Wages Accrued', type: 'Liability', normalBalance: 'Credit', balancePkr: 2850000, isControl: false },
            { code: '2400', name: 'Client Advance Mobilization Deposits', type: 'Liability', normalBalance: 'Credit', balancePkr: 12500000, isControl: false },

            // EQUITY (3000s)
            { code: '3100', name: 'Paid Up Share Capital', type: 'Equity', normalBalance: 'Credit', balancePkr: 50000000, isControl: false },
            { code: '3200', name: 'Retained Earnings / General Reserves', type: 'Equity', normalBalance: 'Credit', balancePkr: 28400000, isControl: false },

            // REVENUE (4000s)
            { code: '4100', name: 'HVAC & MEP Turnkey Contracting Revenue', type: 'Revenue', normalBalance: 'Credit', balancePkr: 48650000, isControl: false },
            { code: '4200', name: 'Maintenance & Service Contract Income', type: 'Revenue', normalBalance: 'Credit', balancePkr: 4200000, isControl: false },

            // EXPENSES & COGS (5000s)
            { code: '5100', name: 'Direct Material & Raw Sheet Metal Cost', type: 'Expense', normalBalance: 'Debit', balancePkr: 26400000, isControl: false },
            { code: '5200', name: 'Direct Site Labor & Subcontracting', type: 'Expense', normalBalance: 'Debit', balancePkr: 7310000, isControl: false },
            { code: '5300', name: 'Factory Overhead, Electricity & Fuel', type: 'Expense', normalBalance: 'Debit', balancePkr: 3250000, isControl: false },
            { code: '5400', name: 'Administrative, Office & Fleet Expenses', type: 'Expense', normalBalance: 'Debit', balancePkr: 4750000, isControl: false }
        ],

        // General Ledger Double-Entry Journals
        journalEntries: [
            {
                id: 'jv-101',
                voucherNo: 'JV-2026-0901',
                voucherDate: '2026-09-15',
                periodId: 'fp-2026-09',
                reference: 'PO-2026-0101 (GI Sheet Inward Stock Receipt)',
                narration: 'Being purchase of GI Sheet 22G inwarded at Central Warehouse from Pakistan Steel Mills Syndicate against GRN-0041.',
                status: 'Posted',
                postedBy: 'finance@cosmixengineering.com',
                postedAt: '2026-09-15 16:30',
                lines: [
                    { accountCode: '1500', accountName: 'Inventory & Stores Stock', debitPkr: 1587500, creditPkr: 0, memo: 'Stores inventory capitalization' },
                    { accountCode: '1300', accountName: 'Sales Tax Recoverable (18% FBR Input)', debitPkr: 285750, creditPkr: 0, memo: 'FBR GST input tax claim' },
                    { accountCode: '2100', accountName: 'Accounts Payable', debitPkr: 0, creditPkr: 1873250, memo: 'Payable to Pakistan Steel Mills' }
                ],
                totalDebitPkr: 1873250,
                totalCreditPkr: 1873250
            },
            {
                id: 'jv-102',
                voucherNo: 'JV-2026-0902',
                voucherDate: '2026-09-18',
                periodId: 'fp-2026-09',
                reference: 'INV-2026-0044 (Lucky Motor HVAC Milestone 1 IPC # 1)',
                narration: 'Being recognition of 65% milestone billing (Advance on Signing & Equipment Procurement) to Lucky Motor Corporation Ltd.',
                status: 'Posted',
                postedBy: 'finance@cosmixengineering.com',
                postedAt: '2026-09-18 11:20',
                lines: [
                    { accountCode: '1200', accountName: 'Accounts Receivable (Trade Debtors)', debitPkr: 24544000, creditPkr: 0, memo: 'Gross + 18% Sales Tax on Milestone 1' },
                    { accountCode: '4100', accountName: 'HVAC & MEP Turnkey Contracting Revenue', debitPkr: 0, creditPkr: 20800000, memo: '65% Milestone Base Value' },
                    { accountCode: '2200', accountName: 'Output Sales Tax & WHT Payable', debitPkr: 0, creditPkr: 3744000, memo: '18% FBR Sales Tax on Equipment Supply' }
                ],
                totalDebitPkr: 24544000,
                totalCreditPkr: 24544000
            },
            {
                id: 'jv-103',
                voucherNo: 'JV-2026-0903',
                voucherDate: '2026-09-22',
                periodId: 'fp-2026-09',
                reference: 'PAYROLL-AUG-2026 (Monthly Staff Salary Settlement)',
                narration: 'Being payroll disbursement for August 2026 after biometric deductions and WHT deductions.',
                status: 'Posted',
                postedBy: 'finance@cosmixengineering.com',
                postedAt: '2026-09-22 17:00',
                lines: [
                    { accountCode: '5200', accountName: 'Direct Site Labor & Subcontracting', debitPkr: 2850000, creditPkr: 0, memo: 'Gross payroll expense' },
                    { accountCode: '2200', accountName: 'Output Sales Tax & WHT Payable', debitPkr: 0, creditPkr: 142500, memo: 'Income tax deducted at source' },
                    { accountCode: '1100', accountName: 'Cash & Bank Accounts', debitPkr: 0, creditPkr: 2707500, memo: 'Direct bank transfer net salaries' }
                ],
                totalDebitPkr: 2850000,
                totalCreditPkr: 2850000
            }
        ],

        // Accounts Receivable (AR) Aging Buckets (PKR)
        arAging: [
            { clientName: 'Lucky Motor Corporation Ltd', projectRef: 'PRJ-2026-044', totalPkr: 8850000, days0_30: 8850000, days31_60: 0, days61_90: 0, days91_120: 0, daysOver120: 0, status: 'Current' },
            { clientName: 'The Indus Hospital & Health Network', projectRef: 'PRJ-2026-039', totalPkr: 6400000, days0_30: 4200000, days31_60: 2200000, days61_90: 0, days91_120: 0, daysOver120: 0, status: 'Current' },
            { clientName: 'Dolmen Real Estate (Pvt) Ltd', projectRef: 'PRJ-2026-042', totalPkr: 5200000, days0_30: 0, days31_60: 3400000, days61_90: 1800000, days91_120: 0, daysOver120: 0, status: 'FollowUp' },
            { clientName: 'Packages Real Estate Ltd', projectRef: 'PRJ-2026-031', totalPkr: 3100000, days0_30: 0, days31_60: 0, days61_90: 0, days91_120: 2100000, daysOver120: 1000000, status: 'OverdueCritical' },
            { clientName: 'Engro Polymer & Chemicals Ltd', projectRef: 'PRJ-2026-045', totalPkr: 1300000, days0_30: 1300000, days31_60: 0, days61_90: 0, days91_120: 0, daysOver120: 0, status: 'Current' }
        ],

        // Accounts Payable (AP) Aging Buckets (PKR)
        apAging: [
            { vendorName: 'Pakistan Steel Mills Syndicate', poRef: 'PO-2026-0101', totalPkr: 1873250, days0_30: 1873250, days31_60: 0, days61_90: 0, days91_120: 0, daysOver120: 0, terms: '30 Days Net' },
            { vendorName: 'Siemens Pakistan Engineering Co.', poRef: 'PO-2026-0102', totalPkr: 1897440, days0_30: 1897440, days31_60: 0, days61_90: 0, days91_120: 0, daysOver120: 0, terms: '50% Adv / 50% Del' },
            { vendorName: 'Diamond Supreme Insulation Ltd', poRef: 'PO-2026-0103', totalPkr: 1291510, days0_30: 1291510, days31_60: 0, days61_90: 0, days91_120: 0, daysOver120: 0, terms: '15 Days Credit' },
            { vendorName: 'Atlas Copco Pakistan (Pvt) Ltd', poRef: 'PO-2026-0089', totalPkr: 4366000, days0_30: 0, days31_60: 4366000, days61_90: 0, days91_120: 0, daysOver120: 0, terms: '30 Days Net' },
            { vendorName: 'Muller Pipes & Fittings Lahore', poRef: 'PO-2026-0078', totalPkr: 1420000, days0_30: 0, days31_60: 0, days61_90: 1420000, days91_120: 0, daysOver120: 0, terms: '15 Days Credit' }
        ],

        // 65/30/5 Milestone Definitions
        milestoneTemplates: [
            {
                tier: 1,
                code: 'M1',
                name: 'Milestone 1 (65%): Advance on Signing & Equipment Procurement',
                percent: 65,
                description: 'Advance mobilization upon contract signing, engineering submittal clearance, factory manufacturing initiation, and equipment procurement.',
                deliverables: 'Engineering design approval, material approval submittals, factory purchase orders for AHU / Chiller / Piping, and initial site mobilization.'
            },
            {
                tier: 2,
                code: 'M2',
                name: 'Milestone 2 (30%): Equipment Delivery at Factory Gate / Delivery Pass',
                percent: 30,
                description: 'Physical equipment inspection, clearance at factory gate, gate delivery pass issuance, site rigging, ductwork erection, and primary piping layout.',
                deliverables: 'Delivery pass signed by Resident Engineer, AHU / chiller equipment placement, major duct risers installed, and hydrostatic pressure testing.'
            },
            {
                tier: 3,
                code: 'M3',
                name: 'Milestone 3 (5%): Site Testing, Commissioning & Handover signoff',
                percent: 5,
                description: 'Integrated site testing, air balancing (TAB report), cleanroom validation, punch-list closure, and final handover signoff certificate.',
                deliverables: 'Third-party TAB balance certification, electrical load test, temperature & humidity datalogging, and client final handover acceptance certificate.'
            }
        ],

        // Reference Project Contracts with 65/30/5 Values
        projectContracts: {
            'PRJ-2026-044': {
                id: 'PRJ-2026-044',
                clientName: 'Lucky Motor Corporation Ltd',
                projectName: 'Lucky Motor Assembly Plant HVAC Expansion',
                siteLocation: 'Lucky Motor Assembly Plant, Bin Qasim',
                province: 'Sindh',
                taxJurisdiction: '18% FBR',
                taxRate: 0.18,
                contractValuePkr: 32000000,
                ntn: '2847192-3',
                strn: '17-00-2847-192-12',
                poRef: 'PO-LMC-2026-0044',
                milestones: {
                    m1: { percent: 65, amountPkr: 20800000, status: 'Billed', invRef: 'INV-2026-044' },
                    m2: { percent: 30, amountPkr: 9600000, status: 'Ready to Invoice', invRef: null },
                    m3: { percent: 5, amountPkr: 1600000, status: 'Pending Site Handover', invRef: null }
                }
            },
            'PRJ-2026-039': {
                id: 'PRJ-2026-039',
                clientName: 'The Indus Hospital & Health Network',
                projectName: 'Indus Hospital Blood Bank Cleanroom & Isolation HVAC',
                siteLocation: 'Blood Bank Cleanroom & Ward, Karachi',
                province: 'Sindh',
                taxJurisdiction: '13% SRB',
                taxRate: 0.13,
                contractValuePkr: 18500000,
                ntn: '3192044-8',
                strn: '17-00-3192-044-15',
                poRef: 'PO-IND-2026-0039',
                milestones: {
                    m1: { percent: 65, amountPkr: 12025000, status: 'Paid', invRef: 'INV-2026-039-M1' },
                    m2: { percent: 30, amountPkr: 5550000, status: 'Ready to Invoice', invRef: null },
                    m3: { percent: 5, amountPkr: 925000, status: 'Pending Site Handover', invRef: null }
                }
            },
            'PRJ-2026-041': {
                id: 'PRJ-2026-041',
                clientName: 'Packages Real Estate Ltd',
                projectName: 'Packages Mall Firefighting & Sprinkler Grid Installation',
                siteLocation: 'Packages Mall, Lahore',
                province: 'Punjab',
                taxJurisdiction: '16% PRA',
                taxRate: 0.16,
                contractValuePkr: 24000000,
                ntn: '1249871-5',
                strn: '17-00-1249-871-19',
                poRef: 'PO-PKG-2026-0041',
                milestones: {
                    m1: { percent: 65, amountPkr: 15600000, status: 'Paid', invRef: 'INV-2026-041-M1' },
                    m2: { percent: 30, amountPkr: 7200000, status: 'Ready to Invoice', invRef: null },
                    m3: { percent: 5, amountPkr: 1200000, status: 'Pending Site Handover', invRef: null }
                }
            },
            'PRJ-2026-045': {
                id: 'PRJ-2026-045',
                clientName: 'Engro Fertilizers Complex',
                projectName: 'Substation Electrical Busway, Trays & Switchgear',
                siteLocation: 'Engro Complex, Daharki',
                province: 'Sindh',
                taxJurisdiction: '18% FBR',
                taxRate: 0.18,
                contractValuePkr: 28000000,
                ntn: '0711928-8',
                strn: '17-00-0711-928-11',
                poRef: 'PO-ENG-2026-0045',
                milestones: {
                    m1: { percent: 65, amountPkr: 18200000, status: 'Paid', invRef: 'INV-2026-045-M1' },
                    m2: { percent: 30, amountPkr: 8400000, status: 'Ready to Invoice', invRef: null },
                    m3: { percent: 5, amountPkr: 1400000, status: 'Pending Site Handover', invRef: null }
                }
            },
            'PRJ-2026-042': {
                id: 'PRJ-2026-042',
                clientName: 'Lucky Cement Industrial Plant',
                projectName: 'Kiln Exhaust Air Ventilation Ductwork & Heavy Blowers',
                siteLocation: 'Lucky Cement Plant, Pezu KPK',
                province: 'KPK',
                taxJurisdiction: '15% KPRA',
                taxRate: 0.15,
                contractValuePkr: 16000000,
                ntn: '0981245-1',
                strn: '17-00-0981-245-14',
                poRef: 'PO-LKC-2026-0042',
                milestones: {
                    m1: { percent: 65, amountPkr: 10400000, status: 'Paid', invRef: 'INV-2026-042-M1' },
                    m2: { percent: 30, amountPkr: 4800000, status: 'Ready to Invoice', invRef: null },
                    m3: { percent: 5, amountPkr: 800000, status: 'Pending Site Handover', invRef: null }
                }
            },
            'PRJ-2026-033': {
                id: 'PRJ-2026-033',
                clientName: 'DHA City Sector 3 Commercial',
                projectName: 'MEP Underground Utilities & Water Distribution',
                siteLocation: 'DHA City Sector 3 Commercial, Karachi',
                province: 'Sindh',
                taxJurisdiction: '13% SRB',
                taxRate: 0.13,
                contractValuePkr: 50000000,
                ntn: '3318291-0',
                strn: '17-00-3318-291-18',
                poRef: 'PO-DHA-2026-0033',
                milestones: {
                    m1: { percent: 65, amountPkr: 32500000, status: 'Ready to Invoice', invRef: null },
                    m2: { percent: 30, amountPkr: 15000000, status: 'Pending Delivery', invRef: null },
                    m3: { percent: 5, amountPkr: 2500000, status: 'Pending Site Handover', invRef: null }
                }
            }
        }
    };

    function loadState() {
        try {
            if (typeof localStorage !== 'undefined') {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) return JSON.parse(raw);
            }
        } catch (e) {
            console.error('Failed to parse finance state', e);
        }
        return JSON.parse(JSON.stringify(defaultState));
    }

    function saveState(state) {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            }
        } catch (e) {
            console.error('Failed to save finance state', e);
        }
    }

    let state = loadState();

    return {
        getFiscalYear: () => state.fiscalYear,
        getFiscalPeriods: () => state.fiscalPeriods,
        getChartOfAccounts: () => state.chartOfAccounts,
        getJournalEntries: () => state.journalEntries,
        getArAging: () => state.arAging,
        getApAging: () => state.apAging,
        getMilestoneTemplates: () => state.milestoneTemplates,
        getProjectContracts: () => state.projectContracts,

        getTrialBalance: () => {
            let totalDebit = 0;
            let totalCredit = 0;
            const rows = state.chartOfAccounts.map(acc => {
                let debit = 0;
                let credit = 0;
                if (acc.normalBalance === 'Debit') {
                    debit = acc.balancePkr;
                    totalDebit += debit;
                } else {
                    credit = acc.balancePkr;
                    totalCredit += credit;
                }
                return {
                    code: acc.code,
                    name: acc.name,
                    type: acc.type,
                    debitPkr: debit,
                    creditPkr: credit
                };
            });

            return {
                rows,
                totalDebitPkr: totalDebit,
                totalCreditPkr: totalCredit,
                isBalanced: totalDebit === totalCredit,
                variancePkr: Math.abs(totalDebit - totalCredit)
            };
        },

        createJournalEntry: (jvData) => {
            const totalDebit = (jvData.lines || []).reduce((acc, l) => acc + (Number(l.debitPkr) || 0), 0);
            const totalCredit = (jvData.lines || []).reduce((acc, l) => acc + (Number(l.creditPkr) || 0), 0);

            if (totalDebit !== totalCredit) {
                return { success: false, message: `Journal entry is not balanced! Total Debit (PKR ${totalDebit.toLocaleString()}) must equal Total Credit (PKR ${totalCredit.toLocaleString()}).` };
            }

            const newJv = {
                id: 'jv-' + Date.now(),
                voucherNo: 'JV-2026-0' + (state.journalEntries.length + 904),
                voucherDate: jvData.voucherDate || new Date().toISOString().split('T')[0],
                periodId: 'fp-2026-09',
                reference: jvData.reference || 'Manual JV Entry',
                narration: jvData.narration || '',
                status: 'Posted',
                postedBy: 'finance@cosmixengineering.com',
                postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                lines: jvData.lines || [],
                totalDebitPkr: totalDebit,
                totalCreditPkr: totalCredit
            };

            state.journalEntries.unshift(newJv);

            // Update Chart of Account balances
            jvData.lines.forEach(l => {
                const acc = state.chartOfAccounts.find(a => a.code === l.accountCode);
                if (acc) {
                    if (acc.normalBalance === 'Debit') {
                        acc.balancePkr += (Number(l.debitPkr) || 0) - (Number(l.creditPkr) || 0);
                    } else {
                        acc.balancePkr += (Number(l.creditPkr) || 0) - (Number(l.debitPkr) || 0);
                    }
                }
            });

            saveState(state);
            return { success: true, jv: newJv, message: 'Journal voucher posted successfully and GL balances updated.' };
        },

        /**
         * Posts a Milestone / Project Sales Invoice to the General Ledger & Updates AR Aging Schedule
         * Creates Balanced Double-Entry:
         *   Dr 1200 Accounts Receivable (Trade Debtors) = Gross + Sales Tax
         *   Cr 4100 HVAC & MEP Turnkey Contracting Revenue = Gross Milestone Amount
         *   Cr 2200 Output Sales Tax Payable = Sales Tax Amount
         */
        postSalesInvoiceJournal: (inv) => {
            const gross = Math.round(Number(inv.gross) || 0);
            const salesTax = Math.round(Number(inv.salesTax) || 0);
            const totalReceivable = gross + salesTax;
            const netPayable = Math.round(Number(inv.net) || totalReceivable);
            const invoiceNo = inv.id || ('INV-2026-' + Date.now().toString().slice(-4));
            const clientName = inv.client || 'Client Enterprise';
            const projectRef = inv.projectRef || inv.contractRef || 'PRJ-2026-GEN';
            const milestoneLabel = inv.milestoneLabel || inv.scope || 'Project Milestone IPC';
            const taxTypeStr = inv.taxType || 'Sales Tax';

            const jvLines = [
                {
                    accountCode: '1200',
                    accountName: 'Accounts Receivable (Trade Debtors)',
                    debitPkr: totalReceivable,
                    creditPkr: 0,
                    memo: `Receivable from ${clientName} against ${invoiceNo}`
                },
                {
                    accountCode: '4100',
                    accountName: 'HVAC & MEP Turnkey Contracting Revenue',
                    debitPkr: 0,
                    creditPkr: gross,
                    memo: `${milestoneLabel} Revenue Recognition`
                },
                {
                    accountCode: '2200',
                    accountName: 'Output Sales Tax & WHT Payable',
                    debitPkr: 0,
                    creditPkr: salesTax,
                    memo: `Output ${taxTypeStr} on ${invoiceNo}`
                }
            ];

            const totalDebit = totalReceivable;
            const totalCredit = gross + salesTax;

            if (totalDebit !== totalCredit) {
                return { success: false, message: `Double-entry posting imbalance: Dr (${totalDebit}) != Cr (${totalCredit})` };
            }

            const newJv = {
                id: 'jv-' + Date.now(),
                voucherNo: 'JV-2026-0' + (state.journalEntries.length + 904),
                voucherDate: inv.date || new Date().toISOString().split('T')[0],
                periodId: 'fp-2026-09',
                reference: `${invoiceNo} (${clientName} - ${milestoneLabel})`,
                narration: `Being recognition of ${milestoneLabel} under contract ${projectRef}. Gross: PKR ${gross.toLocaleString()}, Sales Tax (${taxTypeStr}): PKR ${salesTax.toLocaleString()}, Total Dr 1200 AR: PKR ${totalReceivable.toLocaleString()}.`,
                status: 'Posted',
                postedBy: 'finance@cosmixengineering.com',
                postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                lines: jvLines,
                totalDebitPkr: totalDebit,
                totalCreditPkr: totalCredit
            };

            state.journalEntries.unshift(newJv);

            // Update COA balances
            const arAcc = state.chartOfAccounts.find(a => a.code === '1200');
            if (arAcc) arAcc.balancePkr += totalReceivable;

            const revAcc = state.chartOfAccounts.find(a => a.code === '4100');
            if (revAcc) revAcc.balancePkr += gross;

            const taxAcc = state.chartOfAccounts.find(a => a.code === '2200');
            if (taxAcc) taxAcc.balancePkr += salesTax;

            // Update AR Aging Buckets (0-30 days current)
            let existingAr = state.arAging.find(a => a.clientName.toLowerCase().includes(clientName.toLowerCase()) || (a.projectRef && projectRef && a.projectRef.toLowerCase() === projectRef.toLowerCase()));
            if (existingAr) {
                existingAr.totalPkr += netPayable;
                existingAr.days0_30 += netPayable;
                existingAr.status = 'Current';
            } else {
                state.arAging.unshift({
                    clientName: clientName,
                    projectRef: projectRef,
                    totalPkr: netPayable,
                    days0_30: netPayable,
                    days31_60: 0,
                    days61_90: 0,
                    days91_120: 0,
                    daysOver120: 0,
                    status: 'Current'
                });
            }

            // Update contract milestone status if tracked
            if (inv.projectKey && state.projectContracts[inv.projectKey] && inv.milestoneKey) {
                const prj = state.projectContracts[inv.projectKey];
                if (prj.milestones[inv.milestoneKey]) {
                    prj.milestones[inv.milestoneKey].status = 'Billed';
                    prj.milestones[inv.milestoneKey].invRef = invoiceNo;
                }
            }

            saveState(state);
            return {
                success: true,
                jv: newJv,
                totalDebit: totalDebit,
                totalCredit: totalCredit,
                message: `Journal Entry ${newJv.voucherNo} posted to GL (Dr 1200 AR PKR ${totalReceivable.toLocaleString()}, Cr 4100 Rev PKR ${gross.toLocaleString()}, Cr 2200 Tax PKR ${salesTax.toLocaleString()}) and AR Aging updated.`
            };
        },

        /**
         * Settle Invoice Payment: Dr 1100 Bank, Cr 1200 AR, and deduct from AR aging
         */
        settleInvoicePayment: (invoiceNo, clientName, amountPkr, bankAccName) => {
            const amt = Math.round(Number(amountPkr) || 0);
            if (amt <= 0) return { success: false, message: 'Invalid settlement amount.' };

            const jvLines = [
                {
                    accountCode: '1100',
                    accountName: 'Cash & Bank Accounts (Meezan / HBL Current)',
                    debitPkr: amt,
                    creditPkr: 0,
                    memo: `Direct bank remittance for ${invoiceNo} (${bankAccName || 'Meezan Bank'})`
                },
                {
                    accountCode: '1200',
                    accountName: 'Accounts Receivable (Trade Debtors)',
                    debitPkr: 0,
                    creditPkr: amt,
                    memo: `Settlement of outstanding receivable ${invoiceNo}`
                }
            ];

            const newJv = {
                id: 'jv-' + Date.now(),
                voucherNo: 'JV-2026-0' + (state.journalEntries.length + 904),
                voucherDate: new Date().toISOString().split('T')[0],
                periodId: 'fp-2026-09',
                reference: `RCPT-${invoiceNo}`,
                narration: `Being settlement of client invoice ${invoiceNo} from ${clientName} into ${bankAccName || 'Meezan Bank Corporate A/C'}.`,
                status: 'Posted',
                postedBy: 'finance@cosmixengineering.com',
                postedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                lines: jvLines,
                totalDebitPkr: amt,
                totalCreditPkr: amt
            };

            state.journalEntries.unshift(newJv);

            // Update COA
            const bankAcc = state.chartOfAccounts.find(a => a.code === '1100');
            if (bankAcc) bankAcc.balancePkr += amt;

            const arAcc = state.chartOfAccounts.find(a => a.code === '1200');
            if (arAcc) arAcc.balancePkr = Math.max(0, arAcc.balancePkr - amt);

            // Deduct from AR Aging
            const arRecord = state.arAging.find(a => a.clientName.toLowerCase().includes(clientName.toLowerCase()));
            if (arRecord) {
                arRecord.totalPkr = Math.max(0, arRecord.totalPkr - amt);
                if (arRecord.days0_30 >= amt) {
                    arRecord.days0_30 -= amt;
                } else {
                    let rem = amt - arRecord.days0_30;
                    arRecord.days0_30 = 0;
                    if (arRecord.days31_60 >= rem) {
                        arRecord.days31_60 -= rem;
                    } else {
                        rem -= arRecord.days31_60;
                        arRecord.days31_60 = 0;
                        arRecord.days61_90 = Math.max(0, arRecord.days61_90 - rem);
                    }
                }
            }

            saveState(state);
            return {
                success: true,
                jv: newJv,
                message: `Payment receipt voucher ${newJv.voucherNo} posted (Dr 1100 Bank / Cr 1200 AR: PKR ${amt.toLocaleString()}). AR ledger updated.`
            };
        },

        togglePeriodLock: (periodId, targetStatus) => {
            const period = state.fiscalPeriods.find(p => p.id === periodId);
            if (period) {
                period.status = targetStatus;
                if (targetStatus === 'Closed') {
                    period.closedBy = 'cfo@cosmixengineering.com';
                    period.closedAt = new Date().toISOString().replace('T', ' ').substring(0, 10);
                } else {
                    period.closedBy = null;
                    period.closedAt = null;
                }
                saveState(state);
                return period;
            }
            return null;
        },

        resetToDefaults: () => {
            state = JSON.parse(JSON.stringify(defaultState));
            saveState(state);
        }
    };
})();

if (typeof window !== 'undefined') {
    window.CosmixFinance = CosmixFinance;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CosmixFinance;
}


