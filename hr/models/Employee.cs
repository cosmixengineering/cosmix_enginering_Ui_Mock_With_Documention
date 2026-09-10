using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmixERP.HR.Models
{
    public enum EmploymentStatus
    {
        Draft = 1,
        PendingCEOApproval = 2,
        Active = 3,
        Probation = 4,
        Suspended = 5,
        Resigned = 6,
        Terminated = 7
    }

    public enum EmploymentType
    {
        Permanent = 1,
        Contractual = 2,
        DailyWage = 3,
        ThirdPartyOutsourced = 4
    }

    [Table("Employees", Schema = "hr")]
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string EmployeeCode { get; set; } = string.Empty; // e.g. CMX-0101

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string FatherOrHusbandName { get; set; } = string.Empty;

        [Required]
        [MaxLength(15)]
        [RegularExpression(@"^[0-9]{5}-[0-9]{7}-[0-9]{1}$", ErrorMessage = "Valid CNIC format is 00000-0000000-0")]
        public string CNIC { get; set; } = string.Empty;

        [MaxLength(10)]
        public string Gender { get; set; } = "Male";

        public DateTime DateOfBirth { get; set; }

        [MaxLength(20)]
        public string MaritalStatus { get; set; } = "Single";

        // --- Photo & Residential Address ---
        [MaxLength(500)]
        public string? PhotoUrl { get; set; } // Uploaded image path or cloud storage URI

        [Required]
        [MaxLength(300)]
        public string ResidentialAddress { get; set; } = string.Empty; // Complete Home / Permanent Address

        [Required]
        [MaxLength(20)]
        public string MobilePhone { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? PersonalEmail { get; set; }

        [MaxLength(100)]
        public string? OfficialEmail { get; set; }

        // --- Emergency Contact Information ---
        [Required]
        [MaxLength(100)]
        public string EmergencyContactName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string EmergencyContactRelation { get; set; } = string.Empty; // Brother, Father, Spouse, Friend, etc.

        [Required]
        [MaxLength(20)]
        public string EmergencyContactPhone { get; set; } = string.Empty;

        // --- Previous Employment Details ---
        [MaxLength(150)]
        public string? PreviousEmployerName { get; set; } // e.g. Descon Engineering

        [Column(TypeName = "decimal(18,2)")]
        public decimal? LastDrawnSalary { get; set; } // Last Salary in PKR

        [MaxLength(300)]
        public string? ReasonForLeavingPreviousJob { get; set; }

        // --- Job Designation & Site Allocation ---
        [Required]
        [MaxLength(100)]
        public string Designation { get; set; } = string.Empty; // HVAC Engineer, AC Technician, etc.

        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = "MEP Projects";

        public EmploymentType EmploymentType { get; set; } = EmploymentType.Permanent;

        public EmploymentStatus Status { get; set; } = EmploymentStatus.Draft;

        // Assigned Working Project Site (Foreign Key)
        public int ProjectSiteId { get; set; }
        public virtual ProjectSite? ProjectSite { get; set; }

        public DateTime DateOfJoining { get; set; } = DateTime.UtcNow;
        public int ProbationPeriodMonths { get; set; } = 3;

        // --- Salary & Financials ---
        [Column(TypeName = "decimal(18,2)")]
        public decimal GrossSalary { get; set; } // Monthly Package in PKR

        [MaxLength(50)]
        public string PaymentMode { get; set; } = "Bank Transfer"; // Bank Transfer, Cash, Cheque

        [MaxLength(100)]
        public string? BankName { get; set; } // e.g. Meezan Bank, HBL

        [MaxLength(30)]
        public string? BankAccountNumber { get; set; }

        [MaxLength(30)]
        public string? BankIBAN { get; set; }

        // --- Mobile App / Geofencing Credentials ---
        [MaxLength(50)]
        public string? MobileAppUsername { get; set; }

        [MaxLength(255)]
        public string? PasswordHash { get; set; }

        public bool IsMobileGpsPunchEnabled { get; set; } = true;

        // --- Audit Logs & Soft Delete ---
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string CreatedBy { get; set; } = "HR_Admin";
        public DateTime? ApprovedAt { get; set; }
        public string? ApprovedBy { get; set; } // CEO Approval
        public bool IsDeleted { get; set; } = false;

        // Navigation Collections
        public virtual ICollection<AttendanceLog> AttendanceLogs { get; set; } = new List<AttendanceLog>();
        public virtual ICollection<AdvanceLoan> AdvanceLoans { get; set; } = new List<AdvanceLoan>();
        public virtual ICollection<Payslip> Payslips { get; set; } = new List<Payslip>();
    }
}
