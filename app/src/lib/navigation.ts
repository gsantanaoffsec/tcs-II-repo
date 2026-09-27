export function activeDestination(path: string): "home" | "pets" | "org" {
  if (
    path === "/dashboard" ||
    path === "/pets/new" ||
    path.startsWith("/sign-")
  )
    return "org";
  return path.startsWith("/pets") ? "pets" : "home";
}
export function fallbackRoute(
  path: string,
): "/" | "/pets" | "/dashboard" | "/sign-in" {
  if (path === "/pets/new") return "/dashboard";
  if (path === "/sign-up") return "/sign-in";
  if (path.startsWith("/pets/")) return "/pets";
  return "/";
}
