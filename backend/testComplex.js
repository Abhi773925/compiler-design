// Test complex Piston API scenarios
const pistonAPI = require("./services/pistonAPI");

async function testComplexPiston() {
  console.log("Testing complex Piston API scenarios...\n");

  // Test JavaScript with input
  const jsCode = `const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
const nums = JSON.parse(input[0]);
const target = parseInt(input[1]);

function twoSum(nums, target) {
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

console.log(twoSum(nums, target));`;

  const testInput = "[2,7,11,15]\n9";
  const expectedOutput = "true";

  try {
    console.log("Testing JavaScript Two Sum...");
    const result = await pistonAPI.runTestCase(
      "javascript",
      jsCode,
      testInput,
      expectedOutput
    );
    console.log("Result:", JSON.stringify(result, null, 2));

    // Test C++
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

    console.log("\nTesting C++ Power of Two...");
    const cppResult = await pistonAPI.runTestCase("cpp", cppCode, "16", "true");
    console.log("Result:", JSON.stringify(cppResult, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Full error:", error);
  }
}

testComplexPiston();
