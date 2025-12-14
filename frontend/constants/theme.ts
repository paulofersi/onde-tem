import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    backgroundSecondary: "#f9fafb",
    cardBackground: "#ffffff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#9ca3af",
    tabIconSelected: "#4CAF50",
    textSecondary: "#6b7280",
    textTertiary: "#9ca3af",
    border: "#e5e7eb",
    borderLight: "#f3f4f6",
    success: "#4CAF50",
    error: "#DC143C",
    disabled: "#9e9e9e",
    disabledBackground: "#f0f0f0",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    backgroundSecondary: "#1f2937",
    cardBackground: "#1f2937",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    textSecondary: "#9BA1A6",
    textTertiary: "#6b7280",
    border: "#374151",
    borderLight: "#4b5563",
    success: "#4CAF50",
    error: "#DC143C",
    disabled: "#6b7280",
    disabledBackground: "#374151",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
