import React from "react";
import BulkMessageBody from "./BulkMessageBody";

const BulkMessagePage = () => {
  return (
    <div>
      <div className="flex h-[100vh w-[100%]">
        <div className=" w-[100%] bg-c-back dark:bg-d-back min-h-[90vh] px-6 py-5 dash-body">
          <div>
            <BulkMessageBody />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkMessagePage;
