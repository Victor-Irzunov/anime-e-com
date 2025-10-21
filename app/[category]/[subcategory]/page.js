// /app/[category]/[subcategory]/page.jsx
import ClientList from "./ClientList";

export default async function Page(props) {
  const { category, subcategory } = await props.params; // ← ждём params
  return <ClientList category={category} subcategory={subcategory} />;
}
