import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                primary: { 50: '#f2f3f9', 100: '#e1e4f1', 200: '#c7cde4', 300: '#aab2d6', 400: '#828fc4', 500: '#5B6BB1', 600: '#4e5c98', 700: '#404b7c', 800: '#313a60', 900: '#232943' },
                secondary: { 50: '#ebf7f7', 100: '#d1eeed', 200: '#a8dfdd', 300: '#7acecb', 400: '#3db7b3', 500: '#00A09B', 600: '#008a85', 700: '#00706d', 800: '#005654', 900: '#003d3b' },
                accent: { 50: '#f2f5f8', 100: '#e1e8f0', 200: '#c6d3e3', 300: '#a8bcd4', 400: '#809dc0', 500: '#587EAC', 600: '#4c6c94', 700: '#3e5878', 800: '#30445d', 900: '#213041' },
                celeste: '#E1EEFF',
                ink: '#3E4043',
            },
            boxShadow: {
                card: '0 4px 24px rgba(91,107,177,0.12)',
            },
            borderRadius: {
                card: '16px',
                btn: '8px',
            },
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                heartRateIn: {
                    '0%': { width: '100%' },
                    '50%': { width: '0%' },
                    '100%': { width: '0%' },
                },
                heartRateOut: {
                    '0%': { right: '-120%' },
                    '30%': { right: '-120%' },
                    '100%': { right: '0' },
                },
            },
            animation: {
                'heartRateIn': 'heartRateIn 1s linear infinite',
                'heartRateOut': 'heartRateOut 1s linear infinite',
            },
        },
    },


    plugins: [forms],
};
