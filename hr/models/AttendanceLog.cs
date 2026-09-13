using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CosmixERP.HR.Models
{
    public enum AttendanceStatus
    {
        Present = 1,
        Late = 2,
        HalfDay = 3,
        Absent = 4,
        ApprovedLeave = 5,
        GazettedHoliday = 6,
        WeeklyOff = 7
    }

    public enum PunchChannel
    {
        BiometricDevice = 1,
        MobileGpsGeofence = 2,
        WebKiosk = 3,
        ManualSupervisorEntry = 4
    }

    [Table("AttendanceLogs", Schema = "hr")]
    public class AttendanceLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public int EmployeeId { get; set; }
        public virtual Employee? Employee { get; set; }

        public int ProjectSiteId { get; set; }
        public virtual ProjectSite? ProjectSite { get; set; }

        public DateOnly AttendanceDate { get; set; }

        public TimeOnly? CheckInTime { get; set; }

        public TimeOnly? CheckOutTime { get; set; }

        public PunchChannel PunchChannel { get; set; } = PunchChannel.BiometricDevice;

        [Column(TypeName = "decimal(9,6)")]
        public decimal? PunchLatitude { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal? PunchLongitude { get; set; }

        public bool IsWithinGeofence { get; set; } = true;

        public double? DistanceFromSiteMeters { get; set; }

        public AttendanceStatus Status { get; set; } = AttendanceStatus.Present;

        public int LateArrivalMinutes { get; set; } = 0;

        public bool IsGracePeriodExceeded { get; set; } = false;

        public bool IsLatePenaltyApplied { get; set; } = false;

        [Column(TypeName = "decimal(5,2)")]
        public decimal RegularHoursWorked { get; set; } = 8.0m;

        [Column(TypeName = "decimal(5,2)")]
        public decimal OvertimeHours { get; set; } = 0.0m;

        [MaxLength(200)]
        public string? Remarks { get; set; }

        public bool IsVerifiedBySiteManager { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
