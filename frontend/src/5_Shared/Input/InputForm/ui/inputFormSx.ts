import { globalsStyle } from "../../../styles/globalsStyle";

export const inputFormSx = {
  input: {
    backgroundColor: 'transparent',
    borderRadius: 2,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: globalsStyle.colors.grey, 
      },
      '&:hover fieldset': {
        borderColor: globalsStyle.colors.grey,
      },
      '&.Mui-focused fieldset': {
        borderColor: globalsStyle.colors.blue, 
      }
      
    },
    '& .MuiInputBase-input::placeholder': {
      color: globalsStyle.colors.greyDark, 
      opacity: 1,
    },
  },
};