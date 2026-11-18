import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Menu, 
  X, 
  ArrowRight, 
  Bot, 
  Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { SupportedLanguage } from '@/types/models';

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<SupportedLanguage>('en');

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Courses', path: '/#courses' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Chat & Voice Demo', path: '/demo' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-slateText-main selection:bg-primary-100 selection:text-primary-700">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                AI Counsellor
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                Smart Admission Guidance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary font-semibold' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector selectedLanguage={lang} onLanguageChange={setLang} />
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600">
                <Shield className="w-3.5 h-3.5" /> Admin
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="sm" className="gap-2 shadow-sm font-medium">
                <Bot className="w-4 h-4" /> Start Counselling <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector selectedLanguage={lang} onLanguageChange={setLang} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/demo" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gap-2">
                  <Bot className="w-4 h-4" /> Start Free Counselling
                </Button>
              </Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <Shield className="w-4 h-4" /> Counsellor Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Body */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="font-bold text-base text-slate-900">AI Counsellor</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
                Next-generation admission guidance platform combining conversational intelligence with accredited human academic advisors to help students make confident career choices.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Layer 2 Design System Activated
              </div>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Programs</h5>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link to="/demo" className="hover:text-primary">Engineering & Tech</Link></li>
                <li><Link to="/demo" className="hover:text-primary">Management & MBA</Link></li>
                <li><Link to="/demo" className="hover:text-primary">Design & UI/UX</Link></li>
                <li><Link to="/demo" className="hover:text-primary">Medical & Biotech</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Company</h5>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#about" className="hover:text-primary">About Us</a></li>
                <li><a href="#contact" className="hover:text-primary">Contact Support</a></li>
                <li><Link to="/admin" className="hover:text-primary">Partner Universities</Link></li>
                <li><Link to="/admin" className="hover:text-primary">Counsellor Portal</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">Legal & Safety</h5>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><a href="#privacy" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#security" className="hover:text-primary">Student Data Protection</a></li>
                <li><a href="#compliance" className="hover:text-primary">Accreditation Info</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <p>© 2026 AI Student Counsellor. All rights reserved.</p>
            <p>Designed for student success and ethical academic advisory.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
