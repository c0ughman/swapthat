// Quiz Data and Logic

const quizData = {
    questions: [
        // DEMOGRAPHIC QUESTIONS (Q1-3)
        {
            id: 1,
            text: "What's your gender?",
            options: [
                { id: 'A', text: "Male", signal: 'gender_male', icon: '👨', image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23cccccc'/%3E%3C/svg%3E" },
                { id: 'B', text: "Female", signal: 'gender_female', icon: '👩', image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23cccccc'/%3E%3C/svg%3E" }
            ]
        },
        {
            id: 2,
            text: "What's your age range?",
            options: [
                { id: 'A', text: "18-24", signal: 'age_18_24', icon: '🎓' },
                { id: 'B', text: "25-35", signal: 'age_25_35', icon: '💼' },
                { id: 'C', text: "35-45", signal: 'age_35_45', icon: '🎯' },
                { id: 'D', text: "45-65", signal: 'age_45_65', icon: '👔' },
                { id: 'E', text: "65+", signal: 'age_65_plus', icon: '🏆' }
            ]
        },
        {
            id: 3,
            text: "Which best describes your professional role?",
            options: [
                { id: 'A', text: "Business Owner / CEO / Entrepreneur", signal: 'role_owner', icon: '🚀' },
                { id: 'B', text: "Corporate Executive / Professional", signal: 'role_corporate', icon: '💼' }
            ]
        },

        // SECTION 1 — IDENTITY & STAKES (Q4-6)
        {
            id: 4,
            text: "What best describes your role?",
            options: [
                { id: 'A', text: "Founder or Business Owner", signal: 'seniority_high', icon: '🚀' },
                { id: 'B', text: "Executive or Senior Leader", signal: 'seniority_high', icon: '👔' },
                { id: 'C', text: "Manager or Team Lead", signal: 'seniority_mid', icon: '📊' },
                { id: 'D', text: "Consultant or Advisor", signal: 'seniority_high', icon: '💼' },
                { id: 'E', text: "Individual Contributor", signal: 'seniority_low', icon: '⚙️' }
            ]
        },
        {
            id: 5,
            text: "How many people are affected by your decisions?",
            options: [
                { id: 'A', text: "Just myself", signal: 'leverage_low', icon: '👤' },
                { id: 'B', text: "2–10 people", signal: 'leverage_mid', icon: '👥' },
                { id: 'C', text: "11–50 people", signal: 'leverage_high', icon: '👨‍👩‍👧‍👦' },
                { id: 'D', text: "50+ people", signal: 'leverage_very_high', icon: '🏢' }
            ]
        },
        {
            id: 6,
            text: "When you make a wrong call, how bad can it get?",
            options: [
                { id: 'A', text: "Minor setback, easily recovered", signal: 'cost_low', icon: '🤏' },
                { id: 'B', text: "Wasted time, money, or momentum", signal: 'cost_mid', icon: '💸' },
                { id: 'C', text: "Serious financial or reputational damage", signal: 'cost_high', icon: '💰' },
                { id: 'D', text: "Career-defining consequences", signal: 'cost_very_high', icon: '🎯' }
            ],
            profileWeight: {
                'A': { firefighter: 0, detective: 0, collector: 0, islander: 1 },
                'B': { firefighter: 1, detective: 1, collector: 0, islander: 0 },
                'C': { firefighter: 1, detective: 0, collector: 2, islander: 0 },
                'D': { firefighter: 2, detective: 0, collector: 2, islander: 0 }
            }
        },

        // SECTION 2 — SURFACE THE PROBLEM (Q7-9)
        {
            id: 7,
            text: "How often do you feel like you're reacting instead of anticipating?",
            options: [
                { id: 'A', text: "Rarely — I stay ahead", signal: 'reactive_low', icon: '✅' },
                { id: 'B', text: "Sometimes — depends on the week", signal: 'reactive_mid', icon: '⏰' },
                { id: 'C', text: "Often — I'm usually catching up", signal: 'reactive_high', icon: '⚠️' },
                { id: 'D', text: "Constantly — I'm always behind", signal: 'reactive_very_high', icon: '🔥' }
            ],
            profileWeight: {
                'A': { firefighter: 0, detective: 0, collector: 1, islander: 1 },
                'B': { firefighter: 1, detective: 1, collector: 1, islander: 0 },
                'C': { firefighter: 2, detective: 1, collector: 0, islander: 0 },
                'D': { firefighter: 3, detective: 0, collector: 0, islander: 0 }
            }
        },
        {
            id: 8,
            text: "Be honest: how much of the information you consume actually changes what you do?",
            options: [
                { id: 'A', text: "Most of it — I'm selective", signal: 'signal_high', icon: '🎯' },
                { id: 'B', text: "Maybe half", signal: 'signal_mid', icon: '⚖️' },
                { id: 'C', text: "Very little — but I keep consuming anyway", signal: 'signal_low', icon: '📚' },
                { id: 'D', text: "I honestly don't know", signal: 'signal_unknown', icon: '🤷' }
            ],
            profileWeight: {
                'A': { firefighter: 0, detective: 0, collector: 0, islander: 0 },
                'B': { firefighter: 1, detective: 1, collector: 1, islander: 0 },
                'C': { firefighter: 0, detective: 3, collector: 1, islander: 0 },
                'D': { firefighter: 0, detective: 1, collector: 0, islander: 3 }
            }
        },
        {
            id: 9,
            text: "How often do you finish reading something and think \"that was a waste of time\"?",
            options: [
                { id: 'A', text: "Rarely", signal: 'waste_low', icon: '😌' },
                { id: 'B', text: "A few times a week", signal: 'waste_mid', icon: '😕' },
                { id: 'C', text: "Daily", signal: 'waste_high', icon: '😣' },
                { id: 'D', text: "Multiple times a day", signal: 'waste_very_high', icon: '😫' }
            ],
            profileWeight: {
                'A': { firefighter: 0, detective: 0, collector: 1, islander: 1 },
                'B': { firefighter: 1, detective: 1, collector: 1, islander: 0 },
                'C': { firefighter: 1, detective: 2, collector: 0, islander: 0 },
                'D': { firefighter: 2, detective: 2, collector: 0, islander: 0 }
            }
        },

        // SECTION 3 — DEEPEN THE PAIN (Q10-12)
        {
            id: 10,
            text: "Think about a recent decision that didn't go well. What was the real issue?",
            options: [
                { id: 'A', text: "I had the wrong information", signal: 'issue_wrong_info', icon: '❌' },
                { id: 'B', text: "I had incomplete information", signal: 'issue_incomplete', icon: '❓' },
                { id: 'C', text: "I had the information but acted too late", signal: 'issue_timing', icon: '⏱️' },
                { id: 'D', text: "I was overwhelmed and went with my gut", signal: 'issue_overwhelm', icon: '🎲' },
                { id: 'E', text: "I missed something I should have seen", signal: 'issue_blind_spot', icon: '👁️' }
            ],
            profileWeight: {
                'A': { firefighter: 1, detective: 2, collector: 0, islander: 0 },
                'B': { firefighter: 0, detective: 1, collector: 2, islander: 0 },
                'C': { firefighter: 2, detective: 0, collector: 2, islander: 0 },
                'D': { firefighter: 2, detective: 1, collector: 0, islander: 1 },
                'E': { firefighter: 1, detective: 1, collector: 1, islander: 2 }
            }
        },
        {
            id: 11,
            text: "How often do you think \"I should have known that earlier\"?",
            options: [
                { id: 'A', text: "Almost never", signal: 'regret_low', icon: '😌' },
                { id: 'B', text: "Once in a while", signal: 'regret_mid', icon: '🤔' },
                { id: 'C', text: "More than I'd like to admit", signal: 'regret_high', icon: '😣' },
                { id: 'D', text: "It haunts me regularly", signal: 'regret_very_high', icon: '😔' }
            ],
            profileWeight: {
                'A': { firefighter: 0, detective: 0, collector: 0, islander: 2 },
                'B': { firefighter: 1, detective: 1, collector: 1, islander: 0 },
                'C': { firefighter: 1, detective: 1, collector: 2, islander: 0 },
                'D': { firefighter: 2, detective: 1, collector: 2, islander: 0 }
            }
        },
        {
            id: 12,
            text: "What's your honest relationship with the news and information you follow?",
            options: [
                { id: 'A', text: "It serves me well — I feel in control", signal: 'relationship_healthy', icon: '💪' },
                { id: 'B', text: "It's fine but could be better", signal: 'relationship_okay', icon: '👍' },
                { id: 'C', text: "It stresses me out more than it helps", signal: 'relationship_stressful', icon: '😰' },
                { id: 'D', text: "I've basically given up trying to keep up", signal: 'relationship_defeated', icon: '🏳️' }
            ],
            profileWeight: {
                'A': { firefighter: 0, detective: 0, collector: 1, islander: 0 },
                'B': { firefighter: 1, detective: 1, collector: 1, islander: 0 },
                'C': { firefighter: 2, detective: 2, collector: 0, islander: 0 },
                'D': { firefighter: 0, detective: 0, collector: 0, islander: 3 }
            }
        },

        // SECTION 4 — FUTURE COST (Q13-14)
        {
            id: 13,
            text: "If nothing changes, where does your information habit lead in 2 years?",
            options: [
                { id: 'A', text: "Probably fine — I'll adapt", signal: 'future_optimistic', icon: '🌤️' },
                { id: 'B', text: "Falling behind competitors who figure it out", signal: 'future_competitive', icon: '📉' },
                { id: 'C', text: "Burnout from trying to keep up manually", signal: 'future_burnout', icon: '🔥' },
                { id: 'D', text: "Making increasingly uninformed decisions", signal: 'future_decline', icon: '⚠️' }
            ],
            profileWeight: {
                'A': { firefighter: 0, detective: 0, collector: 0, islander: 2 },
                'B': { firefighter: 1, detective: 1, collector: 2, islander: 0 },
                'C': { firefighter: 2, detective: 2, collector: 0, islander: 0 },
                'D': { firefighter: 1, detective: 1, collector: 1, islander: 2 }
            }
        },
        {
            id: 14,
            text: "What's the real cost of a missed signal in your world?",
            options: [
                { id: 'A', text: "A small inconvenience", signal: 'missed_signal_low', icon: '🤏' },
                { id: 'B', text: "Lost opportunities or wasted resources", signal: 'missed_signal_mid', icon: '💸' },
                { id: 'C', text: "Damaged credibility or relationships", signal: 'missed_signal_high', icon: '💔' },
                { id: 'D', text: "Could derail a project, team, or company", signal: 'missed_signal_critical', icon: '💥' }
            ],
            profileWeight: {
                'A': { firefighter: 0, detective: 0, collector: 0, islander: 1 },
                'B': { firefighter: 1, detective: 1, collector: 1, islander: 0 },
                'C': { firefighter: 1, detective: 1, collector: 2, islander: 0 },
                'D': { firefighter: 2, detective: 1, collector: 2, islander: 0 }
            }
        },

        // SECTION 5 — SOLUTION READINESS (Q15)
        {
            id: 15,
            text: "If something could reliably surface only what matters — and save you hours — how would that feel?",
            options: [
                { id: 'A', text: "Nice to have, but not urgent", signal: 'intent_low', icon: '👌' },
                { id: 'B', text: "Would genuinely help", signal: 'intent_mid', icon: '👍' },
                { id: 'C', text: "Would change how I work", signal: 'intent_high', icon: '⭐' },
                { id: 'D', text: "I've been looking for exactly this", signal: 'intent_very_high', icon: '🔥' }
            ],
            profileWeight: {
                'A': { firefighter: 0, detective: 0, collector: 0, islander: 1 },
                'B': { firefighter: 1, detective: 1, collector: 1, islander: 0 },
                'C': { firefighter: 1, detective: 1, collector: 1, islander: 0 },
                'D': { firefighter: 2, detective: 2, collector: 1, islander: 0 }
            }
        }
    ],

    progressMessages: {
        3: {
            text: "Perfect! Now let's dive into what really matters — understanding how you work and what challenges you face.",
            buttonText: "Continue",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23cccccc'/%3E%3C/svg%3E"
        },
        6: {
            text: "You're not here by accident.<br><br>Most professionals in your position make <strong>dozens of decisions per week</strong> that affect real people and real outcomes. The stakes are high.<br><br>But here's the problem: <strong>your information diet wasn't designed for this.</strong>",
            buttonText: "That's accurate",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23cccccc'/%3E%3C/svg%3E"
        },
        9: {
            text: "Here's what your answers reveal:<br><br>You're not <strong>missing</strong> information — you're <strong>drowning</strong> in it. The endless scroll, the 47 open tabs, the newsletters you'll \"read later.\"<br><br>You're spending hours consuming. <strong>But how much of it actually changes what you do?</strong><br><br>The gap between consumption and action is where decisions die.",
            buttonText: "I feel that",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23cccccc'/%3E%3C/svg%3E"
        },
        12: {
            text: "Let's be direct:<br><br>Every time you think <strong>\"I should have known that earlier\"</strong> — that's not a knowledge problem. It's a <strong>signal problem.</strong><br><br>The information existed. You just didn't see it in time. Or it was buried under noise. Or you were too overwhelmed to process it.<br><br>The cost isn't just bad decisions. It's the <strong>compound effect</strong> of operating slightly behind, year after year.",
            buttonText: "I need to fix this",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23cccccc'/%3E%3C/svg%3E"
        },
        14: {
            text: "Here's what changes everything:<br><br>The best decision-makers don't consume more. They <strong>see what matters, faster.</strong><br><br>They have systems that surface the 2% that actually changes outcomes — and filter out the 98% that's just noise.<br><br>You're about to see what that looks like.",
            buttonText: "Show me",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23cccccc'/%3E%3C/svg%3E"
        }
    },

    loadingChecks: [
        "Analyzing your decision patterns",
        "Identifying your blind spots",
        "Calculating your information efficiency",
        "Mapping signal vs. noise in your intake",
        "Building your personalized diagnosis"
    ],

    yesNoQuestions: [
        "Are you ready to make a change?",
        "Are you inclined to finish what you start?",
        "Do you believe the right tools can transform your results?"
    ],

    profiles: {
        firefighter: {
            id: 'firefighter',
            name: 'The Frazzled Firefighter',
            color: '#FFB5B5',
            colorDark: '#E89999',
            tagline: 'Always putting out fires, never getting ahead',
            product: {
                name: 'Bubbles',
                link: './bubbles.html',
                tagline: 'See the landscape before the fire starts'
            },
            description: `You're not lazy. You're not bad at your job. You're trapped in a cycle that makes proactive leadership nearly impossible.

Every morning starts the same way: you wake up already behind. There's a crisis brewing somewhere — maybe a competitor made a move, maybe a market shifted, maybe a key stakeholder changed their mind about something important. By the time you hear about it, you're already in damage control mode.

This isn't a time management problem. It's a visibility problem. You can't anticipate what you can't see coming.`,
            symptoms: [
                "You spend more time reacting to news than acting on it",
                "Your 'strategic planning' sessions keep getting interrupted by urgent fires",
                "You've said 'I wish I'd known that sooner' more times than you can count",
                "Your inbox and news feeds feel like enemies, not allies",
                "You're exhausted not from working hard, but from working reactively",
                "Important decisions get made under pressure, not with preparation"
            ],
            rootCause: `The information you need exists. It's out there right now. But it's scattered across hundreds of sources, buried in noise, and impossible to see as a coherent picture.

You're not behind because you're slow. You're behind because you don't have a bird's-eye view of the landscape. You're trying to navigate a battlefield with a magnifying glass when you need satellite imagery.`,
            realCost: `Every fire you put out has a cost beyond the immediate damage. There's the opportunity cost of the strategic work you didn't do. The relationship cost of the conversations you had to rush. The mental cost of operating in constant crisis mode.

The compound effect is brutal: the more fires you fight, the less time you have to see the next ones forming, which means more fires tomorrow.`,
            insight: `You don't need to consume more news. You need to see the news landscape — all at once, visually mapped, so patterns emerge before they become problems.`,
            solution: `Bubbles gives you exactly that: a visual map of everything happening in your world, organized into clusters that reveal what's actually developing. Instead of reading article after article, you see the entire landscape at a glance. You spot emerging themes before they become crises. You identify connections between stories that linear feeds would never show you.

It's the difference between reading a weather report and seeing the storm system on radar. One tells you it's raining. The other shows you where the lightning will strike next.`,
            ctaText: 'See Your News Landscape'
        },

        detective: {
            id: 'detective',
            name: 'The Drowning Detective',
            color: '#D4B5FF',
            colorDark: '#B899E8',
            tagline: 'Buried in clues, missing the case',
            product: {
                name: 'Genie',
                link: './genie.html',
                tagline: 'From information to insight in one question'
            },
            description: `You're doing everything right, and it's still not working.

You read the newsletters. You follow the thought leaders. You have tabs open for industry publications, market analyses, competitor blogs. You've built systems to stay informed — alerts, RSS feeds, saved searches.

And yet, somehow, you still struggle to turn all that information into clear decisions. The data is there. The insight isn't.

The problem isn't your effort. The problem is that information and insight are two completely different things.`,
            symptoms: [
                "You have dozens of unread newsletters in a folder called 'To Read Later'",
                "You feel guilty about how much you consume versus how much you act on",
                "You often realize after the fact that the answer was in something you'd already seen",
                "Your browser has more tabs open than you'd like to admit",
                "You've subscribed to solutions (newsletters, alerts, tools) that became part of the problem",
                "Information anxiety is a real thing you experience regularly"
            ],
            rootCause: `You're not drowning in information. You're drowning in unprocessed information — raw data that hasn't been analyzed, connected, or translated into actionable insight.

You're doing the work of an entire research team by yourself, manually. No wonder you're overwhelmed.`,
            realCost: `The mental overhead of processing information that doesn't help is enormous. Every article you skim, every newsletter you scan, every 'might be relevant' piece you save — they all consume cognitive resources that should go toward actual decision-making.

You're paying twice: once in time spent gathering, and again in the mental exhaustion of trying to synthesize it all yourself.`,
            insight: `You don't need more sources or better discipline. You need a system that does the analysis for you — one that takes your specific question and delivers a synthesized, actionable answer.`,
            solution: `Genie is built for exactly this problem. Ask a strategic question — any question about your industry, market, competitors, or trends — and Genie analyzes hundreds of sources to give you a clear, comprehensive answer.

Not more reading. Not more tabs. Just the insight you need, derived from the information you'd never have time to process yourself. It's like having a research analyst who's read everything and can brief you on exactly what matters for your decision.`,
            ctaText: 'Get Strategic Insights'
        },

        collector: {
            id: 'collector',
            name: 'The Cautious Collector',
            color: '#B5FFD4',
            colorDark: '#99E8B8',
            tagline: 'All the data, none of the decisions',
            product: {
                name: 'Chat',
                link: './chat.html',
                tagline: 'Turn your knowledge into action through conversation'
            },
            description: `You're not uninformed. You might be the most informed person in the room. And that's precisely the problem.

You've gathered the articles. You've saved the reports. You've bookmarked the analyses. You have folders full of "might need this someday" information. Your knowledge base is impressive.

But when it's time to make the call, something holds you back. There's always one more angle to consider, one more piece of data that might change everything. The information is there. The confidence to act on it isn't.

You've confused information completeness with decision readiness. They're not the same thing.`,
            symptoms: [
                "You often feel like you need 'just a bit more research' before deciding",
                "Your bookmarks and saved articles folder is massive (and largely unread)",
                "You've missed windows of opportunity while gathering more information",
                "You can see all sides of an issue — sometimes too clearly to act",
                "Colleagues sometimes see you as thorough; other times as slow",
                "You've watched faster-moving competitors act on information you already had"
            ],
            rootCause: `Information abundance creates the illusion that perfect knowledge is possible. It's not. But more importantly, you don't need more information — you need a way to think through what you already have.

The gap isn't in your data. It's in your ability to process it into clear conclusions.`,
            realCost: `Every delayed decision has a compounding cost. Markets don't wait. Competitors don't wait. Opportunities don't wait.

But there's a deeper cost: the erosion of your own confidence. Each time you wait for more information and still feel uncertain, you reinforce the belief that more is needed. It becomes a self-fulfilling cycle that keeps you perpetually preparing instead of acting.`,
            insight: `You don't need more data. You need a thinking partner — a way to talk through what you know and arrive at clarity through conversation.`,
            solution: `Chat lets you do exactly that. It's an AI conversation partner that knows the news, understands context, and helps you think through decisions in real-time.

Ask questions. Explore angles. Request analysis in any format — executive briefs, SWOT analyses, risk assessments, talking points. It's like having a brilliant colleague who's always available, never judges, and helps you transform your knowledge into confident action.`,
            ctaText: 'Start a Conversation'
        },

        islander: {
            id: 'islander',
            name: 'The Intuitive Islander',
            color: '#B5E5FF',
            colorDark: '#99CCE8',
            tagline: 'Going it alone in a connected world',
            product: {
                name: 'Bites',
                link: './bites.html',
                tagline: 'Essential intelligence, delivered daily'
            },
            description: `At some point, you made a quiet decision: the information game is rigged, so why play?

You've watched colleagues drown in newsletters and news feeds. You've seen the anxiety that comes with trying to keep up. You decided — consciously or not — that trusting your gut was better than trusting the noise.

And honestly? It's worked. Mostly. Your instincts are good. Your experience is real. You've made it this far.

But there's a nagging question: what are you missing? In a world where information moves faster than ever, is intuition calibrated to last year's reality still enough?`,
            symptoms: [
                "You've unsubscribed from most newsletters and news sources",
                "You rely heavily on your network and experience for insights",
                "You sometimes feel disconnected from industry conversations",
                "You're skeptical of 'information solutions' — they've disappointed before",
                "You make decisions confidently, but occasionally wonder what you didn't see",
                "You've accepted some blind spots as the price of sanity"
            ],
            rootCause: `You're not wrong to be skeptical. Most information sources are noise machines that create anxiety without creating value. Opting out was a rational response to an irrational system.

But here's the thing: opting out of bad information isn't the same as opting out of all information. One is wisdom. The other is risk you've stopped measuring.`,
            realCost: `The blind spots you've accepted aren't static. They're growing. The pace of change is accelerating, and the gap between those who see signals early and those who don't is widening.

Your gut has served you well. But intuition is only as good as its inputs. Without fresh data, your instincts slowly become calibrated to a world that no longer exists.`,
            insight: `You don't need to rejoin the chaos. You need a single source that respects your time, delivers only what matters, and keeps your intuition sharp without overwhelming it.`,
            solution: `Bites is designed for people exactly like you. Pick your topics. Get one daily email with everything that actually matters, intelligently summarized. Nothing more.

No endless feeds. No notification anxiety. No guilt about unread newsletters. Just the essential intelligence you need to keep your instincts calibrated to current reality — delivered on your terms, in minutes, not hours.`,
            ctaText: 'Get Daily Briefings'
        }
    }
};

// Quiz State
const quizState = {
    currentQuestion: 0,
    answers: {},
    showingProgressMessage: false,
    isLoading: false,
    emailSubmitted: false,
    profileScores: {
        firefighter: 0,
        detective: 0,
        collector: 0,
        islander: 0
    }
};

// DOM Elements
let elements = {};

// Initialize Quiz
function initQuiz() {
    elements = {
        quizContainer: document.querySelector('.quiz-container'),
        progressContainer: document.querySelector('.progress-container'),
        progressBar: document.getElementById('progressBar'),
        progressFill: document.getElementById('progressFill'),
        progressText: document.getElementById('progressText'),
        questionCard: document.getElementById('questionCard'),
        questionNumber: document.getElementById('questionNumber'),
        questionText: document.getElementById('questionText'),
        optionsContainer: document.getElementById('optionsContainer'),
        nextButton: document.getElementById('nextButton'),
        progressMessageCard: document.getElementById('progressMessageCard'),
        progressMessageImage: document.getElementById('progressMessageImage'),
        progressMessageText: document.getElementById('progressMessageText'),
        continueButton: document.getElementById('continueButton'),
        resultsPreview: document.getElementById('resultsPreview'),
        continueToLoading: document.getElementById('continueToLoading'),
        yesNoModal: document.getElementById('yesNoModal'),
        modalQuestion: document.getElementById('modalQuestion'),
        btnYes: document.getElementById('btnYes'),
        btnNo: document.getElementById('btnNo'),
        loadingScreen: document.getElementById('loadingScreen'),
        loadingChecks: document.getElementById('loadingChecks'),
        emailCapture: document.getElementById('emailCapture'),
        emailForm: document.getElementById('emailForm'),
        emailInput: document.getElementById('emailInput'),
        nameInput: document.getElementById('nameInput'),
        resultsScreen: document.getElementById('resultsScreen')
    };

    document.body.classList.add('quiz-active');
    elements.quizContainer.classList.add('quiz-mode');

    elements.nextButton.addEventListener('click', handleNext);
    elements.continueButton.addEventListener('click', handleContinueFromMessage);
    elements.continueToLoading.addEventListener('click', startLoadingSequence);
    elements.btnYes.addEventListener('click', () => handleYesNoAnswer('yes'));
    elements.btnNo.addEventListener('click', () => handleYesNoAnswer('no'));
    elements.emailForm.addEventListener('submit', handleEmailSubmit);

    renderQuestion();
}

// Render Current Question
function renderQuestion() {
    const question = quizData.questions[quizState.currentQuestion];

    updateProgress();

    elements.questionNumber.textContent = `Question ${question.id}`;
    elements.questionText.textContent = question.text;

    elements.optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.setAttribute('data-option-id', option.id);

        const savedAnswer = quizState.answers[question.id];
        if (savedAnswer && savedAnswer.id === option.id) {
            button.classList.add('selected');
            elements.nextButton.disabled = false;
        }

        button.innerHTML = `
            ${option.image ? `<img class="option-image" src="${option.image}" alt="${option.text}" />` : ''}
            ${option.icon ? `<span class="option-icon">${option.icon}</span>` : ''}
            <span class="option-text">${option.text}</span>
        `;

        button.addEventListener('click', () => handleOptionSelect(option, button));

        elements.optionsContainer.appendChild(button);
    });

    if (!quizState.answers[question.id]) {
        elements.nextButton.disabled = true;
    }
}

// Handle Option Selection
function handleOptionSelect(option, button) {
    const question = quizData.questions[quizState.currentQuestion];

    const allOptions = elements.optionsContainer.querySelectorAll('.option-button');
    allOptions.forEach(opt => opt.classList.remove('selected'));

    button.classList.add('selected');

    quizState.answers[question.id] = {
        id: option.id,
        text: option.text,
        signal: option.signal
    };

    if (question.profileWeight && question.profileWeight[option.id]) {
        const weights = question.profileWeight[option.id];
        quizState.profileScores.firefighter += weights.firefighter || 0;
        quizState.profileScores.detective += weights.detective || 0;
        quizState.profileScores.collector += weights.collector || 0;
        quizState.profileScores.islander += weights.islander || 0;
    }

    elements.nextButton.disabled = false;

    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10);
    }

    setTimeout(() => {
        handleNext();
    }, 600);
}

// Handle Next Button
function handleNext() {
    const currentQuestionId = quizData.questions[quizState.currentQuestion].id;

    if (quizData.progressMessages[currentQuestionId]) {
        showProgressMessage(currentQuestionId);
    } else {
        moveToNextQuestion();
    }
}

// Show Progress Message
function showProgressMessage(questionId) {
    const messageData = quizData.progressMessages[questionId];

    elements.questionCard.classList.add('hidden');

    if (messageData.image) {
        elements.progressMessageImage.src = messageData.image;
        elements.progressMessageImage.alt = "Progress section image";
        elements.progressMessageImage.style.display = 'block';
    } else {
        elements.progressMessageImage.style.display = 'none';
    }
    
    elements.progressMessageText.innerHTML = messageData.text;
    elements.continueButton.textContent = messageData.buttonText;
    elements.progressMessageCard.classList.remove('hidden');

    quizState.showingProgressMessage = true;
}

// Handle Continue from Progress Message
function handleContinueFromMessage() {
    elements.progressMessageCard.classList.add('hidden');

    quizState.showingProgressMessage = false;

    moveToNextQuestion();
}

// Move to Next Question
function moveToNextQuestion() {
    quizState.currentQuestion++;

    if (quizState.currentQuestion >= quizData.questions.length) {
        showResultsPreview();
    } else {
        elements.questionCard.classList.remove('hidden');

        renderQuestion();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Show Results Preview
function showResultsPreview() {
    const profileId = calculateProfile();
    const profile = quizData.profiles[profileId];

    elements.questionCard.classList.add('hidden');

    // Populate preview content
    const previewBadge = document.getElementById('previewBadge');
    previewBadge.style.backgroundColor = profile.color;

    document.getElementById('previewTitle').textContent = profile.name;
    document.getElementById('previewTagline').textContent = profile.tagline;
    
    // Show first 2 sentences of description
    const sentences = profile.description.split(/\.\s+/);
    const shortDescription = sentences.slice(0, 2).join('. ') + '.';
    document.getElementById('previewDiagnosis').textContent = shortDescription;

    elements.resultsPreview.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update Progress Bar
function updateProgress() {
    const progress = ((quizState.currentQuestion + 1) / quizData.questions.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.progressText.textContent = `Question ${quizState.currentQuestion + 1} of ${quizData.questions.length}`;
}

// Start Loading Sequence
async function startLoadingSequence() {
    elements.resultsPreview.classList.add('hidden');

    elements.loadingScreen.classList.remove('hidden');

    elements.loadingChecks.innerHTML = '';
    quizData.loadingChecks.forEach((checkText, index) => {
        const checkDiv = document.createElement('div');
        checkDiv.className = 'loading-check';
        checkDiv.innerHTML = `
            <div class="loading-check-header">
                <div class="check-icon">
                    <div class="check-spinner"></div>
                </div>
                <div class="check-text">${checkText}</div>
            </div>
            <div class="check-progress-bar">
                <div class="check-progress-fill"></div>
            </div>
        `;
        elements.loadingChecks.appendChild(checkDiv);
    });

    const checks = elements.loadingChecks.querySelectorAll('.loading-check');
    let yesNoIndex = 0;
    
    for (let i = 0; i < checks.length; i++) {
        await animateCheck(checks[i], i);
        
        // Show yes/no question after checks 1, 3, and 5
        if ((i === 1 || i === 3) && yesNoIndex < quizData.yesNoQuestions.length) {
            await showYesNoQuestion(yesNoIndex);
            yesNoIndex++;
        }
    }

    // Show final yes/no question if there are 3 total
    if (yesNoIndex < quizData.yesNoQuestions.length) {
        await showYesNoQuestion(yesNoIndex);
    }

    setTimeout(() => {
        showEmailCapture();
    }, 800);
}

// Animate Single Check
function animateCheck(checkElement, index) {
    return new Promise((resolve) => {
        checkElement.classList.add('active');

        const progressFill = checkElement.querySelector('.check-progress-fill');
        const duration = 800 + Math.random() * 700;
        
        // Animate progress bar
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 100 / (duration / 50);
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
            }
            progressFill.style.width = `${progress}%`;
        }, 50);

        setTimeout(() => {
            const checkIcon = checkElement.querySelector('.check-icon');
            checkIcon.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15" fill="#0FD7D7" opacity="0.2"/>
                    <path d="M10 16L14 20L22 12" stroke="#0FD7D7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            checkElement.classList.add('completed');
            checkElement.classList.remove('active');

            resolve();
        }, duration);
    });
}

// Show Yes/No Question
function showYesNoQuestion(questionIndex) {
    return new Promise((resolve) => {
        quizState.currentYesNoResolver = resolve;
        
        elements.modalQuestion.textContent = quizData.yesNoQuestions[questionIndex];
        elements.yesNoModal.classList.remove('hidden');
    });
}

// Handle Yes/No Answer
function handleYesNoAnswer(answer) {
    // Store the answer
    if (!quizState.yesNoAnswers) {
        quizState.yesNoAnswers = [];
    }
    quizState.yesNoAnswers.push(answer);
    
    // Hide modal
    elements.yesNoModal.classList.add('hidden');
    
    // Resolve the promise to continue loading
    if (quizState.currentYesNoResolver) {
        quizState.currentYesNoResolver();
        quizState.currentYesNoResolver = null;
    }
}

// Show Email Capture
function showEmailCapture() {
    elements.loadingScreen.classList.add('hidden');

    elements.emailCapture.classList.remove('hidden');

    setTimeout(() => {
        elements.emailInput.focus();
    }, 300);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Calculate Profile Result
function calculateProfile() {
    const scores = quizState.profileScores;
    let maxScore = 0;
    let winningProfile = 'firefighter';

    for (const [profile, score] of Object.entries(scores)) {
        if (score > maxScore) {
            maxScore = score;
            winningProfile = profile;
        }
    }

    return winningProfile;
}

// Handle Email Submit
async function handleEmailSubmit(e) {
    e.preventDefault();

    const email = elements.emailInput.value.trim();
    const name = elements.nameInput.value.trim();

    if (!email || !name) {
        return;
    }

    elements.emailForm.querySelector('button').disabled = true;
    elements.emailForm.querySelector('button').textContent = 'Preparing Your Offer...';

    await saveQuizResults(email);

    // Redirect to offer page with profile info
    const profileId = calculateProfile();
    const profile = quizData.profiles[profileId];
    
    // Store profile data in localStorage for offer page
    localStorage.setItem('quizProfile', JSON.stringify({
        profileId: profileId,
        profile: profile,
        email: email,
        name: name,
        answers: quizState.answers,
        yesNoAnswers: quizState.yesNoAnswers || []
    }));
    
    // Redirect to offer page
    window.location.href = `./offer.html?profile=${profileId}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
}

// Save Quiz Results
async function saveQuizResults(email) {
    const profileId = calculateProfile();

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Quiz Results:', {
                email: email,
                answers: quizState.answers,
                profileScores: quizState.profileScores,
                profile: profileId,
                timestamp: new Date().toISOString()
            });

            resolve();
        }, 1000);
    });
}

// Note: Results are now shown on the offer page after redirect

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
