import axios from 'axios';

axios.create({withCredentials: true}).interceptors.response.use(
    (response) => response,
    (error) => console.log("interceptor error =>>", error)
)

const httpService = axios;

export default httpService;