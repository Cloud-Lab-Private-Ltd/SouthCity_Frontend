import { useEffect } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationsGet } from "../../features/GroupApiSlice";
import { BellIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, notificationLoading } = useSelector((state) => state.groupdata);
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(NotificationsGet());
  }, [dispatch]);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/sch/${id}/read`,
        {},
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.data) {
        dispatch(NotificationsGet());
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to mark notification as read",
        confirmButtonColor: "#5570F1",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/v1/sch/markAllNotificationsAsRead`,
        {},
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      if (response.data) {
        dispatch(NotificationsGet());
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to mark all notifications as read",
        confirmButtonColor: "#5570F1",
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNotificationClick = (notification) => {
    // Mark notification as read
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }
    
    // Navigate based on notification type
    if (notification.type === "ledger" && notification.sender && notification.sender._id) {
      navigate(`/student-ledger/${notification.sender._id}`);
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-[90vh] px-6 py-5">
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">NOTIFICATIONS</h2>
      </div>

      <Card className="overflow-hidden bg-white p-6">
        <div className="mb-6 flex justify-between items-center">
          <Typography className="text-xl font-semibold text-c-grays">
            All Notifications
          </Typography>
          <Button
            variant="text"
            color="blue"
            onClick={handleMarkAllAsRead}
            className="normal-case"
          >
            Mark all as read
          </Button>
        </div>

        {notificationLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-24 bg-gray-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : notifications?.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <Typography className="text-gray-500">
              No notifications found
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications?.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                  notification?.isRead ? 'bg-white' : 'bg-blue-50'
                } ${notification.type === "ledger" ? 'cursor-pointer' : ''}`}
                onClick={() => notification.type === "ledger" ? handleNotificationClick(notification) : null}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Typography className="font-semibold text-gray-900">
                        {notification?.subject}
                      </Typography>
                      {!notification?.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <Typography className="text-gray-600 text-sm mb-2">
                      {notification?.message}
                    </Typography>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>From: {notification?.sender?.Name || notification?.sender?.fullName || "System"}</span>
                      <span>•</span>
                      <span>{formatDate(notification?.createdAt)}</span>
                      {notification.type === "ledger" && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 hover:underline">
                            View Ledger
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <Button 
                      variant="text" 
                      size="sm" 
                      color="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification?._id);
                      }}
                    >
                      Mark as read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notification;
