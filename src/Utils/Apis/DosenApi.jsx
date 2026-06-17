import AxiosInstance from "./AxiosInstance";

export const getAllDosen = () => AxiosInstance.get("/dosen");
export const getDosen = async (id) => {
  const response = await AxiosInstance.get(`/dosen?id=eq.${id}`);
  return { ...response, data: response.data[0] };
};
export const storeDosen = async (data) => {
  const response = await AxiosInstance.post("/dosen", data);
  return { ...response, data: response.data[0] };
};
export const updateDosen = async (id, data) => {
  const response = await AxiosInstance.put(`/dosen?id=eq.${id}`, data);
  return { ...response, data: response.data[0] };
};
export const deleteDosen = (id) => {
  return AxiosInstance.delete(`/media?id=eq.${id}`);
};
