/**
 * services/imageClassifier.js
 *
 * Hybrid food classification:
 *  - Local Python Hugging Face classifier (rajistics model)
 *  - Roboflow fallback if confidence is low
 */

const axios = require("axios");
const FormData = require("form-data");

async function classifyWithPython(buffer) {
  try {
    console.log("🚀 Sending image to local Python classifier...");

    const form = new FormData();
    form.append("file", buffer, { filename: "upload.jpg" });

    const response = await axios.post(
      "http://127.0.0.1:5001/classify",
      form,
      { headers: form.getHeaders(), timeout: 30000 }
    );

    return response.data; // { label, confidence }
  } catch (err) {
    console.error("❌ Local classifier error:", err.response?.data || err.message);
    return null;
  }
}

async function classifyWithRoboflow(buffer) {
  const apiKey = process.env.ROBOFLOW_API_KEY;
  const modelId = process.env.ROBOFLOW_MODEL;     // e.g. "indian-food-classifier"
  const modelVersion = process.env.ROBOFLOW_VERSION || "1";

  if (!apiKey || !modelId) {
    console.error("❌ Roboflow API key or model not configured");
    return null;
  }

  try {
    console.log("🌍 Falling back to Roboflow...");

    const base64Image = buffer.toString("base64");

    const response = await axios({
      method: "POST",
      url: `https://detect.roboflow.com/${modelId}/${modelVersion}?api_key=${apiKey}`,
      data: base64Image,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 30000
    });

    if (response.data && response.data.predictions && response.data.predictions.length > 0) {
      const best = response.data.predictions[0];
      return { label: best.class, confidence: best.confidence };
    }

    return null;
  } catch (err) {
    console.error("❌ Roboflow error:", err.message);
    return null;
  }
}

async function classifyImage(buffer) {
  console.log("🚀 Starting hybrid classification...");

  // 1. Try Python Hugging Face
  const pyResult = await classifyWithPython(buffer);

  if (pyResult && pyResult.confidence >= 0.6) {
    console.log("✅ Local model confident:", pyResult);
    return [pyResult];
  }

  // 2. Fallback to Roboflow
  console.log("⚠️ Low confidence or no result → using Roboflow");
  const rfResult = await classifyWithRoboflow(buffer);
  if (rfResult) return [rfResult];

  return null;
}

function cleanFoodLabel(label) {
  if (!label) return label;
  return label
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

module.exports = {
  classifyImage,
  cleanFoodLabel,
  cleanFoodName: cleanFoodLabel,
};
