using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmixERP.HR.Models
{
    public enum PayslipStatus
    {
        Draft = 1,
        Computed = 2,
        ApprovedByFinance = 3,
        ApprovedByCEO = 4,
        Disbursed = 5
    }

    [Table("Payslips", Schema = "hr")]
    public class Payslip
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string PayslipNumber { get; set; } = string.Empty; // e.g. SLP-2026-09-0101

        public int EmployeeId { get; set; }
        public virtual Employee? Employee { get; set; }

        public int CostCenterSiteId { get; set; } // Working Project Site to charge expense
        public virtual ProjectSite? CostCenterSite { get; set; }

        public int Month { get; set; } // 1 - 12
        public int Year { get; set; } // 2026

        public int TotalWorkingDays { get; set; } = 30;
        public decimal DaysPresent { get; set; }
        public decimal DaysAbsent { get; set; }
        public int LateArrivalCount { get; set; }

        // --- Earnings Components ---
        [Column(TypeName = "decimal(18,2)")]
        public decimal BaseSalary { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal BasicPay { get; set; } // 50% of Base

        [Column(TypeName = "decimal(18,2)")]
        public decimal HouseRentAllowance { get; set; } // 40% of Base

        [Column(TypeName = "decimal(18,2)")]
        public decimal MedicalAllowance { get; set; } // 10% of Base

        [Column(TypeName = "decimal(18,2)")]
        public decimal SiteHardshipAllowance { get; set; } = 0.0m;

        [Column(TypeName = "decimal(5,2)")]
        public decimal OvertimeHours { get; set; } = 0.0m;

        [Column(TypeName = "decimal(18,2)")]
        public decimal OvertimeEarnings { get; set; } = 0.0m;

        [Column(TypeName = "decimal(18,2)")]
        public decimal GrossPayable { get; set; }

        // --- Deductions Components ---
        [Column(TypeName = "decimal(18,2)")]
        public decimal EobiEmployeeDeduction { get; set; } = 580.0m; // Statutory EOBI

        [Column(TypeName = "decimal(18,2)")]
        public decimal IncomeTaxSection149 { get; set; } = 0.0m; // FBR WHT Tax

        [Column(TypeName = "decimal(18,2)")]
        public decimal AttendanceLateDeduction { get; set; } = 0.0m; // 15-min grace rule

        [Column(TypeName = "decimal(18,2)")]
        public decimal AbsenteeismDeduction { get; set; } = 0.0m;

        [Column(TypeName = "decimal(18,2)")]
        public decimal AdvanceLoanEmiDeduction { get; set; } = 0.0m; // EMI recovery

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalDeductions { get; set; }

        // --- Net Payable ---
        [Column(TypeName = "decimal(18,2)")]
        public decimal NetSalary { get; set; }

        public PayslipStatus Status { get; set; } = PayslipStatus.Draft;

        [MaxLength(50)]
        public string? BankDisbursementBatchRef { get; set; }

        public DateTime? DisbursedDate { get; set; }

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}
