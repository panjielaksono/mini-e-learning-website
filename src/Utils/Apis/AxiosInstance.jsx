import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/rest/v1`,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
});

export default AxiosInstance;
