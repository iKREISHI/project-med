import { globalsStyle } from "../../../styles/globalsStyle";

export const inputFormSx = {
  input: {
    backgroundColor: 'transparent',
    padding: 0,
    
    '& .MuiOutlinedInput-root': {
      padding: 0,
      '& input': {
        padding: 1,
      },
      '& fieldset': {
        borderColor: globalsStyle.colors.grey,
      },
      '&:hover fieldset': {
        borderColor: globalsStyle.colors.grey,
      },
      '&.Mui-focused fieldset': {
        borderColor: globalsStyle.colors.blue,
      },
    },
    '& .MuiInputBase-input::placeholder': {
      color: globalsStyle.colors.greyDark,
      opacity: 1,
    },
    // для корректного отображения полей ввода в версии для слабовидящих
    "& .css-16wblaj-MuiInputBase-input-MuiOutlinedInput-input": {
      zIndex: 1,
      border: `1px solid ${globalsStyle.colors.grey}`,
      borderRadius: 1
    },
  },
};

