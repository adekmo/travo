import { Facebook, LucideInstagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/packages" className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Travoo
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Platform booking paket wisata terpercaya untuk petualangan tak
              terlupakan di seluruh Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/packages"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Daftar Sebagai Seller
                </Link>
              </li>
              <li>
                <Link
                  href="/karir"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Karir
                </Link>
              </li>
              <li>
                <Link
                  href="/affiliate-program"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Affiliate Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Kontak Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +62 821 3456 7890
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                info@travoo.com
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  Jl. Empu Sendok 1 no 11
                  <br />
                  Kota Tangerang, 10270
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Ikuti Kami</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
                aria-label="Instagram"
              >
                <LucideInstagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Travoo. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer