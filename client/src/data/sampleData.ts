import { LanguageOption, StudentLead, ConversationRecord, Course } from '@/types/models';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'hinglish', name: 'Hinglish', nativeName: 'Hinglish', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी', flag: '🇮🇳' },
];

export const INITIAL_LEADS: StudentLead[] = [
  {
    id: 'LEAD-101',
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    qualification: 'Class 12th (PCM - 88%)',
    interestedCourse: 'B.Tech in Artificial Intelligence',
    leadTemperature: 'Hot',
    status: 'Qualified',
    assignedCounsellor: 'Dr. Sunita Rao',
    createdAt: '2026-11-16 14:30',
    notes: 'Expressed high interest in AI/ML curriculum, budget fits scholarship criteria.',
    preferredCountry: 'India / Germany',
    budget: '₹6L - ₹10L/year'
  },
  {
    id: 'LEAD-102',
    name: 'Priya Patel',
    phone: '+91 97123 45678',
    email: 'priya.patel@example.com',
    qualification: 'B.Com Graduate (72%)',
    interestedCourse: 'Global MBA & FinTech',
    leadTemperature: 'Hot',
    status: 'Application Sent',
    assignedCounsellor: 'Vikram Mehta',
    createdAt: '2026-11-16 11:15',
    notes: 'Looking for fast-track 1-year MBA programs with campus placement.',
    preferredCountry: 'UK / Singapore',
    budget: '₹15L - ₹22L/year'
  },
  {
    id: 'LEAD-103',
    name: 'Rohan Deshmukh',
    phone: '+91 94231 88900',
    email: 'rohan.d@example.com',
    qualification: 'Class 12th (PCB - 79%)',
    interestedCourse: 'B.Sc Biotechnology & Bioinformatics',
    leadTemperature: 'Warm',
    status: 'Counselled',
    assignedCounsellor: 'Dr. Sunita Rao',
    createdAt: '2026-11-15 16:45',
    notes: 'Needs information on laboratory facilities and research internships.',
    preferredCountry: 'India',
    budget: '₹4L - ₹6L/year'
  },
  {
    id: 'LEAD-104',
    name: 'Ananya Verma',
    phone: '+91 98980 11223',
    email: 'ananya.v@example.com',
    qualification: 'Diploma in Graphic Design',
    interestedCourse: 'B.Des in UI/UX & Interactive Media',
    leadTemperature: 'Warm',
    status: 'New',
    assignedCounsellor: 'Kavita Joshi',
    createdAt: '2026-11-15 09:20',
    notes: 'Portfolio review requested by the academic panel.',
    preferredCountry: 'Canada / India',
    budget: '₹8L - ₹12L/year'
  },
  {
    id: 'LEAD-105',
    name: 'Mohammad Farhan',
    phone: '+91 91234 56789',
    email: 'farhan.m@example.com',
    qualification: 'B.Sc Computer Science',
    interestedCourse: 'M.Tech Cyber Security & Cloud Ops',
    leadTemperature: 'Cold',
    status: 'Counselled',
    assignedCounsellor: 'Vikram Mehta',
    createdAt: '2026-11-14 18:00',
    notes: 'Evaluating between weekend executive format or full-time.',
    preferredCountry: 'India',
    budget: '₹5L - ₹7L/year'
  },
  {
    id: 'LEAD-106',
    name: 'Diya Rathore',
    phone: '+91 96543 21098',
    email: 'diya.r@example.com',
    qualification: 'Class 12th (Commerce - 91%)',
    interestedCourse: 'B.B.A Digital Marketing & E-Commerce',
    leadTemperature: 'Hot',
    status: 'Enrolled',
    assignedCounsellor: 'Kavita Joshi',
    createdAt: '2026-11-13 13:10',
    notes: 'Registration fee paid, awaiting orientation batch assignment.',
    preferredCountry: 'India',
    budget: '₹5L - ₹8L/year'
  }
];

export const INITIAL_CONVERSATIONS: ConversationRecord[] = [
  {
    id: 'CONV-8801',
    studentId: 'LEAD-101',
    studentName: 'Aarav Sharma',
    mode: 'chat',
    language: 'en',
    date: '2026-11-16 14:22',
    status: 'Completed',
    duration: '6m 40s',
    sentiment: 'Positive',
    summary: 'Aarav inquired about top undergraduate computer science programs with AI focus. Discussed eligibility, JEE cutoffs, and international transfer programs.',
    transcript: [
      { speaker: 'student', text: 'Hi! I finished Class 12 with PCM (88%). What are the top courses for Artificial Intelligence?', timestamp: '14:22:10' },
      { speaker: 'ai', text: 'Hello Aarav! With 88% in PCM, you have solid eligibility. I recommend exploring B.Tech in Artificial Intelligence & Data Science, as well as B.Tech CSE with an AI specialization.', timestamp: '14:22:25' },
      { speaker: 'student', text: 'What is the fee range for these courses in India and abroad?', timestamp: '14:23:05' },
      { speaker: 'ai', text: 'In India, annual tuition typically ranges from ₹1.8L to ₹3.5L per year. In Germany, tuition at public universities is tuition-free with approximately €800-€950/month living costs.', timestamp: '14:23:30' },
      { speaker: 'student', text: 'Can I speak to an admission counsellor about scholarship options?', timestamp: '14:24:15' },
      { speaker: 'ai', text: 'Certainly! I have scheduled a callback with our senior counsellor, Dr. Sunita Rao, for tomorrow morning at 11:00 AM.', timestamp: '14:24:35' }
    ]
  },
  {
    id: 'CONV-8802',
    studentId: 'LEAD-102',
    studentName: 'Priya Patel',
    mode: 'voice',
    language: 'hinglish',
    date: '2026-11-16 11:05',
    status: 'Completed',
    duration: '4m 15s',
    sentiment: 'Positive',
    summary: 'Voice session in Hinglish discussing 1-year MBA programs in the UK vs Singapore. Provided admission deadlines and GMAT waiver criteria.',
    transcript: [
      { speaker: 'student', text: 'Maine B.Com complete kiya hai 72% ke saath. Kya UK me 1-year MBA ke liye GMAT zaroori hai?', timestamp: '11:05:12' },
      { speaker: 'ai', text: 'Namaste Priya! Bohot saari reputed UK universities 70%+ score hone par GMAT waiver offer karti hain agar aapke paas 1-2 saal ka work experience ya strong academic credentials hon.', timestamp: '11:05:35' },
      { speaker: 'student', text: 'Budget kitna hoga living expenses ke sath?', timestamp: '11:06:10' },
      { speaker: 'ai', text: 'UK me total tuition fees approximately ₹16L-₹22L hoti hai aur annual living budget approx ₹10L-₹12L hota hai.', timestamp: '11:06:40' }
    ]
  },
  {
    id: 'CONV-8803',
    studentId: 'LEAD-104',
    studentName: 'Ananya Verma',
    mode: 'chat',
    language: 'en',
    date: '2026-11-15 09:12',
    status: 'Transferred to Human',
    duration: '8m 55s',
    sentiment: 'Neutral',
    summary: 'Student asked about lateral entry into 2nd year B.Des program with a Polytechnic diploma. Transferred to design department head for portfolio evaluation.',
    transcript: [
      { speaker: 'student', text: 'Can I get lateral entry into 2nd year B.Des with my Polytechnic Graphic Design diploma?', timestamp: '09:12:04' },
      { speaker: 'ai', text: 'Yes, lateral admission is available based on portfolio evaluation and syllabus equivalence. Let me connect you directly with our Design admissions desk.', timestamp: '09:12:45' }
    ]
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'CRS-101',
    name: 'B.Tech in Artificial Intelligence & Machine Learning',
    code: 'CSE-AIML-4Y',
    category: 'Engineering & Technology',
    duration: '4 Years (8 Semesters)',
    fees: '₹2,40,000 / year',
    eligibility: '10+2 with PCM (Minimum 60% aggregate)',
    isActive: true,
    careerOutcomes: ['AI Engineer', 'ML Specialist', 'Data Scientist', 'Robotics Researcher'],
    description: 'Comprehensive engineering degree covering deep learning, natural language processing, neural architectures, and edge computing.'
  },
  {
    id: 'CRS-102',
    name: 'Global MBA in FinTech & Business Analytics',
    code: 'MBA-FIN-2Y',
    category: 'Management & Business',
    duration: '2 Years (Full Time)',
    fees: '₹4,50,000 / year',
    eligibility: 'Bachelor degree in any discipline with minimum 50% aggregate',
    isActive: true,
    careerOutcomes: ['Financial Analyst', 'Product Manager', 'Risk Strategy Consultant', 'Fintech Founder'],
    description: 'Dual-specialization MBA focusing on digital banking, algorithmic trading, corporate valuation, and strategic predictive modeling.'
  },
  {
    id: 'CRS-103',
    name: 'B.Des in UI/UX & Interactive Design',
    code: 'DES-UIUX-4Y',
    category: 'Design & Media',
    duration: '4 Years (8 Semesters)',
    fees: '₹2,80,000 / year',
    eligibility: '10+2 in any stream (DAT design aptitude test qualification)',
    isActive: true,
    careerOutcomes: ['Product Designer', 'UI/UX Specialist', 'Design System Lead', 'Creative Technologist'],
    description: 'Human-centered design curriculum focused on mobile/web UX, spatial computing interfaces, usability research, and interactive prototyping.'
  },
  {
    id: 'CRS-104',
    name: 'B.Sc in Biotechnology & Genomics',
    code: 'SCI-BIOT-3Y',
    category: 'Science & Humanities',
    duration: '3 Years (6 Semesters)',
    fees: '₹1,20,000 / year',
    eligibility: '10+2 with PCB/PCMB (Minimum 55% aggregate)',
    isActive: true,
    careerOutcomes: ['Biotech Researcher', 'Clinical Trial Analyst', 'Bioinformatics Specialist', 'Quality Controller'],
    description: 'Hands-on laboratory program covering molecular biology, gene editing principles, vaccine development, and computational proteomics.'
  },
  {
    id: 'CRS-105',
    name: 'M.Tech in Cloud Computing & Cyber Security',
    code: 'MTECH-CYB-2Y',
    category: 'Engineering & Technology',
    duration: '2 Years (4 Semesters)',
    fees: '₹1,90,000 / year',
    eligibility: 'B.Tech/BE in CSE, IT, ECE or MCA with 55% aggregate',
    isActive: false,
    careerOutcomes: ['Security Architect', 'DevSecOps Specialist', 'Penetration Tester', 'Cloud Engineer'],
    description: 'Advanced postgraduate program preparing specialists for threat defense, zero-trust infrastructure, and multi-cloud security management.'
  }
];
