import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

import profile from './../../../assets/images/profile/pic2.jpg';
import wave from './../../../assets/images/pattern/wave-dec.png';
import circle from './../../../assets/images/pattern/circle.png';
import circle1 from './../../../assets/images/pattern/circles1.png';

import ActivityChart from './Transaction/ActivityChart';

const TransactionDetails = () => {
	return (
		<>
			<div className="row">
				<div className="col-xl-12">
					<div className="card">
						<div className="card-body pb-3">
							<div className="row align-items-center">
								<div className="col-xl-3 mb-3">
									<p className="mb-2 fs-16 font-w600">ID Payment</p>
									<h2 className="mb-0 fs-32 font-w800">#00123521</h2>
								</div>
								<div className="col-xl-9 d-flex flex-wrap justify-content-between align-items-center">
									<div className="d-flex me-3 mb-3 ms-2 align-items-start payment">
										<i className="fas fa-phone-alt me-4 mt-2 scale5"></i>
										<div>
											<p className="mb-2 fs-16 font-w600">Telephone</p>
											<h4 className="mb-0 fs-18 font-w700">+12 345 5662 66</h4>
										</div>
									</div>
									<div className="d-flex me-3 mb-3 ms-2 align-items-start payment">
										<i className="fas fa-envelope scale5 me-4 mt-2"></i>
										<div>
											<p className="mb-2 fs-16 font-w600">Email</p>
											<h4 className="mb-0 fs-18 font-w700">samuelbro@mail.com</h4>
										</div>
									</div>
									<div className="d-flex mb-3">
										<Link to={"#"} className="btn btn-primary light me-3"><i className="las la-print me-3 scale5"></i>Print</Link>
										<Link to={"#"} className="btn btn-primary"><i className="las la-download scale5 me-3"></i>Download Report</Link>
									</div>
								</div>
							</div>
						</div>
						<div className="card-body pb-3 transaction-details d-flex flex-wrap justify-content-between align-items-center">
							<div className="user-bx-2 me-3 mb-3">
								<img src={profile} className="rounded" alt="" />
								<div>
									<h3 className="fs-20 font-w700">Richard Michael</h3>
									<span className="font-w400">@richardmichael</span>
								</div>
							</div>
							<div className="me-3 mb-3">
								<p className="mb-2">Payment Method</p>
								<h4 className="mb-0">MasterCard 404</h4>
							</div>
							<div className="me-3 mb-3">
								<p className="mb-2">Invoice Date</p>
								<h4 className="mb-0">April 29, 2020</h4>
							</div>
							<div className="me-3 mb-3">
								<p className="mb-2">Due Date</p>
								<h4 className="mb-0">June 5, 2020</h4>
							</div>
							<div className="me-3 mb-3">
								<p className="mb-2">Date Paid</p>
								<h4 className="mb-0">June 4, 2020</h4>
							</div>
							<div className="amount-bx mb-3 border">
								<i className="fas fa-dollar-sign"></i>
								<div>
									<p className="mb-1">Amount</p>
									<h3 className="mb-0">$ 986.23</h3>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-12">
					<div className="card">
						<div className="card-body">
							<div className="d-xl-flex d-block align-items-start description-bx">
								<div>
									<h4 className="fs-20 font-w700">Description</h4>
									<span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
									<p className="description mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
								</div>
								<div className="card-bx bg-purple ms-xl-5 ms-0">
									<img className="pattern-img" src={wave} alt="" />
									<div className="card-info text-white">
										<div className="d-flex justify-content-between">
											<img src={circle} className="mb-4" alt="" />
											<img src={circle1} className="mb-4" alt="" />
										</div>

										<h2 className="text-white card-balance">$62,467</h2>
										<p className="fs-16">Wallet Balance</p>
										<span>+0,8% than last week</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-xxl-4">
					<div className="card">
						<div className="card-header border-0 pb-0">
							<div>
								<h4 className="fs-20 font-w700 mb-2">Specifics</h4>
								<span className="fs-14">Lorem ipsum dolor sit amet, consectetur</span>
							</div>
						</div>
						<div className="card-body pt-3">
							<p className="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tem</p>
							<ul className="specifics-list">
								<li>
									<span className="bg-blue"></span>
									<div>
										<h4>63,876</h4>
										<span>Property Sold</span>
									</div>
								</li>
								<li>
									<span className="bg-orange"></span>
									<div>
										<h4>97,125</h4>
										<span>Income</span>
									</div>
								</li>
								<li>
									<span className="bg-primary"></span>
									<div>
										<h4>872,235</h4>
										<span>Expense</span>
									</div>
								</li>
								<li>
									<span className="bg-danger"></span>
									<div>
										<h4>21,224</h4>
										<span>Property Ranted</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="col-xl-9 col-xxl-8">
					<div className="card">
						<div className="card-header border-0 pb-0">
							<div>
								<h4 className="fs-20 font-w700 mb-2">Chart Activity</h4>
								<span className="fs-14">Lorem ipsum dolor sit amet, consectetur</span>
							</div>
							<div className="d-flex align-items-center">
								<div>
									<span className="text-danger fs-20 font-w700 me-3 d-flex">
										<svg className="me-3" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M12.9996 25.56C7.15452 25.56 1.9398 21.3587 0.717079 15.6378C0.106199 12.7792 0.51772 9.73953 1.8806 7.15297C3.19228 4.66369 5.34268 2.65185 7.91548 1.51169C10.5916 0.325453 13.664 0.118734 16.4768 0.927694C19.1904 1.70785 21.5964 3.42017 23.2345 5.71873C26.6595 10.5242 26.2016 17.2739 22.1721 21.5802C19.8108 24.1037 16.4563 25.56 12.9996 25.56ZM13.678 19.0173L17.1852 15.5098C18.0608 14.6343 16.703 13.2765 15.8275 14.1523L14.0659 15.9143V7.76769C14.0659 7.18657 13.5804 6.70145 12.9993 6.70145C12.4182 6.70145 11.9328 7.18657 11.9328 7.76769V15.9549L10.1635 14.2275C9.27964 13.3639 7.93436 14.7341 8.82236 15.6013L12.3289 19.0253C12.7046 19.3927 13.3062 19.3891 13.678 19.0173Z" fill="#FD5353" />
										</svg>
										-0,8%
										<small className="fs-14 text-black ms-3 mb-0 mt-1 font-w400">than last week</small>
									</span>
								</div>
								<Dropdown className="dropdown">
									<Dropdown.Toggle as="div" className="btn-link i-false" data-bs-toggle="dropdown" aria-expanded="false">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
											<path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
											<path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#575757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
										</svg>
									</Dropdown.Toggle>
									<Dropdown.Menu className="dropdown-menu dropdown-menu-right" style={{ margin: "0px" }}>
										<Dropdown.Item>Delete</Dropdown.Item>
										<Dropdown.Item>Edit</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</div>
						</div>
						<div className="card-body py-0 px-2">
							<div id="activityChart" className="activityChart">
								<ActivityChart />
							</div>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}
export default TransactionDetails;