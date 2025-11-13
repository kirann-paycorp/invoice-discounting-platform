import React, { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { createProject } from '../../../store/reducers/WorkflowReducer';
import Dropzone from "react-dropzone";
import swal from "sweetalert2";
import FinancialCalculator from './FinancialCalculator';

const AddProjectForm = ({ show, handleClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        projectName: '',
        value: '',
        status: '',
        contractDocument: null,
        acceptTerms: false,
        applyForDiscounting: false
    });
    const [fileNames, setFileNames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showMainForm, setShowMainForm] = useState(true);
    const [financialCalculations, setFinancialCalculations] = useState(null);
    const [documentVerification, setDocumentVerification] = useState({
        invoiceCopy: { uploaded: false, verified: false, size: 0, type: '' },
        purchaseOrder: { uploaded: false, verified: false, size: 0, type: '' },
        deliveryReceipt: { uploaded: false, verified: false, size: 0, type: '' }
    });

    const statusOptions = [
        { value: '', label: 'Select Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'on-hold', label: 'On Hold' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFinancialCalculationUpdate = (calculations) => {
        setFinancialCalculations(calculations);
    };    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Please upload PDF, DOC, DOCX, JPG, or PNG files only.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'Please upload files smaller than 10MB.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // Simulate document verification
            setIsLoading(true);
            
            setTimeout(() => {
                const isVerified = Math.random() > 0.2; // 80% success rate for demo
                
                setFileNames([file.name]);
                setFormData(prev => ({
                    ...prev,
                    contractDocument: file
                }));
                setDocumentVerification(prev => ({
                    ...prev,
                    invoiceCopy: {
                        uploaded: true,
                        verified: isVerified,
                        size: file.size,
                        type: file.type,
                        fileName: file.name,
                        uploadedAt: new Date().toISOString()
                    }
                }));
                
                setIsLoading(false);
                
                if (isVerified) {
                    swal.fire({
                        icon: 'success',
                        title: 'Document Verified',
                        text: `${file.name} has been successfully uploaded and verified.`,
                        timer: 3000,
                        showConfirmButton: false
                    });
                } else {
                    swal.fire({
                        icon: 'warning',
                        title: 'Document Needs Review',
                        html: `
                            <p>${file.name} has been uploaded but requires manual verification.</p>
                            <p><small>Common issues: Poor image quality, missing information, or unclear text.</small></p>
                        `,
                        confirmButtonText: 'OK'
                    });
                }
            }, 2000); // Simulate processing time
        }
    };

    const generateProjectId = () => {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 1000);
        return `PRJ-${timestamp.toString().slice(-6)}${randomNum.toString().padStart(3, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Debug logging
        console.log('Form Data:', formData);
        console.log('Value:', formData.value);
        console.log('Status:', formData.status);
        console.log('Contract Document:', formData.contractDocument);
        console.log('Accept Terms:', formData.acceptTerms);
        
        // Enhanced validation with specific error messages
        const errors = [];
        
        if (!formData.projectName || formData.projectName.trim() === '') {
            errors.push('Project name is required');
        }
        
        if (!formData.value || formData.value.trim() === '') {
            errors.push('Invoice value is required');
        }
        
        if (!formData.status || formData.status === '') {
            errors.push('Status selection is required');
        }
        
        if (!formData.contractDocument) {
            errors.push('Contract document upload is required');
        }
        
        if (!formData.acceptTerms) {
            errors.push('You must accept the terms & conditions');
        }
        
        if (errors.length > 0) {
            swal.fire({
                icon: 'error',
                title: 'Validation Error',
                html: `<ul style="text-align: left; margin: 0; padding-left: 20px;">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>`
            });
            return;
        }

        setIsLoading(true);

        // Simulate API call with 4 seconds delay
        setTimeout(() => {
            setIsLoading(false);
            setShowMainForm(false); // Close main form
            setShowPreview(true);   // Show preview
        }, 4000);
    };

    const handleFinalSubmit = () => {
        const projectId = generateProjectId();
        
        // Add to workflow
        dispatch(createProject({
            ...formData,
            contractDocument: fileNames[0] || null
        }));
        
        setShowPreview(false);
        handleClose();
        
        // Show success popup
        swal.fire({
            icon: 'success',
            title: 'Project Application Submitted!',
            html: `<p>Your application has been sent for verification</p><p><strong>Project ID: ${projectId}</strong></p><p>You will be notified via email</p><p><small>Switch to Admin role to approve this project</small></p>`,
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-primary'
            }
        });

        // Reset form and states
        setFormData({
            projectName: '',
            value: '',
            status: '',
            contractDocument: null,
            acceptTerms: false,
            applyForDiscounting: false
        });
        setFileNames([]);
        setShowMainForm(true); // Reset to show main form next time
    };

    const handleBackToForm = () => {
        setShowPreview(false);
        setShowMainForm(true);
    };

    const handleCloseAll = () => {
        setShowPreview(false);
        setShowMainForm(true);
        handleClose();
        // Reset form when closing
        setFormData({
            projectName: '',
            value: '',
            status: '',
            contractDocument: null,
            acceptTerms: false,
            applyForDiscounting: false
        });
        setFileNames([]);
    };

    // Terms and Conditions Modal
    const TermsModal = () => (
        <Modal show={showTerms} onHide={() => setShowTerms(false)} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Invoice Terms and Conditions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <h5>1. Payment Terms</h5>
                    <p>Payment is due within 30 days of invoice date unless otherwise specified.</p>
                    
                    <h5>2. Late Payments</h5>
                    <p>A late fee of 1.5% per month may be charged on overdue amounts.</p>
                    
                    <h5>3. Dispute Resolution</h5>
                    <p>Any disputes must be raised within 7 days of invoice receipt.</p>
                    
                    <h5>4. Currency</h5>
                    <p>All amounts are in USD unless otherwise specified.</p>
                    
                    <h5>5. Taxes</h5>
                    <p>Client is responsible for applicable taxes unless included in invoice.</p>
                    
                    <h5>6. Cancellation</h5>
                    <p>Services may be cancelled with 30 days written notice.</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => setShowTerms(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    // Preview Modal
    const PreviewModal = () => (
        <Modal show={show && showPreview} onHide={handleCloseAll} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Project Details Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="card">
                    <div className="card-body">
                        <h4 className="fs-24 font-w800 mb-4">{formData.projectName || 'PROJECT NAME'}</h4>
                        
                        <div className="row border-bottom pb-4 mb-4">
                            <div className="col-xl-6">
                                <div className="mb-3">
                                    <span className="mb-2 font-w600 d-block">PROJECT NAME</span>
                                    <span className="fs-18 font-w600">{formData.projectName}</span>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="mb-3">
                                    <span className="mb-2 font-w600 d-block">PROJECT VALUE</span>
                                    <span className="fs-18 font-w600">${formData.value}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row border-bottom pb-4 mb-4">
                            <div className="col-xl-6">
                                <div className="mb-3">
                                    <span className="mb-2 font-w600 d-block">STATUS</span>
                                    <span className="fs-18 font-w600 text-capitalize">{formData.status}</span>
                                </div>
                            </div>
                            <div className="col-xl-6">
                                <div className="mb-3">
                                    <span className="mb-2 font-w600 d-block">APPLY FOR DISCOUNTING</span>
                                    <span className="fs-16 font-w600">{formData.applyForDiscounting ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Document Information */}
                        <div className="row border-bottom pb-4 mb-4">
                            <div className="col-xl-12">
                                <div className="mb-3">
                                    <span className="mb-2 font-w600 d-block">CONTRACT DOCUMENT</span>
                                    <span className="fs-16 font-w600">{fileNames[0] || 'No file uploaded'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Company Details Table */}
                        <div className="invoice-schedule mb-4">
                            <h5 className="fs-18 font-w700 mb-3">Invoice Schedule - Company Details</h5>
                            <div className="table-responsive">
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Company Name</th>
                                            <th>Invoice Date</th>
                                            <th>Due Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Acme Corporation</td>
                                            <td>2025-01-15</td>
                                            <td>2025-02-15</td>
                                            <td>$15,000</td>
                                            <td><span className="badge badge-success">Approved</span></td>
                                        </tr>
                                        <tr>
                                            <td>Tech Solutions Ltd</td>
                                            <td>2025-01-20</td>
                                            <td>2025-02-20</td>
                                            <td>$8,500</td>
                                            <td><span className="badge badge-warning">Pending</span></td>
                                        </tr>
                                        <tr>
                                            <td>Global Services Inc</td>
                                            <td>2025-01-25</td>
                                            <td>2025-02-25</td>
                                            <td>$12,300</td>
                                            <td><span className="badge badge-primary">Processing</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Terms & Conditions:</strong> 
                                <span className="ms-2">{formData.acceptTerms ? 'Accepted' : 'Not Accepted'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleBackToForm}>
                    Back
                </Button>
                <Button variant="primary" onClick={handleFinalSubmit}>
                    OK - Submit Application
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <>
            <Modal show={show && showMainForm} onHide={handleCloseAll} size="xl" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Projects for Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body> 
                    <div className="card ">
                        <div className="card-header">
                            <h4 className="card-title">{formData.projectName || 'New Project'}</h4>
                        </div>
                        <div className="card-body overflow-hidden">
                            <div className="basic-form">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="form-group mb-3 col-md-12">
                                            <label>Project Name <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter project name (e.g., E-commerce Platform Development)"
                                                name="projectName"
                                                value={formData.projectName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group mb-3 col-md-6">
                                            <label>Value <span className="text-danger">*</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Enter project value"
                                                name="value"
                                                value={formData.value}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3 col-md-6">
                                            <label>Contract Document <span className="text-danger">*</span></label>
                                            <div className="App">
                                                <Dropzone onDrop={handleDrop}>
                                                    {({ getRootProps, getInputProps }) => (
                                                        <div {...getRootProps({ className: "dropzone" })}>
                                                            <input {...getInputProps()} />
                                                            <div className="dropzone-panel">
                                                                <div className="dropzone-select btn btn-primary light font-weight-bold">
                                                                    <div className="d-flex upload-btn">
                                                                        <i className="fas fa-cloud-upload-alt me-3"></i>
                                                                        <div>
                                                                            <span className="fs-14 font-w600 d-block text-primary text-start">Upload Contract</span>
                                                                            <span className="text-primary fs-12">PDF, DOC, JPG, PNG</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Dropzone>
                                                {fileNames.length > 0 && (
                                                    <div className="dropzone-items mt-2">
                                                        <div className="dropzone-item">
                                                            <div className="file-icon">
                                                                <i className="fas fa-file-alt me-2"></i>
                                                            </div>
                                                            <div className="dropzone-file">
                                                                <div className="dropzone-filename">
                                                                    <p className="fs-14 font-w600 mb-0">{fileNames[0]}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="form-group mb-3 col-md-6">
                                            <label>Status <span className="text-danger">*</span></label>
                                            <select
                                                className="form-select form-control"
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                {statusOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group mb-3 col-md-6">
                                            <label>Invoice Terms and Conditions <span className="text-danger">*</span></label>
                                            <div className="d-flex align-items-center">
                                                <div className="form-check me-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="acceptTerms"
                                                        checked={formData.acceptTerms}
                                                        onChange={handleInputChange}
                                                        id="acceptTerms"
                                                        required
                                                    />
                                                    <label className="form-check-label" htmlFor="acceptTerms">
                                                        I accept the
                                                    </label>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0"
                                                    onClick={() => setShowTerms(true)}
                                                >
                                                    Terms & Conditions
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Financial Calculator */}
                                    <FinancialCalculator
                                        invoiceValue={formData.value}
                                        paymentTerms={30}
                                        creditScore={700}
                                        annualRevenue={formData.value ? parseFloat(formData.value) * 3 : 0}
                                        onCalculationUpdate={handleFinancialCalculationUpdate}
                                    />

                                    {/* Invoice Schedule Table */}
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group mb-3">
                                                <label>Invoice Schedule</label>
                                                <div className="table-responsive mt-2">
                                                    <table className="table table-striped">
                                                        <thead>
                                                            <tr>
                                                                <th>Company Name</th>
                                                                <th>Invoice Date</th>
                                                                <th>Due Date</th>
                                                                <th>Amount</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Acme Corporation</td>
                                                                <td>2025-01-15</td>
                                                                <td>2025-02-15</td>
                                                                <td>$15,000</td>
                                                                <td><span className="badge badge-success">Approved</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Tech Solutions Ltd</td>
                                                                <td>2025-01-20</td>
                                                                <td>2025-02-20</td>
                                                                <td>$8,500</td>
                                                                <td><span className="badge badge-warning">Pending</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td>Global Services Inc</td>
                                                                <td>2025-01-25</td>
                                                                <td>2025-02-25</td>
                                                                <td>$12,300</td>
                                                                <td><span className="badge badge-primary">Processing</span></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group mb-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        name="applyForDiscounting"
                                                        checked={formData.applyForDiscounting}
                                                        onChange={handleInputChange}
                                                        id="applyForDiscounting"
                                                    />
                                                    <label className="form-check-label" htmlFor="applyForDiscounting">
                                                        Apply Project for Discounting
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAll}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Processing...
                            </>
                        ) : (
                            'Submit Project'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            <TermsModal />
            <PreviewModal />
        </>
    );
};

export default AddProjectForm;