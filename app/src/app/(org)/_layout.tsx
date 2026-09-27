import React from "react";
import { Redirect, Stack } from "expo-router";
import { usePrototype } from "../../contexts/PrototypeContext";
export default function OrgLayout() {
  const { session } = usePrototype();
  if (!session) return <Redirect href="/sign-in" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
