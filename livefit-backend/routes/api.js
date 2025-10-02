// routes/api.js

const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const usda = require("../services/usda");
const ifct = require("../services/ifct");
const imageClassifier = require("../services/imageClassifier");
const { mapToIFCT, isIndianFood } = require("../services/indianAliases");

router.post("/identify", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const imageFile = req.file;
    let guessedName = name && name.trim().length ? name.trim() : null;

    console.log("🔍 API /identify called");
    console.log("📝 Text name provided:", guessedName ? "Yes" : "No");
    console.log("🖼️ Image file provided:", imageFile ? "Yes" : "No");

    // If no text name → classify image
    if (!guessedName && imageFile) {
      console.log("🤖 Attempting image classification...");
      const classification = await imageClassifier.classifyImage(imageFile.buffer);

      if (classification) {
        // Normalize classification output
        if (typeof classification === "string") {
          guessedName = classification;
        } else if (classification.label) {
          guessedName = classification.label;
        } else if (Array.isArray(classification) && classification[0]?.label) {
          guessedName = classification[0].label;
        }
      }

      if (guessedName) {
        guessedName = guessedName.toLowerCase().trim();
        console.log(`✅ Image classified as: ${guessedName}`);
      } else {
        console.log("❌ Image classification failed");
        return res.status(400).json({
          error: "Could not identify food from image. Please try typing the food name instead.",
        });
      }
    }

    if (!guessedName) {
      return res.status(400).json({
        error: "No food name provided and image classification failed.",
      });
    }

    // Map to IFCT alias
    const mappedName = mapToIFCT(guessedName);
    console.log(`🔍 Searching for food: "${mappedName}"`);

    // Always check IFCT first for Indian dishes
    if (isIndianFood(mappedName)) {
      console.log("🇮🇳 Searching IFCT database...");
      const ifctResult = ifct.findFood(mappedName);
      if (ifctResult) {
        console.log(`✅ Found in IFCT: ${ifctResult.name}`);
        return res.json({
          source: "IFCT",
          matchName: ifctResult.name,
          nutrients: ifctResult.nutrients,
        });
      }
    }

    // Otherwise → USDA fallback
    console.log("🇺🇸 Searching USDA database...");
    const usdaResult = await usda.searchFoodAndNutrients(mappedName);
    if (usdaResult) {
      console.log(`✅ Found in USDA: ${usdaResult.description}`);
      return res.json({
        source: "USDA",
        matchName: usdaResult.description,
        nutrients: usdaResult.nutrients,
      });
    }

    // Not found anywhere
    console.log(`❌ Food "${mappedName}" not found`);
    res.status(404).json({
      error: `Food "${mappedName}" not found in our databases.`,
    });
  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
});

module.exports = router;
