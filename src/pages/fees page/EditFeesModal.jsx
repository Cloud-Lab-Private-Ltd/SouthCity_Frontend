import { useState, useEffect } from "react";
import { Button, Dialog, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";

const EditFeesModal = ({ open, handleOpen, feeData, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [feeType, setFeeType] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (feeData) {
      setAmount(feeData.amount);
      setFeeType(feeData.feeType);
    }
  }, [feeData]);

  const handleSubmit = async () => {
    if (!amount || !feeType) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please fill all the required fields",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/sch/fees/update/${feeData._id}`,
        {
          amount: Number(amount),
          feeType
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Fee updated successfully!",
          confirmButtonColor: "#5570F1",
        });
        onSuccess();
        handleOpen();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update fee",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full p-6">
        <Typography variant="h5" className="mb-6 text-c-grays">
          Edit Fee
        </Typography>

        <div className="space-y-6">
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Amount *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Fee Type *
            </label>
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select Fee Type</option>
              <option value="academic">Academic Fee</option>
              <option value="security">Security Fee</option>
              <option value="library">Library Fee</option>
              <option value="semester">Semester Fee</option>
              <option value="other">Other</option>
            </select>
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
            className="bg-c-purple h-[45px] flex items-center justify-center overflow-hidden"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Update Fee"
            )}
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default EditFeesModal;
