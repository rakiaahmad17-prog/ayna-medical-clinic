export interface Doctor {
  id: string
  name: string
  title: string
  specialization: string
  experience: string
  education: string
  bio: string
  photoUrl: string
  phone: string
  availableDays: string[]
}

export const doctors: Doctor[] = [
  {
    id: 'drg-siti',
    name: 'drg. Siti Hardianti',
    title: 'Dokter Gigi',
    specialization: 'Perawatan Umum & Estetika Gigi',
    experience: '5+ tahun',
    education: 'FKG Universitas Muslim Indonesia',
    bio: 'Dokter Siti Hardianti adalah dokter gigi umum yang berpengalaman dalam berbagai perawatan gigi, termasuk scaling, penambalan, dan perawatan estetika. Dikenal ramah dan telaten dalam setiap prosedur perawatan.',
    photoUrl: 'https://picsum.photos/seed/drg-siti/400/400',
    phone: '6285343747010',
    availableDays: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Sabtu'],
  },
  {
    id: 'drg-fajrin',
    name: 'drg. Fajrin Wijaya',
    title: 'Dokter Gigi',
    specialization: 'Perawatan Gigi & Orthodonti',
    experience: '4+ tahun',
    education: 'FKG Universitas Hasanuddin',
    bio: 'Dokter Fajrin Wijaya adalah dokter gigi umum dengan fokus pada perawatan orthodonti dan restorasi gigi. Memiliki ketelitian tinggi dalam memberikan hasil perawatan yang optimal untuk setiap pasien.',
    photoUrl: 'https://picsum.photos/seed/drg-fajrin/400/400',
    phone: '6281256718190',
    availableDays: ['Senin', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  },
]