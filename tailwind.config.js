/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Custom palette extracted from existing CSS variables
        "portal-bg": "#f0f2f5",
        "portal-sidebar": "#152231",
        "portal-surface": "#1a2c40",
        "portal-card": "#ffffff",
        "portal-card-hover": "#f8fafc",
        "portal-border": "#e2e8f0",
        "portal-border-sub": "#e9ecef",
        "accent-gold": "#e8a020",
        "accent-gold-lt": "#f5bc50",
        "accent-blue": "#2563eb",
        "accent-blue-lt": "#3b82f6",
        "accent-glow-g": "rgba(232, 160, 32, 0.20)",
        "accent-glow-b": "rgba(37, 99, 235, 0.15)",
        "text-primary": "#111827",
        "text-secondary": "#4b5563",
        "text-muted": "#9ca3af",
        "gradient-sidebar": "linear-gradient(180deg, #152231 0%, #0f1c2b 100%)",
        "gradient-card": "#ffffff",
        "gradient-accent": "linear-gradient(135deg, #e8a020 0%, #f5bc50 100%)",
        "gradient-active": "rgba(232, 160, 32, 0.10)",
      },
    },
  },
  plugins: [],
};
