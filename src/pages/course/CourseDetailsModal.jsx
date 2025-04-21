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
      size="lg"
    >
      <DialogHeader className="flex justify-between items-center border-b">
        <Typography variant="h5" className="text-c-grays font-bold">
          Program Details
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
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <Typography className="text-lg font-bold mb-4 text-c-purple">
              Basic Information
            </Typography>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Program Name</span>
                <span className="font-medium">{courseData.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="font-medium">{courseData.duration}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Number of Semesters</span>
                <span className="font-medium">{courseData.noOfSemesters}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Status</span>
                <span className="font-medium">{courseData.Status}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Degree Type</span>
                <span className="font-medium">{courseData.degreeType?.name || "N/A"}</span>
              </div>
              {courseData.degreeType?.description && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Degree Description</span>
                  <span className="font-medium">{courseData.degreeType.description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fee Structure */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <Typography className="text-lg font-bold mb-4 text-c-purple">
              Fee Structure
            </Typography>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Admission Fee ID</span>
                <span className="font-medium">
                  {courseData.admissionFee}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Per Semester Fee ID</span>
                <span className="font-medium">
                  {courseData.perSemesterFee}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Total Fee</span>
                <span className="font-medium">Rs. {courseData.totalFee}</span>
              </div>
            </div>
          </div>

          {/* Dates Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <Typography className="text-lg font-bold mb-4 text-c-purple">
              Additional Information
            </Typography>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Created At</span>
                <span className="font-medium">
                  {new Date(courseData.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="font-medium">
                  {new Date(courseData.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600">Program ID</span>
                <span className="font-medium">{courseData._id}</span>
              </div>
              {courseData.Syllabus && (
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">Syllabus</span>
                  <span className="font-medium">{courseData.Syllabus}</span>
                </div>
              )}
            </div>
          </div>

          {/* Semester Details */}
          <div className="col-span-2 bg-gray-50 p-6 rounded-lg">
            <Typography className="text-lg font-bold mb-4 text-c-purple">
              Semester Details
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courseData.Semesters && courseData.Semesters.map((semester, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <h4 className="font-semibold text-c-purple mb-2">
                    Semester {semester?.semesterNo}
                  </h4>
                  <div className="space-y-2">
                    {semester?.subjects !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600">Subjects:</p>
                        <p className="font-medium">{semester.subjects || "No subjects specified"}</p>
                      </div>
                    )}
                    {semester?.semesterFees !== undefined && (
                      <div>
                        <p className="text-sm text-gray-600">Semester Fee:</p>
                        <p className="font-medium">Rs. {semester.semesterFees}</p>
                      </div>
                    )}
                    {semester?._id && (
                      <div>
                        <p className="text-sm text-gray-600">Semester ID:</p>
                        <p className="font-medium text-xs">{semester._id}</p>
                      </div>
                    )}
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
