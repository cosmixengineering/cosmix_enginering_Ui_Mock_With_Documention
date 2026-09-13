# Cosmix Engineering ERP - HR Architecture & .NET 10 / React Technical Specifications

This technical design document provides the **Project Manager** and development teams with architectural blueprints, REST API contracts, and React component structures for Cosmix Engineering (.NET 10 C# & React).

---

## 1. System Architecture Overview

```
[ React SPA Client (Tailwind + Vite) ]
                 |
                 | (HTTPS / JWT Bearer Auth)
                 v
[ ASP.NET Core (.NET 10) Web API ]
  ├── Endpoints / Controllers
  │    ├── EmployeesController
  │    ├── ProjectSitesController
  │    ├── SalaryRulesController
  │    ├── AttendanceController
  │    ├── AdvanceLoansController
  │    └── PayrollController
  ├── Application & Domain Layer
  │    ├── Services (AttendanceEngine, GeofenceService, PayrollCalculator)
  │    └── DTOs & FluentValidators
  └── Data Access Layer (EF Core 10)
       ├── HRDbContext (SQL Server / PostgreSQL)
       └── Database Migrations
                 |
                 v
[ SQL Server Database (Schema: hr) ]
```

---

## 2. Key REST API Endpoints (.NET 10)

### 2.1 Working Sites Management
- `GET /api/hr/sites`
  - Returns list of all working project sites, deployed worker counts, geofence radius, and biometric sync status.
- `GET /api/hr/sites/{id}`
  - Returns single site details including incharge manager, GPS coordinates, and connected hardware.
- `POST /api/hr/sites`
  - Request Body:
    ```json
    {
      "siteCode": "CMX-SITE-105",
      "siteName": "Multan Metro Bus Substation",
      "clientName": "Punjab Mass Transit Authority",
      "category": "Infrastructure / Govt",
      "city": "Multan",
      "completeAddress": "Chungi No. 9, Bosan Road, Multan",
      "latitude": 30.1984,
      "longitude": 71.4687,
      "geofenceRadiusMeters": 80.0,
      "inchargeManagerId": 14,
      "biometricIpAddress": "192.168.12.100",
      "biometricPort": 4370,
      "contractValuePKR": 45000000.00
    }
    ```
- `PUT /api/hr/sites/{id}`
  - Updates site perimeter, PM assignment, or hardware configuration.

### 2.2 Salary Rules & Deductions Policy
- `GET /api/hr/salary-rules`
  - Returns all active statutory tax rates, attendance penalty thresholds, and allowance percentages.
- `POST /api/hr/salary-rules`
  - Request Body:
    ```json
    {
      "ruleCode": "ATT-LATE-15",
      "ruleName": "15-Minute Grace Period Rule",
      "category": "AttendancePenalty",
      "impactType": "Deduction",
      "calculationMethod": "DayFractionCut",
      "numericValue": 0.5,
      "conditionFormula": "LateArrivals >= 3",
      "description": "3 late arrivals exceeding 15 minutes trigger a 0.5 day wage cut",
      "isStatutory": false,
      "isActive": true
    }
    ```
- `PATCH /api/hr/salary-rules/{id}/toggle-status`
  - Enables or disables a rule from future payroll calculation cycles.

### 2.3 Employee Master & Onboarding
- `GET /api/hr/employees`
  - Query Params: `?page=1&pageSize=20&search=bilal&role=HVAC&siteId=1`
- `POST /api/hr/employees` (Multipart Form Data / JSON)
  - Fields:
    - Photo file upload (`IFormFile photoFile`)
    - Personal: `fullName`, `fatherOrHusbandName`, `cnic`, `gender`, `dateOfBirth`, `residentialAddress`, `mobilePhone`
    - Emergency: `emergencyContactName`, `emergencyContactRelation`, `emergencyContactPhone`
    - Previous Employment: `previousEmployerName`, `lastDrawnSalary`, `reasonForLeavingPreviousJob`
    - Deployment: `designation`, `department`, `projectSiteId`, `grossSalary`, `paymentMode`, `bankName`, `bankAccountNumber`
- `POST /api/hr/employees/{id}/approve`
  - CEO approval endpoint to move employee from `PendingCEOApproval` to `Active`.

### 2.4 Attendance & Geofencing Punch
- `POST /api/hr/attendance/mobile-punch`
  - Request Body:
    ```json
    {
      "employeeId": 101,
      "projectSiteId": 2,
      "latitude": 24.860715,
      "longitude": 67.001105,
      "punchTimestamp": "2026-09-08T07:54:12Z"
    }
    ```
  - Backend verifies distance against `ProjectSite.GeofenceRadiusMeters` using Haversine calculation. Returns `isWithinGeofence: true` or raises breach alert.

---

## 3. React Frontend Component Hierarchy

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── SubNav.tsx
│   ├── sites/
│   │   ├── SiteListTable.tsx
│   │   ├── SiteModalDrawer.tsx
│   │   ├── GeofenceMapPreview.tsx
│   │   └── BiometricDeviceStatusBadge.tsx
│   ├── salary-rules/
│   │   ├── RulesListTable.tsx
│   │   ├── RuleFormModal.tsx
│   │   └── PolicySimulationWidget.tsx
│   ├── employees/
│   │   ├── EmployeeTable.tsx
│   │   ├── EmployeeOnboardingModal.tsx (with Photo Upload & Emergency Contacts)
│   │   └── EmployeeProfileCard.tsx
│   └── payroll/
│       ├── MonthlyAttendanceMatrix.tsx
│       ├── PayrollEngineRunner.tsx
│       └── PayslipPreviewModal.tsx
├── services/
│   ├── siteService.ts
│   ├── ruleService.ts
│   ├── employeeService.ts
│   └── payrollService.ts
└── hooks/
    ├── useSites.ts
    ├── useRules.ts
    └── useGeoLocation.ts
```
