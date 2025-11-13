import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import { Dropdown } from 'react-bootstrap';

///Images
import small from "./../../../assets/images/profile/small/pic1.jpg";
import avt1 from "./../../../assets/images/avatar/1.jpg";
import avt2 from "./../../../assets/images/avatar/2.jpg";
import avt3 from "./../../../assets/images/avatar/3.jpg";
import avt4 from "./../../../assets/images/avatar/4.jpg";
import avt5 from "./../../../assets/images/avatar/5.jpg";
import avt6 from "./../../../assets/images/avatar/6.jpg";


//Import Components
import { ThemeContext } from "../../../context/ThemeContext";
import CustomerContractForm from './CustomerContractForm';
import AddProjectForm from './AddProjectForm';
import WorkflowDashboard from './WorkflowDashboard';
import { getAvailableActions, getRoleCapabilities } from '../../utils/permissions';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUserRole } from '../../../services/UserDatabase';
import { setCurrentRole } from '../../../store/actions/WorkflowActions';

// Import role-specific dashboard components
import SellerDashboard from './SellerDashboard';
import FinancierDashboard from './FinancierDashboard';
import AdminDashboard from './AdminDashboard';
import BuyerDashboard from './BuyerDashboard';

const Home = () => {
	const { changeBackground } = useContext(ThemeContext);
	const { currentRole } = useSelector(state => state.workflow);
	const dispatch = useDispatch();
	const [showContractForm, setShowContractForm] = useState(false);
	const [showProjectForm, setShowProjectForm] = useState(false);
	
	// Get the actual current user role from localStorage
	const actualUserRole = getCurrentUserRole();
	
	// Sync the Redux state with the actual user role if they don't match
	useEffect(() => {
		if (actualUserRole && actualUserRole !== currentRole) {
			dispatch(setCurrentRole(actualUserRole));
		}
	}, [actualUserRole, currentRole, dispatch]);
	
	// Use the actual user role for permissions
	const effectiveRole = actualUserRole || currentRole;

	useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);

	// Render role-specific dashboard
	const renderRoleDashboard = () => {
		switch (effectiveRole) {
			case 'seller':
				return <SellerDashboard />;
			case 'financier':
				return <FinancierDashboard />;
			case 'admin':
				return <AdminDashboard />;
			case 'buyer':
				return <BuyerDashboard />;
			default:
				return <SellerDashboard />; // Default fallback
		}
	};

	return (
		<>
			{/* Role-specific Dashboard */}
			{renderRoleDashboard()}

			{/* Workflow Dashboard */}
			{/* <div className="row mb-4">
				<div className="col-xl-12">
					<WorkflowDashboard />
				</div>
			</div> */}

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
	)
}

export default Home;