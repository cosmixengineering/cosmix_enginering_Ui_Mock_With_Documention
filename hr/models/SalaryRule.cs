using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmixERP.HR.Models
{
    public enum RuleCategory
    {
        StatutoryDeduction = 1,     // EOBI, FBR Section 149 Withholding Tax
        AttendancePenalty = 2,      // Late Grace, Half Day, Absent Penalty
        Allowance = 3,              // HRA, Medical, Hardship Site Allowance
        OvertimePolicy = 4,         // 1.5x Normal OT, 2.0x Gazetted/Sunday OT
        AdvanceSalaryPolicy = 5     // Max advance cap, recovery installments
    }

    public enum RuleImpactType
    {
        Deduction = 1,              // Reduces net salary
        AdditionOrAllowance = 2,    // Increases gross earnings
        PolicyConstraint = 3        // Limits loan or caps attendance
    }

    public enum CalculationMethod
    {
        FixedAmount = 1,            // e.g. EOBI fixed PKR 580
        PercentageOfBasic = 2,      // e.g. HRA 40% of basic
        PercentageOfGross = 3,      // e.g. Advance cap 50% of gross
        TaxSlabSection149 = 4,      // FBR progressive tax brackets
        MultiplierOfHourlyWage = 5, // e.g. 1.5x / 2.0x normal hourly rate
        DayFractionCut = 6          // e.g. 0.5 day wage cut for 3 lates
    }

    [Table("SalaryRules", Schema = "hr")]
    public class SalaryRule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string RuleCode { get; set; } = string.Empty; // e.g. EOBI-STAT, FBR-WHT, ATT-LATE-15, HRA-40

        [Required]
        [MaxLength(120)]
        public string RuleName { get; set; } = string.Empty; // e.g. EOBI Employee Contribution, FBR Sec 149 WHT

        public RuleCategory Category { get; set; }

        public RuleImpactType ImpactType { get; set; }

        public CalculationMethod CalculationMethod { get; set; }

        [Column(TypeName = "decimal(18,4)")]
        public decimal NumericValue { get; set; } // 580.00, 40.00, 1.50, 0.50

        [MaxLength(200)]
        public string? ConditionFormula { get; set; } // e.g. "Gross > 50000", "Lates >= 3", "Site != HQ"

        [MaxLength(300)]
        public string Description { get; set; } = string.Empty;

        public bool IsStatutory { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public DateTime EffectiveDate { get; set; } = DateTime.UtcNow;

        public DateTime? ExpirationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string CreatedBy { get; set; } = "HR_Admin";
    }
}
