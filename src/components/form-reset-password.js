import styles from "./form-reset-password.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const FormResetPassword = () => {
  const [otp, setotp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleotpChange = (e) => {
    setotp(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleVerifyPasswordChange = (e) => {
    setVerifyPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the verification password matches the new password
    if (newPassword !== verifyPassword) {
      setErrorMessage("Verification password must match the new password");
      return;
    }

    try {
      // Make a POST request to the reset password API endpoint
      const response = await axios.post("/api/auth/reset-password", {
        otp,
        newPassword,
      });

      // Display success message
      setErrorMessage("Password successfully updated");
      // Redirect to the login page or display a success message
      router.push("/auth/login");
    } catch (error) {
      console.error(error);
      // Handle error
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div>
          <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                className="mx-auto h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
              <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Reset Your Password
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
              <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-12">
                <form className="space-y-4" action="#" method="POST">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      OTP
                    </label>
                    <div className="mt-2">
                      <input
                        id="otp"
                        value={otp}
                        onChange={handleotpChange}
                        required
                        type="text"
                        placeholder="Input OTP"
                        className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Input New Password
                    </label>
                    <div className="mt-2">
                      <input
                        placeholder="********"
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                        required
                        className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Repeat New Password
                    </label>
                    <div className="mt-2">
                      <input
                        type="password"
                        placeholder="********"
                        id="verifyPassword"
                        value={verifyPassword}
                        onChange={handleVerifyPasswordChange}
                        required
                        className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm leading-6">
                      <a
                        href="/auth/register"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Register
                      </a>
                    </div>

                    <div className="text-sm leading-6">
                      <a
                        href="/auth/login"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Login
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default FormResetPassword;
