import { useState, useEffect } from "react";
import { Card, Typography, Button, Checkbox } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { GroupGet } from "../../features/GroupApiSlice";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";

const BulkMessageBody = () => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.groupdata);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [formData, setFormData] = useState({
    groups: [], // Initialize as empty array
    recipients: [],
    subject: "",
    message: "",
    sendEmail: true,
    sendNotification: true,
    allGroups: false,
  });

  useEffect(() => {
    dispatch(GroupGet());
  }, [dispatch]);

  const groupOptions = groups?.groups?.map((group) => ({
    value: group._id,
    label: group.name,
    students: group.students,
    members: group.members,
  }));

  const getRecipientOptions = () => {
    if (!selectedGroup) return [];

    if (selectedGroup.label === "Students") {
      return selectedGroup.students.map((student) => ({
        value: student._id,
        label: `${student.fullName} (${student.registrationId})`,
        email: student.email,
      }));
    } else {
      return selectedGroup.members.map((member) => ({
        value: member._id,
        label: `${member.Name} (${member.staffId})`,
        email: member.email,
      }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.subject ||
      !formData.message ||
      (!formData.allGroups && !formData.groups)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please fill all required fields",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/sendBulk`,
        formData,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Bulk message sent successfully!",
          confirmButtonColor: "#5570F1",
        });
        setFormData({
          groups: "",
          recipients: [],
          subject: "",
          message: "",
          sendEmail: true,
          sendNotification: true,
          allGroups: false,
        });
        setSelectedGroup(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to send bulk message",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
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
    const bulkMessagePermission = permissions?.find(
      (p) => p.pageName === "Bulk Message"
    );
    return bulkMessagePermission?.[type] || false;
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">
          Bulk Message
        </h2>
      </div>
      {(admin === "admins" || checkPermission("insert")) && (
        <Card className="p-6 bg-white">
          <div className="space-y-6">
            <div>
              <Typography className="text-c-grays font-medium mb-2">
                Send to All Groups
              </Typography>
              <Checkbox
                checked={formData.allGroups}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    allGroups: e.target.checked,
                    groups: [], // Initialize as empty array instead of empty string
                    recipients: [],
                  });
                  setSelectedGroup(null);
                }}
                label="Send to all groups"
                className="text-c-purple"
              />
            </div>

            {!formData.allGroups && (
              <>
                <div>
                  <Typography className="text-c-grays font-medium mb-2">
                    Select Group
                  </Typography>
                  <Select
                    options={groupOptions}
                    value={groupOptions?.find((option) =>
                      formData.groups.includes(option.value)
                    )}
                    onChange={(selected) => {
                      setFormData({
                        ...formData,
                        groups: [selected.value], // Wrap the value in an array
                        recipients: [],
                      });
                      setSelectedGroup(selected);
                    }}
                    styles={{
                      input: (base) => ({
                        ...base,
                        "input:focus": {
                          boxShadow: "none",
                        },
                      }),
                    }}
                    className="text-c-grays"
                  />
                </div>

                {selectedGroup && (
                  <div>
                    <Typography className="text-c-grays font-medium mb-2">
                      Select Recipients
                    </Typography>
                    <Select
                      isMulti
                      options={getRecipientOptions()}
                      value={getRecipientOptions().filter((option) =>
                        formData.recipients.includes(option.value)
                      )}
                      onChange={(selected) => {
                        setFormData({
                          ...formData,
                          recipients: selected.map((item) => item.value),
                        });
                      }}
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
                )}
              </>
            )}

            <div>
              <Typography className="text-c-grays font-medium mb-2">
                Subject *
              </Typography>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subject: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                placeholder="Enter message subject"
              />
            </div>

            <div>
              <Typography className="text-c-grays font-medium mb-2">
                Message *
              </Typography>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                placeholder="Enter your message"
              />
            </div>

            <div className="flex gap-6">
              <Checkbox
                checked={formData.sendEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sendEmail: e.target.checked,
                  })
                }
                label="Send Email"
                className="text-c-purple"
              />
              <Checkbox
                checked={formData.sendNotification}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sendNotification: e.target.checked,
                  })
                }
                label="Send Notification"
                className="text-c-purple"
              />
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-c-purple h-[45px] flex items-center justify-center"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BulkMessageBody;
