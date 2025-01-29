import { useState, useEffect } from "react";
import { Card, Typography, Button, Checkbox } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { GroupGet, PermissionsGet } from "../../features/GroupApiSlice";
import Select from "react-select";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import EditPermissionModal from "./EditPermissionModal";

const PermissionBody = () => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.groupdata);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [permissions, setPermissions] = useState([
    // {
    //   pageName: "Member",
    //   insert: false,
    //   update: false,
    //   delete: false,
    //   read: false,
    // },
    {
      pageName: "Course",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Batch",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Student",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Voucher",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Action Log",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Bulk Message",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Degree Type",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
    {
      pageName: "Status",
      insert: false,
      update: false,
      delete: false,
      read: false,
    },
  ]);

  const groupOptions = groups?.groups?.filter(
    group => group.name.toLowerCase() !== "students"
  ).map(group => ({
    value: group._id,
    label: group.name
  }));

  const handlePermissionChange = (pageIndex, field) => {
    setPermissions((prevPermissions) => {
      const newPermissions = [...prevPermissions];
      newPermissions[pageIndex] = {
        ...newPermissions[pageIndex],
        [field]: !newPermissions[pageIndex][field],
      };
      return newPermissions;
    });
  };

  const handleSubmit = async () => {
    if (!selectedGroup) {
      Swal.fire({
        icon: "warning",
        title: "Group Required",
        text: "Please select a group",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/permissions`,
        {
          group: selectedGroup.value,
          permissions: permissions,
        },
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
          text: "Permissions set successfully!",
          confirmButtonColor: "#5570F1",
        });
        setSelectedGroup(null);
        dispatch(PermissionsGet());

        setPermissions([
          // {
          //   pageName: "Member",
          //   insert: false,
          //   update: false,
          //   delete: false,
          //   read: false,
          // },
          {
            pageName: "Course",
            insert: false,
            update: false,
            delete: false,
            read: false,
          },
          {
            pageName: "Batch",
            insert: false,
            update: false,
            delete: false,
            read: false,
          },
          {
            pageName: "Student",
            insert: false,
            update: false,
            delete: false,
            read: false,
          },
          {
            pageName: "Voucher",
            insert: false,
            update: false,
            delete: false,
            read: false,
          },
          {
            pageName: "Action Log",
            insert: false,
            update: false,
            delete: false,
            read: false,
          },
          {
            pageName: "Bulk Message",
            insert: false,
            update: false,
            delete: false,
            read: false,
          },
          {
            pageName: "Degree Type",
            insert: false,
            update: false,
            delete: false,
            read: false,
          },
          {
            pageName: "Status",
            insert: false,
            update: false,
            delete: false,
            read: false,
          },
        ]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to set permissions",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Enter Admin Password",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Enter admin password",
        autocomplete: "new-password",
        name: "permission-admin-delete-password",
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
          .delete(`${BASE_URL}/api/v1/sch/permissions/${id}`, {
            headers: {
              "x-access-token": token,
            },
            data: {
              adminPassword,
            },
          })
          .then((response) => {
            dispatch(PermissionsGet());
            return response;
          })
          .catch((error) => {
            Swal.showValidationMessage(
              error.response?.data?.message || "Failed to delete permission"
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Permission has been deleted successfully",
          icon: "success",
          confirmButtonColor: "#5570F1",
        });
      }
    });
  };

  const { permissionsList, permissionsLoading } = useSelector(
    (state) => state.groupdata
  );

  const [filterGroup, setFilterGroup] = useState(null);

  // Filter the permissions based on selected group
  const filteredPermissions = permissionsList?.permissions?.filter(
    (item) => !filterGroup || item.group._id === filterGroup.value
  );

  const [open, setOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  const handleOpen = () => setOpen(!open);

  const handleEdit = (permission) => {
    setSelectedPermission(permission);
    handleOpen();
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <EditPermissionModal
        open={open}
        handleOpen={handleOpen}
        permissionData={selectedPermission}
        onSuccess={() => dispatch(PermissionsGet())}
      />

      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">
          Permissions
        </h2>
      </div>
      <Card className="p-6 bg-white">
        <div className="space-y-6">
          <div>
            <Typography className="text-c-grays font-medium mb-2">
              Select Group
            </Typography>
            <Select
              options={groupOptions}
              value={selectedGroup}
              onChange={setSelectedGroup}
              className="text-c-grays"
              
            />
          </div>

          <div className="space-y-8 h-[400px] overflow-y-auto">
            {permissions.map((page, pageIndex) => (
              <div key={page.pageName} className="border p-4 rounded-lg">
                <Typography className="text-lg font-medium text-c-grays mb-4">
                  {page.pageName}
                </Typography>
                <div className="flex flex-wrap gap-6">
                  <Checkbox
                    checked={page.read}
                    onChange={() => handlePermissionChange(pageIndex, "read")}
                    label="Read"
                    className="text-c-purple"
                  />
                  <Checkbox
                    checked={page.insert}
                    onChange={() => handlePermissionChange(pageIndex, "insert")}
                    label="Insert"
                    className="text-c-purple"
                  />
                  <Checkbox
                    checked={page.update}
                    onChange={() => handlePermissionChange(pageIndex, "update")}
                    label="Update"
                    className="text-c-purple"
                  />
                  <Checkbox
                    checked={page.delete}
                    onChange={() => handlePermissionChange(pageIndex, "delete")}
                    label="Delete"
                    className="text-c-purple"
                  />
                </div>
              </div>
            ))}
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
                "Save Permissions"
              )}
            </Button>
          </div>
        </div>
      </Card>
      <Card className="overflow-hidden min-h-[50vh] bg-white mt-6">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Permissions List
          </Typography>
          <div className="w-full md:w-72">
            <Select
              options={groupOptions}
              value={filterGroup}
              onChange={setFilterGroup}
              isClearable
              placeholder="Filter by group..."
              className="text-c-grays"
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
                {/* <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Page Name
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Permissions
                  </Typography>
                </th> */}
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Action
                  </Typography>
                </th>
              </tr>
            </thead>
            {permissionsLoading ? (
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
                      <div className="skeleton h-4 w-72"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-72"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                {filteredPermissions?.map((item, index) => (
                  <tr key={`${item._id}-${index}`} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item.group.name}
                      </Typography>
                    </td>

                    <td className="p-4 border-b border-gray-100 flex gap-3">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PermissionBody;
