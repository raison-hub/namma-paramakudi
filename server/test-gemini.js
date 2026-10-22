require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeneration() {
  const key = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);

  const modelsToTry = ['gemini-3.8-flash', 'gemma-4-26b-a4b-it'];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello in Tamil and English in one short sentence.");
      const response = await result.response;
      console.log(`\n Success with ${modelName}! AI Output:`);
      console.log(response.text());
      return; // Stop on first working model
    } catch (err) {
      console.warn(`Failed with ${modelName}:`, err.message);
    }
  }
}

testGeneration();