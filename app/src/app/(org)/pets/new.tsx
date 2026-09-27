import React, { useState } from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  Heading,
  Field,
  Choices,
  Button,
  Notice,
  s,
} from "../../../components/ui";
import { usePrototype } from "../../../contexts/PrototypeContext";
import { petSchema, errorsFrom } from "../../../lib/validation";
import { ages, sizes } from "../../../data/models";
export default function NewPet() {
  const { session, addPet } = usePrototype();
  const [values, setValues] = useState({
    name: "",
    description: "",
    breed: "",
    species: "Cão",
    age: "Adulto",
    size: "Médio",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (key: keyof typeof values) => (value: string) =>
    setValues((old) => ({ ...old, [key]: value }));
  const submit = () => {
    const result = petSchema.safeParse(values);
    if (!result.success) {
      setErrors(errorsFrom(result.error));
      return;
    }
    addPet(result.data);
    router.replace("/dashboard");
  };
  return (
    <Screen back>
      <View style={s.form}>
        <Heading
          eyebrow="UM NOVO AMIGO"
          title="Conte a história deste pet."
          subtitle="Informações claras ajudam a encontrar uma família compatível."
        />
        <Notice>
          Organização: {session?.name}. Cidade: {session?.city}. O pet pertence
          à organização da sessão; a cidade vem do seu endereço.
        </Notice>
        <Field
          label="Nome do pet"
          placeholder="Como ele se chama?"
          value={values.name}
          onChangeText={set("name")}
          error={errors.name}
        />
        <Choices
          label="Espécie"
          options={["Cão", "Gato"]}
          value={values.species}
          onChange={set("species")}
        />
        <Field
          label="Raça"
          placeholder="Ex.: sem raça definida"
          value={values.breed}
          onChangeText={set("breed")}
          error={errors.breed}
        />
        <Choices
          label="Idade"
          options={ages}
          value={values.age}
          onChange={set("age")}
        />
        <Choices
          label="Porte"
          options={sizes}
          value={values.size}
          onChange={set("size")}
        />
        <Field
          multiline
          label="Descrição"
          placeholder="Personalidade, rotina e cuidados necessários"
          value={values.description}
          onChangeText={set("description")}
          error={errors.description}
        />
        <Text style={s.body}>
          Nesta etapa, uma ilustração é atribuída automaticamente pela espécie.
          Upload de fotos será implementado em uma etapa futura.
        </Text>
        <Button title="Salvar pet no catálogo →" onPress={submit} />
        <Button secondary title="Cancelar" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
