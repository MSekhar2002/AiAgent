import axiosInstance from '../utils/axiosConfig';

// Set or remove the auth token in axios headers
const setAuthToken = token => {
  if (token) {
    axiosInstance.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axiosInstance.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;