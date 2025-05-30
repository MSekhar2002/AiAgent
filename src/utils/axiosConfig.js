import axios from 'axios';

// Configure axios to use the base URL from environment variables
const baseURL = 'http://localhost:5000/api';

// Create an axios instance with the base URL
const axiosInstance = axios.create({
  baseURL
});

// Export the configured axios instance
export default axiosInstance;