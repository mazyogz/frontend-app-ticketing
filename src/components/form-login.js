import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./form-login.module.css";
import axios from "axios";
import Cookies from "js-cookie";

const FormLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    if (name === "password") {
      setFormData((prevData) => ({
        ...prevData,
        password: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", formData);

      if (response.status === 200) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userData", JSON.stringify(response.data.data));
        sessionStorage.setItem(
          "accessToken",
          JSON.stringify(response.data.data.accessToken).replaceAll('"', "")
        );
        Cookies.set("accessToken", response.data.data.accessToken);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Incorrect email or password. Please try again.");
    }
  };

  const onLupaKataSandiClick = useCallback(() => {
    router.push("/auth/forgot-password");
  }, [router]);

  const onDaftarDiSiniClick = useCallback(() => {
    router.push("/auth/register");
  }, [router]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isLoggedInSession = sessionStorage.getItem("isLoggedIn");
    if (isLoggedInSession === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("userData");
      sessionStorage.removeItem("accessToken");
      Cookies.remove("accessToken");
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("userData");
    if (isLoggedIn && userData) {
      const parsedUserData = JSON.parse(userData);
      // Lakukan apa pun yang perlu Anda lakukan dengan data pengguna, misalnya menyimpannya dalam state
      console.log(parsedUserData);
    }
  }, [isLoggedIn]);

  return (
    <>
      <div>
        {isLoggedIn ? (
          <div>
            <p>You are logged in</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                className="mx-auto h-10 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Your Company"
              />
              <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
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
                        onChange={handleChange}
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
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
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        onChange={handleChange}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Register
                      </a>
                    </div>

                    <div className="text-sm leading-6">
                      <a
                        onClick={onLupaKataSandiClick}
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
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
                  {isLoggedIn && (
                    <button
                      onClick={() => router.push("/")}
                      className={styles.akunButton}
                    >
                      Lihat Akun
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FormLogin;
