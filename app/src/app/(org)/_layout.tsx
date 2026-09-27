import React from "react";
import { Redirect, Stack } from "expo-router";
import { usePrototype } from "../../contexts/PrototypeContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
export default function OrgLayout() {
  const reduceMotion = useReducedMotion();
  const { session } = usePrototype();
  if (!session) return <Redirect href="/sign-in" />;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: reduceMotion ? "none" : "default",
      }}
    />
  );
}
