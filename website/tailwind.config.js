/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    900: '#0a0a0a', // Deep matte black
                    800: '#121212', // Slightly lighter
                    700: '#1a1a1a', // Component bg
                },
                primary: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    400: '#34d399', // Muted highlight
                    900: '#064e3b', // Deep green accent
                },
                text: {
                    main: '#f4f4f5',
                    muted: '#a1a1aa',
                }
            },
            fontFamily: {
                serif: ['Ledger', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'subtle-glow': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}
