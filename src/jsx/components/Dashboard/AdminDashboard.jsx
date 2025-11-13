
import React, { useState } from 'react';
import { Card, Row, Col, Badge, Table, Alert, Button, ProgressBar, Dropdown } from 'react-bootstrap';

const AdminDashboard = () => {
    const [financialMetrics] = useState({
        discountedInvoices: { count: 2847, value: '₹156.8M', growth: '+12.3%', period: 'this month' },
        outstandingValue: { amount: '₹89.2M', maturity: '14 days avg', riskLevel: 'low' },
        riskIndex: { score: 2.4, status: 'excellent', trend: 'improving', lastUpdate: 'real-time' },
        processingTime: { avgHours: 4.2, sla: '6 hours', performance: 'excellent' }
    });

    const [discountRateTrends] = useState([
        { period: 'Q1 2024', rate: 8.5, volume: '₹45.2M' },
        { period: 'Q2 2024', rate: 8.2, volume: '₹52.1M' },
        { period: 'Q3 2024', rate: 7.9, volume: '₹48.7M' },
        { period: 'Q4 2024', rate: 7.6, volume: '₹61.3M' }
    ]);

    const [upcomingMaturities] = useState([
        {
            id: 'INV-2024-4521',
            seller: 'TechCorp Solutions Ltd.',
            buyer: 'Global Manufacturing Inc.',
            principal: '₹2,450,000',
            maturityDate: '2024-11-08',
            daysToMaturity: 4,
            riskCategory: 'A1',
            discountRate: 7.5
        },
        {
            id: 'INV-2024-4522',
            seller: 'RetailMax India Pvt Ltd',
            buyer: 'Consumer Goods Corp',
            principal: '₹1,850,000',
            maturityDate: '2024-11-12',
            daysToMaturity: 8,
            riskCategory: 'A2',
            discountRate: 8.1
        },
        {
            id: 'INV-2024-4523',
            seller: 'StartupHub Technologies',
            buyer: 'Enterprise Solutions Ltd',
            principal: '₹950,000',
            maturityDate: '2024-11-15',
            daysToMaturity: 11,
            riskCategory: 'B1',
            discountRate: 9.2
        }
    ]);

    const [platformAlerts] = useState([
        {
            type: 'critical',
            title: 'High-Value Invoice Approaching Maturity',
            description: 'INV-2024-4521 (₹2.45M) matures in 4 days - Monitor buyer payment status',
            time: '5 min ago',
            actionRequired: true,
            category: 'risk_management'
        },
        {
            type: 'warning',
            title: 'Discount Rate Anomaly Detected',
            description: 'Seller requesting 12.5% discount rate - 3x market average for A1 category',
            time: '23 min ago',
            actionRequired: true,
            category: 'pricing'
        },
        {
            type: 'info',
            title: 'New Corporate Buyer Verified',
            description: 'Enterprise Solutions Ltd completed enhanced due diligence - Credit limit ₹50M approved',
            time: '1 hour ago',
            actionRequired: false,
            category: 'onboarding'
        }
    ]);

    const getRiskCategoryColor = (category) => {
        switch(category) {
            case 'A1': return 'success';
            case 'A2': return 'info';
            case 'B1': return 'warning';
            case 'B2': return 'danger';
            default: return 'secondary';
        }
    };

    const getMaturityUrgency = (days) => {
        if (days <= 3) return 'danger';
        if (days <= 7) return 'warning';
        return 'success';
    };

    const getAlertVariant = (type) => {
        switch(type) {
            case 'critical': return 'danger';
            case 'warning': return 'warning';
            case 'info': return 'info';
            default: return 'secondary';
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
                                        <i className="fas fa-chart-line text-white fs-2"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-white mb-1 fw-bold">Invoice Discounting Control Center</h3>
                                        <p className="text-white-50 mb-0 fs-6">Risk management, liquidity monitoring & platform oversight</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="d-flex align-items-center text-white-50 mb-2">
                                        <div className="d-flex align-items-center me-4">
                                            <i className="fas fa-circle text-success me-2" style={{fontSize: '8px'}}></i>
                                            <small className="fw-medium">Platform Operational</small>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-shield-check text-success me-2"></i>
                                            <small className="fw-medium">Risk Systems Active</small>
                                        </div>
                                    </div>
                                    <small className="text-white-50">Live data • Updated {financialMetrics.riskIndex.lastUpdate}</small>
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>

                {/* Financial KPI Cards */}
                <Col xl={3} md={6}>
                    <Card className="border-0 mb-4" style={{
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(52, 73, 94, 0.08)',
                        borderRadius: '16px'
                    }}>
                        <Card.Body className="text-center p-4">
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <div style={{
                                    background: 'linear-gradient(135deg, #3498DB, #2980B9)',
                                    borderRadius: '16px',
                                    padding: '18px',
                                    boxShadow: '0 6px 20px rgba(52, 152, 219, 0.25)'
                                }}>
                                    <i className="fas fa-file-invoice-dollar text-white fs-3"></i>
                                </div>
                            </div>
                            <h6 className="text-muted mb-2 fw-semibold text-uppercase" style={{letterSpacing: '0.5px', fontSize: '11px'}}>Discounted Invoices</h6>
                            <h2 className="mb-1 fw-bold" style={{color: '#2C3E50'}}>{financialMetrics.discountedInvoices.count.toLocaleString()}</h2>
                            <p className="text-muted small mb-2 fw-medium">{financialMetrics.discountedInvoices.value} total value</p>
                            <p className="mb-0" style={{fontSize: '12px'}}>
                                <span className="text-success fw-semibold">{financialMetrics.discountedInvoices.growth}</span>
                                <span className="text-muted"> {financialMetrics.discountedInvoices.period}</span>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 mb-4" style={{
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(52, 73, 94, 0.08)',
                        borderRadius: '16px'
                    }}>
                        <Card.Body className="text-center p-4">
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <div style={{
                                    background: 'linear-gradient(135deg, #27AE60, #229954)',
                                    borderRadius: '16px',
                                    padding: '18px',
                                    boxShadow: '0 6px 20px rgba(39, 174, 96, 0.25)'
                                }}>
                                    <i className="fas fa-coins text-white fs-3"></i>
                                </div>
                            </div>
                            <h6 className="text-muted mb-2 fw-semibold text-uppercase" style={{letterSpacing: '0.5px', fontSize: '11px'}}>Outstanding Value</h6>
                            <h2 className="mb-1 fw-bold" style={{color: '#2C3E50'}}>{financialMetrics.outstandingValue.amount}</h2>
                            <p className="text-muted small mb-2 fw-medium">{financialMetrics.outstandingValue.maturity} maturity</p>
                            <p className="mb-0" style={{fontSize: '12px'}}>
                                <span className="text-success fw-semibold">● {financialMetrics.outstandingValue.riskLevel} risk</span>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 mb-4" style={{
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(52, 73, 94, 0.08)',
                        borderRadius: '16px'
                    }}>
                        <Card.Body className="text-center p-4">
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <div style={{
                                    background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
                                    borderRadius: '16px',
                                    padding: '18px',
                                    boxShadow: '0 6px 20px rgba(231, 76, 60, 0.25)'
                                }}>
                                    <i className="fas fa-shield-virus text-white fs-3"></i>
                                </div>
                            </div>
                            <h6 className="text-muted mb-2 fw-semibold text-uppercase" style={{letterSpacing: '0.5px', fontSize: '11px'}}>Risk Index</h6>
                            <h2 className="mb-1 fw-bold" style={{color: '#2C3E50'}}>{financialMetrics.riskIndex.score}</h2>
                            <p className="text-muted small mb-2 fw-medium">{financialMetrics.riskIndex.status} rating</p>
                            <p className="mb-0" style={{fontSize: '12px'}}>
                                <span className="text-success fw-semibold">↗ {financialMetrics.riskIndex.trend}</span>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="border-0 mb-4" style={{
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(52, 73, 94, 0.08)',
                        borderRadius: '16px'
                    }}>
                        <Card.Body className="text-center p-4">
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <div style={{
                                    background: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
                                    borderRadius: '16px',
                                    padding: '18px',
                                    boxShadow: '0 6px 20px rgba(155, 89, 182, 0.25)'
                                }}>
                                    <i className="fas fa-clock text-white fs-3"></i>
                                </div>
                            </div>
                            <h6 className="text-muted mb-2 fw-semibold text-uppercase" style={{letterSpacing: '0.5px', fontSize: '11px'}}>Processing Time</h6>
                            <h2 className="mb-1 fw-bold" style={{color: '#2C3E50'}}>{financialMetrics.processingTime.avgHours}h</h2>
                            <p className="text-muted small mb-2 fw-medium">avg approval time</p>
                            <p className="mb-0" style={{fontSize: '12px'}}>
                                <span className="text-success fw-semibold">● {financialMetrics.processingTime.performance}</span>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Invoice Maturities Table */}
                <Col xl={8}>
                    <Card className="border-0 mb-4" style={{
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(52, 73, 94, 0.08)',
                        borderRadius: '16px'
                    }}>
                        <Card.Header style={{background: 'transparent', borderBottom: '1px solid #ECF0F1'}} className="py-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-1 fw-bold" style={{color: '#2C3E50'}}>Upcoming Invoice Maturities</h5>
                                    <p className="text-muted mb-0 small">Monitor payment schedules and risk exposure</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Badge bg="danger" className="px-3 py-2">3 Due This Week</Badge>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-secondary" size="sm" style={{borderRadius: '8px'}}>
                                            <i className="fas fa-filter me-2"></i>Filter
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item>All Maturities</Dropdown.Item>
                                            <Dropdown.Item>Due This Week</Dropdown.Item>
                                            <Dropdown.Item>High Risk Only</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table className="table-hover mb-0">
                                    <thead style={{backgroundColor: '#F8F9FA'}}>
                                        <tr>
                                            <th className="border-0 fw-semibold py-3" style={{color: '#5D6D7E'}}>Invoice Details</th>
                                            <th className="border-0 fw-semibold py-3" style={{color: '#5D6D7E'}}>Counterparties</th>
                                            <th className="border-0 fw-semibold py-3" style={{color: '#5D6D7E'}}>Principal</th>
                                            <th className="border-0 fw-semibold py-3" style={{color: '#5D6D7E'}}>Maturity</th>
                                            <th className="border-0 fw-semibold py-3" style={{color: '#5D6D7E'}}>Risk</th>
                                            <th className="border-0 fw-semibold py-3" style={{color: '#5D6D7E'}}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {upcomingMaturities.map((invoice, index) => (
                                            <tr key={index}>
                                                <td className="py-4">
                                                    <div>
                                                        <h6 className="mb-1 fw-semibold" style={{color: '#2C3E50'}}>{invoice.id}</h6>
                                                        <small className="text-muted">Rate: {invoice.discountRate}%</small>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <div>
                                                        <div className="fw-medium mb-1" style={{color: '#34495E', fontSize: '13px'}}>Seller: {invoice.seller}</div>
                                                        <div className="text-muted" style={{fontSize: '12px'}}>Buyer: {invoice.buyer}</div>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <span className="fw-bold" style={{color: '#27AE60', fontSize: '15px'}}>{invoice.principal}</span>
                                                </td>
                                                <td className="py-4">
                                                    <div>
                                                        <div className="fw-medium mb-1" style={{color: '#2C3E50'}}>{new Date(invoice.maturityDate).toLocaleDateString()}</div>
                                                        <Badge bg={getMaturityUrgency(invoice.daysToMaturity)} className="px-2 py-1">
                                                            {invoice.daysToMaturity} days
                                                        </Badge>
                                                    </div>
                                                </td>
                                                <td className="py-4">
                                                    <Badge bg={getRiskCategoryColor(invoice.riskCategory)} className="px-3 py-2 fw-semibold">
                                                        {invoice.riskCategory}
                                                    </Badge>
                                                </td>
                                                <td className="py-4">
                                                    <div className="d-flex gap-1">
                                                        <Button variant="outline-primary" size="sm" style={{borderRadius: '6px'}}>
                                                            <i className="fas fa-eye"></i>
                                                        </Button>
                                                        <Button variant="outline-warning" size="sm" style={{borderRadius: '6px'}}>
                                                            <i className="fas fa-exclamation-triangle"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Platform Risk Alerts */}
                <Col xl={4}>
                    <Card className="border-0 mb-4" style={{
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(52, 73, 94, 0.08)',
                        borderRadius: '16px'
                    }}>
                        <Card.Header style={{background: 'transparent', borderBottom: '1px solid #ECF0F1'}} className="py-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-1 fw-bold" style={{color: '#2C3E50'}}>Risk & Compliance Alerts</h5>
                                    <p className="text-muted mb-0 small">Real-time monitoring & notifications</p>
                                </div>
                                <Badge bg="danger" style={{borderRadius: '12px'}} className="px-3 py-2">
                                    {platformAlerts.filter(alert => alert.actionRequired).length} Critical
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div className="alerts-container">
                                {platformAlerts.map((alert, index) => (
                                    <Alert key={index} variant={getAlertVariant(alert.type)} className="mb-3 border-0" style={{
                                        borderRadius: '12px',
                                        backgroundColor: alert.type === 'critical' ? '#FDF2F2' : alert.type === 'warning' ? '#FFFBF0' : '#F0F9FF'
                                    }}>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center mb-2">
                                                    <i className={`fas ${alert.type === 'critical' ? 'fa-exclamation-triangle' : alert.type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2`}></i>
                                                    <h6 className="mb-0 fw-bold" style={{color: '#2C3E50'}}>{alert.title}</h6>
                                                </div>
                                                <p className="mb-2 small text-muted">{alert.description}</p>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <small className="text-muted">{alert.time}</small>
                                                    <Badge bg="light" text="dark" style={{borderRadius: '6px'}} className="px-2 py-1">
                                                        {alert.category.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        {alert.actionRequired && (
                                            <div className="mt-3 d-flex gap-2">
                                                <Button variant="outline-primary" size="sm" style={{borderRadius: '8px', fontSize: '12px'}}>
                                                    <i className="fas fa-eye me-1"></i>Review
                                                </Button>
                                                <Button variant="outline-success" size="sm" style={{borderRadius: '8px', fontSize: '12px'}}>
                                                    <i className="fas fa-check me-1"></i>Approve
                                                </Button>
                                            </div>
                                        )}
                                    </Alert>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Discount Rate Trends Chart */}
                <Col xl={6}>
                    <Card className="border-0 mb-4" style={{
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(52, 73, 94, 0.08)',
                        borderRadius: '16px'
                    }}>
                        <Card.Header style={{background: 'transparent', borderBottom: '1px solid #ECF0F1'}} className="py-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="mb-1 fw-bold" style={{color: '#2C3E50'}}>Discount Rate Trends</h5>
                                    <p className="text-muted mb-0 small">Quarterly rate analysis & volume correlation</p>
                                </div>
                                <Button variant="outline-secondary" size="sm" style={{borderRadius: '8px'}}>
                                    <i className="fas fa-download me-2"></i>Export
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fw-medium" style={{color: '#5D6D7E'}}>Current Average Rate</span>
                                    <span className="fw-bold fs-4" style={{color: '#E74C3C'}}>7.6%</span>
                                </div>
                                <div className="mb-4">
                                    {discountRateTrends.map((trend, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center mb-3 p-3" style={{
                                            backgroundColor: '#F8F9FA',
                                            borderRadius: '10px',
                                            border: '1px solid #ECF0F1'
                                        }}>
                                            <div>
                                                <div className="fw-semibold mb-1" style={{color: '#2C3E50'}}>{trend.period}</div>
                                                <small className="text-muted">Volume: {trend.volume}</small>
                                            </div>
                                            <div className="text-end">
                                                <div className="fw-bold" style={{
                                                    color: trend.rate <= 7.8 ? '#27AE60' : trend.rate <= 8.2 ? '#F39C12' : '#E74C3C',
                                                    fontSize: '18px'
                                                }}>
                                                    {trend.rate}%
                                                </div>
                                                <div style={{width: '60px', height: '6px', backgroundColor: '#ECF0F1', borderRadius: '3px', overflow: 'hidden'}}>
                                                    <div style={{
                                                        width: `${(10 - trend.rate) * 10}%`,
                                                        height: '100%',
                                                        backgroundColor: trend.rate <= 7.8 ? '#27AE60' : trend.rate <= 8.2 ? '#F39C12' : '#E74C3C',
                                                        borderRadius: '3px'
                                                    }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center">
                                    <Button variant="outline-primary" size="sm" style={{borderRadius: '8px'}}>
                                        <i className="fas fa-chart-area me-2"></i>View Detailed Analytics
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Quick Financial Actions */}
                <Col xl={6}>
                    <Card className="border-0" style={{
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(52, 73, 94, 0.08)',
                        borderRadius: '16px'
                    }}>
                        <Card.Header style={{background: 'transparent', borderBottom: '1px solid #ECF0F1'}} className="py-4">
                            <h5 className="mb-0 fw-bold" style={{color: '#2C3E50'}}>Platform Administration</h5>
                            <p className="text-muted mb-0 small">Financial operations & risk management tools</p>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Row className="g-3">
                                <Col md={6}>
                                    <Button className="w-100 py-3 fw-semibold d-flex align-items-center justify-content-center" style={{
                                        background: 'linear-gradient(135deg, #3498DB, #2980B9)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        boxShadow: '0 4px 15px rgba(52, 152, 219, 0.25)'
                                    }}>
                                        <i className="fas fa-file-invoice me-2"></i>
                                        Invoice Approval
                                    </Button>
                                </Col>
                                <Col md={6}>
                                    <Button className="w-100 py-3 fw-semibold d-flex align-items-center justify-content-center" style={{
                                        background: 'linear-gradient(135deg, #E74C3C, #C0392B)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        boxShadow: '0 4px 15px rgba(231, 76, 60, 0.25)'
                                    }}>
                                        <i className="fas fa-shield-virus me-2"></i>
                                        Risk Assessment
                                    </Button>
                                </Col>
                                <Col md={6}>
                                    <Button className="w-100 py-3 fw-semibold d-flex align-items-center justify-content-center" style={{
                                        background: 'linear-gradient(135deg, #27AE60, #229954)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        boxShadow: '0 4px 15px rgba(39, 174, 96, 0.25)'
                                    }}>
                                        <i className="fas fa-chart-pie me-2"></i>
                                        Liquidity Monitor
                                    </Button>
                                </Col>
                                <Col md={6}>
                                    <Button className="w-100 py-3 fw-semibold d-flex align-items-center justify-content-center" style={{
                                        background: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white',
                                        boxShadow: '0 4px 15px rgba(155, 89, 182, 0.25)'
                                    }}>
                                        <i className="fas fa-cogs me-2"></i>
                                        Platform Settings
                                    </Button>
                                </Col>
                            </Row>
                            
                            {/* Platform Health Monitor */}
                            <div className="mt-4 p-3" style={{backgroundColor: '#F8F9FA', borderRadius: '12px'}}>
                                <h6 className="mb-3 fw-semibold" style={{color: '#2C3E50'}}>Platform Health Metrics</h6>
                                
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="small fw-medium" style={{color: '#5D6D7E'}}>Transaction Processing</span>
                                        <span className="small fw-bold text-success">99.8%</span>
                                    </div>
                                    <ProgressBar now={99.8} variant="success" style={{height: '6px', borderRadius: '3px'}} />
                                </div>
                                
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="small fw-medium" style={{color: '#5D6D7E'}}>Risk Engine Load</span>
                                        <span className="small fw-bold text-info">34%</span>
                                    </div>
                                    <ProgressBar now={34} variant="info" style={{height: '6px', borderRadius: '3px'}} />
                                </div>
                                
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="small fw-medium" style={{color: '#5D6D7E'}}>API Response Time</span>
                                        <span className="small fw-bold text-warning">247ms</span>
                                    </div>
                                    <ProgressBar now={65} variant="warning" style={{height: '6px', borderRadius: '3px'}} />
                                </div>
                                
                                <div className="text-center mt-3">
                                    <Button variant="outline-primary" size="sm" style={{borderRadius: '8px', fontSize: '12px'}}>
                                        <i className="fas fa-sync-alt me-2"></i>Refresh Metrics
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

export default AdminDashboard;