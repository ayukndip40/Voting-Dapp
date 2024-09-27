/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx}',  // Ensures Tailwind processes your JSX and JS files
  ],
  theme: {
    extend: {
      animation: {
        'gradient-xy': 'gradient-xy 3s ease infinite',  // Custom animation name and settings
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            backgroundPosition: 'left top',  // Starting and ending position
          },
          '50%': {
            backgroundPosition: 'right bottom',  // Mid-point position
          },
        },
      },
    },
  },
  plugins: [],
}
