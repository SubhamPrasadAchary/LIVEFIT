const axios = require('axios');
const https = require('https');

const USDA_KEY = process.env.USDA_API_KEY;

// Create an HTTPS agent that ignores SSL issues (workaround for your network error)
const agent = new https.Agent({ rejectUnauthorized: false });

async function searchFoodAndNutrients(query) {
  if (!USDA_KEY) {
    throw new Error('USDA API key not configured.');
  }

  try {
    const searchUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_KEY}`;
    const searchRes = await axios.post(
      searchUrl,
      {
        generalSearchInput: query,
        requireAllWords: false,
        pageSize: 5
      },
      { timeout: 10000, httpsAgent: agent }
    );

    const foods = searchRes.data.foods || [];
    if (!foods.length) return null;

    const top = foods[0];
    const nutrientMap = {};

    (top.foodNutrients || []).forEach(n => {
      const name = (n.nutrientName || '').toLowerCase();
      const amount = n.value ?? 0;
      if (name.includes('energy')) nutrientMap.calories = Math.round(amount);
      if (name.includes('protein')) nutrientMap.protein_g = amount;
      if (name.includes('carbohydrate')) nutrientMap.carbs_g = amount;
      if (name.includes('fat')) nutrientMap.fats_g = amount;
    });

    return {
      description: top.description,
      nutrients: {
        calories: nutrientMap.calories || 0,
        protein_g: nutrientMap.protein_g || 0,
        carbs_g: nutrientMap.carbs_g || 0,
        fats_g: nutrientMap.fats_g || 0
      },
      raw: top
    };
  } catch (err) {
    console.error('USDA search error', err?.response?.data || err.message);
    throw err;
  }
}

module.exports = { searchFoodAndNutrients };
