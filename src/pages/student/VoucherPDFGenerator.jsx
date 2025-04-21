import jsPDF from "jspdf"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons"

const VoucherPDFGenerator = ({ voucherData, formatDate, studentData }) => {
  const generateVoucherPDF = () => {
    const doc = new jsPDF("p", "mm", "a4")
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const voucherWidth = pageWidth / 2
    const voucherHeight = pageHeight / 2

    const copyTypes = ["Bank Copy", "Institute A/C Copy", "Application Form Copy", "Applicant Copy"]

    // Improved spacing constants
    const margin = 5
    const lineHeight = 5
    const fieldLabelWidth = 35 // Increased width for labels
    const headerFontSize = 7
    const normalFontSize = 6
    const smallFontSize = 5

    // Calculate fees based on payment percentage if it's a split voucher
    // Note: We don't adjust admission fee as it's already correct
    const calculateFee = (fee) => {
      if (voucherData.paymentPercentage && voucherData.paymentPercentage !== 100) {
        // Convert to number if it's a string
        const numericFee = typeof fee === 'string' ? parseFloat(fee) : fee;
        return Math.round(numericFee * voucherData.paymentPercentage / 100);
      }
      return fee;
    };

    // Keep admission fee as is
    const admissionFee = voucherData.admissionFee;
    
    // Calculate adjusted fees for other fee types
    const semesterFee = calculateFee(voucherData.semesterFee);
    const securityFee = calculateFee(voucherData.securityFee);
    const libraryFee = calculateFee(voucherData.libraryFee);
    
    // Use the voucher's total fee directly
    const totalFee = voucherData.totalFee;

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const xOffset = col * voucherWidth
        const yOffset = row * voucherHeight
        const copyIndex = row * 2 + col

        // Border around voucher (draw first so it's behind everything)
        doc.setDrawColor(0)
        doc.setLineWidth(0.3)
        doc.rect(xOffset + margin, yOffset + margin, voucherWidth - 2 * margin, voucherHeight - 2 * margin)

        // Header Section
        let currentY = yOffset + 8

        doc.setFontSize(headerFontSize)
        doc.setFont("helvetica", "bold")

        // Voucher number and copy type
        doc.text(`VNO: ${voucherData.voucherNumber}`, xOffset + margin + 5, currentY)
        doc.text(copyTypes[copyIndex], xOffset + voucherWidth - margin - 5, currentY, { align: "right" })

        currentY += lineHeight

        // Institute name
        doc.text("South City Healthcare Education Hub", xOffset + voucherWidth / 2, currentY, { align: "center" })

        currentY += lineHeight - 1

        doc.setFontSize(smallFontSize)
        doc.setFont("helvetica", "normal")
        doc.text("Pvt. Ltd. Clifton, Karachi.", xOffset + voucherWidth / 2, currentY, { align: "center" })

        currentY += lineHeight - 1

        doc.setFont("helvetica", "bold")
        doc.text("SCPTR", xOffset + voucherWidth / 2, currentY, {
          align: "center",
        })

        currentY += lineHeight - 1

        doc.setFont("helvetica", "normal")
        doc.text("United Bank Ltd", xOffset + voucherWidth / 2, currentY, {
          align: "center",
        })

        currentY += lineHeight - 1

        doc.text("Branch Name: Boat Basin", xOffset + voucherWidth / 2, currentY, { align: "center" })

        currentY += lineHeight - 1

        doc.text("Branch Code: 1212", xOffset + voucherWidth / 2, currentY, { align: "center" })

        currentY += lineHeight - 1

        doc.text("Account #: 2509114461", xOffset + voucherWidth / 2, currentY, { align: "center" })

        currentY += lineHeight + 1

        // Student Information Section
        doc.setFontSize(normalFontSize)

        // Function to add a field with label and value
        const addField = (label, value) => {
          doc.setFont("helvetica", "bold")
          doc.text(label, xOffset + margin + 2, currentY)

          // Draw line for the value
          doc.setLineWidth(0.1)
          doc.line(xOffset + margin + fieldLabelWidth, currentY, xOffset + voucherWidth - margin - 2, currentY)

          // Add value text 1mm above the line
          doc.setFont("helvetica", "normal")
          doc.text(value || "", xOffset + margin + fieldLabelWidth + 2, currentY - 1)

          currentY += lineHeight
        }

        // Add all student fields
        addField("Full Name", studentData?.fullName || "")
        addField("Father/Guardian Name", studentData?.fatherName || "")
        addField("CNIC", studentData?.nic || "")
        addField("Application No", studentData?.registrationId || "")
        addField("Enrollment Number", studentData?.enrollementNumber || "")
        addField("Semester", voucherData.monthOf || "")
        
        // Add payment percentage if it's a split voucher
        if (voucherData.paymentPercentage && voucherData.paymentPercentage !== 100) {
          addField("Payment Percentage", `${voucherData.paymentPercentage}%`)
          
          // Add parent voucher number if available
          if (voucherData.parentVoucherNumber) {
            addField("Parent Voucher", voucherData.parentVoucherNumber)
          }
        }
        
        addField("Created Date", formatDate(voucherData.createdAt) || "")
        addField("Due Date", formatDate(voucherData.dueDate) || "")

        // Fee Breakdown Section with full width background
        currentY += 1
        doc.setFillColor(220, 220, 220)
        doc.rect(xOffset + margin + 2, currentY - 3, voucherWidth - 2 * margin - 4, 5, "F")

        doc.setFont("helvetica", "bold")
        doc.text("Detail of Fee", xOffset + margin + 5, currentY)
        doc.text("Amount", xOffset + voucherWidth - margin - 20, currentY)

        currentY += lineHeight + 1

        // Create arrays for fee details and amounts using the calculated values
        const feeDetails = [];
        const feeAmounts = [];
        
        // Only add fees that are greater than 0
        if (admissionFee > 0) {
          feeDetails.push("Admission Fee");
          feeAmounts.push(admissionFee);
        }
        
        if (semesterFee > 0) {
          feeDetails.push("Semester Fee");
          feeAmounts.push(semesterFee);
        }
        
        if (securityFee > 0) {
          feeDetails.push("Security Deposit");
          feeAmounts.push(securityFee);
        }
        
        if (libraryFee > 0) {
          feeDetails.push("Library Charges");
          feeAmounts.push(libraryFee);
        }
        
        // Add total to the arrays
        feeDetails.push("Total");
        feeAmounts.push(totalFee);

        // Add fee details
        feeDetails.forEach((item, index) => {
          doc.setFont("helvetica", index === feeDetails.length - 1 ? "bold" : "normal")
          doc.text(item, xOffset + margin + 5, currentY)

          // Align amounts to the right
          doc.text(`Rs. ${feeAmounts[index]}`, xOffset + voucherWidth - margin - 20, currentY)

          currentY += lineHeight
        })

        // Amount in Words
        currentY += 2
        doc.setFont("helvetica", "bold")
        doc.text("In word:", xOffset + margin + 2, currentY)

        // Draw line for the value
        doc.line(xOffset + margin + fieldLabelWidth, currentY, xOffset + voucherWidth - margin - 2, currentY)

        doc.setFont("helvetica", "normal")
        doc.text(voucherData.inWordAmount || "", xOffset + margin + fieldLabelWidth + 2, currentY - 1)

        currentY += lineHeight + 2

        // Footer Section
        doc.text("Applicant Signature", xOffset + margin + 2, currentY)
        doc.line(xOffset + margin + 30, currentY, xOffset + voucherWidth - margin - 2, currentY)

        currentY += lineHeight + 2

        doc.text("Receiving Branch Stamp and Signature", xOffset + margin + 2, currentY)
        doc.line(xOffset + margin + 55, currentY, xOffset + voucherWidth - margin - 2, currentY)
      }
    }

    const pdfBlob = doc.output("blob")
    const pdfUrl = URL.createObjectURL(pdfBlob)
    window.open(pdfUrl, "_blank")
  }

  return (
    <button
      className="p-2 text-purple-500 hover:bg-purple-50 rounded flex items-center gap-2"
      title="View Voucher PDF"
      onClick={generateVoucherPDF}
    >
      <FontAwesomeIcon icon={faFileInvoice} />
      {/* <span>Generate Voucher</span> */}
    </button>
  )
}

export default VoucherPDFGenerator
