import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ActivityDetector = () => {
  const navigate = useNavigate();

  const checkSessionTimeout = () => {
    const loginTime = localStorage.getItem("loginTime");
    if (loginTime) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - parseInt(loginTime);
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (timeDiff > twentyFourHours) {
        localStorage.clear();
        Swal.fire({
          title: "Session Expired",
          text: "Your session has expired. Please login again.",
          icon: "info",
          confirmButtonColor: "#F68B1F",
        }).then(() => {
          navigate("/login");
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkSessionTimeout, 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
};

export default ActivityDetector;
