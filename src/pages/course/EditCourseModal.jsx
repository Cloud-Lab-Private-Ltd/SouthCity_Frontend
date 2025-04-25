import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";

const EditCourseModal = ({
  open,
  handleOpen,
  courseData,
  token,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    degreeType: "",
    duration: "",
    noOfSemesters: "",
    semesters: [{ semesterNo: "1", subjects: "", semesterFees: "" }],
    totalFee: "",
    Status: "",
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const { fees } = useSelector((state) => state.groupdata);

  useEffect(() => {
    if (courseData) {
      // Create a deep copy of the semesters to ensure we can modify them
      const semestersCopy = courseData.Semesters
        ? courseData.Semesters.map((sem) => ({
            semesterNo: sem.semesterNo,
            subjects: sem.subjects || "",
            semesterFees: sem.semesterFees || "",
            _id: sem._id,
          }))
        : [];

      setFormData({
        name: courseData.name || "",
        degreeType: courseData.degreeType?._id || "",
        duration: courseData.duration || "",
        noOfSemesters: courseData.noOfSemesters || "",
        semesters: semestersCopy,
        totalFee: courseData.totalFee || "",
        Status: courseData.Status || "",
      });
    }
  }, [courseData]);

  const { degreeTypes } = useSelector((state) => state.groupdata);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "noOfSemesters") {
      const numSemesters = parseInt(value) || 0;
      const newSemesters = Array.from({ length: numSemesters }, (_, index) => {
        // Preserve existing semester data if available
        if (index < formData.semesters.length) {
          return formData.semesters[index];
        }
        // Create new semester data for additional semesters
        return {
          semesterNo: (index + 1).toString(),
          subjects: "",
          semesterFees: "",
        };
      });

      // Calculate total fee based on semester fees
      const totalSemesterFees = newSemesters.reduce((sum, semester) => {
        return sum + (parseFloat(semester.semesterFees) || 0);
      }, 0);

      setFormData({
        ...formData,
        [name]: value,
        semesters: newSemesters,
        totalFee: totalSemesterFees.toString(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSemesterChange = (index, field, value) => {
    const updatedSemesters = [...formData.semesters];
    if (updatedSemesters[index]) {
      updatedSemesters[index] = {
        ...updatedSemesters[index],
        [field]: value,
      };

      // If the changed field is semesterFees, recalculate the total fee
      if (field === "semesterFees") {
        // Calculate sum of all semester fees
        const totalSemesterFees = updatedSemesters.reduce((sum, semester) => {
          return sum + (parseFloat(semester.semesterFees) || 0);
        }, 0);

        setFormData({
          ...formData,
          semesters: updatedSemesters,
          totalFee: totalSemesterFees.toString(),
        });
      } else {
        setFormData({
          ...formData,
          semesters: updatedSemesters,
        });
      }
    }
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();

    // Regular fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("degreeType", formData.degreeType);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("noOfSemesters", formData.noOfSemesters);
    formDataToSend.append(
      "perSemesterFee",
      fees?.find((fee) => fee.feeType === "semester")?._id
    );
    formDataToSend.append(
      "admissionFee",
      fees?.find((fee) => fee.feeType === "other")?._id
    );
    formDataToSend.append("totalFee", formData.totalFee);
    formDataToSend.append("Status", formData.Status);

    // Append Semesters data in array format
    formData.semesters.forEach((semester, index) => {
      formDataToSend.append(
        `Semesters[${index}][semesterNo]`,
        semester.semesterNo
      );
      formDataToSend.append(`Semesters[${index}][subjects]`, semester.subjects);
      formDataToSend.append(
        `Semesters[${index}][semesterFees]`,
        semester.semesterFees
      );
      // Include the _id if it exists (for existing semesters)
      if (semester._id) {
        formDataToSend.append(`Semesters[${index}][_id]`, semester._id);
      }
    });

    setLoading(true);
    axios
      .put(`${BASE_URL}/api/v1/sch/courses/${courseData._id}`, formDataToSend, {
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Programs updated successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        onSuccess();
        handleOpen();
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response?.data?.message || "Failed to update course");

        // Show error with SweetAlert
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to update course",
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
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="mb-6 text-c-grays">
            Edit Programs
          </Typography>
          <IconButton
            variant="text"
            color="gray"
            onClick={handleOpen}
            className="text-c-grays hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Programs Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            />
          </div>
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Degree Type *
            </label>
            <select
              name="degreeType"
              value={formData.degreeType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select Degree Type</option>
              {degreeTypes?.degreeTypes?.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Duration *
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select Duration</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="3 years">3 years</option>
              <option value="4 years">4 years</option>
              <option value="5 years">5 years</option>
              <option value="6 years">6 years</option>
              <option value="7 years">7 years</option>
              <option value="8 years">8 years</option>
              <option value="9 years">9 years</option>
              <option value="10 years">10 years</option>
            </select>
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Number of Semesters *
            </label>
            <input
              type="number"
              name="noOfSemesters"
              value={formData.noOfSemesters}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Total Fee *
            </label>
            <input
              type="number"
              name="totalFee"
              value={formData.totalFee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple bg-gray-50"
              readOnly
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Status *
            </label>
            <select
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select Status</option>
              <option value={"Active"}>{"Active"}</option>
              <option value={"Inactive"}>{"Inactive"}</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Typography className="text-lg font-semibold text-c-grays mb-4">
            Semesters
          </Typography>
          {formData.semesters.map((semester, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-c-grays text-sm font-medium mb-2">
                    Semester No
                  </label>
                  <input
                    type="text"
                    value={semester.semesterNo}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-c-grays text-sm font-medium mb-2">
                    Subjects (comma separated)
                  </label>
                  <input
                    type="text"
                    value={semester.subjects || ""}
                    onChange={(e) =>
                      handleSemesterChange(index, "subjects", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                    placeholder="e.g. Programming, Calculus, Physics"
                  />
                </div>
                <div>
                  <label className="block text-c-grays text-sm font-medium mb-2">
                    Semester Fee *
                  </label>
                  <input
                    type="number"
                    value={semester.semesterFees || ""}
                    onChange={(e) =>
                      handleSemesterChange(
                        index,
                        "semesterFees",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                    placeholder="Enter semester fee"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="my-4 p-3 rounded bg-red-50 border border-red-200 text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outlined"
            onClick={handleOpen}
            className="text-c-purple border-c-purple"
          >
            Cancel
          </Button>
          <Button
            className="bg-c-purple h-[45px] overflow-hidden flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Update Programs"
            )}
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default EditCourseModal;
