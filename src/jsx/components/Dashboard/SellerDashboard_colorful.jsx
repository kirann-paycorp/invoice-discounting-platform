import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
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
            {/* Professional Fintech Header */}
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
                                        <h3 className="text-white mb-1 fw-bold">Seller Project Hub</h3>
                                        <p className="text-white-50 mb-0 fs-6">Project management, invoice discounting & funding opportunities</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="d-flex align-items-center text-white-50 mb-2">
                                        <div className="d-flex align-items-center me-4">
                                            <i className="fas fa-circle text-success me-2" style={{fontSize: '8px'}}></i>
                                            <small className="fw-medium">Projects Active</small>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-chart-trending-up text-success me-2"></i>
                                            <small className="fw-medium">High Performance</small>
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
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                        border: 'none',
                        borderRadius: '20px',
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="d-flex align-items-center">
                                <div className="me-3" style={{
                                    background: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
                                    borderRadius: '15px',
                                    padding: '15px',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                                }}>
                                    <i className="fas fa-briefcase fs-4 text-white"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold text-white">{financialMetrics.activeProjects.count}</h3>
                                    <p className="mb-0 text-white-75">🎯 Active Projects</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium text-white">{financialMetrics.activeProjects.value}</span>
                                <Badge style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}} className="fs-7">
                                    {financialMetrics.activeProjects.growth}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)',
                        border: 'none',
                        borderRadius: '20px',
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="d-flex align-items-center">
                                <div className="me-3" style={{
                                    background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)',
                                    borderRadius: '15px',
                                    padding: '15px',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                                }}>
                                    <i className="fas fa-file-invoice-dollar fs-4 text-white"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold text-white">{financialMetrics.pendingInvoices.amount}</h3>
                                    <p className="mb-0 text-white-75">💰 Pending Invoices</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium text-white">{financialMetrics.pendingInvoices.count} invoices</span>
                                <Badge style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}} className="fs-7">
                                    {financialMetrics.pendingInvoices.avgDiscount} avg rate
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        boxShadow: '0 8px 25px rgba(79, 172, 254, 0.3)',
                        border: 'none',
                        borderRadius: '20px',
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="d-flex align-items-center">
                                <div className="me-3" style={{
                                    background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
                                    borderRadius: '15px',
                                    padding: '15px',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                                }}>
                                    <i className="fas fa-coins fs-4 text-info"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold text-white">{financialMetrics.fundedAmount.total}</h3>
                                    <p className="mb-0 text-white-75">💸 Total Funded</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium text-white">{financialMetrics.fundedAmount.thisMonth} this month</span>
                                <Badge style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}} className="fs-7">
                                    {financialMetrics.fundedAmount.growth}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 h-100" style={{
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        boxShadow: '0 8px 25px rgba(250, 112, 154, 0.3)',
                        border: 'none',
                        borderRadius: '20px',
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease'
                    }}>
                        <Card.Body className="text-white p-4">
                            <div className="d-flex align-items-center">
                                <div className="me-3" style={{
                                    background: 'linear-gradient(135deg, #ffeaa7, #55a3ff)',
                                    borderRadius: '15px',
                                    padding: '15px',
                                    width: '60px',
                                    height: '60px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                                }}>
                                    <i className="fas fa-clock fs-4 text-white"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h3 className="mb-1 fw-bold text-white">{financialMetrics.avgProcessingTime.hours}h</h3>
                                    <p className="mb-0 text-white-75">⚡ Avg Processing</p>
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                <span className="fs-6 fw-medium text-white">SLA: {financialMetrics.avgProcessingTime.sla}</span>
                                <Badge style={{background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)'}} className="fs-7">
                                    {financialMetrics.avgProcessingTime.performance}
                                </Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card className="border-0" style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
                        borderRadius: '15px'
                    }}>
                        <Card.Body className="py-3 px-4">
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

            {/* Main Content: Projects Table and Recent Activity */}
            <Row>
                <Col xl={8}>
                    <Card className="border-0" style={{boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
                        <Card.Header className="bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold text-dark">
                                <i className="fas fa-table me-2 text-primary"></i>
                                Current Projects Portfolio
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table className="mb-0">
                                    <thead style={{backgroundColor: '#f8f9fa'}}>
                                        <tr>
                                            <th className="border-0 px-4 py-3 fw-semibold text-muted">Project Details</th>
                                            <th className="border-0 px-4 py-3 fw-semibold text-muted">Value & Progress</th>
                                            <th className="border-0 px-4 py-3 fw-semibold text-muted">Funding Status</th>
                                            <th className="border-0 px-4 py-3 fw-semibold text-muted">Deadline</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProjects.map((project, index) => (
                                            <tr key={project.id} style={{borderBottom: '1px solid #f1f3f4'}}>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <h6 className="mb-1 fw-semibold text-dark">{project.name}</h6>
                                                        <p className="mb-1 text-muted small">{project.client}</p>
                                                        <Badge bg={getStatusVariant(project.status)} className="fs-7">
                                                            {project.status}
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <h6 className="mb-1 fw-bold text-success">{project.value}</h6>
                                                        <div className="progress" style={{height: '6px'}}>
                                                            <div 
                                                                className="progress-bar bg-primary" 
                                                                style={{width: `${project.progress}%`}}
                                                            ></div>
                                                        </div>
                                                        <small className="text-muted">{project.progress}% complete</small>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div>
                                                        <Badge bg={getInvoiceStatusVariant(project.invoiceStatus)} className="mb-1">
                                                            {project.invoiceStatus}
                                                        </Badge>
                                                        <p className="mb-0 small text-muted">
                                                            Rate: {project.discountRate}%
                                                        </p>
                                                        <p className="mb-0 small fw-medium text-success">
                                                            Funded: {project.fundedAmount}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-dark fw-medium">{project.deadline}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={4}>
                    <Card className="border-0" style={{boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
                        <Card.Header className="bg-white border-0 py-3">
                            <h5 className="mb-0 fw-bold text-dark">
                                <i className="fas fa-bell me-2 text-warning"></i>
                                Recent Activity
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="activity-timeline">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="d-flex mb-4 pb-3" style={{
                                        borderBottom: index < recentActivities.length - 1 ? '1px solid #f1f3f4' : 'none'
                                    }}>
                                        <div className="me-3 mt-1">
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: activity.type === 'funding' ? 'linear-gradient(45deg, #f093fb, #f5576c)' :
                                                           activity.type === 'approval' ? 'linear-gradient(45deg, #4facfe, #00f2fe)' :
                                                           'linear-gradient(45deg, #fa709a, #fee140)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                            }}>
                                                <i className={`fas ${getActivityIcon(activity.type)} text-white`}></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1 fw-semibold text-dark">{activity.title}</h6>
                                            <p className="mb-1 text-muted small">{activity.description}</p>
                                            {activity.amount && (
                                                <p className="mb-1 fw-bold text-success">{activity.amount}</p>
                                            )}
                                            <small className="text-muted">{activity.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal Forms */}
            <CustomerContractForm 
                show={showContractForm} 
                handleClose={() => setShowContractForm(false)}
            />
            <AddProjectForm 
                show={showProjectForm} 
                handleClose={() => setShowProjectForm(false)}
            />
        </>
    );
};

export default SellerDashboard