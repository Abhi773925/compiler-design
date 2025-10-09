// Test script to verify Piston API integration
const axios = require("axios");

async function testCodeExecution() {
  console.log("Testing Piston API integration...\n");

  // Test 1: JavaScript Two Sum problem
  const jsCode = `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return true;
        }
        map.set(nums[i], i);
    }
    return false;
}

// Do not modify below this line
const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums = JSON.parse(input[0]);
const target = parseInt(input[1]);
console.log(twoSum(nums, target));`;

  // Test 2: C++ Power of Two problem
  const cppCode = `#include<iostream>
using namespace std;

bool isPowerOfTwo(int n) {
    if (n <= 0) return false;
    return (n & (n - 1)) == 0;
}

int main() {
    int n;
    cin >> n;
    cout << (isPowerOfTwo(n) ? "true" : "false") << endl;
    return 0;
}`;

  // Test 3: Java Palindrome problem
  const javaCode = `import java.util.*;

public class Solution {
    public static boolean isPalindrome(String s) {
        s = s.toLowerCase().replaceAll("[^a-z0-9]", "");
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String s = scanner.nextLine();
        System.out.println(isPalindrome(s));
        scanner.close();
    }
}`;

  const testCases = [
    {
      name: "JavaScript Two Sum",
      language: "javascript",
      code: jsCode,
      input: "[2,7,11,15]\n9",
      expected: "true",
    },
    {
      name: "C++ Power of Two",
      language: "cpp",
      code: cppCode,
      input: "16",
      expected: "true",
    },
    {
      name: "Java Palindrome",
      language: "java",
      code: javaCode,
      input: "A man, a plan, a canal: Panama",
      expected: "true",
    },
  ];

  for (const testCase of testCases) {
    console.log(`Testing ${testCase.name}...`);

    try {
      const response = await axios.post(
        "https://compiler-design.onrender.com/api/problems/test-execution",
        {
          language: testCase.language,
          code: testCase.code,
          input: testCase.input,
          expectedOutput: testCase.expected,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;
      console.log(`✅ Result: ${result.passed ? "PASSED" : "FAILED"}`);
      console.log(`   Input: ${testCase.input.replace("\n", ", ")}`);
      console.log(`   Expected: ${testCase.expected}`);
      console.log(`   Actual: ${result.actualOutput}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }

    console.log("---\n");
  }
}

// Run the test
testCodeExecution().catch(console.error);
