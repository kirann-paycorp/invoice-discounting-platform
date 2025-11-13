import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert, Badge, Modal, Table } from 'react-bootstrap';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';

import DropzoneBlog from './Invoices/DropzoneBlog';

const CreateInvoices = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { projectData, milestoneData, invoiceType } = location.state || {};
    
    // State for form inputs
    const [formData, setFormData] = useState({
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        invoiceDate: new Date().toISOString().slice(0, 10),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        gstPercentage: 18,
        remarks: '',
        attachments: []
    });

    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-calculated values based on project/milestone data
    const milestoneAmount = milestoneData ? 
        parseFloat(projectData.value.replace(/[₹,]/g, '')) * milestoneData.percentage / 100 : 
        parseFloat(projectData?.value?.replace(/[₹,]/g, '') || 0);
    
    const subtotal = milestoneAmount;
    const gstAmount = (subtotal * formData.gstPercentage) / 100;
    const totalAmount = subtotal + gstAmount;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        // Create invoice object
        console.log('🔍 Debug - Project data for invoice:', projectData);
        console.log('🔍 Debug - Buyer name being set:', projectData?.client);
        
        const invoiceData = {
            ...formData,
            projectId: projectData?.id,
            milestoneId: milestoneData?.id,
            buyerName: projectData?.client,
            projectName: projectData?.name,
            contractReference: projectData?.id,
            milestoneDescription: milestoneData?.description,
            milestonePercentage: milestoneData?.percentage,
            subtotal,
            gstAmount,
            totalAmount,
            status: 'Pending Buyer Approval',
            createdAt: new Date().toISOString(),
            invoiceType: invoiceType || 'milestone'
        };

        const loadingId = showLoadingNotification('Preparing invoice submission...');

        // Simulate processing steps
        setTimeout(() => {
            updateLoadingNotification(loadingId, 'Validating invoice details...');
        }, 500);

        setTimeout(() => {
            updateLoadingNotification(loadingId, 'Calculating totals and tax amounts...');
        }, 1000);

        setTimeout(() => {
            updateLoadingNotification(loadingId, 'Saving invoice to system...');
            
            // Save to localStorage
            const existingInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
            existingInvoices.push(invoiceData);
            localStorage.setItem('invoices', JSON.stringify(existingInvoices));

            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('invoiceCreated', { 
                detail: invoiceData 
            }));
        }, 1500);

        setTimeout(() => {
            updateLoadingNotification(loadingId, 'Notifying buyer for approval...');
        }, 2000);

        setTimeout(() => {
            setIsSubmitting(false);
            updateLoadingNotification(
                loadingId, 
                `Invoice ${invoiceData.invoiceNumber} submitted successfully! Buyer will be notified for approval.`, 
                true
            );
            navigate('/dashboard');
        }, 2500);
    };

    // If no project data, redirect back
    useEffect(() => {
        if (!projectData) {
            navigate('/create-invoices');
        }
    }, [projectData, navigate]);

    if (!projectData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Header className="border-0 bg-success text-white">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-file-invoice fs-3 me-3"></i>
                                    <div>
                                        <h3 className="mb-1 fw-bold">Create New Invoice</h3>
                                        <p className="mb-0 opacity-75">
                                            {invoiceType === 'milestone' ? 'Milestone-based Invoice' : 'Project Invoice'}
                                        </p>
                                    </div>
                                </div>
                                <Badge bg="light" text="dark" className="fs-6">
                                    Auto-Generated #{formData.invoiceNumber}
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {/* Auto-filled Project/Client Information */}
                            <div className="mb-4">
                                <h4 className="fs-18 fw-bold text-primary mb-3">
                                    <i className="fas fa-building me-2"></i>
                                    CLIENT INFORMATION (Auto-filled)
                                </h4>
                                <Row className="border rounded p-3 bg-light">
                                    <Col xl={3}>
                                        <div className="d-flex align-items-center">
                                            <div className="me-3">
                                                <div 
                                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{width: '50px', height: '50px', backgroundColor: '#007bff'}}
                                                >
                                                    <i className="fas fa-building text-white"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="mb-1 fw-bold">{projectData.client}</h5>
                                                <small className="text-muted">Enterprise Client</small>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={3}>
                                        <div className="d-flex">
                                            <div className="me-3">
                                                <i className="fas fa-project-diagram text-primary fs-5 mt-1"></i>
                                            </div>
                                            <div>
                                                <span className="fw-bold text-muted d-block">PROJECT</span>
                                                <span className="fs-6 fw-bold">{projectData.name}</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={3}>
                                        <div className="d-flex">
                                            <div className="me-3">
                                                <i className="fas fa-file-contract text-primary fs-5 mt-1"></i>
                                            </div>
                                            <div>
                                                <span className="fw-bold text-muted d-block">CONTRACT REF</span>
                                                <span className="fs-6 fw-bold">{projectData.id}</span>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={3}>
                                        <div className="d-flex">
                                            <div className="me-3">
                                                <i className="fas fa-rupee-sign text-success fs-5 mt-1"></i>
                                            </div>
                                            <div>
                                                <span className="fw-bold text-muted d-block">PROJECT VALUE</span>
                                                <span className="fs-6 fw-bold text-success">{projectData.value}</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* Milestone Information (if milestone invoice) */}
                            {milestoneData && (
                                <div className="mb-4">
                                    <h4 className="fs-18 fw-bold text-warning mb-3">
                                        <i className="fas fa-flag me-2"></i>
                                        MILESTONE DETAILS (Auto-filled)
                                    </h4>
                                    <Row className="border rounded p-3 bg-warning bg-opacity-10">
                                        <Col md={6}>
                                            <div className="mb-2">
                                                <strong className="text-muted">Milestone Name:</strong>
                                                <div className="fw-bold">{milestoneData.name}</div>
                                            </div>
                                            <div>
                                                <strong className="text-muted">Description:</strong>
                                                <div className="text-muted">{milestoneData.description}</div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="text-center">
                                                <strong className="text-muted d-block">Milestone %</strong>
                                                <div className="fs-3 fw-bold text-warning">{milestoneData.percentage}%</div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="text-center">
                                                <strong className="text-muted d-block">Milestone Value</strong>
                                                <div className="fs-4 fw-bold text-success">
                                                    ₹{milestoneAmount.toLocaleString('en-IN')}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            {/* Invoice Details Form */}
                            <div className="mb-4">
                                <h4 className="fs-18 fw-bold text-success mb-3">
                                    <i className="fas fa-edit me-2"></i>
                                    INVOICE DETAILS (Seller Input Required)
                                </h4>
                                <Row>
                                    <Col xl={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Invoice Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={formData.invoiceNumber}
                                                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                                                placeholder="INV-001"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xl={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Invoice Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formData.invoiceDate}
                                                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xl={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Due Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={formData.dueDate}
                                                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col xl={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Invoice Amount (Auto-calculated)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={`₹${milestoneAmount.toLocaleString('en-IN')}`}
                                                disabled
                                                className="bg-light"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xl={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">GST %</Form.Label>
                                            <Form.Select
                                                value={formData.gstPercentage}
                                                onChange={(e) => handleInputChange('gstPercentage', parseInt(e.target.value))}
                                            >
                                                <option value={5}>5%</option>
                                                <option value={12}>12%</option>
                                                <option value={18}>18%</option>
                                                <option value={28}>28%</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col xl={4}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Total Amount (Auto-calculated)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={`₹${totalAmount.toLocaleString('en-IN')}`}
                                                disabled
                                                className="bg-success bg-opacity-10 fw-bold text-success"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xl={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Remarks</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={formData.remarks}
                                                onChange={(e) => handleInputChange('remarks', e.target.value)}
                                                placeholder={`Work completed as per ${milestoneData ? 'milestone' : 'project'} requirements. All deliverables have been provided as agreed.`}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            {/* Auto Calculations Display */}
                            <div className="mb-4">
                                <h4 className="fs-18 fw-bold text-info mb-3">
                                    <i className="fas fa-calculator me-2"></i>
                                    AUTO CALCULATIONS
                                </h4>
                                <Card className="bg-#28a745 bg-opacity-10 border-success">
                                    <Card.Body>
                                        <Row>
                                            <Col md={4}>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="fw-bold">Subtotal:</span>
                                                    <span className="fw-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="fw-bold">GST ({formData.gstPercentage}%):</span>
                                                    <span className="fw-bold text-warning">₹{gstAmount.toLocaleString('en-IN')}</span>
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                <div className="d-flex justify-content-between mb-2 border-top pt-2">
                                                    <span className="fw-bold fs-5">Total Invoice:</span>
                                                    <span className="fw-bold fs-5 text-success">₹{totalAmount.toLocaleString('en-IN')}</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </div>

                            {/* File Upload */}
                            <div className="mb-4">
                                <h4 className="fs-18 fw-bold mb-3">
                                    <i className="fas fa-paperclip me-2"></i>
                                    ATTACH SUPPORTING DOCUMENTS
                                </h4>
                                <Row>
                                    <Col xl={8}>
                                        <div className="border rounded p-3">
                                            <DropzoneBlog />
                                            <small className="text-muted mt-2 d-block">
                                                <i className="fas fa-info-circle me-1"></i>
                                                Upload work proof, delivery screenshots, completion certificates, etc.
                                            </small>
                                        </div>
                                    </Col>
                                    <Col xl={4}>
                                        <Alert variant="info" className="h-100 d-flex align-items-center">
                                            <div>
                                                <h6 className="fw-bold mb-2">
                                                    <i className="fas fa-lightbulb me-2"></i>
                                                    Recommended Documents:
                                                </h6>
                                                <ul className="mb-0 small">
                                                    <li>Work completion screenshots</li>
                                                    <li>Delivery confirmation</li>
                                                    <li>Quality assurance reports</li>
                                                    <li>Client communication logs</li>
                                                </ul>
                                            </div>
                                        </Alert>
                                    </Col>
                                </Row>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex justify-content-between align-items-center">
                                <Button 
                                    variant="outline-secondary"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Cancel
                                </Button>
                                
                                <div className="d-flex gap-3">
                                    <Button 
                                        variant="outline-info"
                                        onClick={() => setShowPreview(true)}
                                    >
                                        <i className="fas fa-eye me-2"></i>
                                        Preview Invoice
                                    </Button>
                                    
                                    <Button 
                                        variant="success"
                                        size="lg"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin me-2"></i>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Submit for Buyer Approval
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Preview Modal */}
            <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Invoice Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="invoice-preview p-4">
                        <div className="text-center mb-4">
                            <h3 className="fw-bold">INVOICE</h3>
                            <p className="text-muted">#{formData.invoiceNumber}</p>
                        </div>
                        
                        <Row className="mb-4">
                            <Col md={6}>
                                <h5 className="fw-bold">From:</h5>
                                <p className="mb-0">Your Company Name</p>
                                <p className="mb-0">Invoice Discounting Platform</p>
                                <p className="text-muted">Seller Dashboard</p>
                            </Col>
                            <Col md={6}>
                                <h5 className="fw-bold">To:</h5>
                                <p className="mb-0">{projectData.client}</p>
                                <p className="text-muted">Enterprise Client</p>
                            </Col>
                        </Row>

                        <Table bordered>
                            <thead className="bg-light">
                                <tr>
                                    <th>Description</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>{milestoneData ? milestoneData.name : projectData.name}</strong><br/>
                                        <small className="text-muted">
                                            {milestoneData ? milestoneData.description : 'Full project delivery'}
                                        </small>
                                    </td>
                                    <td className="text-end">₹{subtotal.toLocaleString('en-IN')}</td>
                                </tr>
                                <tr>
                                    <td><strong>GST ({formData.gstPercentage}%)</strong></td>
                                    <td className="text-end">₹{gstAmount.toLocaleString('en-IN')}</td>
                                </tr>
                                <tr className="table-success">
                                    <td><strong>Total Amount</strong></td>
                                    <td className="text-end"><strong>₹{totalAmount.toLocaleString('en-IN')}</strong></td>
                                </tr>
                            </tbody>
                        </Table>

                        <div className="mt-4">
                            <p><strong>Due Date:</strong> {formData.dueDate}</p>
                            <p><strong>Remarks:</strong> {formData.remarks || 'Work completed as per agreement.'}</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPreview(false)}>
                        Close Preview
                    </Button>
                    <Button variant="success" onClick={() => {
                        setShowPreview(false);
                        handleSubmit();
                    }}>
                        Submit Invoice
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreateInvoices; 