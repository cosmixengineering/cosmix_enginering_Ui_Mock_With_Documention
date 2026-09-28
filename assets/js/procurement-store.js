/**
 * Cosmix Hub - Procurement & SCM State Manager
 * Handles Purchase Orders, Vendor RFQs, 3-Way Match Engine (PO vs GRN vs Vendor Bill),
 * Contradiction Detection (Overbilling, Rate Variance >1%, Missing GRN),
 * Vendor Directory with NTN/STRN verification, and auto-generation of VB-MATCH-xxx vouchers.
 */

const CosmixProcurement = (() => {
    const STORAGE_KEY = 'cosmix_procurement_state_v2';

    const defaultState = {
        purchaseOrders: [
            {
                id: 'po-101',
                poNumber: 'PO-2026-0101',
                vendorId: 'vnd-001',
                vendorName: 'Pakistan Steel Mills Syndicate',
                vendorNtn: '2847192-3',
                vendorStrn: '17-00-2847-192-19',
                projectRef: 'PRJ-2026-044 (Lucky Motor HVAC Ducting)',
                bomRef: 'BOM-DUCT-044',
                issueDate: '2026-09-15',
                deliveryDate: '2026-09-28',
                paymentTerms: '30 Days Net Credit',
                currency: 'PKR',
                status: 'PartiallyReceived',
                reconciliationStatus: 'Matched',
                lines: [
                    { id: 'pol-1', itemCode: '0-0001-01', description: 'GI Sheet 22 Gauge (0.8mm) Z-275 Coating', uom: 'Kg', qtyOrdered: 3500, unitRatePkr: 285.0, totalPkr: 997500, qtyReceived: 2000, qtyInvoiced: 2000 },
                    { id: 'pol-2', itemCode: '0-0001-02', description: 'GI Sheet 24 Gauge (0.6mm) Prime Quality', uom: 'Kg', qtyOrdered: 2000, unitRatePkr: 295.0, totalPkr: 590000, qtyReceived: 2000, qtyInvoiced: 0 }
                ],
                subtotalPkr: 1587500,
                taxPkr: 285750, // 18% GST
                totalPkr: 1873250,
                notes: 'Mill test certificates (MTC) required upon delivery at Factory Gate 2.',
                createdBy: 'procurement@cosmixengineering.com',
                approvedBy: 'management@cosmixengineering.com'
            },
            {
                id: 'po-102',
                poNumber: 'PO-2026-0102',
                vendorId: 'vnd-003',
                vendorName: 'Siemens Pakistan Engineering Co.',
                vendorNtn: '0710382-7',
                vendorStrn: '02-01-0710-382-17',
                projectRef: 'PRJ-2026-039 (Indus Hospital Chiller Retrofit)',
                bomRef: 'BOM-ELEC-039',
                issueDate: '2026-09-18',
                deliveryDate: '2026-10-05',
                paymentTerms: '50% Advance / 50% on Delivery',
                currency: 'PKR',
                status: 'Issued',
                reconciliationStatus: 'PendingGRN',
                lines: [
                    { id: 'pol-3', itemCode: '0-0008-01', description: '3-Phase VFD Drive 45kW IP55 Inverter', uom: 'Nos', qtyOrdered: 4, unitRatePkr: 345000.0, totalPkr: 1380000, qtyReceived: 0, qtyInvoiced: 0 },
                    { id: 'pol-4', itemCode: '0-0008-04', description: 'Magnetic Contactor 100A AC3 Duty', uom: 'Nos', qtyOrdered: 8, unitRatePkr: 28500.0, totalPkr: 228000, qtyReceived: 0, qtyInvoiced: 0 }
                ],
                subtotalPkr: 1608000,
                taxPkr: 289440,
                totalPkr: 1897440,
                notes: 'Includes 12 months manufacturer warranty & commissioning support.',
                createdBy: 'procurement@cosmixengineering.com',
                approvedBy: 'management@cosmixengineering.com'
            },
            {
                id: 'po-103',
                poNumber: 'PO-2026-0103',
                vendorId: 'vnd-004',
                vendorName: 'Diamond Supreme Insulation Ltd',
                vendorNtn: '1948201-5',
                vendorStrn: '12-00-1948-201-11',
                projectRef: 'PRJ-2026-042 (Dolmen Mall FCU Piping)',
                bomRef: 'BOM-INSU-042',
                issueDate: '2026-09-20',
                deliveryDate: '2026-09-24',
                paymentTerms: '15 Days Credit',
                currency: 'PKR',
                status: 'Invoiced',
                reconciliationStatus: 'Matched',
                lines: [
                    { id: 'pol-5', itemCode: '0-0004-01', description: 'Nitrile Rubber Class-O Foam Sheet 19mm', uom: 'Sqm', qtyOrdered: 850, unitRatePkr: 920.0, totalPkr: 782000, qtyReceived: 850, qtyInvoiced: 850 },
                    { id: 'pol-6', itemCode: '0-0004-05', description: 'Adhesive Glue Can (15 Liter Tin)', uom: 'Tin', qtyOrdered: 25, unitRatePkr: 12500.0, totalPkr: 312500, qtyReceived: 25, qtyInvoiced: 25 }
                ],
                subtotalPkr: 1094500,
                taxPkr: 197010,
                totalPkr: 1291510,
                notes: 'Factory fire-retardant testing report attached.',
                createdBy: 'procurement@cosmixengineering.com',
                approvedBy: 'management@cosmixengineering.com'
            },
            {
                id: 'po-104',
                poNumber: 'PO-2026-0104',
                vendorId: 'vnd-002',
                vendorName: 'Atlas Copco Pakistan (Pvt) Ltd',
                vendorNtn: '3109284-9',
                vendorStrn: '03-09-3109-284-18',
                projectRef: 'PRJ-2026-045 (Engro Polymer Compressed Air Line)',
                bomRef: 'BOM-COMP-045',
                issueDate: '2026-09-22',
                deliveryDate: '2026-10-10',
                paymentTerms: '30 Days Net Credit',
                currency: 'PKR',
                status: 'Draft',
                reconciliationStatus: 'PendingAudit',
                lines: [
                    { id: 'pol-7', itemCode: '0-0007-02', description: 'Rotary Screw Air Compressor 30HP with Dryer', uom: 'Set', qtyOrdered: 2, unitRatePkr: 1850000.0, totalPkr: 3700000, qtyReceived: 0, qtyInvoiced: 0 }
                ],
                subtotalPkr: 3700000,
                taxPkr: 666000,
                totalPkr: 4366000,
                notes: 'Awaiting final commercial signoff from CEO.',
                createdBy: 'procurement@cosmixengineering.com',
                approvedBy: null
            },
            {
                id: 'po-105',
                poNumber: 'PO-2026-0098',
                vendorId: 'vnd-008',
                vendorName: 'Karachi Fasteners & Hardware Mart',
                vendorNtn: '1182740-4',
                vendorStrn: '11-04-1182-740-16',
                projectRef: 'PRJ-2026-037 (Lucky One Central Plantroom Fasteners)',
                bomRef: 'BOM-FAST-037',
                issueDate: '2026-09-10',
                deliveryDate: '2026-09-20',
                paymentTerms: '7 Days Credit',
                currency: 'PKR',
                status: 'Received',
                reconciliationStatus: 'ContradictionDetected',
                lines: [
                    { id: 'pol-8', itemCode: '0-0011-01', description: 'High Tensile Bolts M12x40 Grade 8.8 Galvanized', uom: 'Nos', qtyOrdered: 500, unitRatePkr: 180.0, totalPkr: 90000, qtyReceived: 500, qtyInvoiced: 500 },
                    { id: 'pol-9', itemCode: '0-0011-04', description: 'Anchor Fasteners 1/2" Zinc Coated Heavy Duty', uom: 'Nos', qtyOrdered: 300, unitRatePkr: 183.33, totalPkr: 55000, qtyReceived: 250, qtyInvoiced: 300 }
                ],
                subtotalPkr: 145000,
                taxPkr: 26100,
                totalPkr: 171100,
                notes: 'Batch test certificate for Grade 8.8 tensile strength required.',
                createdBy: 'procurement@cosmixengineering.com',
                approvedBy: 'management@cosmixengineering.com'
            },
            {
                id: 'po-106',
                poNumber: 'PO-2026-0099',
                vendorId: 'vnd-005',
                vendorName: 'Muller Pipes & Fittings Lahore',
                vendorNtn: '4091823-1',
                vendorStrn: '05-02-4091-823-14',
                projectRef: 'PRJ-2026-040 (Pfizer Pharma Cleanroom Nitrogen Line)',
                bomRef: 'BOM-PIPE-040',
                issueDate: '2026-09-12',
                deliveryDate: '2026-09-22',
                paymentTerms: '15 Days Credit',
                currency: 'PKR',
                status: 'PartiallyReceived',
                reconciliationStatus: 'MissingGRN',
                lines: [
                    { id: 'pol-10', itemCode: '0-0003-01', description: 'Copper Pipe 7/8" OD x 20ft length (Type-L)', uom: 'Pcs', qtyOrdered: 100, unitRatePkr: 5200.0, totalPkr: 520000, qtyReceived: 60, qtyInvoiced: 100 },
                    { id: 'pol-11', itemCode: '0-0003-02', description: 'Copper Pipe 5/8" OD x 20ft length (Type-L)', uom: 'Pcs', qtyOrdered: 80, unitRatePkr: 2900.0, totalPkr: 232000, qtyReceived: 0, qtyInvoiced: 80 }
                ],
                subtotalPkr: 752000,
                taxPkr: 135360,
                totalPkr: 887360,
                notes: 'Cleanroom degreased & capped ends strictly required.',
                createdBy: 'procurement@cosmixengineering.com',
                approvedBy: 'management@cosmixengineering.com'
            }
        ],

        grnList: [
            {
                id: 'grn-0044',
                grnNumber: 'GRN-2026-0044',
                poNumber: 'PO-2026-0103',
                deliveryChallanNo: 'DC-DS-8821',
                vendorName: 'Diamond Supreme Insulation Ltd',
                receivedDate: '2026-09-24',
                gatePassNo: 'OGP-2026-1182',
                inspectedBy: 'Tariq Mehmood (QA Lead)',
                warehouseLocation: 'Store A - Thermal Bay 03',
                lines: [
                    { itemCode: '0-0004-01', description: 'Nitrile Rubber Class-O Foam Sheet 19mm', uom: 'Sqm', qtyReceived: 850, qtyAccepted: 850, qtyRejected: 0 },
                    { itemCode: '0-0004-05', description: 'Adhesive Glue Can (15 Liter Tin)', uom: 'Tin', qtyReceived: 25, qtyAccepted: 25, qtyRejected: 0 }
                ]
            },
            {
                id: 'grn-0041',
                grnNumber: 'GRN-2026-0041',
                poNumber: 'PO-2026-0101',
                deliveryChallanNo: 'DC-PSM-5520',
                vendorName: 'Pakistan Steel Mills Syndicate',
                receivedDate: '2026-09-22',
                gatePassNo: 'OGP-2026-1160',
                inspectedBy: 'Farhan Ali (Store Officer)',
                warehouseLocation: 'Store B - Raw Materials Yard',
                lines: [
                    { itemCode: '0-0001-01', description: 'GI Sheet 22 Gauge (0.8mm) Z-275 Coating', uom: 'Kg', qtyReceived: 2000, qtyAccepted: 2000, qtyRejected: 0 }
                ]
            },
            {
                id: 'grn-0038',
                grnNumber: 'GRN-2026-0038',
                poNumber: 'PO-2026-0098',
                deliveryChallanNo: 'DC-KF-3990',
                vendorName: 'Karachi Fasteners & Hardware Mart',
                receivedDate: '2026-09-23',
                gatePassNo: 'OGP-2026-1175',
                inspectedBy: 'Farhan Ali (Store Officer)',
                warehouseLocation: 'Store A - Small Parts Rack 4',
                lines: [
                    { itemCode: '0-0011-01', description: 'High Tensile Bolts M12x40 Grade 8.8 Galvanized', uom: 'Nos', qtyReceived: 500, qtyAccepted: 500, qtyRejected: 0 },
                    { itemCode: '0-0011-04', description: 'Anchor Fasteners 1/2" Zinc Coated Heavy Duty', uom: 'Nos', qtyReceived: 250, qtyAccepted: 250, qtyRejected: 0 }
                ]
            },
            {
                id: 'grn-0039',
                grnNumber: 'GRN-2026-0039',
                poNumber: 'PO-2026-0099',
                deliveryChallanNo: 'DC-MUL-1090',
                vendorName: 'Muller Pipes & Fittings Lahore',
                receivedDate: '2026-09-24',
                gatePassNo: 'OGP-2026-1179',
                inspectedBy: 'Tariq Mehmood (QA Lead)',
                warehouseLocation: 'Store A - Copper Rack 01',
                lines: [
                    { itemCode: '0-0003-01', description: 'Copper Pipe 7/8" OD x 20ft length (Type-L)', uom: 'Pcs', qtyReceived: 60, qtyAccepted: 60, qtyRejected: 0 },
                    { itemCode: '0-0003-02', description: 'Copper Pipe 5/8" OD x 20ft length (Type-L)', uom: 'Pcs', qtyReceived: 0, qtyAccepted: 0, qtyRejected: 0 }
                ]
            }
        ],

        rfqList: [
            {
                id: 'rfq-201',
                rfqNumber: 'RFQ-2026-0081',
                title: 'Supply of Copper Tubes & Fittings (Type-L Hard Drawn)',
                requisitionRef: 'REQ-BOM-774',
                projectRef: 'PRJ-2026-046 (Getz Pharma Cleanroom AC)',
                status: 'EvaluationReady',
                closingDate: '2026-09-25',
                items: [
                    { itemCode: '0-0003-01', description: 'Copper Pipe 7/8" OD x 20ft length', qty: 150, uom: 'Pcs' },
                    { itemCode: '0-0003-02', description: 'Copper Pipe 5/8" OD x 20ft length', qty: 220, uom: 'Pcs' }
                ],
                bids: [
                    {
                        vendorId: 'vnd-005',
                        vendorName: 'Muller Pipes & Fittings Lahore',
                        bidTotalPkr: 1420000,
                        unitRate1: 5200,
                        unitRate2: 2900,
                        deliveryDays: 5,
                        paymentTerms: '15 Days Credit',
                        isL1: true,
                        score: 92,
                        remarks: 'Lowest price (L1) with immediate stock availability in Karachi warehouse.'
                    },
                    {
                        vendorId: 'vnd-006',
                        vendorName: 'Sindh Copper & Brass Industries',
                        bidTotalPkr: 1495000,
                        unitRate1: 5450,
                        unitRate2: 3080,
                        deliveryDays: 7,
                        paymentTerms: '30 Days Net',
                        isL1: false,
                        score: 86,
                        remarks: 'L2 evaluated bidder.'
                    },
                    {
                        vendorId: 'vnd-007',
                        vendorName: 'Al-Hadeed Metal Importers',
                        bidTotalPkr: 1580000,
                        unitRate1: 5800,
                        unitRate2: 3250,
                        deliveryDays: 12,
                        paymentTerms: '100% Advance',
                        isL1: false,
                        score: 74,
                        remarks: 'High price & advance payment constraint.'
                    }
                ]
            },
            {
                id: 'rfq-202',
                rfqNumber: 'RFQ-2026-0082',
                title: 'Stainless Steel SS-316 Dampers & Volume Control Blades',
                requisitionRef: 'REQ-BOM-779',
                projectRef: 'PRJ-2026-047 (Fauji Foods Process Line)',
                status: 'Open',
                closingDate: '2026-09-30',
                items: [
                    { itemCode: '0-0005-01', description: 'SS-316 Motorized Fire & Smoke Damper 600x600', qty: 12, uom: 'Nos' }
                ],
                bids: []
            }
        ],

        threeWayMatches: [
            {
                id: '3wm-301',
                matchCode: 'VB-MATCH-2026-0103',
                poNumber: 'PO-2026-0103',
                grnNumber: 'GRN-2026-0044',
                deliveryChallanNo: 'DC-DS-8821',
                vendorBillNumber: 'INV-DS-99381',
                vendorId: 'vnd-004',
                vendorName: 'Diamond Supreme Insulation Ltd',
                billDate: '2026-09-24',
                poAmountPkr: 1291510,
                grnAmountPkr: 1291510,
                billAmountPkr: 1291510,
                variancePkr: 0,
                status: 'Matched',
                contradictionSummary: 'Zero Contradictions. Exact 3-Pillar parity confirmed.',
                hasOverbilling: false,
                hasRateVariance: false,
                hasMissingGrn: false,
                strnVerified: true,
                apVoucherCreated: true,
                apVoucherRef: 'VB-MATCH-2026-0103',
                apPostingRef: 'AP-VOUCHER-0882',
                checkedBy: 'procurement@cosmixengineering.com',
                approvedBy: 'accounts@cosmixengineering.com',
                auditNotes: 'FBR e-Invoicing verified. Automated AP credit clearance released.',
                lineDetails: [
                    {
                        itemCode: '0-0004-01',
                        description: 'Nitrile Rubber Class-O Foam Sheet 19mm',
                        uom: 'Sqm',
                        poQty: 850,
                        grnQty: 850,
                        billQty: 850,
                        poRate: 920,
                        billRate: 920,
                        rateVariancePct: 0,
                        qtyVariance: 0,
                        amountVariancePkr: 0,
                        status: 'MATCH',
                        contradictionType: 'None'
                    },
                    {
                        itemCode: '0-0004-05',
                        description: 'Adhesive Glue Can (15 Liter Tin)',
                        uom: 'Tin',
                        poQty: 25,
                        grnQty: 25,
                        billQty: 25,
                        poRate: 12500,
                        billRate: 12500,
                        rateVariancePct: 0,
                        qtyVariance: 0,
                        amountVariancePkr: 0,
                        status: 'MATCH',
                        contradictionType: 'None'
                    }
                ]
            },
            {
                id: '3wm-302',
                matchCode: 'VB-MATCH-2026-0101-A',
                poNumber: 'PO-2026-0101',
                grnNumber: 'GRN-2026-0041',
                deliveryChallanNo: 'DC-PSM-5520',
                vendorBillNumber: 'INV-PSM-4409',
                vendorId: 'vnd-001',
                vendorName: 'Pakistan Steel Mills Syndicate',
                billDate: '2026-09-22',
                poAmountPkr: 672600, // For 2000kg @ 285 + 18%
                grnAmountPkr: 672600,
                billAmountPkr: 672600,
                variancePkr: 0,
                status: 'Matched',
                contradictionSummary: 'Partial delivery 1st tranche fully validated against GRN-2026-0041.',
                hasOverbilling: false,
                hasRateVariance: false,
                hasMissingGrn: false,
                strnVerified: true,
                apVoucherCreated: true,
                apVoucherRef: 'VB-MATCH-2026-0101',
                apPostingRef: 'AP-VOUCHER-0879',
                checkedBy: 'procurement@cosmixengineering.com',
                approvedBy: 'accounts@cosmixengineering.com',
                auditNotes: 'Partially received PO tranche matched and booked.',
                lineDetails: [
                    {
                        itemCode: '0-0001-01',
                        description: 'GI Sheet 22 Gauge (0.8mm) Z-275 Coating',
                        uom: 'Kg',
                        poQty: 2000,
                        grnQty: 2000,
                        billQty: 2000,
                        poRate: 285,
                        billRate: 285,
                        rateVariancePct: 0,
                        qtyVariance: 0,
                        amountVariancePkr: 0,
                        status: 'MATCH',
                        contradictionType: 'None'
                    }
                ]
            },
            {
                id: '3wm-303',
                matchCode: 'VB-MATCH-2026-0098-REV',
                poNumber: 'PO-2026-0098',
                grnNumber: 'GRN-2026-0038',
                deliveryChallanNo: 'DC-KF-3990',
                vendorBillNumber: 'INV-KF-1029',
                vendorId: 'vnd-008',
                vendorName: 'Karachi Fasteners & Hardware Mart',
                billDate: '2026-09-25',
                poAmountPkr: 171100, // 145k + 18%
                grnAmountPkr: 160276, // Received 250 instead of 300 anchors
                billAmountPkr: 182900, // Vendor billed 300 anchors + rate PKR 200 on bolts (+11.1% rate jump!)
                variancePkr: 22624, // Billed PKR 182,900 vs GRN PO parity PKR 160,276
                status: 'ContradictionDetected',
                contradictionSummary: 'Contradictions Detected: 11.1% Unit Rate Inflation on Bolts (>1% threshold) & 50 Nos Quantity Overbilled on Anchors without GRN receipt.',
                hasOverbilling: true,
                hasRateVariance: true,
                hasMissingGrn: false,
                strnVerified: true,
                apVoucherCreated: false,
                apVoucherRef: null,
                apPostingRef: null,
                checkedBy: 'procurement@cosmixengineering.com',
                approvedBy: null,
                auditNotes: 'Vendor invoice rejected by automated contradiction filter. AP release locked until credit note or override.',
                lineDetails: [
                    {
                        itemCode: '0-0011-01',
                        description: 'High Tensile Bolts M12x40 Grade 8.8 Galvanized',
                        uom: 'Nos',
                        poQty: 500,
                        grnQty: 500,
                        billQty: 500,
                        poRate: 180,
                        billRate: 200,
                        rateVariancePct: 11.11,
                        qtyVariance: 0,
                        amountVariancePkr: 10000,
                        status: 'RATE_OVER_LIMIT',
                        contradictionType: 'Price Discrepancy (+11.1% > 1% threshold)'
                    },
                    {
                        itemCode: '0-0011-04',
                        description: 'Anchor Fasteners 1/2" Zinc Coated Heavy Duty',
                        uom: 'Nos',
                        poQty: 300,
                        grnQty: 250,
                        billQty: 300,
                        poRate: 183.33,
                        billRate: 183.33,
                        rateVariancePct: 0,
                        qtyVariance: 50,
                        amountVariancePkr: 9166.5,
                        status: 'QTY_OVERBILLED',
                        contradictionType: 'Quantity Overbilled (+50 Nos > GRN receipt)'
                    }
                ]
            },
            {
                id: '3wm-304',
                matchCode: 'VB-MATCH-2026-0099-REV',
                poNumber: 'PO-2026-0099',
                grnNumber: 'GRN-2026-0039',
                deliveryChallanNo: 'DC-MUL-1090',
                vendorBillNumber: 'INV-MUL-8841',
                vendorId: 'vnd-005',
                vendorName: 'Muller Pipes & Fittings Lahore',
                billDate: '2026-09-25',
                poAmountPkr: 887360,
                grnAmountPkr: 368160, // 60 pcs 7/8" received only
                billAmountPkr: 887360, // Vendor billed 100% of order before 2nd line delivery!
                variancePkr: 519200,
                status: 'MissingGRN',
                contradictionSummary: 'Contradiction Detected: Line 2 (Copper Pipe 5/8") invoiced (80 Pcs) with 0 GRN physical inward receipt.',
                hasOverbilling: true,
                hasRateVariance: false,
                hasMissingGrn: true,
                strnVerified: true,
                apVoucherCreated: false,
                apVoucherRef: null,
                apPostingRef: null,
                checkedBy: 'procurement@cosmixengineering.com',
                approvedBy: null,
                auditNotes: 'Vendor premature full billing flagged. Blocked in AP pending physical warehouse receipt.',
                lineDetails: [
                    {
                        itemCode: '0-0003-01',
                        description: 'Copper Pipe 7/8" OD x 20ft length (Type-L)',
                        uom: 'Pcs',
                        poQty: 100,
                        grnQty: 60,
                        billQty: 100,
                        poRate: 5200,
                        billRate: 5200,
                        rateVariancePct: 0,
                        qtyVariance: 40,
                        amountVariancePkr: 208000,
                        status: 'QTY_OVERBILLED',
                        contradictionType: 'Overbilled (+40 Pcs unreceived)'
                    },
                    {
                        itemCode: '0-0003-02',
                        description: 'Copper Pipe 5/8" OD x 20ft length (Type-L)',
                        uom: 'Pcs',
                        poQty: 80,
                        grnQty: 0,
                        billQty: 80,
                        poRate: 2900,
                        billRate: 2900,
                        rateVariancePct: 0,
                        qtyVariance: 80,
                        amountVariancePkr: 232000,
                        status: 'MISSING_GRN',
                        contradictionType: 'Missing GRN Receipt (0 received at warehouse)'
                    }
                ]
            }
        ],

        creditNotes: [
            {
                id: 'cn-401',
                debitAdviceRef: 'DN-2026-0018',
                creditNoteRef: 'CN-REQ-2026-0042',
                matchCode: 'VB-MATCH-2026-0098-REV',
                vendorId: 'vnd-008',
                vendorName: 'Karachi Fasteners & Hardware Mart',
                poNumber: 'PO-2026-0098',
                invoiceNumber: 'INV-KF-1029',
                requestedDate: '2026-09-26',
                adjustmentAmountPkr: 22624,
                reason: 'Discrepancy: Rate inflation +11.1% on M12 bolts and 50 Nos overbilled on anchor fasteners without warehouse GRN inward.',
                status: 'Requested',
                requestedBy: 'procurement@cosmixengineering.com'
            }
        ],

        vendors: [
            {
                id: 'vnd-001',
                code: 'VND-0001',
                name: 'Pakistan Steel Mills Syndicate',
                category: 'Raw Steel & GI Sheets',
                ntn: '2847192-3',
                strn: '17-00-2847-192-19',
                fbrStatus: 'Active Taxpayer',
                contactPerson: 'Tariq Mehmood',
                designation: 'Commercial Manager',
                phone: '+92 300 8219401',
                email: 'sales@paksteel-syndicate.pk',
                address: 'Plot 42-B, Sector 15, Korangi Industrial Area, Karachi',
                creditDays: 30,
                creditLimitPkr: 10000000,
                rating: 4.8,
                totalSpendPkr: 18450000,
                activePosCount: 1,
                status: 'Approved'
            },
            {
                id: 'vnd-002',
                code: 'VND-0002',
                name: 'Atlas Copco Pakistan (Pvt) Ltd',
                category: 'Compressors & Heavy Machinery',
                ntn: '3109284-9',
                strn: '03-09-3109-284-18',
                fbrStatus: 'Active Taxpayer',
                contactPerson: 'Khurram Shehzad',
                designation: 'Key Account Executive',
                phone: '+92 321 4455890',
                email: 'khurram.shehzad@atlascopco.com',
                address: '14 Km, Raiwind Road, Lahore / Karachi Branch West Wharf',
                creditDays: 30,
                creditLimitPkr: 25000000,
                rating: 5.0,
                totalSpendPkr: 34200000,
                activePosCount: 1,
                status: 'Approved'
            },
            {
                id: 'vnd-003',
                code: 'VND-0003',
                name: 'Siemens Pakistan Engineering Co.',
                category: 'Electrical, Drives & Switchgear',
                ntn: '0710382-7',
                strn: '02-01-0710-382-17',
                fbrStatus: 'Active Taxpayer',
                contactPerson: 'Bilal Farooq',
                designation: 'Industrial Solutions Lead',
                phone: '+92 333 2199884',
                email: 'orders.pk@siemens.com',
                address: 'B-72, Estate Avenue, S.I.T.E., Karachi',
                creditDays: 15,
                creditLimitPkr: 15000000,
                rating: 4.9,
                totalSpendPkr: 22800000,
                activePosCount: 1,
                status: 'Approved'
            },
            {
                id: 'vnd-004',
                code: 'VND-0004',
                name: 'Diamond Supreme Insulation Ltd',
                category: 'Thermal & Acoustic Insulation',
                ntn: '1948201-5',
                strn: '12-00-1948-201-11',
                fbrStatus: 'Active Taxpayer',
                contactPerson: 'Rashid Khan',
                designation: 'Institutional Sales Officer',
                phone: '+92 301 8472901',
                email: 'rashid.sales@supremeinsulation.pk',
                address: 'Plot 18, Phase 2, Industrial Estate, Hattar / Warehouse Karachi',
                creditDays: 15,
                creditLimitPkr: 5000000,
                rating: 4.7,
                totalSpendPkr: 8900000,
                activePosCount: 1,
                status: 'Approved'
            },
            {
                id: 'vnd-005',
                code: 'VND-0005',
                name: 'Muller Pipes & Fittings Lahore',
                category: 'Copper Pipes & Refrigeration',
                ntn: '4091823-1',
                strn: '05-02-4091-823-14',
                fbrStatus: 'Active Taxpayer',
                contactPerson: 'Zubair Alvi',
                designation: 'Proprietor',
                phone: '+92 322 8901234',
                email: 'muller.copper@gmail.com',
                address: 'Shop 14, Brandreth Road, Lahore',
                creditDays: 15,
                creditLimitPkr: 4000000,
                rating: 4.6,
                totalSpendPkr: 6150000,
                activePosCount: 1,
                status: 'Approved'
            },
            {
                id: 'vnd-008',
                code: 'VND-0008',
                name: 'Karachi Fasteners & Hardware Mart',
                category: 'Bolts, Screws & Hardware',
                ntn: '1182740-4',
                strn: '11-04-1182-740-16',
                fbrStatus: 'Active Taxpayer',
                contactPerson: 'Muhammad Asif',
                designation: 'Manager Sales',
                phone: '+92 300 2345678',
                email: 'asif@karachifasteners.pk',
                address: 'Main Hardware Market, Saddar / SITE, Karachi',
                creditDays: 7,
                creditLimitPkr: 2000000,
                rating: 4.2,
                totalSpendPkr: 3400000,
                activePosCount: 1,
                status: 'UnderReview'
            }
        ]
    };

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error('Failed to parse procurement state', e);
        }
        return JSON.parse(JSON.stringify(defaultState));
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Failed to save procurement state', e);
        }
    }

    let state = loadState();

    // Contradiction Analysis Helper Engine
    function analyzeLineItemContradiction(poQty, poRate, grnQty, billQty, billRate) {
        const pQty = Number(poQty) || 0;
        const pRate = Number(poRate) || 0;
        const gQty = Number(grnQty) || 0;
        const bQty = Number(billQty) || 0;
        const bRate = Number(billRate) || 0;

        const qtyDiff = bQty - gQty;
        const isQtyOverbilled = bQty > gQty;
        const isMissingGrn = bQty > 0 && gQty === 0;
        
        const rateDiff = bRate - pRate;
        const rateVariancePct = pRate > 0 ? ((rateDiff / pRate) * 100) : 0;
        const isRateVariance = rateVariancePct > 1.0; // 1% threshold

        let status = 'MATCH';
        let contradictionType = 'None';

        if (isMissingGrn) {
            status = 'MISSING_GRN';
            contradictionType = `Missing GRN Receipt (${bQty} billed vs 0 received at warehouse)`;
        } else if (isQtyOverbilled && isRateVariance) {
            status = 'CRITICAL_CONTRADICTION';
            contradictionType = `Double Discrepancy: Qty Overbilled (+${qtyDiff}) & Unit Rate Inflation (+${rateVariancePct.toFixed(1)}%)`;
        } else if (isQtyOverbilled) {
            status = 'QTY_OVERBILLED';
            contradictionType = `Quantity Overbilled (+${qtyDiff} > Physical GRN inward of ${gQty})`;
        } else if (isRateVariance) {
            status = 'RATE_OVER_LIMIT';
            contradictionType = `Unit Price Discrepancy (+${rateVariancePct.toFixed(2)}% exceeds 1% PO contractual threshold)`;
        }

        const billedAmount = bQty * bRate;
        const legitimateAmount = Math.min(bQty, gQty) * pRate;
        const amountVariancePkr = Math.max(0, billedAmount - legitimateAmount);

        return {
            status,
            contradictionType,
            isQtyOverbilled,
            isRateVariance,
            isMissingGrn,
            qtyVariance: Math.max(0, qtyDiff),
            rateVariancePct: Math.round(rateVariancePct * 100) / 100,
            amountVariancePkr: Math.round(amountVariancePkr)
        };
    }

    return {
        getPurchaseOrders: () => state.purchaseOrders,
        getPurchaseOrderById: (id) => state.purchaseOrders.find(p => p.id === id || p.poNumber === id),
        getRfqs: () => state.rfqList,
        getGrns: () => state.grnList || [],
        getGrnByPo: (poNumber) => (state.grnList || []).filter(g => g.poNumber === poNumber),
        getThreeWayMatches: () => state.threeWayMatches,
        getThreeWayMatchById: (id) => state.threeWayMatches.find(m => m.id === id || m.matchCode === id),
        getCreditNotes: () => state.creditNotes || [],
        getVendors: () => state.vendors,
        getVendorById: (id) => state.vendors.find(v => v.id === id || v.code === id),

        analyzeLineItemContradiction,

        createPurchaseOrder: (poData) => {
            const newPo = {
                id: 'po-' + Date.now(),
                poNumber: 'PO-2026-0' + (state.purchaseOrders.length + 107),
                issueDate: new Date().toISOString().split('T')[0],
                status: 'Draft',
                reconciliationStatus: 'PendingAudit',
                currency: 'PKR',
                lines: [],
                subtotalPkr: 0,
                taxPkr: 0,
                totalPkr: 0,
                createdBy: 'procurement@cosmixengineering.com',
                approvedBy: null,
                ...poData
            };
            // Recalculate totals
            newPo.subtotalPkr = (newPo.lines || []).reduce((acc, l) => acc + (Number(l.totalPkr) || 0), 0);
            newPo.taxPkr = Math.round(newPo.subtotalPkr * 0.18);
            newPo.totalPkr = newPo.subtotalPkr + newPo.taxPkr;

            state.purchaseOrders.unshift(newPo);
            saveState(state);
            return newPo;
        },

        updatePoStatus: (poId, newStatus, approvedBy = null) => {
            const po = state.purchaseOrders.find(p => p.id === poId || p.poNumber === poId);
            if (po) {
                po.status = newStatus;
                if (approvedBy) po.approvedBy = approvedBy;
                saveState(state);
                return po;
            }
            return null;
        },

        // Perform full 3-Way Match evaluation and save
        evaluateAndCreateThreeWayMatch: (auditData) => {
            const { poNumber, grnNumber, deliveryChallanNo, vendorBillNumber, billDate, vendorId, vendorName, rawLines } = auditData;

            let totalPoAmt = 0;
            let totalGrnAmt = 0;
            let totalBillAmt = 0;
            let totalVariance = 0;
            let hasOverbilling = false;
            let hasRateVariance = false;
            let hasMissingGrn = false;

            const evaluatedLines = (rawLines || []).map(line => {
                const analysis = analyzeLineItemContradiction(
                    line.poQty,
                    line.poRate,
                    line.grnQty,
                    line.billQty,
                    line.billRate
                );

                if (analysis.isQtyOverbilled) hasOverbilling = true;
                if (analysis.isRateVariance) hasRateVariance = true;
                if (analysis.isMissingGrn) hasMissingGrn = true;

                const poLineTotal = (Number(line.poQty) || 0) * (Number(line.poRate) || 0);
                const grnLineTotal = (Number(line.grnQty) || 0) * (Number(line.poRate) || 0);
                const billLineTotal = (Number(line.billQty) || 0) * (Number(line.billRate) || 0);

                totalPoAmt += poLineTotal;
                totalGrnAmt += grnLineTotal;
                totalBillAmt += billLineTotal;
                totalVariance += analysis.amountVariancePkr;

                return {
                    itemCode: line.itemCode,
                    description: line.description,
                    uom: line.uom || 'Nos',
                    poQty: Number(line.poQty) || 0,
                    grnQty: Number(line.grnQty) || 0,
                    billQty: Number(line.billQty) || 0,
                    poRate: Number(line.poRate) || 0,
                    billRate: Number(line.billRate) || 0,
                    rateVariancePct: analysis.rateVariancePct,
                    qtyVariance: analysis.qtyVariance,
                    amountVariancePkr: analysis.amountVariancePkr,
                    status: analysis.status,
                    contradictionType: analysis.contradictionType
                };
            });

            // 18% Tax consideration
            const poWithTax = Math.round(totalPoAmt * 1.18);
            const grnWithTax = Math.round(totalGrnAmt * 1.18);
            const billWithTax = Math.round(totalBillAmt * 1.18);
            const varianceWithTax = Math.round(totalVariance * 1.18);

            let matchStatus = 'Matched';
            let summaryText = 'Zero Contradictions. Full 3-Pillar validation successful.';

            if (hasMissingGrn) {
                matchStatus = 'MissingGRN';
                summaryText = 'Contradiction: Line items billed with 0 physical GRN warehouse receipt.';
            } else if (hasOverbilling || hasRateVariance) {
                matchStatus = 'ContradictionDetected';
                summaryText = `Contradiction Detected: ${hasRateVariance ? 'Price variance >1% threshold. ' : ''}${hasOverbilling ? 'Quantity billed exceeds physical GRN inward.' : ''}`;
            }

            const matchSeq = (state.threeWayMatches.length + 105);
            const matchCode = `VB-MATCH-2026-0${matchSeq}`;

            const newMatch = {
                id: '3wm-' + Date.now(),
                matchCode: matchCode,
                poNumber: poNumber,
                grnNumber: grnNumber || 'GRN-PENDING',
                deliveryChallanNo: deliveryChallanNo || 'DC-DIRECT',
                vendorBillNumber: vendorBillNumber,
                vendorId: vendorId,
                vendorName: vendorName,
                billDate: billDate || new Date().toISOString().split('T')[0],
                poAmountPkr: poWithTax,
                grnAmountPkr: grnWithTax,
                billAmountPkr: billWithTax,
                variancePkr: varianceWithTax,
                status: matchStatus,
                contradictionSummary: summaryText,
                hasOverbilling: hasOverbilling,
                hasRateVariance: hasRateVariance,
                hasMissingGrn: hasMissingGrn,
                strnVerified: true,
                apVoucherCreated: false,
                apVoucherRef: null,
                apPostingRef: null,
                checkedBy: 'procurement@cosmixengineering.com',
                approvedBy: null,
                auditNotes: matchStatus === 'Matched' ? 'Automated 3-Way verification passed.' : 'Contradiction detected by SCM engine.',
                lineDetails: evaluatedLines
            };

            state.threeWayMatches.unshift(newMatch);

            // Update PO reconciliation status
            const po = state.purchaseOrders.find(p => p.poNumber === poNumber);
            if (po) {
                po.reconciliationStatus = matchStatus;
            }

            saveState(state);
            return newMatch;
        },

        // Action 1: Standard AP Voucher Generation for clean or verified matches
        approveMatchAndGenerateApVoucher: (matchId, approver = 'accounts@cosmixengineering.com') => {
            const item = state.threeWayMatches.find(m => m.id === matchId || m.matchCode === matchId);
            if (!item) return null;

            item.status = 'Matched';
            item.approvedBy = approver;
            item.apVoucherCreated = true;
            item.apVoucherRef = item.matchCode.replace('-REV', '').replace('-PEND', '');
            item.apPostingRef = 'AP-VOUCHER-' + Math.floor(1000 + Math.random() * 9000);
            item.auditNotes = `Authorized by ${approver}. Matched voucher ${item.apVoucherRef} committed to Accounts Payable Ledger.`;

            // Update PO status
            const po = state.purchaseOrders.find(p => p.poNumber === item.poNumber);
            if (po) {
                po.status = 'Invoiced';
                po.reconciliationStatus = 'Matched';
                // Update invoiced quantities on PO lines
                (item.lineDetails || []).forEach(l => {
                    const pol = po.lines.find(pl => pl.itemCode === l.itemCode);
                    if (pol) pol.qtyInvoiced = l.billQty;
                });
            }

            saveState(state);
            return item;
        },

        // Action 2: Approve with Variance Explanation / Cost Center Justification
        approveWithVarianceExplanation: (matchId, justification, costCenterHead = 'Head of MEP Operations', approver = 'management@cosmixengineering.com') => {
            const item = state.threeWayMatches.find(m => m.id === matchId || m.matchCode === matchId);
            if (!item) return null;

            item.status = 'ApprovedWithVariance';
            item.approvedBy = `${approver} (Endorsed by: ${costCenterHead})`;
            item.apVoucherCreated = true;
            item.apVoucherRef = item.matchCode + '-OVR';
            item.apPostingRef = 'AP-VOUCHER-' + Math.floor(1000 + Math.random() * 9000);
            item.auditNotes = `OVERRIDE JUSTIFICATION: "${justification}". Variance PKR ${item.variancePkr.toLocaleString()} authorized for payment by ${costCenterHead}.`;

            const po = state.purchaseOrders.find(p => p.poNumber === item.poNumber);
            if (po) {
                po.status = 'Invoiced';
                po.reconciliationStatus = 'ApprovedWithVariance';
            }

            saveState(state);
            return item;
        },

        // Action 3: Request Vendor Credit Note & Issue Debit Advice
        requestVendorCreditNote: (matchId, reason, adjustmentAmountPkr, requestedBy = 'procurement@cosmixengineering.com') => {
            const item = state.threeWayMatches.find(m => m.id === matchId || m.matchCode === matchId);
            if (!item) return null;

            const cnSeq = (state.creditNotes.length + 42);
            const dnSeq = (state.creditNotes.length + 19);
            const newCn = {
                id: 'cn-' + Date.now(),
                debitAdviceRef: `DN-2026-00${dnSeq}`,
                creditNoteRef: `CN-REQ-2026-00${cnSeq}`,
                matchCode: item.matchCode,
                vendorId: item.vendorId,
                vendorName: item.vendorName,
                poNumber: item.poNumber,
                invoiceNumber: item.vendorBillNumber,
                requestedDate: new Date().toISOString().split('T')[0],
                adjustmentAmountPkr: Number(adjustmentAmountPkr) || item.variancePkr,
                reason: reason || 'Contractual contradiction flagged during 3-Way Match validation.',
                status: 'Requested',
                requestedBy: requestedBy
            };

            if (!state.creditNotes) state.creditNotes = [];
            state.creditNotes.unshift(newCn);

            item.status = 'CreditNoteRequested';
            item.auditNotes = `Debit Advice ${newCn.debitAdviceRef} issued to supplier for PKR ${newCn.adjustmentAmountPkr.toLocaleString()}. Awaiting Vendor Credit Note ${newCn.creditNoteRef}.`;

            const po = state.purchaseOrders.find(p => p.poNumber === item.poNumber);
            if (po) {
                po.reconciliationStatus = 'CreditNoteRequested';
            }

            saveState(state);
            return { match: item, creditNote: newCn };
        },

        getSummaryStats: () => {
            const matches = state.threeWayMatches || [];
            const pos = state.purchaseOrders || [];

            const totalReconciledValuePkr = matches.reduce((acc, m) => acc + (m.apVoucherCreated ? m.billAmountPkr : 0), 0);
            const cleanMatchesCount = matches.filter(m => m.status === 'Matched').length;
            const contradictionCount = matches.filter(m => m.status === 'ContradictionDetected' || m.status === 'PriceVariance' || m.status === 'QuantityVariance').length;
            const missingGrnCount = matches.filter(m => m.status === 'MissingGRN').length;
            const blockedApAmountPkr = matches.filter(m => !m.apVoucherCreated && (m.variancePkr > 0 || m.status !== 'Matched')).reduce((acc, m) => acc + m.billAmountPkr, 0);

            return {
                totalMatches: matches.length,
                cleanMatchesCount,
                contradictionCount,
                missingGrnCount,
                totalReconciledValuePkr,
                blockedApAmountPkr,
                activePosCount: pos.length
            };
        },

        createVendor: (vendorData) => {
            const newVnd = {
                id: 'vnd-' + Date.now(),
                code: 'VND-00' + (state.vendors.length + 10),
                rating: 5.0,
                totalSpendPkr: 0,
                activePosCount: 0,
                status: 'Approved',
                fbrStatus: 'Active Taxpayer',
                ...vendorData
            };
            state.vendors.unshift(newVnd);
            saveState(state);
            return newVnd;
        },

        resetToDefaults: () => {
            state = JSON.parse(JSON.stringify(defaultState));
            saveState(state);
        }
    };
})();

window.CosmixProcurement = CosmixProcurement;
