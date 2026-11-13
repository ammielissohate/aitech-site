import { describe, expect, it } from "vitest";
import { isBlobImageUrl, projectInputFromFormData, slugify, validateProjectInput } from "./schema";

const image = {
  url: "https://abc123.public.blob.vercel-storage.com/realisations/logo-x1y2.png",
  width: 1600,
  height: 1000,
  alt: "Logo du projet",
};

function formWith(overrides: Record<string, string> = {}) {
  const formData = new FormData();
  const values: Record<string, string> = {
    title: "Identité visuelle d'un cabinet",
    pillar: "brand-positioning",
    context: "client-aitech",
    clientName: "",
    year: "2025",
    summary: "Création du logo et de la charte graphique.",
    need: "",
    solution: "Plateforme de marque, logo, charte et kit de supports.",
    result: "",
    link: "",
    published: "on",
    images: JSON.stringify([image]),
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) formData.set(key, value);
  return formData;
}

describe("validation d'une réalisation", () => {
  it("accepte une réalisation complète et convertit les champs vides en null", () => {
    const result = validateProjectInput(projectInputFromFormData(formWith()));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.year).toBe(2025);
      expect(result.data.clientName).toBeNull();
      expect(result.data.link).toBeNull();
      expect(result.data.published).toBe(true);
      expect(result.data.images).toHaveLength(1);
    }
  });

  it("exige au moins une image", () => {
    const result = validateProjectInput(projectInputFromFormData(formWith({ images: "[]" })));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.images).toMatch(/au moins une image ou une vidéo/);
  });

  it("accepte une vidéo avec sa couverture, et refuse une couverture externe", () => {
    const video = { ...image, url: image.url.replace(".png", ".mp4"), kind: "video", poster: image.url };
    const ok = validateProjectInput(projectInputFromFormData(formWith({ images: JSON.stringify([video]) })));
    expect(ok.success).toBe(true);
    const bad = validateProjectInput(
      projectInputFromFormData(formWith({ images: JSON.stringify([{ ...video, poster: "https://exemple.com/c.webp" }]) })),
    );
    expect(bad.success).toBe(false);
  });

  it("refuse une image qui ne vient pas du stockage du site", () => {
    const foreign = JSON.stringify([{ ...image, url: "https://exemple.com/image.png" }]);
    const result = validateProjectInput(projectInputFromFormData(formWith({ images: foreign })));
    expect(result.success).toBe(false);
  });

  it("refuse un JSON d'images corrompu, une année et un lien invalides", () => {
    const result = validateProjectInput(
      projectInputFromFormData(formWith({ images: "{pas du json", year: "20x5", link: "javascript:alert(1)" })),
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.images).toBeDefined();
      expect(result.errors.year).toBeDefined();
      expect(result.errors.link).toBeDefined();
    }
  });

  it("traite une case « publié » non cochée comme un brouillon", () => {
    const formData = formWith();
    formData.delete("published");
    const result = validateProjectInput(projectInputFromFormData(formData));
    expect(result.success && result.data.published).toBe(false);
  });
});

describe("utilitaires", () => {
  it("génère un slug lisible", () => {
    expect(slugify("Identité visuelle — Café Ô Bénin !")).toBe("identite-visuelle-cafe-o-benin");
    expect(slugify("!!!")).toBe("realisation");
  });

  it("reconnaît les URL Vercel Blob", () => {
    expect(isBlobImageUrl(image.url)).toBe(true);
    expect(isBlobImageUrl("http://abc.public.blob.vercel-storage.com/a.png")).toBe(false);
    expect(isBlobImageUrl("https://public.blob.vercel-storage.com.pirate.com/a.png")).toBe(false);
    expect(isBlobImageUrl("pas une url")).toBe(false);
  });
});
