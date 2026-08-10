import { getCliClient } from "sanity/cli";
import { fallbackContent } from "../../lib/content/fallback.js";
import { getFaqItems } from "../../lib/content/faq.js";

const client = getCliClient({ apiVersion: "2026-07-01" });
const expectedDataset = "production";

const profileUpdate = {
  headline: "Psicoterapia psicoanalítica | Orientación psicológica profunda",
  heroTitle:
    "Acompañamiento con enfoque psicoanalítico ante procesos de cambio y momentos difíciles. Sesiones en línea.",
  shortBio:
    "Un espacio de escucha profesional para explorar lo que estás viviendo, comprender patrones que se repiten y construir nuevas formas de relacionarte contigo y con otras personas.",
  professionalLabel: "Atención profesional",
};

function faqDocument(item, index) {
  return {
    _id: `faq.${item.slug}`,
    _type: "faqItem",
    question: item.question,
    slug: { _type: "slug", current: item.slug },
    answer: item.answer,
    category: item.category,
    order: (index + 1) * 10,
    isActive: true,
  };
}

async function main() {
  const dataset = client.config().dataset;
  if (dataset !== expectedDataset) {
    throw new Error(
      `Dataset inesperado: ${dataset}. Se esperaba ${expectedDataset}.`,
    );
  }

  const profile = await client.fetch(
    '*[_id == "professionalProfile"][0]{_id,"portraitRef":portrait.asset._ref}',
  );
  if (!profile?._id) {
    throw new Error("No existe professionalProfile en Sanity.");
  }

  const faqItems = getFaqItems(fallbackContent);
  if (faqItems.length !== 26) {
    throw new Error(
      `Se esperaban 26 preguntas frecuentes y se encontraron ${faqItems.length}.`,
    );
  }

  let transaction = client
    .transaction()
    .patch("professionalProfile", (patch) => patch.set(profileUpdate));

  for (const [index, item] of faqItems.entries()) {
    transaction = transaction.createOrReplace(faqDocument(item, index));
  }

  const result = await transaction.commit({ visibility: "sync" });
  const updatedProfile = await client.fetch(
    '*[_id == "professionalProfile"][0]{headline,heroTitle,shortBio,professionalLabel,"portraitRef":portrait.asset._ref}',
  );
  const publishedFaqCount = await client.fetch(
    'count(*[_type == "faqItem" && isActive == true])',
  );

  if (updatedProfile?.portraitRef !== profile.portraitRef) {
    throw new Error("La referencia de la fotografía cambió durante la sincronización.");
  }
  if (publishedFaqCount !== faqItems.length) {
    throw new Error(
      `Sanity reportó ${publishedFaqCount} preguntas activas; se esperaban ${faqItems.length}.`,
    );
  }

  console.log(
    JSON.stringify(
      {
        dataset,
        transactionId: result.transactionId,
        profileUpdated: updatedProfile,
        portraitPreserved: true,
        activeFaqItems: publishedFaqCount,
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
