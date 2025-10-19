"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dataCategory } from '@/lib/const/categoryData';


function Breadcrumbs({ title }) {
    const path = usePathname();
    const pathArray = path.split('/').filter(Boolean);
    const breadcrumbs = [];

    let accumulatedUrl = '';
    let currentCategory = dataCategory;

    // Получаем только первый элемент из pathArray
    const firstSegment = pathArray.slice(0, 2);

    firstSegment.forEach((segment, index) => {
        accumulatedUrl += `/${segment}`;
        const category = currentCategory.find(item => item.link === segment);


        if (category) {
            // Проверяем, является ли текущая категория подкатегорией предыдущей
            if (index > 0 && breadcrumbs[index].name === category.title) {
                breadcrumbs.pop(); // Удаляем предыдущую категорию из хлебных крошек
            }
            breadcrumbs.push(...category.breadcrumb);
            // currentCategory = category.children || [];
        } else {
            const subcategory = currentCategory
                .flatMap(item => item.children || [])
                .find(item =>  item.link.split('/').filter(Boolean)[1] === segment );
            if (subcategory) {
                breadcrumbs.pop()
                breadcrumbs.push(...subcategory.breadcrumb);
                currentCategory = subcategory.children || [];
            } else {
                breadcrumbs.push({ name: segment, url: accumulatedUrl });
            }
        }
    });


    // Добавляем заголовок, если он предоставлен
    if (title) {
        breadcrumbs.push({ name: title, url: path });
    }

    return (
        <div className="text-sm breadcrumbs sd:px-2 py-2 xz:px-0">
            <ul className='sd:text-sm xz:text-xs'>
                <li>
                    <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/`}>
                        Главная
                    </Link>
                </li>
                {breadcrumbs.map(({ name, url }, index) => (
                    <li key={index}>
                        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}${url}`}>
                            {name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Breadcrumbs;
