import React from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { usePrototype } from "../../contexts/PrototypeContext";
import {
  Screen,
  Heading,
  Button,
  Empty,
  Notice,
  useColumns,
  s,
} from "../../components/ui";
import { PetCard } from "../../components/PetCard";
export default function Dashboard() {
  const { session, pets, logout } = usePrototype();
  const columns = useColumns();
  if (!session) return null;
  const own = pets.filter((p) => p.orgId === session.id);
  return (
    <Screen>
      <View style={s.content}>
        <Heading
          eyebrow="PAINEL DA ORGANIZAÇÃO"
          title={`Olá, ${session.name}.`}
          subtitle={`Seu trabalho transforma vidas em ${session.city}. Vamos apresentar seus amigos?`}
        />
        <Notice>
          Sessão de demonstração · acesso simulado, sem JWT ou persistência.
        </Notice>
        <View style={[s.card, { padding: 22, marginVertical: 16, gap: 8 }]}>
          <Text style={s.section}>
            {own.length}{" "}
            {own.length === 1 ? "pet no catálogo" : "pets no catálogo"}
          </Text>
          <Text style={s.body}>Animais vinculados à sua organização</Text>
        </View>
        <Button
          title="+ Cadastrar novo pet"
          onPress={() => router.push("/pets/new")}
        />
        <Text style={[s.section, { marginVertical: 22 }]}>Meus pets</Text>
        {own.length ? (
          <View style={[s.row, { gap: 16 }]}>
            {own.map((pet) => (
              <View
                key={pet.id}
                style={{
                  width:
                    columns === 3 ? "31.5%" : columns === 2 ? "48%" : "100%",
                }}
              >
                <PetCard pet={pet} city={session.city} />
              </View>
            ))}
          </View>
        ) : (
          <Empty
            title="Seu primeiro amigo vem aí"
            description="Cadastre um pet para começar o catálogo da sua organização."
          />
        )}
        <Button
          secondary
          title="Sair da organização"
          onPress={() => {
            logout();
            router.replace("/");
          }}
        />
      </View>
    </Screen>
  );
}
