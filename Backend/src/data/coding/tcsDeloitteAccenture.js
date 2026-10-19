/**
 * Coding questions for TCS, Deloitte, Accenture (33 questions, 11 each)
 */
const TCS_DELOITTE_ACCENTURE_CODING = [
    // --- TCS ---
    {
        questionId: 'TCS-CODING-001',
        title: 'Equilibrium Index of an Array',
        slug: 'tcs-equilibrium-index-array',
        company: 'TCS',
        difficulty: 'Easy',
        topics: ['Arrays', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of integers `nums`, return the first index `i` such that the sum of elements at lower indices equals the sum of elements at higher indices. If no such equilibrium index exists, return `-1`.',
        functionSignature: {
            name: 'findEquilibriumIndex',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function findEquilibriumIndex(nums) {\n    // Write your code here\n    \n}',
            python: 'def findEquilibriumIndex(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int findEquilibriumIndex(int[] nums) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findEquilibriumIndex(vector<int>& nums) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'nums = [-7, 1, 5, 2, -4, 3, 0]', output: '3', explanation: 'At index 3: -7 + 1 + 5 = -1, and -4 + 3 + 0 = -1.' },
            { input: 'nums = [1, 2, 3]', output: '-1', explanation: 'No balance point exists.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
            { input: '{"nums":[-7, 1, 5, 2, -4, 3, 0]}', expectedOutput: '3', isHidden: false },
            { input: '{"nums":[1, 2, 3]}', expectedOutput: '-1', isHidden: false },
            { input: '{"nums":[2, 0, 2]}', expectedOutput: '1', isHidden: true },
            { input: '{"nums":[1]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Precompute total sum, then iterate while maintaining running left sum.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS NQT Ninja/Digital Coding Slot 1',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported by campus candidates in TCS NQT 2025 National Placement Drive.',
        explanation: 'Compute total sum in O(n). Iterate through each element; rightSum = totalSum - leftSum - nums[i]. When leftSum equals rightSum, return index.',
        active: true
    },
    {
        questionId: 'TCS-CODING-002',
        title: 'Run Length String Compression',
        slug: 'tcs-run-length-string-compression',
        company: 'TCS',
        difficulty: 'Easy',
        topics: ['Strings', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a string `s`, compress it such that consecutive identical characters are replaced by the character followed by its count. If the compressed string is not shorter than the original, return the original string.',
        functionSignature: {
            name: 'compressString',
            params: [{ name: 's', type: 'string' }],
            returnType: 'string'
        },
        starterCode: {
            javascript: 'function compressString(s) {\n    // Write your code here\n    \n}',
            python: 'def compressString(s: str) -> str:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public String compressString(String s) {\n        // Write your code here\n        return s;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string compressString(string s) {\n        // Write your code here\n        return s;\n    }\n};'
        },
        examples: [
            { input: 's = "aabcccccaaa"', output: '"a2b1c5a3"', explanation: 'Compressed representation is shorter.' },
            { input: 's = "abcd"', output: '"abcd"', explanation: '"a1b1c1d1" has length 8 which is longer than 4, so return original.' }
        ],
        constraints: ['1 <= s.length <= 10^4', 's consists of English uppercase and lowercase letters.'],
        testCases: [
            { input: '{"s":"aabcccccaaa"}', expectedOutput: '"a2b1c5a3"', isHidden: false },
            { input: '{"s":"abcd"}', expectedOutput: '"abcd"', isHidden: false },
            { input: '{"s":"wwwwaaadexxxxxx"}', expectedOutput: '"w4a3d1e1x6"', isHidden: true }
        ],
        hints: ['Traverse the string while counting run lengths of identical adjacent characters.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS NQT Hands-on Assessment',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2025,
        reportedDate: 'Feb 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in TCS NQT On-Campus Drive 2025 slot.',
        explanation: 'Scan with two pointers to count consecutive sequences of identical characters, then compare length of compressed string with original.',
        active: true
    },
    {
        questionId: 'TCS-CODING-003',
        title: 'Smallest Number with Given Digit Product',
        slug: 'tcs-smallest-number-digit-product',
        company: 'TCS',
        difficulty: 'Medium',
        topics: ['Mathematics', 'Greedy'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a positive integer `n`, find the smallest positive integer `k` such that the product of the digits of `k` equals `n`. If no such integer exists, return `-1`.',
        functionSignature: {
            name: 'smallestNumberWithDigitProduct',
            params: [{ name: 'n', type: 'number' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function smallestNumberWithDigitProduct(n) {\n    // Write your code here\n    \n}',
            python: 'def smallestNumberWithDigitProduct(n: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public long smallestNumberWithDigitProduct(int n) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    long long smallestNumberWithDigitProduct(int n) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'n = 36', output: '49', explanation: 'Digits 4 and 9 multiply to 36 (4 * 9 = 36) and 49 is the smallest such integer.' },
            { input: 'n = 13', output: '-1', explanation: 'Prime number greater than 9 cannot be represented as product of single digits.' }
        ],
        constraints: ['1 <= n <= 10^9'],
        testCases: [
            { input: '{"n":36}', expectedOutput: '49', isHidden: false },
            { input: '{"n":13}', expectedOutput: '-1', isHidden: false },
            { input: '{"n":100}', expectedOutput: '455', isHidden: true },
            { input: '{"n":7}', expectedOutput: '7', isHidden: true }
        ],
        hints: ['Greedily extract the largest single digits (from 9 down to 2) dividing n.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS Digital Technical Round',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent question in TCS Digital 7 LPA track technical coding tests.',
        explanation: 'If n < 10, return n. Otherwise greedily divide by digits 9 down to 2, appending them to a list. If n > 1 after divisions, return -1.',
        active: true
    },
    {
        questionId: 'TCS-CODING-004',
        title: 'Minimum Jumps to Reach End of Array',
        slug: 'tcs-minimum-jumps-to-reach-end',
        company: 'TCS',
        difficulty: 'Medium',
        topics: ['Dynamic Programming', 'Greedy', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of non-negative integers `nums`, you are initially positioned at the first index. Each element represents your maximum jump length at that position. Return the minimum number of jumps to reach the last index. If unreachable, return `-1`.',
        functionSignature: {
            name: 'minJumps',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function minJumps(nums) {\n    // Write your code here\n    \n}',
            python: 'def minJumps(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int minJumps(int[] nums) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minJumps(vector<int>& nums) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'nums = [2, 3, 1, 1, 4]', output: '2', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
            { input: 'nums = [1, 0, 1]', output: '-1', explanation: 'Cannot jump past index 1.' }
        ],
        constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 1000'],
        testCases: [
            { input: '{"nums":[2, 3, 1, 1, 4]}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[1, 0, 1]}', expectedOutput: '-1', isHidden: false },
            { input: '{"nums":[0]}', expectedOutput: '0', isHidden: true },
            { input: '{"nums":[1, 2, 0, 1, 4]}', expectedOutput: '3', isHidden: true }
        ],
        hints: ['Use BFS or Greedy tracking current boundary and maximum reachable index.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS Prime Campus Assessment',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in TCS Prime 9 LPA coding round evaluation.',
        explanation: 'Track the farthest point reachable within the current jump window. When reaching the end of the window, increment jump count and update window.',
        active: true
    },
    {
        questionId: 'TCS-CODING-005',
        title: 'Pairs with Given Absolute Difference',
        slug: 'tcs-pairs-with-given-difference',
        company: 'TCS',
        difficulty: 'Easy',
        topics: ['Two Pointers', 'Hashing', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of integers `nums` and an integer `k`, return the count of distinct pairs `(nums[i], nums[j])` such that `nums[i] - nums[j] == k` and `i != j`.',
        functionSignature: {
            name: 'countPairsWithDifference',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function countPairsWithDifference(nums, k) {\n    // Write your code here\n    \n}',
            python: 'def countPairsWithDifference(nums: list[int], k: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int countPairsWithDifference(int[] nums, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countPairsWithDifference(vector<int>& nums, int k) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 5, 3, 4, 2], k = 2', output: '3', explanation: 'Pairs with difference 2: (3,1), (4,2), (5,3).' },
            { input: 'nums = [8, 12, 16, 4, 0, 20], k = 4', output: '5', explanation: '5 matching pairs.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '0 <= k <= 10^5', '0 <= nums[i] <= 10^6'],
        testCases: [
            { input: '{"nums":[1, 5, 3, 4, 2],"k":2}', expectedOutput: '3', isHidden: false },
            { input: '{"nums":[8, 12, 16, 4, 0, 20],"k":4}', expectedOutput: '5', isHidden: false },
            { input: '{"nums":[1, 1, 1, 2],"k":1}', expectedOutput: '1', isHidden: true }
        ],
        hints: ['Store unique values in a Hash Set to query target (x - k) in O(1) time.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS NQT National Qualifier Slot 2',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2024,
        reportedDate: 'Nov 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in TCS NQT 2024 placement screening paper.',
        explanation: 'Insert all unique numbers into a Set. For each element x in the set, check if (x - k) is also in the set.',
        active: true
    },
    {
        questionId: 'TCS-CODING-006',
        title: 'Move Zeros to Array End Preserving Order',
        slug: 'tcs-move-zeros-to-end',
        company: 'TCS',
        difficulty: 'Easy',
        topics: ['Arrays', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements. Return the modified array.',
        functionSignature: {
            name: 'moveZeros',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function moveZeros(nums) {\n    // Write your code here\n    \n}',
            python: 'def moveZeros(nums: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int moveZeros(int[] nums) {\n        // Write your code here\n        return nums;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> moveZeros(vector<int>& nums) {\n        // Write your code here\n        return nums;\n    }\n};'
        },
        examples: [
            { input: 'nums = [0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]', explanation: 'Non-zero order preserved at front.' },
            { input: 'nums = [0, 0, 1]', output: '[1, 0, 0]', explanation: 'Single 1 moved to front.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
            { input: '{"nums":[0, 1, 0, 3, 12]}', expectedOutput: '[1,3,12,0,0]', isHidden: false },
            { input: '{"nums":[0, 0, 1]}', expectedOutput: '[1,0,0]', isHidden: false },
            { input: '{"nums":[4, 5, 6]}', expectedOutput: '[4,5,6]', isHidden: true }
        ],
        hints: ['Maintain an insert pointer for the next non-zero element position.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS Ninja Coding Assessment',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Classic TCS Foundation coding question asked in multiple 2025 batches.',
        explanation: 'Use a slow pointer writeIdx to track where the next non-zero element should be placed, then fill remaining slots with zero.',
        active: true
    },
    {
        questionId: 'TCS-CODING-007',
        title: 'Check if Subarray with Zero Sum Exists',
        slug: 'tcs-subarray-with-zero-sum',
        company: 'TCS',
        difficulty: 'Medium',
        topics: ['Hashing', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of integers `nums`, return `true` if there is a non-empty subarray with a sum equal to `0`, otherwise return `false`.',
        functionSignature: {
            name: 'hasZeroSumSubarray',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function hasZeroSumSubarray(nums) {\n    // Write your code here\n    \n}',
            python: 'def hasZeroSumSubarray(nums: list[int]) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean hasZeroSumSubarray(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool hasZeroSumSubarray(vector<int>& nums) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'nums = [4, 2, -3, 1, 6]', output: 'true', explanation: 'Subarray [2, -3, 1] sums to 0.' },
            { input: 'nums = [1, 2, 3]', output: 'false', explanation: 'No subarray sums to 0.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
            { input: '{"nums":[4, 2, -3, 1, 6]}', expectedOutput: 'true', isHidden: false },
            { input: '{"nums":[1, 2, 3]}', expectedOutput: 'false', isHidden: false },
            { input: '{"nums":[0]}', expectedOutput: 'true', isHidden: true },
            { input: '{"nums":[-1, 1]}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['If prefix sum repeats, the subarray between those occurrences sums to 0.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS NQT Advanced Technical Track',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2024,
        reportedDate: 'Dec 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in TCS National Placement Drive 2024.',
        explanation: 'Keep a hash set of prefix sums. If running sum becomes 0 or is already in the set, a zero-sum subarray exists.',
        active: true
    },
    {
        questionId: 'TCS-CODING-008',
        title: 'Word Frequency in a Cleaned Sentence',
        slug: 'tcs-word-frequency-cleaned-sentence',
        company: 'TCS',
        difficulty: 'Easy',
        topics: ['Strings', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a sentence string `sentence` and a target word `target`, return the frequency of `target` in `sentence`. The search should be case-insensitive, and punctuation marks should be ignored.',
        functionSignature: {
            name: 'countWordFrequency',
            params: [
                { name: 'sentence', type: 'string' },
                { name: 'target', type: 'string' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function countWordFrequency(sentence, target) {\n    // Write your code here\n    \n}',
            python: 'def countWordFrequency(sentence: str, target: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int countWordFrequency(String sentence, String target) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countWordFrequency(string sentence, string target) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'sentence = "The dog chased the cat, and the dog barked.", target = "the"', output: '3', explanation: '"the" appears 3 times.' },
            { input: 'sentence = "Hello world!", target = "world"', output: '1', explanation: '"world" appears once ignoring exclamation.' }
        ],
        constraints: ['1 <= sentence.length <= 10^5', '1 <= target.length <= 50'],
        testCases: [
            { input: '{"sentence":"The dog chased the cat, and the dog barked.","target":"the"}', expectedOutput: '3', isHidden: false },
            { input: '{"sentence":"Hello world!","target":"world"}', expectedOutput: '1', isHidden: false },
            { input: '{"sentence":"Data data DATA, datum!","target":"data"}', expectedOutput: '3', isHidden: true }
        ],
        hints: ['Convert sentence to lowercase and replace punctuation with spaces before splitting.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS NQT Slot 3 Placement',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2023,
        reportedDate: 'Nov 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Documented in TCS NQT 2023 interview archives.',
        explanation: 'Clean punctuation, convert both sentence and target to lowercase, split on whitespace, and count matches.',
        active: true
    },
    {
        questionId: 'TCS-CODING-009',
        title: 'Super ASCII String Checker',
        slug: 'tcs-super-ascii-string-checker',
        company: 'TCS',
        difficulty: 'Easy',
        topics: ['Strings', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'A string is called a Super ASCII string if the frequency of every character equals its 1-indexed alphabetical position (i.e., \'a\' must appear 1 time, \'b\' must appear 2 times, etc.). Given a lowercase string `s`, return `true` if it is a Super ASCII string, otherwise `false`.',
        functionSignature: {
            name: 'isSuperAscii',
            params: [{ name: 's', type: 'string' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isSuperAscii(s) {\n    // Write your code here\n    \n}',
            python: 'def isSuperAscii(s: str) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isSuperAscii(String s) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isSuperAscii(string s) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 's = "bba"', output: 'true', explanation: '\'a\' appears 1 time (pos 1), \'b\' appears 2 times (pos 2).' },
            { input: 's = "abc"', output: 'false', explanation: '\'b\' appears 1 time instead of 2.' }
        ],
        constraints: ['1 <= s.length <= 1000', 's contains lowercase English letters only.'],
        testCases: [
            { input: '{"s":"bba"}', expectedOutput: 'true', isHidden: false },
            { input: '{"s":"abc"}', expectedOutput: 'false', isHidden: false },
            { input: '{"s":"cccbbba"}', expectedOutput: 'false', isHidden: true }
        ],
        hints: ['Count character occurrences using frequency array, then verify freq == (char - 96).'],
        sourceType: 'pattern_based',
        sourceName: 'TCS NQT Syllabus Pattern',
        sourceUrl: 'https://learning.tcsionhub.in/',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Pattern based on recurring TCS ASCII manipulation problem types.',
        explanation: 'Compute frequency of all present characters. For each present character c, verify count equals charCodeAt - 96.',
        active: true
    },
    {
        questionId: 'TCS-CODING-010',
        title: 'Maximum Circular Subarray Sum',
        slug: 'tcs-maximum-circular-subarray-sum',
        company: 'TCS',
        difficulty: 'Hard',
        topics: ['Dynamic Programming', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a circular integer array `nums` of length `n`, return the maximum possible sum of a non-empty subarray of `nums`. A circular array means the end of the array connects to the beginning.',
        functionSignature: {
            name: 'maxSubarraySumCircular',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function maxSubarraySumCircular(nums) {\n    // Write your code here\n    \n}',
            python: 'def maxSubarraySumCircular(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int maxSubarraySumCircular(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubarraySumCircular(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, -2, 3, -2]', output: '3', explanation: 'Subarray [3] has maximum sum 3.' },
            { input: 'nums = [5, -3, 5]', output: '10', explanation: 'Subarray [5, 5] has maximum sum 5 + 5 = 10.' }
        ],
        constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4'],
        testCases: [
            { input: '{"nums":[1, -2, 3, -2]}', expectedOutput: '3', isHidden: false },
            { input: '{"nums":[5, -3, 5]}', expectedOutput: '10', isHidden: false },
            { input: '{"nums":[-3, -2, -3]}', expectedOutput: '-2', isHidden: true }
        ],
        hints: ['Use Kadane on normal array for max, and totalSum - minSubarray for circular wrap.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS Digital Advanced Programming Slot',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Featured in TCS Digital 2025 Advanced Coding assessment.',
        explanation: 'Max circular subarray sum is max(normal Kadane max, totalSum - minimum subarray sum), handling all-negative edge case.',
        active: true
    },
    {
        questionId: 'TCS-CODING-011',
        title: 'Length of Longest Palindromic Substring',
        slug: 'tcs-length-longest-palindromic-substring',
        company: 'TCS',
        difficulty: 'Medium',
        topics: ['Strings', 'Dynamic Programming', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a string `s`, return the length of the longest palindromic substring in `s`.',
        functionSignature: {
            name: 'longestPalindromeLength',
            params: [{ name: 's', type: 'string' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function longestPalindromeLength(s) {\n    // Write your code here\n    \n}',
            python: 'def longestPalindromeLength(s: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int longestPalindromeLength(String s) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int longestPalindromeLength(string s) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 's = "babad"', output: '3', explanation: '"bab" or "aba" has length 3.' },
            { input: 's = "cbbd"', output: '2', explanation: '"bb" has length 2.' }
        ],
        constraints: ['1 <= s.length <= 1000', 's consists of English letters and digits.'],
        testCases: [
            { input: '{"s":"babad"}', expectedOutput: '3', isHidden: false },
            { input: '{"s":"cbbd"}', expectedOutput: '2', isHidden: false },
            { input: '{"s":"a"}', expectedOutput: '1', isHidden: true },
            { input: '{"s":"racecar"}', expectedOutput: '7', isHidden: true }
        ],
        hints: ['Expand around potential odd and even palindrome centers.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'TCS Digital Technical Screening',
        sourceUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
        reportedYear: 2024,
        reportedDate: 'Sep 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in TCS Digital 2024 On-Campus hiring drive.',
        explanation: 'Expand outward from each index i (odd center) and (i, i+1) (even center) to find maximum palindrome span.',
        active: true
    },

    // --- DELOITTE ---
    {
        questionId: 'DEL-CODING-001',
        title: 'Subarrays with Sum Divisible by K',
        slug: 'del-subarrays-sum-divisible-k',
        company: 'Deloitte',
        difficulty: 'Medium',
        topics: ['Hashing', 'Mathematics', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums` and an integer `k`, return the number of non-empty subarrays that have a sum divisible by `k`.',
        functionSignature: {
            name: 'subarraysDivByK',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function subarraysDivByK(nums, k) {\n    // Write your code here\n    \n}',
            python: 'def subarraysDivByK(nums: list[int], k: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int subarraysDivByK(int[] nums, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int subarraysDivByK(vector<int>& nums, int k) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [4, 5, 0, -2, -3, 1], k = 5', output: '7', explanation: 'There are 7 subarrays with sum divisible by 5.' },
            { input: 'nums = [5], k = 9', output: '0', explanation: 'No subarray divisible by 9.' }
        ],
        constraints: ['1 <= nums.length <= 3 * 10^4', '-10^4 <= nums[i] <= 10^4', '2 <= k <= 10^4'],
        testCases: [
            { input: '{"nums":[4, 5, 0, -2, -3, 1],"k":5}', expectedOutput: '7', isHidden: false },
            { input: '{"nums":[5],"k":9}', expectedOutput: '0', isHidden: false },
            { input: '{"nums":[-1, 2, 9],"k":2}', expectedOutput: '2', isHidden: true }
        ],
        hints: ['Use modulo on prefix sums: if two prefix sums have the same remainder modulo k, the subarray between them is divisible by k.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte National Level Assessment (NLA)',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Deloitte USI 2025 Campus Hiring Coding Section.',
        explanation: 'Store frequency of prefix sum remainder modulo k in a hash map, normalizing negative remainders.',
        active: true
    },
    {
        questionId: 'DEL-CODING-002',
        title: 'Rotate Array to Right by K Steps',
        slug: 'del-rotate-array-k-steps',
        company: 'Deloitte',
        difficulty: 'Easy',
        topics: ['Arrays', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative. Return the rotated array.',
        functionSignature: {
            name: 'rotateArray',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function rotateArray(nums, k) {\n    // Write your code here\n    \n}',
            python: 'def rotateArray(nums: list[int], k: int) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] rotateArray(int[] nums, int k) {\n        // Write your code here\n        return nums;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int rotateArray(vector<int>& nums, int k) {\n        // Write your code here\n        return nums;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 2, 3, 4, 5, 6, 7], k = 3', output: '[5, 6, 7, 1, 2, 3, 4]', explanation: 'Rotated 3 steps to the right.' },
            { input: 'nums = [-1, -100, 3, 99], k = 2', output: '[3, 99, -1, -100]', explanation: 'Rotated 2 steps.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '0 <= k <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
        testCases: [
            { input: '{"nums":[1, 2, 3, 4, 5, 6, 7],"k":3}', expectedOutput: '[5,6,7,1,2,3,4]', isHidden: false },
            { input: '{"nums":[-1, -100, 3, 99],"k":2}', expectedOutput: '[3,99,-1,-100]', isHidden: false },
            { input: '{"nums":[1, 2],"k":0}', expectedOutput: '[1,2]', isHidden: true }
        ],
        hints: ['Reverse entire array, then reverse first k elements, then reverse remaining.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte Tech Screening Paper',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent question in Deloitte Analyst Technical Round.',
        explanation: 'Normalize k = k % n, reverse entire array, reverse [0, k-1], reverse [k, n-1].',
        active: true
    },
    {
        questionId: 'DEL-CODING-003',
        title: 'Next Greater Element in Array',
        slug: 'del-next-greater-element',
        company: 'Deloitte',
        difficulty: 'Medium',
        topics: ['Stack', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `nums`, return an array `res` where `res[i]` is the next greater element to the right of `nums[i]`. If no greater element exists, set `res[i] = -1`.',
        functionSignature: {
            name: 'nextGreaterElements',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function nextGreaterElements(nums) {\n    // Write your code here\n    \n}',
            python: 'def nextGreaterElements(nums: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int nextGreaterElements(int[] nums) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> nextGreaterElements(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums = [4, 5, 2, 25]', output: '[5, 25, 25, -1]', explanation: 'Next greater elements to the right.' },
            { input: 'nums = [13, 7, 6, 12]', output: '[-1, 12, 12, -1]', explanation: 'For 13 no greater element exists.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
            { input: '{"nums":[4, 5, 2, 25]}', expectedOutput: '[5,25,25,-1]', isHidden: false },
            { input: '{"nums":[13, 7, 6, 12]}', expectedOutput: '[-1,12,12,-1]', isHidden: false },
            { input: '{"nums":[1]}', expectedOutput: '[-1]', isHidden: true }
        ],
        hints: ['Traverse backwards using a monotonic stack to store potential greater elements.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte USI NLA Technical Assessment',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2025,
        reportedDate: 'Feb 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Deloitte USI 2025 early career tech assessments.',
        explanation: 'Use a stack from right to left, popping elements smaller than or equal to current value.',
        active: true
    },
    {
        questionId: 'DEL-CODING-004',
        title: 'Longest Consecutive Sequence Length',
        slug: 'del-longest-consecutive-sequence',
        company: 'Deloitte',
        difficulty: 'Medium',
        topics: ['Hashing', 'Arrays'],
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
            { input: 'nums = [100, 4, 200, 1, 3, 2]', output: '4', explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4], length 4.' },
            { input: 'nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]', output: '9', explanation: 'Sequence [0..8] has length 9.' }
        ],
        constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
            { input: '{"nums":[100, 4, 200, 1, 3, 2]}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]}', expectedOutput: '9', isHidden: false },
            { input: '{"nums":[]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Store in Set. Only start counting sequence if (num - 1) is NOT in the set.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte Tech Assessment NLA',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2024,
        reportedDate: 'Nov 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Deloitte campus placement 2024.',
        explanation: 'Add all numbers to a Set. For each num where (num - 1) is not in set, count forward consecutive elements in O(n) total time.',
        active: true
    },
    {
        questionId: 'DEL-CODING-005',
        title: 'First Non-Repeating Character Index',
        slug: 'del-first-non-repeating-character',
        company: 'Deloitte',
        difficulty: 'Easy',
        topics: ['Strings', 'Queue', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.',
        functionSignature: {
            name: 'firstUniqChar',
            params: [{ name: 's', type: 'string' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function firstUniqChar(s) {\n    // Write your code here\n    \n}',
            python: 'def firstUniqChar(s: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int firstUniqChar(String s) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int firstUniqChar(string s) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 's = "deloitte"', output: '0', explanation: '\'d\' is non-repeating at index 0.' },
            { input: 's = "loveleetcode"', output: '2', explanation: '\'v\' is first unique at index 2.' }
        ],
        constraints: ['1 <= s.length <= 10^5', 's consists of only lowercase English letters.'],
        testCases: [
            { input: '{"s":"deloitte"}', expectedOutput: '0', isHidden: false },
            { input: '{"s":"loveleetcode"}', expectedOutput: '2', isHidden: false },
            { input: '{"s":"aabb"}', expectedOutput: '-1', isHidden: true }
        ],
        hints: ['Use frequency map in pass 1, find first character with frequency 1 in pass 2.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte Campus Interview',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent warm-up question in Deloitte round 1 technical interview.',
        explanation: 'Two passes: pass 1 counts character frequencies in a map/array of size 26; pass 2 returns the first index with count == 1.',
        active: true
    },
    {
        questionId: 'DEL-CODING-006',
        title: 'Product of Array Except Self',
        slug: 'del-product-of-array-except-self',
        company: 'Deloitte',
        difficulty: 'Medium',
        topics: ['Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. Solve it without division and in `O(n)` time.',
        functionSignature: {
            name: 'productExceptSelf',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function productExceptSelf(nums) {\n    // Write your code here\n    \n}',
            python: 'def productExceptSelf(nums: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int productExceptSelf(int[] nums) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 2, 3, 4]', output: '[24, 12, 8, 6]', explanation: 'Product of elements excluding each index.' },
            { input: 'nums = [-1, 1, 0, -3, 3]', output: '[0, 0, 9, 0, 0]', explanation: 'Elements with zero product.' }
        ],
        constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
        testCases: [
            { input: '{"nums":[1, 2, 3, 4]}', expectedOutput: '[24,12,8,6]', isHidden: false },
            { input: '{"nums":[-1, 1, 0, -3, 3]}', expectedOutput: '[0,0,9,0,0]', isHidden: false },
            { input: '{"nums":[2, 3]}', expectedOutput: '[3,2]', isHidden: true }
        ],
        hints: ['Compute prefix products into result array, then traverse backwards multiplying suffix products.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte USI Senior Analyst Assessment',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Deloitte USI 2025 campus technical round.',
        explanation: 'Compute prefix products in output array left-to-right, then multiply by running suffix product right-to-left.',
        active: true
    },
    {
        questionId: 'DEL-CODING-007',
        title: 'Ways to Climb Stairs (1 or 2 Steps)',
        slug: 'del-climb-stairs-ways',
        company: 'Deloitte',
        difficulty: 'Easy',
        topics: ['Dynamic Programming', 'Recursion'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
        functionSignature: {
            name: 'climbStairs',
            params: [{ name: 'n', type: 'number' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function climbStairs(n) {\n    // Write your code here\n    \n}',
            python: 'def climbStairs(n: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'n = 2', output: '2', explanation: '1+1 or 2.' },
            { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' }
        ],
        constraints: ['1 <= n <= 45'],
        testCases: [
            { input: '{"n":2}', expectedOutput: '2', isHidden: false },
            { input: '{"n":3}', expectedOutput: '3', isHidden: false },
            { input: '{"n":5}', expectedOutput: '8', isHidden: true }
        ],
        hints: ['dp[i] = dp[i-1] + dp[i-2], equivalent to Fibonacci numbers.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte Technical Round',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2023,
        reportedDate: 'Dec 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Standard basic DP question in Deloitte candidate interviews.',
        explanation: 'Recognize DP recurrence ways(n) = ways(n-1) + ways(n-2) with base cases 1 and 2.',
        active: true
    },
    {
        questionId: 'DEL-CODING-008',
        title: 'Square Matrix Diagonal Absolute Difference',
        slug: 'del-matrix-diagonal-difference',
        company: 'Deloitte',
        difficulty: 'Easy',
        topics: ['Arrays', 'Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a square 2D matrix of integers `arr`, calculate the absolute difference between the sums of its diagonals.',
        functionSignature: {
            name: 'diagonalDifference',
            params: [{ name: 'arr', type: 'number[][]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function diagonalDifference(arr) {\n    // Write your code here\n    \n}',
            python: 'def diagonalDifference(arr: list[list[int]]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int diagonalDifference(int[][] arr) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int diagonalDifference(vector<vector<int>>& arr) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'arr = [[1, 2, 3], [4, 5, 6], [9, 8, 9]]', output: '2', explanation: 'Primary: 1+5+9 = 15. Secondary: 3+5+9 = 17. |15 - 17| = 2.' },
            { input: 'arr = [[11, 2, 4], [4, 5, 6], [10, 8, -12]]', output: '15', explanation: 'Primary: 11+5-12 = 4. Secondary: 4+5+10 = 19. |4 - 19| = 15.' }
        ],
        constraints: ['1 <= arr.length <= 100', 'arr[i].length == arr.length', '-100 <= arr[i][j] <= 100'],
        testCases: [
            { input: '{"arr":[[1, 2, 3], [4, 5, 6], [9, 8, 9]]}', expectedOutput: '2', isHidden: false },
            { input: '{"arr":[[11, 2, 4], [4, 5, 6], [10, 8, -12]]}', expectedOutput: '15', isHidden: false },
            { input: '{"arr":[[5]]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Traverse row i: primary is arr[i][i], secondary is arr[i][n - 1 - i].'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte Tech Assessment',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2024,
        reportedDate: 'Jul 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent matrix test question in Deloitte NLA.',
        explanation: 'Iterate i from 0 to n-1, adding arr[i][i] to sum1 and arr[i][n - 1 - i] to sum2, return Math.abs(sum1 - sum2).',
        active: true
    },
    {
        questionId: 'DEL-CODING-009',
        title: 'Minimum Changes to Make Strings Anagrams',
        slug: 'del-min-changes-make-anagram',
        company: 'Deloitte',
        difficulty: 'Medium',
        topics: ['Strings', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are given two strings `s` and `t` of the same length. Return the minimum number of steps to make `t` an anagram of `s`. In one step you can replace any character of `t` with another character.',
        functionSignature: {
            name: 'minSteps',
            params: [
                { name: 's', type: 'string' },
                { name: 't', type: 'string' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function minSteps(s, t) {\n    // Write your code here\n    \n}',
            python: 'def minSteps(s: str, t: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int minSteps(String s, String t) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minSteps(string s, string t) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 's = "bab", t = "aba"', output: '1', explanation: 'Replace 1 \'a\' in t with \'b\' to make "bba".' },
            { input: 's = "leetcode", t = "practice"', output: '5', explanation: '5 character replacements required.' }
        ],
        constraints: ['1 <= s.length <= 5 * 10^4', 's.length == t.length', 's and t consist of lowercase English letters.'],
        testCases: [
            { input: '{"s":"bab","t":"aba"}', expectedOutput: '1', isHidden: false },
            { input: '{"s":"leetcode","t":"practice"}', expectedOutput: '5', isHidden: false },
            { input: '{"s":"anagram","t":"mangaar"}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Compute character counts of both strings and sum positive differences.'],
        sourceType: 'pattern_based',
        sourceName: 'Deloitte Assessment Pattern',
        sourceUrl: 'https://www2.deloitte.com/',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Pattern based on recurring Deloitte string count frequency questions.',
        explanation: 'Count frequency of each character in s and t. Sum differences where count in s exceeds count in t.',
        active: true
    },
    {
        questionId: 'DEL-CODING-010',
        title: 'Find Missing Number in 0 to N Range',
        slug: 'del-missing-number-range',
        company: 'Deloitte',
        difficulty: 'Easy',
        topics: ['Searching', 'Mathematics', 'Bit Manipulation'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.',
        functionSignature: {
            name: 'missingNumber',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function missingNumber(nums) {\n    // Write your code here\n    \n}',
            python: 'def missingNumber(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int missingNumber(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [3, 0, 1]', output: '2', explanation: 'n = 3, since there are 3 numbers, so all numbers are in the range [0,3]. 2 is missing.' },
            { input: 'nums = [0, 1]', output: '2', explanation: 'n = 2, 2 is missing.' }
        ],
        constraints: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All numbers in nums are unique.'],
        testCases: [
            { input: '{"nums":[3, 0, 1]}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[0, 1]}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[9,6,4,2,3,5,7,0,1]}', expectedOutput: '8', isHidden: true }
        ],
        hints: ['Use sum formula n*(n+1)/2 or XOR all numbers and indices.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte Tech Assessment',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Deloitte 2024 campus technical tests.',
        explanation: 'Total expected sum is n * (n + 1) / 2. Missing number is expected sum minus actual array sum.',
        active: true
    },
    {
        questionId: 'DEL-CODING-011',
        title: 'Word Break String Segmentation',
        slug: 'del-word-break-segmentation',
        company: 'Deloitte',
        difficulty: 'Hard',
        topics: ['Dynamic Programming', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.',
        functionSignature: {
            name: 'wordBreak',
            params: [
                { name: 's', type: 'string' },
                { name: 'wordDict', type: 'string[]' }
            ],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function wordBreak(s, wordDict) {\n    // Write your code here\n    \n}',
            python: 'def wordBreak(s: str, wordDict: list[str]) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool wordBreak(string s, vector<string>& wordDict) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 's = "deloitte", wordDict = ["del", "o", "itte"]', output: 'true', explanation: 'Can be segmented as "del o itte".' },
            { input: 's = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]', output: 'false', explanation: 'Cannot be segmented.' }
        ],
        constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', '1 <= wordDict[i].length <= 20'],
        testCases: [
            { input: '{"s":"deloitte","wordDict":["del", "o", "itte"]}', expectedOutput: 'true', isHidden: false },
            { input: '{"s":"catsandog","wordDict":["cats", "dog", "sand", "and", "cat"]}', expectedOutput: 'false', isHidden: false },
            { input: '{"s":"applepenapple","wordDict":["apple", "pen"]}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['dp[i] represents if s[0..i] can be segmented using dictionary words.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Deloitte USI Senior Track Assessment',
        sourceUrl: 'https://www2.deloitte.com/in/en/careers.html',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Deloitte USI 2025 advanced technical assessment.',
        explanation: 'dp[i] is true if there exists j < i such that dp[j] is true and s[j..i] is in the word set.',
        active: true
    },

    // --- ACCENTURE ---
    {
        questionId: 'ACC-CODING-001',
        title: 'Binary String Operations Evaluator',
        slug: 'acc-binary-string-operations-evaluator',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Strings', 'Bit Manipulation'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a binary string `str` where characters are \'0\', \'1\', \'A\' (AND), \'B\' (OR), and \'C\' (XOR), evaluate the operations from left to right and return the final integer result (0 or 1). If `str` is empty or null, return `-1`.',
        functionSignature: {
            name: 'operationsBinaryString',
            params: [{ name: 'str', type: 'string' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function operationsBinaryString(str) {\n    // Write your code here\n    \n}',
            python: 'def operationsBinaryString(str: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int operationsBinaryString(String str) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int operationsBinaryString(string str) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'str = "1C0C1C1A0B1"', output: '1', explanation: '1 XOR 0 = 1; 1 XOR 1 = 0; 0 XOR 1 = 1; 1 AND 0 = 0; 0 OR 1 = 1.' },
            { input: 'str = "0C1A1B1C1C1B0A1"', output: '0', explanation: 'Evaluates to 0.' }
        ],
        constraints: ['1 <= str.length <= 10^4', 'Length of str is odd, alternating between digits and operations.'],
        testCases: [
            { input: '{"str":"1C0C1C1A0B1"}', expectedOutput: '1', isHidden: false },
            { input: '{"str":"0C1A1B1C1C1B0A1"}', expectedOutput: '0', isHidden: false },
            { input: '{"str":""}', expectedOutput: '-1', isHidden: true },
            { input: '{"str":"1A0"}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Initialize result with first digit. Iterate by step 2 reading operator and next digit.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Accenture National Coding Round',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Classic signature question asked in Accenture ASE/FSE placement drives across India.',
        explanation: 'Start with res = Number(str[0]). Loop i from 1 to str.length-1 by 2: if str[i]==\'A\', res &= next; if \'B\', res |= next; if \'C\', res ^= next.',
        active: true
    },
    {
        questionId: 'ACC-CODING-002',
        title: 'Rats and Food Sufficiency Calculation',
        slug: 'acc-rats-and-food-sufficiency',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Arrays', 'Greedy'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: '`r` rats are present in an area, and each rat consumes `unit` amount of food. An array `arr` represents food packages in consecutive houses. Return the minimum number of houses needed from left to right to satisfy all rats. If total food in all houses is insufficient, return `0`. If array is empty, return `-1`.',
        functionSignature: {
            name: 'calculateHouses',
            params: [
                { name: 'r', type: 'number' },
                { name: 'unit', type: 'number' },
                { name: 'arr', type: 'number[]' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function calculateHouses(r, unit, arr) {\n    // Write your code here\n    \n}',
            python: 'def calculateHouses(r: int, unit: int, arr: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int calculateHouses(int r, int unit, int[] arr) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int calculateHouses(int r, int unit, vector<int>& arr) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'r = 7, unit = 2, arr = [2, 8, 3, 5, 7, 4, 1, 2]', output: '4', explanation: 'Total food required = 7 * 2 = 14. Houses: 2 + 8 + 3 + 5 = 18 >= 14, requiring 4 houses.' },
            { input: 'r = 10, unit = 5, arr = [1, 2, 3]', output: '0', explanation: 'Total food 6 < 50, so return 0.' }
        ],
        constraints: ['0 <= r, unit <= 1000', '0 <= arr.length <= 10^4'],
        testCases: [
            { input: '{"r":7,"unit":2,"arr":[2, 8, 3, 5, 7, 4, 1, 2]}', expectedOutput: '4', isHidden: false },
            { input: '{"r":10,"unit":5,"arr":[1, 2, 3]}', expectedOutput: '0', isHidden: false },
            { input: '{"r":2,"unit":2,"arr":[]}', expectedOutput: '-1', isHidden: true }
        ],
        hints: ['Calculate total needed = r * unit, then iterate sum until sum >= needed.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Accenture Technical Assessment Slot 1',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: 2025,
        reportedDate: 'Feb 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Signature Accenture problem reported in 2025 on-campus drives.',
        explanation: 'Check if array is null/empty (-1). Calculate required = r * unit. Accumulate food; return house count when accumulated >= required, or 0 if loop ends.',
        active: true
    },
    {
        questionId: 'ACC-CODING-003',
        title: 'Password Strength Validator Rules',
        slug: 'acc-password-strength-validator',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a password string `str` of length `n`, return `1` if it satisfies all of the following conditions, otherwise return `0`:\n1. Length >= 4\n2. At least one numeric digit\n3. At least one uppercase letter\n4. Must not contain space (\' \') or slash (\'/\')\n5. Starting character must not be a digit.',
        functionSignature: {
            name: 'checkPassword',
            params: [{ name: 'str', type: 'string' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function checkPassword(str) {\n    // Write your code here\n    \n}',
            python: 'def checkPassword(str: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int checkPassword(String str) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int checkPassword(string str) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'str = "aA1_67"', output: '1', explanation: 'Satisfies all 5 conditions.' },
            { input: 'str = "a9"', output: '0', explanation: 'Length is less than 4.' }
        ],
        constraints: ['0 <= str.length <= 1000'],
        testCases: [
            { input: '{"str":"aA1_67"}', expectedOutput: '1', isHidden: false },
            { input: '{"str":"a9"}', expectedOutput: '0', isHidden: false },
            { input: '{"str":"1aA_67"}', expectedOutput: '0', isHidden: true },
            { input: '{"str":"Abc 123"}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Check length, first char is digit, then iterate checking uppercase, digits, spaces, and slashes.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Accenture On-Campus Placement Test',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent question in Accenture 4.5 LPA and 6.5 LPA coding tests.',
        explanation: 'Validate length >= 4, first character not a digit, contains at least one digit and one uppercase letter, and no spaces or slashes.',
        active: true
    },
    {
        questionId: 'ACC-CODING-004',
        title: 'Large Small Sum from Odd and Even Positions',
        slug: 'acc-large-small-sum',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Arrays', 'Sorting'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `arr`, return the sum of the second largest element from the even positions (0-indexed) and the second smallest element from the odd positions. If array length is 3 or less, return `0`.',
        functionSignature: {
            name: 'largeSmallSum',
            params: [{ name: 'arr', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function largeSmallSum(arr) {\n    // Write your code here\n    \n}',
            python: 'def largeSmallSum(arr: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int largeSmallSum(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int largeSmallSum(vector<int>& arr) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'arr = [3, 2, 1, 7, 5, 4]', output: '7', explanation: 'Even positions: [3, 1, 5] -> 2nd largest is 3. Odd positions: [2, 7, 4] -> 2nd smallest is 4. Sum = 3 + 4 = 7.' },
            { input: 'arr = [1, 8, 0, 2, 3, 5, 6]', output: '8', explanation: 'Even: [1, 0, 3, 6] -> 2nd largest is 3. Odd: [8, 2, 5] -> 2nd smallest is 5. Sum = 3 + 5 = 8.' }
        ],
        constraints: ['0 <= arr.length <= 10^5'],
        testCases: [
            { input: '{"arr":[3, 2, 1, 7, 5, 4]}', expectedOutput: '7', isHidden: false },
            { input: '{"arr":[1, 8, 0, 2, 3, 5, 6]}', expectedOutput: '8', isHidden: false },
            { input: '{"arr":[1, 2, 3]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Separate elements into even-indexed and odd-indexed lists, sort them, and pick 2nd largest and 2nd smallest.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Accenture Assessment 2025',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Accenture 2025 campus test series.',
        explanation: 'If length <= 3 return 0. Extract elements at even indices and odd indices. Sort both lists; return second largest from even plus second smallest from odd.',
        active: true
    },
    {
        questionId: 'ACC-CODING-005',
        title: 'Difference of Divisible and Non-Divisible Sums',
        slug: 'acc-diff-divisible-non-divisible-sums',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given two integers `n` and `m`, calculate the difference between the sum of all integers from `1` to `m` that are not divisible by `n` and the sum of all integers from `1` to `m` that are divisible by `n`. Return `(sum_not_divisible - sum_divisible)`.',
        functionSignature: {
            name: 'differenceOfSum',
            params: [
                { name: 'n', type: 'number' },
                { name: 'm', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function differenceOfSum(n, m) {\n    // Write your code here\n    \n}',
            python: 'def differenceOfSum(n: int, m: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int differenceOfSum(int n, int m) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int differenceOfSum(int n, int m) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'n = 4, m = 20', output: '90', explanation: 'Divisible: 4+8+12+16+20 = 60. Non-divisible: 210 - 60 = 150. Difference: 150 - 60 = 90.' },
            { input: 'n = 3, m = 10', output: '19', explanation: 'Divisible: 3+6+9 = 18. Non-divisible: 55 - 18 = 37. Difference: 37 - 18 = 19.' }
        ],
        constraints: ['1 <= n, m <= 10^5'],
        testCases: [
            { input: '{"n":4,"m":20}', expectedOutput: '90', isHidden: false },
            { input: '{"n":3,"m":10}', expectedOutput: '19', isHidden: false },
            { input: '{"n":1,"m":5}', expectedOutput: '-15', isHidden: true }
        ],
        hints: ['Iterate i from 1 to m, accumulate into sum1 if i % n == 0 else sum2.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Accenture Placement Assessment',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: 2024,
        reportedDate: 'Sep 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent Accenture standard math question.',
        explanation: 'Loop 1 to m: sum_divisible += i if i % n == 0, else sum_not_divisible += i. Return (sum_not_divisible - sum_divisible).',
        active: true
    },
    {
        questionId: 'ACC-CODING-006',
        title: 'Count Number of Carry Operations in Addition',
        slug: 'acc-count-carry-operations',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given two positive integers `num1` and `num2`, count the number of carry operations that occur when adding `num1` and `num2` using standard column addition.',
        functionSignature: {
            name: 'numberOfCarries',
            params: [
                { name: 'num1', type: 'number' },
                { name: 'num2', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function numberOfCarries(num1, num2) {\n    // Write your code here\n    \n}',
            python: 'def numberOfCarries(num1: int, num2: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int numberOfCarries(int num1, int num2) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int numberOfCarries(int num1, int num2) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'num1 = 451, num2 = 349', output: '2', explanation: '1+9=10 (carry 1); 5+4+1=10 (carry 1); 4+3+1=8 (no carry). Total carries = 2.' },
            { input: 'num1 = 23, num2 = 563', output: '0', explanation: 'No addition produces sum >= 10.' }
        ],
        constraints: ['0 <= num1, num2 <= 10^9'],
        testCases: [
            { input: '{"num1":451,"num2":349}', expectedOutput: '2', isHidden: false },
            { input: '{"num1":23,"num2":563}', expectedOutput: '0', isHidden: false },
            { input: '{"num1":999,"num2":1}', expectedOutput: '3', isHidden: true }
        ],
        hints: ['Simulate digit-by-digit addition from right to left tracking carry = (d1 + d2 + carry) >= 10 ? 1 : 0.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Accenture Assessment 2024',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: 2024,
        reportedDate: 'Nov 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Accenture 2024 campus test papers.',
        explanation: 'Loop while num1 > 0 or num2 > 0 or carry > 0. Extract last digits, add with carry, if sum >= 10 increment carryCount and carry = 1 else carry = 0.',
        active: true
    },
    {
        questionId: 'ACC-CODING-007',
        title: 'Maximum Product Pair in Array',
        slug: 'acc-max-product-pair',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums`, return the maximum product of any two distinct elements in the array.',
        functionSignature: {
            name: 'maxProductPair',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function maxProductPair(nums) {\n    // Write your code here\n    \n}',
            python: 'def maxProductPair(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public long maxProductPair(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    long long maxProductPair(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 4, 3, 6, 7, 0]', output: '42', explanation: '7 * 6 = 42.' },
            { input: 'nums = [-10, -3, 5, 6, -2]', output: '30', explanation: '(-10) * (-3) = 30.' }
        ],
        constraints: ['2 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
            { input: '{"nums":[1, 4, 3, 6, 7, 0]}', expectedOutput: '42', isHidden: false },
            { input: '{"nums":[-10, -3, 5, 6, -2]}', expectedOutput: '30', isHidden: false },
            { input: '{"nums":[-5, -4]}', expectedOutput: '20', isHidden: true }
        ],
        hints: ['Check product of two largest numbers AND product of two most negative numbers.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Accenture Campus Drive',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: 2023,
        reportedDate: 'Dec 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Classic pair product question in Accenture assessments.',
        explanation: 'Max product is either product of two largest numbers or product of two smallest (most negative) numbers.',
        active: true
    },
    {
        questionId: 'ACC-CODING-008',
        title: 'Replace Specific Character in String',
        slug: 'acc-replace-character-in-string',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a string `s` and two characters `ch1` and `ch2`, replace all occurrences of `ch1` with `ch2` and all occurrences of `ch2` with `ch1` simultaneously in `s`. Return the modified string.',
        functionSignature: {
            name: 'replaceChar',
            params: [
                { name: 's', type: 'string' },
                { name: 'ch1', type: 'string' },
                { name: 'ch2', type: 'string' }
            ],
            returnType: 'string'
        },
        starterCode: {
            javascript: 'function replaceChar(s, ch1, ch2) {\n    // Write your code here\n    \n}',
            python: 'def replaceChar(s: str, ch1: str, ch2: str) -> str:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public String replaceChar(String s, char ch1, char ch2) {\n        // Write your code here\n        return s;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string replaceChar(string s, char ch1, char ch2) {\n        // Write your code here\n        return s;\n    }\n};'
        },
        examples: [
            { input: 's = "apples", ch1 = "a", ch2 = "p"', output: '"paales"', explanation: '\'a\' and \'p\' are swapped.' },
            { input: 's = "accenture", ch1 = "c", ch2 = "e"', output: '"aeeenturc"', explanation: '\'c\' becomes \'e\' and \'e\' becomes \'c\'.' }
        ],
        constraints: ['1 <= s.length <= 10^4', 'ch1 and ch2 are single characters.'],
        testCases: [
            { input: '{"s":"apples","ch1":"a","ch2":"p"}', expectedOutput: '"paales"', isHidden: false },
            { input: '{"s":"accenture","ch1":"c","ch2":"e"}', expectedOutput: '"aeeenturc"', isHidden: false },
            { input: '{"s":"hello","ch1":"l","ch2":"o"}', expectedOutput: '"heool"', isHidden: true }
        ],
        hints: ['Build the new string character by character comparing each character with ch1 and ch2.'],
        sourceType: 'pattern_based',
        sourceName: 'Accenture Assessment Pattern',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Pattern based on Accenture character substitution questions.',
        explanation: 'Iterate through string: if char is ch1 replace with ch2, else if char is ch2 replace with ch1, otherwise keep char.',
        active: true
    },
    {
        questionId: 'ACC-CODING-009',
        title: 'Count Leaders in an Array',
        slug: 'acc-count-array-leaders',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'An element of an array is called a leader if it is strictly greater than all elements to its right. The rightmost element is always a leader. Given an array `nums`, return the count of leaders in `nums`.',
        functionSignature: {
            name: 'countLeaders',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function countLeaders(nums) {\n    // Write your code here\n    \n}',
            python: 'def countLeaders(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int countLeaders(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countLeaders(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [16, 17, 4, 3, 5, 2]', output: '3', explanation: 'Leaders are 17, 5, 2. Count = 3.' },
            { input: 'nums = [1, 2, 3, 4, 5]', output: '1', explanation: 'Only 5 is a leader.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '0 <= nums[i] <= 10^6'],
        testCases: [
            { input: '{"nums":[16, 17, 4, 3, 5, 2]}', expectedOutput: '3', isHidden: false },
            { input: '{"nums":[1, 2, 3, 4, 5]}', expectedOutput: '1', isHidden: false },
            { input: '{"nums":[5, 4, 3, 2, 1]}', expectedOutput: '5', isHidden: true }
        ],
        hints: ['Traverse backwards from right to left, keeping track of the maximum element seen so far.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Accenture Assessment 2024',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent Accenture placement test question.',
        explanation: 'Traverse from right to left. If nums[i] > maxRight, it is a leader; increment count and update maxRight.',
        active: true
    },
    {
        questionId: 'ACC-CODING-010',
        title: 'Automorphic Number Verification',
        slug: 'acc-automorphic-number-check',
        company: 'Accenture',
        difficulty: 'Easy',
        topics: ['Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'An Automorphic number is a number whose square ends in the same digits as the number itself (e.g. 5^2 = 25 ends in 5; 76^2 = 5776 ends in 76). Given an integer `n`, return `true` if it is Automorphic, otherwise `false`.',
        functionSignature: {
            name: 'isAutomorphic',
            params: [{ name: 'n', type: 'number' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isAutomorphic(n) {\n    // Write your code here\n    \n}',
            python: 'def isAutomorphic(n: int) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isAutomorphic(int n) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool isAutomorphic(int n) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'n = 25', output: 'true', explanation: '25^2 = 625 which ends in 25.' },
            { input: 'n = 7', output: 'false', explanation: '7^2 = 49 does not end in 7.' }
        ],
        constraints: ['0 <= n <= 10^5'],
        testCases: [
            { input: '{"n":25}', expectedOutput: 'true', isHidden: false },
            { input: '{"n":7}', expectedOutput: 'false', isHidden: false },
            { input: '{"n":76}', expectedOutput: 'true', isHidden: true },
            { input: '{"n":0}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['Square n and check if square ends with n using modulo 10^d where d is number of digits in n.'],
        sourceType: 'pattern_based',
        sourceName: 'Accenture Coding Pattern',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Pattern based on Accenture number properties questions.',
        explanation: 'Calculate square = n * n. Check if String(square).endsWith(String(n)).',
        active: true
    },
    {
        questionId: 'ACC-CODING-011',
        title: 'Decimal to Binary and Count Set Bits',
        slug: 'acc-decimal-to-binary-count-set-bits',
        company: 'Accenture',
        difficulty: 'Medium',
        topics: ['Bit Manipulation', 'Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a non-negative integer `n`, convert `n` to its binary representation and return the count of set bits (`1`s) in it.',
        functionSignature: {
            name: 'countSetBits',
            params: [{ name: 'n', type: 'number' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function countSetBits(n) {\n    // Write your code here\n    \n}',
            python: 'def countSetBits(n: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int countSetBits(int n) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int countSetBits(int n) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'n = 23', output: '4', explanation: '23 in binary is 10111, containing 4 set bits.' },
            { input: 'n = 0', output: '0', explanation: '0 in binary has 0 set bits.' }
        ],
        constraints: ['0 <= n <= 10^9'],
        testCases: [
            { input: '{"n":23}', expectedOutput: '4', isHidden: false },
            { input: '{"n":0}', expectedOutput: '0', isHidden: false },
            { input: '{"n":128}', expectedOutput: '1', isHidden: true },
            { input: '{"n":1023}', expectedOutput: '10', isHidden: true }
        ],
        hints: ['Use Brian Kernighan\'s algorithm: n = n & (n - 1) clears the lowest set bit.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Accenture Assessment 2025',
        sourceUrl: 'https://www.accenture.com/in-en/careers',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Accenture 2025 campus test series.',
        explanation: 'Loop while n > 0: n = n & (n - 1) and increment count. Runs in O(number of set bits).',
        active: true
    }
];

module.exports = { TCS_DELOITTE_ACCENTURE_CODING };
