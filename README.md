# AiRecipeGenerator

The **AI Recipe Generator** is a backend service built with Node.js and Express that uses state-of-the-art AI models to generate detailed cooking recipes based on user-provided ingredients and preferences.

## 🚀 Features

- Generate complete recipes using **Groq**, **Cohere**, or **Hugging Face** AI APIs
- Supports dietary restrictions, meal types, and cuisine preferences
- Automatically extracts recipe name, ingredients, instructions, and nutrition info
- Returns structured JSON format suitable for frontend integration
- Uses fallback API strategy for reliability

## 📦 Requirements

- Node.js (v14 or higher)
- npm or yarn
- Valid API keys for:
  - [Groq](https://console.groq.com/)
  - [Cohere](https://dashboard.cohere.com/)
  - [Hugging Face](https://huggingface.co/settings/tokens)

## 🛠️ Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-recipe-generator.git
   cd ai-recipe-generator
