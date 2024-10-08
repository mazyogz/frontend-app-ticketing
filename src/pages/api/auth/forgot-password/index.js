import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      // Make a POST request to the forgot password API endpoint
      const response = await axios.post(
        "https://backend-app-ticketing-v12-production-7d84.up.railway.app/v1/api/forgot-password-otp",
        { email }
      );

      // Send the response from the API
      res.status(response.status).json(response.data);
    } catch (error) {
      // Handle error
      res.status(error.response.status).json(error.response.data);
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
