import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/img/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar, 
  faUserPlus, 
  faFileInvoice, 
  faCommentDots, 
  faBook,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

export function Index({ isDrawerOpen, closeDrawer }) {
  const permissions = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.permissions || []
  );

  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name || []
  );

  const studentName = localStorage.getItem("groupName");
  const location = useLocation();
  const navigate = useNavigate();

  const studentpermissions = permissions[2]?.read;
  const bulkpermissions = permissions[4]?.read;
  const ledgerpermissions = permissions[3]?.read;


  // Close drawer when navigating on mobile
  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      closeDrawer();
    }
  };

  // Close drawer when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      if (isDrawerOpen && window.innerWidth < 768 && sidebar && !sidebar.contains(event.target)) {
        closeDrawer();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[999] transition-opacity duration-300 md:hidden ${
          isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDrawer}
      />

      {/* Sidebar */}
      <div 
        id="sidebar"
        className={`fixed top-0 left-0 h-screen w-[240px] md:w-[120px] bg-[#EBEBEB] dark:bg-d-back2 shadow-lg z-[1000] transition-transform duration-300 ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button row */}
          <div className="flex justify-between md:justify-center items-center pt-4 py-7 px-4">
            <img
              src={logo}
              alt="brand"
              className="h-[70px] cursor-pointer"
              onClick={() => handleNavigation("/")}
            />
            <button 
              className="md:hidden text-gray-700 hover:text-red-500"
              onClick={closeDrawer}
            >
              <FontAwesomeIcon icon={faTimes} className="text-3xl" />
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex flex-col gap-2 px-2 overflow-y-auto">
            {/* Dashboard */}
            <div 
              className={`flex flex-col items-center justify-center py-3 rounded-md cursor-pointer ${
                location.pathname === "/" 
                  ? "bg-red-500 text-white" 
                  : "text-gray-700 hover:bg-red-500 hover:text-white"
              } transition-all duration-300`}
              onClick={() => handleNavigation("/")}
            >
              <FontAwesomeIcon icon={faChartBar} className="text-xl mb-1" />
              <span className="text-xs font-medium text-center">Dashboard</span>
            </div>

            {/* Student */}
            {(admin === "admins" || studentpermissions) && (
              <div 
                className={`flex flex-col items-center justify-center py-3 rounded-md cursor-pointer ${
                  location.pathname === "/student" 
                    ? "bg-red-500 text-white" 
                    : "text-gray-700 hover:bg-red-500 hover:text-white"
                } transition-all duration-300`}
                onClick={() => handleNavigation("/student")}
              >
                <FontAwesomeIcon icon={faUserPlus} className="text-xl mb-1" />
                <span className="text-xs font-medium text-center">Student</span>
              </div>
            )}

            {/* Voucher */}
            {studentName === "Students" && (
              <div 
                className={`flex flex-col items-center justify-center py-3 rounded-md cursor-pointer ${
                  location.pathname === "/student-voucher" 
                    ? "bg-red-500 text-white" 
                    : "text-gray-700 hover:bg-red-500 hover:text-white"
                } transition-all duration-300`}
                onClick={() => handleNavigation("/student-voucher")}
              >
                <FontAwesomeIcon icon={faFileInvoice} className="text-xl mb-1" />
                <span className="text-xs font-medium text-center">Voucher</span>
              </div>
            )}

            {/* Bulk Message */}
            {(admin === "admins" || bulkpermissions) && (
              <div 
                className={`flex flex-col items-center justify-center py-3 rounded-md cursor-pointer ${
                  location.pathname === "/bulk-message" 
                    ? "bg-red-500 text-white" 
                    : "text-gray-700 hover:bg-red-500 hover:text-white"
                } transition-all duration-300`}
                onClick={() => handleNavigation("/bulk-message")}
              >
                <FontAwesomeIcon icon={faCommentDots} className="text-xl mb-1" />
                <span className="text-xs font-medium text-center">Bulk Message</span>
              </div>
            )}

            {/* Financial Ledger */}
            {(admin === "admins" || ledgerpermissions) && (
              <div 
                className={`flex flex-col items-center justify-center py-3 rounded-md cursor-pointer ${
                  location.pathname === "/ledger" 
                    ? "bg-red-500 text-white" 
                    : "text-gray-700 hover:bg-red-500 hover:text-white"
                } transition-all duration-300`}
                onClick={() => handleNavigation("/ledger")}
              >
                <FontAwesomeIcon icon={faBook} className="text-xl mb-1" />
                <span className="text-xs font-medium text-center">Financial Ledger</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
