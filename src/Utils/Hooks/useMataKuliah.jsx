import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMatakuliah,
  storeMatakuliah,
  updateMatakuliah,
  deleteMatakuliah,
} from "@/Utils/Apis/MatakuliahApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMataKuliah = () =>
  useQuery({
    queryKey: ["mata-kuliah"],
    queryFn: getAllMatakuliah,
    select: (res) => res?.data ?? [],
  });

export const useStoreMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMatakuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil didaftarkan!");
    },
    onError: () => toastError("Gagal menambah mata kuliah."),
  });
};

export const useUpdateMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMatakuliah(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui mata kuliah."),
  });
};

export const useDeleteMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMatakuliah,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mata-kuliah"] });
      toastSuccess("Mata kuliah berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus mata kuliah."),
  });
};
