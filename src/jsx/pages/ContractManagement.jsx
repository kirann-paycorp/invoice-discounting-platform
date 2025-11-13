import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import ContractManager from '../components/Dashboard/ContractManager';

const ContractManagement = () => {
    // Sample projects data - in real app, this would come from API/Redux store
    const [projects] = useState([
        {
            id: 'PRJ-2024-001',
            name: 'TechCorp Infrastructure Upgrade',
            client: 'TechCorp Solutions Ltd.',
            value: '₹2,450,000',
            progress: 75,
            status: 'In Progress',
            deadline: '2024-12-15',
            invoiceStatus: 'Partially Funded',
            discountRate: 7.5,
            fundedAmount: '₹1,837,500'
        },
        {
            id: 'PRJ-2024-002', 
            name: 'E-commerce Platform Development',
            client: 'RetailMax India Pvt Ltd',
            value: '₹1,850,000',
            progress: 45,
            status: 'Active',
            deadline: '2025-01-30',
            invoiceStatus: 'Ready for Funding',
            discountRate: 8.1,
            fundedAmount: '₹0'
        },
        {
            id: 'PRJ-2024-003',
            name: 'Mobile App Development',
            client: 'StartupHub Technologies',
            value: '₹950,000',
            progress: 90,
            status: 'Near Completion',
            deadline: '2024-11-20',
            invoiceStatus: 'Fully Funded',
            discountRate: 7.2,
            fundedAmount: '₹881,600'
        },
        {
            id: 'PRJ-2024-004',
            name: 'Digital Marketing Campaign',
            client: 'BrandForce Communications',
            value: '₹1,200,000',
            progress: 60,
            status: 'Active',
            deadline: '2024-12-30',
            invoiceStatus: 'Ready for Funding',
            discountRate: 7.9,
            fundedAmount: '₹0'
        },
        {
            id: 'PRJ-2024-005',
            name: 'Cloud Migration Services',
            client: 'DataSecure Systems',
            value: '₹3,200,000',
            progress: 30,
            status: 'In Progress',
            deadline: '2025-02-15',
            invoiceStatus: 'Pending',
            discountRate: 8.5,
            fundedAmount: '₹0'
        }
    ]);

    const getTotalValue = () => {
        return projects.reduce((sum, project) => {
            const value = parseFloat(project.value.replace('₹', '').replace(',', ''));
            return sum + value;
        }, 0).toLocaleString('en-IN');
    };

    const getFundedAmount = () => {
        return projects.reduce((sum, project) => {
            const funded = parseFloat(project.fundedAmount.replace('₹', '').replace(',', '') || '0');
            return sum + funded;
        }, 0).toLocaleString('en-IN');
    };

    return (
        <>
            {/* Page Header */}
            <Row>
                <Col xl={12}>
                    <Card className="mb-4" style={{
                        background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 50%, #3B4C5F 100%)',
                        boxShadow: '0 8px 32px rgba(44, 62, 80, 0.15)'
                    }}>
                        <Card.Header className="border-0" style={{background: 'transparent'}}>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3" style={{
                                        background: 'rgba(255,255,255,0.15)', 
                                        borderRadius: '20px',
                                        padding: '20px',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <i className="fas fa-file-contract text-white fs-2"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-white mb-1 fw-bold">Contract Management Center</h3>
                                        <p className="text-white-50 mb-0 fs-6">Create, manage and track all project contracts</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="d-flex align-items-center text-white-50 mb-2">
                                        <div className="d-flex align-items-center me-4">
                                            <i className="fas fa-circle text-success me-2" style={{fontSize: '8px'}}></i>
                                            <small className="fw-medium">Contracts Active</small>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-chart-trending-up text-success me-2"></i>
                                            <small className="fw-medium">Portfolio Growing</small>
                                        </div>
                                    </div>
                                    <small className="text-white-50">Live data • Updated real-time</small>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>

            {/* Contract Overview KPIs */}
            <Row className="mb-4">
                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #1B4F72 0%, #2E86AB 100%)',
                        boxShadow: '0 4px 20px rgba(27, 79, 114, 0.15)'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="d-flex align-items-center">
                                <div className="me-3" style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fas fa-project-diagram fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold">{projects.length}</h3>
                                    <p className="mb-0 text-white-75">Total Projects</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium">Active Portfolio</span>
                                <Badge bg="light" text="dark" className="fs-7">
                                    Live
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #145A32 0%, #27AE60 100%)',
                        boxShadow: '0 4px 20px rgba(20, 90, 50, 0.15)'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="d-flex align-items-center">
                                <div className="me-3" style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fas fa-rupee-sign fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold">₹{getTotalValue()}</h3>
                                    <p className="mb-0 text-white-75">Total Value</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium">Portfolio Value</span>
                                <Badge bg="light" text="dark" className="fs-7">
                                    100%
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #7D3C98 0%, #9B59B6 100%)',
                        boxShadow: '0 4px 20px rgba(125, 60, 152, 0.15)'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="d-flex align-items-center">
                                <div className="me-3" style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fas fa-money-bill-wave fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold">₹{getFundedAmount()}</h3>
                                    <p className="mb-0 text-white-75">Funded Amount</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium">Funded</span>
                                <Badge bg="light" text="dark" className="fs-7">
                                    Active
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #B7950B 0%, #F1C40F 100%)',
                        boxShadow: '0 4px 20px rgba(183, 149, 11, 0.15)'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="d-flex align-items-center">
                                <div className="me-3" style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="fas fa-file-contract fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold">{projects.filter(p => p.invoiceStatus === 'Ready for Funding').length}</h3>
                                    <p className="mb-0 text-white-75">Ready for Contracts</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium">Pending</span>
                                <Badge bg="light" text="dark" className="fs-7">
                                    Action Required
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Contract Manager Component */}
            <Row>
                <Col xl={12}>
                    <ContractManager projects={projects} />
                </Col>
            </Row>
        </>
    );
};

export default ContractManagement;