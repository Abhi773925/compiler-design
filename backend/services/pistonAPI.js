const axios = require("axios");

class JDoodleAPI {
  constructor() {
    this.baseURL = "https://api.jdoodle.com/v1/execute";
    // JDoodle credentials (corrected)
    this.clientId = "ed4b547ea5145d170359ece78b10924e";
    this.clientSecret = "a1c0bd24a45cf3b05d624e2f91117bc1bebf0efd09928891b1becb19496f600";
  }

  async getLanguages() {
    // JDoodle supported languages
    return [
      { language: "nodejs", version: "18" },
      { language: "java", version: "JDK 17.0.1" },
      { language: "cpp17", version: "GCC 11.1.0" },
      { language: "c", version: "GCC 11.1.0" },
      { language: "python3", version: "3.10.0" },
    ];
  }

  async executeCode(language, version, code, input = "") {
    try {
      const payload = {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        script: code,
        language: language,
        versionIndex: version,
        stdin: input,
      };

      console.log('JDoodle Request:', { language, versionIndex: version });

      const response = await axios.post(this.baseURL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log('JDoodle Response Status:', response.status);
      console.log('JDoodle Response Data:', response.data);

      return response.data;
    } catch (error) {
      console.error("Error executing code:", error.response?.data || error.message);
      if (error.response) {
        return {
          error: error.response.data?.error || error.response.statusText,
          statusCode: error.response.status,
          output: `API Error: ${error.response.status} - ${error.response.statusText}`,
        };
      }
      throw error;
    }
  }

  getFileName(language) {
    const extensions = {
      javascript: "main.js",
      java: "Main.java",
      cpp: "main.cpp",
      c: "main.c",
      python: "main.py",
    };
    return extensions[language] || "main.txt";
  }

  getLanguageConfig(language) {
    // Map common language names to JDoodle language identifiers
    const configs = {
      javascript: { language: "nodejs", version: "4" },
      java: { language: "java", version: "4" },
      cpp: { language: "cpp17", version: "0" },
      c: { language: "c", version: "5" },
      python: { language: "python3", version: "4" },
    };
    return configs[language] || configs["javascript"];
  }

  async runTestCase(language, code, input, expectedOutput) {
    try {
      const config = this.getLanguageConfig(language);
      
      // Wrap code for languages that need a main function
      let wrappedCode = code;
      if (language === 'cpp' || language === 'c') {
        // Check if code already has a main function
        if (!code.includes('int main')) {
          // For C++, wrap the function code with a simple main that calls it
          wrappedCode = `${code}

int main() {
    // This is a wrapper - actual test execution happens via stdin/stdout
    return 0;
}`;
        }
      }
      
      const result = await this.executeCode(
        config.language,
        config.version,
        wrappedCode,
        input
      );

      console.log('Test case result:', result);

      // Check for API errors
      if (result.error || (result.statusCode && result.statusCode !== 200)) {
        return {
          passed: false,
          input: input,
          expectedOutput: expectedOutput,
          actualOutput: result.error || result.output || "API Error",
          error: result.error || `API returned status ${result.statusCode}`,
        };
      }

      // JDoodle returns output directly
      const actualOutput = (result.output || "").trim();
      const passed = actualOutput === expectedOutput.trim();

      return {
        passed: passed,
        input: input,
        expectedOutput: expectedOutput,
        actualOutput: actualOutput,
        executionTime: result.cpuTime || "N/A",
        memory: result.memory || "N/A",
      };
    } catch (error) {
      console.error('Test case execution error:', error);
      return {
        passed: false,
        input: input,
        expectedOutput: expectedOutput,
        actualOutput: "Execution error",
        error: error.message,
      };
    }
  }

  async runAllTestCases(language, code, testCases) {
    const results = [];
    let passedTests = 0;

    for (const testCase of testCases) {
      const result = await this.runTestCase(
        language,
        code,
        testCase.input,
        testCase.expectedOutput
      );

      if (result.passed) {
        passedTests++;
      }

      results.push({
        ...result,
        isHidden: testCase.isHidden || false,
      });
    }

    return {
      success: passedTests === testCases.length,
      passedTests: passedTests,
      totalTests: testCases.length,
      results: results,
    };
  }
}

module.exports = new JDoodleAPI();
