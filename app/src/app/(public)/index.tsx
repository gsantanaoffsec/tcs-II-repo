import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  Heading,
  Button,
  Field,
  Choices,
  s,
  Notice,
} from "../../components/ui";
import { photos } from "../../components/PetCard";
import { usePrototype } from "../../contexts/PrototypeContext";
export default function Home() {
  const { city, setCity, orgs } = usePrototype();
  const [error, setError] = useState("");
  return (
    <Screen>
      <View style={s.content}>
        <Heading
          eyebrow="UM NOVO COMEÇO"
          title="Seu próximo amigo está por aqui."
          subtitle="Encontre um pet na sua cidade e converse diretamente com a organização responsável."
        />
        <Image
          source={photos.dog}
          accessibilityLabel="Ilustração de um cão aguardando um novo lar"
          style={{
            width: "100%",
            height: 260,
            borderRadius: 24,
            marginBottom: 22,
          }}
          resizeMode="cover"
        />
        <View style={s.form}>
          <Field
            label="Em qual cidade você quer adotar?"
            placeholder="Digite a cidade"
            value={city}
            onChangeText={(value) => {
              setCity(value);
              setError("");
            }}
            error={error}
            onSubmitEditing={() => {
              if (city.trim()) router.push("/pets");
              else setError("Informe uma cidade para buscar.");
            }}
          />
          <Choices
            label="Cidades de demonstração"
            options={[...new Set(orgs.map((o) => o.city))]}
            value={city}
            onChange={(value) => {
              setCity(value);
              setError("");
            }}
          />
          <Button
            title="Encontrar meu novo amigo →"
            onPress={() => {
              if (!city.trim()) setError("Informe uma cidade para buscar.");
              else router.push("/pets");
            }}
          />
          <Notice>
            Adoção com responsabilidade. Conheça o animal e os cuidados
            necessários antes de decidir.
          </Notice>
          <Button
            secondary
            title="Sou uma organização"
            onPress={() => router.push("/sign-in")}
          />
        </View>
      </View>
    </Screen>
  );
}
