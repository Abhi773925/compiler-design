const axios = require("axios");

// New JDoodle credentials
const CLIENT_ID = "ed4b547ea5145d170359ece78b10924e";
const CLIENT_SECRET = "a1c0bd24a45cf3b05d624e2f91117bc1bebf0efd09928891b1becb19496f600";

async function checkCredits() {
  try {
    console.log("🔍 Checking JDoodle Credits...\n");
    console.log("Client ID:", CLIENT_ID);
    console.log("Client Secret:", CLIENT_SECRET.substring(0, 20) + "...\n");

    // Check credit spent
    const response = await axios.post(
      "https://api.jdoodle.com/v1/credit-spent",
      {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Credits API Response:");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("\nDaily Limit: 200 (free tier)");
    console.log("Used Today:", response.data.used);
    console.log("Remaining:", 200 - response.data.used);
  } catch (error) {
    console.error("\n❌ Error checking credits:");
    console.error("Status:", error.response?.status);
    console.error("Message:", error.response?.data || error.message);
  }
}

async function testExecution() {
  try {
    console.log("\n\n🧪 Testing Simple Code Execution...\n");

    const payload = {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      script: 'console.log("Hello from JDoodle!");',
      language: "nodejs",
      versionIndex: "4",
      stdin: "",
    };

    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Execution Response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("\n❌ Execution Error:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
  }
}

async function run() {
  await checkCredits();
  await testExecution();
}

run();
