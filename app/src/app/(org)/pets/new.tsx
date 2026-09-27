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
import { petSchema } from "../../../lib/validation";
import { ages, sizes } from "../../../data/models";
import { useValidationFeedback } from "../../../hooks/useValidationFeedback";
export default function NewPet() {
  const { session, addPet, setFeedback } = usePrototype();
  const [values, setValues] = useState({
    name: "",
    description: "",
    breed: "",
    species: "Cão",
    age: "Adulto",
    size: "Médio",
  });
  const [saved, setSaved] = useState(false);
  const { errors, setErrors, focusField, focusRequest, showErrors } =
    useValidationFeedback();
  const set = (key: keyof typeof values) => (value: string) => {
    setValues((old) => ({ ...old, [key]: value }));
    setErrors((old) => {
      const next = { ...old };
      delete next[key];
      return next;
    });
  };
  const submit = () => {
    if (saved) return;
    const result = petSchema.safeParse(values);
    if (!result.success) {
      showErrors(result.error);
      return;
    }
    addPet(result.data);
    setSaved(true);
    setFeedback({
      path: "/dashboard",
      message: `Pet ${result.data.name} salvo no catálogo desta sessão.`,
    });
  };
  React.useEffect(() => {
    if (saved) router.dismissTo("/dashboard");
  }, [saved]);
  const dirty = !!(
    values.name.trim() ||
    values.breed.trim() ||
    values.description.trim() ||
    values.species !== "Cão" ||
    values.age !== "Adulto" ||
    values.size !== "Médio"
  );
  return (
    <Screen back confirmLeave={dirty && !saved}>
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
          focusRequest={focusRequest}
          focusOnError={focusField === "name"}
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
          focusRequest={focusRequest}
          focusOnError={focusField === "breed"}
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
          focusRequest={focusRequest}
          focusOnError={focusField === "description"}
        />
        <Text style={s.body}>
          Nesta etapa, uma ilustração é atribuída automaticamente pela espécie.
          Upload de fotos será implementado em uma etapa futura.
        </Text>
        <Button
          title="Salvar pet no catálogo →"
          disabled={saved}
          onPress={submit}
        />
      </View>
    </Screen>
  );
}
