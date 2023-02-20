import '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    cyan?: PaletteColorOptions;
    deepPurple?: PaletteColorOptions;
    green?: PaletteColorOptions;
    indigo?: PaletteColorOptions;
  }

  interface Palette {
    cyan: PaletteColor;
    deepPurple: PaletteColor;
    green: PaletteColor;
    indigo: PaletteColor;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    cyan: true;
    deepPurple: true;
    green: true;
    indigo: true;
  }
}
