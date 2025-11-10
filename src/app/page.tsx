import Image from 'next/image'
import Link from 'next/link'
import Pkg from '../../package.json' // Pastikan path ini benar

export default function Home() {
  // Kelas reusable untuk card agar mudah dikelola
  const cardClasses = `
    group rounded-xl bg-white/50 backdrop-blur-lg 
    p-6 shadow-lg transition-all duration-300 
    hover:bg-white/70 hover:shadow-2xl hover:-translate-y-1 
    flex flex-col text-center items-center h-full
  `

  return (
    // Container utama dibuat flex column untuk "mendorong" footer ke bawah
    <main className="flex flex-col min-h-screen">
      
      {/* 1. Background Image */}
      {/* Dibuat 'fixed' dan 'inset-0' agar memenuhi seluruh layar di belakang konten */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <Image
          fill
          src="/bg-beekasir.png"
          alt="Beekasir Background"
          style={{ objectFit: 'cover' }} // 'cover' lebih baik dari 'contain' untuk background
          priority
          sizes="100vw" // Memberi tahu Next.js bahwa gambar ini memenuhi viewport
        />
        {/* Overlay gelap opsional untuk membuat teks lebih mudah dibaca */}
        {/* <div className="absolute inset-0 bg-black/20"></div> */}
      </div>

      {/* 2. Header */}
      {/* 'sticky' membuatnya tetap di atas, 'backdrop-blur-sm' untuk efek transparan */}
      <header className="w-full p-4 bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center gap-3">
          <Image
            src="/beekasir-name.svg"
            alt="BeeKasir Logo"
            width={40} // Sedikit lebih besar untuk header
            height={40}
            priority
          />
          <span className="text-xl font-bold text-gray-800">
            Beekasir{" "}
            <span className="font-light text-base sm:text-lg">
              v{Pkg.version}
            </span>
          </span>
        </div>
      </header>

      {/* 3. Main Content (Hero Section) */}
      {/* 'flex-grow' membuat section ini mengambil sisa ruang, 'items-center justify-center' memusatkan grid */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          
          {/* Card 1: Download */}
          <a
            href="https://play.google.com/store/apps/details?id=com.beebeesoft.beekasir"
            className={cardClasses}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              Download
            </h2>
            <p className="text-sm text-gray-700">
              Download dan install Aplikasi Beekasir di Google Play Store.
            </p>
          </a>

          {/* Card 2: Web Admin */}
          <Link href="/admin" className={cardClasses} rel="noopener noreferrer">
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              BeeKasir Web
            </h2>
            <p className="text-sm text-gray-700">
              Login ke panel admin BeeKasir Web sekarang.
            </p>
          </Link>

          {/* Card 3: Pricing */}
          <Link
            href="/public/pricing"
            className={cardClasses}
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              Pilihan Paket
            </h2>
            <p className="text-sm text-gray-700">
              Lihat daftar harga paket dan perangkat kasir yang kami tawarkan.
            </p>
          </Link>

          {/* Card 4: About */}
          <a
            href="https://warza.id/"
            className={cardClasses}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl font-semibold text-gray-900">
              Tentang Kami
            </h2>
            <p className="text-sm text-gray-700">
              Kenali kami lebih dekat di website warza.id
            </p>
          </a>
        </div>
      </div>

      {/* 4. Footer */}
      {/* 'mt-auto' memastikan footer ini menempel di bawah jika kontennya pendek */}
      <footer className="w-full p-4 bg-white/80 backdrop-blur-sm mt-auto z-10">
        <div className="container mx-auto flex items-center justify-center sm:justify-end gap-2 text-sm text-gray-700">
          <span>By Warza Teknologi</span>
          <Image
            src="/warza-logo.svg"
            alt="Warza Logo"
            width={30}
            height={30}
            priority
          />
        </div>
      </footer>
    </main>
  );
}