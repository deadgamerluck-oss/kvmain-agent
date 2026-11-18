/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#4F46E5',
          foreground: '#FFFFFF',
          50: '#EEF2FF',
          100: '#E0E7FF',
          600: '#4F46E5',
          700: '#4338CA',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          foreground: '#FFFFFF',
          50: '#F5F3FF',
          100: '#EDE9FE',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        surface: '#FFFFFF',
        slateText: {
          main: '#111827',
          secondary: '#64748B',
        },
        success: {
          DEFAULT: '#16A34A',
          foreground: '#FFFFFF',
          50: '#F0FDF4',
          100: '#DCFCE7',
        },
        warning: {
          DEFAULT: '#F59E0B',
          foreground: '#FFFFFF',
          50: '#FFFBEB',
          100: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
          50: '#FEF2F2',
          100: '#FEE2E2',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        accent: {
          DEFAULT: '#EEF2FF',
          foreground: '#4F46E5',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#111827',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '0.3' },
          '100%': { transform: 'scale(0.95)', opacity: '0.8' },
        },
        wave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '32px' },
        }
      },
      animation: {
        'pulse-ring': 'pulseRing 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-1': 'wave 1s ease-in-out infinite',
        'wave-2': 'wave 1.2s ease-in-out 0.2s infinite',
        'wave-3': 'wave 0.9s ease-in-out 0.4s infinite',
        'wave-4': 'wave 1.1s ease-in-out 0.1s infinite',
        'wave-5': 'wave 1.3s ease-in-out 0.3s infinite',
      }
    },
  },
  plugins: [],
};
