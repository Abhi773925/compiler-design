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
      }
    ).sort({ createdAt: -1 });

    res.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Server error" });
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

// Submit solution
router.post("/:slug/submit", auth, async (req, res) => {
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
      // Execute code using Piston API
      const executionResult = await pistonAPI.runAllTestCases(
        language,
        code,
        allTestCases
      );

      const success = executionResult.success;

      // Update problem stats
      problem.stats.totalSubmissions += 1;
      if (success) {
        problem.stats.acceptedSubmissions += 1;

        // Update user's solved problems and stats
        const User = require("../models/User");
        const user = await User.findById(req.user.userId);

        if (user) {
          // Check if problem is already solved
          const alreadySolved = user.problemsSolved.some(
            (solved) => solved.problemId.toString() === problem._id.toString()
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

// Run code with sample test cases only
router.post("/:slug/run", auth, async (req, res) => {
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
      // Execute code using Piston API for sample test cases
      const executionResult = await pistonAPI.runAllTestCases(
        language,
        code,
        sampleTestCases
      );

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

// Test endpoint for Piston API
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
      expectedOutput
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

module.exports = router;
