import nodemailer from "nodemailer"

export async function sendBookingEmail({
  to,
  name,
  orderId,
  packageTitle,
  date,
  numberOfPeople,
  total,
}: {
  to: string
  name: string
  orderId: string
  packageTitle: string
  date: string
  numberOfPeople: number
  total: number
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  })

  const html = `
    <div style="font-family: sans-serif; padding: 16px;">
      <h2 style="color: #1e40af;">Booking Berhasil 🎉</h2>
      <p>Halo <strong>${name}</strong>,</p>
      <p>Terima kasih sudah booking di <strong>Travoo</strong>. Berikut detail pemesananmu:</p>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Nama Paket:</strong> ${packageTitle}</li>
        <li><strong>Tanggal Keberangkatan:</strong> ${date}</li>
        <li><strong>Jumlah Peserta:</strong> ${numberOfPeople} orang</li>
        <li><strong>Total Pembayaran:</strong> Rp ${total.toLocaleString()}</li>
      </ul>
      <p>Silakan cek kembali detailmu. Jika ada pertanyaan, hubungi kami kapan saja.</p>
      <p>Salam hangat,</p>
      <p><strong>Travoo Team</strong></p>
    </div>
  `

  await transporter.sendMail({
    from: `"Travoo" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Booking kamu berhasil 🎉",
    html,
  })
}
