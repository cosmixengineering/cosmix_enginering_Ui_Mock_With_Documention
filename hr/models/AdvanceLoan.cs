using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmixERP.HR.Models
{
    public enum ApplicationCategory
    {
        SalaryAdvance = 1,  // Short-term (1 - 3 months) against current wage
        CompanyLoan = 2     // Long-term (6 - 24 months) with collateral/guarantor
    }

    public enum DeductionMethod
    {
        FlatAmountPKR = 1,         // Fixed PKR amount deducted per payroll cycle
        PercentageOfSalary = 2     // Percentage (%) calculated against employee base salary
    }

    public enum LoanStatus
    {
        Draft = 1,
        PendingSitePMApproval = 2,
        PendingHRReview = 3,
        PendingCEOApproval = 4,
        ApprovedAndActive = 5,
        Rejected = 6,
        FullySettled = 7
    }

    [Table("AdvanceLoans", Schema = "hr")]
    public class AdvanceLoan
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(25)]
        public string LoanApplicationNumber { get; set; } = string.Empty; // e.g. ADV-2026-089 or LON-2026-014

        public ApplicationCategory Category { get; set; } = ApplicationCategory.SalaryAdvance;

        public int EmployeeId { get; set; }
        public virtual Employee? Employee { get; set; }

        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18,2)")]
        public decimal RequestedAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ApprovedAmount { get; set; }

        // --- Dedicated Repayment Duration Field (Months) ---
        public int RepaymentMonths { get; set; } = 3; // Dedicated field for duration (1, 2, 3, 6, 12, 18, 24 months)

        // --- Deduction Method Selection (Flat vs Percentage) ---
        public DeductionMethod DeductionMethod { get; set; } = DeductionMethod.FlatAmountPKR;

        // --- Single Unified Deduction Value Field ---
        [Column(TypeName = "decimal(18,4)")]
        public decimal DeductionValue { get; set; } // Either flat PKR (e.g. 10000.00) or percentage (e.g. 20.00 %)

        // Computed / Applied Monthly PKR Cut for Payroll Engine
        [Column(TypeName = "decimal(18,2)")]
        public decimal MonthlyDeductionAmountPKR { get; set; }

        public int PaidInstallmentsCount { get; set; } = 0;

        public int RemainingInstallmentsCount { get; set; } = 3;

        [Column(TypeName = "decimal(18,2)")]
        public decimal OutstandingBalance { get; set; }

        // --- Loan Specific Security & Purpose ---
        [MaxLength(120)]
        public string PurposeCategory { get; set; } = "Medical Emergency"; // Vehicle Purchase, Home Renovation, etc.

        [MaxLength(120)]
        public string? GuarantorName { get; set; } // Senior employee or manager guarantor

        public int? GuarantorEmployeeId { get; set; }

        [MaxLength(250)]
        public string? CollateralSecurityDetails { get; set; } // Original cheque, undertaking bond, educational degree

        [MaxLength(350)]
        public string? JustificationRemarks { get; set; }

        // --- Approval & Lifecycle ---
        public LoanStatus Status { get; set; } = LoanStatus.PendingCEOApproval;

        public DateTime? DisbursedDate { get; set; }

        [MaxLength(100)]
        public string? ApprovedByCEO { get; set; }

        public DateTime? CEOApprovalTimestamp { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
