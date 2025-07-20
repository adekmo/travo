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
    <div style="font-family: 'Segoe UI', sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">Konfirmasi Booking Anda</h2>
      </div>

      <div style="padding: 24px;">
        <p>Halo <strong>${name}</strong>,</p>
        <p>Terima kasih telah melakukan booking melalui <strong>Travoo</strong>. Berikut adalah rincian pemesanan Anda:</p>

        <table style="width: 100%; margin-top: 16px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0;"><strong>📦 Paket</strong></td>
            <td>: ${packageTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>🆔 Order ID</strong></td>
            <td>: ${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>📅 Tanggal</strong></td>
            <td>: ${date}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>👥 Peserta</strong></td>
            <td>: ${numberOfPeople} orang</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>💰 Total</strong></td>
            <td>: Rp ${total.toLocaleString("id-ID")}</td>
          </tr>
        </table>

        <div style="margin: 24px 0;">
          <a href="https://yourdomain.com/dashboard/customer" target="_blank" style="background-color: #1e40af; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">
            Lihat Detail Booking
          </a>
        </div>

        <p>Jika Anda memiliki pertanyaan, silakan hubungi tim support kami kapan saja.</p>

        <p>Salam hangat,</p>
        <p><strong>Tim Travoo</strong></p>
      </div>

      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
        Email ini dikirim otomatis oleh sistem Travoo. Mohon untuk tidak membalas email ini.
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"Travoo" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Booking kamu berhasil 🎉",
    html,
  })
}
