import React, { useState } from "react";
import {
  Clock,
  Users,
  ChefHat,
  Star,
  Share2,
  Download,
  Copy,
} from "lucide-react";

const RecipeCard = ({ recipe }) => {
  const [copyStatus, setCopyStatus] = useState("");

  const handleCopyToClipboard = async () => {
    const content = `${recipe.name}\n\nPrep Time: ${
      recipe.prepTime
    }\nCook Time: ${recipe.cookTime}\nServings: ${
      recipe.servings
    }\nDifficulty: ${recipe.difficulty}\n\nIngredients:\n${recipe.ingredients
      .map((ing) => `• ${ing}`)
      .join("\n")}\n\nInstructions:\n${recipe.instructions
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n")}\n\nNutrition (per serving):\nCalories: ${
      recipe.nutrition.calories
    }\nProtein: ${recipe.nutrition.protein}\nCarbs: ${
      recipe.nutrition.carbs
    }\nFat: ${recipe.nutrition.fat}`;

    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      setCopyStatus("Failed to copy");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: `Check out this amazing recipe: ${recipe.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${recipe.name}\n\nIngredients:\n${recipe.ingredients.join(
          "\n"
        )}\n\nInstructions:\n${recipe.instructions.join("\n")}`
      );
      alert("Recipe copied to clipboard!");
    }
  };

  const handleDownload = () => {
    const content = `${recipe.name}\n\nPrep Time: ${
      recipe.prepTime
    }\nCook Time: ${recipe.cookTime}\nServings: ${
      recipe.servings
    }\nDifficulty: ${recipe.difficulty}\n\nIngredients:\n${recipe.ingredients
      .map((ing) => `• ${ing}`)
      .join("\n")}\n\nInstructions:\n${recipe.instructions
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n")}\n\nNutrition (per serving):\nCalories: ${
      recipe.nutrition.calories
    }\nProtein: ${recipe.nutrition.protein}\nCarbs: ${
      recipe.nutrition.carbs
    }\nFat: ${recipe.nutrition.fat}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recipe.name
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_recipe.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "medium":
        return "text-amber-700 bg-amber-100 border-amber-200";
      case "hard":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {recipe.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Prep: {recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Cook: {recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handleCopyToClipboard}
            className="relative p-2 rounded-xl text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-blue-500 transition-all duration-300"
            title="Copy recipe to clipboard"
          >
            <Copy className="w-5 h-5" />
            {copyStatus && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {copyStatus}
              </div>
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-green-500 transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-orange-500 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 text-amber-400 fill-current" />
          ))}
        </div>
        <span className="text-sm text-gray-500">AI Generated Recipe</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingredients */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-emerald-500" />
            Ingredients
          </h2>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50">
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 flex-shrink-0"></div>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nutrition */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Nutrition (per serving)
          </h2>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-4 border border-blue-200/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {recipe.nutrition.calories}
                </div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {recipe.nutrition.protein}
                </div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {recipe.nutrition.carbs}
                </div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {recipe.nutrition.fat}
                </div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Instructions</h2>
        <div className="space-y-3">
          {recipe.instructions.map((instruction, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-200/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                {instruction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/50 rounded-xl">
        <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
          💡 Pro Tips
        </h3>
        <p className="text-amber-700 text-sm">
          For best results, ensure all ingredients are at room temperature
          before cooking. Taste and adjust seasoning as needed throughout the
          cooking process.
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
