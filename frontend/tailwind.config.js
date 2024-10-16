/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Enable class-based dark mode
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                backgroundColor: {
                    light: '#F5F5F5',
                    dark: '#212121',
                },
                headlineColor: {
                    dark: '#FFFFFF',
                    light: '#212121',
                },
                textColor: {
                    light: '#757575',
                    dark: '#BDBDBD',
                },
                cardBackgroundColor: {
                    light: '#FFFFFF',
                    dark: '#1F2937',
                },
                suggestionColor: {
                    light: '#616161',
                    dark: '#E0E0E0',
                },
                textInputBackgroundColor: {
                    light: '#F9FAFB',
                    dark: '#374151',
                },
                textInputBorderColor: {
                    light: '#D1D5DA',
                    dark: '#4B5563',
                },
                textInputRingColor: {
                    light: '#3F51B5',
                    dark: '#7986CB',
                },
                buttonColor: {
                    light: '#3949AB',
                    dark: '#3F51B5',
                },
                buttonHoverColor: {
                    light: '#303F9F',
                    dark: '#5C6BC0',
                },
                blueBackgroundColor: {
                    light: '#6495ED',
                    dark: '#4173D4',
                },
                greenBackgroundColor: {
                    light: '#4CAF50',
                    dark: '#34A05C',
                },
                pinkBackgroundColor: {
                    light: '#F06292',
                    dark: '#B02B64',
                },
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
                libre_baskerville: ['Libre Baskerville', 'serif'],
            },
        },
    },
    plugins: [],
};
