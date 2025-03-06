import { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import { useDispatch, useSelector } from "react-redux";
import { VouchersGet } from "../../features/GroupApiSlice";

const EditSplitVoucherModal = ({
  open,
  handleOpen,
  voucherData,
  token,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const { fees } = useSelector((state) => state.groupdata);
  const { statuses } = useSelector((state) => state.groupdata);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    student: "",
    course: "",
    admissionFee: "",
    semesterFee: "",
    securityFee: "",
    libraryFee: "",
    totalFee: "",
    inWordAmount: "",
    dueDate: "",
    monthOf: "",
    isFullPayment: false,
    paymentPercentage: "",
    status: "",
  });

  useEffect(() => {
    if (voucherData) {
      setFormData({
        ...formData,
        student: voucherData.student._id,
        course: voucherData.course._id,
        admissionFee: voucherData.admissionFee,
        semesterFee: voucherData.semesterFee,
        securityFee: voucherData.securityFee,
        libraryFee: voucherData.libraryFee,
        totalFee: voucherData.totalFee,
        inWordAmount: voucherData.inWordAmount,
        dueDate: voucherData.dueDate?.split("T")[0],
        monthOf: voucherData.monthOf,
        isFullPayment: voucherData.isFullPayment,
        paymentPercentage: voucherData.paymentPercentage,
        status: voucherData.status,
      });
    }
  }, [voucherData]);

  useEffect(() => {
    if (fees && Array.isArray(fees)) {
      const admissionFee =
        fees.find((fee) => fee.feeType === "other")?.amount || 0;
      const semesterFee =
        fees.find((fee) => fee.feeType === "semester")?.amount || 0;
      const securityFee =
        fees.find((fee) => fee.feeType === "security")?.amount || 0;
      const libraryFee =
        fees.find((fee) => fee.feeType === "library")?.amount || 0;

      if (!formData.isFullPayment && formData.paymentPercentage) {
        const percentMultiplier = formData.paymentPercentage / 100;
        setFormData((prev) => ({
          ...prev,
          admissionFee: (admissionFee * percentMultiplier).toString(),
          semesterFee: (semesterFee * percentMultiplier).toString(),
          securityFee: (securityFee * percentMultiplier).toString(),
          libraryFee: (libraryFee * percentMultiplier).toString(),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          admissionFee: admissionFee.toString(),
          semesterFee: semesterFee.toString(),
          securityFee: securityFee.toString(),
          libraryFee: libraryFee.toString(),
        }));
      }
    }
  }, [fees, formData.isFullPayment, formData.paymentPercentage]);

  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100)
        return (
          tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
        );
      return (
        ones[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "")
      );
    };

    if (num === 0) return "Zero";

    const num_parts = [];
    num_parts.push(Math.floor(num / 1000));
    num_parts.push(num % 1000);

    let result = "";
    if (num_parts[0] > 0) {
      result += convertLessThanThousand(num_parts[0]) + " Thousand";
    }
    if (num_parts[1] > 0) {
      result +=
        (result !== "" ? " " : "") + convertLessThanThousand(num_parts[1]);
    }

    return result + " Rupees Only";
  };

  useEffect(() => {
    const total =
      Number(formData.admissionFee) +
      Number(formData.semesterFee) +
      Number(formData.securityFee) +
      Number(formData.libraryFee);
    setFormData((prev) => ({
      ...prev,
      totalFee: total.toString(),
      inWordAmount: numberToWords(total),
    }));
  }, [
    formData.admissionFee,
    formData.semesterFee,
    formData.securityFee,
    formData.libraryFee,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `${BASE_URL}/api/v1/sch/vouchers/update/${voucherData._id}`,
        formData,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      // Show success message inside modal
      const successDiv = document.createElement("div");
      successDiv.innerHTML = `
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong class="font-bold">Success!</strong>
          <span class="block sm:inline"> Voucher updated successfully.</span>
        </div>
      `;
      document.querySelector(".modal-body").prepend(successDiv);

      // Remove success message after 2 seconds
      setTimeout(() => {
        successDiv.remove();
        dispatch(VouchersGet());
        handleOpen();
        onSuccess();
      }, 2000);
    } catch (error) {
      // Show error message inside modal
      const errorDiv = document.createElement("div");
      errorDiv.innerHTML = `
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> ${
            error.response?.data?.message || "Failed to update voucher"
          }</span>
        </div>
      `;
      document.querySelector(".modal-body").prepend(errorDiv);

      // Remove error message after 3 seconds
      setTimeout(() => {
        errorDiv.remove();
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5" color="blue-gray">
          Edit Split Voucher
        </Typography>
        <IconButton variant="text" color="blue-gray" onClick={handleOpen}>
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>
      <DialogBody divider className="h-[80vh] overflow-y-auto modal-body">
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Admission Fee *
              </label>
              <input
                type="number"
                value={formData.admissionFee}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Semester Fee *
              </label>
              <input
                type="number"
                value={formData.semesterFee}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Security Fee *
              </label>
              <input
                type="number"
                value={formData.securityFee}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Library Fee *
              </label>
              <input
                type="number"
                value={formData.libraryFee}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Total Fee
              </label>
              <input
                type="number"
                value={formData.totalFee}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Amount in Words *
              </label>
              <input
                type="text"
                value={formData.inWordAmount}
                onChange={(e) =>
                  setFormData({ ...formData, inWordAmount: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Month Of *
              </label>
              <input
                type="month"
                value={formData.monthOf}
                onChange={(e) =>
                  setFormData({ ...formData, monthOf: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Status *
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
            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFullPayment"
                checked={formData.isFullPayment}
                onChange={(e) =>
                  setFormData({ ...formData, isFullPayment: e.target.checked })
                }
                className="w-7 h-7 text-c-purple cursor-pointer border-gray-300 rounded focus:ring-c-purple"
              />
              <label
                htmlFor="isFullPayment"
                className="text-c-grays text-md font-medium"
              >
                Full Payment
              </label>
            </div> */}

            {!formData.isFullPayment && (
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Payment Percentage
                </label>
                <input
                  type="number"
                  value={formData.paymentPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      paymentPercentage: Number(e.target.value),
                    })
                  }
                  className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  min="1"
                  max="99"
                />
              </div>
            )}
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
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                "Update Voucher"
              )}
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default EditSplitVoucherModal;
