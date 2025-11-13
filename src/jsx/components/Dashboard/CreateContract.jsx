import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Badge, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';

const CreateContract = () => {
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        // Basic Information
        contractTitle: '',
        contractCode: '',
        buyer: '',
        contractType: '',
        startDate: '',
        endDate: '',
        contractValue: '',
        currency: 'INR',
        paymentTerms: '',
        invoiceAllowed: true,
        
        // Scope & Description
        scopeOfWork: '',
        deliverables: '',
        contractCategory: '',
        milestoneBasedToggle: false,
        
        // Financial Terms
        advancePaymentPercent: '',
        retentionPercent: '',
        penaltyClause: '',
        taxApplicability: '',
        discountAllowed: false,
        
        // Document Uploads
        signedContract: null,
        supportingDocs: [],
        
        // System Information
        contractStatus: 'Draft'
    });
    
    const [clients, setClients] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    
    // Load clients from localStorage
    useEffect(() => {
        const savedClients = localStorage.getItem('activeClients');
        if (savedClients) {
            try {
                const parsedClients = JSON.parse(savedClients);
                setClients(parsedClients);
            } catch (error) {
                console.error('Error loading clients:', error);
            }
        }
    }, []);
    
    // Generate contract code
    useEffect(() => {
        if (!formData.contractCode) {
            const timestamp = Date.now().toString().slice(-6);
            setFormData(prev => ({
                ...prev,
                contractCode: `CONT-2024-${timestamp}`
            }));
        }
    }, []);
    
    // Contract type options
    const contractTypes = [
        'Supply Contract',
        'Service Agreement',
        'Maintenance Contract',
        'AMC (Annual Maintenance)',
        'Lease Agreement',
        'Consulting Services',
        'Software Development',
        'Construction Contract',
        'Equipment Supply',
        'Professional Services'
    ];
    
    // Contract categories
    const contractCategories = [
        'CapEx (Capital Expenditure)',
        'OpEx (Operational Expenditure)',
        'Service Agreement',
        'Recurring Services',
        'One-time Project',
        'Maintenance & Support'
    ];
    
    // Tax options
    const taxOptions = [
        'GST Applicable',
        'TDS Applicable',
        'GST + TDS',
        'Tax Exempt',
        'None'
    ];
    
    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };
    
    // Handle file uploads
    const handleFileUpload = (field, files) => {
        if (field === 'signedContract') {
            setFormData(prev => ({
                ...prev,
                signedContract: files[0]
            }));
        } else if (field === 'supportingDocs') {
            setFormData(prev => ({
                ...prev,
                supportingDocs: Array.from(files)
            }));
        }
    };
    
    // Form validation
    const validateForm = () => {
        const newErrors = {};
        
        // Required fields
        if (!formData.contractTitle.trim()) newErrors.contractTitle = 'Contract title is required';
        if (!formData.buyer) newErrors.buyer = 'Please select a buyer/client';
        if (!formData.contractType) newErrors.contractType = 'Contract type is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.contractValue) newErrors.contractValue = 'Contract value is required';
        if (!formData.paymentTerms) newErrors.paymentTerms = 'Payment terms are required';
        if (!formData.scopeOfWork.trim()) newErrors.scopeOfWork = 'Scope of work is required';
        
        // Date validation
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            if (endDate <= startDate) {
                newErrors.endDate = 'End date must be after start date';
            }
        }
        
        // Number validation
        if (formData.contractValue && isNaN(parseFloat(formData.contractValue))) {
            newErrors.contractValue = 'Please enter a valid contract value';
        }
        
        if (formData.paymentTerms && isNaN(parseInt(formData.paymentTerms))) {
            newErrors.paymentTerms = 'Please enter valid payment terms (days)';
        }
        
        if (formData.advancePaymentPercent && (isNaN(parseFloat(formData.advancePaymentPercent)) || formData.advancePaymentPercent < 0 || formData.advancePaymentPercent > 100)) {
            newErrors.advancePaymentPercent = 'Advance payment must be between 0-100%';
        }
        
        if (formData.retentionPercent && (isNaN(parseFloat(formData.retentionPercent)) || formData.retentionPercent < 0 || formData.retentionPercent > 100)) {
            newErrors.retentionPercent = 'Retention must be between 0-100%';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Handle form submission
    const handleSubmit = async (action = 'Draft') => {
        if (!validateForm()) {
            showNotification(
                'Validation Error',
                'Please fill all required fields correctly',
                'error'
            );
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Determine status based on action
            let contractStatus = 'Draft';
            if (action === 'Submit') {
                contractStatus = 'Pending'; // Pending buyer approval
            }
            
            // Find selected buyer details
            const selectedBuyer = clients.find(client => client.id === formData.buyer);
            
            const contractData = {
                id: `CONT-${Date.now()}`, // Unique contract ID
                ...formData,
                contractStatus,
                createdOn: new Date().toISOString(),
                createdBy: 'Current Seller', // Replace with actual seller info
                sellerId: 'SELLER-001', // Replace with actual seller ID
                buyerDetails: selectedBuyer,
                submittedForApprovalOn: action === 'Submit' ? new Date().toISOString() : null,
                approvalHistory: []
            };
            
            console.log('💾 Submitting contract:', contractData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Save to contracts localStorage
            const savedContracts = localStorage.getItem('contracts') || '[]';
            const existingContracts = JSON.parse(savedContracts);
            const updatedContracts = [contractData, ...existingContracts];
            localStorage.setItem('contracts', JSON.stringify(updatedContracts));
            
            // If submitted for approval, also save to buyer's pending contracts
            if (action === 'Submit' && selectedBuyer) {
                const buyerPendingContracts = localStorage.getItem(`buyer_pending_contracts_${selectedBuyer.id}`) || '[]';
                const existingBuyerContracts = JSON.parse(buyerPendingContracts);
                const updatedBuyerContracts = [contractData, ...existingBuyerContracts];
                localStorage.setItem(`buyer_pending_contracts_${selectedBuyer.id}`, JSON.stringify(updatedBuyerContracts));
                
                console.log(`📤 Contract sent to buyer ${selectedBuyer.name} for approval`);
                console.log('🔍 Debug - Selected buyer:', selectedBuyer);
                console.log('🔍 Debug - Contract data being saved:', contractData);
                console.log('🔍 Debug - Storage key:', `buyer_pending_contracts_${selectedBuyer.id}`);
                console.log('🔍 Debug - Updated buyer contracts:', updatedBuyerContracts);
            }
            
            // Show appropriate success message
            const successMessage = action === 'Submit' 
                ? `Contract "${formData.contractTitle}" has been submitted to ${selectedBuyer?.name} for approval!`
                : `Contract "${formData.contractTitle}" has been saved as draft!`;
            
            const notificationType = action === 'Submit' ? 'success' : 'info';
            const title = action === 'Submit' ? 'Contract Submitted!' : 'Draft Saved!';
            
            showNotification(title, successMessage, notificationType);
            
            // Dispatch event to update dashboard
            const contractEvent = new CustomEvent('contractSubmitted', {
                detail: { contractData, action }
            });
            window.dispatchEvent(contractEvent);
            
            // Navigate back to dashboard
            navigate('/dashboard');
            
        } catch (error) {
            console.error('Error submitting contract:', error);
            showNotification(
                'Contract Error',
                'Error creating contract. Please try again.',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Calculate form completion percentage
    const getFormCompletion = () => {
        const requiredFields = [
            'contractTitle', 'buyer', 'contractType', 'startDate', 'endDate', 
            'contractValue', 'paymentTerms', 'scopeOfWork'
        ];
        const filledFields = requiredFields.filter(field => 
            formData[field] && formData[field].toString().trim() !== ''
        );
        return Math.round((filledFields.length / requiredFields.length) * 100);
    };

    return (
        <>
            {/* Header */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-gradient-primary text-white border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-file-contract fs-2"></i>
                                    </div>
                                    <div>
                                        <h3 className="mb-1 fw-bold">Add Contract</h3>
                                        <p className="mb-0 opacity-75">Create a new contract between Seller and Buyer</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="mb-2">
                                        <small className="fw-medium">Form Completion</small>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <ProgressBar 
                                            now={getFormCompletion()} 
                                            className="me-2 flex-grow-1"
                                            style={{minWidth: '100px', height: '8px'}}
                                            variant={getFormCompletion() > 80 ? 'success' : getFormCompletion() > 50 ? 'warning' : 'info'}
                                        />
                                        <small className="fw-bold">{getFormCompletion()}%</small>
                                    </div>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>
            
            {/* Section 1 - Basic Contract Details */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="border-0 bg-light">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <i className="fas fa-info-circle text-primary fs-5"></i>
                                </div>
                                <div>
                                    <h4 className="mb-1 text-dark fw-bold">📋 Basic Contract Details</h4>
                                    <p className="text-muted mb-0">Essential contract information and terms</p>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Contract Title / Name <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="e.g., Transformer Supply Contract"
                                            value={formData.contractTitle}
                                            onChange={(e) => handleInputChange('contractTitle', e.target.value)}
                                            isInvalid={errors.contractTitle}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.contractTitle}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Contract Code / Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Auto-generated unique identifier"
                                            value={formData.contractCode}
                                            onChange={(e) => handleInputChange('contractCode', e.target.value)}
                                            className="bg-light"
                                        />
                                        <Form.Text muted>Auto-generated, but you can modify if needed</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Buyer / Client <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={formData.buyer}
                                            onChange={(e) => handleInputChange('buyer', e.target.value)}
                                            isInvalid={errors.buyer}
                                        >
                                            <option value="">Select buyer/client</option>
                                            {clients.map((client) => (
                                                <option key={client.id} value={client.id}>
                                                    {client.name} ({client.email})
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.buyer}
                                        </Form.Control.Feedback>
                                        {clients.length === 0 && (
                                            <Form.Text className="text-warning">
                                                <i className="fas fa-exclamation-triangle me-1"></i>
                                                No clients found. <Button variant="link" size="sm" className="p-0" onClick={() => navigate('/add-client')}>Add a client first</Button>
                                            </Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Contract Type <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            value={formData.contractType}
                                            onChange={(e) => handleInputChange('contractType', e.target.value)}
                                            isInvalid={errors.contractType}
                                        >
                                            <option value="">Select contract type</option>
                                            {contractTypes.map((type, index) => (
                                                <option key={index} value={type}>{type}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.contractType}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Start Date <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                                            isInvalid={errors.startDate}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.startDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            End Date <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                                            isInvalid={errors.endDate}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.endDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Contract Value (₹) <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="e.g., 2500000"
                                            value={formData.contractValue}
                                            onChange={(e) => handleInputChange('contractValue', e.target.value)}
                                            isInvalid={errors.contractValue}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.contractValue}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Currency</Form.Label>
                                        <Form.Select
                                            value={formData.currency}
                                            onChange={(e) => handleInputChange('currency', e.target.value)}
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Payment Terms (Days) <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="e.g., 30, 45, 60"
                                            value={formData.paymentTerms}
                                            onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                                            isInvalid={errors.paymentTerms}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.paymentTerms}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-0">
                                        <Form.Check
                                            type="switch"
                                            id="invoiceAllowed"
                                            label="Invoice Allowed - Seller can raise invoices under this contract"
                                            checked={formData.invoiceAllowed}
                                            onChange={(e) => handleInputChange('invoiceAllowed', e.target.checked)}
                                            className="fw-medium"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            {/* Section 2 - Description & Scope */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="border-0 bg-light">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <i className="fas fa-tasks text-info fs-5"></i>
                                </div>
                                <div>
                                    <h4 className="mb-1 text-dark fw-bold">🏗️ Contract Scope / Description</h4>
                                    <p className="text-muted mb-0">Define the work scope and deliverables</p>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Scope of Work / Description <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            placeholder="High-level summary of deliverables and work to be performed under this contract"
                                            value={formData.scopeOfWork}
                                            onChange={(e) => handleInputChange('scopeOfWork', e.target.value)}
                                            isInvalid={errors.scopeOfWork}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.scopeOfWork}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Deliverables (Optional)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Detailed list of specific deliverables, milestones, or outcomes"
                                            value={formData.deliverables}
                                            onChange={(e) => handleInputChange('deliverables', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Contract Category</Form.Label>
                                        <Form.Select
                                            value={formData.contractCategory}
                                            onChange={(e) => handleInputChange('contractCategory', e.target.value)}
                                        >
                                            <option value="">Select category</option>
                                            {contractCategories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-0">
                                        <Form.Check
                                            type="switch"
                                            id="milestoneBasedToggle"
                                            label="Milestone Based Contract"
                                            checked={formData.milestoneBasedToggle}
                                            onChange={(e) => handleInputChange('milestoneBasedToggle', e.target.checked)}
                                            className="fw-medium"
                                        />
                                        <Form.Text muted>Enable milestone creation later</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            {/* Section 3 - Financial Terms */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="border-0 bg-light">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <i className="fas fa-calculator text-success fs-5"></i>
                                </div>
                                <div>
                                    <h4 className="mb-1 text-dark fw-bold">💰 Financial & Terms Section</h4>
                                    <p className="text-muted mb-0">Payment terms, penalties, and tax information</p>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Advance Payment %</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="e.g., 20"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={formData.advancePaymentPercent}
                                            onChange={(e) => handleInputChange('advancePaymentPercent', e.target.value)}
                                            isInvalid={errors.advancePaymentPercent}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.advancePaymentPercent}
                                        </Form.Control.Feedback>
                                        <Form.Text muted>If advance payment is applicable</Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Retention %</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="e.g., 10"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={formData.retentionPercent}
                                            onChange={(e) => handleInputChange('retentionPercent', e.target.value)}
                                            isInvalid={errors.retentionPercent}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.retentionPercent}
                                        </Form.Control.Feedback>
                                        <Form.Text muted>If retention is applicable</Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Tax Applicability</Form.Label>
                                        <Form.Select
                                            value={formData.taxApplicability}
                                            onChange={(e) => handleInputChange('taxApplicability', e.target.value)}
                                        >
                                            <option value="">Select tax type</option>
                                            {taxOptions.map((tax, index) => (
                                                <option key={index} value={tax}>{tax}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Penalty Clause</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Any penalty for delay, non-performance, or breach of contract terms"
                                            value={formData.penaltyClause}
                                            onChange={(e) => handleInputChange('penaltyClause', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="switch"
                                            id="discountAllowed"
                                            label="Early Payment Discount Allowed"
                                            checked={formData.discountAllowed}
                                            onChange={(e) => handleInputChange('discountAllowed', e.target.checked)}
                                            className="fw-medium"
                                        />
                                        <Form.Text muted>Whether early payment discount applies</Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            {/* Section 4 - Document Uploads */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="border-0 bg-light">
                            <div className="d-flex align-items-center">
                                <div className="me-3">
                                    <i className="fas fa-upload text-warning fs-5"></i>
                                </div>
                                <div>
                                    <h4 className="mb-1 text-dark fw-bold">📎 Document Uploads</h4>
                                    <p className="text-muted mb-0">Upload contract documents and supporting files</p>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Upload Signed Contract (PDF)</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => handleFileUpload('signedContract', e.target.files)}
                                        />
                                        <Form.Text muted>The legal document (PDF format preferred)</Form.Text>
                                        {formData.signedContract && (
                                            <div className="mt-2">
                                                <Badge bg="success">
                                                    <i className="fas fa-file-pdf me-1"></i>
                                                    {formData.signedContract.name}
                                                </Badge>
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Supporting Documents</Form.Label>
                                        <Form.Control
                                            type="file"
                                            multiple
                                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                            onChange={(e) => handleFileUpload('supportingDocs', e.target.files)}
                                        />
                                        <Form.Text muted>Optional supporting files (PO, correspondence, etc.)</Form.Text>
                                        {formData.supportingDocs.length > 0 && (
                                            <div className="mt-2">
                                                {formData.supportingDocs.map((file, index) => (
                                                    <Badge key={index} bg="info" className="me-1 mb-1">
                                                        <i className="fas fa-file me-1"></i>
                                                        {file.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            {/* Section 5 - Footer */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="d-flex align-items-center text-muted mb-2">
                                        <div className="d-flex align-items-center me-4">
                                            <i className="fas fa-info-circle me-2"></i>
                                            <small className="fw-medium">Contract Status: <Badge bg="secondary">{formData.contractStatus}</Badge></small>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-calendar me-2"></i>
                                            <small className="fw-medium">Created: {new Date().toLocaleDateString()}</small>
                                        </div>
                                    </div>
                                    <small className="text-muted">All fields marked with * are mandatory</small>
                                </div>
                                
                                <div className="d-flex gap-3">
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={() => navigate('/dashboard')}
                                        disabled={isSubmitting}
                                    >
                                        <i className="fas fa-times me-1"></i>
                                        Cancel
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => handleSubmit('Draft')}
                                        disabled={isSubmitting}
                                    >
                                        <i className="fas fa-save me-1"></i>
                                        {isSubmitting ? 'Saving...' : 'Save Draft'}
                                    </Button>
                                    
                                    <Button 
                                        variant="success" 
                                        onClick={() => handleSubmit('Submit')}
                                        disabled={isSubmitting}
                                    >
                                        <i className="fas fa-paper-plane me-1"></i>
                                        {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default CreateContract;