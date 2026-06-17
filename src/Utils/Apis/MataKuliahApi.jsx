import AxiosInstance from "./AxiosInstance";

export const getAllMataKuliah = () => AxiosInstance.get("/matakuliah");
export const getMataKuliah = async (id) => {
  const response = await AxiosInstance.get(`/matakuliah?id=eq.${id}`);
  return { ...response, data: response.data[0] };
};
export const storeMataKuliah = async (data) => {
  const response = await AxiosInstance.post("/matakuliah", data);
  return { ...response, data: response.data[0] };
};
export const updateMataKuliah = async (id, data) => {
  const response = await AxiosInstance.put(`/matakuliah?id=eq.${id}`, data);
  return { ...response, data: response.data[0] };
};
export const deleteMataKuliah = (id) =>
  AxiosInstance.delete(`/matakuliah?id=eq.${id}`);

export {
  getAllMataKuliah as getAllMatakuliah,
  getMataKuliah as getMatakuliah,
  storeMataKuliah as storeMatakuliah,
  updateMataKuliah as updateMatakuliah,
  deleteMataKuliah as deleteMatakuliah,
};
