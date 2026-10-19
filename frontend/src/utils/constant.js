// export const BASE_URL = "https://devmatch-backend-awhk.onrender.com"
// export const BASE_URL = "http://localhost:3000"
export const SERVER_URL = import.meta.env.VITE_BACKEND_URL;
export const BASE_URL = SERVER_URL + "/api";
