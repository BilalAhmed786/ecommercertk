import React, { useEffect, useState } from 'react';
import { Coins, Save, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

import Sidebarmenu from './component/Sidebarmenu';
import {
  useGetCurrencyQuery,
  useUpdateCurrencyMutation,
} from '../app/apiproducts';

function Currency() {
  const [updateCurrency, { isLoading: isUpdating }] =
    useUpdateCurrencyMutation();

  const {
    data,
    isLoading,
    refetch,
  } = useGetCurrencyQuery();

  const [currencydata, stateCurrencydata] = useState({
    currency: '',
  });

  const [formvalid, stateFormvalid] = useState('');

  useEffect(() => {
    if (data?.[0]) {
      stateCurrencydata({
        currency: data[0].currency || '',
      });
    }
  }, [data]);

  const inputchangehandler = (e) => {
    const { name, value } = e.target;

    stateCurrencydata((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim()) {
      stateFormvalid('');
    }
  };

  const submithandler = async (e) => {
    e.preventDefault();

    if (!currencydata.currency.trim()) {
      stateFormvalid('Currency is required');
      return;
    }

    stateFormvalid('');

    try {
      const updatecurr = await updateCurrency(currencydata);

      if (updatecurr?.data === 'save successfully') {
        toast.success(updatecurr.data);
        await refetch();
      } else {
        toast.error(updatecurr?.data || 'Unable to update currency');
      }
    } catch (error) {
      console.error('Currency update error:', error);
      toast.error('Something went wrong while updating currency');
    }
  };

  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />

      <main className="currency-page">
        <div className="currency-container">

          {/* Header */}
          <div className="currency-header">
            <div className="currency-header-content">
              <div className="currency-icon">
                <Coins size={26} />
              </div>

              <div>
                <span className="currency-eyebrow">
                  Store Settings
                </span>

                <h1>Currency</h1>

                <p>
                  Configure the currency used throughout your store.
                </p>
              </div>
            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="currency-loading">
              <RefreshCw className="currency-loading-icon" size={28} />
              <span>Loading currency settings...</span>
            </div>
          ) : (
            <div className="currency-card">

              <div className="currency-card-header">
                <div>
                  <h2>Currency Settings</h2>
                  <p>
                    Enter the currency symbol or code that should appear
                    on product prices and orders.
                  </p>
                </div>

                <div className="currency-preview">
                  <span>Current</span>
                  <strong>
                    {currencydata.currency || '—'}
                  </strong>
                </div>
              </div>

              <form onSubmit={submithandler} className="currency-form">

                <div className="currency-form-group">
                  <label htmlFor="currency">
                    Store Currency
                  </label>

                  <div className="currency-input-wrapper">
                    <Coins size={20} />

                    <input
                      id="currency"
                      type="text"
                      name="currency"
                      value={currencydata.currency}
                      onChange={inputchangehandler}
                      placeholder="e.g. PKR, USD, €"
                      autoComplete="off"
                    />
                  </div>

                  {formvalid && (
                    <span className="currency-error">
                      {formvalid}
                    </span>
                  )}

                  <small>
                    Example: PKR, USD, EUR, $, €, £
                  </small>
                </div>

                <div className="currency-form-footer">
                  <button
                    type="submit"
                    className="currency-save-btn"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <RefreshCw
                          size={18}
                          className="currency-spinner"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Currency
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default Currency;
