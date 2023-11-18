/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
export default {
	content: [
	"./index.html",
	"./src/**/*.{js,ts,jsx,tsx}"
	],
	theme: {
		extend: {
			fontFamily: {
				'poppins': ['Poppins', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				...colors,
				primary: colors.violet,
				secondary: colors.rose
			}
		},
	},
	plugins: [],
}

