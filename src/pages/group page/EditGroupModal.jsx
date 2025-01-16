import { useState, useEffect } from "react";
import { Button, Dialog, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "../../config/apiconfig";
import Swal from "sweetalert2";

const EditGroupModal = ({ open, handleOpen, groupData, token, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (groupData) {
      setName(groupData.name);
      setDescription(groupData.description);
    }
  }, [groupData]);

  const handleSubmit = () => {
    if (!name || !description) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please fill all the required fields",
        confirmButtonColor: "#5570F1",
      });
      return;
    }

    setLoading(true);
    axios
      .put(
        `${BASE_URL}/api/v1/sch/groups/${groupData._id}`,
        {
          name,
          description,
        },
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
          text: "Group updated successfully!",
          confirmButtonColor: "#5570F1",
        });
        setLoading(false);
        onSuccess();
        handleOpen();
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "Failed to update group",
          confirmButtonColor: "#5570F1",
        });
      });
  };

  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full p-6">
        <Typography variant="h5" className="mb-6 text-c-grays">
          Edit Group
        </Typography>

        <div className="space-y-6">
          <div>
            <label className="block text-c-grays text-sm font-medium mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              placeholder="Enter group name"
              autoComplete="off"
              autoFill="off"
              name="editGroupName"
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
              name="editGroupDesc"
              required
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button 
            variant="outlined"
            onClick={handleOpen}
            className="text-c-purple border-c-purple"
          >
            Cancel
          </Button>
          <Button 
            className="bg-c-purple"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-dots loading-lg"></span>
            ) : (
              "Update Group"
            )}
          </Button>
        </div>
      </Card>
    </Dialog>
  );
};

export default EditGroupModal;
