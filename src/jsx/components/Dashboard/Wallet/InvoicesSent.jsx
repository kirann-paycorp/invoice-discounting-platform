import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//Images
import avt1 from './../../../../assets/images/avatar/1.jpg';
import avt2 from './../../../../assets/images/avatar/2.jpg';
import avt3 from './../../../../assets/images/avatar/3.jpg';
import avt4 from './../../../../assets/images/avatar/4.jpg';
import avt5 from './../../../../assets/images/avatar/5.jpg';

const InvoiceList = [
	{ image: avt1, title: 'FSoziety', doller: '25', },
	{ image: avt2, title: 'FSoziety2', doller: '36', },
	{ image: avt3, title: 'FSoziety3', doller: '47', },
	{ image: avt4, title: 'FSoziety4', doller: '58', },
	{ image: avt5, title: 'FSoziety5', doller: '69', },
];

const InvoicesSent = () => {
	const [data, setData] = useState(InvoiceList);
	const [refresh, setRefresh] = useState(false);
	const onClick = () => {
		setRefresh(true);
		setTimeout(() => {
			setData([
				...data,
				data[Math.floor(Math.random() * Math.floor(data.length - 1))],
			]);
			setRefresh(false);
		}, 1000);
	};
	return (
		<>
			<div className="card">
				<div className="card-header d-block d-sm-flex border-0">
					<div>
						<h4 className="card-title mb-2">Invoices Sent</h4>
						<span className="fs-12">Lorem ipsum dolor sit amet, consectetur</span>
					</div>
				</div>
				<div className="card-body p-0 loadmore-content recent-activity-wrapper">
					{data.map((item, index) => (
						<div className="invoice-list" key={index}>
							<img src={item.image} alt="" className="rounded-circle me-3" />
							<div className="me-auto">
								<h6 className="fs-18 font-w700 mb-0"><Link to={"#"} className="text-black">{item.title}</Link></h6>
								<span className="fs-14 font-w700">4h ago</span>
							</div>
							<span className="fs-16 text-primary font-w600">${item.doller}</span>
						</div>
					))}
				</div>
				<div className="card-footer border-0">
					<Link to={"#"} className="btn btn-primary d-block btn-lg  dlab-load-more" onClick={() => onClick()}>View More {" "}
						{refresh && <i className="fas fa-sync"></i>}
					</Link>
				</div>
			</div>
		</>
	)
}

export default InvoicesSent;