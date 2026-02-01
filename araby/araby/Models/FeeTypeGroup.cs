namespace araby.Models
{
   
    public class FeeTypeGroup
    {
        public int FeeTypeId { get; set; }
        public FeeType FeeType { get; set; }

        public int StudentGroupId { get; set; }
        public StudentGroup StudentGroup { get; set; }
    }

}
