# Cosmix Engineering ERP - HR & Site Operations ERD

This document specifies the complete Entity Relationship Diagram (ERD), data dictionary, primary & foreign keys, indexing strategy, and database constraints for Cosmix Engineering (.NET 10 & React architecture).

---

## 1. Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    PROJECT_SITE ||--o{ EMPLOYEE : "deploys"
    PROJECT_SITE ||--o{ ATTENDANCE_LOG : "site location for"
    PROJECT_SITE ||--o{ PAYSLIP : "cost center for"
    EMPLOYEE ||--o{ ATTENDANCE_LOG : "logs daily"
    EMPLOYEE ||--o{ ADVANCE_LOAN : "applies for"
    EMPLOYEE ||--o{ PAYSLIP : "receives monthly"
    SALARY_RULE ||..o{ PAYSLIP : "governs calculation of"

    PROJECT_SITE {
        int Id PK
        string SiteCode UK "CMX-SITE-101"
        string SiteName "Karachi High-Rise Tower"
        string ClientName "Emaar Properties"
        string Category "Commercial High-Rise"
        string City "Karachi"
        string CompleteAddress "Clifton Block 4"
        decimal Latitude "24.860700"
        decimal Longitude "67.001100"
        double GeofenceRadiusMeters "80.0"
        int InchargeManagerId FK "Employee Ref"
        string BiometricDeviceId "ZKTeco-MB20-KHI"
        string BiometricIpAddress "192.168.10.45"
        int BiometricPort "4370"
        boolean IsBiometricOnline "True"
        datetime LastBiometricSync
        datetime StartDate
        decimal ContractValuePKR
        int Status "1:Active, 2:OnHold, 3:Done"
    }

    EMPLOYEE {
        int Id PK
        string EmployeeCode UK "CMX-0101"
        string FullName "Engr. Bilal Farooq"
        string FatherOrHusbandName "Farooq Ahmed"
        string CNIC UK "42201-1234567-1"
        string Gender "Male"
        date DateOfBirth "1992-05-14"
        string MaritalStatus "Married"
        string PhotoUrl "Cloud storage or Base64"
        string ResidentialAddress "Flat B-4, Gulshan-e-Iqbal, Karachi"
        string MobilePhone "0300-1234567"
        string PersonalEmail "bilal.f@gmail.com"
        string OfficialEmail "bilal@cosmix.com"
        string EmergencyContactName "Sajid Mehmood"
        string EmergencyContactRelation "Brother"
        string EmergencyContactPhone "0321-9876543"
        string PreviousEmployerName "Descon Engineering"
        decimal LastDrawnSalary "70000.00"
        string ReasonForLeavingPreviousJob "Career Growth"
        string Designation "Sr. HVAC Site Engineer"
        string Department "MEP Projects"
        int EmploymentType "1:Permanent, 2:Contract"
        int Status "1:Draft, 2:PendingCEO, 3:Active"
        int ProjectSiteId FK "Site Allocation"
        date DateOfJoining "2024-03-01"
        decimal GrossSalary "85000.00"
        string PaymentMode "Bank Transfer"
        string BankName "Meezan Bank"
        string BankAccountNumber "02010108928371"
        string MobileAppUsername "bilal.cosmix"
        string PasswordHash "Argon2 / PBKDF2"
        boolean IsMobileGpsPunchEnabled "True"
        boolean IsDeleted "Soft Delete"
    }

    SALARY_RULE {
        int Id PK
        string RuleCode UK "EOBI-STAT / FBR-WHT"
        string RuleName "EOBI Employee Share / FBR 149"
        int Category "Statutory, Penalty, Allowance"
        int ImpactType "Deduction, Addition, Policy"
        int CalculationMethod "Fixed, Percent, Multiplier"
        decimal NumericValue "580.00 / 40.00 / 1.50"
        string ConditionFormula "Lates >= 3 / Gross > 50k"
        string Description "Policy description"
        boolean IsStatutory "True / False"
        boolean IsActive "True / False"
        datetime EffectiveDate
    }

    ATTENDANCE_LOG {
        bigint Id PK
        int EmployeeId FK
        int ProjectSiteId FK
        date AttendanceDate "2026-09-08"
        time CheckInTime "07:54:12"
        time CheckOutTime "17:10:00"
        int PunchChannel "1:Biometric, 2:GPS"
        decimal PunchLatitude "24.860710"
        decimal PunchLongitude "67.001095"
        boolean IsWithinGeofence "True (within 80m)"
        double DistanceFromSiteMeters "14.2"
        int Status "1:Present, 2:Late, 4:Absent"
        int LateArrivalMinutes "0"
        boolean IsLatePenaltyApplied "False"
        decimal RegularHoursWorked "8.0"
        decimal OvertimeHours "1.5"
    }

    ADVANCE_LOAN {
        int Id PK
        string LoanApplicationNumber UK "ADV-2026-089 / LON-2026-014"
        int Category "1:SalaryAdvance, 2:CompanyLoan"
        int EmployeeId FK
        datetime RequestDate "2026-09-01"
        decimal RequestedAmount "50000.00"
        decimal ApprovedAmount "50000.00"
        int RepaymentMonths "Dedicated field: 1 to 24 Months"
        int DeductionMethod "1:FlatAmountPKR, 2:PercentageOfSalary"
        decimal DeductionValue "Unified single field: PKR or %"
        decimal MonthlyDeductionAmountPKR "Computed monthly payroll cut"
        int PaidInstallmentsCount "2"
        int RemainingInstallmentsCount "3"
        decimal OutstandingBalance "30000.00"
        string PurposeCategory "Vehicle Purchase / Medical"
        string GuarantorName "Engr. Bilal Farooq"
        string CollateralSecurityDetails "Security Cheque & Deed"
        int Status "1:Pending, 5:ApprovedAndActive, 7:Settled"
        string ApprovedByCEO "Tariq Mansoor"
    }

    PAYSLIP {
        bigint Id PK
        string PayslipNumber UK "SLP-2026-09-0101"
        int EmployeeId FK
        int CostCenterSiteId FK
        int Month "9"
        int Year "2026"
        int TotalWorkingDays "30"
        decimal DaysPresent "26.0"
        decimal DaysAbsent "0.0"
        decimal BaseSalary "85000.00"
        decimal BasicPay "42500.00"
        decimal HouseRentAllowance "34000.00"
        decimal MedicalAllowance "8500.00"
        decimal SiteHardshipAllowance "5000.00"
        decimal OvertimeEarnings "4250.00"
        decimal GrossPayable "94250.00"
        decimal EobiEmployeeDeduction "580.00"
        decimal IncomeTaxSection149 "1250.00"
        decimal AttendanceLateDeduction "0.00"
        decimal AdvanceLoanEmiDeduction "10000.00"
        decimal TotalDeductions "11830.00"
        decimal NetSalary "82420.00"
        int Status "1:Draft, 4:CEOApproved, 5:Disbursed"
        string BankDisbursementBatchRef "HBL-CORP-98214"
    }
```

---

## 2. Table Dictionaries & Schema Specifications

### `hr.Employees`
- **Primary Key**: `Id` (INT, IDENTITY)
- **Unique Keys**: `EmployeeCode` (`CMX-XXXX`), `CNIC` (`XXXXX-XXXXXXX-X`)
- **Key Relationships**:
  - `ProjectSiteId` $\rightarrow$ `hr.ProjectSites(Id)` (Restrict Delete)
- **Key Fields Added**:
  - `PhotoUrl`: Stored cloud URI or CDN URL for the uploaded passport photo.
  - `ResidentialAddress`: Detailed home address for site correspondence and police verification.
  - `EmergencyContactName`, `EmergencyContactRelation`, `EmergencyContactPhone`: Dedicated emergency contact record.
  - `PreviousEmployerName`, `LastDrawnSalary`, `ReasonForLeavingPreviousJob`: Background verification & negotiation reference.

### `hr.ProjectSites`
- **Primary Key**: `Id` (INT, IDENTITY)
- **Unique Key**: `SiteCode` (`CMX-SITE-XXX`)
- **Key Fields**:
  - `Latitude`, `Longitude`: Geodetic coordinates (decimal 9,6).
  - `GeofenceRadiusMeters`: Maximum allowed distance from coordinates for mobile check-ins (default: 80m).
  - `BiometricDeviceId`, `BiometricIpAddress`, `BiometricPort`: Hardware sync configuration for local ZKTeco devices.

### `hr.SalaryRules`
- **Primary Key**: `Id` (INT, IDENTITY)
- **Unique Key**: `RuleCode` (`EOBI-STAT`, `FBR-WHT`, `ATT-LATE-15`, `HRA-40`, etc.)
- **Category Matrix**:
  - Statutory: EOBI (PKR 580 flat employee contribution), FBR Sec 149 Withholding.
  - Attendance Penalties: 15-minute grace rule, 3 late arrivals = 0.5 day wage deduction, unexcused absence = 1.0 day cut.
  - Allowances: HRA 40%, Medical 10%, Remote Site Hardship PKR, Overtime multipliers (1.5x / 2.0x).
  - Loans: Maximum advance salary cap (50% of gross), maximum recovery installments (3 to 6 months).

### `hr.AttendanceLogs`
- **Primary Key**: `Id` (BIGINT, IDENTITY)
- **Unique Constraint**: `(EmployeeId, AttendanceDate)`
- **Foreign Keys**:
  - `EmployeeId` $\rightarrow$ `hr.Employees(Id)`
  - `ProjectSiteId` $\rightarrow$ `hr.ProjectSites(Id)`
- **Geofence Calculation**:
  Distance calculated via Haversine formula on mobile check-in:
  $$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
  If $d \le \text{GeofenceRadiusMeters}$, `IsWithinGeofence = True`, otherwise flagged as exception for HR review.

### `hr.Payslips`
- **Primary Key**: `Id` (BIGINT, IDENTITY)
- **Unique Constraint**: `(EmployeeId, Month, Year)`
- **Cost Center Tracking**: `CostCenterSiteId` allocates worker salary directly to the client project P&L.
