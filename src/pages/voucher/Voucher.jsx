import React from "react";
import VoucherBody from "./VoucherBody";

const VoucherPage = () => {

  return (
    <div>
      <div className="flex h-[100vh w-[100%]">
        <div className=" w-[100%] bg-c-back dark:bg-d-back min-h-[90vh] px-6 py-5 dash-body">
          <div>
            <VoucherBody />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherPage;
