import React from 'react';
import { Link } from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Dropdown } from 'react-bootstrap';

//Images
import circle from './../../../assets/images/pattern/circle.png';

//Import 
import InvoicesSent from './Wallet/InvoicesSent';
import PaymentHistory from './Wallet/PaymentHistory';
import DonutChart2 from './Wallet/DonutChart2';

const CanvasPieChart = loadable(() =>
	pMinDelay(import("./Wallet/CanvasPieChart"), 1000)
);
const LineChart = loadable(() =>
	pMinDelay(import("./Wallet/LineChart"), 1000)
);

const MyWallet = () => {
	return (
		<>
			<div className="row">
				<div className="col-xl-12">
					<div className="row">
						<div className="col-xl-9 col-xxl-8">
							<div className="row">
								<div className="col-xl-12">
									<div className="card">
										<div className="card-header flex-wrap border-0 pb-0 align-items-end">
											<div className="mb-3 me-3">
												<h5 className="fs-18  font-w700">Main Balance</h5>
												<span className="fs-32 font-w800">$673,412.66</span>
											</div>
											<div className="me-3 mb-3">
												<p className="fs-14 mb-1 font-w700">VALID THRU</p>
												<span className="text-black fs-18 font-w700">08/21</span>
											</div>
											<div className="me-3 mb-3">
												<p className="fs-14 mb-1 font-w700">CARD HOLDER</p>
												<span className="text-black fs-18 font-w700">Eren Yeager</span>
											</div>
											<span className="fs-18 font-w700 me-3 mb-3">**** **** **** 1234</span>
											<Dropdown className="dropdown mb-auto">
												<Dropdown.Toggle as="div" to={"#"} className="btn-link i-false">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
														<path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
														<path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
													</svg>
												</Dropdown.Toggle>
												<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
													<Dropdown.Item>Delete</Dropdown.Item>
													<Dropdown.Item>Edit</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
										<div className="card-body">
											<div className="progress default-progress">
												<div className="progress-bar bg-gradient5 progress-animated" style={{ width: "50%", height: "20px" }} role="progressbar">
													<span className="sr-only">50% Complete</span>
												</div>
											</div>
											<div className="row mt-4 pt-3">
												<div className="col-xl-4 col-xxl-7 col-md-6">
													<h4 className="card-title font-w700">Weekly Summary</h4>
													<div className="row align-items-center">
														<div className="col-sm-6 col-5">															
															<CanvasPieChart />
														</div>
														<div className="col-sm-6 col-7">
															<ul className="card-list mt-3">
																<li className="mb-2"><span className="bg-success circle"></span><span className="me-4">
																	<svg className="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<rect x="-0.00012207" width="16" height="16" rx="8" fill="#39DD53" />
																	</svg>
																	Income</span><span className="text-black fs-14 font-w700">50%</span></li>
																<li className="mb-2"><span className="bg-danger circle"></span><span className="me-4">
																	<svg className="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<rect x="-0.00012207" y="3.05176e-05" width="16" height="16" rx="8" fill="#FFB252" />
																	</svg>
																	Expense</span><span className="text-black fs-14 font-w700">30%</span></li>
																<li className="mb-2"><span className="bg-light circle"></span><span className="me-4">
																	<svg className="me-2" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																		<rect x="-0.00012207" width="16" height="16" rx="8" fill="#D7D7D7" />
																	</svg>
																	Unknown</span><span className="text-black fs-14 font-w700">20%</span></li>
															</ul>
														</div>

													</div>
												</div>
												<div className="col-xl-8 col-xxl-5 col-md-6">
													<div id="line-chart" className="bar-chart">
														<LineChart />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-12">
									<div className="card">
										<div className="card-body">
											<div className="row align-items-center">
												<div className="col-xl-3 col-xxl-6 col-6">
													<div>
														<div className="d-flex align-items-center mb-3">
															<div className="d-inline-block position-relative donut-chart-sale">
																<DonutChart2 value="62" backgroundColor="rgba(172, 57, 212,1)"
																	backgroundColor2="rgba(238, 238, 238, 1)"
																/>
															</div>
															<div className="ms-3">
																<h4 className="fs-18 font-w700 mb-0">Installment</h4>
																<span className="fs-14 font-w700">$5,412</span>
															</div>
														</div>
													</div>
												</div>
												<div className="col-xl-3 col-xxl-6 col-6">
													<div>
														<div className="d-flex align-items-center mb-3">
															<div className="d-inline-block position-relative donut-chart-sale">
																<DonutChart2 value="80" backgroundColor="rgba(64, 212, 168,1)"
																	backgroundColor2="rgba(238, 238, 238, 1)"
																/>
															</div>
															<div className="ms-3">
																<h4 className="fs-18 font-w700 mb-0">Investment</h4>
																<span className="fs-14 font-w700">$3,784</span>
															</div>
														</div>
													</div>
												</div>
												<div className="col-xl-3 col-xxl-6 col-6">
													<div>
														<div className="d-flex align-items-center mb-3">
															<div className="d-inline-block position-relative donut-chart-sale">
																<DonutChart2 value="50" backgroundColor="rgba(70, 30, 231,1)"
																	backgroundColor2="rgba(238, 238, 238, 1)"
																/>
															</div>
															<div className="ms-3">
																<h4 className="fs-18 font-w700 mb-0">Property</h4>
																<span className="fs-14 font-w700">$3,784</span>
															</div>
														</div>
													</div>
												</div>
												<div className="col-xl-3 col-xxl-6 col-6">
													<div className="mb-3">
														<Link to={"#"} className="btn btn-primary btn-lg">+New Spends</Link>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-12">
									<PaymentHistory />
								</div>
							</div>
						</div>

						<div className="col-xl-3 col-xxl-4">
							<div className="row">
								<div className="col-xl-12 col-md-6">
									<div className="card">
										<div className="card-body action">
											<div className="">
												<img src={circle} alt="" />
												<h4 className="fs-32 font-w800 text-white mt-3">$ 2,467</h4>
												<span className="fs-18 font-w600 text-white">Wallet Balance</span>
												<span className="fs-14 font-w700 d-block text-white mt-3">+0,8% than last week</span>
											</div>
										</div>
										<div className="card-body">
											<div className="d-flex justify-content-between">
												<div className="text-center">
													<svg className="mb-1" width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
														<rect width="62" height="62" rx="20" fill="#FFAA2B" />
														<path d="M39.1667 18.1667H22.8334C21.5957 18.1667 20.4088 18.6584 19.5336 19.5335C18.6584 20.4087 18.1667 21.5957 18.1667 22.8334V31C18.1667 31.3094 18.2897 31.6062 18.5085 31.825C18.7272 32.0438 19.024 32.1667 19.3334 32.1667H25.1667V42.6667C25.1662 42.8898 25.2297 43.1085 25.3496 43.2966C25.4695 43.4848 25.6409 43.6346 25.8434 43.7284C26.0464 43.8218 26.272 43.855 26.4933 43.824C26.7145 43.7929 26.9223 43.699 27.0917 43.5534L30.4167 40.7067L33.7417 43.5534C33.9531 43.7341 34.222 43.8334 34.5001 43.8334C34.7782 43.8334 35.0471 43.7341 35.2584 43.5534L38.5834 40.7067L41.9084 43.5534C42.1197 43.7341 42.3887 43.8334 42.6667 43.8334C42.8355 43.8322 43.0023 43.7964 43.1567 43.7284C43.3593 43.6346 43.5306 43.4848 43.6506 43.2966C43.7705 43.1085 43.834 42.8898 43.8334 42.6667V22.8334C43.8334 21.5957 43.3418 20.4087 42.4666 19.5335C41.5914 18.6584 40.4044 18.1667 39.1667 18.1667ZM20.5001 29.8334V22.8334C20.5001 22.2145 20.7459 21.621 21.1835 21.1834C21.6211 20.7459 22.2146 20.5 22.8334 20.5C23.4523 20.5 24.0457 20.7459 24.4833 21.1834C24.9209 21.621 25.1667 22.2145 25.1667 22.8334V29.8334H20.5001ZM41.5001 40.135L39.3417 38.28C39.1304 38.0993 38.8615 37.9999 38.5834 37.9999C38.3053 37.9999 38.0364 38.0993 37.8251 38.28L34.5001 41.1267L31.1751 38.28C30.9638 38.0993 30.6948 37.9999 30.4167 37.9999C30.1387 37.9999 29.8697 38.0993 29.6584 38.28L27.5001 40.135V22.8334C27.4986 22.0137 27.2813 21.209 26.8701 20.5H39.1667C39.7856 20.5 40.3791 20.7459 40.8167 21.1834C41.2542 21.621 41.5001 22.2145 41.5001 22.8334V40.135ZM39.1667 24C39.1667 24.3094 39.0438 24.6062 38.825 24.825C38.6062 25.0438 38.3095 25.1667 38.0001 25.1667H31.0001C30.6907 25.1667 30.3939 25.0438 30.1751 24.825C29.9563 24.6062 29.8334 24.3094 29.8334 24C29.8334 23.6906 29.9563 23.3939 30.1751 23.1751C30.3939 22.9563 30.6907 22.8334 31.0001 22.8334H38.0001C38.3095 22.8334 38.6062 22.9563 38.825 23.1751C39.0438 23.3939 39.1667 23.6906 39.1667 24ZM39.1667 28.6667C39.1667 28.9761 39.0438 29.2729 38.825 29.4916C38.6062 29.7104 38.3095 29.8334 38.0001 29.8334H31.0001C30.6907 29.8334 30.3939 29.7104 30.1751 29.4916C29.9563 29.2729 29.8334 28.9761 29.8334 28.6667C29.8334 28.3573 29.9563 28.0605 30.1751 27.8417C30.3939 27.6229 30.6907 27.5 31.0001 27.5H38.0001C38.3095 27.5 38.6062 27.6229 38.825 27.8417C39.0438 28.0605 39.1667 28.3573 39.1667 28.6667ZM39.1667 33.3334C39.1667 33.6428 39.0438 33.9395 38.825 34.1583C38.6062 34.3771 38.3095 34.5 38.0001 34.5H31.0001C30.6907 34.5 30.3939 34.3771 30.1751 34.1583C29.9563 33.9395 29.8334 33.6428 29.8334 33.3334C29.8334 33.0239 29.9563 32.7272 30.1751 32.5084C30.3939 32.2896 30.6907 32.1667 31.0001 32.1667H38.0001C38.3095 32.1667 38.6062 32.2896 38.825 32.5084C39.0438 32.7272 39.1667 33.0239 39.1667 33.3334Z" fill="white" />
													</svg>
													<h4 className="fs-18 font-w700">Send Invoices</h4>
												</div>
												<div className="text-center">
													<svg className="mb-1" width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
														<rect width="62" height="62" rx="20" fill="#09BD3C" />
														<g opacity="0.98" clipPath="">
															<path d="M26.7781 19.0125C27.1062 19.6906 26.8164 20.5109 26.1383 20.8391C24.2516 21.7469 22.6547 23.1578 21.5172 24.9242C20.3523 26.7344 19.7344 28.8344 19.7344 31C19.7344 37.2125 24.7875 42.2656 31 42.2656C37.2125 42.2656 42.2656 37.2125 42.2656 31C42.2656 28.8344 41.6477 26.7344 40.4883 24.9187C39.3563 23.1523 37.7539 21.7414 35.8672 20.8336C35.1891 20.5055 34.8992 19.6906 35.2273 19.007C35.5555 18.3289 36.3703 18.0391 37.0539 18.3672C39.4 19.4937 41.3852 21.2437 42.7906 23.4422C44.2344 25.6953 45 28.3094 45 31C45 34.7406 43.5453 38.257 40.8984 40.8984C38.257 43.5453 34.7406 45 31 45C27.2594 45 23.743 43.5453 21.1016 40.8984C18.4547 38.2516 17 34.7406 17 31C17 28.3094 17.7656 25.6953 19.2148 23.4422C20.6258 21.2492 22.6109 19.4937 24.9516 18.3672C25.6352 18.0445 26.45 18.3289 26.7781 19.0125Z" fill="white" />
															<path d="M25.679 30.2726C25.411 30.0047 25.2797 29.6547 25.2797 29.3047C25.2797 28.9547 25.411 28.6047 25.679 28.3367L29.1188 24.8969C29.6219 24.3937 30.2891 24.1203 30.9946 24.1203C31.7 24.1203 32.3727 24.3992 32.8704 24.8969L36.3102 28.3367C36.8461 28.8726 36.8461 29.7367 36.3102 30.2726C35.7743 30.8086 34.9102 30.8086 34.3743 30.2726L32.3563 28.2547L32.3563 36.0258C32.3563 36.7804 31.7438 37.3929 30.9891 37.3929C30.2344 37.3929 29.6219 36.7804 29.6219 36.0258L29.6219 28.2492L27.604 30.2672C27.079 30.8031 26.2149 30.8031 25.679 30.2726Z" fill="white" />
														</g>
														<defs>
															<clipPath>
																<rect width="28" height="28" fill="white" transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 45 45)" />
															</clipPath>
														</defs>
													</svg>
													<h4 className="fs-18 font-w700">Transfer</h4>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xl-12 col-md-6">
									<InvoicesSent />
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
export default MyWallet;