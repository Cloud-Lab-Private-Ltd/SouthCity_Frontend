export interface CourseModel {
  id: string;
  name: string;
  description: string;
  degreeType: string;
  code: string;
  duration: string;
  noOfSemesters: number;
  Semesters: Semester[];
  totalFee: string;
  perSemesterFee: string;
  admissionFee: string;
  Syllabus: File[];
  Status: string;
  Level: string;
  category: string;
  enrollment_Start_date: string; // ISO date string
  enrollment_End_date: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface Semester {
  semesterNo: string;
  subjects: string;
}