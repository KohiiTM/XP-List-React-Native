import { Redirect } from "expo-router";
import { useUser } from "@hooks/useUser";

export default function Index() {
  const { user, authChecked } = useUser();

  if (!authChecked) {
    return null; // Or a loading screen
  }

  if (user) {
    return <Redirect href="/(dashboard)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}