import React from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { colors as c } from "../theme";
export function Screen({
  children,
  back = false,
}: React.PropsWithChildren<{ back?: boolean }>) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.page}
        >
          <View style={s.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ir para início"
              onPress={() => router.replace("/")}
            >
              <Text style={s.brand}>
                Adota<Text style={{ color: c.primary }}>Aí</Text> 🐾
              </Text>
            </Pressable>
            <Text style={s.badge}>PROTÓTIPO · ETAPA 02</Text>
          </View>
          {back && (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.canGoBack() ? router.back() : router.replace("/")
              }
              style={{ paddingVertical: 12 }}
            >
              <Text style={{ color: c.primary }}>← Voltar</Text>
            </Pressable>
          )}
          {children}
          <Text style={s.footer}>
            Feito para aproximar histórias e novos lares.{"\n"}Dados
            ilustrativos · alterações duram apenas nesta sessão.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function Heading({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <View style={{ gap: 10, marginVertical: 20 }}>
      {eyebrow && <Text style={s.eyebrow}>{eyebrow}</Text>}
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      {subtitle && <Text style={s.body}>{subtitle}</Text>}
    </View>
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: secondary ? c.pale : c.primary,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: secondary ? c.primary : c.white,
          fontWeight: "700",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  return (
    <View style={{ gap: 7, marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={c.muted}
        {...props}
        style={[
          s.input,
          props.multiline && { height: 120, textAlignVertical: "top" },
          error && { borderColor: c.error },
          props.style,
        ]}
      />
      {error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
export function Choices({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={{ gap: 8, marginBottom: 18 }}>
      <Text style={s.label}>{label}</Text>
      <View style={s.row}>
        {options.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: value === option }}
            onPress={() => onChange(option)}
            style={[
              s.chip,
              value === option && {
                backgroundColor: c.primary,
                borderColor: c.primary,
              },
            ]}
          >
            <Text style={{ color: value === option ? c.white : c.ink }}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
export function Notice({
  children,
  error = false,
}: React.PropsWithChildren<{ error?: boolean }>) {
  return (
    <View style={[s.notice, error && { backgroundColor: "#FCECEC" }]}>
      <Text
        accessibilityRole={error ? "alert" : undefined}
        style={[s.body, error && { color: c.error }]}
      >
        {children}
      </Text>
    </View>
  );
}
export function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={[s.card, { padding: 32, alignItems: "center", gap: 12 }]}>
      <Text style={{ fontSize: 36 }}>🐾</Text>
      <Text style={s.section}>{title}</Text>
      <Text style={[s.body, { textAlign: "center" }]}>{description}</Text>
    </View>
  );
}
export function useColumns() {
  const { width } = useWindowDimensions();
  return width >= 850 ? 3 : width >= 560 ? 2 : 1;
}
export const s = StyleSheet.create({
  page: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 26,
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: c.border,
  },
  brand: { fontSize: 25, fontWeight: "800", color: c.ink },
  badge: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: c.muted,
  },
  title: { fontSize: 36, lineHeight: 43, fontWeight: "800", color: c.ink },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "700",
    color: c.primary,
  },
  body: { fontSize: 16, lineHeight: 25, color: c.muted },
  section: { fontSize: 22, fontWeight: "700", color: c.ink },
  label: { fontSize: 14, fontWeight: "600", color: c.ink },
  input: {
    minHeight: 50,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.white,
    fontSize: 16,
    color: c.ink,
  },
  button: {
    minHeight: 52,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: 11,
    backgroundColor: c.white,
  },
  card: {
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 20,
    overflow: "hidden",
  },
  notice: {
    backgroundColor: c.pale,
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
  },
  error: { fontSize: 13, color: c.error },
  footer: {
    color: c.muted,
    fontSize: 12,
    lineHeight: 20,
    marginTop: 36,
    textAlign: "center",
  },
  content: { width: "100%", maxWidth: 1080, alignSelf: "center" },
  form: { width: "100%", maxWidth: 560, alignSelf: "center", gap: 4 },
});
