import { describe, expect, it } from "vitest";
import { availableCallDays, beninTimeToUtc, isValidCallSlot } from "./booking";
import { formatMoney, packSavings, priceFor, xofToEur, zoneForCountry } from "./pricing";

describe("zones de prix", () => {
  it("associe les pays à la bonne zone", () => {
    expect(zoneForCountry("BJ")).toBe("africa");
    expect(zoneForCountry("ci")).toBe("africa");
    expect(zoneForCountry("FR")).toBe("europe");
    expect(zoneForCountry("BE")).toBe("europe");
    expect(zoneForCountry("US")).toBe("international");
    expect(zoneForCountry("CA")).toBe("international");
    expect(zoneForCountry(null)).toBe("africa");
  });

  it("calcule les prix et formate les devises", () => {
    const prices = { africa: 2500, europe: 20, international: 22 };
    expect(priceFor(prices, "africa", 4)).toEqual({ amount: 10000, currency: "XOF" });
    expect(priceFor(prices, "europe")).toEqual({ amount: 20, currency: "EUR" });
    expect(formatMoney(25000, "XOF")).toMatch(/25 000/);
    expect(formatMoney(290, "EUR")).toBe("290 €");
    expect(xofToEur(65596)).toBe(100);
  });

  it("ne montre une économie que si elle est réelle", () => {
    expect(packSavings(10000, 2500, 5)).toBe(2500);
    expect(packSavings(15000, 2500, 5)).toBe(0);
  });
});

describe("créneaux d'appel", () => {
  // Lundi 9 novembre 2026, 08:00 à l'heure du Bénin (07:00 UTC).
  const monday8am = new Date("2026-11-09T07:00:00.000Z");

  it("convertit l'heure du Bénin en UTC", () => {
    expect(beninTimeToUtc("2026-11-09", "06:00").toISOString()).toBe("2026-11-09T05:00:00.000Z");
    expect(beninTimeToUtc("2026-11-09", "22:30").toISOString()).toBe("2026-11-09T21:30:00.000Z");
  });

  it("respecte le préavis de 12 h, le samedi avant 13 h et le dimanche sans appel", () => {
    const days = availableCallDays(monday8am, []);
    const monday = days.find((day) => day.day === "2026-11-09");
    // 08:00 + 12 h = 20:00 : il reste 21:00 et 22:30 le lundi.
    expect(monday?.slots.map((slot) => slot.time)).toEqual(["21:00", "22:30"]);
    expect(days.find((day) => day.day === "2026-11-14")?.slots.map((slot) => slot.time)).toEqual(["06:00", "10:00", "12:30"]);
    expect(days.find((day) => day.day === "2026-11-15")).toBeUndefined();
  });

  it("retire les créneaux déjà réservés", () => {
    const booked = [beninTimeToUtc("2026-11-09", "21:00").toISOString()];
    const monday = availableCallDays(monday8am, booked).find((day) => day.day === "2026-11-09");
    expect(monday?.slots.map((slot) => slot.time)).toEqual(["22:30"]);
  });

  it("valide uniquement les créneaux officiels", () => {
    expect(isValidCallSlot(beninTimeToUtc("2026-11-10", "10:00").toISOString(), monday8am)).toBe(true);
    expect(isValidCallSlot(beninTimeToUtc("2026-11-10", "11:00").toISOString(), monday8am)).toBe(false);
    expect(isValidCallSlot(beninTimeToUtc("2026-11-15", "10:00").toISOString(), monday8am)).toBe(false);
    expect(isValidCallSlot("pas une date", monday8am)).toBe(false);
  });
});
