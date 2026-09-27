import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PrototypeProvider } from "../contexts/PrototypeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
export default function Layout() {
  const reduceMotion = useReducedMotion();
  return (
    <PrototypeProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: reduceMotion ? "none" : "default",
        }}
      />
    </PrototypeProvider>
  );
}
