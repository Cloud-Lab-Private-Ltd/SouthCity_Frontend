import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Card, Typography, Button } from "@material-tailwind/react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import jsPDF from "jspdf";
import { VoucherGet } from "../../features/ProfileSlice";
import Swal from "sweetalert2";
import { BASE_URL } from "../../config/apiconfig";

const StudentVoucherBody = () => {
  const { vouchers, voucherLoading } = useSelector(
    (state) => state.profiledata
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const dispatch = useDispatch();

  const filteredVouchers = vouchers?.filter(
    (voucher) => !voucher.splitVouchers?.length
  );

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
          {
            align: "center",
          }
        );
        doc.setFontSize(5);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Pvt. Ltd. Clifton, Karachi.",
          xOffset + voucherWidth / 2,
          16 + yOffset,
          {
            align: "center",
          }
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
          {
            align: "center",
          }
        );
        doc.text(
          "Branch Code: 1212",
          xOffset + voucherWidth / 2,
          32 + yOffset,
          {
            align: "center",
          }
        );
        doc.text(
          "Account #: 2509114461",
          xOffset + voucherWidth / 2,
          36 + yOffset,
          {
            align: "center",
          }
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
          voucherData.student?.fullName || "",
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
          voucherData.student?.fatherName || "",
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
        doc.text(voucherData.student?.nic || "", xOffset + 22, 51 + yOffset);

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
          voucherData.student?.registrationId || "",
          xOffset + 22,
          56 + yOffset
        );

        // Fee Details Section
        doc.setFillColor(200, 200, 200);
        doc.rect(xOffset + 5, 62 + yOffset, voucherWidth - 10, 4, "F");
        doc.setFont("helvetica", "bold");
        doc.text("Detail of Fee", xOffset + 7, 65 + yOffset);
        doc.text("Amount", xOffset + voucherWidth - 25, 65 + yOffset);

        const feeDetails = [
          { label: "Admission Fee", value: voucherData?.admissionFee },
          { label: "Semester Fee", value: voucherData?.semesterFee },
          { label: "Security Fee", value: voucherData?.securityFee },
          { label: "Library Fee", value: voucherData?.libraryFee },
          { label: "Total", value: voucherData?.paidAmount },
        ];

        let yPos = 71;
        feeDetails.forEach((fee) => {
          doc.setFont("helvetica", "normal");
          doc.text(fee.label, xOffset + 7, yPos + yOffset);
          doc.text(
            `Rs. ${fee.value}`,
            xOffset + voucherWidth - 25,
            yPos + yOffset
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

        // Border
        doc.rect(xOffset + 2, yOffset + 2, voucherWidth - 4, voucherHeight - 4);
      }
    }

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  const handleUploadSlip = (voucherId) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,.pdf";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setUploadLoading(true);
        const formData = new FormData();
        formData.append("paymentSlip", file);
        const token = localStorage.getItem("token");

        axios
          .put(
            `${BASE_URL}/api/v1/sch/vouchers/update/${voucherId}`,
            formData,
            {
              headers: {
                "x-access-token": token,
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Payment slip uploaded successfully!",
              confirmButtonColor: "#5570F1",
            });
            dispatch(VoucherGet());
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response?.data?.message || "Failed to upload slip",
              confirmButtonColor: "#5570F1",
            });
          })
          .finally(() => {
            setUploadLoading(false);
          });
      }
    };

    input.click();
  };

  console.log(vouchers);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Fee Vouchers</h1>
        <p className="text-gray-600">View and manage your fee vouchers</p>
      </div>

      {voucherLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.isArray(filteredVouchers) && filteredVouchers?.map((voucher) => (
            <Card
              key={voucher._id}
              className="p-6 hover:shadow-lg transition-shadow border border-gray-200"
            >
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography className="text-xl font-bold text-blue-800">
                    {voucher.voucherNumber}
                  </Typography>
                  <Typography className="text-sm text-gray-600 mt-1">
                    Due Date: {new Date(voucher.dueDate).toLocaleDateString()}
                  </Typography>
                  <Typography className="text-sm text-gray-600">
                    Month:{" "}
                    {new Date(voucher.monthOf).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </Typography>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    voucher.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {voucher.status}
                </span>
              </div>

              {/* Course Details Section */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <Typography className="text-md font-bold text-gray-700 mb-2">
                  Course Details
                </Typography>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold">Course Name:</span>
                    <p className="text-gray-600">
                      {voucher.course?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span>
                    <p className="text-gray-600">
                      {voucher.course?.duration || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Degree Type:</span>
                    <p className="text-gray-600">
                      {voucher.course?.degreeType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Semesters:</span>
                    <p className="text-gray-600">
                      {voucher.course?.noOfSemesters || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fee Details Section */}
              <div className="bg-white p-3 rounded-lg border border-gray-100 mb-4">
                <Typography className="text-md font-bold text-gray-700 mb-2">
                  Fee Breakdown
                </Typography>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm py-1 border-b">
                    <span className="text-gray-600">Admission Fee:</span>
                    <span className="font-semibold">
                      Rs. {voucher?.admissionFee}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b">
                    <span className="text-gray-600">Semester Fee:</span>
                    <span className="font-semibold">
                      Rs. {voucher?.semesterFee}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b">
                    <span className="text-gray-600">Security Fee:</span>
                    <span className="font-semibold">
                      Rs. {voucher?.securityFee}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b">
                    <span className="text-gray-600">Library Fee:</span>
                    <span className="font-semibold">
                      Rs. {voucher?.libraryFee}
                    </span>
                  </div>
                  {voucher?.paymentPercentage ? (
                    <>
                      <div className="flex justify-between text-sm py-1 border-b">
                        <span className="text-gray-600">
                          Payment Percentage:
                        </span>
                        <span className="font-semibold">
                          {voucher?.paymentPercentage}%
                        </span>
                      </div>
                    </>
                  ) : (
                    ""
                  )}

                  <div className="flex justify-between font-bold pt-2 text-blue-800">
                    <span>Total Amount:</span>
                    <span>Rs. {voucher?.paidAmount}</span>
                  </div>
                </div>
              </div>

              {/* Amount in Words */}
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <Typography className="text-sm text-gray-700">
                  <span className="font-semibold">Amount in Words: </span>
                  {voucher.inWordAmount}
                </Typography>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                  onClick={() => generateVoucherPDF(voucher)}
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  View Slip
                </Button>

                <Button
                  size="sm"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
                  onClick={() => handleUploadSlip(voucher._id)}
                  disabled={voucher.status === "Paid" || uploadLoading}
                >
                  {uploadLoading ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Upload Slip
                    </>
                  )}
                </Button>

                {voucher.paymentSlip && (
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
                    onClick={() => window.open(voucher.paymentSlip, "_blank")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Payment
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!voucherLoading && (!vouchers || vouchers?.length === 0) && (
        <Card className="p-8 text-center">
          <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Typography className="text-xl font-medium text-gray-700">
            No Vouchers Available
          </Typography>
          <Typography className="text-gray-500">
            There are currently no fee vouchers issued for you.
          </Typography>
        </Card>
      )}
    </div>
  );
};

export default StudentVoucherBody;
