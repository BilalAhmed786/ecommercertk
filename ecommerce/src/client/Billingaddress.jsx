import React, { useEffect, useState } from "react";
import { MapPin, Mail, Phone, UserRound, Save, Loader2 } from "lucide-react";
import Sidebarmenu from "./component/Sidebarmenu";
import {useGetBillingaddressQuery,useUpdateBillingaddressMutation} from "../app/apiorders";


function Billingaddress(props) {
   
  const { data, isLoading } = useGetBillingaddressQuery(props.useremail);
  const [updateBillingaddress, { isLoading: isUpdating }] =
    useUpdateBillingaddressMutation();

  const [validation, stateValidation] = useState("");

  const [setvalue, userData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    console.log(data)
    if (data?.[0]) {
      userData(data[0]);
    }
  }, [data]);

  const handleBilling = (e) => {
    const { name, value } = e.target;

    userData((previous) => ({
      ...previous,
      [name]: value,
    }));

    stateValidation("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await updateBillingaddress(setvalue);

      if (result) {
        stateValidation(result.data);
      }
    } catch (error) {
      console.log(error);
      stateValidation("Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="billing-loading-page">
        <Loader2 className="billing-loader" size={32} />
        <span>Loading billing information...</span>
      </div>
    );
  }

  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />

      <main className="billing-page">
        <div className="billing-header">
          <div className="billing-title-wrapper">
            <div className="billing-title-icon">
              <MapPin size={23} />
            </div>

            <div>
              <h1>Billing Address</h1>
              <p>
                Manage the address and contact information used for your orders.
              </p>
            </div>
          </div>
        </div>

        <div className="billing-layout">
          <div className="billing-form-card">
            <div className="billing-card-header">
              <div>
                <h2>Address Information</h2>
                <p>Keep your billing details up to date.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="billing-form-grid">
                <div className="billing-form-group">
                  <label htmlFor="name">
                    <UserRound size={15} />
                    Full Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={setvalue?.name || ""}
                    onChange={handleBilling}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="billing-form-group">
                  <label htmlFor="email">
                    <Mail size={15} />
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={setvalue?.email || ""}
                    onChange={handleBilling}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="billing-form-group">
                  <label htmlFor="mobile">
                    <Phone size={15} />
                    Contact Number
                  </label>

                  <input
                    id="mobile"
                    type="text"
                    name="mobile"
                    value={setvalue?.mobile || ""}
                    onChange={handleBilling}
                    placeholder="Enter your contact number"
                  />
                </div>

                <div className="billing-form-group">
                  <label htmlFor="city">
                    <MapPin size={15} />
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={setvalue?.city || ""}
                    onChange={handleBilling}
                    placeholder="Enter your city"
                  />
                </div>

                <div className="billing-form-group billing-full-width">
                  <label htmlFor="address">
                    <MapPin size={15} />
                    Complete Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    rows="5"
                    value={setvalue?.address || ""}
                    onChange={handleBilling}
                    placeholder="Enter your complete billing address"
                  />
                </div>
              </div>

              {validation && (
                <div className="billing-message">
                  {validation}
                </div>
              )}

              <div className="billing-form-footer">
                <button
                  type="submit"
                  className="billing-save-btn"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={18} className="billing-button-loader" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update Address
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <aside className="billing-info-card">
            <div className="billing-info-icon">
              <MapPin size={25} />
            </div>

            <h3>Your Billing Address</h3>

            <p>
              Your billing information is used when processing your orders.
              Make sure your address and contact details are accurate.
            </p>

            <div className="billing-info-list">
              <div>
                <UserRound size={16} />
                <span>Accurate customer details</span>
              </div>

              <div>
                <Phone size={16} />
                <span>Valid contact number</span>
              </div>

              <div>
                <MapPin size={16} />
                <span>Complete delivery address</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Billingaddress;
