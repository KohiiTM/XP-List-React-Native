import { View, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ThemedView = ({ style, safe = false, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  if (!safe)
    return (
      <View style={[{ backgroundColor: theme.background }, style]} {...props} />
    );

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: theme.background,
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      edges={["top", "bottom", "left", "right"]}
      {...props}
    />
  );
};
export default ThemedView;
