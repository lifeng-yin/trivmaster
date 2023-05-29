/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      borderWidth: {
        '1': '1px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'base'
    })
  ],
}

