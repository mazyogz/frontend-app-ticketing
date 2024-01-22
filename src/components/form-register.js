import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import styles from "./form-register.module.css";
import axios from "axios";

const FormRegister = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nama_lengkap, setNamaLengkap] = useState("");
  const [alamat, setAlamat] = useState("");
  const [email, setEmail] = useState("");
  const [nomor_telepon, setNomorTelepon] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Kirim data register ke API
      const response = await axios.post("/api/auth/register", {
        username,
        password,
        nama_lengkap,
        alamat,
        email,
        nomor_telepon,
      });

      setMessage(response.data.message);
      // Jika pendaftaran berhasil, arahkan ke halaman login
      if (response.data.message === "Pendaftaran berhasil") {
        setTimeout(() => {
          window.location.href = "/auth/login"; // Ganti dengan alamat halaman login yang diinginkan
        }, 3000); // Redirect setelah 2 detik
      }
    } catch (error) {
      setMessage("Terjadi kesalahan pada server");
    }
  };

  const onMasukDiSiniClick = useCallback(() => {
    router.push("/auth/login");
  }, [router]);

  return (
    <>
      <div>
        <div className="flex min-h-full flex-1 flex-col justify-center py-8 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h1 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight italic text-indigo-600">
              FTIX
            </h1>
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Register your account
            </h2>
          </div>

          <div className=" sm:mx-auto sm:w-full sm:max-w-[480px]">
            <div className="bg-white px-6 py-6 shadow sm:rounded-lg sm:px-12">
              <form className="space-y-1" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Nama Lengkap
                  </label>
                  <div className="mt-1">
                    <input
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="text"
                      value={nama_lengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Nama Lengkap"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Alamat
                  </label>
                  <div className="mt-1">
                    <input
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="text"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Alamat . "
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Contoh: johndee@gmail.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Nomor Telepon
                  </label>
                  <div className="mt-1">
                    <input
                      className="px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="tel"
                      value={nomor_telepon}
                      onChange={(e) => setNomorTelepon(e.target.value)}
                      placeholder="+62 . "
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm leading-6">
                    <a
                      href="/auth/login"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Login
                    </a>
                  </div>

                  <div className="text-sm leading-6">
                    <a
                      href="/auth/forgot-password"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              {message && (
                <p
                  style={{ color: message.includes("gagal") ? "red" : "green" }}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormRegister;
