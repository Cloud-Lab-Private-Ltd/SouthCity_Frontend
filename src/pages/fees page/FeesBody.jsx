import { useState } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
// import axios from "axios";
// import { BASE_URL } from "../../config/apiconfig";
// import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { FeesGet } from "../../features/GroupApiSlice";
import EditFeesModal from "./EditFeesModal";

const FeesBody = () => {
  //   const [feeName, setFeeName] = useState("");
  //   const [amount, setAmount] = useState("");
  //   const [feeType, setFeeType] = useState("");
  //   const [description, setDescription] = useState("");
  //   const [loading, setLoading] = useState(false);
  //   const token = localStorage.getItem("token");
  const { fees, feesLoading } = useSelector((state) => state.groupdata);
  const dispatch = useDispatch();

  //   const handleSubmit = async () => {
  //     if (!amount || !feeType) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Required Fields",
  //         text: "Please fill all the required fields",
  //         confirmButtonColor: "#5570F1",
  //       });
  //       return;
  //     }

  //     setLoading(true);
  //     try {
  //       const response = await axios.post(
  //         `${BASE_URL}/api/v1/sch/fees/create`,
  //         {
  //           feeName,
  //           amount: Number(amount),
  //           feeType,
  //           description,
  //         },
  //         {
  //           headers: {
  //             "x-access-token": token,
  //           },
  //         }
  //       );

  //       if (response.data) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Success",
  //           text: "Fee created successfully!",
  //           confirmButtonColor: "#5570F1",
  //         });
  //         // Reset form
  //         setFeeName("");
  //         setAmount("");
  //         setFeeType("");
  //         setDescription("");
  //         dispatch(FeesGet());
  //       }
  //     } catch (error) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: error.response?.data?.message || "Failed to create fee",
  //         confirmButtonColor: "#5570F1",
  //       });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  const handleEdit = (fee) => {
    setSelectedFee(fee);
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    dispatch(FeesGet());
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
    const batchPermission = permissions?.find((p) => p.pageName === "Fees");
    return batchPermission?.[type] || false;
  };

  return (
    <div className="bg-[#F5F5F5]">
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">FEES</h2>
      </div>

      {/* <Card className="p-6 mb-8 bg-white">
        <div className="mb-6">
          <Typography className="text-xl font-semibold text-c-grays">
            Add Fee
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Amount *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Fee Type *
            </label>
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              required
            >
              <option value="">Select Fee Type</option>
              <option value="academic">Academic Fee</option>
              <option value="security">Security Fee</option>
              <option value="library">Library Fee</option>
              <option value="semester">Semester Fee</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-c-purple h-[45px] overflow-hidden flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Add Fee"
            )}
          </Button>
        </div>
      </Card> */}

      <Card className="overflow-hidden bg-white">
        <div className="p-6">
          <Typography className="text-xl font-semibold text-c-grays mb-6">
            Fees List
          </Typography>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Fee Type
                    </Typography>
                  </th>
                  <th className="p-4 border-b border-gray-100">
                    <Typography className="text-c-grays font-semibold">
                      Amount
                    </Typography>
                  </th>
                  {(admin === "admins" || checkPermission("update")) && (
                    <th className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays font-semibold">
                        Actions
                      </Typography>
                    </th>
                  )}
                </tr>
              </thead>
              {feesLoading ? (
                <tbody>
                  {[1, 2, 3].map((index) => (
                    <tr key={index}>
                      <td className="p-4 border-b border-gray-100">
                        <div className="skeleton h-4 w-48"></div>
                      </td>

                      <td className="p-4 border-b border-gray-100">
                        <div className="skeleton h-4 w-24"></div>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <div className="skeleton h-8 w-16"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  {fees?.map((fee) => (
                    <tr key={fee._id} className="hover:bg-gray-50">
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays capitalize">
                          {fee.feeType}
                        </Typography>
                      </td>
                      <td className="p-4 border-b border-gray-100">
                        <Typography className="text-c-grays">
                          Rs. {fee.amount.toLocaleString()}
                        </Typography>
                      </td>

                      {(admin === "admins" || checkPermission("update")) && (
                        <td className="p-4 border-b border-gray-100">
                          <Button
                            size="sm"
                            className="bg-c-purple"
                            onClick={() => handleEdit(fee)}
                          >
                            Edit
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </Card>

      <EditFeesModal
        open={editModalOpen}
        handleOpen={() => setEditModalOpen(!editModalOpen)}
        feeData={selectedFee}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default FeesBody;
