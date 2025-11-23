// /config/config.js
// Динамическое имя и домен сайта (можно задать через .env)
export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "AKANI";
export const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "akani.by";
export const siteCity = process.env.NEXT_PUBLIC_SITE_CITY || "Минск";

// Адреса магазинов
export const shopAddresses = [
  "ул. Толстого, 1 — ТЦ «Minsk City Mall», 3 этаж, большой островок",
  "пр-т Дзержинского, 106 — ТЦ «Магнит», 1 этаж, около бокового входа",
];

// Телефоны
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
