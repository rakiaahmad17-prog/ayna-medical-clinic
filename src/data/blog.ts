export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  featured?: boolean
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'cara-merawat-gigi-sehari-hari',
    title: 'Cara Merawat Gigi Sehari-hari yang Benar',
    excerpt: 'Tips sederhana untuk menjaga kesehatan gigi dan mulut agar tetap bersih dan bebas masalah.',
    content: `
# Cara Merawat Gigi Sehari-hari yang Benar

Kesehatan gigi dan mulut adalah bagian penting dari kesehatan keseluruhan tubuh. Berikut adalah tips merawat gigi yang benar dalam kehidupan sehari-hari.

## 1. Sikat Gigi Minimal 2 Kali Sehari

Sikat gigi minimal 2 kali sehari, yaitu pagi setelah bangun tidur dan malam sebelum tidur. Gunakan pasta gigi yang mengandung fluorid untuk perlindungan optimal.

## 2. Gunakan Benang Gigi

Benang gigi dapat membersihkan sisa makanan yang tidak bisa dijangkau oleh sikat gigi, terutama di antara gigi.

## 3. Hindari Makanan Manis Berlebihan

Gula adalah musuh utama gigi. Bakteri dalam mulut mengubah gula menjadi asam yang dapat merusak email gigi.

## 4. Rutin ke Dokter Gigi

Kunjungi dokter gigi minimal 6 bulan sekali untuk pemeriksaan dan pembersihan karang gigi.

## 5. Hindari Merokok

Merokok dapat menyebabkan noda pada gigi, bau mulut, dan meningkatkan risiko penyakit gusi.

Semoga tips ini bermanfaat untuk kesehatan gigi Anda!
    `,
    coverImage: 'https://picsum.photos/seed/dental-care/800/400',
    category: 'Perawatan',
    author: 'drg. Siti Hardianti',
    publishedAt: '2026-06-10',
    readTime: '5 menit',
    featured: true,
  },
  {
    id: '2',
    slug: 'kapan-sebaiknya-anak-ke-dokter-gigi',
    title: 'Kapan Sebaiknya Anak Pertama Kali ke Dokter Gigi?',
    excerpt: 'Memahami waktu yang tepat untuk membawa anak ke dokter gigi pertama kali.',
    content: `
# Kapan Sebaiknya Anak Pertama Kali ke Dokter Gigi?

Banyak orang tua bertanya-tanya kapan waktu yang tepat untuk membawa anak ke dokter gigi untuk pertama kalinya.

## Rekomendasi Ahli

Menurut American Academy of Pediatric Dentistry, anak sebaiknya pertama kali ke dokter gigi saat gigi sulung pertama muncul, yaitu sekitar usia 6 bulan hingga 1 tahun, atau paling lambat saat usia 2 tahun.

## Mengapa Dini?

Kunjungan dini ke dokter gigi sangat penting untuk:

- Mencegah kerusakan gigi sejak dini
- Membiasakan anak dengan lingkungan dokter gigi
- Mendeteksi masalah sejak awal
- Edukasi orang tua tentang perawatan gigi anak

## Tips Membawa Anak ke Dokter Gigi

1. Pilih dokter gigi yang ramah anak
2. Jelaskan dengan bahasa yang positif
3. Jangan pernah mengancam atau menakut-nakuti anak
4. Bawa mainan favorit untuk menemani

Dengan perawatan sejak dini, anak Anda akan memiliki gigi yang sehat seumur hidup!
    `,
    coverImage: 'https://picsum.photos/seed/pediatric-dental/800/400',
    category: 'Anak',
    author: 'drg. Fajrin Wijaya',
    publishedAt: '2026-06-08',
    readTime: '4 menit',
  },
  {
    id: '3',
    slug: 'perbedaan-scaling-dan-polishing',
    title: 'Perbedaan Scaling dan Polishing Gigi',
    excerpt: 'Mengenal prosedur pembersihan gigi yang sering dilakukan di klinik dokter gigi.',
    content: `
# Perbedaan Scaling dan Polishing Gigi

Banyak orang masih bingung tentang perbedaan scaling dan polishing gigi. Mari kita bahas tuntas!

## Scaling Gigi

Scaling adalah prosedur pembersihan karang gigi (kalkulus) yang menumpuk di permukaan gigi dan di bawah garis gusi. Karang gigi terbentuk dari plak yang mengeras dan tidak bisa dihilangkan dengan menyikat gigi biasa.

**Benefits Scaling:**
- Menghilangkan karang gigi
- Mencegah penyakit gusi
- Mengatasi bau mulut
- Gigi terasa lebih bersih

## Polishing Gigi

Polishing adalah prosedur menghaluskan permukaan gigi setelah scaling. Prosedur ini membuat gigi terasa lebih licin dan mengkilap.

**Benefits Polishing:**
- Gigi lebih halus dan mengkilap
- Mengurangi kemungkinan plak menempel
- Hasil estetik yang baik

## Mana yang Dibutuhkan?

Pada umumnya, scaling dan polishing dilakukan bersamaan dalam satu sesi perawatan. Keduanya saling melengkapi untuk hasil pembersihan yang optimal.

## Kesimpulan

Untuk kesehatan gigi yang optimal, disarankan melakukan scaling dan polishing setiap 6 bulan sekali.
    `,
    coverImage: 'https://picsum.photos/seed/scaling-polishing/800/400',
    category: 'Perawatan',
    author: 'drg. Siti Hardianti',
    publishedAt: '2026-06-05',
    readTime: '3 menit',
  },
  {
    id: '4',
    slug: 'mitos-dan-fakta-tentang-gigi-bungsu',
    title: 'Mitos dan Fakta Seputar Gigi Bungsu',
    excerpt: 'Membongkar mitos-mitos yang sering beredar tentang gigi wisdom atau gigi bungsu.',
    content: `
# Mitos dan Fakta Seputar Gigi Bungsu

Gigi bungsu atau wisdom tooth sering menjadi sumber kekhawatiran banyak orang. Berikut fakta dan mitosnya!

## Mitos: Semua Orang Harus Cabut Gigi Bungsu

**Fakta:** Tidak semua orang perlu mencabut gigi bungsu. Gigi bungsu hanya perlu dicabut jika menyebabkan masalah seperti:

- Impaksi (tidak tumbuh sempurna)
- Menyebabkan infeksi
- Mendorong gigi lain
- Karies yang sulit diobati

## Mitos: Gigi Bungsu Tidak Penting

**Fakta:** Gigi bungsu adalah gigi fungsional yang bisa digunakan untuk mengunyah. Selama sehat dan tumbuh dengan baik, gigi bungsu bisa dipertahankan.

## Mitos: Pencabutan Gigi Bungsu Sangat Sakit

**Fakta:** Prosedur pencabutan dilakukan dengan anestesi lokal, sehingga tidak terasa sakit saat proses. Setelah anestesi habis, dokter akan memberikan obat pereda nyeri.

## Tips Perawatan Gigi Bungsu

1. Sikat gigi dengan lembut di area gigi bungsu
2. Gunakan benang gigi secara rutin
3. Kumur dengan air garam untuk mengurangi risiko infeksi
4. Rutin kontrol ke dokter gigi

Jangan takut untuk konsultasi ke dokter gigi jika mengalami masalah dengan gigi bungsu Anda!
    `,
    coverImage: 'https://picsum.photos/seed/wisdom-tooth/800/400',
    category: 'Edukasi',
    author: 'drg. Fajrin Wijaya',
    publishedAt: '2026-06-01',
    readTime: '4 menit',
  },
  {
    id: '5',
    slug: 'tips-memutihkan-gigi-di-rumah',
    title: 'Tips Aman Memutihkan Gigi di Rumah',
    excerpt: 'Cara aman dan efektif untuk memutihkan gigi sendiri di rumah.',
    content: `
# Tips Aman Memutihkan Gigi di Rumah

Senyum putih cerah adalah dambaan banyak orang. Berikut tips aman untuk memutihkan gigi di rumah!

## Sebelum Memutihkan Gigi

1. **Konsultasi ke Dokter Gigi** - Pastikan gigi dan gusi sehat sebelum美白
2. **Perbaiki Gigi Berlubang** - Gigi berlubang harus ditambal dulu
3. **Scaling** - Pastikan karang gigi sudah dibersihkan

## Cara Aman Memutihkan Gigi di Rumah

### 1. Pasta Gigi Pemutih
Pasta gigi pemutih dengan bahan aktif seperti baking soda atau hydrogen peroxide bisa membantu mengangkat noda permukaan.

### 2. Oil Pulling
Berkumur dengan minyak kelapa selama 15-20 menit dapat membantu membersihkan bakteri dan noda.

### 3. Hindari Makanan Penyebab Noda
Kurangi konsumsi kopi, teh, wine merah, dan makanan berwarna gelap lainnya.

### 4. Kumur Air Putih
Berkumur dengan air putih setelah makan dapat membantu mencegah noda.

## Yang Harus Dihindari

❌ Jangan gunakan pemutih gigi berlebihan
❌ Jangan gunakan bahan kimia keras tanpa resep dokter
❌ Jangan期望 hasil instan - butuh waktu untuk melihat hasil

## Pilihan Terbaik: Treatment di Klinik

Untuk hasil yang lebih optimal dan aman, sebaiknya lakukan treatment pemutihan di klinik dokter gigi dengan pengawasan profesional.

Hubungi kami di Klinik AYNA Medical Clinic untuk konsultasi pemutihan gigi!
    `,
    coverImage: 'https://picsum.photos/seed/whitening/800/400',
    category: 'Estetika',
    author: 'drg. Siti Hardianti',
    publishedAt: '2026-05-28',
    readTime: '5 menit',
  },
]