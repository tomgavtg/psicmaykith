import { describe, expect, it } from "vitest";
import { mergeContactOptions } from "../lib/content/get-contact-options";

const fallback = {
  services: ["terapia-para-adultos"],
  modalities: ["En línea"],
  weekdays: ["Lunes", "Martes"],
  startTimes: ["09:30", "10:00"],
};

describe("mergeContactOptions", () => {
  it("conserva servicios de Sanity aunque el documento aún no tenga horarios", () => {
    expect(
      mergeContactOptions(
        {
          services: ["servicio-publicado-en-sanity"],
          modalities: ["Videollamada"],
          weekdays: null,
          startTimes: null,
        },
        fallback,
      ),
    ).toEqual({
      services: ["servicio-publicado-en-sanity"],
      modalities: ["Videollamada"],
      weekdays: fallback.weekdays,
      startTimes: fallback.startTimes,
    });
  });

  it("aplica el fallback sólo al catálogo que está vacío", () => {
    expect(
      mergeContactOptions(
        {
          services: [],
          modalities: ["En línea"],
          weekdays: ["Viernes"],
          startTimes: [],
        },
        fallback,
      ),
    ).toEqual({
      services: fallback.services,
      modalities: ["En línea"],
      weekdays: ["Viernes"],
      startTimes: fallback.startTimes,
    });
  });
});
