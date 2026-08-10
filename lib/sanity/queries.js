import { defineQuery } from "next-sanity";

export const siteContentQuery = defineQuery(`{
  "_contentRevision": "2026-08-10-approved-secondary-title",
  "siteSettings": *[_type == "siteSettings"][0]{
    _updatedAt,
    siteName,
    headerName,
    globalNotice,
    crisisNotice,
    footerText
  },
  "professionalProfile": *[_type == "professionalProfile"][0]{
    _updatedAt,
    fullName,
    heroTitle,
    headline,
    shortBio,
    professionalLabel,
    approach,
    validationItems,
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
    _updatedAt,
    name,
    "slug": slug.current,
    shortDescription,
    modality,
    durationMinutes,
    fee,
    bookingUrl,
    availabilityNote,
    "image": image{
      "url": asset->url,
      alt
    }
  },
  "faqItems": *[_type == "faqItem" && isActive == true] | order(order asc){
    _id,
    question,
    "slug": slug.current,
    answer,
    category,
    order
  },
  "contactSettings": *[_type == "contactSettings"][0]{
    _updatedAt,
    email,
    phoneDisplay,
    whatsappNumber,
    whatsappMessage,
    locationName,
    address,
    serviceAreas,
    modalities,
    availableWeekdays,
    availableStartTimes,
    bookingPolicy,
    responseTimeCopy,
    successMessage,
    errorMessage
  },
  "seoSettings": *[_type == "seoSettings"][0]{
    _updatedAt,
    metaTitle,
    metaDescription,
    canonicalOverride,
    "ogImage": ogImage{
      "url": asset->url,
      alt,
      "dimensions": asset->metadata.dimensions{
        width,
        height,
        aspectRatio
      }
    },
    ogImageAlt,
    businessType,
    areaServed,
    socialProfiles
  },
  "privacyNotice": *[_type == "privacyNotice"] | order(_updatedAt desc)[0]{
    _updatedAt,
    title,
    status,
    effectiveDate,
    controllerIdentity,
    controllerAddress,
    content,
    contactEmail,
    contactWhatsapp,
    versionLabel
  }
}`);
