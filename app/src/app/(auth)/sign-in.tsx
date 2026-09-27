import React, { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Screen, Heading, Field, Button, Notice, s } from "../../components/ui";
import { usePrototype } from "../../contexts/PrototypeContext";
import { loginSchema, errorsFrom } from "../../lib/validation";
export default function SignIn() {
  const { login } = usePrototype();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const submit = () => {
    setMessage("");
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(errorsFrom(result.error));
      return;
    }
    setErrors({});
    if (login(result.data.email, result.data.password))
      router.replace("/dashboard");
    else setMessage("Use uma conta de demonstração e a senha adota123.");
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
          onChangeText={setEmail}
          error={errors.email}
        />
        <Field
          label="Senha de demonstração"
          placeholder="Mínimo de 6 caracteres"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
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
