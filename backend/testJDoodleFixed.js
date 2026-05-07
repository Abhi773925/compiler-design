const axios = require("axios");

// Corrected JDoodle credentials
const JDOODLE_CLIENT_ID = "ed4b547ea5145d170359ece78b10924e";
const JDOODLE_CLIENT_SECRET =
  "a1c0bd24a45cf3b05d624e2f91117bc1bebf0efd09928891b1becb19496f600";

async function testJDoodle() {
  try {
    const code = `console.log("Hello from JDoodle!");`;

    const payload = {
      clientId: JDOODLE_CLIENT_ID,
      clientSecret: JDOODLE_CLIENT_SECRET,
      script: code,
      language: "nodejs",
      versionIndex: "4",
      stdin: "",
    };

    console.log("Testing JDoodle API with corrected credentials...");
    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      payload,
    );

    console.log("\n✅ Success! JDoodle Response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("\n❌ Error:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
  }
}

testJDoodle();
