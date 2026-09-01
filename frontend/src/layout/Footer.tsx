import { Instagram, Mail, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BUSINESS } from '../constants/business'

export function Footer() {
  return (
    <footer className="bg-forest py-12 text-white">
      <div className="page-shell grid gap-8 sm:gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link to="/" className="font-display text-xl font-extrabold text-white">
            Zorch Farms
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-mint/80">
            Fresh agricultural provisions, thoughtfully sourced for homes and businesses.
          </p>
          <p className="mt-6 text-xs text-mint/70">
            © {new Date().getFullYear()} Zorch Farms.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-mint">
            Explore
          </h2>
          <div className="space-y-1.5 text-sm text-mint/80">
            <Link className="inline-block py-1 hover:text-white transition" to="/categories">
              Browse provisions
            </Link>
            <br />
            <Link className="inline-block py-1 hover:text-white transition" to="/request">
              Request summary
            </Link>
            <br />
            <Link className="inline-block py-1 hover:text-white transition" to="/contact">
              Contact us
            </Link>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-mint">
            Connect
          </h2>
          <div className="space-y-2 text-sm text-mint/80">
            <a
              className="flex items-center gap-2 py-1 hover:text-white transition"
              href={`https://wa.me/${BUSINESS.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={15} className="shrink-0" /> WhatsApp
            </a>
            <a
              className="flex items-center gap-2 py-1 hover:text-white transition"
              href={`mailto:${BUSINESS.email}`}
            >
              <Mail size={15} className="shrink-0" /> Email us
            </a>
            <a
              className="flex items-center gap-2 py-1 hover:text-white transition"
              href="#instagram"
            >
              <Instagram size={15} className="shrink-0" /> Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
