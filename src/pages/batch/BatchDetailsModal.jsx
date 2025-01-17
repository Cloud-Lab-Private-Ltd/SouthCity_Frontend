import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const BatchDetailsModal = ({ open, handleOpen, batchData }) => {
  if (!batchData) return null;

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="min-w-[80%] max-h-[90vh] overflow-y-auto"
    >
      <DialogHeader className="flex justify-between items-center border-b">
        <Typography variant="h5" className="text-c-grays font-bold">
          Batch Details
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

      <DialogBody divider className="h-[calc(100vh-30vh)] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Typography className="font-bold mb-4 text-lg text-c-grays">
              Basic Information
            </Typography>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Batch Name:</span>{" "}
                {batchData.batchName}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {batchData.status}
              </p>
              <p>
                <span className="font-semibold">Session Type:</span>{" "}
                {batchData.sessionType}
              </p>
              <p>
                <span className="font-semibold">Current Semester:</span>{" "}
                {batchData.currentSemester}
              </p>
            </div>
          </div>

          <div>
            <Typography className="font-bold mb-4 text-lg text-c-grays">
              Course Information
            </Typography>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Course Name:</span>{" "}
                {batchData.course[0]?.name}
              </p>
              <p>
                <span className="font-semibold">Per Semester Fee:</span>{" "}
                {batchData.course[0]?.perSemesterFee}
              </p>
            </div>
          </div>

          <div>
            <Typography className="font-bold mb-4 text-lg text-c-grays">
              Seats Information
            </Typography>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Total Seats:</span>{" "}
                {batchData.totalSeats}
              </p>
              <p>
                <span className="font-semibold">Available Seats:</span>{" "}
                {batchData.availableSeats}
              </p>
              <p>
                <span className="font-semibold">Occupied Seats:</span>{" "}
                {batchData.totalSeats - batchData.availableSeats}
              </p>
            </div>
          </div>

          <div>
            <Typography className="font-bold mb-4 text-lg text-c-grays">
              Duration
            </Typography>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {new Date(batchData.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">End Date:</span>{" "}
                {new Date(batchData.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="col-span-2">
            <Typography className="font-bold mb-4 text-lg text-c-grays">
              Schedule
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batchData.schedule.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <p className="font-semibold text-c-purple">{item.day}</p>
                  <p>{item.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <Typography className="font-bold mb-4 text-lg text-c-grays">
              Additional Information
            </Typography>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(batchData.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold">Last Updated:</span>{" "}
                {new Date(batchData.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default BatchDetailsModal;
