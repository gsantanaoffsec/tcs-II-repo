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
import { ConfirmDialog } from "../../../components/ConfirmDialog";
export default function Details() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, orgs } = usePrototype();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const pet = pets.find((p) => p.id === id);
  const org = orgs.find((o) => o.id === pet?.orgId);
  if (!pet || !org)
    return (
      <Screen back>
        <Empty
          focus
          title="Pet não encontrado"
          description="Este registro não está disponível nesta sessão. Volte à busca."
        />
      </Screen>
    );
  const open = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await Linking.openURL(whatsappUrl(org, pet));
      setConfirm(false);
      setInfo(
        "Abertura do WhatsApp solicitada. A mensagem só será enviada se você confirmar no serviço externo.",
      );
    } catch {
      setError("Não foi possível abrir o WhatsApp. Tente novamente.");
    } finally {
      setBusy(false);
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
          accessibilityHint="Abre uma confirmação antes de sair para o serviço externo."
          onPress={() => setConfirm(true)}
        />
        <ConfirmDialog
          visible={confirm}
          title="Abrir o WhatsApp?"
          description="Você sairá do AdotaAí para um serviço externo. O número desta demonstração é ilustrativo. Nenhuma mensagem será enviada automaticamente."
          confirmLabel="Abrir conversa externa"
          busy={busy}
          onConfirm={open}
          onCancel={() => {
            setConfirm(false);
            setError("");
          }}
        />
        {info && <Notice announce>{info}</Notice>}
        {error && <Notice error>{error}</Notice>}
      </View>
    </Screen>
  );
}
