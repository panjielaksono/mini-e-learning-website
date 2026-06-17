import AxiosInstance from "./AxiosInstance";

export const loginApi = async (email, password) => {
  const response = await AxiosInstance.get(`/user?email=eq.${email}`);
  const user = response.data[0];
  if (!user || user.password !== password) {
    throw new Error("Kredensial salah!");
  }
  return user;
};

export const registerApi = async (data) => {
  const response = await AxiosInstance.post("/user", data);
  return response.data[0];
};

export { loginApi as login };
