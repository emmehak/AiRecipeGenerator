import React, { useState } from "react";
import Header from "./components/Header";
import IngredientInput from "./components/IngredientInput";
import FilterPanel from "./components/FilterPanel";
import RecipeCard from "./components/RecipeCard";
import LoadingSpinner from "./components/LoadingSpinner";
import { recipeService } from "./services/recipeService.js";
import "./App.css";

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [filters, setFilters] = useState({
    dietaryRestrictions: "",
    cuisine: "",
    mealType: "",
  });
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient");
      return;
    }

    setLoading(true);
    setError("");
    setRecipe(null);

    try {
      const response = await recipeService.generateRecipe(ingredients, filters);
      setRecipe(response);
    } catch (err) {
      setError("Failed to generate recipe. Please try again.");
      console.error("Recipe generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setIngredients([]);
    setRecipe(null);
    setError("");
    setFilters({
      dietaryRestrictions: "",
      cuisine: "",
      mealType: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="animate-slide-up">
              <IngredientInput
                ingredients={ingredients}
                setIngredients={setIngredients}
              />
            </div>

            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <FilterPanel filters={filters} setFilters={setFilters} />
            </div>

            <div
              className="animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="space-y-4">
                <button
                  onClick={handleGenerateRecipe}
                  disabled={loading || ingredients.length === 0}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="small" />
                      <span className="ml-2">Generating Recipe...</span>
                    </div>
                  ) : (
                    "Generate Recipe"
                  )}
                </button>

                <button
                  onClick={handleClearAll}
                  className="btn-secondary w-full"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {error && (
              <div className="animate-bounce-in bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            )}

            {recipe && !loading && (
              <div className="animate-fade-in">
                <RecipeCard recipe={recipe} />
              </div>
            )}

            {!recipe && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Ready to Cook Something Amazing?
                </h3>
                <p className="text-gray-500 max-w-md">
                  Add your ingredients and let our AI chef create a personalized
                  recipe just for you!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
