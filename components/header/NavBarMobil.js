
import Image from "next/image";
import Link from "next/link";
import { RiShoppingBagLine, RiMenu4Fill, RiSearchLine, RiShoppingBasket2Fill, RiUser3Line, RiLoginCircleFill, RiShoppingCartLine } from "react-icons/ri";
import { AiTwotoneHome } from "react-icons/ai";
import { dataCategory } from "@/lib/const/categoryData";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import ModalSearch from "../modal/ModalSearch";

const NavBarMobil = ({
	isDrawerOpen, toggleDrawer,
	closeDrawer, user, dataApp,
	modalVisible,
	setModalVisible
}) => {
	return (
		<nav className='xz:block sd:hidden'>
			<div className="navbar bg-base-100 py-0 layout-w">

				<div className="navbar-start">
					<div className="drawer z-50 w-auto">
						<input id="my-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={toggleDrawer} />
						<div className="drawer-content">
							<label htmlFor="my-drawer" className="hover:opacity-70 transition-opacity flex items-center gap-2 cursor-pointer">
								<RiMenu4Fill fontSize={35} />
							</label>
						</div>
						<div className="drawer-side">
							<label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

							<div className="menu xz:px-4 sd:px-8 xz:py-16 sd:py-10 sd:w-[500px] xz:w-80 min-h-full bg-base-200 text-base-content">
								<div className='px-4 mb-5 font-medium'>
									<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/`} className="text-xl">
										<AiTwotoneHome fontSize={26} onClick={closeDrawer} />
									</Link>
								</div>
								<p className='sd:text-xl xz:text-lg font-semibold'>
									Все категории
								</p>
								<div className=''>
									{dataCategory.map(el => {
										return (
											<details className="collapse collapse-plus bg-base-200" key={el.id}>
												<summary className="collapse-title sd:text-xl xz:text-base font-medium">
													<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/${el.link}`} className="underline" onClick={closeDrawer}>
														{el.title}
													</Link>
												</summary>
												{
													el.children.map(elem => {
														return (
															<div className="collapse-content flex items-center" key={elem.id}>
																<Image src={elem.img} alt={elem.alt} width={60} height={60} />
																<Link
																	href={`${process.env.NEXT_PUBLIC_BASE_URL}/${elem.link}`}
																	className="ml-3 underline" onClick={closeDrawer}>
																	{elem.name}
																</Link>
															</div>
														)
													})
												}
											</details>
										)
									})}
								</div>
							</div>
						</div>
					</div>
					<div className="join w-[4rem] ml-4 xz:hidden xy:block">
						<Link href={"/"} className="flex items-center gap-2 text-secondary text-xl font-semibold">
							<RiShoppingBasket2Fill fontSize={30} />
						</Link>
					</div>
				</div>

				<div className="navbar-center text-gray-500">

				</div>

				<div className="navbar-end">
					<div className='text-gray-500 mr-2'>
						<RiSearchLine
							className=""
							fontSize={30}
							onClick={() => setModalVisible(true)}
						/>
						<ModalSearch modalVisible={modalVisible} setModalVisible={setModalVisible} />
					</div>

					{
						user.userData?.isAdmin ?

							<Link
								href='/super-admin'
								className="flex flex-col items-center text-gray-500 rounded-lg mx-2 hover:opacity-80 transition-opacity"
							>
								<div className="indicator">
									<MdOutlineAdminPanelSettings fontSize={35} />
								</div>
							</Link>
							:
							null
					}
					{
						!user.isAuth ?
							<Link
								href='/login'
								className="flex flex-col items-center text-gray-500 rounded-lg mx-2  hover:opacity-80 transition-opacity"
							>
								<div className="indicator">
									<RiLoginCircleFill fontSize={30} />
								</div>
							</Link>
							:
							<Link
								href='/profile'
								className="flex flex-col items-center text-gray-500 rounded-lg  mx-2  hover:opacity-80 transition-opacity"
							>
								<div className="indicator">
									<RiUser3Line fontSize={30} />
								</div>
							</Link>
					}

					<Link
						href='/zakazy'
						className="flex flex-col items-center text-gray-500 rounded-lg mx-2  hover:opacity-80 transition-opacity"
					>
						<div className="indicator">
							<RiShoppingBagLine fontSize={30} />
						</div>
					</Link>

					<Link
						href='/korzina'
						className="flex flex-col items-center text-gray-500 rounded-lg pr-1  ml-2 hover:opacity-80 transition-opacity"
					>
						<div className="indicator">
							{
								dataApp.dataKorzina.length ?
									<span className="indicator-item px-1 text-xs font-semibold badge badge-secondary">
										{dataApp.dataKorzina.length}
									</span>
									:
									null
							}
							<RiShoppingCartLine fontSize={30} />
						</div>
					</Link>
				</div>


			</div>
		</nav>
	)
}

export default NavBarMobil