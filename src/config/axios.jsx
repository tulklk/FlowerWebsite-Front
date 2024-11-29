// import axios from 'axios';

// const baseUrl = "http://14.225.220.131:8080/api/";

// const config = {
//     baseURL: baseUrl,
// };

// const api = axios.create(config);

// api.defaults.baseURL = baseUrl;

// // handle before call API
// const handleBefore = (config) => {
//     //handle hành động trước khi call API
//     //lấy ra cái token và đính kèm theo cái request
//     const token = localStorage.getItem("token").replaceAll('"', '');
//     config.headers["Authorization"] = `Bearer ${token}`;
//     return config;
// };

// api.interceptors.request.use(handleBefore, null);

// export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // URL gốc của Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling the token and attaching it to the headers
api.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");

        // If a token is available, add it to the Authorization header
        if (token) {
            config.headers["Authorization"] = `Bearer ${token.replaceAll('"', '')}`;
        }

        return config;
    },
    (error) => {
        // Handle request errors here
        return Promise.reject(error);
    }
);

export default api;

