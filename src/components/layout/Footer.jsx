import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 bg-[#D4F547] rounded-lg flex items-center justify-center">
        <Search size={16} className="text-black" />
      </div>
      <span className="text-white font-bold text-sm tracking-tight">lost-found</span>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#1a1a1a] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-3 text-gray-500 text-sm leading-relaxed">
              Secure campus lost &amp; found platform built for university communities.
            </p>
          </div>

          {/* For Students */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3">
              For Students
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/report-lost', label: 'Report Lost Item' },
                { to: '/report-found', label: 'Report Found Item' },
                { to: '/browse', label: 'Browse Items' },
                { to: '/dashboard', label: 'My Dashboard' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Admins */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3">
              For Admins
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/admin', label: 'Admin Dashboard' },
                { to: '/admin/users', label: 'User Management' },
                { to: '/admin/reports', label: 'Reports Console' },
                { to: '/admin/claims', label: 'Ownership Claims' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div>
            <h4 className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3">
              Security
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Use', href: '#' },
                { label: 'Contact Support', href: '#' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Lost &amp; Found Campus Platform. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">Built for campus trust and security</p>
        </div>
      </div>
    </footer>
  )
}
