using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmixERP.HR.Models
{
    public enum SiteStatus
    {
        Planning = 1,
        Active = 2,
        OnHold = 3,
        Completed = 4,
        HandedOver = 5
    }

    [Table("ProjectSites", Schema = "hr")]
    public class ProjectSite
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string SiteCode { get; set; } = string.Empty; // e.g. CMX-SITE-101

        [Required]
        [MaxLength(150)]
        public string SiteName { get; set; } = string.Empty; // e.g. Karachi High-Rise Tower

        [Required]
        [MaxLength(150)]
        public string ClientName { get; set; } = string.Empty; // e.g. Bahria Town / Emaar

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = "Commercial High-Rise"; // Commercial, Govt, Industrial, Residential

        [Required]
        [MaxLength(50)]
        public string City { get; set; } = "Karachi";

        [Required]
        [MaxLength(300)]
        public string CompleteAddress { get; set; } = string.Empty;

        // --- GPS Geolocation & Perimeter ---
        [Column(TypeName = "decimal(9,6)")]
        public decimal Latitude { get; set; } // e.g. 24.860700

        [Column(TypeName = "decimal(9,6)")]
        public decimal Longitude { get; set; } // e.g. 67.001100

        public double GeofenceRadiusMeters { get; set; } = 80.0; // Allowed check-in radius

        // --- Site Leadership ---
        public int? InchargeManagerId { get; set; }
        public virtual Employee? InchargeManager { get; set; }

        [MaxLength(100)]
        public string InchargeContactPhone { get; set; } = string.Empty;

        // --- Biometric Hardware Integration ---
        [MaxLength(50)]
        public string? BiometricDeviceId { get; set; } // e.g. ZKTeco-MB20-KHI01

        [MaxLength(50)]
        public string? BiometricIpAddress { get; set; } // e.g. 192.168.10.45

        public int BiometricPort { get; set; } = 4370;

        public bool IsBiometricOnline { get; set; } = true;

        public DateTime? LastBiometricSync { get; set; }

        // --- Timeline & Financials ---
        public DateTime StartDate { get; set; } = DateTime.UtcNow;

        public DateTime? ExpectedCompletionDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal ContractValuePKR { get; set; }

        public SiteStatus Status { get; set; } = SiteStatus.Active;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public virtual ICollection<Employee> DeployedEmployees { get; set; } = new List<Employee>();
        public virtual ICollection<AttendanceLog> AttendanceLogs { get; set; } = new List<AttendanceLog>();
    }
}
