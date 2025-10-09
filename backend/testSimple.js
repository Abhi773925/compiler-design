// Simple test for Piston API
const pistonAPI = require("./services/pistonAPI");

async function testPiston() {
  console.log("Testing Piston API directly...\n");

  try {
    // Test JavaScript code
    const jsCode = `console.log("Hello, World!");`;
    console.log("Testing JavaScript execution...");

    const result = await pistonAPI.executeCode(
      "javascript",
      "18.15.0",
      jsCode,
      ""
    );
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Full error:", error);
  }
}

testPiston();
