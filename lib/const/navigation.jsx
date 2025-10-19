import { RiHandbagFill, RiShoppingBag3Fill, RiUser3Fill, RiSearchLine, RiLoginCircleFill, FilloginBoxFill,  RiShoppingCart2Fill } from "react-icons/ri"

export const HEADER_NAV = [
    {
        label: "Вход",
        path: "/login",
        icon: <RiLoginCircleFill fontSize={20} />,
    },
    {
        label: "Заказы",
        path: "/orders",
        icon:<RiHandbagFill fontSize={20} />,
    },
    {
        label: "Корзина",
        path: "/korzina",
        icon: <RiShoppingBag3Fill fontSize={20} />,
    },
]
export const HEADER_NAV2 = [

    {
        label: "Профиль",
        path: "/profile",
        icon: <RiUser3Fill fontSize={20} />,
    },
    {
        label: "Заказы",
        path: "/orders",
        icon:<RiHandbagFill fontSize={20} />,
    },
    {
        label: "Корзина",
        path: "/korzina",
        icon: <RiShoppingBag3Fill fontSize={20} />,
    },
]
export const HEADER_NAV_MOBIL = [
    {
        label: "Вход",
        path: "/login",
        icon: <RiLoginCircleFill fontSize={30} />,
    },

    {
        label: "Заказы",
        path: "/orders",
        icon:<RiHandbagFill fontSize={30} />,
    },
    {
        label: "Корзина",
        path: "/korzina",
        icon: <RiShoppingCart2Fill fontSize={30} />,
    },
]
export const HEADER_NAV_MOBIL2 = [

    {
        label: "Профиль",
        path: "/profile",
        icon: <RiUser3Fill fontSize={30} />,
    },
    {
        label: "Заказы",
        path: "/orders",
        icon:<RiHandbagFill fontSize={30} />,
    },
    {
        label: "Корзина",
        path: "/korzina",
        icon: <RiShoppingCart2Fill fontSize={30} />,
    },
]

export const CATEGORY_LINKS = [
    {
        label: "Главная",
        path: "/",
    },
    {
        label: "Телефоны",
        path: "/telefony",
    },
    {
        label: "Ноутбуки",
        path: "/noutbuki",
    },
]
