const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const leetcodeBlind75 = require("../data/leetcodeBlind75");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/compiler-design", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedProblems = async () => {
  try {
    await connectDB();
    
    // Clear existing problems
    console.log("Clearing existing problems...");
    await Problem.deleteMany({});
    
    // Add LeetCode Blind 75 problems
    console.log("Adding LeetCode Blind 75 problems...");
    
    const problemsToInsert = leetcodeBlind75.map(problem => ({
      ...problem,
      stats: {
        totalSubmissions: Math.floor(Math.random() * 1000) + 100,
        acceptedSubmissions: 0,
        likes: Math.floor(Math.random() * 500) + 50,
        dislikes: Math.floor(Math.random() * 50) + 5,
      }
    }));
    
    // Set acceptance rates based on difficulty
    problemsToInsert.forEach(problem => {
      const total = problem.stats.totalSubmissions;
      let acceptanceRate;
      
      switch (problem.difficulty) {
        case "Easy":
          acceptanceRate = 0.6 + Math.random() * 0.2; // 60-80%
          break;
        case "Medium":
          acceptanceRate = 0.3 + Math.random() * 0.2; // 30-50%
          break;
        case "Hard":
          acceptanceRate = 0.1 + Math.random() * 0.2; // 10-30%
          break;
        default:
          acceptanceRate = 0.4;
      }
      
      problem.stats.acceptedSubmissions = Math.floor(total * acceptanceRate);
    });
    
    const insertedProblems = await Problem.insertMany(problemsToInsert);
    
    console.log(`Successfully inserted ${insertedProblems.length} problems`);
    
    // Log summary
    const summary = {
      Easy: insertedProblems.filter(p => p.difficulty === "Easy").length,
      Medium: insertedProblems.filter(p => p.difficulty === "Medium").length,
      Hard: insertedProblems.filter(p => p.difficulty === "Hard").length,
    };
    
    console.log("Problems by difficulty:", summary);
    console.log("Total problems:", insertedProblems.length);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding problems:", error);
    process.exit(1);
  }
};

// Run the seeding
seedProblems();