import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { setCurrentRole } from '../../../store/reducers/WorkflowReducer';

const RoleSelector = () => {
    const dispatch = useDispatch();
    const currentRole = useSelector(state => state.workflow.currentRole);
    
    const roles = [
        { value: 'seller', label: 'Seller', icon: 'fas fa-user-tie', color: '#007bff' },
        { value: 'admin', label: 'Admin', icon: 'fas fa-user-shield', color: '#6f42c1' },
        { value: 'financier', label: 'Financier', icon: 'fas fa-coins', color: '#28a745' },
        { value: 'buyer', label: 'Buyer', icon: 'fas fa-shopping-cart', color: '#fd7e14' }
    ];

    const currentRoleData = roles.find(role => role.value === currentRole);

    const handleRoleChange = (role) => {
        dispatch(setCurrentRole(role));
    };

    return (
        <div className="role-selector">
            <Dropdown>
                <Dropdown.Toggle variant="outline-primary" id="role-dropdown" className="d-flex align-items-center">
                    <i className={`${currentRoleData.icon} me-2`} style={{ color: currentRoleData.color }}></i>
                    <span>Role: {currentRoleData.label}</span>
                    <span className="badge bg-primary ms-2">DEMO</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Header>Switch Demo Role</Dropdown.Header>
                    {roles.map((role) => (
                        <Dropdown.Item
                            key={role.value}
                            onClick={() => handleRoleChange(role.value)}
                            active={currentRole === role.value}
                        >
                            <i className={`${role.icon} me-2`} style={{ color: role.color }}></i>
                            {role.label}
                            {currentRole === role.value && (
                                <i className="fas fa-check text-success ms-auto"></i>
                            )}
                        </Dropdown.Item>
                    ))}
                    <Dropdown.Divider />
                    <Dropdown.Item disabled>
                        <small className="text-muted">
                            <i className="fas fa-info-circle me-1"></i>
                            Demo mode - switch roles to see different views
                        </small>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default RoleSelector;