import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const StudentFeeLedger = ({ vouchers }) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "Paid", "unpaid"
  const tableRef = useRef(null);

  // Helper function to extract semester number
  const getSemesterNumber = (monthOf) => {
    if (!monthOf) return 0;
    const match = monthOf.match(/Semester (\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // Filter out vouchers where isSplit is true
  const filteredVouchers = vouchers
    ? vouchers.filter((voucher) => !voucher.isSplit)
    : [];

  // Sort vouchers by semester number
  const sortedVouchers = filteredVouchers
    ? [...filteredVouchers].sort(
        (a, b) => getSemesterNumber(a.monthOf) - getSemesterNumber(b.monthOf)
      )
    : [];

  // Apply status filter
  const displayedVouchers =
    filterStatus === "all"
      ? sortedVouchers
      : sortedVouchers.filter((v) => v.status === filterStatus);

  // Function to handle card click - filter and scroll
  const handleCardClick = (status) => {
    setFilterStatus(status);
    // Scroll to table
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!vouchers || vouchers.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Student Dashboard Cards - Moved from DashCard.jsx */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mt-5">
        {/* Pending Vouchers */}
        <div
          className="transform hover:scale-105 transition-all cursor-pointer"
          // onClick={() => handleCardClick("unpaid")}
          onClick={() => navigate("/student-voucher")}
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="bg-red-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-red-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-red-100">
                unpaid
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-gray-700">
                {filteredVouchers.filter((v) => v.status === "unpaid").length ||
                  0}
              </h3>
              <p className="text-c-grays mt-1 text-sm">unpaid Vouchers</p>
            </div>
          </div>
        </div>

        {/* Paid Vouchers */}
        <div
          className="transform hover:scale-105 transition-all cursor-pointer"
          onClick={() => handleCardClick("Paid")}
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-green-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-green-100">
                Paid
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-gray-700">
                {filteredVouchers.filter((v) => v.status === "Paid").length ||
                  0}
              </h3>
              <p className="text-c-grays mt-1 text-sm">Paid Vouchers</p>
            </div>
          </div>
        </div>

        {/* Total Fee Amount */}
        <div
          className="transform hover:scale-105 transition-all cursor-pointer"
          onClick={() => handleCardClick("all")}
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-purple-600 text-sm font-medium px-2.5 py-0.5 rounded-lg bg-purple-100">
                Total
              </span>
            </div>
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-gray-700">
                Rs.{" "}
                {filteredVouchers.reduce(
                  (sum, v) => sum + Number(v.totalFee),
                  0
                ) || 0}
              </h3>
              <p className="text-c-grays mt-1 text-sm">Total Fee Amount</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8" ref={tableRef}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Fee Ledger {filterStatus !== "all" && `- ${filterStatus} Vouchers`}
          </h2>
          {filterStatus !== "all" && (
            <button
              onClick={() => setFilterStatus("all")}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Remove Filter
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Voucher No.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Semester
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Fee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Paid
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Remaining
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedVouchers.map((voucher) => {
                  const dueDate = new Date(voucher.dueDate);
                  const formattedDate = dueDate.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  // Extract semester information for highlighting
                  const semesterMatch =
                    voucher.monthOf.match(/(Semester \d+)(.+)?/);
                  const semesterNumber = semesterMatch ? semesterMatch[1] : "";
                  const semesterPeriod = semesterMatch ? semesterMatch[2] : "";

                  return (
                    <tr key={voucher._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {voucher.voucherNumber}
                        {voucher.parentVoucherNumber && (
                          <div className="text-xs text-gray-500 mt-1">
                            Parent: {voucher.parentVoucherNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="font-semibold text-indigo-700">
                          {semesterNumber} {semesterPeriod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        Rs. {voucher.totalFee.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        Rs. {voucher.paidAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                        Rs. {voucher.remainingAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {voucher.paymentPercentage &&
                        voucher.paymentPercentage < 100 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Partial ({voucher.paymentPercentage}%)
                          </span>
                        ) : voucher.isFullPayment ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Full (100%)
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            Full (100%)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            voucher.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : voucher.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {voucher.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="bg-gray-50 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Fee Amount</p>
                <p className="text-lg font-bold text-gray-800">
                  Rs.{" "}
                  {sortedVouchers
                    .reduce((sum, v) => sum + Number(v.totalFee), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-lg font-bold text-green-600">
                  Rs.{" "}
                  {sortedVouchers
                    .reduce((sum, v) => sum + Number(v.paidAmount), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Remaining</p>
                <p className="text-lg font-bold text-red-600">
                  Rs.{" "}
                  {sortedVouchers
                    .reduce((sum, v) => sum + Number(v.remainingAmount), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Payment Timeline
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {sortedVouchers.map((voucher, voucherIdx) => (
                <li key={voucher._id}>
                  <div className="relative pb-8">
                    {voucherIdx !== sortedVouchers.length - 1 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                          ${
                            voucher.status === "Paid"
                              ? "bg-green-500"
                              : voucher.status === "Processing"
                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                        >
                          {voucher.status === "Paid" ? (
                            <svg
                              className="h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : voucher.status === "Processing" ? (
                            <svg
                              className="h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {voucher.voucherNumber} -
                            <span className="font-medium text-indigo-700 ml-1">
                              {voucher.monthOf.replace(
                                /(Semester \d+)(.+)?/,
                                (_, sem, rest) => `${sem}${rest || ""}`
                              )}
                            </span>
                          </p>
                          <p className="mt-1 text-sm text-gray-900">
                            Due:{" "}
                            {new Date(voucher.dueDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                          {voucher.paymentPercentage < 100 && (
                            <p className="mt-1 text-xs text-indigo-600">
                              {voucher.paymentPercentage}% Payment
                            </p>
                          )}
                          {voucher.parentVoucherNumber && (
                            <p className="mt-1 text-xs text-gray-500">
                              Parent: {voucher.parentVoucherNumber}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            Rs. {voucher.totalFee.toLocaleString()}
                          </div>
                          <div
                            className={`mt-1 ${
                              voucher.status === "Paid"
                                ? "text-green-600"
                                : voucher.status === "Processing"
                                ? "text-blue-600"
                                : "text-red-600"
                            }`}
                          >
                            {voucher.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeLedger;
