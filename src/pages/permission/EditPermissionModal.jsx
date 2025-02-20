import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";

const EditPermissionModal = ({
  open,
  handleOpen,
  permissionData,
  onSuccess,
}) => {
  const [permissions, setPermissions] = useState([
    // {
    //   pageName: "Members",
    //   insert: false,
    //   update: false,
    //   delete: false,
    //   read: false,
    // },
    {
      pageName: "Courses",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Batch",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Student",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Voucher",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Action Log",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Bulk Message",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Degree Type",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Status",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Fees",
   
      update: false,
    
      read: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");

  useEffect(() => {
    if (permissionData) {
      setPermissions(permissionData.permissions);
    }
  }, [permissionData]);

  const handlePermissionChange = (pageIndex, field) => {
    setPermissions((prevPermissions) => {
      const newPermissions = [...prevPermissions];
      newPermissions[pageIndex] = {
        ...newPermissions[pageIndex],
        [field]: !newPermissions[pageIndex][field],
      };
      return newPermissions;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      setError(""); // Clear any previous errors
      const response = await axios.put(
        `${BASE_URL}/api/v1/sch/permissions/${permissionData._id}`,
        { permissions },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data) {
        onSuccess();
        handleOpen();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update permissions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      size="lg"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5" className="text-c-grays">
            Edit Permissions - {permissionData?.group?.name}
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

        <div className="space-y-8 max-h-[60vh] overflow-y-auto">
          {permissions.map((page, pageIndex) => (
            <div key={page.pageName} className="border p-4 rounded-lg">
              <Typography className="text-lg font-medium text-c-grays mb-4">
                {page.pageName}
              </Typography>
              <div className="flex flex-wrap gap-6">
                <Checkbox
                  checked={page.read}
                  onChange={() => handlePermissionChange(pageIndex, "read")}
                  label="Read"
                  className="text-c-purple"
                />
                <Checkbox
                  checked={page.insert}
                  onChange={() => handlePermissionChange(pageIndex, "insert")}
                  label="Insert"
                  className="text-c-purple"
                />
                <Checkbox
                  checked={page.update}
                  onChange={() => handlePermissionChange(pageIndex, "update")}
                  label="Update"
                  className="text-c-purple"
                />
                <Checkbox
                  checked={page.delete}
                  onChange={() => handlePermissionChange(pageIndex, "delete")}
                  label="Delete"
                  className="text-c-purple"
                />
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Typography className="text-red-500 text-sm">{error}</Typography>
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
              "Update Permissions"
            )}
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default EditPermissionModal;
