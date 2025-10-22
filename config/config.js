// Динамическое имя и домен сайта (можно задать через .env)
export const siteName   = process.env.NEXT_PUBLIC_SITE_NAME   || "AKANI";
export const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "akani.by";
export const siteCity   = process.env.NEXT_PUBLIC_SITE_CITY   || "Минск";

// Телефоны: позже подставишь реальные
const phoneNumbers = {
  phone1: "+375 29 000-00-00",
  phone1Link: "+375290000000",
  phone1Social: "375290000000", // для WhatsApp/Viber (без +)
  phone2: "",
  phone2Link: "",
  phone3: "",
  phone3Link: "",
};

export default phoneNumbers;
