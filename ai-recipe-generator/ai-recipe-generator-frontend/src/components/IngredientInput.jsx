import React, { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";

const IngredientInput = ({ ingredients, setIngredients }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue("");
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  const popularIngredients = [
    "Chicken",
    "Beef",
    "Fish",
    "Rice",
    "Pasta",
    "Tomatoes",
    "Onions",
    "Garlic",
    "Potatoes",
    "Carrots",
    "Broccoli",
    "Cheese",
  ];

  const handlePopularIngredientClick = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  return (
    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/20 to-purple-50/20" />

      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Ingredients</h2>
            <p className="text-sm text-gray-600">
              Build your recipe foundation
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter an ingredient..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white/90 text-gray-800 placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
          />
          <button
            onClick={handleAddIngredient}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Ingredients */}
        {ingredients.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <h3 className="text-lg font-semibold text-gray-800">
                Your Selection
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="group relative px-3 py-2 bg-white/70 border border-gray-200 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-200"
                >
                  <span className="text-gray-800 font-medium text-sm">
                    {ingredient}
                  </span>
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular Ingredients */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            <h3 className="text-lg font-semibold text-gray-800">
              Popular Choices
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {popularIngredients.map((ingredient) => (
              <button
                key={ingredient}
                onClick={() => handlePopularIngredientClick(ingredient)}
                disabled={ingredients.includes(ingredient)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  ingredients.includes(ingredient)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white/70 border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600 hover:shadow-md hover:bg-white/90"
                }`}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientInput;
