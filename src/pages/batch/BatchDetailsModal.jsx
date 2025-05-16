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

const BatchDetailsModal = ({ open, handleOpen, batchData }) => {
  if (!batchData) return null;
  console.log("data before shoing in the view is ", batchData?.course);

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="min-w-[90%] max-h-[95vh] overflow-y-auto"
      size="lg"
    >
      <DialogHeader className="flex justify-between items-center border-b bg-gray-50 sticky top-0 z-10">
        <div>
          <Typography variant="h4" className="text-c-grays font-bold">
            {batchData.batchName}
          </Typography>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              batchData.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {batchData.status}
          </span>
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
              <InfoItem label="Batch Name" value={batchData.batchName} />
              <InfoItem label="Session Type" value={batchData.sessionType} />
              <InfoItem
                label="Number of Students"
                value={batchData.numberOfStudents}
              />
              <InfoItem
                label="Status"
                value={
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      batchData.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {batchData.status}
                  </span>
                }
              />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Duration Information
            </Typography>
            <div className="space-y-4">
              <InfoItem
                label="Start Date"
                value={new Date(batchData.startDate).toLocaleDateString()}
              />
              <InfoItem
                label="End Date"
                value={new Date(batchData.endDate).toLocaleDateString()}
              />
              <InfoItem
                label="Created At"
                value={new Date(batchData.createdAt).toLocaleString()}
              />
              <InfoItem
                label="Last Updated"
                value={new Date(batchData.updatedAt).toLocaleString()}
              />
            </div>
          </Card>

          <Card className="p-6 shadow-sm col-span-2">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Programs Information
            </Typography>
            {batchData?.course?.map((course, index) => (
              <div key={index} className="p-4 bg-purple-50 rounded-lg mb-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <InfoItem label="Programs Name" value={course?.name} />
                  <InfoItem label="Level" value={course?.Level} />
                  <InfoItem label="Category" value={course?.category} />
                  <InfoItem label="Duration" value={course?.duration} />
                  <InfoItem
                    label="Total Fee"
                    value={`Rs. ${course?.totalFee}`}
                  />
                  <InfoItem
                    label="No. of Semesters"
                    value={course?.noOfSemesters}
                  />
                  <InfoItem
                    label="Admission Fee"
                    value={`Rs. ${course?.admissionFee?.amount}`}
                  />
                  <InfoItem
                    label="Per Semester Fee"
                    value={`Rs. ${course?.perSemesterFee?.amount}`}
                  />
                  <InfoItem
                    label="Status"
                    value={
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          course.Status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {course?.Status}
                      </span>
                    }
                  />
                </div>
              </div>
            ))}
          </Card>
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

export default BatchDetailsModal;
