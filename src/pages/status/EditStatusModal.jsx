import { useState, useEffect } from "react";
import { Button, Dialog, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";

const EditStatusModal = ({ open, handleOpen, statusData, token, onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (statusData) {
      setName(statusData.name);
    }
  }, [statusData]);

  const handleSubmit = () => {
    if (!name) {
      setError("Please enter status name");
      return;
    }

    setLoading(true);
    setError("");

    axios
      .put(
        `${BASE_URL}/api/v1/sch/statuses/${statusData._id}`,
        { name },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then(() => {
        setLoading(false);
        onSuccess();
        handleOpen();
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response?.data?.message || "Failed to update status");
      });
  };

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5" className="text-c-grays">
            Edit Status
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

        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter status name"
              required
            />
          </div>
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
            className="bg-c-purple h-[45px] overflow-hidden flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Update Status"
            )}
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default EditStatusModal;
