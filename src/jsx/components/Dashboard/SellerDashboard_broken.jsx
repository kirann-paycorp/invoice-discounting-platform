import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Table, ProgressBar } from 'react-bootstrap';
import CustomerContractForm from './CustomerContractForm';
import AddProjectForm from './AddProjectForm';

const SellerDashboard = () => {
    const [showContractForm, setShowContractForm] = useState(false);
    const [showProjectForm, setShowProjectForm] = useState(false);
    
    const [financialMetrics] = useState({
        activeProjects: { count: 8, value: '₹52.5M', growth: '+15%', period: 'this quarter' },
        pendingInvoices: { amount: '₹8.2M', count: 5, avgDiscount: '7.8%' },
        fundedAmount: { total: '₹44.3M', thisMonth: '₹12.1M', growth: '+23%' },
        avgProcessingTime: { hours: 3.8, sla: '4 hours', performance: 'excellent' }
    });

    const [currentProjects] = useState([
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
        }
    ]);

    const [recentActivities] = useState([
        {
            type: 'funding',
            title: 'Invoice Funded Successfully',
            description: 'TechCorp Infrastructure milestone payment funded at 7.5% discount rate',
            amount: '₹612,500',
            time: '2 hours ago',
            status: 'completed'
        },
        {
            type: 'approval',
            title: 'Contract Approved',
            description: 'E-commerce Platform contract approved by admin - ready for project milestones',
            time: '5 hours ago',
            status: 'approved'
        },
        {
            type: 'maturity',
            title: 'Payment Received',
            description: 'Mobile App Development final payment received from buyer',
            amount: '₹950,000',
            time: '1 day ago',
            status: 'received'
        }
    ]);

    const getStatusVariant = (status) => {
        switch(status) {
            case 'In Progress': return 'primary';
            case 'Active': return 'info';
            case 'Near Completion': return 'warning';
            case 'Completed': return 'success';
            default: return 'secondary';
        }
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

    const getActivityIcon = (type) => {
        switch(type) {
            case 'funding': return 'fa-coins';
            case 'approval': return 'fa-check-circle';
            case 'maturity': return 'fa-money-bill-wave';
            default: return 'fa-info-circle';
        }
    };

    return (
        <>
            {/* Fintech Header */}
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
                                        <i className="fas fa-project-diagram text-white fs-2"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-white mb-1 fw-bold">Seller Project Portfolio</h3>
                                        <p className="text-white-50 mb-0 fs-6">Manage contracts, track invoice funding & monitor project progress</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="d-flex align-items-center text-white-50 mb-2">
                                        <div className="d-flex align-items-center me-4">
                                            <i className="fas fa-circle text-success me-2" style={{fontSize: '8px'}}></i>
                                            <small className="fw-medium">Active Portfolio</small>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-chart-line text-success me-2"></i>
                                            <small className="fw-medium">Growing Revenue</small>
                                        </div>
                                    </div>
                                    <small className="text-white-50">Live data • Updated real-time</small>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>

            {/* Financial KPI Cards */}
            <Row className="mb-4">
                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)'
                    }}>
                        <Card.Body className="text-white">
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
                                    <i className="fas fa-briefcase fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold">{financialMetrics.activeProjects.count}</h3>
                                    <p className="mb-0 text-white-75">Active Projects</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium">{financialMetrics.activeProjects.value}</span>
                                <Badge bg="light" text="dark" className="fs-7">
                                    {financialMetrics.activeProjects.growth}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        boxShadow: '0 4px 20px rgba(240, 147, 251, 0.15)'
                    }}>
                        <Card.Body className="text-white">
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
                                    <i className="fas fa-file-invoice-dollar fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold">{financialMetrics.pendingInvoices.amount}</h3>
                                    <p className="mb-0 text-white-75">Pending Invoices</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium">{financialMetrics.pendingInvoices.count} invoices</span>
                                <Badge bg="light" text="dark" className="fs-7">
                                    {financialMetrics.pendingInvoices.avgDiscount} avg rate
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        boxShadow: '0 4px 20px rgba(79, 172, 254, 0.15)'
                    }}>
                        <Card.Body className="text-white">
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
                                    <i className="fas fa-coins fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold">{financialMetrics.fundedAmount.total}</h3>
                                    <p className="mb-0 text-white-75">Total Funded</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium">{financialMetrics.fundedAmount.thisMonth} this month</span>
                                <Badge bg="light" text="dark" className="fs-7">
                                    {financialMetrics.fundedAmount.growth}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        boxShadow: '0 4px 20px rgba(250, 112, 154, 0.15)'
                    }}>
                        <Card.Body className="text-white">
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
                                    <i className="fas fa-clock fs-5"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold">{financialMetrics.avgProcessingTime.hours}h</h3>
                                    <p className="mb-0 text-white-75">Avg Processing</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium">SLA: {financialMetrics.avgProcessingTime.sla}</span>
                                <Badge bg="light" text="dark" className="fs-7">
                                    {financialMetrics.avgProcessingTime.performance}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Actions Row */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)'
                    }}>
                        <Card.Body className="py-3">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-plus-circle text-white me-2 fs-5"></i>
                                    <span className="text-white fw-medium">Quick Actions</span>
                                </div>
                                <div className="d-flex gap-3">
                                    <Button 
                                        variant="light" 
                                        size="sm" 
                                        className="d-flex align-items-center fw-medium px-3 py-2"
                                        onClick={() => setShowContractForm(true)}
                                        style={{borderRadius: '10px'}}
                                    >
                                        <i className="fas fa-file-contract me-2"></i>
                                        Create Contract
                                    </Button>
                                    <Button 
                                        variant="outline-light" 
                                        size="sm" 
                                        className="d-flex align-items-center fw-medium px-3 py-2"
                                        onClick={() => setShowProjectForm(true)}
                                        style={{borderRadius: '10px'}}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Add Project
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Main Content Row */}
            <Row>
                                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
                            }}>
                                <i className="fas fa-rupee-sign text-white fs-3"></i>
                            </div>
                        </div>
                        <h5 className="text-dark mb-2 fw-semibold">Total Project Value</h5>
                        <h2 className="text-info mb-2 fw-bold">₹52.5M</h2>
                        <p className="text-muted small mb-0">
                            <span className="text-success">↗ +15%</span> this quarter
                        </p>
                    </Card.Body>
                </Card>
            </Col>

            <Col xl={3} md={6}>
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="text-center p-4">
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <div style={{
                                background: 'linear-gradient(45deg, #FF9800, #F57C00)',
                                borderRadius: '15px',
                                padding: '15px',
                                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)'
                            }}>
                                <i className="fas fa-file-invoice text-white fs-3"></i>
                            </div>
                        </div>
                        <h5 className="text-dark mb-2 fw-semibold">Pending Invoices</h5>
                        <h2 className="text-warning mb-2 fw-bold">₹8.2M</h2>
                        <p className="text-muted small mb-0">
                            Across 5 projects
                        </p>
                    </Card.Body>
                </Card>
            </Col>

            <Col xl={3} md={6}>
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="text-center p-4">
                        <div className="d-flex align-items-center justify-content-center mb-3">
                            <div style={{
                                background: 'linear-gradient(45deg, #9C27B0, #7B1FA2)',
                                borderRadius: '15px',
                                padding: '15px',
                                boxShadow: '0 4px 15px rgba(156, 39, 176, 0.3)'
                            }}>
                                <i className="fas fa-chart-line text-white fs-3"></i>
                            </div>
                        </div>
                        <h5 className="text-dark mb-2 fw-semibold">Completion Rate</h5>
                        <h2 className="text-purple mb-2 fw-bold">73%</h2>
                        <p className="text-muted small mb-0">
                            Average across projects
                        </p>
                    </Card.Body>
                </Card>
            </Col>

            {/* Current Projects Table */}
            <Col xl={12}>
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1 fw-semibold text-dark">Current Projects</h5>
                                <p className="text-muted mb-0 small">Monitor progress and invoice status</p>
                            </div>
                            <Button variant="outline-primary" size="sm">
                                <i className="fas fa-plus me-2"></i>New Project
                            </Button>
                        </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table className="table-hover mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 fw-semibold">Project Details</th>
                                        <th className="border-0 fw-semibold">Client</th>
                                        <th className="border-0 fw-semibold">Value</th>
                                        <th className="border-0 fw-semibold">Progress</th>
                                        <th className="border-0 fw-semibold">Status</th>
                                        <th className="border-0 fw-semibold">Invoice Status</th>
                                        <th className="border-0 fw-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProjects.map((project, index) => (
                                        <tr key={index}>
                                            <td className="py-3">
                                                <div>
                                                    <h6 className="mb-1 fw-semibold">{project.name}</h6>
                                                    <small className="text-muted">{project.id}</small>
                                                    <br />
                                                    <small className="text-muted">Due: {new Date(project.deadline).toLocaleDateString()}</small>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className="fw-medium">{project.client}</span>
                                            </td>
                                            <td className="py-3">
                                                <span className="fw-bold text-success">{project.value}</span>
                                            </td>
                                            <td className="py-3">
                                                <div className="mb-1">
                                                    <small className="text-muted">{project.progress}%</small>
                                                </div>
                                                <ProgressBar 
                                                    now={project.progress} 
                                                    style={{height: '6px'}}
                                                    variant={project.progress > 80 ? 'success' : project.progress > 50 ? 'info' : 'warning'}
                                                />
                                            </td>
                                            <td className="py-3">
                                                <Badge bg={getStatusVariant(project.status)} className="px-3 py-2">
                                                    {project.status}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <Badge bg={getInvoiceStatusVariant(project.invoiceStatus)} className="px-3 py-2">
                                                    {project.invoiceStatus}
                                                </Badge>
                                            </td>
                                            <td className="py-3">
                                                <Button variant="outline-primary" size="sm" className="me-2">
                                                    <i className="fas fa-eye"></i>
                                                </Button>
                                                <Button variant="outline-success" size="sm">
                                                    <i className="fas fa-file-invoice"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            {/* Recent Activities */}
            <Col xl={6}>
                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                        <h5 className="mb-0 fw-semibold text-dark">Recent Activities</h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="timeline">
                            <div className="timeline-item d-flex mb-3">
                                <div className="timeline-marker bg-success rounded-circle me-3 mt-1" style={{width: '12px', height: '12px'}}></div>
                                <div>
                                    <p className="mb-1"><strong>TechCorp Infrastructure</strong> milestone completed</p>
                                    <small className="text-muted">2 hours ago</small>
                                </div>
                            </div>
                            <div className="timeline-item d-flex mb-3">
                                <div className="timeline-marker bg-primary rounded-circle me-3 mt-1" style={{width: '12px', height: '12px'}}></div>
                                <div>
                                    <p className="mb-1">Invoice generated for <strong>RetailMax Platform</strong></p>
                                    <small className="text-muted">5 hours ago</small>
                                </div>
                            </div>
                            <div className="timeline-item d-flex mb-3">
                                <div className="timeline-marker bg-warning rounded-circle me-3 mt-1" style={{width: '12px', height: '12px'}}></div>
                                <div>
                                    <p className="mb-1">Payment received from <strong>StartupHub Technologies</strong></p>
                                    <small className="text-muted">1 day ago</small>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            {/* Quick Actions */}
            <Col xl={6}>
                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                        <h5 className="mb-0 fw-semibold text-dark">Quick Actions</h5>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-grid gap-3">
                            <Button 
                                variant="primary" 
                                className="py-3 fw-semibold"
                                onClick={() => setShowContractForm(true)}
                            >
                                <i className="fas fa-file-contract me-2"></i>Create Customer Contract
                            </Button>
                            <Button 
                                variant="success" 
                                className="py-3 fw-semibold"
                                onClick={() => setShowProjectForm(true)}
                            >
                                <i className="fas fa-folder-plus me-2"></i>Add Projects for Invoice
                            </Button>
                            <Button variant="info" className="py-3 fw-semibold">
                                <i className="fas fa-chart-bar me-2"></i>View Analytics
                            </Button>
                            <Button variant="outline-secondary" className="py-3 fw-semibold">
                                <i className="fas fa-cog me-2"></i>Project Settings
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>

        {/* Customer Contract Form Modal */}
        <CustomerContractForm 
            show={showContractForm}
            handleClose={() => setShowContractForm(false)}
        />
        
        {/* Add Project Form Modal */}
        <AddProjectForm 
            show={showProjectForm}
            handleClose={() => setShowProjectForm(false)}
        />
        </>
    );
};

export default SellerDashboard;

