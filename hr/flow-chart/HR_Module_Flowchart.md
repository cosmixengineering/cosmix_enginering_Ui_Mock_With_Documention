# Cosmix Engineering ERP - HR & Site Operations Business Process Flowchart

This document details the end-to-end business workflows covering Employee Onboarding with Photo/Address/Emergency/Experience verification, Working Sites & Geofencing Management, Biometric Attendance with 15-min Grace & Late Penalty Rules, and Monthly Payroll Generation.

---

## 1. Complete Workflow Diagram (Mermaid)

```mermaid
flowchart TD
    subgraph Onboarding["1. Employee Onboarding & Verification"]
        A1[HR opens Employee Directory] --> A2[Fill Onboarding Form]
        A2 --> A3[Upload Passport Photo<br/>Live Image Preview]
        A3 --> A4[Enter Personal & Home Address]
        A4 --> A5[Enter Emergency Contact<br/>Name, Relation, Phone]
        A5 --> A6[Enter Previous Employer<br/>Last Co, Last Salary, Reason]
        A6 --> A7[Select Site Allocation & Role]
        A7 --> A8[Submit to CEO Approval Queue]
        A8 --> B1{CEO Review & Approval}
        B1 -- Rejected --> B2[Draft Returned to HR with Remarks]
        B1 -- Approved --> B3[Employee Activated & Mobile Credentials Created]
    end

    subgraph SiteMgmt["2. Working Sites & Hardware Setup"]
        S1[HR opens Working Sites Page] --> S2[Register Project Site & Client]
        S2 --> S3[Set GPS Coordinates Lat/Long & Geofence 80m]
        S3 --> S4[Assign Site Project Manager]
        S4 --> S5[Configure Biometric IP & Sync Port 4370]
        S5 --> S6[Site Deployed for Workforce Check-in]
    end

    subgraph RulesEngine["3. Salary & Deductions Policy Engine"]
        R1[Configure Salary Rules & Deductions]
        R1 --> R2[Statutory: EOBI Rs. 580 Flat]
        R1 --> R3[Statutory: FBR Sec 149 WHT Slabs]
        R1 --> R4[Attendance: 15-min Grace Period]
        R1 --> R5[Attendance: 3 Lates = 0.5 Day Wage Cut]
        R1 --> R6[Allowances: HRA 40%, Medical 10%, Hardship PKR]
        R1 --> R7[Loans: Max 50% Salary Advance Cap]
    end

    subgraph AttendanceOps["4. Daily Attendance & Geofence Validation"]
        B3 --> AT1[Worker arrives at Site]
        S6 --> AT1
        AT1 --> AT2{Punch Method}
        AT2 -- Biometric Machine --> AT3[ZKTeco Hardware Synced via TCP/IP]
        AT2 -- Cosmix Mobile App --> AT4[Capture Phone GPS Lat/Long]
        AT4 --> AT5{Within 80m Geofence?}
        AT5 -- Yes --> AT6[Mark Verified Site Punch]
        AT5 -- No --> AT7[Flag Geofence Breach for HR Review]
        AT3 --> AT8[Calculate Check-in Timestamp]
        AT6 --> AT8
        AT8 --> AT9{Arrival > 08:15 AM?}
        AT9 -- No --> AT10[Mark Status = Present]
        AT9 -- Yes --> AT11[Mark Status = Late & Record Late Minutes]
    end

    subgraph MonthlyPayroll["5. Payroll Run & Net Salary Computation"]
        M1[HR Initiates Monthly Payroll] --> M2[Aggregate 30-Day Attendance Matrix]
        M2 --> M3[Sum Lates & Absences]
        R4 -.-> M3
        R5 -.-> M3
        M3 --> M4[Calculate Gross Earnings<br/>Basic 50% + HRA 40% + Med 10% + OT]
        R2 -.-> M5[Apply EOBI Deduction Rs. 580]
        R3 -.-> M5[Apply FBR Sec 149 Income Tax]
        M3 -.-> M5[Apply Attendance Penalties]
        R7 -.-> M6[Deduct Active Advance Loan EMI]
        M4 --> M7[Compute Net Salary = Gross - Total Deductions]
        M5 --> M7
        M6 --> M7
        M7 --> M8[Generate Site Cost Center Payslips]
        M8 --> M9[Finance Verification & CEO Approval]
        M9 --> M10[Generate Bank Transfer Advice & Release Payslips]
    end
```

---

## 2. Business Flow Highlights

1. **Strict Multi-Tier Verification**:
   - HR enters full credentials including residential address, emergency contact details, and prior employer salary benchmarks.
   - Profile stays in `Draft / PendingCEO` until CEO signs off on the compensation package.

2. **Site Operations & Automated Geofencing**:
   - Project sites maintain geodetic coordinates with an 80m perimeter.
   - Workers using the Cosmix Android/iOS app are checked against the site radius before a punch is accepted as valid.
   - Site biometrics automatically sync hourly to ensure field attendance integrity.

3. **Rulebook Driven Payroll**:
   - Instead of hardcoding deductions in payroll, calculations pull dynamically from the `SalaryRules` repository.
   - EOBI contribution (Rs. 580) and FBR tax withholding are automatically computed.
   - 3 cumulative late arrivals (after the 15-min grace threshold) trigger a half-day wage deduction automatically during payroll computation.
