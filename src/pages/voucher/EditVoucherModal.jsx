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
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const EditVoucherModal = ({
  open,
  handleOpen,
  voucherData,
  token,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const { statuses } = useSelector((state) => state.groupdata);

  const [formData, setFormData] = useState({
    admissionFee: "",
    semesterFee: "",
    securityFee: "",
    libraryFee: "",
    totalFee: "",
    inWordAmount: "",
    dueDate: "",
    monthOf: "",
    status: "",
  });

  useEffect(() => {
    if (voucherData) {
      setFormData({
        admissionFee: voucherData.admissionFee,
        semesterFee: voucherData.semesterFee,
        securityFee: voucherData.securityFee,
        libraryFee: voucherData.libraryFee,
        totalFee: voucherData.totalFee,
        inWordAmount: voucherData.inWordAmount,
        dueDate: voucherData.dueDate?.split("T")[0],
        monthOf: voucherData.monthOf,
        status: voucherData.status,
      });
    }
  }, [voucherData]);

  useEffect(() => {
    const total =
      Number(formData.admissionFee) +
      Number(formData.semesterFee) +
      Number(formData.securityFee) +
      Number(formData.libraryFee);
    setFormData((prev) => ({ ...prev, totalFee: total.toString() }));
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

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Voucher updated successfully!",
        confirmButtonColor: "#5570F1",
      });

      handleOpen();
      onSuccess();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update voucher",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5" color="blue-gray">
          Edit Voucher
        </Typography>
        <IconButton variant="text" color="blue-gray" onClick={handleOpen}>
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>
      <DialogBody divider className="h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Admission Fee *
              </label>
              <input
                type="number"
                value={formData.admissionFee}
                onChange={(e) =>
                  setFormData({ ...formData, admissionFee: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Semester Fee *
              </label>
              <input
                type="number"
                value={formData.semesterFee}
                onChange={(e) =>
                  setFormData({ ...formData, semesterFee: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Security Fee *
              </label>
              <input
                type="number"
                value={formData.securityFee}
                onChange={(e) =>
                  setFormData({ ...formData, securityFee: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Library Fee *
              </label>
              <input
                type="number"
                value={formData.libraryFee}
                onChange={(e) =>
                  setFormData({ ...formData, libraryFee: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Total Fee
              </label>
              <input
                type="number"
                value={formData.totalFee}
                readOnly
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
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

export default EditVoucherModal;
