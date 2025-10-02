// services/indianAliases.js

// Maps classifier outputs → IFCT dataset standard names
const ALIASES = {
    // South Indian
    "idli": "idli",
    "plain idli": "idli",
    "rava idli": "idli",
    "dosa": "dosa",
    "masala dosa": "dosa",
    "rava dosa": "dosa",
    "uttapam": "uttapam",
    "vada": "vada",
    "medu vada": "vada",
  
    // North Indian & Snacks
    "samosa": "samosa, fried",
    "pakora": "pakora",
    "chole bhature": "chole bhature",
    "pav bhaji": "pav bhaji",
    "biryani": "biryani",
  
    // Paneer dishes
    "paneer butter masala": "paneer curry",
    "shahi paneer": "paneer curry",
    "kadai paneer": "paneer curry",
    "palak paneer": "palak paneer",
    "matar paneer": "paneer curry",
  
    // Sweets
    "gulab jamun": "gulab jamun (sweet)",
    "rasgulla": "rasgulla",
    "jalebi": "jalebi",
    "laddu": "laddu",
    "barfi": "barfi",
    "halwa": "halwa",
    "kheer": "kheer",
  
    // Street foods
    "pani puri": "pani puri",
    "golgappa": "pani puri",
    "sev puri": "sev puri",
    "dahi puri": "dahi puri",
    "poha": "poha",
  };
  
  function normalize(foodName) {
    return foodName
      .toLowerCase()
      .trim()
      .replace(/_/g, " "); // normalize underscores
  }
  
  function mapToIFCT(foodName) {
    if (!foodName || typeof foodName !== "string") return null;
    const clean = normalize(foodName);
    return ALIASES[clean] || clean;
  }
  
  function isIndianFood(foodName) {
    if (!foodName || typeof foodName !== "string") return false;
    const clean = normalize(foodName);
    return Boolean(ALIASES[clean]);
  }
  
  module.exports = { mapToIFCT, isIndianFood };
  