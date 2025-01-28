import { useState, useEffect } from "react";
import { Button, Dialog, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const EditBatchModal = ({ open, handleOpen, batchData, token, onSuccess }) => {
  const [formData, setFormData] = useState({
    batchName: "",
    course: [], // Changed from string to array
    startDate: "",
    endDate: "",
    totalSeats: "",
    currentSemester: "",
    status: "",
    schedule: [{ day: "", time: "" }],
    sessionType: "",
    batchCoordinator: "",
  });
  const [loading, setLoading] = useState(false);

  // Get data from Redux
  const { courses } = useSelector((state) => state.groupdata);
  const { statuses } = useSelector((state) => state.groupdata);
  const { members } = useSelector((state) => state.groupdata);

  useEffect(() => {
    if (batchData) {
      setFormData({
        batchName: batchData.batchName,
        course: batchData.course.map((c) => c._id), // Extract course IDs
        startDate: batchData.startDate.split("T")[0],
        endDate: batchData.endDate.split("T")[0],
        totalSeats: batchData.totalSeats,
        currentSemester: batchData.currentSemester,
        status: batchData.status,
        schedule: batchData.schedule,
        sessionType: batchData.sessionType,
        batchCoordinator: batchData.batchCoordinator,
      });
    }
  }, [batchData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData({
      ...formData,
      schedule: updatedSchedule,
    });
  };

  const addSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: "", time: "" }],
    });
  };

  // Filter members to show only Coordinators and unblocked members
  const coordinatorOptions = members?.members
    ?.filter(
      (member) => member.group?.name === "Coordinator" && !member.blocked
    )
    .map((member) => (
      <option key={member._id} value={member._id}>
        {member.Name} - {member.staffId}
      </option>
    ));

  const activeCoursesOptions = courses?.courses
    ?.filter((course) => course.Status === "Active")
    .map((course) => (
      <option
        key={course._id}
        value={course._id}
        className="p-3 hover:bg-gray-100 cursor-pointer"
      >
        {course.name} - {course.code}
      </option>
    ));

  const handleSubmit = () => {
    const dataToSend = {
      ...formData,
      course: formData.course,
    };

    setLoading(true);
    axios
      .put(`${BASE_URL}/api/v1/sch/batches/${batchData._id}`, dataToSend, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Batch updated successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        onSuccess();
        handleOpen();
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to update batch",
          confirmButtonColor: "#5570F1",
        });
      });
  };

  return (
    <Dialog
      size="xl"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full p-6 h-[90vh] overflow-y-auto">
        <Typography variant="h5" className="mb-6 text-c-grays">
          Edit Batch
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Batch Name *
            </label>
            <input
              type="text"
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select Status</option>
              {statuses?.statuses?.map((status) => (
                <option key={status._id} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Batch Coordinator *
            </label>
            <select
              name="batchCoordinator"
              value={formData.batchCoordinator}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select Coordinator</option>
              {coordinatorOptions}
            </select>
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              End Date *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Total Seats *
            </label>
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Current Semester *
            </label>
            <input
              type="number"
              name="currentSemester"
              value={formData.currentSemester}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Session Type *
            </label>
            <select
              name="sessionType"
              value={formData.sessionType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select Session Type</option>
              <option value="Regular">Regular</option>
              <option value="Weekend">Weekend</option>
            </select>
          </div>
        </div>

        <div className="mt-6 mb-6">
          <Typography className="text-lg font-semibold text-c-grays mb-4">
            Course Selection
          </Typography>
          <div className="w-full">
            <div className="relative">
              <select
                multiple
                name="course"
                value={formData.course}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions
                  ).map((opt) => opt.value);
                  setFormData({
                    ...formData,
                    course: selectedOptions,
                  });
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple min-h-[150px] bg-white shadow-sm"
                required
              >
                {activeCoursesOptions}
              </select>
              <div className="mt-4 flex flex-wrap gap-3">
                {formData.course.map((courseId) => {
                  const selectedCourse = courses?.courses?.find(
                    (c) => c._id === courseId
                  );
                  return (
                    <span
                      key={courseId}
                      className="px-4 py-2 bg-c-purple text-white rounded-lg text-sm flex items-center gap-2 shadow-sm transition-all hover:bg-purple-700"
                    >
                      {selectedCourse?.name}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            course: formData.course.filter(
                              (id) => id !== courseId
                            ),
                          });
                        }}
                        className="hover:text-red-300 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <Typography className="text-lg font-semibold text-c-grays">
              Schedule
            </Typography>
            <Button type="button" onClick={addSchedule} className="bg-c-purple">
              Add Schedule
            </Button>
          </div>

          {formData.schedule.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-c-grays text-sm font-medium mb-2">
                    Day
                  </label>
                  <select
                    value={item.day}
                    onChange={(e) =>
                      handleScheduleChange(index, "day", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  >
                    <option value="">Select Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-c-grays text-sm font-medium mb-2">
                    Time
                  </label>
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) =>
                      handleScheduleChange(index, "time", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                    placeholder="e.g. 09:00 AM - 11:00 AM"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outlined"
            onClick={handleOpen}
            className="text-c-purple border-c-purple"
          >
            Cancel
          </Button>
          <Button
            className="bg-c-purple overflow-hidden h-[45px] flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Update Batch"
            )}
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default EditBatchModal;
