using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace araby.Migrations
{
    /// <inheritdoc />
    public partial class AddAttendanceUniqueConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add unique index on (SessionId, StudentId, SessionDate)
            // This prevents duplicate attendance records for the same student, session, and date
            migrationBuilder.CreateIndex(
                name: "IX_Attendances_Session_Student_Date",
                table: "Attendances",
                columns: new[] { "SessionId", "StudentId", "SessionDate" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Attendances_Session_Student_Date",
                table: "Attendances");
        }
    }
}
