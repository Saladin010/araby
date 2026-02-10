using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace araby.Migrations
{
    /// <inheritdoc />
    public partial class AssignExistingStudentNumbers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Assign StudentNumber to existing students who don't have one
            migrationBuilder.Sql(@"
                DECLARE @NextNumber INT = 1;
                DECLARE @CurrentId NVARCHAR(450);

                -- Get the max existing StudentNumber to start from there
                SELECT @NextNumber = ISNULL(MAX(StudentNumber), 0) + 1
                FROM AspNetUsers
                WHERE StudentNumber IS NOT NULL;

                -- Cursor to go through all students without StudentNumber
                DECLARE StudentCursor CURSOR FOR
                SELECT Id
                FROM AspNetUsers
                WHERE Role = 1 AND StudentNumber IS NULL
                ORDER BY CreatedAt;

                OPEN StudentCursor;
                FETCH NEXT FROM StudentCursor INTO @CurrentId;

                WHILE @@FETCH_STATUS = 0
                BEGIN
                    UPDATE AspNetUsers
                    SET StudentNumber = @NextNumber
                    WHERE Id = @CurrentId;
                    
                    SET @NextNumber = @NextNumber + 1;
                    
                    FETCH NEXT FROM StudentCursor INTO @CurrentId;
                END;

                CLOSE StudentCursor;
                DEALLOCATE StudentCursor;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
