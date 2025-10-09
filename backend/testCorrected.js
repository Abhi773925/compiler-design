// Test corrected JavaScript code
const pistonAPI = require("./services/pistonAPI");

async function testCorrectedJS() {
  console.log("Testing corrected JavaScript code...\n");

  const jsCode = `function isPowerOfTwo(n) {
    if (n <= 0) return false;
    return (n & (n - 1)) === 0;
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
});`;

  try {
    console.log("Testing JavaScript Power of Two...");
    const result = await pistonAPI.runTestCase(
      "javascript",
      jsCode,
      "16",
      "true"
    );
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testCorrectedJS();
