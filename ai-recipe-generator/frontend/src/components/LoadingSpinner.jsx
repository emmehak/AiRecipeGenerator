import React from "react";

const LoadingSpinner = ({ size = "large" }) => {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary-200"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
      </div>

      {size === "large" && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 font-medium">
            Cooking up something amazing...
          </p>
          <div className="flex justify-center mt-2">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
