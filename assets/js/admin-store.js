// assets/js/admin-store.js
// Central Data Store and State Management for Admin, Facilities, Fleet & Site Staff Policy Module
// Matching CosmixHub Reference ERP (.NET 8 Clean Architecture / PolicySlots / SiteStaffPolicy)

(function(window) {
    'use strict';

    const STORAGE_KEY = 'cosmix.admin.demo.v1';

    const DEFAULT_FLEET = [
        {
            id: "BIKE-001",
            type: "Motorcycle",
            makeModel: "Honda CD 70 (2024)",
            regNo: "KHI-KBL-4821",
            assignedTo: "Farhan Ali (Senior Site Tech)",
            phone: "0300-1122334",
            site: "DHA Phase 8 — HVAC & MEP",
            currentOdo: 7420,
            lastTuningOdo: 7000,
            nextTuningOdo: 8000,
            lastOverhaulOdo: 0,
            nextOverhaulOdo: 8000,
            fuelRateKmPerLiter: 28.0,
            status: "Active",
            simActive: true
        },
        {
            id: "BIKE-002",
            type: "Motorcycle",
            makeModel: "Honda CG 125 (2023)",
            regNo: "KHI-KCK-9102",
            assignedTo: "Tariq Mehmood (Purchaser & Rider)",
            phone: "0300-5566778",
            site: "Karachi Central Warehouse",
            currentOdo: 15300,
            lastTuningOdo: 15000,
            nextTuningOdo: 16000,
            lastOverhaulOdo: 8000,
            nextOverhaulOdo: 16000,
            fuelRateKmPerLiter: 28.0,
            status: "Active",
            simActive: true
        },
        {
            id: "VAN-001",
            type: "Delivery Van",
            makeModel: "Suzuki Carry Bolan (2022)",
            regNo: "KHI-LE-7822",
            assignedTo: "Nadeem (Office Rider / Transport)",
            phone: "0300-9988771",
            site: "Korangi Workshop & Factory",
            currentOdo: 34200,
            lastTuningOdo: 33500,
            nextTuningOdo: 36000,
            lastOverhaulOdo: 30000,
            nextOverhaulOdo: 40000,
            fuelRateKmPerLiter: 14.0,
            status: "Active",
            simActive: true
        }
    ];

    const DEFAULT_FUEL_CLAIMS = [
        {
            id: "FCLM-2026-001",
            vehicleId: "BIKE-001",
            driver: "Farhan Ali",
            claimDate: "2026-09-24",
            fromLocation: "Site 1 (DHA Phase 8)",
            toLocation: "Site 2 (Clifton Tower)",
            distanceKm: 42.0,
            fuelConsumedLiters: 1.5, // 42 km / 28 km/L = 1.5 L
            fuelPricePerLiter: 275.50,
            totalClaimPkr: 413.25,
            homeOfficeExcluded: true,
            status: "Approved",
            auditedBy: "admin@cosmixengineering.com"
        },
        {
            id: "FCLM-2026-002",
            vehicleId: "BIKE-002",
            driver: "Tariq Mehmood",
            claimDate: "2026-09-25",
            fromLocation: "Central Store",
            toLocation: "Port Qasim Substation",
            distanceKm: 84.0,
            fuelConsumedLiters: 3.0, // 84 km / 28 km/L = 3.0 L
            fuelPricePerLiter: 275.50,
            totalClaimPkr: 826.50,
            homeOfficeExcluded: true,
            status: "Pending",
            auditedBy: null
        }
    ];

    const DEFAULT_FACILITIES = [
        {
            id: "FAC-HQ",
            name: "Cosmix Head Office",
            type: "Corporate Headquarters",
            city: "Karachi",
            address: "Suite 402, Business Center, Shahrah-e-Faisal, Karachi",
            phone: "021-34567890",
            capacity: 35,
            incharge: "Zeeshan Ashraf (CEO)",
            status: "Operational"
        },
        {
            id: "FAC-FACT",
            name: "Korangi Manufacturing & Workshop",
            type: "Ducting & CAC Assembly Factory",
            city: "Karachi",
            address: "Plot 88, Sector 15, Korangi Industrial Area, Karachi",
            phone: "021-35012345",
            capacity: 65,
            incharge: "Engr. Rashid Khan (Factory Manager)",
            status: "Operational"
        },
        {
            id: "FAC-WH",
            name: "Central Logistics & Storage Hub",
            type: "Central Warehouse (Store A)",
            city: "Karachi",
            address: "Warehouse Complex B-12, SITE Area, Karachi",
            phone: "021-32598765",
            capacity: 25,
            incharge: "Tariq Mehmood (Warehouse Incharge)",
            status: "Operational"
        },
        {
            id: "FAC-ISB",
            name: "Islamabad Regional Project Office",
            type: "Northern Regional Branch",
            city: "Islamabad",
            address: "Office 12, Executive Heights, Blue Area, Islamabad",
            phone: "051-2890123",
            capacity: 15,
            incharge: "Usman Malik (Regional Project Lead)",
            status: "Operational"
        }
    ];

    const DEFAULT_SIM_CARDS = [
        {
            id: "SIM-001",
            mobileNumber: "0300-1122334",
            network: "Jazz Corporate",
            assignedTo: "Farhan Ali",
            role: "Senior Site Tech",
            site: "DHA Phase 8",
            plan: "Corporate Postpaid 15GB",
            lastActiveUtc: "2026-09-25 18:30:00",
            isActive: true,
            penaltyApplicable: false
        },
        {
            id: "SIM-002",
            mobileNumber: "0300-5566778",
            network: "Jazz Corporate",
            assignedTo: "Tariq Mehmood",
            role: "Purchaser & Store Officer",
            site: "Central Warehouse",
            plan: "Corporate Postpaid 20GB",
            lastActiveUtc: "2026-09-25 19:15:00",
            isActive: true,
            penaltyApplicable: false
        },
        {
            id: "SIM-003",
            mobileNumber: "0300-4433221",
            network: "Zong Corporate",
            assignedTo: "Kamran Qureshi",
            role: "Installation Technician",
            site: "Lucky Textile Project",
            plan: "Corporate Postpaid 10GB",
            lastActiveUtc: "2026-09-18 10:00:00", // >7 days inactive!
            isActive: false,
            penaltyApplicable: true // Triggers 1,500 PKR deduction
        },
        {
            id: "SIM-004",
            mobileNumber: "0300-9988776",
            network: "Jazz Corporate",
            assignedTo: "Engr. Faisal Tariq",
            role: "Billing Engineer",
            site: "Lucky One Mall",
            plan: "Corporate Postpaid 25GB",
            lastActiveUtc: "2026-09-25 20:45:00",
            isActive: true,
            penaltyApplicable: false
        }
    ];

    class AdminStore {
        constructor() {
            this.state = this.loadState();
            this.bindPolicyUpdates();
        }

        loadState() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                try {
                    return JSON.parse(raw);
                } catch (e) {
                    console.error('Failed to parse admin state, falling back to default:', e);
                }
            }
            const initial = {
                fleet: DEFAULT_FLEET,
                fuelClaims: DEFAULT_FUEL_CLAIMS,
                facilities: DEFAULT_FACILITIES,
                simCards: DEFAULT_SIM_CARDS
            };
            this.saveState(initial);
            return initial;
        }

        saveState(state) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state || this.state));
        }

        bindPolicyUpdates() {
            window.addEventListener('cosmix:policySlotUpdated', (e) => {
                const { slot } = e.detail;
                if (slot && slot.key === 'SiteStaff.Fuel.KmPerLiter') {
                    const newRate = slot.decimalValue || 28.0;
                    this.state.fleet.forEach(v => {
                        if (v.type === 'Motorcycle') {
                            v.fuelRateKmPerLiter = newRate;
                        }
                    });
                    this.saveState();
                }
            });
        }

        getPolicySlotValue(key, fallback) {
            if (window.CosmixAdminStore && typeof window.CosmixAdminStore.getSlotValue === 'function') {
                return window.CosmixAdminStore.getSlotValue(key, fallback);
            }
            return fallback;
        }

        calculateFuel(distanceKm, fuelRateKmPerLiter = null, pricePerLiter = 275.50) {
            const effectiveRate = fuelRateKmPerLiter || this.getPolicySlotValue('SiteStaff.Fuel.KmPerLiter', 28.0);
            const liters = distanceKm / effectiveRate;
            const cost = liters * pricePerLiter;
            return {
                rateUsed: effectiveRate,
                liters: parseFloat(liters.toFixed(2)),
                costPkr: parseFloat(cost.toFixed(2))
            };
        }

        addFuelClaim(vehicleId, driver, fromLocation, toLocation, distanceKm, fuelPrice = 275.50) {
            const veh = this.state.fleet.find(v => v.id === vehicleId);
            const customRate = (veh && veh.type !== 'Motorcycle') ? veh.fuelRateKmPerLiter : null;
            const calc = this.calculateFuel(parseFloat(distanceKm), customRate, fuelPrice);

            const newClaim = {
                id: `FCLM-2026-${String(this.state.fuelClaims.length + 1).padStart(3, '0')}`,
                vehicleId,
                driver,
                claimDate: new Date().toISOString().substring(0, 10),
                fromLocation,
                toLocation,
                distanceKm: parseFloat(distanceKm),
                fuelConsumedLiters: calc.liters,
                fuelPricePerLiter: fuelPrice,
                totalClaimPkr: calc.costPkr,
                homeOfficeExcluded: true,
                status: "Pending",
                auditedBy: null
            };
            this.state.fuelClaims.unshift(newClaim);
            this.saveState();
            return newClaim;
        }

        approveFuelClaim(id) {
            const claim = this.state.fuelClaims.find(c => c.id === id);
            if (claim) {
                claim.status = "Approved";
                claim.auditedBy = "admin@cosmixengineering.com";
                this.saveState();
            }
        }

        recordOdometer(vehicleId, newOdo) {
            const veh = this.state.fleet.find(v => v.id === vehicleId);
            if (veh) {
                veh.currentOdo = parseInt(newOdo, 10);
                this.saveState();
            }
        }

        applySimPenalty(simId) {
            const sim = this.state.simCards.find(s => s.id === simId);
            const deductionAmount = this.getPolicySlotValue('SiteStaff.Sim.NonUseDeductionPkr', 1500.0);
            if (sim) {
                sim.penaltyApplicable = true;
                this.saveState();
                return { success: true, deductionAmount };
            }
            return { success: false, deductionAmount };
        }
    }

    window.CosmixGeneralAdminStore = new AdminStore();
})(window);
