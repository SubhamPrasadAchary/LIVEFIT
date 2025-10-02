// services/ifct.js
// Loads IFCT dataset and provides lookup with fuzzy matching

const FOODS = require("../data/ifct.json"); // <-- ensure your IFCT dataset JSON is here

function findFood(query) {
  if (!query) return null;
  const cleanQuery = query.toLowerCase();

  // Exact match
  let exact = FOODS.find(f => f.name.toLowerCase() === cleanQuery);
  if (exact) return exact;

  // Fuzzy: partial match
  let partial = FOODS.find(f => f.name.toLowerCase().includes(cleanQuery));
  if (partial) return partial;

  // Fuzzy: reverse contains (dataset name contains query OR query contains dataset name)
  let reverse = FOODS.find(f => cleanQuery.includes(f.name.toLowerCase()));
  if (reverse) return reverse;

  return null;
}

module.exports = { findFood };
