import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Modal, Form, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';

const BuyerContractApproval = () => {
    const navigate = useNavigate();
    const [pendingContracts, setPendingContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [approvalAction, setApprovalAction] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [modificationRequest, setModificationRequest] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Mock buyer ID - in real app, this would come from auth
    const currentBuyerId = 'CLIENT-001'; // This would be dynamic based on logged-in buyer
    
    // Load pending contracts for current buyer
    useEffect(() => {
        loadPendingContracts();
    }, []);
    
    const loadPendingContracts = () => {
        const buyerPendingContracts = localStorage.getItem(`buyer_pending_contracts_${currentBuyerId}`) || '[]';
        try {
            const contracts = JSON.parse(buyerPendingContracts);
            // Only show contracts that are still pending
            const stillPending = contracts.filter(contract => contract.contractStatus === 'Pending');
            setPendingContracts(stillPending);
        } catch (error) {
            console.error('Error loading pending contracts:', error);
        }
    };
    
    // Handle contract action (Approve/Reject/Modify)
    const handleContractAction = (contract, action) => {
        setSelectedContract(contract);
        setApprovalAction(action);
        setShowApprovalModal(true);
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
            
            // Remove from buyer's pending list
            const remainingPending = pendingContracts.filter(contract => contract.id !== selectedContract.id);
            localStorage.setItem(`buyer_pending_contracts_${currentBuyerId}`, JSON.stringify(remainingPending));
            setPendingContracts(remainingPending);
            
            // Notify seller about the decision
            const sellerNotifications = localStorage.getItem(`seller_notifications_${selectedContract.sellerId}`) || '[]';
            const notifications = JSON.parse(sellerNotifications);
            const newNotification = {
                id: `NOTIF-${Date.now()}`,
                type: 'contract_decision',
                contractId: selectedContract.id,
                contractTitle: selectedContract.contractTitle,
                buyerName: selectedContract.buyerDetails?.name,
                decision: newStatus,
                comments,
                createdOn: new Date().toISOString(),
                read: false
            };
            notifications.unshift(newNotification);
            localStorage.setItem(`seller_notifications_${selectedContract.sellerId}`, JSON.stringify(notifications));
            
            // Dispatch event to notify seller dashboard
            const contractDecisionEvent = new CustomEvent('contractDecision', {
                detail: { 
                    contractData: updatedContract, 
                    decision: newStatus,
                    notification: newNotification
                }
            });
            window.dispatchEvent(contractDecisionEvent);
            
            console.log(`📝 Contract ${selectedContract.contractTitle} ${newStatus.toLowerCase()}`);
            
            const notificationType = newStatus === 'Approved' ? 'success' : 'warning';
            showNotification(
                `Contract ${newStatus}!`,
                `Contract "${selectedContract.contractTitle}" has been ${newStatus.toLowerCase()}.`,
                notificationType
            );
            
            setShowApprovalModal(false);
            
        } catch (error) {
            console.error('Error processing contract decision:', error);
            showNotification(
                'Processing Error',
                'Error processing decision. Please try again.',
                'error'
            );
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
    
    return (
        <>
            {/* Header */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-gradient-info text-white border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-clipboard-check fs-2"></i>
                                    </div>
                                    <div>
                                        <h3 className="mb-1 fw-bold">Contract Approvals</h3>
                                        <p className="mb-0 opacity-75">Review and approve seller contracts</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <Badge bg="warning" className="fs-6 px-3 py-2">
                                        {pendingContracts.length} Pending
                                    </Badge>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>
            
            {/* Pending Contracts */}
            <Row>
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="border-0 bg-light">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <i className="fas fa-hourglass-half text-warning fs-5"></i>
                                </div>
                                <div>
                                    <h4 className="mb-1 text-dark fw-bold">⏳ Contracts Awaiting Your Approval</h4>
                                    <p className="text-muted mb-0">Review contract details and take action</p>
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
                                                <i className="fas fa-calendar me-2 text-info"></i>
                                                Timeline
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
                                            <tr key={index} className="border-bottom">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <div className="fw-bold text-dark mb-1">{contract.contractTitle}</div>
                                                        <div className="text-muted small mb-1">
                                                            <strong>Code:</strong> {contract.contractCode}
                                                        </div>
                                                        <div className="text-muted small mb-2">
                                                            <strong>Type:</strong> {contract.contractType}
                                                        </div>
                                                        <Badge bg="warning" className="me-2">
                                                            <i className="fas fa-clock me-1"></i>
                                                            Pending Approval
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-muted small">
                                                        <div className="mb-1">
                                                            <i className="fas fa-play text-success me-1"></i>
                                                            <strong>Start:</strong> {new Date(contract.startDate).toLocaleDateString()}
                                                        </div>
                                                        <div className="mb-1">
                                                            <i className="fas fa-stop text-danger me-1"></i>
                                                            <strong>End:</strong> {new Date(contract.endDate).toLocaleDateString()}
                                                        </div>
                                                        <div>
                                                            <i className="fas fa-paper-plane text-info me-1"></i>
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
                                                            <strong>Currency:</strong> {contract.currency}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="d-flex flex-column gap-2">
                                                        <Button 
                                                            variant="success" 
                                                            size="sm"
                                                            onClick={() => handleContractAction(contract, 'approve')}
                                                            className="d-flex align-items-center"
                                                        >
                                                            <i className="fas fa-check me-2"></i>
                                                            Approve
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleContractAction(contract, 'reject')}
                                                            className="d-flex align-items-center"
                                                        >
                                                            <i className="fas fa-times me-2"></i>
                                                            Reject
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="info" 
                                                            size="sm"
                                                            onClick={() => handleContractAction(contract, 'modify')}
                                                            className="d-flex align-items-center"
                                                        >
                                                            <i className="fas fa-edit me-2"></i>
                                                            Ask for Modification
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
            
            {/* Approval Modal */}
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
        </>
    );
};

export default BuyerContractApproval;