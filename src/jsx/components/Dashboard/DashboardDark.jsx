import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Dropdown } from 'react-bootstrap';

///Images
import small from "./../../../assets/images/profile/small/pic1.jpg";
import avt1 from "./../../../assets/images/avatar/1.jpg";
import avt2 from "./../../../assets/images/avatar/2.jpg";
import avt3 from "./../../../assets/images/avatar/3.jpg";
import avt4 from "./../../../assets/images/avatar/4.jpg";
import avt5 from "./../../../assets/images/avatar/5.jpg";
import avt6 from "./../../../assets/images/avatar/6.jpg";





//Import Components
import { ThemeContext } from "../../../context/ThemeContext";

import DonutChart from './Dashboard/DonutChart';
import WidgetChart3 from './Dashboard/WidgetChart3';
import PreviousTransactions from './Dashboard/PreviousTransactions';
import NouiRangeSlider from './Dashboard/NouiRangeSlider';

const TotalInvoices = loadable(() =>
	pMinDelay(import("./Dashboard/TotalInvoices"), 1000)
);
const Paidinvoices = loadable(() =>
	pMinDelay(import("./Dashboard/Paidinvoices"), 1000)
);
const Unpaidinvoices = loadable(() =>
	pMinDelay(import("./Dashboard/Unpaidinvoices"), 1000)
);
const Totalinvoicessent = loadable(() =>
	pMinDelay(import("./Dashboard/Totalinvoicessent"), 1000)
);
const ChartBarApex = loadable(() =>
	pMinDelay(import("./Dashboard/ChartBarApex"), 1000)
);


const DashboardDark = () => {
	const { changeBackground } = useContext(ThemeContext);
	useEffect(() => {
		changeBackground({ value: "dark", label: "Dark" });
	}, []);
	return (
		<>
			<div className="row">
				<div className="col-xl-12">
					<div className="row">
						<div className="col-xl-3 col-sm-6">
							<div className="card overflow-hidden">
								<div className="card-header border-0">
									<div className="d-flex">
										<span className="mt-2">
											<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fillRule="evenodd" clipRule="evenodd" d="M9.812 34.64L3.2 39.6C2.594 40.054 1.784 40.128 1.106 39.788C0.428 39.45 0 38.758 0 38V2C0 0.896 0.896 0 2 0H30C31.104 0 32 0.896 32 2V38C32 38.758 31.572 39.45 30.894 39.788C30.216 40.128 29.406 40.054 28.8 39.6L22.188 34.64L17.414 39.414C16.634 40.196 15.366 40.196 14.586 39.414L9.812 34.64ZM28 34V4H4V34L8.8 30.4C9.596 29.802 10.71 29.882 11.414 30.586L16 35.172L20.586 30.586C21.29 29.882 22.404 29.802 23.2 30.4L28 34ZM14 20H18C19.104 20 20 19.104 20 18C20 16.896 19.104 16 18 16H14C12.896 16 12 16.896 12 18C12 19.104 12.896 20 14 20ZM10 12H22C23.104 12 24 11.104 24 10C24 8.896 23.104 8 22 8H10C8.896 8 8 8.896 8 10C8 11.104 8.896 12 10 12Z" fill="#717579" />
											</svg>
										</span>
										<div className="invoices">
											<h4>2,478</h4>
											<span>Total Invoices</span>
										</div>
									</div>
								</div>
								<div className="card-body p-0">
									<div id="totalInvoices">
										<TotalInvoices />
									</div>
								</div>

							</div>
						</div>
						<div className="col-xl-3 col-sm-6">
							<div className="card overflow-hidden">
								<div className="card-header border-0">
									<div className="d-flex">
										<span className="mt-1">
											<svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fillRule="evenodd" clipRule="evenodd" d="M17.812 48.64L11.2 53.6C10.594 54.054 9.78401 54.128 9.10602 53.788C8.42802 53.45 8.00002 52.758 8.00002 52V16C8.00002 14.896 8.89602 14 10 14H38C39.104 14 40 14.896 40 16V52C40 52.758 39.572 53.45 38.894 53.788C38.216 54.128 37.406 54.054 36.8 53.6L30.188 48.64L25.414 53.414C24.634 54.196 23.366 54.196 22.586 53.414L17.812 48.64ZM36 48V18H12V48L16.8 44.4C17.596 43.802 18.71 43.882 19.414 44.586L24 49.172L28.586 44.586C29.29 43.882 30.404 43.802 31.2 44.4L36 48ZM22 34H26C27.104 34 28 33.104 28 32C28 30.896 27.104 30 26 30H22C20.896 30 20 30.896 20 32C20 33.104 20.896 34 22 34ZM18 26H30C31.104 26 32 25.104 32 24C32 22.896 31.104 22 30 22H18C16.896 22 16 22.896 16 24C16 25.104 16.896 26 18 26Z" fill="#44814E" />
												<circle cx="43.5" cy="14.5" r="12.5" fill="#09BD3C" stroke="white" strokeWidth="4" />
											</svg>
										</span>
										<div className="invoices">
											<h4>983</h4>
											<span>Paid Invoices</span>
										</div>
									</div>
								</div>
								<div className="card-body p-0">
									<div id="paidinvoices">
										<Paidinvoices />
									</div>
								</div>

							</div>
						</div>
						<div className="col-xl-3 col-sm-6">
							<div className="card overflow-hidden">
								<div className="card-header border-0">
									<div className="d-flex">
										<span className="mt-1">
											<svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fillRule="evenodd" clipRule="evenodd" d="M17.812 48.64L11.2 53.6C10.594 54.054 9.78401 54.128 9.10602 53.788C8.42802 53.45 8.00002 52.758 8.00002 52V16C8.00002 14.896 8.89602 14 10 14H38C39.104 14 40 14.896 40 16V52C40 52.758 39.572 53.45 38.894 53.788C38.216 54.128 37.406 54.054 36.8 53.6L30.188 48.64L25.414 53.414C24.634 54.196 23.366 54.196 22.586 53.414L17.812 48.64ZM36 48V18H12V48L16.8 44.4C17.596 43.802 18.71 43.882 19.414 44.586L24 49.172L28.586 44.586C29.29 43.882 30.404 43.802 31.2 44.4L36 48ZM22 34H26C27.104 34 28 33.104 28 32C28 30.896 27.104 30 26 30H22C20.896 30 20 30.896 20 32C20 33.104 20.896 34 22 34ZM18 26H30C31.104 26 32 25.104 32 24C32 22.896 31.104 22 30 22H18C16.896 22 16 22.896 16 24C16 25.104 16.896 26 18 26Z" fill="#44814E" />
												<circle cx="43.5" cy="14.5" r="12.5" fill="#FD5353" stroke="white" strokeWidth="4" />
											</svg>

										</span>
										<div className="invoices">
											<h4>1,256</h4>
											<span>Unpaid Invoices</span>
										</div>
									</div>
								</div>
								<div className="card-body p-0">
									<div id="unpaidinvoices">
										<Unpaidinvoices />
									</div>
								</div>

							</div>
						</div>
						<div className="col-xl-3 col-sm-6">
							<div className="card overflow-hidden">
								<div className="card-header border-0">
									<div className="d-flex">
										<span className="mt-1">
											<svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path fillRule="evenodd" clipRule="evenodd" d="M17.812 48.64L11.2 53.6C10.594 54.054 9.784 54.128 9.106 53.788C8.428 53.45 8 52.758 8 52V16C8 14.896 8.896 14 10 14H38C39.104 14 40 14.896 40 16V52C40 52.758 39.572 53.45 38.894 53.788C38.216 54.128 37.406 54.054 36.8 53.6L30.188 48.64L25.414 53.414C24.634 54.196 23.366 54.196 22.586 53.414L17.812 48.64ZM36 48V18H12V48L16.8 44.4C17.596 43.802 18.71 43.882 19.414 44.586L24 49.172L28.586 44.586C29.29 43.882 30.404 43.802 31.2 44.4L36 48ZM22 34H26C27.104 34 28 33.104 28 32C28 30.896 27.104 30 26 30H22C20.896 30 20 30.896 20 32C20 33.104 20.896 34 22 34ZM18 26H30C31.104 26 32 25.104 32 24C32 22.896 31.104 22 30 22H18C16.896 22 16 22.896 16 24C16 25.104 16.896 26 18 26Z" fill="#44814E" />
												<circle cx="43.5" cy="14.5" r="12.5" fill="#FFAA2B" stroke="white" strokeWidth="4" />
											</svg>


										</span>
										<div className="invoices">
											<h4>652</h4>
											<span>Total Invoices</span>
										</div>
									</div>
								</div>
								<div className="card-body p-0">
									<div id="totalinvoicessent">
										<Totalinvoicessent />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="row">
						<div className="col-xl-12">
							<div className="card">
								<div className="card-body">
									<div className="row">
										<div className="col-xl-5 col-xxl-12 col-md-5">
											<h4 className="fs-20 text-black mb-4 font-w700">Spendings</h4>
											<div className="row">
												<div className="d-flex col-xl-12 col-xxl-6  col-md-12 col-6 mb-4">
													<svg className="me-3" width="14" height="54" viewBox="0 0 14 54" fill="none" xmlns="http://www.w3.org/2000/svg">
														<rect x="-6.10352e-05" width="14" height="54" rx="7" fill="#AC39D4" />
													</svg>
													<div>
														<p className="fs-14 mb-2">Investment</p>
														<span className="fs-16 font-w600 text-light"><span className="text-black me-2 font-w700">$1,567</span>/$5,000</span>
													</div>
												</div>
												<div className="d-flex col-xl-12 col-xxl-6 col-md-12 col-6 mb-4">
													<svg className="me-3" width="14" height="54" viewBox="0 0 14 54" fill="none" xmlns="http://www.w3.org/2000/svg">
														<rect x="-6.10352e-05" width="14" height="54" rx="7" fill="#40D4A8" />
													</svg>
													<div>
														<p className="fs-14 mb-2">Installment</p>
														<span className="fs-16 font-w600 text-light"><span className="text-black me-2 font-w700">$1,567</span>/$5,000</span>
													</div>
												</div>
												<div className="d-flex col-xl-12 col-xxl-6 col-md-12 col-6 mb-4">
													<svg className="me-3" width="14" height="54" viewBox="0 0 14 54" fill="none" xmlns="http://www.w3.org/2000/svg">
														<rect x="-6.10352e-05" width="14" height="54" rx="7" fill="#1EB6E7" />
													</svg>
													<div>
														<p className="fs-14 mb-2">Restaurant</p>
														<span className="fs-16 font-w600 text-light"><span className="text-black me-2 font-w700">$1,567</span>/$5,000</span>
													</div>
												</div>
												<div className="d-flex col-xl-12 col-xxl-6 col-md-12 col-6 mb-4">
													<svg className="me-3" width="14" height="54" viewBox="0 0 14 54" fill="none" xmlns="http://www.w3.org/2000/svg">
														<rect x="-6.10352e-05" width="14" height="54" rx="7" fill="#461EE7" />
													</svg>
													<div>
														<p className="fs-14 mb-2">Property</p>
														<span className="fs-16 font-w600 text-light"><span className="text-black me-2 font-w700">$1,567</span>/$5,000</span>
													</div>
												</div>
											</div>
										</div>
										<div className="col-xl-7  col-xxl-12 col-md-7">
											<div className="row">
												<div className="col-sm-6 mb-4">
													<div className="bg-gradient1 rounded text-center p-3">
														<div className="d-inline-block position-relative donut-chart-sale mb-3">
															<DonutChart value="60" backgroundColor="rgba(255, 255, 255,1)"
																backgroundColor2="rgba(255, 255, 255, 0.2)"
															/>
															<small className="text-white">71%</small>
														</div>
														<span className="fs-14 text-white d-block">Investment</span>
													</div>
												</div>
												<div className="col-sm-6 mb-4">
													<div className="bg-gradient2 rounded text-center p-3">
														<div className="d-inline-block position-relative donut-chart-sale mb-3">
															<DonutChart value="40" backgroundColor="rgba(255, 255, 255,1)"
																backgroundColor2="rgba(255, 255, 255, 0.2)"
															/>
															<small className="text-white">30%</small>
														</div>
														<span className="fs-14 text-white d-block">Installment</span>
													</div>
												</div>
												<div className="col-sm-6 mb-sm-0 mb-4">
													<div className="rounded text-center p-3 bg-gradient3">
														<div className="d-inline-block position-relative donut-chart-sale mb-3">
															<DonutChart value="12" backgroundColor="rgba(255, 255, 255,1)"
																backgroundColor2="rgba(255, 255, 255, 0.2)"
															/>
															<small className="text-white">5%</small>
														</div>
														<span className="fs-14 text-white d-block">Restaurant</span>
													</div>
												</div>
												<div className="col-sm-6 mb-sm-0 mb-4">
													<div className="rounded text-center p-3 bg-gradient4">
														<div className="d-inline-block position-relative donut-chart-sale mb-3">
															<DonutChart value="90" backgroundColor="rgba(255, 255, 255,1)"
																backgroundColor2="rgba(255, 255, 255, 0.2)"
															/>
															<small className="text-white">96%</small>
														</div>
														<span className="fs-14 text-white d-block">Property</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12">
							<div className="card">
								<div className="card-header d-sm-flex d-block border-0 pb-0">
									<div className="pe-3 me-auto mb-sm-0 mb-3">
										<h4 className="fs-20 text-black mb-1 font-w700">Transaction Overview</h4>
										<span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
									</div>
									<div className="d-flex align-items-center justify-content-between">
										<Link to={"#"} className="btn btn-outline-primary me-3"><i className="las la-download text-primary scale5 me-3"></i>Download Report</Link>
										<Dropdown className="dropdown">
											<Dropdown.Toggle as="div" className="btn-link i-false">
												<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="5" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="19" cy="12" r="2"></circle></g></svg>
											</Dropdown.Toggle>
											<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
												<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
												<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>
									</div>
								</div>
								<div className="card-body">
									<div id="chartBar" className="chartBar">
										<ChartBarApex />
									</div>
									<div className="d-flex justify-content-between flex-wrap">
										<div className="d-flex">
											<label className="form-check-label font-w600 fs-16" htmlFor="flexSwitchCheckChecked1"
											>Number
											</label>
											<div className="form-check form-switch toggle-switch">
												<input className="form-check-input custome" type="checkbox"
													id="flexSwitchCheckChecked1"
													defaultChecked
												/>
											</div>
											<label className="form-check-label font-w600 fs-16" hmtlFor="flexSwitchCheckChecked2">Analytics</label>
											<div className="form-check form-switch toggle-switch">
												<input className="form-check-input custome" type="checkbox"
													defaultChecked
													id="flexSwitchCheckChecked2"
												/>
											</div>
										</div>
										<div>
											<span className="fs-16 font-w600">
												<svg className="me-2" width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
													<rect x="0.639771" width="18.9471" height="19" rx="9.47357" fill="#09BD3C" />
												</svg>
												Income
											</span>
											<span className="fs-16 font-w600">
												<svg className="mx-2" width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
													<rect x="0.344925" width="18.9471" height="19" rx="9.47357" fill="#FD5353" />
												</svg>
												Expense
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-12">
							<div className="card overflow-hidden">
								<div className="card-header d-sm-flex d-block border-0 pb-0">
									<div className="mb-sm-0 mb-2">
										<p className="fs-14 mb-1 font-w700">Weekly Wallet Usage</p>
										<span className="mb-0">
											<svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M11.9999 6L5.99994 -2.62268e-07L-6.10352e-05 6" fill="#2BC155" />
											</svg>
											<strong className="fs-32 text-black ms-2 me-3 font-w800">43%</strong>Than last week
										</span>
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
										4% (30 days)
									</span>
								</div>
								<div className="card-body p-0">									
									<WidgetChart3 />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6">
					<div className="row">
						<div className="col-xl-12">
							<div className="row">
								<div className="col-xl-6 col-xxl-12 col-sm-6">
									<div className="card">
										<div className="card-header border-0 pb-0">
											<div>
												<h4 className="mb-2 font-w700">Quick Transfer</h4>
												<span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
											</div>
											<Dropdown className="dropdown">
												<Dropdown.Toggle as="div" className="btn-link i-false">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
														<path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
														<path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
													</svg>
												</Dropdown.Toggle>
												<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
													<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
													<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
										<div className="card-body">
											<div className="user-bx">
												<img src={small} alt="" />
												<div>
													<h6 className="user-name">Samuel</h6>
													<span className="meta">@sam224</span>
												</div>
												<i className="las la-check-circle check-icon"></i>
											</div>
											<h4 className="mt-3 mb-3">Recent Friend<Link to={"#"} className="fs-16 float-end text-secondary font-w600">See More</Link></h4>
											<ul className="user-list">
												<li><img src={avt1} alt="" /></li>
												<li><img src={avt2} alt="" /></li>
												<li><img src={avt3} alt="" /></li>
												<li><img src={avt4} alt="" /></li>
												<li><img src={avt5} alt="" /></li>
												<li><img src={avt6} alt="" /></li>
											</ul>
											<h4 className="mt-3 mb-0">Insert Amount</h4>
											<div className="format-slider">												
												<div id="slider-format">
													<NouiRangeSlider />
												</div>

											</div>
											<div className="text-secondary fs-16 d-flex justify-content-between font-w600 mt-4">
												<span>Your Balance</span>
												<span>$ 456,345.62</span>
											</div>
										</div>
										<div className="card-footer border-0 pt-0">
											<Link to={"#"} className="btn btn-primary d-block btn-lg text-uppercase">Transfer Now</Link>
										</div>
									</div>
								</div>
								<div className="col-xl-6 col-xxl-12 col-sm-6">
									<div className="card">
										<div className="card-header border-0 pb-0">
											<div>
												<h4 className="mb-2 fs-20 font-w700">Bar Spendings</h4>
												<span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
											</div>

											<Dropdown className="dropdown">
												<Dropdown.Toggle as="div" className="btn-link i-false">
													<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
														<path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
														<path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
													</svg>
												</Dropdown.Toggle>
												<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
													<Dropdown.Item className="dropdown-item">Delete</Dropdown.Item>
													<Dropdown.Item className="dropdown-item">Edit</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
										<div className="card-body">
											<div className="progress default-progress">
												<div className="progress-bar bg-gradient1 progress-animated" style={{ width: "45%", height: "20px" }}>
													<span className="sr-only">45% Complete</span>
												</div>
											</div>
											<div className="d-flex align-items-end mt-2 pb-3 justify-content-between">
												<span>Investment</span>
												<span className="fs-16 font-w600 text-light"><span className="text-black pe-2">$1415</span>/$2000</span>
											</div>
											<div className="progress default-progress mt-4">
												<div className="progress-bar bg-gradient2 progress-animated" style={{ width: "70%", height: "20px" }} >
													<span className="sr-only">70% Complete</span>
												</div>
											</div>
											<div className="d-flex align-items-end mt-2 pb-3 justify-content-between">
												<span>Restaurant</span>
												<span className="fs-16 font-w600 text-light"><span className="text-black pe-2">$1567</span>/$5000</span>
											</div>
											<div className="progress default-progress mt-4">
												<div className="progress-bar bg-gradient4 progress-animated" style={{ width: "35%", height: "20px" }} >
													<span className="sr-only">35% Complete</span>
												</div>
											</div>
											<div className="d-flex align-items-end mt-2 pb-3 justify-content-between">
												<span>Installment</span>
												<span className="fs-16 font-w600 text-light"><span className="text-black pe-2">$487</span>/$10000</span>
											</div>
											<div className="progress default-progress mt-4">
												<div className="progress-bar bg-gradient3 progress-animated" style={{ width: "95%", height: "20px" }}>
													<span className="sr-only">95% Complete</span>
												</div>
											</div>
											<div className="d-flex align-items-end mt-2 justify-content-between">
												<span>Property</span>
												<span className="fs-16 font-w600 text-light"><span className="text-black pe-2">$3890</span>/$4000</span>
											</div>
										</div>
										<div className="card-footer border-0 pt-0">
											<Link to={"#"} className="btn btn-outline-primary d-block btn-lg">View More</Link>
										</div>
									</div>
								</div>

							</div>
						</div>
						<div className="col-xl-12">
							<PreviousTransactions />
						</div>
					</div>
				</div>

			</div>
		</>
	)
}
export default DashboardDark;