import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Table, Alert, Button, ProgressBar, Modal, Form } from 'react-bootstrap';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';

const FinancierDashboard = () => {
    // State management
    const [availableInvoices, setAvailableInvoices] = useState([]);
    const [fundedInvoices, setFundedInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showFundingModal, setShowFundingModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [fundingData, setFundingData] = useState({
        discountRate: '',
        fundingAmount: '',
        remarks: ''
    });
    const [notifications, setNotifications] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Dashboard metrics
    const [dashboardMetrics, setDashboardMetrics] = useState({
        totalInvoicesAvailable: 0,
        invoicesFunded: 0,
        totalAmountDisbursed: 0,
        pendingSettlements: 0,
        returnsEarned: 0
    });

    // Load financier data
    const loadFinancierData = () => {
        try {
            // Load approved invoices available for funding
            const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
            const approvedInvoices = savedInvoices.filter(invoice => 
                invoice.status === 'Approved' || invoice.status === 'Buyer Approved'
            );
            setAvailableInvoices(approvedInvoices);

            // Load funded invoices
            const savedFundedInvoices = JSON.parse(localStorage.getItem('fundedInvoices') || '[]');
            setFundedInvoices(savedFundedInvoices);

            // Calculate metrics
            const totalAvailable = approvedInvoices.length;
            const totalFunded = savedFundedInvoices.length;
            const totalDisbursed = savedFundedInvoices.reduce((sum, inv) => sum + parseFloat(inv.fundedAmount || 0), 0);
            const pendingSettlements = savedFundedInvoices.filter(inv => inv.status === 'Active').length;
            const totalReturns = savedFundedInvoices
                .filter(inv => inv.status === 'Settled')
                .reduce((sum, inv) => sum + parseFloat(inv.expectedReturn || 0), 0);

            setDashboardMetrics({
                totalInvoicesAvailable: totalAvailable,
                invoicesFunded: totalFunded,
                totalAmountDisbursed: totalDisbursed,
                pendingSettlements: pendingSettlements,
                returnsEarned: totalReturns
            });

            // Load notifications
            const savedNotifications = JSON.parse(localStorage.getItem('financierNotifications') || '[]');
            setNotifications(savedNotifications.slice(0, 5)); // Show latest 5

        } catch (error) {
            console.error('Error loading financier data:', error);
        }
    };

    // Calculate funding details
    const calculateFundingDetails = (invoice, discountRate, fundingAmount) => {
        const amount = parseFloat(fundingAmount || invoice.totalAmount);
        const rate = parseFloat(discountRate || 12);
        const days = invoice.dueDate ? 
            Math.ceil((new Date(invoice.dueDate) - new Date(invoice.invoiceDate)) / (1000 * 60 * 60 * 24)) : 30;
        
        const discountAmount = (amount * rate * days) / (365 * 100);
        const netAmount = amount - discountAmount;
        const expectedReturn = amount;

        return {
            fundingAmount: amount,
            discountAmount,
            netAmount,
            expectedReturn,
            tenure: days,
            interestEarned: discountAmount
        };
    };

    // Handle invoice funding
    const handleFundInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setFundingData({
            discountRate: '12',
            fundingAmount: invoice.totalAmount,
            remarks: ''
        });
        setShowFundingModal(true);
    };

    // View invoice details
    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setShowInvoiceModal(true);
    };

    // Submit funding
    const submitFunding = async () => {
        if (!selectedInvoice || !fundingData.discountRate || !fundingData.fundingAmount) {
            showNotification('warning', 'Please fill all required fields');
            return;
        }

        setIsProcessing(true);
        const loadingId = showLoadingNotification('Processing funding request...');

        try {
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            updateLoadingNotification(loadingId, 'Calculating funding details...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            const fundingDetails = calculateFundingDetails(
                selectedInvoice, 
                fundingData.discountRate, 
                fundingData.fundingAmount
            );

            const fundedInvoice = {
                ...selectedInvoice,
                fundedAmount: fundingDetails.fundingAmount,
                discountRate: fundingData.discountRate,
                netAmount: fundingDetails.netAmount,
                expectedReturn: fundingDetails.expectedReturn,
                interestEarned: fundingDetails.interestEarned,
                tenure: fundingDetails.tenure,
                fundedDate: new Date().toISOString(),
                status: 'Active',
                financierRemarks: fundingData.remarks,
                fundedBy: 'FINANCIER-001'
            };

            // Save funded invoice
            const existingFunded = JSON.parse(localStorage.getItem('fundedInvoices') || '[]');
            existingFunded.push(fundedInvoice);
            localStorage.setItem('fundedInvoices', JSON.stringify(existingFunded));

            // Update original invoice status
            const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
            const updatedInvoices = savedInvoices.map(inv => 
                inv.invoiceNumber === selectedInvoice.invoiceNumber 
                    ? { ...inv, status: 'Funded', fundedDate: new Date().toISOString() }
                    : inv
            );
            localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

            // Add notification
            const notification = {
                id: Date.now(),
                type: 'funding_success',
                message: `Successfully funded Invoice ${selectedInvoice.invoiceNumber} for ₹${Number(fundingDetails.fundingAmount).toLocaleString()}`,
                timestamp: new Date().toISOString(),
                read: false
            };

            const existingNotifications = JSON.parse(localStorage.getItem('financierNotifications') || '[]');
            existingNotifications.unshift(notification);
            localStorage.setItem('financierNotifications', JSON.stringify(existingNotifications.slice(0, 50)));

            updateLoadingNotification(loadingId, 'Updating records and notifying parties...');
            await new Promise(resolve => setTimeout(resolve, 800));

            // Notify seller
            const sellerNotificationEvent = new CustomEvent('invoiceFunded', {
                detail: { 
                    invoiceData: fundedInvoice,
                    fundingDetails: fundingDetails
                }
            });
            window.dispatchEvent(sellerNotificationEvent);

            updateLoadingNotification(
                loadingId, 
                `Invoice ${selectedInvoice.invoiceNumber} funded successfully! Net amount disbursed: ₹${Number(fundingDetails.netAmount).toLocaleString()}`, 
                true
            );
            
            setShowFundingModal(false);
            loadFinancierData(); // Refresh data

        } catch (error) {
            console.error('Error funding invoice:', error);
            updateLoadingNotification(loadingId, 'Error processing funding. Please try again.', true);
            showNotification('error', 'Error processing funding. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Format currency
    const formatCurrency = (value) => {
        const num = parseFloat(value || 0);
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
        if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
        return `₹${num.toLocaleString()}`;
    };

    // Event listeners
    useEffect(() => {
        loadFinancierData();

        // Listen for new approved invoices
        const handleInvoiceDecision = (event) => {
            if (event.detail.decision === 'Approved') {
                const notification = {
                    id: Date.now(),
                    type: 'new_invoice',
                    message: `New Invoice ${event.detail.invoiceData.invoiceNumber} approved and available for funding`,
                    timestamp: new Date().toISOString(),
                    read: false
                };

                const existingNotifications = JSON.parse(localStorage.getItem('financierNotifications') || '[]');
                existingNotifications.unshift(notification);
                localStorage.setItem('financierNotifications', JSON.stringify(existingNotifications.slice(0, 50)));

                loadFinancierData(); // Refresh data
            }
        };

        window.addEventListener('invoiceDecision', handleInvoiceDecision);

        return () => {
            window.removeEventListener('invoiceDecision', handleInvoiceDecision);
        };
    }, []);

    return (
        <>
            {/* Professional Financier Header */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0" style={{
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        boxShadow: '0 10px 30px rgba(30, 60, 114, 0.3)'
                    }}>
                        <Card.Body className="py-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-4" style={{
                                        background: 'rgba(255,255,255,0.15)', 
                                        borderRadius: '20px',
                                        padding: '20px',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <i className="fas fa-hand-holding-usd text-white fs-1"></i>
                                    </div>
                                    <div>
                                        <h2 className="text-white mb-1 fw-bold">Financier Dashboard</h2>
                                        <p className="text-white-50 mb-0">Invoice funding opportunities & portfolio management</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="text-white mb-2">
                                        <div className="d-flex align-items-center justify-content-end mb-1">
                                            <i className="fas fa-circle text-success me-2" style={{fontSize: '8px'}}></i>
                                            <small>Live Portfolio Tracking</small>
                                        </div>
                                        <small className="text-white-50">Updated: {new Date().toLocaleString()}</small>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Notifications Section */}
            {notifications.length > 0 && (
                <Row className="mb-4">
                    <Col xl={12}>
                        <Alert variant="info" className="border-0 shadow-sm">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-bell me-3 text-info"></i>
                                <div className="flex-grow-1">
                                    <strong>Latest Activities:</strong>
                                    <div className="mt-2">
                                        {notifications.slice(0, 2).map((notification, index) => (
                                            <div key={index} className="small text-muted mb-1">
                                                🔔 {notification.message} • {new Date(notification.timestamp).toLocaleString()}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            )}

            {/* Dashboard Overview - Summary Cards */}
            <Row className="mb-4">
                <Col xl={2} md={6} className="mb-3">
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="text-center">
                                <i className="fas fa-file-invoice fs-2 mb-3"></i>
                                <h3 className="mb-1 fw-bold">{dashboardMetrics.totalInvoicesAvailable}</h3>
                                <p className="mb-0 small">Total Invoices Available</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2} md={6} className="mb-3">
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        boxShadow: '0 4px 20px rgba(240, 147, 251, 0.2)'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="text-center">
                                <i className="fas fa-handshake fs-2 mb-3"></i>
                                <h3 className="mb-1 fw-bold">{dashboardMetrics.invoicesFunded}</h3>
                                <p className="mb-0 small">Invoices Funded</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6} className="mb-3">
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        boxShadow: '0 4px 20px rgba(79, 172, 254, 0.2)'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="text-center">
                                <i className="fas fa-rupee-sign fs-2 mb-3"></i>
                                <h3 className="mb-1 fw-bold">{formatCurrency(dashboardMetrics.totalAmountDisbursed)}</h3>
                                <p className="mb-0 small">Total Amount Disbursed</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={2} md={6} className="mb-3">
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        boxShadow: '0 4px 20px rgba(250, 112, 154, 0.2)'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="text-center">
                                <i className="fas fa-clock fs-2 mb-3"></i>
                                <h3 className="mb-1 fw-bold">{dashboardMetrics.pendingSettlements}</h3>
                                <p className="mb-0 small">Pending Settlements</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6} className="mb-3">
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)',
                        boxShadow: '0 4px 20px rgba(168, 202, 186, 0.2)'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="text-center">
                                <i className="fas fa-chart-line fs-2 mb-3"></i>
                                <h3 className="mb-1 fw-bold">{formatCurrency(dashboardMetrics.returnsEarned)}</h3>
                                <p className="mb-0 small">Returns / Interest Earned</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Available Invoices Section */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h5 className="mb-1 fw-bold">
                                        <i className="fas fa-file-invoice-dollar me-2 text-primary"></i>
                                        Available Invoices for Funding
                                    </h5>
                                    <small className="text-muted">Buyer-approved invoices awaiting funding decisions</small>
                                </div>
                                <Badge bg="primary" className="px-3 py-2">
                                    {availableInvoices.length} Available
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {availableInvoices.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-file-invoice text-muted" style={{fontSize: '4rem'}}></i>
                                    <h5 className="text-muted mt-3">No Invoices Available</h5>
                                    <p className="text-muted">No buyer-approved invoices are currently available for funding.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0 py-3 fw-bold">Invoice No</th>
                                                <th className="border-0 py-3 fw-bold">Seller Name</th>
                                                <th className="border-0 py-3 fw-bold">Buyer Name</th>
                                                <th className="border-0 py-3 fw-bold">Invoice Date</th>
                                                <th className="border-0 py-3 fw-bold">Due Date</th>
                                                <th className="border-0 py-3 fw-bold">Amount</th>
                                                <th className="border-0 py-3 fw-bold">Tenure</th>
                                                <th className="border-0 py-3 fw-bold">Status</th>
                                                <th className="border-0 py-3 fw-bold">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableInvoices.map((invoice, index) => {
                                                const tenure = invoice.dueDate ? 
                                                    Math.ceil((new Date(invoice.dueDate) - new Date(invoice.invoiceDate)) / (1000 * 60 * 60 * 24)) : 30;
                                                return (
                                                    <tr key={index}>
                                                        <td className="py-3">
                                                            <span className="fw-bold text-primary">{invoice.invoiceNumber}</span>
                                                        </td>
                                                        <td className="py-3">
                                                            <div>
                                                                <div className="fw-medium">{invoice.sellerName}</div>
                                                                <small className="text-muted">{invoice.projectTitle}</small>
                                                            </div>
                                                        </td>
                                                        <td className="py-3">{invoice.buyerName}</td>
                                                        <td className="py-3">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                                                        <td className="py-3">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                                        <td className="py-3">
                                                            <span className="fw-bold text-success">
                                                                ₹{Number(invoice.totalAmount).toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">{tenure} days</td>
                                                        <td className="py-3">
                                                            <Badge bg="success">{invoice.status}</Badge>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="d-flex gap-2">
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="outline-primary"
                                                                    onClick={() => handleViewInvoice(invoice)}
                                                                >
                                                                    <i className="fas fa-eye me-1"></i>
                                                                    View
                                                                </Button>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="success"
                                                                    onClick={() => handleFundInvoice(invoice)}
                                                                >
                                                                    <i className="fas fa-hand-holding-usd me-1"></i>
                                                                    Fund
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Funded Invoices Section */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h5 className="mb-1 fw-bold">
                                        <i className="fas fa-check-circle me-2 text-success"></i>
                                        Funded Invoices Portfolio
                                    </h5>
                                    <small className="text-muted">Track your funded invoices and expected returns</small>
                                </div>
                                <Badge bg="success" className="px-3 py-2">
                                    {fundedInvoices.length} Funded
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {fundedInvoices.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-wallet text-muted" style={{fontSize: '4rem'}}></i>
                                    <h5 className="text-muted mt-3">No Funded Invoices</h5>
                                    <p className="text-muted">Start funding invoices to build your portfolio.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <Table hover className="mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0 py-3 fw-bold">Invoice No</th>
                                                <th className="border-0 py-3 fw-bold">Seller</th>
                                                <th className="border-0 py-3 fw-bold">Buyer</th>
                                                <th className="border-0 py-3 fw-bold">Funded Amount</th>
                                                <th className="border-0 py-3 fw-bold">Discount Rate</th>
                                                <th className="border-0 py-3 fw-bold">Disbursed Date</th>
                                                <th className="border-0 py-3 fw-bold">Expected Return</th>
                                                <th className="border-0 py-3 fw-bold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fundedInvoices.map((invoice, index) => (
                                                <tr key={index}>
                                                    <td className="py-3">
                                                        <span className="fw-bold text-primary">{invoice.invoiceNumber}</span>
                                                    </td>
                                                    <td className="py-3">
                                                        <div>
                                                            <div className="fw-medium">{invoice.sellerName}</div>
                                                            <small className="text-muted">{invoice.projectTitle}</small>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">{invoice.buyerName}</td>
                                                    <td className="py-3">
                                                        <span className="fw-bold text-success">
                                                            ₹{Number(invoice.fundedAmount).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="fw-bold text-primary">{invoice.discountRate}%</span>
                                                    </td>
                                                    <td className="py-3">{new Date(invoice.fundedDate).toLocaleDateString()}</td>
                                                    <td className="py-3">
                                                        <span className="fw-bold text-warning">
                                                            ₹{Number(invoice.expectedReturn).toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge bg={
                                                            invoice.status === 'Active' ? 'primary' :
                                                            invoice.status === 'Settled' ? 'success' :
                                                            'danger'
                                                        }>
                                                            {invoice.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Invoice Details Modal */}
            <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="fas fa-file-invoice text-primary me-2"></i>
                        Invoice Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedInvoice && (
                        <div>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded">
                                        <h6 className="fw-bold mb-3">Invoice Information</h6>
                                        <div className="mb-2"><strong>Invoice No:</strong> {selectedInvoice.invoiceNumber}</div>
                                        <div className="mb-2"><strong>Date:</strong> {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</div>
                                        <div className="mb-2"><strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString()}</div>
                                        <div className="mb-2"><strong>Status:</strong> <Badge bg="success">{selectedInvoice.status}</Badge></div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded">
                                        <h6 className="fw-bold mb-3">Amount Details</h6>
                                        <div className="mb-2"><strong>Base Amount:</strong> ₹{Number(selectedInvoice.baseAmount || 0).toLocaleString()}</div>
                                        <div className="mb-2"><strong>GST:</strong> ₹{Number(selectedInvoice.gstAmount || 0).toLocaleString()}</div>
                                        <div className="mb-2"><strong>Total Amount:</strong> ₹{Number(selectedInvoice.totalAmount).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded">
                                        <h6 className="fw-bold mb-3">Seller Details</h6>
                                        <div className="mb-2"><strong>Company:</strong> {selectedInvoice.sellerName}</div>
                                        <div className="mb-2"><strong>Project:</strong> {selectedInvoice.projectTitle}</div>
                                        {selectedInvoice.milestoneTitle && (
                                            <div className="mb-2"><strong>Milestone:</strong> {selectedInvoice.milestoneTitle}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded">
                                        <h6 className="fw-bold mb-3">Buyer Details</h6>
                                        <div className="mb-2"><strong>Company:</strong> {selectedInvoice.buyerName}</div>
                                        <div className="mb-2"><strong>Approved On:</strong> {selectedInvoice.buyerDecisionOn ? new Date(selectedInvoice.buyerDecisionOn).toLocaleDateString() : 'N/A'}</div>
                                        <div className="mb-2"><strong>Credit Rating:</strong> <Badge bg="success">A+</Badge></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInvoiceModal(false)}>
                        Close
                    </Button>
                    {selectedInvoice && (
                        <Button variant="success" onClick={() => {
                            setShowInvoiceModal(false);
                            handleFundInvoice(selectedInvoice);
                        }}>
                            <i className="fas fa-hand-holding-usd me-2"></i>
                            Fund This Invoice
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Funding Modal */}
            <Modal show={showFundingModal} onHide={() => setShowFundingModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="fas fa-hand-holding-usd text-success me-2"></i>
                        Fund Invoice
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedInvoice && (
                        <div>
                            <div className="p-3 bg-light rounded mb-4">
                                <h6 className="fw-bold mb-2">Invoice: {selectedInvoice.invoiceNumber}</h6>
                                <div className="row">
                                    <div className="col-md-6">
                                        <small><strong>Seller:</strong> {selectedInvoice.sellerName}</small>
                                    </div>
                                    <div className="col-md-6">
                                        <small><strong>Total Amount:</strong> ₹{Number(selectedInvoice.totalAmount).toLocaleString()}</small>
                                    </div>
                                </div>
                            </div>

                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Discount Rate (%)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                step="0.1"
                                                value={fundingData.discountRate}
                                                onChange={(e) => setFundingData({...fundingData, discountRate: e.target.value})}
                                                placeholder="Enter discount rate"
                                            />
                                            <Form.Text className="text-muted">Annual discount rate</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Funding Amount (₹)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={fundingData.fundingAmount}
                                                onChange={(e) => setFundingData({...fundingData, fundingAmount: e.target.value})}
                                                placeholder="Enter amount to fund"
                                            />
                                            <Form.Text className="text-muted">Maximum: ₹{Number(selectedInvoice.totalAmount).toLocaleString()}</Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Remarks (Optional)</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={fundingData.remarks}
                                        onChange={(e) => setFundingData({...fundingData, remarks: e.target.value})}
                                        placeholder="Add any comments or conditions..."
                                    />
                                </Form.Group>

                                {fundingData.discountRate && fundingData.fundingAmount && (
                                    <div className="p-3 bg-success bg-opacity-10 rounded">
                                        <h6 className="fw-bold text-success mb-3">Funding Calculation</h6>
                                        {(() => {
                                            const calc = calculateFundingDetails(selectedInvoice, fundingData.discountRate, fundingData.fundingAmount);
                                            return (
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-2"><strong>Funding Amount:</strong> ₹{Number(calc.fundingAmount).toLocaleString()}</div>
                                                        <div className="mb-2"><strong>Discount Amount:</strong> ₹{Number(calc.discountAmount).toLocaleString()}</div>
                                                        <div className="mb-2"><strong>Net Disbursed:</strong> ₹{Number(calc.netAmount).toLocaleString()}</div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-2"><strong>Tenure:</strong> {calc.tenure} days</div>
                                                        <div className="mb-2"><strong>Expected Return:</strong> ₹{Number(calc.expectedReturn).toLocaleString()}</div>
                                                        <div className="mb-2"><strong>Interest Earned:</strong> ₹{Number(calc.interestEarned).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </Form>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFundingModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="success" 
                        onClick={submitFunding}
                        disabled={!fundingData.discountRate || !fundingData.fundingAmount || isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check me-2"></i>
                                Confirm Funding
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FinancierDashboard;
