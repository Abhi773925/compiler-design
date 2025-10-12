const leetcodeBlind75 = [
  // Array Problems
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
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "[0,1]",
        isHidden: false
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "[1,2]",
        isHidden: false
      },
      {
        input: "[3,3]\n6",
        expectedOutput: "[0,1]",
        isHidden: true
      },
      {
        input: "[2,5,5,11]\n10",
        expectedOutput: "[1,2]",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
      python: `def twoSum(nums, target):
    # Your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`
    },
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Again, the best way to approach this problem is to use a hash map.",
      "This way we can lookup numbers in O(1) time."
    ],
    relatedTopics: ["Array", "Hash Table"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook", "Apple"]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    difficulty: "Easy",
    category: "Array",
    tags: ["Array", "Dynamic Programming"],
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0."
      }
    ],
    constraints: [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    testCases: [
      {
        input: "[7,1,5,3,6,4]",
        expectedOutput: "5",
        isHidden: false
      },
      {
        input: "[7,6,4,3,1]",
        expectedOutput: "0",
        isHidden: false
      },
      {
        input: "[1,2,3,4,5]",
        expectedOutput: "4",
        isHidden: true
      },
      {
        input: "[2,4,1]",
        expectedOutput: "2",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
    // Your code here
}`,
      python: `def maxProfit(prices):
    # Your code here
    pass`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Your code here
    }
};`
    },
    hints: [
      "Think about the brute force approach first.",
      "We need to track the minimum price seen so far and calculate profit at each step.",
      "The maximum profit is the maximum difference between selling price and minimum buying price."
    ],
    relatedTopics: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook", "Bloomberg"]
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    difficulty: "Easy",
    category: "Array",
    tags: ["Array", "Hash Table", "Sorting"],
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "The element 1 appears at index 0 and 3."
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
        explanation: "All elements are distinct."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    testCases: [
      {
        input: "[1,2,3,1]",
        expectedOutput: "true",
        isHidden: false
      },
      {
        input: "[1,2,3,4]",
        expectedOutput: "false",
        isHidden: false
      },
      {
        input: "[1,1,1,3,3,4,3,2,4,2]",
        expectedOutput: "true",
        isHidden: true
      },
      {
        input: "[1]",
        expectedOutput: "false",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `function containsDuplicate(nums) {
    // Your code here
}`,
      python: `def containsDuplicate(nums):
    # Your code here
    pass`,
      java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        // Your code here
    }
};`
    },
    hints: [
      "Use a hash set to keep track of seen elements.",
      "If you encounter an element that's already in the set, return true.",
      "Alternative approach: sort the array and check adjacent elements."
    ],
    relatedTopics: ["Array", "Hash Table", "Sorting"],
    companies: ["Amazon", "Microsoft", "Adobe", "Apple"]
  },
  {
    title: "Product of Array Except Self",
    slug: "product-of-array-except-self",
    description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.`,
    difficulty: "Medium",
    category: "Array",
    tags: ["Array", "Prefix Sum"],
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation: "answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, answer[2] = 1*2*4 = 8, answer[3] = 1*2*3 = 6"
      },
      {
        input: "nums = [-1,1,0,-3,3]",
        output: "[0,0,9,0,0]",
        explanation: "answer[0] = 1*0*(-3)*3 = 0, etc."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer."
    ],
    testCases: [
      {
        input: "[1,2,3,4]",
        expectedOutput: "[24,12,8,6]",
        isHidden: false
      },
      {
        input: "[-1,1,0,-3,3]",
        expectedOutput: "[0,0,9,0,0]",
        isHidden: false
      },
      {
        input: "[2,3,4,5]",
        expectedOutput: "[60,40,30,24]",
        isHidden: true
      },
      {
        input: "[1,0]",
        expectedOutput: "[0,1]",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
    // Your code here
}`,
      python: `def productExceptSelf(nums):
    # Your code here
    pass`,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // Your code here
    }
};`
    },
    hints: [
      "Think about using left and right products.",
      "For each position, calculate the product of all elements to the left and all elements to the right.",
      "You can optimize space by using the output array to store intermediate results."
    ],
    relatedTopics: ["Array", "Prefix Sum"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook", "Apple"]
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A subarray is a contiguous part of an array.`,
    difficulty: "Medium",
    category: "Array",
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6."
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The array has only one element."
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        expectedOutput: "6",
        isHidden: false
      },
      {
        input: "[1]",
        expectedOutput: "1",
        isHidden: false
      },
      {
        input: "[5,4,-1,7,8]",
        expectedOutput: "23",
        isHidden: true
      },
      {
        input: "[-1]",
        expectedOutput: "-1",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
    // Your code here
}`,
      python: `def maxSubArray(nums):
    # Your code here
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Your code here
    }
};`
    },
    hints: [
      "Try using Kadane's algorithm.",
      "At each position, decide whether to start a new subarray or extend the existing one.",
      "Keep track of the maximum sum seen so far."
    ],
    relatedTopics: ["Array", "Divide and Conquer", "Dynamic Programming"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook", "LinkedIn"]
  },
  {
    title: "Maximum Product Subarray",
    slug: "maximum-product-subarray",
    description: `Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.

The test cases are generated so that the answer will fit in a 32-bit integer.

A subarray is a contiguous subsequence of the array.`,
    difficulty: "Medium",
    category: "Array",
    tags: ["Array", "Dynamic Programming"],
    examples: [
      {
        input: "nums = [2,3,-2,4]",
        output: "6",
        explanation: "[2,3] has the largest product 6."
      },
      {
        input: "nums = [-2,0,-1]",
        output: "0",
        explanation: "The result cannot be 2, because [-2,-1] is not a subarray."
      }
    ],
    constraints: [
      "1 <= nums.length <= 2 * 10^4",
      "-10 <= nums[i] <= 10",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer."
    ],
    testCases: [
      {
        input: "[2,3,-2,4]",
        expectedOutput: "6",
        isHidden: false
      },
      {
        input: "[-2,0,-1]",
        expectedOutput: "0",
        isHidden: false
      },
      {
        input: "[-2,3,-4]",
        expectedOutput: "24",
        isHidden: true
      },
      {
        input: "[0,2]",
        expectedOutput: "2",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `function maxProduct(nums) {
    // Your code here
}`,
      python: `def maxProduct(nums):
    # Your code here
    pass`,
      java: `class Solution {
    public int maxProduct(int[] nums) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    int maxProduct(vector<int>& nums) {
        // Your code here
    }
};`
    },
    hints: [
      "Think about how negative numbers affect the product.",
      "Keep track of both maximum and minimum products at each position.",
      "A negative number can turn a minimum into a maximum."
    ],
    relatedTopics: ["Array", "Dynamic Programming"],
    companies: ["Amazon", "Microsoft", "Google", "LinkedIn"]
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    slug: "find-minimum-in-rotated-sorted-array",
    description: `Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:

[4,5,6,7,0,1,2] if it was rotated 4 times.
[0,1,2,4,5,6,7] if it was rotated 7 times.

Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].

Given the sorted rotated array nums of unique elements, return the minimum element of this array.

You must write an algorithm that runs in O(log n) time.`,
    difficulty: "Medium",
    category: "Array",
    tags: ["Array", "Binary Search"],
    examples: [
      {
        input: "nums = [3,4,5,1,2]",
        output: "1",
        explanation: "The original array was [1,2,3,4,5] rotated 3 times."
      },
      {
        input: "nums = [4,5,6,7,0,1,2]",
        output: "0",
        explanation: "The original array was [0,1,2,4,5,6,7] and it was rotated 4 times."
      }
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique.",
      "nums is sorted and rotated between 1 and n times."
    ],
    testCases: [
      {
        input: "[3,4,5,1,2]",
        expectedOutput: "1",
        isHidden: false
      },
      {
        input: "[4,5,6,7,0,1,2]",
        expectedOutput: "0",
        isHidden: false
      },
      {
        input: "[11,13,15,17]",
        expectedOutput: "11",
        isHidden: true
      },
      {
        input: "[2,1]",
        expectedOutput: "1",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `function findMin(nums) {
    // Your code here
}`,
      python: `def findMin(nums):
    # Your code here
    pass`,
      java: `class Solution {
    public int findMin(int[] nums) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    int findMin(vector<int>& nums) {
        // Your code here
    }
};`
    },
    hints: [
      "Use binary search to achieve O(log n) time complexity.",
      "Compare the middle element with the rightmost element to determine which half to search.",
      "The minimum element is where the sorted order is broken."
    ],
    relatedTopics: ["Array", "Binary Search"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook"]
  },
  {
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    description: `There is an integer array nums sorted in ascending order (with distinct values).

Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].

Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

You must write an algorithm with O(log n) runtime complexity.`,
    difficulty: "Medium",
    category: "Array",
    tags: ["Array", "Binary Search"],
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "0 is found at index 4."
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1",
        explanation: "3 is not in the array."
      }
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated.",
      "-10^4 <= target <= 10^4"
    ],
    testCases: [
      {
        input: "[4,5,6,7,0,1,2]\n0",
        expectedOutput: "4",
        isHidden: false
      },
      {
        input: "[4,5,6,7,0,1,2]\n3",
        expectedOutput: "-1",
        isHidden: false
      },
      {
        input: "[1]\n0",
        expectedOutput: "-1",
        isHidden: true
      },
      {
        input: "[1,3,5]\n3",
        expectedOutput: "1",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `function search(nums, target) {
    // Your code here
}`,
      python: `def search(nums, target):
    # Your code here
    pass`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Your code here
    }
};`
    },
    hints: [
      "Use binary search to achieve O(log n) time complexity.",
      "At each step, determine which half of the array is sorted.",
      "Check if the target is in the sorted half or the unsorted half."
    ],
    relatedTopics: ["Array", "Binary Search"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook", "LinkedIn"]
  },
  {
    title: "3Sum",
    slug: "3sum",
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
    difficulty: "Medium",
    category: "Array",
    tags: ["Array", "Two Pointers", "Sorting"],
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation: "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0. nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0. The distinct triplets are [-1,0,1] and [-1,-1,2]."
      },
      {
        input: "nums = [0,1,1]",
        output: "[]",
        explanation: "The only possible triplet does not sum up to 0."
      }
    ],
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    testCases: [
      {
        input: "[-1,0,1,2,-1,-4]",
        expectedOutput: "[[-1,-1,2],[-1,0,1]]",
        isHidden: false
      },
      {
        input: "[0,1,1]",
        expectedOutput: "[]",
        isHidden: false
      },
      {
        input: "[0,0,0]",
        expectedOutput: "[[0,0,0]]",
        isHidden: true
      },
      {
        input: "[-2,0,1,1,2]",
        expectedOutput: "[[-2,0,2],[-2,1,1]]",
        isHidden: true
      }
    ],
    starterCode: {
      javascript: `function threeSum(nums) {
    // Your code here
}`,
      python: `def threeSum(nums):
    # Your code here
    pass`,
      java: `class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Your code here
    }
};`
    },
    hints: [
      "Sort the array first to make it easier to avoid duplicates.",
      "Use two pointers approach for each fixed element.",
      "Skip duplicate elements to avoid duplicate triplets."
    ],
    relatedTopics: ["Array", "Two Pointers", "Sorting"],
    companies: ["Amazon", "Microsoft", "Google", "Facebook", "Adobe"]
  }
];

module.exports = leetcodeBlind75;