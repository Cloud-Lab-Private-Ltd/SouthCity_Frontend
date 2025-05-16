import { useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { GroupGet } from "../../features/GroupApiSlice";
import EditGroupModal from "./EditGroupModal";

const GroupBody = () => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!groupName || !description) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please fill all the required fields",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    setLoading1(true);
    axios
      .post(
        `${BASE_URL}/api/v1/sch/group`,
        {
          name: groupName,
          description: description,
        },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((res) => {
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Group created successfully!",
            confirmButtonColor: "#5570F1",
          });
          dispatch(GroupGet());
          setGroupName("");
          setDescription("");
          setLoading1(false);
        }
      })
      .catch((error) => {
        console.log("create group error", error);
        setLoading1(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
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
        name: "group-admin-delete-password",
      },
      showCancelButton: true,
      confirmButtonText: "Next",
      confirmButtonColor: "#5570F1",
      cancelButtonColor: "#d33",
      showLoaderOnConfirm: true,
      preConfirm: (adminPassword) => {
        if (!adminPassword) {
          Swal.showValidationMessage("Please enter admin password");
          return false;
        }
        // Store the password for the next step
        return adminPassword;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        // Second confirmation step
        Swal.fire({
          title: "Permanent Deletion",
          text: "This group will be permanently deleted. This action cannot be undone. Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel",
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
        }).then((finalResult) => {
          if (finalResult.isConfirmed) {
            // Now proceed with the actual deletion
            Swal.showLoading();
            axios
              .delete(`${BASE_URL}/api/v1/sch/groups/${id}`, {
                headers: {
                  "x-access-token": token,
                },
                data: {
                  adminPassword: result.value, // Use the password from the first step
                },
              })
              .then((response) => {
                dispatch(GroupGet());
                Swal.fire({
                  title: "Deleted!",
                  text: "Group has been deleted successfully",
                  icon: "success",
                  confirmButtonColor: "#5570F1",
                });
              })
              .catch((error) => {
                Swal.fire({
                  title: "Error!",
                  text:
                    error.response?.data?.message || "Failed to delete group",
                  icon: "error",
                  confirmButtonColor: "#5570F1",
                });
              });
          }
        });
      }
    });
  };

  const { groups, loading } = useSelector((state) => state.groupdata);


  const handleOpen = () => setOpen(!open);

  const handleEdit = (group) => {
    setSelectedGroup(group);
    handleOpen();
  };

  const filteredGroups = groups?.groups
    ?.filter(
      (item) =>
        item.name.toLowerCase() !== "students" &&
        item.description.toLowerCase() !== "group for students"
    )
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredGroups?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredGroups?.length / recordsPerPage);

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
      <EditGroupModal
        open={open}
        handleOpen={handleOpen}
        groupData={selectedGroup}
        token={token}
        onSuccess={() => dispatch(GroupGet())}
      />
      {/* Form Section */}
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">
          GROUP / ROLE
        </h2>
      </div>

      <Card className="p-6 mb-8 bg-white">
        <div className="mb-6">
          <Typography className="text-xl font-semibold text-c-grays">
            Add Group Role
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter group name"
              autoComplete="off"
              autoFill="off"
              name="groupName" // Unique name
              required
            />
          </div>
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter description"
              autoComplete="off"
              autoFill="off"
              name="groupDesc" // Unique name
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-c-purple h-[45px] overflow-hidden flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading1}
          >
            {loading1 ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Add Group"
            )}
          </Button>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Groups List
          </Typography>
          <div className="w-full md:w-72">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="group-search-unique"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Group Name
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Description
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Actions
                  </Typography>
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                {[1, 2, 3, 4, 5].map((index) => (
                  <tr key={index}>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-48"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-72"></div>
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
                        {item?.name}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item?.description}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      {item?.name !== "finance" &&
                        item?.name !== "Coordinator" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-c-purple"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-500"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
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

export default GroupBody;
