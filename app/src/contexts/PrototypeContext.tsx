import React, { createContext, useContext, useState } from "react";
import { initialOrgs, initialPets, demoOrg } from "../data/fixtures";
import { Org, Pet } from "../data/models";
import { orgSchema } from "../lib/validation";
import { z } from "zod";
type AccountInput = z.infer<typeof orgSchema>;
type Store = {
  orgs: Org[];
  pets: Pet[];
  session: Org | null;
  city: string;
  filters: { age: string; size: string; breed: string };
  setFilters: React.Dispatch<
    React.SetStateAction<{ age: string; size: string; breed: string }>
  >;
  feedback: { path: string; message: string } | null;
  setFeedback: React.Dispatch<
    React.SetStateAction<{ path: string; message: string } | null>
  >;
  setCity: (city: string) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (input: AccountInput) => boolean;
  addPet: (input: Omit<Pet, "id" | "orgId" | "photo">) => void;
};
const Context = createContext<Store | null>(null);
export function PrototypeProvider({ children }: React.PropsWithChildren) {
  const [orgs, setOrgs] = useState(initialOrgs);
  const [pets, setPets] = useState(initialPets);
  const [session, setSession] = useState<Org | null>(null);
  const [city, updateCity] = useState("");
  const [filters, setFilters] = useState({
    age: "Todos",
    size: "Todos",
    breed: "",
  });
  const [feedback, setFeedback] = useState<{
    path: string;
    message: string;
  } | null>(null);
  const setCity = (value: string) => {
    if (value.trim().toLocaleLowerCase() !== city.trim().toLocaleLowerCase())
      setFilters({ age: "Todos", size: "Todos", breed: "" });
    updateCity(value);
  };
  // Somente a credencial pública de demonstração. Senhas cadastradas não são armazenadas.
  const [demoEmails, setDemoEmails] = useState([demoOrg.email]);
  const login = (email: string, password: string) => {
    const org = orgs.find((o) => o.email === email);
    if (!org || !demoEmails.includes(email) || password !== "adota123")
      return false;
    setSession(org);
    return true;
  };
  const register = ({ password: _password, ...input }: AccountInput) => {
    if (orgs.some((o) => o.email === input.email)) return false;
    const org = { ...input, id: `org-${Date.now()}` };
    setOrgs((old) => [...old, org]);
    setDemoEmails((old) => [...old, input.email]);
    return true;
  };
  const addPet: Store["addPet"] = (input) => {
    if (!session)
      throw new Error("Entre como organização para cadastrar um pet.");
    setPets((old) => [
      ...old,
      {
        ...input,
        id: `pet-${Date.now()}`,
        orgId: session.id,
        photo: input.species === "Gato" ? "cat" : "dog",
      },
    ]);
  };
  return (
    <Context.Provider
      value={{
        orgs,
        pets,
        session,
        city,
        filters,
        setFilters,
        feedback,
        setFeedback,
        setCity,
        login,
        logout: () => setSession(null),
        register,
        addPet,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePrototype() {
  const value = useContext(Context);
  if (!value) throw new Error("Provider ausente");
  return value;
}
