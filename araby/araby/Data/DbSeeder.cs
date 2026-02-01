using araby.Models;
using Microsoft.AspNetCore.Identity;

namespace araby.Data
{
    public static class DbSeeder
    {
        public static async Task SeedDataAsync(
            ApplicationDbContext context, 
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            // Seed Roles first
            await SeedRolesAsync(roleManager);

            // Check if data already exists (check for our specific teacher user)
            var existingTeacher = await userManager.FindByNameAsync("teacher");
            if (existingTeacher != null)
            {
                Console.WriteLine("⚠️ Database already seeded. Skipping...");
                return; // Database has been seeded
            }

            Console.WriteLine("🌱 Starting database seeding...");

            // Create Teacher (Role = Teacher)
            var teacher = new ApplicationUser
            {
                UserName = "teacher",
                Email = "teacher@gmail.com",
                FullName = "Mr. Ahmed Amr",
                Role = UserRole.Teacher,
                IsActive = true,
                EmailConfirmed = true
            };
            await userManager.CreateAsync(teacher, "Teacher@123");
            await userManager.AddToRoleAsync(teacher, "Teacher");

            // Create Assistant (Role = Assistant)
            var assistant = new ApplicationUser
            {
                UserName = "assistant",
                Email = "assistant@gmail.com",
                FullName = "المساعد 1",
                Role = UserRole.Assistant,
                IsActive = true,
                EmailConfirmed = true
            };
            await userManager.CreateAsync(assistant, "Assistant@123");
            await userManager.AddToRoleAsync(assistant, "Assistant");

            // Create Students (Role = Student)
            var student1 = new ApplicationUser
            {
                UserName = "student1",
                Email = "student1@gmail.com",
                FullName = "الطالب خالد محمود",
                Role = UserRole.Student,
                AcademicLevel = "الصف الثالث الثانوي",
                IsActive = true,
                EmailConfirmed = true
            };
            await userManager.CreateAsync(student1, "Student@123");
            await userManager.AddToRoleAsync(student1, "Student");

          

            await context.SaveChangesAsync();

            // Seed Fee Types (after users are created)
            var feeTypes = new List<FeeType>
            {
                new FeeType
                {
                    Name = "رسوم شهرية",
                    Amount = 500,
                    IsActive = true,
                    CreatedBy = teacher.Id
                },
                new FeeType
                {
                    Name = "رسوم الكتب",
                    Amount = 150,
                    IsActive = true,
                    CreatedBy = teacher.Id
                },
                new FeeType
                {
                    Name = "رسوم الامتحانات",
                    Amount = 100,
                    IsActive = true,
                    CreatedBy = teacher.Id
                }
            };
            context.FeeTypes.AddRange(feeTypes);
            await context.SaveChangesAsync();

            // Seed Student Groups
            var groups = new List<StudentGroup>
            {
                new StudentGroup
                {
                    GroupName = "المجموعة الأولى - الصف الثالث الثانوي",
                    Description = "مجموعة طلاب الثانوية العامة"
                },
                new StudentGroup
                {
                    GroupName = "المجموعة الثانية - الصف الأول الثانوي",
                    Description = "مجموعة طلاب الصف الأول الثانوي"
                }
            };
            context.StudentGroups.AddRange(groups);
            await context.SaveChangesAsync();

            // Seed Sessions
            var startTime1 = DateTime.Now.AddDays(1).Date.AddHours(16); // Tomorrow at 4:00 PM
            var endTime1 = startTime1.AddHours(2); // 6:00 PM
            
            var startTime2 = DateTime.Now.AddDays(2).Date.AddHours(16); // Day after tomorrow at 4:00 PM
            var endTime2 = startTime2.AddHours(2); // 6:00 PM

           
            await context.SaveChangesAsync();

            Console.WriteLine("✅ Database seeded successfully!");
            Console.WriteLine("\n📝 Test Accounts:");
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            Console.WriteLine("👨‍🏫 Teacher:");
            Console.WriteLine("   Username: teacher");
            Console.WriteLine("   Password: Teacher@123");
            Console.WriteLine("\n👤 Assistant:");
            Console.WriteLine("   Username: assistant");
            Console.WriteLine("   Password: Assistant@123");
            Console.WriteLine("\n👨‍🎓 Students:");
            Console.WriteLine("   Username: student1, student2, student3");
            Console.WriteLine("   Password: Student@123");
            Console.WriteLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Teacher", "Assistant", "Student" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
