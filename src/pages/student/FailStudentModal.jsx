import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../config/apiconfig";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const FailStudentModal = ({ open, handleOpen, studentData, onSuccess }) => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMoveForm, setShowMoveForm] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);

  const { batches } = useSelector((state) => state.groupdata);

  const batchOptions = batches?.batches?.map((batch) => ({
    value: batch._id,
    label: batch.batchName,
  }));

  const handleFreezeStudent = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/student/FreezeStudent`,
        {
          studentId: studentData._id,
          failedBatchId: studentData?.batch?._id,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data) {
        handleOpen();
        onSuccess && onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to freeze student");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToBatch = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/student/moveToNextBatch`,
        {
          studentId: studentData._id,
          failedBatchId: studentData?.batch?._id,
          newBatchId: selectedBatch.value,
          reason: reason,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data) {
        handleOpen();
        setShowMoveForm(false);
        setReason("");
        setSelectedBatch(null);
        onSuccess && onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to move student");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} size="sm">
      <DialogHeader className="flex justify-between items-center border-b">
        <Typography variant="h5" className="text-c-grays font-bold">
          Student Status Update
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

      <DialogBody className="py-6">
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {showMoveForm ? (
            <div className="space-y-4">
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Select New Batch *
                </label>
                <Select
                  options={batchOptions}
                  value={selectedBatch}
                  onChange={setSelectedBatch}
                  className="text-c-grays"
                  placeholder="Select Batch"
                  isSearchable
                  styles={{
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Reason for Moving *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  rows={3}
                  placeholder="Enter reason for moving student"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowMoveForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMoveToBatch}
                  disabled={isLoading || !selectedBatch || !reason}
                  className="px-4 py-2 bg-c-purple text-white rounded-lg hover:bg-c-purple disabled:bg-gray-200 disabled:text-gray-600"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Move Student"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleFreezeStudent}
                disabled={isLoading || studentData?.status === "freezed"}
                className={`p-6 border-2 rounded-xl transition-all group relative ${
                  studentData?.status === "freezed"
                    ? "border-gray-100 bg-gray-50 cursor-not-allowed"
                    : "border-orange-100 bg-orange-50 hover:bg-orange-100"
                }`}
              >
                <div className="flex flex-col items-center">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-8 h-8 mb-2 group-hover:scale-110 transition-transform ${
                          studentData?.status === "freezed"
                            ? "text-gray-400"
                            : "text-orange-500"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z"
                        />
                      </svg>
                      <h3
                        className={`text-lg font-semibold mb-1 ${
                          studentData?.status === "freezed"
                            ? "text-gray-400"
                            : "text-orange-600"
                        }`}
                      >
                        {studentData?.status === "freezed"
                          ? "Already Freezed"
                          : "Freeze Student"}
                      </h3>
                      <p
                        className={`text-sm text-center ${
                          studentData?.status === "freezed"
                            ? "text-gray-400"
                            : "text-orange-600/70"
                        }`}
                      >
                        {studentData?.status === "freezed"
                          ? "This student is currently freezed"
                          : "Temporarily freeze student's academic progress"}
                      </p>
                    </>
                  )}
                </div>
              </button>

              {studentData?.status !== "freezed" && (
                <button
                  onClick={() => setShowMoveForm(true)}
                  className="p-6 border-2 border-blue-100 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all group"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                      />
                    </svg>
                    <h3 className="text-lg font-semibold text-blue-600 mb-1">
                      Move to Next Batch
                    </h3>
                    <p className="text-sm text-blue-600/70 text-center">
                      Transfer student to another batch
                    </p>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default FailStudentModal;
