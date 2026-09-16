export const designTokens = {
  colors: {
    brand: {
      primary: '#1B3A5C',
      primaryHover: '#142E4A',
      primarySoft: '#EBF2FA',

      secondary: '#8B5E3C',
      secondaryHover: '#70482D',
      secondarySoft: '#F7EEE8',
    },

    blood: {
      default: '#C62828',
      hover: '#A61F1F',
      soft: '#FEF2F2',
    },

    text: {
      primary: '#0D1B2A',
      secondary: '#4B617A',
      muted: '#8FA3BD',
      inverse: '#FFFFFF',
    },

    surface: {
      page: '#F7F9FC',
      card: '#FFFFFF',
      subtle: '#F4F7FB',
      brand: '#EBF2FA',
      secondary: '#F7EEE8',
    },

    border: {
      default: '#DCE5EF',
      subtle: '#EDF2F7',
      strong: '#B9C8D8',
    },

    feedback: {
      success: '#16A34A',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#2563EB',
    },
  },

  fonts: {
    body: 'Inter',
    heading: 'Manrope',
    accent: 'Merriweather',
  },

  layout: {
    containers: {
      sm: '40rem',
      md: '48rem',
      lg: '64rem',
      xl: '80rem',
    },

    padding: {
      mobile: '1rem',
      tablet: '1.5rem',
      desktop: '2rem',
    },

    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },

  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.25rem',
    full: '9999px',
  },

  controls: {
    small: '2.25rem',
    medium: '2.75rem',
    large: '3.25rem',
  },
} as const;