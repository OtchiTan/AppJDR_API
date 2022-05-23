import axios from "axios";
import config from '../config.js'

const axiosClient = axios.create({
    baseURL:config.apiUrl,
    headers:{
        Authorization: `Bearer ${config.apiToken}`
    }
})

export default axiosClient