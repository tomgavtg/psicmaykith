import { createReadStream, readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

const shouldApply = process.argv.some((argument) =>
  argument.endsWith("apply-production-content.js"),
);
const client = getCliClient({ apiVersion: "2026-07-01" });
const APPROVED_PRIVACY_PATH =
  "docs/legal/privacy-notices/aviso-integral-sitio-contacto-v1.0.md";

function portableBlock(key, style, text) {
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${key}-text`,
        text,
        marks: [],
      },
    ],
  };
}

function approvedPrivacyContent() {
  const source = readFileSync(APPROVED_PRIVACY_PATH, "utf8");
  const blocks = [];
  let paragraph = [];
  let contentStarted = false;

  function flushParagraph() {
    if (!paragraph.length) return;
    blocks.push(
      portableBlock(
        `privacy-${String(blocks.length + 1).padStart(2, "0")}`,
        "normal",
        paragraph.join(" "),
      ),
    );
    paragraph = [];
  }

  for (const line of source.split(/\r?\n/)) {
    if (line.startsWith("## ")) {
      flushParagraph();
      contentStarted = true;
      blocks.push(
        portableBlock(
          `privacy-${String(blocks.length + 1).padStart(2, "0")}`,
          "h2",
          line.slice(3).trim(),
        ),
      );
    } else if (contentStarted && line.trim()) {
      paragraph.push(line.trim());
    } else if (contentStarted) {
      flushParagraph();
    }
  }

  flushParagraph();
  return blocks;
}

const serviceUpdates = [
  {
    _id: "60cd6033-37d5-4ea3-8694-a995ae4313a7",
    set: {
      name: "Terapia para adultos",
      slug: { _type: "slug", current: "terapia-para-adultos" },
      shortDescription:
        "Un espacio para comprender lo que sientes, reconocer patrones en tus relaciones o decisiones y poner en palabras aquello que todavía resulta difícil nombrar.",
      modality: ["En línea", "Presencial"],
      durationMinutes: 50,
      order: 1,
      isActive: true,
    },
  },
  {
    _id: "3c2267b2-acd3-42a3-b186-87655e1610a2",
    set: {
      name: "Terapia para adolescentes",
      slug: { _type: "slug", current: "terapia-para-adolescentes" },
      shortDescription:
        "Un espacio de escucha adaptado a su edad, donde pueda hablar sin sentirse juzgado o evaluado. El encuadre y la comunicación con madres, padres o tutores se acuerdan antes de comenzar.",
      modality: ["En línea", "Presencial"],
      durationMinutes: 50,
      order: 2,
      isActive: true,
    },
  },
  {
    _id: "6623e7a4-342a-4619-8df1-11c6ff513836",
    set: {
      name: "Terapia de pareja",
      slug: { _type: "slug", current: "terapia-de-pareja" },
      shortDescription:
        "Un espacio neutral para escuchar lo que sucede entre ambos, comprender los conflictos que se repiten y conversar sin buscar quién tiene la razón.",
      modality: ["En línea", "Presencial"],
      durationMinutes: 70,
      order: 3,
      isActive: true,
    },
    unset: ["fee"],
  },
];

async function findOrUploadPortrait() {
  const existing = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename == "PhotoMK1.jpeg"][0]{_id}',
  );

  if (existing?._id) return existing;
  if (!shouldApply) return { _id: "dry-run-image-asset" };

  return client.assets.upload(
    "image",
    createReadStream("public/images/psychologist/PhotoMK1.jpeg"),
    {
      filename: "PhotoMK1.jpeg",
      title: "Retrato profesional de Mayumi Kitahara",
    },
  );
}

async function main() {
  const requiredIds = [
    "siteSettings",
    "professionalProfile",
    "contactSettings",
    "seoSettings",
    ...serviceUpdates.map((service) => service._id),
  ];
  const existingIds = await client.fetch(
    "*[_id in $ids]._id",
    { ids: requiredIds },
  );
  const missingIds = requiredIds.filter((id) => !existingIds.includes(id));

  if (missingIds.length) {
    throw new Error(`Faltan documentos requeridos: ${missingIds.join(", ")}`);
  }

  const privacy = await client.fetch(
    '*[_type == "privacyNotice"] | order(_updatedAt desc)[0]{_id,status,controllerIdentity,"contentBlocks":count(content)}',
  );
  const portraitAsset = await findOrUploadPortrait();
  const privacyContent = approvedPrivacyContent();

  if (!shouldApply) {
    console.log(
      JSON.stringify(
        {
          mode: "dry-run",
          dataset: client.config().dataset,
          serviceIds: serviceUpdates.map((service) => service._id),
          portraitAsset: portraitAsset._id,
          approvedPrivacy: {
            source: APPROVED_PRIVACY_PATH,
            blocks: privacyContent.length,
            version: "1.0",
            effectiveDate: "2026-08-04",
          },
        },
        null,
        2,
      ),
    );
    return;
  }

  let transaction = client
    .transaction()
    .patch("siteSettings", (patch) =>
      patch.set({
        siteName: "Psicóloga Mayumi Kitahara | Psicoterapia psicoanalítica",
        headerName: "Psicóloga Mayumi Kitahara",
        globalNotice:
          "Este espacio no sustituye servicios de emergencia ni atención en crisis.",
        crisisNotice:
          "Si estás en una situación de emergencia o riesgo inmediato, llama al 911. Para orientación gratuita en salud mental en México, comunícate a la Línea de la Vida: 800 911 2000, disponible las 24 horas.",
        footerText:
          "Un espacio de escucha profesional para comprender lo que sientes y trabajar aquello que se repite. Atención con cita previa.",
      }),
    )
    .patch("professionalProfile", (patch) =>
      patch.set({
        fullName: "Psicóloga Marissa Mayumi Kitahara Funes",
        licenseNumber: "10630199",
        heroTitle:
          "Lo que sientes hoy tiene una historia. Podemos empezar a entenderla.",
        headline:
          "Psicoterapia psicoanalítica para adolescentes, adultos y parejas, en línea y presencial en CDMX.",
        shortBio:
          "Un espacio de escucha para comprender lo que sientes, reconocer patrones que se repiten y construir nuevas formas de relacionarte contigo y con otras personas. La atención puede ser en línea o presencial en Ciudad de México y cada proceso se trabaja de manera particular.",
        approach:
          "El enfoque psicoanalítico parte de que no todo lo que sentimos o hacemos tiene una razón consciente. Explorar la historia de nuestros vínculos permite reconocer patrones, poner en palabras lo que ocurre y abrir la posibilidad de relacionarnos de otra manera. No se trata de quedarse en el pasado, sino de comprender cómo sigue presente.",
        validationItems: [
          "Sientes ansiedad y no logras explicar del todo de dónde viene.",
          "Repites discusiones o situaciones parecidas en tus relaciones.",
          "Por fuera parece que todo está bien, pero algo por dentro no termina de acomodarse.",
          "Te preocupa cómo acercarte a tu hija o hijo adolescente sin generar más distancia.",
          "Sabes que necesitas hablar con alguien, aunque todavía no tengas claro por dónde empezar.",
        ],
        highlights: [
          "Atención en línea y presencial en CDMX",
          "Adolescentes, adultos y parejas",
          "Enfoque psicoanalítico",
        ],
        portrait: {
          _type: "image",
          asset: { _type: "reference", _ref: portraitAsset._id },
          alt: "Retrato profesional de la psicóloga Mayumi Kitahara.",
        },
      }),
    )
    .patch("contactSettings", (patch) =>
      patch
        .set({
          locationName: "Ciudad de México y atención en línea",
          serviceAreas: ["Ciudad de México", "Atención en línea"],
          modalities: ["En línea", "Presencial"],
          availableWeekdays: [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
          ],
          availableStartTimes: [
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
          ],
          responseTimeCopy: "24 horas hábiles",
        })
        .unset(["preferredScheduleOptions"]),
    )
    .patch("seoSettings", (patch) =>
      patch.set({
        metaTitle:
          "Psicóloga Mayumi Kitahara | Psicoterapia en CDMX y en línea",
        metaDescription:
          "Psicoterapia psicoanalítica para adolescentes, adultos y parejas, en línea y presencial en CDMX. Consulta disponibilidad y solicita una primera cita.",
        businessType: "ProfessionalService",
        areaServed: ["Ciudad de México", "Atención en línea"],
        ogImage: {
          _type: "image",
          asset: { _type: "reference", _ref: portraitAsset._id },
          alt: "Retrato profesional de la psicóloga Mayumi Kitahara.",
        },
      }),
    );

  for (const service of serviceUpdates) {
    transaction = transaction.patch(service._id, (patch) => {
      let nextPatch = patch.set(service.set).unset(["availabilityNote"]);
      if (service.unset?.length) nextPatch = nextPatch.unset(service.unset);
      return nextPatch;
    });
  }

  if (privacy?._id) {
    transaction = transaction.patch(privacy._id, (patch) =>
      patch
        .set({
          title: "Aviso de privacidad integral del sitio y contacto inicial",
          status: "approved",
          versionLabel: "1.0",
          effectiveDate: "2026-08-04",
          controllerIdentity: "Marissa Mayumi Kitahara Funes",
          controllerAddress:
            "Hacienda del Batán s/n, colonia Balcones del Campestre, León de los Aldama, C.P. 37138, Guanajuato, México",
          contactEmail: "contacto@psicologamayumikitahara.com",
          contactWhatsapp: "525639551234",
          content: privacyContent,
        }),
    );
  }

  const result = await transaction.commit();
  console.log(
    JSON.stringify(
      {
        mode: "applied",
        dataset: client.config().dataset,
        transactionId: result.transactionId,
        updatedDocuments:
          result.results?.map((item) => item.id) || result.documentIds || [],
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
