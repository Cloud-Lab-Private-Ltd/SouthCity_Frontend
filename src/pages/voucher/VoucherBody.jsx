import { useState, useEffect } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import VoucherDetailsModal from "./VoucherDetailsModal";
import { VouchersGet } from "../../features/GroupApiSlice";
import jsPDF from "jspdf";
import EditVoucherModal from "./EditVoucherModal";
import SplitVoucherModal from "./SplitVoucherModal";
import ViewSplitVouchersModal from "./ViewSplitVouchersModal";

const VoucherBody = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { fees } = useSelector((state) => state.groupdata);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Separate states for each field
  const [admissionFee, setAdmissionFee] = useState("");
  const [semesterFee, setSemesterFee] = useState("");
  const [securityFee, setSecurityFee] = useState("");
  const [libraryFee, setLibraryFee] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [inWordAmount, setInWordAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [monthOf, setMonthOf] = useState("");
  const [isFullPayment, setIsFullPayment] = useState(true);
  const [paymentPercentage, setPaymentPercentage] = useState();

  // Add state to track full amount
  const [fullAmount, setFullAmount] = useState(0);

  // Add new state for color filter
  const [selectedColor, setSelectedColor] = useState("all");

  // Add color options
  const colorOptions = [
    { value: "all", label: "All Vouchers" },
    {
      value: "green",
      label: "Paid Vouchers",
      description: "Vouchers that are fully paid",
    },
    {
      value: "purple",
      label: "Split Vouchers",
      description: "Vouchers split into multiple parts",
    },
    {
      value: "blue",
      label: "Payment Uploaded",
      description: "Vouchers with payment slip uploaded",
    },
    {
      value: "yellow",
      label: "Pending Vouchers",
      description: "Vouchers with pending status",
    },
  ];

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

      // Calculate full amount first
      const fullTotal = admissionFee + semesterFee + securityFee + libraryFee;
      setFullAmount(fullTotal);

      // Calculate percentage if not full payment
      if (!isFullPayment) {
        const percentMultiplier = paymentPercentage / 100;
        setAdmissionFee((admissionFee * percentMultiplier).toString());
        setSemesterFee((semesterFee * percentMultiplier).toString());
        setSecurityFee((securityFee * percentMultiplier).toString());
        setLibraryFee((libraryFee * percentMultiplier).toString());
      } else {
        setAdmissionFee(admissionFee.toString());
        setSemesterFee(semesterFee.toString());
        setSecurityFee(securityFee.toString());
        setLibraryFee(libraryFee.toString());
      }
    }
  }, [fees, isFullPayment, paymentPercentage]);

  const token = localStorage.getItem("token");
  const { students } = useSelector((state) => state.groupdata?.students);
  const { vouchers, voucherLoading } = useSelector((state) => state.groupdata);
  const { batches } = useSelector((state) => state.groupdata);
  const [studentFilterOPtion, setstudentFilterOPtion] = useState([]);

  const studentFilter = Array.isArray(students)
    ? students?.filter((item) => item?.status === "active")
    : [];

  const batchOptions = batches?.batches
    ?.filter((batch) => batch.status === "Active")
    ?.map((batch) => ({
      value: batch._id,
      label: batch.batchName,
      courses: batch.course,
    }));
  const [selectedBatch, setSelectedBatch] = useState(null);

  const courseOptions = selectedBatch?.courses
    ?.filter((course) => course.Status === "Active")
    ?.map((course) => ({
      value: course._id,
      label: course.name,
    }));

  // Update the handleStudentSelect function
  const handleStudentSelect = (selected) => {
    setSelectedStudent(selected);
  };

  useEffect(() => {
    const filter = studentFilter?.filter(
      (student) =>
        student?.course?.[0]?._id === selectedCourse?.value &&
        student.status === "active"
    );
    const studentOptions =
      Array.isArray(filter) &&
      filter?.map((student) => ({
        value: student?._id,
        label: `${student?.fullName} - ${student?.registrationId}`,
        studentData: student,
      }));
    setstudentFilterOPtion(studentOptions);
  }, [selectedCourse]);

  // Calculate total whenever fees change
  useEffect(() => {
    const total =
      Number(admissionFee) +
      Number(semesterFee) +
      Number(securityFee) +
      Number(libraryFee);
    setTotalFee(total.toString());
  }, [admissionFee, semesterFee, securityFee, libraryFee]);

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
          voucherData.totalFee,
        ];

        let yPos = 71 + yOffset;
        feeDetails.forEach((item, index) => {
          doc.setFont("helvetica", "normal");
          doc.text(item, xOffset + 7, yPos);
          // Align amounts to the right
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${BASE_URL}/api/v1/sch/voucher`,
        {
          student: selectedStudent.value,
          course: selectedCourse.value,
          paidAmount: fullAmount,
          admissionFee,
          semesterFee,
          securityFee,
          libraryFee,
          totalFee,
          inWordAmount,
          dueDate,
          monthOf,
          isFullPayment,
          paymentPercentage: isFullPayment ? null : paymentPercentage,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Voucher created successfully!",
        confirmButtonColor: "#5570F1",
      });
      dispatch(VouchersGet());
      // Reset all states
      setSelectedStudent(null);
      setSelectedCourse(null);
      setSelectedBatch(null);
      setAdmissionFee("");
      setSemesterFee("");
      setSecurityFee("");
      setLibraryFee("");
      setTotalFee("");
      setInWordAmount("");
      setDueDate("");
      setMonthOf("");
      setPaymentPercentage("");
      setIsFullPayment(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to create voucher",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Enter Admin Password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Enter admin password",
        autocomplete: "new-password",
        name: "voucher-admin-delete-password",
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#5570F1",
      cancelButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: async (adminPassword) => {
        if (!adminPassword) {
          Swal.showValidationMessage("Please enter admin password");
          return false;
        }
        try {
          await axios.delete(`${BASE_URL}/api/v1/sch/vouchers/${id}`, {
            headers: {
              "x-access-token": token,
            },
            data: {
              adminPassword,
            },
          });

          return true;
        } catch (error) {
          Swal.showValidationMessage(
            error.response?.data?.message || "Failed to delete voucher"
          );
          return false;
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Voucher has been deleted successfully",
          icon: "success",
          confirmButtonColor: "#5570F1",
        });
        dispatch(VouchersGet());
      }
    });
  };

  // Add this function at the top of your component
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

    if (num === 0) return "Zero";

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

  // Add this state at the top
  const [openMenu, setOpenMenu] = useState(null);

  // Add this useEffect for handling menu close
  useEffect(() => {
    const closeMenu = () => setOpenMenu(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  // Update the useEffect to handle both total and words
  useEffect(() => {
    const total =
      Number(admissionFee) +
      Number(semesterFee) +
      Number(securityFee) +
      Number(libraryFee);
    setTotalFee(total.toString());
    setInWordAmount(numberToWords(total));
  }, [admissionFee, semesterFee, securityFee, libraryFee]);

  // Add state for view split modal
  const [viewSplitModalOpen, setViewSplitModalOpen] = useState(false);
  const [selectedParentVoucher, setSelectedParentVoucher] = useState(null);

  // Add handler
  const handleViewSplitVouchers = (voucher) => {
    setSelectedParentVoucher(voucher._id);
    setViewSplitModalOpen(true);
  };

  // Update total fee calculation effect
  useEffect(() => {
    const total =
      Number(admissionFee) +
      Number(semesterFee) +
      Number(securityFee) +
      Number(libraryFee);
    setTotalFee(total.toString());
  }, [admissionFee, semesterFee, securityFee, libraryFee]);

  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedVoucherDetails, setSelectedVoucherDetails] = useState(null);

  const handleViewDetails = (voucher) => {
    setSelectedVoucherDetails(voucher);
    setViewDetailsOpen(true);
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setEditModalOpen(true);
  };

  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [selectedSplitVoucher, setSelectedSplitVoucher] = useState(null);

  // Add this handler function
  const handleSplitVoucher = (voucher) => {
    setSelectedSplitVoucher(voucher);
    setSplitModalOpen(true);
  };

  // Add these states at the top with other states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  // Update the filtering logic
  const filteredVouchers = vouchers?.filter((item) => {
    const matchesSearch =
      item.voucherNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedColor === "all") return matchesSearch;
    if (selectedColor === "green")
      return item.status === "Paid" && matchesSearch;
    if (selectedColor === "purple")
      return item.splitVouchers?.length > 0 && matchesSearch;
    if (selectedColor === "blue")
      return (
        item.paymentSlip &&
        !item.splitVouchers?.length &&
        item.status !== "Paid" &&
        matchesSearch
      );
    if (selectedColor === "yellow")
      return item.status === "Pending" && matchesSearch;

    return matchesSearch;
  });

  const records = filteredVouchers?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredVouchers?.length / recordsPerPage);

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

  // Add at the top with other imports
  const { permissions } = useSelector(
    (state) => state.profiledata?.profile?.member?.group || {}
  );
  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name
  );

  // Add permission check function
  const checkPermission = (type) => {
    if (admin === "admins") return true;
    const voucherPermission = permissions?.find(
      (p) => p.pageName === "Voucher"
    );
    return voucherPermission?.[type] || false;
  };

  console.log("record", records);

  return (
    <div className="bg-[#F5F5F5]">
      <VoucherDetailsModal
        open={viewDetailsOpen}
        handleOpen={() => setViewDetailsOpen(!viewDetailsOpen)}
        voucherData={selectedVoucherDetails}
      />
      <EditVoucherModal
        open={editModalOpen}
        handleOpen={() => setEditModalOpen(!editModalOpen)}
        voucherData={selectedVoucher}
        token={token}
        onSuccess={() => dispatch(VouchersGet())}
      />
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">VOUCHER</h2>
      </div>
      {(admin === "admins" || checkPermission("insert")) && (
        <Card className="p-6 mb-8 bg-white">
          <Typography className="text-xl font-semibold text-c-grays mb-6">
            Create Voucher
          </Typography>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Select Batch *
                </label>
                <Select
                  value={selectedBatch}
                  onChange={(selected) => {
                    setSelectedBatch(selected);
                    setSelectedCourse(null);
                    setSelectedStudent(null);
                  }}
                  options={batchOptions}
                  placeholder="Select Batch"
                  isSearchable
                  className="text-c-grays"
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
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Select Course *
                </label>
                <Select
                  value={selectedCourse}
                  onChange={setSelectedCourse}
                  options={courseOptions}
                  placeholder="Select Course"
                  isSearchable
                  isDisabled={!selectedBatch}
                  className="text-c-grays"
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
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Select Student *
                </label>
                <Select
                  value={selectedStudent}
                  onChange={handleStudentSelect}
                  options={studentFilterOPtion}
                  isDisabled={!selectedBatch || !selectedCourse}
                  placeholder="Select Student"
                  isSearchable
                  isClearable
                  required
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
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Admission Fee *
                </label>
                <input
                  type="number"
                  value={admissionFee}
                  onChange={(e) => setAdmissionFee(e.target.value)}
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
                  value={semesterFee}
                  onChange={(e) => setSemesterFee(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Security Fee
                </label>
                <input
                  type="number"
                  value={securityFee}
                  onChange={(e) => setSecurityFee(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Library Fee
                </label>
                <input
                  type="number"
                  value={libraryFee}
                  onChange={(e) => setLibraryFee(e.target.value)}
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
                  value={totalFee}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Paid Amount
                </label>
                <input
                  type="number"
                  value={fullAmount}
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
                  value={inWordAmount}
                  onChange={(e) => setInWordAmount(e.target.value)}
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
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
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
                  value={monthOf}
                  onChange={(e) => setMonthOf(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {/* <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFullPayment"
                  checked={isFullPayment}
                  onChange={(e) => setIsFullPayment(e.target.checked)}
                  className="w-7 h-7 text-c-purple cursor-pointer border-gray-300 rounded focus:ring-c-purple"
                  readOnly
                />
                <label
                  htmlFor="isFullPayment"
                  className="text-c-grays text-md font-medium"
                >
                  Full Payment
                </label>
              </div> */}

              {!isFullPayment && (
                <div>
                  <label className="block text-c-grays text-sm font-medium mb-2">
                    Payment Percentage
                  </label>
                  <input
                    type="number"
                    value={paymentPercentage}
                    onChange={(e) =>
                      setPaymentPercentage(Number(e.target.value))
                    }
                    className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                    min="1"
                    max="99"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                className="bg-c-purple h-[45px] overflow-hidden flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : (
                  "Create Voucher"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Vouchers List
          </Typography>
          <div className="flex gap-4 w-full md:w-auto">
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {colorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="w-full md:w-72 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder={`Search ${
                selectedColor === "all"
                  ? "all vouchers"
                  : colorOptions
                      .find((o) => o.value === selectedColor)
                      ?.label.toLowerCase()
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="voucher-search"
            />
          </div>
        </div>
        <div className="px-6 pb-4 flex flex-wrap gap-4 text-sm">
          {selectedColor !== "all" && (
            <div className="text-gray-600">
              {colorOptions.find((o) => o.value === selectedColor)?.description}
            </div>
          )}
        </div>
        <div className="px-6 mb-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-gray-700 font-medium mb-2 md:mb-0">
              Voucher Types:
            </div>
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4 mt-2">
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="min-w-[12px] h-3 bg-green-500 rounded-full"></div>
                <span>Paid Vouchers</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="min-w-[12px] h-3 bg-purple-500 rounded-full"></div>
                <span>Split Vouchers</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="min-w-[12px] h-3 bg-blue-500 rounded-full"></div>
                <span>Payment Uploaded</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="min-w-[12px] h-3 bg-yellow-500 rounded-full"></div>
                <span>Pending Vouchers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[60vh] overflow-x-auto">
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
                    Student
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Course Name
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Total Fee
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
                    Status
                  </Typography>
                </th>

                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Payment Slip
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            {voucherLoading ? (
              <tbody>
                {[1, 2, 3, 4, 5].map((index) => (
                  <tr key={index}>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-32"></div>
                    </td>

                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-32"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-32"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-32"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-24"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-24"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-24"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                {records?.map((item) => (
                  <tr
                    key={item._id}
                    className={`${
                      item.status === "Paid"
                        ? "bg-green-50 border-l-4 border-l-green-500"
                        : item.splitVouchers?.length > 0
                        ? "bg-purple-50 border-l-4 border-l-purple-500"
                        : item.paymentSlip
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item.voucherNumber}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item.student?.fullName}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item.course?.name}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        Rs. {item.totalFee}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {new Date(item.dueDate).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      {item.splitVouchers?.length > 0 ? (
                        <span className="text-purple-600 font-medium flex items-center gap-1">
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
                              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75z"
                            />
                          </svg>
                          Split into Multiple Vouchers
                        </span>
                      ) : item?.paymentSlip ? (
                        <Button
                          size="sm"
                          className="bg-blue-500"
                          onClick={() =>
                            window.open(item?.paymentSlip, "_blank")
                          }
                        >
                          View Payment
                        </Button>
                      ) : (
                        <>Payment Pending</>
                      )}
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(item._id);
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

                        {openMenu === item._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-[9999]">
                            <div className="py-2">
                              <button
                                onClick={() => {
                                  generateVoucherPDF(item);
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
                                  handleViewDetails(item);
                                  setOpenMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
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
                                View Details
                              </button>

                              <button
                                onClick={() => {
                                  handleViewSplitVouchers(item);
                                  setOpenMenu(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-purple-600"
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
                                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                  />
                                </svg>
                                View Split Vouchers
                              </button>

                              {(admin === "admins" ||
                                checkPermission("update")) && (
                                <button
                                  onClick={() => {
                                    handleSplitVoucher(item);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-orange-600"
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
                                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                                    />
                                  </svg>
                                  Split Voucher
                                </button>
                              )}

                              {(admin === "admins" ||
                                checkPermission("update")) && (
                                <button
                                  onClick={() => {
                                    handleEdit(item);
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
                              )}
                              {(admin === "admins" ||
                                checkPermission("delete")) && (
                                <button
                                  onClick={() => {
                                    handleDelete(item._id);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
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
                                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                  </svg>
                                  Delete Voucher
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <div className="p-4 flex items-center justify-between border-t border-gray-100">
          <Typography className="text-c-grays">
            Page {currentPage} of {npage}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              className="text-c-purple border-c-purple"
              onClick={prePage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              className="text-c-purple border-c-purple"
              onClick={nextPage}
              disabled={currentPage === npage}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <SplitVoucherModal
        open={splitModalOpen}
        handleOpen={() => setSplitModalOpen(!splitModalOpen)}
        voucherData={selectedSplitVoucher}
        token={token}
        onSuccess={() => dispatch(VouchersGet())}
      />
      <ViewSplitVouchersModal
        open={viewSplitModalOpen}
        handleOpen={() => setViewSplitModalOpen(!viewSplitModalOpen)}
        parentVoucherId={selectedParentVoucher}
        token={token}
      />
    </div>
  );
};

export default VoucherBody;
