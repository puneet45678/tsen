import { useState, useEffect } from "react";
import axios from "axios";
import SectionLayout from "../Layouts/SectionLayout";
import PaymentsPaypal from "./PaymentsPaypal";

const Payments = ({paymentRef}) => {


  return (
    <div className="flex flex-col gap-[24px] w-full " ref={paymentRef}>
      <PaymentsPaypal data={{}} setData={{}} changes={""} setChanges={{}} />
    </div>
  );
};

export default Payments;
