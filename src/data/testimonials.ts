export interface Testimonial {
  id: string
  name: string
  role: string
  avatarUrl: string
  rating: number
  text: string
  date: string
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Rina Marlina',
    role: 'Ibu Rumah Tangga, Makassar',
    avatarUrl: 'https://picsum.photos/seed/rina/100/100',
    rating: 5,
    text: 'Anak saya yang 6 tahun awalnya takut ke dokter gigi, tapi sejak kenal Klinik AYNA Medical Clinic, anak saya malah excited untuk kontrol gigi. Dokter dan staff-nya sangat sabar dan ramah. Scaling-nya juga tidak sakit!',
    date: 'Mei 2026',
  },
  {
    id: 't2',
    name: 'Andi Saputra',
    role: 'Profesional, Makassar',
    avatarUrl: 'https://picsum.photos/seed/andi/100/100',
    rating: 5,
    text: 'Saya pasang behel di Klinik AYNA dan hasilnya exceed ekspektasi. Gigi saya yang tadinya berantakan sekarang rapi dan percaya diri naik. Harga juga kompetitif dibanding klinik lain di Makassar.',
    date: 'April 2026',
  },
  {
    id: 't3',
    name: 'Fatimah Hasan',
    role: 'Mahasiswi, Makassar',
    avatarUrl: 'https://picsum.photos/seed/fatimah/100/100',
    rating: 5,
    text: 'Pemutihan gigi di Klinik AYNA Medical Clinic worth it banget! Gigi saya yang tadinya kuning sekarang putih cerah. Prosedurnya cepat dan hasilnya natural. Staff-nya juga helpful banget.',
    date: 'Juni 2026',
  },
  {
    id: 't4',
    name: 'Bapak Hamka',
    role: 'Wiraswasta, Makassar',
    avatarUrl: 'https://picsum.photos/seed/hamka/100/100',
    rating: 5,
    text: 'Saya cabut gigi bungsu di sini dan prosesnya cepat dan minim rasa sakit. Alat-alatnya modern, ruangan bersih, dan dokternya sangat profesional. Recommended!',
    date: 'Mei 2026',
  },
  {
    id: 't5',
    name: 'Sari Dewi',
    role: 'Guru SD, Makassar',
    avatarUrl: 'https://picsum.photos/seed/sari/100/100',
    rating: 5,
    text: 'Sudah 3 kali kontrol di Klinik AYNA Medical Clinic untuk tambal dan scaling. Selalu dapat pelayanan terbaik. Tempatnya nyaman, lokasi strategis di pusat Makassar, dan reservasi via WhatsApp sangat mudah.',
    date: 'Juni 2026',
  },
  {
    id: 't6',
    name: 'Reza Pratama',
    role: 'Software Engineer, Makassar',
    avatarUrl: 'https://picsum.photos/seed/reza/100/100',
    rating: 5,
    text: 'Perawatan di Klinik AYNA Medical Clinic – investasi worth it untuk senyum saya. Dokter sangat menjelaskan detail prosedur dan hasilnya luar biasa natural.',
    date: 'Maret 2026',
  },
]