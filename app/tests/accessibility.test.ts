import { test } from "node:test";
import assert from "node:assert/strict";
import { colors } from "../src/theme";
import { activeDestination, fallbackRoute } from "../src/lib/navigation";
function luminance(hex: string) {
  const channels = hex
    .match(/[a-f\d]{2}/gi)!
    .map((c) => parseInt(c, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
test("contraste de todos os pares de texto em uso é pelo menos 4,5:1", () => {
  for (const [label, foreground, background] of [
    ["conteúdo", colors.ink, colors.background],
    ["legendas", colors.muted, colors.background],
    ["cards", colors.muted, colors.white],
    ["avisos", colors.muted, colors.pale],
    ["ação principal", colors.white, colors.primary],
    ["ação secundária", colors.primary, colors.pale],
    ["erro", colors.error, "#FCECEC"],
    ["ação destrutiva", colors.white, colors.error],
  ])
    assert.ok(
      contrast(foreground, background) >= 4.5,
      `${label}: ${contrast(foreground, background).toFixed(2)}:1`,
    );
});
test("novo pet pertence ao menu da organização, detalhes ao menu público", () => {
  assert.equal(activeDestination("/pets/new"), "org");
  assert.equal(activeDestination("/pets/luna"), "pets");
  for (const path of ["/dashboard", "/sign-in", "/sign-up"])
    assert.equal(activeDestination(path), "org");
  assert.equal(activeDestination("/"), "home");
});
test("rotas abertas diretamente têm destinos de retorno coerentes", () => {
  assert.equal(fallbackRoute("/pets/new"), "/dashboard");
  assert.equal(fallbackRoute("/pets/luna"), "/pets");
  assert.equal(fallbackRoute("/sign-up"), "/sign-in");
  assert.equal(fallbackRoute("/pets"), "/");
});
