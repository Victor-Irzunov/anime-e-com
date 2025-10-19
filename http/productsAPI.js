import { $authHost, $host } from "./index"


export const searchProduct = async ({searchTerm}) => {
	const { data } = await $host.get('api/product/search', {
		params: {
			searchTerm
		}
	});
	return data
}

export const orderProduct = async (orderdata) => {
	const { data } = await $authHost.post('api/product/order', orderdata)
	return data
}


