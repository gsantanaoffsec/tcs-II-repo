import React, { useState, useEffect, useRef, useId } from "react";
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
  AccessibilityInfo,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  router,
  usePathname,
  useNavigation,
  useFocusEffect,
} from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { colors as c } from "../theme";
import { interaction } from "../theme/interaction";
import { usePrototype } from "../contexts/PrototypeContext";
import { activeDestination, fallbackRoute } from "../lib/navigation";
import { useAccessibleFocus } from "../hooks/useAccessibleFocus";
import { ConfirmDialog } from "./ConfirmDialog";
export function Screen({
  children,
  back = false,
  confirmLeave = false,
}: React.PropsWithChildren<{ back?: boolean; confirmLeave?: boolean }>) {
  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(
    React.useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );
  const path = usePathname();
  const navigation = useNavigation();
  const { city, session, feedback, setFeedback } = usePrototype();
  const [pending, setPending] = useState<(() => void) | null>(null);
  const [allowLeave, setAllowLeave] = useState(false);
  usePreventRemove(confirmLeave && !allowLeave, ({ data }) =>
    setPending(() => () => navigation.dispatch(data.action)),
  );
  useEffect(() => {
    if (allowLeave && pending) {
      pending();
      setPending(null);
    }
  }, [allowLeave, pending]);
  // Covers refresh/tab closing on web as well as navigation inside the app.
  useEffect(() => {
    if (Platform.OS !== "web" || !confirmLeave || allowLeave) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [confirmLeave, allowLeave]);
  const leave = (action: () => void) => {
    if (confirmLeave) setPending(() => action);
    else action();
  };
  const destinations = [
    { key: "home", label: "Início", route: "/" as const },
    {
      key: "pets",
      label: "Encontrar pets",
      route: city.trim() ? ("/pets" as const) : ("/" as const),
    },
    {
      key: "org",
      label: session ? "Meu painel" : "Organização",
      route: session ? ("/dashboard" as const) : ("/sign-in" as const),
    },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.page}
        >
          <View style={s.header}>
            <Button
              title="AdotaAí 🐾"
              secondary
              accessibilityLabel="Ir para início"
              onPress={() => leave(() => router.dismissTo("/"))}
            />
            <Text style={s.badge}>PROTÓTIPO · ETAPA 03</Text>
          </View>
          {back && (
            <Button
              title="← Voltar"
              secondary
              accessibilityLabel="Voltar à tela anterior"
              onPress={() =>
                leave(() =>
                  router.canGoBack()
                    ? router.back()
                    : router.replace(fallbackRoute(path)),
                )
              }
            />
          )}
          {feedback?.path === path && (
            <View style={s.content}>
              <Notice announce>{feedback.message}</Notice>
              <Button
                secondary
                title="Fechar mensagem"
                onPress={() => setFeedback(null)}
              />
            </View>
          )}
          {children}
          <Text style={s.footer}>
            Feito para aproximar histórias e novos lares.{"\n"}Dados
            ilustrativos · alterações duram apenas nesta sessão.
          </Text>
        </ScrollView>
        <View
          role={Platform.OS === "web" ? "navigation" : undefined}
          accessibilityLabel="Navegação principal"
          style={{
            borderTopWidth: 1,
            borderColor: c.border,
            backgroundColor: c.white,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              width: "100%",
              maxWidth: 1080,
              alignSelf: "center",
            }}
          >
            {destinations.map((item) => (
              <NavItem
                key={item.key}
                label={item.label}
                selected={activeDestination(path) === item.key}
                onPress={() => {
                  if (
                    activeDestination(path) === item.key &&
                    path === item.route
                  )
                    return;
                  leave(() => router.dismissTo(item.route));
                }}
              />
            ))}
          </View>
        </View>
        <ConfirmDialog
          visible={!!pending}
          title="Descartar alterações?"
          description="Os dados deste formulário ainda não foram salvos. Você pode continuar preenchendo ou descartá-los para sair."
          confirmLabel="Descartar e sair"
          onCancel={() => setPending(null)}
          onConfirm={() => setAllowLeave(true)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
function NavItem({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flex: 1,
          minHeight: 56,
          padding: 8,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: focused ? c.ink : selected ? c.primary : "transparent",
          backgroundColor: selected ? c.pale : c.white,
          justifyContent: "center",
          alignItems: "center",
        },
        pressed && interaction.pressed,
      ]}
    >
      <Text
        style={{
          color: c.primary,
          fontSize: 14,
          fontWeight: selected ? "800" : "600",
          textAlign: "center",
        }}
      >
        {selected ? "● " : ""}
        {label}
      </Text>
    </Pressable>
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
  const ref = useAccessibleFocus(title);
  return (
    <View style={{ gap: 10, marginVertical: 20 }}>
      {eyebrow && <Text style={s.eyebrow}>{eyebrow}</Text>}
      <Text
        ref={ref}
        accessible
        accessibilityRole="header"
        accessibilityLanguage="pt-BR"
        {...(Platform.OS === "web" ? { tabIndex: -1 } : {})}
        style={s.title}
      >
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
  busy = false,
  accessibilityLabel,
  accessibilityHint,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  busy?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: secondary ? c.pale : c.primary,
          borderColor: focused ? (secondary ? c.ink : c.accent) : "transparent",
        },
        (disabled || busy) && interaction.disabled,
        pressed && interaction.pressed,
      ]}
    >
      <Text
        style={{
          color: secondary ? c.primary : c.white,
          fontWeight: "700",
          fontSize: 16,
        }}
      >
        {busy ? "Aguarde…" : title}
      </Text>
    </Pressable>
  );
}
export function Field({
  label,
  error,
  onFocus,
  onBlur,
  focusOnError = false,
  focusRequest = 0,
  ...props
}: TextInputProps & {
  label: string;
  error?: string;
  focusOnError?: boolean;
  focusRequest?: number;
}) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
    if (error && focusOnError) inputRef.current?.focus();
  }, [error, focusOnError, focusRequest]);
  return (
    <View style={{ gap: 7, marginBottom: 16 }}>
      <Text nativeID={`${id}-label`} style={s.label}>
        {label}
      </Text>
      <TextInput
        ref={inputRef}
        accessibilityLabel={label}
        accessibilityHint={error ? `Erro: ${error}` : props.accessibilityHint}
        accessibilityLabelledBy={`${id}-label`}
        {...(Platform.OS === "web"
          ? {
              "aria-invalid": !!error,
              "aria-describedby": error ? `${id}-error` : undefined,
            }
          : {})}
        placeholderTextColor={c.muted}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          s.input,
          props.multiline && { minHeight: 120, textAlignVertical: "top" },
          error && { borderColor: c.error },
          focused && interaction.focus,
          props.style,
        ]}
      />
      {error && (
        <Text
          nativeID={`${id}-error`}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={s.error}
        >
          Erro: {error}
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
          <Choice
            key={option}
            label={`${label}: ${option}`}
            option={option}
            selected={value === option}
            onPress={() => onChange(option)}
          />
        ))}
      </View>
    </View>
  );
}
function Choice({
  label,
  option,
  selected,
  onPress,
}: {
  label: string;
  option: string;
  selected: boolean;
  onPress: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        s.chip,
        selected && { backgroundColor: c.primary, borderColor: c.primary },
        focused && { borderColor: selected ? c.accent : c.ink },
        pressed && interaction.pressed,
      ]}
    >
      <Text style={{ color: selected ? c.white : c.ink }}>
        {selected ? "✓ " : ""}
        {option}
      </Text>
    </Pressable>
  );
}
export function Notice({
  children,
  error = false,
  announce = false,
}: React.PropsWithChildren<{ error?: boolean; announce?: boolean }>) {
  const text = typeof children === "string" ? children : "";
  useEffect(() => {
    if (Platform.OS === "ios" && (announce || error) && text)
      AccessibilityInfo.announceForAccessibility(text);
  }, [text, announce, error]);
  return (
    <View style={[s.notice, error && { backgroundColor: "#FCECEC" }]}>
      <Text
        role={error ? "alert" : announce ? "status" : undefined}
        accessibilityLiveRegion={announce || error ? "polite" : "none"}
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
  focus = false,
}: {
  title: string;
  description: string;
  focus?: boolean;
}) {
  const ref = useAccessibleFocus(title, focus);
  return (
    <View style={[s.card, { padding: 32, alignItems: "center", gap: 12 }]}>
      <Text accessible={false} aria-hidden style={{ fontSize: 36 }}>
        🐾
      </Text>
      <Text
        ref={ref}
        {...(Platform.OS === "web" && focus ? { tabIndex: -1 } : {})}
        accessibilityRole="header"
        style={s.section}
      >
        {title}
      </Text>
      <Text style={[s.body, { textAlign: "center" }]}>{description}</Text>
    </View>
  );
}
export function useColumns() {
  const { width, fontScale } = useWindowDimensions();
  return fontScale > 1.3 ? 1 : width >= 850 ? 3 : width >= 560 ? 2 : 1;
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
    fontSize: 12,
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
    minHeight: 52,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: c.border,
    backgroundColor: c.white,
    fontSize: 16,
    color: c.ink,
  },
  button: {
    minHeight: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    minHeight: 48,
    minWidth: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
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
  error: { fontSize: 14, color: c.error },
  footer: {
    color: c.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 36,
    textAlign: "center",
  },
  content: { width: "100%", maxWidth: 1080, alignSelf: "center" },
  form: { width: "100%", maxWidth: 560, alignSelf: "center", gap: 4 },
});
