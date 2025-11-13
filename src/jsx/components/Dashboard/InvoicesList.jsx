import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Modal, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';

const InvoiceActionsDropdown = ({ invoice, onView, onWithdraw, onDownload, onTrackPayment }) => {
	const getActionButtons = () => {
		switch (invoice.status) {
			case 'Pending Buyer Approval':
				return (
					<>
						<Button variant="outline-primary" size="sm" className="me-2" onClick={() => onView(invoice)}>
							<i className="fas fa-eye me-1"></i>View
						</Button>
						<Button variant="outline-danger" size="sm" onClick={() => onWithdraw(invoice)}>
							<i className="fas fa-times me-1"></i>Withdraw
						</Button>
					</>
				);
			case 'Approved':
				return (
					<>
						<Button variant="outline-primary" size="sm" className="me-2" onClick={() => onView(invoice)}>
							<i className="fas fa-eye me-1"></i>View
						</Button>
						<Button variant="outline-success" size="sm" onClick={() => onDownload(invoice)}>
							<i className="fas fa-download me-1"></i>Download PDF
						</Button>
					</>
				);
			case 'Funded':
				return (
					<>
						<Button variant="outline-primary" size="sm" className="me-2" onClick={() => onView(invoice)}>
							<i className="fas fa-eye me-1"></i>View
						</Button>
						<Button variant="outline-info" size="sm" onClick={() => onTrackPayment(invoice)}>
							<i className="fas fa-search me-1"></i>Track Payment
						</Button>
					</>
				);
			case 'Rejected':
				return (
					<>
						<Button variant="outline-primary" size="sm" className="me-2" onClick={() => onView(invoice)}>
							<i className="fas fa-eye me-1"></i>View
						</Button>
						<Button variant="outline-warning" size="sm">
							<i className="fas fa-edit me-1"></i>Edit & Resubmit
						</Button>
					</>
				);
			default:
				return (
					<Button variant="outline-primary" size="sm" onClick={() => onView(invoice)}>
						<i className="fas fa-eye me-1"></i>View
					</Button>
				);
		}
	};

	return (
		<div className="d-flex flex-wrap gap-1">
			{getActionButtons()}
		</div>
	);
};

const InvoicesList = () => {
	const [invoices, setInvoices] = useState([]);
	const [filteredInvoices, setFilteredInvoices] = useState([]);
	const [showViewModal, setShowViewModal] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [statusFilter, setStatusFilter] = useState('All');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 8;

	// Load invoices from localStorage and combine with dummy data
	useEffect(() => {
		const loadInvoices = () => {
			// Load real invoices from localStorage
			const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
			
			// Dummy invoices for demonstration
			const dummyInvoices = [
				{
					invoiceNumber: 'INV-001',
					projectName: 'Solar Plant Project',
					buyerName: 'XYZ Energy',
					milestoneDescription: 'Initial Setup & Planning',
					totalAmount: 1180000,
					status: 'Pending Buyer Approval',
					invoiceDate: '2025-11-10',
					dueDate: '2025-11-25',
					gstAmount: 180000,
					subtotal: 1000000,
					createdAt: '2025-11-10T08:30:00Z',
					invoiceType: 'milestone'
				},
				{
					invoiceNumber: 'INV-002',
					projectName: 'Solar Plant Project',
					buyerName: 'XYZ Energy',
					milestoneDescription: 'Development & Testing',
					totalAmount: 1770000,
					status: 'Approved',
					invoiceDate: '2025-11-05',
					dueDate: '2025-11-20',
					gstAmount: 270000,
					subtotal: 1500000,
					createdAt: '2025-11-05T10:15:00Z',
					invoiceType: 'milestone',
					approvedOn: '2025-11-06'
				},
				{
					invoiceNumber: 'INV-003',
					projectName: 'Port Automation System',
					buyerName: 'ABC Infrastructure',
					milestoneDescription: 'Core Development',
					totalAmount: 590000,
					status: 'Funded',
					invoiceDate: '2025-11-01',
					dueDate: '2025-11-15',
					gstAmount: 90000,
					subtotal: 500000,
					createdAt: '2025-11-01T14:20:00Z',
					invoiceType: 'milestone',
					approvedOn: '2025-11-02',
					fundedOn: '2025-11-03',
					fundedAmount: 554500
				},
				{
					invoiceNumber: 'INV-004',
					projectName: 'E-commerce Platform',
					buyerName: 'RetailMax India',
					milestoneDescription: 'UI/UX Design Phase',
					totalAmount: 354000,
					status: 'Rejected',
					invoiceDate: '2025-10-28',
					dueDate: '2025-11-12',
					gstAmount: 54000,
					subtotal: 300000,
					createdAt: '2025-10-28T11:45:00Z',
					invoiceType: 'milestone',
					rejectedOn: '2025-10-30',
					rejectionReason: 'Incomplete deliverables documentation'
				}
			];

			// Combine real and dummy invoices
			const allInvoices = [...savedInvoices, ...dummyInvoices];
			setInvoices(allInvoices);
			setFilteredInvoices(allInvoices);
		};

		loadInvoices();

		// Listen for new invoice creation
		const handleInvoiceCreated = (event) => {
			loadInvoices();
		};

		window.addEventListener('invoiceCreated', handleInvoiceCreated);
		return () => window.removeEventListener('invoiceCreated', handleInvoiceCreated);
	}, []);

	// Filter invoices by status
	useEffect(() => {
		if (statusFilter === 'All') {
			setFilteredInvoices(invoices);
		} else {
			setFilteredInvoices(invoices.filter(invoice => invoice.status === statusFilter));
		}
		setCurrentPage(1);
	}, [statusFilter, invoices]);

	// Pagination
	const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

	const getStatusBadge = (status) => {
		const statusConfig = {
			'Pending Buyer Approval': { bg: 'warning', icon: 'fa-clock', text: '🟡 Pending Buyer Approval' },
			'Approved': { bg: 'success', icon: 'fa-check', text: '🟢 Approved' },
			'Funded': { bg: 'info', icon: 'fa-coins', text: '🔵 Funded' },
			'Rejected': { bg: 'danger', icon: 'fa-times', text: '🔴 Rejected' },
			'Modification Requested': { bg: 'secondary', icon: 'fa-edit', text: '⚪ Modification Requested' }
		};
		
		const config = statusConfig[status] || { bg: 'secondary', icon: 'fa-question', text: status };
		
		return (
			<Badge bg={config.bg} className="fs-6 px-3 py-2">
				<i className={`fas ${config.icon} me-2`}></i>
				{config.text}
			</Badge>
		);
	};

	const handleView = (invoice) => {
		setSelectedInvoice(invoice);
		setShowViewModal(true);
	};

	const handleWithdraw = (invoice) => {
		if (window.confirm(`Are you sure you want to withdraw invoice ${invoice.invoiceNumber}?`)) {
			const updatedInvoices = invoices.filter(inv => inv.invoiceNumber !== invoice.invoiceNumber);
		setInvoices(updatedInvoices);
		localStorage.setItem('invoices', JSON.stringify(updatedInvoices.filter(inv => !inv.invoiceNumber.startsWith('INV-00'))));
		showNotification(
			'Invoice Withdrawn',
			'Invoice withdrawn successfully!',
			'success'
		);
		}
	};

	const handleDownload = (invoice) => {
		const notificationId = showLoadingNotification('Preparing Download', 'Generating PDF...');
		
		setTimeout(() => {
			updateLoadingNotification(
				notificationId, 
				'Download Ready!', 
				`PDF for invoice ${invoice.invoiceNumber} is ready for download.`, 
				'success', 
				true
			);
		}, 1500);
	};

	const handleTrackPayment = (invoice) => {
		showNotification(
			'Payment Tracking',
			`Tracking payment for invoice ${invoice.invoiceNumber}. Current status: ${invoice.status}`,
			'info'
		);
	};

	return (
		<>
			<div className="d-flex mb-4">
				<div className="mb-3 align-items-center me-auto">
					<h4 className="fs-24 font-w800 text-primary">
						<i className="fas fa-file-invoice me-3"></i>
						Invoice Management Hub
					</h4>
					<span className="fs-14 text-muted">Track all your invoices, payment status, and buyer approvals</span>
				</div>
				<div className="d-flex gap-3">
					<div className="d-flex align-items-center">
						<label className="me-2 fw-bold">Filter by Status:</label>
						<select 
							className="form-select form-select-sm"
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							style={{minWidth: '200px'}}
						>
							<option value="All">All Statuses</option>
							<option value="Pending Buyer Approval">🟡 Pending Approval</option>
							<option value="Approved">🟢 Approved</option>
							<option value="Funded">🔵 Funded</option>
							<option value="Rejected">🔴 Rejected</option>
						</select>
					</div>
					{/* <Link to="/create-invoices" className="btn btn-primary">
						<i className="fa fa-plus me-2"></i>New Invoice
					</Link> */}
				</div>
			</div>

			<div className="row">
				<div className="col-xl-12">
					<Card>
						<Card.Header className="bg-light border-0">
							<div className="d-flex justify-content-between align-items-center">
								<div>
									<h5 className="mb-1 text-dark fw-bold">Invoices Overview</h5>
									<small className="text-muted">Total: {filteredInvoices.length} invoices</small>
								</div>
								<div className="d-flex gap-3">
									<Badge bg="warning" className="fs-6">
										Pending: {invoices.filter(inv => inv.status === 'Pending Buyer Approval').length}
									</Badge>
									<Badge bg="success" className="fs-6">
										Approved: {invoices.filter(inv => inv.status === 'Approved').length}
									</Badge>
									<Badge bg="info" className="fs-6">
										Funded: {invoices.filter(inv => inv.status === 'Funded').length}
									</Badge>
								</div>
							</div>
						</Card.Header>
						<Card.Body className="p-0">
							<div className="table-responsive">
								<Table hover className="mb-0">
									<thead className="bg-primary text-white">
										<tr>
											<th className="border-0 py-3 px-4 fw-bold">
												<i className="fas fa-hashtag me-2"></i>
												Invoice No
											</th>
											<th className="border-0 py-3 px-4 fw-bold">
												<i className="fas fa-project-diagram me-2"></i>
												Project
											</th>
											<th className="border-0 py-3 px-4 fw-bold">
												<i className="fas fa-building me-2"></i>
												Buyer
											</th>
											<th className="border-0 py-3 px-4 fw-bold">
												<i className="fas fa-flag me-2"></i>
												Milestone
											</th>
											<th className="border-0 py-3 px-4 fw-bold">
												<i className="fas fa-rupee-sign me-2"></i>
												Amount
											</th>
											<th className="border-0 py-3 px-4 fw-bold">
												<i className="fas fa-signal me-2"></i>
												Status
											</th>
											<th className="border-0 py-3 px-4 fw-bold">
												<i className="fas fa-calendar me-2"></i>
												Raised On
											</th>
											<th className="border-0 py-3 px-4 fw-bold">
												<i className="fas fa-cogs me-2"></i>
												Actions
											</th>
										</tr>
									</thead>
									<tbody>
										{currentInvoices.length > 0 ? currentInvoices.map((invoice, index) => (
											<tr key={invoice.invoiceNumber || index} className="border-bottom">
												<td className="py-3 px-4">
													<div className="fw-bold text-primary fs-6">
														{invoice.invoiceNumber}
													</div>
													<small className="text-muted">
														{new Date(invoice.createdAt).toLocaleDateString('en-IN')}
													</small>
												</td>
												<td className="py-3 px-4">
													<div className="fw-bold text-dark">
														{invoice.projectName}
													</div>
													<small className="text-muted">
														Contract: {invoice.contractReference || invoice.projectId}
													</small>
												</td>
												<td className="py-3 px-4">
													<div className="d-flex align-items-center">
														<div className="me-3">
															<div 
																className="rounded-circle d-flex align-items-center justify-content-center"
																style={{width: '40px', height: '40px', backgroundColor: '#007bff'}}
															>
																<i className="fas fa-building text-white"></i>
															</div>
														</div>
														<div>
															<div className="fw-bold text-dark">
																{invoice.buyerName}
															</div>
															<small className="text-muted">Enterprise Client</small>
														</div>
													</div>
												</td>
												<td className="py-3 px-4">
													<div className="fw-medium text-dark">
														{invoice.milestoneDescription || 'Full Project'}
													</div>
													<small className="text-muted">
														{invoice.invoiceType === 'milestone' ? 'Milestone Invoice' : 'Project Invoice'}
													</small>
												</td>
												<td className="py-3 px-4">
													<div className="fw-bold text-success fs-6">
														₹{invoice.totalAmount.toLocaleString('en-IN')}
													</div>
													<small className="text-muted">
														GST: ₹{invoice.gstAmount.toLocaleString('en-IN')}
													</small>
												</td>
												<td className="py-3 px-4">
													{getStatusBadge(invoice.status)}
													{invoice.status === 'Funded' && (
														<div className="mt-1">
															<small className="text-success fw-medium">
																<i className="fas fa-coins me-1"></i>
																Funded: ₹{invoice.fundedAmount?.toLocaleString('en-IN') || 'Processing'}
															</small>
														</div>
													)}
													{invoice.status === 'Rejected' && (
														<div className="mt-1">
															<small className="text-danger">
																<i className="fas fa-exclamation-triangle me-1"></i>
																{invoice.rejectionReason || 'Rejected by buyer'}
															</small>
														</div>
													)}
												</td>
												<td className="py-3 px-4">
													<div className="fw-medium text-dark">
														{new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
															day: '2-digit',
															month: 'short',
															year: 'numeric'
														})}
													</div>
													<small className="text-muted">
														Due: {new Date(invoice.dueDate).toLocaleDateString('en-IN', {
															day: '2-digit',
															month: 'short'
														})}
													</small>
												</td>
												<td className="py-3 px-4">
													<InvoiceActionsDropdown
														invoice={invoice}
														onView={handleView}
														onWithdraw={handleWithdraw}
														onDownload={handleDownload}
														onTrackPayment={handleTrackPayment}
													/>
												</td>
											</tr>
										)) : (
											<tr>
												<td colSpan="8" className="text-center py-5">
													<div className="text-muted">
														<i className="fas fa-file-invoice fa-3x mb-3 opacity-50"></i>
														<h5>No invoices found</h5>
														<p>Create your first invoice to get started</p>
														<Link to="/create-invoices" className="btn btn-primary">
															<i className="fas fa-plus me-2"></i>
															Create Invoice
														</Link>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</Table>
							</div>
						</Card.Body>
					</Card>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="d-flex justify-content-between align-items-center mt-4">
							<div className="text-muted">
								Showing {startIndex + 1} to {Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} entries
							</div>
							<div className="d-flex gap-2">
								<Button 
									variant="outline-primary" 
									size="sm"
									disabled={currentPage === 1}
									onClick={() => setCurrentPage(currentPage - 1)}
								>
									<i className="fas fa-chevron-left"></i>
								</Button>
								
								{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
									<Button
										key={page}
										variant={currentPage === page ? "primary" : "outline-primary"}
										size="sm"
										onClick={() => setCurrentPage(page)}
									>
										{page}
									</Button>
								))}
								
								<Button 
									variant="outline-primary" 
									size="sm"
									disabled={currentPage === totalPages}
									onClick={() => setCurrentPage(currentPage + 1)}
								>
									<i className="fas fa-chevron-right"></i>
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Invoice View Modal */}
			<Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>
						<i className="fas fa-file-invoice me-2"></i>
						Invoice Details - {selectedInvoice?.invoiceNumber}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedInvoice && (
						<>
							<Row className="mb-4">
								<Col md={6}>
									<Card className="h-100 border-primary">
										<Card.Header className="bg-primary text-white">
											<h6 className="mb-0 fw-bold">
												<i className="fas fa-info-circle me-2"></i>
												Invoice Information
											</h6>
										</Card.Header>
										<Card.Body>
											<div className="mb-3">
												<strong>Invoice Number:</strong>
												<div className="text-muted">{selectedInvoice.invoiceNumber}</div>
											</div>
											<div className="mb-3">
												<strong>Project:</strong>
												<div className="text-muted">{selectedInvoice.projectName}</div>
											</div>
											<div className="mb-3">
												<strong>Buyer:</strong>
												<div className="text-muted">{selectedInvoice.buyerName}</div>
											</div>
											<div className="mb-3">
												<strong>Milestone:</strong>
												<div className="text-muted">{selectedInvoice.milestoneDescription}</div>
											</div>
											<div>
												<strong>Status:</strong>
												<div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
											</div>
										</Card.Body>
									</Card>
								</Col>
								<Col md={6}>
									<Card className="h-100 border-success">
										<Card.Header className="bg-success text-white">
											<h6 className="mb-0 fw-bold">
												<i className="fas fa-rupee-sign me-2"></i>
												Payment Details
											</h6>
										</Card.Header>
										<Card.Body>
											<div className="mb-3">
												<strong>Subtotal:</strong>
												<div className="text-success fw-bold">₹{selectedInvoice.subtotal?.toLocaleString('en-IN')}</div>
											</div>
											<div className="mb-3">
												<strong>GST Amount:</strong>
												<div className="text-warning fw-bold">₹{selectedInvoice.gstAmount?.toLocaleString('en-IN')}</div>
											</div>
											<div className="mb-3">
												<strong>Total Amount:</strong>
												<div className="text-primary fw-bold fs-5">₹{selectedInvoice.totalAmount?.toLocaleString('en-IN')}</div>
											</div>
											<div className="mb-3">
												<strong>Due Date:</strong>
												<div className="text-muted">{new Date(selectedInvoice.dueDate).toLocaleDateString('en-IN')}</div>
											</div>
											{selectedInvoice.fundedAmount && (
												<div>
													<strong>Funded Amount:</strong>
													<div className="text-success fw-bold">₹{selectedInvoice.fundedAmount.toLocaleString('en-IN')}</div>
												</div>
											)}
										</Card.Body>
									</Card>
								</Col>
							</Row>

							{selectedInvoice.remarks && (
								<div className="mb-3">
									<strong>Remarks:</strong>
									<div className="text-muted mt-1">{selectedInvoice.remarks}</div>
								</div>
							)}

							{selectedInvoice.rejectionReason && (
								<Alert variant="danger">
									<strong>Rejection Reason:</strong> {selectedInvoice.rejectionReason}
								</Alert>
							)}
						</>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowViewModal(false)}>
						Close
					</Button>
					{selectedInvoice?.status === 'Approved' && (
						<Button variant="success" onClick={() => handleDownload(selectedInvoice)}>
							<i className="fas fa-download me-2"></i>
							Download PDF
						</Button>
					)}
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default InvoicesList;