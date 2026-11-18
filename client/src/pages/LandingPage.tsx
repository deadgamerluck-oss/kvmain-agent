import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIAvatar } from '@/components/common/AIAvatar';
import { useHealthCheck } from '@/hooks/useHealthCheck';
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Languages, 
  Clock, 
  Users, 
  CheckCircle2, 
  Server,
  Activity,
  AlertCircle,
  PhoneCall,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { health, loading, error, refetch } = useHealthCheck();

  const features = [
    {
      title: 'Personalized Course Guidance',
      desc: 'Matches your 10th/12th/Degree percentages, interests, and budget with accredited top courses.',
      icon: Compass,
      color: 'text-primary-600',
      bg: 'bg-primary-50'
    },
    {
      title: 'Multilingual Counselling',
      desc: 'Speak naturally in English, Hindi, Hinglish, Gujarati, or Rajasthani with real-time translation support.',
      icon: Languages,
      color: 'text-secondary-600',
      bg: 'bg-secondary-50'
    },
    {
      title: '24/7 AI Assistance',
      desc: 'Get immediate answers anytime regarding cutoffs, entrance deadlines, fees, and syllabus details.',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      title: 'Human Counsellor Support',
      desc: 'Seamlessly schedule 1-on-1 sessions with dedicated university admission deans and visa officers.',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Tell us about yourself',
      desc: 'Share your academic stream, scores, target career, and study preferences with the counsellor.'
    },
    {
      num: '02',
      title: 'Discover suitable courses',
      desc: 'Our AI matches you against hundreds of vetted degree programs and specialized certifications.'
    },
    {
      num: '03',
      title: 'Get personalized guidance',
      desc: 'Compare eligibility, fee estimates, placement records, and future job demand across institutions.'
    },
    {
      num: '04',
      title: 'Connect with a human counsellor',
      desc: 'Finalize your shortlist with expert university counsellors ready to guide your application step-by-step.'
    }
  ];

  const sampleCourses = [
    { title: 'B.Tech in Artificial Intelligence', duration: '4 Years', rating: '4.9 ★', stream: 'Engineering' },
    { title: 'Global MBA in FinTech Analytics', duration: '2 Years', rating: '4.8 ★', stream: 'Management' },
    { title: 'B.Des in UI/UX & Digital Media', duration: '4 Years', rating: '4.9 ★', stream: 'Design' },
    { title: 'B.Sc in Biotechnology & Genomics', duration: '3 Years', rating: '4.7 ★', stream: 'Science' },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:py-24 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Smart AI Admission Counsellor for Higher Education</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Find the Right Course. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Build the Right Future.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Get personalized course guidance from your AI admission counsellor. Explore opportunities, understand eligibility, and take the next step towards your career.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/demo" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-md font-semibold text-base h-12 px-6">
                    <Bot className="w-5 h-5" /> Start Free Counselling
                  </Button>
                </Link>
                <Link to="/demo" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base h-12 px-6 border-slate-300">
                    <PhoneCall className="w-4 h-4 text-primary" /> Talk to AI Counsellor
                  </Button>
                </Link>
              </div>

              {/* Social Proof Stats */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl font-bold text-slate-900">500+</div>
                  <div className="text-xs text-slate-500">Degree Courses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">5 Languages</div>
                  <div className="text-xs text-slate-500">Voice & Text</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">24/7</div>
                  <div className="text-xs text-slate-500">Instant Advisory</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive AI Avatar Visual */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative background glows */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Hero Illustration Card */}
                <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                    </div>
                    <Badge variant="outline" className="text-[11px] font-medium text-slate-600 bg-slate-50">
                      Live AI Agent Demo
                    </Badge>
                  </div>

                  {/* Central Avatar Visual */}
                  <div className="flex flex-col items-center py-4 text-center">
                    <AIAvatar size="xl" isSpeaking={true} />
                    <div className="mt-4">
                      <h4 className="text-base font-bold text-slate-900">Admissions Advisor Bot</h4>
                      <p className="text-xs text-slate-500">Ready to evaluate your academic profile</p>
                    </div>

                    {/* Soundwave Simulation Indicator */}
                    <div className="flex items-center gap-1 mt-4 h-8">
                      <span className="w-1 bg-primary rounded-full animate-wave-1"></span>
                      <span className="w-1 bg-secondary rounded-full animate-wave-2"></span>
                      <span className="w-1 bg-primary rounded-full animate-wave-3"></span>
                      <span className="w-1 bg-secondary rounded-full animate-wave-4"></span>
                      <span className="w-1 bg-primary rounded-full animate-wave-5"></span>
                      <span className="w-1 bg-secondary rounded-full animate-wave-2"></span>
                    </div>
                  </div>

                  {/* Sample Dialogue Bubble */}
                  <div className="mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <span className="font-semibold text-primary block mb-0.5">AI Counsellor says:</span>
                    &ldquo;Hello! I can guide you through admissions criteria, eligibility cutoffs, and career scopes. What field excites you most?&rdquo;
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available Now
                    </span>
                    <Link to="/demo" className="text-primary hover:underline font-semibold flex items-center gap-1">
                      Open interactive session &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backend Status Check Card (Preserved from Layer 1) */}
      <section className="container mx-auto max-w-4xl px-4">
        <Card className="border-indigo-100 shadow-sm bg-gradient-to-r from-slate-50 to-indigo-50/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-semibold">Backend Status & Layer 1 Link</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={refetch} className="h-7 text-xs text-primary">
                Refresh Status
              </Button>
            </div>
            <CardDescription className="text-xs">
              Live Express API connection at <code className="text-primary font-mono font-medium">http://localhost:4000/api/health</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {loading ? (
              <div className="flex items-center space-x-2 text-slate-500 text-xs py-1">
                <Activity className="h-4 w-4 animate-spin text-primary" />
                <span>Checking backend health...</span>
              </div>
            ) : error ? (
              <div className="flex items-start space-x-2 text-rose-600 text-xs bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Backend Offline:</span> {error}
                </div>
              </div>
            ) : health ? (
              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-slate-800">{health.service}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500">Uptime: {Math.round(health.uptime)}s</span>
                </div>
                <Badge variant="success" className="text-[10px]">
                  {health.status.toUpperCase()}
                </Badge>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="secondary" className="mb-3">Comprehensive Capabilities</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Everything You Need to Navigate Admissions
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Equipping students and parents with unbiased data, personalized recommendation algorithms, and immediate access to experts.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="border-slate-200/80 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900">{item.title}</CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white border-y border-slate-200/80 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple 4-Step Process</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              How AI Counsellor Guides You
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              From academic evaluation to enrolled student — simple, transparent, and pressure-free.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col">
                <div className="text-3xl font-extrabold text-primary-100 mb-3">{step.num}</div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/demo">
              <Button size="lg" className="gap-2 shadow-sm">
                Try the 4-Step Process Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Popular Courses Section */}
      <section id="courses" className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="secondary" className="mb-2">Trending Degree Paths</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Popular Courses for 2026 Admissions
            </h2>
          </div>
          <Link to="/demo">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <BookOpen className="w-4 h-4" /> Explore All In AI Chat
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleCourses.map((course, idx) => (
            <Card key={idx} className="hover:border-primary/50 transition-colors">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{course.stream}</span>
                  <span className="text-amber-500 font-medium">{course.rating}</span>
                </div>
                <CardTitle className="text-sm font-bold text-slate-900 leading-snug">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Duration: {course.duration}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <Link to="/demo">
                  <Button variant="ghost" size="sm" className="w-full text-xs text-primary justify-between p-0 h-auto pt-2 hover:bg-transparent hover:underline">
                    <span>Ask requirements</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 text-white text-center shadow-xl">
          <GraduationCap className="w-12 h-12 mx-auto text-white/90 mb-4" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to find the ideal university program?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/80 max-w-xl mx-auto">
            Our AI counsellor is ready with real admission eligibility criteria, course comparisons, and fee breakdowns.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/demo">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold h-12 px-8">
                Start Free Counselling
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-12 px-8">
                Admissions Dean Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
