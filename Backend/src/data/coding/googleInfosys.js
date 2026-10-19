/**
 * Coding questions for Google and Infosys (22 questions, 11 each)
 */
const GOOGLE_INFOSYS_CODING = [
    // =========================================================================
    // 7. GOOGLE (11 Questions: GOOG-CODING-001 to GOOG-CODING-011)
    // =========================================================================
    {
        questionId: 'GOOG-CODING-001',
        title: 'Word Search in 2D Character Board',
        slug: 'goog-word-search-grid',
        company: 'Google',
        difficulty: 'Medium',
        topics: ['Graphs', 'Recursion', 'Backtracking'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once.',
        functionSignature: {
            name: 'exist',
            params: [
                { name: 'board', type: 'string[][]' },
                { name: 'word', type: 'string' }
            ],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function exist(board, word) {\n    // Write your code here\n    \n}',
            python: 'def exist(board: list[list[str]], word: str) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true', explanation: '"ABCCED" can be traced along the grid.' },
            { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true', explanation: '"SEE" can be traced.' },
            { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false', explanation: 'Cannot reuse "B".' }
        ],
        constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15'],
        testCases: [
            { input: '{"board":[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"word":"ABCCED"}', expectedOutput: 'true', isHidden: false },
            { input: '{"board":[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"word":"ABCB"}', expectedOutput: 'false', isHidden: false },
            { input: '{"board":[["a"]],"word":"a"}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['Perform DFS backtracking with visited marks in 4 directions.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google SWE Campus Online Assessment',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Google SWE Early Career campus test 2025.',
        explanation: 'Backtracking DFS: mark current board cell visited, explore 4 neighbors for next character, backtrack cell on return.',
        active: true
    },
    {
        questionId: 'GOOG-CODING-002',
        title: 'Longest Substring with At Most K Distinct Characters',
        slug: 'goog-longest-substring-k-distinct',
        company: 'Google',
        difficulty: 'Medium',
        topics: ['Sliding Window', 'Hashing', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a string `s` and an integer `k`, return the length of the longest substring of `s` that contains at most `k` distinct characters.',
        functionSignature: {
            name: 'lengthOfLongestSubstringKDistinct',
            params: [
                { name: 's', type: 'string' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function lengthOfLongestSubstringKDistinct(s, k) {\n    // Write your code here\n    \n}',
            python: 'def lengthOfLongestSubstringKDistinct(s: str, k: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int lengthOfLongestSubstringKDistinct(String s, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstringKDistinct(string s, int k) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 's = "eceba", k = 2', output: '3', explanation: 'T is "ece" which its length is 3.' },
            { input: 's = "aa", k = 1', output: '2', explanation: 'T is "aa" which its length is 2.' }
        ],
        constraints: ['1 <= s.length <= 5 * 10^4', '0 <= k <= 50'],
        testCases: [
            { input: '{"s":"eceba","k":2}', expectedOutput: '3', isHidden: false },
            { input: '{"s":"aa","k":1}', expectedOutput: '2', isHidden: false },
            { input: '{"s":"a","k":0}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Use sliding window with a frequency map to count unique characters in current window.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google SWE Phone Screen',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2025,
        reportedDate: 'Feb 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent Google SWE interview question reported in candidate debriefs.',
        explanation: 'Expand right pointer adding characters to map. When map size > k, shrink left pointer until map size <= k.',
        active: true
    },
    {
        questionId: 'GOOG-CODING-003',
        title: 'Number of Connected Islands in Grid',
        slug: 'goog-number-of-islands',
        company: 'Google',
        difficulty: 'Medium',
        topics: ['Graphs', 'Queue', 'Recursion'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
        functionSignature: {
            name: 'numIslands',
            params: [{ name: 'grid', type: 'string[][]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function numIslands(grid) {\n    // Write your code here\n    \n}',
            python: 'def numIslands(grid: list[list[str]]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: 'Single connected island.' },
            { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: '3 separate islands.' }
        ],
        constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\''],
        testCases: [
            { input: '{"grid":[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]}', expectedOutput: '1', isHidden: false },
            { input: '{"grid":[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]}', expectedOutput: '3', isHidden: false },
            { input: '{"grid":[["0"]]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Traverse the grid; whenever a \'1\' is encountered, increment island count and sink island using BFS or DFS.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google Online Assessment',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Google SWE intern and new grad assessments.',
        explanation: 'Iterate all cells. When encountering \'1\', trigger BFS/DFS marking all connected land cells as visited, and increment count.',
        active: true
    },
    {
        questionId: 'GOOG-CODING-004',
        title: 'Lowest Common Ancestor of Binary Tree',
        slug: 'goog-lowest-common-ancestor-binary-tree',
        company: 'Google',
        difficulty: 'Medium',
        topics: ['Trees', 'Recursion'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a binary tree represented as an array in level order `nodes` (where `-1` represents null) and two node values `p` and `q`, find the lowest common ancestor (LCA) node value of `p` and `q`. The LCA is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants.',
        functionSignature: {
            name: 'lowestCommonAncestor',
            params: [
                { name: 'nodes', type: 'number[]' },
                { name: 'p', type: 'number' },
                { name: 'q', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function lowestCommonAncestor(nodes, p, q) {\n    // Write your code here\n    \n}',
            python: 'def lowestCommonAncestor(nodes: list[int], p: int, q: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int lowestCommonAncestor(int[] nodes, int p, int q) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lowestCommonAncestor(vector<int>& nodes, int p, int q) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'nodes = [3, 5, 1, 6, 2, 0, 8, -1, -1, 7, 4], p = 5, q = 1', output: '3', explanation: 'The LCA of nodes 5 and 1 is 3.' },
            { input: 'nodes = [3, 5, 1, 6, 2, 0, 8, -1, -1, 7, 4], p = 5, q = 4', output: '5', explanation: 'The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself.' }
        ],
        constraints: ['The number of nodes in the tree is in the range [2, 10^5].', '-10^9 <= Node.val <= 10^9', 'All Node.val are unique.'],
        testCases: [
            { input: '{"nodes":[3, 5, 1, 6, 2, 0, 8, -1, -1, 7, 4],"p":5,"q":1}', expectedOutput: '3', isHidden: false },
            { input: '{"nodes":[3, 5, 1, 6, 2, 0, 8, -1, -1, 7, 4],"p":5,"q":4}', expectedOutput: '5', isHidden: false },
            { input: '{"nodes":[1, 2],"p":1,"q":2}', expectedOutput: '1', isHidden: true }
        ],
        hints: ['Recursive DFS: if root is null, p, or q, return root. If both left and right return non-null, root is LCA.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google Technical Interview',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent tree question in Google technical rounds.',
        explanation: 'Post-order traversal: if current node matches p or q, bubble it up. If left and right both return candidates, current node is the LCA.',
        active: true
    },
    {
        questionId: 'GOOG-CODING-005',
        title: 'Meeting Rooms II Minimum Conference Rooms',
        slug: 'goog-meeting-rooms-min-rooms',
        company: 'Google',
        difficulty: 'Medium',
        topics: ['Sorting', 'Greedy', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.',
        functionSignature: {
            name: 'minMeetingRooms',
            params: [{ name: 'intervals', type: 'number[][]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function minMeetingRooms(intervals) {\n    // Write your code here\n    \n}',
            python: 'def minMeetingRooms(intervals: list[list[int]]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int minMeetingRooms(int[][] intervals) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minMeetingRooms(vector<vector<int>>& intervals) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'intervals = [[0,30],[5,10],[15,20]]', output: '2', explanation: 'Two rooms needed at interval [5,10].' },
            { input: 'intervals = [[7,10],[2,4]]', output: '1', explanation: 'Meetings do not overlap, 1 room suffices.' }
        ],
        constraints: ['1 <= intervals.length <= 10^4', '0 <= start_i < end_i <= 10^6'],
        testCases: [
            { input: '{"intervals":[[0,30],[5,10],[15,20]]}', expectedOutput: '2', isHidden: false },
            { input: '{"intervals":[[7,10],[2,4]]}', expectedOutput: '1', isHidden: false },
            { input: '{"intervals":[[1,4],[2,5],[3,6],[4,7]]}', expectedOutput: '3', isHidden: true }
        ],
        hints: ['Separate start and end times into two sorted arrays and use two pointers to track simultaneous active rooms.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google Technical Phone Screen',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2024,
        reportedDate: 'Nov 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Classic Google intervals interview problem.',
        explanation: 'Sort starts and ends separately. Advance start pointer incrementing active rooms; if start >= end, decrement active and advance end pointer.',
        active: true
    },
    {
        questionId: 'GOOG-CODING-006',
        title: 'Evaluate Reverse Polish Notation (RPN)',
        slug: 'goog-evaluate-reverse-polish-notation',
        company: 'Google',
        difficulty: 'Medium',
        topics: ['Stack'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are given an array of strings `tokens` that represents an arithmetic expression in a Reverse Polish Notation. Evaluate the expression and return an integer that represents the value of the expression. Valid operators are \'+\', \'-\', \'*\', and \'/\'. Truncate division toward zero.',
        functionSignature: {
            name: 'evalRPN',
            params: [{ name: 'tokens', type: 'string[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function evalRPN(tokens) {\n    // Write your code here\n    \n}',
            python: 'def evalRPN(tokens: list[str]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int evalRPN(String[] tokens) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int evalRPN(vector<string>& tokens) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'tokens = ["2","1","+","3","*"]', output: '9', explanation: '((2 + 1) * 3) = 9' },
            { input: 'tokens = ["4","13","5","/","+"]', output: '6', explanation: '(4 + (13 / 5)) = 6' }
        ],
        constraints: ['1 <= tokens.length <= 10^4', 'tokens[i] is an operator (\'+\', \'-\', \'*\', \'/\') or an integer in range [-200, 200]'],
        testCases: [
            { input: '{"tokens":["2","1","+","3","*"]}', expectedOutput: '9', isHidden: false },
            { input: '{"tokens":["4","13","5","/","+"]}', expectedOutput: '6', isHidden: false },
            { input: '{"tokens":["10","6","9","3","+","-11","*","/","*","17","+","5","+"]}', expectedOutput: '22', isHidden: true }
        ],
        hints: ['Push numbers to stack; on operator, pop two operands, apply operation, and push result.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google SWE Assessment',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent stack evaluation question in Google rounds.',
        explanation: 'Loop tokens: if number push to stack. If operator pop b then a, evaluate a op b (with Math.trunc for division), and push result.',
        active: true
    },
    {
        questionId: 'GOOG-CODING-007',
        title: 'Kth Largest Element in an Array',
        slug: 'goog-kth-largest-element-array',
        company: 'Google',
        difficulty: 'Medium',
        topics: ['Searching', 'Sorting'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an integer array `nums` and an integer `k`, return the `k-th` largest element in the array. Can you solve it in `O(n)` average time complexity?',
        functionSignature: {
            name: 'findKthLargest',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function findKthLargest(nums, k) {\n    // Write your code here\n    \n}',
            python: 'def findKthLargest(nums: list[int], k: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: '2nd largest element is 5.' },
            { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4', explanation: '4th largest is 4.' }
        ],
        constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
            { input: '{"nums":[3,2,1,5,6,4],"k":2}', expectedOutput: '5', isHidden: false },
            { input: '{"nums":[3,2,3,1,2,4,5,5,6],"k":4}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[1],"k":1}', expectedOutput: '1', isHidden: true }
        ],
        hints: ['Use quickselect algorithm or min-heap of size k.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google SWE Round 1',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Standard algorithmic staple in Google interviews.',
        explanation: 'Sort descending or use QuickSelect: target index is k - 1 in sorted order.',
        active: true
    },
    {
        questionId: 'GOOG-CODING-008',
        title: 'Course Schedule II Topological Sort',
        slug: 'goog-course-schedule-ii-order',
        company: 'Google',
        difficulty: 'Medium',
        topics: ['Graphs', 'Queue'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you must take course `b_i` first if you want to take course `a_i`. Return the ordering of courses you should take to finish all courses. If it is impossible, return an empty array `[]`.',
        functionSignature: {
            name: 'findOrder',
            params: [
                { name: 'numCourses', type: 'number' },
                { name: 'prerequisites', type: 'number[][]' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function findOrder(numCourses, prerequisites) {\n    // Write your code here\n    \n}',
            python: 'def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'numCourses = 2, prerequisites = [[1,0]]', output: '[0,1]', explanation: 'Take course 0 then course 1.' },
            { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0,1,2,3]', explanation: 'A valid course sequence.' }
        ],
        constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= numCourses * (numCourses - 1)'],
        testCases: [
            { input: '{"numCourses":2,"prerequisites":[[1,0]]}', expectedOutput: '[0,1]', isHidden: false },
            { input: '{"numCourses":4,"prerequisites":[[1,0],[2,0],[3,1],[3,2]]}', expectedOutput: '[0,1,2,3]', isHidden: false },
            { input: '{"numCourses":2,"prerequisites":[[1,0],[0,1]]}', expectedOutput: '[]', isHidden: true }
        ],
        hints: ['Kahn\'s algorithm: queue nodes with in-degree 0, append to order, decrement neighbors.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google Technical Assessment',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Topological sort question frequently asked at Google.',
        explanation: 'Compute in-degrees for all courses. Add 0 in-degree nodes to queue. Pop node, add to result, decrement neighbors. If result.length == numCourses return result, else [].',
        active: true
    },
    {
        questionId: 'GOOG-CODING-009',
        title: 'Binary Tree Maximum Path Sum',
        slug: 'goog-binary-tree-max-path-sum',
        company: 'Google',
        difficulty: 'Hard',
        topics: ['Trees', 'Dynamic Programming', 'Recursion'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Given a binary tree represented as an array `root` in level-order (where `-1001` represents null), return the maximum path sum of any non-empty path.',
        functionSignature: {
            name: 'maxPathSum',
            params: [{ name: 'root', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function maxPathSum(root) {\n    // Write your code here\n    \n}',
            python: 'def maxPathSum(root: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int maxPathSum(int[] root) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxPathSum(vector<int>& root) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'root = [1, 2, 3]', output: '6', explanation: 'Path 2 -> 1 -> 3 gives maximum path sum 6.' },
            { input: 'root = [-10, 9, 20, -1001, -1001, 15, 7]', output: '42', explanation: 'Path 15 -> 20 -> 7 gives maximum path sum 15 + 20 + 7 = 42.' }
        ],
        constraints: ['The number of nodes in the tree is in the range [1, 3 * 10^4].', '-1000 <= Node.val <= 1000'],
        testCases: [
            { input: '{"root":[1, 2, 3]}', expectedOutput: '6', isHidden: false },
            { input: '{"root":[-10, 9, 20, -1001, -1001, 15, 7]}', expectedOutput: '42', isHidden: false },
            { input: '{"root":[-3]}', expectedOutput: '-3', isHidden: true }
        ],
        hints: ['At each node, compute max single path = node.val + max(0, max(left, right)). Update global max with node.val + max(0, left) + max(0, right).'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google Onsite Technical Round',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2024,
        reportedDate: 'Dec 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Signature Google tree DP interview question.',
        explanation: 'DFS post-order: calculate gain from left and right child (bounded below by 0). Update global max path sum passing through node, return node.val + max(leftGain, rightGain).',
        active: true
    },
    {
        questionId: 'GOOG-CODING-010',
        title: 'Regular Expression Matching with . and *',
        slug: 'goog-regular-expression-matching',
        company: 'Google',
        difficulty: 'Hard',
        topics: ['Dynamic Programming', 'Recursion', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an input string `s` and a pattern `p`, implement regular expression matching with support for `\'.\'` (matches any single character) and `\'*\'` (matches zero or more of the preceding element). The matching should cover the entire input string (not partial).',
        functionSignature: {
            name: 'isMatch',
            params: [
                { name: 's', type: 'string' },
                { name: 'p', type: 'string' }
            ],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isMatch(s, p) {\n    // Write your code here\n    \n}',
            python: 'def isMatch(s: str, p: str) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isMatch(String s, String p) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isMatch(string s, string p) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 's = "aa", p = "a"', output: 'false', explanation: '"a" does not match the entire string "aa".' },
            { input: 's = "aa", p = "a*"', output: 'true', explanation: '\'*\' means zero or more of preceding element \'a\'.' },
            { input: 's = "ab", p = ".*"', output: 'true', explanation: '".*" means zero or more of any character.' }
        ],
        constraints: ['1 <= s.length <= 20', '1 <= p.length <= 20', 's contains lowercase English letters.', 'p contains lowercase letters, \'.\', and \'*\''],
        testCases: [
            { input: '{"s":"aa","p":"a"}', expectedOutput: 'false', isHidden: false },
            { input: '{"s":"aa","p":"a*"}', expectedOutput: 'true', isHidden: false },
            { input: '{"s":"ab","p":".*"}', expectedOutput: 'true', isHidden: false },
            { input: '{"s":"aab","p":"c*a*b"}', expectedOutput: 'true', isHidden: true }
        ],
        hints: ['Use 2D DP table dp[i][j] representing if s[0..i] matches p[0..j].'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google SWE Technical Round',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Classic Google hard dynamic programming problem.',
        explanation: '2D DP where dp[i][j] matches s[:i] and p[:j]. Handle \'*\' by considering 0 occurrences dp[i][j-2] or 1+ occurrences if preceding char matches.',
        active: true
    },
    {
        questionId: 'GOOG-CODING-011',
        title: 'LRU Cache Eviction and Lookup Logic',
        slug: 'goog-lru-cache-logic',
        company: 'Google',
        difficulty: 'Hard',
        topics: ['Linked List', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Given an array of string commands `operations` and parameter arrays `params` for `["LRUCache", "put", "get", ...]` where capacity is given in the first command, return the outputs from all `"get"` queries in an array.',
        functionSignature: {
            name: 'simulateLRU',
            params: [
                { name: 'operations', type: 'string[]' },
                { name: 'params', type: 'number[][]' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function simulateLRU(operations, params) {\n    // Write your code here\n    \n}',
            python: 'def simulateLRU(operations: list[str], params: list[list[int]]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public List<Integer> simulateLRU(String[] operations, int[][] params) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}',
            cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> simulateLRU(vector<string>& operations, vector<vector<int>>& params) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'operations = ["LRUCache","put","put","get","put","get","put","get","get","get"], params = [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', output: '[1,-1,-1,3,4]', explanation: 'get(1)->1, get(2)->-1 (evicted), get(1)->-1, get(3)->3, get(4)->4.' }
        ],
        constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5'],
        testCases: [
            { input: '{"operations":["LRUCache","put","put","get","put","get","put","get","get","get"],"params":[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]}', expectedOutput: '[1,-1,-1,3,4]', isHidden: false },
            { input: '{"operations":["LRUCache","put","get"],"params":[[1],[2,5],[2]]}', expectedOutput: '[5]', isHidden: true }
        ],
        hints: ['Use Hash Map combined with Doubly Linked List to achieve O(1) get and put.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Google System & Algorithmic Interview',
        sourceUrl: 'https://careers.google.com/',
        reportedYear: 2024,
        reportedDate: 'Sep 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent system/data structure problem in Google candidate debriefs.',
        explanation: 'Doubly linked list with dummy head and tail, paired with hash map storing node references for O(1) lookup, deletion, and insertion.',
        active: true
    },

    // =========================================================================
    // 8. INFOSYS (11 Questions: INF-CODING-001 to INF-CODING-011)
    // =========================================================================
    {
        questionId: 'INF-CODING-001',
        title: 'RPG Monster Battle Energy Greedy Game',
        slug: 'inf-rpg-monster-battle-greedy',
        company: 'Infosys',
        difficulty: 'Medium',
        topics: ['Greedy', 'Sorting'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are playing an RPG game. You have an initial experience `e`. There are `n` monsters, where monster `i` requires `power[i]` to defeat. Defeating monster `i` awards you `bonus[i]` experience. Return the maximum number of monsters you can defeat if you choose the battle order optimally.',
        functionSignature: {
            name: 'maxMonstersDefeated',
            params: [
                { name: 'n', type: 'number' },
                { name: 'e', type: 'number' },
                { name: 'power', type: 'number[]' },
                { name: 'bonus', type: 'number[]' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function maxMonstersDefeated(n, e, power, bonus) {\n    // Write your code here\n    \n}',
            python: 'def maxMonstersDefeated(n: int, e: int, power: list[int], bonus: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int maxMonstersDefeated(int n, int e, int[] power, int[] bonus) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxMonstersDefeated(int n, int e, vector<int>& power, vector<int>& bonus) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'n = 2, e = 123, power = [78, 130], bonus = [10, 0]', output: '2', explanation: 'Defeat monster 0 (power 78 <= 123), experience becomes 123 + 10 = 133. Now 133 >= 130, defeat monster 1. Total = 2.' },
            { input: 'n = 3, e = 100, power = [101, 100, 304], bonus = [100, 1, 524]', output: '2', explanation: 'Defeat monster 1 (power 100 <= 100), exp = 101. Defeat monster 0 (power 101 <= 101), exp = 201. Monster 2 needs 304, cannot defeat. Total = 2.' }
        ],
        constraints: ['1 <= n <= 10^5', '1 <= e <= 10^9', '1 <= power[i], bonus[i] <= 10^9'],
        testCases: [
            { input: '{"n":2,"e":123,"power":[78, 130],"bonus":[10, 0]}', expectedOutput: '2', isHidden: false },
            { input: '{"n":3,"e":100,"power":[101, 100, 304],"bonus":[100, 1, 524]}', expectedOutput: '2', isHidden: false },
            { input: '{"n":1,"e":50,"power":[100],"bonus":[10]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Pair each monster\'s power and bonus, sort ascending by required power, then greedily defeat from easiest to hardest.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys Specialist Programmer (SP) Exam',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Signature Infosys RPG problem reported in DSE/SP 2025 recruitment test.',
        explanation: 'Sort monsters ascending by required power. Greedily defeat every monster whose power <= current experience, adding its bonus. Stop when experience is insufficient.',
        active: true
    },
    {
        questionId: 'INF-CODING-002',
        title: 'Unique Paths from Top-Left to Bottom-Right',
        slug: 'inf-unique-paths-grid',
        company: 'Infosys',
        difficulty: 'Medium',
        topics: ['Dynamic Programming', 'Mathematics'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'There is a robot on an `m x n` grid. The robot is initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of possible unique paths.',
        functionSignature: {
            name: 'uniquePaths',
            params: [
                { name: 'm', type: 'number' },
                { name: 'n', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function uniquePaths(m, n) {\n    // Write your code here\n    \n}',
            python: 'def uniquePaths(m: int, n: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int uniquePaths(int m, int n) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'm = 3, n = 7', output: '28', explanation: '28 distinct paths.' },
            { input: 'm = 3, n = 2', output: '3', explanation: 'Down->Right->Down, Down->Down->Right, Right->Down->Down.' }
        ],
        constraints: ['1 <= m, n <= 100'],
        testCases: [
            { input: '{"m":3,"n":7}', expectedOutput: '28', isHidden: false },
            { input: '{"m":3,"n":2}', expectedOutput: '3', isHidden: false },
            { input: '{"m":1,"n":1}', expectedOutput: '1', isHidden: true }
        ],
        hints: ['dp[i][j] = dp[i-1][j] + dp[i][j-1] with first row and column initialized to 1.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys HackWithInfy Round 1',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Jul 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent dynamic programming question in HackWithInfy.',
        explanation: 'Dynamic programming grid: paths to (i, j) is sum of paths to (i-1, j) and (i, j-1). Can also be solved using combinatorics C(m+n-2, m-1).',
        active: true
    },
    {
        questionId: 'INF-CODING-003',
        title: 'Minimum Deletions to Make Character Frequencies Unique',
        slug: 'inf-min-deletions-unique-frequencies',
        company: 'Infosys',
        difficulty: 'Medium',
        topics: ['Greedy', 'Hashing', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'A string `s` is called good if there are no two different characters in `s` that have the same frequency. Given a string `s`, return the minimum number of characters you need to delete to make `s` good.',
        functionSignature: {
            name: 'minDeletions',
            params: [{ name: 's', type: 'string' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function minDeletions(s) {\n    // Write your code here\n    \n}',
            python: 'def minDeletions(s: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int minDeletions(String s) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minDeletions(string s) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 's = "aab"', output: '0', explanation: 'Frequencies 2 and 1 are already unique.' },
            { input: 's = "aaabbbcc"', output: '2', explanation: 'Delete 1 \'b\' and 1 \'c\' (frequencies 3, 2, 1).' },
            { input: 's = "ceabaacb"', output: '2', explanation: 'Delete 2 characters.' }
        ],
        constraints: ['1 <= s.length <= 10^5', 's contains lowercase English letters only.'],
        testCases: [
            { input: '{"s":"aab"}', expectedOutput: '0', isHidden: false },
            { input: '{"s":"aaabbbcc"}', expectedOutput: '2', isHidden: false },
            { input: '{"s":"ceabaacb"}', expectedOutput: '2', isHidden: false },
            { input: '{"s":"bbcebab"}', expectedOutput: '2', isHidden: true }
        ],
        hints: ['Count character frequencies, then use a hash set of used frequencies, decrementing duplicate frequencies until unique or 0.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys DSE Coding Assessment',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in Infosys Digital Specialist Engineer campus test 2025.',
        explanation: 'Compute frequencies of all letters. Iterate through frequencies: while frequency > 0 and already in usedSet, decrement frequency and count deletions. Add final frequency to usedSet.',
        active: true
    },
    {
        questionId: 'INF-CODING-004',
        title: 'Longest Increasing Subsequence Length',
        slug: 'inf-longest-increasing-subsequence',
        company: 'Infosys',
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
            { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'The longest increasing subsequence is [2,3,7,101], length 4.' },
            { input: 'nums = [0,1,0,3,2,3]', output: '4', explanation: 'Subsequence [0,1,2,3] has length 4.' }
        ],
        constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
            { input: '{"nums":[10,9,2,5,3,7,101,18]}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[0,1,0,3,2,3]}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[7,7,7,7,7]}', expectedOutput: '1', isHidden: true }
        ],
        hints: ['Use binary search (patience sorting) to maintain the smallest tail of all increasing subsequences of length i.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys Specialist Programmer Test',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Nov 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent question in Infosys 9.5 LPA SP track assessment.',
        explanation: 'Patience sorting / binary search: maintain tails array. For each x in nums, find position via binary search and replace or append. Length of tails is LIS.',
        active: true
    },
    {
        questionId: 'INF-CODING-005',
        title: 'Minimum Jumps to Reach Last Index II',
        slug: 'inf-jump-game-ii-min-jumps',
        company: 'Infosys',
        difficulty: 'Medium',
        topics: ['Greedy', 'Dynamic Programming', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at `nums[0]`. Each element `nums[i]` represents the maximum length of a forward jump from index `i`. Return the minimum number of jumps to reach `nums[n - 1]`. You can assume that you can always reach the last index.',
        functionSignature: {
            name: 'jump',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function jump(nums) {\n    // Write your code here\n    \n}',
            python: 'def jump(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int jump(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int jump(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [2,3,1,1,4]', output: '2', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
            { input: 'nums = [2,3,0,1,4]', output: '2', explanation: '2 jumps minimum.' }
        ],
        constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 1000'],
        testCases: [
            { input: '{"nums":[2,3,1,1,4]}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[2,3,0,1,4]}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[1]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['BFS window traversal: update currentEnd with farthest reachable at the end of each jump window.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys HackWithInfy Grand Finale',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Asked in HackWithInfy placement evaluation round.',
        explanation: 'Maintain currentEnd and farthest. When index reaches currentEnd, increment jumps and set currentEnd = farthest.',
        active: true
    },
    {
        questionId: 'INF-CODING-006',
        title: 'Total Count of Subarrays with Sum K',
        slug: 'inf-subarray-sum-equals-k',
        company: 'Infosys',
        difficulty: 'Medium',
        topics: ['Hashing', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.',
        functionSignature: {
            name: 'subarraySumEqualsK',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'k', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function subarraySumEqualsK(nums, k) {\n    // Write your code here\n    \n}',
            python: 'def subarraySumEqualsK(nums: list[int], k: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int subarraySumEqualsK(int[] nums, int k) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int subarraySumEqualsK(vector<int>& nums, int k) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 1, 1], k = 2', output: '2', explanation: 'Subarrays [1,1] at [0,1] and [1,2].' },
            { input: 'nums = [1, 2, 3], k = 3', output: '2', explanation: 'Subarrays [1,2] and [3].' }
        ],
        constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
        testCases: [
            { input: '{"nums":[1, 1, 1],"k":2}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[1, 2, 3],"k":3}', expectedOutput: '2', isHidden: false },
            { input: '{"nums":[1,-1,0],"k":0}', expectedOutput: '3', isHidden: true }
        ],
        hints: ['Hash map of prefix sums: add freq[prefixSum - k] to total at each step.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys DSE Technical Assessment',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Oct 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent array hashing problem in Infosys placement papers.',
        explanation: 'Store prefix sums count in hash map with base case {0: 1}. For each element, add map.get(prefixSum - k) to answer, then increment map.get(prefixSum).',
        active: true
    },
    {
        questionId: 'INF-CODING-007',
        title: 'Binary Tree Level Order Traversal',
        slug: 'inf-binary-tree-level-order-traversal',
        company: 'Infosys',
        difficulty: 'Medium',
        topics: ['Trees', 'Queue'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given the binary tree represented as an array in level order `root` (where `-1001` represents null), return the level order traversal of its nodes\' values (i.e., from left to right, level by level) as a 2D array.',
        functionSignature: {
            name: 'levelOrder',
            params: [{ name: 'root', type: 'number[]' }],
            returnType: 'number[][]'
        },
        starterCode: {
            javascript: 'function levelOrder(root) {\n    // Write your code here\n    \n}',
            python: 'def levelOrder(root: list[int]) -> list[list[int]]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public List<List<Integer>> levelOrder(int[] root) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(vector<int>& root) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'root = [3, 9, 20, -1001, -1001, 15, 7]', output: '[[3],[9,20],[15,7]]', explanation: 'Grouped by tree levels.' },
            { input: 'root = [1]', output: '[[1]]', explanation: 'Single node.' }
        ],
        constraints: ['0 <= root.length <= 2000'],
        testCases: [
            { input: '{"root":[3, 9, 20, -1001, -1001, 15, 7]}', expectedOutput: '[[3],[9,20],[15,7]]', isHidden: false },
            { input: '{"root":[1]}', expectedOutput: '[[1]]', isHidden: false },
            { input: '{"root":[]}', expectedOutput: '[]', isHidden: true }
        ],
        hints: ['Use BFS with a queue. Process nodes level by level using queue length at the start of each level.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys DSE Technical Round',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Sep 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Standard binary tree BFS question in Infosys interviews.',
        explanation: 'BFS with queue: at each level, iterate queue.size times, popping nodes and adding their values to the current level array.',
        active: true
    },
    {
        questionId: 'INF-CODING-008',
        title: 'House Robber Maximum Loot Value',
        slug: 'inf-house-robber-max-loot',
        company: 'Infosys',
        difficulty: 'Medium',
        topics: ['Dynamic Programming', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and will alert police if two adjacent houses were broken into on the same night. Given an integer array `nums` representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.',
        functionSignature: {
            name: 'rob',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function rob(nums) {\n    // Write your code here\n    \n}',
            python: 'def rob(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int rob(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int rob(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [1, 2, 3, 1]', output: '4', explanation: 'Rob house 1 (money = 1) and then house 3 (money = 3). Total = 1 + 3 = 4.' },
            { input: 'nums = [2, 7, 9, 3, 1]', output: '12', explanation: 'Rob house 1 (money = 2), house 3 (money = 9) and house 5 (money = 1). Total = 2 + 9 + 1 = 12.' }
        ],
        constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
        testCases: [
            { input: '{"nums":[1, 2, 3, 1]}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[2, 7, 9, 3, 1]}', expectedOutput: '12', isHidden: false },
            { input: '{"nums":[0]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Space can be optimized to O(1) using two variables.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys Specialist Programmer Test',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Aug 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent dynamic programming interview problem.',
        explanation: 'Maintain rob1 and rob2: for each num, newRob = max(num + rob1, rob2), rob1 = rob2, rob2 = newRob. Return rob2.',
        active: true
    },
    {
        questionId: 'INF-CODING-009',
        title: 'Maximum Sum Increasing Subsequence',
        slug: 'inf-max-sum-increasing-subsequence',
        company: 'Infosys',
        difficulty: 'Medium',
        topics: ['Dynamic Programming', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given an array `arr` of `n` positive integers, find the maximum sum of an increasing subsequence of the given array.',
        functionSignature: {
            name: 'maxSumIS',
            params: [{ name: 'arr', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function maxSumIS(arr) {\n    // Write your code here\n    \n}',
            python: 'def maxSumIS(arr: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int maxSumIS(int[] arr) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSumIS(vector<int>& arr) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'arr = [1, 101, 2, 3, 100]', output: '106', explanation: 'The maximum sum subsequence is [1, 2, 3, 100] summing to 106.' },
            { input: 'arr = [1, 2, 3]', output: '6', explanation: 'All elements form an increasing sequence 1 + 2 + 3 = 6.' }
        ],
        constraints: ['1 <= arr.length <= 10^3', '1 <= arr[i] <= 10^5'],
        testCases: [
            { input: '{"arr":[1, 101, 2, 3, 100]}', expectedOutput: '106', isHidden: false },
            { input: '{"arr":[1, 2, 3]}', expectedOutput: '6', isHidden: false },
            { input: '{"arr":[10, 5, 4, 3]}', expectedOutput: '10', isHidden: true }
        ],
        hints: ['Initialize msis with arr values. For each i, check all j < i with arr[j] < arr[i] and update msis[i] = max(msis[i], msis[j] + arr[i]).'],
        sourceType: 'pattern_based',
        sourceName: 'Infosys Assessment Pattern',
        sourceUrl: 'https://www.infosys.com/',
        reportedYear: null,
        reportedDate: null,
        yearConfidence: 'UNKNOWN',
        verificationStatus: 'PATTERN_BASED',
        sourceNotes: 'Pattern based on Infosys LIS variation problems.',
        explanation: 'Let dp[i] be the maximum sum of an increasing subsequence ending at index i. dp[i] = arr[i] + max(dp[j]) for j < i where arr[j] < arr[i].',
        active: true
    },
    {
        questionId: 'INF-CODING-010',
        title: 'Minimum Window Substring Containing Characters',
        slug: 'inf-minimum-window-substring',
        company: 'Infosys',
        difficulty: 'Hard',
        topics: ['Sliding Window', 'Hashing', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return the empty string `""`.',
        functionSignature: {
            name: 'minWindow',
            params: [
                { name: 's', type: 'string' },
                { name: 't', type: 'string' }
            ],
            returnType: 'string'
        },
        starterCode: {
            javascript: 'function minWindow(s, t) {\n    // Write your code here\n    \n}',
            python: 'def minWindow(s: str, t: str) -> str:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public String minWindow(String s, String t) {\n        // Write your code here\n        return "";\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string minWindow(string s, string t) {\n        // Write your code here\n        return "";\n    }\n};'
        },
        examples: [
            { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: '"BANC" includes \'A\', \'B\', and \'C\' in length 4.' },
            { input: 's = "a", t = "a"', output: '"a"', explanation: 'Entire string matches.' },
            { input: 's = "a", t = "aa"', output: '""', explanation: 'Both \'a\'s cannot be found in s.' }
        ],
        constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
        testCases: [
            { input: '{"s":"ADOBECODEBANC","t":"ABC"}', expectedOutput: '"BANC"', isHidden: false },
            { input: '{"s":"a","t":"a"}', expectedOutput: '"a"', isHidden: false },
            { input: '{"s":"a","t":"aa"}', expectedOutput: '""', isHidden: false }
        ],
        hints: ['Use sliding window with two pointers and a map of target frequencies.'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys Specialist Programmer Round',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2025,
        reportedDate: 'Jan 2025',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Reported in Infosys SP 2025 coding round.',
        explanation: 'Maintain window character counts. Expand right until all characters of t are satisfied; shrink left to find minimal valid substring.',
        active: true
    },
    {
        questionId: 'INF-CODING-011',
        title: 'Find Median from Data Stream',
        slug: 'inf-median-data-stream',
        company: 'Infosys',
        difficulty: 'Hard',
        topics: ['Searching', 'Sorting'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        description: 'Given a stream of integers `stream`, calculate the median after every insertion and return an array of medians formatted as floats rounded to 1 decimal place.',
        functionSignature: {
            name: 'streamMedians',
            params: [{ name: 'stream', type: 'number[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function streamMedians(stream) {\n    // Write your code here\n    \n}',
            python: 'def streamMedians(stream: list[int]) -> list[float]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public double[] streamMedians(int[] stream) {\n        // Write your code here\n        return new double[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<double> streamMedians(vector<int>& stream) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'stream = [5, 15, 1, 3]', output: '[5.0, 10.0, 5.0, 4.0]', explanation: '[5]->5.0; [5,15]->10.0; [1,5,15]->5.0; [1,3,5,15]->4.0.' }
        ],
        constraints: ['1 <= stream.length <= 10^4', '-10^5 <= stream[i] <= 10^5'],
        testCases: [
            { input: '{"stream":[5, 15, 1, 3]}', expectedOutput: '[5,10,5,4]', isHidden: false },
            { input: '{"stream":[2, 2, 2]}', expectedOutput: '[2,2,2]', isHidden: true }
        ],
        hints: ['Use binary insertion or two heaps (max-heap for lower half, min-heap for upper half).'],
        sourceType: 'candidate_interview_experience',
        sourceName: 'Infosys SP Assessment',
        sourceUrl: 'https://www.infosys.com/careers/',
        reportedYear: 2024,
        reportedDate: 'Nov 2024',
        yearConfidence: 'VERIFIED',
        verificationStatus: 'REPORTED',
        sourceNotes: 'Frequent question in Infosys Specialist Programmer test.',
        explanation: 'Insert into sorted array or balance between max-heap (smaller half) and min-heap (larger half) to get median in O(1) query time.',
        active: true
    }
];

module.exports = { GOOGLE_INFOSYS_CODING };
