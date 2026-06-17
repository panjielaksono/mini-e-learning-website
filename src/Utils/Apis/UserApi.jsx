import AxiosInstance from "./AxiosInstance";

export const getAllUsers = () => AxiosInstance.get("/user");
export const updateUser = async (id, data) => {
  const response = await AxiosInstance.put(`/user?id=eq.${id}`, data);
  return { ...response, data: response.data[0] };
};
