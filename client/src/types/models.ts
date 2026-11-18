export type SupportedLanguage = 'en' | 'hi' | 'hinglish' | 'gu' | 'raj';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export interface StudentLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  qualification: string;
  interestedCourse: string;
  leadTemperature: 'Hot' | 'Warm' | 'Cold';
  status: 'New' | 'Counselled' | 'Qualified' | 'Application Sent' | 'Enrolled' | 'Closed';
  assignedCounsellor: string;
  createdAt: string;
  notes?: string;
  preferredCountry?: string;
  budget?: string;
}

export interface ConversationRecord {
  id: string;
  studentId: string;
  studentName: string;
  mode: 'chat' | 'voice';
  language: SupportedLanguage;
  date: string;
  status: 'Completed' | 'In Progress' | 'Transferred to Human';
  duration: string;
  summary: string;
  sentiment: 'Positive' | 'Neutral' | 'Hesitant';
  transcript: Array<{
    speaker: 'ai' | 'student';
    text: string;
    timestamp: string;
  }>;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  category: 'Engineering & Technology' | 'Management & Business' | 'Health & Medicine' | 'Design & Media' | 'Science & Humanities';
  duration: string;
  fees: string;
  eligibility: string;
  isActive: boolean;
  careerOutcomes: string[];
  description: string;
}

export interface Counsellor {
  id: string;
  name: string;
  role: string;
  activeLeads: number;
  rating: number;
  avatar: string;
}
