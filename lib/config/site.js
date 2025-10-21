// /lib/config/site.js
export const SITE = {
  name: "Интернет-магазин аниме",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
};

export const CONTACTS = {
  phones: ["+375 (29) 123-45-67", "+375 (33) 765-43-21"],
  addresses: [
    "Минск, пр-т Независимости, 12",
    "Минск, ул. Якуба Коласа, 18",
  ],
  workHours: "ежедневно 10:00–20:00",
};

export function contactsOneLine() {
  const tel = CONTACTS.phones.join(", ");
  const addr = CONTACTS.addresses.join("; ");
  return { tel, addr };
}
