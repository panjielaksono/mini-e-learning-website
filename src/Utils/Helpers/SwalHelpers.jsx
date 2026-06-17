import Swal from "sweetalert2";

export const confirmLogout = (onConfirm) => {
  Swal.fire({
    title: "Mau cabut sekarang?",
    text: "Sesi lu bakal berakhir bray.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, Logout!",
    cancelButtonText: "Batal"
  }).then((result) => {
    if (result.isConfirmed) onConfirm();
  });
};

export const confirmDelete = (onConfirm) => {
  Swal.fire({
    title: "Yakin hapus data ini?",
    text: "Data yang udah ilang nggak bisa balik lagi!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444", 
    confirmButtonText: "Hapus!",
    cancelButtonText: "Jangan"
  }).then((result) => {
    if (result.isConfirmed) onConfirm();
  });
};

export const confirmUpdate = (onConfirm) => {
  Swal.fire({
    title: "Simpan perubahan?",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Ya, Simpan!",
    cancelButtonText: "Cek lagi"
  }).then((result) => {
    if (result.isConfirmed) onConfirm();
  });
};