import { Dialog, Card, Typography, Button } from "@material-tailwind/react";

const MemberDetailsModal = ({ open, handleOpen, memberData }) => {
  return (
    <Dialog
      size="xl"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5" className="text-c-grays">
            Member Details
          </Typography>
          <button
            onClick={handleOpen}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <div className="flex gap-4">
              <div>
                <img
                  src={memberData?.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{memberData?.Name}</h3>
                <p className="text-gray-600">{memberData?.email}</p>
                <p className="text-gray-600">Staff ID: {memberData?.staffId}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Personal Information</h4>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Gender:</span>{" "}
                {memberData?.gender}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {memberData?.phoneNumber}
              </p>
              <p>
                <span className="font-medium">NIC:</span> {memberData?.nic}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Professional Information</h4>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Qualification:</span>{" "}
                {memberData?.qualification}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {memberData?.verified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Location</h4>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Address:</span>{" "}
                {memberData?.address}
              </p>
              <p>
                <span className="font-medium">City:</span> {memberData?.city}
              </p>
              <p>
                <span className="font-medium">Country:</span>{" "}
                {memberData?.country}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Group Information</h4>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Group Name:</span>{" "}
                {memberData?.group?.name}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {memberData?.group?.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Documents</h4>
            <div className="space-y-2">
              <a
                href={memberData?.cv}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View CV
              </a>
            </div>
          </div>
        </div>
      </Card>
    </Dialog>
  );
};

export default MemberDetailsModal;
