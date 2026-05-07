const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");
const auth = require("../middleware/auth");
const pistonAPI = require("../services/pistonAPI");
const { executeJavaScript } = require("../utils/codeExecutor");

// Get all problems for practice
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find(
      {},
      {
        title: 1,
        slug: 1,
        difficulty: 1,
        category: 1,
        tags: 1,
        stats: 1,
        _id: 1,
      },
    ).sort({ createdAt: -1 });

    res.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Execute code endpoint for collaboration (no auth required for collaboration rooms)
// IMPORTANT: This must come BEFORE /:slug routes to avoid route collision
router.post("/execute", async (req, res) => {
  try {
    const { language, code, input = "" } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Code is required" });
    }

    // Get language config and execute code
    const config = pistonAPI.getLanguageConfig(language);
    const result = await pistonAPI.executeCode(
      config.language,
      config.version,
      code,
      input,
    );

    console.log("Execute result:", result);

    // Check for API errors
    if (result.error || (result.statusCode && result.statusCode !== 200)) {
      return res.json({
        success: false,
        output: result.error || result.output || "Execution failed",
        error: result.error || `API Error: ${result.statusCode}`,
      });
    }

    // Return the output
    res.json({
      success: true,
      output: result.output || "",
      cpuTime: result.cpuTime,
      memory: result.memory,
    });
  } catch (error) {
    console.error("Code execution error:", error);
    res.status(500).json({
      success: false,
      message: "Code execution failed",
      error: error.message,
      output: `Error: ${error.message}`,
    });
  }
});

// Test endpoint for JDoodle API
router.post("/test-execution", async (req, res) => {
  try {
    const { language, code, input, expectedOutput } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Code is required" });
    }

    const testCase = { input, expectedOutput };
    const result = await pistonAPI.runTestCase(
      language,
      code,
      input,
      expectedOutput,
    );

    res.json(result);
  } catch (error) {
    console.error("Test execution error:", error);
    res.status(500).json({
      message: "Test execution failed",
      error: error.message,
    });
  }
});

// Get specific problem by slug
router.get("/:slug", async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Return problem without hidden test cases
    const problemData = {
      ...problem.toObject(),
      testCases: problem.testCases.filter((tc) => !tc.isHidden),
    };

    res.json(problemData);
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit solution (no auth required for practice)
router.post("/:slug/submit", async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findOne({ slug: req.params.slug });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Get all test cases (including hidden ones) for submission
    const allTestCases = problem.testCases;

    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Code is required" });
    }

    try {
      // Use different execution methods based on language
      let executionResult;

      if (language === "javascript") {
        // Use isolated-vm executor for JavaScript (handles function-only code)
        const results = [];
        let passedTests = 0;

        for (const testCase of allTestCases) {
          const result = await executeJavaScript(code, testCase);
          if (result.passed) {
            passedTests++;
          }
          results.push({
            passed: result.passed,
            input: result.input,
            expectedOutput: result.expectedOutput,
            actualOutput: result.actualOutput,
            error: result.error,
            isHidden: testCase.isHidden || false,
          });
        }

        executionResult = {
          success: passedTests === allTestCases.length,
          passedTests,
          totalTests: allTestCases.length,
          results,
        };
      } else {
        // Use JDoodle API for other languages (requires complete programs)
        executionResult = await pistonAPI.runAllTestCases(
          language,
          code,
          allTestCases,
        );
      }

      const success = executionResult.success;

      // Update problem stats
      problem.stats.totalSubmissions += 1;
      if (success) {
        problem.stats.acceptedSubmissions += 1;

        // Update user's solved problems and stats (if logged in)
        // Check for optional authentication
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (token) {
          try {
            const jwt = require("jsonwebtoken");
            let decoded;
            try {
              decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "fallback_secret",
                { issuer: "prepmate-api", audience: "prepmate-client" },
              );
            } catch (err) {
              // Fallback for older tokens
              decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "fallback_secret",
              );
            }

            const User = require("../models/User");
            const user = await User.findById(decoded.userId);

            if (user) {
              // Check if problem is already solved
              const alreadySolved = user.problemsSolved.some(
                (solved) =>
                  solved.problemId.toString() === problem._id.toString(),
              );

              if (!alreadySolved) {
                // Add to solved problems
                user.problemsSolved.push({
                  problemId: problem._id,
                  solution: code,
                  language: language,
                  solvedAt: new Date(),
                });

                // Update stats
                user.stats.totalProblems += 1;

                if (problem.difficulty === "Easy") {
                  user.stats.easyProblems += 1;
                } else if (problem.difficulty === "Medium") {
                  user.stats.mediumProblems += 1;
                } else if (problem.difficulty === "Hard") {
                  user.stats.hardProblems += 1;
                }

                await user.save();
              }
            }
          } catch (authError) {
            // Silently ignore auth errors - user stats won't be updated but code will still run
            console.log(
              "Optional auth failed, continuing without user tracking:",
              authError.message,
            );
          }
        }
      }
      await problem.save();

      // Hide actual output for hidden test cases in response
      const sanitizedResults = executionResult.results.map((result) => ({
        ...result,
        actualOutput: result.isHidden
          ? result.passed
            ? "✓"
            : "✗"
          : result.actualOutput,
        input: result.isHidden ? "Hidden" : result.input,
      }));

      res.json({
        success: success,
        passedTests: executionResult.passedTests,
        totalTests: executionResult.totalTests,
        results: sanitizedResults,
      });
    } catch (error) {
      console.error("Code execution error:", error);
      res.status(500).json({
        message: "Code execution failed",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error submitting solution:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Run code with sample test cases only (no auth required for practice)
router.post("/:slug/run", async (req, res) => {
  try {
    const { code, language } = req.body;
    const problem = await Problem.findOne({ slug: req.params.slug });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Get only visible test cases for run
    const sampleTestCases = problem.testCases.filter((tc) => !tc.isHidden);

    if (!code || !code.trim()) {
      return res.status(400).json({ message: "Code is required" });
    }

    try {
      // Use different execution methods based on language
      let executionResult;

      if (language === "javascript") {
        // Use isolated-vm executor for JavaScript (handles function-only code)
        const results = [];
        let passedTests = 0;

        for (const testCase of sampleTestCases) {
          const result = await executeJavaScript(code, testCase);
          if (result.passed) {
            passedTests++;
          }
          results.push({
            passed: result.passed,
            input: result.input,
            expectedOutput: result.expectedOutput,
            actualOutput: result.actualOutput,
            error: result.error,
            isHidden: testCase.isHidden || false,
          });
        }

        executionResult = {
          success: passedTests === sampleTestCases.length,
          passedTests,
          totalTests: sampleTestCases.length,
          results,
        };
      } else {
        // Use JDoodle API for other languages (requires complete programs)
        executionResult = await pistonAPI.runAllTestCases(
          language,
          code,
          sampleTestCases,
        );
      }

      res.json({
        success: executionResult.success,
        passedTests: executionResult.passedTests,
        totalTests: executionResult.totalTests,
        results: executionResult.results,
      });
    } catch (error) {
      console.error("Code execution error:", error);
      res.status(500).json({
        message: "Code execution failed",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error running code:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
