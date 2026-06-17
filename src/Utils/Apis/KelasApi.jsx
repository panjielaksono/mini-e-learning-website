import AxiosInstance from "./AxiosInstance";

export const getAllKelas = () =>
  AxiosInstance.get("/kelas?select=*,matakuliah(*),dosen(*)");
export const getKelas = async (id) => {
  const response = await AxiosInstance.get(`/kelas?id=eq.${id}`);
  return { ...response, data: response.data[0] };
};
export const storeKelas = async (data) => {
  const response = await AxiosInstance.post("/kelas", data);
  return { ...response, data: response.data[0] };
};
export const updateKelas = async (id, data) => {
  const response = await AxiosInstance.put(`/kelas?id=eq.${id}`, data);
  return { ...response, data: response.data[0] };
};
export const deleteKelas = (id) => AxiosInstance.delete(`/kelas?id=eq.${id}`);
