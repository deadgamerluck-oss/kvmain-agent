-- ============================================================================
-- 001_seed_courses.sql
-- Demonstration Course Seed Data (Fictional educational programmes for testing)
-- ============================================================================

INSERT INTO public.courses (
    name,
    slug,
    category,
    short_description,
    full_description,
    eligibility,
    duration,
    fees,
    learning_mode,
    career_opportunities,
    frequently_asked_questions,
    is_active
) VALUES
(
    'Full-Stack Web Development & Cloud Systems',
    'fullstack-web-development',
    'Engineering & Technology',
    'Master modern web technologies including React, Node.js, TypeScript, PostgreSQL, and cloud deployments.',
    'A hands-on, project-driven software development program designed to train future full-stack engineers in building enterprise-scale SaaS web platforms, RESTful and GraphQL APIs, distributed database architectures, and continuous deployment workflows. (Demonstration syllabus data).',
    '10+2 in any stream or equivalent qualification with basic logical aptitude.',
    '2 Years (4 Semesters)',
    '₹1,80,000 / year (Demonstration Estimate)',
    'Hybrid (On-Campus Labs + Online Modules)',
    '["Full-Stack Developer", "Backend Engineer", "Cloud Infrastructure Specialist", "Frontend Software Architect"]'::jsonb,
    '[
        {"question": "Are prior programming prerequisites required?", "answer": "Basic computer literacy is recommended; foundational coding modules are covered in Semester 1."},
        {"question": "Is internship assistance provided?", "answer": "Yes, our career services desk coordinates campus recruitment interviews with technology partners."}
    ]'::jsonb,
    true
),
(
    'Digital Marketing, SEO & Growth Analytics',
    'digital-marketing-growth',
    'Management & Business',
    'Comprehensive training in search marketing, data-driven performance advertising, social strategy, and customer retention.',
    'Gain operational mastery over digital campaign design, SEO audits, audience segmentation, conversion rate optimization, and programmatic ad buying across global digital channels. (Demonstration syllabus data).',
    'Bachelor degree or Class 12th passing with minimum 50% aggregate score.',
    '1 Year (Full-Time)',
    '₹1,20,000 / year (Demonstration Estimate)',
    'Full-Time On Campus',
    '["Performance Marketing Lead", "SEO Strategist", "Growth Marketing Manager", "Social Media Operations Lead"]'::jsonb,
    '[
        {"question": "Do students manage live ad budgets?", "answer": "Yes, capstone practicals include supervised live campaign allocations."}
    ]'::jsonb,
    true
),
(
    'Data Analytics, Machine Learning & Business Intelligence',
    'data-analytics-machine-learning',
    'Engineering & Technology',
    'Extract actionable intelligence from large datasets using Python, SQL, Tableau, and foundational neural networks.',
    'This curriculum equips students with rigorous statistical foundations, predictive modeling algorithms, data pipeline engineering, business forecasting, and automated BI dashboard construction for enterprise decision support. (Demonstration syllabus data).',
    '10+2 with Mathematics or Statistics, or undergraduate degree in STEM / Economics.',
    '3 Years (6 Semesters)',
    '₹2,20,000 / year (Demonstration Estimate)',
    'Full-Time On Campus',
    '["Data Analyst", "Business Intelligence Specialist", "Junior Machine Learning Engineer", "Operations Analytics Lead"]'::jsonb,
    '[
        {"question": "Which tools are covered in class?", "answer": "Python, PostgreSQL, Pandas, Tableau, PowerBI, and Scikit-Learn."}
    ]'::jsonb,
    true
),
(
    'UI/UX Design, Human Factors & Interactive Systems',
    'ui-ux-design-systems',
    'Design & Media',
    'Learn human-centered product discovery, design systems, wireframing, usability testing, and mobile prototyping.',
    'A specialized design curriculum centered around user empathy, user testing methodology, design thinking, micro-interactions, Figma component libraries, and spatial UI paradigms. (Demonstration syllabus data).',
    '10+2 in any discipline with a portfolio or entrance design aptitude assessment.',
    '4 Years (8 Semesters)',
    '₹2,60,000 / year (Demonstration Estimate)',
    'Studio-Based On Campus',
    '["Product Designer", "UI/UX Specialist", "User Researcher", "Design System Architect"]'::jsonb,
    '[
        {"question": "Do I need a prior art portfolio?", "answer": "An introductory portfolio or visual submission during aptitude testing is reviewed by academic mentors."}
    ]'::jsonb,
    true
),
(
    'Executive Business Management & Strategic Leadership',
    'business-management-leadership',
    'Management & Business',
    'Strategic management, financial planning, international business negotiations, and corporate governance.',
    'Tailored for aspiring founders, team leaders, and managerial candidates aiming to spearhead business strategy, team leadership, cross-border operations, and capital allocation. (Demonstration syllabus data).',
    'Recognized undergraduate degree with minimum 50% marks.',
    '2 Years (4 Semesters)',
    '₹3,50,000 / year (Demonstration Estimate)',
    'Full-Time On Campus',
    '["Business Development Manager", "Management Consultant", "Operations Director", "Strategic Planner"]'::jsonb,
    '[
        {"question": "Is work experience mandatory?", "answer": "Fresh graduates and professionals with up to 3 years experience are both eligible."}
    ]'::jsonb,
    true
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    eligibility = EXCLUDED.eligibility,
    duration = EXCLUDED.duration,
    fees = EXCLUDED.fees,
    learning_mode = EXCLUDED.learning_mode,
    career_opportunities = EXCLUDED.career_opportunities,
    frequently_asked_questions = EXCLUDED.frequently_asked_questions,
    is_active = EXCLUDED.is_active;

-- Sample demonstration counsellor record
INSERT INTO public.counsellors (
    full_name,
    email,
    phone,
    role,
    is_active
) VALUES
(
    'Dr. Sunita Rao',
    'sunita.rao@eduguide-demo.com',
    '+91 98765 00001',
    'admin',
    true
),
(
    'Vikram Mehta',
    'vikram.mehta@eduguide-demo.com',
    '+91 98765 00002',
    'counsellor',
    true
),
(
    'Kavita Joshi',
    'kavita.joshi@eduguide-demo.com',
    '+91 98765 00003',
    'counsellor',
    true
)
ON CONFLICT (email) DO NOTHING;
