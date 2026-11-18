import { getSupabaseAdmin } from '../../config/supabase';

export interface VerifiedCourseKnowledge {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  fullDescription: string | null;
  eligibility: string;
  duration: string;
  fees: string;
  learningMode: string;
  careerOpportunities: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const getVerifiedCoursesKnowledge = async (): Promise<VerifiedCourseKnowledge[]> => {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true);

    if (!error && data && data.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        category: c.category,
        shortDescription: c.short_description,
        fullDescription: c.full_description,
        eligibility: c.eligibility,
        duration: c.duration,
        fees: c.fees,
        learningMode: c.learning_mode,
        careerOpportunities: Array.isArray(c.career_opportunities) ? c.career_opportunities : [],
        faqs: Array.isArray(c.frequently_asked_questions) ? c.frequently_asked_questions : []
      }));
    }
  }

  // Authoritative fallback dataset matching seed data
  return [
    {
      id: 'crs-1',
      name: 'Full-Stack Web Development & Cloud Systems',
      slug: 'fullstack-web-development',
      category: 'Engineering & Technology',
      shortDescription: 'Master modern web technologies including React, Node.js, TypeScript, PostgreSQL, and cloud deployments.',
      fullDescription: 'Hands-on software development program training future full-stack engineers in enterprise web platforms, APIs, and microservices.',
      eligibility: '10+2 in any stream or equivalent qualification with logical aptitude.',
      duration: '2 Years (4 Semesters)',
      fees: '₹1,80,000 / year (Demonstration Estimate)',
      learningMode: 'Hybrid (On-Campus Labs + Online Modules)',
      careerOpportunities: ['Full-Stack Developer', 'Backend Engineer', 'Cloud Infrastructure Specialist', 'Frontend Architect'],
      faqs: [
        { question: 'Are prior programming prerequisites required?', answer: 'Basic computer literacy is recommended; foundational coding starts in Semester 1.' },
        { question: 'Is internship assistance provided?', answer: 'Yes, our career desk coordinates campus recruitment interviews with partner tech companies.' }
      ]
    },
    {
      id: 'crs-2',
      name: 'Digital Marketing, SEO & Growth Analytics',
      slug: 'digital-marketing-growth',
      category: 'Management & Business',
      shortDescription: 'Comprehensive training in search marketing, data-driven performance advertising, social strategy, and customer retention.',
      fullDescription: 'Gain operational mastery over digital campaign design, SEO audits, audience segmentation, and programmatic ad buying.',
      eligibility: 'Bachelor degree or Class 12th passing with minimum 50% aggregate score.',
      duration: '1 Year (Full-Time)',
      fees: '₹1,20,000 / year (Demonstration Estimate)',
      learningMode: 'Full-Time On Campus',
      careerOpportunities: ['Performance Marketing Lead', 'SEO Strategist', 'Growth Marketing Manager', 'Social Media Lead'],
      faqs: [
        { question: 'Do students manage live ad budgets?', answer: 'Yes, capstone practicals include supervised live campaign allocations.' }
      ]
    },
    {
      id: 'crs-3',
      name: 'Data Analytics, Machine Learning & Business Intelligence',
      slug: 'data-analytics-machine-learning',
      category: 'Engineering & Technology',
      shortDescription: 'Extract actionable intelligence from large datasets using Python, SQL, Tableau, and foundational neural networks.',
      fullDescription: 'Statistical foundations, predictive modeling algorithms, data pipeline engineering, and business forecasting.',
      eligibility: '10+2 with Mathematics or Statistics, or undergraduate degree in STEM / Economics.',
      duration: '3 Years (6 Semesters)',
      fees: '₹2,20,000 / year (Demonstration Estimate)',
      learningMode: 'Full-Time On Campus',
      careerOpportunities: ['Data Analyst', 'Business Intelligence Specialist', 'Junior Machine Learning Engineer', 'Analytics Consultant'],
      faqs: [
        { question: 'Which tools are covered in class?', answer: 'Python, PostgreSQL, Pandas, Tableau, PowerBI, and Scikit-Learn.' }
      ]
    },
    {
      id: 'crs-4',
      name: 'UI/UX Design, Human Factors & Interactive Systems',
      slug: 'ui-ux-design-systems',
      category: 'Design & Media',
      shortDescription: 'Learn human-centered product discovery, design systems, wireframing, usability testing, and mobile prototyping.',
      fullDescription: 'User research, design thinking, micro-interactions, Figma component libraries, and spatial UI paradigms.',
      eligibility: '10+2 in any discipline with a portfolio or entrance design aptitude assessment.',
      duration: '4 Years (8 Semesters)',
      fees: '₹2,60,000 / year (Demonstration Estimate)',
      learningMode: 'Studio-Based On Campus',
      careerOpportunities: ['Product Designer', 'UI/UX Specialist', 'User Researcher', 'Design System Architect'],
      faqs: [
        { question: 'Do I need a prior art portfolio?', answer: 'An introductory portfolio or visual submission during aptitude testing is reviewed by academic mentors.' }
      ]
    },
    {
      id: 'crs-5',
      name: 'Executive Business Management & Strategic Leadership',
      slug: 'business-management-leadership',
      category: 'Management & Business',
      shortDescription: 'Strategic management, financial planning, international business negotiations, and corporate governance.',
      fullDescription: 'Tailored for aspiring founders, team leaders, and managerial candidates aiming to spearhead business strategy.',
      eligibility: 'Recognized undergraduate degree with minimum 50% marks.',
      duration: '2 Years (4 Semesters)',
      fees: '₹3,50,000 / year (Demonstration Estimate)',
      learningMode: 'Full-Time On Campus',
      careerOpportunities: ['Business Development Manager', 'Management Consultant', 'Operations Director', 'Strategic Planner'],
      faqs: [
        { question: 'Is work experience mandatory?', answer: 'Fresh graduates and professionals with up to 3 years experience are both eligible.' }
      ]
    }
  ];
};

/**
 * Formats course catalogue knowledge into a structured prompt context string.
 */
export const formatCoursesKnowledgeForPrompt = (courses: VerifiedCourseKnowledge[]): string => {
  return courses.map((c, i) => `
[Course ${i + 1}]
Name: ${c.name} (Code: ${c.slug})
Category: ${c.category}
Duration: ${c.duration}
Tuition Fees: ${c.fees}
Eligibility Criteria: ${c.eligibility}
Learning Mode: ${c.learningMode}
Summary: ${c.shortDescription}
Career Opportunities: ${c.careerOpportunities.join(', ')}
Key FAQs:
${c.faqs.map(f => `  Q: ${f.question} -> A: ${f.answer}`).join('\n')}
`).join('\n---\n');
};
