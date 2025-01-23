import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
  Card,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const VoucherDetailsModal = ({ open, handleOpen, voucherData }) => {
  if (!voucherData) return null;

  return (
    <Dialog
      open={open}
      handler={handleOpen}
      className="min-w-[80%] max-h-[90vh] overflow-y-auto"
    >
      <DialogHeader className="flex justify-between items-center border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <div>
            <Typography variant="h5" className="text-c-grays font-bold">
              Voucher Details
            </Typography>
            <Typography className="text-sm text-gray-600">
              {voucherData.voucherNumber}
            </Typography>
          </div>
        </div>
        <IconButton variant="text" color="gray" onClick={handleOpen}>
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>

      <DialogBody divider className="h-[calc(100vh-30vh)] overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Voucher Information
            </Typography>
            <div className="space-y-4">
              <InfoItem
                label="Voucher Number"
                value={voucherData.voucherNumber}
              />
              <InfoItem
                label="Status"
                value={
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      voucherData.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : voucherData.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {voucherData.status}
                  </span>
                }
              />
              <InfoItem
                label="Due Date"
                value={new Date(voucherData.dueDate).toLocaleDateString()}
              />
              <InfoItem label="Month Of" value={voucherData.monthOf} />
            </div>
          </Card>

          <Card className="p-6 shadow-sm">
            <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
              Fee Details
            </Typography>
            <div className="space-y-4">
              <InfoItem
                label="Admission Fee"
                value={`Rs. ${voucherData.admissionFee}`}
              />
              <InfoItem
                label="Semester Fee"
                value={`Rs. ${voucherData.semesterFee}`}
              />
              <InfoItem
                label="Security Fee"
                value={`Rs. ${voucherData.securityFee}`}
              />
              <InfoItem
                label="Library Fee"
                value={`Rs. ${voucherData.libraryFee}`}
              />
              <InfoItem
                label="Total Fee"
                value={`Rs. ${voucherData.totalFee}`}
              />
              <InfoItem
                label="Amount in Words"
                value={voucherData.inWordAmount}
              />
            </div>
          </Card>

          {voucherData.student && (
            <Card className="p-6 shadow-sm">
              <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
                Student Information
              </Typography>
              <div className="space-y-4">
                <InfoItem label="Name" value={voucherData.student.fullName} />
                <InfoItem
                  label="Registration ID"
                  value={voucherData.student.registrationId}
                />
                <InfoItem label="Email" value={voucherData.student.email} />
                <InfoItem
                  label="Phone"
                  value={voucherData.student.phoneNumber}
                />
              </div>
            </Card>
          )}

          {voucherData.course && (
            <Card className="p-6 shadow-sm">
              <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
                Course Information
              </Typography>
              <div className="space-y-4">
                <InfoItem label="Course Name" value={voucherData.course.name} />
                <InfoItem label="Course Code" value={voucherData.course.code} />
                <InfoItem label="Level" value={voucherData.course.Level} />
                <InfoItem label="Status" value={voucherData.course.Status} />
              </div>
            </Card>
          )}

          {voucherData.paymentSlip && (
            <Card className="p-6 shadow-sm col-span-2">
              <Typography className="font-bold mb-4 text-lg text-c-purple border-b pb-2">
                Payment Slip
              </Typography>
              <div className="mt-4">
                <img
                  src={voucherData.paymentSlip}
                  alt="Payment Slip"
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </Card>
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

export default VoucherDetailsModal;
