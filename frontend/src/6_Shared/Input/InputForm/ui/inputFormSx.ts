import { Theme } from '@mui/material/styles';
import { globalsStyle } from '../../../styles/globalsStyle';


export const inputFormSx = {
  input: {
    backgroundColor: 'transparent',
    padding: 0.5,
    pl: 1,
    border: (theme: Theme) => `1px solid ${theme.palette.grey[400]}`,
    borderRadius: 1,
    "&:hover:not(.Mui-disabled)": {
      borderColor:(theme: Theme) =>  theme.palette.grey[900],
    },
    "&.Mui-focused": {
      borderColor: globalsStyle.colors.blueDark,
    },
    transition: "border-color 0.3s ease", 
    
    // '& .MuiOutlinedInput-root': {
    //   padding: 0,
    //   '& input': {
    //     padding: 1,
    //   },
    //   '& fieldset': {
    //     borderColor: globalsStyle.colors.blueDark,
    //   },
    //   '&:hover fieldset': {
    //     borderColor: globalsStyle.colors.blueDark,
    //   },
    //   '&.Mui-focused fieldset': {
    //     borderColor: globalsStyle.colors.blue,
    //   },
    // },
    // '& .MuiInputBase-input::placeholder': {
    //   color: globalsStyle.colors.grey900,
    //   opacity: 1,
    // },
    // для корректного отображения полей ввода в версии для слабовидящих
    // "& .css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input": {
    //   zIndex: 1,
    //   border: `1px solid ${globalsStyle.colors.grey500}`,
    //   borderRadius: 1
    // },
  },
};

