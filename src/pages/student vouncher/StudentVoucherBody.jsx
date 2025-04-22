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
    (voucher) => !voucher.splitVouchers?.length && voucher.status !== "Paid"
  );

  // Helper function to correctly calculate fees for split vouchers
  const calculateSplitFees = (voucher) => {
    // If it's not a split voucher or doesn't have a payment percentage, return original values
    if (!voucher.parentVoucherNumber || !voucher.paymentPercentage) {
      return {
        admissionFee: parseInt(voucher.admissionFee) || 0,
        semesterFee: parseInt(voucher.semesterFee) || 0,
        securityFee: parseInt(voucher.securityFee) || 0,
        libraryFee: parseInt(voucher.libraryFee) || 0,
      };
    }

    const percentage = voucher.paymentPercentage / 100;

    // For split vouchers, admission fee is already correctly split, but other fees need to be adjusted
    return {
      admissionFee: parseInt(voucher.admissionFee) || 0, // Keep admission fee as is
      semesterFee: Math.round(parseInt(voucher.semesterFee) * percentage) || 0,
      securityFee: Math.round(parseInt(voucher.securityFee) * percentage) || 0,
      libraryFee: Math.round(parseInt(voucher.libraryFee) * percentage) || 0,
    };
  };

  // Format date function for PDF
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
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

    // Improved spacing constants
    const margin = 5;
    const lineHeight = 5;
    const fieldLabelWidth = 35; // Increased width for labels
    const headerFontSize = 7;
    const normalFontSize = 6;
    const smallFontSize = 5;

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const xOffset = col * voucherWidth;
        const yOffset = row * voucherHeight;
        const copyIndex = row * 2 + col;

        // Border around voucher (draw first so it's behind everything)
        doc.setDrawColor(0);
        doc.setLineWidth(0.3);
        doc.rect(
          xOffset + margin,
          yOffset + margin,
          voucherWidth - 2 * margin,
          voucherHeight - 2 * margin
        );

        // Header Section
        let currentY = yOffset + 8;

        doc.setFontSize(headerFontSize);
        doc.setFont("helvetica", "bold");

        // Voucher number and copy type
        doc.text(
          `VNO: ${voucherData.voucherNumber}`,
          xOffset + margin + 5,
          currentY
        );
        doc.text(
          copyTypes[copyIndex],
          xOffset + voucherWidth - margin - 5,
          currentY,
          { align: "right" }
        );

        currentY += lineHeight;

        // Institute name
        doc.text(
          "South City Healthcare Education Hub",
          xOffset + voucherWidth / 2,
          currentY,
          { align: "center" }
        );

        currentY += lineHeight - 1;

        doc.setFontSize(smallFontSize);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Pvt. Ltd. Clifton, Karachi.",
          xOffset + voucherWidth / 2,
          currentY,
          { align: "center" }
        );

        currentY += lineHeight - 1;

        doc.setFont("helvetica", "bold");
        doc.text("SCPTR", xOffset + voucherWidth / 2, currentY, {
          align: "center",
        });

        currentY += lineHeight - 1;

        doc.setFont("helvetica", "normal");
        doc.text("United Bank Ltd", xOffset + voucherWidth / 2, currentY, {
          align: "center",
        });

        currentY += lineHeight - 1;

        doc.text(
          "Branch Name: Boat Basin",
          xOffset + voucherWidth / 2,
          currentY,
          { align: "center" }
        );

        currentY += lineHeight - 1;

        doc.text("Branch Code: 1212", xOffset + voucherWidth / 2, currentY, {
          align: "center",
        });

        currentY += lineHeight - 1;

        doc.text(
          "Account #: 2509114461",
          xOffset + voucherWidth / 2,
          currentY,
          { align: "center" }
        );

        currentY += lineHeight + 1;

        // Student Information Section
        doc.setFontSize(normalFontSize);

        // Function to add a field with label and value
        const addField = (label, value) => {
          doc.setFont("helvetica", "bold");
          doc.text(label, xOffset + margin + 2, currentY);

          // Draw line for the value
          doc.setLineWidth(0.1);
          doc.line(
            xOffset + margin + fieldLabelWidth,
            currentY,
            xOffset + voucherWidth - margin - 2,
            currentY
          );

          // Add value text 1mm above the line
          doc.setFont("helvetica", "normal");
          doc.text(
            value || "",
            xOffset + margin + fieldLabelWidth + 2,
            currentY - 1
          );

          currentY += lineHeight;
        };

        // Add all student fields
        addField("Full Name", voucherData.student?.fullName || "");
        addField("Father/Guardian Name", voucherData.student?.fatherName || "");
        addField("CNIC", voucherData.student?.nic || "");
        addField("Application No", voucherData.student?.registrationId || "");
        addField(
          "Enrollment Number",
          voucherData.student?.enrollementNumber || ""
        );
        addField("Semester", voucherData.monthOf || "");

        // Add payment percentage if it exists and is not 100%
        if (
          voucherData.paymentPercentage &&
          voucherData.paymentPercentage !== 100
        ) {
          addField("Payment Percentage", `${voucherData.paymentPercentage}%`);

          // Add parent voucher number if available
          if (voucherData.parentVoucherNumber) {
            addField("Parent Voucher", voucherData.parentVoucherNumber);
          }
        }

        addField("Created Date", formatDate(voucherData.createdAt) || "");
        addField("Due Date", formatDate(voucherData.dueDate) || "");

        // Fee Breakdown Section with full width background
        currentY += 1;
        doc.setFillColor(220, 220, 220);
        doc.rect(
          xOffset + margin + 2,
          currentY - 3,
          voucherWidth - 2 * margin - 4,
          5,
          "F"
        );

        doc.setFont("helvetica", "bold");
        doc.text("Detail of Fee", xOffset + margin + 5, currentY);
        doc.text("Amount", xOffset + voucherWidth - margin - 20, currentY);

        currentY += lineHeight + 1;

        // Calculate the correct fees based on split percentage
        const fees = calculateSplitFees(voucherData);

        // Create arrays to hold fee details and amounts
        const feeDetails = [];
        const feeAmounts = [];

        // Only add fees that are greater than 0 in the original voucher
        // For semester fee, we'll always show it for semester 2+ vouchers
        if (fees.admissionFee > 0) {
          feeDetails.push("Admission Fee");
          feeAmounts.push(fees.admissionFee);
        }

        // For semester fee, check if the original amount is > 0, not the calculated amount
        // This ensures semester fee is shown even when it's split
        if (parseInt(voucherData.semesterFee) > 0) {
          feeDetails.push("Semester Fee");
          feeAmounts.push(fees.semesterFee);
        }

        if (fees.securityFee > 0) {
          feeDetails.push("Security Deposit");
          feeAmounts.push(fees.securityFee);
        }

        if (fees.libraryFee > 0) {
          feeDetails.push("Library Charges");
          feeAmounts.push(fees.libraryFee);
        }

        // Calculate total
        const calculatedTotal =
          fees.admissionFee +
          fees.semesterFee +
          fees.securityFee +
          fees.libraryFee;

        // Add total
        feeDetails.push("Total");
        feeAmounts.push(calculatedTotal);

        // Add fee details
        feeDetails.forEach((item, index) => {
          doc.setFont(
            "helvetica",
            index === feeDetails.length - 1 ? "bold" : "normal"
          );
          doc.text(item, xOffset + margin + 5, currentY);

          // Align amounts to the right
          doc.text(
            `Rs. ${feeAmounts[index]}`,
            xOffset + voucherWidth - margin - 20,
            currentY
          );

          currentY += lineHeight;
        });

        // Amount in Words
        currentY += 2;
        doc.setFont("helvetica", "bold");
        doc.text("In word:", xOffset + margin + 2, currentY);

        // Draw line for the value
        doc.line(
          xOffset + margin + fieldLabelWidth,
          currentY,
          xOffset + voucherWidth - margin - 2,
          currentY
        );

        doc.setFont("helvetica", "normal");
        doc.text(
          voucherData.inWordAmount || "",
          xOffset + margin + fieldLabelWidth + 2,
          currentY - 1
        );

        currentY += lineHeight + 2;

        // Footer Section
        doc.text("Applicant Signature", xOffset + margin + 2, currentY);
        doc.line(
          xOffset + margin + 30,
          currentY,
          xOffset + voucherWidth - margin - 2,
          currentY
        );

        currentY += lineHeight + 2;

        doc.text(
          "Receiving Branch Stamp and Signature",
          xOffset + margin + 2,
          currentY
        );
        doc.line(
          xOffset + margin + 55,
          currentY,
          xOffset + voucherWidth - margin - 2,
          currentY
        );
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

  // Helper function to extract semester number from monthOf string
  const getSemesterNumber = (monthOf) => {
    if (!monthOf) return 0;
    const match = monthOf.match(/Semester (\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Helper function to extract split number from monthOf string
  const getSplitNumber = (monthOf) => {
    if (!monthOf) return 0;
    const splitMatch = monthOf.match(/Split (\d+)/);
    return splitMatch ? parseInt(splitMatch[1]) : 0;
  };

  // Sort vouchers by semester number and then by split number
  const sortedVouchers = filteredVouchers
    ? [...filteredVouchers].sort((a, b) => {
        const semesterA = getSemesterNumber(a.monthOf);
        const semesterB = getSemesterNumber(b.monthOf);

        // If different semesters, sort by semester
        if (semesterA !== semesterB) {
          return semesterA - semesterB;
        }

        // If same semester, sort by split number (Split 1 before Split 2)
        const splitA = getSplitNumber(a.monthOf);
        const splitB = getSplitNumber(b.monthOf);
        return splitA - splitB;
      })
    : [];

  // Function to check if a voucher's upload button should be enabled
  const isVoucherUploadEnabled = (currentVoucher) => {
    if (!sortedVouchers || sortedVouchers.length === 0) return true;

    const currentSemesterNum = getSemesterNumber(currentVoucher.monthOf);
    const currentSplitNum = getSplitNumber(currentVoucher.monthOf);

    // Always enable first semester's first split
    if (currentSemesterNum === 1 && currentSplitNum === 1) return true;

    // For other splits in first semester
    if (currentSemesterNum === 1 && currentSplitNum > 1) {
      // Check if previous splits are paid
      for (const voucher of sortedVouchers) {
        const semesterNum = getSemesterNumber(voucher.monthOf);
        const splitNum = getSplitNumber(voucher.monthOf);

        // If this is a previous split in the same semester and it's not paid, disable
        if (
          semesterNum === currentSemesterNum &&
          splitNum < currentSplitNum &&
          voucher.status !== "Paid"
        ) {
          return false;
        }
      }
      return true;
    }

    // For other semesters, check both previous semesters and previous splits
    // First check if all previous semesters are paid
    if (!isPreviousSemestersPaid(currentVoucher)) return false;

    // Then check if previous splits in the current semester are paid
    for (const voucher of sortedVouchers) {
      const semesterNum = getSemesterNumber(voucher.monthOf);
      const splitNum = getSplitNumber(voucher.monthOf);

      // If this is a previous split in the same semester and it's not paid, disable
      if (
        semesterNum === currentSemesterNum &&
        splitNum < currentSplitNum &&
        voucher.status !== "Paid"
      ) {
        return false;
      }
    }

    return true;
  };

  // Function to check if previous semester vouchers are paid
  const isPreviousSemestersPaid = (currentVoucher) => {
    if (!sortedVouchers || sortedVouchers.length === 0) return true;

    const currentSemesterNum = getSemesterNumber(currentVoucher.monthOf);

    // If it's the first semester, always allow payment
    if (currentSemesterNum === 1) return true;

    // Check if all previous semester vouchers are paid
    for (const voucher of sortedVouchers) {
      const semesterNum = getSemesterNumber(voucher.monthOf);

      // If this is a previous semester and it's not paid, return false
      if (semesterNum < currentSemesterNum && voucher.status !== "Paid") {
        return false;
      }
    }

    return true;
  };

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
          {Array.isArray(sortedVouchers) &&
            sortedVouchers.map((voucher) => {
              // Calculate the correct fees based on split percentage
              const fees = calculateSplitFees(voucher);
              const calculatedTotalFee =
                fees.admissionFee +
                fees.semesterFee +
                fees.securityFee +
                fees.libraryFee;

              return (
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
                      <div className="mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-md inline-block">
                        {voucher.monthOf}
                      </div>

                      {/* Show payment percentage if it exists and is not 100% */}
                      {voucher.paymentPercentage &&
                        voucher.paymentPercentage !== 100 && (
                          <div className="mt-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs inline-block">
                            {voucher.paymentPercentage}% Payment
                          </div>
                        )}

                      {/* Show parent voucher number if it exists */}
                      {voucher.parentVoucherNumber && (
                        <div className="mt-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs inline-block">
                          Split from: {voucher.parentVoucherNumber}
                        </div>
                      )}
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          voucher.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : voucher.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {voucher.status}
                      </span>
                    </div>
                  </div>

                  {/* Fee Details */}
                  <div className="mb-4">
                    {/* Show detailed fee breakdown */}
                    {fees.admissionFee > 0 && (
                      <div className="flex justify-between mb-2">
                        <Typography className="text-gray-600">
                          Admission Fee:
                        </Typography>
                        <Typography className="font-medium">
                          Rs. {fees.admissionFee.toLocaleString()}
                        </Typography>
                      </div>
                    )}

                    {fees.semesterFee > 0 && (
                      <div className="flex justify-between mb-2">
                        <Typography className="text-gray-600">
                          Semester Fee:
                        </Typography>
                        <Typography className="font-medium">
                          Rs. {fees.semesterFee.toLocaleString()}
                        </Typography>
                      </div>
                    )}

                    {fees.securityFee > 0 && (
                      <div className="flex justify-between mb-2">
                        <Typography className="text-gray-600">
                          Security Fee:
                        </Typography>
                        <Typography className="font-medium">
                          Rs. {fees.securityFee.toLocaleString()}
                        </Typography>
                      </div>
                    )}

                    {fees.libraryFee > 0 && (
                      <div className="flex justify-between mb-2">
                        <Typography className="text-gray-600">
                          Library Fee:
                        </Typography>
                        <Typography className="font-medium">
                          Rs. {fees.libraryFee.toLocaleString()}
                        </Typography>
                      </div>
                    )}

                    <div className="flex justify-between mb-2 border-t pt-2 mt-2">
                      <Typography className="text-gray-600 font-medium">
                        Total Fee:
                      </Typography>
                      <Typography className="font-medium">
                        Rs. {calculatedTotalFee.toLocaleString()}
                      </Typography>
                    </div>

                    <div className="flex justify-between mb-2">
                      <Typography className="text-gray-600">
                        Paid Amount:
                      </Typography>
                      <Typography className="font-medium">
                        Rs. {voucher.paidAmount.toLocaleString()}
                      </Typography>
                    </div>

                    <div className="flex justify-between mb-2">
                      <Typography className="text-gray-600">
                        Remaining:
                      </Typography>
                      <Typography className="font-medium">
                        Rs.{" "}
                        {(
                          calculatedTotalFee - voucher.paidAmount
                        ).toLocaleString()}
                      </Typography>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <Typography className="text-gray-600 text-sm">
                        Due Date:
                      </Typography>
                      <Typography
                        className={`font-medium text-sm ${
                          new Date(voucher.dueDate) < new Date() &&
                          voucher.status !== "Paid"
                            ? "text-red-600"
                            : "text-gray-800"
                        }`}
                      >
                        {new Date(voucher.dueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </div>
                  </div>

                  {/* Payment Slip Section - Add this new section */}
                  {voucher.paymentSlip && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <Typography className="text-green-600 text-sm font-medium">
                          Payment Slip Uploaded
                        </Typography>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 py-1 px-3 flex items-center gap-1"
                          onClick={() =>
                            window.open(voucher.paymentSlip, "_blank")
                          }
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
                              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          View Slip
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => generateVoucherPDF(voucher)}
                      fullWidth
                    >
                      <DocumentTextIcon className="h-4 w-4" />
                      Download
                    </Button>

                    {voucher.status !== "Paid" && (
                      <Button
                        className={`flex items-center gap-2 ${
                          isVoucherUploadEnabled(voucher)
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          if (isVoucherUploadEnabled(voucher)) {
                            handleUploadSlip(voucher._id);
                          } else {
                            Swal.fire({
                              icon: "warning",
                              title: "Payment Order Required",
                              text: "You must pay previous fees before paying this voucher.",
                              confirmButtonColor: "#5570F1",
                            });
                          }
                        }}
                        fullWidth
                        disabled={
                          !isVoucherUploadEnabled(voucher) || uploadLoading
                        }
                      >
                        {uploadLoading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <>
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
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                              />
                            </svg>
                            Upload Slip
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          {Array.isArray(sortedVouchers) && sortedVouchers.length === 0 && (
            <div className="col-span-3 text-center py-12">
              <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <DocumentTextIcon className="h-12 w-12 text-blue-500" />
              </div>
              <Typography className="text-xl font-medium text-gray-800 mb-2">
                No Vouchers Found
              </Typography>
              <Typography className="text-gray-600">
                You don't have any fee vouchers at the moment.
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentVoucherBody;
