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

const VoucherBody = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);
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

  const token = localStorage.getItem("token");
  const { students } = useSelector((state) => state.groupdata);
  const { vouchers, voucherLoading } = useSelector((state) => state.groupdata);

  const selectStyles = {
    control: (base) => ({
      ...base,
      padding: "2px",
      borderColor: "#e5e7eb",
      "&:hover": {
        borderColor: "#6b21a8",
      },
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#f3e8ff" : "white",
      color: "#111827",
      "&:hover": {
        backgroundColor: "#f3e8ff",
      },
    }),
  };

  const studentOptions = students?.students?.map((student) => ({
    value: student._id,
    label: `${student.fullName} - ${student.registrationId}`,
    studentData: student,
  }));

  const handleStudentSelect = (selected) => {
    setSelectedStudent(selected);
    const courseOptions = selected.studentData.course.map((course) => ({
      value: course._id,
      label: `${course.name} - ${course.code}`,
    }));
    setCourseOptions(courseOptions);
  };

  // Calculate total whenever fees change
  useEffect(() => {
    const total =
      Number(admissionFee) +
      Number(semesterFee) +
      Number(securityFee) +
      Number(libraryFee);
    setTotalFee(total.toString());
  }, [admissionFee, semesterFee, securityFee, libraryFee]);

  // const generateVoucherPDF = () => {
  //   const doc = new jsPDF("l", "mm", "a3");
  //   const pageWidth = doc.internal.pageSize.width;
  //   const columnWidth = pageWidth / 4;

  //   for (let i = 0; i < 4; i++) {
  //     const xOffset = i * columnWidth;
  //     const yOffset = 10;

  //     // Header Section
  //     doc.setFontSize(8);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("00915", xOffset + columnWidth / 2, 12 + yOffset, {
  //       align: "center",
  //     });
  //     doc.text(
  //       "South City Healthcare Education Hub",
  //       xOffset + columnWidth / 2,
  //       18 + yOffset,
  //       {
  //         align: "center",
  //       }
  //     );
  //     doc.setFontSize(6);
  //     doc.setFont("helvetica", "normal");
  //     doc.text(
  //       "Pvt. Ltd. Clifton, Karachi.",
  //       xOffset + columnWidth / 2,
  //       23 + yOffset,
  //       {
  //         align: "center",
  //       }
  //     );
  //     doc.setFont("helvetica", "bold");
  //     doc.text("SCPTR", xOffset + columnWidth / 2, 28 + yOffset, {
  //       align: "center",
  //     });
  //     doc.setFont("helvetica", "normal");
  //     doc.text("United Bank Ltd", xOffset + columnWidth / 2, 33 + yOffset, {
  //       align: "center",
  //     });
  //     doc.text(
  //       "Branch Name: Boat Basin",
  //       xOffset + columnWidth / 2,
  //       38 + yOffset,
  //       {
  //         align: "center",
  //       }
  //     );
  //     doc.text("Branch Code: 1212", xOffset + columnWidth / 2, 43 + yOffset, {
  //       align: "center",
  //     });
  //     doc.text(
  //       "Account #: 2509114461",
  //       xOffset + columnWidth / 2,
  //       48 + yOffset,
  //       { align: "center" }
  //     );

  //     // Student Information
  //     doc.setFontSize(6);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("Full Name", xOffset + 10, 55 + yOffset);
  //     doc.line(
  //       xOffset + 25,
  //       55 + yOffset,
  //       xOffset + columnWidth - 10,
  //       55 + yOffset
  //     );
  //     doc.text("Father Name", xOffset + 10, 60 + yOffset);
  //     doc.line(
  //       xOffset + 25,
  //       60 + yOffset,
  //       xOffset + columnWidth - 10,
  //       60 + yOffset
  //     );
  //     doc.text("CNIC", xOffset + 10, 65 + yOffset);
  //     doc.line(
  //       xOffset + 25,
  //       65 + yOffset,
  //       xOffset + columnWidth - 10,
  //       65 + yOffset
  //     );
  //     doc.text("Application No", xOffset + 10, 70 + yOffset);
  //     doc.line(
  //       xOffset + 25,
  //       70 + yOffset,
  //       xOffset + columnWidth - 10,
  //       70 + yOffset
  //     );

  //     // Fee Breakdown Section
  //     doc.setFontSize(6);
  //     doc.setFillColor(200, 200, 200);
  //     doc.rect(xOffset + 10, 75 + yOffset, 40, 5, "F");
  //     doc.rect(xOffset + 50, 75 + yOffset, 40, 5, "F");
  //     doc.text("Detail of Fee", xOffset + 12, 78.5 + yOffset);
  //     doc.text("Amount", xOffset + 52, 78.5 + yOffset);

  //     const feeDetails = [
  //       "Admission Fee",
  //       "Semester Fee",
  //       "Examination Fee",
  //       "Security Deposit",
  //       "Library Charges",
  //       "Total",
  //     ];
  //     let yPos = 85 + yOffset;
  //     feeDetails.forEach((item) => {
  //       doc.text(item, xOffset + 12, yPos);
  //       doc.line(xOffset + 50, yPos - 1, xOffset + columnWidth - 10, yPos - 1);
  //       yPos += 5;
  //     });

  //     // Amount in Words
  //     doc.setFont("helvetica", "bold");
  //     doc.text("In word:", xOffset + 10, 120 + yOffset);
  //     doc.line(
  //       xOffset + 25,
  //       120 + yOffset,
  //       xOffset + columnWidth - 10,
  //       120 + yOffset
  //     );

  //     // Footer Section
  //     doc.text("Applicant Signature", xOffset + 10, 125 + yOffset);
  //     doc.line(
  //       xOffset + 35,
  //       125 + yOffset,
  //       xOffset + columnWidth - 10,
  //       125 + yOffset
  //     );
  //     doc.text(
  //       "Receiving Branch Stamp and Signature",
  //       xOffset + 10,
  //       130 + yOffset
  //     );
  //     doc.line(
  //       xOffset + 55,
  //       130 + yOffset,
  //       xOffset + columnWidth - 10,
  //       130 + yOffset
  //     );

  //     // Border around each voucher
  //     doc.rect(xOffset + 5, 5 + yOffset, columnWidth - 10, 130);
  //   }

  //   const pdfBlob = doc.output("blob");
  //   const pdfUrl = URL.createObjectURL(pdfBlob);
  //   window.open(pdfUrl, "_blank");
  // };

  console.log("Voucher generated successfully!");

<<<<<<< HEAD
=======

  const generateVoucherPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const voucherWidth = pageWidth / 2;
    const voucherHeight = pageHeight / 2;

    for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
            const xOffset = col * voucherWidth;
            const yOffset = row * voucherHeight;

            // Header Section
            doc.setFontSize(6);
            doc.setFont("helvetica", "bold");
            doc.text("00915", xOffset + voucherWidth/2, 8 + yOffset, {
                align: "center",
            });
            doc.text(
                "South City Healthcare Education Hub",
                xOffset + voucherWidth/2,
                12 + yOffset,
                { align: "center" }
            );
            doc.setFontSize(5);
            doc.setFont("helvetica", "normal");
            doc.text(
                "Pvt. Ltd. Clifton, Karachi.",
                xOffset + voucherWidth/2,
                16 + yOffset,
                { align: "center" }
            );
            doc.setFont("helvetica", "bold");
            doc.text("SCPTR", xOffset + voucherWidth/2, 20 + yOffset, {
                align: "center",
            });
            doc.setFont("helvetica", "normal");
            doc.text(
                "United Bank Ltd",
                xOffset + voucherWidth/2,
                24 + yOffset,
                { align: "center" }
            );
            doc.text(
                "Branch Name: Boat Basin",
                xOffset + voucherWidth/2,
                28 + yOffset,
                { align: "center" }
            );
            doc.text(
                "Branch Code: 1212",
                xOffset + voucherWidth/2,
                32 + yOffset,
                { align: "center" }
            );
            doc.text(
                "Account #: 2509114461",
                xOffset + voucherWidth/2,
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
            doc.text("Father Name", xOffset + 5, 47 + yOffset);
            doc.line(
                xOffset + 20,
                47 + yOffset,
                xOffset + voucherWidth - 5,
                47 + yOffset
            );
            doc.text("CNIC", xOffset + 5, 52 + yOffset);
            doc.line(
                xOffset + 20,
                52 + yOffset,
                xOffset + voucherWidth - 5,
                52 + yOffset
            );
            doc.text("Application No", xOffset + 5, 57 + yOffset);
            doc.line(
                xOffset + 20,
                57 + yOffset,
                xOffset + voucherWidth - 5,
                57 + yOffset
            );

            // Fee Breakdown Section
            doc.setFillColor(200, 200, 200);
            doc.rect(xOffset + 5, 62 + yOffset, 35, 4, "F");
            doc.rect(xOffset + 40, 62 + yOffset, 35, 4, "F");
            doc.text("Detail of Fee", xOffset + 7, 65 + yOffset);
            doc.text("Amount", xOffset + 42, 65 + yOffset);

            const feeDetails = [
                "Admission Fee",
                "Semester Fee",
                "Examination Fee",
                "Security Deposit",
                "Library Charges",
                "Total",
            ];
            let yPos = 71 + yOffset;
            feeDetails.forEach((item) => {
                doc.text(item, xOffset + 7, yPos);
                doc.line(
                    xOffset + 40,
                    yPos - 1,
                    xOffset + voucherWidth - 5,
                    yPos - 1
                );
                yPos += 4;
            });

            // Amount in Words
            doc.text("In word:", xOffset + 5, 95 + yOffset);
            doc.line(
                xOffset + 20,
                95 + yOffset,
                xOffset + voucherWidth - 5,
                95 + yOffset
            );

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
>>>>>>> e6fbc0ca74ea26d6d6d890970349300772cf5660
  const generateVoucherPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const voucherWidth = pageWidth / 2;
    const voucherHeight = pageHeight / 2;

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const xOffset = col * voucherWidth;
        const yOffset = row * voucherHeight;

        // Header Section
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.text("00915", xOffset + voucherWidth / 2, 8 + yOffset, {
          align: "center",
        });
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
        doc.text("Father Name", xOffset + 5, 47 + yOffset);
        doc.line(
          xOffset + 20,
          47 + yOffset,
          xOffset + voucherWidth - 5,
          47 + yOffset
        );
        doc.text("CNIC", xOffset + 5, 52 + yOffset);
        doc.line(
          xOffset + 20,
          52 + yOffset,
          xOffset + voucherWidth - 5,
          52 + yOffset
        );
        doc.text("Application No", xOffset + 5, 57 + yOffset);
        doc.line(
          xOffset + 20,
          57 + yOffset,
          xOffset + voucherWidth - 5,
          57 + yOffset
        );

        // Fee Breakdown Section
        doc.setFillColor(200, 200, 200);
        doc.rect(xOffset + 5, 62 + yOffset, 35, 4, "F");
        doc.rect(xOffset + 40, 62 + yOffset, 35, 4, "F");
        doc.text("Detail of Fee", xOffset + 7, 65 + yOffset);
        doc.text("Amount", xOffset + 42, 65 + yOffset);

        const feeDetails = [
          "Admission Fee",
          "Semester Fee",
          "Examination Fee",
          "Security Deposit",
          "Library Charges",
          "Total",
        ];
        let yPos = 71 + yOffset;
        feeDetails.forEach((item) => {
          doc.text(item, xOffset + 7, yPos);
          doc.line(
            xOffset + 40,
            yPos - 1,
            xOffset + voucherWidth - 5,
            yPos - 1
          );
          yPos += 4;
        });

        // Amount in Words
        doc.text("In word:", xOffset + 5, 95 + yOffset);
        doc.line(
          xOffset + 20,
          95 + yOffset,
          xOffset + voucherWidth - 5,
          95 + yOffset
        );

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
<<<<<<< HEAD
};
=======
  };
>>>>>>> 7a3f2bd7adbb5f82ace5f9b32101f0ff0b2bff5f

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    generateVoucherPDF();

    // try {
    //   await axios.post(
    //     `${BASE_URL}/api/v1/sch/voucher`,
    //     {
    //       student: selectedStudent.value,
    //       course: selectedCourse.value,
    //       admissionFee,
    //       semesterFee,
    //       securityFee,
    //       libraryFee,
    //       totalFee,
    //       inWordAmount,
    //       dueDate,
    //       monthOf,
    //     },
    //     {
    //       headers: {
    //         "x-access-token": token,
    //       },
    //     }
    //   );

    //   Swal.fire({
    //     icon: "success",
    //     title: "Success",
    //     text: "Voucher created successfully!",
    //     confirmButtonColor: "#5570F1",
    //   });
    //   dispatch(VouchersGet());

    //   // Reset all states
    //   setSelectedStudent(null);
    //   setSelectedCourse(null);
    //   setAdmissionFee("");
    //   setSemesterFee("");
    //   setSecurityFee("");
    //   setLibraryFee("");
    //   setTotalFee("");
    //   setInWordAmount("");
    //   setDueDate("");
    //   setMonthOf("");
    // } catch (error) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error",
    //     text: error.response?.data?.error || "Failed to create voucher",
    //     confirmButtonColor: "#5570F1",
    //   });
    // } finally {
    //   setLoading(false);
    // }
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
      if (result) {
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

  // Add these states at the top with other states
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;

  // Add this filtering logic
  const filteredVouchers = vouchers?.filter(
    (item) =>
      item.voucherNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Card className="p-6 mb-8 bg-white">
        <Typography className="text-xl font-semibold text-c-grays mb-6">
          Create Voucher
        </Typography>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Select Student *
              </label>
              <Select
                value={selectedStudent}
                onChange={handleStudentSelect}
                options={studentOptions}
                styles={selectStyles}
                placeholder="Select Student"
                isSearchable
                isClearable
                required
              />
            </div>

            <div>
              <label className="block text-c-grays text-sm font-medium mb-2">
                Select Course *
              </label>
              <Select
                value={selectedCourse}
                onChange={(selected) => setSelectedCourse(selected)}
                options={courseOptions}
                styles={selectStyles}
                placeholder="Select Course"
                isSearchable
                isClearable
                required
                isDisabled={!selectedStudent}
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
                value={semesterFee}
                onChange={(e) => setSemesterFee(e.target.value)}
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
                value={securityFee}
                onChange={(e) => setSecurityFee(e.target.value)}
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
                value={libraryFee}
                onChange={(e) => setLibraryFee(e.target.value)}
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
                value={totalFee}
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

      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Vouchers List
          </Typography>
          <div className="w-full md:w-72">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Search vouchers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="voucher-search"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
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
            {voucherLoading ? (
              <tbody>
                {[1, 2, 3, 4, 5].map((index) => (
                  <tr key={index}>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-32"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-48"></div>
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
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                {records?.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item.voucherNumber}
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500"
                          onClick={() => handleViewDetails(item)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          className="bg-c-purple"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Button>
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
    </div>
  );
};

export default VoucherBody;
