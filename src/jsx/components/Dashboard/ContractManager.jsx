import React, { useState } from 'react';
import { Button, Card, Table, Badge, Row, Col } from 'react-bootstrap';
import CustomerContractForm from './CustomerContractForm';

const ContractManager = ({ projects = [] }) => {
    const [showContractForm, setShowContractForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleCreateContract = (project) => {
        setSelectedProject(project);
        setShowContractForm(true);
    };

    const handleCloseContract = () => {
        setShowContractForm(false);
        setSelectedProject(null);
    };

    const getInvoiceStatusVariant = (status) => {
        switch(status) {
            case 'Partially Funded': return 'warning';
            case 'Ready for Funding': return 'info';
            case 'Fully Funded': return 'success';
            case 'Pending': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusVariant = (status) => {
        switch(status) {
            case 'In Progress': return 'primary';
            case 'Active': return 'info';
            case 'Near Completion': return 'warning';
            case 'Completed': return 'success';
            default: return 'secondary';
        }
    };

    return (
        <>
            <Card className="border-0" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
                <Card.Header className="border-0 bg-transparent">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h4 className="mb-1 text-dark fw-bold">
                                <i className="fas fa-file-contract me-2 text-primary"></i>
                                Contract Management
                            </h4>
                            <p className="text-muted mb-0">Create and manage project contracts</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <Badge bg="primary" className="me-2 px-3 py-2" style={{borderRadius: '20px'}}>
                                {projects.length} Projects
                            </Badge>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="p-0">
                    {projects.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="mb-3" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '50%',
                                padding: '20px',
                                color: 'white',
                                width: '80px',
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto'
                            }}>
                                <i className="fas fa-file-contract fs-3"></i>
                            </div>
                            <h5 className="text-muted mb-2">No Projects Available</h5>
                            <p className="text-muted">Projects will appear here for contract creation</p>
                        </div>
                    ) : (
                        <Table responsive hover className="mb-0">
                            <thead style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
                                <tr>
                                    <th className="border-0 py-3 px-4 fw-semibold text-dark">Project Details</th>
                                    <th className="border-0 py-3 px-4 fw-semibold text-dark">Client</th>
                                    <th className="border-0 py-3 px-4 fw-semibold text-dark">Value</th>
                                    <th className="border-0 py-3 px-4 fw-semibold text-dark">Progress</th>
                                    <th className="border-0 py-3 px-4 fw-semibold text-dark">Status</th>
                                    <th className="border-0 py-3 px-4 fw-semibold text-dark">Funding Status</th>
                                    <th className="border-0 py-3 px-4 fw-semibold text-dark">Contract Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project, index) => (
                                    <tr key={index} style={{borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
                                        <td className="py-3 px-4">
                                            <div>
                                                <div className="fw-semibold text-dark">{project.name}</div>
                                                <small className="text-muted">{project.id}</small>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="fw-medium text-dark">{project.client}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="fw-bold text-success">{project.value}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="d-flex align-items-center">
                                                <div className="progress flex-grow-1 me-2" style={{height: '6px'}}>
                                                    <div 
                                                        className="progress-bar bg-gradient" 
                                                        style={{
                                                            width: `${project.progress}%`,
                                                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                                                        }}
                                                    ></div>
                                                </div>
                                                <small className="text-muted fw-medium">{project.progress}%</small>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge 
                                                bg={getStatusVariant(project.status)}
                                                className="px-3 py-2"
                                                style={{borderRadius: '20px', fontWeight: '500'}}
                                            >
                                                {project.status}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Badge 
                                                bg={getInvoiceStatusVariant(project.invoiceStatus)}
                                                className="px-3 py-2 mb-1"
                                                style={{borderRadius: '20px', fontWeight: '500'}}
                                            >
                                                {project.invoiceStatus}
                                            </Badge>
                                            <div><small className="text-muted">{project.discountRate}% discount rate</small></div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="d-flex flex-column gap-2">
                                                <Button 
                                                    variant="primary" 
                                                    size="sm"
                                                    onClick={() => handleCreateContract(project)}
                                                    style={{
                                                        borderRadius: '15px', 
                                                        fontWeight: '500',
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        border: 'none',
                                                        padding: '6px 16px'
                                                    }}
                                                >
                                                    <i className="fas fa-file-contract me-1"></i>
                                                    Create Contract
                                                </Button>
                                                {project.invoiceStatus === 'Fully Funded' && (
                                                    <Badge bg="success" className="px-2 py-1" style={{borderRadius: '10px', fontSize: '10px'}}>
                                                        <i className="fas fa-check-circle me-1"></i>
                                                        Contract Ready
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
                
                {/* Contract Creation Statistics */}
                <Card.Footer className="border-0 bg-transparent">
                    <Row>
                        <Col md={4}>
                            <div className="text-center p-3">
                                <div className="fw-bold text-primary fs-4">
                                    {projects.filter(p => p.invoiceStatus === 'Ready for Funding').length}
                                </div>
                                <small className="text-muted">Ready for Contracts</small>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="text-center p-3">
                                <div className="fw-bold text-warning fs-4">
                                    {projects.filter(p => p.invoiceStatus === 'Partially Funded').length}
                                </div>
                                <small className="text-muted">Partially Funded</small>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="text-center p-3">
                                <div className="fw-bold text-success fs-4">
                                    {projects.filter(p => p.invoiceStatus === 'Fully Funded').length}
                                </div>
                                <small className="text-muted">Fully Funded</small>
                            </div>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>

            {/* Contract Form Modal */}
            <CustomerContractForm 
                show={showContractForm} 
                handleClose={handleCloseContract}
                selectedProject={selectedProject}
            />
        </>
    );
};

export default ContractManager;