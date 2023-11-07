/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      margin: {
        "page-mx-lg": "60px",
        "section-my-lg": "32px",
      },
      blur: {
        8: "2px",
        16: "4px",
        "mature-content": "8px",
      },
      boxShadow: {
        "2xl": "0px 25px 50px -12px rgba(16, 24, 40, 0.25);",
        xl: [
          "0px 20px 25px -5px rgba(16, 24, 40, 0.10)",
          "0px 8px 10px -6px rgba(16, 24, 40, 0.10)",
        ],
        lg: [
          "0px 10px 15px -3px rgba(16, 24, 40, 0.10)",
          "0px 4px 6px -4px rgba(16, 24, 40, 0.10)",
        ],
        md: [
          "0px 4px 6px -1px rgba(16, 24, 40, 0.10)",
          "0px 2px 4px -2px rgba(16, 24, 40, 0.10)",
        ],
        sm: [
          "0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
          "0px 1px 2px -1px rgba(16, 24, 40, 0.10)",
        ],
        xs: "0px 1px 2px 0px rgba(16, 24, 40, 0.04)",
        hover: [
          "0px 4px 6px -1px rgba(16, 24, 40, 0.03)",
          "0px 2px 4px -2px rgba(16, 24, 40, 0.05)",
        ],
        soft: [
          "0px 4px 8px 0px rgba(113, 128, 150, 0.08)",
          "0px 0px 1px 0px rgba(113, 128, 150, 0.04)",
        ],
        "focused-primary": "0px 0px 0px 3px #CCCEF5",
        "focused-error": "0px 0px 0px 3px #FDDDDC",
        "focused-light-gray": "0px 0px 0px 3px #EFF1F3",
      },
      colors: {
        "light-neutral-50": "#FAFBFC",
        "light-neutral-100": "#F8F9FB",
        "light-neutral-200": "#F9F9F9",
        "light-neutral-300": "#F7F7F8",
        "light-neutral-400": "#F5F5F5",
        "light-neutral-500": "#EFEFF1",
        "light-neutral-600": "#EAEBF0",
        "light-neutral-700": "#E5E5E7",
        "light-neutral-800": "#C1C3C7",
        "light-neutral-900": "#A1A4AC",

        "dark-neutral-50": "#858C95",
        "dark-neutral-100": "#596574",
        "dark-neutral-200": "#525D6A",
        "dark-neutral-300": "#4C5560",
        "dark-neutral-400": "#454D56",
        "dark-neutral-500": "#3F454D",
        "dark-neutral-600": "#3F454D",
        "dark-neutral-700": "#323539",
        "dark-neutral-800": "#2B2D2F",
        "dark-neutral-900": "#252525",

        "primary-purple-50": "#EBECFB",
        "primary-purple-100": "#CCCEF5",
        "primary-purple-200": "#AAAEEE",
        "primary-purple-300": "#878EE7",
        "primary-purple-400": "#6D72E1",
        "primary-purple-500": "#5558DA",
        "primary-purple-600": "#4F4ECF",
        "primary-purple-700": "#4643C2",
        "primary-purple-800": "#3F38B6",
        "primary-purple-900": "#3222A3",

        "error-50": "#FFEFEE",
        "error-100": "#FDDDDC",
        "error-200": "#FEA19B",
        "error-300": "#FE827B",
        "error-400": "#FF645A",
        "error-500": "#FF453A",
        "error-600": "#E33B32",
        "error-700": "#C8322B",
        "error-800": "#901F1B",
        "error-900": "#751614",

        "warning-50": "#FFFAF2",
        "warning-100": "#FFE4C0",
        "warning-200": "#FFDDA1",
        "warning-300": "#FFD08A",
        "warning-400": "#FFC772",
        "warning-500": "#FFAE43",
        "warning-600": "#EEA23E",
        "warning-700": "#D78100",
        "warning-800": "#A15C00",
        "warning-900": "#6B3D00",

        "success-50": "#F3FFF6",
        "success-100": "#B1EEB9",
        "success-200": "#91E99E",
        "success-300": "#71E382",
        "success-400": "#52DD67",
        "success-500": "#32D74B",
        "success-600": "#2EBF43",
        "success-700": "#2AA63C",
        "success-800": "#268E34",
        "success-900": "#22762C",

        "blue-secondary-50": "#E6F2FA",
        "blue-secondary-100": "#C1DFF4",
        "blue-secondary-200": "#9DCBED",
        "blue-secondary-300": "#7CB7E4",
        "blue-secondary-400": "#66A8DF",
        "blue-secondary-500": "#559ADA",
        "blue-secondary-600": "#4D8CCD",
        "blue-secondary-700": "#437ABA",
        "blue-secondary-800": "#3C6AA8",
        "blue-secondary-900": "#2F4D88",

        "bright-pink-secondary-50": "#F9E4F8",
        "bright-pink-secondary-100": "#EFBBEF",
        "bright-pink-secondary-200": "#E58BE5",
        "bright-pink-secondary-300": "#D955DA",
        "bright-pink-secondary-400": "#CE15D2",
        "bright-pink-secondary-500": "#C400CA",
        "bright-pink-secondary-600": "#B400C5",
        "bright-pink-secondary-700": "#9E00C0",
        "bright-pink-secondary-800": "#8B00BB",
        "bright-pink-secondary-900": "#6500B0",

        "sandstorm-secondary-50": "#FEFDE8",
        "sandstorm-secondary-100": "#FDF9C6",
        "sandstorm-secondary-200": "#FBF5A0",
        "sandstorm-secondary-300": "#FAF17A",
        "sandstorm-secondary-400": "#F7EC5D",
        "sandstorm-secondary-500": "#F5E740",
        "sandstorm-secondary-600": "#F7D83E",
        "sandstorm-secondary-700": "#F5C135",
        "sandstorm-secondary-800": "#F2A92C",
        "sandstorm-secondary-900": "#EE821D",

        "orange-secondary-50": "#FADDCE",
        "orange-secondary-100": "#F7CBB6",
        "orange-secondary-200": "#F5BA9D",
        "orange-secondary-300": "#F2A98",
        "orange-secondary-400": "#EF976C",
        "orange-secondary-500": "#ED8653",
        "orange-secondary-600": "#EA743B",
        "orange-secondary-700": "#BB5D2F",
        "orange-secondary-800": "#8C4623",
        "orange-secondary-900": "#5E2F17",
      },
      fontSize: {
        "display-lg": [
          "64px",
          {
            lineHeight: "68px",
            letterSpacing: "-1.28px",
          },
        ],
        "display-md": [
          "52px",
          {
            lineHeight: "60px",
            letterSpacing: "-0.52px",
          },
        ],
        "headline-xl": [
          "40px",
          {
            lineHeight: "48px",
            letterSpacing: "-0.8px",
          },
        ],
        "headline-lg": [
          "36px",
          {
            lineHeight: "44px",
            letterSpacing: "-0.72px",
          },
        ],
        "headline-md": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.64px",
          },
        ],
        "headline-sm": [
          "28px",
          {
            lineHeight: "38px",
            letterSpacing: "-0.28px",
          },
        ],
        "headline-xs": [
          "22px",
          {
            lineHeight: "30px",
            letterSpacing: "-0.22px",
          },
        ],
        "headline-2xs": [
          "20px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.1px",
          },
        ],
        "mob-headline-xl": [
          "36px",
          {
            lineHeight: "44px",
            letterSpacing: "-0.72px",
          },
        ],
        "mob-headline-lg": [
          "32px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.64px",
          },
        ],
        "mob-headline-md": [
          "28px",
          {
            lineHeight: "36px",
            letterSpacing: "-0.56px",
          },
        ],
        "mob-headline-sm": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.48px",
          },
        ],
        "mob-headline-xs": [
          "20px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.4px",
          },
        ],
        "button-text-sm": [
          "14px",
          {
            lineHeight: "20px",
          },
        ],
        "button-text-md": [
          "15px",
          {
            lineHeight: "22px",
          },
        ],
        "button-text-lg": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.15px",
          },
        ],
        xl: [
          "18px",
          {
            lineHeight: "26px",
            letterSpacing: "-0.1px",
          },
        ],
        lg: [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.15px",
          },
        ],
        md: [
          "15px",
          {
            lineHeight: "22px",
            letterSpacing: "-0.1px",
          },
        ],
        sm: [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "-0.1px",
          },
        ],
        xs: [
          "13px",
          {
            lineHeight: "18px",
            letterSpacing: "-0.1px",
          },
        ],
        uppercase: [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.14px",
          },
        ],
      },
      screens: {
        xs: "360px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};
