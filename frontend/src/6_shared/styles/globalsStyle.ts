export const globalsStyle = {
    colors: {
        grey100: '#f9f9f9', // Самый светлый
        grey200: '#f0f0f0',
        grey300: '#e0e0e0',
        grey400: '#d2d2d2',
        grey500: '#b0b0b0', // Средний
        grey600: '#595959', //909090
        grey700: '#595959',
        grey800: '#505050',
        grey900: '#303030', // Самый темный
        
        blueLight: '#65b4bb',
        blue: '#509095',
        blueDark: '#3c6c70',
        white: '#f8f8f8',
        black: '#202020',
    } as const,
    fontSizes: {
        h1: '1.5rem',
        h2: '1rem',
        h6: '1.1rem',
        body1: '0.9rem',
        body2: '0.8rem',
    },
    borderRadius: {
        lg: '20px',
        base: '10px'
    },
    boxShadow: {
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    boxShadowBlue: {
        boxShadow: 'rgba(101,180,187, 0.1)',
    },
    widthDrawer: '250px'
};