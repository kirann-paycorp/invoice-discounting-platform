import React, { useState } from 'react';
import { Modal, Button, ProgressBar, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createContract } from '../../../store/reducers/WorkflowReducer';
import swal from 'sweetalert2';

// Modern form styles and loading animations
const modernFormStyles = `
  @keyframes slideInUp {
    0% { transform: translateY(30px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes rotateIcon {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .modern-form-group {
    animation: slideInUp 0.3s ease;
    margin-bottom: 1.5rem;
  }
  
  .modern-input {
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.9);
  }
  
  .modern-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  .modern-input:disabled {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    color: #6c757d;
    border-color: #dee2e6;
    opacity: 0.7;
  }
  
  .modern-label {
    font-weight: 600;
    color: #495057;
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
  }
  
  .loading-content {
    background: white;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideInUp 0.5s ease;
    max-width: 400px;
    width: 90%;
  }
  
  .loading-icon {
    animation: rotateIcon 1s linear infinite;
    color: #667eea;
    font-size: 3rem;
    margin-bottom: 20px;
  }
  
  .progress-container {
    margin: 20px 0;
  }
  
  .modern-modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 15px 15px 0 0;
  }
  
  .modern-modal-body {
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    padding: 30px;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = modernFormStyles;
  document.head.appendChild(styleSheet);
}

// Loading Animation Component
const LoadingAnimation = ({ progress, message }) => (
  <div className="loading-overlay">
    <div className="loading-content">
      <div className="loading-icon">
        <i className="fas fa-file-contract"></i>
      </div>
      <h4 style={{ color: '#495057', marginBottom: '10px' }}>Processing Your Application</h4>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>{message}</p>
      <div className="progress-container">
        <ProgressBar 
          now={progress} 
          style={{ height: '8px', borderRadius: '10px' }}
          variant="primary"
        />
        <small style={{ color: '#6c757d', marginTop: '10px', display: 'block' }}>
          {progress}% Complete
        </small>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Spinner animation="border" size="sm" style={{ color: '#667eea' }} />
        <span style={{ marginLeft: '10px', color: '#6c757d' }}>Please wait...</span>
      </div>
    </div>
  </div>
);

const CustomerContractForm = ({ show, handleClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        customerName: '',
        customerTaxId: '',
        contractValue: '',
        contractStartDate: new Date().toISOString().split('T')[0], // Auto-set to today
        contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Auto-set to 1 year from today
        paymentTerms: '30', // default 30 days
        interestRate: '8.5', // Auto-set to default rate
        natureOfDomain: '',
        additionalTerms: '',
        creditScore: '',
        companyRegistrationNo: '',
        annualRevenue: ''
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState('');

    const domainOptions = [
        { value: '', label: 'Select Nature of Domain' },
        { value: 'technology', label: 'Technology' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'finance', label: 'Finance' },
        { value: 'education', label: 'Education' },
        { value: 'retail', label: 'Retail' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'consulting', label: 'Consulting' },
        { value: 'real-estate', label: 'Real Estate' },
        { value: 'others', label: 'Others' }
    ];

    const validateForm = () => {
        const errors = {};
        
        // Required field validations
        if (!formData.customerName.trim()) {
            errors.customerName = 'Customer name is required';
        } else if (formData.customerName.length < 2) {
            errors.customerName = 'Customer name must be at least 2 characters';
        }

        // Tax ID validation (basic format check)
        if (!formData.customerTaxId.trim()) {
            errors.customerTaxId = 'Tax ID is required';
        } else if (!/^[0-9]{10,15}$/.test(formData.customerTaxId.replace(/[-\s]/g, ''))) {
            errors.customerTaxId = 'Tax ID must be 10-15 digits';
        }

        // Contract value validation
        const contractValue = parseFloat(formData.contractValue);
        if (!formData.contractValue) {
            errors.contractValue = 'Contract value is required';
        } else if (contractValue < 10000) {
            errors.contractValue = 'Minimum contract value is ₹10,000';
        } else if (contractValue > 50000000) {
            errors.contractValue = 'Maximum contract value is ₹5,00,00,000';
        }

        // Note: Contract dates and interest rate are auto-populated and disabled
        // No validation needed for these fields as they are system-generated

        // Credit score validation
        const creditScore = parseInt(formData.creditScore);
        if (!formData.creditScore) {
            errors.creditScore = 'Credit score is required';
        } else if (creditScore < 300 || creditScore > 850) {
            errors.creditScore = 'Credit score must be between 300-850';
        } else if (creditScore < 600) {
            errors.creditScore = 'Minimum credit score for approval is 600';
        }

        // Company registration validation
        if (!formData.companyRegistrationNo.trim()) {
            errors.companyRegistrationNo = 'Company registration number is required';
        } else if (formData.companyRegistrationNo.length < 10) {
            errors.companyRegistrationNo = 'Company registration number must be at least 10 characters';
        } else if (!/^[A-Z0-9]{10,21}$/.test(formData.companyRegistrationNo.toUpperCase())) {
            errors.companyRegistrationNo = 'Invalid format. Use alphanumeric characters only (e.g., U12345AB1234CDE123456)';
        }

        // Annual revenue validation
        const annualRevenue = parseFloat(formData.annualRevenue);
        if (!formData.annualRevenue) {
            errors.annualRevenue = 'Annual revenue is required';
        } else if (annualRevenue < contractValue * 2) {
            errors.annualRevenue = 'Annual revenue should be at least 2x the contract value';
        }

        // Domain validation
        if (!formData.natureOfDomain.trim()) {
            errors.natureOfDomain = 'Nature of business domain is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Auto-format company registration number to uppercase
        const processedValue = name === 'companyRegistrationNo' ? value.toUpperCase() : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
        
        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const generateContractId = () => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        return `CON-${timestamp.toString().slice(-6)}${randomNum.toString().padStart(3, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please correct the errors in the form before submitting.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary'
                }
            });
            return;
        }

        setIsSubmitting(true);
        setLoadingProgress(0);
        setLoadingMessage('Initializing submission...');

        // Simulate realistic loading progression
        const loadingSteps = [
            { progress: 20, message: 'Validating contract data...', delay: 300 },
            { progress: 40, message: 'Calculating risk assessment...', delay: 400 },
            { progress: 60, message: 'Generating contract ID...', delay: 300 },
            { progress: 80, message: 'Processing submission...', delay: 400 },
            { progress: 100, message: 'Finalizing contract...', delay: 300 }
        ];

        for (const step of loadingSteps) {
            await new Promise(resolve => setTimeout(resolve, step.delay));
            setLoadingProgress(step.progress);
            setLoadingMessage(step.message);
        }

        try {
            // Calculate risk score based on inputs
            const riskScore = calculateRiskScore(formData);
            const contractId = generateContractId();
            
            // All contracts should go to pending status for admin review
            // This ensures proper approval workflow
            const contractData = {
                ...formData,
                contractId,
                riskScore,
                submittedAt: new Date().toISOString(),
                status: 'pending_approval', // Always pending, never auto-approve
                submittedBy: 'current-seller',
                contractValue: parseFloat(formData.contractValue),
                interestRate: parseFloat(formData.interestRate),
                creditScore: parseInt(formData.creditScore),
                annualRevenue: parseFloat(formData.annualRevenue)
            };

            dispatch(createContract(contractData));

            // Show submission confirmation message
            const message = `<div class="text-center">
                <p><strong>Contract Successfully Submitted!</strong></p>
                <hr>
                <p><strong>Contract ID:</strong> <span class="text-primary">${contractId}</span></p>
                <p><strong>Risk Score:</strong> <span class="text-${riskScore >= 75 ? 'success' : riskScore >= 50 ? 'warning' : 'danger'}">${riskScore}/100</span></p>
                <p><strong>Status:</strong> <span class="badge bg-warning text-dark">Pending Admin Approval</span></p>
                <hr>
                <p class="text-muted">
                    <i class="fas fa-clock me-1"></i>
                    Your contract is now in the admin review queue
                </p>
                <p class="text-muted">
                    <i class="fas fa-bell me-1"></i>
                    You will receive a notification once approved/rejected
                </p>
                <p class="small text-info">
                    <i class="fas fa-info-circle me-1"></i>
                    Expected review time: 1-2 business days
                </p>
            </div>`;

            swal.fire({
                icon: 'info',
                title: 'Contract Submitted for Review',
                html: message,
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary'
                }
            });

            // Reset form
            setFormData({
                customerName: '',
                customerTaxId: '',
                contractValue: '',
                contractStartDate: '',
                contractEndDate: '',
                paymentTerms: '30',
                interestRate: '',
                natureOfDomain: '',
                additionalTerms: '',
                creditScore: '',
                companyRegistrationNo: '',
                annualRevenue: ''
            });
            handleClose();

        } catch (error) {
            swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'There was an error submitting your contract. Please try again.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn btn-primary'
                }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateRiskScore = (data) => {
        let score = 50; // Base score
        
        // Credit score impact (40% weight)
        const creditScore = parseInt(data.creditScore);
        if (creditScore >= 750) score += 30;
        else if (creditScore >= 700) score += 20;
        else if (creditScore >= 650) score += 10;
        else if (creditScore >= 600) score += 5;
        
        // Revenue to contract ratio (25% weight)
        const revenueRatio = parseFloat(data.annualRevenue) / parseFloat(data.contractValue);
        if (revenueRatio >= 10) score += 20;
        else if (revenueRatio >= 5) score += 15;
        else if (revenueRatio >= 3) score += 10;
        else if (revenueRatio >= 2) score += 5;
        
        // Contract duration (15% weight)
        const startDate = new Date(data.contractStartDate);
        const endDate = new Date(data.contractEndDate);
        const durationMonths = (endDate - startDate) / (1000 * 60 * 60 * 24 * 30);
        if (durationMonths <= 12) score += 10;
        else if (durationMonths <= 24) score += 8;
        else if (durationMonths <= 36) score += 5;
        
        // Interest rate reasonableness (10% weight)
        const interestRate = parseFloat(data.interestRate);
        if (interestRate >= 8 && interestRate <= 15) score += 8;
        else if (interestRate >= 6 && interestRate <= 18) score += 5;
        
        // Company registration format (10% weight)
        if (/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(data.companyRegistrationNo)) {
            score += 7;
        }
        
        return Math.min(Math.max(score, 0), 100);
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>My Customer Contract</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isSubmitting && (
                    <LoadingAnimation progress={loadingProgress} message={loadingMessage} />
                )}
                <div className="basic-form">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Customer Name <span className="text-danger">*</span></label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    className={`form-control ${validationErrors.customerName ? 'is-invalid' : ''}`}
                                    placeholder="Enter customer name"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    required
                                />
                                {validationErrors.customerName && (
                                    <div className="invalid-feedback">{validationErrors.customerName}</div>
                                )}
                            </div>
                        </div>
                        
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Customer Tax ID <span className="text-danger">*</span></label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    className={`form-control ${validationErrors.customerTaxId ? 'is-invalid' : ''}`}
                                    placeholder="Enter customer tax ID (e.g., 1234567890)"
                                    name="customerTaxId"
                                    value={formData.customerTaxId}
                                    onChange={handleInputChange}
                                    required
                                />
                                {validationErrors.customerTaxId && (
                                    <div className="invalid-feedback">{validationErrors.customerTaxId}</div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Company Registration No <span className="text-danger">*</span></label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    className={`form-control ${validationErrors.companyRegistrationNo ? 'is-invalid' : ''}`}
                                    placeholder="Enter CIN (e.g., ABCD123456789012)"
                                    name="companyRegistrationNo"
                                    value={formData.companyRegistrationNo}
                                    onChange={handleInputChange}
                                    required
                                />
                                <div className="form-text text-muted">
                                    <small>Company Identification Number - 10-21 alphanumeric characters</small>
                                </div>
                                {validationErrors.companyRegistrationNo && (
                                    <div className="invalid-feedback">{validationErrors.companyRegistrationNo}</div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Credit Score <span className="text-danger">*</span></label>
                            <div className="col-sm-9">
                                <input
                                    type="number"
                                    className={`form-control ${validationErrors.creditScore ? 'is-invalid' : ''}`}
                                    placeholder="Enter credit score (300-850)"
                                    name="creditScore"
                                    value={formData.creditScore}
                                    onChange={handleInputChange}
                                    min="300"
                                    max="850"
                                    required
                                />
                                {validationErrors.creditScore && (
                                    <div className="invalid-feedback">{validationErrors.creditScore}</div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Annual Revenue <span className="text-danger">*</span></label>
                            <div className="col-sm-9">
                                <input
                                    type="number"
                                    className={`form-control ${validationErrors.annualRevenue ? 'is-invalid' : ''}`}
                                    placeholder="Enter annual revenue in ₹"
                                    name="annualRevenue"
                                    value={formData.annualRevenue}
                                    onChange={handleInputChange}
                                    required
                                />
                                {validationErrors.annualRevenue && (
                                    <div className="invalid-feedback">{validationErrors.annualRevenue}</div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Contract Start Date <span className="text-muted">(Auto-Set)</span></label>
                            <div className="col-sm-9">
                                <input
                                    type="date"
                                    className="form-control bg-light"
                                    name="contractStartDate"
                                    value={formData.contractStartDate}
                                    disabled
                                    readOnly
                                />
                                <div className="form-text text-info">
                                    <small><i className="fas fa-info-circle me-1"></i>Contract starts from today</small>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Contract End Date <span className="text-muted">(Auto-Set)</span></label>
                            <div className="col-sm-9">
                                <input
                                    type="date"
                                    className="form-control bg-light"
                                    name="contractEndDate"
                                    value={formData.contractEndDate}
                                    disabled
                                    readOnly
                                />
                                <div className="form-text text-info">
                                    <small><i className="fas fa-calendar-alt me-1"></i>12-month contract duration</small>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Contract Value <span className="text-danger">*</span></label>
                            <div className="col-sm-9">
                                <input
                                    type="number"
                                    className={`form-control ${validationErrors.contractValue ? 'is-invalid' : ''}`}
                                    placeholder="Enter contract value in ₹"
                                    name="contractValue"
                                    value={formData.contractValue}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                                {validationErrors.contractValue && (
                                    <div className="invalid-feedback">{validationErrors.contractValue}</div>
                                )}
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Interest Rate (%) <span className="text-muted">(Auto-Set)</span></label>
                            <div className="col-sm-9">
                                <input
                                    type="number"
                                    className="form-control bg-light"
                                    placeholder="Standard rate applied"
                                    name="interestRate"
                                    value={formData.interestRate}
                                    disabled
                                    readOnly
                                />
                                <div className="form-text text-info">
                                    <small><i className="fas fa-percentage me-1"></i>Standard annual interest rate (8.5%)</small>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mb-3 row">
                            <label className="col-sm-3 col-form-label">Nature of Domain <span className="text-danger">*</span></label>
                            <div className="col-sm-9">
                                <select
                                    className="form-select form-control"
                                    name="natureOfDomain"
                                    value={formData.natureOfDomain}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {domainOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                        </>
                    ) : (
                        'Submit Contract'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomerContractForm;