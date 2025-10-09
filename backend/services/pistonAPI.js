const axios = require("axios");

class PistonAPI {
  constructor() {
    this.baseURL = "https://emkc.org/api/v2/piston";
  }

  async getLanguages() {
    try {
      const response = await axios.get(`${this.baseURL}/runtimes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching languages:", error);
      throw error;
    }
  }

  async executeCode(language, version, code, input = "") {
    try {
      const payload = {
        language: language,
        version: version,
        files: [
          {
            name: this.getFileName(language),
            content: code,
          },
        ],
        stdin: input,
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      };

      const response = await axios.post(`${this.baseURL}/execute`, payload);
      return response.data;
    } catch (error) {
      console.error("Error executing code:", error);
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
    const configs = {
      javascript: { language: "javascript", version: "18.15.0" },
      java: { language: "java", version: "15.0.2" },
      cpp: { language: "cpp", version: "10.2.0" },
      c: { language: "c", version: "10.2.0" },
      python: { language: "python", version: "3.10.0" },
    };
    return configs[language] || configs["javascript"];
  }

  async runTestCase(language, code, input, expectedOutput) {
    try {
      const config = this.getLanguageConfig(language);
      const result = await this.executeCode(
        config.language,
        config.version,
        code,
        input
      );

      // Check if compilation failed
      if (result.compile && result.compile.code !== 0) {
        return {
          passed: false,
          input: input,
          expectedOutput: expectedOutput,
          actualOutput: result.compile.stderr || "Compilation error",
          error: result.compile.stderr || "Compilation failed",
        };
      }

      // Check if runtime failed
      if (result.run.code !== 0) {
        return {
          passed: false,
          input: input,
          expectedOutput: expectedOutput,
          actualOutput: result.run.stderr || "Runtime error",
          error: result.run.stderr || "Runtime error",
        };
      }

      // Get the output and clean it
      const actualOutput = result.run.stdout.trim();
      const passed = actualOutput === expectedOutput.trim();

      return {
        passed: passed,
        input: input,
        expectedOutput: expectedOutput,
        actualOutput: actualOutput,
        executionTime: result.run.signal || "N/A",
      };
    } catch (error) {
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

module.exports = new PistonAPI();
