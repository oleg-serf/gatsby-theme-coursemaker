import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";

const PaymentCancel = () => (
  <Layout>
    <div className="container">
      <h1>Payment Cancelled</h1>
      <Link to="/courses">Go to the courses</Link>
    </div>
  </Layout>
);

export default PaymentCancel;
