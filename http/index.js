import axios from "axios"

//_без авторизации
const $host = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
})


const $authHost = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL
})

//.вставляю токен
const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token_e_com')}`
    return config
}

//_будет отробат перед каждым запросом и подстовлять токен 
$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}
