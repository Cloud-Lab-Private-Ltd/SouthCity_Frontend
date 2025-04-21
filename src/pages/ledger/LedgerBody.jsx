import { useState } from "react";
import { Card, Typography, Button, Chip } from "@material-tailwind/react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LedgerBody = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const navigate = useNavigate();

  const { allLedgers, allLedgersLoading, allLedgersError } = useSelector(
    (state) => state.ledgerdata
  );

  const { courses } = useSelector((state) => state.groupdata);

  // // Status options for filter
  // const statusOptions = [
  //   { value: "Paid", label: "Paid" },
  //   { value: "Partial", label: "Partial" },
  //   { value: "Pending", label: "Pending" },
  // ];

  // Course options for filter
  const courseOptions =
    courses?.courses?.map((course) => ({
      value: course._id,
      label: course.name,
    })) || [];

  // Filter the data based on search term, course, status, and date range
  const filteredData =
    allLedgers?.ledgers?.filter((item) => {
      const studentName = item.student?.fullName || "";
      const studentId = item.student?.registrationId || "";
      const courseName = item.course?.name || "";

      const matchesSearch =
        studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourse = selectedCourse
        ? item.course?._id === selectedCourse.value
        : true;

      const matchesStatus = selectedStatus
        ? (selectedStatus.value === "Paid" && item.remainingAmount === 0) ||
          (selectedStatus.value === "Partial" &&
            item.paidAmount > 0 &&
            item.remainingAmount > 0) ||
          (selectedStatus.value === "Pending" && item.paidAmount === 0)
        : true;

      let matchesDateRange = true;
      if (startDate && endDate) {
        const itemDate = new Date(item.createdAt);
        matchesDateRange = itemDate >= startDate && itemDate <= endDate;
      }

      return (
        matchesSearch && matchesCourse && matchesStatus && matchesDateRange
      );
    }) || [];

  // Pagination
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calculate totals
  const totalAmount = filteredData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );
  const totalPaid = filteredData.reduce(
    (sum, item) => sum + item.paidAmount,
    0
  );
  const totalRemaining = filteredData.reduce(
    (sum, item) => sum + item.remainingAmount,
    0
  );

  return (
    <div className="bg-[#F5F5F5]">
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">
          FINANCIAL LEDGER
        </h2>
      </div>

      {/* Summary Cards - Moved to left and made larger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6 bg-green-50 border-l-4 border-green-500">
          <div className="flex flex-col">
            <span className="text-green-800 text-sm font-medium mb-1">
              Total Amount
            </span>
            <span className="text-green-900 text-2xl font-bold">
              Rs. {totalAmount.toLocaleString()}
            </span>
          </div>
        </Card>
        <Card className="p-6 bg-blue-50 border-l-4 border-blue-500">
          <div className="flex flex-col">
            <span className="text-blue-800 text-sm font-medium mb-1">
              Total Paid
            </span>
            <span className="text-blue-900 text-2xl font-bold">
              Rs. {totalPaid.toLocaleString()}
            </span>
          </div>
        </Card>
        <Card className="p-6 bg-purple-50 border-l-4 border-purple-500">
          <div className="flex flex-col">
            <span className="text-purple-800 text-sm font-medium mb-1">
              Total Remaining
            </span>
            <span className="text-purple-900 text-2xl font-bold">
              Rs. {totalRemaining.toLocaleString()}
            </span>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden bg-white">
        <div className="p-6">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search students by ID or Name..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program
                </label>
                <Select
                  value={selectedCourse}
                  onChange={setSelectedCourse}
                  options={courseOptions}
                  placeholder="Select Program"
                  isClearable
                  className="text-sm"
                  styles={{
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                  }}
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={statusOptions}
                  placeholder="Select Status"
                  isClearable
                  className="text-sm"
                  styles={{
                    input: (base) => ({
                      ...base,
                      "input:focus": {
                        boxShadow: "none",
                      },
                    }),
                  }}
                />
              </div> */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    isClearable={true}
                    placeholderText="Select start date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    isClearable={true}
                    placeholderText="Select end date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div> */}
              <div className="md:col-span-2 flex justify-end">
                <Button
                  className="bg-blue-500 flex items-center gap-2 px-4 py-2.5 shadow-md"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCourse(null);
                    setSelectedStatus(null);
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {allLedgersLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : allLedgersError ? (
              <div className="text-center p-4 text-red-500">
                Error loading ledger data: {allLedgersError}
              </div>
            ) : (
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold">
                        Student ID
                      </Typography>
                    </th>
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold">
                        Student Name
                      </Typography>
                    </th>
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold">
                        Program
                      </Typography>
                    </th>
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold">
                        Date
                      </Typography>
                    </th>
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold text-right">
                        Total Amount (Rs.)
                      </Typography>
                    </th>
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold text-right">
                        Paid Amount (Rs.)
                      </Typography>
                    </th>
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold text-right">
                        Remaining (Rs.)
                      </Typography>
                    </th>
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold text-center">
                        Split Vouchers
                      </Typography>
                    </th>
                    {/* <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold">
                        Status
                      </Typography>
                    </th> */}
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold">
                        Action
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {item.student?.registrationId || "N/A"}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {item.student?.fullName || "N/A"}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {item.course?.name || "N/A"}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {new Date(item.createdAt).toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays text-right font-medium">
                          {item.totalAmount.toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays text-right font-medium">
                          {item.paidAmount.toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays text-right font-medium">
                          {item.remainingAmount.toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100 text-center">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={item.splitVoucherCount || 0}
                          color={item.splitVoucherCount > 0 ? "blue" : "gray"}
                          className="text-xs font-medium"
                        />
                      </td>
                      {/* <td className="p-4 border-b border-gray-100">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={
                            item.remainingAmount === 0
                              ? "Paid"
                              : item.paidAmount > 0
                              ? "Partial"
                              : "Pending"
                          }
                          color={
                            item.remainingAmount === 0
                              ? "green"
                              : item.paidAmount > 0
                              ? "amber"
                              : "red"
                          }
                          className="text-xs font-medium"
                        />
                      </td> */}
                      <td className="p-4 border-b border-gray-100">
                        {item.student && (
                          <Button
                            size="sm"
                            className="bg-c-purple py-2 px-3"
                            onClick={() => {
                              navigate(`/student-ledger/${item.student._id}`, {
                                state: { from: "ledger" },
                              });
                            }}
                          >
                            View
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {records.length === 0 && (
                    <tr>
                      <td
                        colSpan="10"
                        className="p-4 text-center text-gray-500"
                      >
                        No ledger records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filteredData.length > recordsPerPage && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center gap-2">
                <Button
                  variant="text"
                  className="flex items-center gap-2 text-c-purple"
                  onClick={prePage}
                  disabled={currentPage === 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {npage}
                  </span>
                </div>

                <Button
                  variant="text"
                  className="flex items-center gap-2 text-c-purple"
                  onClick={nextPage}
                  disabled={currentPage === npage}
                >
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LedgerBody;
