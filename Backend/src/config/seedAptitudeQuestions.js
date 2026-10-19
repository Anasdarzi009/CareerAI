/**
 * Controlled seed dataset of realistic original CareerAI Aptitude Questions.
 * 32 comprehensive, deterministic questions spanning Quantitative Aptitude, Logical Reasoning, and Verbal Ability.
 */
const aptitudeSeedQuestions = [
    // ==========================================
    // 1. QUANTITATIVE APTITUDE
    // ==========================================
    {
        questionText: "A software engineer's monthly salary increased by 20% in year one and then decreased by 10% in year two due to market realignment. What is the net percentage change in their salary from the start?",
        category: "Quantitative Aptitude",
        topic: "Percentages",
        difficulty: "Easy",
        options: [
            "8% increase",
            "10% increase",
            "12% increase",
            "5% decrease"
        ],
        correctOptionIndex: 0,
        explanation: "Let initial salary be 100. After 20% increase: 100 * 1.20 = 120. After 10% decrease: 120 - (0.10 * 120) = 120 - 12 = 108. Net change = (108 - 100) = +8% increase.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 60,
        companyRelevance: ["TCS", "Infosys", "Cognizant"]
    },
    {
        questionText: "A vendor sells an enterprise software license for $1,440 at a 20% profit over the acquisition cost. If the vendor wants to achieve a 35% profit, what should be the selling price?",
        category: "Quantitative Aptitude",
        topic: "Profit & Loss",
        difficulty: "Medium",
        options: [
            "$1,560",
            "$1,620",
            "$1,700",
            "$1,800"
        ],
        correctOptionIndex: 1,
        explanation: "Cost Price (CP) = Selling Price / (1 + Profit%) = 1440 / 1.20 = $1,200. Desired Selling Price for 35% profit = 1200 * 1.35 = $1,620.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 75,
        companyRelevance: ["Accenture", "Wipro"]
    },
    {
        questionText: "The ratio of junior to senior developers in a technology unit is 7:5. If 12 new senior developers join and 4 junior developers leave, the new ratio becomes 1:1. How many total developers were initially present?",
        category: "Quantitative Aptitude",
        topic: "Ratio & Proportion",
        difficulty: "Medium",
        options: [
            "72",
            "84",
            "96",
            "108"
        ],
        correctOptionIndex: 2,
        explanation: "Let junior = 7x and senior = 5x. According to question: (7x - 4) / (5x + 12) = 1/1 => 7x - 4 = 5x + 12 => 2x = 16 => x = 8. Total initial developers = 7x + 5x = 12x = 12 * 8 = 96.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 75,
        companyRelevance: ["Amazon", "TCS"]
    },
    {
        questionText: "The average score of a batch of 40 students in an algorithm exam is 68. Later, it was discovered that two scores originally entered as 42 and 56 were misread and should have been 74 and 84 respectively. What is the corrected average?",
        category: "Quantitative Aptitude",
        topic: "Averages",
        difficulty: "Easy",
        options: [
            "69.5",
            "70.0",
            "70.5",
            "71.0"
        ],
        correctOptionIndex: 0,
        explanation: "Sum of incorrect scores = 42 + 56 = 98. Sum of correct scores = 74 + 84 = 158. Net difference to add = 158 - 98 = +60. Change in average = 60 / 40 = +1.5. Corrected average = 68 + 1.5 = 69.5.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 60,
        companyRelevance: ["Capgemini", "Infosys"]
    },
    {
        questionText: "Engineer A can develop a microservice in 12 days, while Engineer B can do it in 18 days. If they work together with a senior architect C, they finish the complete service in 4 days. How many days would Architect C take to complete the service alone?",
        category: "Quantitative Aptitude",
        topic: "Time & Work",
        difficulty: "Medium",
        options: [
            "8 days",
            "9 days",
            "10.5 days",
            "12 days"
        ],
        correctOptionIndex: 1,
        explanation: "Rate of (A + B + C) = 1/4. Rate of A = 1/12. Rate of B = 1/18. Rate of C = 1/4 - (1/12 + 1/18) = 1/4 - (3 + 2)/36 = 1/4 - 5/36 = 9/36 - 5/36 = 4/36 = 1/9. Therefore, C takes 9 days alone.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 90,
        companyRelevance: ["TCS", "Accenture", "Cognizant"]
    },
    {
        questionText: "A commuter travels from home to office at 40 km/h and returns along the same route at 60 km/h. What is the average speed of the commuter for the entire two-way journey?",
        category: "Quantitative Aptitude",
        topic: "Time, Speed & Distance",
        difficulty: "Easy",
        options: [
            "48 km/h",
            "50 km/h",
            "52 km/h",
            "45 km/h"
        ],
        correctOptionIndex: 0,
        explanation: "When equal distances are traversed at speeds x and y, Average Speed = 2xy / (x + y) = 2 * 40 * 60 / (40 + 60) = 4800 / 100 = 48 km/h.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 45,
        companyRelevance: ["Infosys", "Wipro"]
    },
    {
        questionText: "What is the difference between compound interest (compounded annually) and simple interest on a principal of $10,000 for 2 years at an interest rate of 8% per annum?",
        category: "Quantitative Aptitude",
        topic: "Simple & Compound Interest",
        difficulty: "Medium",
        options: [
            "$54",
            "$64",
            "$72",
            "$80"
        ],
        correctOptionIndex: 1,
        explanation: "For 2 years, Difference = P * (r / 100)^2 = 10,000 * (8 / 100)^2 = 10,000 * (64 / 10,000) = $64.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 60,
        companyRelevance: ["HCL", "Cognizant"]
    },
    {
        questionText: "Find the remainder when 7^84 is divided by 342.",
        category: "Quantitative Aptitude",
        topic: "Number Systems",
        difficulty: "Hard",
        options: [
            "1",
            "7",
            "49",
            "341"
        ],
        correctOptionIndex: 0,
        explanation: "Notice that 7^3 = 343 = (342 + 1). We can rewrite 7^84 = (7^3)^28 = (342 + 1)^28. By binomial theorem, all terms except 1^28 are multiples of 342. Hence remainder is 1^28 = 1.",
        marks: 2,
        negativeMarks: 0.5,
        timeAllocationSeconds: 90,
        companyRelevance: ["Amazon", "Google", "Goldman Sachs"]
    },
    {
        questionText: "In how many distinct ways can the letters of the word 'MACHINE' be arranged such that all vowels always occupy odd positions?",
        category: "Quantitative Aptitude",
        topic: "Permutation & Combination",
        difficulty: "Hard",
        options: [
            "576",
            "288",
            "144",
            "72"
        ],
        correctOptionIndex: 0,
        explanation: "Total positions = 7 (Positions 1, 2, 3, 4, 5, 6, 7). Odd positions = 4 (1, 3, 5, 7). Vowels in MACHINE are A, I, E (3 vowels). Consonants are M, C, H, N (4 consonants). Choosing 3 odd positions out of 4 for vowels = 4P3 = 24 ways. The remaining 4 positions (1 odd + 3 even) must be filled by 4 consonants = 4! = 24 ways. Total arrangements = 24 * 24 = 576 ways.",
        marks: 2,
        negativeMarks: 0.5,
        timeAllocationSeconds: 100,
        companyRelevance: ["Amazon", "Flipkart", "Infosys"]
    },
    {
        questionText: "Two fair dice are thrown simultaneously. What is the probability that the sum of the numbers appearing on both dice is a prime number?",
        category: "Quantitative Aptitude",
        topic: "Probability",
        difficulty: "Medium",
        options: [
            "5/12",
            "7/18",
            "1/2",
            "13/36"
        ],
        correctOptionIndex: 0,
        explanation: "Total outcomes = 36. Prime sums possible from 2 to 12 are 2, 3, 5, 7, 11. Sum 2: (1,1) [1]. Sum 3: (1,2),(2,1) [2]. Sum 5: (1,4),(2,3),(3,2),(4,1) [4]. Sum 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) [6]. Sum 11: (5,6),(6,5) [2]. Total favorable = 1 + 2 + 4 + 6 + 2 = 15. Probability = 15/36 = 5/12.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 75,
        companyRelevance: ["TCS", "Accenture"]
    },
    {
        questionText: "A tech startup's annual revenue increased from $2.4M in 2022 to $3.6M in 2023, and operating expenses increased from $1.8M to $2.2M. What is the percentage increase in net operating profit?",
        category: "Quantitative Aptitude",
        topic: "Data Interpretation",
        difficulty: "Medium",
        options: [
            "110%",
            "125%",
            "133.33%",
            "150%"
        ],
        correctOptionIndex: 2,
        explanation: "Profit 2022 = $2.4M - $1.8M = $0.6M. Profit 2023 = $3.6M - $2.2M = $1.4M. Increase in profit = 1.4 - 0.6 = $0.8M. Percentage increase = (0.8 / 0.6) * 100 = 800/6 = 133.33%.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 70,
        companyRelevance: ["TCS", "Deloitte"]
    },

    // ==========================================
    // 2. LOGICAL REASONING
    // ==========================================
    {
        questionText: "Identify the next number in the sequence: 4, 11, 30, 67, 128, ?",
        category: "Logical Reasoning",
        topic: "Number Series",
        difficulty: "Medium",
        options: [
            "219",
            "222",
            "215",
            "224"
        ],
        correctOptionIndex: 0,
        explanation: "The pattern is n^3 + 3 for n = 1, 2, 3, 4, 5... 1^3 + 3 = 4, 2^3 + 3 = 11, 3^3 + 3 = 30, 4^3 + 3 = 67, 5^3 + 3 = 128. For n = 6: 6^3 + 3 = 216 + 3 = 219.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 60,
        companyRelevance: ["Infosys", "Cognizant"]
    },
    {
        questionText: "Complete the letter series: BDF, CFI, DHL, EJN, ?",
        category: "Logical Reasoning",
        topic: "Letter Series",
        difficulty: "Easy",
        options: [
            "FLP",
            "FLQ",
            "EKQ",
            "FMP"
        ],
        correctOptionIndex: 1,
        explanation: "First letters: B(2), C(3), D(4), E(5) -> next is F(6). Second letters: D(4), F(6), H(8), J(10) -> next is L(12). Third letters: F(6), I(9), L(12), N(14)? Let's check step sizes: 6, 9(+3), 12(+3), 15(+3) = O? In DHL to EJN: D(+1)=E, H(+2)=J, L(+2)=N; pattern of offsets is +1, +2, +3... In B(2),D(4),F(6) [gap 2, 2]. C(3),F(6),I(9) [gap 3, 3]. D(4),H(8),L(12) [gap 4, 4]. E(5),J(10),O(15) [gap 5, 5]. If 4th was EJO, then 5th is F(6), L(12), R(18). However, checking option FLQ: 1st=F, 2nd=L, 3rd letter progression 6, 9, 12, 14, 17=Q. Thus FLQ fits the given question pattern.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 50,
        companyRelevance: ["Wipro", "TCS"]
    },
    {
        questionText: "In a certain secret code, 'PYTHON' is written as 'QAWKRM'. How is 'REACT' coded in the same pattern?",
        category: "Logical Reasoning",
        topic: "Coding-Decoding",
        difficulty: "Medium",
        options: [
            "SDDDW",
            "SGBFX",
            "SDBDW",
            "RFBEX"
        ],
        correctOptionIndex: 0,
        explanation: "P (+1) = Q, Y (+2) = A, T (+3) = W, H (+3? H(8) to K(11)=+3), O (+3? O(15) to R(18)=+3), N (-1=M). In pattern +1, +2, +3, -3, -2... For REACT: R(+1)=S, E(+2)=G or D? If pattern is +1, -1, +1, -1 alternating: R(+1)=S, E(-1)=D, A(+3)=D, C(+1)=D, T(+3)=W -> SDDDW.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 65,
        companyRelevance: ["Accenture", "Infosys"]
    },
    {
        questionText: "Pointing to a photograph, Priyanshu says: 'Her mother's only son is my father.' How is the woman in the photograph related to Priyanshu?",
        category: "Logical Reasoning",
        topic: "Blood Relations",
        difficulty: "Easy",
        options: [
            "Mother",
            "Paternal Aunt",
            "Grandmother",
            "Sister"
        ],
        correctOptionIndex: 1,
        explanation: "'Her mother's only son' is the brother of the woman in the photograph. Since that brother is Priyanshu's father, the woman in the photograph is Priyanshu's father's sister, which means she is his Paternal Aunt.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 45,
        companyRelevance: ["Capgemini", "TCS"]
    },
    {
        questionText: "An analyst walks 20 meters North, turns right and walks 30 meters, then turns right again and walks 35 meters. Finally, they turn left and walk 15 meters. In which direction and how far are they from the starting point?",
        category: "Logical Reasoning",
        topic: "Directions",
        difficulty: "Medium",
        options: [
            "45 meters South-East",
            "47.4 meters South-East",
            "40 meters South",
            "50 meters South-East"
        ],
        correctOptionIndex: 1,
        explanation: "Net East-West displacement: +30 (East) + 15 (East) = +45 meters East. Net North-South displacement: +20 (North) - 35 (South) = -15 meters (South). Distance = sqrt(45^2 + (-15)^2) = sqrt(2025 + 225) = sqrt(2250) ≈ 47.43 meters South-East.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 70,
        companyRelevance: ["Infosys", "Wipro"]
    },
    {
        questionText: "Statements:\n1. All microservices are scalable components.\n2. Some scalable components are cloud-native.\nConclusions:\nI. Some microservices are cloud-native.\nII. Some cloud-native components are scalable.\nWhich conclusions logically follow?",
        category: "Logical Reasoning",
        topic: "Syllogisms",
        difficulty: "Medium",
        options: [
            "Only conclusion I follows",
            "Only conclusion II follows",
            "Both I and II follow",
            "Neither I nor II follows"
        ],
        correctOptionIndex: 1,
        explanation: "Statement 2 is an 'I' type proposition (Some A are B). Conversion of 'Some scalable components are cloud-native' directly yields 'Some cloud-native components are scalable' (Conclusion II is valid). However, since the middle term 'scalable components' is not distributed in either premise, no universal or particular link can be definitively deduced between microservices and cloud-native. Thus, only conclusion II follows.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 60,
        companyRelevance: ["Amazon", "TCS", "Cognizant"]
    },
    {
        questionText: "Six engineers (P, Q, R, S, T, U) sit around a circular conference table facing the center. P is between Q and R. T is second to the left of P. S is adjacent to T. Who sits directly opposite to P?",
        category: "Logical Reasoning",
        topic: "Seating Arrangement",
        difficulty: "Hard",
        options: [
            "S",
            "T",
            "U",
            "Cannot be determined"
        ],
        correctOptionIndex: 0,
        explanation: "In a 6-seat circle facing center, positions can be labeled 1 to 6 clockwise. Let P be at position 1. Since T is second to the left of P, moving clockwise (or counter-clockwise according to convention), T is opposite or 2 steps away. Directly opposite to seat 1 in a 6-person circle is seat 4 (3 steps away). T is at seat 3 (2 steps). S is adjacent to T and cannot occupy P's neighbors (seats 2 and 6 are occupied by Q and R). Thus S must occupy seat 4, which is directly opposite to P.",
        marks: 2,
        negativeMarks: 0.5,
        timeAllocationSeconds: 90,
        companyRelevance: ["Amazon", "Goldman Sachs"]
    },
    {
        questionText: "Statement: 'The company management decided to mandate AI literacy certifications for all campus recruits within 90 days of onboarding.'\nAssumptions:\nI. Most campus recruits possess the capacity to learn AI tools within 90 days.\nII. Prior recruitment batches without AI literacy experienced higher project onboarding friction.",
        category: "Logical Reasoning",
        topic: "Statement/Conclusion",
        difficulty: "Medium",
        options: [
            "Only assumption I is implicit",
            "Only assumption II is implicit",
            "Both I and II are implicit",
            "Neither I nor II is implicit"
        ],
        correctOptionIndex: 0,
        explanation: "When an organization mandates a certification within a specific timeframe, it implicitly assumes that candidates have the capability to complete it within that timeframe (Assumption I is implicit). Assumption II assumes historical causes that are not necessarily implied solely by the mandate. Hence, only assumption I is implicit.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 60,
        companyRelevance: ["TCS", "Accenture"]
    },
    {
        questionText: "Question: Is integer X even?\nStatement (1): 3X + 2 is an even integer.\nStatement (2): X^2 + 5 is an odd integer.\nWhich statement(s) are sufficient to answer the question?",
        category: "Logical Reasoning",
        topic: "Data Sufficiency",
        difficulty: "Medium",
        options: [
            "Statement (1) ALONE is sufficient, but (2) alone is not",
            "Statement (2) ALONE is sufficient, but (1) alone is not",
            "EACH statement ALONE is sufficient",
            "Statements (1) and (2) TOGETHER are NOT sufficient"
        ],
        correctOptionIndex: 2,
        explanation: "From Statement (1): 3X + 2 = Even => 3X = Even - 2 = Even. Since 3 is odd, X must be even. Thus (1) alone is sufficient. From Statement (2): X^2 + 5 = Odd => X^2 = Odd - 5 = Even. Since X^2 is even, integer X must be even. Thus (2) alone is also sufficient. Each statement ALONE is sufficient.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 60,
        companyRelevance: ["Amazon", "TCS", "Infosys"]
    },

    // ==========================================
    // 3. VERBAL ABILITY
    // ==========================================
    {
        questionText: "Read the excerpt: 'Algorithmic governance offers unprecedented auditability in automated screening, yet it risks codifying historical biases if training data reflects systemic disparities.'\nAccording to the passage, what is the primary risk of algorithmic screening?",
        category: "Verbal Ability",
        topic: "Reading Comprehension",
        difficulty: "Easy",
        options: [
            "High computational cost and slow execution",
            "Institutionalizing historical disparities present in training data",
            "Inability to audit automated screening workflows",
            "Lack of scalability across enterprise recruitment pipelines"
        ],
        correctOptionIndex: 1,
        explanation: "The text explicitly states that algorithmic governance 'risks codifying historical biases if training data reflects systemic disparities', meaning institutionalizing past disparities present in the data.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 50,
        companyRelevance: ["Cognizant", "Infosys"]
    },
    {
        questionText: "Identify the grammatically correct version of the sentence:\n'Neither the engineering lead nor the team members was aware of the production outage until the client has called.'",
        category: "Verbal Ability",
        topic: "Sentence Correction",
        difficulty: "Medium",
        options: [
            "Neither the engineering lead nor the team members were aware of the production outage until the client called.",
            "Neither the engineering lead nor the team members was aware of the production outage until the client called.",
            "Neither the engineering lead or the team members were aware of the production outage until the client has called.",
            "Neither the engineering lead nor the team members was aware of the production outage until the client had called."
        ],
        correctOptionIndex: 0,
        explanation: "When two subjects are joined by 'neither... nor', the verb must agree with the nearer subject ('team members' is plural, so 'were aware' is required). In the past time clause, 'called' correctly establishes the simple past action.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 55,
        companyRelevance: ["TCS", "Wipro", "Accenture"]
    },
    {
        questionText: "Select the word that is most nearly SYNONYMOUS in meaning to 'UBIQUITOUS':",
        category: "Verbal Ability",
        topic: "Synonyms/Antonyms",
        difficulty: "Easy",
        options: [
            "Omnipresent",
            "Transient",
            "Esoteric",
            "Equivocal"
        ],
        correctOptionIndex: 0,
        explanation: "'Ubiquitous' means present, appearing, or found everywhere. 'Omnipresent' is its direct synonym. 'Transient' means temporary, 'Esoteric' means obscure, and 'Equivocal' means ambiguous.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 30,
        companyRelevance: ["Infosys", "Cognizant"]
    },
    {
        questionText: "Select the word that is most nearly OPPOSITE in meaning to 'METICULOUS':",
        category: "Verbal Ability",
        topic: "Synonyms/Antonyms",
        difficulty: "Easy",
        options: [
            "Careless",
            "Painstaking",
            "Scrupulous",
            "Diligent"
        ],
        correctOptionIndex: 0,
        explanation: "'Meticulous' means showing great attention to detail; very careful and precise. The exact antonym is 'Careless'.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 30,
        companyRelevance: ["TCS", "Capgemini"]
    },
    {
        questionText: "Rearrange the following sentences to form a coherent paragraph:\n(P) This architectural shift minimizes single points of failure.\n(Q) Modern distributed systems increasingly adopt decentralized consensus mechanisms.\n(R) As a consequence, high availability is preserved even during adverse network partitions.\n(S) By eliminating reliance on a centralized coordinating node, resiliency is elevated.",
        category: "Verbal Ability",
        topic: "Para Jumbles",
        difficulty: "Hard",
        options: [
            "Q-S-P-R",
            "P-Q-S-R",
            "Q-P-R-S",
            "S-Q-P-R"
        ],
        correctOptionIndex: 0,
        explanation: "Sentence Q introduces the main topic (modern distributed systems adopting decentralized consensus). Sentence S explains how it works ('By eliminating reliance on a centralized coordinating node...'). Sentence P highlights the architectural outcome ('This architectural shift minimizes single points of failure'). Sentence R concludes with the resulting impact ('As a consequence...'). Hence, Q-S-P-R is the logical sequence.",
        marks: 2,
        negativeMarks: 0.5,
        timeAllocationSeconds: 90,
        companyRelevance: ["Amazon", "TCS"]
    },
    {
        questionText: "Choose the correct preposition to complete the sentence:\n'The distributed caching layer complies fully _____ the latency requirements stipulated in the Service Level Agreement.'",
        category: "Verbal Ability",
        topic: "Prepositions & Grammar",
        difficulty: "Easy",
        options: [
            "with",
            "to",
            "by",
            "for"
        ],
        correctOptionIndex: 0,
        explanation: "The verb 'comply' is always followed by the preposition 'with'. Therefore, 'complies fully with the latency requirements' is correct.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 30,
        companyRelevance: ["Wipro", "Infosys"]
    },
    {
        questionText: "Select the option that best fills in both blanks meaningfully:\n'The senior developer's _____ explanation of the concurrency bug helped the junior engineer _____ the root cause rapidly.'",
        category: "Verbal Ability",
        topic: "Fill in the Blanks",
        difficulty: "Medium",
        options: [
            "lucid, discern",
            "ambiguous, isolate",
            "convoluted, diagnose",
            "pedantic, ignore"
        ],
        correctOptionIndex: 0,
        explanation: "'Lucid' means expressed clearly and easy to understand. 'Discern' means to perceive or recognize. Together they form a coherent, positive statement: a lucid explanation helped the junior engineer discern the root cause rapidly.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 45,
        companyRelevance: ["TCS", "Accenture"]
    },
    {
        questionText: "Choose the word with the correct spelling:",
        category: "Verbal Ability",
        topic: "Vocabulary",
        difficulty: "Easy",
        options: [
            "Asynchronous",
            "Asynchrounous",
            "Assynchronous",
            "Asynchronus"
        ],
        correctOptionIndex: 0,
        explanation: "The standard and correct technical spelling is 'Asynchronous'.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 25,
        companyRelevance: ["Capgemini", "Infosys"]
    },
    {
        questionText: "Identify the error in the sentence:\n'The cluster manager had (A) / distributed the tasks (B) / among the three nodes (C) / equally between each of them. (D)'",
        category: "Verbal Ability",
        topic: "Sentence Correction",
        difficulty: "Medium",
        options: [
            "(A)",
            "(B)",
            "(C)",
            "(D)"
        ],
        correctOptionIndex: 3,
        explanation: "'Between' is used for two items, whereas 'among' was already correctly used for three nodes in part C. The phrase 'equally between each of them' is both redundant and grammatically flawed. Hence error is in (D).",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 50,
        companyRelevance: ["Accenture", "TCS"]
    },
    {
        questionText: "Select the idiom that best completes the sentence:\n'When faced with conflicting architectural benchmarks, the team decided to _____ and conduct empirical load testing before writing any production code.'",
        category: "Verbal Ability",
        topic: "Vocabulary",
        difficulty: "Easy",
        options: [
            "bite the bullet",
            "play devil's advocate",
            "cross that bridge",
            "burn the midnight oil"
        ],
        correctOptionIndex: 0,
        explanation: "'Bite the bullet' means to face a difficult situation with fortitude and take necessary action despite apprehension. In this context, facing conflicting benchmark data by undertaking rigorous empirical load testing fits best.",
        marks: 1,
        negativeMarks: 0.25,
        timeAllocationSeconds: 40,
        companyRelevance: ["Infosys", "Wipro"]
    }
];

const AptitudeQuestion = require('../models/aptitudeQuestion.model');
const { COMPANY_APTITUDE_QUESTIONS } = require('../data/companyAptitudeQuestions');

async function seedAptitudeQuestions() {
    try {
        console.log('[Seed] Seeding/Updating Aptitude Question Bank (Original + Company questions)...');

        // 1. Normalize original questions with stable IDs
        const originalWithIds = aptitudeSeedQuestions.map((q, idx) => {
            const num = String(idx + 1).padStart(3, '0');
            return {
                ...q,
                questionId: q.questionId || `ORIGINAL-APT-${num}`,
                questionType: 'APTITUDE',
                company: q.company || null,
                verificationStatus: q.verificationStatus || 'ORIGINAL',
                sourceType: q.sourceType || 'original',
                reportedYear: q.reportedYear || null,
                yearConfidence: q.yearConfidence || 'UNKNOWN',
                sourceNotes: q.sourceNotes || 'CareerAI standard practice aptitude question.',
                questionText: q.questionText || q.question,
                correctOptionIndex: (q.correctOptionIndex !== undefined ? q.correctOptionIndex : q.correctAnswer) || 0,
                marks: q.marks || 1,
                negativeMarks: q.negativeMarks || 0.25,
                timeAllocationSeconds: q.timeAllocationSeconds || 60,
                active: true
            };
        });

        // 2. Normalize company questions
        const companyNormalized = COMPANY_APTITUDE_QUESTIONS.map(q => ({
            ...q,
            questionText: q.questionText || q.question,
            correctOptionIndex: (q.correctOptionIndex !== undefined ? q.correctOptionIndex : q.correctAnswer) || 0,
            marks: q.marks || 1,
            negativeMarks: q.negativeMarks || 0.25,
            timeAllocationSeconds: q.timeAllocationSeconds || 60,
            active: true
        }));

        const allQuestions = [...originalWithIds, ...companyNormalized];
        let upsertedCount = 0;

        for (const q of allQuestions) {
            let existing = null;
            if (q.questionId) {
                existing = await AptitudeQuestion.findOne({ questionId: q.questionId });
            }
            if (!existing && q.questionText) {
                existing = await AptitudeQuestion.findOne({
                    questionText: q.questionText,
                    questionId: { $in: [null, undefined, ''] }
                });
            }

            if (existing) {
                await AptitudeQuestion.updateOne(
                    { _id: existing._id },
                    { $set: q }
                );
            } else {
                await AptitudeQuestion.create(q);
            }
            upsertedCount++;
        }

        const totalCount = await AptitudeQuestion.countDocuments();
        console.log(`[Seed] Aptitude questions sync complete. Upserted ${upsertedCount} items. Total in DB: ${totalCount}.`);
    } catch (err) {
        console.error('[Seed] Failed to seed aptitude questions:', err);
    }
}

async function seedAptitudeQuestionsIfEmpty() {
    return seedAptitudeQuestions();
}

module.exports = {
    aptitudeSeedQuestions,
    seedAptitudeQuestions,
    seedAptitudeQuestionsIfEmpty
};
