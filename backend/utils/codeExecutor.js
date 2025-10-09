const ivm = require("isolated-vm");

// Execute JavaScript code safely with test cases
async function executeJavaScript(code, testCase) {
  try {
    // Create a new isolate
    const isolate = new ivm.Isolate({ memoryLimit: 128 });
    const context = await isolate.createContext();

    // Set up a timeout for execution (5 seconds)
    const timeout = 5000;

    // Parse the input based on test case format
    let params;
    const input = testCase.input.trim();

    // Handle different input formats
    if (input.includes("\n")) {
      // Multi-line input (e.g., "nums = [2,7,11,15]\ntarget = 9")
      const lines = input.split("\n");
      params = lines.map((line) => {
        // Extract value from format like "nums = [2,7,11,15]" or just "[2,7,11,15]"
        if (line.includes("=")) {
          return line.split("=")[1].trim();
        }
        return line.trim();
      });
    } else if (input.includes("=")) {
      // Single line with assignment (e.g., "nums = [2,7,11,15]")
      params = [input.split("=")[1].trim()];
    } else {
      // Direct value (e.g., "[2,7,11,15]")
      params = [input];
    }

    // Parse parameters
    const parsedParams = params.map((param) => {
      try {
        // Handle string parameters that might be quoted
        if (param.startsWith('"') && param.endsWith('"')) {
          return param.slice(1, -1); // Remove quotes
        }
        // Parse JSON-like arrays and objects
        return JSON.parse(param);
      } catch {
        // If JSON parsing fails, check if it's a number
        const num = parseFloat(param);
        if (!isNaN(num)) {
          return num;
        }
        // Return as string if all else fails
        return param;
      }
    });

    // Create the execution wrapper
    let executionCode;

    // Try to detect function name from the code
    const functionMatch = code.match(/function\s+(\w+)\s*\(/);
    const functionName = functionMatch ? functionMatch[1] : "solution";

    if (parsedParams.length === 1) {
      executionCode = `
        ${code}
        
        // Execute the function
        ${functionName}(${JSON.stringify(parsedParams[0])});
      `;
    } else {
      executionCode = `
        ${code}
        
        // Execute the function with multiple parameters
        ${functionName}(${parsedParams
        .map((p) => JSON.stringify(p))
        .join(", ")});
      `;
    }

    // Execute the code
    const result = await context.eval(executionCode, { timeout });

    // Parse expected output for comparison
    let expectedOutput;
    try {
      expectedOutput = JSON.parse(testCase.expectedOutput);
    } catch {
      // If not valid JSON, handle as string/boolean
      if (testCase.expectedOutput === "true") {
        expectedOutput = true;
      } else if (testCase.expectedOutput === "false") {
        expectedOutput = false;
      } else {
        expectedOutput = testCase.expectedOutput;
      }
    }

    // Compare results
    const actualOutput = result;
    let passed;

    if (Array.isArray(expectedOutput) && Array.isArray(actualOutput)) {
      // Compare arrays element by element
      passed =
        expectedOutput.length === actualOutput.length &&
        expectedOutput.every((val, index) => val === actualOutput[index]);
    } else {
      passed = JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);
    }

    return {
      passed,
      actualOutput: JSON.stringify(actualOutput),
      expectedOutput: testCase.expectedOutput,
      input: testCase.input,
      error: null,
    };
  } catch (error) {
    return {
      passed: false,
      actualOutput: null,
      expectedOutput: testCase.expectedOutput,
      input: testCase.input,
      error: error.message,
    };
  }
}

module.exports = {
  executeJavaScript,
};
