import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Screen, Heading, Field, Button, Notice, s } from "../../components/ui";
import { usePrototype } from "../../contexts/PrototypeContext";
import { orgSchema } from "../../lib/validation";
const fields = [
  ["name", "Nome da organização"],
  ["email", "E-mail"],
  ["password", "Senha de demonstração"],
  ["phone", "WhatsApp com país e DDD"],
  ["cep", "CEP"],
  ["state", "Estado (UF)"],
  ["city", "Cidade"],
  ["street", "Rua"],
  ["number", "Número"],
] as const;
import { useValidationFeedback } from "../../hooks/useValidationFeedback";
export default function SignUp() {
  const { register } = usePrototype();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "adota123",
    phone: "",
    cep: "",
    state: "",
    city: "",
    street: "",
    number: "",
  });
  const { errors, setErrors, focusField, focusRequest, showErrors } =
    useValidationFeedback();
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const submit = () => {
    setMessage("");
    const result = orgSchema.safeParse(values);
    if (!result.success) {
      showErrors(result.error);
      return;
    }
    setErrors({});
    if (!register(result.data)) {
      setMessage("Já existe uma organização com esse e-mail nesta sessão.");
      return;
    }
    setDone(true);
  };
  return (
    <Screen
      back
      confirmLeave={
        !done &&
        (Object.entries(values).some(
          ([key, value]) => key !== "password" && !!value.trim(),
        ) ||
          values.password !== "adota123")
      }
    >
      <View style={s.form}>
        <Heading
          eyebrow="FAÇA PARTE"
          title="Mais visibilidade. Mais adoções."
          subtitle="Cadastre sua organização para apresentar seus animais a novas famílias."
        />
        {done ? (
          <>
            <Notice announce>
              Organização cadastrada nesta sessão. Entre com{" "}
              {values.email.trim().toLowerCase()} e a senha pública adota123. A
              senha digitada não foi armazenada.
            </Notice>
            <Button
              title="Ir para o login"
              onPress={() => router.dismissTo("/sign-in")}
            />
          </>
        ) : (
          <>
            <Notice>
              Cadastro simulado, sem servidor. Use dados ilustrativos. A senha
              digitada é apenas validada; todas as contas de teste usam
              adota123.
            </Notice>
            {fields.map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={values[key]}
                onChangeText={(value) => {
                  setValues((old) => ({
                    ...old,
                    [key]: key === "state" ? value.toUpperCase() : value,
                  }));
                  setErrors((old) => {
                    const next = { ...old };
                    delete next[key];
                    return next;
                  });
                  setMessage("");
                }}
                error={errors[key]}
                focusRequest={focusRequest}
                focusOnError={focusField === key}
                secureTextEntry={key === "password"}
                autoCapitalize={
                  key === "email" || key === "password"
                    ? "none"
                    : key === "state"
                      ? "characters"
                      : "words"
                }
                keyboardType={
                  key === "email"
                    ? "email-address"
                    : key === "phone"
                      ? "phone-pad"
                      : key === "cep"
                        ? "numeric"
                        : "default"
                }
                maxLength={key === "state" ? 2 : undefined}
                placeholder={
                  key === "phone"
                    ? "5511999999999"
                    : key === "state"
                      ? "SP"
                      : label
                }
              />
            ))}
            {message && <Notice error>{message}</Notice>}
            <Button title="Cadastrar organização →" onPress={submit} />
          </>
        )}
      </View>
    </Screen>
  );
}
