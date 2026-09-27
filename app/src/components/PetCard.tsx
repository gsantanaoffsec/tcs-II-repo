import React from "react";
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
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver ${pet.name}, ${pet.age}, porte ${pet.size}`}
      onPress={() => router.push(`/pets/${pet.id}`)}
      style={({ pressed }) => [s.card, { opacity: pressed ? 0.8 : 1 }]}
    >
      <Image
        source={photos[pet.photo] ?? photos.dog}
        accessibilityLabel={`Ilustração de ${pet.species.toLowerCase()}`}
        style={{ width: "100%", height: 210 }}
        resizeMode="cover"
      />
      <View style={{ padding: 18, gap: 8 }}>
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
