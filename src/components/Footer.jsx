import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path d="M13.5 4c.5 2.2 2.1 4 4.3 4.6v2.1a7.1 7.1 0 0 1-4.3-1.5v6.1a5.4 5.4 0 1 1-5.4-5.4c.4 0 .9.1 1.3.2v2.3a2.9 2.9 0 1 0 2.1 2.8V4h2z" fill="currentColor" />
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
  </svg>
);

const GoogleMapsIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7z" fill="currentColor" />
    <circle cx="12" cy="9" r="2.5" fill="#fff" />
  </svg>
);

const Footer = () => {
  const onSubscribe = (e) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get('email');
    if (!email) return toast.error('Masukkan email terlebih dahulu');
    toast.success('Berhasil berlangganan');
    e.currentTarget.reset();
  };

  return (
    <footer className="mt-24 border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-extrabold text-primary tracking-tight">StepUp <span className="text-dark">Studio</span></Link>
            <p className="text-paragraph">Brand sepatu modern untuk gaya hidup aktif. Nyaman, stylish, dan siap untuk aktivitas Anda.</p>
            <div className="flex items-center gap-3">
              <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 text-dark hover:bg-primary hover:text-white transition-colors" aria-label="TikTok">
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 text-dark hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://maps.google.com/" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 text-dark hover:bg-primary hover:text-white transition-colors" aria-label="Google Maps">
                <GoogleMapsIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-dark">Navigasi</h4>
            <div className="flex flex-col gap-2 text-paragraph">
              <a href="#products" className="hover:text-primary">Koleksi</a>
              <a href="#" className="hover:text-primary">Tentang Kami</a>
              <a href="#" className="hover:text-primary">Kebijakan Privasi</a>
              <a href="#" className="hover:text-primary">Syarat & Ketentuan</a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-dark">Kontak</h4>
            <div className="flex flex-col gap-2 text-paragraph">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Solo, Indonesia</span>
              <a href="mailto:hello@stepupstudio.com" className="hover:text-primary">hello@stepupstudio.com</a>
              <a href="tel:+6208123456789" className="hover:text-primary">0892134564</a>
              <a href="https://maps.google.com/" target="_blank" rel="noreferrer" className="hover:text-primary">Lihat di Google Maps</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-dark">Berlangganan</h4>
            <p className="text-paragraph">Dapatkan update koleksi terbaru dan promo eksklusif.</p>
            <form onSubmit={onSubscribe} className="flex gap-2">
              <input name="email" type="email" placeholder="Email kamu" className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-dark focus:outline-none focus:ring-2 focus:ring-primary" />
              <button className="px-5 py-2 rounded-xl bg-primary text-white font-bold hover:opacity-90 active:scale-95 transition">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-paragraph">© {new Date().getFullYear()} StepUp Studio. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-paragraph">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
