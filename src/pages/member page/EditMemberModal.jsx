import { useState, useEffect } from "react";
import { Button, Dialog, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const EditMemberModal = ({
  open,
  handleOpen,
  memberData,
  token,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    nic: "",
    group: "",
    gender: "",
    verified: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { groups } = useSelector((state) => state.groupdata);

  // Add these states
  const [profileImage, setProfileImage] = useState(null);

  // Add file change handler
  const handleFileChange = (e) => {
    if (e.target.name === "profileImage") {
      setProfileImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (memberData) {
      setFormData({
        Name: memberData.Name,
        email: memberData.email,

        nic: memberData.nic,

        gender: memberData.gender,
        verified: memberData.verified,
        group: memberData.group.id,
      });
    }
  }, [memberData]);

  const groupOptions = groups?.groups
    ?.filter((group) => group.name.toLowerCase() !== "students")
    .map((group) => (
      <option key={group._id} value={group._id}>
        {group.name}
      </option>
    ));

  // Handle city change

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (profileImage) formDataToSend.append("profileImage", profileImage);

    setLoading(true);
    axios
      .put(`${BASE_URL}/api/v1/sch/member/${memberData._id}`, formDataToSend, {
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Member updated successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        onSuccess();
        handleOpen();
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response?.data?.message || "Failed to update member");
      });
  };

  return (
    <Dialog
      size="xl"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full h-auto overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5" className="text-c-grays">
            Edit Member
          </Typography>
          <button
            onClick={handleOpen}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Name *
            </label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter email"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              NIC *
            </label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter NIC"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Group *
            </label>
            <select
              name="group"
              value={formData.group}
              onChange={(e) =>
                setFormData({ ...formData, group: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select group</option>
              {groupOptions}
            </select>
          </div>
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Profile Image *{" "}
              <span className="text-[11px] text-c-purple">(JPG, PNG only)</span>
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              name="profileImage"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Verification Status
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    verified: e.target.checked,
                  })
                }
                className="w-4 h-4 text-c-purple border-gray-300 rounded focus:ring-c-purple"
              />
              <span className="text-c-grays">Verified Member</span>
            </div>
          </div>
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
            className="bg-c-purple h-[45px] flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Update Member"
            )}
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default EditMemberModal;
