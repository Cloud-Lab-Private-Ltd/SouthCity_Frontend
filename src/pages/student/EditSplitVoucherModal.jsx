import { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Alert,
} from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import { useDispatch } from "react-redux";
import { StudentLedgerGet, AllLedgersGet } from "../../features/LedgerApiSlice";
import { NotificationsGet } from "../../features/GroupApiSlice";

const EditSplitVoucherModal = ({ open, handleOpen, voucherData }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [paymentPercentage, setPaymentPercentage] = useState(50);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // Initialize paymentPercentage when voucherData changes
  useEffect(() => {
    if (voucherData && voucherData.paymentPercentage) {
      setPaymentPercentage(voucherData.paymentPercentage);
    } else {
      setPaymentPercentage(50); // Default value
    }
  }, [voucherData]);

  // Calculate what the other split voucher's percentage would be
  const otherPercentage = 100 - paymentPercentage;

  // Submit the updated payment percentage
  const handleSubmit = async () => {
    if (!voucherData) return;

    // Validate the percentage
    if (paymentPercentage <= 0 || paymentPercentage >= 100) {
      setMessage("Payment percentage must be between 1 and 99");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${BASE_URL}/api/v1/sch/vouchers/update-with-ledger/${voucherData._id}`,
        {
          paymentPercentage: paymentPercentage
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data) {
        setMessage("Voucher updated successfully!");
        setMessageType("success");

        // Refresh the ledger data
        if (voucherData.student) {
          dispatch(StudentLedgerGet(voucherData.student._id));
          dispatch(AllLedgersGet());
          dispatch(NotificationsGet());
        }

        // Close modal after a short delay to show success message
        setTimeout(() => {
          handleOpen();
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update voucher");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  if (!voucherData) return null;

  return (
    <Dialog open={open} handler={handleOpen} size="md">
      <DialogHeader>Edit Split Voucher {voucherData.voucherNumber}</DialogHeader>
      <DialogBody divider className="h-[400px] overflow-auto">
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

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Voucher Number</p>
              <p className="font-medium">{voucherData.voucherNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Fee</p>
              <p className="font-medium">
                Rs. {voucherData.totalFee?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid Amount</p>
              <p className="font-medium">
                Rs. {voucherData.paidAmount?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining Balance</p>
              <p className="font-medium">
                Rs. {voucherData.remainingAmount?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-lg font-medium mb-4">Edit Payment Percentage</h4>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Percentage for This Voucher
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={paymentPercentage}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value > 0 && value < 100) {
                    setPaymentPercentage(value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-c-purple"
              />
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-1">
                Other Voucher Percentage
              </p>
              <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                {otherPercentage}%
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-lg font-medium mb-4">Split Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">
                  This Voucher
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-medium">{paymentPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-medium">
                      Rs. {Math.round((voucherData.totalFee * paymentPercentage) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h5 className="font-medium text-purple-800 mb-2">
                  Other Voucher
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-medium">{otherPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-medium">
                      Rs. {Math.round((voucherData.totalFee * otherPercentage) / 100).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="outlined"
          color="red"
          onClick={handleOpen}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          className="bg-c-purple"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            "Update Split Voucher"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditSplitVoucherModal;
