import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PrototypeProvider } from "../contexts/PrototypeContext";
export default function Layout() {
  return (
    <PrototypeProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </PrototypeProvider>
  );
}
