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
