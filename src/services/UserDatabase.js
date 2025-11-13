// Hardcoded user database for demo purposes
export const USER_DATABASE = {
    // Seller - Creates contracts and projects
    'seller@invome.com': {
        password: 'seller123',
        role: 'seller',
        profile: {
            id: 'USER_001',
            name: 'John Smith',
            email: 'seller@invome.com',
            company: 'Smith Trading Corp',
            avatar: './headshot-1.webp',
            permissions: [
                'create_contract',
                'create_project', 
                'view_own_contracts',
                'view_own_projects',
                'upload_documents'
            ]
        }
    },

    // Financier - Reviews and funds projects
    'financier@invome.com': {
        password: 'financier123',
        role: 'financier',
        profile: {
            id: 'USER_002',
            name: 'Sarah Johnson',
            email: 'financier@invome.com',
            company: 'Global Finance Partners',
            avatar: '/images/avatar/2.jpg',
            permissions: [
                'view_all_projects',
                'approve_projects',
                'reject_projects',
                'view_financial_reports',
                'manage_funding'
            ]
        }
    },

    // Admin - System administrator with full access
    'admin@invome.com': {
        password: 'admin123',
        role: 'admin',
        profile: {
            id: 'USER_003',
            name: 'Michael Chen',
            email: 'admin@invome.com',
            company: 'Invome Technologies',
            avatar: '/images/avatar/3.jpg',
            permissions: [
                'view_all_data',
                'manage_users',
                'system_settings',
                'view_analytics',
                'approve_all',
                'reject_all',
                'export_data'
            ]
        }
    },

    // Buyer - Views and manages purchase orders
    'buyer@invome.com': {
        password: 'buyer123',
        role: 'buyer',
        profile: {
            id: 'USER_004',
            name: 'Emma Williams',
            email: 'buyer@invome.com',
            company: 'Retail Solutions Ltd',
            avatar: '/images/avatar/4.jpg',
            permissions: [
                'view_purchase_orders',
                'create_purchase_orders',
                'approve_invoices',
                'view_supplier_contracts'
            ]
        }
    }
};

// Demo credentials for easy reference
export const DEMO_CREDENTIALS = {
    seller: {
        email: 'seller@invome.com',
        password: 'seller123',
        description: 'Creates contracts and invoice projects'
    },
    financier: {
        email: 'financier@invome.com', 
        password: 'financier123',
        description: 'Reviews and funds invoice discounting projects'
    },
    admin: {
        email: 'admin@invome.com',
        password: 'admin123', 
        description: 'System administrator with full access'
    },
    buyer: {
        email: 'buyer@invome.com',
        password: 'buyer123',
        description: 'Manages purchase orders and supplier relationships'
    }
};

/**
 * Validates user credentials against hardcoded database
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} User data if valid, null if invalid
 */
export function validateCredentials(email, password) {
    const user = USER_DATABASE[email.toLowerCase()];
    
    if (!user) {
        return { error: 'EMAIL_NOT_FOUND', message: 'Email not found' };
    }
    
    if (user.password !== password) {
        return { error: 'INVALID_PASSWORD', message: 'Invalid password' };
    }
    
    // Return successful login data
    return {
        success: true,
        user: {
            email: email.toLowerCase(),
            role: user.role,
            profile: user.profile,
            permissions: user.profile.permissions,
            token: generateToken(user.profile.id),
            expiresIn: 3600 // 1 hour
        }
    };
}

/**
 * Generates a simple token for demo purposes
 * @param {string} userId - User ID
 * @returns {string} Generated token
 */
function generateToken(userId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${userId}_${timestamp}_${random}`;
}

/**
 * Gets user by email for profile operations
 * @param {string} email - User email
 * @returns {Object|null} User profile if found
 */
export function getUserByEmail(email) {
    const user = USER_DATABASE[email.toLowerCase()];
    return user ? user.profile : null;
}

/**
 * Checks if user has specific permission
 * @param {string} email - User email
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
export function hasPermission(email, permission) {
    const user = USER_DATABASE[email.toLowerCase()];
    if (!user) return false;
    
    return user.profile.permissions.includes(permission);
}

/**
 * Gets the current user's role from localStorage
 * @returns {string} User role (seller, financier, admin, buyer)
 */
export function getCurrentUserRole() {
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
}