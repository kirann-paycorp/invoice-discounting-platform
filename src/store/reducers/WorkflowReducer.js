// Mock workflow reducer for demo
const initialWorkflowState = {
    currentRole: 'seller', // Default role
    contracts: [],
    projects: [],
    notifications: []
};

// Action types
export const WORKFLOW_ACTIONS = {
    SET_CURRENT_ROLE: 'SET_CURRENT_ROLE',
    CREATE_CONTRACT: 'CREATE_CONTRACT',
    APPROVE_CONTRACT: 'APPROVE_CONTRACT',
    REJECT_CONTRACT: 'REJECT_CONTRACT',
    CREATE_PROJECT: 'CREATE_PROJECT',
    APPROVE_PROJECT: 'APPROVE_PROJECT',
    REJECT_PROJECT: 'REJECT_PROJECT',
    FINANCE_PROJECT: 'FINANCE_PROJECT',
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS'
};

// Workflow reducer
export const workflowReducer = (state = initialWorkflowState, action) => {
    switch (action.type) {
        case WORKFLOW_ACTIONS.SET_CURRENT_ROLE:
            return {
                ...state,
                currentRole: action.payload
            };

        case WORKFLOW_ACTIONS.CREATE_CONTRACT:
            const newContract = {
                ...action.payload,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                sellerId: 'current-user',
                visibleTo: action.payload.status === 'approved' ? ['seller', 'admin', 'financier', 'buyer'] : ['seller', 'admin']
            };
            
            const contractNotifications = [];
            
            // Notification for seller
            contractNotifications.push({
                id: Date.now() + 1,
                type: action.payload.status === 'approved' ? 'contract_auto_approved' : 'contract_submitted',
                title: action.payload.status === 'approved' ? 'Contract Auto-Approved' : 'Contract Submitted',
                message: action.payload.status === 'approved' 
                    ? `Your contract for ${action.payload.customerName} (₹${action.payload.contractValue?.toLocaleString()}) has been automatically approved due to excellent risk profile.`
                    : `Your contract for ${action.payload.customerName} has been submitted for review. Contract ID: ${action.payload.contractId}`,
                priority: action.payload.status === 'approved' ? 'high' : 'medium',
                forRoles: ['seller'],
                createdAt: new Date().toISOString(),
                read: false
            });
            
            // Notification for admin if manual review needed
            if (action.payload.status !== 'approved') {
                contractNotifications.push({
                    id: Date.now() + 2,
                    type: 'contract_review_needed',
                    title: 'Contract Review Required',
                    message: `New contract from seller requires review: ${action.payload.customerName} - ₹${action.payload.contractValue?.toLocaleString()} (Risk Score: ${action.payload.riskScore}/100)`,
                    priority: action.payload.riskScore < 50 ? 'high' : 'medium',
                    forRoles: ['admin'],
                    createdAt: new Date().toISOString(),
                    read: false
                });
            } else {
                // Notification for financiers about new opportunity
                contractNotifications.push({
                    id: Date.now() + 3,
                    type: 'investment_opportunity',
                    title: 'New Investment Opportunity',
                    message: `High-quality contract available: ${action.payload.customerName} - ₹${action.payload.contractValue?.toLocaleString()} at ${action.payload.interestRate}% interest`,
                    priority: 'medium',
                    forRoles: ['financier', 'buyer'],
                    createdAt: new Date().toISOString(),
                    read: false
                });
            }

            return {
                ...state,
                contracts: [...state.contracts, newContract],
                notifications: [...state.notifications, ...contractNotifications]
            };

        case WORKFLOW_ACTIONS.APPROVE_CONTRACT:
            const approvedContract = state.contracts.find(c => c.id === action.payload.contractId);
            const approvalNotifications = [
                {
                    id: Date.now() + 1,
                    type: 'contract_approved',
                    title: 'Contract Approved',
                    message: `Great news! Your contract for ${approvedContract?.customerName} has been approved and is now available to investors. Expected funding timeline: 24-48 hours.`,
                    priority: 'high',
                    forRoles: ['seller'],
                    createdAt: new Date().toISOString(),
                    read: false
                },
                {
                    id: Date.now() + 2,
                    type: 'investment_opportunity',
                    title: 'New Investment Opportunity',
                    message: `Approved contract available for financing: ${approvedContract?.customerName} - ₹${approvedContract?.contractValue?.toLocaleString()} at ${approvedContract?.interestRate}% annually. Credit Score: ${approvedContract?.creditScore}`,
                    priority: 'medium',
                    forRoles: ['financier', 'buyer'],
                    createdAt: new Date().toISOString(),
                    read: false
                }
            ];

            return {
                ...state,
                contracts: state.contracts.map(contract =>
                    contract.id === action.payload.contractId
                        ? {
                            ...contract,
                            status: 'approved',
                            approvedBy: state.currentRole,
                            approvedAt: new Date().toISOString(),
                            visibleTo: ['seller', 'admin', 'financier', 'buyer'],
                            estimatedFundingTime: '24-48 hours'
                        }
                        : contract
                ),
                notifications: [...state.notifications, ...approvalNotifications]
            };

        case WORKFLOW_ACTIONS.REJECT_CONTRACT:
            return {
                ...state,
                contracts: state.contracts.map(contract =>
                    contract.id === action.payload.contractId
                        ? {
                            ...contract,
                            status: 'rejected',
                            rejectedBy: state.currentRole,
                            rejectedAt: new Date().toISOString(),
                            rejectionReason: action.payload.reason
                        }
                        : contract
                ),
                notifications: [...state.notifications, {
                    id: Date.now(),
                    type: 'contract_rejected',
                    message: `Contract rejected: ${action.payload.reason}`,
                    forRoles: ['seller'],
                    createdAt: new Date().toISOString()
                }]
            };

        case WORKFLOW_ACTIONS.CREATE_PROJECT:
            const newProject = {
                ...action.payload,
                id: Date.now(),
                createdAt: new Date().toISOString(),
                status: 'pending_approval',
                sellerId: 'current-user',
                visibleTo: ['seller', 'admin'],
                estimatedProcessingTime: '2-3 business days',
                requiredDocuments: ['Invoice Copy', 'Purchase Order', 'Delivery Receipt'],
                discountingRate: Math.max(8, Math.min(15, parseFloat(action.payload.invoiceValue) / 100000 + 10))
            };
            
            const projectNotifications = [
                {
                    id: Date.now() + 1,
                    type: 'project_submitted',
                    title: 'Project Submitted Successfully',
                    message: `Your invoice discounting project for ${action.payload.companyName} (₹${action.payload.invoiceValue?.toLocaleString()}) has been submitted. Expected processing: 2-3 business days.`,
                    priority: 'medium',
                    forRoles: ['seller'],
                    createdAt: new Date().toISOString(),
                    read: false
                },
                {
                    id: Date.now() + 2,
                    type: 'project_review_needed',
                    title: 'New Project for Review',
                    message: `Invoice discounting application requires review: ${action.payload.companyName} - ₹${action.payload.invoiceValue?.toLocaleString()}. Payment terms: ${action.payload.paymentTerms} days.`,
                    priority: parseFloat(action.payload.invoiceValue) > 1000000 ? 'high' : 'medium',
                    forRoles: ['admin'],
                    createdAt: new Date().toISOString(),
                    read: false
                }
            ];

            return {
                ...state,
                projects: [...state.projects, newProject],
                notifications: [...state.notifications, ...projectNotifications]
            };

        case WORKFLOW_ACTIONS.APPROVE_PROJECT:
            return {
                ...state,
                projects: state.projects.map(project =>
                    project.id === action.payload.projectId
                        ? {
                            ...project,
                            status: 'approved',
                            approvedBy: state.currentRole,
                            approvedAt: new Date().toISOString(),
                            visibleTo: ['seller', 'admin', 'financier', 'buyer']
                        }
                        : project
                ),
                notifications: [...state.notifications, {
                    id: Date.now(),
                    type: 'project_approved',
                    message: `Project approved and available for financing`,
                    forRoles: ['seller', 'financier', 'buyer'],
                    createdAt: new Date().toISOString()
                }]
            };

        case WORKFLOW_ACTIONS.REJECT_PROJECT:
            return {
                ...state,
                projects: state.projects.map(project =>
                    project.id === action.payload.projectId
                        ? {
                            ...project,
                            status: 'rejected',
                            rejectedBy: state.currentRole,
                            rejectedAt: new Date().toISOString(),
                            rejectionReason: action.payload.reason
                        }
                        : project
                ),
                notifications: [...state.notifications, {
                    id: Date.now(),
                    type: 'project_rejected',
                    message: `Project rejected: ${action.payload.reason}`,
                    forRoles: ['seller'],
                    createdAt: new Date().toISOString()
                }]
            };

        case WORKFLOW_ACTIONS.FINANCE_PROJECT:
            return {
                ...state,
                projects: state.projects.map(project =>
                    project.id === action.payload.projectId
                        ? {
                            ...project,
                            status: 'financed',
                            financedBy: state.currentRole,
                            financedAt: new Date().toISOString(),
                            financingAmount: action.payload.amount,
                            financingTerms: action.payload.terms
                        }
                        : project
                ),
                notifications: [...state.notifications, {
                    id: Date.now(),
                    type: 'project_financed',
                    message: `Project financed by ${state.currentRole}`,
                    forRoles: ['seller', 'admin'],
                    createdAt: new Date().toISOString()
                }]
            };

        case WORKFLOW_ACTIONS.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };

        case WORKFLOW_ACTIONS.CLEAR_NOTIFICATIONS:
            return {
                ...state,
                notifications: state.notifications.filter(n => 
                    !action.payload.includes(n.id)
                )
            };

        default:
            return state;
    }
};

// Action creators
export const setCurrentRole = (role) => ({
    type: WORKFLOW_ACTIONS.SET_CURRENT_ROLE,
    payload: role
});

export const createContract = (contractData) => ({
    type: WORKFLOW_ACTIONS.CREATE_CONTRACT,
    payload: contractData
});

export const approveContract = (contractId, customerName) => ({
    type: WORKFLOW_ACTIONS.APPROVE_CONTRACT,
    payload: { contractId, customerName }
});

export const rejectContract = (contractId, reason) => ({
    type: WORKFLOW_ACTIONS.REJECT_CONTRACT,
    payload: { contractId, reason }
});

export const createProject = (projectData) => ({
    type: WORKFLOW_ACTIONS.CREATE_PROJECT,
    payload: projectData
});

export const approveProject = (projectId) => ({
    type: WORKFLOW_ACTIONS.APPROVE_PROJECT,
    payload: { projectId }
});

export const rejectProject = (projectId, reason) => ({
    type: WORKFLOW_ACTIONS.REJECT_PROJECT,
    payload: { projectId, reason }
});

export const financeProject = (projectId, amount, terms) => ({
    type: WORKFLOW_ACTIONS.FINANCE_PROJECT,
    payload: { projectId, amount, terms }
});

export const addNotification = (notification) => ({
    type: WORKFLOW_ACTIONS.ADD_NOTIFICATION,
    payload: notification
});

export const clearNotifications = (notificationIds) => ({
    type: WORKFLOW_ACTIONS.CLEAR_NOTIFICATIONS,
    payload: notificationIds
});