import React, { useState } from 'react';
import {
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'react-toastify';

import Sidebarmenu from './component/Sidebarmenu';
import { useAdminchangePasswordMutation } from '../app/apiauth';



function Changepassword(props) {
  const [changePassword, { isLoading }] =
    useAdminchangePasswordMutation();

  const [validation, stateValidation] = useState('');

  const [Passwordchange, changepassState] = useState({
    currentpass: '',
    changepass: '',
    confirmpass: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    currentpass: false,
    changepass: false,
    confirmpass: false,
  });

  const targetval = (e) => {
    const { name, value } = e.target;

    changepassState((prev) => ({
      ...prev,
      [name]: value,
    }));

    stateValidation('');
  };

  const togglePassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    const {
      currentpass,
      changepass,
      confirmpass,
    } = Passwordchange;

    if (!currentpass || !changepass || !confirmpass) {
      stateValidation('Please fill in all password fields.');
      return;
    }

    if (changepass.length < 6) {
      stateValidation(
        'New password must be at least 6 characters long.'
      );
      return;
    }

    if (changepass !== confirmpass) {
      stateValidation('New password and confirm password do not match.');
      return;
    }

    if (currentpass === changepass) {
      stateValidation(
        'New password must be different from your current password.'
      );
      return;
    }

    try {
      const result = await changePassword({
        formdata: Passwordchange,
        useremail: props.user.useremail,
      });

      if (result?.data) {
        stateValidation(result.data);

        if (
          result.data === 'password changed successfully' ||
          result.data === 'save successfully'
        ) {
          toast.success(result.data);

          changepassState({
            currentpass: '',
            changepass: '',
            confirmpass: '',
          });

          stateValidation('');
        }
      } else {
        stateValidation('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Password change error:', error);
      stateValidation(
        'Unable to change password. Please try again.'
      );
    }
  };

  const renderPasswordInput = (
    name,
    label,
    placeholder,
    icon
  ) => {
    const isVisible = showPasswords[name];

    return (
      <div className="change-password-field">
        <label htmlFor={name}>
          {icon}
          {label}
        </label>

        <div className="change-password-input">
          <LockKeyhole size={18} />

          <input
            id={name}
            name={name}
            type={isVisible ? 'text' : 'password'}
            value={Passwordchange[name]}
            onChange={targetval}
            placeholder={placeholder}
            autoComplete={
              name === 'currentpass'
                ? 'current-password'
                : 'new-password'
            }
          />

          <button
            type="button"
            className="password-visibility"
            onClick={() => togglePassword(name)}
            aria-label={
              isVisible
                ? `Hide ${label}`
                : `Show ${label}`
            }
          >
            {isVisible ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />

      <main className="change-password-page">
        <div className="change-password-container">

          {/* Header */}
          <div className="change-password-header">
            <div className="change-password-header-icon">
              <ShieldCheck size={28} />
            </div>

            <div>
              <span className="change-password-eyebrow">
                Account Security
              </span>

              <h1>Change Password</h1>

              <p>
                Update your password to keep your administrator
                account secure.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="change-password-card">

            <div className="change-password-card-top">
              <div>
                <h2>Password Settings</h2>

                <p>
                  Enter your current password and choose a new
                  secure password.
                </p>
              </div>

              <div className="security-badge">
                <ShieldCheck size={17} />
                Secure
              </div>
            </div>

            <form
              className="change-password-form"
              onSubmit={handlesubmit}
            >

              {renderPasswordInput(
                'currentpass',
                'Current Password',
                'Enter your current password',
                <LockKeyhole size={15} />
              )}

              {renderPasswordInput(
                'changepass',
                'New Password',
                'Enter your new password',
                <LockKeyhole size={15} />
              )}

              {renderPasswordInput(
                'confirmpass',
                'Confirm New Password',
                'Re-enter your new password',
                <LockKeyhole size={15} />
              )}

              {/* Password Requirements */}
              <div className="password-hint">
                <ShieldCheck size={18} />

                <div>
                  <strong>Password recommendation</strong>

                  <p>
                    Use at least 6 characters and avoid using
                    easily guessable passwords.
                  </p>
                </div>
              </div>

              {validation && (
                <div className="change-password-error">
                  {validation}
                </div>
              )}

              <div className="change-password-footer">
                <button
                  type="submit"
                  className="change-password-save"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw
                        size={18}
                        className="change-password-spinner"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Update Password
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

export default Changepassword;
