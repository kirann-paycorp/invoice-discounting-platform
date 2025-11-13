// Role-based menu configuration for different user types
export const getRoleBasedMenu = (userRole) => {
    const baseMenu = {
        // Common dashboard items for all roles
        dashboard: {
            title: 'Dashboard',
            classsChange: 'mm-collapse',
            iconStyle: <i className="fas fa-home" />,
            content: [
                {
                    title: 'Dashboard',
                    to: 'dashboard',
                },
            ],
        },
    };

    const roleMenus = {
        seller: [
            {
                ...baseMenu.dashboard,
                content: [
                    {
                        title: 'Dashboard',
                        to: 'dashboard',
                    },
                    {
                        title: 'My Wallet',
                        to: 'wallet',
                    },
                    {
                        title: 'My Invoices',
                        to: 'invoices-list',
                    },
                    // {
                    //     title: 'Create Invoice',
                    //     to: 'create-invoices',
                    // },
                    {
                        title: 'Transaction History',
                        to: 'transaction-details',
                    },
                ]
            },
            {
                title: 'Contracts & Projects',
                classsChange: 'mm-collapse',
                iconStyle: <i className="fas fa-file-contract" />,
                content: [
                    {
                        title: 'My Contracts',
                        to: 'my-contracts',
                    },
                    {
                        title: 'Active Projects',
                        to: 'my-projects',
                    },
                    {
                        title: 'Project History',
                        to: 'project-history',
                    },
                ]
            },
            {
                title: 'Profile',
                iconStyle: <i className="fas fa-user" />,
                to: 'app-profile',
            },
        ],

        financier: [
            {
                ...baseMenu.dashboard,
                content: [
                    {
                        title: 'Dashboard',
                        to: 'dashboard',
                    },
                    {
                        title: 'Portfolio Overview',
                        to: 'portfolio-overview',
                    },
                    {
                        title: 'Risk Analytics',
                        to: 'risk-analytics',
                    },
                ]
            },
            {
                title: 'Investment Management',
                classsChange: 'mm-collapse',
                iconStyle: <i className="fas fa-chart-line" />,
                content: [
                    {
                        title: 'Available Projects',
                        to: 'available-projects',
                    },
                    {
                        title: 'Active Investments',
                        to: 'active-investments',
                    },
                    {
                        title: 'Pending Reviews',
                        to: 'pending-reviews',
                    },
                    {
                        title: 'Investment History',
                        to: 'investment-history',
                    },
                ]
            },
            {
                title: 'Financial Reports',
                classsChange: 'mm-collapse',
                iconStyle: <i className="fas fa-file-alt" />,
                content: [
                    {
                        title: 'Returns Analysis',
                        to: 'returns-analysis',
                    },
                    {
                        title: 'Risk Reports',
                        to: 'risk-reports',
                    },
                    {
                        title: 'Performance Metrics',
                        to: 'performance-metrics',
                    },
                ]
            },
            {
                title: 'Profile',
                iconStyle: <i className="fas fa-user" />,
                to: 'app-profile',
            },
        ],

        admin: [
            {
                ...baseMenu.dashboard,
                content: [
                    {
                        title: 'Admin Dashboard',
                        to: 'dashboard',
                    },
                    {
                        title: 'System Overview',
                        to: 'system-overview',
                    },
                    {
                        title: 'Platform Analytics',
                        to: 'platform-analytics',
                    },
                ]
            },
            {
                title: 'User Management',
                classsChange: 'mm-collapse',
                iconStyle: <i className="fas fa-users" />,
                content: [
                    {
                        title: 'All Users',
                        to: 'all-users',
                    },
                    {
                        title: 'Sellers',
                        to: 'sellers-list',
                    },
                    {
                        title: 'Financiers',
                        to: 'financiers-list',
                    },
                    {
                        title: 'Buyers',
                        to: 'buyers-list',
                    },
                ]
            },
            {
                title: 'Platform Management',
                classsChange: 'mm-collapse',
                iconStyle: <i className="fas fa-cogs" />,
                content: [
                    {
                        title: 'All Contracts',
                        to: 'all-contracts',
                    },
                    {
                        title: 'All Projects',
                        to: 'all-projects',
                    },
                    {
                        title: 'Pending Approvals',
                        to: 'pending-approvals',
                    },
                    {
                        title: 'System Settings',
                        to: 'system-settings',
                    },
                ]
            },
            {
                title: 'Reports & Analytics',
                classsChange: 'mm-collapse',
                iconStyle: <i className="fas fa-chart-bar" />,
                content: [
                    {
                        title: 'Platform Statistics',
                        to: 'platform-stats',
                    },
                    {
                        title: 'Transaction Reports',
                        to: 'transaction-reports',
                    },
                    {
                        title: 'User Activity',
                        to: 'user-activity',
                    },
                    {
                        title: 'System Health',
                        to: 'system-health',
                    },
                ]
            },
            {
                title: 'Profile',
                iconStyle: <i className="fas fa-user" />,
                to: 'app-profile',
            },
        ],

        buyer: [
            {
                ...baseMenu.dashboard,
                content: [
                    {
                        title: 'Dashboard',
                        to: 'dashboard',
                    },
                    {
                        title: 'Purchase Overview',
                        to: 'purchase-overview',
                    },
                    {
                        title: 'Supplier Relationships',
                        to: 'supplier-relationships',
                    },
                ]
            },
            {
                title: 'Purchase Management',
                classsChange: 'mm-collapse',
                iconStyle: <i className="fas fa-shopping-cart" />,
                content: [
                    {
                        title: 'Purchase Orders',
                        to: 'purchase-orders',
                    },
                    {
                        title: 'Supplier Invoices',
                        to: 'supplier-invoices',
                    },
                    {
                        title: 'Delivery Tracking',
                        to: 'delivery-tracking',
                    },
                    {
                        title: 'Payment Schedule',
                        to: 'payment-schedule',
                    },
                ]
            },
            {
                title: 'Supplier Relations',
                classsChange: 'mm-collapse',
                iconStyle: <i className="fas fa-handshake" />,
                content: [
                    {
                        title: 'Supplier Directory',
                        to: 'supplier-directory',
                    },
                    {
                        title: 'Contract Management',
                        to: 'supplier-contracts',
                    },
                    {
                        title: 'Performance Reviews',
                        to: 'supplier-performance',
                    },
                ]
            },
            {
                title: 'Profile',
                iconStyle: <i className="fas fa-user" />,
                to: 'app-profile',
            },
        ],
    };

    return roleMenus[userRole] || roleMenus.seller; // Default to seller if role not found
};

// Helper function to get user role from localStorage
export const getCurrentUserRole = () => {
    try {
        const userDetails = localStorage.getItem('userDetails');
        if (userDetails) {
            const parsedDetails = JSON.parse(userDetails);
            return parsedDetails.role || 'seller';
        }
    } catch (error) {
        console.error('Error parsing user details:', error);
    }
    return 'seller'; // Default role
};

// Helper function to get user profile from localStorage
export const getCurrentUserProfile = () => {
    try {
        const userDetails = localStorage.getItem('userDetails');
        if (userDetails) {
            const parsedDetails = JSON.parse(userDetails);
            return parsedDetails.profile || null;
        }
    } catch (error) {
        console.error('Error parsing user details:', error);
    }
    return null;
};