import React from "react";
import SectionLayout from "../Layouts/SectionLayout";

const PaymentsPaypal = ({ data, setData, changes, setChanges }) => {
  return (
    <div className="scroll-mt-[120px]" id="paypal">
      <SectionLayout
        heading="Account Information"
        subHeading="Manage your personal information, and control what information other people may access"
      >
        <div className="grid grid-cols-2 gap-6">
          <div className="input-md input-no-error">
            <label
              htmlFor="paypalId"
              className=""
            >
              Enter your Paypal Id*
            </label>
            <input
              type="text"
              id="paypalId"
              name="paypalId"
              placeholder="Enter your paypal id"
              className={""}
              value={""}
              // onChange={(event) => {
              //   if (!changesToThePage) setChangesToThePage(true);
              //   setData((current) => ({
              //     ...current,
              //     fullName: event.target.value,
              //   }));
              // }}
            />
          </div>
          <div className="input-md input-no-error">
            <label
              htmlFor="postalAddress"
              className=""
            >
              Postal Address*
            </label>
            <input
              type="text"
              id="postalAddress"
              name="postalAddress"
              placeholder="Enter your postal address"
              className={""}
              value={""}
              // onChange={(event) => {
              //   if (!changesToThePage) setChangesToThePage(true);
              //   setData((current) => ({
              //     ...current,
              //     fullName: event.target.value,
              //   }));
              // }}
            />
          </div>
        </div>
        <button
          className={`w-fit button-md-2 ${
            changes ? "button-primary" : "button-inactive"
          }`}
        >
          Save changes
        </button>
      </SectionLayout>
    </div>
  );
};

export default PaymentsPaypal;
