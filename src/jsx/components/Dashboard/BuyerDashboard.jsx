import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';

const BuyerDashboard = () => {
    const navigate = useNavigate();
    
    // Dynamic buyer ID - get the first available client from localStorage
    const [currentBuyerId, setCurrentBuyerId] = useState(null);
    
    const [pendingContracts, setPendingContracts] = useState([]);
    const [approvedContracts, setApprovedContracts] = useState([]);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [approvedProjects, setApprovedProjects] = useState([]);
    const [recentInvoices, setRecentInvoices] = useState([]);
    const [pendingInvoices, setPendingInvoices] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showProjectApprovalModal, setShowProjectApprovalModal] = useState(false);
    const [showInvoiceReviewModal, setShowInvoiceReviewModal] = useState(false);
    const [approvalAction, setApprovalAction] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [modificationRequest, setModificationRequest] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [invoiceReviewComment, setInvoiceReviewComment] = useState('');
    const [invoiceDecision, setInvoiceDecision] = useState('');
    
    // Determine current buyer ID from available clients
    const determineBuyerId = () => {
        try {
            const savedClients = localStorage.getItem('activeClients');
            if (savedClients) {
                const clients = JSON.parse(savedClients);
                if (clients.length > 0) {
                    // For demo purposes, use the first client as current buyer
                    // In real app, this would come from auth/session
                    const buyerId = clients[0].id;
                    console.log('🔍 BuyerDashboard: Determined buyer ID:', buyerId);
                    console.log('🔍 Available clients:', clients.map(c => ({id: c.id, name: c.name})));
                    return buyerId;
                }
            }
            
            // Fallback: check if there are any buyer_pending_contracts_* keys
            const allKeys = Object.keys(localStorage);
            const buyerKeys = allKeys.filter(key => key.startsWith('buyer_pending_contracts_'));
            if (buyerKeys.length > 0) {
                const buyerId = buyerKeys[0].replace('buyer_pending_contracts_', '');
                console.log('🔍 BuyerDashboard: Found buyer ID from localStorage keys:', buyerId);
                return buyerId;
            }
            
            console.log('⚠️ BuyerDashboard: No buyer ID found, contracts may not appear');
            return null;
        } catch (error) {
            console.error('Error determining buyer ID:', error);
            return null;
        }
    };

    // Load data on component mount
    useEffect(() => {
        const buyerId = determineBuyerId();
        setCurrentBuyerId(buyerId);
        
        // Listen for invoice created events
        const handleInvoiceCreated = (event) => {
            console.log('📨 BuyerDashboard: Invoice created event received:', event.detail);
            loadBuyerData();
        };
        
        window.addEventListener('invoiceCreated', handleInvoiceCreated);
        return () => window.removeEventListener('invoiceCreated', handleInvoiceCreated);
    }, []);
    
    // Load buyer data when buyer ID changes
    useEffect(() => {
        if (currentBuyerId) {
            loadBuyerData();
        }
    }, [currentBuyerId]);    const loadBuyerData = () => {
        if (!currentBuyerId) {
            console.log('⚠️ BuyerDashboard: No buyer ID available, cannot load contracts');
            return; // Don't load if no buyer ID yet
        }
        
        // Load pending contracts
        const buyerPendingContracts = localStorage.getItem(`buyer_pending_contracts_${currentBuyerId}`) || '[]';
        try {
            const contracts = JSON.parse(buyerPendingContracts);
            const stillPending = contracts.filter(contract => contract.contractStatus === 'Pending');
            setPendingContracts(stillPending);
            
            // Debug logging
            console.log('🔍 Debug - Current buyer ID:', currentBuyerId);
            console.log('🔍 Debug - Buyer pending contracts key:', `buyer_pending_contracts_${currentBuyerId}`);
            console.log('🔍 Debug - Raw buyer pending contracts:', buyerPendingContracts);
            console.log('🔍 Debug - Parsed contracts:', contracts);
            console.log('🔍 Debug - Still pending contracts:', stillPending);
            
            // Debug: List all localStorage keys to help troubleshoot
            console.log('🔍 Debug - All localStorage keys:');
            Object.keys(localStorage).forEach(key => {
                if (key.includes('contract') || key.includes('client')) {
                    console.log(`  - ${key}: ${localStorage.getItem(key)?.slice(0, 100)}...`);
                }
            });
        } catch (error) {
            console.error('Error loading pending contracts:', error);
        }
        
        // Load approved contracts
        const savedContracts = localStorage.getItem('contracts') || '[]';
        try {
            const allContracts = JSON.parse(savedContracts);
            const myApprovedContracts = allContracts.filter(contract => 
                contract.buyer === currentBuyerId && contract.contractStatus === 'Approved'
            );
            setApprovedContracts(myApprovedContracts);
            
            // Debug logging for main contracts
            console.log('🔍 Debug - All contracts in main storage:', allContracts);
        } catch (error) {
            console.error('Error loading approved contracts:', error);
        }
        
        // Load pending projects for approval
        const savedProjects = localStorage.getItem('projects') || '[]';
        try {
            const allProjects = JSON.parse(savedProjects);
            const myPendingProjects = allProjects.filter(project => 
                project.buyerId === currentBuyerId && project.status === 'Pending Approval'
            );
            setPendingProjects(myPendingProjects);
            
            const myApprovedProjects = allProjects.filter(project => 
                project.buyerId === currentBuyerId && (project.status === 'Active' || project.status === 'Approved')
            );
            setApprovedProjects(myApprovedProjects);
            
            console.log('🔍 Debug - All projects:', allProjects);
            console.log('🔍 Debug - My pending projects:', myPendingProjects);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
        
        // Load pending invoices for review
        const savedInvoices = localStorage.getItem('invoices') || '[]';
        try {
            const allInvoices = JSON.parse(savedInvoices);
            console.log('🔍 Debug - All invoices:', allInvoices);
            console.log('🔍 Debug - Current buyer ID:', currentBuyerId);
            
            // Check each invoice's buyer name
            allInvoices.forEach((invoice, index) => {
                console.log(`🔍 Invoice ${index + 1} - Full Object:`, invoice);
                console.log(`🔍 Invoice ${index + 1} - Details:`, {
                    invoiceNumber: invoice.invoiceNumber,
                    status: invoice.status,
                    buyerName: invoice.buyerName,
                    statusMatch: invoice.status === 'Pending Buyer Approval',
                    buyerMatch: invoice.buyerName && (
                        invoice.buyerName.includes(currentBuyerId) || 
                        invoice.buyerName === 'XYZ Energy' || 
                        invoice.buyerName === 'ABC Infrastructure' ||
                        invoice.buyerName === 'RetailMax India'
                    )
                });
            });
            
            // More flexible filtering - show all pending invoices for now to debug
            const myPendingInvoices = allInvoices.filter(invoice => {
                const statusMatches = invoice.status && (
                    invoice.status.includes('Pending') || 
                    invoice.status === 'Pending Buyer Approval'
                );
                
                const buyerMatches = invoice.buyerName && (
                    invoice.buyerName.includes(currentBuyerId) || 
                    invoice.buyerName === 'XYZ Energy' || 
                    invoice.buyerName === 'ABC Infrastructure' ||
                    invoice.buyerName === 'RetailMax India' ||
                    invoice.buyerName === 'Paycorp' ||
                    true // Temporarily show all invoices to debug
                );
                
                console.log(`🔍 Filtering invoice ${invoice.invoiceNumber}:`, {
                    statusMatches,
                    buyerMatches,
                    willShow: statusMatches && buyerMatches
                });
                
                return statusMatches && buyerMatches;
            });
            setPendingInvoices(myPendingInvoices);
            
            console.log('🔍 Debug - My pending invoices:', myPendingInvoices);
        } catch (error) {
            console.error('Error loading invoices:', error);
        }
        
        // Mock recent invoices data
        setRecentInvoices([
            {
                id: 'INV-2024-001',
                contractTitle: 'Infrastructure Upgrade Contract',
                sellerName: 'TechCorp Solutions',
                amount: '₹612,500',
                status: 'Pending Payment',
                dueDate: '2024-12-15',
                invoiceDate: '2024-11-01'
            },
            {
                id: 'INV-2024-002',
                contractTitle: 'E-commerce Platform Contract',
                sellerName: 'DevSolutions Inc',
                amount: '₹450,000',
                status: 'Paid',
                dueDate: '2024-11-30',
                invoiceDate: '2024-10-15'
            }
        ]);
    };
    
    // Handle contract action
    const handleContractAction = (contract, action) => {
        setSelectedContract(contract);
        setApprovalAction(action);
        setShowApprovalModal(true);
        setRejectionReason('');
        setModificationRequest('');
    };
    
    // Handle project action
    const handleProjectAction = (project, action) => {
        setSelectedProject(project);
        setApprovalAction(action);
        setShowProjectApprovalModal(true);
        setRejectionReason('');
        setModificationRequest('');
    };
    
    // Submit approval decision
    const submitApprovalDecision = async () => {
        if (!selectedContract) return;
        
        setIsProcessing(true);
        
        try {
            let newStatus = '';
            let comments = '';
            
            switch (approvalAction) {
                case 'approve':
                    newStatus = 'Approved';
                    comments = 'Contract approved by buyer';
                    break;
                case 'reject':
                    newStatus = 'Rejected';
                    comments = rejectionReason || 'Contract rejected by buyer';
                    break;
                case 'modify':
                    newStatus = 'Modification Requested';
                    comments = modificationRequest || 'Modifications requested by buyer';
                    break;
                default:
                    return;
            }
            
            // Update contract with new status
            const updatedContract = {
                ...selectedContract,
                contractStatus: newStatus,
                buyerDecisionOn: new Date().toISOString(),
                buyerComments: comments,
                approvalHistory: [
                    ...selectedContract.approvalHistory,
                    {
                        action: approvalAction,
                        status: newStatus,
                        comments,
                        decidedOn: new Date().toISOString(),
                        decidedBy: currentBuyerId
                    }
                ]
            };
            
            // Update main contracts list
            const savedContracts = localStorage.getItem('contracts') || '[]';
            const allContracts = JSON.parse(savedContracts);
            const updatedContracts = allContracts.map(contract => 
                contract.id === selectedContract.id ? updatedContract : contract
            );
            localStorage.setItem('contracts', JSON.stringify(updatedContracts));
            
            // Remove from pending list
            const remainingPending = pendingContracts.filter(contract => contract.id !== selectedContract.id);
            localStorage.setItem(`buyer_pending_contracts_${currentBuyerId}`, JSON.stringify(remainingPending));
            setPendingContracts(remainingPending);
            
            // Add to approved list if approved
            if (newStatus === 'Approved') {
                setApprovedContracts(prev => [updatedContract, ...prev]);
            }
            
            // Notify seller
            const contractDecisionEvent = new CustomEvent('contractDecision', {
                detail: { 
                    contractData: updatedContract, 
                    decision: newStatus
                }
            });
            window.dispatchEvent(contractDecisionEvent);
            
            console.log(`📝 Contract ${selectedContract.contractTitle} ${newStatus.toLowerCase()}`);
            showNotification(
                newStatus === 'Approved' ? 'success' : 'info',
                `Contract "${selectedContract.contractTitle}" has been ${newStatus.toLowerCase()}!`
            );
            
            setShowApprovalModal(false);
            
        } catch (error) {
            console.error('Error processing decision:', error);
            showNotification('error', 'Error processing decision. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Submit project approval decision
    const submitProjectApprovalDecision = async () => {
        if (!selectedProject) return;
        
        setIsProcessing(true);
        
        try {
            let newStatus = '';
            let comments = '';
            
            switch (approvalAction) {
                case 'approve':
                    newStatus = 'Approved';
                    comments = 'Project approved by buyer';
                    break;
                case 'reject':
                    newStatus = 'Rejected';
                    comments = rejectionReason || 'Project rejected by buyer';
                    break;
                case 'modify':
                    newStatus = 'Modification Requested';
                    comments = modificationRequest || 'Modifications requested by buyer';
                    break;
                default:
                    return;
            }
            
            // Update project with new status
            const updatedProject = {
                ...selectedProject,
                status: newStatus,
                buyerDecisionOn: new Date().toISOString(),
                buyerComments: comments,
                approvalHistory: [
                    ...selectedProject.approvalHistory || [],
                    {
                        action: approvalAction,
                        status: newStatus,
                        comments,
                        decidedOn: new Date().toISOString(),
                        decidedBy: currentBuyerId
                    }
                ]
            };
            
            // Update main projects list
            const savedProjects = localStorage.getItem('projects') || '[]';
            const allProjects = JSON.parse(savedProjects);
            const updatedProjects = allProjects.map(project => 
                project.id === selectedProject.id ? updatedProject : project
            );
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
            
            // Remove from pending list
            const remainingPending = pendingProjects.filter(project => project.id !== selectedProject.id);
            setPendingProjects(remainingPending);
            
            // Add to approved list if approved
            if (newStatus === 'Approved') {
                setApprovedProjects(prev => [updatedProject, ...prev]);
            }
            
            // Notify seller
            const projectApprovalEvent = new CustomEvent('projectApproval', {
                detail: { 
                    projectData: updatedProject, 
                    decision: newStatus
                }
            });
            window.dispatchEvent(projectApprovalEvent);
            
            console.log(`📝 Project ${selectedProject.projectTitle} ${newStatus.toLowerCase()}`);
            showNotification(
                newStatus === 'Approved' ? 'success' : 'info',
                `Project "${selectedProject.projectTitle}" has been ${newStatus.toLowerCase()}!`
            );
            
            setShowProjectApprovalModal(false);
            
        } catch (error) {
            console.error('Error processing project decision:', error);
            showNotification('error', 'Error processing decision. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const formatCurrency = (value) => {
        const num = parseFloat(value);
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
        if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
        return `₹${num}`;
    };

    // Handle invoice review action
    const handleInvoiceReview = (invoice) => {
        setSelectedInvoice(invoice);
        setShowInvoiceReviewModal(true);
        setInvoiceReviewComment('');
        setInvoiceDecision('');
    };

    // Submit invoice review decision
    const submitInvoiceDecision = async () => {
        if (!selectedInvoice || !invoiceDecision) return;

        setIsProcessing(true);

        try {
            const updatedInvoice = {
                ...selectedInvoice,
                status: invoiceDecision,
                buyerDecisionOn: new Date().toISOString(),
                buyerComments: invoiceReviewComment,
                decidedBy: currentBuyerId
            };

            // Update invoice in localStorage
            const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
            const updatedInvoices = savedInvoices.map(invoice => 
                invoice.invoiceNumber === selectedInvoice.invoiceNumber ? updatedInvoice : invoice
            );
            localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

            // Remove from pending invoices
            setPendingInvoices(prev => prev.filter(inv => inv.invoiceNumber !== selectedInvoice.invoiceNumber));

            // Notify seller and financier
            const invoiceDecisionEvent = new CustomEvent('invoiceDecision', {
                detail: { 
                    invoiceData: updatedInvoice, 
                    decision: invoiceDecision,
                    comments: invoiceReviewComment
                }
            });
            window.dispatchEvent(invoiceDecisionEvent);

            const message = invoiceDecision === 'Approved' 
                ? `Invoice ${selectedInvoice.invoiceNumber} has been approved! Seller and financier have been notified.`
                : `Invoice ${selectedInvoice.invoiceNumber} has been rejected.`;
            
            showNotification(
                invoiceDecision === 'Approved' ? 'success' : 'info',
                message
            );
            setShowInvoiceReviewModal(false);

        } catch (error) {
            console.error('Error processing invoice decision:', error);
            showNotification('error', 'Error processing decision. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {/* Professional Buyer Header */}
            <Row>
                <Col xl={12}>
                    <Card className="mb-4">
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-building text-info fs-2"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-dark mb-1 fw-bold">Buyer Dashboard</h3>
                                        <p className="text-muted mb-0 fs-6">Contract management, invoice tracking & seller communications</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="d-flex align-items-center text-muted mb-2">
                                        <div className="d-flex align-items-center me-4">
                                            <i className="fas fa-circle text-warning me-2" style={{fontSize: '8px'}}></i>
                                            <small className="fw-medium">{pendingContracts.length} Contracts + {pendingProjects.length} Projects</small>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-check-circle text-success me-2"></i>
                                            <small className="fw-medium">{approvedContracts.length + approvedProjects.length} Active Items</small>
                                        </div>
                                    </div>
                                    <small className="text-muted">Live data • Updated real-time</small>
                                    {/* <div className="mt-2">
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            onClick={() => navigate('/dashboard')}
                                        >
                                            <i className="fas fa-exchange-alt me-1"></i>
                                            Back to Seller View
                                        </Button>
                                    </div> */}
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>

            {/* Debug Section - Only in development */}
            {/* {process.env.NODE_ENV === 'development' && (
                <Row className="mb-4">
                    <Col xl={12}>
                        <Alert variant="info" className="border-0 shadow-sm">
                            <div className="d-flex align-items-center mb-2">
                                <i className="fas fa-info-circle me-2"></i>
                                <strong>🔧 Debug Information</strong>
                            </div>
                            <Row>
                                <Col md={3}>
                                    <small><strong>Current Buyer ID:</strong></small><br />
                                    <code className="text-primary">{currentBuyerId || 'Loading...'}</code>
                                </Col>
                                <Col md={3}>
                                    <small><strong>Pending Contracts:</strong></small><br />
                                    <Badge bg="warning">{pendingContracts.length}</Badge>
                                </Col>
                                <Col md={6}>
                                    <small><strong>Storage Key:</strong></small><br />
                                    <code className="text-muted small">buyer_pending_contracts_{currentBuyerId}</code>
                                </Col>
                            </Row>
                            {pendingContracts.length === 0 && currentBuyerId && (
                                <div className="mt-2 pt-2 border-top">
                                    <small className="text-warning">
                                        <i className="fas fa-exclamation-triangle me-1"></i>
                                        No pending contracts found. Check that seller is submitting contracts to buyer ID: <code>{currentBuyerId}</code>
                                    </small>
                                </div>
                            )}
                            <div className="mt-2 pt-2 border-top">
                                <Button 
                                    size="sm" 
                                    variant="outline-info" 
                                    onClick={() => {
                                        console.log('=== FULL LOCALSTORAGE DEBUG ===');
                                        Object.keys(localStorage).forEach(key => {
                                            if (key.includes('contract') || key.includes('client')) {
                                                console.log(`${key}:`, JSON.parse(localStorage.getItem(key) || '[]'));
                                            }
                                        });
                                        console.log('=== END DEBUG ===');
                                        showNotification('Debug Info', 'Check browser console for localStorage data', 'info');
                                    }}
                                    className="me-2"
                                >
                                    <i className="fas fa-bug me-1"></i>
                                    Debug Console
                                </Button>
                                <small className="text-muted">Click to log all contract data to browser console</small>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            )} */}

            {/* KPI Cards */}
            <Row className="mb-4">
                <Col xl={3} md={6}>
                    <Card className="overflow-hidden">
                        <Card.Header className="border-0">
                            <div className="d-flex">
                                <span className="mt-2">
                                    <i className="fas fa-hourglass-half text-warning fs-2"></i>
                                </span>
                                <div className="invoices">
                                    <h4>{pendingContracts.length + pendingProjects.length}</h4>
                                    <span>Pending Approvals</span>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-6 fw-medium">Requires Action</span>
                                    <Badge bg="warning" className="fs-7">
                                        Urgent
                                    </Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="overflow-hidden">
                        <Card.Header className="border-0">
                            <div className="d-flex">
                                <span className="mt-2">
                                    <i className="fas fa-check-circle text-success fs-2"></i>
                                </span>
                                <div className="invoices">
                                    <h4>{approvedContracts.length + approvedProjects.length}</h4>
                                    <span>Active Items</span>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-6 fw-medium">In Progress</span>
                                    <Badge bg="success" className="fs-7">
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="overflow-hidden">
                        <Card.Header className="border-0">
                            <div className="d-flex">
                                <span className="mt-2">
                                    <i className="fas fa-file-invoice text-primary fs-2"></i>
                                </span>
                                <div className="invoices">
                                    <h4>{recentInvoices.length}</h4>
                                    <span>Recent Invoices</span>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-6 fw-medium">This Month</span>
                                    <Badge bg="primary" className="fs-7">
                                        ₹1.06M
                                    </Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="overflow-hidden">
                        <Card.Header className="border-0">
                            <div className="d-flex">
                                <span className="mt-2">
                                    <i className="fas fa-chart-line text-info fs-2"></i>
                                </span>
                                <div className="invoices">
                                    <h4>15</h4>
                                    <span>Active Sellers</span>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-6 fw-medium">Partners</span>
                                    <Badge bg="info" className="fs-7">
                                        +2 New
                                    </Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Pending Contract Approvals - This is the main feature */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card>
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-clipboard-check text-warning fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-dark fw-bold">
                                            ⏳ Contracts Awaiting Approval
                                            <Badge bg="warning" className="ms-2 fs-7">
                                                {pendingContracts.length}
                                            </Badge>
                                        </h4>
                                        <p className="text-muted mb-0">Review and approve seller contracts</p>
                                    </div>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {pendingContracts.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-clipboard-check text-muted fs-1 mb-3"></i>
                                    <h5 className="text-muted mb-3">No Pending Contracts</h5>
                                    <p className="text-muted">All contracts have been reviewed!</p>
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-file-contract me-2 text-primary"></i>
                                                Contract Details
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-building me-2 text-info"></i>
                                                Seller Info
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-rupee-sign me-2 text-success"></i>
                                                Value & Terms
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-cogs me-2 text-warning"></i>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingContracts.map((contract, index) => (
                                            <tr key={index}>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="fw-bold text-dark mb-1">{contract.contractTitle}</div>
                                                        <div className="text-muted small mb-1">
                                                            <strong>Code:</strong> {contract.contractCode}
                                                        </div>
                                                        <div className="text-muted small mb-2">
                                                            <strong>Type:</strong> {contract.contractType}
                                                        </div>
                                                        <Badge bg="warning">
                                                            <i className="fas fa-clock me-1"></i>
                                                            Pending
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="fw-bold text-dark">Seller Company</div>
                                                        <div className="text-muted small">
                                                            <strong>Submitted:</strong> {new Date(contract.submittedForApprovalOn).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="fw-bold text-success fs-5 mb-1">
                                                            {formatCurrency(contract.contractValue)}
                                                        </div>
                                                        <div className="text-muted small mb-1">
                                                            <strong>Payment:</strong> {contract.paymentTerms} days
                                                        </div>
                                                        <div className="text-muted small">
                                                            <strong>Duration:</strong> {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="d-flex flex-column gap-2">
                                                        <Button 
                                                            variant="success" 
                                                            size="sm"
                                                            onClick={() => handleContractAction(contract, 'approve')}
                                                        >
                                                            <i className="fas fa-check me-1"></i>
                                                            ✅ Approve
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleContractAction(contract, 'reject')}
                                                        >
                                                            <i className="fas fa-times me-1"></i>
                                                            ❌ Reject
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="info" 
                                                            size="sm"
                                                            onClick={() => handleContractAction(contract, 'modify')}
                                                        >
                                                            <i className="fas fa-edit me-1"></i>
                                                            ✏️ Ask Modification
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Pending Project Approvals */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card>
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-project-diagram text-success fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-dark fw-bold">
                                            🚀 Projects Awaiting Approval
                                            <Badge bg="success" className="ms-2 fs-7">
                                                {pendingProjects.length}
                                            </Badge>
                                        </h4>
                                        <p className="text-muted mb-0">Review and approve seller projects</p>
                                    </div>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {pendingProjects.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-project-diagram text-muted fs-1 mb-3"></i>
                                    <h5 className="text-muted mb-3">No Pending Projects</h5>
                                    <p className="text-muted">All projects have been reviewed!</p>
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-project-diagram me-2 text-primary"></i>
                                                Project Details
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-calendar me-2 text-info"></i>
                                                Timeline
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-rupee-sign me-2 text-success"></i>
                                                Value & Milestones
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-cogs me-2 text-warning"></i>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingProjects.map((project, index) => (
                                            <tr key={index}>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="fw-bold text-dark mb-1">{project.projectTitle}</div>
                                                        <div className="text-muted small mb-1">
                                                            <strong>Code:</strong> {project.projectCode}
                                                        </div>
                                                        <div className="text-muted small mb-2">
                                                            <strong>Description:</strong> {project.description || 'No description provided'}
                                                        </div>
                                                        <Badge bg="warning">
                                                            <i className="fas fa-clock me-1"></i>
                                                            Pending Approval
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="text-muted small mb-1">
                                                            <strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-muted small mb-1">
                                                            <strong>End:</strong> {new Date(project.endDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-muted small">
                                                            <strong>Submitted:</strong> {new Date(project.submittedForApprovalOn).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="fw-bold text-success fs-5 mb-1">
                                                            {formatCurrency(project.projectValue)}
                                                        </div>
                                                        <div className="text-muted small mb-1">
                                                            <strong>Milestones:</strong> {project.milestones?.length || 0}
                                                        </div>
                                                        <div className="text-muted small">
                                                            <strong>Contract:</strong> {project.contractId || 'N/A'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="d-flex flex-column gap-2">
                                                        <Button 
                                                            variant="success" 
                                                            size="sm"
                                                            onClick={() => handleProjectAction(project, 'approve')}
                                                        >
                                                            <i className="fas fa-check me-1"></i>
                                                            ✅ Approve Project
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleProjectAction(project, 'reject')}
                                                        >
                                                            <i className="fas fa-times me-1"></i>
                                                            ❌ Reject Project
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="info" 
                                                            size="sm"
                                                            onClick={() => handleProjectAction(project, 'modify')}
                                                        >
                                                            <i className="fas fa-edit me-1"></i>
                                                            ✏️ Request Changes
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Pending Invoices Section */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h4">
                                <i className="fas fa-file-invoice me-2 text-primary"></i>
                                Pending Invoice Reviews
                            </Card.Title>
                            <small className="text-muted">Review and approve/reject invoices submitted by sellers</small>
                        </Card.Header>
                        <Card.Body>
                            {pendingInvoices.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-file-invoice text-muted" style={{fontSize: '4rem'}}></i>
                                    <h5 className="text-muted mb-3">No Pending Invoices</h5>
                                    <p className="text-muted">No invoices are currently waiting for your review.</p>
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-hashtag me-2 text-primary"></i>
                                                Invoice No
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-user me-2 text-info"></i>
                                                Seller
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-project-diagram me-2 text-warning"></i>
                                                Project Details
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-rupee-sign me-2 text-success"></i>
                                                Amount
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-calendar me-2 text-secondary"></i>
                                                Date
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-tag me-2 text-danger"></i>
                                                Status
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-cogs me-2 text-primary"></i>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingInvoices.map((invoice, index) => (
                                            <tr key={index}>
                                                <td className="py-4 px-4">
                                                    <div className="fw-bold text-primary fs-6">
                                                        {invoice.invoiceNumber}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="fw-bold text-dark">
                                                        {invoice.sellerName}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="fw-bold text-dark mb-1">
                                                            {invoice.projectTitle}
                                                        </div>
                                                        {invoice.milestoneTitle && (
                                                            <div className="text-muted small">
                                                                <i className="fas fa-flag me-1"></i>
                                                                {invoice.milestoneTitle}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="fw-bold text-success fs-5">
                                                        ₹{Number(invoice.totalAmount || 0).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-dark">
                                                        {new Date(invoice.invoiceDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge bg={
                                                        invoice.status === 'Pending' ? 'warning' :
                                                        invoice.status === 'Approved' ? 'success' :
                                                        'danger'
                                                    }>
                                                        {invoice.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Button 
                                                        variant="primary" 
                                                        size="sm"
                                                        onClick={() => handleInvoiceReview(invoice)}
                                                        className="shadow-sm"
                                                    >
                                                        <i className="fas fa-eye me-2"></i>
                                                        Review
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Invoice Review Modal */}
            <Modal show={showInvoiceReviewModal} onHide={() => setShowInvoiceReviewModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="fas fa-file-invoice text-primary me-2"></i>
                        Invoice Review
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedInvoice && (
                        <div>
                            {/* Invoice Details */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="border rounded p-3 bg-light">
                                        <h6 className="fw-bold text-primary mb-3">
                                            <i className="fas fa-file-alt me-2"></i>
                                            Invoice Information
                                        </h6>
                                        <div className="mb-2">
                                            <strong>Invoice No:</strong> {selectedInvoice.invoiceNumber}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Date:</strong> {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Due Date:</strong> {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Status:</strong> 
                                            <Badge bg="warning" className="ms-2">{selectedInvoice.status}</Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="border rounded p-3 bg-light">
                                        <h6 className="fw-bold text-success mb-3">
                                            <i className="fas fa-rupee-sign me-2"></i>
                                            Amount Details
                                        </h6>
                                        <div className="mb-2">
                                            <strong>Base Amount:</strong> ₹{Number(selectedInvoice.baseAmount || 0).toLocaleString()}
                                        </div>
                                        <div className="mb-2">
                                            <strong>GST ({selectedInvoice.gstRate || 18}%):</strong> ₹{Number(selectedInvoice.gstAmount || 0).toLocaleString()}
                                        </div>
                                        <hr className="my-2"/>
                                        <div className="fw-bold text-success fs-5">
                                            <strong>Total Amount:</strong> ₹{Number(selectedInvoice.totalAmount || 0).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Details */}
                            <div className="border rounded p-3 mb-4" style={{backgroundColor: '#f8f9fa'}}>
                                <h6 className="fw-bold text-info mb-3">
                                    <i className="fas fa-project-diagram me-2"></i>
                                    Project Details
                                </h6>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-2">
                                            <strong>Seller:</strong> {selectedInvoice.sellerName}
                                        </div>
                                        <div className="mb-2">
                                            <strong>Project:</strong> {selectedInvoice.projectTitle}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {selectedInvoice.milestoneTitle && (
                                            <div className="mb-2">
                                                <strong>Milestone:</strong> {selectedInvoice.milestoneTitle}
                                            </div>
                                        )}
                                        <div className="mb-2">
                                            <strong>Description:</strong> {selectedInvoice.description || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Review Section */}
                            <div className="border rounded p-3" style={{backgroundColor: '#fff3cd'}}>
                                <h6 className="fw-bold text-warning mb-3">
                                    <i className="fas fa-clipboard-check me-2"></i>
                                    Your Review Decision
                                </h6>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Decision *</label>
                                    <div>
                                        <div className="form-check form-check-inline">
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="invoiceDecision" 
                                                value="Approved"
                                                checked={invoiceDecision === 'Approved'}
                                                onChange={(e) => setInvoiceDecision(e.target.value)}
                                            />
                                            <label className="form-check-label text-success fw-bold">
                                                <i className="fas fa-check me-1"></i>
                                                Approve
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="invoiceDecision" 
                                                value="Rejected"
                                                checked={invoiceDecision === 'Rejected'}
                                                onChange={(e) => setInvoiceDecision(e.target.value)}
                                            />
                                            <label className="form-check-label text-danger fw-bold">
                                                <i className="fas fa-times me-1"></i>
                                                Reject
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Comments (Optional)</label>
                                    <textarea 
                                        className="form-control" 
                                        rows="3"
                                        value={invoiceReviewComment}
                                        onChange={(e) => setInvoiceReviewComment(e.target.value)}
                                        placeholder="Add any comments or feedback..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowInvoiceReviewModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant={invoiceDecision === 'Approved' ? 'success' : 'danger'}
                        onClick={submitInvoiceDecision}
                        disabled={!invoiceDecision || isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <i className={`fas ${invoiceDecision === 'Approved' ? 'fa-check' : 'fa-times'} me-2`}></i>
                                {invoiceDecision === 'Approved' ? 'Approve Invoice' : 'Reject Invoice'}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Contract Approval Modal */}
            <Modal show={showApprovalModal} onHide={() => setShowApprovalModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className={`fas ${
                            approvalAction === 'approve' ? 'fa-check text-success' :
                            approvalAction === 'reject' ? 'fa-times text-danger' :
                            'fa-edit text-info'
                        } me-2`}></i>
                        {approvalAction === 'approve' ? 'Approve Contract' :
                         approvalAction === 'reject' ? 'Reject Contract' :
                         'Request Modifications'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedContract && (
                        <>
                            <Alert variant="light" className="border">
                                <div className="d-flex align-items-start">
                                    <i className="fas fa-file-contract text-primary fs-4 me-3 mt-1"></i>
                                    <div className="flex-grow-1">
                                        <h5 className="mb-2">{selectedContract.contractTitle}</h5>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="mb-1"><strong>Contract Code:</strong> {selectedContract.contractCode}</p>
                                                <p className="mb-1"><strong>Type:</strong> {selectedContract.contractType}</p>
                                                <p className="mb-1"><strong>Value:</strong> {formatCurrency(selectedContract.contractValue)}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="mb-1"><strong>Start Date:</strong> {new Date(selectedContract.startDate).toLocaleDateString()}</p>
                                                <p className="mb-1"><strong>End Date:</strong> {new Date(selectedContract.endDate).toLocaleDateString()}</p>
                                                <p className="mb-1"><strong>Payment Terms:</strong> {selectedContract.paymentTerms} days</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Alert>
                            
                            {approvalAction === 'approve' && (
                                <Alert variant="success">
                                    <h6><i className="fas fa-check-circle me-2"></i>Approve Contract</h6>
                                    <p className="mb-0">
                                        Are you sure you want to approve this contract? Once approved, the seller can start 
                                        invoicing under this contract.
                                    </p>
                                </Alert>
                            )}
                            
                            {approvalAction === 'reject' && (
                                <div>
                                    <Alert variant="danger">
                                        <h6><i className="fas fa-exclamation-triangle me-2"></i>Reject Contract</h6>
                                        <p className="mb-0">Please provide a reason for rejection:</p>
                                    </Alert>
                                    <Form.Group>
                                        <Form.Label className="fw-bold">Rejection Reason</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Please specify why you're rejecting this contract..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            )}
                            
                            {approvalAction === 'modify' && (
                                <div>
                                    <Alert variant="info">
                                        <h6><i className="fas fa-edit me-2"></i>Request Modifications</h6>
                                        <p className="mb-0">Specify what changes are needed:</p>
                                    </Alert>
                                    <Form.Group>
                                        <Form.Label className="fw-bold">Modification Request</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Please specify what modifications are needed in this contract..."
                                            value={modificationRequest}
                                            onChange={(e) => setModificationRequest(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowApprovalModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant={
                            approvalAction === 'approve' ? 'success' :
                            approvalAction === 'reject' ? 'danger' :
                            'info'
                        }
                        onClick={submitApprovalDecision}
                        disabled={
                            isProcessing ||
                            (approvalAction === 'reject' && !rejectionReason.trim()) ||
                            (approvalAction === 'modify' && !modificationRequest.trim())
                        }
                    >
                        {isProcessing ? (
                            <>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Processing...
                            </>
                        ) : (
                            <>
                                <i className={`fas ${
                                    approvalAction === 'approve' ? 'fa-check' :
                                    approvalAction === 'reject' ? 'fa-times' :
                                    'fa-edit'
                                } me-2`}></i>
                                {approvalAction === 'approve' ? 'Approve Contract' :
                                 approvalAction === 'reject' ? 'Reject Contract' :
                                 'Send Modification Request'}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Project Approval Modal */}
            <Modal show={showProjectApprovalModal} onHide={() => setShowProjectApprovalModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className={`fas ${
                            approvalAction === 'approve' ? 'fa-check text-success' :
                            approvalAction === 'reject' ? 'fa-times text-danger' :
                            'fa-edit text-info'
                        } me-2`}></i>
                        {approvalAction === 'approve' ? 'Approve Project' :
                         approvalAction === 'reject' ? 'Reject Project' :
                         'Request Project Changes'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProject && (
                        <>
                            <Alert variant="light" className="border">
                                <div className="d-flex align-items-start">
                                    <i className="fas fa-project-diagram text-primary fs-4 me-3 mt-1"></i>
                                    <div className="flex-grow-1">
                                        <h5 className="mb-2">{selectedProject.projectTitle}</h5>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className="mb-1"><strong>Project Code:</strong> {selectedProject.projectCode}</p>
                                                <p className="mb-1"><strong>Value:</strong> {formatCurrency(selectedProject.projectValue)}</p>
                                                <p className="mb-1"><strong>Milestones:</strong> {selectedProject.milestones?.length || 0}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className="mb-1"><strong>Start Date:</strong> {new Date(selectedProject.startDate).toLocaleDateString()}</p>
                                                <p className="mb-1"><strong>End Date:</strong> {new Date(selectedProject.endDate).toLocaleDateString()}</p>
                                                <p className="mb-1"><strong>Contract:</strong> {selectedProject.contractId || 'N/A'}</p>
                                            </div>
                                        </div>
                                        {selectedProject.description && (
                                            <div className="mt-2">
                                                <p className="mb-1"><strong>Description:</strong></p>
                                                <p className="text-muted">{selectedProject.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Alert>
                            
                            {approvalAction === 'approve' && (
                                <Alert variant="success">
                                    <h6><i className="fas fa-check-circle me-2"></i>Approve Project</h6>
                                    <p className="mb-0">
                                        Are you sure you want to approve this project? Once approved, the seller can start 
                                        working on milestones and generating invoices.
                                    </p>
                                </Alert>
                            )}
                            
                            {approvalAction === 'reject' && (
                                <div>
                                    <Alert variant="danger">
                                        <h6><i className="fas fa-exclamation-triangle me-2"></i>Reject Project</h6>
                                        <p className="mb-0">Please provide a reason for rejection:</p>
                                    </Alert>
                                    <Form.Group>
                                        <Form.Label className="fw-bold">Rejection Reason</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Please specify why you're rejecting this project..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            )}
                            
                            {approvalAction === 'modify' && (
                                <div>
                                    <Alert variant="info">
                                        <h6><i className="fas fa-edit me-2"></i>Request Project Changes</h6>
                                        <p className="mb-0">Specify what changes are needed:</p>
                                    </Alert>
                                    <Form.Group>
                                        <Form.Label className="fw-bold">Change Request</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="Please specify what modifications are needed in this project..."
                                            value={modificationRequest}
                                            onChange={(e) => setModificationRequest(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowProjectApprovalModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant={
                            approvalAction === 'approve' ? 'success' :
                            approvalAction === 'reject' ? 'danger' :
                            'info'
                        }
                        onClick={submitProjectApprovalDecision}
                        disabled={
                            isProcessing ||
                            (approvalAction === 'reject' && !rejectionReason.trim()) ||
                            (approvalAction === 'modify' && !modificationRequest.trim())
                        }
                    >
                        {isProcessing ? (
                            <>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Processing...
                            </>
                        ) : (
                            <>
                                <i className={`fas ${
                                    approvalAction === 'approve' ? 'fa-check' :
                                    approvalAction === 'reject' ? 'fa-times' :
                                    'fa-edit'
                                } me-2`}></i>
                                {approvalAction === 'approve' ? 'Approve Project' :
                                 approvalAction === 'reject' ? 'Reject Project' :
                                 'Send Change Request'}
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default BuyerDashboard;

