import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Table, Badge, Alert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';

const CreateProject = () => {
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        projectTitle: '',
        projectCode: '',
        contractId: '',
        buyerId: '',
        buyerName: '',
        startDate: '',
        endDate: '',
        projectValue: '',
        currency: 'INR',
        description: '',
        location: '',
        status: 'Draft'
    });
    
    // Other states
    const [contracts, setContracts] = useState([]);
    const [milestones, setMilestones] = useState([
        {
            id: 1,
            name: '',
            percentage: '',
            targetDate: '',
            description: '',
            status: 'Pending'
        }
    ]);
    const [attachments, setAttachments] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMilestoneValidation, setShowMilestoneValidation] = useState(false);
    
    // Load approved contracts on component mount
    useEffect(() => {
        loadApprovedContracts();
        generateProjectCode();
    }, []);
    
    const loadApprovedContracts = () => {
        const savedContracts = localStorage.getItem('contracts') || '[]';
        try {
            const allContracts = JSON.parse(savedContracts);
            const approvedContracts = allContracts.filter(contract => 
                contract.contractStatus === 'Approved'
            );
            setContracts(approvedContracts);
        } catch (error) {
            console.error('Error loading contracts:', error);
        }
    };
    
    const generateProjectCode = () => {
        const timestamp = Date.now().toString().slice(-6);
        setFormData(prev => ({
            ...prev,
            projectCode: `PRJ-2025-${timestamp}`
        }));
    };
    
    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    
    // Handle contract selection
    const handleContractChange = (e) => {
        const contractId = e.target.value;
        const selectedContract = contracts.find(contract => contract.id === contractId);
        
        if (selectedContract) {
            setFormData(prev => ({
                ...prev,
                contractId: contractId,
                buyerId: selectedContract.buyer,
                buyerName: selectedContract.buyerDetails?.name || 'Unknown Buyer',
                projectValue: selectedContract.contractValue || ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                contractId: '',
                buyerId: '',
                buyerName: '',
                projectValue: ''
            }));
        }
    };
    
    // Milestone management
    const addMilestone = () => {
        const newMilestone = {
            id: Date.now(),
            name: '',
            percentage: '',
            targetDate: '',
            description: '',
            status: 'Pending'
        };
        setMilestones(prev => [...prev, newMilestone]);
    };
    
    const removeMilestone = (id) => {
        if (milestones.length > 1) {
            setMilestones(prev => prev.filter(milestone => milestone.id !== id));
        }
    };
    
    const updateMilestone = (id, field, value) => {
        setMilestones(prev => prev.map(milestone => 
            milestone.id === id ? { ...milestone, [field]: value } : milestone
        ));
        
        // Validate total percentage whenever milestones change
        if (field === 'percentage') {
            validateMilestonePercentages();
        }
    };
    
    const validateMilestonePercentages = () => {
        const totalPercentage = milestones.reduce((sum, milestone) => {
            return sum + (parseFloat(milestone.percentage) || 0);
        }, 0);
        
        setShowMilestoneValidation(totalPercentage !== 100);
        return totalPercentage === 100;
    };
    
    // Form validation
    const validateForm = () => {
        const newErrors = {};
        
        // Required fields
        if (!formData.projectTitle.trim()) {
            newErrors.projectTitle = 'Project title is required';
        }
        
        if (!formData.contractId) {
            newErrors.contractId = 'Please select a contract';
        }
        
        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }
        
        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }
        
        if (!formData.projectValue) {
            newErrors.projectValue = 'Project value is required';
        }
        
        // Date validation
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);
            if (endDate <= startDate) {
                newErrors.endDate = 'End date must be after start date';
            }
        }
        
        // Milestone validation
        const validMilestones = milestones.filter(milestone => milestone.name.trim());
        if (validMilestones.length === 0) {
            newErrors.milestones = 'At least one milestone is required';
        }
        
        // Check milestone percentages add up to 100%
        if (!validateMilestonePercentages()) {
            newErrors.milestones = 'Milestone percentages must add up to 100%';
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
            const projectData = {
                id: `PRJ-${Date.now()}`,
                ...formData,
                sellerId: 'SELLER-001', // Replace with actual seller ID
                createdBy: 'Current Seller',
                milestones: milestones.filter(milestone => milestone.name.trim()),
                attachments,
                status: action === 'Submit' ? 'Pending Approval' : 'Draft',
                createdOn: new Date().toISOString(),
                submittedForApprovalOn: action === 'Submit' ? new Date().toISOString() : null
            };
            
            console.log('💾 Submitting project:', projectData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Save to localStorage
            const savedProjects = localStorage.getItem('projects') || '[]';
            const existingProjects = JSON.parse(savedProjects);
            const updatedProjects = [projectData, ...existingProjects];
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
            
            // If submitted for approval, notify buyer
            if (action === 'Submit') {
                const buyerNotificationEvent = new CustomEvent('projectSubmitted', {
                    detail: { projectData }
                });
                window.dispatchEvent(buyerNotificationEvent);
                
                console.log(`📤 Project sent to buyer ${formData.buyerName} for approval`);
            }
            
            const successMessage = action === 'Submit' 
                ? `Project "${formData.projectTitle}" has been submitted for approval!`
                : `Project "${formData.projectTitle}" has been saved as draft!`;
            
            const notificationType = action === 'Submit' ? 'success' : 'info';
            const title = action === 'Submit' ? 'Project Submitted!' : 'Draft Saved!';
            
            showNotification(title, successMessage, notificationType);
            
            // Navigate back to dashboard
            navigate('/dashboard');
            
        } catch (error) {
            console.error('Error creating project:', error);
            showNotification(
                'Project Error',
                'Error creating project. Please try again.',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // File upload handler
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newAttachments = files.map(file => ({
            id: Date.now() + Math.random(),
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploadedOn: new Date().toISOString()
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
    };
    
    const removeAttachment = (id) => {
        setAttachments(prev => prev.filter(attachment => attachment.id !== id));
    };
    
    const formatCurrency = (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return '₹0';
        return `₹${num.toLocaleString('en-IN')}`;
    };
    
    const getTotalPercentage = () => {
        return milestones.reduce((sum, milestone) => {
            return sum + (parseFloat(milestone.percentage) || 0);
        }, 0);
    };

    return (
        <>
            {/* Header */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card>
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Button 
                                        variant="outline-secondary" 
                                        size="sm" 
                                        onClick={() => navigate('/dashboard')}
                                        className="me-3"
                                    >
                                        <i className="fas fa-arrow-left me-1"></i>
                                        Back to Dashboard
                                    </Button>
                                    <div>
                                        <h3 className="text-dark mb-1 fw-bold">
                                            <i className="fas fa-plus-circle text-primary me-2"></i>
                                            Create New Project
                                        </h3>
                                        <p className="text-muted mb-0">Define project milestones and invoice schedules</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <Badge bg="info" className="fs-6">
                                        <i className="fas fa-code me-1"></i>
                                        {formData.projectCode}
                                    </Badge>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>

            {/* Section 1: Basic Project Information */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card>
                        <Card.Header className="bg-light border-0">
                            <h5 className="mb-0 fw-bold text-dark">
                                <i className="fas fa-info-circle text-primary me-2"></i>
                                A. Basic Project Information
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Project Name / Title <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="projectTitle"
                                            value={formData.projectTitle}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Transformer Installation at Jamnagar"
                                            isInvalid={!!errors.projectTitle}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.projectTitle}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Project Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="projectCode"
                                            value={formData.projectCode}
                                            onChange={handleInputChange}
                                            placeholder="Auto-generated"
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Contract <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select
                                            name="contractId"
                                            value={formData.contractId}
                                            onChange={handleContractChange}
                                            isInvalid={!!errors.contractId}
                                        >
                                            <option value="">Select approved contract</option>
                                            {contracts.map(contract => (
                                                <option key={contract.id} value={contract.id}>
                                                    {contract.contractTitle} - {contract.contractCode}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.contractId}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Buyer / Client</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.buyerName}
                                            placeholder="Auto-filled from selected contract"
                                            readOnly
                                        />
                                        <Form.Text className="text-muted">
                                            Linked to selected contract
                                        </Form.Text>
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
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            isInvalid={!!errors.startDate}
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
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            isInvalid={!!errors.endDate}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.endDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">
                                            Project Value (₹) <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="projectValue"
                                            value={formData.projectValue}
                                            onChange={handleInputChange}
                                            placeholder="Total project value"
                                            isInvalid={!!errors.projectValue}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.projectValue}
                                        </Form.Control.Feedback>
                                        {formData.projectValue && (
                                            <Form.Text className="text-success fw-bold">
                                                {formatCurrency(formData.projectValue)}
                                            </Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Currency</Form.Label>
                                        <Form.Select
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleInputChange}
                                        >
                                            <option value="INR">INR - Indian Rupee</option>
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Location / Site Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="Project location (optional)"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Project Status</Form.Label>
                                        <Form.Select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group className="mb-0">
                                <Form.Label className="fw-bold">Description / Scope</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Detailed work summary and project scope..."
                                />
                            </Form.Group>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Section 2: Milestone & Invoice Schedule */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card>
                        <Card.Header className="bg-light border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <h5 className="mb-0 fw-bold text-dark">
                                    <i className="fas fa-tasks text-warning me-2"></i>
                                    B. Milestone & Invoice Schedule
                                </h5>
                                <div className="d-flex align-items-center">
                                    <Badge 
                                        bg={getTotalPercentage() === 100 ? 'success' : 'warning'} 
                                        className="me-2"
                                    >
                                        Total: {getTotalPercentage()}%
                                    </Badge>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={addMilestone}
                                    >
                                        <i className="fas fa-plus me-1"></i>
                                        Add Milestone
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {showMilestoneValidation && (
                                <Alert variant="warning" className="mx-3 mt-3 mb-0">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    Milestone percentages must add up to exactly 100%
                                </Alert>
                            )}
                            
                            <Table responsive hover className="mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 fw-bold text-dark">Milestone Name</th>
                                        <th className="border-0 fw-bold text-dark">% of Total</th>
                                        <th className="border-0 fw-bold text-dark">Target Date</th>
                                        <th className="border-0 fw-bold text-dark">Description</th>
                                        <th className="border-0 fw-bold text-dark">Status</th>
                                        <th className="border-0 fw-bold text-dark">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {milestones.map((milestone, index) => (
                                        <tr key={milestone.id}>
                                            <td className="py-3">
                                                <Form.Control
                                                    type="text"
                                                    value={milestone.name}
                                                    onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                                                    placeholder="e.g., Site Preparation"
                                                    size="sm"
                                                />
                                            </td>
                                            <td className="py-3">
                                                <Form.Control
                                                    type="number"
                                                    value={milestone.percentage}
                                                    onChange={(e) => updateMilestone(milestone.id, 'percentage', e.target.value)}
                                                    placeholder="10"
                                                    min="0"
                                                    max="100"
                                                    size="sm"
                                                />
                                            </td>
                                            <td className="py-3">
                                                <Form.Control
                                                    type="date"
                                                    value={milestone.targetDate}
                                                    onChange={(e) => updateMilestone(milestone.id, 'targetDate', e.target.value)}
                                                    size="sm"
                                                />
                                            </td>
                                            <td className="py-3">
                                                <Form.Control
                                                    type="text"
                                                    value={milestone.description}
                                                    onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                                                    placeholder="Brief description"
                                                    size="sm"
                                                />
                                            </td>
                                            <td className="py-3">
                                                <Form.Select
                                                    value={milestone.status}
                                                    onChange={(e) => updateMilestone(milestone.id, 'status', e.target.value)}
                                                    size="sm"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </Form.Select>
                                            </td>
                                            <td className="py-3">
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => removeMilestone(milestone.id)}
                                                    disabled={milestones.length === 1}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            
                            {errors.milestones && (
                                <Alert variant="danger" className="mx-3 mb-3">
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    {errors.milestones}
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Section 3: Documents & Attachments */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card>
                        <Card.Header className="bg-light border-0">
                            <h5 className="mb-0 fw-bold text-dark">
                                <i className="fas fa-paperclip text-info me-2"></i>
                                C. Documents & Attachments
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Upload Project Plan / Work Order (PDF)</Form.Label>
                                <Form.Control
                                    type="file"
                                    multiple
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                />
                                <Form.Text className="text-muted">
                                    Upload supporting documents (PDF, Word, Images)
                                </Form.Text>
                            </Form.Group>
                            
                            {attachments.length > 0 && (
                                <div>
                                    <h6 className="fw-bold mb-2">Uploaded Files:</h6>
                                    {attachments.map(attachment => (
                                        <div key={attachment.id} className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-file text-primary me-2"></i>
                                                <span>{attachment.fileName}</span>
                                                <Badge bg="secondary" className="ms-2">
                                                    {(attachment.fileSize / 1024).toFixed(1)} KB
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeAttachment(attachment.id)}
                                            >
                                                <i className="fas fa-times"></i>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Footer Actions */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <small className="text-muted">
                                        <i className="fas fa-info-circle me-1"></i>
                                        Draft projects can be edited later. Submitted projects require buyer approval.
                                    </small>
                                </div>
                                <div className="d-flex gap-2">
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
                                        {isSubmitting ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin me-1"></i>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-1"></i>
                                                Save Draft
                                            </>
                                        )}
                                    </Button>
                                    
                                    <Button
                                        variant="success"
                                        onClick={() => handleSubmit('Submit')}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin me-1"></i>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-1"></i>
                                                Submit for Approval
                                            </>
                                        )}
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

export default CreateProject;