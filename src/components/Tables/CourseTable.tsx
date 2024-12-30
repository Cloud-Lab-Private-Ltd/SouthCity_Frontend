"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Pencil, Eye, Printer, Download, Upload } from "lucide-react";
import { CourseAPI } from "@/api/courseAPI";
import { toast } from "sonner";

export interface Course {
  _id: any;
  name: string;
  description: string;
  code: string;
  duration: string;
  degreeType: string;
  Semesters: Semester[];
  admissionFee: string;
}

interface Semester {
  semesterNo: number;
  subjects: string[];
}

export interface EditCourse {
  name: string;
  description: string;
  degreeType: string;
  code: string;
  Level: string;
  category: string;
  duration: string;
  noOfSemesters: number;
  Semesters: Semester[];
  totalFee: number;
  perSemesterFee: number;
  admissionFee: number;
  status: string;
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  Syllabus: File[];
}
interface CourseTableProps {
  onEdit: (course: EditCourse) => void;
  onView: (course: Course) => void;
}

export default function CourseTable({ onEdit, onView }: CourseTableProps) {
  const [data, setData] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [adminPassword, setAdminPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await CourseAPI.Get();
        setData(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    }

    fetchData();
  }, []);

  //Dialog for admin password
  const openDeleteDialog = (id: string) => {
    setCourseToDelete(id);
    setIsDialogOpen(true);
  };

  // Close the dialog
  const closeDeleteDialog = () => {
    setIsDialogOpen(false);
    setAdminPassword("");
    setCourseToDelete(null);
  };

  const confirmDelete = async () => {
    if (!adminPassword) {
      toast.error("Admin password is required", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    if (courseToDelete) {
      try {
        await CourseAPI.Delete(courseToDelete, adminPassword);
        setData(data.filter((d) => d._id !== courseToDelete));
        setSelectedRows((prev) => {
          const next = new Set(prev);
          next.delete(courseToDelete);
          return next;
        });
        toast.success("Course deleted successfully", {
          duration: 3000,
          position: "top-center",
        });
        closeDeleteDialog();
      } catch (error) {
        toast.error("Failed to delete course!", {
          duration: 3000,
          position: "top-center",
        });
        console.error("Error deleting course:", error);
      }
    }
  };

  // Search functionality
  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.code.toLowerCase().includes(searchLower) ||
      item.duration.toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / parseInt(rowsPerPage));
  const startIndex = (currentPage - 1) * parseInt(rowsPerPage);
  const endIndex = startIndex + parseInt(rowsPerPage);
  const currentData = filteredData.slice(startIndex, endIndex);

  // Row selection handlers
  const toggleAllRows = useCallback(() => {
    if (selectedRows.size === currentData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentData.map((row) => row._id)));
    }
  }, [currentData, selectedRows]);

  const toggleRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Print functionality
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // CSV Import functionality
  const importCSV = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split("\n").slice(1); // Skip header row
        const importedData = rows.map((row) => {
          const [id, name, description, code, duration] = row.split(",");
          return { _id: id, name, description, code, duration };
        });
        setData(importedData);
      };
      reader.readAsText(file);
    },
    []
  );

  // CSV Export functionality
  const exportCSV = useCallback(() => {
    const headers = ["ID", "Name", "Description", "Code", "Duration"];
    const csvData = [
      headers.join(","),
      ...filteredData.map((row) =>
        [row._id, row.name, row.description, row.code, row.duration].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "courses.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [filteredData]);

  // Delete functionality
  const handleDelete = async (id: string) => {
    openDeleteDialog(id);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="space-x-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button
            variant="outline"
            className="space-x-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            <span>Import CSV</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv"
            onChange={importCSV}
          />
          <Button variant="outline" className="space-x-2" onClick={exportCSV}>
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-64"
          />
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div>
            <p>Please enter the admin password to delete the course:</p>
            <Input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin Password"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="rounded-md">
        <Table className="[&_tr:hover]:bg-gray-50 [&_td]:border-0 [&_th]:border-0">
          <TableHeader className="border-b">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedRows.size === currentData.length &&
                    currentData.length > 0
                  }
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((course) => (
              <TableRow key={course._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(course._id)}
                    onCheckedChange={() => toggleRow(course._id)}
                  />
                </TableCell>
                <TableCell>{course._id}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.duration}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(course._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-500"
                      onClick={() => onEdit({
                        name: course.name,
                        description: course.description,
                        degreeType: course.degreeType,
                        code: course.code,
                        duration: course.duration,
                        noOfSemesters: course.noOfSemesters,
                        Semesters: course.Semesters.map(sem => ({
                          semesterNo: sem.semesterNo,
                          subjects: sem.subjects
                        })),
                        totalFee: course.totalFee,
                        perSemesterFee: course.perSemesterFee,
                        admissionFee: course.admissionFee,
                        Status: course.Status,
                        Level: course.Level,
                        category: course.category,
                        enrollment_Start_date: course.enrollment_Start_date,
                        enrollment_End_date: course.enrollment_End_date,
                        Syllabus: course.Syllabus,
                        _id: course._id // Important to include for update API
                      })}
                    >

                      <Pencil className="h-4 w-4" />
                    </Button>
                    <button
                      onClick={() => onView(course)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Rows per page</span>
          <Select
            value={rowsPerPage}
            onValueChange={(value) => {
              setRowsPerPage(value);
              setCurrentPage(1); // Reset to first page when changing rows per page
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue>{rowsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </Button>
          <span className="text-sm">
            {currentPage} / {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            {">"}
          </Button>
        </div>
      </div>
    </div >
  );
}
