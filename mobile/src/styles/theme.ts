import { createTheme } from '@rneui/themed';
import colors from './colors';

export const theme = createTheme({
  lightColors: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    white: colors.white,
    black: colors.black,
    grey0: colors.gray50,
    grey1: colors.gray100,
    grey2: colors.gray200,
    grey3: colors.gray300,
    grey4: colors.gray400,
    grey5: colors.gray500,
    greyOutline: colors.border,
    searchBg: colors.gray100,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    disabled: colors.textDisabled,
    divider: colors.divider,
  },
  darkColors: {
    primary: colors.primaryLight,
    secondary: colors.secondaryLight,
    background: colors.gray900,
    white: colors.gray800,
    black: colors.white,
    grey0: colors.gray800,
    grey1: colors.gray700,
    grey2: colors.gray600,
    grey3: colors.gray500,
    grey4: colors.gray400,
    grey5: colors.gray300,
    greyOutline: colors.gray700,
    searchBg: colors.gray800,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    disabled: colors.gray600,
    divider: colors.gray700,
  },
  components: {
    Button: {
      raised: true,
      buttonStyle: {
        borderRadius: 8,
      },
      containerStyle: {
        marginVertical: 4,
      },
      titleStyle: {
        fontWeight: '600',
      },
    },
    Input: {
      containerStyle: {
        paddingHorizontal: 0,
      },
      inputContainerStyle: {
        borderBottomWidth: 1,
      },
      labelStyle: {
        fontWeight: '600',
        marginBottom: 8,
        color: colors.text,
      },
    },
    Card: {
      containerStyle: {
        borderRadius: 12,
        marginHorizontal: 0,
        marginVertical: 8,
        padding: 16,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    },
    Text: {
      style: {
        color: colors.text,
      },
      h1Style: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
      },
      h2Style: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
      },
      h3Style: {
        fontSize: 24,
        fontWeight: '600',
        color: colors.text,
      },
      h4Style: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
      },
    },
    Icon: {
      size: 24,
      color: colors.text,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
});

export default theme;
