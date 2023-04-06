/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        'page/_templates/**/*.{html,svg}',
        'page/_static/**/*.js',
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                "starlite-gold": "#EDB641"
            }
        }
    }
}
