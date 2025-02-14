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
    semesters: [{ semesterNo: "1", subjects: "" }],
    perSemesterFee: "",
    admissionFee: "",
    totalFee: "",
    Status: "",
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (courseData) {
      setFormData({
        name: courseData.name,
        degreeType: courseData.degreeType._id, // Use _id from the nested object
        duration: courseData.duration,
        noOfSemesters: courseData.noOfSemesters,
        semesters: courseData.Semesters,
        perSemesterFee: courseData.perSemesterFee,
        admissionFee: courseData.admissionFee,
        totalFee: courseData.totalFee,
        Status: courseData.Status,
      });
    }
  }, [courseData]);

  const { degreeTypes } = useSelector((state) => state.groupdata);
  const { statuses } = useSelector((state) => state.groupdata);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "noOfSemesters") {
      const numSemesters = parseInt(value) || 0;
      const newSemesters = Array.from({ length: numSemesters }, (_, index) => ({
        semesterNo: (index + 1).toString(),
        subjects: formData.semesters[index]?.subjects || "",
      }));

      // Recalculate total fee with new number of semesters
      const perSemFee = parseFloat(formData.perSemesterFee) || 0;
      const admFee = parseFloat(formData.admissionFee) || 0;
      const totalFee = perSemFee * numSemesters + admFee;

      setFormData({
        ...formData,
        [name]: value,
        semesters: newSemesters,
        totalFee: totalFee.toString(),
      });
    } else if (name === "perSemesterFee" || name === "admissionFee") {
      const updatedFormData = {
        ...formData,
        [name]: value,
      };

      const perSemFee =
        parseFloat(
          name === "perSemesterFee" ? value : formData.perSemesterFee
        ) || 0;
      const admFee =
        parseFloat(name === "admissionFee" ? value : formData.admissionFee) ||
        0;
      const numSemesters = parseInt(formData.noOfSemesters) || 0;

      const totalFee = perSemFee * numSemesters + admFee;

      updatedFormData.totalFee = totalFee.toString();
      setFormData(updatedFormData);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSemesterChange = (index, field, value) => {
    const updatedSemesters = [...formData.semesters];
    updatedSemesters[index][field] = value;
    setFormData({
      ...formData,
      semesters: updatedSemesters,
    });
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();

    // Regular fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("degreeType", formData.degreeType);
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("noOfSemesters", formData.noOfSemesters);
    formDataToSend.append("perSemesterFee", formData.perSemesterFee);
    formDataToSend.append("admissionFee", formData.admissionFee);
    formDataToSend.append("totalFee", formData.totalFee);
    formDataToSend.append("Status", formData.Status);

    // Append Semesters data in array format
    formData.semesters.forEach((semester, index) => {
      formDataToSend.append(
        `Semesters[${index}][semesterNo]`,
        semester.semesterNo
      );
      formDataToSend.append(`Semesters[${index}][subjects]`, semester.subjects);
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
          text: "Course updated successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        onSuccess();
        handleOpen();
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response?.data?.message || "Failed to update course");
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
            Edit Course
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
              Course Name *
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
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            />
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
              Per Semester Fee *
            </label>
            <input
              type="number"
              name="perSemesterFee"
              value={formData.perSemesterFee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Admission Fee *
            </label>
            <input
              type="number"
              name="admissionFee"
              value={formData.admissionFee}
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
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
              {statuses?.statuses?.map((status) => (
                <option key={status._id} value={status.name}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Typography className="text-lg font-semibold text-c-grays mb-4">
            Semesters
          </Typography>
          {formData.semesters.map((semester, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    value={semester.subjects}
                    onChange={(e) =>
                      handleSemesterChange(index, "subjects", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                    placeholder="e.g. Programming, Calculus, Physics"
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
              "Update Course"
            )}
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default EditCourseModal;
