/**
 * Coding questions for LTIMindtree, HCL, Wipro (33 questions, 11 each)
 */
const LTI_HCL_WIPRO_CODING = [
    // =========================================================================
    // 4. LTIMindtree (11 Questions: LTI-CODING-001 to LTI-CODING-011)
    // =========================================================================
    {
        questionId: 'LTI-CODING-001',
        title: 'Dutch National Flag Sort 0s 1s and 2s',
        slug: 'lti-sort-colors-0-1-2',
        company: 'LTIMindtree',
        difficulty: 'Medium',
        topics: ['Sorting', 'Two Pointers', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We use integers `0`, `1`, and `2` to represent red, white, and blue respectively. Return the sorted array.',
        functionSignature: {
            name: 'sortColors',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function sortColors(nums) {\n    // Write your code here\n    \n}',
            python: 'def sortColors(nums: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] sortColors(int[] nums) {\n        // Write your code here\n        return nums;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> sortColors(vector<int>& nums) {\n        // Write your code here\n        return nums;\n    }\n};'
        },
        examples: [
            { input: 'nums = [2, 0, 2, 1, 1, 0]', output: '[0, 0, 1, 1, 2, 2]', explanation: 'Sorted in-place.' },
            { input: 'nums = [2, 0, 1]', output: '[0, 1, 2]', explanation: 'Sorted.' }
        ],
        constraints: ['1 <= nums.length <= 300', 'nums[i] is either 0, 1, or 2.'],
        testCases: [
            { input: '{"nums":[2, 0, 2, 1, 1, 0]}', expectedOutput: '[0,0,1,1,2,2]', isHidden: false },
            { input: '{"nums":[2, 0, 1]}', expectedOutput: '[0,1,2]', isHidden: false },
            { input: '{"nums":[0]}', expectedOutput: '[0]', isHidden: true }
        ],
        hints: ['Use three pointers (low, mid, high) to partition array into three parts in one pass.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Edge Campus Drive',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent sorting problem asked in LTIMindtree graduate recruitment test.',
        explanation: 'Three pointers: low tracks 0 boundary, high tracks 2 boundary, mid scans. If 0 swap with low, if 2 swap with high, if 1 advance mid.',
        active: true
    },
    {
        questionId: 'LTI-CODING-002',
        title: 'Reverse Subarrays of Size K',
        slug: 'lti-reverse-subarrays-size-k',
        company: 'LTIMindtree',
        difficulty: 'Medium',
        topics: ['Arrays', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `arr` and an integer `k`, reverse every contiguous subarray of size `k`. If the remaining elements are fewer than `k`, reverse them as well. Return the modified array.',
        functionSignature: {
            name: 'reverseInGroups',
            params: [
                { name: 'arr', type: 'number[]' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function reverseInGroups(arr, k) {\n    // Write your code here\n    \n}',
            python: 'def reverseInGroups(arr: list[int], k: int) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] reverseInGroups(int[] arr, int k) {\n        // Write your code here\n        return arr;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> reverseInGroups(vector<int>& arr, int k) {\n        // Write your code here\n        return arr;\n    }\n};'
        },
        examples: [
            { input: 'arr = [1, 2, 3, 4, 5], k = 3', output: '[3, 2, 1, 5, 4]', explanation: 'First 3 elements reversed, then remaining 2 reversed.' },
            { input: 'arr = [5, 6, 8, 9], k = 5', output: '[9, 8, 6, 5]', explanation: 'Fewer than 5 elements, so all reversed.' }
        ],
        constraints: ['1 <= arr.length <= 10^5', '1 <= k <= 10^5'],
        testCases: [
            { input: '{"arr":[1, 2, 3, 4, 5],"k":3}', expectedOutput: '[3,2,1,5,4]', isHidden: false },
            { input: '{"arr":[5, 6, 8, 9],"k":5}', expectedOutput: '[9,8,6,5]', isHidden: false },
            { input: '{"arr":[1, 2, 3, 4],"k":2}', expectedOutput: '[2,1,4,3]', isHidden: true }
        ],
        hints: ['Step through array with index increment of k, reversing [i, min(i + k - 1, n - 1)].'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Technical Screening',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Nov 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in LTIMindtree 2024 on-campus placement paper.',
        explanation: 'Loop i from 0 to n by k. In each window, use two pointers left = i and right = min(i + k - 1, n - 1) to reverse in-place.',
        active: true
    },
    {
        questionId: 'LTI-CODING-003',
        title: 'Longest Common Prefix in String Array',
        slug: 'lti-longest-common-prefix',
        company: 'LTIMindtree',
        difficulty: 'Easy',
        topics: ['Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Write a function to find the longest common prefix string amongst an array of strings `strs`. If there is no common prefix, return an empty string `""`.',
        functionSignature: {
            name: 'longestCommonPrefix',
            params: [{ name: 'strs', type: 'string[]' }],
            returnType: 'string'
        },
        starterCode: {
            javascript: 'function longestCommonPrefix(strs) {\n    // Write your code here\n    \n}',
            python: 'def longestCommonPrefix(strs: list[str]) -> str:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Write your code here\n        return "";\n    }\n}',
            cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        // Write your code here\n        return "";\n    }\n};'
        },
        examples: [
            { input: 'strs = ["flower", "flow", "flight"]', output: '"fl"', explanation: '"fl" is the longest common prefix.' },
            { input: 'strs = ["dog", "racecar", "car"]', output: '""', explanation: 'There is no common prefix among the input strings.' }
        ],
        constraints: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] consists of lowercase English letters.'],
        testCases: [
            { input: '{"strs":["flower", "flow", "flight"]}', expectedOutput: '"fl"', isHidden: false },
            { input: '{"strs":["dog", "racecar", "car"]}', expectedOutput: '""', isHidden: false },
            { input: '{"strs":["mindtree", "mindset", "minds"]}', expectedOutput: '"mind"', isHidden: true }
        ],
        hints: ['Compare characters column by column across all strings.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Coding Round',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in LTIMindtree campus technical rounds.',
        explanation: 'Take first word as reference prefix. Shorten prefix whenever subsequent words do not start with it.',
        active: true
    },
    {
        questionId: 'LTI-CODING-004',
        title: 'Detect Cycle in Directed Graph',
        slug: 'lti-detect-cycle-directed-graph',
        company: 'LTIMindtree',
        difficulty: 'Medium',
        topics: ['Graphs', 'Recursion'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given the number of vertices `numCourses` and an array of prerequisite pairs `prerequisites` where `[a, b]` means to take course `a` you must first take course `b`, return `true` if you can finish all courses (i.e. no cycle exists), otherwise return `false`.',
        functionSignature: {
            name: 'canFinish',
            params: [
                { name: 'numCourses', type: 'number' },
                { name: 'prerequisites', type: 'number[][]' }
            ],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function canFinish(numCourses, prerequisites) {\n    // Write your code here\n    \n}',
            python: 'def canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'numCourses = 2, prerequisites = [[1, 0]]', output: 'true', explanation: 'Course 0 can be taken then course 1.' },
            { input: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]', output: 'false', explanation: 'Cyclic dependency between 0 and 1.' }
        ],
        constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
        testCases: [
            { input: '{"numCourses":2,"prerequisites":[[1, 0]]}', expectedOutput: 'true', isHidden: false },
            { input: '{"numCourses":2,"prerequisites":[[1, 0], [0, 1]]}', expectedOutput: 'false', isHidden: false },
            { input: '{"numCourses":3,"prerequisites":[[0, 1], [1, 2], [2, 0]]}', expectedOutput: 'false', isHidden: true }
        ],
        hints: ['Topological sort using Kahn\'s algorithm (indegrees) or DFS cycle detection.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Edge Assessment',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in LTIMindtree 2025 technical round for 8 LPA package.',
        explanation: 'Build adjacency list and in-degrees. Use queue for nodes with 0 in-degree. Count visited nodes; if equal to numCourses, no cycle exists.',
        active: true
    },
    {
        questionId: 'LTI-CODING-005',
        title: 'Isomorphic Strings Verification',
        slug: 'lti-isomorphic-strings',
        company: 'LTIMindtree',
        difficulty: 'Easy',
        topics: ['Strings', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given two strings `s` and `t`, determine if they are isomorphic. Two strings `s` and `t` are isomorphic if the characters in `s` can be replaced to get `t`, while preserving character order and ensuring a one-to-one character mapping.',
        functionSignature: {
            name: 'isIsomorphic',
            params: [
                { name: 's', type: 'string' },
                { name: 't', type: 'string' }
            ],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isIsomorphic(s, t) {\n    // Write your code here\n    \n}',
            python: 'def isIsomorphic(s: str, t: str) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isIsomorphic(String s, String t) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isIsomorphic(string s, string t) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 's = "egg", t = "add"', output: 'true', explanation: '\'e\' -> \'a\', \'g\' -> \'d\'.' },
            { input: 's = "foo", t = "bar"', output: 'false', explanation: '\'o\' cannot map to both \'a\' and \'r\'.' }
        ],
        constraints: ['1 <= s.length <= 5 * 10^4', 't.length == s.length'],
        testCases: [
            { input: '{"s":"egg","t":"add"}', expectedOutput: 'true', isHidden: false },
            { input: '{"s":"foo","t":"bar"}', expectedOutput: 'false', isHidden: false },
            { input: '{"s":"paper","t":"title"}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['Use two hash maps to enforce bijection between s[i] and t[i].'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Graduate Trainee Test',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent question in LTIMindtree placement screening.',
        explanation: 'Maintain two maps sToT and tToS. If mapping exists and disagrees with current pairing, return false.',
        active: true
    },
    {
        questionId: 'LTI-CODING-006',
        title: 'Merge Two Sorted Arrays Without Extra Space',
        slug: 'lti-merge-sorted-arrays-in-place',
        company: 'LTIMindtree',
        difficulty: 'Medium',
        topics: ['Arrays', 'Sorting', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are given two sorted integer arrays `nums1` and `nums2`, and two integers `m` and `n` representing the number of elements in `nums1` and `nums2` respectively. `nums1` has a size of `m + n`, with the last `n` elements set to `0`. Merge `nums2` into `nums1` as one sorted array in-place, and return `nums1`.',
        functionSignature: {
            name: 'mergeSortedInPlace',
            params: [
                { name: 'nums1', type: 'number[]' },
                { name: 'm', type: 'number' },
                { name: 'nums2', type: 'number[]' },
                { name: 'n', type: 'number' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function mergeSortedInPlace(nums1, m, nums2, n) {\n    // Write your code here\n    \n}',
            python: 'def mergeSortedInPlace(nums1: list[int], m: int, nums2: list[int], n: int) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] mergeSortedInPlace(int[] nums1, int m, int[] nums2, int n) {\n        // Write your code here\n        return nums1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> mergeSortedInPlace(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        // Write your code here\n        return nums1;\n    }\n};'
        },
        examples: [
            { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]', explanation: 'Combined in sorted order.' },
            { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]', explanation: 'Single array.' }
        ],
        constraints: ['nums1.length == m + n', '0 <= m, n <= 200', '1 <= m + n <= 200'],
        testCases: [
            { input: '{"nums1":[1,2,3,0,0,0],"m":3,"nums2":[2,5,6],"n":3}', expectedOutput: '[1,2,2,3,5,6]', isHidden: false },
            { input: '{"nums1":[1],"m":1,"nums2":[],"n":0}', expectedOutput: '[1]', isHidden: false },
            { input: '{"nums1":[0],"m":0,"nums2":[1],"n":1}', expectedOutput: '[1]', isHidden: true }
        ],
        hints: ['Fill nums1 from the back (index m + n - 1) using three pointers.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Technical Test',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Dec 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in LTIMindtree placement assessment 2024.',
        explanation: 'Use three pointers: p1 = m - 1, p2 = n - 1, p = m + n - 1. Compare and insert larger element at p from the back.',
        active: true
    },
    {
        questionId: 'LTI-CODING-007',
        title: 'Trapping Rain Water Calculation',
        slug: 'lti-trapping-rain-water',
        company: 'LTIMindtree',
        difficulty: 'Hard',
        topics: ['Two Pointers', 'Dynamic Programming', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
        functionSignature: {
            name: 'trap',
            params: [{ name: 'height', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function trap(height) {\n    // Write your code here\n    \n}',
            python: 'def trap(height: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water trapped.' },
            { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '9 units of water trapped.' }
        ],
        constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
        testCases: [
            { input: '{"height":[0,1,0,2,1,0,1,3,2,1,2,1]}', expectedOutput: '6', isHidden: false },
            { input: '{"height":[4,2,0,3,2,5]}', expectedOutput: '9', isHidden: false },
            { input: '{"height":[2,0,2]}', expectedOutput: '2', isHidden: true }
        ],
        hints: ['Two pointers converging from left and right tracking maxLeft and maxRight.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Advanced Technical Round',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2023,
        reportedDate: 'Oct 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Featured in LTIMindtree high-package coding round.',
        explanation: 'Maintain left and right pointers. Advance the pointer with the smaller height, adding water = maxBound - height.',
        active: true
    },
    {
        questionId: 'LTI-CODING-008',
        title: 'Valid Sudoku Board Verification',
        slug: 'lti-valid-sudoku-board',
        company: 'LTIMindtree',
        difficulty: 'Medium',
        topics: ['Hashing', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to standard Sudoku rules: each row, column, and 3x3 sub-box must contain digits 1-9 without repetition. Empty cells are represented by `\'.\'`.',
        functionSignature: {
            name: 'isValidSudoku',
            params: [{ name: 'board', type: 'string[][]' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isValidSudoku(board) {\n    // Write your code here\n    \n}',
            python: 'def isValidSudoku(board: list[list[str]]) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isValidSudoku(char[][] board) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValidSudoku(vector<vector<char>>& board) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', output: 'true', explanation: 'Valid Sudoku configuration.' },
            { input: 'board = [["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', output: 'false', explanation: 'First row and column both have duplicate 8 in top-left.' }
        ],
        constraints: ['board.length == 9', 'board[i].length == 9', 'board[i][j] is a digit \'1\'-\'9\' or \'.\''],
        testCases: [
            { input: '{"board":[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]}', expectedOutput: 'true', isHidden: false },
            { input: '{"board":[["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]}', expectedOutput: 'false', isHidden: false }
        ],
        hints: ['Encode each entry as row_r_val, col_c_val, box_b_val into a set to verify uniqueness.'],
        sourceType: 'pattern_based',
        sourceName: 'LTIMindtree Coding Pattern',
        sourceUrl: 'https://www.ltimindtree.com/',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Based on 2D board validation syllabus patterns.',
        explanation: 'Store each digit in sets: row[r], col[c], box[Math.floor(r/3)*3 + Math.floor(c/3)]. Return false on conflict.',
        active: true
    },
    {
        questionId: 'LTI-CODING-009',
        title: 'Spiral Order Matrix Traversal',
        slug: 'lti-spiral-matrix-traversal',
        company: 'LTIMindtree',
        difficulty: 'Medium',
        topics: ['Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an `m x n` matrix, return all elements of the matrix in spiral order.',
        functionSignature: {
            name: 'spiralOrder',
            params: [{ name: 'matrix', type: 'number[][]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function spiralOrder(matrix) {\n    // Write your code here\n    \n}',
            python: 'def spiralOrder(matrix: list[list[int]]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public List<Integer> spiralOrder(int[][] matrix) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]', explanation: 'Traversed clockwise spiral.' },
            { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]', explanation: 'Clockwise spiral traversal.' }
        ],
        constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
        testCases: [
            { input: '{"matrix":[[1,2,3],[4,5,6],[7,8,9]]}', expectedOutput: '[1,2,3,6,9,8,7,4,5]', isHidden: false },
            { input: '{"matrix":[[1,2,3,4],[5,6,7,8],[9,10,11,12]]}', expectedOutput: '[1,2,3,4,8,12,11,10,9,5,6,7]', isHidden: false },
            { input: '{"matrix":[[7]]}', expectedOutput: '[7]', isHidden: true }
        ],
        hints: ['Maintain four boundaries: top, bottom, left, right and shrink after each direction.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Campus Assessment',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in LTIMindtree 2025 technical round.',
        explanation: 'Traverse right, down, left, up, adjusting top, right, bottom, left bounds after each pass.',
        active: true
    },
    {
        questionId: 'LTI-CODING-010',
        title: 'Find the Duplicate Number in 1 to N Array',
        slug: 'lti-find-duplicate-number',
        company: 'LTIMindtree',
        difficulty: 'Medium',
        topics: ['Two Pointers', 'Arrays', 'Binary Search'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive. There is only one repeated number in `nums`, return this repeated number without modifying the array `nums` and using only constant `O(1)` extra space.',
        functionSignature: {
            name: 'findDuplicate',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function findDuplicate(nums) {\n    // Write your code here\n    \n}',
            python: 'def findDuplicate(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int findDuplicate(int[] nums) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findDuplicate(vector<int>& nums) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 3, 4, 2, 2]', output: '2', explanation: '2 is the duplicate number.' },
            { input: 'nums = [3, 1, 3, 4, 2]', output: '3', explanation: '3 is repeated.' }
        ],
        constraints: ['1 <= n <= 10^5', 'nums.length == n + 1', '1 <= nums[i] <= n'],
        testCases: [
            { input: '{"nums":[1, 3, 4, 2, 2]}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[3, 1, 3, 4, 2]}', expectedOutput: '3', isHidden: false },
            { input: '{"nums":[2, 2, 2, 2]}', expectedOutput: '2', isHidden: true }
        ],
        hints: ['Treat the array as a linked list where value is the next pointer. Use Floyd\'s Tortoise and Hare algorithm.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Technical Drive',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Sep 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent algorithmic interview question in LTIMindtree.',
        explanation: 'Floyd cycle detection: slow = nums[slow], fast = nums[nums[fast]] until they meet. Then find cycle entrance.',
        active: true
    },
    {
        questionId: 'LTI-CODING-011',
        title: 'Minimum Cost Path in a Grid',
        slug: 'lti-min-cost-path-grid',
        company: 'LTIMindtree',
        difficulty: 'Medium',
        topics: ['Dynamic Programming', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a `m x n` grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.',
        functionSignature: {
            name: 'minPathSum',
            params: [{ name: 'grid', type: 'number[][]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function minPathSum(grid) {\n    // Write your code here\n    \n}',
            python: 'def minPathSum(grid: list[list[int]]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int minPathSum(int[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minPathSum(vector<vector<int>>& grid) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', output: '7', explanation: 'Path 1 -> 3 -> 1 -> 1 -> 1 minimizes sum to 7.' },
            { input: 'grid = [[1,2,3],[4,5,6]]', output: '12', explanation: '1 -> 2 -> 3 -> 6 = 12.' }
        ],
        constraints: ['m == grid.length', 'n == grid[0].length', '1 <= m, n <= 200', '0 <= grid[i][j] <= 200'],
        testCases: [
            { input: '{"grid":[[1,3,1],[1,5,1],[4,2,1]]}', expectedOutput: '7', isHidden: false },
            { input: '{"grid":[[1,2,3],[4,5,6]]}', expectedOutput: '12', isHidden: false },
            { input: '{"grid":[[5]]}', expectedOutput: '5', isHidden: true }
        ],
        hints: ['dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'LTIMindtree Edge Coding Exam',
        sourceUrl: 'https://www.ltimindtree.com/careers/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in LTIMindtree 2025 placement round.',
        explanation: '2D DP: Each cell min cost is its value plus minimum of coming from above or from the left.',
        active: true
    },

    // =========================================================================
    // 5. HCL (11 Questions: HCL-CODING-001 to HCL-CODING-011)
    // =========================================================================
    {
        questionId: 'HCL-CODING-001',
        title: 'Single Number with Odd Occurrence',
        slug: 'hcl-single-number-odd-occurrence',
        company: 'HCL',
        difficulty: 'Easy',
        topics: ['Bit Manipulation', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one. Implement a solution with a linear runtime complexity and use only constant extra space.',
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
            { input: 'nums = [2, 2, 1]', output: '1', explanation: '1 appears once.' },
            { input: 'nums = [4, 1, 2, 1, 2]', output: '4', explanation: '4 appears once.' }
        ],
        constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4'],
        testCases: [
            { input: '{"nums":[2, 2, 1]}', expectedOutput: '1', isHidden: false },
            { input: '{"nums":[4, 1, 2, 1, 2]}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[1]}', expectedOutput: '1', isHidden: true }
        ],
        hints: ['XOR of any number with itself is 0, and XOR with 0 is the number itself.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL FirstCareers Assessment',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent entry-level assessment question in HCL TechBee/FirstCareers.',
        explanation: 'XOR all elements in the array. Duplicate numbers cancel out (a ^ a = 0), leaving only the single number.',
        active: true
    },
    {
        questionId: 'HCL-CODING-002',
        title: 'Recursively Remove Adjacent Duplicates',
        slug: 'hcl-remove-adjacent-duplicates',
        company: 'HCL',
        difficulty: 'Medium',
        topics: ['Stack', 'Recursion', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are given a string `s` consisting of lowercase English letters. A duplicate removal consists of choosing two adjacent and equal letters and removing them. We repeatedly make duplicate removals on `s` until we no longer can. Return the final string after all such duplicate removals have been made.',
        functionSignature: {
            name: 'removeDuplicates',
            params: [{ name: 's', type: 'string' }],
            returnType: 'string'
        },
        starterCode: {
            javascript: 'function removeDuplicates(s) {\n    // Write your code here\n    \n}',
            python: 'def removeDuplicates(s: str) -> str:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public String removeDuplicates(String s) {\n        // Write your code here\n        return "";\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string removeDuplicates(string s) {\n        // Write your code here\n        return "";\n    }\n};'
        },
        examples: [
            { input: 's = "abbaca"', output: '"ca"', explanation: '"abbaca" -> "aaca" -> "ca".' },
            { input: 's = "azxxzy"', output: '"ay"', explanation: '"azxxzy" -> "azzy" -> "ay".' }
        ],
        constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters.'],
        testCases: [
            { input: '{"s":"abbaca"}', expectedOutput: '"ca"', isHidden: false },
            { input: '{"s":"azxxzy"}', expectedOutput: '"ay"', isHidden: false },
            { input: '{"s":"a"}', expectedOutput: '"a"', isHidden: true }
        ],
        hints: ['Use a stack. If current char equals stack top, pop it; otherwise push it.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL Tech Graduate Test',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in HCL 2025 campus recruitment test.',
        explanation: 'Iterate characters pushing to stack. If char matches top of stack, pop it instead of pushing.',
        active: true
    },
    {
        questionId: 'HCL-CODING-003',
        title: 'Check if One String is a Rotation of Another',
        slug: 'hcl-check-string-rotation',
        company: 'HCL',
        difficulty: 'Easy',
        topics: ['Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given two strings `s` and `goal`, return `true` if and only if `s` can become `goal` after some number of shifts on `s`. A shift on `s` consists of moving the leftmost character of `s` to the rightmost position.',
        functionSignature: {
            name: 'rotateString',
            params: [
                { name: 's', type: 'string' },
                { name: 'goal', type: 'string' }
            ],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function rotateString(s, goal) {\n    // Write your code here\n    \n}',
            python: 'def rotateString(s: str, goal: str) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean rotateString(String s, String goal) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool rotateString(string s, string goal) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 's = "abcde", goal = "cdeab"', output: 'true', explanation: '2 shifts produce "cdeab".' },
            { input: 's = "abcde", goal = "abced"', output: 'false', explanation: 'Cannot be reached by cyclic shift.' }
        ],
        constraints: ['1 <= s.length, goal.length <= 100', 's and goal consist of lowercase English letters.'],
        testCases: [
            { input: '{"s":"abcde","goal":"cdeab"}', expectedOutput: 'true', isHidden: false },
            { input: '{"s":"abcde","goal":"abced"}', expectedOutput: 'false', isHidden: false },
            { input: '{"s":"aa","goal":"a"}', expectedOutput: 'false', isHidden: true }
        ],
        hints: ['Check if goal is a substring of s + s and lengths are equal.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL Technical Screening',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2024,
        reportedDate: 'Jul 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent string rotation question in HCL technical rounds.',
        explanation: 'Check s.length === goal.length && (s + s).includes(goal).',
        active: true
    },
    {
        questionId: 'HCL-CODING-004',
        title: 'Second Largest Element in Array in Single Pass',
        slug: 'hcl-second-largest-element-single-pass',
        company: 'HCL',
        difficulty: 'Easy',
        topics: ['Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `arr` of integers, find the second largest distinct element in `arr`. If the second largest element does not exist, return `-1`.',
        functionSignature: {
            name: 'print2largest',
            params: [{ name: 'arr', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function print2largest(arr) {\n    // Write your code here\n    \n}',
            python: 'def print2largest(arr: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int print2largest(int[] arr) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int print2largest(vector<int>& arr) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'arr = [12, 35, 1, 10, 34, 1]', output: '34', explanation: '35 is largest, 34 is second largest.' },
            { input: 'arr = [10, 10]', output: '-1', explanation: 'All elements identical, no second largest distinct element.' }
        ],
        constraints: ['2 <= arr.length <= 10^5', '1 <= arr[i] <= 10^5'],
        testCases: [
            { input: '{"arr":[12, 35, 1, 10, 34, 1]}', expectedOutput: '34', isHidden: false },
            { input: '{"arr":[10, 10]}', expectedOutput: '-1', isHidden: false },
            { input: '{"arr":[5, 1, 2, 4]}', expectedOutput: '4', isHidden: true }
        ],
        hints: ['Maintain largest and secondLargest in a single traversal.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL FirstCareers Assessment',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in HCL 2025 FirstCareers coding test.',
        explanation: 'Track max1 and max2. When seeing element > max1, max2 = max1 and max1 = x. If element between max1 and max2, update max2.',
        active: true
    },
    {
        questionId: 'HCL-CODING-005',
        title: 'Intersection of Two Unsorted Arrays',
        slug: 'hcl-intersection-two-unsorted-arrays',
        company: 'HCL',
        difficulty: 'Easy',
        topics: ['Hashing', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given two integer arrays `nums1` and `nums2`, return an array of their intersection. Each element in the result must be unique and you may return the result in sorted ascending order.',
        functionSignature: {
            name: 'intersection',
            params: [
                { name: 'nums1', type: 'number[]' },
                { name: 'nums2', type: 'number[]' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function intersection(nums1, nums2) {\n    // Write your code here\n    \n}',
            python: 'def intersection(nums1: list[int], nums2: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] intersection(int[] nums1, int[] nums2) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2]', explanation: 'Common unique element is 2.' },
            { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[4,9]', explanation: 'Common unique elements are 4 and 9.' }
        ],
        constraints: ['1 <= nums1.length, nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 1000'],
        testCases: [
            { input: '{"nums1":[1,2,2,1],"nums2":[2,2]}', expectedOutput: '[2]', isHidden: false },
            { input: '{"nums1":[4,9,5],"nums2":[9,4,9,8,4]}', expectedOutput: '[4,9]', isHidden: false },
            { input: '{"nums1":[1,2],"nums2":[3,4]}', expectedOutput: '[]', isHidden: true }
        ],
        hints: ['Convert first array to a Set and filter items present in second array.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL Technical Assessment',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent array intersection test in HCL campus hiring.',
        explanation: 'Store nums1 in Set1. Filter unique elements of nums2 present in Set1, then sort ascending.',
        active: true
    },
    {
        questionId: 'HCL-CODING-006',
        title: 'Reverse Words in a Given Sentence',
        slug: 'hcl-reverse-words-sentence',
        company: 'HCL',
        difficulty: 'Medium',
        topics: ['Strings', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an input string `s`, reverse the order of the words. A word is defined as a sequence of non-space characters. Return a string of the words in reverse order concatenated by a single space, with leading/trailing spaces removed.',
        functionSignature: {
            name: 'reverseWords',
            params: [{ name: 's', type: 'string' }],
            returnType: 'string'
        },
        starterCode: {
            javascript: 'function reverseWords(s) {\n    // Write your code here\n    \n}',
            python: 'def reverseWords(s: str) -> str:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public String reverseWords(String s) {\n        // Write your code here\n        return "";\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string reverseWords(string s) {\n        // Write your code here\n        return "";\n    }\n};'
        },
        examples: [
            { input: 's = "the sky is blue"', output: '"blue is sky the"', explanation: 'Words reversed.' },
            { input: 's = "  hello world  "', output: '"world hello"', explanation: 'Leading and trailing spaces removed.' }
        ],
        constraints: ['1 <= s.length <= 10^4', 's contains English letters, digits, and spaces.'],
        testCases: [
            { input: '{"s":"the sky is blue"}', expectedOutput: '"blue is sky the"', isHidden: false },
            { input: '{"s":"  hello world  "}', expectedOutput: '"world hello"', isHidden: false },
            { input: '{"s":"a good   example"}', expectedOutput: '"example good a"', isHidden: true }
        ],
        hints: ['Split by spaces, filter empty words, reverse array of words and join with space.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL Campus Test Paper',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2024,
        reportedDate: 'Sep 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Classic string manipulation question in HCL exams.',
        explanation: 'Trim string, split on whitespace regex /\\s+/, reverse array of tokens, join with single space.',
        active: true
    },
    {
        questionId: 'HCL-CODING-007',
        title: 'Check if Integer is a Power of Two',
        slug: 'hcl-power-of-two-bitwise',
        company: 'HCL',
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
            { input: 'n = 1', output: 'true', explanation: '2^0 = 1.' },
            { input: 'n = 16', output: 'true', explanation: '2^4 = 16.' },
            { input: 'n = 3', output: 'false', explanation: 'Not a power of two.' }
        ],
        constraints: ['-2^31 <= n <= 2^31 - 1'],
        testCases: [
            { input: '{"n":1}', expectedOutput: 'true', isHidden: false },
            { input: '{"n":16}', expectedOutput: 'true', isHidden: false },
            { input: '{"n":3}', expectedOutput: 'false', isHidden: false },
            { input: '{"n":0}', expectedOutput: 'false', isHidden: true }
        ],
        hints: ['A power of two has exactly one set bit in binary: (n > 0) && (n & (n - 1)) == 0.'],
        sourceType: 'pattern_based',
        sourceName: 'HCL Technical Pattern',
        sourceUrl: 'https://www.hcltech.com/',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Pattern based on HCL bitwise arithmetic questions.',
        explanation: 'Check n > 0 && (n & (n - 1)) === 0.',
        active: true
    },
    {
        questionId: 'HCL-CODING-008',
        title: 'Pairs with Given Sum in Array',
        slug: 'hcl-pairs-with-given-sum',
        company: 'HCL',
        difficulty: 'Easy',
        topics: ['Hashing', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of integers `arr` and a target sum `target`, return the number of pairs `(i, j)` where `i < j` such that `arr[i] + arr[j] == target`.',
        functionSignature: {
            name: 'getPairsCount',
            params: [
                { name: 'arr', type: 'number[]' },
                { name: 'target', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function getPairsCount(arr, target) {\n    // Write your code here\n    \n}',
            python: 'def getPairsCount(arr: list[int], target: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int getPairsCount(int[] arr, int target) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int getPairsCount(vector<int>& arr, int target) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'arr = [1, 5, 7, 1], target = 6', output: '2', explanation: 'Pairs with sum 6 are (arr[0], arr[1]) and (arr[1], arr[3]).' },
            { input: 'arr = [1, 1, 1, 1], target = 2', output: '6', explanation: 'All 6 pairs sum to 2.' }
        ],
        constraints: ['1 <= arr.length <= 10^5', '-10^4 <= arr[i], target <= 10^4'],
        testCases: [
            { input: '{"arr":[1, 5, 7, 1],"target":6}', expectedOutput: '2', isHidden: false },
            { input: '{"arr":[1, 1, 1, 1],"target":2}', expectedOutput: '6', isHidden: false },
            { input: '{"arr":[10, 12, 10, 15,-1],"target":9}', expectedOutput: '2', isHidden: true }
        ],
        hints: ['Use hash map storing frequencies of seen numbers, for each x adding freq[target - x].'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL Campus Test Slot 2',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2023,
        reportedDate: 'Nov 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in HCL 2023 technical recruitment.',
        explanation: 'Iterate through array. For each number x, add freq[target - x] to pair count, then increment freq[x].',
        active: true
    },
    {
        questionId: 'HCL-CODING-009',
        title: 'Find Peak Element in Array',
        slug: 'hcl-find-peak-element',
        company: 'HCL',
        difficulty: 'Medium',
        topics: ['Binary Search', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array `nums`, find a peak element, and return its index. You must write an algorithm that runs in `O(log n)` time.',
        functionSignature: {
            name: 'findPeakElement',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function findPeakElement(nums) {\n    // Write your code here\n    \n}',
            python: 'def findPeakElement(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int findPeakElement(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findPeakElement(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 2, 3, 1]', output: '2', explanation: '3 is a peak element and your function should return index 2.' },
            { input: 'nums = [1, 2, 1, 3, 5, 6, 4]', output: '5', explanation: 'Index 1 (value 2) or index 5 (value 6) are peaks.' }
        ],
        constraints: ['1 <= nums.length <= 1000', '-2^31 <= nums[i] <= 2^31 - 1', 'nums[i] != nums[i + 1] for all valid i'],
        testCases: [
            { input: '{"nums":[1, 2, 3, 1]}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[1, 2, 1, 3, 5, 6, 4]}', expectedOutput: '5', isHidden: false },
            { input: '{"nums":[1]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Binary search: if nums[mid] < nums[mid + 1], peak must lie to the right.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL FirstCareers Assessment 2025',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in HCL 2025 technical round.',
        explanation: 'Binary search: if nums[mid] > nums[mid+1], search left half high = mid; else search right half low = mid + 1.',
        active: true
    },
    {
        questionId: 'HCL-CODING-010',
        title: 'Merge Overlapping Intervals',
        slug: 'hcl-merge-overlapping-intervals',
        company: 'HCL',
        difficulty: 'Medium',
        topics: ['Sorting', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
        functionSignature: {
            name: 'mergeIntervals',
            params: [{ name: 'intervals', type: 'number[][]' }],
            returnType: 'number[][]'
        },
        starterCode: {
            javascript: 'function mergeIntervals(intervals) {\n    // Write your code here\n    \n}',
            python: 'def mergeIntervals(intervals: list[list[int]]) -> list[list[int]]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[][] mergeIntervals(int[][] intervals) {\n        // Write your code here\n        return new int[][]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
            { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' }
        ],
        constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
        testCases: [
            { input: '{"intervals":[[1,3],[2,6],[8,10],[15,18]]}', expectedOutput: '[[1,6],[8,10],[15,18]]', isHidden: false },
            { input: '{"intervals":[[1,4],[4,5]]}', expectedOutput: '[[1,5]]', isHidden: false },
            { input: '{"intervals":[[6,8],[1,9],[2,4],[4,7]]}', expectedOutput: '[[1,9]]', isHidden: true }
        ],
        hints: ['Sort intervals by start time, then merge sequentially.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL Technical Drive 2025',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2025,
        reportedDate: 'Feb 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in HCL 2025 developer role technical test.',
        explanation: 'Sort intervals by start. Iterate: if current interval overlaps with previous, merge by extending end = max(prev.end, curr.end).',
        active: true
    },
    {
        questionId: 'HCL-CODING-011',
        title: 'Detect Loop in a Singly Linked List Representation',
        slug: 'hcl-detect-loop-linked-list',
        company: 'HCL',
        difficulty: 'Easy',
        topics: ['Linked List', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `nextPtrs` where `nextPtrs[i]` represents the 0-indexed position that node `i` points to (or `-1` if it points to null), determine if the list has a cycle starting from head node `0`.',
        functionSignature: {
            name: 'hasCycle',
            params: [{ name: 'nextPtrs', type: 'number[]' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function hasCycle(nextPtrs) {\n    // Write your code here\n    \n}',
            python: 'def hasCycle(nextPtrs: list[int]) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean hasCycle(int[] nextPtrs) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool hasCycle(vector<int>& nextPtrs) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'nextPtrs = [1, 2, 0]', output: 'true', explanation: 'Node 0 -> 1 -> 2 -> 0 forms a cycle.' },
            { input: 'nextPtrs = [1, 2, -1]', output: 'false', explanation: 'Node 0 -> 1 -> 2 -> null terminates without cycle.' }
        ],
        constraints: ['1 <= nextPtrs.length <= 10^4', '-1 <= nextPtrs[i] < nextPtrs.length'],
        testCases: [
            { input: '{"nextPtrs":[1, 2, 0]}', expectedOutput: 'true', isHidden: false },
            { input: '{"nextPtrs":[1, 2, -1]}', expectedOutput: 'false', isHidden: false },
            { input: '{"nextPtrs":[-1]}', expectedOutput: 'false', isHidden: true }
        ],
        hints: ['Use Floyd\'s cycle finding algorithm with slow and fast pointers.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'HCL FirstCareers Assessment',
        sourceUrl: 'https://www.hcltech.com/careers',
        reportedYear: 2024,
        reportedDate: 'Dec 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Standard linked list test question in HCL technical rounds.',
        explanation: 'Initialize slow = 0, fast = 0. Step slow by 1 pointer and fast by 2 pointers. If fast meets slow, a cycle exists.',
        active: true
    },

    // =========================================================================
    // 6. WIPRO (11 Questions: WIP-CODING-001 to WIP-CODING-011)
    // =========================================================================
    {
        questionId: 'WIP-CODING-001',
        title: 'Strongest Neighbor in Array',
        slug: 'wip-strongest-neighbor-array',
        company: 'Wipro',
        difficulty: 'Easy',
        topics: ['Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `arr` of `n` positive integers, return an array of length `n - 1` containing the maximum of each adjacent pair `(arr[i], arr[i + 1])`.',
        functionSignature: {
            name: 'maxAdjacentPairs',
            params: [{ name: 'arr', type: 'number[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function maxAdjacentPairs(arr) {\n    // Write your code here\n    \n}',
            python: 'def maxAdjacentPairs(arr: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] maxAdjacentPairs(int[] arr) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> maxAdjacentPairs(vector<int>& arr) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'arr = [1, 2, 2, 3, 4, 5]', output: '[2, 2, 3, 4, 5]', explanation: 'max(1,2)=2, max(2,2)=2, max(2,3)=3, max(3,4)=4, max(4,5)=5.' },
            { input: 'arr = [5, 5]', output: '[5]', explanation: 'max(5,5)=5.' }
        ],
        constraints: ['2 <= arr.length <= 10^5', '1 <= arr[i] <= 10^6'],
        testCases: [
            { input: '{"arr":[1, 2, 2, 3, 4, 5]}', expectedOutput: '[2,2,3,4,5]', isHidden: false },
            { input: '{"arr":[5, 5]}', expectedOutput: '[5]', isHidden: false },
            { input: '{"arr":[10, 4, 8]}', expectedOutput: '[10,8]', isHidden: true }
        ],
        hints: ['Loop i from 0 to n - 2, appending max(arr[i], arr[i + 1]).'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro NLTH Elite National Talent Hunt',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent Wipro NLTH entry coding question.',
        explanation: 'Loop i from 0 to arr.length - 2, compute Math.max(arr[i], arr[i + 1]) and push into result array.',
        active: true
    },
    {
        questionId: 'WIP-CODING-002',
        title: 'Symmetric Tree Mirror Verification',
        slug: 'wip-symmetric-tree-mirror',
        company: 'Wipro',
        difficulty: 'Easy',
        topics: ['Trees', 'Recursion'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given the binary tree nodes represented in level-order array `root` where `-1` represents null, return `true` if the tree is a mirror of itself (i.e., symmetric around its center).',
        functionSignature: {
            name: 'isSymmetricTree',
            params: [{ name: 'root', type: 'number[]' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isSymmetricTree(root) {\n    // Write your code here\n    \n}',
            python: 'def isSymmetricTree(root: list[int]) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isSymmetricTree(int[] root) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isSymmetricTree(vector<int>& root) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'root = [1, 2, 2, 3, 4, 4, 3]', output: 'true', explanation: 'Left and right subtrees mirror each other.' },
            { input: 'root = [1, 2, 2, -1, 3, -1, 3]', output: 'false', explanation: 'Not symmetric.' }
        ],
        constraints: ['0 <= root.length <= 1000'],
        testCases: [
            { input: '{"root":[1, 2, 2, 3, 4, 4, 3]}', expectedOutput: 'true', isHidden: false },
            { input: '{"root":[1, 2, 2, -1, 3, -1, 3]}', expectedOutput: 'false', isHidden: false },
            { input: '{"root":[1]}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['Check if left child matches right child symmetrically across all levels.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro Turbo Technical Round',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Wipro Turbo high-package technical interview.',
        explanation: 'Check whether left and right subtrees are symmetric recursively or level-by-level.',
        active: true
    },
    {
        questionId: 'WIP-CODING-003',
        title: 'Implement Queue Using Two Stacks',
        slug: 'wip-queue-using-two-stacks',
        company: 'Wipro',
        difficulty: 'Easy',
        topics: ['Queue', 'Stack'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of string operations on a queue where `"push x"` inserts x, `"pop"` removes from front, and `"peek"` gets front, simulate the queue using two stacks and return the sequence of outputs from `"pop"` and `"peek"` operations.',
        functionSignature: {
            name: 'simulateQueue',
            params: [{ name: 'operations', type: 'string[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function simulateQueue(operations) {\n    // Write your code here\n    \n}',
            python: 'def simulateQueue(operations: list[str]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public List<Integer> simulateQueue(String[] operations) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}',
            cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> simulateQueue(vector<string>& operations) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'operations = ["push 1", "push 2", "peek", "pop", "peek"]', output: '[1, 1, 2]', explanation: 'peek -> 1, pop -> 1, peek -> 2.' },
            { input: 'operations = ["push 5", "pop"]', output: '[5]', explanation: 'pop -> 5.' }
        ],
        constraints: ['1 <= operations.length <= 1000'],
        testCases: [
            { input: '{"operations":["push 1", "push 2", "peek", "pop", "peek"]}', expectedOutput: '[1,1,2]', isHidden: false },
            { input: '{"operations":["push 5", "pop"]}', expectedOutput: '[5]', isHidden: false },
            { input: '{"operations":["push 10", "push 20", "pop", "pop"]}', expectedOutput: '[10,20]', isHidden: true }
        ],
        hints: ['Use stack1 for enqueue and stack2 for dequeue; transfer stack1 to stack2 when stack2 is empty.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro NLTH National Assessment',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2024,
        reportedDate: 'Sep 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent data structures implementation question in Wipro test.',
        explanation: 'Maintain inStack and outStack. For pop/peek, transfer elements from inStack to outStack if outStack is empty.',
        active: true
    },
    {
        questionId: 'WIP-CODING-004',
        title: 'Longest Non-Decreasing Subarray Length',
        slug: 'wip-longest-non-decreasing-subarray',
        company: 'Wipro',
        difficulty: 'Easy',
        topics: ['Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of integers `nums`, return the length of the longest continuous non-decreasing subarray (i.e. `nums[i] <= nums[i+1]`).',
        functionSignature: {
            name: 'longestNonDecreasingSubarray',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function longestNonDecreasingSubarray(nums) {\n    // Write your code here\n    \n}',
            python: 'def longestNonDecreasingSubarray(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int longestNonDecreasingSubarray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int longestNonDecreasingSubarray(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 3, 5, 4, 7]', output: '3', explanation: 'The longest non-decreasing subarray is [1, 3, 5] of length 3.' },
            { input: 'nums = [2, 2, 2, 2]', output: '4', explanation: 'Entire array is non-decreasing.' }
        ],
        constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
        testCases: [
            { input: '{"nums":[1, 3, 5, 4, 7]}', expectedOutput: '3', isHidden: false },
            { input: '{"nums":[2, 2, 2, 2]}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[5, 4, 3, 2]}', expectedOutput: '1', isHidden: true }
        ],
        hints: ['Traverse with a running counter, reset to 1 when nums[i] < nums[i-1].'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro Elite Screening Paper',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2023,
        reportedDate: 'Dec 2023',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Wipro Elite candidate assessments.',
        explanation: 'Track currentStreak and maxStreak. If nums[i] >= nums[i-1] currentStreak++; else currentStreak = 1. Update maxStreak.',
        active: true
    },
    {
        questionId: 'WIP-CODING-005',
        title: 'Count Vowels and Consonants in Sentence',
        slug: 'wip-count-vowels-and-consonants',
        company: 'Wipro',
        difficulty: 'Easy',
        topics: ['Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a string `s`, count the number of vowels and consonants in `s`. Return an array `[vowelCount, consonantCount]`. Ignore whitespace, digits, and special symbols.',
        functionSignature: {
            name: 'countVowelsAndConsonants',
            params: [{ name: 's', type: 'string' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function countVowelsAndConsonants(s) {\n    // Write your code here\n    \n}',
            python: 'def countVowelsAndConsonants(s: str) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] countVowelsAndConsonants(String s) {\n        // Write your code here\n        return new int[]{0, 0};\n    }\n}',
            cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> countVowelsAndConsonants(string s) {\n        // Write your code here\n        return {0, 0};\n    }\n};'
        },
        examples: [
            { input: 's = "Hello World!"', output: '[3, 7]', explanation: 'Vowels: e, o, o (3). Consonants: h, l, l, w, r, l, d (7).' },
            { input: 's = "Wipro 2025"', output: '[2, 3]', explanation: 'Vowels: i, o (2). Consonants: w, p, r (3).' }
        ],
        constraints: ['1 <= s.length <= 10^5'],
        testCases: [
            { input: '{"s":"Hello World!"}', expectedOutput: '[3,7]', isHidden: false },
            { input: '{"s":"Wipro 2025"}', expectedOutput: '[2,3]', isHidden: false },
            { input: '{"s":"12345"}', expectedOutput: '[0,0]', isHidden: true }
        ],
        hints: ['Check if character is letter: if [aeiouAEIOU] increment vowel, else increment consonant.'],
        sourceType: 'pattern_based',
        sourceName: 'Wipro Technical Pattern',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Pattern based on Wipro character counting coding questions.',
        explanation: 'Iterate characters: if alphabetical, test if vowel; increment respective counters.',
        active: true
    },
    {
        questionId: 'WIP-CODING-006',
        title: 'Armstrong Number Validator',
        slug: 'wip-armstrong-number-validator',
        company: 'Wipro',
        difficulty: 'Easy',
        topics: ['Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'An Armstrong number (narcissistic number) is a number that is equal to the sum of its digits raised to the power of the number of digits. Given an integer `n`, return `true` if `n` is an Armstrong number, otherwise `false`.',
        functionSignature: {
            name: 'isArmstrong',
            params: [{ name: 'n', type: 'number' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isArmstrong(n) {\n    // Write your code here\n    \n}',
            python: 'def isArmstrong(n: int) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isArmstrong(int n) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    bool isArmstrong(int n) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'n = 153', output: 'true', explanation: '1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153.' },
            { input: 'n = 120', output: 'false', explanation: '1^3 + 2^3 + 0^3 = 9 != 120.' }
        ],
        constraints: ['0 <= n <= 10^9'],
        testCases: [
            { input: '{"n":153}', expectedOutput: 'true', isHidden: false },
            { input: '{"n":120}', expectedOutput: 'false', isHidden: false },
            { input: '{"n":370}', expectedOutput: 'true', isHidden: true },
            { input: '{"n":9}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['Find number of digits d, then sum Math.pow(digit, d) for all digits.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro NLTH National Assessment',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent entry-level coding question in Wipro NLTH.',
        explanation: 'Calculate digit count d. Sum (digit^d) across all digits and verify equality with n.',
        active: true
    },
    {
        questionId: 'WIP-CODING-007',
        title: 'Subarray with Given Target Sum Positive Numbers',
        slug: 'wip-subarray-with-given-sum-positive',
        company: 'Wipro',
        difficulty: 'Medium',
        topics: ['Sliding Window', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `arr` of non-negative integers and an integer `target`, return the 1-based start and end indices of the first subarray whose sum equals `target`. If no such subarray exists, return `[-1]`.',
        functionSignature: {
            name: 'subarraySum',
            params: [
                { name: 'arr', type: 'number[]' },
                { name: 'target', type: 'number' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function subarraySum(arr, target) {\n    // Write your code here\n    \n}',
            python: 'def subarraySum(arr: list[int], target: int) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] subarraySum(int[] arr, int target) {\n        // Write your code here\n        return new int[]{-1};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> subarraySum(vector<int>& arr, int target) {\n        // Write your code here\n        return {-1};\n    }\n};'
        },
        examples: [
            { input: 'arr = [1, 2, 3, 7, 5], target = 12', output: '[2, 4]', explanation: 'Subarray 2 + 3 + 7 = 12 (1-indexed indices 2 to 4).' },
            { input: 'arr = [1, 2, 3, 4], target = 15', output: '[-1]', explanation: 'No subarray sums to 15.' }
        ],
        constraints: ['1 <= arr.length <= 10^5', '0 <= arr[i] <= 10^4', '1 <= target <= 10^9'],
        testCases: [
            { input: '{"arr":[1, 2, 3, 7, 5],"target":12}', expectedOutput: '[2,4]', isHidden: false },
            { input: '{"arr":[1, 2, 3, 4],"target":15}', expectedOutput: '[-1]', isHidden: false },
            { input: '{"arr":[5],"target":5}', expectedOutput: '[1,1]', isHidden: true }
        ],
        hints: ['Use sliding window with two pointers left and right, expanding right and shrinking left.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro Turbo Assessment 2025',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Wipro Turbo 2025 coding round.',
        explanation: 'Use two pointers to maintain window sum. Expand right pointer; while sum > target shrink left pointer.',
        active: true
    },
    {
        questionId: 'WIP-CODING-008',
        title: 'Check if Sentence is a Pangram',
        slug: 'wip-check-pangram-sentence',
        company: 'Wipro',
        difficulty: 'Easy',
        topics: ['Strings', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'A pangram is a sentence where every letter of the English alphabet appears at least once. Given a string `sentence` containing English letters and spaces, return `true` if `sentence` is a pangram, or `false` otherwise.',
        functionSignature: {
            name: 'checkIfPangram',
            params: [{ name: 'sentence', type: 'string' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function checkIfPangram(sentence) {\n    // Write your code here\n    \n}',
            python: 'def checkIfPangram(sentence: str) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean checkIfPangram(String sentence) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool checkIfPangram(string sentence) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'sentence = "thequickbrownfoxjumpsoverthelazydog"', output: 'true', explanation: 'Contains every alphabet letter at least once.' },
            { input: 'sentence = "wipro technology"', output: 'false', explanation: 'Missing letters like \'a\', \'b\', etc.' }
        ],
        constraints: ['1 <= sentence.length <= 1000'],
        testCases: [
            { input: '{"sentence":"thequickbrownfoxjumpsoverthelazydog"}', expectedOutput: 'true', isHidden: false },
            { input: '{"sentence":"wipro technology"}', expectedOutput: 'false', isHidden: false },
            { input: '{"sentence":"The quick brown fox jumps over the lazy dog."}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['Insert lowercase alphabetic characters into a Set and check if set.size == 26.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro NLTH Slot 1 Assessment',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2024,
        reportedDate: 'Jul 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent Wipro placement problem.',
        explanation: 'Create a set of lowercase alphabet characters present in sentence. If set size equals 26 return true.',
        active: true
    },
    {
        questionId: 'WIP-CODING-009',
        title: 'Invert Binary Tree',
        slug: 'wip-invert-binary-tree',
        company: 'Wipro',
        difficulty: 'Easy',
        topics: ['Trees', 'Recursion'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given the array representation of a binary tree in level order `root` (where `-1` denotes null), return the array representation of the tree after inverting it (swapping left and right children at all nodes).',
        functionSignature: {
            name: 'invertTree',
            params: [{ name: 'root', type: 'number[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function invertTree(root) {\n    // Write your code here\n    \n}',
            python: 'def invertTree(root: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] invertTree(int[] root) {\n        // Write your code here\n        return root;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> invertTree(vector<int>& root) {\n        // Write your code here\n        return root;\n    }\n};'
        },
        examples: [
            { input: 'root = [4, 2, 7, 1, 3, 6, 9]', output: '[4, 7, 2, 9, 6, 3, 1]', explanation: 'Inverted mirror image.' },
            { input: 'root = [2, 1, 3]', output: '[2, 3, 1]', explanation: '1 and 3 swapped.' }
        ],
        constraints: ['0 <= root.length <= 1000'],
        testCases: [
            { input: '{"root":[4, 2, 7, 1, 3, 6, 9]}', expectedOutput: '[4,7,2,9,6,3,1]', isHidden: false },
            { input: '{"root":[2, 1, 3]}', expectedOutput: '[2,3,1]', isHidden: false },
            { input: '{"root":[]}', expectedOutput: '[]', isHidden: true }
        ],
        hints: ['Recursively swap left and right subtrees.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro Turbo Assessment 2025',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Wipro Turbo 2025 technical interviews.',
        explanation: 'For each node, recursively invert left and right children, then swap them.',
        active: true
    },
    {
        questionId: 'WIP-CODING-010',
        title: 'Check if Can Reach End in Jump Game',
        slug: 'wip-can-reach-jump-game',
        company: 'Wipro',
        difficulty: 'Medium',
        topics: ['Greedy', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are given an integer array `nums`. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.',
        functionSignature: {
            name: 'canJump',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function canJump(nums) {\n    // Write your code here\n    \n}',
            python: 'def canJump(nums: list[int]) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean canJump(int[] nums) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'nums = [2, 3, 1, 1, 4]', output: 'true', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
            { input: 'nums = [3, 2, 1, 0, 4]', output: 'false', explanation: 'You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.' }
        ],
        constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
        testCases: [
            { input: '{"nums":[2, 3, 1, 1, 4]}', expectedOutput: 'true', isHidden: false },
            { input: '{"nums":[3, 2, 1, 0, 4]}', expectedOutput: 'false', isHidden: false },
            { input: '{"nums":[0]}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['Keep track of the maximum reachable index maxReach so far.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro NLTH National Qualifier',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2024,
        reportedDate: 'Nov 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent greedy question in Wipro test papers.',
        explanation: 'Maintain maxReach = 0. If current index i > maxReach, return false; otherwise maxReach = max(maxReach, i + nums[i]).',
        active: true
    },
    {
        questionId: 'WIP-CODING-011',
        title: 'Rotate 2D Matrix Clockwise by 90 Degrees',
        slug: 'wip-rotate-matrix-90-degrees',
        company: 'Wipro',
        difficulty: 'Medium',
        topics: ['Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are given an `n x n` 2D matrix representing an image. Rotate the image by 90 degrees clockwise in-place and return the rotated matrix.',
        functionSignature: {
            name: 'rotateMatrix',
            params: [{ name: 'matrix', type: 'number[][]' }],
            returnType: 'number[][]'
        },
        starterCode: {
            javascript: 'function rotateMatrix(matrix) {\n    // Write your code here\n    \n}',
            python: 'def rotateMatrix(matrix: list[list[int]]) -> list[list[int]]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[][] rotateMatrix(int[][] matrix) {\n        // Write your code here\n        return matrix;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> rotateMatrix(vector<vector<int>>& matrix) {\n        // Write your code here\n        return matrix;\n    }\n};'
        },
        examples: [
            { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]', explanation: 'Rotated 90 degrees clockwise.' },
            { input: 'matrix = [[5,1],[4,2]]', output: '[[4,5],[2,1]]', explanation: '2x2 rotation.' }
        ],
        constraints: ['n == matrix.length == matrix[i].length', '1 <= n <= 20', '-1000 <= matrix[i][j] <= 1000'],
        testCases: [
            { input: '{"matrix":[[1,2,3],[4,5,6],[7,8,9]]}', expectedOutput: '[[7,4,1],[8,5,2],[9,6,3]]', isHidden: false },
            { input: '{"matrix":[[5,1],[4,2]]}', expectedOutput: '[[4,5],[2,1]]', isHidden: false },
            { input: '{"matrix":[[1]]}', expectedOutput: '[[1]]', isHidden: true }
        ],
        hints: ['Transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Wipro Turbo Assessment 2025',
        sourceUrl: 'https://careers.wipro.com/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Wipro Turbo 2025 coding round.',
        explanation: 'Transpose matrix across diagonal, then reverse each row horizontally to complete clockwise 90 degree rotation.',
        active: true
    }
];

module.exports = { LTI_HCL_WIPRO_CODING };
