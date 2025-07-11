import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function HomeProxy() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/"); // Redirect to the main home page
  }, []);
  return null;
}
