import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Alert,
} from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import { useDispatch } from "react-redux";
import { AllLedgersGet, StudentLedgerGet } from "../../features/LedgerApiSlice";
import { NotificationsGet } from "../../features/GroupApiSlice";

const SplitVoucherModal = ({ open, handleClose, voucher }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [firstDueDate, setFirstDueDate] = useState(null);
  const [secondDueDate, setSecondDueDate] = useState(null);

  const [paymentPercentage, setPaymentPercentage] = useState(50); // Default to 50%

  // Add state for messages
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // Calculate split amounts based on percentage
  const calculateSplitAmounts = () => {
    if (!voucher) return { first: 0, second: 0 };

    const firstAmount = Math.round(
      (voucher.remainingAmount * paymentPercentage) / 100
    );
    const secondAmount = voucher.remainingAmount - firstAmount;

    return { first: firstAmount, second: secondAmount };
  };

  const { first: firstAmount, second: secondAmount } = calculateSplitAmounts();

  // Submit split
  const submitSplit = async () => {
    if (!voucher) return;

    // Validate dates are selected
    if (!firstDueDate || !secondDueDate) {
      setMessage("Both due dates are required");
      setMessageType("error");
      return;
    }

    // Validate dates
    if (firstDueDate >= secondDueDate) {
      setMessage("Second due date must be after the first due date");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/voucher/splitVoucher`,
        {
          voucherId: voucher._id,
          paymentPercentage: paymentPercentage,
          firstDueDate: firstDueDate.toISOString(),
          secondDueDate: secondDueDate.toISOString(),
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data) {
        setMessage("Voucher split successfully!");
        setMessageType("success");

        // Refresh the ledger data
        if (voucher.student) {
          dispatch(StudentLedgerGet(voucher?.student?._id));
          dispatch(AllLedgersGet());
          dispatch(NotificationsGet());
        }

        // Close modal after a short delay to show success message
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to split voucher");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal is closed
  const onClose = () => {
    setFirstDueDate(null);
    setSecondDueDate(null);
    setPaymentPercentage(50);
    setMessage(null);
    setMessageType("");
    handleClose();
  };

  if (!voucher) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>Split Voucher {voucher.voucherNumber}</DialogHeader>
      <DialogBody divider className="h-[500px] overflow-auto">
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
              <p className="text-sm text-gray-500">Original Amount</p>
              <p className="font-medium">
                Rs. {voucher.totalFee.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid Amount</p>
              <p className="font-medium">
                Rs. {voucher.paidAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining Balance</p>
              <p className="font-medium">
                Rs. {voucher.remainingAmount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{voucher.monthOf}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-lg font-medium mb-4">Split Voucher Settings</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Percentage for First Voucher
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
                  Second Voucher Percentage
                </p>
                <p className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {100 - paymentPercentage}%
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Due Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={firstDueDate}
                  onChange={(date) => setFirstDueDate(date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-c-purple"
                  placeholderText="Select first due date"
                  required
                />
                {!firstDueDate && (
                  <p className="text-xs text-red-500 mt-1">
                    First due date is required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Second Due Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={secondDueDate}
                  onChange={(date) => setSecondDueDate(date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-c-purple"
                  placeholderText="Select second due date"
                  required
                />
                {!secondDueDate && (
                  <p className="text-xs text-red-500 mt-1">
                    Second due date is required
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="text-lg font-medium mb-4">Split Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">
                  First Voucher
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-medium">
                      Rs. {firstAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-medium">{paymentPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="font-medium">
                      {firstDueDate
                        ? firstDueDate.toLocaleDateString()
                        : "Not set"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <h5 className="font-medium text-purple-800 mb-2">
                  Second Voucher
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-medium">
                      Rs. {secondAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Percentage:</span>
                    <span className="font-medium">
                      {100 - paymentPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Due Date:</span>
                    <span className="font-medium">
                      {secondDueDate
                        ? secondDueDate.toLocaleDateString()
                        : "Not set"}
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
          onClick={onClose}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          className="bg-c-purple"
          onClick={submitSplit}
          disabled={loading || !firstDueDate || !secondDueDate}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            "Split Voucher"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SplitVoucherModal;
