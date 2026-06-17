import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMahasiswa = (query = {}) => {
  return useQuery({
    queryKey: ["mahasiswa", query],
    queryFn: () => getAllMahasiswa(query),
    select: (res) => {
      const raw = res?.data;
      const dataArray = raw?.mahasiswa ?? raw?.data ?? [];
      const totalItems = raw?.items ?? (Array.isArray(raw) ? raw.length : 0);
      if (raw && !Array.isArray(raw)) {
        return {
          data: Array.isArray(dataArray) ? dataArray : [],
          total: parseInt(totalItems, 10)
        };
      }
      if (Array.isArray(raw)) {
        return {
          data: raw,
          total: parseInt(res?.headers?.["x-total-count"] ?? String(raw.length), 10)
        };
      }

      return { data: [], total: 0 };
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan mahasiswa."),
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil diperbarui bray!");
    },
    onError: () => toastError("Gagal memperbarui data mahasiswa."),
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil dihapus bray!");
    },
    onError: () => toastError("Gagal menghapus data mahasiswa."),
  });
};
