import { useRef, useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { MembersGet } from "../../features/GroupApiSlice";
import EditMemberModal from "./EditMemberModal";
import MemberDetailsModal from "./MemberDetailsModal";
import Select from "react-select";
import { allCountries } from "../../assets/json data/allCountries";

const MemberBody = () => {
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    password: "",
    address: "",
    nic: "",
    qulification: "",
    country: "",
    city: "",
    group: "",
    phoneNumber: "",
    gender: "",
    verified: true,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "profileImage") {
      setProfileImage(e.target.files[0]);
    } else if (e.target.name === "cv") {
      setCv(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (profileImage) formDataToSend.append("profileImage", profileImage);
    if (cv) formDataToSend.append("cv", cv);

    setLoading(true);
    axios
      .post(`${BASE_URL}/api/v1/sch/member`, formDataToSend, {
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Member created successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        dispatch(MembersGet());
        // Reset form
        setFormData({
          Name: "",
          email: "",
          password: "",
          address: "",
          nic: "",
          qulification: "",
          country: "",
          city: "",
          group: "",
          phoneNumber: "",
          gender: "",
          verified: true,
        });
        setProfileImage(null);
        setCv(null);
      })
      .catch((error) => {
        console.error("Error creating member:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to create member",
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
        name: "admin-delete-password",
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
          .delete(`${BASE_URL}/api/v1/sch/members/${id}`, {
            headers: {
              "x-access-token": token,
            },
            data: {
              adminPassword,
            },
          })
          .then((response) => {
            dispatch(MembersGet());
            return response;
          })
          .catch((error) => {
            Swal.showValidationMessage(
              error.response?.data?.message || "Failed to delete member"
            );
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Member has been deleted successfully",
          icon: "success",
          confirmButtonColor: "#5570F1",
        });
      }
    });
  };

  const [csvFile, setCSVFile] = useState(null);
  const fileInputRef = useRef(null);

  // Add bulk upload handler
  const handleBulkUpload = async () => {
    if (!csvFile) {
      Swal.fire({
        icon: "warning",
        title: "File Required",
        text: "Please select a CSV file",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", csvFile);

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/sch/import/member`,
        formData,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Members imported successfully!",
          confirmButtonColor: "#5570F1",
        });
        dispatch(MembersGet());
        setCSVFile(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Failed to import members",
        confirmButtonColor: "#5570F1",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    const action = currentStatus ? "verify" : "block";

    axios
      .patch(
        `${BASE_URL}/api/v1/sch/members/${id}/toggle-status`,
        { action },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then(() => {
        dispatch(MembersGet());
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to update status",
          confirmButtonColor: "#5570F1",
        });
      });
  };

  // Add these states
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);

  // Create country options
  const countryOptions = allCountries?.map((country) => ({
    value: country.name,
    label: country.name,
  }));

  // Handle country change
  const handleCountryChange = (selected) => {
    setSelectedCountry(selected);
    setFormData({
      ...formData,
      country: selected.value,
    });

    const country = allCountries?.find((c) => c.name === selected.value);
    const cities = country
      ? country.cities.map((city) => ({
          value: city,
          label: city,
        }))
      : [];
    setCityOptions(cities);
  };

  // Handle city change
  const handleCityChange = (selected) => {
    setFormData({
      ...formData,
      city: selected.value,
    });
  };

  const { permissions } = useSelector(
    (state) => state.profiledata?.profile?.member?.group || {}
  );
  const admin = useSelector(
    (state) => state.profiledata?.profile?.member?.group?.name
  );

  // Create a helper function to check permissions
  const checkPermission = (type) => {
    if (admin === "admins") return true;
    const memberPermission = permissions?.find((p) => p.pageName === "Member");
    return memberPermission?.[type] || false;
  };

  const { groups, members, memberLoading } = useSelector(
    (state) => state.groupdata
  );

  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = members?.members?.filter(
    (item) =>
      item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleOpen = () => setOpen(!open);

  const handleEdit = (member) => {
    setSelectedMember(member);
    handleOpen();
  };

  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null);

  const handleViewDetails = (member) => {
    setSelectedMemberDetails(member);
    setViewDetailsOpen(true);
  };

  const groupOptions = groups?.groups
    ?.filter((group) => group.name.toLowerCase() !== "students")
    .map((group) => (
      <option key={group._id} value={group._id}>
        {group.name}
      </option>
    ));

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredMembers?.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredMembers?.length / recordsPerPage);

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
      <EditMemberModal
        open={open}
        handleOpen={handleOpen}
        memberData={selectedMember}
        token={token}
        onSuccess={() => dispatch(MembersGet())}
      />

      <MemberDetailsModal
        open={viewDetailsOpen}
        handleOpen={() => setViewDetailsOpen(!viewDetailsOpen)}
        memberData={selectedMemberDetails}
      />

      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">MEMBERS</h2>
      </div>
      {(admin === "admins" || checkPermission("insert")) && (
        <Card className="p-6 mb-8 bg-white">
          <div className="mb-6 flex flex-col md:flex-row justify-between gap-4">
            <Typography className="text-xl font-semibold text-c-grays">
              Add New Member
            </Typography>
            <div className="flex flex-wrap gap-4 items-center">
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={(e) => setCSVFile(e.target.files[0])}
                className="hidden"
              />
              <Button
                className="bg-c-purple w-full md:w-auto"
                onClick={() => fileInputRef.current.click()}
              >
                Select CSV
              </Button>
              <Button
                className="bg-c-purple w-full h-[45px] flex items-center justify-center overflow-hidden md:w-auto"
                onClick={handleBulkUpload}
                disabled={loading || !csvFile}
              >
                {loading ? (
                  <span className="loading loading-dots loading-lg"></span>
                ) : (
                  "Import CSV"
                )}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Enter email"
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Enter password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Group *
                </label>
                <select
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                >
                  <option value="">Select group</option>
                  {groupOptions}
                </select>
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Enter address"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  NIC *
                </label>
                <input
                  type="text"
                  name="nic"
                  value={formData.nic}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Enter NIC"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Qualification *
                </label>
                <input
                  type="text"
                  name="qulification"
                  value={formData.qulification}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Enter qualification"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Country *
                </label>
                <Select
                  options={countryOptions}
                  onChange={handleCountryChange}
                  className="w-full"
                  placeholder="Select country"
                  required
                />
              </div>

              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  City *
                </label>
                <Select
                  options={cityOptions}
                  onChange={handleCityChange}
                  className="w-full"
                  placeholder="Select city"
                  isDisabled={!selectedCountry}
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Profile Image *
                </label>
                <input
                  type="file"
                  name="profileImage"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  CV *
                </label>
                <input
                  type="file"
                  name="cv"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                  required
                />
              </div>
              <div>
                <label className="block text-c-grays text-sm font-medium mb-2">
                  Verification Status
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="verified"
                    checked={formData.verified}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        verified: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-c-purple border-gray-300 rounded focus:ring-c-purple"
                  />
                  <span className="text-c-grays">Verified Member</span>
                </div>
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
                  "Add Member"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography className="text-xl font-semibold text-c-grays">
            Members List
          </Typography>
          <div className="w-full md:w-72">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
              name="member-search-unique"
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
                    Email
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Staff ID
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

            {memberLoading ? (
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
                      <div className="skeleton h-4 w-32"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-40"></div>
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
                        {item.Name}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item.email}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item.staffId}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {item.blocked ? "Blocked" : "Active"}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="flex gap-2">
                        {(admin === "admins" || checkPermission("update")) && (
                          <>
                            <Button
                              size="sm"
                              className={
                                item.blocked ? "bg-green-500" : "bg-red-500"
                              }
                              onClick={() =>
                                handleToggleStatus(item._id, item.blocked)
                              }
                            >
                              {item.blocked ? "Unblock" : "Block"}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-c-purple"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          className="bg-blue-500"
                          onClick={() => handleViewDetails(item)}
                        >
                          View Details
                        </Button>
                        {(admin === "admins" || checkPermission("delete")) && (
                          <Button
                            size="sm"
                            className="bg-red-500"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </Button>
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

export default MemberBody;
