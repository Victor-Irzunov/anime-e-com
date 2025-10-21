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
export const getRecommendedProduct = async () => {
	const { data } = await $host.get('api/product/recommended')
	return data
}

export const deleteOneProduct = async (id) => {
	const { data } = await $authHost.delete('api/product/', {
		params: {
		  id
		},
	 })
	return data
}
