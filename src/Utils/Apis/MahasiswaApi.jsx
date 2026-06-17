import AxiosInstance from "./AxiosInstance";

export const getAllMahasiswa = (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (
      params[key] !== "" &&
      params[key] !== null &&
      params[key] !== undefined
    ) {
      cleanParams[key] = params[key];
    }
  });
  return AxiosInstance.get("/mahasiswa", { params: cleanParams });
};
export const getMahasiswa = async (id) => {
  const response = await AxiosInstance.get(`/mahasiswa?id=eq.${id}`);
  return { ...response, data: response.data[0] };
};
export const storeMahasiswa = async (data) => {
  const response = await AxiosInstance.post("/mahasiswa", data);
  return { ...response, data: response.data[0] };
};
export const updateMahasiswa = async (id, data) => {
  const response = await AxiosInstance.put(`/mahasiswa?id=eq.${id}`, data);
  return { ...response, data: response.data[0] };
};

export const deleteMahasiswa = (id) =>
  AxiosInstance.delete(`/mahasiswa?id=eq.${id}`);
