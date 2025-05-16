import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AreaChartHero } from "./AreaChart";
import StudentFeeLedger from "./StudentFeeLedger";
import AdminDashboard from "./AdminDashboard";
import doctorImage from "../../assets/img/doctor.png"; // Add this image to your assets folder
import nurseImage from "../../assets/img/nurse.png"; // Add this image to your assets folder
import backImg from "../../assets/img/backgorund-card.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHospital } from "@fortawesome/free-solid-svg-icons";

const DashCard = () => {
  const navigate = useNavigate();
  const { groups, members, batches, courses, students } = useSelector(
    (state) => state.groupdata
  );

  const permissions = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.permissions || []
  );

  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name || []
  );

  // Check permissions for different modules
  const coursepermissions = permissions[0]?.read;
  const batchpermissions = permissions[1]?.read;
  const studentpermissions = permissions[2]?.read;
  const ledgerpermissions = permissions[3]?.read;
  const bulkpermissions = permissions[4]?.read;

  const { vouchers } = useSelector((state) => state.profiledata);
  const studentName = localStorage.getItem("groupName");

  // Filter out vouchers where isSplit is true
  const filteredVouchers = vouchers ? vouchers.filter((v) => !v.isSplit) : [];

  return (
    <div>
      {/* Enhanced Header Banner */}
      <div
        className="relative rounded-xl overflow-hidden shadow-lg mb-6"
        style={{
          backgroundImage: `url(${backImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "180px",
        }}
      >
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/70 via-red-600/40 to-red-600/70"></div>

        {/* Left side doctor image - hidden on mobile */}
        <div className="absolute left-0 bottom-0 h-full hidden md:flex items-end">
          <img
            src={doctorImage}
            alt="Doctor"
            className="h-[160px] object-contain"
          />
        </div>

        {/* Right side nurse image - hidden on mobile
        <div className="absolute right-0 bottom-0 h-full hidden md:flex items-end">
          <img
            src={nurseImage}
            alt="Medical Staff"
            className="h-[160px] object-contain"
          />
        </div> */}

        {/* Center content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white rounded-full p-3 h-14 w-14 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faHospital}
                className="text-red-600 text-2xl"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center drop-shadow-lg">
            South city Health Care Education Hub Pvt Ltd
          </h1>
          <h2 className="text-lg text-white text-center drop-shadow-lg">
            Fees Management System
          </h2>
        </div>
      </div>
      {studentName === "Students" ? (
        <>
          {/* Use the StudentFeeLedger component with filtered vouchers */}
          {studentName === "Students" &&
            filteredVouchers &&
            filteredVouchers.length > 0 && (
              <StudentFeeLedger vouchers={filteredVouchers} />
            )}
        </>
      ) : (
        <AdminDashboard
          groups={groups}
          members={members}
          batches={batches}
          courses={courses}
          students={students}
          admin={admin}
          batchpermissions={batchpermissions}
          coursepermissions={coursepermissions}
          studentpermissions={studentpermissions}
          ledgerpermissions={ledgerpermissions}
          bulkpermissions={bulkpermissions}
        />
      )}

      {admin === "admins" ? (
        <>
          <div className="bg-white rounded-xl shadow-sm mt-6 p-6">
            <AreaChartHero />
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default DashCard;
