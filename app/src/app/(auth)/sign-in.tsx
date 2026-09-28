import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Screen, Heading, Field, Button, Notice, s } from "../../components/ui";
import { usePrototype } from "../../contexts/PrototypeContext";
import { loginSchema } from "../../lib/validation";
import { useValidationFeedback } from "../../hooks/useValidationFeedback";
export default function SignIn() {
  const { login, setFeedback } = usePrototype();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { errors, setErrors, focusField, focusRequest, showErrors } =
    useValidationFeedback();
  const [message, setMessage] = useState("");
  const submit = () => {
    setMessage("");
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      showErrors(result.error);
      return;
    }
    setErrors({});
    if (login(result.data.email, result.data.password)) {
      setFeedback({
        path: "/dashboard",
        message:
          "Login de demonstração realizado. Você está no painel da sua organização.",
      });
      router.replace("/dashboard");
    } else setMessage("Use uma conta de demonstração e a senha adota123.");
  };
  return (
    <Screen back>
      <View style={s.form}>
        <Heading
          eyebrow="ESPAÇO DA ORGANIZAÇÃO"
          title="Vamos encontrar novos lares."
          subtitle="Entre para cuidar do catálogo de animais da sua organização."
        />
        <Notice>
          Login simulado: demo@adotaai.com · senha adota123. Não utilize
          credenciais reais neste protótipo.
        </Notice>
        <Field
          label="E-mail"
          placeholder="voce@organizacao.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setErrors((old) => {
              const next = { ...old };
              delete next.email;
              return next;
            });
            setMessage("");
          }}
          error={errors.email}
          focusRequest={focusRequest}
          focusOnError={focusField === "email"}
        />
        <Field
          label="Senha de demonstração"
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setErrors((old) => {
              const next = { ...old };
              delete next.password;
              return next;
            });
            setMessage("");
          }}
          error={errors.password}
          focusRequest={focusRequest}
          focusOnError={focusField === "password"}
          onSubmitEditing={submit}
        />
        {message && <Notice error>{message}</Notice>}
        <Button title="Entrar no painel →" onPress={submit} />
        <Button
          secondary
          title="Criar conta da organização"
          onPress={() => router.push("/sign-up")}
        />
      </View>
    </Screen>
  );
}
