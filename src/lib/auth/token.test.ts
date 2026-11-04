import { describe, expect, it } from "vitest";
import { SESSION_DURATION_MS, createSessionToken, safeRedirectPath, verifyPassword, verifySessionToken } from "./token";

const SECRET = "un-secret-de-test-suffisamment-long-0123456789";
const NOW = 1_800_000_000_000;

describe("jeton de session admin", () => {
  it("accepte un jeton valide et non expiré", () => {
    const token = createSessionToken(SECRET, NOW);
    expect(verifySessionToken(token, SECRET, NOW + 1000)).toBe(true);
  });

  it("refuse un jeton expiré", () => {
    const token = createSessionToken(SECRET, NOW);
    expect(verifySessionToken(token, SECRET, NOW + SESSION_DURATION_MS + 1)).toBe(false);
  });

  it("refuse un jeton signé avec un autre secret", () => {
    const token = createSessionToken("autre-secret-tout-aussi-long-0123456789", NOW);
    expect(verifySessionToken(token, SECRET, NOW)).toBe(false);
  });

  it("refuse un jeton dont l'expiration a été modifiée", () => {
    const [, signature] = createSessionToken(SECRET, NOW).split(".");
    const forged = `${NOW + SESSION_DURATION_MS * 10}.${signature}`;
    expect(verifySessionToken(forged, SECRET, NOW)).toBe(false);
  });

  it("refuse les valeurs vides ou malformées", () => {
    expect(verifySessionToken(undefined, SECRET, NOW)).toBe(false);
    expect(verifySessionToken("", SECRET, NOW)).toBe(false);
    expect(verifySessionToken("abc", SECRET, NOW)).toBe(false);
    expect(verifySessionToken("1.2.3", SECRET, NOW)).toBe(false);
  });
});

describe("mot de passe et redirection", () => {
  it("vérifie le mot de passe", () => {
    expect(verifyPassword("bon-mot-de-passe", "bon-mot-de-passe")).toBe(true);
    expect(verifyPassword("mauvais", "bon-mot-de-passe")).toBe(false);
    expect(verifyPassword("", "")).toBe(false);
  });

  it("n'autorise que les redirections internes", () => {
    expect(safeRedirectPath("/admin")).toBe("/admin");
    expect(safeRedirectPath("/#realisations")).toBe("/#realisations");
    expect(safeRedirectPath("https://site-malveillant.com")).toBe("/admin");
    expect(safeRedirectPath("//site-malveillant.com")).toBe("/admin");
    expect(safeRedirectPath("/\\site-malveillant.com")).toBe("/admin");
    expect(safeRedirectPath(null)).toBe("/admin");
  });
});
