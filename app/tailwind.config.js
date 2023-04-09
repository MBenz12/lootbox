/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "akira": ["Akira Expanded", "sans-serif"],
        "space-mono": ["Space Mono", "monospace"],
      },
      dropShadow: () => ({
        "legendary-card": "0px 1px 6px rgba(128, 7, 185, 0.5)",
        "rare-card": "0px 1px 6px rgba(128, 7, 185, 0.5)",
        "uncommon-card": "0px 1px 6px rgba(128, 7, 185, 0.5)",
        "common-card": "0px 1px 6px rgba(128, 7, 185, 0.5)",
      }),
      colors: {
        "common-card": "#343751",
        "uncommon-card": "#4693DA",
        "rare-card": "#ED9A1F",
        "legendary-card": "#FF7CFA",
      },
      boxShadow: {
        "common-card": "0 0 20px 1px #343751",
        "uncommon-card": "0 0 20px 1px #4693DA",
        "rare-card": "0 0 20px 1px #ED9A1F",
        "legendary-card": "0 0 20px 1px #FF7CFA",
      },
      backgroundImage: () => ({
        "gradient-button":
            "linear-gradient(to right, #2A6ED4 0%, #3b96b2 55%, #2A6ED4 100%)",
        "gradient-box-fill":
            "linear-gradient(244.52deg, rgba(31, 31, 31, 0.5) 1.25%, rgba(56, 56, 56, 0.25) 100%)",
        "gradient-underline":
            "linear-gradient(94.41deg, #AF2A62 0.61%, #C0507F 58.53%, #CD7C9E 109.65%, #FB6FAA 109.65%)",
        "gradient-card-title":
            "linear-gradient(88.83deg, #A13AD1 -20.68%, #FF46B5 138.71%, #FF79C9 138.71%)",
        "gradient-white-divider":
            "linear-gradient(to right, rgba(107, 107, 107, 0.1) 0%, #C8C8C8 50%, rgba(107, 107, 107, 0.1) 100%)",
        "gradient-purple-divider":
            "linear-gradient(to right, rgba(149, 9, 215, 0.1) 0%, #9509D7 50%, rgba(149, 9, 215, 0.1) 100%)"
      }),
      backgroundPosition: () => ({
        "right-center": "right center",
      })
    },
  },
  plugins: [],
}