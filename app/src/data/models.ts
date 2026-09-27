export const ages = ["Filhote", "Adulto", "Idoso"] as const;
export const sizes = ["Pequeno", "Médio", "Grande"] as const;
export type Org = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cep: string;
  state: string;
  city: string;
  street: string;
  number: string;
};
export type Pet = {
  id: string;
  orgId: string;
  name: string;
  description: string;
  breed: string;
  age: (typeof ages)[number];
  size: (typeof sizes)[number];
  species: "Cão" | "Gato";
  photo: string;
};
export type Filters = { age?: string; size?: string; breed?: string };
export function filterPets(
  pets: Pet[],
  orgs: Org[],
  city: string,
  filters: Filters = {},
) {
  if (!city.trim()) return [];
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
  return pets.filter(
    (p) =>
      normalize(orgs.find((o) => o.id === p.orgId)?.city ?? "") ===
        normalize(city) &&
      (!filters.age || p.age === filters.age) &&
      (!filters.size || p.size === filters.size) &&
      (!filters.breed || normalize(p.breed).includes(normalize(filters.breed))),
  );
}
export function whatsappUrl(org: Org, pet: Pet) {
  return `https://wa.me/${org.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá, ${org.name}! Tenho interesse em adotar ${pet.name}. Podemos conversar?`)}`;
}
