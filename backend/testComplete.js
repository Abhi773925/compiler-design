const pistonAPI = require("./services/pistonAPI");

async function testPracticeProblems() {
  console.log("\n🧪 Testing Practice Problems Execution...\n");

  const testCases = [
    {
      input: "5",
      expectedOutput: "120",
      isHidden: false,
    },
    {
      input: "3",
      expectedOutput: "6",
      isHidden: false,
    },
  ];

  const code = `
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const input = require('fs').readFileSync(0, 'utf-8').trim();
const n = parseInt(input);
console.log(factorial(n));
  `;

  try {
    const result = await pistonAPI.runAllTestCases(
      "javascript",
      code,
      testCases,
    );
    console.log("✅ Practice Problems Test Result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function testCollaboration() {
  console.log("\n🧪 Testing Collaboration Code Execution...\n");

  const code = `console.log("Hello from Collaboration!");`;

  try {
    const config = pistonAPI.getLanguageConfig("javascript");
    const result = await pistonAPI.executeCode(
      config.language,
      config.version,
      code,
      "",
    );

    console.log("✅ Collaboration Test Result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function testPythonExecution() {
  console.log("\n🧪 Testing Python Execution...\n");

  const pythonCode = `print("Hello from Python!")`;

  try {
    const config = pistonAPI.getLanguageConfig("python");
    const result = await pistonAPI.executeCode(
      config.language,
      config.version,
      pythonCode,
      "",
    );

    console.log("✅ Python Test Result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function testCppExecution() {
  console.log("\n🧪 Testing C++ Execution...\n");

  const cppCode = `
#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    return 0;
}
  `;

  try {
    const config = pistonAPI.getLanguageConfig("cpp");
    const result = await pistonAPI.executeCode(
      config.language,
      config.version,
      cppCode,
      "",
    );

    console.log("✅ C++ Test Result:");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

async function runAllTests() {
  console.log("=".repeat(60));
  console.log("🚀 Testing JDoodle Integration");
  console.log("=".repeat(60));

  await testCollaboration();
  await testPracticeProblems();
  await testPythonExecution();
  await testCppExecution();

  console.log("\n" + "=".repeat(60));
  console.log("✅ All Tests Completed!");
  console.log("=".repeat(60) + "\n");
}

runAllTests();
