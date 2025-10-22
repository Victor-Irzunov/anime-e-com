import Link from "next/link"

const page = () => {
	return (
		<main className='xz:min-h-[80vh] sd:min-h-screen pt-14'>
			<section className='relative'>
				<div className='container mx-auto'>
					<h1 className='sd:text-5xl xz:text-3xl font-semibold text-shadow'>
						Ваш запрос принят!
					</h1>
					<p className='sd:text-3xl xz:text-xl mt-4 text-shadow'>
						Мастер свяжется с вами в ближайшее время.
					</p>

					<div className='mt-5'>
						<Link href='/' className="underline">
						На главную
						</Link>
					</div>
				</div>
			</section>
		</main>
	)
}

export default page