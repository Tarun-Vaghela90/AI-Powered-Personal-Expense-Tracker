import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if the response has content before parsing
    if (response.ok) {
      const responseData = await response.json().catch(() => {
        // Handle if the response is not in JSON format or empty
        console.error('Response is not a valid JSON');
        return null;
      });

      if (responseData) {
        // Do something with valid JSON data
        console.log('Login successful:', responseData);
        navigate("/dashboard/home")
        localStorage.setItem("authToken",responseData.authToken)
      } else {
        // Handle empty or invalid JSON response
        console.log('Received empty or invalid JSON response.');
      }
    } else {
      console.error('Failed to log in. Server responded with:', response.status);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};


  const googleAuth = () => {
    window.open(
      `${import.meta.env.VITE_REACT_APP_URL}/auth/google/callback`,
      "_self"
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-500 hover:text-indigo-700">
            Sign Up
          </Link>
        </p>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">Or log in with</p>
          <button
            className="w-full mt-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={googleAuth}
          >
            <img src="./images/google.png" alt="google icon" className="inline-block w-5 h-5 mr-2" />
            Log In with Google
          </button>
        </div>
      </div>
    </div>
  );
}
