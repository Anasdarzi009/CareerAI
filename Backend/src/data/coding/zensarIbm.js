/**
 * Coding questions for Zensar and IBM (22 questions, 11 each)
 */
const ZENSAR_IBM_CODING = [
    // =========================================================================
    // 9. ZENSAR (11 Questions: ZENSAR-CODING-001 to ZENSAR-CODING-011)
    // =========================================================================
    {
        questionId: 'ZENSAR-CODING-001',
        title: 'Segregate Even and Odd Numbers in Array',
        slug: 'zensar-segregate-even-odd-numbers',
        company: 'Zensar',
        difficulty: 'Easy',
        topics: ['Arrays', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of integers `nums`, segregate even and odd numbers such that all even numbers appear before odd numbers. The relative order among even and odd numbers can be maintained or rearranged in-place.',
        functionSignature: {
            name: 'segregateEvenOdd',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function segregateEvenOdd(nums) {\n    // Write your code here\n    \n}',
            python: 'def segregateEvenOdd(nums: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] segregateEvenOdd(int[] nums) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> segregateEvenOdd(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums = [12, 34, 45, 9, 8, 90, 3]', output: '[12, 34, 8, 90, 45, 9, 3]', explanation: 'Evens appear before odds.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^6'],
        testCases: [
            { input: '{"nums":[12, 34, 45, 9, 8, 90, 3]}', expectedOutput: '[12,34,8,90,45,9,3]', isHidden: false },
            { input: '{"nums":[1, 3, 5]}', expectedOutput: '[1,3,5]', isHidden: true },
            { input: '{"nums":[2, 4, 6]}', expectedOutput: '[2,4,6]', isHidden: true }
        ],
        hints: ['Use two pointers converging from start and end, swapping when left is odd and right is even.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Zensar ESD Technical Assessment 2024',
        sourceUrl: 'https://www.zensar.com/careers',
        reportedYear: 2024,
        reportedDate: 'Mar 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Zensar on-campus coding assessment.',
        explanation: 'Partition array like quicksort step putting even numbers on left and odd on right.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-002',
        title: 'Word Frequency in Sentence',
        slug: 'zensar-word-frequency-sentence',
        company: 'Zensar',
        difficulty: 'Easy',
        topics: ['Strings', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a sentence string `text`, return the word with the highest frequency. If multiple words tie for highest frequency, return the lexicographically smallest word.',
        functionSignature: {
            name: 'mostFrequentWord',
            params: [{ name: 'text', type: 'string' }],
            returnType: 'string'
        },
        starterCode: {
            javascript: 'function mostFrequentWord(text) {\n    // Write your code here\n    \n}',
            python: 'def mostFrequentWord(text: str) -> str:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public String mostFrequentWord(String text) {\n        // Write your code here\n        return "";\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string mostFrequentWord(string text) {\n        // Write your code here\n        return "";\n    }\n};'
        },
        examples: [
            { input: 'text = "apple banana apple orange banana apple"', output: '"apple"', explanation: '"apple" occurs 3 times.' }
        ],
        constraints: ['1 <= text.length <= 10^4', 'Words separated by single spaces.'],
        testCases: [
            { input: '{"text":"apple banana apple orange banana apple"}', expectedOutput: 'apple', isHidden: false },
            { input: '{"text":"cat dog bat bat cat"}', expectedOutput: 'bat', isHidden: false }
        ],
        hints: ['Split words, count in hash map, track maximum with alphabetical tie-breaker.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Zensar Campus Drive 2024',
        sourceUrl: 'https://prepinsta.com/zensar/coding-questions/',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Zensar technical test.',
        explanation: 'Map word counts and sort candidates by count descending then word ascending.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-003',
        title: 'Sum of Alternating Digits',
        slug: 'zensar-sum-alternating-digits',
        company: 'Zensar',
        difficulty: 'Easy',
        topics: ['Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a positive integer `n`, compute the alternating sum of its digits from left to right (d1 - d2 + d3 - d4 ...).',
        functionSignature: {
            name: 'alternateDigitSum',
            params: [{ name: 'n', type: 'number' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function alternateDigitSum(n) {\n    // Write your code here\n    \n}',
            python: 'def alternateDigitSum(n: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int alternateDigitSum(int n) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int alternateDigitSum(int n) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'n = 521', output: '4', explanation: '5 - 2 + 1 = 4.' },
            { input: 'n = 111', output: '1', explanation: '1 - 1 + 1 = 1.' }
        ],
        constraints: ['1 <= n <= 10^9'],
        testCases: [
            { input: '{"n":521}', expectedOutput: '4', isHidden: false },
            { input: '{"n":111}', expectedOutput: '1', isHidden: false },
            { input: '{"n":886996}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Convert n to string and alternate + and - signs.'],
        sourceType: 'pattern_based',
        sourceName: 'Zensar Technical Paper Pattern',
        sourceUrl: 'https://www.faceprep.in/zensar-coding-questions/',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Pattern-based numeric logic question in Zensar assessments.',
        explanation: 'Iterate digits left to right, adding when index is even and subtracting when odd.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-004',
        title: 'Kth Smallest Element in Array',
        slug: 'zensar-kth-smallest-element',
        company: 'Zensar',
        difficulty: 'Medium',
        topics: ['Sorting', 'Searching', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an unsorted array `nums` of `n` integers and an integer `k`, return the `k-th` smallest element in the array.',
        functionSignature: {
            name: 'kthSmallest',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function kthSmallest(nums, k) {\n    // Write your code here\n    \n}',
            python: 'def kthSmallest(nums: list[int], k: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int kthSmallest(int[] nums, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int kthSmallest(vector<int>& nums, int k) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [7, 10, 4, 3, 20, 15], k = 3', output: '7', explanation: 'Sorted: [3, 4, 7, 10, 15, 20]. 3rd smallest is 7.' }
        ],
        constraints: ['1 <= k <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
            { input: '{"nums":[7, 10, 4, 3, 20, 15],"k":3}', expectedOutput: '7', isHidden: false },
            { input: '{"nums":[2, 1, 4, 3, 5],"k":1}', expectedOutput: '1', isHidden: true }
        ],
        hints: ['Use quickselect or max-heap of size k.'],
        sourceType: 'reported_interview_experience',
        sourceName: 'Zensar Off-Campus Drive 2024',
        sourceUrl: 'https://prepinsta.com/zensar/coding-questions/',
        reportedYear: 2024,
        reportedDate: 'May 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Zensar 2024 off-campus coding round.',
        explanation: 'Quickselect finds k-th smallest in O(N) average time.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-005',
        title: 'Check Power of Two',
        slug: 'zensar-check-power-of-two',
        company: 'Zensar',
        difficulty: 'Easy',
        topics: ['Bit Manipulation', 'Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`. An integer `n` is a power of two if there exists an integer `x` such that `n == 2^x`.',
        functionSignature: {
            name: 'isPowerOfTwo',
            params: [{ name: 'n', type: 'number' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isPowerOfTwo(n) {\n    // Write your code here\n    \n}',
            python: 'def isPowerOfTwo(n: int) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isPowerOfTwo(int n) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool isPowerOfTwo(int n) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'n = 16', output: 'true', explanation: '2^4 = 16.' },
            { input: 'n = 3', output: 'false', explanation: '3 is not a power of 2.' }
        ],
        constraints: ['-2^31 <= n <= 2^31 - 1'],
        testCases: [
            { input: '{"n":16}', expectedOutput: 'true', isHidden: false },
            { input: '{"n":3}', expectedOutput: 'false', isHidden: false },
            { input: '{"n":1}', expectedOutput: 'true', isHidden: true },
            { input: '{"n":0}', expectedOutput: 'false', isHidden: true }
        ],
        hints: ['n > 0 and (n & (n - 1)) === 0.'],
        sourceType: 'pattern_based',
        sourceName: 'Zensar Core Fundamentals Pattern',
        sourceUrl: 'https://prepinsta.com/zensar/coding-questions/',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Bitwise check pattern in entry-level assessments.',
        explanation: 'Powers of two have exactly one bit set: (n & (n - 1)) clears it.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-006',
        title: 'First Non-Repeating Character in String Stream',
        slug: 'zensar-first-non-repeating-stream',
        company: 'Zensar',
        difficulty: 'Medium',
        topics: ['Queue', 'Hashing', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a stream of characters as a string `s`, return a string containing the first non-repeating character from the stream at each point. If no non-repeating character exists at that point, output "#".',
        functionSignature: {
            name: 'firstNonRepeatingStream',
            params: [{ name: 's', type: 'string' }],
            returnType: 'string'
        },
        starterCode: {
            javascript: 'function firstNonRepeatingStream(s) {\n    // Write your code here\n    \n}',
            python: 'def firstNonRepeatingStream(s: str) -> str:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public String firstNonRepeatingStream(String s) {\n        // Write your code here\n        return "";\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string firstNonRepeatingStream(string s) {\n        // Write your code here\n        return "";\n    }\n};'
        },
        examples: [
            { input: 's = "aabc"', output: '"a#bb"', explanation: 'a -> "a", aa -> "#", aab -> "b", aabc -> "b".' }
        ],
        constraints: ['1 <= s.length <= 10^4', 's consists of lowercase English letters.'],
        testCases: [
            { input: '{"s":"aabc"}', expectedOutput: 'a#bb', isHidden: false },
            { input: '{"s":"zz"}', expectedOutput: 'z#', isHidden: false }
        ],
        hints: ['Use a frequency map and a FIFO queue.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Zensar Technical Interview 2023',
        sourceUrl: 'https://www.geeksforgeeks.org/zensar-technologies-interview-experience/',
        reportedYear: 2023,
        reportedDate: 'Nov 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Zensar round 2 technical interview for Graduate Trainee.',
        explanation: 'Push chars to queue, increment map, pop queue while front count > 1.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-007',
        title: 'Minimum Coins for Target Change',
        slug: 'zensar-coin-change-greedy-dp',
        company: 'Zensar',
        difficulty: 'Medium',
        topics: ['Dynamic Programming', 'Greedy'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of coin denominations `coins` and an integer `amount`, return the fewest number of coins needed to make up that amount. If that amount of money cannot be made up, return `-1`.',
        functionSignature: {
            name: 'minCoins',
            params: [
                { name: 'coins', type: 'number[]' },
                { name: 'amount', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function minCoins(coins, amount) {\n    // Write your code here\n    \n}',
            python: 'def minCoins(coins: list[int], amount: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int minCoins(int[] coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minCoins(vector<int>& coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'coins = [1, 2, 5], amount = 11', output: '3', explanation: '5 + 5 + 1 = 11 (3 coins).' }
        ],
        constraints: ['1 <= coins.length <= 12', '1 <= amount <= 10^4'],
        testCases: [
            { input: '{"coins":[1, 2, 5],"amount":11}', expectedOutput: '3', isHidden: false },
            { input: '{"coins":[2],"amount":3}', expectedOutput: '-1', isHidden: false }
        ],
        hints: ['Bottom-up DP: dp[i] = min(dp[i], dp[i - c] + 1).'],
        sourceType: 'reported_interview_experience',
        sourceName: 'Zensar Final Technical Interview 2024',
        sourceUrl: 'https://prepinsta.com/zensar/coding-questions/',
        reportedYear: 2024,
        reportedDate: 'Apr 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Classic DP coin change reported in Zensar hiring round.',
        explanation: 'Build DP array of size amount + 1 initialized to Infinity.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-008',
        title: 'Count Inversions in an Array',
        slug: 'zensar-count-inversions-array',
        company: 'Zensar',
        difficulty: 'Hard',
        topics: ['Divide and Conquer', 'Sorting'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of integers `nums`, return the number of inversions. Two elements `nums[i]` and `nums[j]` form an inversion if `nums[i] > nums[j]` and `i < j`.',
        functionSignature: {
            name: 'countInversions',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function countInversions(nums) {\n    // Write your code here\n    \n}',
            python: 'def countInversions(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public long countInversions(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    long long countInversions(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [2, 4, 1, 3, 5]', output: '3', explanation: '(2,1), (4,1), (4,3).' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '1 <= nums[i] <= 10^9'],
        testCases: [
            { input: '{"nums":[2, 4, 1, 3, 5]}', expectedOutput: '3', isHidden: false },
            { input: '{"nums":[4, 3, 2, 1]}', expectedOutput: '6', isHidden: true }
        ],
        hints: ['Modify merge sort to accumulate inversion counts during merge step.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Zensar Senior Trainee Interview Experience',
        sourceUrl: 'https://www.geeksforgeeks.org/zensar-technologies-interview-experience/',
        reportedYear: 2023,
        reportedDate: 'Sep 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Zensar advanced coding round.',
        explanation: 'Merge sort counts inversions in O(N log N) time.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-009',
        title: 'Check Undirected Graph Cycle',
        slug: 'zensar-undirected-graph-cycle',
        company: 'Zensar',
        difficulty: 'Hard',
        topics: ['Graphs', 'DFS'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given the number of vertices `v` and an adjacency list `adj` representing an undirected graph, determine whether the graph contains any cycle. Return `true` if a cycle exists, else `false`.',
        functionSignature: {
            name: 'isCycle',
            params: [
                { name: 'v', type: 'number' },
                { name: 'edges', type: 'number[][]' }
            ],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isCycle(v, edges) {\n    // Write your code here\n    \n}',
            python: 'def isCycle(v: int, edges: list[list[int]]) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isCycle(int v, int[][] edges) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isCycle(int v, vector<vector<int>>& edges) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'v = 4, edges = [[0,1],[1,2],[2,3],[3,0]]', output: 'true', explanation: 'Cycle: 0-1-2-3-0.' }
        ],
        constraints: ['1 <= v <= 10^4', '0 <= edges.length <= 10^4'],
        testCases: [
            { input: '{"v":4,"edges":[[0,1],[1,2],[2,3],[3,0]]}', expectedOutput: 'true', isHidden: false },
            { input: '{"v":3,"edges":[[0,1],[1,2]]}', expectedOutput: 'false', isHidden: false }
        ],
        hints: ['Use DFS keeping track of parent node to avoid false cycle on undirected edge.'],
        sourceType: 'reported_interview_experience',
        sourceName: 'Zensar Senior Developer Coding Round',
        sourceUrl: 'https://www.geeksforgeeks.org/zensar-technologies-interview-experience/',
        reportedYear: 2024,
        reportedDate: 'Feb 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Zensar tech stack evaluation.',
        explanation: 'Standard DFS graph cycle detection with parent pointer tracking.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-010',
        title: 'Delete Value from Singly Linked List',
        slug: 'zensar-delete-value-linked-list',
        company: 'Zensar',
        difficulty: 'Medium',
        topics: ['Linked List'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array representation of a singly linked list `nums` and an integer `val`, delete the first occurrence of `val` and return the modified list.',
        functionSignature: {
            name: 'deleteNode',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'val', type: 'number' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function deleteNode(nums, val) {\n    // Write your code here\n    \n}',
            python: 'def deleteNode(nums: list[int], val: int) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] deleteNode(int[] nums, int val) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> deleteNode(vector<int>& nums, int val) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 2, 6, 3, 4], val = 6', output: '[1, 2, 3, 4]', explanation: '6 is removed.' }
        ],
        constraints: ['1 <= nums.length <= 1000', '1 <= nums[i] <= 1000'],
        testCases: [
            { input: '{"nums":[1, 2, 6, 3, 4],"val":6}', expectedOutput: '[1,2,3,4]', isHidden: false },
            { input: '{"nums":[5, 5, 5],"val":5}', expectedOutput: '[5,5]', isHidden: true }
        ],
        hints: ['Traverse until node with target value is found, rewire predecessor pointer.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Zensar Interview Experience 2023',
        sourceUrl: 'https://www.geeksforgeeks.org/zensar-technologies-interview-experience/',
        reportedYear: 2023,
        reportedDate: 'Oct 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Corner case deletion tested in Zensar interviews.',
        explanation: 'Remove first matching element from sequence.',
        active: true
    },
    {
        questionId: 'ZENSAR-CODING-011',
        title: 'Longest Continuous Increasing Subsequence',
        slug: 'zensar-longest-continuous-increasing-subsequence',
        company: 'Zensar',
        difficulty: 'Easy',
        topics: ['Arrays', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an unsorted array of integers `nums`, return the length of the longest continuous increasing subarray (i.e. strictly increasing contiguous segment).',
        functionSignature: {
            name: 'findLengthOfLCIS',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function findLengthOfLCIS(nums) {\n    // Write your code here\n    \n}',
            python: 'def findLengthOfLCIS(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int findLengthOfLCIS(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findLengthOfLCIS(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 3, 5, 4, 7]', output: '3', explanation: '[1, 3, 5] is the longest continuous increasing segment with length 3.' }
        ],
        constraints: ['1 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
            { input: '{"nums":[1, 3, 5, 4, 7]}', expectedOutput: '3', isHidden: false },
            { input: '{"nums":[2, 2, 2, 2, 2]}', expectedOutput: '1', isHidden: true }
        ],
        hints: ['Use sliding window or single pass resetting length when nums[i] <= nums[i-1].'],
        sourceType: 'reported_interview_experience',
        sourceName: 'Zensar Technical Interview 2024',
        sourceUrl: 'https://prepinsta.com/zensar/coding-questions/',
        reportedYear: 2024,
        reportedDate: 'May 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Continuous subarray tracking problem tested at Zensar.',
        explanation: 'Single pass O(N) sliding window tracking streak length.',
        active: true
    },

    // =========================================================================
    // 10. IBM (11 Questions: IBM-CODING-001 to IBM-CODING-011)
    // =========================================================================
    {
        questionId: 'IBM-CODING-001',
        title: 'Minimum Operations to Make Strings Equal by Swap',
        slug: 'ibm-minimum-swap-operations-equal-strings',
        company: 'IBM',
        difficulty: 'Medium',
        topics: ['Strings', 'Greedy'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given two binary strings `s` and `t` of equal length, find the minimum number of bit-swap operations required to make `s` equal to `t`. If it is impossible, return `-1`.',
        functionSignature: {
            name: 'minSwaps',
            params: [
                { name: 's', type: 'string' },
                { name: 't', type: 'string' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function minSwaps(s, t) {\n    // Write your code here\n    \n}',
            python: 'def minSwaps(s: str, t: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int minSwaps(String s, String t) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minSwaps(string s, string t) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 's = "1100", t = "0011"', output: '2', explanation: '2 swaps required.' }
        ],
        constraints: ['1 <= s.length <= 10^5', 's and t contain only "0" and "1"'],
        testCases: [
            { input: '{"s":"1100","t":"0011"}', expectedOutput: '2', isHidden: false },
            { input: '{"s":"1001","t":"0110"}', expectedOutput: '2', isHidden: false },
            { input: '{"s":"10","t":"00"}', expectedOutput: '-1', isHidden: true }
        ],
        hints: ['Count mismatches (0->1 and 1->0). If total 1s differ, return -1.'],
        sourceType: 'reported_interview_experience',
        sourceName: 'IBM HackerRank Assessment 2025',
        sourceUrl: 'https://www.ibm.com/careers',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Directly reported in IBM HackerRank assessment for Associate System Engineer.',
        explanation: 'Each swap fixes two mismatched positions. Total swaps = mismatch / 2.',
        active: true
    },
    {
        questionId: 'IBM-CODING-002',
        title: 'Sliding Window Maximum Server Vulnerability',
        slug: 'ibm-sliding-window-maximum',
        company: 'IBM',
        difficulty: 'Medium',
        topics: ['Sliding Window', 'Queue', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'IBM cloud monitoring records vulnerability scores for `n` servers. Given an array `nums` and integer `k`, find the maximum vulnerability score within every contiguous subsegment of size `k`.',
        functionSignature: {
            name: 'maxSlidingWindow',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function maxSlidingWindow(nums, k) {\n    // Write your code here\n    \n}',
            python: 'def maxSlidingWindow(nums: list[int], k: int) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3', output: '[3, 3, 5, 5, 6, 7]', explanation: 'Max in each window of size 3.' }
        ],
        constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
            { input: '{"nums":[1, 3, -1, -3, 5, 3, 6, 7],"k":3}', expectedOutput: '[3,3,5,5,6,7]', isHidden: false },
            { input: '{"nums":[4, 2, 1, 3],"k":2}', expectedOutput: '[4,2,3]', isHidden: true }
        ],
        hints: ['Use monotonic decreasing deque storing indices.'],
        sourceType: 'reported_interview_experience',
        sourceName: 'IBM Technical Assessment 2024',
        sourceUrl: 'https://prepinsta.com/ibm/coding-questions/',
        reportedYear: 2024,
        reportedDate: 'Sep 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in IBM Cloud Developer campus assessment.',
        explanation: 'Monotonic deque yields O(N) sliding window maximum.',
        active: true
    },
    {
        questionId: 'IBM-CODING-003',
        title: 'Longest Strictly Increasing Subsequence',
        slug: 'ibm-longest-increasing-subsequence',
        company: 'IBM',
        difficulty: 'Medium',
        topics: ['Dynamic Programming', 'Binary Search'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
        functionSignature: {
            name: 'lengthOfLIS',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function lengthOfLIS(nums) {\n    // Write your code here\n    \n}',
            python: 'def lengthOfLIS(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int lengthOfLIS(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]', output: '4', explanation: 'Longest increasing subsequence is [2, 3, 7, 101] with length 4.' }
        ],
        constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
            { input: '{"nums":[10, 9, 2, 5, 3, 7, 101, 18]}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[0, 1, 0, 3, 2, 3]}', expectedOutput: '4', isHidden: true }
        ],
        hints: ['Patience sorting with binary search achieves O(N log N).'],
        sourceType: 'reported_interview_experience',
        sourceName: 'IBM Coding Assessment 2025',
        sourceUrl: 'https://www.geeksforgeeks.org/ibm-interview-experience/',
        reportedYear: 2025,
        reportedDate: 'Feb 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in IBM 2025 Developer hiring test.',
        explanation: 'Tails array with binary search inserts or replaces elements in O(N log N).',
        active: true
    },
    {
        questionId: 'IBM-CODING-004',
        title: 'Matrix Boundary Element Sum',
        slug: 'ibm-matrix-boundary-sum',
        company: 'IBM',
        difficulty: 'Easy',
        topics: ['Arrays', 'Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an `m x n` matrix of integers, calculate the sum of all elements located on the outer boundary of the matrix.',
        functionSignature: {
            name: 'boundarySum',
            params: [{ name: 'matrix', type: 'number[][]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function boundarySum(matrix) {\n    // Write your code here\n    \n}',
            python: 'def boundarySum(matrix: list[list[int]]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int boundarySum(int[][] matrix) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int boundarySum(vector<vector<int>>& matrix) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '40', explanation: 'Boundary: 1+2+3+4+6+7+8+9 = 40 (excluding central 5).' }
        ],
        constraints: ['1 <= m, n <= 100', '-10^3 <= matrix[i][j] <= 10^3'],
        testCases: [
            { input: '{"matrix":[[1,2,3],[4,5,6],[7,8,9]]}', expectedOutput: '40', isHidden: false },
            { input: '{"matrix":[[1,1],[1,1]]}', expectedOutput: '4', isHidden: true }
        ],
        hints: ['Sum row 0, row m-1, col 0, col n-1, taking care not to double count corners.'],
        sourceType: 'pattern_based',
        sourceName: 'IBM Fundamental Matrix Questions Pattern',
        sourceUrl: 'https://prepinsta.com/ibm/coding-questions/',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Pattern-based boundary traversal problem in IBM tests.',
        explanation: 'Sum four borders avoiding duplicate corner additions.',
        active: true
    },
    {
        questionId: 'IBM-CODING-005',
        title: 'Single Number with Thrice Repeated Elements',
        slug: 'ibm-single-number-thrice-repeated',
        company: 'IBM',
        difficulty: 'Medium',
        topics: ['Bit Manipulation'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums` where every element appears three times except for one which appears exactly once, find that single element in `O(n)` time and `O(1)` space.',
        functionSignature: {
            name: 'singleNumber',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function singleNumber(nums) {\n    // Write your code here\n    \n}',
            python: 'def singleNumber(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [2, 2, 3, 2]', output: '3', explanation: '3 appears once.' }
        ],
        constraints: ['1 <= nums.length <= 3 * 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
        testCases: [
            { input: '{"nums":[2, 2, 3, 2]}', expectedOutput: '3', isHidden: false },
            { input: '{"nums":[0, 1, 0, 1, 0, 1, 99]}', expectedOutput: '99', isHidden: true }
        ],
        hints: ['Sum the bits at each of 32 positions modulo 3.'],
        sourceType: 'reported_interview_experience',
        sourceName: 'IBM Technical Interview 2024',
        sourceUrl: 'https://www.geeksforgeeks.org/ibm-interview-experience/',
        reportedYear: 2024,
        reportedDate: 'Dec 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Bitwise problem tested in IBM Cloud Systems hiring round.',
        explanation: 'Bit count at each index mod 3 reconstructs the unique element.',
        active: true
    },
    {
        questionId: 'IBM-CODING-006',
        title: 'Binary Search in Rotated Sorted Array',
        slug: 'ibm-search-rotated-sorted-array',
        company: 'IBM',
        difficulty: 'Medium',
        topics: ['Binary Search', 'Searching'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums` sorted in ascending order with distinct values, rotated at an unknown pivot, find the index of `target`. Return `-1` if not found.',
        functionSignature: {
            name: 'search',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'target', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function search(nums, target) {\n    // Write your code here\n    \n}',
            python: 'def search(nums: list[int], target: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0', output: '4', explanation: '0 is at index 4.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i], target <= 10^4'],
        testCases: [
            { input: '{"nums":[4, 5, 6, 7, 0, 1, 2],"target":0}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[4, 5, 6, 7, 0, 1, 2],"target":3}', expectedOutput: '-1', isHidden: false }
        ],
        hints: ['Identify which half is cleanly sorted, then check if target falls within.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'IBM Off-Campus Drive 2023',
        sourceUrl: 'https://prepinsta.com/ibm/coding-questions/',
        reportedYear: 2023,
        reportedDate: 'Nov 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Classic rotated binary search tested in IBM technical screening.',
        explanation: 'O(log N) binary search comparing target to sorted half boundaries.',
        active: true
    },
    {
        questionId: 'IBM-CODING-007',
        title: 'Count Substrings with K Distinct Characters',
        slug: 'ibm-count-substrings-k-distinct',
        company: 'IBM',
        difficulty: 'Medium',
        topics: ['Strings', 'Sliding Window', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a string `s` of lowercase alphabets and an integer `k`, return the total count of substrings that contain exactly `k` distinct characters.',
        functionSignature: {
            name: 'countSubstringsWithKDistinct',
            params: [
                { name: 's', type: 'string' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function countSubstringsWithKDistinct(s, k) {\n    // Write your code here\n    \n}',
            python: 'def countSubstringsWithKDistinct(s: str, k: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public long countSubstringsWithKDistinct(String s, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    long long countSubstringsWithKDistinct(string s, int k) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 's = "pqpqs", k = 2', output: '7', explanation: '7 substrings have exactly 2 distinct characters.' }
        ],
        constraints: ['1 <= s.length <= 2 * 10^4', '1 <= k <= 26'],
        testCases: [
            { input: '{"s":"pqpqs","k":2}', expectedOutput: '7', isHidden: false },
            { input: '{"s":"aab","k":1}', expectedOutput: '4', isHidden: true }
        ],
        hints: ['Exact(k) = atMost(k) - atMost(k - 1).'],
        sourceType: 'reported_interview_experience',
        sourceName: 'IBM Technical Assessment 2024',
        sourceUrl: 'https://www.geeksforgeeks.org/ibm-interview-experience/',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in IBM 2024 national hiring drive.',
        explanation: 'Two sliding window passes for atMost(k) and atMost(k-1).',
        active: true
    },
    {
        questionId: 'IBM-CODING-008',
        title: 'Shortest Word Ladder Transformation',
        slug: 'ibm-word-ladder-bfs',
        company: 'IBM',
        difficulty: 'Hard',
        topics: ['Graphs', 'Queue', 'Searching'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given two words `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`. Return `0` if impossible.',
        functionSignature: {
            name: 'ladderLength',
            params: [
                { name: 'beginWord', type: 'string' },
                { name: 'endWord', type: 'string' },
                { name: 'wordList', type: 'string[]' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function ladderLength(beginWord, endWord, wordList) {\n    // Write your code here\n    \n}',
            python: 'def ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog" (5 words).' }
        ],
        constraints: ['1 <= beginWord.length <= 10', '1 <= wordList.length <= 5000'],
        testCases: [
            { input: '{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log","cog"]}', expectedOutput: '5', isHidden: false },
            { input: '{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log"]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['BFS traversal level by level substituting each character a-z.'],
        sourceType: 'reported_interview_experience',
        sourceName: 'IBM Systems Software Interview 2024',
        sourceUrl: 'https://www.geeksforgeeks.org/ibm-interview-experience/',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in IBM Senior Systems Engineer technical assessment.',
        explanation: 'Breadth-First Search on shortest graph path.',
        active: true
    },
    {
        questionId: 'IBM-CODING-009',
        title: 'Rotate Linked List Right by K Places',
        slug: 'ibm-rotate-linked-list',
        company: 'IBM',
        difficulty: 'Medium',
        topics: ['Linked List', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array representation of a linked list `nums` and an integer `k`, rotate the list to the right by `k` places.',
        functionSignature: {
            name: 'rotateRight',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function rotateRight(nums, k) {\n    // Write your code here\n    \n}',
            python: 'def rotateRight(nums: list[int], k: int) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] rotateRight(int[] nums, int k) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> rotateRight(vector<int>& nums, int k) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 2, 3, 4, 5], k = 2', output: '[4, 5, 1, 2, 3]', explanation: 'Rotated right by 2.' }
        ],
        constraints: ['0 <= nums.length <= 500', '0 <= k <= 2 * 10^9'],
        testCases: [
            { input: '{"nums":[1, 2, 3, 4, 5],"k":2}', expectedOutput: '[4,5,1,2,3]', isHidden: false },
            { input: '{"nums":[0, 1, 2],"k":4}', expectedOutput: '[2,0,1]', isHidden: true }
        ],
        hints: ['k = k % length; splice last k elements to the front.'],
        sourceType: 'reported_interview_experience',
        sourceName: 'IBM Software Engineer Tech Round 2024',
        sourceUrl: 'https://www.geeksforgeeks.org/ibm-interview-experience/',
        reportedYear: 2024,
        reportedDate: 'Jul 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Tested in IBM technical rounds.',
        explanation: 'Compute length, normalize k with modulo, slice and concatenate.',
        active: true
    },
    {
        questionId: 'IBM-CODING-010',
        title: 'Triplet Sum Equal to Zero',
        slug: 'ibm-three-sum-triplets',
        company: 'IBM',
        difficulty: 'Medium',
        topics: ['Arrays', 'Two Pointers', 'Sorting'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums`, return the count of unique triplets `[nums[i], nums[j], nums[k]]` such that `i != j != k` and `nums[i] + nums[j] + nums[k] == 0`.',
        functionSignature: {
            name: 'threeSumCount',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function threeSumCount(nums) {\n    // Write your code here\n    \n}',
            python: 'def threeSumCount(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int threeSumCount(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int threeSumCount(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [-1, 0, 1, 2, -1, -4]', output: '2', explanation: 'Triplets: [-1, -1, 2] and [-1, 0, 1].' }
        ],
        constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
        testCases: [
            { input: '{"nums":[-1, 0, 1, 2, -1, -4]}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[0, 1, 1]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Sort array, fix one element, use two pointers for remaining two.'],
        sourceType: 'reported_interview_experience',
        sourceName: 'IBM Senior System Engineer Interview 2024',
        sourceUrl: 'https://www.geeksforgeeks.org/ibm-interview-experience/',
        reportedYear: 2024,
        reportedDate: 'Nov 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Classic 3-Sum reported in IBM 2nd round technical interview.',
        explanation: 'Sort then two-pointer scan skipping identical duplicates.',
        active: true
    },
    {
        questionId: 'IBM-CODING-011',
        title: 'Longest Consecutive Elements Sequence',
        slug: 'ibm-longest-consecutive-sequence',
        company: 'IBM',
        difficulty: 'Medium',
        topics: ['Arrays', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence. The algorithm must run in `O(n)` time complexity.',
        functionSignature: {
            name: 'longestConsecutive',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function longestConsecutive(nums) {\n    // Write your code here\n    \n}',
            python: 'def longestConsecutive(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int longestConsecutive(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [100, 4, 200, 1, 3, 2]', output: '4', explanation: 'Sequence is [1, 2, 3, 4] with length 4.' }
        ],
        constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
            { input: '{"nums":[100, 4, 200, 1, 3, 2]}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]}', expectedOutput: '9', isHidden: true }
        ],
        hints: ['Store in Set. Only start counting sequence if num - 1 is not in Set.'],
        sourceType: 'reported_interview_experience',
        sourceName: 'IBM Cognitive Systems Interview 2024',
        sourceUrl: 'https://www.geeksforgeeks.org/ibm-interview-experience/',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'O(N) Set streak counting tested in IBM technical interview.',
        explanation: 'Insert into hash set and count lengths starting only at sequence heads.',
        active: true
    }
];

module.exports = { ZENSAR_IBM_CODING };
