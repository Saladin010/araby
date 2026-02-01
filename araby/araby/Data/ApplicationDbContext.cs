using araby.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace araby.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Session> Sessions { get; set; }
        public DbSet<SessionStudent> SessionStudents { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<FeeType> FeeTypes { get; set; }
        public DbSet<StudentGroup> StudentGroups { get; set; }
        public DbSet<StudentGroupMember> StudentGroupMembers { get; set; }
        public DbSet<FeeTypeGroup> FeeTypeGroups { get; set; }
        public DbSet<StudentPayment> StudentPayments { get; set; }
        public DbSet<Grade> Grades { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ApplicationUser Configurations
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Role).IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // Session Configurations
            builder.Entity<Session>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Location).IsRequired().HasMaxLength(300);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // SessionStudent (Many-to-Many)
            builder.Entity<SessionStudent>(entity =>
            {
                entity.HasKey(e => new { e.SessionId, e.StudentId });

                entity.HasOne(e => e.Session)
                    .WithMany(s => s.SessionStudents)
                    .HasForeignKey(e => e.SessionId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Student)
                    .WithMany()
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.EnrolledAt).HasDefaultValueSql("GETDATE()");
            });

            // Attendance Configurations
            builder.Entity<Attendance>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Session)
                    .WithMany(s => s.Attendances)
                    .HasForeignKey(e => e.SessionId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Student)
                    .WithMany(u => u.Attendances)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.RecordedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.RecordedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.RecordedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Notes).HasMaxLength(500);
            });

            // FeeType Configurations
            builder.Entity<FeeType>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Amount).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // StudentGroup Configurations
            builder.Entity<StudentGroup>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.GroupName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
            });

            // StudentGroupMember (Many-to-Many)
            builder.Entity<StudentGroupMember>(entity =>
            {
                entity.HasKey(e => new { e.StudentGroupId, e.StudentId });

                entity.HasOne(e => e.StudentGroup)
                    .WithMany(g => g.Members)
                    .HasForeignKey(e => e.StudentGroupId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Student)
                    .WithMany()
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.AddedAt).HasDefaultValueSql("GETDATE()");
            });

            // FeeTypeGroup (Many-to-Many)
            builder.Entity<FeeTypeGroup>(entity =>
            {
                entity.HasKey(e => new { e.FeeTypeId, e.StudentGroupId });

                entity.HasOne(e => e.FeeType)
                    .WithMany(f => f.ApplicableGroups)
                    .HasForeignKey(e => e.FeeTypeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.StudentGroup)
                    .WithMany(g => g.ApplicableFees)
                    .HasForeignKey(e => e.StudentGroupId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // StudentPayment Configurations
            builder.Entity<StudentPayment>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Student)
                    .WithMany(u => u.Payments)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.FeeType)
                    .WithMany(f => f.Payments)
                    .HasForeignKey(e => e.FeeTypeId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.RecordedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.RecordedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.AmountPaid).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.RecordedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Notes).HasMaxLength(500);
            });

            // Grade Configurations
            builder.Entity<Grade>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Student)
                    .WithMany(u => u.Grades)
                    .HasForeignKey(e => e.StudentId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.RecordedByUser)
                    .WithMany()
                    .HasForeignKey(e => e.RecordedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.ExamName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Score).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.MaxScore).HasColumnType("decimal(18,2)").IsRequired();
                entity.Property(e => e.RecordedAt).HasDefaultValueSql("GETDATE()");
                entity.Property(e => e.Notes).HasMaxLength(500);
            });
        }
    }
}
