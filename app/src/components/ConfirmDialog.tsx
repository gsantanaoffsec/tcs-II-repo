import React, { useRef, useId } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Platform,
  AccessibilityInfo,
  findNodeHandle,
  ScrollView,
} from "react-native";
import { colors as c } from "../theme";
import { interaction } from "../theme/interaction";
export function ConfirmDialog({
  visible,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  busy = false,
}: {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const descriptionId = useId();
  const cancelRef = useRef<View>(null);
  const focusCancel = () => {
    if (!cancelRef.current) return;
    if (Platform.OS === "web")
      (cancelRef.current as unknown as HTMLElement).focus();
    else {
      const node = findNodeHandle(cancelRef.current);
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    }
  };
  return (
    <Modal
      visible={visible}
      accessibilityLabel={title}
      {...(Platform.OS === "web" ? { "aria-describedby": descriptionId } : {})}
      transparent
      animationType="none"
      onRequestClose={() => {
        if (!busy) onCancel();
      }}
      onShow={focusCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(20,35,28,.65)",
          justifyContent: "center",
          padding: 22,
        }}
      >
        <View
          accessibilityViewIsModal
          style={{
            backgroundColor: c.white,
            padding: 24,
            borderRadius: 20,
            width: "100%",
            maxWidth: 520,
            alignSelf: "center",
            maxHeight: "100%",
          }}
        >
          <ScrollView
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ gap: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              accessibilityRole="header"
              style={{ fontSize: 24, fontWeight: "700", color: c.ink }}
            >
              {title}
            </Text>
            <Text
              nativeID={descriptionId}
              style={{ fontSize: 16, lineHeight: 25, color: c.muted }}
            >
              {description}
            </Text>
            <DialogAction
              ref={cancelRef}
              title="Continuar aqui"
              hint={description}
              onPress={onCancel}
              disabled={busy}
            />
            <DialogAction
              title={busy ? "Aguarde…" : confirmLabel}
              onPress={onConfirm}
              disabled={busy}
              destructive
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
const DialogAction = React.forwardRef<
  View,
  {
    title: string;
    onPress: () => void;
    destructive?: boolean;
    disabled?: boolean;
    hint?: string;
  }
>(({ title, onPress, destructive, disabled = false, hint }, ref) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityHint={hint}
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled, busy: disabled }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        {
          minHeight: 52,
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: destructive ? c.error : c.pale,
          borderWidth: 2,
          borderColor: focused ? c.ink : "transparent",
        },
        pressed && interaction.pressed,
        disabled && interaction.disabled,
      ]}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: destructive ? c.white : c.primary,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
});
