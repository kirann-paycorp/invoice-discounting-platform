import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Accordion, Alert, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';

const AddClient = () => {
    const navigate = useNavigate();
    
    // Form state management
    const [formData, setFormData] = useState({
        // Basic Company Details
        buyerName: '',
        companyType: '',
        cinNumber: '',
        gstNumber: '',
        panNumber: '',
        industryType: '',
        
        // Contact & Address Details
        registeredAddress: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        contactPersonName: '',
        designation: '',
        email: '',
        phoneNumber: '',
        
        // Banking Details (Optional)
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        branchName: '',
        
        // Additional Info
        creditLimit: '',
        paymentTerms: '',
        notes: ''
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [isDraft, setIsDraft] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dropdown options
    const companyTypes = [
        'Private Limited Company',
        'Public Limited Company',
        'Limited Liability Partnership (LLP)',
        'Partnership Firm',
        'Sole Proprietorship',
        'Government Entity',
        'Trust',
        'Society',
        'NGO'
    ];

    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ];

    const industryTypes = [
        'Information Technology', 'Manufacturing', 'Healthcare', 'Finance & Banking',
        'Retail & E-commerce', 'Real Estate', 'Education', 'Automotive',
        'Pharmaceuticals', 'Textiles', 'Food & Beverage', 'Consulting',
        'Construction', 'Energy & Utilities', 'Media & Entertainment', 'Other'
    ];

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Validation functions
    const validateGST = (gst) => {
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        return gstRegex.test(gst);
    };

    const validatePAN = (pan) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(pan);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    };

    // Form validation
    const validateForm = (isDraftSave = false) => {
        const errors = {};

        if (!isDraftSave) {
            // Mandatory fields for final submission
            if (!formData.buyerName.trim()) errors.buyerName = 'Buyer name is required';
            if (!formData.companyType) errors.companyType = 'Company type is required';
            if (!formData.gstNumber.trim()) {
                errors.gstNumber = 'GST number is required';
            } else if (!validateGST(formData.gstNumber)) {
                errors.gstNumber = 'Invalid GST number format';
            }
            if (!formData.panNumber.trim()) {
                errors.panNumber = 'PAN number is required';
            } else if (!validatePAN(formData.panNumber)) {
                errors.panNumber = 'Invalid PAN number format';
            }
            if (!formData.email.trim()) {
                errors.email = 'Email is required';
            } else if (!validateEmail(formData.email)) {
                errors.email = 'Invalid email format';
            }
            if (!formData.phoneNumber.trim()) {
                errors.phoneNumber = 'Phone number is required';
            } else if (!validatePhone(formData.phoneNumber)) {
                errors.phoneNumber = 'Invalid phone number format';
            }
        }

        // Conditional validations
        if (formData.gstNumber && !validateGST(formData.gstNumber)) {
            errors.gstNumber = 'Invalid GST number format';
        }
        if (formData.panNumber && !validatePAN(formData.panNumber)) {
            errors.panNumber = 'Invalid PAN number format';
        }
        if (formData.email && !validateEmail(formData.email)) {
            errors.email = 'Invalid email format';
        }
        if (formData.phoneNumber && !validatePhone(formData.phoneNumber)) {
            errors.phoneNumber = 'Invalid phone number format';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            // Here you would typically call your API
            console.log('Submitting client data:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Dispatch custom event to notify dashboard of new client
            const clientAddedEvent = new CustomEvent('clientAdded', {
                detail: {
                    clientData: formData
                }
            });
            
            console.log('🚀 AddClient: Dispatching client added event:', formData.buyerName);
            console.log('📤 AddClient: Event detail:', clientAddedEvent.detail);
            
            window.dispatchEvent(clientAddedEvent);
            
            // Also save directly to localStorage as backup
            const savedClients = localStorage.getItem('activeClients');
            let existingClients = [];
            
            if (savedClients) {
                try {
                    existingClients = JSON.parse(savedClients);
                } catch (error) {
                    console.error('Error parsing existing clients:', error);
                }
            }
            
            // Create new client object for localStorage
            const newClient = {
                id: `CLIENT-${String(Date.now()).slice(-3)}`,
                name: formData.buyerName,
                email: formData.email,
                projects: 0,
                totalValue: '₹0',
                status: 'Active',
                lastActivity: 'Just added',
                contactPerson: formData.contactPersonName,
                phone: formData.phoneNumber,
                addedDate: new Date().toISOString().split('T')[0],
                additionalData: formData
            };
            
            // Add to existing clients array
            const updatedClients = [newClient, ...existingClients];
            localStorage.setItem('activeClients', JSON.stringify(updatedClients));
            console.log('💾 AddClient: Client saved directly to localStorage:', newClient.name);
            
            // Show success message
            showNotification(
                'Client Added Successfully!',
                `Client "${formData.buyerName}" has been added to your dashboard.`,
                'success'
            );
            
            // Small delay before navigation to ensure events are processed
            setTimeout(() => {
                navigate('/dashboard');
            }, 100);
        } catch (error) {
            console.error('Error submitting client:', error);
            showNotification(
                'Error Adding Client',
                'There was an error adding the client. Please try again.',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle save as draft
    const handleSaveAsDraft = async () => {
        setIsDraft(true);
        
        try {
            // Here you would save as draft
            console.log('Saving as draft:', formData);
            
            // Show loading notification with steps
            const notificationId = showLoadingNotification('Saving Draft', 'Preparing client data...');
            
            await new Promise(resolve => setTimeout(resolve, 400));
            updateLoadingNotification(notificationId, 'Saving Draft', 'Validating information...');
            
            await new Promise(resolve => setTimeout(resolve, 600));
            updateLoadingNotification(notificationId, 'Draft Saved!', 'Client details saved as draft successfully!', 'success', true);
        } catch (error) {
            console.error('Error saving draft:', error);
        } finally {
            setIsDraft(false);
        }
    };

    // Auto-fill GST lookup (placeholder function)
    const handleGSTLookup = async (gstNumber) => {
        if (validateGST(gstNumber)) {
            // Placeholder for GST API lookup
            console.log('Looking up GST:', gstNumber);
            // You can integrate GSTIN API here later
        }
    };

    return (
        <>
            {/* Header */}
            <Row>
                <Col xl={12}>
                    <Card className="mb-4">
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm" 
                                        className="me-3"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Back to Dashboard
                                    </Button>
                                    <div>
                                        <h3 className="text-dark mb-1 fw-bold">Add New Client</h3>
                                        <p className="text-muted mb-0 fs-6">Register a new buyer/client for invoice discounting</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <Badge bg="info">KYC Required</Badge>
                                    <Badge bg="success">Auto-Validation</Badge>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>

            <Form onSubmit={handleSubmit}>
                {/* Basic Company Details */}
                <Row className="mb-4">
                    <Col xl={12}>
                        <Card>
                            <Card.Header className="border-0">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-building text-primary fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-dark fw-bold">🧩 Basic Company Details</h4>
                                        <p className="text-muted mb-0">Mandatory information for client registration</p>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                Buyer/Client Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter registered legal name"
                                                value={formData.buyerName}
                                                onChange={(e) => handleInputChange('buyerName', e.target.value)}
                                                isInvalid={!!validationErrors.buyerName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {validationErrors.buyerName}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                Company Type <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Select
                                                value={formData.companyType}
                                                onChange={(e) => handleInputChange('companyType', e.target.value)}
                                                isInvalid={!!validationErrors.companyType}
                                            >
                                                <option value="">Select company type</option>
                                                {companyTypes.map((type, index) => (
                                                    <option key={index} value={type}>{type}</option>
                                                ))}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                {validationErrors.companyType}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">CIN / Business Registration Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter CIN or registration number"
                                                value={formData.cinNumber}
                                                onChange={(e) => handleInputChange('cinNumber', e.target.value.toUpperCase())}
                                            />
                                            <Form.Text className="text-muted">
                                                Corporate Identification Number for verification
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                GST Number <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter 15-digit GST number"
                                                value={formData.gstNumber}
                                                onChange={(e) => {
                                                    const value = e.target.value.toUpperCase();
                                                    handleInputChange('gstNumber', value);
                                                    if (value.length === 15) {
                                                        handleGSTLookup(value);
                                                    }
                                                }}
                                                isInvalid={!!validationErrors.gstNumber}
                                                maxLength={15}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {validationErrors.gstNumber}
                                            </Form.Control.Feedback>
                                            <Form.Text className="text-muted">
                                                Format: 22AAAAA0000A1Z5 (Auto-lookup enabled)
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                PAN Number <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter 10-digit PAN number"
                                                value={formData.panNumber}
                                                onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                                                isInvalid={!!validationErrors.panNumber}
                                                maxLength={10}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {validationErrors.panNumber}
                                            </Form.Control.Feedback>
                                            <Form.Text className="text-muted">
                                                Format: AAAAA0000A
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Industry Type</Form.Label>
                                            <Form.Select
                                                value={formData.industryType}
                                                onChange={(e) => handleInputChange('industryType', e.target.value)}
                                            >
                                                <option value="">Select industry</option>
                                                {industryTypes.map((industry, index) => (
                                                    <option key={index} value={industry}>{industry}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Contact & Address Details */}
                <Row className="mb-4">
                    <Col xl={12}>
                        <Card>
                            <Card.Header className="border-0">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-map-marker-alt text-info fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-dark fw-bold">🏢 Contact & Address Details</h4>
                                        <p className="text-muted mb-0">Communication and location information</p>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Registered Office Address</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Enter complete registered address"
                                                value={formData.registeredAddress}
                                                onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
                                            />
                                        </Form.Group>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">City</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter city name"
                                                        value={formData.city}
                                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">State</Form.Label>
                                                    <Form.Select
                                                        value={formData.state}
                                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                                    >
                                                        <option value="">Select state</option>
                                                        {indianStates.map((state, index) => (
                                                            <option key={index} value={state}>{state}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">Pincode</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="Enter 6-digit pincode"
                                                        value={formData.pincode}
                                                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                                                        maxLength={6}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-bold">Country</Form.Label>
                                                    <Form.Select
                                                        value={formData.country}
                                                        onChange={(e) => handleInputChange('country', e.target.value)}
                                                    >
                                                        <option value="India">India</option>
                                                        <option value="Other">Other</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                Primary Contact Person Name <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter contact person name"
                                                value={formData.contactPersonName}
                                                onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Designation</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="e.g. Finance Manager, Procurement Officer"
                                                value={formData.designation}
                                                onChange={(e) => handleInputChange('designation', e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                Email ID <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Enter email address"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                isInvalid={!!validationErrors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {validationErrors.email}
                                            </Form.Control.Feedback>
                                            <Form.Text className="text-muted">
                                                For communication and invoice approval alerts
                                            </Form.Text>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">
                                                Phone Number <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                type="tel"
                                                placeholder="Enter 10-digit mobile number"
                                                value={formData.phoneNumber}
                                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                isInvalid={!!validationErrors.phoneNumber}
                                                maxLength={10}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {validationErrors.phoneNumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Expandable Sections */}
                <Row className="mb-4">
                    <Col xl={12}>
                        <Accordion defaultActiveKey="">
                            {/* Banking Details */}
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-university text-success me-3"></i>
                                        <div>
                                            <strong>Banking Details</strong>
                                            <small className="text-muted d-block">Optional - Can be added later</small>
                                        </div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Bank Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter bank name"
                                                    value={formData.bankName}
                                                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Account Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter account number"
                                                    value={formData.accountNumber}
                                                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">IFSC Code</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter IFSC code"
                                                    value={formData.ifscCode}
                                                    onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Branch Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter branch name"
                                                    value={formData.branchName}
                                                    onChange={(e) => handleInputChange('branchName', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Credit & Additional Info */}
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-credit-card text-warning me-3"></i>
                                        <div>
                                            <strong>Credit & Additional Information</strong>
                                            <small className="text-muted d-block">Business terms and notes</small>
                                        </div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Credit Limit</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    placeholder="Enter credit limit in ₹"
                                                    value={formData.creditLimit}
                                                    onChange={(e) => handleInputChange('creditLimit', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="fw-bold">Payment Terms</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="e.g. 30 days, 45 days"
                                                    value={formData.paymentTerms}
                                                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Additional Notes</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Any additional information or special terms"
                                            value={formData.notes}
                                            onChange={(e) => handleInputChange('notes', e.target.value)}
                                        />
                                    </Form.Group>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>

                {/* Action Buttons */}
                <Row>
                    <Col xl={12}>
                        <Card>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex gap-3">
                                        <Button 
                                            variant="outline-secondary"
                                            onClick={() => navigate('/dashboard')}
                                        >
                                            <i className="fas fa-times me-2"></i>
                                            Cancel
                                        </Button>
                                        <Button 
                                            variant="outline-primary"
                                            onClick={handleSaveAsDraft}
                                            disabled={isDraft}
                                        >
                                            <i className="fas fa-save me-2"></i>
                                            {isDraft ? 'Saving...' : 'Save as Draft'}
                                        </Button>
                                    </div>
                                    
                                    <Button 
                                        variant="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                        size="lg"
                                    >
                                        <i className="fas fa-check me-2"></i>
                                        {isSubmitting ? 'Adding Client...' : 'Add Client'}
                                    </Button>
                                </div>

                                {Object.keys(validationErrors).length > 0 && (
                                    <Alert variant="danger" className="mt-3">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        Please fix the validation errors above before submitting.
                                    </Alert>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </>
    );
};

export default AddClient;