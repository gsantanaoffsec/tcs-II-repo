import React, { useState } from "react";
import { Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import {
  Screen,
  Heading,
  Choices,
  Field,
  Button,
  Empty,
  useColumns,
  s,
} from "../../../components/ui";
import { PetCard } from "../../../components/PetCard";
import { usePrototype } from "../../../contexts/PrototypeContext";
import { ages, sizes, filterPets } from "../../../data/models";
export default function Pets() {
  const { city, pets, orgs, filters, setFilters } = usePrototype();
  const columns = useColumns();
  const { age, size, breed } = filters;
  const setAge = (age: string) => setFilters((old) => ({ ...old, age }));
  const setSize = (size: string) => setFilters((old) => ({ ...old, size }));
  const setBreed = (breed: string) => setFilters((old) => ({ ...old, breed }));
  if (!city.trim()) return <Redirect href="/" />;
  const results = filterPets(pets, orgs, city, {
    age: age === "Todos" ? "" : age,
    size: size === "Todos" ? "" : size,
    breed,
  });
  return (
    <Screen back>
      <View style={s.content}>
        <Heading
          eyebrow="ENCONTRE UMA CONEXÃO"
          title={`Pets em ${city.trim()}`}
          subtitle="Cada amigo tem uma história. Qual vai fazer parte da sua?"
        />
        <Button
          secondary
          title="Trocar cidade"
          onPress={() => router.dismissTo("/")}
        />
        <View style={[s.card, { padding: 18, marginVertical: 20 }]}>
          <Choices
            label="Idade"
            options={["Todos", ...ages]}
            value={age}
            onChange={setAge}
          />
          <Choices
            label="Porte"
            options={["Todos", ...sizes]}
            value={size}
            onChange={setSize}
          />
          <Field
            label="Raça (opcional)"
            placeholder="Ex.: sem raça definida"
            value={breed}
            onChangeText={setBreed}
          />
          <Button
            secondary
            title="Limpar filtros"
            onPress={() => {
              setAge("Todos");
              setSize("Todos");
              setBreed("");
            }}
          />
        </View>
        <Text
          accessibilityLiveRegion="polite"
          role="status"
          style={[s.label, { marginBottom: 16 }]}
        >
          {results.length}{" "}
          {results.length === 1 ? "amigo disponível" : "amigos disponíveis"}
        </Text>
        {results.length ? (
          <View style={[s.row, { gap: 16 }]}>
            {results.map((pet) => (
              <View
                key={pet.id}
                style={{
                  width:
                    columns === 3 ? "31.5%" : columns === 2 ? "48%" : "100%",
                }}
              >
                <PetCard
                  pet={pet}
                  city={orgs.find((o) => o.id === pet.orgId)?.city ?? ""}
                />
              </View>
            ))}
          </View>
        ) : (
          <Empty
            title="Nenhum pet por aqui ainda"
            description="Tente outra cidade ou limpe os filtros para encontrar mais amigos."
          />
        )}
      </View>
    </Screen>
  );
}
