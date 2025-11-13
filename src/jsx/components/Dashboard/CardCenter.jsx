import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

import card1 from './../../../assets/images/card/card1.png';
import card2 from './../../../assets/images/card/card2.png';
import card4 from './../../../assets/images/card/card4.png';

import CardSlider from './Card/CardSlider';
import ApexPieChart2 from './Card/ApexPieChart2';
import CanvasChart4 from './Card/CanvasChart4';

const CardListBlog = [
	{ image: card1 },
	{ image: card2 },
	{ image: card4 },
	{ image: card1 },
];

const CardCenter = () => {
	const [current, setCurrent] = useState("Oldest");
	return (
		<>
			<div className="row">
				<div className="col-xl-12">
					<CardSlider />
				</div>
				<div className="col-xl-9 col-xxl-8">
					<div className="row">
						<div className="col-xl-12">
							<div className="card">
								<div className="card-header flex-wrap border-0 pb-0 align-items-end">
									<div className="mb-3 me-3">
										<h5 className="fs-20 text-black font-w700">Main Balance</h5>
										<span className="text-num text-black fs-32 font-w800">$673,412.66</span>
									</div>
									<div className="me-3 mb-3">
										<p className="fs-14 mb-1 font-w700">VALID THRU</p>
										<span className="text-black fs-18 font-w600">08/21</span>
									</div>
									<div className="me-3 mb-3">
										<p className="fs-14 mb-1 font-w700 mb-1">CARD HOLDER</p>
										<span className="text-black fs-18 font-w600">Eren Yeager</span>
									</div>
									<span className="fs-18 text-black font-w600 me-3 mb-3">**** **** **** 1234</span>
									<Dropdown className="dropdown mb-auto">
										<Dropdown.Toggle as="div" className="btn-link i-false">
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
										<div className="progress-bar bg-gradient5  progress-animated" style={{ width: "50%", height: "20px" }}>
											<span className="sr-only">50% Complete</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="col-xl-12">
							<div className="card">
								<div className="card-header d-sm-flex d-block border-0">
									<div className="me-auto mb-sm-0 mb-4">
										<h4 className="fs-20 text-black font-w700">Card List</h4>
										<span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
									</div>

									<Dropdown>
										<Dropdown.Toggle as="div" className="btn light card-select-btn">{current}</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item onClick={() => setCurrent("Newest")}>Newest</Dropdown.Item>
											<Dropdown.Item onClick={() => setCurrent("Oldest")}>Oldest</Dropdown.Item>
											<Dropdown.Item onClick={() => setCurrent("Letest")}>Letest</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="card-body p-0 pb-4">
									{CardListBlog.map((data, index) => (
										<div className="d-flex border-bottom justify-content-between flex-wrap align-items-center card-type" key={index}>
											<div className="d-flex py-3 align-items-center ">
												<img src={data.image} alt="" className="rounded me-3 card-list-img" width="130" />
												<div className="me-3 ">
													<p className="fs-14 mb-1">Card Type</p>
													<span className="text-black font-w600 fs-18">Primary</span>
												</div>
											</div>
											<div className="me-3 ">
												<p className="fs-14 mb-1">Bank</p>
												<span className="text-black font-w600 fs-18">ABC Bank</span>
											</div>
											<div className="me-3">
												<p className="fs-14 mb-1">Card Number</p>
												<span className="text-black font-w600 fs-18">**** **** **** 2256</span>
											</div>
											<div className="me-3 ">
												<p className="fs-14 mb-1">Namein Card</p>
												<span className="text-black font-w600 fs-18">Franklin Jr.</span>
											</div>
											<Link to={"#"} className="fs-18  font-w800 btn-link me-3 pb-3">See Number</Link>
											<Dropdown className="dropdown pb-3">
												<Dropdown.Toggle as="div" className="i-false btn-link">
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
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-xxl-4">
					<div className="row">
						<div className="col-xl-12">
							<div className="card">
								<div className="card-header border-0">
									<div>
										<h4 className="card-title mb-2">Card Statistic</h4>
										<span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
									</div>
								</div>
								<div className="card-body pieChart2">
									<div id="pieChart2" className="">
										<ApexPieChart2 />
									</div>
									<div>
										<div className="d-flex justify-content-between mt-3 align-items-center">
											<span>
												<svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
													<rect width="19" height="19" rx="9.5" fill="#2251F8" />
												</svg>
												Main Card
											</span>
											<span>
												<svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
													<rect width="19" height="19" rx="9.5" fill="#F87C22" />
												</svg>
												Orange Card
											</span>
										</div>
										<div className="d-flex justify-content-between mt-3">
											<span>
												<svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
													<rect width="19" height="19" rx="9.5" fill="#AB31E4" />
												</svg>
												Purple Card
											</span>
											<span className="me-2 d-block">
												<svg className="me-2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
													<rect width="19" height="19" rx="9.5" fill="#50D37D" />
												</svg>
												Green Card
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12 col-sm-6">
							<div className="card overflow-hidden">
								<div className="card-header d-sm-flex d-block border-0 pb-0">
									<div className="mb-sm-0 mb-2">
										<p className="fs-14 mb-1 font-w400">Outome</p>
										<span className="mb-0">
											<strong className="fs-24 text-black font-w800">$22,851</strong></span>
									</div>
									<span className="fs-12">
										<svg className="me-1" width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M0.999939 13.5C1.91791 12.4157 4.89722 9.22772 6.49994 7.5L12.4999 10.5L19.4999 1.5" stroke="#2BC155" strokeWidth="2" />
											<path d="M6.49994 7.5C4.89722 9.22772 1.91791 12.4157 0.999939 13.5H19.4999V1.5L12.4999 10.5L6.49994 7.5Z" fill="url(#paint0_linear2)" />
											<defs>
												<linearGradient id="paint0_linear2" x1="10.2499" y1="3" x2="10.9999" y2="13.5" gradientUnits="userSpaceOnUse">
													<stop offset="0" stopColor="#2BC155" stopOpacity="0.73" />
													<stop offset="1" stopColor="#2BC155" stopOpacity="0" />
												</linearGradient>
											</defs>
										</svg>
										4% (30 days)</span>
								</div>
								<div className="card-body p-0">									
									<CanvasChart4 />
								</div>
							</div>
						</div>
						<div className="col-xl-12 col-sm-6">
							<div className="card overflow-hidden">
								<div className="card-header d-sm-flex d-block border-0 pb-0">
									<div className="mb-sm-0 mb-2">
										<p className="fs-14 mb-1 font-w400">Outome</p>
										<span className="mb-0">
											<strong className="fs-24 text-black font-w800">$22,851</strong></span>
									</div>
									<span className="fs-12">
										<svg className="me-1" width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M14.3514 7.5C15.9974 9.37169 19.0572 12.8253 20 14H1V1L8.18919 10.75L14.3514 7.5Z" fill="url(#paint3_linear)" />
											<path d="M19.5 13.5C18.582 12.4157 15.6027 9.22772 14 7.5L8 10.5L1 1.5" stroke="#FF2E2E" strokeWidth="2" strokeLinecap="round" />
											<defs>
												<linearGradient id="paint0_linear" x1="10.5" y1="2.625" x2="9.64345" y2="13.9935" gradientUnits="userSpaceOnUse">
													<stop offset="1" stopColor="#FF2E2E" stopOpacity="0.03" />
												</linearGradient>
											</defs>
										</svg>
										4% (30 days)</span>
								</div>
								<div className="card-body p-0">
									<CanvasChart4 />
								</div>

							</div>
						</div>

					</div>
				</div>
			</div>
		</>
	)
}

export default CardCenter;