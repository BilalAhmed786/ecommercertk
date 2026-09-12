import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  X,
  Loader2,
} from "lucide-react";

import Sidebarmenu from "./component/Sidebarmenu";
import {
  useClientchangePasswordMutation,
  useUserDetailsMutation,
} from "../app/apiauth";



function Profile(props) {
  const [validation, statevalidation] = useState([]);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changepassword, { isLoading }] =
    useClientchangePasswordMutation();

  const [data] = useUserDetailsMutation();

  const [userprofile, stateUserprofile] = useState({
    userid: "",
    username: "",
    useremail: "",
    currentpass: "",
    newpass: "",
    confirmpass: "",
  });

  useEffect(() => {
    if (props) {
      stateUserprofile((previous) => ({
        ...previous,
        userid: props.userid || "",
        username: props.username || "",
        useremail: props.useremail || "",
      }));
    }
  }, [props]);

  const changehandle = (e) => {
    const { name, value } = e.target;

    stateUserprofile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const LoginvalidatedItems = (event, value) => {
    event.preventDefault();

    const validatedItems = validation.filter(
      (item) => item !== value
    );

    statevalidation(validatedItems);
  };

  const submithandle = async (e) => {
    e.preventDefault();

    try {
      const result = await changepassword(userprofile);

      if (result?.data) {
        const profile = await data();

        statevalidation(
          Array.isArray(result.data) ? result.data : [result.data]
        );

        void profile;
      } else if (result?.error) {
        const errorMessage =
          result.error?.data?.message ||
          result.error?.data ||
          "Something went wrong. Please try again.";

        statevalidation(
          Array.isArray(errorMessage)
            ? errorMessage
            : [String(errorMessage)]
        );
      }
    } catch (error) {
      console.error(error);

      statevalidation([
        "Something went wrong. Please try again.",
      ]);
    }
  };

  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />

      <main className="profile-page">
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-header-icon">
              <UserRound size={24} />
            </div>

            <div>
              <span className="profile-eyebrow">
                Account Settings
              </span>

              <h1>Profile & Security</h1>

              <p>
                Manage your account information and keep your
                password secure.
              </p>
            </div>
          </div>
        </div>

        {validation.length > 0 && (
          <div className="profile-alerts">
            {validation.map((valid, index) => (
              <div className="profile-alert" key={`${valid}-${index}`}>
                <div className="profile-alert-content">
                  <ShieldCheck size={18} />
                  <span>{valid}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) =>
                    LoginvalidatedItems(e, valid)
                  }
                  aria-label="Dismiss message"
                >
                  <X size={17} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="profile-grid">
          <section className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-icon">
                <UserRound size={19} />
              </div>

              <div>
                <h2>Personal Information</h2>
                <p>Your account information</p>
              </div>
            </div>

            <div className="profile-form">
              <div className="profile-field">
                <label htmlFor="username">Full Name</label>

                <div className="profile-input-wrapper">
                  <UserRound size={17} />

                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={userprofile.username || ""}
                    onChange={changehandle}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="useremail">Email Address</label>

                <div className="profile-input-wrapper">
                  <Mail size={17} />

                  <input
                    id="useremail"
                    type="email"
                    name="useremail"
                    value={userprofile.useremail || ""}
                    onChange={changehandle}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-card-header">
              <div className="profile-card-icon security-icon">
                <LockKeyhole size={19} />
              </div>

              <div>
                <h2>Change Password</h2>
                <p>Update your account password</p>
              </div>
            </div>

            <form
              className="profile-form"
              onSubmit={submithandle}
            >
              <div className="profile-field">
                <label htmlFor="currentpass">
                  Current Password
                </label>

                <div className="profile-input-wrapper">
                  <LockKeyhole size={17} />

                  <input
                    id="currentpass"
                    name="currentpass"
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={userprofile.currentpass || ""}
                    onChange={changehandle}
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowCurrentPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showCurrentPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="newpass">
                  New Password
                </label>

                <div className="profile-input-wrapper">
                  <LockKeyhole size={17} />

                  <input
                    id="newpass"
                    name="newpass"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={userprofile.newpass || ""}
                    onChange={changehandle}
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowNewPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showNewPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div className="profile-field">
                <label htmlFor="confirmpass">
                  Confirm New Password
                </label>

                <div className="profile-input-wrapper">
                  <LockKeyhole size={17} />

                  <input
                    id="confirmpass"
                    name="confirmpass"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={userprofile.confirmpass || ""}
                    onChange={changehandle}
                    placeholder="Confirm new password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <input
                type="hidden"
                name="userid"
                value={userprofile.userid || ""}
              />

              <div className="profile-security-note">
                <ShieldCheck size={18} />

                <div>
                  <strong>Keep your account secure</strong>
                  <span>
                    Use a strong password that you don't use
                    on other websites.
                  </span>
                </div>
              </div>

              <button
                className="profile-save-btn"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={18}
                      className="profile-spinner"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Profile;

