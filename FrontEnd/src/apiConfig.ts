import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:'http://localhost:5000'
  //baseURL: 'http://localhost:8080/authservice'
});

export default axiosInstance;
