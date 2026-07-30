import { defineQuery } from "next-sanity";

export const siteContentQuery = defineQuery(`{
  "siteSettings": *[_type == "siteSettings"][0]{
    siteName,
    headerName,
    globalNotice,
    crisisNotice,
    footerText
  },
  "professionalProfile": *[_type == "professionalProfile"][0]{
    fullName,
    headline,
    shortBio,
    approach,
    licenseNumber,
    education,
    certifications,
    highlights,
    "portrait": portrait{
      "url": asset->url,
      alt
    }
  },
  "services": *[_type == "service" && isActive == true] | order(order asc)[0...4]{
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    modality,
    durationMinutes,
    fee,
    availabilityNote,
    "image": image{
      "url": asset->url,
      alt
    }
  },
  "contactSettings": *[_type == "contactSettings"][0]{
    email,
    phoneDisplay,
    whatsappNumber,
    whatsappMessage,
    locationName,
    address,
    serviceAreas,
    modalities,
    preferredScheduleOptions,
    responseTimeCopy,
    successMessage,
    errorMessage
  },
  "seoSettings": *[_type == "seoSettings"][0]{
    metaTitle,
    metaDescription,
    canonicalOverride,
    "ogImage": ogImage{
      "url": asset->url,
      alt
    },
    ogImageAlt,
    businessType,
    areaServed,
    socialProfiles
  },
  "privacyNotice": *[_type == "privacyNotice" && status == "approved"] | order(effectiveDate desc)[0]{
    title,
    status,
    effectiveDate,
    controllerIdentity,
    content,
    contactEmail,
    versionLabel
  }
}`);
