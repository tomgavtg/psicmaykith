import { getCliClient } from "sanity/cli";
import { getPublicationIssues } from "../../lib/content/publication.js";

const client = getCliClient({ apiVersion: "2026-07-01" });

async function main() {
  const content = await client.fetch(`{
  "siteSettings": *[_id == "siteSettings"][0]{siteName,headerName,globalNotice,crisisNotice},
  "professionalProfile": *[_id == "professionalProfile"][0]{
    fullName,heroTitle,shortBio,approach,licenseNumber,education,validationItems,
    "portrait": portrait{"url": asset->url,alt}
  },
  "services": *[_type == "service" && isActive == true] | order(order asc){
    name,"slug": slug.current,durationMinutes,fee,modality,bookingUrl
  },
  "contactSettings": *[_id == "contactSettings"][0]{
    email,whatsappNumber,modalities,availableWeekdays,availableStartTimes,bookingPolicy,responseTimeCopy
  },
  "seoSettings": *[_id == "seoSettings"][0]{
    metaTitle,metaDescription,businessType,areaServed,"ogImage": ogImage{"url": asset->url,alt}
  },
  "privacyNotice": *[_type == "privacyNotice"] | order(_updatedAt desc)[0]{
    title,status,effectiveDate,controllerIdentity,controllerAddress,content,contactEmail,contactWhatsapp,versionLabel
  }
}`);

  console.log(
    JSON.stringify(
      {
        dataset: client.config().dataset,
        profile: {
          fullName: content.professionalProfile?.fullName,
          hasPortrait: Boolean(content.professionalProfile?.portrait?.url),
          hasLicense: Boolean(content.professionalProfile?.licenseNumber),
        },
        services: content.services?.map((service) => ({
          name: service.name,
          slug: service.slug,
          durationMinutes: service.durationMinutes,
          hasFee: Number.isFinite(service.fee?.amount),
          hasBookingUrl: Boolean(service.bookingUrl),
        })),
        schedule: {
          weekdays: content.contactSettings?.availableWeekdays?.length || 0,
          startTimes: content.contactSettings?.availableStartTimes?.length || 0,
          cancellationWindowHours:
            content.contactSettings?.bookingPolicy?.cancellationWindowHours,
          clientReschedulingAllowed:
            content.contactSettings?.bookingPolicy?.clientReschedulingAllowed,
        },
        seo: {
          title: content.seoSettings?.metaTitle,
          hasOgImage: Boolean(content.seoSettings?.ogImage?.url),
        },
        privacy: {
          status: content.privacyNotice?.status,
          versionLabel: content.privacyNotice?.versionLabel,
          contentBlocks: content.privacyNotice?.content?.length || 0,
          hasControllerAddress: Boolean(content.privacyNotice?.controllerAddress),
          hasArcoEmail: Boolean(content.privacyNotice?.contactEmail),
          hasArcoWhatsapp: Boolean(content.privacyNotice?.contactWhatsapp),
          contentPreview: (content.privacyNotice?.content || [])
            .flatMap((block) => block.children || [])
            .map((child) => child.text || "")
            .join(" ")
            .slice(0, 500),
        },
        publicationIssues: getPublicationIssues(content),
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
