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
      size="lg"
      className="min-w-[90%] max-h-[95vh] overflow-y-auto"
    >
      <DialogHeader className="flex justify-between items-center border-b bg-gray-50 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {studentData.profileImage ? (
            <img
              src={studentData.profileImage}
              alt={studentData.fullName}
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-3xl font-bold border-4 border-white shadow-lg">
              {studentData.fullName?.charAt(0)}
            </div>
          )}
          <div>
            <Typography variant="h4" className="text-c-grays font-bold">
              {studentData.fullName}
            </Typography>
            <Typography className="text-base text-gray-600">
              {studentData.registrationId}
            </Typography>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                studentData.verified
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {studentData.verified ? "Verified" : "Pending Verification"}
            </span>
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

      <DialogBody className="p-6 overflow-y-auto">
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
              <InfoItem label="Nationality" value={studentData.nationality} />
              <InfoItem label="Organization" value={studentData.organization} />
              <InfoItem label="Enrollment Number" value={studentData.enrollementNumber} />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Contact Information
            </Typography>
            <div className="space-y-4">
              <InfoItem label="Phone Number" value={studentData.phoneNumber} />
              <InfoItem label="Mobile Number" value={studentData.mobileNumber} />
              <InfoItem label="Current Address" value={studentData.currentAddress} />
              <InfoItem label="Permanent Address" value={studentData.permanentAddress} />
              <InfoItem label="City" value={studentData.city} />
              <InfoItem label="Province" value={studentData.province} />
              <InfoItem label="Domicile" value={studentData.domicile} />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Guardian Details
            </Typography>
            <div className="space-y-4">
              <InfoItem label="Guardian Name" value={studentData.fatherName} />
              <InfoItem label="Guardian Profession" value={studentData.fatherProfession} />
              <InfoItem label="Guardian Relationship" value={studentData.relationShip} />
              <InfoItem label="Guardian NIC" value={studentData.GuardianNIC} />
              <InfoItem label="Guardian Gender" value={studentData.GuardianGender} />
              <InfoItem label="Guardian Nationality" value={studentData.GuardianNationality} />
              <InfoItem label="Guardian Phone Number" value={studentData.GuardianPhoneNumber} />
              <InfoItem label="Guardian Mobile Number" value={studentData.GuardianMobileNumber} />
              <InfoItem label="Guardian Email" value={studentData.GuardianEmail} />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Guardian Address Information
            </Typography>
            <div className="space-y-4">
              <InfoItem label="Guardian Current Address" value={studentData.GuardianCurrentAddress} />
              <InfoItem label="Guardian Permanent Address" value={studentData.GuardianPermenantAddress} />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Academic Status
            </Typography>
            <div className="space-y-4">
              <InfoItem label="Academic Status" value={studentData.academicStatus} />
              <InfoItem label="Batch Name" value={studentData.batchName} />
              <InfoItem label="Highest Qualification" value={studentData.higestQualification} />
              <InfoItem 
                label="Status" 
                value={
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    studentData.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {studentData.status}
                  </span>
                } 
              />
            </div>
          </Card>

          {studentData.academicQualifications?.length > 0 && (
            <Card className="p-6 shadow-sm col-span-2">
              <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
                Academic Qualifications
              </Typography>
              <div className="grid gap-4">
                {studentData.academicQualifications.map((qual, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <InfoItem label="Institution" value={qual.institutionName} />
                      <InfoItem label="Level of Study" value={qual.levelOfStudy} />
                      <InfoItem label="Subjects" value={qual.subjects} />
                      <InfoItem label="Marks/Grade" value={qual.marksGrade} />
                      <InfoItem label="Years" value={qual.years} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {studentData.course?.length > 0 && (
            <Card className="p-6 shadow-sm col-span-2">
              <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
                Enrolled Programs
              </Typography>
              <div className="grid gap-4">
                {studentData.course.map((course, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <InfoItem label="Programs Name" value={course.name} />
                      <InfoItem label="Status" value={course.Status} />
                      <InfoItem label="Duration" value={course.duration} />
                      <InfoItem label="Total Fee" value={course.totalFee} />
                      {course.Semesters && (
                        <InfoItem label="Number of Semesters" value={course.Semesters.length} />
                      )}
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

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-medium">{value || "Not Provided"}</span>
  </div>
);

export default StudentDetailsModal;
