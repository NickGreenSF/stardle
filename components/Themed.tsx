import React, { useContext } from "react"
import { 
  View as DefaultView, 
  TextInput as DefaultTextInput,
  TouchableOpacity as DefaultTouchableOpacity,
  Text as DefaultText
 } from "react-native"
import Colors from "../constants/Colors"
import AppContext from "./AppContext"

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
  };

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const context = useContext(AppContext);
  const theme = context.scheme;
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type TouchableOpacityProps = ThemeProps &
  DefaultTouchableOpacity["props"];
export type TextProps = ThemeProps & DefaultText["props"]

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "background"
    );
  
    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const placeholderTextColor = useThemeColor(
      { light: lightColor, dark: darkColor },
      "placeholderTextColor"
    );
  
    return (
      <DefaultTextInput
        style={[{ color }, style]}
        placeholderTextColor={placeholderTextColor}
        {...otherProps}
      />
    );
  }

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "touchableColor"
  );

  return (
    <DefaultTouchableOpacity
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

