import React, { useEffect, useState } from 'react';
import {
  Truck,
  Save,
  RefreshCw,
  CircleDollarSign,
} from 'lucide-react';
import { toast } from 'react-toastify';

import Sidebarmenu from './component/Sidebarmenu';
import {
  useUpdateShipmentMutation,
  useGetShipmentQuery,
} from '../app/apiproducts';


function Shipment() {
  const [postshipment, { isLoading: isUpdating }] =
    useUpdateShipmentMutation();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetShipmentQuery();

  const [formvalid, stateFormvalid] = useState('');

  const [shipmentcharges, stateshipment] = useState({
    shipment: '',
  });

  useEffect(() => {
    if (data?.[0]) {
      stateshipment({
        shipment: data[0].shipment || '',
      });
    }
  }, [data]);

  const inputchangehandler = (e) => {
    const { name, value } = e.target;

    stateshipment((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim()) {
      stateFormvalid('');
    }
  };

  const submithandler = async (e) => {
    e.preventDefault();

    if (!shipmentcharges.shipment.trim()) {
      stateFormvalid('Shipment charges are required');
      return;
    }

    stateFormvalid('');

    try {
      const result = await postshipment(shipmentcharges);

      if (result?.data === 'save successfully') {
        toast.success(result.data);
        await refetch();
      } else {
        toast.error(result?.data || 'Unable to update shipment charges');
      }
    } catch (error) {
      console.error('Shipment update error:', error);
      toast.error('Something went wrong while updating shipment charges');
    }
  };

  if (isLoading) {
    return (
      <div className="dashboardcontainer">
        <Sidebarmenu />

        <main className="shipment-page">
          <div className="shipment-loading">
            <RefreshCw
              size={28}
              className="shipment-loading-icon"
            />
            <span>Loading shipment settings...</span>
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboardcontainer">
        <Sidebarmenu />

        <main className="shipment-page">
          <div className="shipment-error">
            <Truck size={30} />
            <h3>Something went wrong</h3>
            <p>
              We couldn't load the shipment settings.
            </p>

            <button
              type="button"
              onClick={refetch}
              className="shipment-retry-btn"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />

      <main className="shipment-page">
        <div className="shipment-container">

          {/* Header */}
          <div className="shipment-header">
            <div className="shipment-header-content">
              <div className="shipment-icon">
                <Truck size={27} />
              </div>

              <div>
                <span className="shipment-eyebrow">
                  Store Settings
                </span>

                <h1>Shipment Charges</h1>

                <p>
                  Configure the delivery charges applied to customer
                  orders.
                </p>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="shipment-card">

            <div className="shipment-card-header">
              <div>
                <h2>Delivery Settings</h2>

                <p>
                  Set the standard shipping amount that will be added
                  to customer orders.
                </p>
              </div>

              <div className="shipment-preview">
                <span>Current Charge</span>

                <strong>
                  {shipmentcharges.shipment || '—'}
                </strong>
              </div>
            </div>

            <form
              onSubmit={submithandler}
              className="shipment-form"
            >
              <div className="shipment-form-group">
                <label htmlFor="shipment">
                  Shipment Charges
                </label>

                <div className="shipment-input-wrapper">
                  <CircleDollarSign size={20} />

                  <input
                    id="shipment"
                    type="text"
                    name="shipment"
                    value={shipmentcharges.shipment}
                    onChange={inputchangehandler}
                    placeholder="Enter shipment charges"
                    autoComplete="off"
                  />
                </div>

                {formvalid && (
                  <span className="shipment-validation">
                    {formvalid}
                  </span>
                )}

                <small>
                  Enter the standard delivery charge for your store.
                </small>
              </div>

              <div className="shipment-form-footer">
                <button
                  type="submit"
                  className="shipment-save-btn"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw
                        size={18}
                        className="shipment-spinner"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Charges
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Shipment;
