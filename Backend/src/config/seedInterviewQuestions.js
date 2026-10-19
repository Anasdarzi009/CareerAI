const InterviewQuestion = require('../models/interviewQuestion.model');

const SEED_INTERVIEW_QUESTIONS = [
    // ── TECHNICAL QUESTIONS (Frontend, Backend, Fullstack, Core CS) ──
    {
        question: 'Explain the event loop in JavaScript. How do microtasks differ from macrotasks?',
        category: 'Technical',
        role: 'Full Stack Developer',
        difficulty: 'Mid',
        expectedKeyPoints: [
            'Call stack, Web APIs, Task Queue, and Microtask Queue execution order',
            'Microtasks (Promises, process.nextTick, queueMicrotask) run immediately after current synchronous script before rendering',
            'Macrotasks (setTimeout, setInterval, setImmediate, I/O) run on subsequent event loop ticks'
        ],
        sampleAnswer: 'The JavaScript event loop continuously monitors the call stack and queues. When synchronous code finishes, microtasks like Promise callbacks execute completely before the browser checks the macrotask queue for timers or I/O.',
        evaluationRubric: {
            coreConcepts: ['call stack', 'microtask', 'macrotask', 'promise', 'settimeout'],
            keywords: ['event loop', 'queue', 'stack', 'promise', 'microtask', 'asynchronous']
        },
        suggestedDurationSeconds: 90
    },
    {
        question: 'What is database indexing and how does a B-Tree index optimize read queries compared to full table scans?',
        category: 'Technical',
        role: 'Backend Engineer',
        difficulty: 'Mid',
        expectedKeyPoints: [
            'Indexing provides O(log N) lookup instead of O(N) linear table scans',
            'Self-balancing B-Tree / B+Tree structure with sorted keys and pointer nodes',
            'Trade-off: Speeds up SELECT queries but adds write overhead on INSERT, UPDATE, and DELETE operations'
        ],
        sampleAnswer: 'A database index works like a book index using balanced B-Tree structures. It allows the database engine to perform binary tree lookups in logarithmic time rather than sequentially scanning every disk block in the table.',
        evaluationRubric: {
            coreConcepts: ['b-tree', 'lookup time', 'logarithmic', 'table scan', 'write overhead'],
            keywords: ['index', 'b-tree', 'lookup', 'scan', 'overhead', 'complexity']
        },
        suggestedDurationSeconds: 90
    },
    {
        question: 'How do you prevent SQL Injection and Cross-Site Scripting (XSS) in modern web applications?',
        category: 'Technical',
        role: 'Full Stack Developer',
        difficulty: 'Entry',
        expectedKeyPoints: [
            'Parameterized queries or prepared statements for SQL injection prevention',
            'Input sanitization, output encoding, and Content Security Policy (CSP) for XSS',
            'Using modern frameworks with auto-escaping (React JSX) and HttpOnly secure cookies'
        ],
        sampleAnswer: 'To prevent SQL injection, always use parameterized queries or ORMs rather than string concatenation. To prevent XSS, sanitize and encode user inputs, implement a strict CSP, and store authentication tokens in HttpOnly cookies.',
        evaluationRubric: {
            coreConcepts: ['parameterized query', 'prepared statement', 'sanitization', 'content security policy', 'encoding'],
            keywords: ['parameterized', 'injection', 'xss', 'sanitize', 'csp', 'httponly']
        },
        suggestedDurationSeconds: 90
    },
    {
        question: 'Explain the difference between optimistic locking and pessimistic locking in concurrent systems.',
        category: 'Technical',
        role: 'Backend Engineer',
        difficulty: 'Senior',
        expectedKeyPoints: [
            'Optimistic locking uses version numbers or timestamps without acquiring database locks upfront',
            'Pessimistic locking acquires explicit record or table locks (e.g. SELECT FOR UPDATE) to block concurrent writes',
            'Optimistic locking is ideal for low-contention read-heavy systems; pessimistic locking is best for high-contention financial transactions'
        ],
        sampleAnswer: 'Optimistic locking allows concurrent operations and verifies record version tags at commit time, aborting conflicts. Pessimistic locking acquires exclusive locks upfront, preventing any concurrent access.',
        evaluationRubric: {
            coreConcepts: ['versioning', 'select for update', 'contention', 'commit conflict', 'concurrency'],
            keywords: ['optimistic', 'pessimistic', 'version', 'lock', 'concurrency', 'collision']
        },
        suggestedDurationSeconds: 90
    },
    {
        question: 'How does React Virtual DOM reconciliation work, and why are unique keys essential when rendering lists?',
        category: 'Technical',
        role: 'Frontend Engineer',
        difficulty: 'Entry',
        expectedKeyPoints: [
            'Virtual DOM is an in-memory representation of real DOM',
            'Diffing algorithm compares previous and current VDOM trees to generate minimum real DOM patches',
            'Keys give elements a stable identity across renders, allowing React to move rather than re-create DOM nodes'
        ],
        sampleAnswer: 'React maintains a Virtual DOM and compares it to the previous tree using its diffing algorithm. Unique keys ensure React correctly identifies which list elements were added, removed, or moved rather than unmounting and remounting the entire list.',
        evaluationRubric: {
            coreConcepts: ['virtual dom', 'diffing', 'reconciliation', 'stable identity', 'minimal dom patches'],
            keywords: ['virtual dom', 'reconciliation', 'key', 'diff', 'render', 're-render']
        },
        suggestedDurationSeconds: 90
    },
    {
        question: 'Describe how you would design a rate limiter for a high-traffic REST API.',
        category: 'System Design',
        role: 'Backend Engineer',
        difficulty: 'Senior',
        expectedKeyPoints: [
            'Algorithms: Token Bucket, Leaky Bucket, or Sliding Window Counter',
            'In-memory store like Redis with key expiration for fast distributed tracking',
            'Handling HTTP 429 Too Many Requests status codes and Retry-After headers'
        ],
        sampleAnswer: 'I would implement a Token Bucket or Sliding Window algorithm using Redis for distributed caching. Each client IP or API key has an associated bucket with a TTL. If the request count exceeds the limit, return HTTP 429 with a Retry-After header.',
        evaluationRubric: {
            coreConcepts: ['token bucket', 'sliding window', 'redis', 'http 429', 'distributed'],
            keywords: ['rate limit', 'token bucket', 'redis', 'sliding window', '429', 'throttling']
        },
        suggestedDurationSeconds: 120
    },
    {
        question: 'What are database ACID properties and how do they guarantee transactional consistency?',
        category: 'Technical',
        role: 'Full Stack Developer',
        difficulty: 'Mid',
        expectedKeyPoints: [
            'Atomicity: All operations succeed or all roll back',
            'Consistency: Database moves from one valid state to another satisfying all constraints',
            'Isolation: Concurrent transactions execute independently without interference',
            'Durability: Committed data survives system crashes via write-ahead logging (WAL)'
        ],
        sampleAnswer: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. Together, they ensure that database transactions either fully complete or roll back cleanly, maintain constraints, isolate concurrent changes, and persist permanently to disk.',
        evaluationRubric: {
            coreConcepts: ['atomicity', 'consistency', 'isolation', 'durability', 'rollback'],
            keywords: ['acid', 'atomicity', 'consistency', 'isolation', 'durability', 'transaction']
        },
        suggestedDurationSeconds: 90
    },
    {
        question: 'Explain how stateless JWT authentication works compared to server-side session cookies.',
        category: 'Technical',
        role: 'Full Stack Developer',
        difficulty: 'Mid',
        expectedKeyPoints: [
            'JWT contains header, payload, and signature verified cryptographically without database lookup',
            'Session cookies store a sessionId referencing server-side state in memory or Redis',
            'Trade-offs: JWT scales horizontally without shared storage but revocation is harder without a blocklist'
        ],
        sampleAnswer: 'JWTs are self-contained and digitally signed, meaning the server verifies the token signature without database queries. In contrast, session cookies require the backend to look up session data in memory or Redis on every request.',
        evaluationRubric: {
            coreConcepts: ['cryptographic signature', 'stateless', 'payload', 'revocation', 'horizontal scaling'],
            keywords: ['jwt', 'session', 'stateless', 'token', 'signature', 'cookie']
        },
        suggestedDurationSeconds: 90
    },

    // ── BEHAVIORAL QUESTIONS (STAR Method: Situation, Task, Action, Result) ──
    {
        question: 'Describe a time when you had to resolve a serious technical disagreement with a teammate.',
        category: 'Behavioral',
        role: 'General',
        difficulty: 'Mid',
        expectedKeyPoints: [
            'Situation: Context of the disagreement or architecture conflict',
            'Task: Need to align on a technical direction without delaying project delivery',
            'Action: Data-driven discussion, prototyping proof of concept, seeking mentor advice',
            'Result: Successful resolution, mutual respect, and positive project outcome'
        ],
        sampleAnswer: 'In our capstone project, my teammate and I disagreed on using PostgreSQL vs MongoDB. I built a quick prototype demonstrating our relational query patterns and benchmarked both. Seeing the data, we agreed on PostgreSQL, resulting in seamless integration and timely delivery.',
        evaluationRubric: {
            coreConcepts: ['situation', 'task', 'action', 'result', 'data-driven'],
            starMethodPreferred: true,
            keywords: ['situation', 'action', 'result', 'compromise', 'communication', 'collaboration']
        },
        suggestedDurationSeconds: 120
    },
    {
        question: 'Tell me about a production bug or project failure you caused. How did you handle it?',
        category: 'Behavioral',
        role: 'General',
        difficulty: 'Mid',
        expectedKeyPoints: [
            'Accountability: Owning the mistake immediately without blaming others',
            'Action: Rapid mitigation, rollback, hotfix deployment, and root cause analysis',
            'Learning: Implemented automated tests, CI/CD checks, or monitoring to prevent recurrence'
        ],
        sampleAnswer: 'During a release, I pushed a database migration script that caused an unindexed query bottleneck. I immediately alerted the team, rolled back the deployment, identified the missing index via query analysis, and added pre-deployment migration verification tests.',
        evaluationRubric: {
            coreConcepts: ['accountability', 'root cause analysis', 'mitigation', 'prevention', 'post-mortem'],
            starMethodPreferred: true,
            keywords: ['bug', 'failure', 'ownership', 'rollback', 'root cause', 'test']
        },
        suggestedDurationSeconds: 120
    },
    {
        question: 'Describe a scenario where you had to learn a completely new technology or framework under a tight deadline.',
        category: 'Behavioral',
        role: 'General',
        difficulty: 'Entry',
        expectedKeyPoints: [
            'Resourcefulness: Reading official documentation, reviewing source code, building mini MVPs',
            'Prioritization: Focusing on essential APIs required for the immediate deliverables',
            'Outcome: On-time delivery and solid foundation for future technical tasks'
        ],
        sampleAnswer: 'When assigned a project requiring GraphQL, which I had never used, I spent the first weekend reading the official documentation and building a sample CRUD API. By prioritizing schema definition and query resolvers, I delivered the feature two days ahead of schedule.',
        evaluationRubric: {
            coreConcepts: ['adaptability', 'resourcefulness', 'rapid learning', 'mvp', 'deliverable'],
            starMethodPreferred: true,
            keywords: ['learn', 'deadline', 'documentation', 'prototype', 'adapt', 'delivered']
        },
        suggestedDurationSeconds: 120
    },
    {
        question: 'How do you handle ambiguous requirements when a project scope is undefined?',
        category: 'Behavioral',
        role: 'General',
        difficulty: 'Senior',
        expectedKeyPoints: [
            'Proactive clarification with stakeholders or product managers',
            'Breaking ambiguous objectives into verifiable user stories and acceptance criteria',
            'Iterative feedback loops and prototype validation'
        ],
        sampleAnswer: 'When requirements are ambiguous, I don’t start coding blindly. I list clarifying questions, identify key user workflows, draft mockups or architecture diagrams, and review them with stakeholders to establish concrete acceptance criteria before development.',
        evaluationRubric: {
            coreConcepts: ['clarification', 'stakeholder communication', 'user stories', 'iterative feedback'],
            starMethodPreferred: true,
            keywords: ['ambiguity', 'clarify', 'stakeholders', 'requirements', 'iterative', 'scope']
        },
        suggestedDurationSeconds: 120
    },

    // ── HR & RECRUITMENT QUESTIONS ──
    {
        question: 'Why are you interested in joining our engineering team, and what makes you a strong fit for this role?',
        category: 'HR',
        role: 'General',
        difficulty: 'Entry',
        expectedKeyPoints: [
            'Knowledge of company mission, technical stack, or product domain',
            'Alignment of personal engineering skills and past projects with the role requirements',
            'Enthusiasm for continuous technical growth and collaboration'
        ],
        sampleAnswer: 'I am excited by your commitment to building scalable, high-availability products. My background in full-stack engineering, performance optimization, and clean architecture aligns directly with your current technology stack and hiring goals.',
        evaluationRubric: {
            coreConcepts: ['company alignment', 'skill relevance', 'passion', 'value proposition'],
            keywords: ['company', 'fit', 'skills', 'impact', 'growth', 'contribute']
        },
        suggestedDurationSeconds: 90
    },
    {
        question: 'Where do you see yourself professionally in the next three to five years?',
        category: 'HR',
        role: 'General',
        difficulty: 'Entry',
        expectedKeyPoints: [
            'Commitment to deepening technical expertise and system architecture capabilities',
            'Gradual progression toward leading technical features or mentoring junior engineers',
            'Delivering measurable business value within a structured organization'
        ],
        sampleAnswer: 'Over the next three to five years, I aim to master distributed systems and cloud architecture, take ownership of critical microservices, and evolve into a senior engineer who mentors peers and drives high-impact architectural decisions.',
        evaluationRubric: {
            coreConcepts: ['long-term vision', 'technical mastery', 'mentorship', 'ownership'],
            keywords: ['growth', 'senior', 'architecture', 'mentor', 'leadership', 'ownership']
        },
        suggestedDurationSeconds: 90
    },
    {
        question: 'What are your greatest technical strengths, and what is one technical area you are currently improving?',
        category: 'HR',
        role: 'General',
        difficulty: 'Entry',
        expectedKeyPoints: [
            'Clear, verifiable technical strengths backed by concrete project examples',
            'Genuine area of improvement paired with active, structured learning efforts',
            'Self-awareness and growth mindset'
        ],
        sampleAnswer: 'My strongest technical skill is building performant, responsive REST APIs and frontends with clean separation of concerns. An area I am actively improving is Kubernetes container orchestration, where I am currently completing practical hands-on labs.',
        evaluationRubric: {
            coreConcepts: ['self-awareness', 'concrete strengths', 'actionable improvement', 'growth mindset'],
            keywords: ['strength', 'improving', 'learning', 'self-aware', 'hands-on', 'practice']
        },
        suggestedDurationSeconds: 90
    }
];

/**
 * Seed questions if collection is empty
 */
async function seedInterviewQuestionsIfEmpty() {
    try {
        const count = await InterviewQuestion.countDocuments();
        if (count === 0) {
            await InterviewQuestion.insertMany(SEED_INTERVIEW_QUESTIONS);
            console.log(`[Seed] Seeded ${SEED_INTERVIEW_QUESTIONS.length} realistic CareerAI interview practice questions.`);
        } else {
            console.log(`[Seed] Interview question bank already contains ${count} questions.`);
        }
    } catch (err) {
        console.error('[Seed Error] Failed to seed interview questions:', err.message);
    }
}

module.exports = {
    SEED_INTERVIEW_QUESTIONS,
    seedInterviewQuestionsIfEmpty
};
