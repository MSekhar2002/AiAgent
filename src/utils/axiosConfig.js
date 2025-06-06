import axios from 'axios';

// Configure axios to use the base URL from environment variables
const baseURL = 'https://aiagent-server-2.onrender.com/api';

// Create an axios instance with the base URL
const axiosInstance = axios.create({
  baseURL
});

// Export the configured axios instance
export default axiosInstance;
