import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  DollarSign, 
  Tag, 
  Star, 
  HelpCircle, 
  Image, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Blog Posts', href: '/blog', icon: FileText },
    { name: 'Pages', href: '/pages', icon: FileText },
    { name: 'Pricing Plans', href: '/pricing', icon: DollarSign },
    { name: 'Promotions', href: '/promotions', icon: Tag },
    { name: 'Testimonials', href: '/testimonials', icon: Star },
    { name: 'FAQs', href: '/faqs', icon: HelpCircle },
    { name: 'Media Library', href: '/media', icon: Image },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-black
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
            MigraHosting CMS
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-purple text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@migrahosting.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-brand-purple"
            >
              View Website
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
