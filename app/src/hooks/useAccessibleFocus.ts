import { useCallback, useRef } from "react";
import {
  AccessibilityInfo,
  Platform,
  findNodeHandle,
  Text,
} from "react-native";
import { useFocusEffect } from "expo-router";
export function useAccessibleFocus(title?: string, enabled = true) {
  const ref = useRef<Text>(null);
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;
      if (Platform.OS === "web" && title) document.title = `${title} · AdotaAí`;
      const frame = requestAnimationFrame(() => {
        if (!ref.current) return;
        if (Platform.OS === "web") {
          (ref.current as unknown as HTMLElement).focus({
            preventScroll: true,
          });
        } else {
          const node = findNodeHandle(ref.current);
          if (node) AccessibilityInfo.setAccessibilityFocus(node);
        }
      });
      return () => cancelAnimationFrame(frame);
    }, [title, enabled]),
  );
  return ref;
}
