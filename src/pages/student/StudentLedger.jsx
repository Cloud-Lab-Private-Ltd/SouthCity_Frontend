import { useState, useEffect } from "react";
import { Card, Typography, Button, Chip } from "@material-tailwind/react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faScissors,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { StudentLedgerGet } from "../../features/LedgerApiSlice";
import VoucherPDFGenerator from "./VoucherPDFGenerator";
import SplitVoucherModal from "./SplitVoucherModal";
import EditVoucherStatusModal from "./EditVoucherStatusModal";
import EditSplitVoucherModal from "./EditSplitVoucherModal";

const StudentLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [voucherToEdit, setVoucherToEdit] = useState(null);
  const [editSplitModalOpen, setEditSplitModalOpen] = useState(false);
  const [selectedSplitVoucher, setSelectedSplitVoucher] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Get the source of navigation from location state
  const navigationSource = location.state?.from || "student";

  // Function to handle back button click
  const handleBackClick = () => {
    if (navigationSource === "ledger") {
      navigate("/ledger");
    } else {
      navigate("/student");
    }
  };

  // Get students from Redux store
  const { students } = useSelector((state) => state.groupdata);
  const {
    studentLedger,
    loading: ledgerLoading,
    error,
  } = useSelector((state) => state.ledgerdata);

  // Find the student with matching ID from the Redux store
  const student = students?.students?.find((student) => student._id === id);

  useEffect(() => {
    // Fetch ledger data when component mounts
    if (id) {
      dispatch(StudentLedgerGet(id));
    }
  }, [dispatch, id]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle voucher split
  const handleSplitVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setSplitModalOpen(true);
  };

  // Handle voucher edit
  const handleEditVoucher = (voucher) => {
    setVoucherToEdit(voucher);
    setEditModalOpen(true);
  };

  // Handle split voucher edit
  const handleEditSplitVoucher = (voucher) => {
    setSelectedSplitVoucher(voucher);
    setEditSplitModalOpen(true);
  };

  if (!students?.students?.length || ledgerLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-c-purple"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <div className="text-xl text-red-500 mb-4">Student not found</div>
        <Button className="bg-c-purple" onClick={() => navigate("/student")}>
          Back to Students List
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh]">
        <div className="text-xl text-red-500 mb-4">
          Error loading ledger data: {error}
        </div>
        <Button className="bg-c-purple" onClick={() => navigate("/student")}>
          Back to Students List
        </Button>
      </div>
    );
  }

  // Get the ledger data
  const ledgerData = studentLedger?.ledgers?.[0] || null;
  const allVouchers = ledgerData?.vouchers || [];

  // Filter function to check if a date is within the selected range
  const isDateInRange = (dateString) => {
    if (!startDate && !endDate) return true;

    const date = new Date(dateString);

    if (startDate && endDate) {
      // Set end date to end of day for inclusive comparison
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      return date >= startDate && date <= endOfDay;
    } else if (startDate) {
      return date >= startDate;
    } else if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      return date <= endOfDay;
    }

    return true;
  };

  // Apply date filtering to vouchers
  const vouchers = allVouchers.filter((voucher) => {
    // Check if the voucher's created date or due date is in range
    const createdDateInRange = isDateInRange(voucher.createdAt);
    const dueDateInRange = isDateInRange(voucher.dueDate);

    // Return true if either date is in range
    return createdDateInRange || dueDateInRange;
  });

  // Calculate totals
  const totalAmount = ledgerData?.totalAmount || 0;
  const totalPaid = ledgerData?.paidAmount || 0;
  const totalBalance = ledgerData?.remainingAmount || 0;

  return (
    <div className="bg-[#F5F5F5] p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <button
            onClick={handleBackClick}
            className="flex items-center text-c-purple mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to {navigationSource === "ledger" ? "Ledger" : "Students"}
          </button>
          <h2 className="text-[1.5rem] font-semibold text-c-grays">
            STUDENT LEDGER
          </h2>
        </div>
      </div>

      <Card className="overflow-hidden bg-white mb-6">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-semibold text-c-grays mb-4">
            Student Information
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image Section */}
            <div className="flex justify-center md:justify-start">
              {student.profileImage ? (
                <img
                  src={student.profileImage}
                  alt={`${student.fullName}'s profile`}
                  className="h-24 w-24 rounded-full object-cover border-2 border-c-purple"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-c-purple">
                  <span className="text-2xl font-bold text-gray-500">
                    {student.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Student Details Section */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{student.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration ID</p>
                  <p className="font-medium">{student.registrationId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium">{student.course[0]?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Batch</p>
                  <p className="font-medium">{student.batch?.batchName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Father/Guardian Name</p>
                  <p className="font-medium">{student.fatherName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="font-medium">
                    {student.phoneNumber || student.mobileNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Chip
                    size="sm"
                    variant="ghost"
                    value={
                      student.status === "active" ? "Active" : student.status
                    }
                    color={student.status === "active" ? "green" : "amber"}
                    className="text-xs font-medium mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Date Filter Section */}
      <Card className="overflow-hidden bg-white mb-6">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-semibold text-c-grays mb-4">
            Filter Vouchers by Date
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created From
              </label>
              <input
                type="date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setStartDate(e.target.value ? new Date(e.target.value) : null)
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created To
              </label>
              <input
                type="date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setEndDate(e.target.value ? new Date(e.target.value) : null)
                }
                min={startDate ? startDate.toISOString().split("T")[0] : ""}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button
                className="bg-blue-500 flex items-center gap-2 px-4 py-2.5 shadow-md"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reset Dates
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden bg-white mb-6">
        <div className="p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3 className="text-lg font-semibold text-c-grays">
              Financial Summary
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex flex-col items-center">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-lg font-bold">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex flex-col items-center">
                <span className="text-sm font-medium">Total Paid</span>
                <span className="text-lg font-bold">
                  Rs. {totalPaid.toLocaleString()}
                </span>
              </div>
              <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg flex flex-col items-center">
                <span className="text-sm font-medium">Balance</span>
                <span className="text-lg font-bold">
                  Rs. {totalBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden bg-white">
        <div className="p-4 md:p-6">
          <h3 className="text-lg font-semibold text-c-grays mb-4">
            Voucher History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Voucher No
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Semester
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Created Date
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Due Date
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Description
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Amount
                    </Typography>
                  </th>

                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Paid
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Balance
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
                {vouchers.map((voucher) => (
                  <>
                    <tr
                      key={voucher._id}
                      className={`hover:bg-gray-50 ${
                        voucher.isSplit ? "bg-gray-50" : ""
                      } ${
                        voucher.paymentSlip
                          ? "bg-green-50 border-l-4 border-green-400"
                          : ""
                      }`}
                    >
                      <td className="p-4 border-b border-gray-100">
                        <div className="flex items-center">
                          <Typography className="text-c-grays font-medium">
                            {voucher.voucherNumber}
                            {voucher.isSplit && (
                              <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                                Split
                              </span>
                            )}
                            {voucher.paymentSlip && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Payment Slip
                              </span>
                            )}
                          </Typography>
                        </div>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {voucher.monthOf}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {formatDate(voucher.createdAt)}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {formatDate(voucher.dueDate)}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {voucher.inWordAmount}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays font-medium">
                          Rs. {voucher.totalFee.toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays font-medium">
                          Rs. {voucher.paidAmount.toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays font-medium">
                          Rs. {voucher.remainingAmount.toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={
                            voucher.status
                              ? voucher.status.charAt(0).toUpperCase() +
                                voucher.status.slice(1).toLowerCase()
                              : "Unpaid"
                          }
                          color={
                            voucher.status?.toLowerCase() === "paid"
                              ? "green"
                              : voucher.status?.toLowerCase() === "partial"
                              ? "amber"
                              : voucher.status?.toLowerCase() === "processing"
                              ? "blue"
                              : "red"
                          }
                          className="text-xs font-medium"
                        />
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          {/* Only show PDF button for non-split vouchers */}
                          {!voucher.isSplit && (
                            <VoucherPDFGenerator
                              voucherData={voucher}
                              formatDate={formatDate}
                              studentData={student}
                            />
                          )}

                          {/* View Payment Slip button - only show if payment slip exists */}
                          {voucher.paymentSlip && (
                            <button
                              className="p-1 text-green-500 hover:bg-green-50 rounded"
                              title="View Payment Slip"
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
                            </button>
                          )}

                          {/* Edit button - show for all vouchers regardless of status */}
                          {!voucher.isSplit && (
                            <button
                              className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                              title="Edit Voucher Status"
                              onClick={() => handleEditVoucher(voucher)}
                            >
                              <FontAwesomeIcon icon={faPencilAlt} />
                            </button>
                          )}

                          {/* Split button - only show for unpaid vouchers with remaining amount and not in processing status */}
                          {voucher.remainingAmount > 0 &&
                            !voucher.isSplit &&
                            voucher.status?.toLowerCase() !== "processing" && (
                              <button
                                className="p-1 text-orange-500 hover:bg-orange-50 rounded"
                                title="Split Voucher"
                                onClick={() => handleSplitVoucher(voucher)}
                              >
                                <FontAwesomeIcon icon={faScissors} />
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                    {/* Always show split vouchers if parent voucher is split */}
                    {voucher.isSplit &&
                      voucher.splitVouchers &&
                      voucher.splitVouchers.map((splitVoucher) => (
                        <tr
                          key={splitVoucher._id}
                          className={`bg-gray-100 ${
                            splitVoucher.paymentSlip
                              ? "border-l-4 border-green-400"
                              : ""
                          }`}
                        >
                          <td className="p-4 border-b border-gray-100 pl-10">
                            <Typography className="text-c-grays font-medium flex items-center">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                                {splitVoucher.paymentPercentage}%
                              </span>
                              {splitVoucher.voucherNumber}
                              {splitVoucher.paymentSlip && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                  Payment Slip
                                </span>
                              )}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <Typography className="text-c-grays">
                              {splitVoucher.monthOf}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <Typography className="text-c-grays">
                              {formatDate(splitVoucher.createdAt)}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <Typography className="text-c-grays">
                              {formatDate(splitVoucher.dueDate)}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <Typography className="text-c-grays">
                              {splitVoucher.inWordAmount}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <Typography className="text-c-grays font-medium">
                              Rs. {splitVoucher.totalFee.toLocaleString()}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <Typography className="text-c-grays font-medium">
                              Rs. {splitVoucher.paidAmount.toLocaleString()}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <Typography className="text-c-grays font-medium">
                              Rs.{" "}
                              {splitVoucher.remainingAmount.toLocaleString()}
                            </Typography>
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={
                                splitVoucher.status
                                  ? splitVoucher.status
                                      .charAt(0)
                                      .toUpperCase() +
                                    splitVoucher.status.slice(1).toLowerCase()
                                  : "Unpaid"
                              }
                              color={
                                splitVoucher.status?.toLowerCase() === "paid"
                                  ? "green"
                                  : splitVoucher.status?.toLowerCase() ===
                                    "partial"
                                  ? "amber"
                                  : splitVoucher.status?.toLowerCase() ===
                                    "processing"
                                  ? "blue"
                                  : "red"
                              }
                              className="text-xs font-medium"
                            />
                          </td>
                          <td className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <VoucherPDFGenerator
                                voucherData={splitVoucher}
                                formatDate={formatDate}
                                studentData={student}
                              />

                              {/* View Payment Slip button - only show if payment slip exists */}
                              {splitVoucher.paymentSlip && (
                                <button
                                  className="p-1 text-green-500 hover:bg-green-50 rounded"
                                  title="View Payment Slip"
                                  onClick={() =>
                                    window.open(
                                      splitVoucher.paymentSlip,
                                      "_blank"
                                    )
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
                                </button>
                              )}

                              {/* Edit button for split vouchers - show for all split vouchers */}
                              <button
                                className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                                title="Edit Voucher Status"
                                onClick={() => handleEditVoucher(splitVoucher)}
                              >
                                <FontAwesomeIcon icon={faPencilAlt} />
                              </button>

                              {/* Edit Split button - only show for split vouchers */}
                              {splitVoucher.status?.toLowerCase() !== "paid" &&
                                splitVoucher.status?.toLowerCase() !==
                                  "processing" &&
                                // Add this condition to check if this is Split 2 and Split 1 is paid
                                !(
                                  splitVoucher.monthOf?.includes("Split 2") &&
                                  voucher.splitVouchers?.some(
                                    (sv) =>
                                      sv.monthOf?.includes("Split 1") &&
                                      sv.status?.toLowerCase() === "paid"
                                  )
                                ) && (
                                  <button
                                    className="p-1 text-purple-500 hover:bg-purple-50 rounded"
                                    title="Edit Split Percentage"
                                    onClick={() =>
                                      handleEditSplitVoucher(splitVoucher)
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
                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                      />
                                    </svg>
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Use the EditSplitVoucherModal component */}
      <EditSplitVoucherModal
        open={editSplitModalOpen}
        handleOpen={() => setEditSplitModalOpen(false)}
        voucherData={selectedSplitVoucher}
      />

      {/* Use the SplitVoucherModal component */}
      <SplitVoucherModal
        open={splitModalOpen}
        handleClose={() => setSplitModalOpen(false)}
        voucher={selectedVoucher}
      />

      {/* Use the EditVoucherStatusModal component */}
      <EditVoucherStatusModal
        open={editModalOpen}
        handleOpen={() => setEditModalOpen(false)}
        voucherData={voucherToEdit}
      />
    </div>
  );
};

export default StudentLedger;
