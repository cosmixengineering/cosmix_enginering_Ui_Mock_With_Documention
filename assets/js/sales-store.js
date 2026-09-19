(function () {
    const STORAGE_KEY = 'cosmix_sales_mock_v2';

    const clone = value => JSON.parse(JSON.stringify(value));
    const today = '2026-09-17';

    const demoState = {
        meta: { version: 2, updatedAt: today, demo: true },
        inquiries: [
            { id: 'INQ-2609-014', client: 'Indus Motor Company', project: 'Admin Building HVAC', city: 'Karachi', source: 'Tender', type: 'VRF', owner: 'GM Sales', engineer: 'Application Team', due: '2026-09-24', stage: 'Commercial Review', priority: 'High', followUp: 'Costing review today', value: 22777260 },
            { id: 'INQ-2609-015', client: 'Grand Monarch Residency', project: 'Apartment VRF Packages', city: 'Karachi', source: 'Referral', type: 'VRF', owner: 'GM Sales', engineer: 'Zeeshan', due: '2026-09-30', stage: 'Quotation Submitted', priority: 'High', followUp: 'Client call · 18 Sep', value: 14041500 },
            { id: 'INQ-2609-016', client: 'Pak Pharma Ltd', project: 'Production Block Ventilation', city: 'Karachi', source: 'Website', type: 'Ventilation / Fans', owner: 'Sales Engineer', engineer: 'Application Team', due: '2026-09-27', stage: 'Rate Collection', priority: 'Medium', followUp: '2 vendor responses due', value: 0 },
            { id: 'INQ-2609-017', client: 'DHA City', project: 'Community Centre MEP', city: 'Karachi', source: 'Direct', type: 'Mixed HVAC', owner: 'GM Sales', engineer: 'Application Team', due: '2026-10-05', stage: 'Awaiting Drawings', priority: 'Medium', followUp: 'Drawing reminder sent', value: 0 },
            { id: 'TND-2604-006', client: 'Corporate Office Group', project: 'Head Office VRF Tender', city: 'Lahore', source: 'Tender', type: 'VRF', owner: 'GM Sales', engineer: 'Application Team', due: '2026-04-18', stage: 'Revalidation Required', priority: 'Critical', followUp: 'Accepted after 5 months', value: 12840000 },
            { id: 'INQ-2609-018', client: 'Lucky Textile Mills', project: 'Warehouse Exhaust System', city: 'Nooriabad', source: 'Existing Client', type: 'Ventilation / Fans', owner: 'Sales Engineer', engineer: 'Application Team', due: '2026-10-02', stage: 'New', priority: 'Low', followUp: 'Qualification pending', value: 0 }
        ],
        selections: [
            { id: 'SEL-2609-014-R1', inquiry: 'INQ-2609-014', client: 'Indus Motor Company', project: 'Admin Building HVAC', file: 'INDUS MOTOR, ADMIN BUILDING--- (1).xlsx', imported: '2026-09-17', importedBy: 'Sales Engineer', systems: 13, pieces: 127, images: 43, issues: 1, affectedQuantity: 4, status: 'Needs Validation', boq: 'Draft BOQ linked', decisions: [], validation: null },
            { id: 'SEL-2609-015-R2', inquiry: 'INQ-2609-015', client: 'Grand Monarch Residency', project: 'Apartment VRF Packages', file: 'Grand_Monarch_AUX_Selection_R2.xlsx', imported: '2026-09-14', importedBy: 'Zeeshan', systems: 7, pieces: 68, images: 21, issues: 0, affectedQuantity: 0, status: 'Validated', boq: 'BOQ created', decisions: [], validation: { by: 'Sales Engineer', at: '2026-09-14T11:00:00.000Z', note: 'Technical selection reviewed.' } }
        ],
        substitutions: [
            { id: 'SUB-2609-001', from: 'ARVCA-H45/NR1DYBA', fromQty: 1, to: 'ARVCA-H45/NR3DQB', toQty: 1, reason: 'Commercial model consolidation', status: 'Management Approved' },
            { id: 'SUB-2609-002', from: 'ARVMD-H112/NR1DM', fromQty: 1, to: 'ARVMD-H112/4R1M', toQty: 1, reason: 'Commercial model consolidation', status: 'Management Approved' },
            { id: 'SUB-2609-003', from: 'ARVWM-H015/NR1DJA', fromQty: 2, to: 'ARVWM-H022/NR1DJA', toQty: 2, reason: 'Combined with H022 line', status: 'Management Approved' }
        ],
        costing: {
            inquiry: 'INQ-2609-014', revision: 'BOQ-2609-014-R1', status: 'Management Review Pending', fxRate: 279.50,
            lines: [
                { id: 1, section: 'Outdoor Unit', model: 'ARV-H160/NR1A', description: 'MINI 50/60Hz · 4.6 TR', qty: 2, unit: 'pc', currency: 'PKR', sourceRate: 726000, pkrRate: 726000, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 2, section: 'Outdoor Unit', model: 'ARV-H180/SR1DCS7A', description: 'MINI 50/60Hz · 5.1 TR', qty: 3, unit: 'pc', currency: 'PKR', sourceRate: 897600, pkrRate: 897600, stock: 1, reserved: 0, source: 'Rate Book' },
                { id: 3, section: 'Outdoor Unit', model: 'ARV-H224/SR1DCMA', description: 'Modular Mini VRF · 6.4 TR', qty: 4, unit: 'pc', currency: 'PKR', sourceRate: 1221000, pkrRate: 1221000, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 4, section: 'Outdoor Unit', model: 'ARV-H252/SR1DCMA', description: 'Modular Mini VRF · 7.2 TR', qty: 4, unit: 'pc', currency: 'PKR', sourceRate: 1267200, pkrRate: 1267200, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 5, section: 'Indoor Unit', model: 'ARVCA-H45/NR3DQB', description: 'Q-series DC cassette · 1.3 TR', qty: 2, unit: 'pc', currency: 'PKR', baseUnitRate: 174900, accessory: 'Cassette grille', accessoryUnitRate: 33000, sourceRate: 207900, pkrRate: 207900, stock: 4, reserved: 1, source: 'Rate Book' },
                { id: 6, section: 'Indoor Unit', model: 'ARVCA-H71/NR3DQB', description: 'Q-series DC cassette · 2.0 TR', qty: 2, unit: 'pc', currency: 'PKR', baseUnitRate: 190740, accessory: 'Cassette grille', accessoryUnitRate: 33000, sourceRate: 223740, pkrRate: 223740, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 7, section: 'Indoor Unit', model: 'ARVMD-H71/4R1M', description: 'Medium ESP Duct · 2.0 TR', qty: 1, unit: 'pc', currency: 'PKR', sourceRate: 181500, pkrRate: 181500, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 8, section: 'Indoor Unit', model: 'ARVMD-H80/4R1M', description: 'Medium ESP Duct · 2.3 TR', qty: 5, unit: 'pc', currency: 'PKR', sourceRate: 188100, pkrRate: 188100, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 9, section: 'Indoor Unit', model: 'ARVMD-H90/4R1M', description: 'Medium ESP Duct · 2.6 TR', qty: 2, unit: 'pc', currency: 'PKR', sourceRate: 197340, pkrRate: 197340, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 10, section: 'Indoor Unit', model: 'ARVMD-H100/4R1M', description: 'Medium ESP Duct · 2.8 TR', qty: 6, unit: 'pc', currency: 'PKR', sourceRate: 207900, pkrRate: 207900, stock: 2, reserved: 0, source: 'Rate Book' },
                { id: 11, section: 'Indoor Unit', model: 'ARVMD-H112/4R1M', description: 'Medium ESP Duct · 3.2 TR', qty: 4, unit: 'pc', currency: 'PKR', sourceRate: 231000, pkrRate: 231000, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 12, section: 'Indoor Unit', model: 'ARVMD-H125/4R1M', description: 'Medium ESP Duct · 3.6 TR', qty: 2, unit: 'pc', currency: 'PKR', sourceRate: 237600, pkrRate: 237600, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 13, section: 'Indoor Unit', model: 'ARVMD-H140/4R1M', description: 'Medium ESP Duct · 4.0 TR', qty: 1, unit: 'pc', currency: 'PKR', sourceRate: 245520, pkrRate: 245520, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 14, section: 'Indoor Unit', model: 'ARVMD-H150/NR1DM', description: 'Medium ESP Duct · 4.3 TR', qty: 1, unit: 'pc', currency: 'PKR', sourceRate: 279840, pkrRate: 279840, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 15, section: 'Indoor Unit', model: 'ARVMD-H160/NR1DM', description: 'Medium ESP Duct · 4.6 TR', qty: 1, unit: 'pc', currency: 'PKR', sourceRate: 298980, pkrRate: 298980, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 16, section: 'Indoor Unit', model: 'ARVWM-H080/NR1DCA', description: 'DC wall mounted · 2.3 TR', qty: 1, unit: 'pc', currency: 'PKR', sourceRate: 181500, pkrRate: 181500, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 17, section: 'Indoor Unit', model: 'ARVWM-H100/NR1DCA', description: 'DC wall mounted · 2.8 TR', qty: 1, unit: 'pc', currency: 'PKR', sourceRate: 195360, pkrRate: 195360, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 18, section: 'Indoor Unit', model: 'ARVWM-H022/NR1DJA', description: 'Common-DC wall mounted · 0.6 TR', qty: 4, unit: 'pc', currency: 'PKR', sourceRate: 112200, pkrRate: 112200, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 19, section: 'Indoor Unit', model: 'ARVWM-H028/NR1DJA', description: 'Common-DC wall mounted · 0.8 TR', qty: 3, unit: 'pc', currency: 'PKR', sourceRate: 115500, pkrRate: 115500, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 20, section: 'Indoor Unit', model: 'ARVWM-H036/NR1DJA', description: 'Common-DC wall mounted · 1.0 TR', qty: 1, unit: 'pc', currency: 'PKR', sourceRate: 118800, pkrRate: 118800, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 21, section: 'Indoor Unit', model: 'ARVWM-H045/NR1DJA', description: 'Common-DC wall mounted · 1.3 TR', qty: 2, unit: 'pc', currency: 'PKR', sourceRate: 132000, pkrRate: 132000, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 22, section: 'Indoor Unit', model: 'ARVWM-H056/NR1DJA', description: 'Common-DC wall mounted · 1.6 TR', qty: 1, unit: 'pc', currency: 'PKR', sourceRate: 135300, pkrRate: 135300, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 23, section: 'Indoor Unit', model: 'ARVWM-H071/NR1DJA', description: 'Common-DC wall mounted · 2.0 TR', qty: 1, unit: 'pc', currency: 'PKR', sourceRate: 145200, pkrRate: 145200, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 24, section: 'Branch Joint', model: 'AFG-00B', description: 'Branch joint', qty: 8, unit: 'pc', currency: 'PKR', sourceRate: 9900, pkrRate: 9900, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 25, section: 'Branch Joint', model: 'AFG-12B', description: 'Branch joint', qty: 20, unit: 'pc', currency: 'PKR', sourceRate: 13200, pkrRate: 13200, stock: 0, reserved: 0, source: 'Rate Book' },
                { id: 26, section: 'Controller', model: 'XK-05A', description: 'Wired controller', qty: 23, unit: 'pc', currency: 'PKR', sourceRate: 23100, pkrRate: 23100, stock: 12, reserved: 2, source: 'Rate Book' },
                { id: 27, section: 'Controller', model: 'YK-H', description: 'Remote controller', qty: 18, unit: 'pc', currency: 'PKR', sourceRate: 6600, pkrRate: 6600, stock: 30, reserved: 4, source: 'Rate Book' },
                { id: 28, section: 'Accessory', model: 'MB13-I / MB10', description: 'Air-flow panels · commercial decision pending', qty: 4, unit: 'pc', currency: 'PKR', sourceRate: 0, pkrRate: 0, stock: 0, reserved: 0, source: 'Rate required' }
            ],
            sourceTotal: 22777260,
            components: [
                { id: 'CMP-001', name: 'Freight / Logistics', mode: 'Fixed', value: 180000, base: 'Whole quotation', amount: 180000, status: 'Entered', note: 'Demonstration amount; procedure varies by deal' },
                { id: 'CMP-002', name: 'Installation Labour', mode: 'Entered amount', value: 1150000, base: 'Project scope', amount: 1150000, status: 'Entered', note: 'Demonstration amount' },
                { id: 'CMP-003', name: 'Overhead', mode: 'Percent', value: 2.5, base: 'Reference cost', amount: 569432, status: 'Entered', note: 'Example only; not confirmed company rule' },
                { id: 'CMP-004', name: 'Profit / Markup', mode: 'Percent', value: 12, base: 'Approved internal cost', amount: 2961203, status: 'Management Review', note: 'Management decides final value' },
                { id: 'CMP-005', name: 'Management Discount', mode: 'Entered amount', value: 350000, base: 'Gross selling price', amount: -350000, status: 'Management Review', note: 'Proposed discount awaiting management decision' }
            ],
            approvedSnapshots: []
        },
        rateBook: {
            edition: 'Rate Book · demonstration register',
            status: 'Reference control proposed for review',
            prices: [
                { code: 'RB-AUX-001', model: 'ARV-H160/NR1A', category: 'Outdoor Unit', currency: 'PKR', amount: 726000, pkrAmount: 726000, source: 'Printed rate book', effective: '2026-09-01', review: 'Current demo' },
                { code: 'RB-AUX-002', model: 'ARV-H224/SR1DCMA', category: 'Outdoor Unit', currency: 'USD', amount: 4368.52, pkrAmount: 1221000, source: 'Printed rate book + FX', effective: '2026-09-01', review: 'Current demo' },
                { code: 'RB-AUX-003', model: 'ARVCA-H45/NR3DQB', category: 'Indoor Unit', currency: 'PKR', amount: 207900, pkrAmount: 207900, source: 'Base 174,900 + grille 33,000', effective: '2026-09-01', review: 'Confirmed breakdown' },
                { code: 'RB-AUX-004', model: 'XK-05A', category: 'Controller', currency: 'PKR', amount: 23100, pkrAmount: 23100, source: 'Printed rate book', effective: '2026-09-01', review: 'Current demo' }
            ],
            fxSnapshots: [
                { id: 'FX-2609-01', pair: 'USD → PKR', rate: 279.50, effective: '2026-09-17', enteredBy: 'Sales Desk', approvedBy: 'Management', status: 'Approved demo snapshot' }
            ],
            clauses: [
                { id: 'CL-01', title: 'Quotation validity', text: 'Validity must be entered per quotation and revalidated after expiry.', status: 'Controlled template' },
                { id: 'CL-02', title: 'Tax / duty', text: 'Record inclusion or exclusion per deal; no universal formula is confirmed.', status: 'Needs deal input' },
                { id: 'CL-03', title: 'Exchange variation', text: 'Foreign-currency exposure uses the approved quotation FX snapshot.', status: 'Controlled template' },
                { id: 'CL-04', title: 'Delivery and payment', text: 'Enter client-specific delivery and payment terms before management approval.', status: 'Needs deal input' }
            ]
        },
        productCatalog: [],
        catalogImports: [
            { id: 'IMP-2609-001', file: 'Rate_Book_Reference.xlsx', importedAt: '2026-09-17T08:30:00.000Z', importedBy: 'Sales Engineer', rows: 28, added: 28, updated: 0, status: 'Imported sample' }
        ],
        manualQuotation: {
            layoutVersion: 3, id: 'MQ-2609-001', status: 'Draft', client: 'Walk-in / Direct Client', project: 'HVAC Equipment Quotation', attention: '',
            date: '2026-09-17', validUntil: '2026-10-02', currency: 'PKR', notes: 'Prices and linked accessories require commercial review before issue.',
            discount: 0, freight: 0, tax: 0, lines: [], updatedAt: '2026-09-17T00:00:00.000Z'
        },
        selectionPricing: null,
        approvalInbox: [
            {
                id: 'APR-2609-024', type: 'Final Quotation', sourceRef: 'QTN-2609-019/R1', quoteRef: 'QTN-2609-019::R1', client: 'Indus Motor Company', project: 'Admin Building HVAC',
                submittedBy: 'GM Sales', submittedAt: '2026-09-17T15:20:00.000Z', requested: 'Final selling price, discount and dispatch clearance', proposedValue: 27287895,
                status: 'Decision Received', decision: 'Approved with revised final offer', decisionBy: 'Director', decisionAt: '2026-09-18T09:10:00.000Z',
                adjustmentType: 'Discount', adjustmentAmount: 337895, approvedValue: 26950000, validityDays: 15,
                comment: 'Issue the final quotation at Rs. 26,950,000. Keep validity at 15 days and do not dispatch before Sales acknowledgement.',
                unread: true, acknowledgedAt: '', appliedAt: '', appliedRef: ''
            },
            {
                id: 'APR-2609-023', type: 'Commercial BOQ', sourceRef: 'BOQ-2609-014-R1', quoteRef: 'QTN-2609-019::R1', client: 'Indus Motor Company', project: 'Admin Building HVAC',
                submittedBy: 'Sales Engineer', submittedAt: '2026-09-18T08:40:00.000Z', requested: 'Profit, discount and final selling price', proposedValue: 27287895,
                status: 'Awaiting Management', decision: '', decisionBy: 'Director / Administrator', decisionAt: '', adjustmentType: '', adjustmentAmount: 0, approvedValue: 0, validityDays: 0,
                comment: 'Commercial review requested from management.', unread: false, acknowledgedAt: '', appliedAt: '', appliedRef: ''
            },
            {
                id: 'APR-2609-022', type: 'Tender Revalidation', sourceRef: 'QTN-2604-006/R1', quoteRef: 'QTN-2604-006::R1', client: 'Corporate Office Group', project: 'Head Office VRF Tender',
                submittedBy: 'GM Sales', submittedAt: '2026-09-17T13:15:00.000Z', requested: 'Five-month price variance and revised offer direction', proposedValue: 12840000,
                status: 'Revision Required', decision: 'Increase quotation after market revalidation', decisionBy: 'Administrator', decisionAt: '2026-09-18T08:25:00.000Z',
                adjustmentType: 'Increase', adjustmentAmount: 1330000, approvedValue: 14170000, validityDays: 10,
                comment: 'Create a new controlled revision at Rs. 14,170,000. Keep the original submitted revision unchanged.',
                unread: true, acknowledgedAt: '', appliedAt: '', appliedRef: ''
            },
            {
                id: 'APR-2609-021', type: 'Model Substitution', sourceRef: 'SUB-2609-003', quoteRef: '', client: 'Indus Motor Company', project: 'Admin Building HVAC',
                submittedBy: 'Application Team', submittedAt: '2026-09-17T08:55:00.000Z', requested: 'Approve H015 consolidation into H022 line', proposedValue: 0,
                status: 'Applied', decision: 'Substitution approved', decisionBy: 'Director', decisionAt: '2026-09-17T09:40:00.000Z', adjustmentType: 'No price change', adjustmentAmount: 0, approvedValue: 0, validityDays: 0,
                comment: 'Use ARVWM-H022/NR1DJA × 2 and retain the original AUX model in the audit trail.',
                unread: false, acknowledgedAt: '2026-09-17T10:05:00.000Z', appliedAt: '2026-09-17T10:06:00.000Z', appliedRef: 'SUB-2609-003'
            }
        ],
        tenderDocuments: {
            templates: [
                { id: 'TPL-TND-001', name: 'Standard HVAC Tender', revision: 'R4', pages: 18, editableFields: 9, status: 'Active' },
                { id: 'TPL-TND-002', name: 'Government Tender Submission', revision: 'R2', pages: 24, editableFields: 12, status: 'Active' },
                { id: 'TPL-TND-003', name: 'Private Commercial Proposal', revision: 'R3', pages: 14, editableFields: 8, status: 'Active' }
            ],
            workspace: {
                id: 'TDP-2609-014', inquiry: 'INQ-2609-014', templateId: 'TPL-TND-001', status: 'Draft package',
                client: 'Indus Motor Company', project: 'Admin Building HVAC', updatedAt: '2026-09-18T11:20:00.000Z',
                fields: [
                    { id: 'client', label: 'Client / organization', value: 'Indus Motor Company', required: true },
                    { id: 'project', label: 'Project / site', value: 'Admin Building HVAC', required: true },
                    { id: 'tenderNo', label: 'Tender reference', value: 'IMC/ADMIN/HVAC/2026-09', required: true },
                    { id: 'submissionDate', label: 'Submission date', value: '2026-09-24', type: 'date', required: true },
                    { id: 'validityDays', label: 'Offer validity (days)', value: '15', type: 'number', required: true },
                    { id: 'attention', label: 'Attention', value: 'Tender Committee', required: true },
                    { id: 'delivery', label: 'Delivery period', value: '12–14 weeks after confirmed order', required: true },
                    { id: 'payment', label: 'Payment terms', value: 'As agreed in approved commercial quotation', required: true },
                    { id: 'bidSecurity', label: 'Bid security', value: 'As stated in tender instructions', required: false },
                    { id: 'contact', label: 'Sales contact', value: 'Sales Desk · Cosmix Engineering', required: true },
                    { id: 'coverNote', label: 'Cover note', value: 'We submit our HVAC technical and commercial proposal for the above project.', multiline: true, required: false }
                ],
                sections: [
                    { id: 'SEC-01', name: 'Company introduction', pages: '1–2', mode: 'Locked template', source: 'Template R4' },
                    { id: 'SEC-02', name: 'Tender particulars & cover letter', pages: '3–4', mode: 'Editable fields', source: 'Tender workspace' },
                    { id: 'SEC-03', name: 'Scope of supply', pages: '5–6', mode: 'Locked template', source: 'Template R4' },
                    { id: 'SEC-04', name: 'Commercial quotation', pages: '7–9', mode: 'Linked record', source: 'QTN-2609-019/R1' },
                    { id: 'SEC-05', name: 'Terms, validity & delivery', pages: '10–11', mode: 'Editable fields', source: 'Tender workspace' },
                    { id: 'SEC-06', name: 'Technical compliance & annexures', pages: '12–18', mode: 'Locked template', source: 'Template R4' }
                ],
                documents: [
                    { id: 'DOC-001', name: 'Generated Tender Cover.pdf', kind: 'Generated tender', sizeMB: 0.8, source: 'Template R4', locked: true, status: 'Ready' },
                    { id: 'DOC-002', name: 'QTN-2609-019-R1.pdf', kind: 'Commercial quotation', sizeMB: 1.5, source: 'Approved quotation', locked: true, status: 'Ready' },
                    { id: 'DOC-003', name: 'Client Tender Instructions.pdf', kind: 'Client document', sizeMB: 12.6, source: 'Demonstration record', locked: false, status: 'Demo placeholder' },
                    { id: 'DOC-004', name: 'AUX Technical Datasheets.pdf', kind: 'Technical annexure', sizeMB: 84.3, source: 'Demonstration record', locked: false, status: 'Demo placeholder' },
                    { id: 'DOC-005', name: 'HVAC Drawings and Schematics.pdf', kind: 'Drawings', sizeMB: 126.8, source: 'Demonstration record', locked: false, status: 'Demo placeholder' },
                    { id: 'DOC-006', name: 'Company Profile and Certificates.pdf', kind: 'Company annexure', sizeMB: 44.2, source: 'Demonstration record', locked: false, status: 'Demo placeholder' }
                ],
                compression: { profile: 'Balanced', imageDpi: 150, imageQuality: 78, preserveOriginal: true, removeMetadata: true },
                builds: [
                    { id: 'PKG-2609-013-R1', file: 'IMC-Admin-HVAC-Tender-R1.pdf', createdAt: '2026-09-17T16:40:00.000Z', createdBy: 'Sales Desk', sourceSizeMB: 270.2, outputSizeMB: 96.4, profile: 'Balanced', documents: 6, status: 'Package record' }
                ]
            }
        },
        rates: [
            { id: 'VRQ-2609-007', inquiry: 'INQ-2609-016', item: 'Refrigerant copper piping', spec: 'ASTM B280 · assorted sizes', qty: 850, unit: 'm', vendor: 'CoolTech Traders', requested: '2026-09-12', responded: '2026-09-15', currency: 'PKR', rate: 4850, tax: 'Exclusive', freight: 'Included', lead: '7 days', validUntil: '2026-09-22', status: 'Selected', evidence: 'Vendor quotation attached' },
            { id: 'VRQ-2609-008', inquiry: 'INQ-2609-016', item: 'Installation cable', spec: '4 core industrial cable', qty: 1200, unit: 'm', vendor: 'Pak Cable House', requested: '2026-09-13', responded: '2026-09-16', currency: 'PKR', rate: 620, tax: 'Exclusive', freight: 'Separate', lead: 'Available', validUntil: '2026-09-26', status: 'Response Received', evidence: 'WhatsApp rate evidence' },
            { id: 'VRQ-2609-009', inquiry: 'INQ-2609-014', item: 'Air-flow panel', spec: 'MB13-I / MB10', qty: 4, unit: 'pc', vendor: 'HVAC Link', requested: '2026-09-14', responded: '', currency: 'PKR', rate: 0, tax: 'Pending', freight: 'Pending', lead: 'Pending', validUntil: '', status: 'Sent', evidence: 'Awaiting response' },
            { id: 'VRQ-2609-010', inquiry: 'TND-2604-006', item: 'VRF equipment package', spec: 'Tender revalidation', qty: 1, unit: 'lot', vendor: 'Authorized Distributor', requested: '2026-09-15', responded: '2026-09-17', currency: 'USD', rate: 42380, tax: 'Exclusive', freight: 'Separate', lead: '14–16 weeks', validUntil: '2026-09-24', status: 'Response Received', evidence: 'Revalidation evidence' }
        ],
        salesSetup: {
            categories: [
                { id: 'CAT-001', name: 'HVAC Equipment', status: 'Active' },
                { id: 'CAT-002', name: 'Ventilation & Fans', status: 'Active' },
                { id: 'CAT-003', name: 'Pipes & Fittings', status: 'Active' },
                { id: 'CAT-004', name: 'Electrical Cable', status: 'Active' },
                { id: 'CAT-005', name: 'Controls & Accessories', status: 'Active' }
            ],
            units: [
                { id: 'UOM-001', name: 'Piece', symbol: 'pc', status: 'Active' },
                { id: 'UOM-002', name: 'Metre', symbol: 'm', status: 'Active' },
                { id: 'UOM-003', name: 'Kilogram', symbol: 'kg', status: 'Active' },
                { id: 'UOM-004', name: 'Lot', symbol: 'lot', status: 'Active' },
                { id: 'UOM-005', name: 'Set', symbol: 'set', status: 'Active' }
            ],
            vendors: [
                { id: 'VEN-001', name: 'CoolTech Traders', contactPerson: 'Sales Desk', phone: '021-0000001', city: 'Karachi', categories: ['Pipes & Fittings'], status: 'Active' },
                { id: 'VEN-002', name: 'Pak Cable House', contactPerson: 'Commercial Desk', phone: '021-0000002', city: 'Karachi', categories: ['Electrical Cable'], status: 'Active' },
                { id: 'VEN-003', name: 'HVAC Link', contactPerson: 'Rate Desk', phone: '021-0000003', city: 'Karachi', categories: ['Controls & Accessories'], status: 'Active' },
                { id: 'VEN-004', name: 'Authorized Distributor', contactPerson: 'Projects Desk', phone: '021-0000004', city: 'Karachi', categories: ['HVAC Equipment'], status: 'Active' }
            ]
        },
        quotations: [
            { id: 'QTN-2609-018', rev: 'R2', inquiry: 'INQ-2609-015', client: 'Grand Monarch Residency', project: 'Apartment VRF Packages', value: 14041500, submitted: '2026-09-15', validUntil: '2026-09-30', status: 'Follow-up', approver: 'Director / Administrator', lastFollowUp: '2026-09-17', nextAction: 'Client technical meeting', dispatch: 'Email + WhatsApp', acceptedBaseline: false },
            { id: 'QTN-2609-019', rev: 'R1', inquiry: 'INQ-2609-014', client: 'Indus Motor Company', project: 'Admin Building HVAC', value: 27287895, submitted: '', validUntil: '', status: 'Approval Pending', approver: 'Director / Administrator', lastFollowUp: '', nextAction: 'Management commercial approval', dispatch: 'Not sent', acceptedBaseline: false },
            { id: 'QTN-2604-006', rev: 'R1', inquiry: 'TND-2604-006', client: 'Corporate Office Group', project: 'Head Office VRF Tender', value: 12840000, revalidatedValue: 14170000, submitted: '2026-04-18', validUntil: '2026-05-03', status: 'Commercial Revalidation Required', approver: 'Director / Administrator', lastFollowUp: '2026-09-17', nextAction: 'Review +Rs. 1,330,000 variance', dispatch: 'Tender portal', acceptedBaseline: false },
            { id: 'QTN-2608-011', rev: 'R3', inquiry: 'INQ-2608-009', client: 'Lucky Cement', project: 'Plant Ventilation Upgrade', value: 9650000, submitted: '2026-08-20', validUntil: '2026-09-19', status: 'Accepted Within Validity', approver: 'Director / Administrator', lastFollowUp: '2026-09-16', nextAction: 'Prepare handoff pack', dispatch: 'Email', acceptedBaseline: true }
        ],
        acceptedBaselines: [
            { id: 'ABL-2608-011-R3', quoteRef: 'QTN-2608-011::R3', acceptedAt: '2026-09-16T10:30:00.000Z', acceptedBy: 'Client representative', evidence: 'Client acceptance email · demonstration', value: 9650000, locked: true }
        ],
        activities: [
            { time: '09:40', icon: 'fa-check-circle', color: 'emerald', text: 'Management approved model consolidation SUB-2609-003.' },
            { time: '09:05', icon: 'fa-file-excel', color: 'cyan', text: 'AUX workbook SEL-2609-014-R1 uploaded for validation.' },
            { time: 'Yesterday', icon: 'fa-envelope', color: 'blue', text: 'QTN-2609-018/R2 sent by Email and WhatsApp.' },
            { time: 'Yesterday', icon: 'fa-triangle-exclamation', color: 'amber', text: 'Old tender QTN-2604-006 moved to commercial revalidation.' }
        ]
    };

    let storageAvailable = true;

    function normalizePersistedLabels(data) {
        const replaceLabel = value => typeof value === 'string'
            ? value
                .replace(/CEO Printed Rate Book/gi, 'Rate Book')
                .replace(/CEO[_ -]Rate[_ -]Book/gi, match => match.includes('_') ? 'Rate_Book' : 'Rate Book')
            : value;
        data.costing?.lines?.forEach(line => { line.source = replaceLabel(line.source); });
        data.productCatalog?.forEach(item => { item.source = replaceLabel(item.source); });
        data.catalogImports?.forEach(item => { item.file = replaceLabel(item.file); });
        if (data.rateBook) data.rateBook.edition = replaceLabel(data.rateBook.edition);
        if (data.manualQuotation?.project === 'Manual HVAC Quotation') data.manualQuotation.project = 'HVAC Equipment Quotation';
        data.costing?.components?.forEach(item => { if (item.mode === 'Manual') item.mode = 'Entered amount'; });
        data.substitutions?.forEach(item => { if (item.status === 'Boss Approved') item.status = 'Management Approved'; });
        if (data.costing?.status === 'Boss Approval Pending') data.costing.status = 'Management Review Pending';
        data.costing?.components?.forEach(item => {
            if (item.status === 'Boss Review') item.status = 'Management Review';
            if (item.name === 'Boss Discount') item.name = 'Management Discount';
            if (item.note === 'Boss decides final value') item.note = 'Management decides final value';
        });
        data.productCatalog?.forEach(item => {
            if (item.source === 'Manual entry') item.source = 'Direct entry';
            if (item.origin === 'Manual entry') item.origin = 'Direct entry';
        });
        data.rates?.forEach(item => {
            if (!item.rateDate) item.rateDate = item.responded || item.requested || today;
            if (!item.category) item.category = /cable/i.test(item.item) ? 'Electrical Cable' : /pipe|copper/i.test(item.item) ? 'Pipes & Fittings' : /panel|controller|accessor/i.test(item.item) ? 'Controls & Accessories' : /fan|ventilation/i.test(item.item) ? 'Ventilation & Fans' : 'HVAC Equipment';
            if (!item.revision) item.revision = 1;
            if (!Object.prototype.hasOwnProperty.call(item, 'parentRateId')) item.parentRateId = '';
        });
        return data;
    }

    function load() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed?.meta?.version === 2 && ['inquiries','selections','substitutions','rates','quotations','activities','acceptedBaselines'].every(k=>Array.isArray(parsed[k])) && Array.isArray(parsed.costing?.lines) && Array.isArray(parsed.costing?.components) && Array.isArray(parsed.costing?.approvedSnapshots) && Array.isArray(parsed.rateBook?.prices) && Array.isArray(parsed.rateBook?.fxSnapshots) && Array.isArray(parsed.rateBook?.clauses)) {
                    if (!parsed.manualQuotation || !Array.isArray(parsed.manualQuotation.lines) || parsed.manualQuotation.layoutVersion !== 3) parsed.manualQuotation = clone(demoState.manualQuotation);
                    if (!Object.prototype.hasOwnProperty.call(parsed, 'selectionPricing')) parsed.selectionPricing = null;
                    if (!Array.isArray(parsed.productCatalog)) parsed.productCatalog = [];
                    if (!Array.isArray(parsed.catalogImports)) parsed.catalogImports = clone(demoState.catalogImports);
                    if (!Array.isArray(parsed.approvalInbox)) parsed.approvalInbox = clone(demoState.approvalInbox);
                    if (!parsed.salesSetup || !Array.isArray(parsed.salesSetup.categories) || !Array.isArray(parsed.salesSetup.units) || !Array.isArray(parsed.salesSetup.vendors)) parsed.salesSetup = clone(demoState.salesSetup);
                    if (!parsed.tenderDocuments?.workspace || !Array.isArray(parsed.tenderDocuments.templates)) parsed.tenderDocuments = clone(demoState.tenderDocuments);
                    else {
                        const fields = parsed.tenderDocuments.workspace.fields || (parsed.tenderDocuments.workspace.fields = []);
                        const missingIdentityFields = demoState.tenderDocuments.workspace.fields.slice(0, 2).filter(seed => !fields.some(x => x.id === seed.id));
                        parsed.tenderDocuments.workspace.fields = missingIdentityFields.concat(fields);
                    }
                    normalizePersistedLabels(parsed);
                    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch (_) { storageAvailable = false; }
                    return parsed;
                }
            }
        } catch (_) { storageAvailable = false; }
        return normalizePersistedLabels(clone(demoState));
    }

    let state = load();

    function save() {
        state.meta.updatedAt = new Date().toISOString();
        try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { storageAvailable = false; }
    }

    function reset() {
        state = clone(demoState);
        save();
        return state;
    }

    function money(value) {
        return `Rs. ${Math.round(Number(value || 0)).toLocaleString('en-PK')}`;
    }

    function addInquiry(data) {
        const n = String(state.inquiries.length + 19).padStart(3, '0');
        state.inquiries.unshift({
            id: `INQ-2609-${n}`, client: data.client || 'New Client', project: data.project || 'New Project', city: data.city || 'Karachi',
            source: data.source || 'Direct', type: data.type || 'Mixed HVAC', owner: data.owner || 'GM Sales', engineer: data.engineer || 'Application Team',
            due: data.due || '2026-09-30', stage: 'New', priority: data.priority || 'Medium', followUp: 'Qualification pending', value: 0
        });
        save();
        return state.inquiries[0];
    }

    function updateInquiry(id, patch) {
        const row = state.inquiries.find(x => x.id === id);
        if (row) Object.assign(row, patch);
        save();
        return row;
    }

    function addSelection(fileName, inquiry) {
        const isIndusSample = /INDUS\s*MOTOR/i.test(fileName || '');
        const row = {
            id: `SEL-2609-${String(state.selections.length + 16).padStart(3, '0')}-R1`, inquiry: inquiry || state.inquiries[0].id,
            client: state.inquiries.find(x => x.id === inquiry)?.client || 'Imported Project', project: state.inquiries.find(x => x.id === inquiry)?.project || 'AUX Selection',
            file: fileName || 'AUX_Selection.xlsx', imported: today, importedBy: 'Sales Engineer',
            systems: isIndusSample ? 13 : 0, pieces: isIndusSample ? 127 : 0, images: isIndusSample ? 43 : 0,
            issues: isIndusSample ? 1 : 1, affectedQuantity: isIndusSample ? 4 : 0, status: isIndusSample ? 'Needs Validation' : 'Uploaded', boq: 'Not created', decisions: [], validation: null
        };
        state.selections.unshift(row); save(); return row;
    }

    function updateSelection(id, patch) {
        const row = state.selections.find(x => x.id === id);
        if (row) Object.assign(row, patch);
        save(); return row;
    }

    function recordSelectionDecision(id, decision, reason, details = {}) {
        const row = state.selections.find(x => x.id === id);
        if (!row) return null;
        row.decisions = row.decisions || [];
        row.decisions.push({ issue: 'Air-flow panels MB13-I × 1 and MB10 × 3', decision, reason, replacement: details.replacement || '', pkrRate: Number(details.pkrRate || 0), by: 'Management', at: new Date().toISOString() });
        const accessory = state.costing.lines.find(x => x.model === 'MB13-I / MB10');
        if (/Exclude/.test(decision)) {
            if (accessory) Object.assign(accessory, { excluded: true, source: 'Excluded by management decision' });
            row.issues = 0;
        } else if (Number(details.pkrRate || 0) > 0) {
            if (accessory) Object.assign(accessory, { excluded: false, model: /Replace/.test(decision) && details.replacement ? details.replacement : accessory.model, sourceRate: Number(details.pkrRate), pkrRate: Number(details.pkrRate), source: /Replace/.test(decision) ? 'Replacement approved by management' : 'Management-entered accessory rate' });
            row.issues = 0;
        } else {
            row.issues = 1;
        }
        save(); return row;
    }

    function validateSelection(id, note) {
        const row = state.selections.find(x => x.id === id);
        if (!row) return { ok: false, reason: 'Selection not found.' };
        if (Number(row.issues || 0) > 0) return { ok: false, reason: 'Open validation decision pehle resolve karein.' };
        row.status = 'Validated'; row.boq = 'BOQ ready';
        row.validation = { by: 'Sales Engineer', at: new Date().toISOString(), note: note || 'Technical selection reviewed.' };
        save(); return { ok: true, row };
    }

    function addComponent(component) {
        if (state.costing.status === 'Approved') return null;
        const row = Object.assign({ id: `CMP-${String(state.costing.components.length + 1).padStart(3, '0')}`, status: 'Entered', note: '' }, component);
        state.costing.components.push(row); save(); return row;
    }

    function updateCostLine(id, patch) {
        if (state.costing.status === 'Approved') return null;
        const row = state.costing.lines.find(x => x.id === Number(id));
        if (row) Object.assign(row, patch);
        state.costing.sourceTotal = state.costing.lines
            .filter(x => !x.excluded)
            .reduce((sum, line) => sum + (Number(line.qty || 0) * Number(line.pkrRate || 0)), 0);
        save(); return row;
    }

    function approveCosting(comment) {
        if (state.costing.status === 'Approved') return { ok: false, reason: 'This BOQ revision is already approved and locked.' };
        const unresolved = state.costing.lines.find(x => !x.excluded && Number(x.pkrRate || 0) <= 0);
        if (unresolved) return { ok: false, reason: `${unresolved.model} ka commercial rate/decision pending hai.` };
        state.costing.status = 'Approved';
        state.costing.components.forEach(x => { if (/Boss Review|Management Review/.test(x.status)) x.status = 'Management Approved'; });
        const quote = state.quotations.find(x => x.inquiry === state.costing.inquiry);
        if (quote) quote.status = 'Approved';
        state.costing.approvedSnapshots = state.costing.approvedSnapshots || [];
        state.costing.approvedSnapshots.unshift({
            id: `${state.costing.revision}-APP-${String(state.costing.approvedSnapshots.length + 1).padStart(2, '0')}`,
            approvedAt: new Date().toISOString(), approvedBy: 'Management', revision: state.costing.revision,
            fxRate: state.costing.fxRate, sourceTotal: state.costing.sourceTotal,
            inquiry: state.costing.inquiry, comment: comment || 'Commercial snapshot reviewed and approved.',
            lines: clone(state.costing.lines), components: clone(state.costing.components), substitutions: clone(state.substitutions)
        });
        save(); return { ok: true, snapshot: state.costing.approvedSnapshots[0] };
    }

    function submitApprovalRequest(data = {}) {
        state.approvalInbox = state.approvalInbox || [];
        const sourceRef = String(data.sourceRef || '').trim();
        if (!sourceRef) return { ok: false, reason: 'Source reference required hai.' };
        const existing = state.approvalInbox.find(x => x.sourceRef === sourceRef && x.status === 'Awaiting Management');
        if (existing) return { ok: true, existing: true, row: existing };
        const sequence = state.approvalInbox.reduce((max, x) => Math.max(max, Number(String(x.id).replace(/\D/g, '')) || 0), 0) + 1;
        const row = {
            id: `APR-2609-${String(sequence).slice(-3).padStart(3, '0')}`, type: data.type || 'Commercial Review', sourceRef,
            quoteRef: data.quoteRef || '', client: data.client || '', project: data.project || '', submittedBy: data.submittedBy || 'Sales Desk',
            submittedAt: new Date().toISOString(), requested: data.requested || 'Management decision required', proposedValue: Number(data.proposedValue || 0),
            status: 'Awaiting Management', decision: '', decisionBy: 'Director / Administrator', decisionAt: '', adjustmentType: '', adjustmentAmount: 0,
            approvedValue: 0, validityDays: 0, comment: data.comment || 'Submitted for management review.', unread: false,
            acknowledgedAt: '', appliedAt: '', appliedRef: ''
        };
        state.approvalInbox.unshift(row);
        if (sourceRef === state.costing.revision) state.costing.status = 'Management Review Pending';
        save(); return { ok: true, existing: false, row };
    }

    function acknowledgeApproval(id) {
        const row = state.approvalInbox?.find(x => x.id === id);
        if (!row || row.status === 'Awaiting Management') return { ok: false, reason: row ? 'Management decision abhi receive nahi hua.' : 'Decision record nahi mila.' };
        row.unread = false;
        row.acknowledgedAt = row.acknowledgedAt || new Date().toISOString();
        save(); return { ok: true, row };
    }

    function applyApprovalDecision(id) {
        const row = state.approvalInbox?.find(x => x.id === id);
        if (!row) return { ok: false, reason: 'Decision record nahi mila.' };
        if (row.status === 'Awaiting Management') return { ok: false, reason: 'Management decision abhi receive nahi hua.' };
        if (row.appliedAt) return { ok: true, existing: true, row, quote: row.appliedRef ? findQuote(row.appliedRef.replace('/', '::')) : null };
        if (!row.acknowledgedAt) return { ok: false, reason: 'Decision apply karne se pehle acknowledge karein.' };
        let quote = row.quoteRef ? findQuote(row.quoteRef) : null;
        if (row.status === 'Revision Required' && quote) {
            quote = createQuoteRevision(row.quoteRef, { value: Number(row.approvedValue || quote.value), nextAction: 'Prepare revised quotation from management instruction' });
        } else if (quote && Number(row.approvedValue || 0) > 0) {
            Object.assign(quote, { value: Number(row.approvedValue), status: 'Approved', approver: row.decisionBy || 'Management', nextAction: 'Prepare approved quotation for dispatch' });
        }
        if (row.sourceRef === state.costing.revision && Number(row.approvedValue || 0) > 0) {
            const discount = state.costing.components.find(x => /Discount/.test(x.name));
            if (discount && row.adjustmentType === 'Discount') Object.assign(discount, { name: 'Management Discount', mode: 'Entered amount', value: Number(row.adjustmentAmount || 0), amount: -Math.abs(Number(row.adjustmentAmount || 0)), status: 'Management Approved', note: row.comment });
            state.costing.status = 'Approved';
        }
        row.unread = false;
        row.acknowledgedAt = row.acknowledgedAt || new Date().toISOString();
        row.appliedAt = new Date().toISOString();
        row.appliedRef = quote ? `${quote.id}/${quote.rev}` : row.sourceRef;
        row.status = 'Applied';
        save(); return { ok: true, row, quote };
    }

    function tenderPackageTotals() {
        const workspace = state.tenderDocuments?.workspace;
        const sourceSizeMB = (workspace?.documents || []).reduce((sum, row) => sum + Number(row.sizeMB || 0), 0);
        const ratios = { Light: 0.72, Balanced: 0.36, Maximum: 0.23 };
        const compression = workspace?.compression || {};
        const baseRatio = ratios[compression.profile] || ratios.Balanced;
        const dpiFactor = Math.sqrt(Math.max(72, Number(compression.imageDpi || 150)) / 150);
        const qualityFactor = Math.max(40, Number(compression.imageQuality || 78)) / 78;
        const ratio = Math.min(0.95, Math.max(0.12, baseRatio * dpiFactor * qualityFactor));
        const outputSizeMB = Math.max(0.1, Math.round(sourceSizeMB * ratio * 10) / 10);
        return { documents: workspace?.documents?.length || 0, sourceSizeMB: Math.round(sourceSizeMB * 10) / 10, outputSizeMB, savedPercent: sourceSizeMB ? Math.round((1 - outputSizeMB / sourceSizeMB) * 100) : 0 };
    }

    function updateTenderField(id, value) {
        const workspace = state.tenderDocuments?.workspace;
        const field = workspace?.fields?.find(x => x.id === id);
        if (!field) return null;
        field.value = String(value ?? '');
        if (id === 'client' || id === 'project') workspace[id] = field.value;
        workspace.updatedAt = new Date().toISOString();
        save(); return field;
    }

    function selectTenderTemplate(templateId) {
        const template = state.tenderDocuments?.templates?.find(x => x.id === templateId);
        if (!template) return null;
        state.tenderDocuments.workspace.templateId = template.id;
        state.tenderDocuments.workspace.sections.forEach(section => { if (section.mode === 'Locked template') section.source = `Template ${template.revision}`; });
        const generated = state.tenderDocuments.workspace.documents.find(x => x.kind === 'Generated tender');
        if (generated) generated.source = `Template ${template.revision}`;
        state.tenderDocuments.workspace.status = 'Draft package';
        state.tenderDocuments.workspace.updatedAt = new Date().toISOString();
        save(); return template;
    }

    function addTenderDocuments(files) {
        const workspace = state.tenderDocuments?.workspace;
        if (!workspace) return [];
        const added = Array.from(files || []).map(file => {
            const sequence = workspace.documents.reduce((max, row) => Math.max(max, Number(String(row.id).replace(/\D/g, '')) || 0), 0) + 1;
            const row = { id: `DOC-${String(sequence).padStart(3, '0')}`, name: file.name || `Attachment-${sequence}.pdf`, kind: 'Tender attachment', sizeMB: Math.round((Number(file.size || 0) / 1048576) * 10) / 10, source: 'Browser file', locked: false, status: 'Loaded' };
            workspace.documents.push(row);
            return row;
        });
        if (added.length) { workspace.status = 'Draft package'; workspace.updatedAt = new Date().toISOString(); save(); }
        return added;
    }

    function moveTenderDocument(id, direction) {
        const rows = state.tenderDocuments?.workspace?.documents || [];
        const index = rows.findIndex(x => x.id === id);
        const target = index + Number(direction || 0);
        if (index < 0 || target < 0 || target >= rows.length) return false;
        [rows[index], rows[target]] = [rows[target], rows[index]];
        state.tenderDocuments.workspace.status = 'Draft package';
        save(); return true;
    }

    function removeTenderDocument(id) {
        const workspace = state.tenderDocuments?.workspace;
        const index = workspace?.documents?.findIndex(x => x.id === id) ?? -1;
        if (index < 0 || workspace.documents[index].locked) return false;
        workspace.documents.splice(index, 1);
        workspace.status = 'Draft package';
        save(); return true;
    }

    function updateTenderCompression(patch = {}) {
        const compression = state.tenderDocuments?.workspace?.compression;
        if (!compression) return null;
        if (patch.profile) {
            const presets = { Light: { imageDpi: 200, imageQuality: 88 }, Balanced: { imageDpi: 150, imageQuality: 78 }, Maximum: { imageDpi: 96, imageQuality: 60 } };
            Object.assign(compression, presets[patch.profile] || presets.Balanced, { profile: patch.profile });
        } else Object.assign(compression, patch);
        state.tenderDocuments.workspace.status = 'Draft package';
        state.tenderDocuments.workspace.updatedAt = new Date().toISOString();
        save(); return compression;
    }

    function buildTenderPackage(result = {}) {
        const workspace = state.tenderDocuments?.workspace;
        if (!workspace) return { ok: false, reason: 'Tender workspace nahi mila.' };
        const missing = workspace.fields.find(x => x.required && !String(x.value || '').trim());
        if (missing) return { ok: false, reason: `${missing.label} required hai.` };
        if (!workspace.documents.length) return { ok: false, reason: 'Merge package mein kam az kam ek document required hai.' };
        const totals = tenderPackageTotals();
        const sequence = (workspace.builds?.length || 0) + 13;
        const tenderRef = workspace.fields.find(x => x.id === 'tenderNo')?.value || workspace.id;
        const safeRef = String(tenderRef).replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const row = {
            id: `PKG-2609-${String(sequence).padStart(3, '0')}-R1`, file: `${safeRef || workspace.id}-Tender-Package.pdf`,
            createdAt: new Date().toISOString(), createdBy: 'Sales Desk', sourceSizeMB: Number(result.sourceSizeMB ?? totals.sourceSizeMB), outputSizeMB: Number(result.outputSizeMB ?? totals.outputSizeMB),
            profile: workspace.compression.profile, documents: totals.documents, pages: Number(result.pages || 0), status: result.status || 'Package specification ready', originalPreserved: workspace.compression.preserveOriginal
        };
        workspace.builds = workspace.builds || [];
        workspace.builds.unshift(row);
        workspace.status = 'Package prepared';
        workspace.updatedAt = row.createdAt;
        save(); return { ok: true, row };
    }

    function resetTenderWorkspace() {
        state.tenderDocuments.workspace = clone(demoState.tenderDocuments.workspace);
        save(); return state.tenderDocuments.workspace;
    }

    function addRate(data) {
        const next = state.rates.reduce((max, item) => Math.max(max, Number(String(item.id).match(/(\d+)$/)?.[1] || 0)), 10) + 1;
        const row = Object.assign({ id: `VRQ-2609-${String(next).padStart(3, '0')}`, requested: today, responded: '', rateDate: today, currency: 'PKR', rate: 0, tax: 'Pending', freight: 'Pending', lead: 'Pending', validUntil: '', status: 'Sent', evidence: 'Awaiting response', revision: 1, parentRateId: '' }, data);
        state.rates.unshift(row); save(); return row;
    }

    function updateRate(id, patch) {
        const row = state.rates.find(x => x.id === id);
        if (row) Object.assign(row, patch);
        save(); return row;
    }

    function reviseRate(id, data = {}) {
        const source = state.rates.find(x => x.id === id);
        if (!source) return null;
        source.status = 'Superseded';
        const copy = clone(source);
        delete copy.id;
        const row = addRate(Object.assign(copy, data, {
            parentRateId: source.id, revision: Number(source.revision || 1) + 1,
            requested: data.rateDate || today, responded: data.rateDate || today, rateDate: data.rateDate || today,
            status: data.status || 'Saved Rate'
        }));
        return row;
    }

    function upsertSalesSetup(type, data = {}) {
        const rows = state.salesSetup?.[type];
        if (!Array.isArray(rows)) return { ok: false, reason: 'Setup list not found.' };
        const payload = clone(data);
        if (!payload.id) delete payload.id;
        const name = String(data.name || '').trim();
        if (!name) return { ok: false, reason: 'Name required hai.' };
        const duplicate = rows.find(x => x.id !== data.id && String(x.name).trim().toLowerCase() === name.toLowerCase());
        if (duplicate) return { ok: false, reason: 'Yeh name pehle se saved hai.' };
        let row = rows.find(x => x.id === data.id);
        if (row) Object.assign(row, payload, { name });
        else {
            const prefixes = { categories: 'CAT', units: 'UOM', vendors: 'VEN' };
            const prefix = prefixes[type] || 'SET';
            const next = rows.reduce((max, item) => Math.max(max, Number(String(item.id).match(/(\d+)$/)?.[1] || 0)), 0) + 1;
            row = Object.assign({ id: `${prefix}-${String(next).padStart(3, '0')}`, status: 'Active' }, payload, { name });
            rows.push(row);
        }
        save(); return { ok: true, row };
    }

    function toggleSalesSetup(type, id) {
        const row = state.salesSetup?.[type]?.find(x => x.id === id);
        if (!row) return null;
        row.status = row.status === 'Inactive' ? 'Active' : 'Inactive';
        save(); return row;
    }

    function quoteRef(quote) {
        return quote ? `${quote.id}::${quote.rev}` : '';
    }

    function findQuote(ref) {
        const [id, rev] = String(ref || '').split('::');
        return state.quotations.find(x => x.id === id && (!rev || x.rev === rev));
    }

    function selectRate(id) {
        const target = state.rates.find(x => x.id === id);
        if (!target) return null;
        state.rates.forEach(x => {
            if (x.id !== id && x.inquiry === target.inquiry && x.item === target.item && x.spec === target.spec && x.status === 'Selected') x.status = 'Not Selected';
        });
        target.status = 'Selected';
        save(); return target;
    }

    function updateQuote(ref, patch) {
        const row = findQuote(ref);
        if (row) Object.assign(row, patch);
        save(); return row;
    }

    function createQuoteRevision(ref, patch = {}) {
        const source = findQuote(ref);
        if (!source) return null;
        const current = state.quotations.filter(x => x.id === source.id).reduce((max, x) => Math.max(max, parseInt(String(x.rev).replace(/\D/g, ''), 10) || 0), 0);
        const next = Object.assign(clone(source), patch, {
            rev: `R${current + 1}`, parentRevision: source.rev, status: 'Draft', submitted: '', validUntil: '',
            dispatch: 'Not sent', lastFollowUp: '', acceptedBaseline: false,
            nextAction: 'Review revised commercial snapshot', createdAt: new Date().toISOString()
        });
        state.quotations.unshift(next);
        save(); return next;
    }

    function markQuoteSent(ref, details = {}) {
        const row = findQuote(ref);
        if (!row) return { ok: false, reason: 'Quotation revision not found.' };
        if (!/Approved|Follow-up|Submitted/.test(row.status)) return { ok: false, reason: 'Management approval ke baad hi quotation dispatch ho sakti hai.' };
        row.dispatchLog = row.dispatchLog || [];
        row.dispatchLog.push({ at: details.at || new Date().toISOString(), channel: details.channel || 'Email + WhatsApp', recipient: details.recipient || 'Client contact', evidence: details.evidence || 'Dispatch logged in demonstration' });
        Object.assign(row, { status: 'Follow-up', submitted: row.submitted || today, validUntil: details.validUntil || row.validUntil || '2026-10-02', dispatch: details.channel || 'Email + WhatsApp', lastFollowUp: today, nextAction: 'Client follow-up' });
        save(); return { ok: true, row };
    }

    function acceptQuote(ref, details = {}) {
        const row = findQuote(ref);
        if (!row) return { ok: false, reason: 'Quotation revision not found.' };
        if (!row.submitted || !/Follow-up|Submitted/.test(row.status)) return { ok: false, reason: 'Sirf approved aur submitted quotation accept ho sakti hai.' };
        const acceptedDate = details.acceptedDate || today;
        if (row.validUntil && acceptedDate > row.validUntil) {
            row.status = 'Commercial Revalidation Required'; row.nextAction = 'Revalidate rates, FX and commercial position';
            save(); return { ok: false, late: true, reason: 'Quotation validity expire ho chuki hai; commercial revalidation required hai.' };
        }
        const linkedCosting = state.costing.approvedSnapshots?.find(x => x.inquiry === row.inquiry) || null;
        const baseline = { id: `ABL-${row.id.replace(/\D/g, '')}-${row.rev}`, quoteRef: quoteRef(row), acceptedAt: new Date().toISOString(), acceptedBy: details.acceptedBy || 'Client representative', evidence: details.evidence || 'Client acceptance evidence · demonstration', value: row.value, quote: clone(row), costingSnapshot: clone(linkedCosting), locked: true };
        state.acceptedBaselines = state.acceptedBaselines || [];
        state.acceptedBaselines.unshift(baseline);
        Object.assign(row, { status: 'Accepted Within Validity', acceptedBaseline: true, nextAction: 'Prepare handoff pack' });
        save(); return { ok: true, row, baseline };
    }

    function baseManualCatalog() {
        const rows = state.costing.lines.filter(x => !x.excluded && x.model !== 'MB13-I / MB10').map(x => ({
            id: `CAT-${x.id}`, category: x.section, model: x.model, description: x.description, unit: x.unit,
            code: x.model, brand: 'AUX', currency: 'PKR', price: Number(x.baseUnitRate ?? x.pkrRate ?? 0), displayPrice: Number(x.pkrRate || 0), source: x.source, effective: today, status: 'Active', origin: 'Reference'
        }));
        rows.forEach(x => {
            if (/^ARVCA-H(45|71)\//.test(x.model)) Object.assign(x, { controllerModel: 'YK-H', controllerPrice: 6600, grilleModel: 'MB10', grillePrice: 33000 });
            else if (/^ARVMD-/.test(x.model)) Object.assign(x, { controllerModel: 'XK-05A', controllerPrice: 23100 });
            else if (/^ARVWM-/.test(x.model)) Object.assign(x, { controllerModel: 'YK-H', controllerPrice: 6600 });
        });
        rows.push({ id: 'CAT-GRILLE-33000', code: 'MB10', category: 'Grille / Panel', brand: 'AUX', model: 'MB10', description: 'Cassette decorative grille / air-flow panel', unit: 'pc', currency: 'PKR', price: 33000, displayPrice: 33000, source: 'Confirmed costing breakdown', effective: today, status: 'Active', origin: 'Reference' });
        return rows;
    }

    function manualCatalog(includeInactive = false) {
        const byModel = new Map(baseManualCatalog().map(x => [String(x.model).toUpperCase(), x]));
        (state.productCatalog || []).forEach(x => byModel.set(String(x.model).toUpperCase(), { ...x, displayPrice: Number(x.price || 0), origin: x.origin || 'Sales catalogue' }));
        return [...byModel.values()].filter(x => includeInactive || x.status !== 'Inactive');
    }

    function normalizeCatalogItem(data = {}) {
        const model = String(data.model || data.Model || data['Model No'] || data['Model Number'] || '').trim();
        const price = Number(String(data.price ?? data.Price ?? data['Unit Price'] ?? data['Price / Unit'] ?? 0).replace(/[,\s]/g, '')) || 0;
        return {
            id: data.id || `PC-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
            code: String(data.code || data.Code || data.SKU || data['Material Code'] || model).trim(),
            category: String(data.category || data.Category || 'Other').trim(), brand: String(data.brand || data.Brand || 'AUX').trim(), model,
            description: String(data.description || data.Description || data.Specification || data.Specifications || '').trim(),
            unit: String(data.unit || data.Unit || 'pc').trim(), currency: String(data.currency || data.Currency || 'PKR').trim().toUpperCase(), price,
            source: String(data.source || data.Source || 'Sales catalogue import').trim(), effective: String(data.effective || data['Effective Date'] || today).trim(),
            controllerModel: String(data.controllerModel || data.Controller || data['Controller Model'] || '').trim(), controllerPrice: Number(String(data.controllerPrice ?? data['Controller Price'] ?? 0).replace(/[,\s]/g, '')) || 0,
            grilleModel: String(data.grilleModel || data.Grille || data['Grille Model'] || '').trim(), grillePrice: Number(String(data.grillePrice ?? data['Grille Price'] ?? 0).replace(/[,\s]/g, '')) || 0,
            status: String(data.status || data.Status || 'Active').trim() || 'Active', origin: data.origin || 'Sales catalogue'
        };
    }

    function upsertCatalogItems(items, fileName = 'Direct entry') {
        let added = 0, updated = 0, skipped = 0;
        const referenceModels = new Set(baseManualCatalog().map(x => String(x.model).toUpperCase()));
        (items || []).forEach(raw => {
            const item = normalizeCatalogItem(raw);
            if (!item.model) { skipped++; return; }
            const i = state.productCatalog.findIndex(x => String(x.model).toUpperCase() === item.model.toUpperCase());
            if (i >= 0) { item.id = state.productCatalog[i].id; state.productCatalog[i] = item; updated++; }
            else { state.productCatalog.push(item); if (referenceModels.has(item.model.toUpperCase())) updated++; else added++; }
        });
        if (fileName !== 'Direct entry') state.catalogImports.unshift({ id: `IMP-${Date.now()}`, file: fileName, importedAt: new Date().toISOString(), importedBy: 'Sales Engineer', rows: (items || []).length, added, updated, skipped, status: 'Imported' });
        save(); return { added, updated, skipped, total: (items || []).length };
    }

    function setCatalogItemStatus(model, status) {
        const existing = manualCatalog(true).find(x => String(x.model).toUpperCase() === String(model).toUpperCase());
        if (!existing) return null;
        const item = normalizeCatalogItem({ ...existing, id: existing.id, status, origin: existing.origin });
        const i = state.productCatalog.findIndex(x => String(x.model).toUpperCase() === String(model).toUpperCase());
        if (i >= 0) state.productCatalog[i] = item; else state.productCatalog.push(item);
        save(); return item;
    }

    function manualLinkedItems(model) {
        const catalog = manualCatalog();
        const find = code => catalog.find(x => x.model === code);
        const linked = [];
        const parent = find(model);
        const linkedItem = (code, price, category, description) => find(code) || (code ? { id: `LINK-${code}`, model: code, price: Number(price || 0), unit: 'pc', category, description, source: parent?.source || 'Sales catalogue mapping' } : null);
        if (parent?.grilleModel) linked.push({ item: linkedItem(parent.grilleModel, parent.grillePrice, 'Grille / Panel', 'Linked grille / panel'), relation: 'Mapped grille', required: true, ratio: 1 });
        if (parent?.controllerModel) linked.push({ item: linkedItem(parent.controllerModel, parent.controllerPrice, 'Controller', 'Linked remote / controller'), relation: 'Mapped controller', required: false, ratio: 1 });
        if (linked.length) return linked.filter(x => x.item);
        if (/^ARVCA-H(45|71)\//.test(model)) {
            linked.push({ item: find('MB10'), relation: 'Required cassette grille', required: true, ratio: 1 });
            linked.push({ item: find('YK-H'), relation: 'Suggested remote controller', required: false, ratio: 1 });
        } else if (/^ARVMD-/.test(model)) {
            linked.push({ item: find('XK-05A'), relation: 'Suggested wired controller', required: false, ratio: 1 });
        } else if (/^ARVWM-/.test(model)) {
            linked.push({ item: find('YK-H'), relation: 'Suggested remote controller', required: false, ratio: 1 });
        }
        return linked.filter(x => x.item);
    }

    function nextManualLineId() {
        const max = state.manualQuotation.lines.reduce((m, x) => Math.max(m, Number(String(x.id).replace(/\D/g, '')) || 0), 0);
        return `MQL-${String(max + 1).padStart(3, '0')}`;
    }

    function addManualQuoteItem(model, qty = 1, options = {}) {
        const item = manualCatalog().find(x => x.model === model);
        qty = Math.max(1, Number(qty) || 1);
        if (!item) return { ok: false, reason: 'Model not found in the rate-book catalogue.' };
        if (typeof options === 'boolean') options = { includeLinked: options };
        const includeLinked = options.includeLinked !== false;
        const line = {
            id: nextManualLineId(), category: item.category, model: item.model, description: item.description,
            qty, unit: item.unit, baseUnitPrice: Number(item.price || 0), source: item.source,
            controllerModel: '', controllerQty: 0, controllerUnitPrice: 0,
            grilleModel: '', grilleQty: 0, grilleUnitPrice: 0,
            yJointModel: '', yJointQty: 0, yJointUnitPrice: 0
        };
        if (includeLinked) manualLinkedItems(model).forEach(link => {
            const linkedQty = qty * Number(link.ratio || 1);
            if (/grille/i.test(link.relation)) {
                line.grilleModel = link.item.model; line.grilleQty = linkedQty; line.grilleUnitPrice = Number(link.item.price || 0);
            } else {
                line.controllerModel = link.item.model; line.controllerQty = linkedQty; line.controllerUnitPrice = Number(link.item.price || 0);
            }
        });
        if (options.yJointModel) {
            const joint = manualCatalog().find(x => x.model === options.yJointModel && x.category === 'Branch Joint');
            if (joint) {
                line.yJointModel = joint.model;
                line.yJointQty = Math.max(0, Number(options.yJointQty) || 0);
                line.yJointUnitPrice = Number(joint.price || 0);
            }
        }
        state.manualQuotation.lines.push(line);
        state.manualQuotation.updatedAt = new Date().toISOString(); save();
        return { ok: true, added: [line], row: line };
    }

    function updateManualQuoteLine(id, patch) {
        const row = state.manualQuotation.lines.find(x => x.id === id);
        if (!row) return null;
        if (patch.qty !== undefined) {
            patch.qty = Math.max(0, Number(patch.qty) || 0);
            if (!row.controllerQtyOverridden && row.controllerModel) row.controllerQty = patch.qty;
            if (!row.grilleQtyOverridden && row.grilleModel) row.grilleQty = patch.qty;
        }
        ['baseUnitPrice','controllerQty','controllerUnitPrice','grilleQty','grilleUnitPrice','yJointQty','yJointUnitPrice'].forEach(field => {
            if (patch[field] !== undefined) patch[field] = Math.max(0, Number(patch[field]) || 0);
        });
        if (patch.controllerQty !== undefined) row.controllerQtyOverridden = true;
        if (patch.grilleQty !== undefined) row.grilleQtyOverridden = true;
        Object.assign(row, patch); state.manualQuotation.updatedAt = new Date().toISOString(); save(); return row;
    }

    function removeManualQuoteLine(id) {
        const before = state.manualQuotation.lines.length;
        state.manualQuotation.lines = state.manualQuotation.lines.filter(x => x.id !== id);
        state.manualQuotation.updatedAt = new Date().toISOString(); save(); return state.manualQuotation.lines.length < before;
    }

    function updateManualQuotation(patch) {
        const allowed = ['client','project','attention','date','validUntil','currency','notes','discount','freight','tax','status'];
        allowed.forEach(k => { if (patch[k] !== undefined) state.manualQuotation[k] = ['discount','freight','tax'].includes(k) ? Math.max(0, Number(patch[k]) || 0) : patch[k]; });
        state.manualQuotation.updatedAt = new Date().toISOString(); save(); return state.manualQuotation;
    }

    function resetManualQuotation() {
        const currentNumber = Number(String(state.manualQuotation.id).replace(/\D/g, '')) || 1;
        state.manualQuotation = clone(demoState.manualQuotation);
        state.manualQuotation.id = `MQ-2609-${String(currentNumber + 1).padStart(3, '0')}`;
        save(); return state.manualQuotation;
    }

    function manualQuoteLineTotal(row) {
        return Number(row.qty || 0) * Number(row.baseUnitPrice || 0)
            + Number(row.controllerQty || 0) * Number(row.controllerUnitPrice || 0)
            + Number(row.grilleQty || 0) * Number(row.grilleUnitPrice || 0)
            + Number(row.yJointQty || 0) * Number(row.yJointUnitPrice || 0);
    }

    function manualQuoteTotals() {
        const q = state.manualQuotation;
        const subtotal = q.lines.reduce((sum, x) => sum + manualQuoteLineTotal(x), 0);
        return { subtotal, discount: Number(q.discount || 0), freight: Number(q.freight || 0), tax: Number(q.tax || 0), grandTotal: subtotal - Number(q.discount || 0) + Number(q.freight || 0) + Number(q.tax || 0) };
    }

    function pricingCategory(section) {
        if (/controller/i.test(section)) return 'Controller';
        if (/panel|grille/i.test(section)) return 'Grille / Panel';
        return section;
    }

    function prepareSelectionPricing(selectionId, equipmentRows = [], options = {}) {
        const selection = state.selections.find(x => x.id === selectionId);
        if (!selection) return null;
        if (!options.force && state.selectionPricing?.selectionId === selectionId && Array.isArray(state.selectionPricing.lines) && state.selectionPricing.lines.length) return state.selectionPricing;
        const catalog = manualCatalog();
        const rows = equipmentRows.map((raw, index) => {
            const [section, model, description, quantity] = Array.isArray(raw)
                ? raw
                : [raw.section, raw.model, raw.description, raw.qty];
            const match = catalog.find(x => String(x.model).toUpperCase() === String(model).toUpperCase());
            return {
                id: `SPL-${String(index + 1).padStart(3, '0')}`,
                section, model, description, qty: Math.max(0, Number(quantity) || 0), unit: match?.unit || 'pc',
                rateModel: match?.model || '', unitPrice: Number(match?.price || 0), rateSource: match?.source || '',
                status: match && Number(match.price || 0) > 0 ? 'Rate matched' : 'Rate required', note: ''
            };
        });
        state.selectionPricing = {
            layoutVersion: 1, id: `SP-${selection.id.replace(/^SEL-/, '')}`, selectionId, inquiry: selection.inquiry,
            client: selection.client, project: selection.project, sourceFile: selection.file, date: today, validUntil: '2026-10-02',
            status: 'Draft', notes: 'AUX quantities retained. Rates require commercial review before quotation issue.', lines: rows,
            updatedAt: new Date().toISOString()
        };
        save(); return state.selectionPricing;
    }

    function updateSelectionPricingLine(id, patch = {}) {
        const sheet = state.selectionPricing;
        const row = sheet?.lines?.find(x => x.id === id);
        if (!row) return null;
        ['qty', 'unitPrice'].forEach(field => {
            if (patch[field] !== undefined) patch[field] = Math.max(0, Number(patch[field]) || 0);
        });
        Object.assign(row, patch);
        row.status = Number(row.unitPrice || 0) > 0
            ? (patch.status || (row.status === 'Rate required' ? 'Rate entered' : row.status) || 'Rate entered')
            : 'Rate required';
        sheet.updatedAt = new Date().toISOString(); save(); return row;
    }

    function applySelectionPricingRate(id, rateModel) {
        const item = manualCatalog().find(x => String(x.model).toUpperCase() === String(rateModel).toUpperCase());
        if (!item) return null;
        return updateSelectionPricingLine(id, {
            rateModel: item.model, unitPrice: Number(item.price || 0), rateSource: item.source || 'Rate Book', status: 'Selected reference'
        });
    }

    function updateSelectionPricing(patch = {}) {
        if (!state.selectionPricing) return null;
        ['client', 'project', 'date', 'validUntil', 'status', 'notes'].forEach(key => {
            if (patch[key] !== undefined) state.selectionPricing[key] = patch[key];
        });
        state.selectionPricing.updatedAt = new Date().toISOString(); save(); return state.selectionPricing;
    }

    function selectionPricingTotals() {
        const lines = state.selectionPricing?.lines || [];
        const subtotal = lines.reduce((sum, row) => sum + Number(row.qty || 0) * Number(row.unitPrice || 0), 0);
        return {
            rows: lines.length, quantity: lines.reduce((sum, row) => sum + Number(row.qty || 0), 0),
            priced: lines.filter(row => Number(row.unitPrice || 0) > 0).length,
            unresolved: lines.filter(row => Number(row.unitPrice || 0) <= 0).length, subtotal
        };
    }

    function selectionPricingCandidates(lineId) {
        const row = state.selectionPricing?.lines?.find(x => x.id === lineId);
        if (!row) return [];
        const category = pricingCategory(row.section);
        const substitution = state.substitutions.find(x => x.from === row.model);
        const rows = manualCatalog().filter(x => x.category === category && Number(x.price || 0) > 0);
        return rows.sort((a, b) => {
            if (a.model === substitution?.to) return -1;
            if (b.model === substitution?.to) return 1;
            return a.model.localeCompare(b.model);
        }).map(x => ({ ...x, recommended: x.model === substitution?.to }));
    }

    window.CosmixSales = {
        get state() { return state; },
        get storageAvailable() { return storageAvailable; },
        demoState: clone(demoState), money, save, reset, addInquiry, updateInquiry, addSelection, updateSelection, recordSelectionDecision, validateSelection,
        addComponent, updateCostLine, approveCosting, submitApprovalRequest, acknowledgeApproval, applyApprovalDecision, addRate, updateRate, reviseRate, selectRate, upsertSalesSetup, toggleSalesSetup, quoteRef, findQuote, updateQuote, createQuoteRevision, markQuoteSent, acceptQuote,
        manualCatalog, upsertCatalogItems, setCatalogItemStatus, manualLinkedItems, addManualQuoteItem, updateManualQuoteLine, removeManualQuoteLine, updateManualQuotation, resetManualQuotation, manualQuoteLineTotal, manualQuoteTotals,
        prepareSelectionPricing, updateSelectionPricingLine, applySelectionPricingRate, updateSelectionPricing, selectionPricingTotals, selectionPricingCandidates,
        tenderPackageTotals, updateTenderField, selectTenderTemplate, addTenderDocuments, moveTenderDocument, removeTenderDocument, updateTenderCompression, buildTenderPackage, resetTenderWorkspace
    };
})();
