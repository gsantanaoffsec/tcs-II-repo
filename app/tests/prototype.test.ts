import { test } from "node:test";
import assert from "node:assert/strict";
import { filterPets, whatsappUrl } from "../src/data/models";
import { initialOrgs, initialPets, demoOrg } from "../src/data/fixtures";
import { orgSchema, loginSchema, petSchema } from "../src/lib/validation";
test("cidade obrigatória e cidade obtida da organização", () => {
  assert.equal(filterPets(initialPets, initialOrgs, "").length, 0);
  assert.equal(filterPets(initialPets, initialOrgs, "sao paulo").length, 4);
  assert.deepEqual(
    filterPets(initialPets, initialOrgs, "Campinas").map((p) => p.id),
    ["mel"],
  );
  assert.equal(filterPets(initialPets, initialOrgs, "Recife").length, 0);
});
test("filtros opcionais e combinados", () => {
  assert.deepEqual(
    filterPets(initialPets, initialOrgs, "São Paulo", {
      age: "Adulto",
      size: "Pequeno",
      breed: "SEM RAÇA",
    }).map((p) => p.id),
    ["nina"],
  );
  assert.equal(
    filterPets(initialPets, initialOrgs, "São Paulo", {
      age: "Idoso",
      size: "Grande",
    }).length,
    0,
  );
});
test("cadastro valida endereço, whatsapp, UF e credenciais", () => {
  const account = { ...demoOrg, password: "adota123" };
  assert.equal(orgSchema.safeParse(account).success, true);
  for (const override of [
    { city: "" },
    { street: "" },
    { phone: "123" },
    { cep: "1" },
    { state: "XX" },
    { email: "invalido" },
    { password: "1" },
  ])
    assert.equal(
      orgSchema.safeParse({ ...account, ...override }).success,
      false,
    );
  assert.equal(
    loginSchema.safeParse({ email: "DEMO@ADOTAAI.COM", password: "adota123" })
      .success,
    true,
  );
  assert.equal(
    loginSchema.parse({ email: "DEMO@ADOTAAI.COM", password: "adota123" })
      .email,
    demoOrg.email,
  );
});
test("pet rejeita nome vazio, descrição curta e categorias inválidas", () => {
  assert.equal(petSchema.safeParse(initialPets[0]).success, true);
  for (const override of [
    { name: " " },
    { description: "curta" },
    { age: "desconhecido" },
    { size: "Gigante" },
  ])
    assert.equal(
      petSchema.safeParse({ ...initialPets[0], ...override }).success,
      false,
    );
});
test("whatsapp contém número da organização e mensagem codificada", () => {
  const url = new URL(whatsappUrl(demoOrg, initialPets[0]));
  assert.equal(url.pathname, "/5511999999999");
  assert.match(url.searchParams.get("text")!, /Luna/);
});
