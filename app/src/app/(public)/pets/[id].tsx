import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Linking from "expo-linking";
import {
  Screen,
  Heading,
  Button,
  Notice,
  Empty,
  s,
} from "../../../components/ui";
import { photos } from "../../../components/PetCard";
import { usePrototype } from "../../../contexts/PrototypeContext";
import { whatsappUrl } from "../../../data/models";
export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, orgs } = usePrototype();
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");
  const pet = pets.find((p) => p.id === id);
  const org = orgs.find((o) => o.id === pet?.orgId);
  if (!pet || !org)
    return (
      <Screen back>
        <Empty
          title="Pet não encontrado"
          description="Este registro não está disponível nesta sessão. Volte à busca."
        />
      </Screen>
    );
  const open = async () => {
    try {
      await Linking.openURL(whatsappUrl(org, pet));
      setConfirm(false);
    } catch {
      setError("Não foi possível abrir o WhatsApp. Tente novamente.");
    }
  };
  return (
    <Screen back>
      <View style={[s.content, { maxWidth: 740 }]}>
        <Image
          source={photos[pet.photo] ?? photos.dog}
          accessibilityLabel={`Ilustração de ${pet.name}`}
          style={{
            height: 320,
            width: "100%",
            borderRadius: 24,
            marginTop: 16,
          }}
        />
        <Heading
          eyebrow={`${pet.species.toUpperCase()} · ${org.city.toUpperCase()}`}
          title={`Oi, eu sou ${pet.name}!`}
          subtitle={`${pet.age} · Porte ${pet.size} · ${pet.breed}`}
        />
        <Text style={s.body}>{pet.description}</Text>
        <View style={[s.card, { padding: 22, gap: 10, marginVertical: 24 }]}>
          <Text style={s.section}>Quem cuida de mim</Text>
          <Text style={s.label}>{org.name}</Text>
          <Text style={s.body}>
            {org.street}, {org.number} · {org.city}/{org.state}
          </Text>
          <Text style={s.body}>WhatsApp: +{org.phone}</Text>
        </View>
        <Notice>
          Os animais, endereços e telefones desta demonstração são fictícios. As
          imagens são ilustrações.
        </Notice>
        <Button
          title="Quero conhecer este pet · WhatsApp"
          onPress={() => setConfirm(true)}
        />
        {confirm && (
          <View style={[s.card, { padding: 18, marginTop: 12 }]}>
            <Text style={s.body}>
              O botão abaixo abre um serviço externo com um número ilustrativo.
              Para testar com uma organização real, cadastre seu próprio
              WhatsApp no protótipo.
            </Text>
            <Button title="Abrir conversa externa" onPress={open} />
            <Button
              secondary
              title="Cancelar"
              onPress={() => setConfirm(false)}
            />
          </View>
        )}
        {error && <Notice error>{error}</Notice>}
      </View>
    </Screen>
  );
}
