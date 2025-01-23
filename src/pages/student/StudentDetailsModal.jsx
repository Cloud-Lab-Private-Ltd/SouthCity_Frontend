import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
  Card,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const StudentDetailsModal = ({ open, handleOpen, studentData }) => {
  if (!studentData) return null;

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="min-w-[80%] max-h-[90vh] overflow-y-auto"
    >
      <DialogHeader className="flex justify-between items-center border-b bg-gray-50">
        <div className="flex items-center gap-4">
          {studentData.profileImage ? (
            <img
              src={studentData.profileImage}
              alt={studentData.fullName}
              className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-2xl font-bold border-4 border-white shadow-lg">
              {studentData.fullName.charAt(0)}
            </div>
          )}
          <div>
            <Typography variant="h5" className="text-c-grays font-bold">
              {studentData.fullName}
            </Typography>
            <Typography className="text-sm text-gray-600">
              {studentData.registrationId}
            </Typography>
          </div>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Basic Information
            </Typography>
            <div className="space-y-4">
              <InfoItem label="Full Name" value={studentData.fullName} />
              <InfoItem label="Email" value={studentData.email} />
              <InfoItem label="NIC" value={studentData.nic} />
              <InfoItem label="Gender" value={studentData.gender} />
              <InfoItem label="Date of Birth" value={studentData.dob} />
              <InfoItem
                label="Verification Status"
                value={
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      studentData.verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {studentData.verified ? "Verified" : "Pending"}
                  </span>
                }
              />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Contact Information
            </Typography>
            <div className="space-y-4">
              <InfoItem label="Phone Number" value={studentData.phoneNumber} />
              <InfoItem label="Address" value={studentData.address} />
              <InfoItem label="City" value={studentData.city} />
              <InfoItem label="Country" value={studentData.country} />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Parent Information
            </Typography>
            <div className="space-y-4">
              <InfoItem label="Father's Name" value={studentData.fatherName} />
              <InfoItem
                label="Father's Phone"
                value={studentData.fatherPhone_number}
              />
              <InfoItem
                label="Father's Occupation"
                value={studentData.fatherOccupation}
              />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Academic Information
            </Typography>
            <div className="space-y-4">
              <InfoItem
                label="Batch"
                value={studentData.batchName || "Not Assigned"}
              />
              <InfoItem
                label="Current Semester"
                value={studentData.currentSemester || "Not Started"}
              />
            </div>
          </Card>

          {studentData.course && studentData.course.length > 0 && (
            <Card className="p-6 shadow-sm col-span-2">
              <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
                Enrolled Courses
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentData.course.map((course, index) => (
                  <div
                    key={index}
                    className="p-4 bg-purple-50 rounded-lg border border-purple-100 hover:shadow-md transition-all"
                  >
                    <p className="font-semibold text-purple-700">
                      {course.name}
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>Level: {course.Level}</p>
                      <p>Status: {course.Status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
};

// Helper component for consistent info display
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default StudentDetailsModal;
