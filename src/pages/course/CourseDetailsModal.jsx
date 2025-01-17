import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CourseDetailsModal = ({ open, handleOpen, courseData }) => {
  if (!courseData) return null;

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="min-w-[80%] max-h-[90vh] overflow-y-auto"
    >
      <DialogHeader className="flex justify-between items-center border-b">
        <Typography variant="h5" className="text-c-grays font-bold">
          Course Details
        </Typography>
        <IconButton
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="text-c-grays hover:bg-gray-100"
        >
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>
      
      <DialogBody divider className="h-[calc(100vh-30vh)] overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <Typography className="text-lg font-bold mb-4 text-c-purple">
              Basic Information
            </Typography>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Course Name</span>
                <span className="font-medium">{courseData.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Course Code</span>
                <span className="font-medium">{courseData.code}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Description</span>
                <span className="font-medium">{courseData.description}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Level</span>
                <span className="font-medium">{courseData.Level}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Category</span>
                <span className="font-medium">{courseData.category}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="font-medium">{courseData.duration}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <Typography className="text-lg font-bold mb-4 text-c-purple">
              Fee Structure
            </Typography>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Admission Fee</span>
                <span className="font-medium">Rs. {courseData.admissionFee}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Per Semester Fee</span>
                <span className="font-medium">Rs. {courseData.perSemesterFee}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Total Fee</span>
                <span className="font-medium">Rs. {courseData.totalFee}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <Typography className="text-lg font-bold mb-4 text-c-purple">
              Enrollment Details
            </Typography>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Start Date</span>
                <span className="font-medium">
                  {new Date(courseData.enrollment_Start_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">End Date</span>
                <span className="font-medium">
                  {new Date(courseData.enrollment_End_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Status</span>
                <span className="font-medium">{courseData.Status}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <Typography className="text-lg font-bold mb-4 text-c-purple">
              Course Material
            </Typography>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Syllabus</span>
                <a 
                  href={courseData.Syllabus} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 font-medium flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  View Syllabus
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-gray-50 p-6 rounded-lg">
            <Typography className="text-lg font-bold mb-4 text-c-purple">
              Semester Details
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseData.Semesters.map((semester, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-c-purple mb-2">
                    Semester {semester.semesterNo}
                  </h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Subjects:</p>
                    <p className="font-medium">{semester.subjects}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default CourseDetailsModal;
