using Microsoft.EntityFrameworkCore;

namespace CosmixERP.HR.Models
{
    public class HRDbContext : DbContext
    {
        public HRDbContext(DbContextOptions<HRDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees => Set<Employee>();
        public DbSet<ProjectSite> ProjectSites => Set<ProjectSite>();
        public DbSet<SalaryRule> SalaryRules => Set<SalaryRule>();
        public DbSet<AttendanceLog> AttendanceLogs => Set<AttendanceLog>();
        public DbSet<AdvanceLoan> AdvanceLoans => Set<AdvanceLoan>();
        public DbSet<Payslip> Payslips => Set<Payslip>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Default Schema
            modelBuilder.HasDefaultSchema("hr");

            // Employee Configurations
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasIndex(e => e.EmployeeCode).IsUnique();
                entity.HasIndex(e => e.CNIC).IsUnique();
                entity.HasIndex(e => e.MobilePhone);

                // Relationship: Employee belongs to a ProjectSite
                entity.HasOne(e => e.ProjectSite)
                      .WithMany(s => s.DeployedEmployees)
                      .HasForeignKey(e => e.ProjectSiteId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Query filter for soft-delete
                entity.HasQueryFilter(e => !e.IsDeleted);
            });

            // ProjectSite Configurations
            modelBuilder.Entity<ProjectSite>(entity =>
            {
                entity.HasIndex(s => s.SiteCode).IsUnique();

                // Relationship: ProjectSite has an Incharge Manager
                entity.HasOne(s => s.InchargeManager)
                      .WithMany()
                      .HasForeignKey(s => s.InchargeManagerId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            // SalaryRule Configurations
            modelBuilder.Entity<SalaryRule>(entity =>
            {
                entity.HasIndex(r => r.RuleCode).IsUnique();
            });

            // AttendanceLog Configurations
            modelBuilder.Entity<AttendanceLog>(entity =>
            {
                entity.HasIndex(a => new { a.EmployeeId, a.AttendanceDate }).IsUnique();
                entity.HasIndex(a => a.ProjectSiteId);
                entity.HasIndex(a => a.AttendanceDate);

                entity.HasOne(a => a.Employee)
                      .WithMany(e => e.AttendanceLogs)
                      .HasForeignKey(a => a.EmployeeId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(a => a.ProjectSite)
                      .WithMany(s => s.AttendanceLogs)
                      .HasForeignKey(a => a.ProjectSiteId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // AdvanceLoan Configurations
            modelBuilder.Entity<AdvanceLoan>(entity =>
            {
                entity.HasIndex(l => l.LoanApplicationNumber).IsUnique();
                entity.HasIndex(l => l.EmployeeId);

                entity.HasOne(l => l.Employee)
                      .WithMany(e => e.AdvanceLoans)
                      .HasForeignKey(l => l.EmployeeId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Payslip Configurations
            modelBuilder.Entity<Payslip>(entity =>
            {
                entity.HasIndex(p => p.PayslipNumber).IsUnique();
                entity.HasIndex(p => new { p.EmployeeId, p.Month, p.Year }).IsUnique();
                entity.HasIndex(p => p.CostCenterSiteId);

                entity.HasOne(p => p.Employee)
                      .WithMany(e => e.Payslips)
                      .HasForeignKey(p => p.EmployeeId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.CostCenterSite)
                      .WithMany()
                      .HasForeignKey(p => p.CostCenterSiteId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
