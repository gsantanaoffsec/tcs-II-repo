import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Pet } from "../data/models";
import { s } from "./ui";
import { colors } from "../theme";
export const photos: Record<string, number> = {
  dog: require("../../assets/dog.png"),
  puppy: require("../../assets/puppy.png"),
  cat: require("../../assets/cat.png"),
};
export function PetCard({ pet, city }: { pet: Pet; city: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessible
      accessibilityLabel={`Conhecer ${pet.name}. ${pet.species}, ${pet.age}, porte ${pet.size}. ${pet.breed}. ${city}.`}
      accessibilityHint="Abre os detalhes e o contato da organização."
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={() => router.push(`/pets/${pet.id}`)}
      style={({ pressed }) => [
        s.card,
        {
          borderWidth: 2,
          borderColor: focused ? colors.ink : colors.border,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
    >
      <Image
        source={photos[pet.photo] ?? photos.dog}
        accessible={false}
        aria-hidden
        style={{ width: "100%", height: 210 }}
        resizeMode="cover"
      />
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        aria-hidden
        style={{ padding: 18, gap: 8 }}
      >
        <View style={[s.row, { justifyContent: "space-between" }]}>
          <Text style={s.section}>{pet.name}</Text>
          <Text style={{ color: colors.primary }}>Conhecer ↗</Text>
        </View>
        <Text style={s.body}>
          {pet.age} · {pet.size} · {pet.species}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 13 }}>
          {city} · {pet.breed}
        </Text>
      </View>
    </Pressable>
  );
}
