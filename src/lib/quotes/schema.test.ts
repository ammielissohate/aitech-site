import { describe, expect, it } from "vitest";
import { getOffer, offers } from "@/data/offers";
import { computeQuote, generateQuoteRef, validateQuoteRequest } from "./schema";

const valid = {
  offerId: "identite-signature",
  quantity: "1",
  clientType: "particulier",
  fullName: "Awa Dossou",
  company: "",
  email: "awa@exemple.com",
  whatsapp: "+229 01 00 00 00 00",
  message: "",
  callAt: "2026-11-12T09:00:00.000Z",
  website: "",
};

describe("demande de devis", () => {
  it("accepte une demande valide et normalise le WhatsApp", () => {
    const result = validateQuoteRequest(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.whatsapp).toBe("+2290100000000");
  });

  it("exige le nom de l'entreprise pour une entreprise", () => {
    const result = validateQuoteRequest({ ...valid, clientType: "entreprise" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.company).toBeDefined();
  });

  it("refuse les robots (champ piège rempli) et les champs invalides", () => {
    const robot = validateQuoteRequest({ ...valid, website: "http://spam" });
    expect(robot.success).toBe(false);
    const invalid = validateQuoteRequest({ ...valid, email: "x", whatsapp: "12", callAt: "" });
    expect(invalid.success).toBe(false);
    if (!invalid.success) expect(Object.keys(invalid.errors).sort()).toEqual(["callAt", "email", "whatsapp"]);
  });
});

describe("calcul du devis", () => {
  it("applique le prix de la zone, sans tenir compte d'un prix envoyé par le client", () => {
    const offer = getOffer("identite-signature")!;
    expect(computeQuote(offer, "africa", 1)).toEqual({ quantity: 1, unitPrice: 65000, total: 65000, currency: "XOF" });
    expect(computeQuote(offer, "europe", 1).total).toBe(690);
  });

  it("multiplie par la quantité seulement pour les offres à l'unité, avec un plafond", () => {
    const slide = getOffer("carrousel-slide")!;
    expect(computeQuote(slide, "africa", 4)).toMatchObject({ quantity: 4, total: 10000 });
    expect(computeQuote(slide, "africa", 999).quantity).toBe(slide.unit!.max);
    const pack = getOffer("identite-eclosion")!;
    expect(computeQuote(pack, "africa", 7).quantity).toBe(1);
  });

  it("génère une référence lisible", () => {
    expect(generateQuoteRef(new Date("2026-11-10T12:00:00Z"), "k7q2zz")).toBe("AIT-261110-K7Q2");
  });

  it("a un catalogue cohérent (identifiants uniques, prix positifs)", () => {
    const ids = offers.map((offer) => offer.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const offer of offers) {
      expect(offer.prices.africa).toBeGreaterThan(0);
      expect(offer.prices.europe).toBeGreaterThan(0);
      expect(offer.prices.international).toBeGreaterThan(0);
      if (offer.savings) expect(getOffer(offer.savings.unitOfferId)).toBeDefined();
    }
  });
});
