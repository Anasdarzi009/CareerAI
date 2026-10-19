const CodingQuestion = require('../models/codingQuestion.model');

const CODING_QUESTIONS = [
    // ── 1. Easy: Two Sum (Arrays / Hashing) ──────────────────────────────────
    {
        title: 'Two Sum Target Indices',
        slug: 'two-sum-target-indices',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
        difficulty: 'Easy',
        topics: ['Arrays', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'twoSum',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'target', type: 'number' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function twoSum(nums, target) {\n    // Write your code here\n    \n}',
            python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6.' }
        ],
        constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9',
            'Only one valid answer exists.'
        ],
        testCases: [
            { input: '{"nums":[2,7,11,15],"target":9}', expectedOutput: '[0,1]', isHidden: false },
            { input: '{"nums":[3,2,4],"target":6}', expectedOutput: '[1,2]', isHidden: false },
            { input: '{"nums":[3,3],"target":6}', expectedOutput: '[0,1]', isHidden: true },
            { input: '{"nums":[1,5,8,12,20],"target":25}', expectedOutput: '[1,4]', isHidden: true }
        ],
        hints: ['Use a hash map to look up the complement in O(1) time.'],
        isDemo: true,
        active: true
    },

    // ── 2. Easy: Valid Palindrome (Strings / Two Pointers) ────────────────────
    {
        title: 'Valid Palindrome String',
        slug: 'valid-palindrome-string',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
        difficulty: 'Easy',
        topics: ['Strings', 'Two Pointers'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'isPalindrome',
            params: [{ name: 's', type: 'string' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isPalindrome(s) {\n    // Write your code here\n    \n}',
            python: 'def isPalindrome(s: str) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
            { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
        ],
        constraints: [
            '1 <= s.length <= 2 * 10^5',
            's consists only of printable ASCII characters.'
        ],
        testCases: [
            { input: '{"s":"A man, a plan, a canal: Panama"}', expectedOutput: 'true', isHidden: false },
            { input: '{"s":"race a car"}', expectedOutput: 'false', isHidden: false },
            { input: '{"s":" "}', expectedOutput: 'true', isHidden: true },
            { input: '{"s":"0P"}', expectedOutput: 'false', isHidden: true }
        ],
        hints: ['Use two pointers converging from both ends, skipping non-alphanumeric characters.'],
        isDemo: true,
        active: true
    },

    // ── 3. Easy: Valid Parentheses (Stack) ────────────────────────────────────
    {
        title: 'Valid Parentheses Matching',
        slug: 'valid-parentheses-matching',
        description: 'Given a string `s` containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
        difficulty: 'Easy',
        topics: ['Stack', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'isValid',
            params: [{ name: 's', type: 'string' }],
            returnType: 'boolean'
        },
        starterCode: {
            javascript: 'function isValid(s) {\n    // Write your code here\n    \n}',
            python: 'def isValid(s: str) -> bool:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public boolean isValid(String s) {\n        // Write your code here\n        return false;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        // Write your code here\n        return false;\n    }\n};'
        },
        examples: [
            { input: 's = "()"', output: 'true', explanation: 'Matching pair.' },
            { input: 's = "()[]{}"', output: 'true', explanation: 'All matching in order.' },
            { input: 's = "(]"', output: 'false', explanation: 'Mismatched closing bracket.' }
        ],
        constraints: [
            '1 <= s.length <= 10^4',
            's consists of parentheses only \'()[]{}\'.'
        ],
        testCases: [
            { input: '{"s":"()"}', expectedOutput: 'true', isHidden: false },
            { input: '{"s":"()[]{}"}', expectedOutput: 'true', isHidden: false },
            { input: '{"s":"(]"}', expectedOutput: 'false', isHidden: true },
            { input: '{"s":"([)]"}', expectedOutput: 'false', isHidden: true }
        ],
        hints: ['Push opening brackets onto a stack; pop and verify match upon encountering closing bracket.'],
        isDemo: true,
        active: true
    },

    // ── 4. Easy: Best Time to Buy and Sell Stock (Arrays / Greedy) ────────────
    {
        title: 'Best Time to Buy and Sell Stock',
        slug: 'best-time-to-buy-and-sell-stock',
        description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.',
        difficulty: 'Easy',
        topics: ['Arrays', 'Greedy'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'maxProfit',
            params: [{ name: 'prices', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function maxProfit(prices) {\n    // Write your code here\n    \n}',
            python: 'def maxProfit(prices: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
            { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and max profit = 0.' }
        ],
        constraints: [
            '1 <= prices.length <= 10^5',
            '0 <= prices[i] <= 10^4'
        ],
        testCases: [
            { input: '{"prices":[7,1,5,3,6,4]}', expectedOutput: '5', isHidden: false },
            { input: '{"prices":[7,6,4,3,1]}', expectedOutput: '0', isHidden: false },
            { input: '{"prices":[2,4,1]}', expectedOutput: '2', isHidden: true },
            { input: '{"prices":[3,2,6,5,0,3]}', expectedOutput: '4', isHidden: true }
        ],
        hints: ['Track the minimum price seen so far and calculate profit for each subsequent price.'],
        isDemo: true,
        active: true
    },

    // ── 5. Easy: Binary Search (Searching) ────────────────────────────────────
    {
        title: 'Binary Search Sorted Array',
        slug: 'binary-search-sorted-array',
        description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
        difficulty: 'Easy',
        topics: ['Searching', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
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
            { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
            { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
        ],
        constraints: [
            '1 <= nums.length <= 10^4',
            '-10^4 < nums[i], target < 10^4',
            'All the integers in nums are unique.',
            'nums is sorted in ascending order.'
        ],
        testCases: [
            { input: '{"nums":[-1,0,3,5,9,12],"target":9}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[-1,0,3,5,9,12],"target":2}', expectedOutput: '-1', isHidden: false },
            { input: '{"nums":[5],"target":5}', expectedOutput: '0', isHidden: true },
            { input: '{"nums":[2,5],"target":0}', expectedOutput: '-1', isHidden: true }
        ],
        hints: ['Maintain left and right boundaries and inspect middle element.'],
        isDemo: true,
        active: true
    },

    // ── 6. Easy: Merge Two Sorted Arrays (Sorting / Two Pointers) ─────────────
    {
        title: 'Merge Sorted Arrays Into New Sequence',
        slug: 'merge-sorted-arrays',
        description: 'You are given two integer arrays `nums1` and `nums2`, both sorted in non-decreasing order. Merge `nums1` and `nums2` into a single, combined array sorted in non-decreasing order, and return it.',
        difficulty: 'Easy',
        topics: ['Sorting', 'Two Pointers', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'mergeSorted',
            params: [
                { name: 'nums1', type: 'number[]' },
                { name: 'nums2', type: 'number[]' }
            ],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function mergeSorted(nums1, nums2) {\n    // Write your code here\n    \n}',
            python: 'def mergeSorted(nums1: list[int], nums2: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] mergeSorted(int[] nums1, int[] nums2) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> mergeSorted(vector<int>& nums1, vector<int>& nums2) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums1 = [1,2,3], nums2 = [2,5,6]', output: '[1,2,2,3,5,6]', explanation: 'Combined sorted array.' },
            { input: 'nums1 = [], nums2 = [1]', output: '[1]', explanation: 'Merged single element.' }
        ],
        constraints: [
            '0 <= nums1.length, nums2.length <= 1000',
            '-10^9 <= nums1[i], nums2[i] <= 10^9'
        ],
        testCases: [
            { input: '{"nums1":[1,2,3],"nums2":[2,5,6]}', expectedOutput: '[1,2,2,3,5,6]', isHidden: false },
            { input: '{"nums1":[],"nums2":[1]}', expectedOutput: '[1]', isHidden: false },
            { input: '{"nums1":[4,5,6],"nums2":[1,2,3]}', expectedOutput: '[1,2,3,4,5,6]', isHidden: true }
        ],
        hints: ['Use two pointers to compare elements at the current head of each list.'],
        isDemo: true,
        active: true
    },

    // ── 7. Easy: Invert Binary Tree / Reverse List (Recursion / Trees) ────────
    {
        title: 'Fibonacci Sequence Number',
        slug: 'fibonacci-sequence-number',
        description: 'The Fibonacci numbers, commonly denoted `F(n)` form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from `0` and `1`. That is:\n`F(0) = 0, F(1) = 1`\n`F(n) = F(n - 1) + F(n - 2)`, for `n > 1`.\n\nGiven `n`, calculate `F(n)`.',
        difficulty: 'Easy',
        topics: ['Recursion', 'Dynamic Programming'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'fib',
            params: [{ name: 'n', type: 'number' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function fib(n) {\n    // Write your code here\n    \n}',
            python: 'def fib(n: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int fib(int n) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: 'class Solution {\npublic:\n    int fib(int n) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
            { input: 'n = 3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.' },
            { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' }
        ],
        constraints: ['0 <= n <= 30'],
        testCases: [
            { input: '{"n":2}', expectedOutput: '1', isHidden: false },
            { input: '{"n":3}', expectedOutput: '2', isHidden: false },
            { input: '{"n":4}', expectedOutput: '3', isHidden: false },
            { input: '{"n":10}', expectedOutput: '55', isHidden: true },
            { input: '{"n":20}', expectedOutput: '6765', isHidden: true }
        ],
        hints: ['Use iteration or memoization to compute the result in O(n) time instead of naive 2^n.'],
        isDemo: true,
        active: true
    },

    // ── 8. Medium: Longest Substring Without Repeating Characters (Sliding Window / Strings) ─
    {
        title: 'Longest Substring Without Repeating Characters',
        slug: 'longest-substring-without-repeating-characters',
        description: 'Given a string `s`, find the length of the longest substring without duplicate characters.',
        difficulty: 'Medium',
        topics: ['Sliding Window', 'Strings', 'Hashing'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'lengthOfLongestSubstring',
            params: [{ name: 's', type: 'string' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function lengthOfLongestSubstring(s) {\n    // Write your code here\n    \n}',
            python: 'def lengthOfLongestSubstring(s: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
            { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
            { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
        ],
        constraints: [
            '0 <= s.length <= 5 * 10^4',
            's consists of English letters, digits, symbols and spaces.'
        ],
        testCases: [
            { input: '{"s":"abcabcbb"}', expectedOutput: '3', isHidden: false },
            { input: '{"s":"bbbbb"}', expectedOutput: '1', isHidden: false },
            { input: '{"s":"pwwkew"}', expectedOutput: '3', isHidden: false },
            { input: '{"s":""}', expectedOutput: '0', isHidden: true },
            { input: '{"s":"au"}', expectedOutput: '2', isHidden: true }
        ],
        hints: ['Use a sliding window with two pointers and a set or map to track characters.'],
        isDemo: true,
        active: true
    },

    // ── 9. Medium: Container With Most Water (Two Pointers / Greedy) ──────────
    {
        title: 'Container With Most Water',
        slug: 'container-with-most-water',
        description: 'You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.',
        difficulty: 'Medium',
        topics: ['Two Pointers', 'Greedy', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'maxArea',
            params: [{ name: 'height', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function maxArea(height) {\n    // Write your code here\n    \n}',
            python: 'def maxArea(height: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int maxArea(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The max area is between index 1 and 8 (min(8,7) * (8-1) = 49).' },
            { input: 'height = [1,1]', output: '1', explanation: 'min(1,1) * 1 = 1.' }
        ],
        constraints: [
            'n == height.length',
            '2 <= n <= 10^5',
            '0 <= height[i] <= 10^4'
        ],
        testCases: [
            { input: '{"height":[1,8,6,2,5,4,8,3,7]}', expectedOutput: '49', isHidden: false },
            { input: '{"height":[1,1]}', expectedOutput: '1', isHidden: false },
            { input: '{"height":[4,3,2,1,4]}', expectedOutput: '16', isHidden: true },
            { input: '{"height":[1,2,1]}', expectedOutput: '2', isHidden: true }
        ],
        hints: ['Start with the widest container (pointers at both ends) and move the pointer pointing to the shorter line.'],
        isDemo: true,
        active: true
    },

    // ── 10. Medium: 3Sum (Two Pointers / Sorting) ─────────────────────────────
    {
        title: 'Three Sum Triplet Zero',
        slug: 'three-sum-triplet-zero',
        description: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets. Sort the triplets ascendingly.',
        difficulty: 'Medium',
        topics: ['Two Pointers', 'Sorting', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'threeSum',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number[][]'
        },
        starterCode: {
            javascript: 'function threeSum(nums) {\n    // Write your code here\n    \n}',
            python: 'def threeSum(nums: list[int]) -> list[list[int]]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Triplets summing to zero.' },
            { input: 'nums = [0,1,1]', output: '[]', explanation: 'No triplet sums to 0.' }
        ],
        constraints: [
            '3 <= nums.length <= 3000',
            '-10^5 <= nums[i] <= 10^5'
        ],
        testCases: [
            { input: '{"nums":[-1,0,1,2,-1,-4]}', expectedOutput: '[[-1,-1,2],[-1,0,1]]', isHidden: false },
            { input: '{"nums":[0,1,1]}', expectedOutput: '[]', isHidden: false },
            { input: '{"nums":[0,0,0]}', expectedOutput: '[[0,0,0]]', isHidden: true }
        ],
        hints: ['Sort the array first, iterate one element and use two pointers for the remaining two.'],
        isDemo: true,
        active: true
    },

    // ── 11. Medium: Maximum Subarray (Dynamic Programming / Arrays) ───────────
    {
        title: 'Maximum Subarray Kadane',
        slug: 'maximum-subarray-kadane',
        description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
        difficulty: 'Medium',
        topics: ['Dynamic Programming', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'maxSubArray',
            params: [{ name: 'nums', type: 'number[]' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function maxSubArray(nums) {\n    // Write your code here\n    \n}',
            python: 'def maxSubArray(nums: list[int]) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
            { input: 'nums = [1]', output: '1', explanation: 'Single element.' },
            { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'Sum of all elements is 23.' }
        ],
        constraints: [
            '1 <= nums.length <= 10^5',
            '-10^4 <= nums[i] <= 10^4'
        ],
        testCases: [
            { input: '{"nums":[-2,1,-3,4,-1,2,1,-5,4]}', expectedOutput: '6', isHidden: false },
            { input: '{"nums":[1]}', expectedOutput: '1', isHidden: false },
            { input: '{"nums":[5,4,-1,7,8]}', expectedOutput: '23', isHidden: false },
            { input: '{"nums":[-1]}', expectedOutput: '-1', isHidden: true },
            { input: '{"nums":[-2,-1]}', expectedOutput: '-1', isHidden: true }
        ],
        hints: ['Use Kadane\'s Algorithm: current_max = max(nums[i], current_max + nums[i]).'],
        isDemo: true,
        active: true
    },

    // ── 12. Medium: Group Anagrams (Hashing / Strings) ────────────────────────
    {
        title: 'Group Anagrams Bucket',
        slug: 'group-anagrams-bucket',
        description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
        difficulty: 'Medium',
        topics: ['Hashing', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'groupAnagrams',
            params: [{ name: 'strs', type: 'string[]' }],
            returnType: 'string[][]'
        },
        starterCode: {
            javascript: 'function groupAnagrams(strs) {\n    // Write your code here\n    \n}',
            python: 'def groupAnagrams(strs: list[str]) -> list[list[str]]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your code here\n        return new ArrayList<>();\n    }\n}',
            cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Grouped anagrams.' },
            { input: 'strs = [""]', output: '[[""]]', explanation: 'Single empty string.' }
        ],
        constraints: [
            '1 <= strs.length <= 10^4',
            '0 <= strs[i].length <= 100',
            'strs[i] consists of lowercase English letters.'
        ],
        testCases: [
            { input: '{"strs":["eat","tea","tan","ate","nat","bat"]}', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]', isHidden: false },
            { input: '{"strs":[""]}', expectedOutput: '[[""]]', isHidden: false },
            { input: '{"strs":["a"]}', expectedOutput: '[["a"]]', isHidden: true }
        ],
        hints: ['Use sorted characters or character frequency count tuple as a hash map key.'],
        isDemo: true,
        active: true
    },

    // ── 13. Medium: Search in Rotated Sorted Array (Searching) ────────────────
    {
        title: 'Search in Rotated Sorted Array',
        slug: 'search-in-rotated-sorted-array',
        description: 'Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` (`1 <= k < nums.length`).\n\nGiven the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
        difficulty: 'Medium',
        topics: ['Searching', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'searchRotated',
            params: [
                { name: 'nums', type: 'number[]' },
                { name: 'target', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function searchRotated(nums, target) {\n    // Write your code here\n    \n}',
            python: 'def searchRotated(nums: list[int], target: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int searchRotated(int[] nums, int target) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int searchRotated(vector<int>& nums, int target) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explanation: 'Target 0 is found at index 4.' },
            { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explanation: 'Target 3 not in array.' }
        ],
        constraints: [
            '1 <= nums.length <= 5000',
            '-10^4 <= nums[i] <= 10^4',
            'All values of nums are unique.'
        ],
        testCases: [
            { input: '{"nums":[4,5,6,7,0,1,2],"target":0}', expectedOutput: '4', isHidden: false },
            { input: '{"nums":[4,5,6,7,0,1,2],"target":3}', expectedOutput: '-1', isHidden: false },
            { input: '{"nums":[1],"target":0}', expectedOutput: '-1', isHidden: true },
            { input: '{"nums":[5,1,3],"target":5}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['One half of the array will always be strictly sorted. Determine which half and check target.'],
        isDemo: true,
        active: true
    },

    // ── 14. Medium: Coin Change (Dynamic Programming) ─────────────────────────
    {
        title: 'Coin Change Minimum Count',
        slug: 'coin-change-minimum-count',
        description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.',
        difficulty: 'Medium',
        topics: ['Dynamic Programming'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'coinChange',
            params: [
                { name: 'coins', type: 'number[]' },
                { name: 'amount', type: 'number' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function coinChange(coins, amount) {\n    // Write your code here\n    \n}',
            python: 'def coinChange(coins: list[int], amount: int) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Write your code here\n        return -1;\n    }\n};'
        },
        examples: [
            { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
            { input: 'coins = [2], amount = 3', output: '-1', explanation: 'Cannot make 3 using 2s.' },
            { input: 'coins = [1], amount = 0', output: '0', explanation: '0 coins required.' }
        ],
        constraints: [
            '1 <= coins.length <= 12',
            '1 <= coins[i] <= 2^31 - 1',
            '0 <= amount <= 10^4'
        ],
        testCases: [
            { input: '{"coins":[1,2,5],"amount":11}', expectedOutput: '3', isHidden: false },
            { input: '{"coins":[2],"amount":3}', expectedOutput: '-1', isHidden: false },
            { input: '{"coins":[1],"amount":0}', expectedOutput: '0', isHidden: false },
            { input: '{"coins":[2,5,10,1],"amount":27}', expectedOutput: '4', isHidden: true }
        ],
        hints: ['dp[i] = min(dp[i], dp[i - coin] + 1) for all coins.'],
        isDemo: true,
        active: true
    },

    // ── 15. Medium: Daily Temperatures (Stack) ────────────────────────────────
    {
        title: 'Daily Temperatures Monotonic Stack',
        slug: 'daily-temperatures-monotonic-stack',
        description: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.',
        difficulty: 'Medium',
        topics: ['Stack', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'dailyTemperatures',
            params: [{ name: 'temperatures', type: 'number[]' }],
            returnType: 'number[]'
        },
        starterCode: {
            javascript: 'function dailyTemperatures(temperatures) {\n    // Write your code here\n    \n}',
            python: 'def dailyTemperatures(temperatures: list[int]) -> list[int]:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        // Write your code here\n        return new int[]{};\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        // Write your code here\n        return {};\n    }\n};'
        },
        examples: [
            { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: 'Next warmer day distances.' },
            { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]', explanation: 'Consecutively increasing.' }
        ],
        constraints: [
            '1 <= temperatures.length <= 10^5',
            '30 <= temperatures[i] <= 100'
        ],
        testCases: [
            { input: '{"temperatures":[73,74,75,71,69,72,76,73]}', expectedOutput: '[1,1,4,2,1,1,0,0]', isHidden: false },
            { input: '{"temperatures":[30,40,50,60]}', expectedOutput: '[1,1,1,0]', isHidden: false },
            { input: '{"temperatures":[30,60,90]}', expectedOutput: '[1,1,0]', isHidden: true }
        ],
        hints: ['Use a monotonic decreasing stack storing indices.'],
        isDemo: true,
        active: true
    },

    // ── 16. Hard: Trapping Rain Water (Two Pointers / Stack) ───────────────────
    {
        title: 'Trapping Rain Water Height Map',
        slug: 'trapping-rain-water-height-map',
        description: 'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
        difficulty: 'Hard',
        topics: ['Two Pointers', 'Stack', 'Dynamic Programming', 'Arrays'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
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
            { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped.' },
            { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '9 units of rain water trapped.' }
        ],
        constraints: [
            'n == height.length',
            '1 <= n <= 2 * 10^4',
            '0 <= height[i] <= 10^5'
        ],
        testCases: [
            { input: '{"height":[0,1,0,2,1,0,1,3,2,1,2,1]}', expectedOutput: '6', isHidden: false },
            { input: '{"height":[4,2,0,3,2,5]}', expectedOutput: '9', isHidden: false },
            { input: '{"height":[2,0,2]}', expectedOutput: '2', isHidden: true },
            { input: '{"height":[3,0,0,2,0,4]}', expectedOutput: '10', isHidden: true }
        ],
        hints: ['Water trapped at index i is min(maxLeft, maxRight) - height[i]. Use two pointers.'],
        isDemo: true,
        active: true
    },

    // ── 17. Hard: Median of Two Sorted Arrays (Searching / Binary Search) ─────
    {
        title: 'Median of Two Sorted Arrays Partition',
        slug: 'median-of-two-sorted-arrays',
        description: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.',
        difficulty: 'Hard',
        topics: ['Searching', 'Arrays', 'Sorting'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'findMedianSortedArrays',
            params: [
                { name: 'nums1', type: 'number[]' },
                { name: 'nums2', type: 'number[]' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function findMedianSortedArrays(nums1, nums2) {\n    // Write your code here\n    \n}',
            python: 'def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your code here\n        return 0.0;\n    }\n}',
            cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Write your code here\n        return 0.0;\n    }\n};'
        },
        examples: [
            { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'merged array = [1,2,3] and median is 2.' },
            { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5', explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' }
        ],
        constraints: [
            'nums1.length == m',
            'nums2.length == n',
            '0 <= m <= 1000',
            '0 <= n <= 1000',
            '1 <= m + n <= 2000'
        ],
        testCases: [
            { input: '{"nums1":[1,3],"nums2":[2]}', expectedOutput: '2', isHidden: false },
            { input: '{"nums1":[1,2],"nums2":[3,4]}', expectedOutput: '2.5', isHidden: false },
            { input: '{"nums1":[0,0],"nums2":[0,0]}', expectedOutput: '0', isHidden: true }
        ],
        hints: ['Binary search on the partition of the smaller array.'],
        isDemo: true,
        active: true
    },

    // ── 18. Hard: Longest Valid Parentheses (Dynamic Programming / Stack) ─────
    {
        title: 'Longest Valid Parentheses Substring',
        slug: 'longest-valid-parentheses-substring',
        description: 'Given a string containing just the characters \'(\' and \')\', return the length of the longest valid (well-formed) parentheses substring.',
        difficulty: 'Hard',
        topics: ['Dynamic Programming', 'Stack', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'longestValidParentheses',
            params: [{ name: 's', type: 'string' }],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function longestValidParentheses(s) {\n    // Write your code here\n    \n}',
            python: 'def longestValidParentheses(s: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int longestValidParentheses(String s) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int longestValidParentheses(string s) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 's = "(()"', output: '2', explanation: 'The longest valid parentheses substring is "()".' },
            { input: 's = ")()())"', output: '4', explanation: 'The longest valid parentheses substring is "()()".' }
        ],
        constraints: [
            '0 <= s.length <= 3 * 10^4',
            's[i] is \'(\', or \')\'.'
        ],
        testCases: [
            { input: '{"s":"(()"}', expectedOutput: '2', isHidden: false },
            { input: '{"s":")()())"}', expectedOutput: '4', isHidden: false },
            { input: '{"s":""}', expectedOutput: '0', isHidden: true },
            { input: '{"s":"()(()"}', expectedOutput: '2', isHidden: true }
        ],
        hints: ['Use a stack storing indices, initialized with -1.'],
        isDemo: true,
        active: true
    },

    // ── 19. Hard: Word Ladder Graph BFS (Graphs / Queue) ──────────────────────
    {
        title: 'Word Ladder Shortest Transformation',
        slug: 'word-ladder-transformation',
        description: 'A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that every adjacent pair differs by a single letter, and every `si` is in `wordList`.\n\nGiven two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord`, or `0` if no such sequence exists.',
        difficulty: 'Hard',
        topics: ['Graphs', 'Queue', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
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
            { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog" is 5 words.' },
            { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0', explanation: 'endWord "cog" is not in wordList.' }
        ],
        constraints: [
            '1 <= beginWord.length <= 10',
            'endWord.length == beginWord.length',
            '1 <= wordList.length <= 5000'
        ],
        testCases: [
            { input: '{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log","cog"]}', expectedOutput: '5', isHidden: false },
            { input: '{"beginWord":"hit","endWord":"cog","wordList":["hot","dot","dog","lot","log"]}', expectedOutput: '0', isHidden: false },
            { input: '{"beginWord":"a","endWord":"c","wordList":["a","b","c"]}', expectedOutput: '2', isHidden: true }
        ],
        hints: ['Perform Breadth-First Search (BFS) starting from beginWord level by level.'],
        isDemo: true,
        active: true
    },

    // ── 20. Hard: Edit Distance (Dynamic Programming / Strings) ───────────────
    {
        title: 'Edit Distance Levenshtein Metric',
        slug: 'edit-distance-levenshtein',
        description: 'Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character',
        difficulty: 'Hard',
        topics: ['Dynamic Programming', 'Strings'],
        supportedLanguages: ['javascript', 'python', 'java', 'cpp'],
        functionSignature: {
            name: 'minDistance',
            params: [
                { name: 'word1', type: 'string' },
                { name: 'word2', type: 'string' }
            ],
            returnType: 'number'
        },
        starterCode: {
            javascript: 'function minDistance(word1, word2) {\n    // Write your code here\n    \n}',
            python: 'def minDistance(word1: str, word2: str) -> int:\n    # Write your code here\n    pass',
            java: 'class Solution {\n    public int minDistance(String word1, String word2) {\n        // Write your code here\n        return 0;\n    }\n}',
            cpp: '#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        // Write your code here\n        return 0;\n    }\n};'
        },
        examples: [
            { input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse -> rorse -> rose -> ros (3 ops).' },
            { input: 'word1 = "intention", word2 = "execution"', output: '5', explanation: '5 operations required.' }
        ],
        constraints: [
            '0 <= word1.length, word2.length <= 500',
            'word1 and word2 consist of lowercase English letters.'
        ],
        testCases: [
            { input: '{"word1":"horse","word2":"ros"}', expectedOutput: '3', isHidden: false },
            { input: '{"word1":"intention","word2":"execution"}', expectedOutput: '5', isHidden: false },
            { input: '{"word1":"","word2":"a"}', expectedOutput: '1', isHidden: true },
            { input: '{"word1":"zoologico","word2":"zoologist"}', expectedOutput: '5', isHidden: true }
        ],
        hints: ['Use a 2D dynamic programming grid where dp[i][j] represents minDistance(word1[0..i], word2[0..j]).'],
        isDemo: true,
        active: true
    }
];

const { COMPANY_CODING_QUESTIONS } = require('../data/companyCodingQuestions');

async function seedCodingQuestions() {
    try {
        console.log('[Seed] Seeding/Updating Coding Question Bank (Original + Company questions)...');

        // 1. Upsert Original Questions with stable IDs
        const originalWithIds = CODING_QUESTIONS.map((q, idx) => {
            const num = String(idx + 1).padStart(3, '0');
            return {
                ...q,
                questionId: q.questionId || `ORIGINAL-CODING-${num}`,
                questionType: 'CODING',
                company: q.company || null,
                verificationStatus: q.verificationStatus || 'ORIGINAL',
                sourceType: q.sourceType || 'original',
                reportedYear: q.reportedYear || null,
                yearConfidence: q.yearConfidence || 'UNKNOWN',
                sourceNotes: q.sourceNotes || 'CareerAI standard practice problem.'
            };
        });

        const allQuestions = [...originalWithIds, ...COMPANY_CODING_QUESTIONS];
        let upsertedCount = 0;

        for (const q of allQuestions) {
            const query = q.questionId ? { questionId: q.questionId } : { slug: q.slug };
            await CodingQuestion.updateOne(
                query,
                { $set: q },
                { upsert: true }
            );
            upsertedCount++;
        }

        const totalCount = await CodingQuestion.countDocuments();
        console.log(`[Seed] Coding questions sync complete. Upserted ${upsertedCount} items. Total in DB: ${totalCount}.`);
    } catch (err) {
        console.error('[Seed] Failed to seed coding questions:', err);
    }
}

async function seedCodingQuestionsIfEmpty() {
    return seedCodingQuestions();
}

module.exports = {
    CODING_QUESTIONS,
    seedCodingQuestions,
    seedCodingQuestionsIfEmpty
};
