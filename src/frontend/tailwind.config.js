import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        cormorant: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))'
        },
        gold: {
          50:  'oklch(0.98 0.02 85)',
          100: 'oklch(0.95 0.05 85)',
          200: 'oklch(0.90 0.09 82)',
          300: 'oklch(0.84 0.13 80)',
          400: 'oklch(0.78 0.16 78)',
          500: 'oklch(0.72 0.18 76)',
          600: 'oklch(0.65 0.17 74)',
          700: 'oklch(0.55 0.14 72)',
          800: 'oklch(0.42 0.10 70)',
          900: 'oklch(0.30 0.07 68)',
        },
        obsidian: {
          DEFAULT: 'oklch(0.10 0.01 60)',
          50:  'oklch(0.97 0.005 85)',
          100: 'oklch(0.92 0.01 75)',
          200: 'oklch(0.80 0.01 70)',
          300: 'oklch(0.60 0.01 65)',
          400: 'oklch(0.40 0.01 62)',
          500: 'oklch(0.25 0.01 60)',
          600: 'oklch(0.18 0.01 60)',
          700: 'oklch(0.14 0.01 60)',
          800: 'oklch(0.10 0.01 60)',
          900: 'oklch(0.07 0.005 60)',
        },
        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))'
        },
        sentiment: {
          positive: 'oklch(var(--sentiment-positive))',
          neutral: 'oklch(var(--sentiment-neutral))',
          attention: 'oklch(var(--sentiment-attention))'
        },
        success: 'oklch(var(--sentiment-positive) / <alpha-value>)',
        warning: 'oklch(var(--sentiment-attention) / <alpha-value>)',
        info: 'oklch(var(--sentiment-neutral) / <alpha-value>)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
        gold: '0 4px 24px oklch(0.65 0.17 74 / 0.35)',
        'gold-lg': '0 8px 48px oklch(0.65 0.17 74 / 0.45)',
        'card': '0 20px 60px oklch(0.10 0.01 60 / 0.5)',
        breadcrumb: '0 2px 8px rgba(201,168,76,0.3)',
        "glass-frost": '0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        "tier-glow": '0 0 12px rgba(239,68,68,0.4)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 oklch(0.72 0.18 76 / 0.4)' },
          '50%': { boxShadow: '0 0 0 12px oklch(0.72 0.18 76 / 0)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'slideDown': {
          'from': { opacity: '0', transform: 'translateY(-12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' }
        },
        'modalSlideIn': {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' }
        },
        'breadcrumb-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'glass-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'tier-highlight': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0)' },
          '50%': { boxShadow: '0 0 8px 2px rgba(201,168,76,0.4)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'slideDown': 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'modalSlideIn': 'modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'breadcrumb-pulse': 'breadcrumb-pulse 2s ease-in-out infinite',
        'glass-shimmer': 'glass-shimmer 3s linear infinite',
        'tier-highlight': 'tier-highlight 1.5s ease-in-out infinite',
      }
    }
  },
  plugins: [typography, containerQueries, animate]
};
