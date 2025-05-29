import React from "react";
import { Filter, X, Sparkles } from "lucide-react";

const FilterPanel = ({ filters, setFilters }) => {
  const handleFilterToggle = (filterType, value) => {
    const current = filters[filterType] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setFilters({ ...filters, [filterType]: updated });
  };

  const clearAllFilters = () => {
    setFilters({
      dietaryRestrictions: [],
      cuisine: [],
      mealType: [],
    });
  };

  const hasActiveFilters =
    filters.dietaryRestrictions?.length > 0 ||
    filters.cuisine?.length > 0 ||
    filters.mealType?.length > 0;

  const options = {
    dietaryRestrictions: [
      {
        value: "vegetarian",
        label: "Vegetarian",
        color: "from-emerald-500 to-green-600",
      },
      { value: "vegan", label: "Vegan", color: "from-green-500 to-teal-600" },
      {
        value: "gluten-free",
        label: "Gluten-Free",
        color: "from-amber-500 to-orange-600",
      },
      { value: "keto", label: "Keto", color: "from-purple-500 to-indigo-600" },
      { value: "paleo", label: "Paleo", color: "from-orange-500 to-red-600" },
      {
        value: "low-carb",
        label: "Low-Carb",
        color: "from-blue-500 to-cyan-600",
      },
    ],
    cuisine: [
      { value: "italian", label: "Italian", color: "from-red-500 to-rose-600" },
      {
        value: "chinese",
        label: "Chinese",
        color: "from-yellow-500 to-amber-600",
      },
      {
        value: "mexican",
        label: "Mexican",
        color: "from-orange-500 to-red-600",
      },
      {
        value: "indian",
        label: "Indian",
        color: "from-orange-500 to-pink-600",
      },
      {
        value: "french",
        label: "French",
        color: "from-blue-500 to-indigo-600",
      },
      {
        value: "japanese",
        label: "Japanese",
        color: "from-pink-500 to-rose-600",
      },
      {
        value: "mediterranean",
        label: "Mediterranean",
        color: "from-teal-500 to-cyan-600",
      },
      {
        value: "american",
        label: "American",
        color: "from-blue-500 to-red-600",
      },
    ],
    mealType: [
      {
        value: "breakfast",
        label: "Breakfast",
        color: "from-yellow-500 to-orange-600",
      },
      { value: "lunch", label: "Lunch", color: "from-green-500 to-teal-600" },
      {
        value: "dinner",
        label: "Dinner",
        color: "from-purple-500 to-pink-600",
      },
      {
        value: "snack",
        label: "Snack",
        color: "from-indigo-500 to-purple-600",
      },
      {
        value: "dessert",
        label: "Dessert",
        color: "from-pink-500 to-rose-600",
      },
    ],
  };

  const renderOptions = (type, title) => (
    <section className="space-y-3">
      <h3 className="text-md font-semibold text-gray-800">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options[type].map((opt) => {
          const selected = (filters[type] || []).includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => handleFilterToggle(type, opt.value)}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                selected
                  ? `bg-gradient-to-r ${opt.color} text-white shadow-lg scale-105`
                  : "bg-white/70 text-gray-700 border border-gray-200 hover:shadow-md hover:bg-white/90 hover:scale-105"
              }`}
            >
              {opt.label}
              {selected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                  <X className="w-3 h-3 text-gray-600" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
      <header className="flex items-center space-x-3 mb-6">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Filter className="w-5 h-5" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Recipe Preferences
          </h2>
          <p className="text-sm text-gray-600">
            Customize your culinary journey
          </p>
        </div>
      </header>

      <div className="space-y-6">
        {renderOptions("dietaryRestrictions", "Dietary Preferences")}
        {renderOptions("cuisine", "Cuisine Styles")}
        {renderOptions("mealType", "Meal Categories")}

        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200/50">
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-lg shadow-sm transition-all duration-200 hover:scale-105"
            >
              <X className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

        {hasActiveFilters && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/50 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              Active Preferences
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                ...filters.dietaryRestrictions,
                ...filters.cuisine,
                ...filters.mealType,
              ].map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200/50"
                >
                  {tag
                    .replace(/-/g, " ")
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
