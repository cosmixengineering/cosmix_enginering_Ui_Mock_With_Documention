// assets/js/administrator-store.js
// Central Data Store and State Management for Administrator & Governance Module
// Matching CosmixHub Reference ERP (.NET 8 Clean Architecture / SQLite / EF Core / PolicySlots)

(function(window) {
    'use strict';

    const STORAGE_KEY = 'cosmix.administrator.demo.v1';

    // 40 CEO Master Policy Slots directly mapped from CosmixHub Reference ERP (cosmixhub.db)
    const DEFAULT_POLICY_SLOTS = [
        // Category: Commercial (2 Slots)
        { 
            id: "7F74E59D-90D4-4406-B652-08C3114794A1", 
            key: "Commercial.PaymentAdvancePercent", 
            category: "Commercial", 
            displayName: "Advance Payment Requirement", 
            description: "Default mobilization advance percentage required for commercial proposals and contracts.", 
            unit: "%", 
            decimalValue: 65.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Commercial Terms SOP 2026", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "BBAE569B-E131-45FB-B92C-32CBC0FB1440", 
            key: "Department.Sales.QuoteValidityDays", 
            category: "Commercial", 
            displayName: "Commercial Quotation Validity", 
            description: "Default commercial validity period for official sales quotations before price re-indexation.", 
            unit: "days", 
            decimalValue: 15.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Sales Governance SOP", 
            updatedAt: "2026-09-25 10:00:00" 
        },

        // Category: CostBuild (6 Slots)
        { 
            id: "B1CB4282-4C98-4761-AE79-9D82DF87B0E2", 
            key: "CostBuild.GiSheet.KgRatePkr", 
            category: "CostBuild", 
            displayName: "GI Sheet Base Market Rate", 
            description: "Monthly prime galvanized iron (GI) steel coil base rate per kg (Z-275 zinc coating standard).", 
            unit: "PKR/kg", 
            decimalValue: 285.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Pakistan Steel Mills / Market Index Sep 2026", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "3DD8F266-DB52-4163-BA57-BBD4C1FE844E", 
            key: "CostBuild.Insulation.RatePerSqm", 
            category: "CostBuild", 
            displayName: "NBR Rubber Insulation Rate", 
            description: "Base rate for 19mm closed-cell NBR elastomeric rubber thermal insulation sheet per m².", 
            unit: "PKR/m²", 
            decimalValue: 920.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Thermal Insulation Standard Rate", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "F649140B-9597-411B-9CB9-1B84ADFB72B6", 
            key: "CostBuild.LaborPercent", 
            category: "CostBuild", 
            displayName: "Direct Workshop Fabrication Labor", 
            description: "Direct shop-floor labor markup factor applied over raw material bill of quantities.", 
            unit: "%", 
            decimalValue: 12.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Factory Cost Accounting Standard", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "778EC3C6-63A5-4804-B481-578FB6D5071E", 
            key: "CostBuild.MachiningPercent", 
            category: "CostBuild", 
            displayName: "Machining & CNC Forming Adder", 
            description: "CNC plasma cutting, shearing, lockformer seam formation, and duct folding machine adder.", 
            unit: "%", 
            decimalValue: 8.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Factory Machine SOP", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "8AF6EC8A-14F2-46BF-92C0-FF60081E676C", 
            key: "CostBuild.TransportPercent", 
            category: "CostBuild", 
            displayName: "Local Logistics & Site Freight", 
            description: "Factory-to-project site trucking, local logistics, and material delivery adder.", 
            unit: "%", 
            decimalValue: 3.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Logistics Rate Schedule", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "417AC475-176E-4D2C-8E9F-820664670EF7", 
            key: "CostBuild.WastagePercent", 
            category: "CostBuild", 
            displayName: "Sheet Metal & Insulation Scrap Wastage", 
            description: "Allowance for off-cut trim scrap, corner notches, and sheet fabrication wastage.", 
            unit: "%", 
            decimalValue: 5.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "HVAC Estimation Norms", 
            updatedAt: "2026-09-25 10:00:00" 
        },

        // Category: Department (1 Slot)
        { 
            id: "30B32884-6E7A-4DC1-9AE9-EE1CE3890F00", 
            key: "Department.Application.ReviewSlaHours", 
            category: "Department", 
            displayName: "Application Engineering Review SLA", 
            description: "Maximum allowable turnaround hours for technical equipment selection and drawing approval.", 
            unit: "hours", 
            decimalValue: 24.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Engineering Operations SLA", 
            updatedAt: "2026-09-25 10:00:00" 
        },

        // Category: Import (3 Slots)
        { 
            id: "24CCD3EC-63F4-4155-9C08-E6C9DF7FE811", 
            key: "import.customs_extra_pct", 
            category: "Import", 
            displayName: "Customs Clearance & Port Extras", 
            description: "Port wharfage, clearance agent handling, demurrages and ancillary port fees percentage.", 
            unit: "%", 
            decimalValue: 3.5, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Port Clearance Master Schedule", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "F031770C-0CF8-4624-821B-534563C152A3", 
            key: "import.freight_pct", 
            category: "Import", 
            displayName: "International Freight Adder", 
            description: "Forward sea and air freight landing multiplier for virtual indent catalog items.", 
            unit: "%", 
            decimalValue: 4.5, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "Global Freight Index", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "F93FBAD9-CD35-441B-82FE-85DA267A8307", 
            key: "import.hs_duty_pct", 
            category: "Import", 
            displayName: "Customs HS Tariff Import Duty", 
            description: "Landed cost HS tariff duty on international chillers, VRF condensers, and specialized spares.", 
            unit: "%", 
            decimalValue: 11.0, 
            stringValue: null, 
            isUserLocked: 0, 
            sourceNote: "FBR Customs Tariff 2026", 
            updatedAt: "2026-09-25 10:00:00" 
        },

        // Category: QuoteTerms (7 Slots)
        { 
            id: "48BE9A06-AE9A-4196-B479-E38904DFC6D7", 
            key: "QuoteTerms.DeliveryBlock", 
            category: "QuoteTerms", 
            displayName: "Annexure A: Delivery Scope & Lead Times", 
            description: "Standard delivery terms governing ex-stock equipment and international indent shipments.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "Ex-Stock subject to prior sale. Virtual/Indent catalog items: 6-8 weeks from date of confirmed purchase order and advance payment realization.", 
            isUserLocked: 0, 
            sourceNote: "Commercial Terms SOP", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "D12086D5-B721-44A0-9AFD-145FC9418FDA", 
            key: "QuoteTerms.ExclusionBlock", 
            category: "QuoteTerms", 
            displayName: "Annexure A: General Scope Exclusions", 
            description: "Standard contractual exclusions clause for HVAC installation quotations.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "Masonry civil works, high-voltage power termination, earthing pits, municipal permits, and site water supply are strictly by client.", 
            isUserLocked: 0, 
            sourceNote: "Engineering Scope Standard", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "1CBC2DC4-8219-4AE6-AAD5-894AA8C34A54", 
            key: "QuoteTerms.FxDutyVariationBlock", 
            category: "QuoteTerms", 
            displayName: "Annexure A: FX & Duty Variation Clause", 
            description: "Clause protecting against State Bank PKR parity and customs tariff fluctuations.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "Quoted prices are based on prevailing SBP foreign exchange parity and customs tariff. Any variation exceeding ±2% at bill of entry will be invoiced at actuals.", 
            isUserLocked: 0, 
            sourceNote: "Commercial Risk Terms", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "C10D136E-72DD-40CD-81EA-215D3E4DB05F", 
            key: "QuoteTerms.PaymentBlock", 
            category: "QuoteTerms", 
            displayName: "Annexure A: Milestone Payment Schedule", 
            description: "Standard contractual billing milestones schedule.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "65% Mobilization Advance upon PO sign-off · 30% Prior to Factory Dispatch · 05% Post Commissioning & Handover.", 
            isUserLocked: 0, 
            sourceNote: "Commercial Finance Policy", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "1528E768-5CD5-496F-A2A9-9CDE94C43BF2", 
            key: "QuoteTerms.ServicesNotIncludedBlock", 
            category: "QuoteTerms", 
            displayName: "Annexure A: Excluded Site Services", 
            description: "Specific technical trade exclusions on MEP installation sites.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "Civil foundation, roof core cutting, secondary electrical supply and water drainage piping are strictly excluded from Cosmix scope.", 
            isUserLocked: 0, 
            sourceNote: "Field Installation Scope", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "7E58C891-377F-4250-9093-6F3183A271CE", 
            key: "QuoteTerms.SignOffName", 
            category: "QuoteTerms", 
            displayName: "Authorized Signatory Name", 
            description: "Official executive name appearing on QuestPDF quotation letterheads.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "Zeeshan Ashraf", 
            isUserLocked: 0, 
            sourceNote: "Corporate Governance", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "6D294A72-F00F-4513-8178-85B7456B5B66", 
            key: "QuoteTerms.SignOffTitle", 
            category: "QuoteTerms", 
            displayName: "Authorized Signatory Title", 
            description: "Official corporate designation appearing on QuestPDF letterheads.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "Chief Executive Officer", 
            isUserLocked: 0, 
            sourceNote: "Corporate Governance", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "89CDAF88-B3FC-457C-A368-DD10318C3A9B", 
            key: "QuoteTerms.TaxBlock", 
            category: "QuoteTerms", 
            displayName: "Annexure A: Sales Tax & WHT Treatment", 
            description: "Exclusion of federal and provincial sales taxes from baseline commercial quote.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "Quoted prices are exclusive of all applicable federal (FBR 18%) and provincial sales taxes, which shall be charged at actual rate prevailing on the date of invoice.", 
            isUserLocked: 0, 
            sourceNote: "Taxation Governance", 
            updatedAt: "2026-09-25 10:00:00" 
        },

        // Category: SiteStaff (20 Slots: #21 to #40)
        { 
            id: "D246D78D-6BD0-498D-BAB1-40E18FD2EA61", 
            key: "SiteStaff.Duty.DaysPerWeek", 
            category: "SiteStaff", 
            displayName: "Standard Work Days Per Week", 
            description: "Official weekly shift days scheduled for field technicians and site resident crew.", 
            unit: "days/week", 
            decimalValue: 6.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Policy Sep 2026 — Master Data", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "95BF8E02-B7C0-4372-9005-2C39F824937E", 
            key: "SiteStaff.Duty.HoursPerDay", 
            category: "SiteStaff", 
            displayName: "Standard Shift Duration", 
            description: "Standard daily working hours on field projects before overtime eligibility applies.", 
            unit: "hours/day", 
            decimalValue: 9.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Policy Sep 2026 — Master Data", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "EF9E89D0-E8CC-4F4B-8057-B5791201D0A1", 
            key: "SiteStaff.Duty.Window", 
            category: "SiteStaff", 
            displayName: "Standard Duty Operating Window", 
            description: "Core operating shift timing window for site technicians and installation crew.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "10:00-19:00", 
            isUserLocked: 1, 
            sourceNote: "HR Policy Sep 2026 — Master Data", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "5B75904B-67AD-447D-A29A-D719A3FFA465", 
            key: "SiteStaff.Fuel.HomeOfficeNote", 
            category: "SiteStaff", 
            displayName: "Home ↔ Office Commute Exclusion Clause", 
            description: "Explicit non-reimbursable travel clause. Only site-to-site travel is reimbursed.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "Strictly unpaid — home distance recorded before first site. Only site-to-site travel is reimbursed at 28.0 km/L.", 
            isUserLocked: 1, 
            sourceNote: "HR & Fleet Policy Sep 2026", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "FD219EFC-E17C-4130-A151-4685E0F9B9F3", 
            key: "SiteStaff.Fuel.KmPerLiter", 
            category: "SiteStaff", 
            displayName: "Site Travel Fuel Mileage Rate", 
            description: "Fixed motorcycle reimbursement formula: 28.0 km per liter of fuel for audited site-to-site travel.", 
            unit: "km/L", 
            decimalValue: 28.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "CEO Mandated Fuel Formula (cosmixhub.db)", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "21E73208-05B9-4CA3-9FB6-D0F3BB9275A1", 
            key: "SiteStaff.Kpi.GamesEvidencePercentPerDay", 
            category: "SiteStaff", 
            displayName: "Gaming / Social Media KPI Penalty", 
            description: "Daily KPI rating deduction of 1.0% per violation when gaming or non-work phone use is recorded during active shift.", 
            unit: "%", 
            decimalValue: 1.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Site Staff Discipline SOP", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "59B7BE50-A576-41CA-AB1E-93A31F9D16EF", 
            key: "SiteStaff.Kpi.MissedCallPercent", 
            category: "SiteStaff", 
            displayName: "Missed Call / SLA Breach Penalty", 
            description: "1.0% KPI score deduction for failing to respond to dispatch, emergency, or client call within 3 hours during active shift.", 
            unit: "%", 
            decimalValue: 1.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Site Staff Discipline SOP", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "0DEF673D-5520-40F3-92CB-1B477E37983B", 
            key: "SiteStaff.Late.CountForDayDeduction", 
            category: "SiteStaff", 
            displayName: "Late Check-Ins Deduction Threshold", 
            description: "Every 3 late arrivals in a calendar month trigger automatic 0.5 to 1.0 day salary deduction in the payroll engine.", 
            unit: "count", 
            decimalValue: 3.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Attendance Policy Sep 2026", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "85D25A62-CE27-442D-B933-6C8795003B75", 
            key: "SiteStaff.Late.GraceMinutes", 
            category: "SiteStaff", 
            displayName: "Late Arrival Grace Window", 
            description: "15-minute grace window permitted post shift start (Arrival at 10:16 AM is flagged as Late).", 
            unit: "minutes", 
            decimalValue: 15.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Attendance Policy Sep 2026", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "A43FC1F2-C1AA-40D6-92B7-E8A2912C898C", 
            key: "SiteStaff.Leave.AnnualDays", 
            category: "SiteStaff", 
            displayName: "Annual Paid Leave Quota", 
            description: "Total annual paid vacation and emergency leave entitlement per calendar year.", 
            unit: "days", 
            decimalValue: 18.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Employee Hand Book 2026", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "A8E60111-18FC-4CBB-A01D-4D6FD919A974", 
            key: "SiteStaff.Meal.BreakfastPkr", 
            category: "SiteStaff", 
            displayName: "Stationed Breakfast Allowance", 
            description: "Fixed breakfast stipend for overnight emergency site duty beyond dinner window.", 
            unit: "PKR", 
            decimalValue: 300.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Meal Stipend Schedule", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "35826E2C-28D7-4368-A6E3-8A14A6D811F1", 
            key: "SiteStaff.Meal.DinnerContinuousHours", 
            category: "SiteStaff", 
            displayName: "Dinner Eligibility Continuous Hours", 
            description: "Minimum 12 continuous duty hours required on stationed site before dinner reimbursement is eligible.", 
            unit: "hours", 
            decimalValue: 12.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Meal Stipend Schedule", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "4F3FA0BC-302A-4529-8422-1996FFF45F68", 
            key: "SiteStaff.Meal.LunchPkr", 
            category: "SiteStaff", 
            displayName: "Stationed Lunch Allowance", 
            description: "Standard daily stationed lunch allowance for technicians working on remote sites.", 
            unit: "PKR", 
            decimalValue: 500.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Meal Stipend Schedule", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "6FE06544-28CA-4D5F-A3CB-0AC4611BCFCF", 
            key: "SiteStaff.Meal.OutstationDayPkr", 
            category: "SiteStaff", 
            displayName: "Outstation Full Day Meal Stipend", 
            description: "Fixed lump sum daily outstation allowance (Breakfast + Lunch + Dinner); no separate claims.", 
            unit: "PKR/day", 
            decimalValue: 1000.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "HR Meal Stipend Schedule", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "7CAE556E-8ED7-4F13-BDF5-AB73FECC456C", 
            key: "SiteStaff.Ot.Eligibility", 
            category: "SiteStaff", 
            displayName: "Overtime Authorized Roles", 
            description: "Explicit roles eligible for overtime payment beyond 9 daily hours.", 
            unit: "text", 
            decimalValue: null, 
            stringValue: "Site staff, drivers, riders, purchasers", 
            isUserLocked: 1, 
            sourceNote: "HR Payroll Governance", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "D165DB5E-3809-4C9D-803D-4B125E71510B", 
            key: "SiteStaff.Overhaul.AmountPkr", 
            category: "SiteStaff", 
            displayName: "Engine Overhaul Lump Sum Allowance", 
            description: "Fixed maintenance credit of PKR 18,000 (including tire replacement) every 8,000 km.", 
            unit: "PKR", 
            decimalValue: 18000.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "Fleet Policy 2026 (cosmixhub.db)", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "37C59667-9FB2-411F-BD44-894A36E77ACE", 
            key: "SiteStaff.Overhaul.KmInterval", 
            category: "SiteStaff", 
            displayName: "Engine Overhaul Milestone Distance", 
            description: "Outstation vehicle engine overhaul interval: 8,000 km distance tracked.", 
            unit: "km", 
            decimalValue: 8000.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "Fleet Policy 2026 (cosmixhub.db)", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "71897366-8834-4D19-9919-8FF10ED5DCA6", 
            key: "SiteStaff.Sim.NonUseDeductionPkr", 
            category: "SiteStaff", 
            displayName: "Corporate SIM Non-Use Penalty", 
            description: "Mandatory salary deduction of PKR 1,500 applied if assigned corporate SIM is inactive or misused for >7 days.", 
            unit: "PKR", 
            decimalValue: 1500.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "IT Telecom Compliance SOP", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "DA73D6C3-02EA-4AEF-AEC9-FC991EE82C96", 
            key: "SiteStaff.Tuning.AmountPkr", 
            category: "SiteStaff", 
            displayName: "Vehicle Tuning Reimbursement", 
            description: "Fixed tuning allowance of PKR 1,800 paid for every 1,000 outstation kilometers completed.", 
            unit: "PKR", 
            decimalValue: 1800.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "Fleet Policy 2026 (cosmixhub.db)", 
            updatedAt: "2026-09-25 10:00:00" 
        },
        { 
            id: "D1BED629-C70C-4B90-9043-7126D98772C3", 
            key: "SiteStaff.Tuning.KmInterval", 
            category: "SiteStaff", 
            displayName: "Vehicle Tuning Milestone Distance", 
            description: "Outstation vehicle tuning cycle interval: 1,000 km distance tracked.", 
            unit: "km", 
            decimalValue: 1000.0, 
            stringValue: null, 
            isUserLocked: 1, 
            sourceNote: "Fleet Policy 2026 (cosmixhub.db)", 
            updatedAt: "2026-09-25 10:00:00" 
        }
    ];

    const DEFAULT_MARGIN_SETTINGS = {
        primaryPercent: 25.0, // Floor % (Hard Block below this)
        alternatePercent: 35.0, // Target %
        lockDefaults: true,
        notes: "Backend profit margin bands (dictated 25%/35%). CEO authorization required for floor override.",
        overrideRequests: [
            {
                id: "OVR-2026-001",
                quoteId: "Q-2026-088",
                clientName: "Indus Motor Company Ltd",
                projectName: "Paint Shop Chiller Modernization",
                quotedAmount: 14500000,
                costBuilt: 12100000,
                proposedMargin: 16.55,
                requestedBy: "sales@cosmixengineering.com",
                requestedAt: "2026-09-25 14:30:00",
                reason: "Strategic tender: Competitor (Daikin PK) quoted aggressively. Client promised Phase 2 VRF package.",
                status: "Pending",
                decisionBy: null,
                decisionAt: null,
                decisionNote: null
            },
            {
                id: "OVR-2026-002",
                quoteId: "Q-2026-092",
                clientName: "Lucky Textile Mills",
                projectName: "FAHU Package Replacement",
                quotedAmount: 6200000,
                costBuilt: 4900000,
                proposedMargin: 20.96,
                requestedBy: "tendering@cosmixengineering.com",
                requestedAt: "2026-09-24 11:15:00",
                reason: "Volume order: 4 units ordered simultaneously. Cash advance payment 100% upfront.",
                status: "Approved",
                decisionBy: "admin@cosmixengineering.com",
                decisionAt: "2026-09-24 16:40:00",
                decisionNote: "Approved due to 100% cash mobilization advance."
            }
        ]
    };

    const DEFAULT_ROLES = [
        { id: "4ec28f04-5b5e-455e-ae03-18bd25302d58", name: "Management", code: "MANAGEMENT", dept: "Executive", userCount: 2, description: "Full enterprise executive governance, CEO margin override, policy slots, and financial signoff.", isSystem: true },
        { id: "97a47f71-7822-46bc-86a4-97fd56790db2", name: "SalesBD", code: "SALESBD", dept: "Sales", userCount: 4, description: "Lead triage, RFQ intake, AUX equipment selection, BOQ pricing, and quotation drafting.", isSystem: true },
        { id: "11a87618-2425-45d1-845e-b57162cbe326", name: "Estimation", code: "ESTIMATION", dept: "Estimation", userCount: 3, description: "Parametric cost-building, rate book maintenance, GI sheet & insulation fabrication rates.", isSystem: true },
        { id: "52d63d30-02a9-4ee1-9b96-9aabde1b1a66", name: "DesignEngineering", code: "DESIGNENGINEERING", dept: "Engineering", userCount: 3, description: "Technical selection signoff, model substitution, BOM creation, and MEP drawings.", isSystem: true },
        { id: "02b3ce6f-eb61-485e-b585-b245682c35ca", name: "Procurement", code: "PROCUREMENT", dept: "Supply Chain", userCount: 3, description: "Supplier RFQs, purchase order release, vendor price negotiation. SoD restricted from self-approving POs.", isSystem: true },
        { id: "3dfc5395-ac53-4f09-8ddd-f6e6d9aa3d09", name: "ProjectManagement", code: "PROJECTMANAGEMENT", dept: "Projects", userCount: 5, description: "Site execution tracking, work orders, field engineer supervision, and client signoffs.", isSystem: true },
        { id: "88ee0744-8fc0-4e1e-9478-67f8863f76dd", name: "StoreLogistics", code: "STORELOGISTICS", dept: "Warehouse", userCount: 3, description: "Physical goods receipt (GRN), append-only stock movement ledger, delivery challan dispatch.", isSystem: true },
        { id: "6e483dd5-5f8b-4740-9d8e-7a1d748e7709", name: "Installation", code: "INSTALLATION", dept: "Field Ops", userCount: 8, description: "Site ducting installation, piping, equipment positioning, and daily work reports.", isSystem: true },
        { id: "5899c9d8-5f2e-4762-ac92-15b0b18a8244", name: "Commissioning", code: "COMMISSIONING", dept: "Field Ops", userCount: 2, description: "Chiller / VRF testing & commissioning, vacuum hold checks, FAT/SAT client certification.", isSystem: true },
        { id: "887aaede-9a15-4465-8398-96cf5533f4ba", name: "ServiceAfterSales", code: "SERVICEAFTERSALES", dept: "Support", userCount: 3, description: "Warranty claims, preventive maintenance contracts (AMC), and helpdesk tickets.", isSystem: true },
        { id: "6e149056-521b-4161-89f3-f47565d6aeb3", name: "QualityHSE", code: "QUALITYHSE", dept: "QHSE", userCount: 2, description: "Site toolbox talks, safety audits, PPE compliance, and environmental protocols.", isSystem: true },
        { id: "0e6a3e52-6f97-4fb3-84be-508e70593c80", name: "AccountsFinance", code: "ACCOUNTSFINANCE", dept: "Accounts", userCount: 3, description: "Chart of Accounts, double-entry journals, 3-way match audit, AP/AR aging, and fiscal period locks.", isSystem: true },
        { id: "d3614fc2-312a-41ab-8296-6514d2c8f73d", name: "HRAdmin", code: "HRADMIN", dept: "HR", userCount: 2, description: "Employee onboarding, biometric roster, Site Staff policy penalties, advance loans, and payroll.", isSystem: true },
        { id: "5c143783-da1c-4e49-b308-8d8a2372c885", name: "Documentation", code: "DOCUMENTATION", dept: "Admin", userCount: 1, description: "Tender documentation archiving, legal contracts, and compliance certifications.", isSystem: true },
        { id: "460df8db-410e-4946-9029-cb2c9c06ac0d", name: "Production", code: "PRODUCTION", dept: "Factory", userCount: 4, description: "Factory work orders, sheet metal fabrication, CAC unit assembly line operations.", isSystem: true },
        { id: "98b0d29e-0bc5-456e-a12c-cebe26beb3f7", name: "PPC", code: "PPC", dept: "Factory", userCount: 2, description: "Production planning & control, machine queue scheduling, and material requisitioning.", isSystem: true },
        { id: "1f41305a-818d-4bbc-b813-51876e499d62", name: "FactoryQC", code: "FACTORYQC", dept: "Quality", userCount: 2, description: "Dimensional verification, leak testing, dielectric electrical tests. Hard gate before dispatch.", isSystem: true },
        { id: "4e8a0cbd-d04b-427a-b34b-ff6947233ba2", name: "RnDProduct", code: "RNDPRODUCT", dept: "Engineering", userCount: 2, description: "New product development, energy efficiency benchmarking, and component testing.", isSystem: true },
        { id: "797487ae-8144-43bd-82fb-5383ee58738b", name: "Inventory", code: "INVENTORY", dept: "Warehouse", userCount: 3, description: "15 Store families catalog maintenance, reorder level alerts, and physical store audits.", isSystem: true }
    ];

    const DEFAULT_SOP_STAGES = [
        // Track 0: Project Execution Track
        { id: "SOP-TR0-0", track: 0, trackName: "Project Track", seq: 0, stageKey: "LeadIntake", displayName: "Lead Intake & Discovery", mandatoryKeys: ["lead_qualified", "nda_checked"], description: "Qualify incoming lead, capture tender specs, and verify NDA coverage." },
        { id: "SOP-TR0-1", track: 0, trackName: "Project Track", seq: 1, stageKey: "Estimation", displayName: "Estimation & BOQ Pricing", mandatoryKeys: ["boq_complete", "margin_approved"], description: "Complete detailed BOQ and enforce commercial margin policy floor (25%)." },
        { id: "SOP-TR0-2", track: 0, trackName: "Project Track", seq: 2, stageKey: "Design", displayName: "MEP Design & Selection", mandatoryKeys: ["drawings_issued", "client_approved"], description: "Issue engineering drawings and secure client consultant approval." },
        { id: "SOP-TR0-3", track: 0, trackName: "Project Track", seq: 3, stageKey: "Procurement", displayName: "Procurement & Subcontracts", mandatoryKeys: ["po_raised", "lead_times_confirmed"], description: "Release vendor Purchase Orders with 3-Way Match readiness check." },
        { id: "SOP-TR0-4", track: 0, trackName: "Project Track", seq: 4, stageKey: "ProductionHandoff", displayName: "Production Handoff", mandatoryKeys: ["bom_released", "mrp_run"], description: "Release factory manufacturing BOM and allocate dual-store materials." },
        { id: "SOP-TR0-5", track: 0, trackName: "Project Track", seq: 5, stageKey: "Installation", displayName: "Site Installation", mandatoryKeys: ["site_ready", "permits_ok"], description: "Verify civil site readiness and commence ducting/piping installation." },
        { id: "SOP-TR0-6", track: 0, trackName: "Project Track", seq: 6, stageKey: "Commissioning", displayName: "Testing & Commissioning", mandatoryKeys: ["fat_sat_done", "training_done"], description: "Execute pressure hold test, electrical testing, and client training." },
        { id: "SOP-TR0-7", track: 0, trackName: "Project Track", seq: 7, stageKey: "Handover", displayName: "Handover & Documentation", mandatoryKeys: ["as_built_docs", "warranty_issued"], description: "Deliver as-built documentation pack and activate warranty certificates." },
        { id: "SOP-TR0-8", track: 0, trackName: "Project Track", seq: 8, stageKey: "Closed", displayName: "Financial & Operational Close", mandatoryKeys: ["retention_cleared"], description: "Release final retention milestone and archive project file." },

        // Track 1: Factory Production Track
        { id: "SOP-TR1-0", track: 1, trackName: "Factory Track", seq: 0, stageKey: "Planned", displayName: "Work Order Planned", mandatoryKeys: ["work_order_printed"], description: "Release production work order and schedule machine queue." },
        { id: "SOP-TR1-1", track: 1, trackName: "Factory Track", seq: 1, stageKey: "MaterialIssued", displayName: "Material Issued & Kitted", mandatoryKeys: ["materials_picked", "kit_verified"], description: "Pick dual-store raw materials and verify critical hardware kit." },
        { id: "SOP-TR1-2", track: 1, trackName: "Factory Track", seq: 2, stageKey: "InFabrication", displayName: "CNC Cutting & Forming", mandatoryKeys: ["cutting_done", "forming_done"], description: "Sheet metal CNC plasma cutting, punching, and lockformer duct forming." },
        { id: "SOP-TR1-3", track: 1, trackName: "Factory Track", seq: 3, stageKey: "Assembly", displayName: "Unit Assembly Line", mandatoryKeys: ["assembly_complete", "torque_checked"], description: "Structural assembly, copper coil brazing, and torque verification." },
        { id: "SOP-TR1-4", track: 1, trackName: "Factory Track", seq: 4, stageKey: "FactoryQC", displayName: "Factory QC Gate", mandatoryKeys: ["dimensional_ok", "leak_test_ok", "electrical_ok"], description: "Hydrostatic pressure test, dimensional check, dielectric electrical test." },
        { id: "SOP-TR1-5", track: 1, trackName: "Factory Track", seq: 5, stageKey: "Packing", displayName: "Protective Crate Packing", mandatoryKeys: ["packed", "labelled"], description: "Protective plastic wrapping, wooden crating, and serial barcode tagging." },
        { id: "SOP-TR1-6", track: 1, trackName: "Factory Track", seq: 6, stageKey: "ReadyToDispatch", displayName: "Ready for Delivery Gate", mandatoryKeys: ["docs_ready", "logistics_booked"], description: "Final delivery order staging and 3-stage security gate clearance." },
        { id: "SOP-TR1-7", track: 1, trackName: "Factory Track", seq: 7, stageKey: "Dispatched", displayName: "Outward Dispatched", mandatoryKeys: ["gate_pass_signed"], description: "Gate pass signed and outward delivery challan exported." }
    ];

    const DEFAULT_AUDIT_LOGS = [
        { id: "LOG-2026-0091", entityType: "System", entityId: "CORE-SEED", action: "System.Seed", fromValue: null, toValue: "P5 Production Build", reason: "Initialized master database tables and 40 CEO Policy Slots", user: "system@cosmixengineering.com", isOverride: 0, timestamp: "2026-09-25 08:00:00" },
        { id: "LOG-2026-0092", entityType: "Auth", entityId: "USR-001", action: "Auth.LoginSuccess", fromValue: null, toValue: "admin@cosmixengineering.com", reason: "SuperAdmin login via Web Portal", user: "admin@cosmixengineering.com", isOverride: 0, timestamp: "2026-09-25 08:05:12" },
        { id: "LOG-2026-0093", entityType: "CommercialMargin", entityId: "OVR-2026-002", action: "MarginOverride.Approved", fromValue: "18.5%", toValue: "20.96%", reason: "Approved due to 100% cash mobilization advance", user: "admin@cosmixengineering.com", isOverride: 1, timestamp: "2026-09-24 16:40:00" },
        { id: "LOG-2026-0094", entityType: "PolicySlot", entityId: "SiteStaff.Fuel.KmPerLiter", action: "PolicySlot.Enforced", fromValue: "25.0 km/L", toValue: "28.0 km/L", reason: "CEO Policy Slot Enforcement: Standardized 28.0 km/L fuel reimbursement formula", user: "admin@cosmixengineering.com", isOverride: 0, timestamp: "2026-09-25 09:15:00" },
        { id: "LOG-2026-0095", entityType: "PolicySlot", entityId: "SiteStaff.Sim.NonUseDeductionPkr", action: "PolicySlot.Enforced", fromValue: "1000.0 PKR", toValue: "1500.0 PKR", reason: "CEO Policy Slot Enforcement: Enforced PKR 1,500 deduction for unauthorized / inactive corporate SIM", user: "admin@cosmixengineering.com", isOverride: 0, timestamp: "2026-09-25 09:20:00" }
    ];

    class AdministratorStore {
        constructor() {
            this.state = this.loadState();
        }

        loadState() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    // Ensure all 40 slots are present if stored state had fewer
                    if (parsed && Array.isArray(parsed.policySlots) && parsed.policySlots.length === DEFAULT_POLICY_SLOTS.length) {
                        return parsed;
                    }
                } catch (e) {
                    console.error('Failed to parse administrator state, falling back to default:', e);
                }
            }
            const initial = {
                policySlots: DEFAULT_POLICY_SLOTS,
                margins: DEFAULT_MARGIN_SETTINGS,
                roles: DEFAULT_ROLES,
                sopStages: DEFAULT_SOP_STAGES,
                auditLogs: DEFAULT_AUDIT_LOGS
            };
            this.saveState(initial);
            return initial;
        }

        saveState(state) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state || this.state));
        }

        logAction(entityType, entityId, action, fromValue, toValue, reason, isOverride = 0) {
            const newLog = {
                id: `LOG-${new Date().getFullYear()}-${String(this.state.auditLogs.length + 1).padStart(4, '0')}`,
                entityType,
                entityId,
                action,
                fromValue: String(fromValue || '-'),
                toValue: String(toValue || '-'),
                reason: reason || 'Administrative update',
                user: 'admin@cosmixengineering.com',
                isOverride: isOverride ? 1 : 0,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
            this.state.auditLogs.unshift(newLog);
            this.saveState();
            return newLog;
        }

        // Policy Slots Methods
        getPolicySlots(category = 'all', searchQuery = '') {
            return this.state.policySlots.filter(slot => {
                const matchCat = (category === 'all' || slot.category.toLowerCase() === category.toLowerCase());
                const matchSearch = !searchQuery || 
                    slot.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    slot.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    slot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (slot.sourceNote && slot.sourceNote.toLowerCase().includes(searchQuery.toLowerCase()));
                return matchCat && matchSearch;
            });
        }

        getSlotByKey(key) {
            return this.state.policySlots.find(s => s.key === key);
        }

        getSlotValue(key, defaultValue = null) {
            const slot = this.getSlotByKey(key);
            if (!slot) return defaultValue;
            return slot.decimalValue !== null ? slot.decimalValue : slot.stringValue;
        }

        updatePolicySlot(id, newValue, reason) {
            const slot = this.state.policySlots.find(s => s.id === id);
            if (!slot) return { success: false, error: "Slot not found" };

            const oldVal = slot.decimalValue !== null ? `${slot.decimalValue} ${slot.unit}` : slot.stringValue;
            if (slot.decimalValue !== null) {
                slot.decimalValue = parseFloat(newValue);
            } else {
                slot.stringValue = String(newValue);
            }
            slot.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

            const newVal = slot.decimalValue !== null ? `${slot.decimalValue} ${slot.unit}` : slot.stringValue;
            this.logAction("PolicySlot", slot.key, "PolicySlot.Updated", oldVal, newVal, reason, 0);
            this.saveState();

            // Broadcast event for live cross-module reactivity
            window.dispatchEvent(new CustomEvent('cosmix:policySlotUpdated', {
                detail: { slot, oldVal, newVal, reason }
            }));

            return { success: true, slot };
        }

        toggleSlotLock(id) {
            const slot = this.state.policySlots.find(s => s.id === id);
            if (!slot) return;
            slot.isUserLocked = slot.isUserLocked ? 0 : 1;
            this.logAction("PolicySlot", slot.key, slot.isUserLocked ? "PolicySlot.Locked" : "PolicySlot.Unlocked", null, null, "CEO policy lock status toggle");
            this.saveState();
        }

        // Live Dynamic Policy Calculators
        calculateFuelClaim(distanceKm, fuelPrice = 275.50) {
            const fuelRate = this.getSlotValue('SiteStaff.Fuel.KmPerLiter', 28.0);
            const liters = distanceKm / fuelRate;
            const cost = liters * fuelPrice;
            return {
                rateKmPerLiter: fuelRate,
                liters: parseFloat(liters.toFixed(2)),
                totalPkr: parseFloat(cost.toFixed(2))
            };
        }

        calculateMaintenance(currentOdo) {
            const tuningKm = this.getSlotValue('SiteStaff.Tuning.KmInterval', 1000.0);
            const tuningAmt = this.getSlotValue('SiteStaff.Tuning.AmountPkr', 1800.0);
            const overhaulKm = this.getSlotValue('SiteStaff.Overhaul.KmInterval', 8000.0);
            const overhaulAmt = this.getSlotValue('SiteStaff.Overhaul.AmountPkr', 18000.0);

            const tuningCyclesCompleted = Math.floor(currentOdo / tuningKm);
            const overhaulCyclesCompleted = Math.floor(currentOdo / overhaulKm);

            const tuningProgress = Math.min(100, Math.round(((currentOdo % tuningKm) / tuningKm) * 100));
            const overhaulProgress = Math.min(100, Math.round(((currentOdo % overhaulKm) / overhaulKm) * 100));

            return {
                tuning: {
                    intervalKm: tuningKm,
                    amountPkr: tuningAmt,
                    progressPercent: tuningProgress,
                    currentInCycleKm: currentOdo % tuningKm,
                    remainingKm: tuningKm - (currentOdo % tuningKm),
                    totalEarnedPkr: tuningCyclesCompleted * tuningAmt
                },
                overhaul: {
                    intervalKm: overhaulKm,
                    amountPkr: overhaulAmt,
                    progressPercent: overhaulProgress,
                    currentInCycleKm: currentOdo % overhaulKm,
                    remainingKm: overhaulKm - (currentOdo % overhaulKm),
                    totalEarnedPkr: overhaulCyclesCompleted * overhaulAmt
                }
            };
        }

        calculateLatePayrollDeduction(monthlySalary, lateArrivalsCount) {
            const threshold = this.getSlotValue('SiteStaff.Late.CountForDayDeduction', 3.0);
            const graceMinutes = this.getSlotValue('SiteStaff.Late.GraceMinutes', 15.0);
            const dailyWage = monthlySalary / 30.0;
            // 3 late arrivals = 0.5 day (or 1 day) salary deduction
            const deductionUnits = Math.floor(lateArrivalsCount / threshold);
            const daysDeducted = deductionUnits * 0.5;
            const amountDeducted = daysDeducted * dailyWage;

            return {
                graceMinutes,
                threshold,
                daysDeducted,
                amountDeducted: parseFloat(amountDeducted.toFixed(2)),
                netSalaryAfterLate: parseFloat((monthlySalary - amountDeducted).toFixed(2))
            };
        }

        calculateKpiScore(gamingViolations = 0, missedCalls = 0, baseScore = 100) {
            const gamePenalty = this.getSlotValue('SiteStaff.Kpi.GamesEvidencePercentPerDay', 1.0);
            const missedCallPenalty = this.getSlotValue('SiteStaff.Kpi.MissedCallPercent', 1.0);

            const gameDeduction = gamingViolations * gamePenalty;
            const callDeduction = missedCalls * missedCallPenalty;
            const totalDeduction = gameDeduction + callDeduction;
            const finalScore = Math.max(0, baseScore - totalDeduction);

            return {
                gamePenaltyPerViolation: gamePenalty,
                missedCallPenaltyPerViolation: missedCallPenalty,
                totalDeduction: parseFloat(totalDeduction.toFixed(2)),
                finalScore: parseFloat(finalScore.toFixed(2))
            };
        }

        calculateSimPenaltyDeduction(isUnauthorizedOrInactive) {
            const penaltyAmount = this.getSlotValue('SiteStaff.Sim.NonUseDeductionPkr', 1500.0);
            return isUnauthorizedOrInactive ? penaltyAmount : 0;
        }

        // Commercial Margins Methods
        getMarginSettings() {
            return this.state.margins;
        }

        updateMarginBands(primaryPercent, alternatePercent, lockDefaults, notes, reason) {
            const oldVal = `Floor: ${this.state.margins.primaryPercent}%, Target: ${this.state.margins.alternatePercent}%`;
            this.state.margins.primaryPercent = parseFloat(primaryPercent);
            this.state.margins.alternatePercent = parseFloat(alternatePercent);
            this.state.margins.lockDefaults = Boolean(lockDefaults);
            if (notes) this.state.margins.notes = notes;

            const newVal = `Floor: ${this.state.margins.primaryPercent}%, Target: ${this.state.margins.alternatePercent}%`;
            this.logAction("CommercialMargin", "DefaultBands", "MarginBands.Updated", oldVal, newVal, reason, 0);
            this.saveState();
            return { success: true };
        }

        decideMarginOverride(requestId, decision, decisionNote) {
            const req = this.state.margins.overrideRequests.find(r => r.id === requestId);
            if (!req) return { success: false, error: "Request not found" };

            req.status = decision; // 'Approved' or 'Rejected'
            req.decisionBy = 'admin@cosmixengineering.com';
            req.decisionAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
            req.decisionNote = decisionNote;

            this.logAction("CommercialMargin", req.id, `MarginOverride.${decision}`, `${req.proposedMargin}%`, decision, decisionNote, 1);
            this.saveState();
            return { success: true, request: req };
        }

        // Roles & Permissions Methods
        getRoles() {
            return this.state.roles;
        }

        // SOP Stages Methods
        getSopStages(track = 'all') {
            return this.state.sopStages.filter(s => {
                if (track === 'all') return true;
                return s.track === parseInt(track, 10);
            });
        }

        // Audit Logs
        getAuditLogs(filter = 'all', searchQuery = '') {
            return this.state.auditLogs.filter(log => {
                const matchFilter = (filter === 'all' || log.entityType.toLowerCase() === filter.toLowerCase() || (filter === 'overrides' && log.isOverride === 1));
                const matchSearch = !searchQuery ||
                    log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    log.user.toLowerCase().includes(searchQuery.toLowerCase());
                return matchFilter && matchSearch;
            });
        }

        resetToDefaults() {
            localStorage.removeItem(STORAGE_KEY);
            this.state = this.loadState();
            this.logAction("System", "ALL", "System.Reset", "Custom", "Defaults", "Administrator triggered factory reset to all 40 CEO Policy Slots", 1);
            return true;
        }
    }

    window.CosmixAdminStore = new AdministratorStore();
})(window);
