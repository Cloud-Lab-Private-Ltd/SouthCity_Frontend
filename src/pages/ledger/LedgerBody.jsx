import { useState, useEffect } from "react";
import { Card, Typography, Button, Chip } from "@material-tailwind/react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faArrowLeft,
  faArrowRight,
  faFilePdf,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StatusesGet } from "../../features/GroupApiSlice";
import jsPDF from "jspdf";
// Import jspdf-autotable as a separate import
import 'jspdf-autotable';

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
  const dispatch = useDispatch();

  // Fetch statuses when component mounts
  useEffect(() => {
    dispatch(StatusesGet());
  }, [dispatch]);

  const { allLedgers, allLedgersLoading, allLedgersError } = useSelector(
    (state) => state.ledgerdata
  );

  const { courses } = useSelector((state) => state.groupdata);
  const { statuses } = useSelector((state) => state.groupdata);

  // Course options for filter
  const courseOptions =
    courses?.courses?.map((course) => ({
      value: course._id,
      label: course.name,
    })) || [];

  // Status options for filter
  const statusOptions =
    statuses?.statuses?.map((status) => ({
      value: status.name,
      label: status.name,
    })) || [];

  // Filter out parent vouchers with isSplit: true
  const nonSplitVouchers =
    allLedgers?.data?.filter((item) => !item.isSplit) || [];

  // Filter the data based on search term, course, status, and date range
  const filteredData = nonSplitVouchers.filter((item) => {
    const studentName = item.student?.fullName || "";
    const studentId = item.student?.registrationId || "";
    const courseName = item.course?.name || "";

    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.voucherNumber &&
        item.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCourse = selectedCourse
      ? item.course?._id === selectedCourse.value
      : true;

    const matchesStatus = selectedStatus
      ? item.status?.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;

    let matchesDateRange = true;
    if (startDate && endDate) {
      const itemDate = new Date(item.dueDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Set end date to end of day for inclusive comparison
      end.setHours(23, 59, 59, 999);
      matchesDateRange = itemDate >= start && itemDate <= end;
    } else if (startDate) {
      const itemDate = new Date(item.dueDate);
      const start = new Date(startDate);
      matchesDateRange = itemDate >= start;
    } else if (endDate) {
      const itemDate = new Date(item.dueDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDateRange = itemDate <= end;
    }

    return matchesSearch && matchesCourse && matchesStatus && matchesDateRange;
  });

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
    (sum, item) => sum + (item.totalFee || 0),
    0
  );
  const totalPaid = filteredData.reduce(
    (sum, item) => sum + (item.paidAmount || 0),
    0
  );
  const totalRemaining = filteredData.reduce(
    (sum, item) => sum + (item.remainingAmount || 0),
    0
  );

  // Function to get row background color based on status
  const getRowBackgroundColor = (item) => {
    if (item.paymentSlip) {
      return "bg-green-50 border-l-4 border-green-400";
    }
    if (item.status?.toLowerCase() === "processing") {
      return "bg-blue-50 border-l-4 border-blue-400";
    }
    if (item.status?.toLowerCase() === "paid") {
      return "bg-green-50 border-l-4 border-green-400";
    }
    if (item.parentVoucher) {
      return "bg-purple-50 border-l-4 border-purple-400";
    }
    return "";
  };

  // Function to export data to CSV
  const exportToCSV = () => {
    // Determine which data to export (filtered or all)
    const dataToExport =
      filteredData.length > 0 ? filteredData : nonSplitVouchers;

    // Define CSV headers
    const headers = [
      "Voucher No",
      "Student ID",
      "Student Name",
      "Program",
      "Semester",
      "Created Date",
      "Due Date",
      "Total Amount",
      "Paid Amount",
      "Remaining Amount",
      "Status",
    ];

    // Convert data to CSV format
    const csvData = dataToExport.map((item) => [
      item.voucherNumber || "",
      item.student?.registrationId || "",
      item.student?.fullName || "",
      item.course?.name || "",
      item.monthOf || "",
      new Date(item.createdAt).toLocaleDateString("en-GB"),
      new Date(item.dueDate).toLocaleDateString("en-GB"),
      item.totalFee || 0,
      item.paidAmount || 0,
      item.remainingAmount || 0,
      item.status || "Unpaid",
    ]);

    // Add headers to the beginning
    csvData.unshift(headers);

    // Convert to CSV string
    const csvString = csvData.map((row) => row.join(",")).join("\n");

    // Create a blob and download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ledger_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export data to PDF
  const exportToPDF = () => {
    try {
      // Determine which data to export (filtered or all)
      const dataToExport =
        filteredData.length > 0 ? filteredData : nonSplitVouchers;

      // Create a new PDF document in landscape orientation
      const doc = new jsPDF('landscape');
      
      // Define constants for positioning
      const pageWidth = doc.internal.pageSize.width;
      const margin = 10;
      const lineHeight = 7;
      const fontSize = 10;
      const smallFontSize = 8;
      
      // Add title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Financial Ledger Report", margin, margin + 10);
      
      // Add date
      doc.setFontSize(smallFontSize);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, margin, margin + 18);
      
      // Add summary
      let currentY = margin + 30;
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", "bold");
      doc.text("Summary:", margin, currentY);
      currentY += lineHeight;
      
      doc.setFont("helvetica", "normal");
      doc.text(`Total Amount: Rs. ${totalAmount.toLocaleString()}`, margin + 5, currentY);
      currentY += lineHeight;
      
      doc.text(`Total Paid: Rs. ${totalPaid.toLocaleString()}`, margin + 5, currentY);
      currentY += lineHeight;
      
      doc.text(`Total Remaining: Rs. ${totalRemaining.toLocaleString()}`, margin + 5, currentY);
      currentY += lineHeight * 2;
      
      // Table headers
      const headers = [
        "Voucher No", 
        "Student ID", 
        "Student Name", 
        "Program", 
        "Semester", 
        "Created Date", 
        "Due Date", 
        "Total Amount", 
        "Paid Amount", 
        "Remaining", 
        "Status"
      ];
      
      // Calculate column widths
      const tableWidth = pageWidth - (2 * margin);
      const colWidths = [
        tableWidth * 0.1,  // Voucher No
        tableWidth * 0.08, // Student ID
        tableWidth * 0.12, // Student Name
        tableWidth * 0.12, // Program
        tableWidth * 0.08, // Semester
        tableWidth * 0.08, // Created Date
        tableWidth * 0.08, // Due Date
        tableWidth * 0.08, // Total Amount
        tableWidth * 0.08, // Paid Amount
        tableWidth * 0.08, // Remaining
        tableWidth * 0.1   // Status
      ];
      
      // Draw table header
      doc.setFillColor(85, 112, 241); // c-purple color
      doc.setDrawColor(85, 112, 241);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(smallFontSize);
      
      // Draw header background
      doc.rect(margin, currentY - 5, tableWidth, 8, 'F');
      
      // Draw header text
      let xPos = margin;
      headers.forEach((header, index) => {
        doc.text(header, xPos + 2, currentY);
        xPos += colWidths[index];
      });
      
      currentY += lineHeight;
      
      // Reset text color for table body
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
      // Draw table rows
      let rowCount = 0;
      dataToExport.forEach((item) => {
        // Alternate row background
        if (rowCount % 2 === 0) {
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, currentY - 5, tableWidth, 8, 'F');
        }
        
        // Add new page if needed
        if (currentY > doc.internal.pageSize.height - 20) {
          doc.addPage();
          currentY = margin + 10;
          
          // Draw header on new page
          doc.setFillColor(85, 112, 241);
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          doc.rect(margin, currentY - 5, tableWidth, 8, 'F');
          
          xPos = margin;
          headers.forEach((header, index) => {
            doc.text(header, xPos + 2, currentY);
            xPos += colWidths[index];
          });
          
          currentY += lineHeight;
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
        }
        
        // Prepare row data
        const rowData = [
          item.voucherNumber || "",
          item.student?.registrationId || "",
          item.student?.fullName || "",
          item.course?.name || "",
          item.monthOf || "",
          new Date(item.createdAt).toLocaleDateString("en-GB"),
          new Date(item.dueDate).toLocaleDateString("en-GB"),
          `Rs. ${(item.totalFee || 0).toLocaleString()}`,
          `Rs. ${(item.paidAmount || 0).toLocaleString()}`,
          `Rs. ${(item.remainingAmount || 0).toLocaleString()}`,
          item.status || "Unpaid"
        ];
        
        // Draw row data
        xPos = margin;
        rowData.forEach((text, index) => {
          // Truncate text if too long
          let displayText = text;
          if (text.length > 20) {
            displayText = text.substring(0, 17) + "...";
          }
          doc.text(displayText, xPos + 2, currentY);
          xPos += colWidths[index];
        });
        
        currentY += lineHeight;
        rowCount++;
      });
      
      // Save the PDF
      doc.save("ledger_report.pdf");
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Error exporting to PDF. Please check console for details.");
    }
  };


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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by ID, Name or Voucher Number..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
              <div>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date From
                </label>
                <input
                  type="date"
                  value={startDate || ""}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date To
                </label>
                <input
                  type="date"
                  value={endDate || ""}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || ""}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actions
                </label>
                <Button
                  className="bg-blue-500 flex items-center gap-2 px-4 py-2.5 shadow-md w-full"
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
            
            {/* Export buttons in a separate row */}
            <div className="mt-4 flex gap-4">
              <Button
                className="bg-green-500 flex items-center gap-2 px-4 py-2.5 shadow-md"
                onClick={exportToCSV}
              >
                <FontAwesomeIcon icon={faFileExcel} className="h-4 w-4" />
                Export CSV
              </Button>
              <Button
                className="bg-red-500 flex items-center gap-2 px-4 py-2.5 shadow-md"
                onClick={exportToPDF}
              >
                <FontAwesomeIcon icon={faFilePdf} className="h-4 w-4" />
                Export PDF
              </Button>
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
                        Voucher No
                      </Typography>
                    </th>
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
                        Status
                      </Typography>
                    </th>
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold">
                        Action
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((item) => (
                    <tr key={item._id} className={getRowBackgroundColor(item)}>
                      <td className="p-4 border-b border-gray-100">
                        <div className="flex items-center">
                          <Typography className="text-c-grays font-medium">
                            {item.voucherNumber}
                            {item.parentVoucher && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                                Split {item.paymentPercentage}%
                              </span>
                            )}
                            {item.paymentSlip && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Payment Slip
                              </span>
                            )}
                          </Typography>
                        </div>
                      </td>
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
                          {item.monthOf || "N/A"}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {new Date(item.createdAt).toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          {new Date(item.dueDate).toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays text-right font-medium">
                          {(item.totalFee || 0).toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays text-right font-medium">
                          {(item.paidAmount || 0).toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays text-right font-medium">
                          {(item.remainingAmount || 0).toLocaleString()}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100 text-center">
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={
                            item.status
                              ? item.status.charAt(0).toUpperCase() +
                                item.status.slice(1).toLowerCase()
                              : "Unpaid"
                          }
                          color={
                            item.status?.toLowerCase() === "paid"
                              ? "green"
                              : item.status?.toLowerCase() === "partial"
                              ? "amber"
                              : item.status?.toLowerCase() === "processing"
                              ? "blue"
                              : "red"
                          }
                          className="text-xs font-medium"
                        />
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="flex gap-2">
                          {item.student && (
                            <Button
                              size="sm"
                              className="bg-c-purple py-2 px-3"
                              onClick={() => {
                                navigate(
                                  `/student-ledger/${item.student._id}`,
                                  {
                                    state: { from: "ledger" },
                                  }
                                );
                              }}
                            >
                              View
                            </Button>
                          )}
                          {item.paymentSlip && (
                            <Button
                              size="sm"
                              className="bg-green-500 py-2 px-3"
                              onClick={() => {
                                window.open(item.paymentSlip, "_blank");
                              }}
                            >
                              Slip
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {records.length === 0 && (
                    <tr>
                      <td
                        colSpan="12"
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
                  <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {npage || 1}
                  </span>
                </div>

                <Button
                  variant="text"
                  className="flex items-center gap-2 text-c-purple"
                  onClick={nextPage}
                  disabled={currentPage === npage}
                >
                  Next
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
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
