import { useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { StatusesGet } from "../../features/GroupApiSlice";
import EditStatusModal from "./EditStatusModal";

const StatusBody = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const defaultStatuses = ["Active", "Inactive", "Paid", "Pending","Processing","unpaid"];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name) {
      Swal.fire({
        icon: "warning",
        title: "Required Field",
        text: "Please enter status name",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    setLoading(true);
    axios
      .post(
        `${BASE_URL}/api/v1/sch/statuses`,
        { name },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Status created successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        dispatch(StatusesGet());
        setName("");
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to create status",
          confirmButtonColor: "#5570F1",
        });
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Enter Admin Password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Enter admin password",
        autocomplete: "new-password",
        name: "status-admin-delete-password",
      },
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#5570F1",
      cancelButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: (adminPassword) => {
        if (!adminPassword) {
          Swal.showValidationMessage("Please enter admin password");
          return false;
        }
        return axios
          .delete(`${BASE_URL}/api/v1/sch/statuses/${id}`, {
            headers: {
              "x-access-token": token,
            },
            data: {
              adminPassword,
            },
          })
          .then((response) => {
            dispatch(StatusesGet());
            return response;
          })
          .catch((error) => {
            Swal.showValidationMessage(
              error.response?.data?.message || "Failed to delete status"
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Status has been deleted successfully",
          icon: "success",
          confirmButtonColor: "#5570F1",
        });
      }
    });
  };

  const { statuses, statusLoading } = useSelector((state) => state.groupdata);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStatuses = statuses?.statuses?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleOpen = () => setOpen(!open);

  const handleEdit = (status) => {
    setSelectedStatus(status);
    handleOpen();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredStatuses?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredStatuses?.length / recordsPerPage);

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

  const { permissions } = useSelector(
    (state) => state.profiledata?.profile?.member?.group || {}
  );
  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name
  );

  // Add permission check function
  const checkPermission = (type) => {
    if (admin === "admins") return true;
    const statusPermission = permissions?.find((p) => p.pageName === "Status");
    return statusPermission?.[type] || false;
  };

  return (
    <div className="bg-[#F5F5F5]">
      <EditStatusModal
        open={open}
        handleOpen={handleOpen}
        statusData={selectedStatus}
        token={token}
        onSuccess={() => dispatch(StatusesGet())}
      />

      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">STATUS</h2>
      </div>
      {(admin === "admins" || checkPermission("insert")) && (
        <Card className="p-6 mb-8 bg-white">
          <div className="mb-6">
            <Typography className="text-xl font-semibold text-c-grays">
              Add Status
            </Typography>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Enter status name"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="bg-c-purple h-[45px] overflow-hidden flex items-center justify-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : (
                  "Add Status"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Status List
          </Typography>
          <div className="w-full md:w-72">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Search status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="status-search"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Name
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            {statusLoading ? (
              <tbody>
                {[1, 2, 3, 4, 5].map((index) => (
                  <tr key={index}>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-48"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex gap-2">
                        <div className="skeleton h-8 w-16"></div>
                        <div className="skeleton h-8 w-16"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                {records?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item.name}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex gap-2">
                        {!defaultStatuses.includes(item.name) && (
                          <>
                            {(admin === "admins" ||
                              checkPermission("update")) && (
                              <Button
                                size="sm"
                                className="bg-c-purple"
                                onClick={() => handleEdit(item)}
                              >
                                Edit
                              </Button>
                            )}
                            {(admin === "admins" ||
                              checkPermission("delete")) && (
                              <Button
                                size="sm"
                                className="bg-red-500"
                                onClick={() => handleDelete(item._id)}
                              >
                                Delete
                              </Button>
                            )}
                          </>
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
    </div>
  );
};

export default StatusBody;
