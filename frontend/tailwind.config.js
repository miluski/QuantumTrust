/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontSize: {
        xxs: "0.5rem",
      },
      blur: {
        xxs: "1.5px",
      },
      width: {
        100: "27.25rem"
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".no-arrows": {
          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: "0",
          },
          '&[type="number"]': {
            "-moz-appearance": "textfield",
          },
        },
      });
    },
  ],
};
