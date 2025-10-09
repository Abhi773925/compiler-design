const mongoose = require("mongoose");
const Problem = require("./models/Problem");

const problems = [
  {
    title: "Two Sum Target Found",
    slug: "two-sum-target-found",
    difficulty: "Easy",
    category: "Array",
    description: `Given an array of integers nums and an integer target, return true if any two different elements in the array sum to target, false otherwise.

You may assume that each input would have exactly one solution or no solution, and you may not use the same element twice.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "true",
        explanation: "Because nums[0] + nums[1] = 2 + 7 = 9, we return true.",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "true",
        explanation: "Because nums[1] + nums[2] = 2 + 4 = 6, we return true.",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "true",
        explanation: "Because nums[0] + nums[1] = 3 + 3 = 6, we return true.",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
    ],
    tags: ["Array", "Hash Table"],
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "[3,3]\n6",
        expectedOutput: "true",
        isHidden: true,
      },
      {
        input: "[1,2,3,4]\n8",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "[1,5,3,9]\n10",
        expectedOutput: "false",
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
  console.log(twoSum(nums, target));
});`,
      cpp: `#include<iostream>
#include<vector>
#include<sstream>
using namespace std;

bool twoSum(vector<int>& nums, int target) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    // Parse array
    vector<int> nums;
    line = line.substr(1, line.length()-2); // Remove brackets
    stringstream ss(line);
    string num;
    while(getline(ss, num, ',')) {
        nums.push_back(stoi(num));
    }
    
    int target;
    cin >> target;
    
    cout << (twoSum(nums, target) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean twoSum(int[] nums, int target) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String line = scanner.nextLine();
        
        // Parse array
        line = line.substring(1, line.length()-1); // Remove brackets
        String[] parts = line.split(",");
        int[] nums = new int[parts.length];
        for(int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        
        int target = scanner.nextInt();
        
        System.out.println(twoSum(nums, target));
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
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters.",
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
        input: "hello",
        expectedOutput: "false",
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
  console.log(isPalindrome(input.trim()));
  rl.close();
});`,
      cpp: `#include<iostream>
#include<string>
#include<algorithm>
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
    title: "Maximum Subarray Sum",
    slug: "maximum-subarray-sum",
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
    tags: ["Array", "Dynamic Programming"],
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
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your code here
    
}

int main() {
    string line;
    getline(cin, line);
    
    // Parse array
    vector<int> nums;
    line = line.substr(1, line.length()-2); // Remove brackets
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
        
        // Parse array
        line = line.substring(1, line.length()-1); // Remove brackets
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
    title: "Count Primes",
    slug: "count-primes",
    difficulty: "Medium",
    category: "Math",
    description: `Given an integer n, return the number of prime numbers that are less than n.

A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.`,
    examples: [
      {
        input: "n = 10",
        output: "4",
        explanation:
          "There are 4 prime numbers less than 10, they are 2, 3, 5, 7.",
      },
      {
        input: "n = 0",
        output: "0",
      },
      {
        input: "n = 1",
        output: "0",
      },
    ],
    constraints: ["0 <= n <= 5 * 10^6"],
    tags: ["Math", "Sieve of Eratosthenes"],
    testCases: [
      {
        input: "10",
        expectedOutput: "4",
        isHidden: false,
      },
      {
        input: "0",
        expectedOutput: "0",
        isHidden: false,
      },
      {
        input: "1",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "2",
        expectedOutput: "0",
        isHidden: true,
      },
      {
        input: "100",
        expectedOutput: "25",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function countPrimes(n) {
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
  console.log(countPrimes(n));
  rl.close();
});`,
      cpp: `#include<iostream>
using namespace std;

int countPrimes(int n) {
    // Write your code here
    
}

int main() {
    int n;
    cin >> n;
    cout << countPrimes(n) << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int countPrimes(int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(countPrimes(n));
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
    title: "Power of Two",
    slug: "power-of-two",
    difficulty: "Easy",
    category: "Math",
    description: `Given an integer n, return true if it is a power of two. Otherwise, return false.

An integer n is a power of two, if there exists an integer x such that n == 2^x.`,
    examples: [
      {
        input: "n = 1",
        output: "true",
        explanation: "2^0 = 1",
      },
      {
        input: "n = 16",
        output: "true",
        explanation: "2^4 = 16",
      },
      {
        input: "n = 3",
        output: "false",
      },
    ],
    constraints: ["-2^31 <= n <= 2^31 - 1"],
    tags: ["Math", "Bit Manipulation"],
    testCases: [
      {
        input: "1",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "16",
        expectedOutput: "true",
        isHidden: false,
      },
      {
        input: "3",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "0",
        expectedOutput: "false",
        isHidden: true,
      },
      {
        input: "8",
        expectedOutput: "true",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `function isPowerOfTwo(n) {
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
  console.log(isPowerOfTwo(n));
  rl.close();
});`,
      cpp: `#include<iostream>
using namespace std;

bool isPowerOfTwo(int n) {
    // Write your code here
    
}

int main() {
    int n;
    cin >> n;
    cout << (isPowerOfTwo(n) ? "true" : "false") << endl;
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean isPowerOfTwo(int n) {
        // Write your code here
        
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(isPowerOfTwo(n));
        scanner.close();
    }
}`,
    },
    stats: {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
    },
  },
];

async function seedProblems() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/prepmate");
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
