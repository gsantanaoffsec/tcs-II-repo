import { Org, Pet } from "./models";
export const demoOrg: Org = {
  id: "org-demo",
  name: "Abrigo Patas Felizes",
  email: "demo@adotaai.com",
  phone: "5511999999999",
  cep: "01001000",
  state: "SP",
  city: "São Paulo",
  street: "Praça da Sé",
  number: "100",
};
export const initialOrgs: Org[] = [
  demoOrg,
  {
    ...demoOrg,
    id: "org-campinas",
    name: "Casa dos Focinhos",
    email: "campinas@example.com",
    city: "Campinas",
  },
  {
    ...demoOrg,
    id: "org-curitiba",
    name: "Amigos de Quatro Patas",
    email: "curitiba@example.com",
    city: "Curitiba",
    state: "PR",
  },
];
export const initialPets: Pet[] = [
  {
    id: "luna",
    orgId: "org-demo",
    name: "Luna",
    species: "Cão",
    breed: "Sem raça definida",
    age: "Adulto",
    size: "Médio",
    photo: "dog",
    description:
      "Companheira tranquila e carinhosa. Luna adora passear e descansar perto de quem ama. A organização orientará sobre adaptação, vacinação e os cuidados necessários.",
  },
  {
    id: "bento",
    orgId: "org-demo",
    name: "Bento",
    species: "Cão",
    breed: "Labrador",
    age: "Filhote",
    size: "Grande",
    photo: "puppy",
    description:
      "Curioso e cheio de energia, Bento procura uma família com tempo para brincar e ensinar. Converse com a organização sobre sua rotina e o processo de adoção.",
  },
  {
    id: "nina",
    orgId: "org-demo",
    name: "Nina",
    species: "Gato",
    breed: "Sem raça definida",
    age: "Adulto",
    size: "Pequeno",
    photo: "cat",
    description:
      "Nina gosta de janelas ensolaradas e carinho no seu tempo. Procura um lar com telas de proteção e uma família paciente para a adaptação.",
  },
  {
    id: "toby",
    orgId: "org-demo",
    name: "Toby",
    species: "Cão",
    breed: "Sem raça definida",
    age: "Idoso",
    size: "Pequeno",
    photo: "dog",
    description:
      "Um amigo sereno que aprecia passeios curtos e companhia. Toby precisa de uma família disposta a acompanhar seus cuidados na melhor idade.",
  },
  {
    id: "mel",
    orgId: "org-campinas",
    name: "Mel",
    species: "Gato",
    breed: "Sem raça definida",
    age: "Filhote",
    size: "Pequeno",
    photo: "cat",
    description:
      "Uma gatinha brincalhona em busca de um lar protegido e acolhedor.",
  },
  {
    id: "chico",
    orgId: "org-curitiba",
    name: "Chico",
    species: "Cão",
    breed: "Beagle",
    age: "Adulto",
    size: "Médio",
    photo: "dog",
    description:
      "Sociável e curioso, Chico adora descobrir novos cheiros durante os passeios.",
  },
];
