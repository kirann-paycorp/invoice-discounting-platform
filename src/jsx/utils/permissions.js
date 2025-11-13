// Role-based permission system for invoice discounting platform

export const PERMISSIONS = {
    // Contract permissions
    CREATE_CONTRACT: 'create_contract',
    VIEW_CONTRACT: 'view_contract',
    APPROVE_CONTRACT: 'approve_contract',
    REJECT_CONTRACT: 'reject_contract',
    EDIT_CONTRACT: 'edit_contract',
    DELETE_CONTRACT: 'delete_contract',
    
    // Project permissions
    CREATE_PROJECT: 'create_project',
    VIEW_PROJECT: 'view_project',
    APPROVE_PROJECT: 'approve_project',
    REJECT_PROJECT: 'reject_project',
    FINANCE_PROJECT: 'finance_project',
    
    // Financial permissions
    VIEW_FINANCIAL_DETAILS: 'view_financial_details',
    SET_DISCOUNT_RATES: 'set_discount_rates',
    PROCESS_PAYMENTS: 'process_payments',
    VIEW_REPORTS: 'view_reports',
    
    // Admin permissions
    MANAGE_USERS: 'manage_users',
    SYSTEM_CONFIG: 'system_config',
    AUDIT_LOGS: 'audit_logs'
};

export const ROLE_PERMISSIONS = {
    seller: [
        PERMISSIONS.CREATE_CONTRACT,
        PERMISSIONS.VIEW_CONTRACT,
        PERMISSIONS.EDIT_CONTRACT,
        PERMISSIONS.CREATE_PROJECT,
        PERMISSIONS.VIEW_PROJECT,
        PERMISSIONS.VIEW_FINANCIAL_DETAILS
    ],
    admin: [
        PERMISSIONS.VIEW_CONTRACT,
        PERMISSIONS.APPROVE_CONTRACT,
        PERMISSIONS.REJECT_CONTRACT,
        PERMISSIONS.VIEW_PROJECT,
        PERMISSIONS.APPROVE_PROJECT,
        PERMISSIONS.REJECT_PROJECT,
        PERMISSIONS.VIEW_FINANCIAL_DETAILS,
        PERMISSIONS.SET_DISCOUNT_RATES,
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.AUDIT_LOGS
    ],
    financier: [
        PERMISSIONS.VIEW_CONTRACT,
        PERMISSIONS.VIEW_PROJECT,
        PERMISSIONS.FINANCE_PROJECT,
        PERMISSIONS.VIEW_FINANCIAL_DETAILS,
        PERMISSIONS.PROCESS_PAYMENTS,
        PERMISSIONS.VIEW_REPORTS
    ],
    buyer: [
        PERMISSIONS.VIEW_CONTRACT,
        PERMISSIONS.VIEW_PROJECT,
        PERMISSIONS.VIEW_FINANCIAL_DETAILS
    ]
};

export const hasPermission = (userRole, permission) => {
    return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const canPerformAction = (userRole, action) => {
    switch (action) {
        case 'create_contract':
            return hasPermission(userRole, PERMISSIONS.CREATE_CONTRACT);
        case 'approve_contract':
            return hasPermission(userRole, PERMISSIONS.APPROVE_CONTRACT);
        case 'finance_project':
            return hasPermission(userRole, PERMISSIONS.FINANCE_PROJECT);
        case 'view_financials':
            return hasPermission(userRole, PERMISSIONS.VIEW_FINANCIAL_DETAILS);
        default:
            return false;
    }
};

export const getAvailableActions = (userRole) => {
    const actions = [];
    
    if (hasPermission(userRole, PERMISSIONS.CREATE_CONTRACT)) {
        actions.push({
            key: 'create_contract',
            label: 'Create Contract',
            icon: 'fas fa-plus',
            color: 'primary',
            description: 'Submit new customer contract for approval'
        });
    }
    
    if (hasPermission(userRole, PERMISSIONS.CREATE_PROJECT)) {
        actions.push({
            key: 'create_project',
            label: 'Create Project',
            icon: 'fas fa-project-diagram',
            color: 'success',
            description: 'Submit invoice for discounting'
        });
    }
    
    if (hasPermission(userRole, PERMISSIONS.APPROVE_CONTRACT)) {
        actions.push({
            key: 'review_contracts',
            label: 'Review Contracts',
            icon: 'fas fa-clipboard-check',
            color: 'warning',
            description: 'Approve or reject pending contracts'
        });
    }
    
    if (hasPermission(userRole, PERMISSIONS.FINANCE_PROJECT)) {
        actions.push({
            key: 'finance_projects',
            label: 'Finance Projects',
            icon: 'fas fa-money-bill-wave',
            color: 'info',
            description: 'Provide funding for approved projects'
        });
    }
    
    if (hasPermission(userRole, PERMISSIONS.VIEW_REPORTS)) {
        actions.push({
            key: 'view_reports',
            label: 'View Reports',
            icon: 'fas fa-chart-bar',
            color: 'secondary',
            description: 'Access detailed analytics and reports'
        });
    }
    
    return actions;
};

export const getRoleCapabilities = (userRole) => {
    const capabilities = {
        seller: {
            title: 'Seller Capabilities',
            description: 'Create and manage contracts and projects',
            maxContractValue: 50000000, // ₹5 Crore
            maxProjectsPerMonth: 20,
            requiresApproval: true,
            canViewOwnData: true,
            canViewMarketplace: false
        },
        admin: {
            title: 'Admin Capabilities',
            description: 'Full system access and approval authority',
            maxContractValue: Infinity,
            maxProjectsPerMonth: Infinity,
            requiresApproval: false,
            canViewOwnData: true,
            canViewMarketplace: true,
            canApprove: true,
            canReject: true
        },
        financier: {
            title: 'Financier Capabilities',
            description: 'Invest in approved contracts and projects',
            maxInvestmentAmount: 100000000, // ₹10 Crore
            canViewOwnData: true,
            canViewMarketplace: true,
            canProvideFinancing: true,
            requiresKYC: true
        },
        buyer: {
            title: 'Buyer Capabilities',
            description: 'Purchase approved invoices and contracts',
            maxPurchaseAmount: 20000000, // ₹2 Crore
            canViewOwnData: true,
            canViewMarketplace: true,
            requiresKYC: true
        }
    };
    
    return capabilities[userRole] || {};
};

export const validateRoleAction = (userRole, action, data = {}) => {
    const capabilities = getRoleCapabilities(userRole);
    const errors = [];
    
    // Check basic permission
    if (!canPerformAction(userRole, action)) {
        errors.push(`Role '${userRole}' does not have permission to perform '${action}'`);
        return { isValid: false, errors };
    }
    
    // Validate specific constraints
    switch (action) {
        case 'create_contract':
            if (data.contractValue > capabilities.maxContractValue) {
                errors.push(`Contract value exceeds maximum limit of ₹${capabilities.maxContractValue.toLocaleString()}`);
            }
            break;
            
        case 'finance_project':
            if (data.amount > capabilities.maxInvestmentAmount) {
                errors.push(`Investment amount exceeds maximum limit of ₹${capabilities.maxInvestmentAmount.toLocaleString()}`);
            }
            if (capabilities.requiresKYC && !data.kycVerified) {
                errors.push('KYC verification required for financing operations');
            }
            break;
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        warnings: []
    };
};