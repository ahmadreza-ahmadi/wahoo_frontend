/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				vazirmatn: ['vazirmatn', 'sans-serif'],
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
};
