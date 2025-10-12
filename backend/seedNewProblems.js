const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    category: "Array",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
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
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    tags: ["Array", "Hash Table"],
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "[0,1]",
        isHidden: false,
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "[1,2]",
        isHidden: false,
      },
      {
        input: "[3,3]\n6",
        expectedOutput: "[0,1]",
        isHidden: true,
      },
      {
        input: "[1,5,3,9]\n10",
        expectedOutput: "[-1,-1]",
        isHidden: true,
      },
      {
        input: "[2,5,5,11]\n10",
        expectedOutput: "[1,2]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const nums = JSON.parse(inputLines[0]);
  const target = parseInt(inputLines[1]);
  const result = twoSum(nums, target);
  console.log(JSON.stringify(result));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    // Parse array
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    int target;
    cin >> target;
    
    vector<int> result = twoSum(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        int target = scanner.nextInt();
        int[] result = twoSum(nums, target);
        
        System.out.println("[" + result[0] + "," + result[1] + "]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    category: "Array",
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation:
          "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation:
          "In this case, no transactions are done and the max profit = 0.",
      },
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    tags: ["Array", "Dynamic Programming"],
    testCases: [
      {
        input: "[7,1,5,3,6,4]",
        expectedOutput: "5",
        isHidden: false,
      },
      {
        input: "[7,6,4,3,1]",
        expectedOutput: "0",
        isHidden: false,
      },
      {
        input: "[1,2,3,4,5]",
        expectedOutput: "4",
        isHidden: true,
      },
      {
        input: "[2,4,1]",
        expectedOutput: "2",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "0",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const prices = JSON.parse(input.trim());
  console.log(maxProfit(prices));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> prices;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        prices.push_back(stoi(num));
    }
    
    cout << maxProfit(prices) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int maxProfit(int[] prices) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] prices = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            prices[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(maxProfit(prices));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: "Easy",
    category: "Array",
    description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
        explanation: "The element 1 appears at index 0 and 3.",
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
        explanation: "All elements are distinct.",
      },
      {
        input: "nums = [1,1,1,3,3,4,3,2,4,2]",
        output: "true",
        explanation: "Multiple elements appear more than once.",
      },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    tags: ["Array", "Hash Table", "Sorting"],
    testCases: [
      {
        input: "[1,2,3,1]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[1,2,3,4]",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "[1,1,1,3,3,4,3,2,4,2]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "[1,5,9,1,5,9]",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function containsDuplicate(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(containsDuplicate(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<unordered_set>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    cout << (containsDuplicate(nums) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean containsDuplicate(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(containsDuplicate(nums));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Product of Array Except Self",
    slug: "product-of-array-except-self",
    difficulty: "Medium",
    category: "Array",
    description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.`,
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
        explanation:
          "answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, answer[2] = 1*2*4 = 8, answer[3] = 1*2*3 = 6",
      },
      {
        input: "nums = [-1,1,0,-3,3]",
        output: "[0,0,9,0,0]",
        explanation: "answer[0] = 1*0*(-3)*3 = 0, etc.",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-30 <= nums[i] <= 30",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
    ],
    tags: ["Array", "Prefix Sum"],
    testCases: [
      {
        input: "[1,2,3,4]",
        expectedOutput: "[24,12,8,6]",
        isHidden: false,
      },
      {
        input: "[-1,1,0,-3,3]",
        expectedOutput: "[0,0,9,0,0]",
        isHidden: false,
      },
      {
        input: "[2,3,4,5]",
        expectedOutput: "[60,40,30,24]",
        isHidden: true,
      },
      {
        input: "[1,0]",
        expectedOutput: "[0,1]",
        isHidden: true,
      },
      {
        input: "[-1,-2,-3,-4]",
        expectedOutput: "[-24,-12,-8,-6]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  const result = productExceptSelf(nums);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

vector<int> productExceptSelf(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    vector<int> result = productExceptSelf(nums);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << result[i];
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] productExceptSelf(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        int[] result = productExceptSelf(nums);
        System.out.print("[");
        for(int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if(i < result.length - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    category: "Array",
    description: `Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A subarray is a contiguous part of an array.`,
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "[4,-1,2,1] has the largest sum = 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum = 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "[5,4,-1,7,8] has the largest sum = 23.",
      },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "[1]",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "[5,4,-1,7,8]",
        expectedOutput: "23",
        isHidden: true,
      },
      {
        input: "[-1,-2,-3]",
        expectedOutput: "-1",
        isHidden: true,
      },
      {
        input: "[2,1,3,-8,1]",
        expectedOutput: "6",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(maxSubArray(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<climits>
#include<algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    cout << maxSubArray(nums) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(maxSubArray(nums));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Maximum Product Subarray",
    slug: "maximum-product-subarray",
    difficulty: "Medium",
    category: "Array",
    description: `Given an integer array nums, find a contiguous non-empty subarray within the array that has the largest product, and return the product.

The test cases are generated so that the answer will fit in a 32-bit integer.

A subarray is a contiguous subsequence of the array.`,
    examples: [
      {
        input: "nums = [2,3,-2,4]",
        output: "6",
        explanation: "[2,3] has the largest product 6.",
      },
      {
        input: "nums = [-2,0,-1]",
        output: "0",
        explanation:
          "The result cannot be 2, because [-2,-1] is not a subarray.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 2 * 10^4",
      "-10 <= nums[i] <= 10",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
    ],
    tags: ["Array", "Dynamic Programming"],
    testCases: [
      {
        input: "[2,3,-2,4]",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "[-2,0,-1]",
        expectedOutput: "0",
        isHidden: false,
      },
      {
        input: "[-2,3,-4]",
        expectedOutput: "24",
        isHidden: true,
      },
      {
        input: "[0,2]",
        expectedOutput: "2",
        isHidden: true,
      },
      {
        input: "[-1,-2,-9,-6]",
        expectedOutput: "108",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function maxProduct(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(maxProduct(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

int maxProduct(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    cout << maxProduct(nums) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int maxProduct(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(maxProduct(nums));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    slug: "find-minimum-in-rotated-sorted-array",
    difficulty: "Medium",
    category: "Array",
    description: `Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become:

[4,5,6,7,0,1,2] if it was rotated 4 times.
[0,1,2,4,5,6,7] if it was rotated 7 times.

Notice that rotating an array [a[0], a[1], a[2], ..., a[n-1]] 1 time results in the array [a[n-1], a[0], a[1], a[2], ..., a[n-2]].

Given the sorted rotated array nums of unique elements, return the minimum element of this array.

You must write an algorithm that runs in O(log n) time.`,
    examples: [
      {
        input: "nums = [3,4,5,1,2]",
        output: "1",
        explanation: "The original array was [1,2,3,4,5] rotated 3 times.",
      },
      {
        input: "nums = [4,5,6,7,0,1,2]",
        output: "0",
        explanation:
          "The original array was [0,1,2,4,5,6,7] and it was rotated 4 times.",
      },
      {
        input: "nums = [11,13,15,17]",
        output: "11",
        explanation:
          "The original array was [11,13,15,17] and it was rotated 4 times.",
      },
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 5000",
      "-5000 <= nums[i] <= 5000",
      "All the integers of nums are unique.",
      "nums is sorted and rotated between 1 and n times.",
    ],
    tags: ["Array", "Binary Search"],
    testCases: [
      {
        input: "[3,4,5,1,2]",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "[4,5,6,7,0,1,2]",
        expectedOutput: "0",
        isHidden: false,
      },
      {
        input: "[11,13,15,17]",
        expectedOutput: "11",
        isHidden: true,
      },
      {
        input: "[2,1]",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function findMin(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(findMin(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

int findMin(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    cout << findMin(nums) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int findMin(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(findMin(nums));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    difficulty: "Medium",
    category: "Array",
    description: `There is an integer array nums sorted in ascending order (with distinct values).

Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be rotated at pivot index 3 and become [4,5,6,7,0,1,2].

Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        explanation: "0 is found at index 4.",
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1",
        explanation: "3 is not in the array.",
      },
      {
        input: "nums = [1], target = 0",
        output: "-1",
        explanation: "0 is not in the array.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated.",
      "-10^4 <= target <= 10^4",
    ],
    tags: ["Array", "Binary Search"],
    testCases: [
      {
        input: "[4,5,6,7,0,1,2]\n0",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "[4,5,6,7,0,1,2]\n3",
        expectedOutput: "-1",
        isHidden: false,
      },
      {
        input: "[1]\n0",
        expectedOutput: "-1",
        isHidden: true,
      },
      {
        input: "[1,3,5]\n3",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "[5,1,3]\n3",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function search(nums, target) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const nums = JSON.parse(inputLines[0]);
  const target = parseInt(inputLines[1]);
  console.log(search(nums, target));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

int search(vector<int>& nums, int target) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    int target;
    cin >> target;
    
    cout << search(nums, target) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int search(int[] nums, int target) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        int target = scanner.nextInt();
        System.out.println(search(nums, target));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "3Sum",
    slug: "3sum",
    difficulty: "Medium",
    category: "Array",
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation:
          "nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0. nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0. The distinct triplets are [-1,0,1] and [-1,-1,2].",
      },
      {
        input: "nums = [0,1,1]",
        output: "[]",
        explanation: "The only possible triplet does not sum up to 0.",
      },
      {
        input: "nums = [0,0,0]",
        output: "[[0,0,0]]",
        explanation: "The only possible triplet sums up to 0.",
      },
    ],
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    tags: ["Array", "Two Pointers", "Sorting"],
    testCases: [
      {
        input: "[-1,0,1,2,-1,-4]",
        expectedOutput: "[[-1,-1,2],[-1,0,1]]",
        isHidden: false,
      },
      {
        input: "[0,1,1]",
        expectedOutput: "[]",
        isHidden: false,
      },
      {
        input: "[0,0,0]",
        expectedOutput: "[[0,0,0]]",
        isHidden: true,
      },
      {
        input: "[-2,0,1,1,2]",
        expectedOutput: "[[-2,0,2],[-2,1,1]]",
        isHidden: true,
      },
      {
        input: "[1,2,-2,-1]",
        expectedOutput: "[]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function threeSum(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  const result = threeSum(nums);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    vector<vector<int>> result = threeSum(nums);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << "[" << result[i][0] << "," << result[i][1] << "," << result[i][2] << "]";
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<List<Integer>> threeSum(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        List<List<Integer>> result = threeSum(nums);
        System.out.print("[");
        for(int i = 0; i < result.size(); i++) {
            System.out.print("[" + result.get(i).get(0) + "," + result.get(i).get(1) + "," + result.get(i).get(2) + "]");
            if(i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    category: "Array",
    description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container that contains the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.`,
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49.",
      },
      {
        input: "height = [1,1]",
        output: "1",
        explanation: "The maximum area is 1.",
      },
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    tags: ["Array", "Two Pointers", "Greedy"],
    testCases: [
      {
        input: "[1,8,6,2,5,4,8,3,7]",
        expectedOutput: "49",
        isHidden: false,
      },
      {
        input: "[1,1]",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "[4,3,2,1,4]",
        expectedOutput: "16",
        isHidden: true,
      },
      {
        input: "[1,2,1]",
        expectedOutput: "2",
        isHidden: true,
      },
      {
        input: "[2,1]",
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function maxArea(height) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const height = JSON.parse(input.trim());
  console.log(maxArea(height));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

int maxArea(vector<int>& height) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> height;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        height.push_back(stoi(num));
    }
    
    cout << maxArea(height) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int maxArea(int[] height) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] height = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            height[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(maxArea(height));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Sum of Two Integers",
    slug: "sum-of-two-integers",
    difficulty: "Medium",
    category: "Math",
    description: `Given two integers a and b, return the sum of the two integers without using the operators + and -.`,
    examples: [
      {
        input: "a = 1, b = 2",
        output: "3",
        explanation: "1 + 2 = 3",
      },
      {
        input: "a = 2, b = 3",
        output: "5",
        explanation: "2 + 3 = 5",
      },
    ],
    constraints: [
      "-1000 <= a, b <= 1000"
    ],
    tags: ["Math", "Bit Manipulation"],
    testCases: [
      {
        input: "1\n2",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "2\n3",
        expectedOutput: "5",
        isHidden: false,
      },
      {
        input: "-1\n1",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "0\n0",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "5\n7",
        expectedOutput: "12",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function getSum(a, b) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const a = parseInt(inputLines[0]);
  const b = parseInt(inputLines[1]);
  console.log(getSum(a, b));
});`,
      cpp: `#include<iostream>
using namespace std;

int getSum(int a, int b) {
    // Write your code here
    
}

int main() {
    int a, b;
    cin >> a >> b;
    cout << getSum(a, b) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int getSum(int a, int b) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(getSum(a, b));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Number of 1 Bits",
    slug: "number-of-1-bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: `Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).

Note:
- Note that in some languages, such as Java, there is no unsigned integer type. In this case, the input will be given as a signed integer type. It should not affect your implementation, as the integer's internal binary representation is the same, whether it is signed or unsigned.
- In Java, the compiler represents the signed integers using 2's complement notation. Therefore, in Example 3, the input represents the signed integer. -3.`,
    examples: [
      {
        input: "n = 00000000000000000000000000001011",
        output: "3",
        explanation: "The input binary string 00000000000000000000000000001011 has a total of three '1' bits.",
      },
      {
        input: "n = 00000000000000000000000010000000",
        output: "1",
        explanation: "The input binary string 00000000000000000000000010000000 has a total of one '1' bit.",
      },
    ],
    constraints: [
      "The input must be a binary string of length 32"
    ],
    tags: ["Bit Manipulation"],
    testCases: [
      {
        input: "11",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "128",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "4294967293",
        expectedOutput: "31",
        isHidden: true,
      },
      {
        input: "1",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "0",
        expectedOutput: "0",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function hammingWeight(n) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const n = parseInt(input.trim());
  console.log(hammingWeight(n));
  rl.close();
});`,
      cpp: `#include<iostream>
using namespace std;

int hammingWeight(uint32_t n) {
    // Write your code here
    
}

int main() {
    uint32_t n;
    cin >> n;
    cout << hammingWeight(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int hammingWeight(int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(hammingWeight(n));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Counting Bits",
    slug: "counting-bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: `Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.`,
    examples: [
      {
        input: "n = 2",
        output: "[0,1,1]",
        explanation: "0 --> 0, 1 --> 1, 2 --> 10",
      },
      {
        input: "n = 5",
        output: "[0,1,1,2,1,2]",
        explanation: "0 --> 0, 1 --> 1, 2 --> 10, 3 --> 11, 4 --> 100, 5 --> 101",
      },
    ],
    constraints: [
      "0 <= n <= 10^5"
    ],
    tags: ["Dynamic Programming", "Bit Manipulation"],
    testCases: [
      {
        input: "2",
        expectedOutput: "[0,1,1]",
        isHidden: false,
      },
      {
        input: "5",
        expectedOutput: "[0,1,1,2,1,2]",
        isHidden: false,
      },
      {
        input: "0",
        expectedOutput: "[0]",
        isHidden: true,
      },
      {
        input: "1",
        expectedOutput: "[0,1]",
        isHidden: true,
      },
      {
        input: "8",
        expectedOutput: "[0,1,1,2,1,2,2,3,1]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function countBits(n) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const n = parseInt(input.trim());
  const result = countBits(n);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
using namespace std;

vector<int> countBits(int n) {
    // Write your code here
    
}

int main() {
    int n;
    cin >> n;
    vector<int> result = countBits(n);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << result[i];
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] countBits(int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int[] result = countBits(n);
        System.out.print("[");
        for(int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if(i < result.length - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Missing Number",
    slug: "missing-number",
    difficulty: "Easy",
    category: "Array",
    description: `Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.`,
    examples: [
      {
        input: "nums = [3,0,1]",
        output: "2",
        explanation: "n = 3 since there are 3 numbers, so all numbers are in the range [0,3]. 2 is the missing number in the range since it does not appear in nums.",
      },
      {
        input: "nums = [0,1]",
        output: "2",
        explanation: "n = 2 since there are 2 numbers, so all numbers are in the range [0,2]. 2 is the missing number in the range since it does not appear in nums.",
      },
      {
        input: "nums = [9,6,4,2,3,5,7,0,1]",
        output: "8",
        explanation: "n = 9 since there are 9 numbers, so all numbers are in the range [0,9]. 8 is the missing number in the range since it does not appear in nums.",
      },
    ],
    constraints: [
      "n == nums.length",
      "1 <= n <= 10^4",
      "0 <= nums[i] <= n",
      "All the numbers of nums are unique."
    ],
    tags: ["Array", "Hash Table", "Math", "Bit Manipulation", "Sorting"],
    testCases: [
      {
        input: "[3,0,1]",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "[0,1]",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "[9,6,4,2,3,5,7,0,1]",
        expectedOutput: "8",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "[0]",
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function missingNumber(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(missingNumber(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

int missingNumber(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    cout << missingNumber(nums) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int missingNumber(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(missingNumber(nums));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Reverse Bits",
    slug: "reverse-bits",
    difficulty: "Easy",
    category: "Bit Manipulation",
    description: `Reverse bits of a given 32 bits unsigned integer.

Note:
- Note that in some languages, such as Java, there is no unsigned integer type. In this case, both input and output will be given as a signed integer type. They should not affect your implementation, as the integer's internal binary representation is the same, whether it is signed or unsigned.
- In Java, the compiler represents the signed integers using 2's complement notation. Therefore, in Example 2 above, the input represents the signed integer -3 and the output represents the signed integer -1073741825.`,
    examples: [
      {
        input: "n = 00000010100101000001111010011100",
        output: "00111001011110000010100101000000",
        explanation: "The input binary string 00000010100101000001111010011100 represents the unsigned integer 43261596, so return 964176192 which its binary representation is 00111001011110000010100101000000.",
      },
      {
        input: "n = 11111111111111111111111111111101",
        output: "10111111111111111111111111111111",
        explanation: "The input binary string 11111111111111111111111111111101 represents the unsigned integer 4294967293, so return 3221225471 which its binary representation is 10111111111111111111111111111111.",
      },
    ],
    constraints: [
      "The input must be a binary string of length 32"
    ],
    tags: ["Divide and Conquer", "Bit Manipulation"],
    testCases: [
      {
        input: "43261596",
        expectedOutput: "964176192",
        isHidden: false,
      },
      {
        input: "4294967293",
        expectedOutput: "3221225471",
        isHidden: false,
      },
      {
        input: "1",
        expectedOutput: "2147483648",
        isHidden: true,
      },
      {
        input: "0",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "2147483648",
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function reverseBits(n) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const n = parseInt(input.trim());
  console.log(reverseBits(n));
  rl.close();
});`,
      cpp: `#include<iostream>
using namespace std;

uint32_t reverseBits(uint32_t n) {
    // Write your code here
    
}

int main() {
    uint32_t n;
    cin >> n;
    cout << reverseBits(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int reverseBits(int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(reverseBits(n));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways to climb to the top. 1. 1 step + 1 step 2. 2 steps",
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways to climb to the top. 1. 1 step + 1 step + 1 step 2. 1 step + 2 steps 3. 2 steps + 1 step",
      },
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    tags: ["Math", "Dynamic Programming", "Memoization"],
    testCases: [
      {
        input: "2",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "3",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "1",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "4",
        expectedOutput: "5",
        isHidden: true,
      },
      {
        input: "5",
        expectedOutput: "8",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const n = parseInt(input.trim());
  console.log(climbStairs(n));
  rl.close();
});`,
      cpp: `#include<iostream>
using namespace std;

int climbStairs(int n) {
    // Write your code here
    
}

int main() {
    int n;
    cin >> n;
    cout << climbStairs(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int climbStairs(int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(climbStairs(n));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Coin Change",
    slug: "coin-change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: "coins = [1,3,4], amount = 6",
        output: "2",
        explanation: "The minimum number of coins is 2, which are 3+3=6.",
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "Amount of 3 cannot be made up just with coins of 2.",
      },
      {
        input: "coins = [1], amount = 0",
        output: "0",
        explanation: "Amount of 0 needs 0 coins.",
      },
    ],
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    tags: ["Array", "Dynamic Programming", "Breadth-First Search"],
    testCases: [
      {
        input: "[1,3,4]\n6",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "[2]\n3",
        expectedOutput: "-1",
        isHidden: false,
      },
      {
        input: "[1]\n0",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "[1,2,5]\n11",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "[2,5,10,1]\n27",
        expectedOutput: "4",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const coins = JSON.parse(inputLines[0]);
  const amount = parseInt(inputLines[1]);
  console.log(coinChange(coins, amount));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> coins;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        coins.push_back(stoi(num));
    }
    
    int amount;
    cin >> amount;
    
    cout << coinChange(coins, amount) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int coinChange(int[] coins, int amount) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] coins = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            coins[i] = Integer.parseInt(parts[i].trim());
        }
        
        int amount = scanner.nextInt();
        System.out.println(coinChange(coins, amount));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Longest Increasing Subsequence",
    slug: "longest-increasing-subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `Given an integer array nums, return the length of the longest strictly increasing subsequence.

A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements. For example, [3,6,2,7] is a subsequence of the array [0,3,1,6,2,2,7].`,
    examples: [
      {
        input: "nums = [10,9,2,5,3,7,101,18]",
        output: "4",
        explanation: "The longest increasing subsequence is [2,3,7,18], therefore the length is 4.",
      },
      {
        input: "nums = [0,1,0,3,2,3]",
        output: "4",
        explanation: "The longest increasing subsequence is [0,1,2,3], therefore the length is 4.",
      },
      {
        input: "nums = [7,7,7,7,7,7,7]",
        output: "1",
        explanation: "The longest increasing subsequence is [7], therefore the length is 1.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 2500",
      "-10^4 <= nums[i] <= 10^4"
    ],
    tags: ["Array", "Binary Search", "Dynamic Programming"],
    testCases: [
      {
        input: "[10,9,2,5,3,7,101,18]",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "[0,1,0,3,2,3]",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "[7,7,7,7,7,7,7]",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "[1,3,6,7,9,4,10,5,6]",
        expectedOutput: "6",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function lengthOfLIS(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(lengthOfLIS(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

int lengthOfLIS(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    cout << lengthOfLIS(nums) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int lengthOfLIS(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(lengthOfLIS(nums));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Longest Common Subsequence",
    slug: "longest-common-subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.

A subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.

For example, "ace" is a subsequence of "abcde".
A common subsequence of two strings is a subsequence that is common to both strings.`,
    examples: [
      {
        input: 'text1 = "abcde", text2 = "ace"',
        output: "3",
        explanation: 'The longest common subsequence is "ace" and its length is 3.',
      },
      {
        input: 'text1 = "abc", text2 = "abc"',
        output: "3",
        explanation: 'The longest common subsequence is "abc" and its length is 3.',
      },
      {
        input: 'text1 = "abc", text2 = "def"',
        output: "0",
        explanation: "There is no such common subsequence, so the result is 0.",
      },
    ],
    constraints: [
      "1 <= text1.length, text2.length <= 1000",
      "text1 and text2 consist of only lowercase English characters."
    ],
    tags: ["String", "Dynamic Programming"],
    testCases: [
      {
        input: "abcde\nace",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "abc\nabc",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "abc\ndef",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "bl\nyby",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "ezupkr\nubmrapg",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function longestCommonSubsequence(text1, text2) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const text1 = inputLines[0].trim();
  const text2 = inputLines[1].trim();
  console.log(longestCommonSubsequence(text1, text2));
});`,
      cpp: `#include<iostream>
#include<string>
#include<vector>
#include<algorithm>
using namespace std;

int longestCommonSubsequence(string text1, string text2) {
    // Write your code here
    
}

int main() {
    string text1, text2;
    getline(cin, text1);
    getline(cin, text2);
    cout << longestCommonSubsequence(text1, text2) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int longestCommonSubsequence(String text1, String text2) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String text1 = scanner.nextLine();
        String text2 = scanner.nextLine();
        System.out.println(longestCommonSubsequence(text1, text2));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Word Break",
    slug: "word-break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation: 'Return true because "leetcode" can be segmented as "leet code".',
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: "true",
        explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple".',
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: "false",
        explanation: "The string cannot be segmented.",
      },
    ],
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of only lowercase English letters.",
      "All the strings of wordDict are unique."
    ],
    tags: ["Hash Table", "String", "Dynamic Programming", "Trie", "Memoization"],
    testCases: [
      {
        input: "leetcode\n[\"leet\",\"code\"]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "applepenapple\n[\"apple\",\"pen\"]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "catsandog\n[\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "aaaaaaa\n[\"aaaa\",\"aaa\"]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "a\n[\"a\"]",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const s = inputLines[0].trim();
  const wordDict = JSON.parse(inputLines[1]);
  console.log(wordBreak(s, wordDict));
});`,
      cpp: `#include<iostream>
#include<string>
#include<vector>
#include<unordered_set>
using namespace std;

bool wordBreak(string s, vector<string>& wordDict) {
    // Write your code here
    
}

int main() {
    string s;
    getline(cin, s);
    
    string line;
    getline(cin, line);
    
    vector<string> wordDict;
    line = line.substr(1, line.length()-2);
    size_t start = 0;
    while(start < line.length()) {
        size_t pos = line.find("\",\"", start);
        if(pos == string::npos) {
            string word = line.substr(start + 1, line.length() - start - 2);
            wordDict.push_back(word);
            break;
        }
        string word = line.substr(start + 1, pos - start - 1);
        wordDict.push_back(word);
        start = pos + 3;
    }
    
    cout << (wordBreak(s, wordDict) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean wordBreak(String s, List<String> wordDict) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        List<String> wordDict = new ArrayList<>();
        for(String part : parts) {
            wordDict.add(part.substring(1, part.length()-1));
        }
        
        System.out.println(wordBreak(s, wordDict));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Combination Sum",
    slug: "combination-sum",
    difficulty: "Medium",
    category: "Array",
    description: `Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.

The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

The test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.`,
    examples: [
      {
        input: "candidates = [2,3,6,7], target = 7",
        output: "[[2,2,3],[7]]",
        explanation: "2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times. 7 is a candidate, and 7 = 7. These are the only two combinations.",
      },
      {
        input: "candidates = [2,3,5], target = 8",
        output: "[[2,2,2,2],[2,3,3],[3,5]]",
        explanation: "The combinations that sum to 8 are the ones listed above.",
      },
      {
        input: "candidates = [2], target = 1",
        output: "[]",
        explanation: "There are no combinations that sum to 1.",
      },
    ],
    constraints: [
      "1 <= candidates.length <= 30",
      "2 <= candidates[i] <= 40",
      "All elements of candidates are distinct.",
      "1 <= target <= 40"
    ],
    tags: ["Array", "Backtracking"],
    testCases: [
      {
        input: "[2,3,6,7]\n7",
        expectedOutput: "[[2,2,3],[7]]",
        isHidden: false,
      },
      {
        input: "[2,3,5]\n8",
        expectedOutput: "[[2,2,2,2],[2,3,3],[3,5]]",
        isHidden: false,
      },
      {
        input: "[2]\n1",
        expectedOutput: "[]",
        isHidden: true,
      },
      {
        input: "[1]\n1",
        expectedOutput: "[[1]]",
        isHidden: true,
      },
      {
        input: "[1]\n2",
        expectedOutput: "[[1,1]]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function combinationSum(candidates, target) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const candidates = JSON.parse(inputLines[0]);
  const target = parseInt(inputLines[1]);
  const result = combinationSum(candidates, target);
  console.log(JSON.stringify(result));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> candidates;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        candidates.push_back(stoi(num));
    }
    
    int target;
    cin >> target;
    
    vector<vector<int>> result = combinationSum(candidates, target);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << "[";
        for(int j = 0; j < result[i].size(); j++) {
            cout << result[i][j];
            if(j < result[i].size() - 1) cout << ",";
        }
        cout << "]";
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] candidates = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            candidates[i] = Integer.parseInt(parts[i].trim());
        }
        
        int target = scanner.nextInt();
        List<List<Integer>> result = combinationSum(candidates, target);
        
        System.out.print("[");
        for(int i = 0; i < result.size(); i++) {
            System.out.print("[");
            for(int j = 0; j < result.get(i).size(); j++) {
                System.out.print(result.get(i).get(j));
                if(j < result.get(i).size() - 1) System.out.print(",");
            }
            System.out.print("]");
            if(i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "House Robber",
    slug: "house-robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "4",
        explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.",
      },
      {
        input: "nums = [2,7,9,3,1]",
        output: "12",
        explanation: "Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total amount you can rob = 2 + 9 + 1 = 12.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 400"
    ],
    tags: ["Array", "Dynamic Programming"],
    testCases: [
      {
        input: "[1,2,3,1]",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "[2,7,9,3,1]",
        expectedOutput: "12",
        isHidden: false,
      },
      {
        input: "[2,1,1,2]",
        expectedOutput: "4",
        isHidden: true,
      },
      {
        input: "[5]",
        expectedOutput: "5",
        isHidden: true,
      },
      {
        input: "[1,2]",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function rob(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(rob(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

int rob(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    cout << rob(nums) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int rob(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(rob(nums));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "House Robber II",
    slug: "house-robber-ii",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are arranged in a circle. That means the first house is the neighbor of the last one. Meanwhile, adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    examples: [
      {
        input: "nums = [2,3,2]",
        output: "3",
        explanation: "You cannot rob house 1 (money = 2) and then rob house 3 (money = 2), because they are adjacent houses.",
      },
      {
        input: "nums = [1,2,3,1]",
        output: "4",
        explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4.",
      },
      {
        input: "nums = [1,2,3]",
        output: "3",
        explanation: "You can rob house 2 or house 3, both give you 3 money.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 100",
      "0 <= nums[i] <= 1000"
    ],
    tags: ["Array", "Dynamic Programming"],
    testCases: [
      {
        input: "[2,3,2]",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "[1,2,3,1]",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "[1,2,3]",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "[1,7,9,2]",
        expectedOutput: "10",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function rob(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(rob(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

int rob(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    cout << rob(nums) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int rob(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(rob(nums));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Decode Ways",
    slug: "decode-ways",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `A message containing letters from A-Z can be encoded into numbers using the following mapping:

'A' -> "1"
'B' -> "2"
...
'Z' -> "26"

To decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above (there may be multiple ways). For example, "11106" can be mapped into:

"AAJF" with the grouping (1 1 10 6)
"KJF" with the grouping (11 10 6)

Note that the grouping (1 11 06) is invalid because "06" cannot be mapped into 'F' since "6" is different from "06".

Given a string s containing only digits, return the number of ways to decode it.

The test cases are generated so that the answer fits in a 32-bit integer.`,
    examples: [
      {
        input: 's = "12"',
        output: "2",
        explanation: '"12" could be decoded as "AB" (1 2) or "L" (12).',
      },
      {
        input: 's = "226"',
        output: "3",
        explanation: '"226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).',
      },
      {
        input: 's = "06"',
        output: "0",
        explanation: '"06" cannot be mapped to "F" because of the leading zero ("6" is different from "06").',
      },
    ],
    constraints: [
      "1 <= s.length <= 100",
      "s contains only digits and may contain leading zero(s)."
    ],
    tags: ["String", "Dynamic Programming"],
    testCases: [
      {
        input: "12",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "226",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "06",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "10",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "2101",
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function numDecodings(s) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const s = input.trim();
  console.log(numDecodings(s));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<string>
#include<vector>
using namespace std;

int numDecodings(string s) {
    // Write your code here
    
}

int main() {
    string s;
    getline(cin, s);
    cout << numDecodings(s) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int numDecodings(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        System.out.println(numDecodings(s));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Unique Paths",
    slug: "unique-paths",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.

Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.

The test cases are generated so that the answer will be less than or equal to 2 * 10^9.`,
    examples: [
      {
        input: "m = 3, n = 7",
        output: "28",
        explanation: "There are 28 unique paths from top-left to bottom-right.",
      },
      {
        input: "m = 3, n = 2",
        output: "3",
        explanation: "From the top-left corner, there are a total of 3 ways to reach the bottom-right corner: 1. Right -> Down -> Down 2. Down -> Down -> Right 3. Down -> Right -> Down",
      },
    ],
    constraints: [
      "1 <= m, n <= 100"
    ],
    tags: ["Math", "Dynamic Programming", "Combinatorics"],
    testCases: [
      {
        input: "3\n7",
        expectedOutput: "28",
        isHidden: false,
      },
      {
        input: "3\n2",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "1\n1",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "2\n3",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "23\n12",
        expectedOutput: "193536720",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function uniquePaths(m, n) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const m = parseInt(inputLines[0]);
  const n = parseInt(inputLines[1]);
  console.log(uniquePaths(m, n));
});`,
      cpp: `#include<iostream>
#include<vector>
using namespace std;

int uniquePaths(int m, int n) {
    // Write your code here
    
}

int main() {
    int m, n;
    cin >> m >> n;
    cout << uniquePaths(m, n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int uniquePaths(int m, int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int m = scanner.nextInt();
        int n = scanner.nextInt();
        System.out.println(uniquePaths(m, n));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Jump Game",
    slug: "jump-game",
    difficulty: "Medium",
    category: "Array",
    description: `You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.

Return true if you can reach the last index, or false otherwise.`,
    examples: [
      {
        input: "nums = [2,3,1,1,4]",
        output: "true",
        explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index.",
      },
      {
        input: "nums = [3,2,1,0,4]",
        output: "false",
        explanation: "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.",
      },
    ],
    constraints: [
      "1 <= nums.length <= 10^4",
      "0 <= nums[i] <= 10^5"
    ],
    tags: ["Array", "Dynamic Programming", "Greedy"],
    testCases: [
      {
        input: "[2,3,1,1,4]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[3,2,1,0,4]",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "[2,0,0]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "[0]",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function canJump(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(canJump(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

bool canJump(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    cout << (canJump(nums) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean canJump(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        System.out.println(canJump(nums));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    category: "String",
    description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation: "Both strings contain the same characters with the same frequency.",
      },
      {
        input: 's = "rat", t = "car"',
        output: "false",
        explanation: "The strings do not contain the same characters.",
      },
    ],
    constraints: [
      "1 <= s.length, t.length <= 5 * 10^4",
      "s and t consist of lowercase English letters."
    ],
    tags: ["Hash Table", "String", "Sorting"],
    testCases: [
      {
        input: "anagram\nnagaram",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "rat\ncar",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "a\nab",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "listen\nsilent",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "ab\nba",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function isAnagram(s, t) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const s = inputLines[0].trim();
  const t = inputLines[1].trim();
  console.log(isAnagram(s, t));
});`,
      cpp: `#include<iostream>
#include<string>
#include<unordered_map>
#include<algorithm>
using namespace std;

bool isAnagram(string s, string t) {
    // Write your code here
    
}

int main() {
    string s, t;
    getline(cin, s);
    getline(cin, t);
    cout << (isAnagram(s, t) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean isAnagram(String s, String t) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        String t = scanner.nextLine();
        System.out.println(isAnagram(s, t));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "Medium",
    category: "String",
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "Words that are anagrams of each other are grouped together.",
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
        explanation: "Empty string is grouped by itself.",
      },
      {
        input: 'strs = ["a"]',
        output: '[["a"]]',
        explanation: "Single character string is grouped by itself.",
      },
    ],
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    tags: ["Array", "Hash Table", "String", "Sorting"],
    testCases: [
      {
        input: '["eat","tea","tan","ate","nat","bat"]',
        expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        isHidden: false,
      },
      {
        input: '[""]',
        expectedOutput: '[[""]]',
        isHidden: false,
      },
      {
        input: '["a"]',
        expectedOutput: '[["a"]]',
        isHidden: true,
      },
      {
        input: '["abc","bca","cab","xyz"]',
        expectedOutput: '[["abc","bca","cab"],["xyz"]]',
        isHidden: true,
      },
      {
        input: '["ddddddddddg","dgggggggggg"]',
        expectedOutput: '[["ddddddddddg"],["dgggggggggg"]]',
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const strs = JSON.parse(input.trim());
  const result = groupAnagrams(strs);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<string>
#include<unordered_map>
#include<algorithm>
using namespace std;

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<string> strs;
    line = line.substr(1, line.length()-2);
    size_t start = 0;
    while(start < line.length()) {
        size_t pos = line.find("\",\"", start);
        if(pos == string::npos) {
            string word = line.substr(start + 1, line.length() - start - 2);
            strs.push_back(word);
            break;
        }
        string word = line.substr(start + 1, pos - start - 1);
        strs.push_back(word);
        start = pos + 3;
    }
    
    vector<vector<string>> result = groupAnagrams(strs);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << "[";
        for(int j = 0; j < result[i].size(); j++) {
            cout << "\"" << result[i][j] << "\"";
            if(j < result[i].size() - 1) cout << ",";
        }
        cout << "]";
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        String[] strs = new String[parts.length];
        for(int i = 0; i < parts.length; i++) {
            strs[i] = parts[i].substring(1, parts[i].length()-1);
        }
        
        List<List<String>> result = groupAnagrams(strs);
        System.out.print("[");
        for(int i = 0; i < result.size(); i++) {
            System.out.print("[");
            for(int j = 0; j < result.get(i).size(); j++) {
                System.out.print("\"" + result.get(i).get(j) + "\"");
                if(j < result.get(i).size() - 1) System.out.print(",");
            }
            System.out.print("]");
            if(i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    category: "String",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
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
      {
        input: 's = "(]"',
        output: "false",
        explanation: "Mismatched bracket types.",
      },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    tags: ["String", "Stack"],
    testCases: [
      {
        input: "()",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "()[]{}",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "(]",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "([)]",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "{[]}",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const s = input.trim();
  console.log(isValid(s));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<string>
#include<stack>
using namespace std;

bool isValid(string s) {
    // Write your code here
    
}

int main() {
    string s;
    getline(cin, s);
    cout << (isValid(s) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        System.out.println(isValid(s));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Valid Palindrome",
    slug: "valid-palindrome",
    difficulty: "Easy",
    category: "String",
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: "true",
        explanation: 's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.',
      },
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    tags: ["Two Pointers", "String"],
    testCases: [
      {
        input: "A man, a plan, a canal: Panama",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "race a car",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: " ",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "Madam",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "No 'x' in Nixon",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function isPalindrome(s) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const s = input.trim();
  console.log(isPalindrome(s));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<string>
#include<cctype>
using namespace std;

bool isPalindrome(string s) {
    // Write your code here
    
}

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean isPalindrome(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        System.out.println(isPalindrome(s));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    difficulty: "Medium",
    category: "String",
    description: `Given a string s, return the longest palindromic substring in s.`,
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.',
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
        explanation: "The longest palindromic substring is 'bb'.",
      },
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    tags: ["String", "Dynamic Programming"],
    testCases: [
      {
        input: "babad",
        expectedOutput: "bab",
        isHidden: false,
      },
      {
        input: "cbbd",
        expectedOutput: "bb",
        isHidden: false,
      },
      {
        input: "a",
        expectedOutput: "a",
        isHidden: true,
      },
      {
        input: "ac",
        expectedOutput: "a",
        isHidden: true,
      },
      {
        input: "racecar",
        expectedOutput: "racecar",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function longestPalindrome(s) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const s = input.trim();
  console.log(longestPalindrome(s));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<string>
using namespace std;

string longestPalindrome(string s) {
    // Write your code here
    
}

int main() {
    string s;
    getline(cin, s);
    cout << longestPalindrome(s) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static String longestPalindrome(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        System.out.println(longestPalindrome(s));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Palindromic Substrings",
    slug: "palindromic-substrings",
    difficulty: "Medium",
    category: "String",
    description: `Given a string s, return the number of palindromic substrings in it.

A string is a palindrome when it reads the same backward as forward.

A substring is a contiguous sequence of characters within the string.`,
    examples: [
      {
        input: 's = "abc"',
        output: "3",
        explanation: 'Three palindromic strings: "a", "b", "c".',
      },
      {
        input: 's = "aaa"',
        output: "6",
        explanation: 'Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".',
      },
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consists of lowercase English letters."
    ],
    tags: ["String", "Dynamic Programming"],
    testCases: [
      {
        input: "abc",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "aaa",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "racecar",
        expectedOutput: "10",
        isHidden: true,
      },
      {
        input: "a",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "abccba",
        expectedOutput: "9",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function countSubstrings(s) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const s = input.trim();
  console.log(countSubstrings(s));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<string>
using namespace std;

int countSubstrings(string s) {
    // Write your code here
    
}

int main() {
    string s;
    getline(cin, s);
    cout << countSubstrings(s) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int countSubstrings(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        System.out.println(countSubstrings(s));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    category: "String",
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.',
      },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    tags: ["Hash Table", "String", "Sliding Window"],
    testCases: [
      {
        input: "abcabcbb",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "bbbbb",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "pwwkew",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "dvdf",
        expectedOutput: "3",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const s = input.trim();
  console.log(lengthOfLongestSubstring(s));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<string>
#include<unordered_set>
#include<algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Write your code here
    
}

int main() {
    string s;
    getline(cin, s);
    cout << lengthOfLongestSubstring(s) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        System.out.println(lengthOfLongestSubstring(s));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Longest Repeating Character Replacement",
    slug: "longest-repeating-character-replacement",
    difficulty: "Medium",
    category: "String",
    description: `You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times.

Return the length of the longest substring containing the same letter you can get after performing the above operations.`,
    examples: [
      {
        input: 's = "ABAB", k = 2',
        output: "4",
        explanation: 'Replace the two \'A\'s with two \'B\'s or vice versa.',
      },
      {
        input: 's = "AABABBA", k = 1',
        output: "4",
        explanation: 'Replace the one \'A\' in the middle with \'B\' and form "AABBBBA". The substring "BBBB" has the longest repeating letters, which is 4.',
      },
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s consists of only uppercase English letters.",
      "0 <= k <= s.length"
    ],
    tags: ["Hash Table", "String", "Sliding Window"],
    testCases: [
      {
        input: "ABAB\n2",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "AABABBA\n1",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "AAAA\n0",
        expectedOutput: "4",
        isHidden: true,
      },
      {
        input: "ABCDEF\n2",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "ABABACB\n3",
        expectedOutput: "7",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function characterReplacement(s, k) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const s = inputLines[0].trim();
  const k = parseInt(inputLines[1]);
  console.log(characterReplacement(s, k));
});`,
      cpp: `#include<iostream>
#include<string>
#include<unordered_map>
#include<algorithm>
using namespace std;

int characterReplacement(string s, int k) {
    // Write your code here
    
}

int main() {
    string s;
    int k;
    getline(cin, s);
    cin >> k;
    cout << characterReplacement(s, k) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int characterReplacement(String s, int k) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        int k = scanner.nextInt();
        System.out.println(characterReplacement(s, k));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Minimum Window Substring",
    slug: "minimum-window-substring",
    difficulty: "Hard",
    category: "String",
    description: `Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".

The testcases will be generated such that the answer is unique.

A substring is a contiguous sequence of characters within the string.`,
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.',
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
        explanation: 'The entire string s is the minimum window.',
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation: "Both 'a's from t must be included in the window. Since the largest window of s only has one 'a', return empty string.",
      },
    ],
    constraints: [
      "m == s.length",
      "n == t.length",
      "1 <= m, n <= 10^5",
      "s and t consist of uppercase and lowercase English letters."
    ],
    tags: ["Hash Table", "String", "Sliding Window"],
    testCases: [
      {
        input: "ADOBECODEBANC\nABC",
        expectedOutput: "BANC",
        isHidden: false,
      },
      {
        input: "a\na",
        expectedOutput: "a",
        isHidden: false,
      },
      {
        input: "a\naa",
        expectedOutput: "",
        isHidden: true,
      },
      {
        input: "ab\nb",
        expectedOutput: "b",
        isHidden: true,
      },
      {
        input: "cabwefgewcwaefgcf\ncae",
        expectedOutput: "cwae",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function minWindow(s, t) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const s = inputLines[0].trim();
  const t = inputLines[1].trim();
  console.log(minWindow(s, t));
});`,
      cpp: `#include<iostream>
#include<string>
#include<unordered_map>
#include<climits>
using namespace std;

string minWindow(string s, string t) {
    // Write your code here
    
}

int main() {
    string s, t;
    getline(cin, s);
    getline(cin, t);
    cout << minWindow(s, t) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static String minWindow(String s, String t) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        String t = scanner.nextLine();
        System.out.println(minWindow(s, t));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Invert Binary Tree",
    slug: "invert-binary-tree",
    difficulty: "Easy",
    category: "Tree",
    description: `Given the root of a binary tree, invert the tree, and return its root.`,
    examples: [
      {
        input: "root = [4,2,7,1,3,6,9]",
        output: "[4,7,2,9,6,3,1]",
        explanation: "The tree is inverted.",
      },
      {
        input: "root = [2,1,3]",
        output: "[2,3,1]",
        explanation: "The tree is inverted.",
      },
      {
        input: "root = []",
        output: "[]",
        explanation: "Empty tree remains empty.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    testCases: [
      {
        input: "[4,2,7,1,3,6,9]",
        expectedOutput: "[4,7,2,9,6,3,1]",
        isHidden: false,
      },
      {
        input: "[2,1,3]",
        expectedOutput: "[2,3,1]",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "[]",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "[1]",
        isHidden: true,
      },
      {
        input: "[1,2]",
        expectedOutput: "[1,null,2]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function invertTree(root) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

function treeToArray(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length) {
        const node = queue.shift();
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }
    while (result[result.length - 1] === null) result.pop();
    return result;
}

rl.on('line', (input) => {
  const arr = JSON.parse(input.trim());
  const root = buildTree(arr);
  const inverted = invertTree(root);
  console.log(JSON.stringify(treeToArray(inverted)));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

TreeNode* invertTree(TreeNode* root) {
    // Write your code here
    
}

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

vector<int> treeToArray(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        if (node) {
            result.push_back(node->val);
            q.push(node->left);
            q.push(node->right);
        } else {
            result.push_back(-1);
        }
    }
    while (!result.empty() && result.back() == -1) result.pop_back();
    return result;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        if (num == "null") {
            arr.push_back(-1);
        } else {
            arr.push_back(stoi(num));
        }
    }
    
    TreeNode* root = buildTree(arr);
    TreeNode* inverted = invertTree(root);
    vector<int> result = treeToArray(inverted);
    
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        if (result[i] == -1) cout << "null";
        else cout << result[i];
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static TreeNode invertTree(TreeNode root) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static List<Integer> treeToArray(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node != null) {
                result.add(node.val);
                queue.offer(node.left);
                queue.offer(node.right);
            } else {
                result.add(null);
            }
        }
        while (!result.isEmpty() && result.get(result.size() - 1) == null) {
            result.remove(result.size() - 1);
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        Integer[] arr = new Integer[parts.length];
        for(int i = 0; i < parts.length; i++) {
            if (parts[i].trim().equals("null")) {
                arr[i] = null;
            } else {
                arr[i] = Integer.parseInt(parts[i].trim());
            }
        }
        
        TreeNode root = buildTree(arr);
        TreeNode inverted = invertTree(root);
        List<Integer> result = treeToArray(inverted);
        
        System.out.print("[");
        for(int i = 0; i < result.size(); i++) {
            if (result.get(i) == null) System.out.print("null");
            else System.out.print(result.get(i));
            if(i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Maximum Depth of Binary Tree",
    slug: "maximum-depth-of-binary-tree",
    difficulty: "Easy",
    category: "Tree",
    description: `Given the root of a binary tree, return its maximum depth.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "3",
        explanation: "The maximum depth is 3.",
      },
      {
        input: "root = [1,null,2]",
        output: "2",
        explanation: "The maximum depth is 2.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-100 <= Node.val <= 100"
    ],
    tags: ["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"],
    testCases: [
      {
        input: "[3,9,20,null,null,15,7]",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "[1,null,2]",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "[1,2,3,4,null,null,5]",
        expectedOutput: "3",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function maxDepth(root) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

rl.on('line', (input) => {
  const arr = JSON.parse(input.trim());
  const root = buildTree(arr);
  console.log(maxDepth(root));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
#include<algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

int maxDepth(TreeNode* root) {
    // Write your code here
    
}

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        if (num == "null") {
            arr.push_back(-1);
        } else {
            arr.push_back(stoi(num));
        }
    }
    
    TreeNode* root = buildTree(arr);
    cout << maxDepth(root) << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static int maxDepth(TreeNode root) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        Integer[] arr = new Integer[parts.length];
        for(int i = 0; i < parts.length; i++) {
            if (parts[i].trim().equals("null")) {
                arr[i] = null;
            } else {
                arr[i] = Integer.parseInt(parts[i].trim());
            }
        }
        
        TreeNode root = buildTree(arr);
        System.out.println(maxDepth(root));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Same Tree",
    slug: "same-tree",
    difficulty: "Easy",
    category: "Tree",
    description: `Given the roots of two binary trees p and q, write a function to check if they are the same or not.

Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.`,
    examples: [
      {
        input: "p = [1,2,3], q = [1,2,3]",
        output: "true",
        explanation: "Both trees are identical.",
      },
      {
        input: "p = [1,2], q = [1,null,2]",
        output: "false",
        explanation: "Trees have different structures.",
      },
      {
        input: "p = [1,2,1], q = [1,1,2]",
        output: "false",
        explanation: "Trees have different node values.",
      },
    ],
    constraints: [
      "The number of nodes in both trees is in the range [0, 100].",
      "-10^4 <= Node.val <= 10^4"
    ],
    tags: ["Tree", "Depth-First Search", "Binary Tree"],
    testCases: [
      {
        input: "[1,2,3]\n[1,2,3]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[1,2]\n[1,null,2]",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "[1,2,1]\n[1,1,2]",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "[]\n[]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "[1]\n[1]",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function isSameTree(p, q) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const p = buildTree(JSON.parse(inputLines[0]));
  const q = buildTree(JSON.parse(inputLines[1]));
  console.log(isSameTree(p, q));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

bool isSameTree(TreeNode* p, TreeNode* q) {
    // Write your code here
    
}

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

int main() {
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    
    vector<int> arr1, arr2;
    
    // Parse first tree
    line1 = line1.substr(1, line1.length()-2);
    stringstream ss1(line1);
    string num;
    while(getline(ss1, num, ',')) {
        if (num == "null") {
            arr1.push_back(-1);
        } else {
            arr1.push_back(stoi(num));
        }
    }
    
    // Parse second tree
    line2 = line2.substr(1, line2.length()-2);
    stringstream ss2(line2);
    while(getline(ss2, num, ',')) {
        if (num == "null") {
            arr2.push_back(-1);
        } else {
            arr2.push_back(stoi(num));
        }
    }
    
    TreeNode* p = buildTree(arr1);
    TreeNode* q = buildTree(arr2);
    cout << (isSameTree(p, q) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static boolean isSameTree(TreeNode p, TreeNode q) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line1 = scanner.nextLine();
        String line2 = scanner.nextLine();
        
        // Parse first tree
        line1 = line1.substring(1, line1.length()-1);
        String[] parts1 = line1.split(",");
        Integer[] arr1 = new Integer[parts1.length];
        for(int i = 0; i < parts1.length; i++) {
            if (parts1[i].trim().equals("null")) {
                arr1[i] = null;
            } else {
                arr1[i] = Integer.parseInt(parts1[i].trim());
            }
        }
        
        // Parse second tree
        line2 = line2.substring(1, line2.length()-1);
        String[] parts2 = line2.split(",");
        Integer[] arr2 = new Integer[parts2.length];
        for(int i = 0; i < parts2.length; i++) {
            if (parts2[i].trim().equals("null")) {
                arr2[i] = null;
            } else {
                arr2[i] = Integer.parseInt(parts2[i].trim());
            }
        }
        
        TreeNode p = buildTree(arr1);
        TreeNode q = buildTree(arr2);
        System.out.println(isSameTree(p, q));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Subtree of Another Tree",
    slug: "subtree-of-another-tree",
    difficulty: "Easy",
    category: "Tree",
    description: `Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot and false otherwise.

A subtree of a binary tree tree is a tree that consists of a node in tree and all of this node's descendants. The tree tree could also be considered as a subtree of itself.`,
    examples: [
      {
        input: "root = [3,4,5,1,2], subRoot = [4,1,2]",
        output: "true",
        explanation: "The subtree [4,1,2] exists in the root tree.",
      },
      {
        input: "root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]",
        output: "false",
        explanation: "The subtree structure doesn't match exactly.",
      },
    ],
    constraints: [
      "The number of nodes in the root tree is in the range [1, 2000].",
      "The number of nodes in the subRoot tree is in the range [1, 1000].",
      "-10^4 <= root.val <= 10^4",
      "-10^4 <= subRoot.val <= 10^4"
    ],
    tags: ["Tree", "Depth-First Search", "String Matching", "Binary Tree", "Hash Function"],
    testCases: [
      {
        input: "[3,4,5,1,2]\n[4,1,2]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[3,4,5,1,2,null,null,null,null,0]\n[4,1,2]",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "[1,2,3]\n[1,2]",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "[1]\n[1]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "[1,null,1,null,1,null,1,null,1,null,1,null,1,null,1,null,1,null,1,null,1,2]\n[1,null,1,null,1,null,1,null,1,null,1,2]",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function isSubtree(root, subRoot) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const root = buildTree(JSON.parse(inputLines[0]));
  const subRoot = buildTree(JSON.parse(inputLines[1]));
  console.log(isSubtree(root, subRoot));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    // Write your code here
    
}

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

int main() {
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    
    vector<int> arr1, arr2;
    
    // Parse first tree
    line1 = line1.substr(1, line1.length()-2);
    stringstream ss1(line1);
    string num;
    while(getline(ss1, num, ',')) {
        if (num == "null") {
            arr1.push_back(-1);
        } else {
            arr1.push_back(stoi(num));
        }
    }
    
    // Parse second tree
    line2 = line2.substr(1, line2.length()-2);
    stringstream ss2(line2);
    while(getline(ss2, num, ',')) {
        if (num == "null") {
            arr2.push_back(-1);
        } else {
            arr2.push_back(stoi(num));
        }
    }
    
    TreeNode* root = buildTree(arr1);
    TreeNode* subRoot = buildTree(arr2);
    cout << (isSubtree(root, subRoot) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static boolean isSubtree(TreeNode root, TreeNode subRoot) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line1 = scanner.nextLine();
        String line2 = scanner.nextLine();
        
        // Parse first tree
        line1 = line1.substring(1, line1.length()-1);
        String[] parts1 = line1.split(",");
        Integer[] arr1 = new Integer[parts1.length];
        for(int i = 0; i < parts1.length; i++) {
            if (parts1[i].trim().equals("null")) {
                arr1[i] = null;
            } else {
                arr1[i] = Integer.parseInt(parts1[i].trim());
            }
        }
        
        // Parse second tree
        line2 = line2.substring(1, line2.length()-1);
        String[] parts2 = line2.split(",");
        Integer[] arr2 = new Integer[parts2.length];
        for(int i = 0; i < parts2.length; i++) {
            if (parts2[i].trim().equals("null")) {
                arr2[i] = null;
            } else {
                arr2[i] = Integer.parseInt(parts2[i].trim());
            }
        }
        
        TreeNode root = buildTree(arr1);
        TreeNode subRoot = buildTree(arr2);
        System.out.println(isSubtree(root, subRoot));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Lowest Common Ancestor of a Binary Search Tree",
    slug: "lowest-common-ancestor-of-a-binary-search-tree",
    difficulty: "Medium",
    category: "Tree",
    description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."`,
    examples: [
      {
        input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
        output: "6",
        explanation: "The LCA of nodes 2 and 8 is 6.",
      },
      {
        input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4",
        output: "2",
        explanation: "The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself according to the LCA definition.",
      },
      {
        input: "root = [2,1], p = 2, q = 1",
        output: "2",
        explanation: "The LCA of nodes 2 and 1 is 2.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [2, 10^5].",
      "-10^9 <= Node.val <= 10^9",
      "All Node.val are unique.",
      "p != q",
      "p and q will exist in the tree."
    ],
    tags: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    testCases: [
      {
        input: "[6,2,8,0,4,7,9,null,null,3,5]\n2\n8",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "[6,2,8,0,4,7,9,null,null,3,5]\n2\n4",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "[2,1]\n2\n1",
        expectedOutput: "2",
        isHidden: true,
      },
      {
        input: "[5,3,6,2,4,null,null,1]\n1\n4",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "[2,1,3]\n1\n3",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function lowestCommonAncestor(root, p, q) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const root = buildTree(JSON.parse(inputLines[0]));
  const p = new TreeNode(parseInt(inputLines[1]));
  const q = new TreeNode(parseInt(inputLines[2]));
  const lca = lowestCommonAncestor(root, p, q);
  console.log(lca.val);
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    // Write your code here
    
}

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> queue;
    queue.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = queue.front();
        queue.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            queue.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            queue.push(node->right);
        }
        i++;
    }
    return root;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        if (num == "null") {
            arr.push_back(-1);
        } else {
            arr.push_back(stoi(num));
        }
    }
    
    TreeNode* root = buildTree(arr);
    
    int pVal, qVal;
    cin >> pVal >> qVal;
    
    TreeNode* p = new TreeNode(pVal);
    TreeNode* q = new TreeNode(qVal);
    
    TreeNode* lca = lowestCommonAncestor(root, p, q);
    cout << lca->val << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        Integer[] arr = new Integer[parts.length];
        for(int i = 0; i < parts.length; i++) {
            if (parts[i].trim().equals("null")) {
                arr[i] = null;
            } else {
                arr[i] = Integer.parseInt(parts[i].trim());
            }
        }
        
        TreeNode root = buildTree(arr);
        int pVal = scanner.nextInt();
        int qVal = scanner.nextInt();
        
        TreeNode p = new TreeNode(pVal);
        TreeNode q = new TreeNode(qVal);
        
        TreeNode lca = lowestCommonAncestor(root, p, q);
        System.out.println(lca.val);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Binary Tree Level Order Traversal",
    slug: "binary-tree-level-order-traversal",
    difficulty: "Medium",
    category: "Tree",
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
        explanation: "Level order traversal groups nodes by level.",
      },
      {
        input: "root = [1]",
        output: "[[1]]",
        explanation: "Single node forms one level.",
      },
      {
        input: "root = []",
        output: "[]",
        explanation: "Empty tree has no levels.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    tags: ["Tree", "Breadth-First Search", "Binary Tree"],
    testCases: [
      {
        input: "[3,9,20,null,null,15,7]",
        expectedOutput: "[[3],[9,20],[15,7]]",
        isHidden: false,
      },
      {
        input: "[1]",
        expectedOutput: "[[1]]",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "[]",
        isHidden: true,
      },
      {
        input: "[1,2,3,4,null,null,5]",
        expectedOutput: "[[1],[2,3],[4,5]]",
        isHidden: true,
      },
      {
        input: "[1,2]",
        expectedOutput: "[[1],[2]]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function levelOrder(root) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

rl.on('line', (input) => {
  const arr = JSON.parse(input.trim());
  const root = buildTree(arr);
  const result = levelOrder(root);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

vector<vector<int>> levelOrder(TreeNode* root) {
    // Write your code here
    
}

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        if (num == "null") {
            arr.push_back(-1);
        } else {
            arr.push_back(stoi(num));
        }
    }
    
    TreeNode* root = buildTree(arr);
    vector<vector<int>> result = levelOrder(root);
    
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << "[";
        for(int j = 0; j < result[i].size(); j++) {
            cout << result[i][j];
            if(j < result[i].size() - 1) cout << ",";
        }
        cout << "]";
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static List<List<Integer>> levelOrder(TreeNode root) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        Integer[] arr = new Integer[parts.length];
        for(int i = 0; i < parts.length; i++) {
            if (parts[i].trim().equals("null")) {
                arr[i] = null;
            } else {
                arr[i] = Integer.parseInt(parts[i].trim());
            }
        }
        
        TreeNode root = buildTree(arr);
        List<List<Integer>> result = levelOrder(root);
        
        System.out.print("[");
        for(int i = 0; i < result.size(); i++) {
            System.out.print("[");
            for(int j = 0; j < result.get(i).size(); j++) {
                System.out.print(result.get(i).get(j));
                if(j < result.get(i).size() - 1) System.out.print(",");
            }
            System.out.print("]");
            if(i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Validate Binary Search Tree",
    slug: "validate-binary-search-tree",
    difficulty: "Medium",
    category: "Tree",
    description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees must also be binary search trees.`,
    examples: [
      {
        input: "root = [2,1,3]",
        output: "true",
        explanation: "This is a valid BST.",
      },
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false",
        explanation: "The root node's value is 5 but its right child's value is 4.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [1, 10^4].",
      "-2^31 <= Node.val <= 2^31 - 1"
    ],
    tags: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    testCases: [
      {
        input: "[2,1,3]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[5,1,4,null,null,3,6]",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "[1]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "[1,1]",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "[10,5,15,null,null,6,20]",
        expectedOutput: "false",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function isValidBST(root) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

rl.on('line', (input) => {
  const arr = JSON.parse(input.trim());
  const root = buildTree(arr);
  console.log(isValidBST(root));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
#include<climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

bool isValidBST(TreeNode* root) {
    // Write your code here
    
}

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        if (num == "null") {
            arr.push_back(-1);
        } else {
            arr.push_back(stoi(num));
        }
    }
    
    TreeNode* root = buildTree(arr);
    cout << (isValidBST(root) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static boolean isValidBST(TreeNode root) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        Integer[] arr = new Integer[parts.length];
        for(int i = 0; i < parts.length; i++) {
            if (parts[i].trim().equals("null")) {
                arr[i] = null;
            } else {
                arr[i] = Integer.parseInt(parts[i].trim());
            }
        }
        
        TreeNode root = buildTree(arr);
        System.out.println(isValidBST(root));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Kth Smallest Element in a BST",
    slug: "kth-smallest-element-in-a-bst",
    difficulty: "Medium",
    category: "Tree",
    description: `Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.`,
    examples: [
      {
        input: "root = [3,1,4,null,2], k = 1",
        output: "1",
        explanation: "The smallest element is 1.",
      },
      {
        input: "root = [5,3,6,2,4,null,null,1], k = 3",
        output: "3",
        explanation: "The 3rd smallest element is 3.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is n.",
      "1 <= k <= n <= 10^4",
      "0 <= Node.val <= 10^4"
    ],
    tags: ["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"],
    testCases: [
      {
        input: "[3,1,4,null,2]\n1",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "[5,3,6,2,4,null,null,1]\n3",
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: "[1]\n1",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "[2,1,3]\n2",
        expectedOutput: "2",
        isHidden: true,
      },
      {
        input: "[4,2,6,1,3]\n4",
        expectedOutput: "4",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function kthSmallest(root, k) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const root = buildTree(JSON.parse(inputLines[0]));
  const k = parseInt(inputLines[1]);
  console.log(kthSmallest(root, k));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

int kthSmallest(TreeNode* root, int k) {
    // Write your code here
    
}

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        if (num == "null") {
            arr.push_back(-1);
        } else {
            arr.push_back(stoi(num));
        }
    }
    
    TreeNode* root = buildTree(arr);
    int k;
    cin >> k;
    cout << kthSmallest(root, k) << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static int kthSmallest(TreeNode root, int k) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        Integer[] arr = new Integer[parts.length];
        for(int i = 0; i < parts.length; i++) {
            if (parts[i].trim().equals("null")) {
                arr[i] = null;
            } else {
                arr[i] = Integer.parseInt(parts[i].trim());
            }
        }
        
        TreeNode root = buildTree(arr);
        int k = scanner.nextInt();
        System.out.println(kthSmallest(root, k));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    slug: "construct-binary-tree-from-preorder-and-inorder-traversal",
    difficulty: "Medium",
    category: "Tree",
    description: `Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.`,
    examples: [
      {
        input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]",
        output: "[3,9,20,null,null,15,7]",
        explanation: "Tree is constructed from the traversals.",
      },
      {
        input: "preorder = [-1], inorder = [-1]",
        output: "[-1]",
        explanation: "Single node tree.",
      },
    ],
    constraints: [
      "1 <= preorder.length <= 3000",
      "inorder.length == preorder.length",
      "-3000 <= preorder[i], inorder[i] <= 3000",
      "preorder and inorder consist of unique values.",
      "Each value of inorder also appears in preorder.",
      "preorder is guaranteed to be the preorder traversal of the tree.",
      "inorder is guaranteed to be the inorder traversal of the tree."
    ],
    tags: ["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"],
    testCases: [
      {
        input: "[3,9,20,15,7]\n[9,3,15,20,7]",
        expectedOutput: "[3,9,20,null,null,15,7]",
        isHidden: false,
      },
      {
        input: "[-1]\n[-1]",
        expectedOutput: "[-1]",
        isHidden: false,
      },
      {
        input: "[1,2]\n[2,1]",
        expectedOutput: "[1,2]",
        isHidden: true,
      },
      {
        input: "[1,2,3]\n[2,1,3]",
        expectedOutput: "[1,2,null,null,3]",
        isHidden: true,
      },
      {
        input: "[3,9,20,15,7]\n[9,3,15,20,7]",
        expectedOutput: "[3,9,20,null,null,15,7]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function buildTree(preorder, inorder) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function treeToArray(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length) {
        const node = queue.shift();
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }
    while (result[result.length - 1] === null) result.pop();
    return result;
}

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const preorder = JSON.parse(inputLines[0]);
  const inorder = JSON.parse(inputLines[1]);
  const root = buildTree(preorder, inorder);
  console.log(JSON.stringify(treeToArray(root)));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
#include<unordered_map>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    // Write your code here
    
}

vector<int> treeToArray(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        if (node) {
            result.push_back(node->val);
            q.push(node->left);
            q.push(node->right);
        } else {
            result.push_back(-1);
        }
    }
    while (!result.empty() && result.back() == -1) result.pop_back();
    return result;
}

int main() {
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    
    vector<int> preorder, inorder;
    
    // Parse preorder
    line1 = line1.substr(1, line1.length()-2);
    stringstream ss1(line1);
    string num;
    while(getline(ss1, num, ',')) {
        preorder.push_back(stoi(num));
    }
    
    // Parse inorder
    line2 = line2.substr(1, line2.length()-2);
    stringstream ss2(line2);
    while(getline(ss2, num, ',')) {
        inorder.push_back(stoi(num));
    }
    
    TreeNode* root = buildTree(preorder, inorder);
    vector<int> result = treeToArray(root);
    
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        if (result[i] == -1) cout << "null";
        else cout << result[i];
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static TreeNode buildTree(int[] preorder, int[] inorder) {
        // Write your code here
        
    }
    
    public static List<Integer> treeToArray(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node != null) {
                result.add(node.val);
                queue.offer(node.left);
                queue.offer(node.right);
            } else {
                result.add(null);
            }
        }
        while (!result.isEmpty() && result.get(result.size() - 1) == null) {
            result.remove(result.size() - 1);
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line1 = scanner.nextLine();
        String line2 = scanner.nextLine();
        
        // Parse preorder
        line1 = line1.substring(1, line1.length()-1);
        String[] parts1 = line1.split(",");
        int[] preorder = new int[parts1.length];
        for(int i = 0; i < parts1.length; i++) {
            preorder[i] = Integer.parseInt(parts1[i].trim());
        }
        
        // Parse inorder
        line2 = line2.substring(1, line2.length()-1);
        String[] parts2 = line2.split(",");
        int[] inorder = new int[parts2.length];
        for(int i = 0; i < parts2.length; i++) {
            inorder[i] = Integer.parseInt(parts2[i].trim());
        }
        
        TreeNode root = buildTree(preorder, inorder);
        List<Integer> result = treeToArray(root);
        
        System.out.print("[");
        for(int i = 0; i < result.size(); i++) {
            if (result.get(i) == null) System.out.print("null");
            else System.out.print(result.get(i));
            if(i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Binary Tree Maximum Path Sum",
    slug: "binary-tree-maximum-path-sum",
    difficulty: "Hard",
    category: "Tree",
    description: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.`,
    examples: [
      {
        input: "root = [1,2,3]",
        output: "6",
        explanation: "The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.",
      },
      {
        input: "root = [-10,9,20,null,null,15,7]",
        output: "42",
        explanation: "The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [1, 3 * 10^4].",
      "-1000 <= Node.val <= 1000"
    ],
    tags: ["Dynamic Programming", "Tree", "Depth-First Search", "Binary Tree"],
    testCases: [
      {
        input: "[1,2,3]",
        expectedOutput: "6",
        isHidden: false,
      },
      {
        input: "[-10,9,20,null,null,15,7]",
        expectedOutput: "42",
        isHidden: false,
      },
      {
        input: "[1]",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "[-3]",
        expectedOutput: "-3",
        isHidden: true,
      },
      {
        input: "[2,-1]",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

function maxPathSum(root) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

rl.on('line', (input) => {
  const arr = JSON.parse(input.trim());
  const root = buildTree(arr);
  console.log(maxPathSum(root));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
#include<algorithm>
#include<climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

int maxPathSum(TreeNode* root) {
    // Write your code here
    
}

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        if (num == "null") {
            arr.push_back(-1);
        } else {
            arr.push_back(stoi(num));
        }
    }
    
    TreeNode* root = buildTree(arr);
    cout << maxPathSum(root) << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Solution {
    public static int maxPathSum(TreeNode root) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        Integer[] arr = new Integer[parts.length];
        for(int i = 0; i < parts.length; i++) {
            if (parts[i].trim().equals("null")) {
                arr[i] = null;
            } else {
                arr[i] = Integer.parseInt(parts[i].trim());
            }
        }
        
        TreeNode root = buildTree(arr);
        System.out.println(maxPathSum(root));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Serialize and Deserialize Binary Tree",
    slug: "serialize-and-deserialize-binary-tree",
    difficulty: "Hard",
    category: "Tree",
    description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.

Clarification: The input/output format is the same as how LeetCode serializes a binary tree. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself.`,
    examples: [
      {
        input: "root = [1,2,3,null,null,4,5]",
        output: "[1,2,3,null,null,4,5]",
        explanation: "The tree is serialized and then deserialized successfully.",
      },
      {
        input: "root = []",
        output: "[]",
        explanation: "Empty tree case.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 10^4].",
      "-1000 <= Node.val <= 1000"
    ],
    tags: ["String", "Tree", "Depth-First Search", "Breadth-First Search", "Design", "Binary Tree"],
    testCases: [
      {
        input: "[1,2,3,null,null,4,5]",
        expectedOutput: "[1,2,3,null,null,4,5]",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "[]",
        isHidden: false,
      },
      {
        input: "[1]",
        expectedOutput: "[1]",
        isHidden: true,
      },
      {
        input: "[1,2]",
        expectedOutput: "[1,2]",
        isHidden: true,
      },
      {
        input: "[1,null,2,null,3]",
        expectedOutput: "[1,null,2,null,3]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a binary tree node.
function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val)
    this.left = (left===undefined ? null : left)
    this.right = (right===undefined ? null : right)
}

// Encodes a tree to a single string.
function serialize(root) {
    // Write your code here
    
}

// Decodes your encoded data to tree.
function deserialize(data) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildTree(arr) {
    if (!arr.length) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

function treeToArray(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    while (queue.length) {
        const node = queue.shift();
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }
    while (result[result.length - 1] === null) result.pop();
    return result;
}

rl.on('line', (input) => {
  const arr = JSON.parse(input.trim());
  const root = buildTree(arr);
  const serialized = serialize(root);
  const deserialized = deserialize(serialized);
  console.log(JSON.stringify(treeToArray(deserialized)));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<queue>
#include<sstream>
#include<string>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Codec {
public:
    // Encodes a tree to a single string.
    string serialize(TreeNode* root) {
        // Write your code here
        
    }

    // Decodes your encoded data to tree.
    TreeNode* deserialize(string data) {
        // Write your code here
        
    }
};

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < arr.size()) {
        TreeNode* node = q.front();
        q.pop();
        if (i < arr.size() && arr[i] != -1) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != -1) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

vector<int> treeToArray(TreeNode* root) {
    vector<int> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        if (node) {
            result.push_back(node->val);
            q.push(node->left);
            q.push(node->right);
        } else {
            result.push_back(-1);
        }
    }
    while (!result.empty() && result.back() == -1) result.pop_back();
    return result;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        if (num == "null") {
            arr.push_back(-1);
        } else {
            arr.push_back(stoi(num));
        }
    }
    
    TreeNode* root = buildTree(arr);
    
    Codec codec;
    string serialized = codec.serialize(root);
    TreeNode* deserialized = codec.deserialize(serialized);
    vector<int> result = treeToArray(deserialized);
    
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        if (result[i] == -1) cout << "null";
        else cout << result[i];
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

public class Codec {
    // Encodes a tree to a single string.
    public String serialize(TreeNode root) {
        // Write your code here
        
    }

    // Decodes your encoded data to tree.
    public TreeNode deserialize(String data) {
        // Write your code here
        
    }
    
    public static TreeNode buildTree(Integer[] arr) {
        if (arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.offer(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.offer(node.right);
            }
            i++;
        }
        return root;
    }
    
    public static List<Integer> treeToArray(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node != null) {
                result.add(node.val);
                queue.offer(node.left);
                queue.offer(node.right);
            } else {
                result.add(null);
            }
        }
        while (!result.isEmpty() && result.get(result.size() - 1) == null) {
            result.remove(result.size() - 1);
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] parts = line.split(",");
        Integer[] arr = new Integer[parts.length];
        for(int i = 0; i < parts.length; i++) {
            if (parts[i].trim().equals("null")) {
                arr[i] = null;
            } else {
                arr[i] = Integer.parseInt(parts[i].trim());
            }
        }
        
        TreeNode root = buildTree(arr);
        
        Codec codec = new Codec();
        String serialized = codec.serialize(root);
        TreeNode deserialized = codec.deserialize(serialized);
        List<Integer> result = treeToArray(deserialized);
        
        System.out.print("[");
        for(int i = 0; i < result.size(); i++) {
            if (result.get(i) == null) System.out.print("null");
            else System.out.print(result.get(i));
            if(i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Clone Graph",
    slug: "clone-graph",
    difficulty: "Medium",
    category: "Graph",
    description: `Given a reference of a node in a connected undirected graph.

Return a deep copy (clone) of the graph.

Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.

class Node {
    public int val;
    public List<Node> neighbors;
}

Test case format:

For simplicity, each node's value is the same as the node's index (1-indexed). For example, the first node with val == 1, the second node with val == 2, and so on. The graph is represented in the test case using an adjacency list.

An adjacency list is a collection of unordered lists used to represent a finite graph. Each list describes the set of neighbors of a node in the graph.

The given node will always be the first node with val = 1. You must return the copy of the given node as a reference to the cloned graph.`,
    examples: [
      {
        input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        output: "[[2,4],[1,3],[2,4],[1,3]]",
        explanation: "There are 4 nodes in the graph. 1st node (val = 1)'s neighbors are 2nd node (val = 2) and 4th node (val = 4). 2nd node (val = 2)'s neighbors are 1st node (val = 1) and 3rd node (val = 3). 3rd node (val = 3)'s neighbors are 2nd node (val = 2) and 4th node (val = 4). 4th node (val = 4)'s neighbors are 1st node (val = 1) and 3rd node (val = 3).",
      },
      {
        input: "adjList = [[]]",
        output: "[[]]",
        explanation: "Note that the input contains one empty list. The graph consists of only one node with val = 1 and it does not have any neighbors.",
      },
      {
        input: "adjList = []",
        output: "[]",
        explanation: "This an empty graph, it does not have any nodes.",
      },
    ],
    constraints: [
      "The number of nodes in the graph is in the range [0, 100].",
      "1 <= Node.val <= 100",
      "Node.val is unique for each node.",
      "There are no repeated edges and no self-loops in the graph.",
      "The Graph is connected and all nodes can be visited starting from the given node."
    ],
    tags: ["Hash Table", "Depth-First Search", "Breadth-First Search", "Graph"],
    testCases: [
      {
        input: "[[2,4],[1,3],[2,4],[1,3]]",
        expectedOutput: "[[2,4],[1,3],[2,4],[1,3]]",
        isHidden: false,
      },
      {
        input: "[[]]",
        expectedOutput: "[[]]",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "[]",
        isHidden: true,
      },
      {
        input: "[[2],[1]]",
        expectedOutput: "[[2],[1]]",
        isHidden: true,
      },
      {
        input: "[[2,3],[1,3],[1,2]]",
        expectedOutput: "[[2,3],[1,3],[1,2]]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for a Node.
function Node(val, neighbors) {
    this.val = val === undefined ? 0 : val;
    this.neighbors = neighbors === undefined ? [] : neighbors;
};

function cloneGraph(node) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function buildGraph(adjList) {
    if (!adjList.length) return null;
    
    const nodes = [];
    for (let i = 0; i < adjList.length; i++) {
        nodes.push(new Node(i + 1));
    }
    
    for (let i = 0; i < adjList.length; i++) {
        for (let neighbor of adjList[i]) {
            nodes[i].neighbors.push(nodes[neighbor - 1]);
        }
    }
    
    return nodes[0];
}

function graphToAdjList(node) {
    if (!node) return [];
    
    const visited = new Set();
    const adjList = [];
    
    function dfs(node) {
        if (visited.has(node.val)) return;
        visited.add(node.val);
        
        while (adjList.length < node.val) {
            adjList.push([]);
        }
        
        for (let neighbor of node.neighbors) {
            adjList[node.val - 1].push(neighbor.val);
            dfs(neighbor);
        }
    }
    
    dfs(node);
    return adjList;
}

rl.on('line', (input) => {
  const adjList = JSON.parse(input.trim());
  const node = buildGraph(adjList);
  const cloned = cloneGraph(node);
  const result = graphToAdjList(cloned);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<unordered_map>
#include<sstream>
using namespace std;

class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() {
        val = 0;
        neighbors = vector<Node*>();
    }
    Node(int _val) {
        val = _val;
        neighbors = vector<Node*>();
    }
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};

Node* cloneGraph(Node* node) {
    // Write your code here
    
}

Node* buildGraph(vector<vector<int>>& adjList) {
    if (adjList.empty()) return nullptr;
    
    vector<Node*> nodes;
    for (int i = 0; i < adjList.size(); i++) {
        nodes.push_back(new Node(i + 1));
    }
    
    for (int i = 0; i < adjList.size(); i++) {
        for (int neighbor : adjList[i]) {
            nodes[i]->neighbors.push_back(nodes[neighbor - 1]);
        }
    }
    
    return nodes[0];
}

vector<vector<int>> graphToAdjList(Node* node) {
    if (!node) return {};
    
    unordered_map<int, bool> visited;
    vector<vector<int>> adjList;
    
    function<void(Node*)> dfs = [&](Node* node) {
        if (visited[node->val]) return;
        visited[node->val] = true;
        
        while (adjList.size() < node->val) {
            adjList.push_back({});
        }
        
        for (Node* neighbor : node->neighbors) {
            adjList[node->val - 1].push_back(neighbor->val);
            dfs(neighbor);
        }
    };
    
    dfs(node);
    return adjList;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<int>> adjList;
    line = line.substr(1, line.length()-2);
    
    string segment;
    stringstream ss(line);
    while (getline(ss, segment, ']')) {
        if (segment.empty() || segment == ",") continue;
        
        if (segment[0] == ',') segment = segment.substr(1);
        if (segment[0] == '[') segment = segment.substr(1);
        
        vector<int> neighbors;
        if (!segment.empty()) {
            stringstream segmentStream(segment);
            string num;
            while (getline(segmentStream, num, ',')) {
                if (!num.empty()) {
                    neighbors.push_back(stoi(num));
                }
            }
        }
        adjList.push_back(neighbors);
    }
    
    Node* node = buildGraph(adjList);
    Node* cloned = cloneGraph(node);
    vector<vector<int>> result = graphToAdjList(cloned);
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << "[";
        for (int j = 0; j < result[i].size(); j++) {
            cout << result[i][j];
            if (j < result[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class Node {
    public int val;
    public List<Node> neighbors;
    public Node() {
        val = 0;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val) {
        val = _val;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val, ArrayList<Node> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
}

public class Solution {
    public static Node cloneGraph(Node node) {
        // Write your code here
        
    }
    
    public static Node buildGraph(int[][] adjList) {
        if (adjList.length == 0) return null;
        
        Node[] nodes = new Node[adjList.length];
        for (int i = 0; i < adjList.length; i++) {
            nodes[i] = new Node(i + 1);
        }
        
        for (int i = 0; i < adjList.length; i++) {
            for (int neighbor : adjList[i]) {
                nodes[i].neighbors.add(nodes[neighbor - 1]);
            }
        }
        
        return nodes[0];
    }
    
    public static List<List<Integer>> graphToAdjList(Node node) {
        if (node == null) return new ArrayList<>();
        
        Map<Integer, Boolean> visited = new HashMap<>();
        List<List<Integer>> adjList = new ArrayList<>();
        
        dfs(node, visited, adjList);
        return adjList;
    }
    
    private static void dfs(Node node, Map<Integer, Boolean> visited, List<List<Integer>> adjList) {
        if (visited.getOrDefault(node.val, false)) return;
        visited.put(node.val, true);
        
        while (adjList.size() < node.val) {
            adjList.add(new ArrayList<>());
        }
        
        for (Node neighbor : node.neighbors) {
            adjList.get(node.val - 1).add(neighbor.val);
            dfs(neighbor, visited, adjList);
        }
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] segments = line.split("\\],\\[");
        
        List<List<Integer>> adjListTemp = new ArrayList<>();
        for (String segment : segments) {
            segment = segment.replace("[", "").replace("]", "");
            List<Integer> neighbors = new ArrayList<>();
            if (!segment.isEmpty()) {
                String[] nums = segment.split(",");
                for (String num : nums) {
                    if (!num.trim().isEmpty()) {
                        neighbors.add(Integer.parseInt(num.trim()));
                    }
                }
            }
            adjListTemp.add(neighbors);
        }
        
        int[][] adjList = new int[adjListTemp.size()][];
        for (int i = 0; i < adjListTemp.size(); i++) {
            adjList[i] = adjListTemp.get(i).stream().mapToInt(Integer::intValue).toArray();
        }
        
        Node node = buildGraph(adjList);
        Node cloned = cloneGraph(node);
        List<List<Integer>> result = graphToAdjList(cloned);
        
        System.out.print("[");
        for (int i = 0; i < result.size(); i++) {
            System.out.print("[");
            for (int j = 0; j < result.get(i).size(); j++) {
                System.out.print(result.get(i).get(j));
                if (j < result.get(i).size() - 1) System.out.print(",");
            }
            System.out.print("]");
            if (i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Course Schedule",
    slug: "course-schedule",
    difficulty: "Medium",
    category: "Graph",
    description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

For example, the pair [0, 1], indicates that to take course 0 you have to first take course 1.

Return true if you can finish all courses. Otherwise, return false.`,
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.",
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.",
      },
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "0 <= ai, bi < numCourses",
      "All the pairs prerequisites[i] are unique."
    ],
    tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    testCases: [
      {
        input: "2\n[[1,0]]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "2\n[[1,0],[0,1]]",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "1\n[]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "3\n[[1,0],[1,2],[0,1]]",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "4\n[[1,0],[2,0],[3,1],[3,2]]",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const numCourses = parseInt(inputLines[0]);
  const prerequisites = JSON.parse(inputLines[1]);
  console.log(canFinish(numCourses, prerequisites));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<queue>
using namespace std;

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    // Write your code here
    
}

int main() {
    int numCourses;
    cin >> numCourses;
    cin.ignore();
    
    string line;
    getline(cin, line);
    
    vector<vector<int>> prerequisites;
    line = line.substr(1, line.length()-2);
    
    if (!line.empty()) {
        stringstream ss(line);
        string pair;
        while (getline(ss, pair, ']')) {
            if (pair.empty() || pair == ",") continue;
            
            if (pair[0] == ',') pair = pair.substr(1);
            if (pair[0] == '[') pair = pair.substr(1);
            
            stringstream pairStream(pair);
            string num;
            vector<int> prereq;
            while (getline(pairStream, num, ',')) {
                if (!num.empty()) {
                    prereq.push_back(stoi(num));
                }
            }
            if (prereq.size() == 2) {
                prerequisites.push_back(prereq);
            }
        }
    }
    
    cout << (canFinish(numCourses, prerequisites) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int numCourses = scanner.nextInt();
        scanner.nextLine();
        
        String line = scanner.nextLine();
        line = line.substring(1, line.length()-1);
        
        List<int[]> prereqList = new ArrayList<>();
        if (!line.isEmpty()) {
            String[] pairs = line.split("\\],\\[");
            for (String pair : pairs) {
                pair = pair.replace("[", "").replace("]", "");
                String[] nums = pair.split(",");
                if (nums.length == 2) {
                    prereqList.add(new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())});
                }
            }
        }
        
        int[][] prerequisites = prereqList.toArray(new int[prereqList.size()][]);
        
        System.out.println(canFinish(numCourses, prerequisites));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Pacific Atlantic Water Flow",
    slug: "pacific-atlantic-water-flow",
    difficulty: "Medium",
    category: "Graph",
    description: `There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

The island is partitioned into a grid of square cells. You are given an m x n integer matrix heights where heights[r][c] represents the height of the ground at coordinate (r, c).

The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into that ocean.

Return a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.`,
    examples: [
      {
        input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
        explanation: "The flowing paths are shown in the diagram.",
      },
      {
        input: "heights = [[1]]",
        output: "[[0,0]]",
        explanation: "The water can flow from the only cell to both oceans.",
      },
    ],
    constraints: [
      "m == heights.length",
      "n == heights[r].length",
      "1 <= m, n <= 200",
      "0 <= heights[r][c] <= 10^5"
    ],
    tags: ["Array", "Depth-First Search", "Breadth-First Search", "Matrix"],
    testCases: [
      {
        input: "[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        expectedOutput: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
        isHidden: false,
      },
      {
        input: "[[1]]",
        expectedOutput: "[[0,0]]",
        isHidden: false,
      },
      {
        input: "[[2,1],[1,2]]",
        expectedOutput: "[[0,0],[0,1],[1,0],[1,1]]",
        isHidden: true,
      },
      {
        input: "[[1,2,3],[8,9,4],[7,6,5]]",
        expectedOutput: "[[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]",
        isHidden: true,
      },
      {
        input: "[[3,3,3,3,3,3],[3,0,3,3,0,3],[3,3,3,3,3,3]]",
        expectedOutput: "[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,0],[1,2],[1,3],[1,5],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function pacificAtlantic(heights) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const heights = JSON.parse(input.trim());
  const result = pacificAtlantic(heights);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<int>> heights;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string row;
    while (getline(ss, row, ']')) {
        if (row.empty() || row == ",") continue;
        
        if (row[0] == ',') row = row.substr(1);
        if (row[0] == '[') row = row.substr(1);
        
        vector<int> currentRow;
        stringstream rowStream(row);
        string num;
        while (getline(rowStream, num, ',')) {
            if (!num.empty()) {
                currentRow.push_back(stoi(num));
            }
        }
        if (!currentRow.empty()) {
            heights.push_back(currentRow);
        }
    }
    
    vector<vector<int>> result = pacificAtlantic(heights);
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << "[" << result[i][0] << "," << result[i][1] << "]";
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<List<Integer>> pacificAtlantic(int[][] heights) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] rows = line.split("\\],\\[");
        
        List<List<Integer>> heightsList = new ArrayList<>();
        for (String row : rows) {
            row = row.replace("[", "").replace("]", "");
            String[] nums = row.split(",");
            List<Integer> currentRow = new ArrayList<>();
            for (String num : nums) {
                if (!num.trim().isEmpty()) {
                    currentRow.add(Integer.parseInt(num.trim()));
                }
            }
            if (!currentRow.isEmpty()) {
                heightsList.add(currentRow);
            }
        }
        
        int[][] heights = new int[heightsList.size()][];
        for (int i = 0; i < heightsList.size(); i++) {
            heights[i] = heightsList.get(i).stream().mapToInt(Integer::intValue).toArray();
        }
        
        List<List<Integer>> result = pacificAtlantic(heights);
        
        System.out.print("[");
        for (int i = 0; i < result.size(); i++) {
            System.out.print("[" + result.get(i).get(0) + "," + result.get(i).get(1) + "]");
            if (i < result.size() - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Number of Islands",
    slug: "number-of-islands",
    difficulty: "Medium",
    category: "Graph",
    description: `Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1",
        explanation: "There is 1 island.",
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
        explanation: "There are 3 islands.",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      'grid[i][j] is "0" or "1".'
    ],
    tags: ["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"],
    testCases: [
      {
        input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        expectedOutput: "3",
        isHidden: false,
      },
      {
        input: '[["1"]]',
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: '[["0"]]',
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: '[["1","0","1","1","1"],["1","0","1","0","1"],["1","1","1","0","1"]]',
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function numIslands(grid) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const grid = JSON.parse(input.trim());
  console.log(numIslands(grid));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<char>> grid;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string row;
    while (getline(ss, row, ']')) {
        if (row.empty() || row == ",") continue;
        
        if (row[0] == ',') row = row.substr(1);
        if (row[0] == '[') row = row.substr(1);
        
        vector<char> currentRow;
        stringstream rowStream(row);
        string cell;
        while (getline(rowStream, cell, ',')) {
            if (!cell.empty()) {
                string cleanCell = cell;
                cleanCell.erase(remove(cleanCell.begin(), cleanCell.end(), '"'), cleanCell.end());
                if (!cleanCell.empty()) {
                    currentRow.push_back(cleanCell[0]);
                }
            }
        }
        if (!currentRow.empty()) {
            grid.push_back(currentRow);
        }
    }
    
    cout << numIslands(grid) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int numIslands(char[][] grid) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] rows = line.split("\\],\\[");
        
        List<List<Character>> gridList = new ArrayList<>();
        for (String row : rows) {
            row = row.replace("[", "").replace("]", "");
            String[] cells = row.split(",");
            List<Character> currentRow = new ArrayList<>();
            for (String cell : cells) {
                cell = cell.replace("\"", "").trim();
                if (!cell.isEmpty()) {
                    currentRow.add(cell.charAt(0));
                }
            }
            if (!currentRow.isEmpty()) {
                gridList.add(currentRow);
            }
        }
        
        char[][] grid = new char[gridList.size()][];
        for (int i = 0; i < gridList.size(); i++) {
            grid[i] = new char[gridList.get(i).size()];
            for (int j = 0; j < gridList.get(i).size(); j++) {
                grid[i][j] = gridList.get(i).get(j);
            }
        }
        
        System.out.println(numIslands(grid));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Longest Consecutive Sequence",
    slug: "longest-consecutive-sequence",
    difficulty: "Medium",
    category: "Array",
    description: `Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in O(n) time.`,
    examples: [
      {
        input: "nums = [100,4,200,1,3,2]",
        output: "4",
        explanation: "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.",
      },
      {
        input: "nums = [0,3,7,2,5,8,4,6,0,1]",
        output: "9",
        explanation: "The longest consecutive elements sequence is [0, 1, 2, 3, 4, 5, 6, 7, 8]. Therefore its length is 9.",
      },
    ],
    constraints: [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    tags: ["Array", "Hash Table", "Union Find"],
    testCases: [
      {
        input: "[100,4,200,1,3,2]",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "[0,3,7,2,5,8,4,6,0,1]",
        expectedOutput: "9",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "[1,2,0,1]",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "[9,1,4,7,3,-1,0,5,8,-1,6]",
        expectedOutput: "7",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function longestConsecutive(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(longestConsecutive(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<unordered_set>
#include<algorithm>
using namespace std;

int longestConsecutive(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    if (line != "[]") {
        line = line.substr(1, line.length()-2);
        stringstream ss(line);
        string num;
        while(getline(ss, num, ',')) {
            nums.push_back(stoi(num));
        }
    }
    
    cout << longestConsecutive(nums) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int longestConsecutive(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        if (line.equals("[]")) {
            System.out.println(longestConsecutive(new int[0]));
        } else {
            line = line.substring(1, line.length()-1);
            String[] parts = line.split(",");
            int[] nums = new int[parts.length];
            for(int i = 0; i < parts.length; i++) {
                nums[i] = Integer.parseInt(parts[i].trim());
            }
            System.out.println(longestConsecutive(nums));
        }
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Insert Interval",
    slug: "insert-interval",
    difficulty: "Medium",
    category: "Array",
    description: `You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval.

Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).

Return intervals after the insertion.`,
    examples: [
      {
        input: "intervals = [[1,3],[6,9]], newInterval = [2,5]",
        output: "[[1,5],[6,9]]",
        explanation: "Because the new interval [2,5] overlaps with [1,3].",
      },
      {
        input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]",
        output: "[[1,2],[3,10],[12,16]]",
        explanation: "Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].",
      },
    ],
    constraints: [
      "0 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^5",
      "intervals is sorted by starti in ascending order.",
      "newInterval.length == 2",
      "0 <= start <= end <= 10^5"
    ],
    tags: ["Array"],
    testCases: [
      {
        input: "[[1,3],[6,9]]\n[2,5]",
        expectedOutput: "[[1,5],[6,9]]",
        isHidden: false,
      },
      {
        input: "[[1,2],[3,5],[6,7],[8,10],[12,16]]\n[4,8]",
        expectedOutput: "[[1,2],[3,10],[12,16]]",
        isHidden: false,
      },
      {
        input: "[]\n[5,7]",
        expectedOutput: "[[5,7]]",
        isHidden: true,
      },
      {
        input: "[[1,5]]\n[2,3]",
        expectedOutput: "[[1,5]]",
        isHidden: true,
      },
      {
        input: "[[1,5]]\n[6,8]",
        expectedOutput: "[[1,5],[6,8]]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function insert(intervals, newInterval) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
  inputLines.push(line);
});

rl.on('close', () => {
  const intervals = JSON.parse(inputLines[0]);
  const newInterval = JSON.parse(inputLines[1]);
  const result = insert(intervals, newInterval);
  console.log(JSON.stringify(result));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    // Write your code here
    
}

int main() {
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    
    vector<vector<int>> intervals;
    vector<int> newInterval;
    
    // Parse intervals
    if (line1 != "[]") {
        line1 = line1.substr(1, line1.length()-2);
        stringstream ss(line1);
        string interval;
        while (getline(ss, interval, ']')) {
            if (interval.empty() || interval == ",") continue;
            
            if (interval[0] == ',') interval = interval.substr(1);
            if (interval[0] == '[') interval = interval.substr(1);
            
            stringstream intervalStream(interval);
            string num;
            vector<int> currentInterval;
            while (getline(intervalStream, num, ',')) {
                if (!num.empty()) {
                    currentInterval.push_back(stoi(num));
                }
            }
            if (currentInterval.size() == 2) {
                intervals.push_back(currentInterval);
            }
        }
    }
    
    // Parse newInterval
    line2 = line2.substr(1, line2.length()-2);
    stringstream ss2(line2);
    string num;
    while (getline(ss2, num, ',')) {
        newInterval.push_back(stoi(num));
    }
    
    vector<vector<int>> result = insert(intervals, newInterval);
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << "[" << result[i][0] << "," << result[i][1] << "]";
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[][] insert(int[][] intervals, int[] newInterval) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line1 = scanner.nextLine();
        String line2 = scanner.nextLine();
        
        // Parse intervals
        List<int[]> intervalsList = new ArrayList<>();
        if (!line1.equals("[]")) {
            line1 = line1.substring(1, line1.length()-1);
            String[] intervalStrs = line1.split("\\],\\[");
            for (String intervalStr : intervalStrs) {
                intervalStr = intervalStr.replace("[", "").replace("]", "");
                String[] nums = intervalStr.split(",");
                intervalsList.add(new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())});
            }
        }
        int[][] intervals = intervalsList.toArray(new int[intervalsList.size()][]);
        
        // Parse newInterval
        line2 = line2.substring(1, line2.length()-1);
        String[] nums = line2.split(",");
        int[] newInterval = new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())};
        
        int[][] result = insert(intervals, newInterval);
        
        System.out.print("[");
        for (int i = 0; i < result.length; i++) {
            System.out.print("[" + result[i][0] + "," + result[i][1] + "]");
            if (i < result.length - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Merge Intervals",
    slug: "merge-intervals",
    difficulty: "Medium",
    category: "Array",
    description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlaps, merge them into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4"
    ],
    tags: ["Array", "Sorting"],
    testCases: [
      {
        input: "[[1,3],[2,6],[8,10],[15,18]]",
        expectedOutput: "[[1,6],[8,10],[15,18]]",
        isHidden: false,
      },
      {
        input: "[[1,4],[4,5]]",
        expectedOutput: "[[1,5]]",
        isHidden: false,
      },
      {
        input: "[[1,4],[0,4]]",
        expectedOutput: "[[0,4]]",
        isHidden: true,
      },
      {
        input: "[[1,4],[2,3]]",
        expectedOutput: "[[1,4]]",
        isHidden: true,
      },
      {
        input: "[[2,3],[4,5],[6,7],[8,9],[1,10]]",
        expectedOutput: "[[1,10]]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function merge(intervals) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const intervals = JSON.parse(input.trim());
  const result = merge(intervals);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<int>> intervals;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string interval;
    while (getline(ss, interval, ']')) {
        if (interval.empty() || interval == ",") continue;
        
        if (interval[0] == ',') interval = interval.substr(1);
        if (interval[0] == '[') interval = interval.substr(1);
        
        stringstream intervalStream(interval);
        string num;
        vector<int> currentInterval;
        while (getline(intervalStream, num, ',')) {
            if (!num.empty()) {
                currentInterval.push_back(stoi(num));
            }
        }
        if (currentInterval.size() == 2) {
            intervals.push_back(currentInterval);
        }
    }
    
    vector<vector<int>> result = merge(intervals);
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << "[" << result[i][0] << "," << result[i][1] << "]";
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[][] merge(int[][] intervals) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] intervalStrs = line.split("\\],\\[");
        
        List<int[]> intervalsList = new ArrayList<>();
        for (String intervalStr : intervalStrs) {
            intervalStr = intervalStr.replace("[", "").replace("]", "");
            String[] nums = intervalStr.split(",");
            intervalsList.add(new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())});
        }
        
        int[][] intervals = intervalsList.toArray(new int[intervalsList.size()][]);
        int[][] result = merge(intervals);
        
        System.out.print("[");
        for (int i = 0; i < result.length; i++) {
            System.out.print("[" + result[i][0] + "," + result[i][1] + "]");
            if (i < result.length - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Non-overlapping Intervals",
    slug: "non-overlapping-intervals",
    difficulty: "Medium",
    category: "Array",
    description: `Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.`,
    examples: [
      {
        input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
        output: "1",
        explanation: "[1,3] can be removed and the rest of the intervals are non-overlapping.",
      },
      {
        input: "intervals = [[1,2],[1,2],[1,2]]",
        output: "2",
        explanation: "You need to remove two [1,2] to make the rest of the intervals non-overlapping.",
      },
      {
        input: "intervals = [[1,2],[2,3]]",
        output: "0",
        explanation: "You don't need to remove any of the intervals since they're already non-overlapping.",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^5",
      "intervals[i].length == 2",
      "-5 * 10^4 <= starti < endi <= 5 * 10^4"
    ],
    tags: ["Array", "Dynamic Programming", "Greedy", "Sorting"],
    testCases: [
      {
        input: "[[1,2],[2,3],[3,4],[1,3]]",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "[[1,2],[1,2],[1,2]]",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "[[1,2],[2,3]]",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "[[-52,31],[-73,-26],[82,97],[-65,-11],[-62,-49],[95,99],[58,95],[-31,49],[66,98],[-63,2],[30,47],[-40,-26]]",
        expectedOutput: "7",
        isHidden: true,
      },
      {
        input: "[[1,100],[11,22],[1,11],[2,12]]",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function eraseOverlapIntervals(intervals) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const intervals = JSON.parse(input.trim());
  console.log(eraseOverlapIntervals(intervals));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<int>> intervals;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string interval;
    while (getline(ss, interval, ']')) {
        if (interval.empty() || interval == ",") continue;
        
        if (interval[0] == ',') interval = interval.substr(1);
        if (interval[0] == '[') interval = interval.substr(1);
        
        stringstream intervalStream(interval);
        string num;
        vector<int> currentInterval;
        while (getline(intervalStream, num, ',')) {
            if (!num.empty()) {
                currentInterval.push_back(stoi(num));
            }
        }
        if (currentInterval.size() == 2) {
            intervals.push_back(currentInterval);
        }
    }
    
    cout << eraseOverlapIntervals(intervals) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int eraseOverlapIntervals(int[][] intervals) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] intervalStrs = line.split("\\],\\[");
        
        List<int[]> intervalsList = new ArrayList<>();
        for (String intervalStr : intervalStrs) {
            intervalStr = intervalStr.replace("[", "").replace("]", "");
            String[] nums = intervalStr.split(",");
            intervalsList.add(new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())});
        }
        
        int[][] intervals = intervalsList.toArray(new int[intervalsList.size()][]);
        System.out.println(eraseOverlapIntervals(intervals));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Meeting Rooms",
    slug: "meeting-rooms",
    difficulty: "Easy",
    category: "Array",
    description: `Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings.`,
    examples: [
      {
        input: "intervals = [[0,30],[5,10],[15,20]]",
        output: "false",
        explanation: "A person cannot attend all meetings because [0,30] and [5,10] overlap, and [0,30] and [15,20] overlap.",
      },
      {
        input: "intervals = [[7,10],[2,4]]",
        output: "true",
        explanation: "A person can attend all meetings since they don't overlap.",
      },
    ],
    constraints: [
      "0 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti < endi <= 10^6"
    ],
    tags: ["Array", "Sorting"],
    testCases: [
      {
        input: "[[0,30],[5,10],[15,20]]",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "[[7,10],[2,4]]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "[[1,5]]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "[[1,4],[2,5],[7,9]]",
        expectedOutput: "false",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function canAttendMeetings(intervals) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const intervals = JSON.parse(input.trim());
  console.log(canAttendMeetings(intervals));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<algorithm>
using namespace std;

bool canAttendMeetings(vector<vector<int>>& intervals) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<int>> intervals;
    if (line != "[]") {
        line = line.substr(1, line.length()-2);
        
        stringstream ss(line);
        string interval;
        while (getline(ss, interval, ']')) {
            if (interval.empty() || interval == ",") continue;
            
            if (interval[0] == ',') interval = interval.substr(1);
            if (interval[0] == '[') interval = interval.substr(1);
            
            stringstream intervalStream(interval);
            string num;
            vector<int> currentInterval;
            while (getline(intervalStream, num, ',')) {
                if (!num.empty()) {
                    currentInterval.push_back(stoi(num));
                }
            }
            if (currentInterval.size() == 2) {
                intervals.push_back(currentInterval);
            }
        }
    }
    
    cout << (canAttendMeetings(intervals) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean canAttendMeetings(int[][] intervals) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        if (line.equals("[]")) {
            System.out.println(canAttendMeetings(new int[0][]));
        } else {
            line = line.substring(1, line.length()-1);
            String[] intervalStrs = line.split("\\],\\[");
            
            List<int[]> intervalsList = new ArrayList<>();
            for (String intervalStr : intervalStrs) {
                intervalStr = intervalStr.replace("[", "").replace("]", "");
                String[] nums = intervalStr.split(",");
                intervalsList.add(new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())});
            }
            
            int[][] intervals = intervalsList.toArray(new int[intervalsList.size()][]);
            System.out.println(canAttendMeetings(intervals));
        }
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Meeting Rooms II",
    slug: "meeting-rooms-ii",
    difficulty: "Medium",
    category: "Array",
    description: `Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.`,
    examples: [
      {
        input: "intervals = [[0,30],[5,10],[15,20]]",
        output: "2",
        explanation: "We need two meeting rooms. Room 1: [0,30], Room 2: [5,10] then [15,20].",
      },
      {
        input: "intervals = [[7,10],[2,4]]",
        output: "1",
        explanation: "Only one meeting room is needed since the meetings don't overlap.",
      },
    ],
    constraints: [
      "1 <= intervals.length <= 10^4",
      "0 <= starti < endi <= 10^6"
    ],
    tags: ["Array", "Two Pointers", "Greedy", "Sorting", "Heap (Priority Queue)"],
    testCases: [
      {
        input: "[[0,30],[5,10],[15,20]]",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "[[7,10],[2,4]]",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "[[1,5],[8,9],[8,9]]",
        expectedOutput: "2",
        isHidden: true,
      },
      {
        input: "[[2,7]]",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "[[1,2],[2,3],[3,4]]",
        expectedOutput: "1",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function minMeetingRooms(intervals) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const intervals = JSON.parse(input.trim());
  console.log(minMeetingRooms(intervals));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<queue>
#include<algorithm>
using namespace std;

int minMeetingRooms(vector<vector<int>>& intervals) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<int>> intervals;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string interval;
    while (getline(ss, interval, ']')) {
        if (interval.empty() || interval == ",") continue;
        
        if (interval[0] == ',') interval = interval.substr(1);
        if (interval[0] == '[') interval = interval.substr(1);
        
        stringstream intervalStream(interval);
        string num;
        vector<int> currentInterval;
        while (getline(intervalStream, num, ',')) {
            if (!num.empty()) {
                currentInterval.push_back(stoi(num));
            }
        }
        if (currentInterval.size() == 2) {
            intervals.push_back(currentInterval);
        }
    }
    
    cout << minMeetingRooms(intervals) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int minMeetingRooms(int[][] intervals) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] intervalStrs = line.split("\\],\\[");
        
        List<int[]> intervalsList = new ArrayList<>();
        for (String intervalStr : intervalStrs) {
            intervalStr = intervalStr.replace("[", "").replace("]", "");
            String[] nums = intervalStr.split(",");
            intervalsList.add(new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())});
        }
        
        int[][] intervals = intervalsList.toArray(new int[intervalsList.size()][]);
        System.out.println(minMeetingRooms(intervals));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Reverse Linked List",
    slug: "reverse-linked-list",
    difficulty: "Easy",
    category: "Linked List",
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        explanation: "The linked list is reversed.",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        explanation: "The linked list is reversed.",
      },
      {
        input: "head = []",
        output: "[]",
        explanation: "Empty list remains empty.",
      },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000]",
      "-5000 <= Node.val <= 5000"
    ],
    tags: ["Linked List", "Recursion"],
    testCases: [
      {
        input: "[1,2,3,4,5]",
        expectedOutput: "[5,4,3,2,1]",
        isHidden: false,
      },
      {
        input: "[1,2]",
        expectedOutput: "[2,1]",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "[]",
        isHidden: true,
      },
      {
        input: "[1]",
        expectedOutput: "[1]",
        isHidden: true,
      },
      {
        input: "[1,2,3,4,5,6,7,8,9,10]",
        expectedOutput: "[10,9,8,7,6,5,4,3,2,1]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function reverseList(head) {
    // Write your code here
    
}

// Do not modify below this line
function arrayToList(arr) {
    if (arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function listToArray(head) {
    const result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const arr = JSON.parse(input.trim());
  const head = arrayToList(arr);
  const result = reverseList(head);
  console.log(JSON.stringify(listToArray(result)));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* reverseList(ListNode* head) {
    // Write your code here
    
}

ListNode* arrayToList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (int i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}

vector<int> listToArray(ListNode* head) {
    vector<int> result;
    while (head) {
        result.push_back(head->val);
        head = head->next;
    }
    return result;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    if (!line.empty()) {
        stringstream ss(line);
        string num;
        while (getline(ss, num, ',')) {
            arr.push_back(stoi(num));
        }
    }
    
    ListNode* head = arrayToList(arr);
    ListNode* result = reverseList(head);
    vector<int> output = listToArray(result);
    
    cout << "[";
    for (int i = 0; i < output.size(); i++) {
        cout << output[i];
        if (i < output.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
    public static ListNode reverseList(ListNode head) {
        // Write your code here
        
    }
    
    public static ListNode arrayToList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    }
    
    public static List<Integer> listToArray(ListNode head) {
        List<Integer> result = new ArrayList<>();
        while (head != null) {
            result.add(head.val);
            head = head.next;
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        List<Integer> list = new ArrayList<>();
        if (!line.isEmpty()) {
            String[] nums = line.split(",");
            for (String num : nums) {
                list.add(Integer.parseInt(num.trim()));
            }
        }
        
        int[] arr = list.stream().mapToInt(i -> i).toArray();
        ListNode head = arrayToList(arr);
        ListNode result = reverseList(head);
        List<Integer> output = listToArray(result);
        System.out.println(output);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Detect Cycle in a Linked List",
    slug: "linked-list-cycle",
    difficulty: "Easy",
    category: "Linked List",
    description: `Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.`,
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true",
        explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed).",
      },
      {
        input: "head = [1,2], pos = 0",
        output: "true",
        explanation: "There is a cycle in the linked list, where the tail connects to the 0th node.",
      },
      {
        input: "head = [1], pos = -1",
        output: "false",
        explanation: "There is no cycle in the linked list.",
      },
    ],
    constraints: [
      "The number of the nodes in the list is in the range [0, 10^4]",
      "-10^5 <= Node.val <= 10^5",
      "pos is -1 or a valid index in the linked-list"
    ],
    tags: ["Hash Table", "Linked List", "Two Pointers"],
    testCases: [
      {
        input: "[3,2,0,-4] 1",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[1,2] 0",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[1] -1",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "[] -1",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "[1,2,3,4,5] 2",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val) {
    this.val = val;
    this.next = null;
}

function hasCycle(head) {
    // Write your code here
    
}

// Do not modify below this line
function arrayToListWithCycle(arr, pos) {
    if (arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    let cycleNode = pos === 0 ? head : null;
    
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
        if (i === pos) cycleNode = current;
    }
    
    if (pos !== -1) {
        current.next = cycleNode;
    }
    
    return head;
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const parts = input.trim().split(' ');
  const arr = JSON.parse(parts[0]);
  const pos = parseInt(parts[1]);
  const head = arrayToListWithCycle(arr, pos);
  console.log(hasCycle(head));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};

bool hasCycle(ListNode *head) {
    // Write your code here
    
}

ListNode* arrayToListWithCycle(vector<int>& arr, int pos) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    ListNode* cycleNode = (pos == 0) ? head : nullptr;
    
    for (int i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
        if (i == pos) cycleNode = current;
    }
    
    if (pos != -1) {
        current->next = cycleNode;
    }
    
    return head;
}

int main() {
    string line;
    getline(cin, line);
    
    size_t spacePos = line.find(' ');
    string arrStr = line.substr(0, spacePos);
    int pos = stoi(line.substr(spacePos + 1));
    
    vector<int> arr;
    arrStr = arrStr.substr(1, arrStr.length()-2);
    if (!arrStr.empty()) {
        stringstream ss(arrStr);
        string num;
        while (getline(ss, num, ',')) {
            arr.push_back(stoi(num));
        }
    }
    
    ListNode* head = arrayToListWithCycle(arr, pos);
    cout << (hasCycle(head) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        val = x;
        next = null;
    }
}

public class Solution {
    public static boolean hasCycle(ListNode head) {
        // Write your code here
        
    }
    
    public static ListNode arrayToListWithCycle(int[] arr, int pos) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        ListNode cycleNode = (pos == 0) ? head : null;
        
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
            if (i == pos) cycleNode = current;
        }
        
        if (pos != -1) {
            current.next = cycleNode;
        }
        
        return head;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        String[] parts = line.split(" ");
        String arrStr = parts[0];
        int pos = Integer.parseInt(parts[1]);
        
        arrStr = arrStr.substring(1, arrStr.length()-1);
        List<Integer> list = new ArrayList<>();
        if (!arrStr.isEmpty()) {
            String[] nums = arrStr.split(",");
            for (String num : nums) {
                list.add(Integer.parseInt(num.trim()));
            }
        }
        
        int[] arr = list.stream().mapToInt(i -> i).toArray();
        ListNode head = arrayToListWithCycle(arr, pos);
        System.out.println(hasCycle(head));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    difficulty: "Easy",
    category: "Linked List",
    description: `You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.`,
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "The merged list is [1,1,2,3,4,4].",
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
        explanation: "Both lists are empty.",
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]",
        explanation: "Only the second list has elements.",
      },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50]",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order"
    ],
    tags: ["Linked List", "Recursion"],
    testCases: [
      {
        input: "[1,2,4] [1,3,4]",
        expectedOutput: "[1,1,2,3,4,4]",
        isHidden: false,
      },
      {
        input: "[] []",
        expectedOutput: "[]",
        isHidden: false,
      },
      {
        input: "[] [0]",
        expectedOutput: "[0]",
        isHidden: true,
      },
      {
        input: "[1] [2]",
        expectedOutput: "[1,2]",
        isHidden: true,
      },
      {
        input: "[5] [1,2,4]",
        expectedOutput: "[1,2,4,5]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function mergeTwoLists(list1, list2) {
    // Write your code here
    
}

// Do not modify below this line
function arrayToList(arr) {
    if (arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function listToArray(head) {
    const result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const parts = input.trim().split(' ');
  const arr1 = JSON.parse(parts[0]);
  const arr2 = JSON.parse(parts[1]);
  const list1 = arrayToList(arr1);
  const list2 = arrayToList(arr2);
  const result = mergeTwoLists(list1, list2);
  console.log(JSON.stringify(listToArray(result)));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    // Write your code here
    
}

ListNode* arrayToList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (int i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}

vector<int> listToArray(ListNode* head) {
    vector<int> result;
    while (head) {
        result.push_back(head->val);
        head = head->next;
    }
    return result;
}

int main() {
    string line;
    getline(cin, line);
    
    size_t spacePos = line.find("] [");
    string arr1Str = line.substr(0, spacePos + 1);
    string arr2Str = line.substr(spacePos + 2);
    
    vector<int> arr1, arr2;
    
    arr1Str = arr1Str.substr(1, arr1Str.length()-2);
    if (!arr1Str.empty()) {
        stringstream ss(arr1Str);
        string num;
        while (getline(ss, num, ',')) {
            arr1.push_back(stoi(num));
        }
    }
    
    arr2Str = arr2Str.substr(1, arr2Str.length()-2);
    if (!arr2Str.empty()) {
        stringstream ss(arr2Str);
        string num;
        while (getline(ss, num, ',')) {
            arr2.push_back(stoi(num));
        }
    }
    
    ListNode* list1 = arrayToList(arr1);
    ListNode* list2 = arrayToList(arr2);
    ListNode* result = mergeTwoLists(list1, list2);
    vector<int> output = listToArray(result);
    
    cout << "[";
    for (int i = 0; i < output.size(); i++) {
        cout << output[i];
        if (i < output.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your code here
        
    }
    
    public static ListNode arrayToList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    }
    
    public static List<Integer> listToArray(ListNode head) {
        List<Integer> result = new ArrayList<>();
        while (head != null) {
            result.add(head.val);
            head = head.next;
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        String[] parts = line.split(" \\[", 2);
        String arr1Str = parts[0].substring(1, parts[0].length()-1);
        String arr2Str = parts[1].substring(0, parts[1].length()-1);
        
        List<Integer> list1 = new ArrayList<>();
        if (!arr1Str.isEmpty()) {
            String[] nums = arr1Str.split(",");
            for (String num : nums) {
                list1.add(Integer.parseInt(num.trim()));
            }
        }
        
        List<Integer> list2 = new ArrayList<>();
        if (!arr2Str.isEmpty()) {
            String[] nums = arr2Str.split(",");
            for (String num : nums) {
                list2.add(Integer.parseInt(num.trim()));
            }
        }
        
        int[] arr1 = list1.stream().mapToInt(i -> i).toArray();
        int[] arr2 = list2.stream().mapToInt(i -> i).toArray();
        
        ListNode l1 = arrayToList(arr1);
        ListNode l2 = arrayToList(arr2);
        ListNode result = mergeTwoLists(l1, l2);
        List<Integer> output = listToArray(result);
        System.out.println(output);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Merge k Sorted Lists",
    slug: "merge-k-sorted-lists",
    difficulty: "Hard",
    category: "Linked List",
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "The linked-lists are: [1->4->5, 1->3->4, 2->6] Merging them into one sorted list: 1->1->2->3->4->4->5->6",
      },
      {
        input: "lists = []",
        output: "[]",
        explanation: "No lists to merge.",
      },
      {
        input: "lists = [[]]",
        output: "[]",
        explanation: "Only one empty list.",
      },
    ],
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order",
      "The sum of lists[i].length will not exceed 10^4"
    ],
    tags: ["Linked List", "Divide and Conquer", "Heap (Priority Queue)", "Merge Sort"],
    testCases: [
      {
        input: "[[1,4,5],[1,3,4],[2,6]]",
        expectedOutput: "[1,1,2,3,4,4,5,6]",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "[]",
        isHidden: false,
      },
      {
        input: "[[]]",
        expectedOutput: "[]",
        isHidden: true,
      },
      {
        input: "[[1],[0]]",
        expectedOutput: "[0,1]",
        isHidden: true,
      },
      {
        input: "[[1,2,3],[4,5,6,7]]",
        expectedOutput: "[1,2,3,4,5,6,7]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function mergeKLists(lists) {
    // Write your code here
    
}

// Do not modify below this line
function arrayToList(arr) {
    if (arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function listToArray(head) {
    const result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const listsArray = JSON.parse(input.trim());
  const lists = listsArray.map(arr => arrayToList(arr));
  const result = mergeKLists(lists);
  console.log(JSON.stringify(listToArray(result)));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<queue>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* mergeKLists(vector<ListNode*>& lists) {
    // Write your code here
    
}

ListNode* arrayToList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (int i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}

vector<int> listToArray(ListNode* head) {
    vector<int> result;
    while (head) {
        result.push_back(head->val);
        head = head->next;
    }
    return result;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<ListNode*> lists;
    if (line != "[]") {
        line = line.substr(1, line.length()-2);
        
        stringstream ss(line);
        string listStr;
        while (getline(ss, listStr, ']')) {
            if (listStr.empty() || listStr == ",") continue;
            
            if (listStr[0] == ',') listStr = listStr.substr(1);
            if (listStr[0] == '[') listStr = listStr.substr(1);
            
            vector<int> arr;
            if (!listStr.empty()) {
                stringstream listStream(listStr);
                string num;
                while (getline(listStream, num, ',')) {
                    if (!num.empty()) {
                        arr.push_back(stoi(num));
                    }
                }
            }
            lists.push_back(arrayToList(arr));
        }
    }
    
    ListNode* result = mergeKLists(lists);
    vector<int> output = listToArray(result);
    
    cout << "[";
    for (int i = 0; i < output.size(); i++) {
        cout << output[i];
        if (i < output.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
    public static ListNode mergeKLists(ListNode[] lists) {
        // Write your code here
        
    }
    
    public static ListNode arrayToList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    }
    
    public static List<Integer> listToArray(ListNode head) {
        List<Integer> result = new ArrayList<>();
        while (head != null) {
            result.add(head.val);
            head = head.next;
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        List<ListNode> lists = new ArrayList<>();
        if (!line.equals("[]")) {
            line = line.substring(1, line.length()-1);
            String[] listStrs = line.split("\\],\\[");
            
            for (String listStr : listStrs) {
                listStr = listStr.replace("[", "").replace("]", "");
                List<Integer> list = new ArrayList<>();
                if (!listStr.isEmpty()) {
                    String[] nums = listStr.split(",");
                    for (String num : nums) {
                        list.add(Integer.parseInt(num.trim()));
                    }
                }
                int[] arr = list.stream().mapToInt(i -> i).toArray();
                lists.add(arrayToList(arr));
            }
        }
        
        ListNode[] listsArray = lists.toArray(new ListNode[lists.size()]);
        ListNode result = mergeKLists(listsArray);
        List<Integer> output = listToArray(result);
        System.out.println(output);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Remove Nth Node From End of List",
    slug: "remove-nth-node-from-end-of-list",
    difficulty: "Medium",
    category: "Linked List",
    description: `Given the head of a linked list, remove the nth node from the end of the list and return its head.`,
    examples: [
      {
        input: "head = [1,2,3,4,5], n = 2",
        output: "[1,2,3,5]",
        explanation: "The 2nd node from the end (4) is removed.",
      },
      {
        input: "head = [1], n = 1",
        output: "[]",
        explanation: "The only node is removed.",
      },
      {
        input: "head = [1,2], n = 1",
        output: "[1]",
        explanation: "The last node is removed.",
      },
    ],
    constraints: [
      "The number of nodes in the list is sz",
      "1 <= sz <= 30",
      "0 <= Node.val <= 100",
      "1 <= n <= sz"
    ],
    tags: ["Linked List", "Two Pointers"],
    testCases: [
      {
        input: "[1,2,3,4,5] 2",
        expectedOutput: "[1,2,3,5]",
        isHidden: false,
      },
      {
        input: "[1] 1",
        expectedOutput: "[]",
        isHidden: false,
      },
      {
        input: "[1,2] 1",
        expectedOutput: "[1]",
        isHidden: true,
      },
      {
        input: "[1,2] 2",
        expectedOutput: "[2]",
        isHidden: true,
      },
      {
        input: "[1,2,3,4,5,6,7,8,9] 4",
        expectedOutput: "[1,2,3,4,5,7,8,9]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function removeNthFromEnd(head, n) {
    // Write your code here
    
}

// Do not modify below this line
function arrayToList(arr) {
    if (arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function listToArray(head) {
    const result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const parts = input.trim().split(' ');
  const arr = JSON.parse(parts[0]);
  const n = parseInt(parts[1]);
  const head = arrayToList(arr);
  const result = removeNthFromEnd(head, n);
  console.log(JSON.stringify(listToArray(result)));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* removeNthFromEnd(ListNode* head, int n) {
    // Write your code here
    
}

ListNode* arrayToList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (int i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}

vector<int> listToArray(ListNode* head) {
    vector<int> result;
    while (head) {
        result.push_back(head->val);
        head = head->next;
    }
    return result;
}

int main() {
    string line;
    getline(cin, line);
    
    size_t spacePos = line.find(' ');
    string arrStr = line.substr(0, spacePos);
    int n = stoi(line.substr(spacePos + 1));
    
    vector<int> arr;
    arrStr = arrStr.substr(1, arrStr.length()-2);
    if (!arrStr.empty()) {
        stringstream ss(arrStr);
        string num;
        while (getline(ss, num, ',')) {
            arr.push_back(stoi(num));
        }
    }
    
    ListNode* head = arrayToList(arr);
    ListNode* result = removeNthFromEnd(head, n);
    vector<int> output = listToArray(result);
    
    cout << "[";
    for (int i = 0; i < output.size(); i++) {
        cout << output[i];
        if (i < output.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
    public static ListNode removeNthFromEnd(ListNode head, int n) {
        // Write your code here
        
    }
    
    public static ListNode arrayToList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    }
    
    public static List<Integer> listToArray(ListNode head) {
        List<Integer> result = new ArrayList<>();
        while (head != null) {
            result.add(head.val);
            head = head.next;
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        String[] parts = line.split(" ");
        String arrStr = parts[0];
        int n = Integer.parseInt(parts[1]);
        
        arrStr = arrStr.substring(1, arrStr.length()-1);
        List<Integer> list = new ArrayList<>();
        if (!arrStr.isEmpty()) {
            String[] nums = arrStr.split(",");
            for (String num : nums) {
                list.add(Integer.parseInt(num.trim()));
            }
        }
        
        int[] arr = list.stream().mapToInt(i -> i).toArray();
        ListNode head = arrayToList(arr);
        ListNode result = removeNthFromEnd(head, n);
        List<Integer> output = listToArray(result);
        System.out.println(output);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Reorder List",
    slug: "reorder-list",
    difficulty: "Medium",
    category: "Linked List",
    description: `You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → … You may not modify the values in the list's nodes. Only nodes themselves may be changed.`,
    examples: [
      {
        input: "head = [1,2,3,4]",
        output: "[1,4,2,3]",
        explanation: "The list becomes: 1 → 4 → 2 → 3.",
      },
      {
        input: "head = [1,2,3,4,5]",
        output: "[1,5,2,4,3]",
        explanation: "The list becomes: 1 → 5 → 2 → 4 → 3.",
      },
    ],
    constraints: [
      "The number of nodes in the list is in the range [1, 5 * 10^4]",
      "1 <= Node.val <= 1000"
    ],
    tags: ["Linked List", "Two Pointers", "Stack", "Recursion"],
    testCases: [
      {
        input: "[1,2,3,4]",
        expectedOutput: "[1,4,2,3]",
        isHidden: false,
      },
      {
        input: "[1,2,3,4,5]",
        expectedOutput: "[1,5,2,4,3]",
        isHidden: false,
      },
      {
        input: "[1]",
        expectedOutput: "[1]",
        isHidden: true,
      },
      {
        input: "[1,2]",
        expectedOutput: "[1,2]",
        isHidden: true,
      },
      {
        input: "[1,2,3,4,5,6]",
        expectedOutput: "[1,6,2,5,3,4]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
}

function reorderList(head) {
    // Write your code here (modify in place, do not return)
    
}

// Do not modify below this line
function arrayToList(arr) {
    if (arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function listToArray(head) {
    const result = [];
    while (head) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const arr = JSON.parse(input.trim());
  const head = arrayToList(arr);
  reorderList(head);
  console.log(JSON.stringify(listToArray(head)));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

void reorderList(ListNode* head) {
    // Write your code here (modify in place)
    
}

ListNode* arrayToList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* current = head;
    for (int i = 1; i < arr.size(); i++) {
        current->next = new ListNode(arr[i]);
        current = current->next;
    }
    return head;
}

vector<int> listToArray(ListNode* head) {
    vector<int> result;
    while (head) {
        result.push_back(head->val);
        head = head->next;
    }
    return result;
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> arr;
    line = line.substr(1, line.length()-2);
    if (!line.empty()) {
        stringstream ss(line);
        string num;
        while (getline(ss, num, ',')) {
            arr.push_back(stoi(num));
        }
    }
    
    ListNode* head = arrayToList(arr);
    reorderList(head);
    vector<int> output = listToArray(head);
    
    cout << "[";
    for (int i = 0; i < output.size(); i++) {
        cout << output[i];
        if (i < output.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class Solution {
    public static void reorderList(ListNode head) {
        // Write your code here (modify in place)
        
    }
    
    public static ListNode arrayToList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode current = head;
        for (int i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    }
    
    public static List<Integer> listToArray(ListNode head) {
        List<Integer> result = new ArrayList<>();
        while (head != null) {
            result.add(head.val);
            head = head.next;
        }
        return result;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        List<Integer> list = new ArrayList<>();
        if (!line.isEmpty()) {
            String[] nums = line.split(",");
            for (String num : nums) {
                list.add(Integer.parseInt(num.trim()));
            }
        }
        
        int[] arr = list.stream().mapToInt(i -> i).toArray();
        ListNode head = arrayToList(arr);
        reorderList(head);
        List<Integer> output = listToArray(head);
        System.out.println(output);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Set Matrix Zeroes",
    slug: "set-matrix-zeroes",
    difficulty: "Medium",
    category: "Array",
    description: `Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's. You must do it in place.`,
    examples: [
      {
        input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
        output: "[[1,0,1],[0,0,0],[1,0,1]]",
        explanation: "The element at position (1,1) is 0, so row 1 and column 1 are set to 0.",
      },
      {
        input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
        output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
        explanation: "Elements at positions (0,0) and (0,3) are 0, so row 0, column 0, and column 3 are set to 0.",
      },
    ],
    constraints: [
      "m == matrix.length",
      "n == matrix[0].length",
      "1 <= m, n <= 200",
      "-2^31 <= matrix[i][j] <= 2^31 - 1"
    ],
    tags: ["Array", "Hash Table", "Matrix"],
    testCases: [
      {
        input: "[[1,1,1],[1,0,1],[1,1,1]]",
        expectedOutput: "[[1,0,1],[0,0,0],[1,0,1]]",
        isHidden: false,
      },
      {
        input: "[[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
        expectedOutput: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
        isHidden: false,
      },
      {
        input: "[[1,2,3,4],[5,0,7,8],[0,10,11,12]]",
        expectedOutput: "[[0,0,3,4],[0,0,0,0],[0,0,0,0]]",
        isHidden: true,
      },
      {
        input: "[[0]]",
        expectedOutput: "[[0]]",
        isHidden: true,
      },
      {
        input: "[[1,0]]",
        expectedOutput: "[[0,0]]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function setZeroes(matrix) {
    // Write your code here (modify in place)
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const matrix = JSON.parse(input.trim());
  setZeroes(matrix);
  console.log(JSON.stringify(matrix));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

void setZeroes(vector<vector<int>>& matrix) {
    // Write your code here (modify in place)
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<int>> matrix;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string row;
    while (getline(ss, row, ']')) {
        if (row.empty() || row == ",") continue;
        
        if (row[0] == ',') row = row.substr(1);
        if (row[0] == '[') row = row.substr(1);
        
        vector<int> currentRow;
        stringstream rowStream(row);
        string num;
        while (getline(rowStream, num, ',')) {
            if (!num.empty()) {
                currentRow.push_back(stoi(num));
            }
        }
        if (!currentRow.empty()) {
            matrix.push_back(currentRow);
        }
    }
    
    setZeroes(matrix);
    
    cout << "[";
    for (int i = 0; i < matrix.size(); i++) {
        cout << "[";
        for (int j = 0; j < matrix[i].size(); j++) {
            cout << matrix[i][j];
            if (j < matrix[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < matrix.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void setZeroes(int[][] matrix) {
        // Write your code here (modify in place)
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] rowStrs = line.split("\\],\\[");
        
        List<int[]> matrixList = new ArrayList<>();
        for (String rowStr : rowStrs) {
            rowStr = rowStr.replace("[", "").replace("]", "");
            String[] nums = rowStr.split(",");
            int[] row = new int[nums.length];
            for (int i = 0; i < nums.length; i++) {
                row[i] = Integer.parseInt(nums[i].trim());
            }
            matrixList.add(row);
        }
        
        int[][] matrix = matrixList.toArray(new int[matrixList.size()][]);
        setZeroes(matrix);
        
        System.out.print("[");
        for (int i = 0; i < matrix.length; i++) {
            System.out.print("[");
            for (int j = 0; j < matrix[i].length; j++) {
                System.out.print(matrix[i][j]);
                if (j < matrix[i].length - 1) System.out.print(",");
            }
            System.out.print("]");
            if (i < matrix.length - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Spiral Matrix",
    slug: "spiral-matrix",
    difficulty: "Medium",
    category: "Array",
    description: `Given an m x n matrix, return all elements of the matrix in spiral order.`,
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[1,2,3,6,9,8,7,4,5]",
        explanation: "The spiral order traversal starts from top-left and moves clockwise.",
      },
      {
        input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
        output: "[1,2,3,4,8,12,11,10,9,5,6,7]",
        explanation: "The spiral order traversal for a 3x4 matrix.",
      },
    ],
    constraints: [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 10",
      "-100 <= matrix[i][j] <= 100"
    ],
    tags: ["Array", "Matrix", "Simulation"],
    testCases: [
      {
        input: "[[1,2,3],[4,5,6],[7,8,9]]",
        expectedOutput: "[1,2,3,6,9,8,7,4,5]",
        isHidden: false,
      },
      {
        input: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
        expectedOutput: "[1,2,3,4,8,12,11,10,9,5,6,7]",
        isHidden: false,
      },
      {
        input: "[[1]]",
        expectedOutput: "[1]",
        isHidden: true,
      },
      {
        input: "[[1,2,3]]",
        expectedOutput: "[1,2,3]",
        isHidden: true,
      },
      {
        input: "[[1],[2],[3]]",
        expectedOutput: "[1,2,3]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function spiralOrder(matrix) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const matrix = JSON.parse(input.trim());
  const result = spiralOrder(matrix);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

vector<int> spiralOrder(vector<vector<int>>& matrix) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<int>> matrix;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string row;
    while (getline(ss, row, ']')) {
        if (row.empty() || row == ",") continue;
        
        if (row[0] == ',') row = row.substr(1);
        if (row[0] == '[') row = row.substr(1);
        
        vector<int> currentRow;
        stringstream rowStream(row);
        string num;
        while (getline(rowStream, num, ',')) {
            if (!num.empty()) {
                currentRow.push_back(stoi(num));
            }
        }
        if (!currentRow.empty()) {
            matrix.push_back(currentRow);
        }
    }
    
    vector<int> result = spiralOrder(matrix);
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<Integer> spiralOrder(int[][] matrix) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] rowStrs = line.split("\\],\\[");
        
        List<int[]> matrixList = new ArrayList<>();
        for (String rowStr : rowStrs) {
            rowStr = rowStr.replace("[", "").replace("]", "");
            String[] nums = rowStr.split(",");
            int[] row = new int[nums.length];
            for (int i = 0; i < nums.length; i++) {
                row[i] = Integer.parseInt(nums[i].trim());
            }
            matrixList.add(row);
        }
        
        int[][] matrix = matrixList.toArray(new int[matrixList.size()][]);
        List<Integer> result = spiralOrder(matrix);
        System.out.println(result);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Rotate Image",
    slug: "rotate-image",
    difficulty: "Medium",
    category: "Array",
    description: `You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.`,
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1],[8,5,2],[9,6,3]]",
        explanation: "The matrix is rotated 90 degrees clockwise.",
      },
      {
        input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
        explanation: "The 4x4 matrix is rotated 90 degrees clockwise.",
      },
    ],
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 <= n <= 20",
      "-1000 <= matrix[i][j] <= 1000"
    ],
    tags: ["Array", "Math", "Matrix"],
    testCases: [
      {
        input: "[[1,2,3],[4,5,6],[7,8,9]]",
        expectedOutput: "[[7,4,1],[8,5,2],[9,6,3]]",
        isHidden: false,
      },
      {
        input: "[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        expectedOutput: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
        isHidden: false,
      },
      {
        input: "[[1]]",
        expectedOutput: "[[1]]",
        isHidden: true,
      },
      {
        input: "[[1,2],[3,4]]",
        expectedOutput: "[[3,1],[4,2]]",
        isHidden: true,
      },
      {
        input: "[[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]",
        expectedOutput: "[[21,16,11,6,1],[22,17,12,7,2],[23,18,13,8,3],[24,19,14,9,4],[25,20,15,10,5]]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function rotate(matrix) {
    // Write your code here (modify in place)
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const matrix = JSON.parse(input.trim());
  rotate(matrix);
  console.log(JSON.stringify(matrix));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

void rotate(vector<vector<int>>& matrix) {
    // Write your code here (modify in place)
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<vector<int>> matrix;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string row;
    while (getline(ss, row, ']')) {
        if (row.empty() || row == ",") continue;
        
        if (row[0] == ',') row = row.substr(1);
        if (row[0] == '[') row = row.substr(1);
        
        vector<int> currentRow;
        stringstream rowStream(row);
        string num;
        while (getline(rowStream, num, ',')) {
            if (!num.empty()) {
                currentRow.push_back(stoi(num));
            }
        }
        if (!currentRow.empty()) {
            matrix.push_back(currentRow);
        }
    }
    
    rotate(matrix);
    
    cout << "[";
    for (int i = 0; i < matrix.size(); i++) {
        cout << "[";
        for (int j = 0; j < matrix[i].size(); j++) {
            cout << matrix[i][j];
            if (j < matrix[i].size() - 1) cout << ",";
        }
        cout << "]";
        if (i < matrix.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static void rotate(int[][] matrix) {
        // Write your code here (modify in place)
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] rowStrs = line.split("\\],\\[");
        
        List<int[]> matrixList = new ArrayList<>();
        for (String rowStr : rowStrs) {
            rowStr = rowStr.replace("[", "").replace("]", "");
            String[] nums = rowStr.split(",");
            int[] row = new int[nums.length];
            for (int i = 0; i < nums.length; i++) {
                row[i] = Integer.parseInt(nums[i].trim());
            }
            matrixList.add(row);
        }
        
        int[][] matrix = matrixList.toArray(new int[matrixList.size()][]);
        rotate(matrix);
        
        System.out.print("[");
        for (int i = 0; i < matrix.length; i++) {
            System.out.print("[");
            for (int j = 0; j < matrix[i].length; j++) {
                System.out.print(matrix[i][j]);
                if (j < matrix[i].length - 1) System.out.print(",");
            }
            System.out.print("]");
            if (i < matrix.length - 1) System.out.print(",");
        }
        System.out.println("]");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Word Search",
    slug: "word-search",
    difficulty: "Medium",
    category: "Array",
    description: `Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: "true",
        explanation: "The word ABCCED can be found in the grid.",
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: "true",
        explanation: "The word SEE can be found in the grid.",
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
        output: "false",
        explanation: "The word ABCB cannot be found because we cannot reuse the same cell.",
      },
    ],
    constraints: [
      "m == board.length",
      "n = board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15",
      "board and word consists of only lowercase and uppercase English letters"
    ],
    tags: ["Array", "Backtracking", "Matrix"],
    testCases: [
      {
        input: '[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCCED"]',
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: '[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"SEE"]',
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: '[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"ABCB"]',
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: '[[["A"]],"A"]',
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: '[[["C","A","A"],["A","A","A"],["B","C","D"]],"AAB"]',
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function exist(board, word) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const parsed = JSON.parse(input.trim());
  const board = parsed[0];
  const word = parsed[1];
  console.log(exist(board, word));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<string>
#include<sstream>
using namespace std;

bool exist(vector<vector<char>>& board, string word) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    // Parse JSON manually
    size_t boardStart = line.find('[') + 1;
    size_t boardEnd = line.find(']', line.find("]]")) + 1;
    string boardStr = line.substr(boardStart, boardEnd - boardStart);
    
    size_t wordStart = line.find('"', boardEnd) + 1;
    size_t wordEnd = line.find('"', wordStart);
    string word = line.substr(wordStart, wordEnd - wordStart);
    
    vector<vector<char>> board;
    boardStr = boardStr.substr(0, boardStr.length()-1);
    
    stringstream ss(boardStr);
    string row;
    while (getline(ss, row, ']')) {
        if (row.empty() || row == ",") continue;
        
        if (row[0] == ',') row = row.substr(1);
        if (row[0] == '[') row = row.substr(1);
        
        vector<char> currentRow;
        for (int i = 0; i < row.length(); i += 4) {
            if (row[i] == '"') {
                currentRow.push_back(row[i+1]);
            }
        }
        if (!currentRow.empty()) {
            board.push_back(currentRow);
        }
    }
    
    cout << (exist(board, word) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean exist(char[][] board, String word) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        // Parse the JSON input
        line = line.substring(1, line.length()-1);
        String[] parts = line.split("\",\"");
        
        String boardPart = parts[0];
        String word = parts[1];
        
        // Extract board
        boardPart = boardPart.substring(1);
        String[] rowStrs = boardPart.split("\\],\\[");
        
        List<char[]> boardList = new ArrayList<>();
        for (String rowStr : rowStrs) {
            rowStr = rowStr.replace("[", "").replace("]", "");
            String[] chars = rowStr.split("\",\"");
            char[] row = new char[chars.length];
            for (int i = 0; i < chars.length; i++) {
                row[i] = chars[i].replace("\"", "").charAt(0);
            }
            boardList.add(row);
        }
        
        char[][] board = boardList.toArray(new char[boardList.size()][]);
        System.out.println(exist(board, word));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Implement Trie (Prefix Tree)",
    slug: "implement-trie-prefix-tree",
    difficulty: "Medium",
    category: "Design",
    description: `A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and search strings in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker. Implement the Trie class with insert, search, and startsWith methods.`,
    examples: [
      {
        input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"] [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]',
        output: "[null, null, true, false, true, null, true]",
        explanation: "The trie operations return the expected results.",
      },
    ],
    constraints: [
      "1 <= word.length, prefix.length <= 2000",
      "word and prefix consist only of lowercase English letters",
      "At most 3 * 10^4 calls will be made to insert, search, and startsWith"
    ],
    tags: ["Hash Table", "String", "Design", "Trie"],
    testCases: [
      {
        input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"] [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]',
        expectedOutput: "[null, null, true, false, true, null, true]",
        isHidden: false,
      },
      {
        input: '["Trie", "insert", "insert", "search", "search", "startsWith"] [[], ["hello"], ["help"], ["hello"], ["world"], ["hel"]]',
        expectedOutput: "[null, null, null, true, false, true]",
        isHidden: true,
      },
      {
        input: '["Trie", "insert", "search", "startsWith"] [[], ["word"], ["word"], ["wo"]]',
        expectedOutput: "[null, null, true, true]",
        isHidden: true,
      },
      {
        input: '["Trie", "search", "startsWith"] [[], ["test"], ["test"]]',
        expectedOutput: "[null, false, false]",
        isHidden: true,
      },
      {
        input: '["Trie", "insert", "insert", "search", "search", "search", "startsWith", "startsWith", "startsWith"] [[], ["app"], ["apple"], ["app"], ["apple"], ["appl"], ["app"], ["appl"], ["application"]]',
        expectedOutput: "[null, null, null, true, true, false, true, true, false]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `class Trie {
    constructor() {
        // Initialize your data structure here
        
    }
    
    insert(word) {
        // Inserts a word into the trie
        
    }
    
    search(word) {
        // Returns true if the word is in the trie
        
    }
    
    startsWith(prefix) {
        // Returns true if there is a previously inserted word that has the prefix
        
    }
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const lines = input.trim().split(' ');
  const operations = JSON.parse(lines[0]);
  const parameters = JSON.parse(lines[1]);
  
  let trie = null;
  const results = [];
  
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const param = parameters[i];
    
    if (op === "Trie") {
      trie = new Trie();
      results.push(null);
    } else if (op === "insert") {
      trie.insert(param[0]);
      results.push(null);
    } else if (op === "search") {
      results.push(trie.search(param[0]));
    } else if (op === "startsWith") {
      results.push(trie.startsWith(param[0]));
    }
  }
  
  console.log(JSON.stringify(results));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<string>
#include<sstream>
using namespace std;

class Trie {
public:
    Trie() {
        // Initialize your data structure here
        
    }
    
    void insert(string word) {
        // Inserts a word into the trie
        
    }
    
    bool search(string word) {
        // Returns true if the word is in the trie
        
    }
    
    bool startsWith(string prefix) {
        // Returns true if there is a previously inserted word that has the prefix
        
    }
};

int main() {
    string line;
    getline(cin, line);
    
    // Parse operations and parameters from JSON
    Trie* trie = nullptr;
    vector<string> results;
    
    // Simple parsing for the test format
    if (line.find("Trie") != string::npos) {
        trie = new Trie();
        results.push_back("null");
        
        if (line.find("insert") != string::npos) {
            // Extract word from the input
            size_t start = line.find("[\"") + 2;
            size_t end = line.find("\"]", start);
            string word = line.substr(start, end - start);
            trie->insert(word);
            results.push_back("null");
        }
    }
    
    cout << "[";
    for (int i = 0; i < results.size(); i++) {
        cout << results[i];
        if (i < results.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class Trie {
    public Trie() {
        // Initialize your data structure here
        
    }
    
    public void insert(String word) {
        // Inserts a word into the trie
        
    }
    
    public boolean search(String word) {
        // Returns true if the word is in the trie
        
    }
    
    public boolean startsWith(String prefix) {
        // Returns true if there is a previously inserted word that has the prefix
        
    }
}

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        String[] parts = line.split(" \\[\\[");
        String operationsStr = parts[0];
        String parametersStr = "[[" + parts[1];
        
        Trie trie = null;
        List<String> results = new ArrayList<>();
        
        // Simple parsing for basic operations
        if (line.contains("Trie")) {
            trie = new Trie();
            results.add("null");
            
            if (line.contains("insert")) {
                // Extract and process based on the test case
                results.add("null");
            }
        }
        
        System.out.println(results);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Add and Search Word - Data structure design",
    slug: "design-add-and-search-words-data-structure",
    difficulty: "Medium",
    category: "Design",
    description: `Design a data structure that supports adding new words and finding if a string matches any previously added word. Implement the WordDictionary class with addWord and search methods. The search method can search for literal words or patterns with '.' as wildcards.`,
    examples: [
      {
        input: '["WordDictionary","addWord","addWord","addWord","search","search","search","search"] [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]',
        output: "[null,null,null,null,false,true,true,true]",
        explanation: "The word dictionary supports wildcard searches.",
      },
    ],
    constraints: [
      "1 <= word.length <= 25",
      "word in addWord consists of lowercase English letters",
      "word in search consist of '.' or lowercase English letters",
      "There will be at most 3 * 10^4 calls to addWord and search"
    ],
    tags: ["String", "Depth-First Search", "Design", "Trie"],
    testCases: [
      {
        input: '["WordDictionary","addWord","addWord","addWord","search","search","search","search"] [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]',
        expectedOutput: "[null,null,null,null,false,true,true,true]",
        isHidden: false,
      },
      {
        input: '["WordDictionary","addWord","search","search"] [[],["word"],["word"],["w.rd"]]',
        expectedOutput: "[null,null,true,true]",
        isHidden: true,
      },
      {
        input: '["WordDictionary","search"] [[],["test"]]',
        expectedOutput: "[null,false]",
        isHidden: true,
      },
      {
        input: '["WordDictionary","addWord","addWord","search","search","search"] [[],["a"],["a"],["."],["a"],["aa"]]',
        expectedOutput: "[null,null,null,true,true,false]",
        isHidden: true,
      },
      {
        input: '["WordDictionary","addWord","addWord","addWord","search","search","search","search","search"] [[],["at"],["and"],["an"],["a"],["at"],["and"],["an"],[".at"]]',
        expectedOutput: "[null,null,null,null,false,true,true,true,false]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `class WordDictionary {
    constructor() {
        // Initialize your data structure here
        
    }
    
    addWord(word) {
        // Adds a word into the data structure
        
    }
    
    search(word) {
        // Returns true if word is in the data structure. Word can contain '.' as wildcards
        
    }
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const lines = input.trim().split(' ');
  const operations = JSON.parse(lines[0]);
  const parameters = JSON.parse(lines[1]);
  
  let dict = null;
  const results = [];
  
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const param = parameters[i];
    
    if (op === "WordDictionary") {
      dict = new WordDictionary();
      results.push(null);
    } else if (op === "addWord") {
      dict.addWord(param[0]);
      results.push(null);
    } else if (op === "search") {
      results.push(dict.search(param[0]));
    }
  }
  
  console.log(JSON.stringify(results));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<string>
#include<sstream>
using namespace std;

class WordDictionary {
public:
    WordDictionary() {
        // Initialize your data structure here
        
    }
    
    void addWord(string word) {
        // Adds a word into the data structure
        
    }
    
    bool search(string word) {
        // Returns true if word is in the data structure. Word can contain '.' as wildcards
        
    }
};

int main() {
    string line;
    getline(cin, line);
    
    WordDictionary* dict = nullptr;
    vector<string> results;
    
    // Simple parsing for the test format
    if (line.find("WordDictionary") != string::npos) {
        dict = new WordDictionary();
        results.push_back("null");
    }
    
    cout << "[";
    for (int i = 0; i < results.size(); i++) {
        cout << results[i];
        if (i < results.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

class WordDictionary {
    public WordDictionary() {
        // Initialize your data structure here
        
    }
    
    public void addWord(String word) {
        // Adds a word into the data structure
        
    }
    
    public boolean search(String word) {
        // Returns true if word is in the data structure. Word can contain '.' as wildcards
        
    }
}

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        WordDictionary dict = null;
        List<String> results = new ArrayList<>();
        
        // Simple parsing for basic operations
        if (line.contains("WordDictionary")) {
            dict = new WordDictionary();
            results.add("null");
        }
        
        System.out.println(results);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Word Break",
    slug: "word-break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: `Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation: 'Return true because "leetcode" can be segmented as "leet code".',
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: "true",
        explanation: 'Return true because "applepenapple" can be segmented as "apple pen apple".',
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: "false",
        explanation: "The string cannot be segmented into dictionary words.",
      },
    ],
    constraints: [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000",
      "1 <= wordDict[i].length <= 20",
      "s and wordDict[i] consist of only lowercase English letters",
      "All the strings of wordDict are unique"
    ],
    tags: ["Hash Table", "String", "Dynamic Programming", "Trie", "Memoization"],
    testCases: [
      {
        input: '"leetcode" ["leet","code"]',
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: '"applepenapple" ["apple","pen"]',
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: '"catsandog" ["cats","dog","sand","and","cat"]',
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: '"cars" ["car","ca","rs"]',
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: '"aaaaaaa" ["aaaa","aa"]',
        expectedOutput: "false",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const parts = input.trim().split(' ');
  const s = parts[0].slice(1, -1); // Remove quotes
  const wordDict = JSON.parse(parts.slice(1).join(' '));
  console.log(wordBreak(s, wordDict));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<string>
#include<sstream>
using namespace std;

bool wordBreak(string s, vector<string>& wordDict) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    size_t firstQuote = line.find('"');
    size_t secondQuote = line.find('"', firstQuote + 1);
    string s = line.substr(firstQuote + 1, secondQuote - firstQuote - 1);
    
    size_t bracketStart = line.find('[');
    string dictStr = line.substr(bracketStart);
    
    vector<string> wordDict;
    dictStr = dictStr.substr(1, dictStr.length() - 2);
    
    stringstream ss(dictStr);
    string word;
    while (getline(ss, word, ',')) {
        if (!word.empty()) {
            word.erase(0, word.find_first_not_of(" \""));
            word.erase(word.find_last_not_of(" \"") + 1);
            wordDict.push_back(word);
        }
    }
    
    cout << (wordBreak(s, wordDict) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean wordBreak(String s, List<String> wordDict) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        int firstQuote = line.indexOf('"');
        int secondQuote = line.indexOf('"', firstQuote + 1);
        String s = line.substring(firstQuote + 1, secondQuote);
        
        int bracketStart = line.indexOf('[');
        String dictStr = line.substring(bracketStart + 1, line.length() - 1);
        
        List<String> wordDict = new ArrayList<>();
        String[] words = dictStr.split(",");
        for (String word : words) {
            word = word.trim().replace("\"", "");
            wordDict.add(word);
        }
        
        System.out.println(wordBreak(s, wordDict));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Course Schedule II",
    slug: "course-schedule-ii",
    difficulty: "Medium",
    category: "Graph",
    description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.`,
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "[0,1]",
        explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0. So the correct course order is [0,1].",
      },
      {
        input: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]",
        output: "[0,2,1,3]",
        explanation: "There are a total of 4 courses to take. One possible ordering is [0,2,1,3].",
      },
      {
        input: "numCourses = 1, prerequisites = []",
        output: "[0]",
        explanation: "There is only one course to take.",
      },
    ],
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= numCourses * (numCourses - 1)",
      "prerequisites[i].length == 2",
      "0 <= ai, bi < numCourses",
      "ai != bi",
      "All the pairs [ai, bi] are distinct"
    ],
    tags: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    testCases: [
      {
        input: "2 [[1,0]]",
        expectedOutput: "[0,1]",
        isHidden: false,
      },
      {
        input: "4 [[1,0],[2,0],[3,1],[3,2]]",
        expectedOutput: "[0,2,1,3]",
        isHidden: false,
      },
      {
        input: "1 []",
        expectedOutput: "[0]",
        isHidden: true,
      },
      {
        input: "2 [[1,0],[0,1]]",
        expectedOutput: "[]",
        isHidden: true,
      },
      {
        input: "3 [[1,0],[1,2],[0,1]]",
        expectedOutput: "[]",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function findOrder(numCourses, prerequisites) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const parts = input.trim().split(' ');
  const numCourses = parseInt(parts[0]);
  const prerequisites = JSON.parse(parts.slice(1).join(' '));
  const result = findOrder(numCourses, prerequisites);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<queue>
using namespace std;

vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    size_t spacePos = line.find(' ');
    int numCourses = stoi(line.substr(0, spacePos));
    
    string prereqStr = line.substr(spacePos + 1);
    vector<vector<int>> prerequisites;
    
    if (prereqStr != "[]") {
        prereqStr = prereqStr.substr(1, prereqStr.length()-2);
        
        stringstream ss(prereqStr);
        string pair;
        while (getline(ss, pair, ']')) {
            if (pair.empty() || pair == ",") continue;
            
            if (pair[0] == ',') pair = pair.substr(1);
            if (pair[0] == '[') pair = pair.substr(1);
            
            stringstream pairStream(pair);
            string num;
            vector<int> currentPair;
            while (getline(pairStream, num, ',')) {
                if (!num.empty()) {
                    currentPair.push_back(stoi(num));
                }
            }
            if (currentPair.size() == 2) {
                prerequisites.push_back(currentPair);
            }
        }
    }
    
    vector<int> result = findOrder(numCourses, prerequisites);
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] findOrder(int numCourses, int[][] prerequisites) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        String[] parts = line.split(" \\[");
        int numCourses = Integer.parseInt(parts[0]);
        
        int[][] prerequisites;
        if (parts.length == 1 || parts[1].equals("]")) {
            prerequisites = new int[0][];
        } else {
            String prereqStr = "[" + parts[1];
            prereqStr = prereqStr.substring(1, prereqStr.length()-1);
            String[] pairs = prereqStr.split("\\],\\[");
            
            List<int[]> prereqList = new ArrayList<>();
            for (String pair : pairs) {
                pair = pair.replace("[", "").replace("]", "");
                String[] nums = pair.split(",");
                prereqList.add(new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())});
            }
            prerequisites = prereqList.toArray(new int[prereqList.size()][]);
        }
        
        int[] result = findOrder(numCourses, prerequisites);
        System.out.println(Arrays.toString(result));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Alien Dictionary",
    slug: "alien-dictionary",
    difficulty: "Hard",
    category: "Graph",
    description: `There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you. You are given a list of strings words from the alien language's dictionary, where the strings in words are sorted lexicographically by the rules of this new language. Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If there is no solution, return "". If there are multiple solutions, return any of them.`,
    examples: [
      {
        input: 'words = ["wrt","wrf","er","ett","rftt"]',
        output: '"wertf"',
        explanation: 'The order is "wertf".',
      },
      {
        input: 'words = ["z","x"]',
        output: '"zx"',
        explanation: 'The order is "zx".',
      },
      {
        input: 'words = ["z","x","z"]',
        output: '""',
        explanation: "The order is impossible, so return empty string.",
      },
    ],
    constraints: [
      "1 <= words.length <= 100",
      "1 <= words[i].length <= 100",
      "words[i] consists of only lowercase English letters"
    ],
    tags: ["Array", "String", "Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    testCases: [
      {
        input: '["wrt","wrf","er","ett","rftt"]',
        expectedOutput: '"wertf"',
        isHidden: false,
      },
      {
        input: '["z","x"]',
        expectedOutput: '"zx"',
        isHidden: false,
      },
      {
        input: '["z","x","z"]',
        expectedOutput: '""',
        isHidden: true,
      },
      {
        input: '["abc","ab"]',
        expectedOutput: '""',
        isHidden: true,
      },
      {
        input: '["a","b","ca","cc"]',
        expectedOutput: '"abc"',
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function alienOrder(words) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const words = JSON.parse(input.trim());
  const result = alienOrder(words);
  console.log(JSON.stringify(result));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<string>
#include<sstream>
#include<unordered_map>
#include<unordered_set>
#include<queue>
using namespace std;

string alienOrder(vector<string>& words) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<string> words;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string word;
    while (getline(ss, word, ',')) {
        if (!word.empty()) {
            word.erase(0, word.find_first_not_of(" \""));
            word.erase(word.find_last_not_of(" \"") + 1);
            words.push_back(word);
        }
    }
    
    string result = alienOrder(words);
    cout << "\"" << result << "\"" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static String alienOrder(String[] words) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] wordStrs = line.split(",");
        
        List<String> wordsList = new ArrayList<>();
        for (String word : wordStrs) {
            word = word.trim().replace("\"", "");
            wordsList.add(word);
        }
        
        String[] words = wordsList.toArray(new String[wordsList.size()]);
        String result = alienOrder(words);
        System.out.println("\"" + result + "\"");
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Graph Valid Tree",
    slug: "graph-valid-tree",
    difficulty: "Medium",
    category: "Graph",
    description: `You have a graph of n nodes labeled from 0 to n - 1. You are given an integer n and a list of edges where edges[i] = [ai, bi] indicates that there is an undirected edge between nodes ai and bi in the graph. Return true if the edges of the given graph make up a valid tree, and false otherwise.`,
    examples: [
      {
        input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]",
        output: "true",
        explanation: "The graph forms a valid tree.",
      },
      {
        input: "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]",
        output: "false",
        explanation: "The graph contains a cycle, so it's not a valid tree.",
      },
    ],
    constraints: [
      "1 <= n <= 2000",
      "0 <= edges.length <= 5000",
      "edges[i].length == 2",
      "0 <= ai, bi < n",
      "ai != bi",
      "There are no self-loops or repeated edges"
    ],
    tags: ["Depth-First Search", "Breadth-First Search", "Union Find", "Graph"],
    testCases: [
      {
        input: "5 [[0,1],[0,2],[0,3],[1,4]]",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "5 [[0,1],[1,2],[2,3],[1,3],[1,4]]",
        expectedOutput: "false",
        isHidden: false,
      },
      {
        input: "1 []",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "2 [[0,1]]",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "4 [[0,1],[2,3]]",
        expectedOutput: "false",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function validTree(n, edges) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const parts = input.trim().split(' ');
  const n = parseInt(parts[0]);
  const edges = JSON.parse(parts.slice(1).join(' '));
  console.log(validTree(n, edges));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

bool validTree(int n, vector<vector<int>>& edges) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    size_t spacePos = line.find(' ');
    int n = stoi(line.substr(0, spacePos));
    
    string edgesStr = line.substr(spacePos + 1);
    vector<vector<int>> edges;
    
    if (edgesStr != "[]") {
        edgesStr = edgesStr.substr(1, edgesStr.length()-2);
        
        stringstream ss(edgesStr);
        string edge;
        while (getline(ss, edge, ']')) {
            if (edge.empty() || edge == ",") continue;
            
            if (edge[0] == ',') edge = edge.substr(1);
            if (edge[0] == '[') edge = edge.substr(1);
            
            stringstream edgeStream(edge);
            string num;
            vector<int> currentEdge;
            while (getline(edgeStream, num, ',')) {
                if (!num.empty()) {
                    currentEdge.push_back(stoi(num));
                }
            }
            if (currentEdge.size() == 2) {
                edges.push_back(currentEdge);
            }
        }
    }
    
    cout << (validTree(n, edges) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean validTree(int n, int[][] edges) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        String[] parts = line.split(" \\[");
        int n = Integer.parseInt(parts[0]);
        
        int[][] edges;
        if (parts.length == 1 || parts[1].equals("]")) {
            edges = new int[0][];
        } else {
            String edgesStr = "[" + parts[1];
            edgesStr = edgesStr.substring(1, edgesStr.length()-1);
            String[] edgeStrs = edgesStr.split("\\],\\[");
            
            List<int[]> edgesList = new ArrayList<>();
            for (String edgeStr : edgeStrs) {
                edgeStr = edgeStr.replace("[", "").replace("]", "");
                String[] nums = edgeStr.split(",");
                edgesList.add(new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())});
            }
            edges = edgesList.toArray(new int[edgesList.size()][]);
        }
        
        System.out.println(validTree(n, edges));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Number of Connected Components in an Undirected Graph",
    slug: "number-of-connected-components-in-an-undirected-graph",
    difficulty: "Medium",
    category: "Graph",
    description: `You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph. Return the number of connected components in the graph.`,
    examples: [
      {
        input: "n = 5, edges = [[0,1],[1,2],[3,4]]",
        output: "2",
        explanation: "There are 2 connected components: {0,1,2} and {3,4}.",
      },
      {
        input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]",
        output: "1",
        explanation: "All nodes are connected in one component.",
      },
    ],
    constraints: [
      "1 <= n <= 2000",
      "1 <= edges.length <= 5000",
      "edges[i].length == 2",
      "0 <= ai <= bi < n",
      "ai != bi",
      "There are no repeated edges"
    ],
    tags: ["Depth-First Search", "Breadth-First Search", "Union Find", "Graph"],
    testCases: [
      {
        input: "5 [[0,1],[1,2],[3,4]]",
        expectedOutput: "2",
        isHidden: false,
      },
      {
        input: "5 [[0,1],[1,2],[2,3],[3,4]]",
        expectedOutput: "1",
        isHidden: false,
      },
      {
        input: "1 []",
        expectedOutput: "1",
        isHidden: true,
      },
      {
        input: "3 []",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "4 [[0,1],[2,3]]",
        expectedOutput: "2",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function countComponents(n, edges) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const parts = input.trim().split(' ');
  const n = parseInt(parts[0]);
  const edges = JSON.parse(parts.slice(1).join(' '));
  console.log(countComponents(n, edges));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

int countComponents(int n, vector<vector<int>>& edges) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    size_t spacePos = line.find(' ');
    int n = stoi(line.substr(0, spacePos));
    
    string edgesStr = line.substr(spacePos + 1);
    vector<vector<int>> edges;
    
    if (edgesStr != "[]") {
        edgesStr = edgesStr.substr(1, edgesStr.length()-2);
        
        stringstream ss(edgesStr);
        string edge;
        while (getline(ss, edge, ']')) {
            if (edge.empty() || edge == ",") continue;
            
            if (edge[0] == ',') edge = edge.substr(1);
            if (edge[0] == '[') edge = edge.substr(1);
            
            stringstream edgeStream(edge);
            string num;
            vector<int> currentEdge;
            while (getline(edgeStream, num, ',')) {
                if (!num.empty()) {
                    currentEdge.push_back(stoi(num));
                }
            }
            if (currentEdge.size() == 2) {
                edges.push_back(currentEdge);
            }
        }
    }
    
    cout << countComponents(n, edges) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int countComponents(int n, int[][] edges) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        String[] parts = line.split(" \\[");
        int n = Integer.parseInt(parts[0]);
        
        int[][] edges;
        if (parts.length == 1 || parts[1].equals("]")) {
            edges = new int[0][];
        } else {
            String edgesStr = "[" + parts[1];
            edgesStr = edgesStr.substring(1, edgesStr.length()-1);
            String[] edgeStrs = edgesStr.split("\\],\\[");
            
            List<int[]> edgesList = new ArrayList<>();
            for (String edgeStr : edgeStrs) {
                edgeStr = edgeStr.replace("[", "").replace("]", "");
                String[] nums = edgeStr.split(",");
                edgesList.add(new int[]{Integer.parseInt(nums[0].trim()), Integer.parseInt(nums[1].trim())});
            }
            edges = edgesList.toArray(new int[edgesList.size()][]);
        }
        
        System.out.println(countComponents(n, edges));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Longest Consecutive Sequence",
    slug: "longest-consecutive-sequence",
    difficulty: "Medium",
    category: "Array",
    description: `Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.`,
    examples: [
      {
        input: "nums = [100,4,200,1,3,2]",
        output: "4",
        explanation: "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.",
      },
      {
        input: "nums = [0,3,7,2,5,8,4,6,0,1]",
        output: "9",
        explanation: "The longest consecutive sequence is [0,1,2,3,4,5,6,7,8] with length 9.",
      },
    ],
    constraints: [
      "0 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    tags: ["Array", "Hash Table", "Union Find"],
    testCases: [
      {
        input: "[100,4,200,1,3,2]",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "[0,3,7,2,5,8,4,6,0,1]",
        expectedOutput: "9",
        isHidden: false,
      },
      {
        input: "[]",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "[1,2,0,1]",
        expectedOutput: "3",
        isHidden: true,
      },
      {
        input: "[9,1,4,7,3,-1,0,5,8,-1,6]",
        expectedOutput: "7",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function longestConsecutive(nums) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const nums = JSON.parse(input.trim());
  console.log(longestConsecutive(nums));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
#include<unordered_set>
using namespace std;

int longestConsecutive(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<int> nums;
    if (line != "[]") {
        line = line.substr(1, line.length()-2);
        stringstream ss(line);
        string num;
        while (getline(ss, num, ',')) {
            if (!num.empty()) {
                nums.push_back(stoi(num));
            }
        }
    }
    
    cout << longestConsecutive(nums) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int longestConsecutive(int[] nums) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        if (line.equals("[]")) {
            System.out.println(longestConsecutive(new int[0]));
        } else {
            line = line.substring(1, line.length()-1);
            String[] numStrs = line.split(",");
            int[] nums = new int[numStrs.length];
            for (int i = 0; i < numStrs.length; i++) {
                nums[i] = Integer.parseInt(numStrs[i].trim());
            }
            System.out.println(longestConsecutive(nums));
        }
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
  {
    title: "Encode and Decode Strings",
    slug: "encode-and-decode-strings",
    difficulty: "Medium",
    category: "String",
    description: `Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and is decoded back to the original list of strings. Machine 1 (sender) has the function: string encode(vector<string> strs) that returns a string. Machine 2 (receiver) has the function: vector<string> decode(string s) that decodes the encoded string back to the original list.`,
    examples: [
      {
        input: 'dummy_input = ["lint","code","love","you"]',
        output: '["lint","code","love","you"]',
        explanation: "One possible encode method is: encode(['lint','code','love','you']) = 'lint:;code:;love:;you'",
      },
      {
        input: 'dummy_input = ["we", "say", ":", "yes"]',
        output: '["we", "say", ":", "yes"]',
        explanation: "Another possible encode method is to use escape characters.",
      },
    ],
    constraints: [
      "1 <= strs.length <= 200",
      "0 <= strs[i].length <= 200",
      "strs[i] contains any possible characters out of 256 valid ASCII characters"
    ],
    tags: ["Array", "String", "Design"],
    testCases: [
      {
        input: '["lint","code","love","you"]',
        expectedOutput: '["lint","code","love","you"]',
        isHidden: false,
      },
      {
        input: '["we", "say", ":", "yes"]',
        expectedOutput: '["we", "say", ":", "yes"]',
        isHidden: false,
      },
      {
        input: '[""]',
        expectedOutput: '[""]',
        isHidden: true,
      },
      {
        input: '["hello","world"]',
        expectedOutput: '["hello","world"]',
        isHidden: true,
      },
      {
        input: '["a","b","c","d","e"]',
        expectedOutput: '["a","b","c","d","e"]',
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function encode(strs) {
    // Write your code here
    
}

function decode(s) {
    // Write your code here
    
}

// Do not modify below this line
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const strs = JSON.parse(input.trim());
  const encoded = encode(strs);
  const decoded = decode(encoded);
  console.log(JSON.stringify(decoded));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<vector>
#include<string>
#include<sstream>
using namespace std;

string encode(vector<string>& strs) {
    // Write your code here
    
}

vector<string> decode(string s) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    vector<string> strs;
    line = line.substr(1, line.length()-2);
    
    stringstream ss(line);
    string str;
    while (getline(ss, str, ',')) {
        if (!str.empty()) {
            str.erase(0, str.find_first_not_of(" \""));
            str.erase(str.find_last_not_of(" \"") + 1);
            strs.push_back(str);
        }
    }
    
    string encoded = encode(strs);
    vector<string> decoded = decode(encoded);
    
    cout << "[";
    for (int i = 0; i < decoded.size(); i++) {
        cout << "\"" << decoded[i] << "\"";
        if (i < decoded.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static String encode(List<String> strs) {
        // Write your code here
        
    }
    
    public static List<String> decode(String s) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        line = line.substring(1, line.length()-1);
        String[] strArray = line.split(",");
        
        List<String> strs = new ArrayList<>();
        for (String str : strArray) {
            str = str.trim().replace("\"", "");
            strs.add(str);
        }
        
        String encoded = encode(strs);
        List<String> decoded = decode(encoded);
        System.out.println(decoded);
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  }
];

async function seedProblems() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://anshkr1032_db_user:ua54qSrWsFdDkYnP@prepmate.nzhrzav.mongodb.net/?retryWrites=true&w=majority&appName=Prepmate");
    console.log("Connected to MongoDB");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    // Insert new problems
    await Problem.insertMany(problems);
    console.log(`Inserted ${problems.length} problems`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedProblems();
