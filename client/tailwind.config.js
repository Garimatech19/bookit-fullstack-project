/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#F5C518',       
        'primary-dark': '#E6B816',  
        'dark': '#121212',          
        'medium': '#757575',        
        'light': '#BDBDBD',         
        'bg-light': '#F5F5F5',      
        'border-light': '#E0E0E0',  
        'success': '#27AE60',       
      },
  
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // For styling form inputs
  ],
}