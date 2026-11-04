import { describe, expect, it } from "vitest";
import {
  MESSAGE_MAX_LENGTH,
  buildContactMessage,
  buildMailtoUrl,
  buildWhatsAppUrl,
  normalizeWhatsAppNumber,
  validateContact,
} from "./contact";

const validInput = {
  fullName: "Awa Dossou",
  email: "awa@exemple.com",
  company: "Cabinet Dossou Conseil",
  service: "digital-growth",
  message: "Nous voulons une landing page pour notre nouvelle offre de formation.",
};

describe("validateContact", () => {
  it("accepte des données valides et supprime les espaces superflus", () => {
    const result = validateContact({ ...validInput, fullName: "  Awa Dossou  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.fullName).toBe("Awa Dossou");
  });

  it("renvoie une erreur explicite par champ invalide", () => {
    const result = validateContact({ fullName: "A", email: "pas-un-email", company: "", service: "inconnu", message: "court" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).sort()).toEqual(["company", "email", "fullName", "message", "service"]);
      expect(result.errors.email).toMatch(/adresse e-mail valide/);
    }
  });

  it("refuse un message trop long", () => {
    const result = validateContact({ ...validInput, message: "a".repeat(MESSAGE_MAX_LENGTH + 1) });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.message).toBeDefined();
  });

  it("refuse les champs manquants", () => {
    const result = validateContact({});
    expect(result.success).toBe(false);
  });
});

describe("liens de contact", () => {
  it("normalise un numéro WhatsApp", () => {
    expect(normalizeWhatsAppNumber("+229 01 00 00 00 00")).toBe("2290100000000");
  });

  it("construit un lien WhatsApp encodé", () => {
    const url = buildWhatsAppUrl("+229 01 00 00 00 00", "Bonjour & merci");
    expect(url).toBe("https://wa.me/2290100000000?text=Bonjour%20%26%20merci");
  });

  it("renvoie null sans numéro configuré", () => {
    expect(buildWhatsAppUrl("", "message")).toBeNull();
  });

  it("construit un lien mailto et refuse une adresse invalide", () => {
    expect(buildMailtoUrl("contact@aitech.example", "Objet", "Corps")).toBe(
      "mailto:contact@aitech.example?subject=Objet&body=Corps",
    );
    expect(buildMailtoUrl("", "Objet", "Corps")).toBeNull();
  });

  it("inclut toutes les informations dans le message", () => {
    const result = validateContact(validInput);
    if (!result.success) throw new Error("données de test invalides");
    const message = buildContactMessage(result.data, "Digital Growth & Acquisition");
    expect(message).toContain("Awa Dossou");
    expect(message).toContain("Cabinet Dossou Conseil");
    expect(message).toContain("awa@exemple.com");
    expect(message).toContain("Digital Growth & Acquisition");
  });
});
