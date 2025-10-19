import { dataCategory } from "@/lib/const/categoryData";

export async function generateMetadata({ params: { subcategory } }) {
	// Ищем подкатегорию среди всех категорий
	let foundSubcategory = null;

	dataCategory.forEach(category => {
		// Если категория имеет подкатегории
		if (category.children && category.children.length > 0) {
			// Ищем подкатегорию среди подкатегорий этой категории
			const subcat = category.children.find(sub => sub.link.split('/').filter(Boolean)[1] === subcategory);
			if (subcat) {
				// Если нашли, сохраняем её и прерываем цикл
				foundSubcategory = subcat;
				return;
			}
		}
	});

	// Если подкатегория не найдена, возвращаем значения по умолчанию
	if (!foundSubcategory) {
		return {
			title: '',
			description: '',
			alternates: {
				canonical: '',
			},
			keywords:''
		};
	}

	// Если подкатегория найдена, берем данные метатегов из неё
	const { metatitle, description } = foundSubcategory;

	// Формируем title и description
	const title = `${metatitle}`;
	const metaDescription = description;
	const keywords = 'телефон, купить, смартфон, дешево, выбор телефонов'

	const alternates = {
		canonical: `http://localhost:3000/mobilnye-telefony/telefony`,
	};

	return {
		title,
		description: metaDescription,
		alternates,
		keywords
	};
}

export default function Layout({ children }) {
	return (
		<>
			{children}
		</>
	);
}
