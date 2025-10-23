import { $authHost, $host } from "./index"


export const searchProduct = async ({searchTerm}) => {
	const { data } = await $host.get('api/product/search', {
		params: {
			searchTerm
		}
	});
	return data
}

export async function orderProduct(formData) {
  const res = await fetch(`/api/product/order`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Fail order');
  return res.json();
}

