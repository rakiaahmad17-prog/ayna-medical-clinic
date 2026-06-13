'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, Clock, User, Phone, Mail, MessageCircle, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { DOCTOR_WHATSAPP } from '@/lib/config'

const serviceOptions = [
  'Scaling & Cleaning',
  'Penambalan Gigi',
  'Behel / Orthodonti',
  'Pemutihan Gigi',
  'Pencabutan Gigi',
  'Perawatan Gigi Anak',
  'Venner Gigi',
  'Implan Gigi',
  'Lainnya',
]

const doctorOptions = [
  'drg. Siti Hardianti',
  'drg. Fajrin Wijaya',
  'Tidak ada preferensi',
]

const timeSlots = [
  '08.00', '09.00', '10.00', '11.00',
  '13.00', '14.00', '15.00', '16.00', '17.00', '18.00', '19.00',
]

export default function BookingPage() {
  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    email: '',
    layanan: '',
    dokter: '',
    tanggal: '',
    waktu: '',
    pesan: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nama.trim()) newErrors.nama = 'Nama lengkap wajib diisi'
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Nomor WhatsApp wajib diisi'
    else if (!/^[\d\s+()-]{10,}$/.test(formData.whatsapp)) newErrors.whatsapp = 'Format nomor WhatsApp tidak valid'
    if (!formData.layanan) newErrors.layanan = 'Pilih layanan yang diinginkan'
    if (!formData.dokter) newErrors.dokter = 'Pilih dokter yang diinginkan'
    if (!formData.tanggal) newErrors.tanggal = 'Pilih tanggal kunjungan'
    if (!formData.waktu) newErrors.waktu = 'Pilih waktu kunjungan'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError(null)

    const selectedPhone = DOCTOR_WHATSAPP[formData.dokter] || DOCTOR_WHATSAPP['Tidak ada preferensi']
    const dokterName = formData.dokter

    // Build WhatsApp message (backup notification)
    const message = `Halo Klinik AYNA Medical Clinic!

*saya ingin booking janji temu:*

*Nama:* ${formData.nama}
*WhatsApp:* ${formData.whatsapp}
${formData.email ? `*Email:* ${formData.email}\n` : ''}*Layanan:* ${formData.layanan}
*Dokter:* ${dokterName}
*Tanggal:* ${formData.tanggal}
*Waktu:* ${formData.waktu}
${formData.pesan ? `\n*Pesan:*\n${formData.pesan}` : ''}`

    try {
      // PRIMARY: Save booking to database first
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: formData.nama,
          whatsapp: formData.whatsapp,
          email: formData.email,
          layanan: formData.layanan,
          dokter: formData.dokter,
          tanggal: formData.tanggal,
          waktu: formData.waktu,
          pesan: formData.pesan,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save booking')
      }

      // Save booking ID for display
      setBookingId(data.bookingId)

      // Backup: Open WhatsApp as secondary notification
      const encoded = encodeURIComponent(message)
      window.open(`https://wa.me/${selectedPhone}?text=${encoded}`, '_blank')

      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Booking error:', error)
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat menyimpan booking. Silakan coba lagi.'
      )
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  // Get maximum date (3 months from now)
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  if (isSubmitted) {
    return (
      <section className="min-h-screen pt-32 pb-20 flex items-center">
        <div className="section-container">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-4">
              Booking Berhasil!
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Booking Anda telah tersimpan di sistem kami. Tim kami akan menghubungi Anda dalam 1 jam untuk konfirmasi janji temu.
            </p>
            {bookingId && (
              <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4 mb-6">
                <p className="text-sm text-primary-700 mb-1">ID Booking:</p>
                <p className="font-mono font-bold text-xl text-primary-800">{bookingId}</p>
              </div>
            )}
            <div className="bg-surface-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-slate-800 mb-3">Detail Booking:</h3>
              <div className="text-left space-y-2 text-sm text-slate-600">
                <p><span className="font-medium">Nama:</span> {formData.nama}</p>
                <p><span className="font-medium">Layanan:</span> {formData.layanan}</p>
                <p><span className="font-medium">Dokter:</span> {formData.dokter}</p>
                <p><span className="font-medium">Tanggal:</span> {formData.tanggal}</p>
                <p><span className="font-medium">Waktu:</span> {formData.waktu}</p>
              </div>
            </div>
            <button onClick={() => {
              setIsSubmitted(false)
              setBookingId(null)
              setFormData({
                nama: '',
                whatsapp: '',
                email: '',
                layanan: '',
                dokter: '',
                tanggal: '',
                waktu: '',
                pesan: '',
              })
            }} className="btn-secondary">
              Booking Lagi
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-white via-primary-50/40 to-warm-50/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <Calendar size={14} />
              Booking Janji Temu
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Jadwalkan <span className="text-gradient">Kunjungan</span> Anda
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Isi form di bawah dan kami akan membantu mengatur jadwal kunjungan Anda. Konsultasi pertama gratis!
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding -mt-8">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="font-display text-2xl font-bold text-slate-800 mb-6">Form Booking</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nama */}
                  <div>
                    <label className="input-label">
                      <User size={14} className="inline mr-1" />
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap Anda"
                      className={`input-field ${errors.nama ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                    />
                    {errors.nama && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.nama}</p>}
                  </div>

                  {/* WhatsApp & Email */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">
                        <Phone size={14} className="inline mr-1" />
                        Nomor WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="08xxxxxxxxxx"
                        className={`input-field ${errors.whatsapp ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                      />
                      {errors.whatsapp && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.whatsapp}</p>}
                    </div>
                    <div>
                      <label className="input-label">
                        <Mail size={14} className="inline mr-1" />
                        Email (opsional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@contoh.com"
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Layanan */}
                  <div>
                    <label className="input-label">
                      Layanan yang Diinginkan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="layanan"
                      value={formData.layanan}
                      onChange={handleChange}
                      className={`input-field ${errors.layanan ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                    >
                      <option value="">Pilih layanan...</option>
                      {serviceOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.layanan && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.layanan}</p>}
                  </div>

                  {/* Dokter */}
                  <div>
                    <label className="input-label">
                      Dokter Pilihan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="dokter"
                      value={formData.dokter}
                      onChange={handleChange}
                      className={`input-field ${errors.dokter ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                    >
                      <option value="">Pilih dokter...</option>
                      {doctorOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.dokter && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.dokter}</p>}
                  </div>

                  {/* Tanggal & Waktu */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">
                        <Calendar size={14} className="inline mr-1" />
                        Tanggal Kunjungan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="tanggal"
                        value={formData.tanggal}
                        onChange={handleChange}
                        min={minDate}
                        max={maxDateStr}
                        className={`input-field ${errors.tanggal ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                      />
                      {errors.tanggal && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.tanggal}</p>}
                    </div>
                    <div>
                      <label className="input-label">
                        <Clock size={14} className="inline mr-1" />
                        Waktu Preferensi <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="waktu"
                        value={formData.waktu}
                        onChange={handleChange}
                        className={`input-field ${errors.waktu ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
                      >
                        <option value="">Pilih waktu...</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time} WITA</option>
                        ))}
                      </select>
                      {errors.waktu && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.waktu}</p>}
                    </div>
                  </div>

                  {/* Pesan */}
                  <div>
                    <label className="input-label">Pesan / Keluhan (opsional)</label>
                    <textarea
                      name="pesan"
                      value={formData.pesan}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Ceritakan keluhan atau pertanyaan Anda..."
                      className="input-field resize-none"
                    />
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Gagal menyimpan booking</p>
                        <p className="text-sm text-red-600 mt-1">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 text-base"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={18} className="animate-spin" />
                        Menyimpan Booking...
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Simpan Booking
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="card bg-primary-50 border border-primary-100">
                <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-slate-800 mb-2">Konsultasi Gratis</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Konsultasi pertama di Klinik AYNA Medical Clinic adalah gratis. Dokter kami akan memberikan pemeriksaan awal dan rekomendasi perawatan tanpa biaya.
                </p>
              </div>

              <div className="card">
                <h3 className="font-display font-semibold text-slate-800 mb-4">Jam Praktik</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { day: 'Senin - Jumat', time: '08.00 - 20.00' },
                    { day: 'Sabtu', time: '08.00 - 17.00' },
                    { day: 'Minggu', time: 'Tutup' },
                  ].map(({ day, time }) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-surface-100 last:border-0">
                      <span className="text-slate-600">{day}</span>
                      <span className="font-medium text-slate-800">{time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="font-display font-semibold text-slate-800 mb-4">Kontak Dokter</h3>
                <div className="space-y-3">
                  <a href="https://wa.me/6285343747010" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center overflow-hidden">
                      <Image src="/images/wa.png" alt="WhatsApp" width={16} height={16} className="object-contain" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">drg. Siti Hardianti</p>
                      <p className="text-xs text-slate-500">+62 853-4374-7010</p>
                    </div>
                  </a>
                  <a href="https://wa.me/6281256718190" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center overflow-hidden">
                      <Image src="/images/wa.png" alt="WhatsApp" width={16} height={16} className="object-contain" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 text-sm">drg. Fajrin Wijaya</p>
                      <p className="text-xs text-slate-500">+62 812-5671-8190</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}