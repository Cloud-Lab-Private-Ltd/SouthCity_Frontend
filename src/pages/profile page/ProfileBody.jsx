import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import ProfileField from "./ProfileFeild";

const ProfileBody = () => {
  const { profile } = useSelector((state) => state.profiledata);


  return (
    <div>
      <Card className="h-min-[80vh] w-full dark:bg-d-back2">
        <CardHeader floated={false} shadow={false} className="rounded-none dark:bg-d-back2">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray" className="dark:text-d-text">
                Profile
              </Typography>
              <Typography color="gray" className="mt-1 font-normal dark:text-gray-500">
                See information your profile
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <ProfileField />
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="grid xl:grid-cols-1 grid-cols-1">
            <div className="grid grid-cols-2 border-b-[1px] border-gray-300 py-4 px-3 text-md">
              <div className="w-full text-start">
                <h4 className="text-black font-semibold dark:text-d-text">Name</h4>
              </div>
              <div className="w-full text-end dark:text-d-text">
                <h4>{profile?.username}</h4>
              </div>
            </div>
          </div>
          <div className="grid xl:grid-cols-1 grid-cols-1">
            <div className="grid grid-cols-2 border-b-[1px] border-gray-300 py-4 px-3 text-md dark:text-d-text">
              <div className="w-full text-start">
                <h4 className="text-black font-semibold dark:text-d-text">Email Address</h4>
              </div>
              <div className="w-full text-end">
                <h4>{profile?.email}</h4>
              </div>
            </div>
          </div>
          <div className="grid xl:grid-cols-1 grid-cols-1">
            <div className="grid grid-cols-2 border-b-[1px] border-gray-300 py-4 px-3 text-md dark:text-d-text">
              <div className="w-full text-start">
                <h4 className="text-black font-semibold dark:text-d-text">Phone Number</h4>
              </div>
              <div className="w-full text-end">
                <h4>{profile?.phone_number}</h4>
              </div>
            </div>
          </div>
          <div className="grid xl:grid-cols-1 grid-cols-1">
            <div className="grid grid-cols-2 border-b-[1px] border-gray-300 py-4 px-3 text-md dark:text-d-text">
              <div className="w-full text-start">
                <h4 className="text-black font-semibold dark:text-d-text">Role Name</h4>
              </div>
              <div className="w-full text-end">
                <h4>{profile?.role?.role_name}</h4>
              </div>
            </div>
          </div>
          {/* <div className="grid xl:grid-cols-1 grid-cols-1">
            <div className="grid grid-cols-2 border-b-[1px] border-gray-300 py-4 px-3 text-md">
              <div className="w-full text-start">
                <h4 className="text-black font-semibold">Permissions</h4>
              </div>
              <div className="w-full grid lg:grid-cols-4 grid-cols-2 overflow-hidden">
                {profile?.role?.permissions?.map((items, index) => {
                 return <h4 key={index}>{items}</h4>;
                })}
              </div>
            </div>
          </div> */}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileBody;
