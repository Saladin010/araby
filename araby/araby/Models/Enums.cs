namespace araby.Models
{
    public enum UserRole
    {
        Teacher = 1,
        Assistant = 2,
        Student = 3
    }

    public enum SessionType
    {
        Individual = 1,
        Group = 2
    }

    public enum PaymentFrequency
    {
        Monthly = 1,
        Weekly = 2,
        Annual = 3,
        OneTime = 4
    }

    public enum AttendanceStatus
    {
        Present = 1,
        Absent = 2,
        Late = 3,
        Excused = 4
    }

    public enum PaymentStatus
    {
        Paid = 1,
        Pending = 2,
        Overdue = 3
    }
}
