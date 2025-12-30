/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tokusatsu theme colors
        toku: {
          dark: '#0b0e14',
          panel: 'rgba(255, 255, 255, 0.06)',
          panel2: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.12)',
          text: 'rgba(255, 255, 255, 0.92)',
          muted: 'rgba(255, 255, 255, 0.68)',
          // Franchise colors
          rider: {
            primary: '#7b5cff',
            secondary: '#00c0ff',
            accent: '#ff6b9d',
          },
          sentai: {
            primary: '#ff4757',
            secondary: '#ffa502',
            accent: '#2ed573',
          },
          hero: {
            primary: '#5f27cd',
            secondary: '#00d2d3',
            accent: '#ff9ff3',
          },
          ultraman: {
            primary: '#00c0ff',
            secondary: '#7b5cff',
            accent: '#ffd700',
          },
          cyber: {
            primary: '#00d2d3',
            secondary: '#5f27cd',
            accent: '#ff6b9d',
          },
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '14px',
      },
      boxShadow: {
        'toku': '0 22px 60px rgba(0, 0, 0, 0.55)',
        'glow': '0 0 20px rgba(123, 92, 255, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(123, 92, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(123, 92, 255, 0.6)' },
        },
      },
      backgroundImage: {
        'gradient-toku': 'radial-gradient(1200px 600px at 20% -10%, rgba(123, 92, 255, 0.25), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(0, 192, 255, 0.18), transparent 55%)',
      },
    },
  },
  plugins: [],
}










