export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export const faqs: FAQ[] = [
  {
    id: 'faq1',
    question: 'Apakah sakit saat melakukan scaling gigi?',
    answer: 'Scaling gigi umumnya tidak sakit. Beberapa pasien mungkin merasa sedikit ngilu atau sensitif, terutama jika karang gigi sudah banyak. Dokter akan menggunakan anestesi topikal jika diperlukan. Kebanyakan pasien mengatakan ketidaknyamanannya minimal.',
    category: 'Perawatan',
  },
  {
    id: 'faq2',
    question: 'Berapa lama waktu yang dibutuhkan untuk pasang behel?',
    answer: 'Durasi perawatan behel bervariasi tergantung kompleksitas kasus. Rata-rata untuk kasus sederhana: 12-18 bulan, kasus sedang: 18-24 bulan, kasus kompleks: 24-36 bulan. Konsultasi awal diperlukan untuk estimasi yang lebih akurat.',
    category: 'Orthodonti',
  },
  {
    id: 'faq3',
    question: 'Apakah aman untuk pemutihan gigi saat hamil atau menyusui?',
    answer: 'Secara umum, perawatan pemutihan gigi sebaiknya ditunda selama kehamilan dan menyusui. Meskipun bahan pemutih aman, belum ada penelitian yang cukup untuk menjamin keamanannya. Konsultasikan dengan dokter gigi Anda untuk waktu yang tepat.',
    category: 'Pemutihan',
  },
  {
    id: 'faq4',
    question: 'Kapan anak harus pertama kali ke dokter gigi?',
    answer: 'Anak sebaiknya pertama kali ke dokter gigi saat gigi sulung pertama muncul (sekitar usia 6 bulan - 1 tahun), atau paling lambat saat usia 2 tahun. Kunjungan dini penting untuk mendeteksi masalah dan membangun kebiasaan gigi sehat.',
    category: 'Anak',
  },
  {
    id: 'faq5',
    question: 'Apakah bisa booking janji temu via WhatsApp?',
    answer: 'Ya! Anda bisa booking via WhatsApp di nomor +62 812-3456-7890. Cukup kirim nama, layanan yang diinginkan, dan tanggal/waktu yang preferensi. Kami akan konfirmasi ketersediaan dan mengirim detail appointment.',
    category: 'Booking',
  },
  {
    id: 'faq6',
    question: 'Apakah ada garansi untuk penambalan atau perawatan gigi?',
    answer: 'Ya, kami memberikan garansi untuk penambalan komposit selama 6-12 bulan dan Veneer selama 2 tahun, selama pasien menjalani kontrol rutin dan menjaga kebersihan mulut. Detail garansi akan dijelaskan saat perawatan.',
    category: 'Perawatan',
  },
  {
    id: 'faq7',
    question: 'Berapa biaya konsultasi pertama?',
    answer: 'Konsultasi pertama di Ayna Medical Clinic adalah GRATIS. Anda hanya membayar untuk tindakan perawatan yang dilakukan. Konsultasi meliputi pemeriksaan, diskusi rencana perawatan, dan estimasi biaya.',
    category: 'Booking',
  },
  {
    id: 'faq8',
    question: 'Apakah bisa pakai asuransi untuk pembayaran?',
    answer: 'Kami bekerja sama dengan beberapa asuransi dan perusahaan. Silakan hubungi kami untuk memastikan apakah asuransi Anda bisa digunakan. Untuk pasien tanpa asuransi, kami tersedia opsi pembayaran cicilan.',
    category: 'Pembayaran',
  },
  {
    id: 'faq9',
    question: 'Bagaimana cara merawat gigi setelah pasang behel?',
    answer: 'Setelah pasang behel, Anda perlu menyikat gigi lebih sering (setiap makan), menggunakan sikat gigi khusus behel, benang gigi (floss), dan mouthwash. Hindari makanan keras dan lengket. Kontrol rutin setiap 4-6 minggu diperlukan.',
    category: 'Orthodonti',
  },
  {
    id: 'faq10',
    question: 'Apakah perawatan gigi anak ditanggung BPJS?',
    answer: 'Beberapa tindakan perawatan gigi anak ditanggung oleh BPJS Kesehatan, tergantung kategori dan ketersediaan di fasilitas kesehatan. Silakan tanyakan langsung ke kami untuk informasi terbaru tentang kerja sama dengan BPJS.',
    category: 'Pembayaran',
  },
]