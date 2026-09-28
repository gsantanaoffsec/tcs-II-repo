import React from "react";
import { router } from "expo-router";
import { Screen, Empty, Button } from "../components/ui";
export default function NotFound() {
  return (
    <Screen>
      <Empty
        focus
        title="Página não encontrada"
        description="Volte ao início para continuar a navegação."
      />
      <Button title="Voltar ao início" onPress={() => router.replace("/")} />
    </Screen>
  );
}
