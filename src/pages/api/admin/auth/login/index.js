import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;

      const response = await axios.post('https://backend-app-ticketing-v12-production-7d84.up.railway.app/v1/api/login-admin', {
        email,
        password,
      });
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
