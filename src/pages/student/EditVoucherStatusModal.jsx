import { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  IconButton,
  Alert,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import { useSelector, useDispatch } from "react-redux";
import { AllLedgersGet, StudentLedgerGet } from "../../features/LedgerApiSlice";
import { NotificationsGet } from "../../features/GroupApiSlice";

const EditVoucherStatusModal = ({ open, handleOpen, voucherData }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const dispatch = useDispatch();

  const { statuses } = useSelector((state) => state.groupdata);

  const [formData, setFormData] = useState({
    status: "",
  });

  useEffect(() => {
    if (voucherData) {
      setFormData({
        status: voucherData.status,
      });
    }
  }, [voucherData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BASE_URL}/api/v1/sch/vouchers/update/${voucherData._id}`,
        formData,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      setMessage("Voucher status updated successfully!");
      setMessageType("success");

      // Refresh the ledger data
      if (voucherData.student) {
        dispatch(StudentLedgerGet(voucherData?.student._id));
        dispatch(AllLedgersGet());
        dispatch(NotificationsGet());
      }

      // Close modal after a short delay to show success message
      setTimeout(() => {
        handleOpen();
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to update voucher status"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} size="md">
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5" color="blue-gray">
          Update Voucher Status
        </Typography>
        <IconButton variant="text" color="blue-gray" onClick={handleOpen}>
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>
      <DialogBody divider>
        {message && (
          <Alert
            color={messageType === "success" ? "green" : "red"}
            className="mb-4"
            animate={{
              mount: { y: 0 },
              unmount: { y: -100 },
            }}
          >
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-6">
            <div>
              <Typography className="text-sm font-medium mb-2">
                Voucher Number
              </Typography>
              <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                {voucherData?.voucherNumber}
              </div>
            </div>

            <div>
              <Typography className="text-sm font-medium mb-2">
                Current Status
              </Typography>
              <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 capitalize">
                {voucherData?.status}
              </div>
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                New Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
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

          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outlined" color="red" onClick={handleOpen}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-c-purple h-[45px] flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Update Status"
              )}
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default EditVoucherStatusModal;
