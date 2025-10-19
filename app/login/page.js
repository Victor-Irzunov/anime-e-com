"use client"
import LoginForm from "@/components/Form/FormLogin"
import RegistrationForm from "@/components/Form/RegistrationForm"
import { useState } from "react"
import { useSearchParams } from 'next/navigation'

const page = () => {
	const [isActive, setIsActive] = useState(true)
	const searchParams = useSearchParams()
	const search = searchParams.get('from')
	
	return (
		<section className="min-h-screen py-32 relative">
			<div className='container mx-auto'>
				{
					isActive ?
						<div className=''>
							<h1 className='text-2xl'>
								Войти
							</h1>
							<LoginForm setIsActive={setIsActive} search={search} />
						</div>
						:
						<div className=''>
							<h1 className='text-2xl'>
								Зарегистрироваться
							</h1>
							<RegistrationForm setIsActive={setIsActive} search={search} />
						</div>
				}


			</div>
		</section>
	)
}
export default page;