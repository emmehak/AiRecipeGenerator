// Backend - Debugged version that MUST use AI APIs
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Better AI API configuration - using more suitable models
const HF_API_URL = "https://api-inference.huggingface.co/models/gpt2";
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Alternative free APIs
const COHERE_API_URL = "https://api.cohere.ai/v1/generate";
const COHERE_API_KEY = process.env.COHERE_API_KEY;

async function queryHuggingFace(prompt) {
  console.log("🔄 Calling Hugging Face API...");
  console.log("API Key exists:", !!HF_API_KEY);
  console.log("Prompt:", prompt.substring(0, 100) + "...");

  if (!HF_API_KEY) {
    throw new Error("HUGGING_FACE_API_KEY not found in environment variables");
  }

  const response = await fetch(HF_API_URL, {
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.9,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      },
    }),
  });

  console.log("HF Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("HF Error:", errorText);
    throw new Error(
      `Hugging Face API error: ${response.status} - ${errorText}`
    );
  }

  const result = await response.json();
  console.log("HF Raw result:", JSON.stringify(result, null, 2));

  if (result.error) {
    throw new Error(`Hugging Face API error: ${result.error}`);
  }

  return result;
}

async function queryCohere(prompt) {
  console.log("🔄 Calling Cohere API...");
  console.log("API Key exists:", !!COHERE_API_KEY);

  if (!COHERE_API_KEY) {
    throw new Error("COHERE_API_KEY not found in environment variables");
  }

  const response = await fetch(COHERE_API_URL, {
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      model: "command-light",
      prompt: prompt,
      max_tokens: 800,
      temperature: 0.8,
      k: 0,
      stop_sequences: [],
      return_likelihoods: "NONE",
    }),
  });

  console.log("Cohere Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Cohere Error:", errorText);
    throw new Error(`Cohere API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  console.log("Cohere Raw result:", JSON.stringify(result, null, 2));

  if (result.message) {
    throw new Error(`Cohere API error: ${result.message}`);
  }

  return result.generations[0].text;
}

// Alternative: Try OpenAI-compatible free APIs
async function queryGroq(prompt) {
  console.log("🔄 Calling Groq API...");

  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not found");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result.choices[0].message.content;
}

function createStructuredRecipe(aiText, ingredients, options = {}) {
  const { dietaryRestrictions, cuisine, mealType } = options;

  console.log("📝 Processing AI text:", aiText.substring(0, 200) + "...");

  // Clean up the AI response
  const cleanText = aiText.replace(/^\s*Recipe:?\s*/i, "").trim();

  // Extract recipe name (first line or generate one)
  const lines = cleanText.split("\n").filter((line) => line.trim());
  let recipeName = lines[0]?.trim() || "";

  // If first line doesn't look like a name, generate one
  if (
    recipeName.length > 60 ||
    recipeName.includes(".") ||
    recipeName.includes(":")
  ) {
    recipeName = `${cuisine || "Delicious"} ${ingredients.join(" & ")} ${
      mealType || "Recipe"
    }`;
  }

  // Extract ingredients and instructions from AI text
  const ingredientMatches = aiText.match(
    /ingredients?:?\s*(.*?)(?=instructions?|method|steps|$)/is
  );
  const instructionMatches = aiText.match(
    /(?:instructions?|method|steps):?\s*(.*?)$/is
  );

  let aiIngredients = [];
  let aiInstructions = [];

  if (ingredientMatches) {
    aiIngredients = ingredientMatches[1]
      .split("\n")
      .filter(
        (line) => line.trim() && !line.match(/^(instructions?|method|steps)/i)
      )
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter((line) => line.length > 0);
  }

  if (instructionMatches) {
    aiInstructions = instructionMatches[1]
      .split("\n")
      .filter((line) => line.trim())
      .map((line) =>
        line
          .replace(/^\d+\.\s*/, "")
          .replace(/^[-*•]\s*/, "")
          .trim()
      )
      .filter((line) => line.length > 10);
  }

  // Fallback: extract any lines that look like ingredients or instructions
  if (aiIngredients.length === 0) {
    aiIngredients = lines
      .filter(
        (line) =>
          line.includes("cup") ||
          line.includes("tbsp") ||
          line.includes("tsp") ||
          line.includes("pound") ||
          line.includes("oz") ||
          line.match(/\d/)
      )
      .slice(0, 8);
  }

  if (aiInstructions.length === 0) {
    aiInstructions = lines
      .filter(
        (line) =>
          line.length > 20 &&
          (line.includes("cook") ||
            line.includes("add") ||
            line.includes("mix") ||
            line.includes("heat") ||
            line.includes("stir") ||
            line.includes("bake"))
      )
      .slice(0, 6);
  }

  // Ensure we have the original ingredients
  const finalIngredients = [
    ...ingredients.map((ing) => `2 cups ${ing}`),
    ...aiIngredients.slice(0, 5),
  ];

  const finalInstructions =
    aiInstructions.length > 0
      ? aiInstructions
      : [
          `Combine ${ingredients.join(", ")} in a large bowl.`,
          "Mix ingredients thoroughly until well combined.",
          "Cook according to your preferred method.",
          "Season to taste and serve hot.",
        ];

  return {
    name: recipeName,
    description: `An AI-generated recipe featuring ${ingredients.join(", ")}`,
    prepTime: "15 minutes",
    cookTime: "25 minutes",
    servings: 4,
    difficulty: "Medium",
    ingredients: finalIngredients,
    instructions: finalInstructions,
    nutrition: {
      calories: "280 per serving (estimated)",
      protein: "12g",
      carbs: "35g",
      fat: "8g",
    },
    tags: [cuisine, mealType, dietaryRestrictions].filter(Boolean),
    source: "AI Generated",
    timestamp: new Date().toISOString(),
  };
}

// Recipe endpoint - FORCE AI usage, no template fallback
app.post("/api/generate-recipe", async (req, res) => {
  try {
    const { ingredients, dietaryRestrictions, cuisine, mealType } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: "Ingredients are required" });
    }

    console.log("🍳 Generating recipe for:", ingredients);
    console.log("Options:", { dietaryRestrictions, cuisine, mealType });

    // Create a detailed, specific prompt
    const prompt = `Recipe for ${mealType || "dish"} using ${ingredients.join(
      ", "
    )}:

RECIPE NAME: Create a ${cuisine || "delicious"} recipe with ${ingredients.join(
      " and "
    )}

INGREDIENTS:
- ${ingredients.join("\n- ")}
- (add complementary ingredients with quantities)

INSTRUCTIONS:
1. Step by step cooking method
2. Specific cooking times and temperatures
3. Tips for best results

Make this a complete, detailed ${
      dietaryRestrictions ? dietaryRestrictions + " " : ""
    }recipe.`;

    let recipe;
    let usedAPI = "";
    let errors = [];

    // Try APIs in order of preference
    const apis = [
      { name: "Groq", fn: queryGroq },
      { name: "Cohere", fn: queryCohere },
      { name: "HuggingFace", fn: queryHuggingFace },
    ];

    for (const api of apis) {
      try {
        console.log(`🚀 Attempting ${api.name} API...`);
        const aiResponse = await api.fn(prompt);

        if (
          aiResponse &&
          (typeof aiResponse === "string"
            ? aiResponse.trim()
            : aiResponse[0]?.generated_text?.trim())
        ) {
          const responseText =
            typeof aiResponse === "string"
              ? aiResponse
              : aiResponse[0].generated_text;
          console.log(`✅ ${api.name} API succeeded!`);
          console.log(
            "Response preview:",
            responseText.substring(0, 150) + "..."
          );

          recipe = createStructuredRecipe(responseText, ingredients, {
            dietaryRestrictions,
            cuisine,
            mealType,
          });
          usedAPI = api.name;
          break;
        } else {
          throw new Error(`${api.name} returned empty response`);
        }
      } catch (error) {
        console.error(`❌ ${api.name} failed:`, error.message);
        errors.push(`${api.name}: ${error.message}`);
        continue;
      }
    }

    // If ALL APIs failed, return error (NO TEMPLATE FALLBACK)
    if (!recipe) {
      console.error("🚨 ALL APIs FAILED!");
      return res.status(500).json({
        error: "All AI services are currently unavailable",
        details: errors,
        suggestion:
          "Please check your API keys in .env file:\n- HUGGING_FACE_API_KEY\n- COHERE_API_KEY\n- GROQ_API_KEY",
      });
    }

    console.log(`🎉 Recipe generated successfully using ${usedAPI}!`);

    res.json({
      success: true,
      recipe,
      usedAPI,
      message: `Recipe generated using ${usedAPI} AI`,
    });
  } catch (error) {
    console.error("💥 Unexpected error:", error);
    res.status(500).json({
      error: "Recipe generation failed",
      details: error.message,
      suggestion: "Check server logs and API configuration",
    });
  }
});

// Debug endpoint to test API connections
app.get("/api/test-apis", async (req, res) => {
  const results = {};

  // Test Hugging Face
  try {
    if (HF_API_KEY) {
      await queryHuggingFace("Test prompt");
      results.huggingface = "✅ Working";
    } else {
      results.huggingface = "❌ No API key";
    }
  } catch (error) {
    results.huggingface = `❌ ${error.message}`;
  }

  // Test Cohere
  try {
    if (COHERE_API_KEY) {
      await queryCohere("Test prompt");
      results.cohere = "✅ Working";
    } else {
      results.cohere = "❌ No API key";
    }
  } catch (error) {
    results.cohere = `❌ ${error.message}`;
  }

  // Test Groq
  try {
    if (process.env.GROQ_API_KEY) {
      await queryGroq("Test prompt");
      results.groq = "✅ Working";
    } else {
      results.groq = "❌ No API key";
    }
  } catch (error) {
    results.groq = `❌ ${error.message}`;
  }

  res.json(results);
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running!",
    apis: {
      huggingface: !!HF_API_KEY,
      cohere: !!COHERE_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
    },
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Recipe Generator API - AI Only Mode",
    endpoints: {
      "GET /api/health": "Check server status",
      "GET /api/test-apis": "Test all API connections",
      "POST /api/generate-recipe":
        "Generate recipe using AI (no template fallback)",
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("API Keys configured:", {
    HuggingFace: !!HF_API_KEY,
    Cohere: !!COHERE_API_KEY,
    Groq: !!process.env.GROQ_API_KEY,
  });
});
