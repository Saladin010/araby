using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace araby.Migrations
{
    /// <inheritdoc />
    public partial class AddSessionDateToAttendance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Attendances_SessionId",
                table: "Attendances");

            // Step 1: Add SessionDate as nullable temporarily
            migrationBuilder.AddColumn<DateTime>(
                name: "SessionDate",
                table: "Attendances",
                type: "date",
                nullable: true);

            // Step 2: Populate SessionDate from Session.StartTime for existing records
            migrationBuilder.Sql(@"
                UPDATE Attendances
                SET SessionDate = CAST(s.StartTime AS DATE)
                FROM Attendances a
                INNER JOIN Sessions s ON a.SessionId = s.Id
                WHERE a.SessionDate IS NULL
            ");

            // Step 3: Make SessionDate NOT NULL
            migrationBuilder.AlterColumn<DateTime>(
                name: "SessionDate",
                table: "Attendances",
                type: "date",
                nullable: false);

            // Step 4: Create unique index
            migrationBuilder.CreateIndex(
                name: "IX_Attendance_SessionStudent_Date",
                table: "Attendances",
                columns: new[] { "SessionId", "StudentId", "SessionDate" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Attendance_SessionStudent_Date",
                table: "Attendances");

            migrationBuilder.DropColumn(
                name: "SessionDate",
                table: "Attendances");

            migrationBuilder.CreateIndex(
                name: "IX_Attendances_SessionId",
                table: "Attendances",
                column: "SessionId");
        }
    }
}
