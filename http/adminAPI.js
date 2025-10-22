// http/adminAPI.js
import { $authHost, $host } from "./index"

export const createProduct = async (product) => {
	const { data } = await $authHost.post('api/product', product)
	return data
}


export const getAllProductsOneSubCategory = async (subcategory, category) => {
  try {
    const { data } = await $host.get("api/product", {
      params: { subcategory, category }, // category можно не передавать
    });
    return data?.items ?? [];
  } catch (e) {
    console.error("Ошибка при получении товаров подкатегории:", e);
    return [];
  }
};

export async function searchProducts(q, take = 20, cursor) {
  try {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (take) params.set("take", String(take));
    if (cursor) params.set("cursor", String(cursor));

    const res = await fetch(`/api/admin/products/search?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return { ok: false, error: "REQUEST_FAILED" };
    }
    return await res.json();
  } catch (e) {
    console.error("searchProducts error:", e);
    return { ok: false, error: "NETWORK_ERROR" };
  }
}

export const updateOneProduct = async (id, product) => {
	const { data } = await $authHost.put('api/product/' + id, product)
	return data
}


export const deleteOneImage = async (id, name) => {
	const { data } = await $authHost.delete('api/product/' + id, {
		params: {
			name
		 }
	})
	return data
}

export const getOneProduct = async (id) => {
	const { data } = await $authHost.get('api/product/' + id)
	return data
}
// export const getRecommendedProduct = async () => {
// 	const { data } = await $host.get('api/product/recommended')
// 	return data
// }

export const deleteOneProduct = async (id) => {
  if (!id) throw new Error("No product id");
  const { data } = await $authHost.delete(`/api/product/${id}`);
  return data;
};


// РЕКОМЕНДОВАННЫЕ (тот же бренд)
export async function getRecommendedProduct({ brandId, brandName, excludeId, take = 10 } = {}) {
  try {
    const params = new URLSearchParams();
    if (brandId != null) params.set("brandId", String(brandId));
    if (!brandId && brandName) params.set("brandName", String(brandName));
    if (excludeId != null) params.set("excludeId", String(excludeId));
    if (take) params.set("take", String(take));

    if (!params.has("brandId") && !params.has("brandName")) return [];

    const res = await fetch(`/api/product/recommended?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) return [];
    const j = await res.json().catch(() => ({}));
    return Array.isArray(j?.items) ? j.items : [];
  } catch {
    return [];
  }
}