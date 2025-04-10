export interface CourseBenefit {
  id: number;
  judul: string;
  subjudul: string;
  deskripsi: string;
  gambar: string | null;
  diperoleh_melalui: string;
  course: {
    id: number;
    nama: string;
  };
  dibuat_pada: string;
  diperbarui_pada: string;
}
