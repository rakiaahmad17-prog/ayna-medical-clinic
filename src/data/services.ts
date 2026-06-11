export interface Service {
  id: string
  name: string
  slug: string
  shortDesc: string
  fullDesc: string
  icon: string
  duration: string
  priceRange: string
  benefits: string[]
  imageUrl: string
}

export const services: Service[] = [
  {
    id: 'scaling',
    name: 'Scaling& Cleaning',
    slug: 'scaling-cleaning',
    shortDesc: 'Pembersihan karang gigi dan plak untuk gusi sehat',
    fullDesc: 'Scaling adalah prosedur pembersihan karang gigi (kalkulus) yang tidak bisa dihilangkan dengan menyikat gigi biasa. Prosedur ini penting untuk mencegah penyakit gusi, bau mulut, dan kerusakan gigi. Menggunakan alat ultrasonic modern untuk hasil maksimal dan nyaman.',
    icon: 'sparkles',
    duration: '30 - 45 menit',
    priceRange: 'Rp 150.000 - 300.000',
    benefits: ['Menghilangkan karang gigi', 'Mencegah radang gusi', 'Mengatasi bau mulut', 'Gigi terlihat lebih bersih'],
    imageUrl: 'https://picsum.photos/seed/scaling/600/400',
  },
  {
    id: 'tambal',
    name: 'Penambalan Gigi',
    slug: 'penambalan-gigi',
    shortDesc: 'Memperbaiki gigi berlubang dengan bahan estetik',
    fullDesc: 'Penambalan gigi dilakukan untuk memperbaiki gigi yang rusak akibat karies (lubang). Kami menggunakan bahan tambal komposit yang berwarna sama dengan gigi asli, sehingga hasil estetik dan alami. Prosedur cepat dan nyaman.',
    icon: 'shield-check',
    duration: '30 - 60 menit',
    priceRange: 'Rp 200.000 - 500.000',
    benefits: ['Memperbaiki gigi berlubang', 'Bahan estetik warna gigi', 'Prosedur cepat', 'Nyaman tanpa sakit'],
    imageUrl: 'https://picsum.photos/seed/tambal/600/400',
  },
  {
    id: 'behel',
    name: 'Behel / Orthodonti',
    slug: 'behel-orthodonti',
    shortDesc: 'Perawatan merapikan susunan gigi dan bite',
    fullDesc: 'Perawatan orthodonti untuk merapikan susunan gigi yang tidak rata atau masalah gigitan (malocclusion). Tersedia behel konvensional metal, ceramic, dan clear aligner. Konsultasi awal gratis untuk menentukan jenis behel yang tepat.',
    icon: 'align-center',
    duration: 'Konsultasi + perawatan berkala',
    priceRange: 'Rp 3.000.000 - 25.000.000',
    benefits: ['Gigi rata dan rapi', 'Memperbaiki masalah gigitan', 'Pilihan behel estetik', 'Hasil permanen'],
    imageUrl: 'https://picsum.photos/seed/behel/600/400',
  },
  {
    id: 'pemutihan',
    name: 'Pemutihan Gigi',
    slug: 'pemutihan-gigi',
    shortDesc: 'Whitening untuk gigi lebih cerah dan berseri',
    fullDesc: 'Prosedur pemutihan gigi (bleaching) untuk mengangkat noda dan perubahan warna pada gigi. Menggunakan bahan pemutih yang aman dan diawasi dokter. Hasil bisa sampai 2-4 shade lebih cerah. Tersedia treatment di klinik dan take-home kit.',
    icon: 'sun',
    duration: '45 - 90 menit',
    priceRange: 'Rp 500.000 - 1.500.000',
    benefits: ['Gigi lebih putih cerah', 'Prosedur aman', 'Hasil cepat terlihat', 'Tahan lama'],
    imageUrl: 'https://picsum.photos/seed/pemutihan/600/400',
  },
  {
    id: 'cabut',
    name: 'Pencabutan Gigi',
    slug: 'pencabutan-gigi',
    shortDesc: 'Pencabutan gigi yang tidak bisa ditambal',
    fullDesc: 'Pencabutan gigi dilakukan jika gigi sudah tidak bisa diselamatkan dengan penambalan atau perawatan lain. Prosedur dilakukan dengan anestesi lokal sehingga tidak sakit. Gigi wisudä (bungsu) yang bermasalah juga bisa ditangani.',
    icon: 'scissors',
    duration: '30 - 60 menit',
    priceRange: 'Rp 150.000 - 800.000',
    benefits: ['Pencabutan tanpa sakit', 'Prosedur steril', 'Luka minimal', 'Pemulihan cepat'],
    imageUrl: 'https://picsum.photos/seed/cabut/600/400',
  },
  {
    id: 'anak',
    name: 'Perawatan Gigi Anak',
    slug: 'perawatan-gigi-anak',
    shortDesc: 'Perawatan khusus untuk gigi anak usia 2-12 tahun',
    fullDesc: 'Perawatan gigi anak dengan pendekatan ramah anak. Termasuk fluoride treatment, fissure sealant, dan penanganan karies anak. Dokter anak kami terlatih membuat anak merasa nyaman dan tidak takut. Penting untuk membangun kebiasaan gigi sehat sejak dini.',
    icon: 'heart',
    duration: '30 - 45 menit',
    priceRange: 'Rp 100.000 - 400.000',
    benefits: ['Ramah anak', 'Dokter berpengalaman dengan anak', 'Mencegah karies', 'Edukasi kesehatan gigi'],
    imageUrl: 'https://picsum.photos/seed/anak/600/400',
  },
  {
    id: 'veneer',
    name: 'Veneer Gigi',
    slug: 'veneer-gigi',
    shortDesc: 'Pelapisan estetik untuk senyum sempurna',
    fullDesc: 'Veneer adalah lapisan tipis dari porselen atau komposit yang ditempelkan pada permukaan depan gigi untuk memperbaiki warna, bentuk, dan tampilan. Cocok untuk gigi yang berubah warna, sedikit renggang, atau bentuk tidak ideal.',
    icon: 'star',
    duration: '2-3 sesi',
    priceRange: 'Rp 1.500.000 - 5.000.000 per gigi',
    benefits: ['Hasil sangat estetik', 'Minimal invasif', 'Tahan lama 10-15 tahun', 'Senyum sempurna'],
    imageUrl: 'https://picsum.photos/seed/veneer/600/400',
  },
  {
    id: 'implan',
    name: 'Implan Gigi',
    slug: 'implan-gigi',
    shortDesc: 'Solusi pengganti gigi permanen dengan implan',
    fullDesc: 'Implan gigi adalah root gigi buatan dari titanium yang dipasang ke tulang rahang untuk mengganti gigi yang hilang. Hasil sangat natural dan permanen. Prosedur dilakukan oleh dokter spesialis bedah mulut dengan equipment modern.',
    icon: 'zap',
    duration: '3-6 bulan (beberapa sesi)',
    priceRange: 'Rp 8.000.000 - 20.000.000 per gigi',
    benefits: ['Pengganti gigi permanen', 'Terlihat dan terasa natural', 'Tidak merusak gigi lain', 'Fungsi seperti gigi asli'],
    imageUrl: 'https://picsum.photos/seed/implan/600/400',
  },
]