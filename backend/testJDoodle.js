const jdoodleAPI = require("./services/pistonAPI");

async function testJDoodle() {
  console.log("Testing JDoodle API...\n");

  // Test 1: Simple JavaScript
  console.log("Test 1: Simple JavaScript");
  const jsCode = `console.log("Hello, World!");`;
  const jsResult = await jdoodleAPI.runTestCase(
    "javascript",
    jsCode,
    "",
    "Hello, World!",
  );
  console.log("Result:", jsResult);
  console.log("\n---\n");

  // Test 2: Python with input
  console.log("Test 2: Python with input");
  const pyCode = `name = input()
print(f"Hello, {name}!")`;
  const pyResult = await jdoodleAPI.runTestCase(
    "python",
    pyCode,
    "John",
    "Hello, John!",
  );
  console.log("Result:", pyResult);
  console.log("\n---\n");

  // Test 3: Two Sum problem (JavaScript)
  console.log("Test 3: Two Sum Problem");
  const twoSumCode = `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

const nums = [2, 7, 11, 15];
const target = 9;
console.log(JSON.stringify(twoSum(nums, target)));`;

  const twoSumResult = await jdoodleAPI.runTestCase(
    "javascript",
    twoSumCode,
    "",
    "[0,1]",
  );
  console.log("Result:", twoSumResult);
  console.log("\n---\n");

  // Test 4: Raw execution to see actual response
  console.log("Test 4: Raw API Response");
  const config = jdoodleAPI.getLanguageConfig("javascript");
  const rawResult = await jdoodleAPI.executeCode(
    config.language,
    config.version,
    'console.log("Test");',
    "",
  );
  console.log("Raw response:", JSON.stringify(rawResult, null, 2));
}

testJDoodle().catch(console.error);
