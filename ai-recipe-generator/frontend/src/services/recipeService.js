import axios from "axios";

// Configure base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(
      "Making API request:",
      config.method?.toUpperCase(),
      config.url
    );
    console.log("Request data:", config.data);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log("API response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 500) {
      console.error("Server error details:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// Individual function exports
export const generateRecipe = async (ingredients, options = {}) => {
  try {
    console.log("Generating recipe with:", { ingredients, options });

    const requestData = {
      ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
      dietaryRestrictions: options.dietaryRestrictions || "",
      cuisine: options.cuisine || "",
      mealType: options.mealType || "",
    };

    const response = await api.post("/api/generate-recipe", requestData);

    if (response.data?.success && response.data?.recipe) {
      return response.data.recipe;
    } else {
      throw new Error("Invalid response format from server");
    }
  } catch (error) {
    console.error("Recipe generation failed:", error);

    if (error.response?.status === 400) {
      throw new Error(
        error.response.data?.error ||
          "Invalid request - please check your ingredients"
      );
    } else if (error.response?.status === 500) {
      throw new Error(
        "Server error - please check your OpenAI API key and try again"
      );
    } else if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Cannot connect to server - make sure the backend is running on port 5001"
      );
    } else {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate recipe"
      );
    }
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get("/api/health");
    return response.data;
  } catch (error) {
    console.error("Health check failed:", error);
    throw new Error("Backend server is not responding");
  }
};

// Object export for backward compatibility
export const recipeService = {
  generateRecipe,
  healthCheck,
};

export default recipeService;
