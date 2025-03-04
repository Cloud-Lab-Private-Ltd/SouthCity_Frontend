import { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import jsPDF from "jspdf";
import EditSplitVoucherModal from "./EditSplitVoucherModal";

const ViewSplitVouchersModal = ({
  open,
  handleOpen,
  parentVoucherId,
  token,
}) => {
  const [splitVouchers, setSplitVouchers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && parentVoucherId) {
      fetchSplitVouchers();
    }
  }, [open, parentVoucherId]);

  // Add state for managing dropdown menu
  const [openMenu, setOpenMenu] = useState(null);

  // Add useEffect for handling menu close
  useEffect(() => {
    const closeMenu = () => setOpenMenu(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const generateVoucherPDF = (voucherData) => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const voucherWidth = pageWidth / 2;
    const voucherHeight = pageHeight / 2;

    const copyTypes = [
      "Bank Copy",
      "Institute A/C Copy",
      "Application Form Copy",
      "Applicant Copy",
    ];

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const xOffset = col * voucherWidth;
        const yOffset = row * voucherHeight;
        const copyIndex = row * 2 + col;

        // Header Section
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.text(
          voucherData.voucherNumber,
          xOffset + voucherWidth / 2,
          8 + yOffset,
          {
            align: "center",
          }
        );
        doc.text(
          copyTypes[copyIndex],
          xOffset + voucherWidth - 10,
          8 + yOffset,
          {
            align: "right",
          }
        );
        doc.text(
          "South City Healthcare Education Hub",
          xOffset + voucherWidth / 2,
          12 + yOffset,
          { align: "center" }
        );
        doc.setFontSize(5);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Pvt. Ltd. Clifton, Karachi.",
          xOffset + voucherWidth / 2,
          16 + yOffset,
          { align: "center" }
        );
        doc.setFont("helvetica", "bold");
        doc.text("SCPTR", xOffset + voucherWidth / 2, 20 + yOffset, {
          align: "center",
        });
        doc.setFont("helvetica", "normal");
        doc.text("United Bank Ltd", xOffset + voucherWidth / 2, 24 + yOffset, {
          align: "center",
        });
        doc.text(
          "Branch Name: Boat Basin",
          xOffset + voucherWidth / 2,
          28 + yOffset,
          { align: "center" }
        );
        doc.text(
          "Branch Code: 1212",
          xOffset + voucherWidth / 2,
          32 + yOffset,
          { align: "center" }
        );
        doc.text(
          "Account #: 2509114461",
          xOffset + voucherWidth / 2,
          36 + yOffset,
          { align: "center" }
        );

        // Student Information
        doc.setFont("helvetica", "bold");
        doc.text("Full Name", xOffset + 5, 42 + yOffset);
        doc.line(
          xOffset + 20,
          42 + yOffset,
          xOffset + voucherWidth - 5,
          42 + yOffset
        );
        doc.setFont("helvetica", "normal");
        doc.text(
          splitVouchers.student?.fullName || "",
          xOffset + 22,
          41 + yOffset
        );

        doc.setFont("helvetica", "bold");
        doc.text("Father Name", xOffset + 5, 47 + yOffset);
        doc.line(
          xOffset + 20,
          47 + yOffset,
          xOffset + voucherWidth - 5,
          47 + yOffset
        );
        doc.setFont("helvetica", "normal");
        doc.text(
          splitVouchers.student?.fatherName || "",
          xOffset + 22,
          46 + yOffset
        );

        doc.setFont("helvetica", "bold");
        doc.text("CNIC", xOffset + 5, 52 + yOffset);
        doc.line(
          xOffset + 20,
          52 + yOffset,
          xOffset + voucherWidth - 5,
          52 + yOffset
        );
        doc.setFont("helvetica", "normal");
        doc.text(splitVouchers.student?.nic || "", xOffset + 22, 51 + yOffset);

        doc.setFont("helvetica", "bold");
        doc.text("Application No", xOffset + 5, 57 + yOffset);
        doc.line(
          xOffset + 20,
          57 + yOffset,
          xOffset + voucherWidth - 5,
          57 + yOffset
        );
        doc.setFont("helvetica", "normal");
        doc.text(
          splitVouchers.student?.registrationId || "",
          xOffset + 22,
          56 + yOffset
        );

        // Fee Breakdown Section with full width background
        doc.setFillColor(200, 200, 200);
        doc.rect(xOffset + 5, 62 + yOffset, voucherWidth - 10, 4, "F");
        doc.setFont("helvetica", "bold");
        doc.text("Detail of Fee", xOffset + 7, 65 + yOffset);
        doc.text("Amount", xOffset + voucherWidth - 25, 65 + yOffset);

        const feeDetails = [
          "Admission Fee",
          "Semester Fee",
          "Security Deposit",
          "Library Charges",
          "Total",
        ];

        const feeAmounts = [
          voucherData.admissionFee,
          voucherData.semesterFee,
          voucherData.securityFee,
          voucherData.libraryFee,
          voucherData.paidAmount,
        ];

        let yPos = 71 + yOffset;
        feeDetails.forEach((item, index) => {
          doc.setFont("helvetica", "normal");
          doc.text(item, xOffset + 7, yPos);
          doc.text(
            `Rs. ${feeAmounts[index]}`,
            xOffset + voucherWidth - 25,
            yPos
          );
          yPos += 4;
        });

        // Amount in Words
        doc.setFont("helvetica", "bold");
        doc.text("In word:", xOffset + 5, 95 + yOffset);
        doc.line(
          xOffset + 20,
          95 + yOffset,
          xOffset + voucherWidth - 5,
          95 + yOffset
        );
        doc.setFont("helvetica", "normal");
        doc.text(voucherData.inWordAmount, xOffset + 22, 94 + yOffset);

        // Footer Section
        doc.text("Applicant Signature", xOffset + 5, 100 + yOffset);
        doc.line(
          xOffset + 30,
          100 + yOffset,
          xOffset + voucherWidth - 5,
          100 + yOffset
        );
        doc.text(
          "Receiving Branch Stamp and Signature",
          xOffset + 5,
          105 + yOffset
        );
        doc.line(
          xOffset + 50,
          105 + yOffset,
          xOffset + voucherWidth - 5,
          105 + yOffset
        );

        // Border around voucher
        doc.rect(xOffset + 2, yOffset + 2, voucherWidth - 4, voucherHeight - 4);
      }
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  const fetchSplitVouchers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/sch/vouchers/${parentVoucherId}`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setSplitVouchers(response.data);
    } catch (error) {
      console.error("Failed to fetch split vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add state for edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  // Add handler
  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setEditModalOpen(true);
  };

  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader className="flex justify-between items-center">
        <Typography variant="h5" color="blue-gray">
          Split Vouchers List
        </Typography>
        <IconButton variant="text" color="blue-gray" onClick={handleOpen}>
          <XMarkIcon className="h-6 w-6" />
        </IconButton>
      </DialogHeader>
      <DialogBody divider className="h-[80vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : !Array.isArray(splitVouchers?.splitVouchers) ||
          splitVouchers?.splitVouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <div className="text-center">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                No Split Vouchers Found
              </Typography>
              <Typography className="text-gray-600">
                This voucher hasn't been split into multiple payments yet.
              </Typography>
            </div>
          </div>
        ) : (
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Voucher Number
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Payment %
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Paid Amount
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Remaining Amount
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Month Of
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Due Date
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Status
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(splitVouchers?.splitVouchers) &&
                splitVouchers?.splitVouchers.map((voucher) => (
                  <tr key={voucher._id} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {voucher.voucherNumber}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {voucher.paymentPercentage}%
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        Rs. {voucher.paidAmount}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        Rs. {voucher.remainingAmount}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {voucher.monthOf}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {new Date(voucher.dueDate).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          voucher.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : voucher.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {voucher.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(voucher._id);
                          }}
                          className="p-2 hover:bg-blue-100 rounded-full transition-all duration-200 border border-gray-300 hover:border-blue-500 shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-600 hover:text-blue-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                            />
                          </svg>
                        </button>

                        {openMenu === voucher._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-[9999]">
                            <div className="py-2">
                              <button
                                onClick={() => {
                                  generateVoucherPDF(voucher);
                                  setOpenMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-blue-600"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                  />
                                </svg>
                                View Slip
                              </button>

                              <button
                                onClick={() => {
                                  handleEdit(voucher);
                                  setOpenMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-blue-600"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                                Edit Voucher
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </DialogBody>
      <EditSplitVoucherModal
        open={editModalOpen}
        handleOpen={() => setEditModalOpen(!editModalOpen)}
        voucherData={selectedVoucher}
        token={token}
        onSuccess={() => fetchSplitVouchers()}
      />
    </Dialog>
  );
};

export default ViewSplitVouchersModal;
