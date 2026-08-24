import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
    withCredentials: true,
});

let isRefreshing = false;
let isfreshSubscribers: (() => void)[] = [];

//Handle logout and prevent infinite loop
const handleLogout = () => {
    if(window.location.pathname !== "/login") {
        window.location.href = "/login";
    }
}
