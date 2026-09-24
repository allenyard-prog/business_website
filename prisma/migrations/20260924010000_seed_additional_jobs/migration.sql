INSERT INTO "jobs" (
    "id", "title", "slug", "team", "summary", "description", "responsibilities", "requirements",
    "location", "workplace_type", "employment_type", "compensation", "status", "application_open",
    "display_order", "require_resume", "require_address", "require_phone", "require_message",
    "collect_hosting_details", "published_at"
) VALUES
(
    '00000000-0000-4000-8000-000000000002',
    'Senior Product Designer',
    'senior-product-designer',
    'Product Design',
    'Shape clear, useful digital products from early discovery through polished delivery.',
    'Work closely with clients, product strategists, and engineers to turn complex problems into focused product experiences. You will lead design from research and framing through prototyping, validation, and delivery.',
    'Lead product discovery and translate findings into clear design direction.\nCreate user flows, wireframes, prototypes, and production-ready interface designs.\nFacilitate collaborative workshops and communicate design decisions clearly.\nPartner with engineers throughout implementation and quality review.\nHelp evolve our design practice and reusable systems.',
    'Strong product design portfolio demonstrating end-to-end thinking.\nExperience designing responsive web applications and complex workflows.\nExcellent visual, interaction, and communication skills.\nComfort working directly with clients and cross-functional teams.\nA practical, curious approach to ambiguity.',
    'United States', 'remote', 'Full-time', NULL,
    'published', true, 10, true, false, false, true, false, CURRENT_TIMESTAMP
),
(
    '00000000-0000-4000-8000-000000000003',
    'Full-Stack Software Engineer',
    'full-stack-software-engineer',
    'Engineering',
    'Build reliable, thoughtful products across modern web interfaces, APIs, and cloud systems.',
    'Join a senior delivery team that works from product definition through production operations. You will make pragmatic technical decisions, ship maintainable software, and collaborate closely with design and client teams.',
    'Build and maintain accessible web interfaces and dependable backend services.\nTurn product requirements into clear technical plans.\nReview code and improve engineering quality across projects.\nDesign data models, APIs, integrations, and deployment workflows.\nDiagnose production issues and communicate tradeoffs early.',
    'Professional experience shipping production web applications.\nStrong TypeScript and modern frontend fundamentals.\nExperience with relational databases, APIs, and cloud deployments.\nCare for testing, accessibility, security, and maintainability.\nClear written and verbal communication.',
    'United States', 'remote', 'Full-time', NULL,
    'published', true, 20, true, false, false, true, false, CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;
