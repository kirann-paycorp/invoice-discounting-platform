import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Badge, Button, Table, ProgressBar } from 'react-bootstrap';
import { approveContract, rejectContract, approveProject, rejectProject } from '../../../store/reducers/WorkflowReducer';
import swal from 'sweetalert2';

const WorkflowDashboard = () => {
    const dispatch = useDispatch();
    const { currentRole, contracts, projects, notifications } = useSelector(state => state.workflow);

    // Filter data based on current role
    const getVisibleContracts = () => {
        return contracts.filter(contract => 
            contract.visibleTo.includes(currentRole)
        );
    };

    const getVisibleProjects = () => {
        return projects.filter(project => 
            project.visibleTo.includes(currentRole)
        );
    };

    const getPendingApprovals = () => {
        const pending = [];
        
        if (currentRole === 'admin') {
            // Admin can approve contracts and projects
            contracts.filter(c => c.status === 'pending_approval').forEach(c => {
                pending.push({ type: 'contract', item: c });
            });
            projects.filter(p => p.status === 'pending_approval').forEach(p => {
                pending.push({ type: 'project', item: p });
            });
        }
        
        if (currentRole === 'financier') {
            // Financiers can finance approved projects
            projects.filter(p => p.status === 'approved' && p.applyForDiscounting).forEach(p => {
                pending.push({ type: 'financing', item: p });
            });
        }
        
        return pending;
    };

    const getRelevantNotifications = () => {
        return notifications.filter(notification => 
            notification.forRoles.includes(currentRole)
        );
    };

    const handleApproveContract = (contractId, customerName) => {
        // Show confirmation with approval details
        swal.fire({
            title: 'Approve Contract',
            html: `
                <div class="text-start">
                    <h6>Contract Details:</h6>
                    <p><strong>Customer:</strong> ${customerName}</p>
                    <p><strong>Action:</strong> Final Approval</p>
                    <p><strong>Next Step:</strong> Contract will be available to financiers immediately</p>
                    <div class="alert alert-info mt-3">
                        <small><i class="fas fa-info-circle me-1"></i>
                        This action cannot be undone. The contract will be published to the marketplace.</small>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Approve Contract',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#28a745',
            focusCancel: true
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(approveContract(contractId, customerName));
                
                // Show success with next steps
                swal.fire({
                    icon: 'success',
                    title: 'Contract Approved Successfully!',
                    html: `
                        <div class="text-start">
                            <p>Contract for <strong>${customerName}</strong> has been approved.</p>
                            <h6 class="mt-3">What happens next:</h6>
                            <ul class="text-start">
                                <li>Contract is now visible to financiers and buyers</li>
                                <li>Investment opportunities are published</li>
                                <li>Seller will be notified immediately</li>
                                <li>Expected funding timeline: 24-48 hours</li>
                            </ul>
                        </div>
                    `,
                    confirmButtonText: 'Got it',
                    timer: 8000
                });
            }
        });
    };

    const handleRejectContract = (contractId) => {
        swal.fire({
            title: 'Reject Contract',
            html: `
                <div class="text-start">
                    <div class="mb-3">
                        <label for="rejection-category" class="form-label">Rejection Category</label>
                        <select id="rejection-category" class="form-select">
                            <option value="">Select a category</option>
                            <option value="credit_score">Credit Score Too Low</option>
                            <option value="documentation">Incomplete Documentation</option>
                            <option value="financial_stability">Financial Stability Concerns</option>
                            <option value="contract_terms">Unfavorable Contract Terms</option>
                            <option value="compliance">Compliance Issues</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="rejection-reason" class="form-label">Detailed Reason</label>
                        <textarea id="rejection-reason" class="form-control" rows="4" 
                                placeholder="Provide specific feedback to help the seller improve their application..."></textarea>
                    </div>
                    <div class="alert alert-warning">
                        <small><i class="fas fa-exclamation-triangle me-1"></i>
                        The seller will receive this feedback and can resubmit with improvements.</small>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Reject Contract',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
            focusCancel: true,
            preConfirm: () => {
                const category = document.getElementById('rejection-category').value;
                const reason = document.getElementById('rejection-reason').value;
                
                if (!category) {
                    swal.showValidationMessage('Please select a rejection category');
                    return false;
                }
                if (!reason || reason.length < 10) {
                    swal.showValidationMessage('Please provide a detailed reason (minimum 10 characters)');
                    return false;
                }
                
                return { category, reason: `${category}: ${reason}` };
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                dispatch(rejectContract(contractId, result.value.reason));
                swal.fire({
                    icon: 'info',
                    title: 'Contract Rejected',
                    html: `
                        <div class="text-start">
                            <p>The contract has been rejected and the seller has been notified.</p>
                            <p><strong>Rejection Category:</strong> ${result.value.category}</p>
                            <p class="mt-3"><small>The seller can address the feedback and resubmit the application.</small></p>
                        </div>
                    `,
                    confirmButtonText: 'OK'
                });
            }
        });
    };

    const handleApproveProject = (projectId) => {
        dispatch(approveProject(projectId));
        swal.fire({
            icon: 'success',
            title: 'Project Approved!',
            text: 'Project has been approved and is now available for financing.',
            timer: 3000
        });
    };

    const handleFinanceProject = (projectId, projectValue) => {
        swal.fire({
            title: 'Finance Project',
            html: `
                <div class="mb-3">
                    <label for="amount" class="form-label">Financing Amount</label>
                    <input type="number" class="form-control" id="amount" max="${projectValue}" value="${projectValue * 0.8}">
                </div>
                <div class="mb-3">
                    <label for="terms" class="form-label">Terms (months)</label>
                    <select class="form-control" id="terms">
                        <option value="6">6 months</option>
                        <option value="12">12 months</option>
                        <option value="24">24 months</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Finance',
            confirmButtonColor: '#28a745',
            preConfirm: () => {
                const amount = document.getElementById('amount').value;
                const terms = document.getElementById('terms').value;
                return { amount: parseFloat(amount), terms: parseInt(terms) };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(financeProject(projectId, result.value.amount, result.value.terms));
                swal.fire('Financed!', 'Project has been financed successfully.', 'success');
            }
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending_approval': { 
                variant: 'warning', 
                text: 'Pending Review'
            },
            'approved': { 
                variant: 'success', 
                text: 'Approved'
            },
            'rejected': { 
                variant: 'danger', 
                text: 'Rejected'
            },
            'financed': { 
                variant: 'info', 
                text: 'Financed'
            },
            'under_review': {
                variant: 'primary',
                text: 'Under Review'
            },
            'documentation_required': {
                variant: 'warning',
                text: 'Docs Required'
            }
        };
        const statusInfo = statusMap[status] || { 
            variant: 'secondary', 
            text: status
        };
        
        return (
            <Badge bg={statusInfo.variant}>
                {statusInfo.text}
            </Badge>
        );
    };

    const getRoleInfo = () => {
        const roleMap = {
            'seller': { 
                title: 'Seller Dashboard', 
                description: 'Create contracts and projects, track approval status',
                color: '#007bff'
            },
            'admin': { 
                title: 'Admin Dashboard', 
                description: 'Approve contracts and projects, manage workflow',
                color: '#6f42c1'
            },
            'financier': { 
                title: 'Financier Dashboard', 
                description: 'View approved projects and provide financing',
                color: '#28a745'
            },
            'buyer': { 
                title: 'Buyer Dashboard', 
                description: 'View available projects and opportunities',
                color: '#fd7e14'
            }
        };
        return roleMap[currentRole];
    };

    const roleInfo = getRoleInfo();
    const visibleContracts = getVisibleContracts();
    const visibleProjects = getVisibleProjects();
    const pendingApprovals = getPendingApprovals();
    const relevantNotifications = getRelevantNotifications();

    return (
        <div className="workflow-dashboard">
            {/* Role Info Header */}
            {/* <div className="row mb-4">
                <div className="col-12">
                    <Card>
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <h4 className="mb-1" style={{ color: roleInfo.color }}>
                                        {roleInfo.title}
                                    </h4>
                                    {roleInfo.title === 'Seller Dashboard' && (
                                        <h4 className="mb-1" style={{ color: roleInfo.color }}>
                                            {roleInfo.title}
                                        </h4>
                                    )}
                                    <p className="text-muted mb-0">{roleInfo.description}</p>
                                </div>
                                <Badge bg="primary" className="fs-6">DEMO MODE</Badge>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div> */}

            {/* Notifications */}
            {relevantNotifications.length > 0 && (
                <div className="row mb-4">
                    <div className="col-12">
                        <Card>
                            <Card.Header className="border-0">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <i className="fas fa-bell text-warning fs-5"></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-1 text-dark fw-bold">Live Notifications</h5>
                                            <p className="mb-0 text-muted small">Real-time updates and alerts</p>
                                        </div>
                                    </div>
                                    <Badge bg="primary">
                                        {relevantNotifications.length} Active
                                    </Badge>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                {relevantNotifications.slice(0, 3).map((notification, index) => (
                                    <div key={notification.id} className="d-flex align-items-center mb-3" style={{
                                        borderBottom: index < relevantNotifications.slice(0, 3).length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                                        paddingBottom: index < relevantNotifications.slice(0, 3).length - 1 ? '15px' : '0'
                                    }}>
                                        <div className="me-3">
                                            <i className={`fas ${
                                                notification.type.includes('contract') ? 'fa-file-contract' :
                                                notification.type.includes('project') ? 'fa-project-diagram' :
                                                notification.type.includes('investment') ? 'fa-coins' :
                                                'fa-info-circle'
                                            } text-primary`}></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h6 className="mb-0 text-dark fw-bold">
                                                    {notification.title}
                                                </h6>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Badge bg={notification.priority === 'high' ? 'danger' : 
                                                             notification.priority === 'medium' ? 'warning' : 'info'}>
                                                        {notification.priority.toUpperCase()}
                                                    </Badge>
                                                    <small className="text-muted fw-medium">
                                                        {new Date(notification.createdAt).toLocaleTimeString()}
                                                    </small>
                                                </div>
                                            </div>
                                            <p className="text-muted mb-0 small">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {relevantNotifications.length > 3 && (
                                    <div className="text-center mt-3">
                                        <Button variant="outline-primary" size="sm">
                                            <i className="fas fa-eye me-2"></i>
                                            View All {relevantNotifications.length} Notifications
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            )}

            {/* Pending Approvals */}
            {pendingApprovals.length > 0 && (
                <div className="row mb-4">
                    <div className="col-12">
                        <Card>
                            <Card.Header className="border-0">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <i className="fas fa-clock text-warning fs-5"></i>
                                        </div>
                                        <div>
                                            <h5 className="mb-1 text-dark fw-bold">Pending Approvals</h5>
                                            <p className="mb-0 text-muted small">Items requiring your immediate attention</p>
                                        </div>
                                    </div>
                                    <Badge bg="warning">
                                        {pendingApprovals.length} Urgent
                                    </Badge>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Table responsive hover className="mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="border-0 py-4 px-4 fw-bold text-dark">
                                                <i className="fas fa-tag me-2 text-primary"></i>Type
                                            </th>
                                            <th className="border-0 py-4 px-4 fw-bold text-dark">
                                                <i className="fas fa-info-circle me-2 text-info"></i>Details
                                            </th>
                                            <th className="border-0 py-4 px-4 fw-bold text-dark">
                                                <i className="fas fa-dollar-sign me-2 text-success"></i>Value
                                            </th>
                                            <th className="border-0 py-4 px-4 fw-bold text-dark">
                                                <i className="fas fa-calendar me-2 text-warning"></i>Created
                                            </th>
                                            <th className="border-0 py-4 px-4 fw-bold text-dark">
                                                <i className="fas fa-cogs me-2 text-secondary"></i>Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingApprovals.map((pending, index) => (
                                            <tr key={`${pending.type}-${pending.item.id}`}>
                                                <td className="py-4 px-4">
                                                    <Badge bg={pending.type === 'contract' ? 'primary' : 
                                                             pending.type === 'project' ? 'info' : 'success'}>
                                                        <i className={`fas ${
                                                            pending.type === 'contract' ? 'fa-file-contract' :
                                                            pending.type === 'project' ? 'fa-project-diagram' : 'fa-money-bill-wave'
                                                        } me-2`}></i>
                                                        {pending.type === 'contract' ? 'Contract' : 
                                                         pending.type === 'project' ? 'Project' : 'Financing'}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="fw-bold text-dark mb-1">
                                                        {pending.type === 'contract' 
                                                            ? pending.item.customerName 
                                                            : `Project ${pending.item.id}`}
                                                    </div>
                                                    <small className="text-muted">
                                                        ID: {pending.item.contractId || pending.item.id}
                                                    </small>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="fw-bold text-success">
                                                        {pending.type === 'contract' 
                                                            ? pending.item.contractValue ? `₹${pending.item.contractValue.toLocaleString()}` : pending.item.natureOfDomain
                                                            : `$${pending.item.value}`}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-muted fw-medium">
                                                        {new Date(pending.item.createdAt).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="d-flex gap-2">
                                                        {pending.type === 'contract' && currentRole === 'admin' && (
                                                            <>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="success" 
                                                                    onClick={() => handleApproveContract(pending.item.id, pending.item.customerName)}
                                                                >
                                                                    <i className="fas fa-check me-1"></i>
                                                                    Approve
                                                                </Button>
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="danger"
                                                                    onClick={() => handleRejectContract(pending.item.id)}
                                                                >
                                                                    <i className="fas fa-times me-1"></i>
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        {pending.type === 'project' && currentRole === 'admin' && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="success"
                                                                onClick={() => handleApproveProject(pending.item.id)}
                                                            >
                                                                <i className="fas fa-check me-1"></i>
                                                                Approve
                                                            </Button>
                                                        )}
                                                        {pending.type === 'financing' && currentRole === 'financier' && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="primary"
                                                                onClick={() => handleFinanceProject(pending.item.id, pending.item.value)}
                                                            >
                                                                <i className="fas fa-coins me-1"></i>
                                                                Finance
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            )}

            {/* Contracts */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <Card className="h-100">
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-file-contract text-primary fs-5"></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-1 text-dark fw-bold">Contracts Portfolio</h5>
                                        <p className="mb-0 text-muted small">Active agreements and terms</p>
                                    </div>
                                </div>
                                <Badge bg="primary">
                                    {visibleContracts.length} Total
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {visibleContracts.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="text-muted mb-3">
                                        <i className="fas fa-file-contract fs-2"></i>
                                    </div>
                                    <p className="text-muted mb-0">No contracts visible for your role</p>
                                    <small className="text-muted">Create new contracts to get started</small>
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-user me-2 text-primary"></i>Customer
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-industry me-2 text-info"></i>Domain
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-chart-pie me-2 text-success"></i>Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleContracts.map((contract, index) => (
                                            <tr key={contract.id}>
                                                <td className="py-3 px-4">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3 text-primary">
                                                            <i className="fas fa-building"></i>
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">
                                                                {contract.customerName}
                                                            </div>
                                                            <small className="text-muted">
                                                                {contract.contractId || `CONT-${contract.id}`}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="fw-medium text-dark">
                                                        {contract.natureOfDomain}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">{getStatusBadge(contract.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </div>

                {/* Projects */}
                <div className="col-md-6">
                    <Card className="h-100">
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-project-diagram text-info fs-5"></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-1 text-dark fw-bold">Projects Hub</h5>
                                        <p className="mb-0 text-muted small">Active development initiatives</p>
                                    </div>
                                </div>
                                <Badge bg="info">
                                    {visibleProjects.length} Active
                                </Badge>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {visibleProjects.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="text-muted mb-3">
                                        <i className="fas fa-project-diagram fs-2"></i>
                                    </div>
                                    <p className="text-muted mb-0">No projects visible for your role</p>
                                    <small className="text-muted">Submit projects for review</small>
                                </div>
                            ) : (
                                <Table responsive hover className="mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-hashtag me-2 text-primary"></i>ID
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-dollar-sign me-2 text-success"></i>Value
                                            </th>
                                            <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                <i className="fas fa-chart-pie me-2 text-info"></i>Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleProjects.map((project, index) => (
                                            <tr key={project.id}>
                                                <td className="py-3 px-4">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3 text-info">
                                                            <i className="fas fa-rocket"></i>
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">
                                                                {project.id}
                                                            </div>
                                                            <small className="text-muted">
                                                                {new Date(project.createdAt).toLocaleDateString()}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="fw-bold text-success">
                                                        ${project.value}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">{getStatusBadge(project.status)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default WorkflowDashboard;