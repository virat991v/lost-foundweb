import { Link } from 'react-router-dom'
import { Search, Zap, Shield, Globe, Bell } from 'lucide-react'
import Footer from '../../components/layout/Footer'

function Navbar() {
  return (
    <nav className="bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#1a1a1a] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#D4F547] rounded-lg flex items-center justify-center">
            <Search size={16} className="text-black" />
          </div>
          <span className="text-white font-bold text-sm tracking-tight">lost-found</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-400 text-sm hover:text-white transition-colors">Features</a>
          <a href="#pipeline" className="text-gray-400 text-sm hover:text-white transition-colors">How It Works</a>
          <Link to="/browse" className="text-gray-400 text-sm hover:text-white transition-colors">Browse</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-gray-300 text-sm hover:text-white transition-colors">
            Login
          </Link>
          <Link
            to="/signup"
            className="border border-[#2a2a2a] text-white text-sm px-4 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}

const features = [
  {
    icon: Zap,
    title: 'AI-Matching Engine',
    desc: 'Algorithmic matching pairs lost reports with found items using category, description, and visual similarity analysis.',
  },
  {
    icon: Shield,
    title: 'Secure Handshake',
    desc: 'Multi-step ownership verification with admin oversight ensures only rightful owners reclaim their belongings.',
  },
  {
    icon: Globe,
    title: 'Campus-Wide Search',
    desc: 'Full-text search across all lost and found reports from your entire university campus in real-time.',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    desc: 'Instant notifications when a potential match is found or your claim status changes.',
  },
]

const pipelineSteps = [
  {
    num: '01',
    title: 'Report Misplaced Property',
    desc: 'Submit a detailed report with photos, description, location, and private verification details.',
  },
  {
    num: '02',
    title: 'Algorithmic Matching',
    desc: 'Our system scans all reports and surfaces high-confidence matches based on multiple criteria.',
  },
  {
    num: '03',
    title: 'Secure Ownership Return',
    desc: 'Verified owners and finders are connected through a secure, admin-supervised handoff process.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1">
          <div className="inline-flex items-center bg-[#D4F547]/10 border border-[#D4F547]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F547] mr-2" />
            <span className="text-[#D4F547] text-xs font-semibold tracking-wide">Secure Campus Infrastructure</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Never Lose<br />Track Again
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
            Pathway bridges the gap between misplaced property and student owners through
            secure verification, AI-assisted matching, and campus-wide coordination.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/report-lost"
              className="border border-white/20 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Report Lost Item
            </Link>
            <Link
              to="/browse"
              className="border border-white/20 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Browse Found Items
            </Link>
          </div>
        </div>

        {/* Right — decorative illustration */}
        <div className="flex-1 max-w-sm md:max-w-none">
          <div className="relative bg-[#D4F547] rounded-2xl p-8 aspect-square max-w-xs mx-auto md:max-w-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {/* SVG illustration */}
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="mx-auto">
                  {/* Phone outline */}
                  <rect x="70" y="30" width="60" height="110" rx="10" fill="#0a0a0a" />
                  <rect x="75" y="40" width="50" height="85" rx="6" fill="#1a1a1a" />
                  {/* Screen content */}
                  <rect x="80" y="48" width="40" height="5" rx="2" fill="#D4F547" />
                  <rect x="80" y="58" width="30" height="3" rx="1.5" fill="#333" />
                  <rect x="80" y="64" width="35" height="3" rx="1.5" fill="#333" />
                  <rect x="80" y="74" width="40" height="20" rx="4" fill="#222" />
                  <circle cx="90" cy="84" r="6" fill="#D4F547" opacity="0.3" />
                  <rect x="99" y="80" width="16" height="3" rx="1.5" fill="#555" />
                  <rect x="99" y="86" width="12" height="2" rx="1" fill="#444" />
                  {/* Home button */}
                  <circle cx="100" cy="130" r="5" fill="#333" />
                  {/* Floating items */}
                  <rect x="25" y="60" width="32" height="24" rx="5" fill="#0a0a0a" stroke="#D4F547" strokeWidth="1.5" />
                  <text x="30" y="74" fontSize="8" fill="#D4F547">KEYS</text>
                  <rect x="143" y="55" width="36" height="26" rx="5" fill="#0a0a0a" stroke="#D4F547" strokeWidth="1.5" />
                  <text x="148" y="70" fontSize="7" fill="#D4F547">BAG</text>
                  <rect x="30" y="105" width="36" height="26" rx="5" fill="#0a0a0a" stroke="#D4F547" strokeWidth="1.5" />
                  <text x="35" y="120" fontSize="7" fill="#D4F547">PHONE</text>
                  {/* Check marks */}
                  <circle cx="150" cy="110" r="10" fill="#0a0a0a" />
                  <polyline points="145,110 148,114 156,107" stroke="#D4F547" strokeWidth="2" fill="none" />
                  {/* Dashed lines */}
                  <line x1="57" y1="72" x2="70" y2="75" stroke="#D4F547" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
                  <line x1="130" y1="70" x2="143" y2="68" stroke="#D4F547" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
                  <line x1="66" y1="118" x2="76" y2="110" stroke="#D4F547" strokeWidth="1" strokeDasharray="3,2" opacity="0.6" />
                </svg>
                <p className="text-black font-bold text-sm mt-2">Campus Tracking</p>
                <p className="text-black/60 text-xs">Secure Recovery Platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#111111] border-t border-[#1a1a1a] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 block mb-3">
              Secured Infrastructure
            </span>
            <h2 className="text-white font-bold text-3xl md:text-4xl">
              Features built for campus trust
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                <div className="w-10 h-10 bg-[#D4F547]/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#D4F547]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 block mb-3">
              The Pipeline
            </span>
            <h2 className="text-white font-bold text-3xl md:text-4xl">
              Simple, intuitive protocol
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pipelineSteps.map(({ num, title, desc }) => (
              <div key={num} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-black text-[#D4F547] leading-none">{num}</span>
                  <div className="flex-1 h-px bg-[#2a2a2a]" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-6">Ready to get started? Join your campus community.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/signup"
                className="bg-[#D4F547] text-black font-semibold px-8 py-3 rounded-lg text-sm hover:bg-[#c2e040] transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                to="/browse"
                className="border border-[#2a2a2a] text-white px-8 py-3 rounded-lg text-sm hover:bg-[#1a1a1a] transition-colors"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
