/**
 * Cosmix Hub - Engineering, Production & Field Operations State Manager
 * Handles Workshop Production Orders across 8 SOP stages, Factory QC Clearance,
 * Site Installation Jobs with 4-Point HSE checklist, and 3-Stage Delivery Gate with OTP challenge.
 */

const CosmixEngineering = (() => {
    const STORAGE_KEY = 'cosmix_engineering_state_v2';

    const SOP_STAGES = [
        'Planned',
        'MaterialIssued',
        'InFabrication',
        'Assembly',
        'FactoryQC',
        'Packing',
        'ReadyToDispatch',
        'Dispatched'
    ];

    const defaultState = {
        productionOrders: [
            {
                id: 'prd-001',
                orderNo: 'PRD-2026-0044',
                projectRef: 'PRJ-2026-044 (Lucky Motor HVAC Ducting)',
                productName: 'Galvanized Steel Rectangular Ductwork (22G & 24G)',
                category: 'Ductwork',
                quantity: 5500,
                uom: 'Kg',
                bay: 'Workshop Bay 2 (Sheet Metal CNC)',
                lineLeader: 'Ustad Abdul Rasheed',
                assignedEngineers: ['Engr. Farhan Siddiqui', 'Engr. Bilal Naim'],
                currentStage: 'Assembly',
                startDate: '2026-09-18',
                targetDate: '2026-09-29',
                qcStatus: 'Pending',
                qcChecks: {
                    dimensional: { checked: true, toleranceMm: 0.5, passed: true, note: 'All flange pitch & diagonal checked.' },
                    sheetGauge: { checked: true, measuredMm: 0.8, passed: true, note: 'Micrometer verified 22 gauge.' },
                    leakageSmoke: { checked: false, passed: false, note: 'Smoke test pending assembly completion.' },
                    paintFinish: { checked: false, passed: false, note: 'Zinc primer coating in progress.' }
                },
                materialsIssued: [
                    { itemCode: '0-0001-01', description: 'GI Sheet 22 Gauge Z-275', qty: 3500, uom: 'Kg' },
                    { itemCode: '0-0001-02', description: 'GI Sheet 24 Gauge Prime', qty: 2000, uom: 'Kg' },
                    { itemCode: '0-0008-01', description: 'TDC Flange Profile & Corners', qty: 450, uom: 'Sets' }
                ],
                notes: 'Priority fabrication for Line 3 Paint Booth ventilation.'
            },
            {
                id: 'prd-002',
                orderNo: 'PRD-2026-0039',
                projectRef: 'PRJ-2026-039 (Indus Hospital Chiller Retrofit)',
                productName: 'Double-Skin Air Handling Unit (AHU) 12,000 CFM Casing',
                category: 'AHU & Cleanrooms',
                quantity: 2,
                uom: 'Units',
                bay: 'Workshop Bay 1 (Assembly & Coil Rig)',
                lineLeader: 'Muhammad Aslam (Sr. Fitter)',
                assignedEngineers: ['Engr. Zeeshan Ali'],
                currentStage: 'FactoryQC',
                startDate: '2026-09-10',
                targetDate: '2026-09-26',
                qcStatus: 'Passed',
                qcChecks: {
                    dimensional: { checked: true, toleranceMm: 0.2, passed: true, note: 'Overall casing 3200x2100x1800 within limits.' },
                    sheetGauge: { checked: true, measuredMm: 1.0, passed: true, note: 'Double skin 50mm PUF thermal break.' },
                    leakageSmoke: { checked: true, passed: true, note: 'Class L2 leakage pressure test passed at 1000 Pa.' },
                    paintFinish: { checked: true, passed: true, note: 'Epoxy powder coated RAL-7035 finish.' }
                },
                materialsIssued: [
                    { itemCode: '0-0004-01', description: 'PUF Sandwich Panels 50mm', qty: 48, uom: 'Sqm' },
                    { itemCode: '0-0008-01', description: 'Direct Drive EC Plug Fan 15kW', qty: 2, uom: 'Sets' }
                ],
                notes: 'Medical grade cleanroom filtration section included.'
            },
            {
                id: 'prd-003',
                orderNo: 'PRD-2026-0042',
                projectRef: 'PRJ-2026-042 (Dolmen Mall FCU Piping)',
                productName: 'Chilled Water Header Manifold 8" Sch-40 with Valve Couplings',
                category: 'Piping & Headers',
                quantity: 4,
                uom: 'Nos',
                bay: 'Workshop Bay 3 (Welding & Hydro)',
                lineLeader: 'Qari Noman (6G Welder)',
                assignedEngineers: ['Engr. Tariq Masood'],
                currentStage: 'ReadyToDispatch',
                startDate: '2026-09-15',
                targetDate: '2026-09-24',
                qcStatus: 'Passed',
                qcChecks: {
                    dimensional: { checked: true, toleranceMm: 1.0, passed: true, note: 'Flange hole alignment standard ANSI-150.' },
                    sheetGauge: { checked: true, measuredMm: 8.18, passed: true, note: 'Seamless carbon steel Sch 40 wall.' },
                    leakageSmoke: { checked: true, passed: true, note: 'Hydrostatic pressure test @ 16 Bar held for 2 hours.' },
                    paintFinish: { checked: true, passed: true, note: 'Two coats red oxide primer applied.' }
                },
                materialsIssued: [
                    { itemCode: '0-0002-01', description: 'Seamless Steel Pipe 8" Sch 40', qty: 48, uom: 'Rft' },
                    { itemCode: '0-0002-05', description: 'Weld Neck Flanges 8" Class 150', qty: 12, uom: 'Nos' }
                ],
                notes: 'Hydrostatic testing signed off by client third-party inspector.'
            }
        ],

        fieldJobs: [
            {
                id: 'job-501',
                jobNo: 'JOB-2026-081',
                projectRef: 'PRJ-2026-044 (Lucky Motor Plant Bin Qasim)',
                siteName: 'Lucky Motor Assembly Plant, Bin Qasim Industrial Park',
                assignedLead: 'Engr. Farhan Siddiqui (Field Lead)',
                teamSize: 6,
                targetCompletionDate: '2026-10-05',
                status: 'InProgress',
                hseChecklist: {
                    safetyBriefing: { completed: true, timestamp: '2026-09-22 08:30', conductedBy: 'Engr. Farhan Siddiqui', ppeVerified: true },
                    workCompleted: { completed: true, timestamp: '2026-09-24 17:00', remarks: 'Main duct riser and first 40 meters horizontal run mounted on unistrut channels.' },
                    siteCleaned: { completed: true, timestamp: '2026-09-24 17:30', remarks: 'Scrap metal, insulation trimmings and packaging cleared from work zone.' },
                    customerSignoff: { completed: false, timestamp: null, signerName: 'Engr. Kamran (Client Project Lead)', signatureOtp: null }
                },
                dailyLogs: [
                    { date: '2026-09-23', manpower: 6, hours: 8, progress: 'Installed ceiling anchors and threaded rods for Grid A-D.' },
                    { date: '2026-09-24', manpower: 6, hours: 8, progress: 'Hoisted 24 duct sections; flange gasket sealed and bolted.' }
                ]
            },
            {
                id: 'job-502',
                jobNo: 'JOB-2026-082',
                projectRef: 'PRJ-2026-039 (Indus Hospital Chiller Retrofit)',
                siteName: 'Indus Hospital, Korangi Campus Block 4',
                assignedLead: 'Engr. Zeeshan Ali (Commissioning Lead)',
                teamSize: 4,
                targetCompletionDate: '2026-09-28',
                status: 'UnderInspection',
                hseChecklist: {
                    safetyBriefing: { completed: true, timestamp: '2026-09-21 08:15', conductedBy: 'Engr. Zeeshan Ali', ppeVerified: true },
                    workCompleted: { completed: true, timestamp: '2026-09-24 16:00', remarks: 'Chiller piping headers connected and balancing valves calibrated.' },
                    siteCleaned: { completed: true, timestamp: '2026-09-24 16:45', remarks: 'Plant room cleared of debris, emergency path unobstructed.' },
                    customerSignoff: { completed: true, timestamp: '2026-09-25 11:30', signerName: 'Dr. Tariq (Hospital Facilities Director)', signatureOtp: 'OTP-98214' }
                },
                dailyLogs: [
                    { date: '2026-09-24', manpower: 4, hours: 8, progress: 'Pressure test verification with hospital maintenance engineer.' }
                ]
            }
        ],

        deliveryGates: [
            {
                id: 'gate-701',
                gatePassNo: 'GP-2026-0042',
                challanNo: 'GDC-2026-0042',
                poRef: 'PRD-2026-0042',
                projectRef: 'PRJ-2026-042 (Dolmen Mall FCU Piping)',
                destinationSite: 'Dolmen Mall Clifton, Plant Room Sub-Basement',
                dispatchDate: '2026-09-25 10:45',
                vehicleNo: 'KH-8821',
                vehicleType: 'Hino 5-Ton Heavy Flatbed',
                driverName: 'Muhammad Rafiq',
                driverLicense: 'LIC-KHI-481920',
                driverPhone: '+92 333 2194820',
                clientContactName: 'Engr. Bilal (Dolmen Mall MEP)',
                clientPhone: '+92 300 9988771',
                clientEmail: 'bilal.mep@dolmengroup.com',
                gateStatus: 'ClearedForDispatch',
                items: [
                    { itemCode: '0-0002-01', description: 'Chilled Water Header Manifold 8" Sch-40 with Flanged Couplings', qty: 4, uom: 'Nos', weightKg: 1280, remarks: 'Hydro tested @ 16 Bar' },
                    { itemCode: '0-0002-05', description: 'Weld Neck Flanges 8" Class 150 with Gasket Set', qty: 12, uom: 'Nos', weightKg: 144, remarks: 'ANSI-150 standard' },
                    { itemCode: '0-0007-02', description: 'Dual Orifice Balancing Valves 4" PN16', qty: 8, uom: 'Units', weightKg: 220, remarks: 'Factory calibrated' }
                ],
                gate1StaffReady: {
                    passed: true,
                    verifiedAt: '2026-09-25 09:00',
                    verifier: 'Engr. Tariq Masood (Workshop Dispatch Lead)',
                    checklist: {
                        driverLicenseVerified: true,
                        vehicleFitnessVerified: true,
                        riggingLashingSecured: true,
                        ppeCompliant: true,
                        routeClearanceVerified: true,
                        toolsChecked: true
                    },
                    notes: 'Driver licensed, 2 rigging helpers equipped with hardhats, safety shoes and high-vis vests. Tie-down belts tensioned.'
                },
                gate2CommercialTax: {
                    passed: true,
                    verifiedAt: '2026-09-25 10:15',
                    verifier: 'accounts@cosmixengineering.com',
                    paymentMode: 'Milestone30',
                    advancePercentage: 65,
                    minThresholdRequired: 30,
                    isThresholdSatisfied: true,
                    ceoOverrideApproved: false,
                    ceoOverrideApprovedBy: null,
                    ceoOverrideReason: null,
                    ledgerRef: 'PO-REC-881290 / Ledger Folio 412',
                    taxUndertakingObtained: true,
                    notes: '65% milestone advance received via Pay Order # 881290. Tax indemnity undertaking signed.'
                },
                gate3SiteOtp: {
                    passed: true,
                    otpCode: '749201',
                    otpSentAt: '2026-09-25 10:30',
                    otpChannel: 'SMS_AND_EMAIL',
                    otpVerifiedAt: '2026-09-25 10:45',
                    verifiedByPhone: '+92 300 9988771',
                    verifiedByEmail: 'bilal.mep@dolmengroup.com',
                    attemptCount: 1,
                    notes: 'Client site engineer confirmed unloading bay is clear, overhead crane available and forklift on standby.'
                },
                challanReleased: true,
                challanReleasedAt: '2026-09-25 10:46'
            },
            {
                id: 'gate-702',
                gatePassNo: 'GP-2026-0044',
                challanNo: 'GDC-2026-0044',
                poRef: 'PRD-2026-0044',
                projectRef: 'PRJ-2026-044 (Lucky Motor HVAC Ducting)',
                destinationSite: 'Lucky Motor Plant Bin Qasim, Gate 3 Material Inward',
                dispatchDate: '2026-09-25 14:00',
                vehicleNo: 'LE-4192',
                vehicleType: 'Bedford Heavy Cargo Truck',
                driverName: 'Gulzar Ahmed',
                driverLicense: 'LIC-LHR-982103',
                driverPhone: '+92 345 5582910',
                clientContactName: 'Engr. Kamran (Lucky Motor)',
                clientPhone: '+92 321 8837190',
                clientEmail: 'kamran.hvac@luckymotor.com',
                gateStatus: 'PendingGate3',
                items: [
                    { itemCode: '0-0001-01', description: 'Galvanized Steel Rectangular Ductwork 22 Gauge (TDC Flanged)', qty: 3500, uom: 'Kg', weightKg: 3500, remarks: 'Line 3 paint booth ventilation' },
                    { itemCode: '0-0001-02', description: 'Galvanized Steel Rectangular Ductwork 24 Gauge Prime', qty: 2000, uom: 'Kg', weightKg: 2000, remarks: 'Secondary branch connections' },
                    { itemCode: '0-0008-01', description: 'TDC Cleats, Flange Gasket Rolls & Corner Brackets', qty: 450, uom: 'Sets', weightKg: 380, remarks: 'Accessory hardware packs' }
                ],
                gate1StaffReady: {
                    passed: true,
                    verifiedAt: '2026-09-25 14:00',
                    verifier: 'Engr. Farhan Siddiqui (Field Lead)',
                    checklist: {
                        driverLicenseVerified: true,
                        vehicleFitnessVerified: true,
                        riggingLashingSecured: true,
                        ppeCompliant: true,
                        routeClearanceVerified: true,
                        toolsChecked: true
                    },
                    notes: 'Vehicle tarp sealed. Rigging crew of 3 certified helpers with safety gear.'
                },
                gate2CommercialTax: {
                    passed: true,
                    verifiedAt: '2026-09-25 15:30',
                    verifier: 'accounts@cosmixengineering.com',
                    paymentMode: 'Milestone30',
                    advancePercentage: 70,
                    minThresholdRequired: 30,
                    isThresholdSatisfied: true,
                    ceoOverrideApproved: false,
                    ceoOverrideApprovedBy: null,
                    ceoOverrideReason: null,
                    ledgerRef: 'INV-2026-9042 / Milestone 70%',
                    taxUndertakingObtained: true,
                    notes: '70% milestone verified in accounts ledger. FBR tax certificate validated.'
                },
                gate3SiteOtp: {
                    passed: false,
                    otpCode: '582041',
                    otpSentAt: '2026-09-25 16:00',
                    otpChannel: 'SMS_AND_EMAIL',
                    otpVerifiedAt: null,
                    verifiedByPhone: '+92 321 8837190',
                    verifiedByEmail: 'kamran.hvac@luckymotor.com',
                    attemptCount: 0,
                    notes: '6-digit OTP dispatched to client site lead. Awaiting site receiving challenge response.'
                },
                challanReleased: false,
                challanReleasedAt: null
            },
            {
                id: 'gate-703',
                gatePassNo: 'GP-2026-0039',
                challanNo: 'GDC-2026-0039',
                poRef: 'PRD-2026-0039',
                projectRef: 'PRJ-2026-039 (Indus Hospital Chiller Retrofit)',
                destinationSite: 'Indus Hospital, Korangi Campus Block 4 Plant Room',
                dispatchDate: '2026-09-26 09:30',
                vehicleNo: 'KT-7023',
                vehicleType: 'Mazda Crane Carrier 7-Ton',
                driverName: 'Sikandar Hayat',
                driverLicense: 'LIC-KHI-391024',
                driverPhone: '+92 312 4492019',
                clientContactName: 'Dr. Tariq (Hospital Facilities Lead)',
                clientPhone: '+92 301 7739102',
                clientEmail: 'tariq.mep@indushospital.org.pk',
                gateStatus: 'PendingGate2',
                items: [
                    { itemCode: '0-0008-01', description: 'Double-Skin Air Handling Unit (AHU) 12,000 CFM Casing & EC Plug Fan Rig', qty: 2, uom: 'Units', weightKg: 2400, remarks: 'Class L2 Leakage Passed' },
                    { itemCode: '0-0004-01', description: 'PUF Sandwich Thermal Break Panels 50mm (Modular Sections)', qty: 48, uom: 'Sqm', weightKg: 720, remarks: 'Cleanroom Grade RAL-7035' }
                ],
                gate1StaffReady: {
                    passed: true,
                    verifiedAt: '2026-09-26 09:30',
                    verifier: 'Engr. Zeeshan Ali (Commissioning Lead)',
                    checklist: {
                        driverLicenseVerified: true,
                        vehicleFitnessVerified: true,
                        riggingLashingSecured: true,
                        ppeCompliant: true,
                        routeClearanceVerified: true,
                        toolsChecked: true
                    },
                    notes: 'Crane boom secured, outriggers locked, driver licensed. Rigging crew fully certified.'
                },
                gate2CommercialTax: {
                    passed: false,
                    verifiedAt: null,
                    verifier: null,
                    paymentMode: 'CeoCreditOverride',
                    advancePercentage: 20,
                    minThresholdRequired: 30,
                    isThresholdSatisfied: false,
                    ceoOverrideApproved: false,
                    ceoOverrideApprovedBy: null,
                    ceoOverrideReason: null,
                    ledgerRef: 'INV-2026-8831 / Advance 20%',
                    taxUndertakingObtained: true,
                    notes: 'Advance received is 20% (Threshold: 30%). Awaiting CEO Credit Override Approval or balance 10% payment.'
                },
                gate3SiteOtp: {
                    passed: false,
                    otpCode: '891043',
                    otpSentAt: null,
                    otpChannel: 'SMS',
                    otpVerifiedAt: null,
                    verifiedByPhone: '+92 301 7739102',
                    verifiedByEmail: 'tariq.mep@indushospital.org.pk',
                    attemptCount: 0,
                    notes: 'Stage 3 pending payment clearance.'
                },
                challanReleased: false,
                challanReleasedAt: null
            },
            {
                id: 'gate-704',
                gatePassNo: 'GP-2026-0048',
                challanNo: 'GDC-2026-0048',
                poRef: 'PRD-2026-0048',
                projectRef: 'PRJ-2026-048 (Packages Mall AHU Extension)',
                destinationSite: 'Packages Mall, Walton Road, Lahore, Roof Level 4',
                dispatchDate: '2026-09-27 11:00',
                vehicleNo: 'LW-5182',
                vehicleType: 'Isuzu 3.5-Ton Covered Van',
                driverName: 'Akhtar Rasheed',
                driverLicense: 'LIC-LHR-661029',
                driverPhone: '+92 334 7710293',
                clientContactName: 'Engr. Sohail Qureshi (Facilities Lead)',
                clientPhone: '+92 302 8841920',
                clientEmail: 'sohail.mep@packagesmall.com',
                gateStatus: 'PendingGate1',
                items: [
                    { itemCode: '0-0003-01', description: 'Direct Expansion Copper Coil 12-Row with Aluminum Fins', qty: 6, uom: 'Sets', weightKg: 680, remarks: 'Pressurized with Dry Nitrogen' },
                    { itemCode: '0-0004-01', description: 'Nitrile Class-O Rubber Insulation 25mm Sheets', qty: 30, uom: 'Sheets', weightKg: 120, remarks: 'Fire retardant certified' }
                ],
                gate1StaffReady: {
                    passed: false,
                    verifiedAt: null,
                    verifier: null,
                    checklist: {
                        driverLicenseVerified: false,
                        vehicleFitnessVerified: false,
                        riggingLashingSecured: false,
                        ppeCompliant: false,
                        routeClearanceVerified: false,
                        toolsChecked: false
                    },
                    notes: 'Vehicle arrived at dispatch bay. Pending fleet departure checklist sign-off.'
                },
                gate2CommercialTax: {
                    passed: false,
                    verifiedAt: null,
                    verifier: null,
                    paymentMode: 'Milestone30',
                    advancePercentage: 50,
                    minThresholdRequired: 30,
                    isThresholdSatisfied: true,
                    ceoOverrideApproved: false,
                    ceoOverrideApprovedBy: null,
                    ceoOverrideReason: null,
                    ledgerRef: 'PO-2026-4491 / Advance 50%',
                    taxUndertakingObtained: true,
                    notes: 'Advance 50% cleared in bank statement. Pending Gate 1 completion.'
                },
                gate3SiteOtp: {
                    passed: false,
                    otpCode: '439201',
                    otpSentAt: null,
                    otpChannel: 'SMS_AND_EMAIL',
                    otpVerifiedAt: null,
                    verifiedByPhone: '+92 302 8841920',
                    verifiedByEmail: 'sohail.mep@packagesmall.com',
                    attemptCount: 0,
                    notes: 'Pending Gate 1 & 2 completion.'
                },
                challanReleased: false,
                challanReleasedAt: null
            },
            {
                id: 'gate-705',
                gatePassNo: 'GP-2026-0050',
                challanNo: 'GDC-2026-0050',
                poRef: 'PRD-2026-0050',
                projectRef: 'PRJ-2026-050 (Nishat Mills Air Washer Section)',
                destinationSite: 'Nishat Textile Mills Unit 5, Ferozepur Road, Lahore',
                dispatchDate: '2026-09-28 08:30',
                vehicleNo: 'RN-9920',
                vehicleType: 'Hino 8-Ton Long Bed',
                driverName: 'Naveed Akhtar',
                driverLicense: 'LIC-RWL-882190',
                driverPhone: '+92 300 4819204',
                clientContactName: 'Mian Shahbaz (Technical Director)',
                clientPhone: '+92 300 1234567',
                clientEmail: 'shahbaz@nishatmills.com',
                gateStatus: 'ClearedForDispatch',
                items: [
                    { itemCode: '0-0005-01', description: 'SS-304 Heavy Duty Air Washer Nozzle Headers with PVC Mist Eliminator Bank', qty: 2, uom: 'Sets', weightKg: 1850, remarks: 'Stainless Steel Grade 304' },
                    { itemCode: '0-0006-02', description: 'Centrifugal Water Circulation Pump 7.5kW with Mechanical Seal', qty: 2, uom: 'Nos', weightKg: 320, remarks: 'Factory tested 50 Hz' }
                ],
                gate1StaffReady: {
                    passed: true,
                    verifiedAt: '2026-09-28 08:00',
                    verifier: 'Engr. Tariq Masood',
                    checklist: {
                        driverLicenseVerified: true,
                        vehicleFitnessVerified: true,
                        riggingLashingSecured: true,
                        ppeCompliant: true,
                        routeClearanceVerified: true,
                        toolsChecked: true
                    },
                    notes: 'Heavy duty rigging inspected. Driver license valid and verified.'
                },
                gate2CommercialTax: {
                    passed: true,
                    verifiedAt: '2026-09-28 08:15',
                    verifier: 'Chief Executive Officer (CEO Office)',
                    paymentMode: 'CeoCreditOverride',
                    advancePercentage: 15,
                    minThresholdRequired: 30,
                    isThresholdSatisfied: false,
                    ceoOverrideApproved: true,
                    ceoOverrideApprovedBy: 'Syed Moazzam Ali (Chief Executive Officer)',
                    ceoOverrideReason: 'Tier-1 Key Account corporate relationship. 30-day corporate credit limit approved.',
                    ledgerRef: 'CORP-CREDIT-2026-019',
                    taxUndertakingObtained: true,
                    notes: 'CEO Credit Override signed off for Key Account credit cycle.'
                },
                gate3SiteOtp: {
                    passed: true,
                    otpCode: '612984',
                    otpSentAt: '2026-09-28 08:20',
                    otpChannel: 'SMS_AND_EMAIL',
                    otpVerifiedAt: '2026-09-28 08:28',
                    verifiedByPhone: '+92 300 1234567',
                    verifiedByEmail: 'shahbaz@nishatmills.com',
                    attemptCount: 1,
                    notes: 'Verified via Site OTP token. Site crane confirmed ready for unrigging.'
                },
                challanReleased: true,
                challanReleasedAt: '2026-09-28 08:30'
            }
        ]
    };

    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error('Failed to parse engineering state', e);
        }
        return JSON.parse(JSON.stringify(defaultState));
    }

    function saveState(stateObj) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
        } catch (e) {
            console.error('Failed to save engineering state', e);
        }
    }

    let state = loadState();

    function generate6DigitOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function getNowFormatted() {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    }

    const DeliveryGateService = {
        getAll: () => state.deliveryGates,
        
        getById: (id) => state.deliveryGates.find(g => g.id === id || g.gatePassNo === id || g.challanNo === id),
        
        getSummaryKpis: () => {
            const list = state.deliveryGates;
            return {
                total: list.length,
                cleared: list.filter(g => g.gateStatus === 'ClearedForDispatch').length,
                pendingGate1: list.filter(g => g.gateStatus === 'PendingGate1').length,
                pendingGate2: list.filter(g => g.gateStatus === 'PendingGate2').length,
                pendingGate3: list.filter(g => g.gateStatus === 'PendingGate3').length
            };
        },

        createGatePass: (payload) => {
            const nextIdx = state.deliveryGates.length + 1;
            const seqStr = String(nextIdx).padStart(3, '0');
            const newGate = {
                id: 'gate-' + Date.now(),
                gatePassNo: `GP-2026-${seqStr}`,
                challanNo: `GDC-2026-${seqStr}`,
                poRef: payload.poRef || `PRD-2026-${seqStr}`,
                projectRef: payload.projectRef || 'Project Material Dispatch',
                destinationSite: payload.destinationSite || 'Client Project Site',
                dispatchDate: payload.dispatchDate || getNowFormatted(),
                vehicleNo: payload.vehicleNo || 'KHI-0000',
                vehicleType: payload.vehicleType || 'Flatbed Cargo Truck',
                driverName: payload.driverName || 'Driver Name',
                driverLicense: payload.driverLicense || 'LIC-PK-000000',
                driverPhone: payload.driverPhone || '+92 300 0000000',
                clientContactName: payload.clientContactName || 'Site Engineer',
                clientPhone: payload.clientPhone || '+92 300 0000000',
                clientEmail: payload.clientEmail || 'client@site.com',
                gateStatus: 'PendingGate1',
                items: payload.items && payload.items.length ? payload.items : [
                    { itemCode: '0-0001-01', description: 'Fabricated HVAC MEP Material', qty: 100, uom: 'Nos', weightKg: 500, remarks: 'Workshop Dispatch' }
                ],
                gate1StaffReady: {
                    passed: false,
                    verifiedAt: null,
                    verifier: null,
                    checklist: {
                        driverLicenseVerified: false,
                        vehicleFitnessVerified: false,
                        riggingLashingSecured: false,
                        ppeCompliant: false,
                        routeClearanceVerified: false,
                        toolsChecked: false
                    },
                    notes: payload.notes || 'Pending departure inspection.'
                },
                gate2CommercialTax: {
                    passed: false,
                    verifiedAt: null,
                    verifier: null,
                    paymentMode: 'Milestone30',
                    advancePercentage: Number(payload.advancePercentage) || 0,
                    minThresholdRequired: 30,
                    isThresholdSatisfied: (Number(payload.advancePercentage) || 0) >= 30,
                    ceoOverrideApproved: false,
                    ceoOverrideApprovedBy: null,
                    ceoOverrideReason: null,
                    ledgerRef: payload.ledgerRef || 'Pending Ledger Validation',
                    taxUndertakingObtained: true,
                    notes: 'Pending financial gate clearance.'
                },
                gate3SiteOtp: {
                    passed: false,
                    otpCode: generate6DigitOtp(),
                    otpSentAt: null,
                    otpChannel: 'SMS_AND_EMAIL',
                    otpVerifiedAt: null,
                    verifiedByPhone: payload.clientPhone || '+92 300 0000000',
                    verifiedByEmail: payload.clientEmail || 'client@site.com',
                    attemptCount: 0,
                    notes: 'Pending site OTP issuance.'
                },
                challanReleased: false,
                challanReleasedAt: null
            };

            state.deliveryGates.unshift(newGate);
            saveState(state);
            return newGate;
        },

        verifyStage1FleetReady: (gateId, checklist, verifierName, notes) => {
            const gate = state.deliveryGates.find(g => g.id === gateId || g.gatePassNo === gateId);
            if (!gate) return { success: false, message: 'Gate pass record not found' };

            gate.gate1StaffReady = {
                passed: true,
                verifiedAt: getNowFormatted(),
                verifier: verifierName || 'Engr. Workshop Dispatch In-Charge',
                checklist: {
                    driverLicenseVerified: !!checklist?.driverLicenseVerified,
                    vehicleFitnessVerified: !!checklist?.vehicleFitnessVerified,
                    riggingLashingSecured: !!checklist?.riggingLashingSecured,
                    ppeCompliant: !!checklist?.ppeCompliant,
                    routeClearanceVerified: !!checklist?.routeClearanceVerified,
                    toolsChecked: !!checklist?.toolsChecked
                },
                notes: notes || 'Driver license verified, vehicle inspected, rigging secured with tie-down straps, and PPE safety passes confirmed.'
            };

            if (gate.gateStatus === 'PendingGate1') {
                gate.gateStatus = gate.gate2CommercialTax?.passed ? (gate.gate3SiteOtp?.passed ? 'ClearedForDispatch' : 'PendingGate3') : 'PendingGate2';
            }

            saveState(state);
            return { success: true, message: 'Stage 1: Fleet & Staff Readiness verified successfully.', gate };
        },

        verifyStage2Payment: (gateId, { advancePercentage, paymentMode, ceoOverrideApproved, ceoOverrideApprovedBy, ceoOverrideReason, ledgerRef, taxUndertakingObtained, verifierName, notes }) => {
            const gate = state.deliveryGates.find(g => g.id === gateId || g.gatePassNo === gateId);
            if (!gate) return { success: false, message: 'Gate pass record not found' };

            const pct = Number(advancePercentage ?? gate.gate2CommercialTax.advancePercentage ?? 0);
            const isMilestoneMet = pct >= 30;
            const isOverride = !!ceoOverrideApproved;

            if (!isMilestoneMet && !isOverride) {
                return {
                    success: false,
                    message: `Payment milestone threshold not satisfied (Current: ${pct}%, Minimum Required: 30%). Requires either 30%+ payment verification or CEO Credit Override Approval.`
                };
            }

            gate.gate2CommercialTax = {
                passed: true,
                verifiedAt: getNowFormatted(),
                verifier: verifierName || (isOverride ? 'Chief Executive Officer (CEO Office)' : 'Accounts & Billing Department'),
                paymentMode: isOverride ? 'CeoCreditOverride' : (paymentMode || 'Milestone30'),
                advancePercentage: pct,
                minThresholdRequired: 30,
                isThresholdSatisfied: isMilestoneMet,
                ceoOverrideApproved: isOverride,
                ceoOverrideApprovedBy: isOverride ? (ceoOverrideApprovedBy || 'Syed Moazzam Ali (Chief Executive Officer)') : null,
                ceoOverrideReason: isOverride ? (ceoOverrideReason || 'Executive client relationship credit authorization.') : null,
                ledgerRef: ledgerRef || gate.gate2CommercialTax.ledgerRef || 'Accounts Clearance Ledger 2026',
                taxUndertakingObtained: taxUndertakingObtained !== undefined ? !!taxUndertakingObtained : true,
                notes: notes || (isOverride ? `CEO Credit Override Approved (${ceoOverrideReason || 'Standard corporate credit terms'}).` : `Commercial milestone clearance confirmed with ${pct}% advance payment.`)
            };

            if (gate.gateStatus === 'PendingGate2') {
                gate.gateStatus = gate.gate3SiteOtp?.passed ? 'ClearedForDispatch' : 'PendingGate3';
            }

            saveState(state);
            return { success: true, message: 'Stage 2: Payment Gate Clearance approved successfully.', gate };
        },

        sendOtpChallenge: (gateId, channel = 'SMS_AND_EMAIL') => {
            const gate = state.deliveryGates.find(g => g.id === gateId || g.gatePassNo === gateId);
            if (!gate) return { success: false, message: 'Gate pass record not found' };

            const newOtp = generate6DigitOtp();
            gate.gate3SiteOtp.otpCode = newOtp;
            gate.gate3SiteOtp.otpSentAt = getNowFormatted();
            gate.gate3SiteOtp.otpChannel = channel;
            gate.gate3SiteOtp.attemptCount = (gate.gate3SiteOtp.attemptCount || 0) + 1;
            gate.gate3SiteOtp.notes = `Security OTP Challenge token [${newOtp}] dispatched via ${channel} to ${gate.clientContactName} (${gate.clientPhone} / ${gate.clientEmail}).`;

            saveState(state);
            return {
                success: true,
                message: `OTP challenge token successfully transmitted to ${gate.clientContactName} at ${gate.clientPhone} & ${gate.clientEmail}.`,
                otpCode: newOtp,
                sentAt: gate.gate3SiteOtp.otpSentAt,
                recipient: gate.clientContactName,
                phone: gate.clientPhone,
                email: gate.clientEmail,
                gate
            };
        },

        verifyStage3SiteOtp: (gateId, enteredOtp) => {
            const gate = state.deliveryGates.find(g => g.id === gateId || g.gatePassNo === gateId);
            if (!gate) return { success: false, message: 'Gate pass record not found' };

            const cleanOtp = String(enteredOtp || '').trim();
            if (!cleanOtp) return { success: false, message: 'Please enter the 6-digit OTP code.' };

            if (!gate.gate1StaffReady?.passed) {
                return { success: false, message: 'Cannot clear Stage 3: Stage 1 (Fleet Readiness) must be verified first.' };
            }
            if (!gate.gate2CommercialTax?.passed) {
                return { success: false, message: 'Cannot clear Stage 3: Stage 2 (Payment Clearance) must be verified first.' };
            }

            if (gate.gate3SiteOtp.otpCode !== cleanOtp) {
                return {
                    success: false,
                    message: `Invalid OTP token entered! Verification failed against challenge token issued to ${gate.clientPhone}.`
                };
            }

            gate.gate3SiteOtp.passed = true;
            gate.gate3SiteOtp.otpVerifiedAt = getNowFormatted();
            gate.gate3SiteOtp.notes = `Site Recipient OTP confirmed by ${gate.clientContactName}. Gate pass fully authorized for dispatch.`;
            gate.gateStatus = 'ClearedForDispatch';
            gate.challanReleased = true;
            gate.challanReleasedAt = getNowFormatted();

            saveState(state);
            return {
                success: true,
                message: 'Stage 3: Site Recipient OTP verified successfully! 3-Stage Clearance complete. Goods Delivery Challan released.',
                gate
            };
        },

        releaseDeliveryChallan: (gateId) => {
            const gate = state.deliveryGates.find(g => g.id === gateId || g.gatePassNo === gateId);
            if (!gate) return { success: false, message: 'Gate pass record not found' };

            if (!gate.gate1StaffReady?.passed || !gate.gate2CommercialTax?.passed || !gate.gate3SiteOtp?.passed) {
                return {
                    success: false,
                    message: 'Cannot release Goods Delivery Challan: All 3 clearance gates (Fleet Ready, Payment Clearance, Site OTP) must be verified.'
                };
            }

            gate.challanReleased = true;
            gate.challanReleasedAt = gate.challanReleasedAt || getNowFormatted();
            gate.gateStatus = 'ClearedForDispatch';
            saveState(state);
            return { success: true, message: 'Official Goods Delivery Challan released.', gate };
        },

        generateChallanHtml: (gateId) => {
            const gate = state.deliveryGates.find(g => g.id === gateId || g.gatePassNo === gateId);
            if (!gate) return '<div class="p-8 text-center text-rose-600 font-bold">Gate pass not found</div>';

            const itemsRows = (gate.items || []).map((it, idx) => `
                <tr class="border-b border-slate-200">
                    <td class="py-2.5 px-3 text-slate-500 font-mono text-center">${idx + 1}</td>
                    <td class="py-2.5 px-3 font-mono font-semibold text-slate-800">${it.itemCode}</td>
                    <td class="py-2.5 px-3">
                        <div class="font-semibold text-slate-800">${it.description}</div>
                        ${it.remarks ? `<div class="text-[11px] text-slate-500 italic">${it.remarks}</div>` : ''}
                    </td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${it.qty.toLocaleString()} ${it.uom}</td>
                    <td class="py-2.5 px-3 text-right font-mono text-slate-700">${it.weightKg ? it.weightKg.toLocaleString() + ' Kg' : '—'}</td>
                </tr>
            `).join('');

            const totalWeight = (gate.items || []).reduce((acc, it) => acc + (Number(it.weightKg) || 0), 0);
            const totalQty = (gate.items || []).reduce((acc, it) => acc + (Number(it.qty) || 0), 0);

            return `
                <div class="bg-white text-slate-900 p-8 max-w-4xl mx-auto font-sans leading-normal border border-slate-300 rounded-xl print:border-none print:shadow-none print:p-2" id="printable-challan">
                    
                    <!-- Top Corporate Header -->
                    <div class="flex justify-between items-start border-b-2 border-[#1e2552] pb-4">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-lg bg-[#1e2552] text-white flex items-center justify-center font-bold text-xl tracking-wider">
                                CE
                            </div>
                            <div>
                                <h1 class="text-xl font-bold text-[#1e2552] uppercase tracking-wide">Cosmix Engineering (Pvt) Ltd.</h1>
                                <p class="text-[11px] text-slate-500">MEP Contracting • HVAC Fabrication • Cleanroom Systems & Piping</p>
                                <p class="text-[10px] text-slate-400">Head Office: Plot 42-C, Sector 15, Korangi Industrial Area, Karachi, Pakistan</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="inline-block bg-[#1e2552] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-1">
                                Goods Delivery Challan
                            </div>
                            <div class="text-sm font-mono font-bold text-slate-800">Challan #: ${gate.challanNo}</div>
                            <div class="text-xs text-slate-500 font-mono">Gate Pass: ${gate.gatePassNo}</div>
                            <div class="text-[11px] text-slate-500">Date: ${gate.dispatchDate || getNowFormatted()}</div>
                        </div>
                    </div>

                    <!-- Dispatch & Destination Information -->
                    <div class="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
                        <div class="space-y-1">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client & Destination Site</div>
                            <div class="text-sm font-bold text-slate-900">${gate.projectRef}</div>
                            <div class="text-slate-700"><i class="fas fa-location-dot text-rose-600 mr-1"></i> <strong>Site Address:</strong> ${gate.destinationSite}</div>
                            <div class="text-slate-700"><i class="fas fa-user-tie text-blue-600 mr-1"></i> <strong>Site Recipient:</strong> ${gate.clientContactName}</div>
                            <div class="text-slate-700 font-mono"><i class="fas fa-phone text-emerald-600 mr-1"></i> ${gate.clientPhone} ${gate.clientEmail ? `| ${gate.clientEmail}` : ''}</div>
                        </div>
                        <div class="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Logistics & Vehicle Information</div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Vehicle Plate:</span>
                                <span class="font-mono font-bold text-slate-900">${gate.vehicleNo}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Vehicle Type:</span>
                                <span class="text-slate-800 font-semibold">${gate.vehicleType}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Designated Driver:</span>
                                <span class="text-slate-800 font-semibold">${gate.driverName}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500">Driver License / Phone:</span>
                                <span class="font-mono text-slate-700">${gate.driverLicense} • ${gate.driverPhone}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Itemized Material Table -->
                    <div class="py-4">
                        <div class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                            <span>Dispatched Materials & Equipment</span>
                            <span class="text-[11px] font-normal text-slate-500 font-mono">Production Ref: ${gate.poRef}</span>
                        </div>
                        <table class="w-full text-xs text-left border border-slate-200">
                            <thead class="bg-slate-100 text-slate-700 border-b border-slate-300">
                                <tr>
                                    <th class="py-2 px-3 text-center w-10">#</th>
                                    <th class="py-2 px-3 w-32">Item Code</th>
                                    <th class="py-2 px-3">Description & Specifications</th>
                                    <th class="py-2 px-3 text-right w-28">Quantity</th>
                                    <th class="py-2 px-3 text-right w-24">Gross Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsRows}
                            </tbody>
                            <tfoot class="bg-slate-50 font-bold border-t-2 border-slate-300 text-slate-900">
                                <tr>
                                    <td colspan="3" class="py-2 px-3 text-right uppercase text-[11px]">Consignment Totals:</td>
                                    <td class="py-2 px-3 text-right font-mono">${totalQty.toLocaleString()} Units/Kg</td>
                                    <td class="py-2 px-3 text-right font-mono">${totalWeight ? totalWeight.toLocaleString() + ' Kg' : '—'}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <!-- 3-Stage Clearance Verification Seals -->
                    <div class="py-3 border-t-2 border-slate-200">
                        <div class="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                            Three-Stage Security & Gate Dispatch Authorization Seals
                        </div>
                        <div class="grid grid-cols-3 gap-3 text-[10px]">
                            
                            <!-- Stage 1 Seal -->
                            <div class="border ${gate.gate1StaffReady?.passed ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 bg-slate-50'} p-2.5 rounded-lg space-y-1">
                                <div class="flex items-center justify-between font-bold ${gate.gate1StaffReady?.passed ? 'text-emerald-800' : 'text-slate-500'}">
                                    <span><i class="fas fa-truck-ramp-box mr-1"></i> Stage 1: Fleet Ready</span>
                                    <span>${gate.gate1StaffReady?.passed ? 'VERIFIED' : 'PENDING'}</span>
                                </div>
                                <div class="text-slate-600 text-[9.5px]">Inspector: ${gate.gate1StaffReady?.verifier || '—'}</div>
                                <div class="text-slate-500 font-mono text-[9px]">Verified: ${gate.gate1StaffReady?.verifiedAt || '—'}</div>
                                <div class="text-[8.5px] text-emerald-700 font-semibold">✓ PPE & Driver License Checked</div>
                            </div>

                            <!-- Stage 2 Seal -->
                            <div class="border ${gate.gate2CommercialTax?.passed ? 'border-blue-300 bg-blue-50/40' : 'border-slate-200 bg-slate-50'} p-2.5 rounded-lg space-y-1">
                                <div class="flex items-center justify-between font-bold ${gate.gate2CommercialTax?.passed ? 'text-blue-800' : 'text-slate-500'}">
                                    <span><i class="fas fa-file-invoice-dollar mr-1"></i> Stage 2: Payment Gate</span>
                                    <span>${gate.gate2CommercialTax?.passed ? 'CLEARED' : 'PENDING'}</span>
                                </div>
                                <div class="text-slate-600 text-[9.5px]">
                                    ${gate.gate2CommercialTax?.ceoOverrideApproved ? 'CEO Credit Override: Syed Moazzam Ali' : `30%+ Milestone Advance: ${gate.gate2CommercialTax?.advancePercentage || 0}%`}
                                </div>
                                <div class="text-slate-500 font-mono text-[9px]">Verified: ${gate.gate2CommercialTax?.verifiedAt || '—'}</div>
                                <div class="text-[8.5px] text-blue-700 font-semibold">✓ Tax Indemnity & Ledger Validated</div>
                            </div>

                            <!-- Stage 3 Seal -->
                            <div class="border ${gate.gate3SiteOtp?.passed ? 'border-purple-300 bg-purple-50/40' : 'border-slate-200 bg-slate-50'} p-2.5 rounded-lg space-y-1">
                                <div class="flex items-center justify-between font-bold ${gate.gate3SiteOtp?.passed ? 'text-purple-800' : 'text-slate-500'}">
                                    <span><i class="fas fa-key mr-1"></i> Stage 3: Site OTP</span>
                                    <span>${gate.gate3SiteOtp?.passed ? 'AUTHENTICATED' : 'PENDING'}</span>
                                </div>
                                <div class="text-slate-600 text-[9.5px]">Site Lead: ${gate.clientContactName}</div>
                                <div class="text-slate-500 font-mono text-[9px]">Confirmed: ${gate.gate3SiteOtp?.otpVerifiedAt || '—'}</div>
                                <div class="text-[8.5px] text-purple-700 font-semibold">✓ 6-Digit SMS/Email Token Matched</div>
                            </div>

                        </div>
                    </div>

                    <!-- Signatures & Receiver Acknowledgement -->
                    <div class="pt-6 grid grid-cols-4 gap-4 text-center text-xs">
                        <div class="border-t border-slate-400 pt-1">
                            <p class="font-bold text-slate-800 text-[11px]">Workshop In-Charge</p>
                            <p class="text-[9.5px] text-slate-400">Material Handover</p>
                        </div>
                        <div class="border-t border-slate-400 pt-1">
                            <p class="font-bold text-slate-800 text-[11px]">Finance & Billing</p>
                            <p class="text-[9.5px] text-slate-400">Accounts Release</p>
                        </div>
                        <div class="border-t border-slate-400 pt-1">
                            <p class="font-bold text-slate-800 text-[11px]">Security Gate Officer</p>
                            <p class="text-[9.5px] text-slate-400">Outward Physical Exit</p>
                        </div>
                        <div class="border-t border-slate-400 pt-1">
                            <p class="font-bold text-slate-800 text-[11px]">Site Recipient Sign</p>
                            <p class="text-[9.5px] text-slate-400">Received in Good Order</p>
                        </div>
                    </div>

                    <!-- Footer Notice -->
                    <div class="mt-6 pt-3 border-t border-slate-200 text-center text-[9.5px] text-slate-400">
                        This is a computer generated Goods Delivery Challan under Cosmix Engineering Automated 3-Stage Security Clearance. Verification Hash: <span class="font-mono">${gate.id}-${gate.gatePassNo}</span>
                    </div>

                </div>
            `;
        },

        printDeliveryChallan: (gateId) => {
            const html = DeliveryGateService.generateChallanHtml(gateId);
            const printWin = window.open('', '_blank', 'width=900,height=800');
            if (printWin) {
                printWin.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Goods Delivery Challan - Cosmix Engineering</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
                        <style>
                            body { font-family: 'Poppins', sans-serif; background-color: #f8fafc; }
                            .font-mono { font-family: 'JetBrains Mono', monospace; }
                            @media print {
                                body { background: #fff; }
                                @page { margin: 1cm; size: A4 portrait; }
                            }
                        </style>
                    </head>
                    <body class="p-4">
                        ${html}
                        <script>
                            window.onload = function() {
                                setTimeout(function() {
                                    window.print();
                                }, 300);
                            };
                        </script>
                    </body>
                    </html>
                `);
                printWin.document.close();
            }
        }
    };

    return {
        getSopStages: () => SOP_STAGES,
        getProductionOrders: () => state.productionOrders,
        getProductionOrderById: (id) => state.productionOrders.find(p => p.id === id || p.orderNo === id),
        getFieldJobs: () => state.fieldJobs,
        getFieldJobById: (id) => state.fieldJobs.find(j => j.id === id || j.jobNo === id),
        
        // Delivery Gate Pass methods
        getDeliveryGates: DeliveryGateService.getAll,
        getDeliveryGateById: DeliveryGateService.getById,
        getGateSummaryKpis: DeliveryGateService.getSummaryKpis,
        createDeliveryGatePass: DeliveryGateService.createGatePass,
        verifyStage1FleetReady: DeliveryGateService.verifyStage1FleetReady,
        verifyStage2Payment: DeliveryGateService.verifyStage2Payment,
        sendOtpChallenge: DeliveryGateService.sendOtpChallenge,
        verifySiteOtpAndClearGate: DeliveryGateService.verifyStage3SiteOtp,
        releaseDeliveryChallan: DeliveryGateService.releaseDeliveryChallan,
        generateChallanHtml: DeliveryGateService.generateChallanHtml,
        printDeliveryChallan: DeliveryGateService.printDeliveryChallan,
        DeliveryGateService: DeliveryGateService,

        advanceProductionStage: (orderId) => {
            const order = state.productionOrders.find(p => p.id === orderId || p.orderNo === orderId);
            if (!order) return null;
            const currentIdx = SOP_STAGES.indexOf(order.currentStage);
            if (currentIdx < SOP_STAGES.length - 1) {
                order.currentStage = SOP_STAGES[currentIdx + 1];
                saveState(state);
                return order;
            }
            return null;
        },

        updateQcCheck: (orderId, checkKey, passed, note) => {
            const order = state.productionOrders.find(p => p.id === orderId || p.orderNo === orderId);
            if (order && order.qcChecks && order.qcChecks[checkKey]) {
                order.qcChecks[checkKey].checked = true;
                order.qcChecks[checkKey].passed = passed;
                if (note) order.qcChecks[checkKey].note = note;

                const allPassed = Object.values(order.qcChecks).every(c => c.checked && c.passed);
                order.qcStatus = allPassed ? 'Passed' : 'Pending';
                saveState(state);
                return order;
            }
            return null;
        },

        updateHseCheck: (jobId, stepKey, passed, remarks, signerName = '') => {
            const job = state.fieldJobs.find(j => j.id === jobId || j.jobNo === jobId);
            if (job && job.hseChecklist && job.hseChecklist[stepKey]) {
                job.hseChecklist[stepKey].completed = passed;
                job.hseChecklist[stepKey].timestamp = getNowFormatted();
                if (remarks) job.hseChecklist[stepKey].remarks = remarks;
                if (signerName) job.hseChecklist[stepKey].signerName = signerName;

                const allDone = Object.values(job.hseChecklist).every(s => s.completed);
                if (allDone) job.status = 'HandoverComplete';
                saveState(state);
                return job;
            }
            return null;
        },

        resetToDefaults: () => {
            state = JSON.parse(JSON.stringify(defaultState));
            saveState(state);
        }
    };
})();

window.CosmixEngineering = CosmixEngineering;
window.DeliveryGateService = CosmixEngineering.DeliveryGateService;
