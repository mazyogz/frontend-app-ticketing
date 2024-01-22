import styles from "./form-forgot-password.module.css";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const FormForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const onDaftarDiSiniClick = useCallback(() => {
    router.push("/auth/register");
  }, [router]);

  const onLogin = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the forgot password API endpoint
      const response = await axios.post("/api/auth/forgot-password", { email });

      // Display success message
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setEmail("");
    } catch (error) {
      console.error(error);
      // Handle error
      setSuccessMessage("");
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    if (successMessage) {
      // Redirect to reset password page after successful email sent
      router.push("/auth/forgot-password/reset-password");
    }
  }, [successMessage]);

  return (
    <>
      <div>
        <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight italic text-indigo-600">
              FTIX
            </h1>
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Forgot Password
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      type="email"
                      placeholder="Contoh: johndoe@gmail.com"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className={styles.errorMessage}>{errorMessage}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm leading-6">
                    <a
                      onClick={onDaftarDiSiniClick}
                      href="/auth/register"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Register
                    </a>
                  </div>

                  <div className="text-sm leading-6">
                    <a
                      onClick={onLogin}
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

export default FormForgotPassword;
