import { useState, useEffect } from "react";
import { Button, Dialog, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";

const EditDegreeModal = ({
  open,
  handleOpen,
  degreeData,
  token,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (degreeData) {
      setName(degreeData.name);
      setDescription(degreeData.description);
    }
  }, [degreeData]);

  const handleSubmit = () => {
    setLoading(true);
    setError("");

    axios
      .put(
        `${BASE_URL}/api/v1/sch/degree-types/${degreeData._id}`,
        {
          name,
          description,
          // startDate,
          // endDate,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        // setEndDate("");
        // setStartDate("");
        onSuccess();
        handleOpen();
      })
      .catch((error) => {
        setLoading(false);
        setError(
          error.response?.data?.message || "Failed to update degree type"
        );
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
            Edit Degree Type
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
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter degree type name"
            />
          </div>
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter description"
            />
          </div>
          {/* <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
            />
          </div> */}
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
            className="bg-c-purple h-[50px] flex items-center justify-center overflow-hidden"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Update Degree Type"
            )}
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default EditDegreeModal;
