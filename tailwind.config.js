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
                "litestar-gold": "#EDB641",
                "litestar-blue": "#202235",
                "litestar-yellow": "#FFD480",
                "litestar-gray": "#DCDFE4",
                "litestar-white": "#ffffff",
            }
        }
    }
}
