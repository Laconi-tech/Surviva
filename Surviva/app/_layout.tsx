import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      {/* <Stack.Screen name="(composants)" /> */}
      <Stack.Screen name="maps" />
      <Stack.Screen name="activity" />
      <Stack.Screen name="weather" />
      <Stack.Screen name="compass" />
      <Stack.Screen name="contact" />
      <Stack.Screen name="picture" />
    </Stack>
  );
}
