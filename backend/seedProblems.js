const mongoose = require("mongoose");
const Problem = require("./models/Problem");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/prepmate";

const sampleProblems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "Easy",
    category: "Array",
    tags: ["Array", "Hash Table"],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    testCases: [
      // Sample test cases
      { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
      { input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: false },
      // Hidden test cases
      { input: "[3,3]\n6", expectedOutput: "[0,1]", isHidden: true },
      {
        input: "[-1,-2,-3,-4,-5]\n-8",
        expectedOutput: "[2,4]",
        isHidden: true,
      },
      { input: "[1,2,3,4,5]\n9", expectedOutput: "[3,4]", isHidden: true },
      { input: "[0,4,3,0]\n0", expectedOutput: "[0,3]", isHidden: true },
      { input: "[-3,4,3,90]\n0", expectedOutput: "[0,2]", isHidden: true },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}`,
      python: `def two_sum(nums, target):
    # Write your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
    },
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: "Easy",
    category: "Stack",
    tags: ["String", "Stack"],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The string contains valid parentheses.",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets are properly matched.",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'.",
    ],
    testCases: [
      { input: "()", expectedOutput: "true", isHidden: false },
      { input: "()[]{}", expectedOutput: "true", isHidden: false },
      { input: "(]", expectedOutput: "false", isHidden: true },
      { input: "([)]", expectedOutput: "false", isHidden: true },
      { input: "{[]}", expectedOutput: "true", isHidden: true },
      { input: "", expectedOutput: "true", isHidden: true },
      { input: "((", expectedOutput: "false", isHidden: true },
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Write your code here
    
}`,
      python: `def is_valid(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Write your code here
        
    }
};`,
    },
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    difficulty: "Medium",
    category: "Dynamic Programming",
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        expectedOutput: "6",
        isHidden: false,
      },
      { input: "[1]", expectedOutput: "1", isHidden: false },
      { input: "[5,4,-1,7,8]", expectedOutput: "23", isHidden: true },
      { input: "[-1]", expectedOutput: "-1", isHidden: true },
      { input: "[-2,-1]", expectedOutput: "-1", isHidden: true },
      { input: "[1,2,3,4,5]", expectedOutput: "15", isHidden: true },
      { input: "[-5,-2,-8,-1]", expectedOutput: "-1", isHidden: true },
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
    // Write your code here
    
}`,
      python: `def max_sub_array(nums):
    # Write your code here
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your code here
        
    }
};`,
    },
  },
  {
    title: "Binary Tree Inorder Traversal",
    slug: "binary-tree-inorder-traversal",
    description: `Given the root of a binary tree, return the inorder traversal of its nodes' values.

Inorder traversal visits nodes in the order: Left subtree → Root → Right subtree.`,
    difficulty: "Easy",
    category: "Tree",
    tags: ["Stack", "Tree", "Depth-First Search", "Binary Tree"],
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
        explanation: "Inorder traversal: left, root, right",
      },
      {
        input: "root = []",
        output: "[]",
        explanation: "Empty tree returns empty array",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100",
    ],
    testCases: [
      { input: "[1,null,2,3]", expectedOutput: "[1,3,2]", isHidden: false },
      { input: "[]", expectedOutput: "[]", isHidden: false },
      { input: "[1]", expectedOutput: "[1]", isHidden: true },
      { input: "[1,2]", expectedOutput: "[2,1]", isHidden: true },
      { input: "[1,null,2]", expectedOutput: "[1,2]", isHidden: true },
      { input: "[1,2,3,4,5]", expectedOutput: "[4,2,5,1,3]", isHidden: true },
      {
        input: "[5,3,8,2,4,7,9]",
        expectedOutput: "[2,3,4,5,7,8,9]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function inorderTraversal(root) {
    // Write your code here
    
}`,
      python: `def inorder_traversal(root):
    # Write your code here
    pass`,
      java: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        // Write your code here
        
    }
};`,
    },
  },
  {
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    description: `Given a string s, return the longest palindromic substring in s.

A palindrome is a string that reads the same forward and backward.`,
    difficulty: "Medium",
    category: "String",
    tags: ["String", "Dynamic Programming"],
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.',
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
        explanation: 'The longest palindromic substring is "bb".',
      },
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters.",
    ],
    testCases: [
      { input: "babad", expectedOutput: "bab", isHidden: false },
      { input: "cbbd", expectedOutput: "bb", isHidden: false },
      { input: "a", expectedOutput: "a", isHidden: true },
      { input: "ac", expectedOutput: "a", isHidden: true },
      { input: "racecar", expectedOutput: "racecar", isHidden: true },
      { input: "noon", expectedOutput: "noon", isHidden: true },
      { input: "abcdef", expectedOutput: "a", isHidden: true },
    ],
    starterCode: {
      javascript: `function longestPalindrome(s) {
    // Write your code here
    
}`,
      python: `def longest_palindrome(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public String longestPalindrome(String s) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    string longestPalindrome(string s) {
        // Write your code here
        
    }
};`,
    },
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    difficulty: "Easy",
    category: "Linked List",
    tags: ["Linked List", "Recursion"],
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "Merge both sorted lists into one sorted list.",
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
        explanation: "Both lists are empty.",
      },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order.",
    ],
    testCases: [
      {
        input: "[1,2,4]\n[1,3,4]",
        expectedOutput: "[1,1,2,3,4,4]",
        isHidden: false,
      },
      { input: "[]\n[]", expectedOutput: "[]", isHidden: false },
      { input: "[]\n[0]", expectedOutput: "[0]", isHidden: true },
      { input: "[1]\n[2]", expectedOutput: "[1,2]", isHidden: true },
      {
        input: "[1,3,5]\n[2,4,6]",
        expectedOutput: "[1,2,3,4,5,6]",
        isHidden: true,
      },
      {
        input: "[1,1,1]\n[2,2,2]",
        expectedOutput: "[1,1,1,2,2,2]",
        isHidden: true,
      },
      {
        input: "[-10,-5,0]\n[-8,-2,1]",
        expectedOutput: "[-10,-8,-5,-2,0,1]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {
    // Write your code here
    
}`,
      python: `def merge_two_lists(list1, list2):
    # Write your code here
    pass`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Write your code here
        
    }
};`,
    },
  },
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    difficulty: "Easy",
    category: "Hash Table",
    tags: ["Hash Table", "String", "Sorting"],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation:
          "Both strings contain the same characters with same frequency.",
      },
      {
        input: 's = "rat", t = "car"',
        output: "false",
        explanation: "The strings have different characters.",
      },
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters.",
    ],
    testCases: [
      { input: "anagram\nnagaram", expectedOutput: "true", isHidden: false },
      { input: "rat\ncar", expectedOutput: "false", isHidden: false },
      { input: "a\nab", expectedOutput: "false", isHidden: true },
      { input: "listen\nsilent", expectedOutput: "true", isHidden: true },
      { input: "evil\nvile", expectedOutput: "true", isHidden: true },
      { input: "hello\nbello", expectedOutput: "false", isHidden: true },
      { input: "abc\ncba", expectedOutput: "true", isHidden: true },
    ],
    starterCode: {
      javascript: `function isAnagram(s, t) {
    // Write your code here
    
}`,
      python: `def is_anagram(s, t):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Write your code here
        
    }
}`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        // Write your code here
        
    }
};`,
    },
  },
];

async function seedProblems() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    // Insert sample problems
    await Problem.insertMany(sampleProblems);
    console.log("Inserted sample problems");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedProblems();
