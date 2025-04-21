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
      // Only allow freezing a student (not unfreezing)
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
      setError(
        error.response?.data?.message || "Failed to update student status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassOutStudent = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/student/moveToNextBatch`,
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
      setError(error.response?.data?.message || "Failed to pass out student");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if student is already in year back status
  const isYearBack = studentData?.academicStatus === "Year back";
  // Check if student is already passed out
  const isPassedOut = studentData?.academicStatus === "Pass out";

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

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleFreezeStudent}
              disabled={isLoading || isYearBack}
              className={`p-6 border-2 rounded-xl transition-all group relative ${
                isYearBack
                  ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
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
                        isYearBack ? "text-gray-400" : "text-orange-500"
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
                        isYearBack ? "text-gray-500" : "text-orange-600"
                      }`}
                    >
                      Year Back Student
                    </h3>
                    <p
                      className={`text-sm text-center ${
                        isYearBack ? "text-gray-400" : "text-orange-600/70"
                      }`}
                    >
                      {isYearBack
                        ? "Student is already in Year Back status"
                        : "Temporarily pause student's academic progress"}
                    </p>
                  </>
                )}
              </div>
            </button>

            <button
              onClick={handlePassOutStudent}
              disabled={isLoading || isPassedOut}
              className={`p-6 border-2 rounded-xl transition-all group relative ${
                isPassedOut
                  ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                  : "border-green-100 bg-green-50 hover:bg-green-100"
              }`}
            >
              <div className="flex flex-col items-center">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-8 h-8 mb-2 group-hover:scale-110 transition-transform ${
                        isPassedOut ? "text-gray-400" : "text-green-500"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                      />
                    </svg>
                    <h3
                      className={`text-lg font-semibold mb-1 ${
                        isPassedOut ? "text-gray-500" : "text-green-600"
                      }`}
                    >
                      Pass Out Student
                    </h3>
                    <p
                      className={`text-sm text-center ${
                        isPassedOut ? "text-gray-400" : "text-green-600/70"
                      }`}
                    >
                      {isPassedOut
                        ? "Student is already Passed Out"
                        : "Mark student as graduated/completed"}
                    </p>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default FailStudentModal;
