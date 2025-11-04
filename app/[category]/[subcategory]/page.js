// /app/[category]/[subcategory]/page.jsx — ПОЛНОСТЬЮ
import ClientList from "./ClientList";

export default async function Page(props) {
  const { category, subcategory } = await props.params;
  return <ClientList category={category} subcategory={subcategory} />;
}
