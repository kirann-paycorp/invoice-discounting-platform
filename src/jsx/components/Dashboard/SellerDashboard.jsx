import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Table, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';
import CustomerContractForm from './CustomerContractForm';
import ContractManager from './ContractManager';
import AddProjectForm from './AddProjectForm';

// Modern styling and animations
const modernStyles = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .modern-table-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(13, 110, 253, 0.15);
    transition: all 0.3s ease;
  }
  
  .modern-button-hover {
    transition: all 0.3s ease;
  }
  
  .modern-button-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
  
  .pulse-animation {
    animation: pulse 2s infinite;
  }
  
  .gradient-border {
    position: relative;
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  .gradient-border::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    margin: -2px;
    border-radius: inherit;
    background: linear-gradient(145deg, #0d6efd, #6f42c1, #20c997);
    opacity: 0.3;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = modernStyles;
  document.head.appendChild(styleSheet);
}

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showContractForm, setShowContractForm] = useState(false);
    const [showContractManager, setShowContractManager] = useState(false); // Hide by default, show traditional buttons
    const [showClientForm, setShowClientForm] = useState(false);
    const [showProjectDetails, setShowProjectDetails] = useState(false);
    const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
    
    // State for pending invoices filter
    const [pendingInvoiceFilter, setPendingInvoiceFilter] = useState('buyer');
    
    // Pending invoice data based on filter
    const getPendingInvoiceData = () => {
        switch(pendingInvoiceFilter) {
            case 'buyer':
                return {
                    amount: '₹8.2M',
                    count: 5,
                    avgDiscount: '7.8%',
                    description: 'Buyer Approval'
                };
            case 'financier':
                return {
                    amount: '₹12.8M',
                    count: 8,
                    avgDiscount: '6.2%',
                    description: 'Financier Approval'
                };
            case 'future':
                return {
                    amount: '₹6.5M',
                    count: 3,
                    avgDiscount: '8.1%',
                    description: 'Future Invoices'
                };
            default:
                return {
                    amount: '₹8.2M',
                    count: 5,
                    avgDiscount: '7.8%',
                    description: 'Buyer Approval'
                };
        }
    };
    
    // Initialize default clients data
    const defaultClients = [
        {
            id: 'CLIENT-001',
            name: 'TechCorp Solutions Ltd.',
            email: 'contact@techcorp.com',
            projects: 3,
            totalValue: '₹8.2M',
            status: 'Active',
            lastActivity: '2 hours ago',
            contactPerson: 'Rajesh Kumar',
            phone: '9876543210',
            addedDate: '2024-10-15'
        },
        {
            id: 'CLIENT-002',
            name: 'RetailMax India Pvt Ltd',
            email: 'projects@retailmax.in',
            projects: 2,
            totalValue: '₹5.4M',
            status: 'Active',
            lastActivity: '1 day ago',
            contactPerson: 'Priya Sharma',
            phone: '9876543211',
            addedDate: '2024-10-10'
        },
        {
            id: 'CLIENT-003',
            name: 'StartupHub Technologies',
            email: 'dev@startuphub.com',
            projects: 1,
            totalValue: '₹950K',
            status: 'Active',
            lastActivity: '3 days ago',
            contactPerson: 'Amit Singh',
            phone: '9876543212',
            addedDate: '2024-10-05'
        }
    ];

    // Clients state management with localStorage
    const [activeClients, setActiveClients] = useState(() => {
        // Initialize from localStorage or use default data
        const savedClients = localStorage.getItem('activeClients');
        if (savedClients) {
            try {
                const parsedClients = JSON.parse(savedClients);
                return parsedClients.length > 0 ? parsedClients : defaultClients;
            } catch (error) {
                console.error('Error parsing saved clients:', error);
                // If there's an error, save default data and return it
                localStorage.setItem('activeClients', JSON.stringify(defaultClients));
                return defaultClients;
            }
        } else {
            // First time - save default data to localStorage
            localStorage.setItem('activeClients', JSON.stringify(defaultClients));
            return defaultClients;
        }
    });

    // Function to add new client (now simplified since logic moved to event handler)
    const addNewClient = (newClientData) => {
        // This function is kept for backward compatibility
        // Main logic is now in the event handler to avoid stale closures
        console.log('addNewClient called with:', newClientData);
    };

    // Save clients to localStorage whenever activeClients changes
    useEffect(() => {
        localStorage.setItem('activeClients', JSON.stringify(activeClients));
        console.log('Clients saved to localStorage:', activeClients.length);
    }, [activeClients]);

    // Listen for new client additions from AddClient page
    useEffect(() => {
        const handleNewClientAdded = (event) => {
            console.log('🚀 SellerDashboard: Client added event received:', event.detail);
            if (event.detail && event.detail.clientData) {
                const newClientData = event.detail.clientData;
                
                // Create new client object
                const newClient = {
                    id: `CLIENT-${String(Date.now()).slice(-3)}`, // Use timestamp for unique ID
                    name: newClientData.buyerName,
                    email: newClientData.email,
                    projects: 0,
                    totalValue: '₹0',
                    status: 'Active',
                    lastActivity: 'Just added',
                    contactPerson: newClientData.contactPersonName,
                    phone: newClientData.phoneNumber,
                    addedDate: new Date().toISOString().split('T')[0],
                    additionalData: newClientData
                };
                
                console.log('🔥 SellerDashboard: Adding new client:', newClient);
                
                // Update state using functional update to avoid stale closure
                setActiveClients(prevClients => {
                    const updatedClients = [newClient, ...prevClients];
                    console.log('💾 SellerDashboard: Updated clients array:', updatedClients.length);
                    return updatedClients;
                });
            }
        };

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            // Removed dropdown functionality
        };

        console.log('🎯 SellerDashboard: Event listener attached');
        window.addEventListener('clientAdded', handleNewClientAdded);
        
        return () => {
            console.log('🗑️ SellerDashboard: Event listener removed');
            window.removeEventListener('clientAdded', handleNewClientAdded);
        };
    }, []); // Remove the activeClients dependency

    // Listen for contract submissions and decisions
    useEffect(() => {
        const handleContractSubmitted = (event) => {
            console.log('🔄 Contract submitted event received:', event.detail);
            if (event.detail && event.detail.contractData) {
                const contract = event.detail.contractData;
                const newContract = {
                    id: contract.contractCode || contract.id,
                    client: contract.buyerDetails?.name || 'Unknown Client',
                    project: contract.contractTitle,
                    value: `₹${(parseFloat(contract.contractValue) / 100000).toFixed(1)}L`,
                    status: contract.contractStatus,
                    startDate: contract.startDate,
                    endDate: contract.endDate,
                    contractType: contract.contractType,
                    submittedOn: contract.submittedForApprovalOn
                };
                
                setActiveContracts(prevContracts => [newContract, ...prevContracts]);
            }
        };

        const handleContractDecision = (event) => {
            console.log('✅ Contract decision event received:', event.detail);
            if (event.detail && event.detail.contractData) {
                const updatedContract = event.detail.contractData;
                const contractUpdate = {
                    id: updatedContract.contractCode || updatedContract.id,
                    client: updatedContract.buyerDetails?.name || 'Unknown Client',
                    project: updatedContract.contractTitle,
                    value: `₹${(parseFloat(updatedContract.contractValue) / 100000).toFixed(1)}L`,
                    status: updatedContract.contractStatus,
                    startDate: updatedContract.startDate,
                    endDate: updatedContract.endDate,
                    contractType: updatedContract.contractType,
                    submittedOn: updatedContract.submittedForApprovalOn,
                    buyerDecisionOn: updatedContract.buyerDecisionOn,
                    buyerComments: updatedContract.buyerComments
                };
                
                // Update the contract in the list
                setActiveContracts(prevContracts => 
                    prevContracts.map(contract => 
                        contract.id === contractUpdate.id ? contractUpdate : contract
                    )
                );
                
                // Show notification
                const decision = event.detail.decision;
                const notification = `Contract "${updatedContract.contractTitle}" has been ${decision.toLowerCase()} by the buyer!`;
                
                // Modern notification system
                setTimeout(() => {
                    const notificationType = decision === 'Approved' ? 'success' : 'error';
                    showNotification(
                        'Contract Update',
                        notification,
                        notificationType
                    );
                }, 1000);
            }
        };

        const handleProjectSubmitted = (event) => {
            console.log('🚀 Project submitted event received:', event.detail);
            if (event.detail && event.detail.projectData) {
                const project = event.detail.projectData;
                const newProject = {
                    id: project.projectCode || project.id,
                    name: project.projectTitle,
                    client: project.buyerName || 'Unknown Client',
                    value: `₹${parseFloat(project.projectValue).toLocaleString('en-IN')}`,
                    progress: 0,
                    status: project.status === 'Pending Approval' ? 'Pending Approval' : 
                           project.status === 'Draft' ? 'Draft' : 'In Progress',
                    deadline: project.endDate,
                    invoiceStatus: 'Ready for Funding',
                    discountRate: 8.0,
                    fundedAmount: '₹0',
                    milestones: project.milestones || [],
                    projectData: project
                };
                
                setCurrentProjects(prevProjects => [newProject, ...prevProjects]);
            }
        };

        const handleProjectApproval = (event) => {
            console.log('✅ Project approval event received:', event.detail);
            if (event.detail && event.detail.projectData) {
                const approvedProject = event.detail.projectData;
                
                setCurrentProjects(prevProjects => 
                    prevProjects.map(project => 
                        project.id === approvedProject.id ? {
                            ...project,
                            status: approvedProject.status === 'Approved' ? 'In Progress' : project.status,
                            progress: approvedProject.status === 'Approved' ? 10 : project.progress
                        } : project
                    )
                );
                
                // Show notification
                if (approvedProject.status === 'Approved') {
                    setTimeout(() => {
                        showNotification(
                            'Project Approved!',
                            `Project "${approvedProject.projectTitle}" has been approved by the buyer!`,
                            'success'
                        );
                    }, 1000);
                }
            }
        };

        window.addEventListener('contractSubmitted', handleContractSubmitted);
        window.addEventListener('contractDecision', handleContractDecision);
        window.addEventListener('projectSubmitted', handleProjectSubmitted);
        window.addEventListener('projectApproval', handleProjectApproval);
        
        return () => {
            window.removeEventListener('contractSubmitted', handleContractSubmitted);
            window.removeEventListener('contractDecision', handleContractDecision);
            window.removeEventListener('projectSubmitted', handleProjectSubmitted);
            window.removeEventListener('projectApproval', handleProjectApproval);
        };
    }, []);

    // Active Contracts state management
    const [activeContracts, setActiveContracts] = useState(() => {
        // Load contracts from localStorage
        const savedContracts = localStorage.getItem('contracts');
        if (savedContracts) {
            try {
                const parsedContracts = JSON.parse(savedContracts);
                return parsedContracts.map(contract => ({
                    id: contract.contractCode || contract.id,
                    client: contract.buyerDetails?.name || 'Unknown Client',
                    project: contract.contractTitle,
                    value: `₹${(parseFloat(contract.contractValue) / 100000).toFixed(1)}L`,
                    status: contract.contractStatus,
                    startDate: contract.startDate,
                    endDate: contract.endDate,
                    contractType: contract.contractType,
                    submittedOn: contract.submittedForApprovalOn
                }));
            } catch (error) {
                console.error('Error loading contracts:', error);
                return [];
            }
        }
        return [];
    });
    
    const [financialMetrics] = useState({
        activeProjects: { count: 8, value: '₹52.5M', growth: '+15%', period: 'this quarter' },
        fundedAmount: { total: '₹44.3M', thisMonth: '₹12.1M', growth: '+23%' },
        avgProcessingTime: { hours: "₹4.3M", sla: '+33%', performance: 'Expected in next 7 days' }
    });
    
    // Get dynamic pending invoice data
    const currentPendingData = getPendingInvoiceData();

    // Active Projects state management
    const [currentProjects, setCurrentProjects] = useState(() => {
        // Load projects from localStorage
        const savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
            try {
                const parsedProjects = JSON.parse(savedProjects);
                return parsedProjects.map(project => ({
                    id: project.projectCode || project.id,
                    name: project.projectTitle,
                    client: project.buyerName || 'Unknown Client',
                    value: `₹${parseFloat(project.projectValue).toLocaleString('en-IN')}`,
                    progress: 0, // New projects start at 0%
                    status: project.status === 'Pending Approval' ? 'Pending Approval' : 
                           project.status === 'Draft' ? 'Draft' : 
                           project.status === 'Active' ? 'In Progress' : 'Completed',
                    deadline: project.endDate,
                    invoiceStatus: 'Ready for Funding',
                    discountRate: 8.0,
                    fundedAmount: '₹0',
                    milestones: project.milestones || [],
                    projectData: project
                }));
            } catch (error) {
                console.error('Error loading projects:', error);
                return [];
            }
        }
        return [];
    });

    const [recentActivities] = useState([
        {
            type: 'pending',
            title: 'Contract Submitted for Review',
            description: 'Healthcare Management System contract submitted and waiting for admin approval',
            time: '30 minutes ago',
            status: 'pending_approval',
            contractId: 'CONT-2024-008'
        },
        {
            type: 'funding',
            title: 'Invoice Funded Successfully',
            description: 'TechCorp Infrastructure milestone payment funded at 7.5% discount rate',
            amount: '₹612,500',
            time: '2 hours ago',
            status: 'completed'
        },
        {
            type: 'pending',
            title: 'Contract Under Review',
            description: 'Banking Software contract is being reviewed by admin team - risk assessment in progress',
            time: '4 hours ago',
            status: 'pending_approval',
            contractId: 'CONT-2024-007'
        },
        {
            type: 'approval',
            title: 'Contract Approved',
            description: 'E-commerce Platform contract approved by admin - ready for project milestones',
            time: '1 day ago',
            status: 'approved'
        },
        {
            type: 'maturity',
            title: 'Payment Received',
            description: 'Mobile App Development final payment received from buyer',
            amount: '₹950,000',
            time: '2 days ago',
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
            case 'pending': return 'fa-clock';
            default: return 'fa-info-circle';
        }
    };

    // Handle view project details
    const handleViewProjectDetails = (project) => {
        // Enhanced project with realistic milestone data
        const enhancedProject = {
            ...project,
            milestones: project.milestones?.length ? project.milestones.map((milestone, index) => ({
                ...milestone,
                id: `${project.id}-M${index + 1}`,
                invoiceId: null,
                invoiceStatus: 'Not Invoiced',
                completedOn: null,
                invoicedAmount: 0,
                // Simulate some completed milestones for demo
                status: index === 0 ? 'Completed' : 
                       index === 1 && project.progress > 50 ? 'In Progress' : 'Pending'
            })) : [
                {
                    id: `${project.id}-M1`,
                    name: 'Project Initiation',
                    percentage: 20,
                    targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                    description: 'Initial setup and planning phase',
                    status: 'Completed',
                    invoiceId: null,
                    invoiceStatus: 'Not Invoiced',
                    completedOn: new Date().toISOString().slice(0, 10),
                    invoicedAmount: 0
                },
                {
                    id: `${project.id}-M2`,
                    name: 'Development Phase',
                    percentage: 50,
                    targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                    description: 'Core development and testing',
                    status: project.progress > 50 ? 'In Progress' : 'Pending',
                    invoiceId: null,
                    invoiceStatus: 'Not Invoiced',
                    completedOn: null,
                    invoicedAmount: 0
                },
                {
                    id: `${project.id}-M3`,
                    name: 'Final Delivery',
                    percentage: 30,
                    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                    description: 'Final delivery and handover',
                    status: 'Pending',
                    invoiceId: null,
                    invoiceStatus: 'Not Invoiced',
                    completedOn: null,
                    invoicedAmount: 0
                }
            ]
        };
        
        setSelectedProjectDetails(enhancedProject);
        setShowProjectDetails(true);
    };

    // Handle milestone status updates and invoice creation
    const handleMilestoneInvoice = (project, milestone) => {
        // Mark milestone as invoiced
        const updatedProject = {
            ...project,
            milestones: project.milestones.map(m => 
                m.id === milestone.id 
                    ? { 
                        ...m, 
                        invoiceId: `INV-${Date.now()}`,
                        invoiceStatus: 'Invoiced',
                        invoicedAmount: (parseFloat(project.value.replace(/[₹,]/g, '')) * m.percentage / 100)
                      }
                    : m
            )
        };

        // Update project in localStorage
        const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        const updatedProjects = savedProjects.map(p => 
            p.projectCode === project.id ? { 
                ...p, 
                milestones: updatedProject.milestones.map(m => ({
                    name: m.name,
                    percentage: m.percentage,
                    targetDate: m.targetDate,
                    description: m.description
                }))
            } : p
        );
        localStorage.setItem('projects', JSON.stringify(updatedProjects));

        // Update current projects state
        setCurrentProjects(currentProjects.map(p => 
            p.id === project.id ? updatedProject : p
        ));

        // Update selected project details
        setSelectedProjectDetails(updatedProject);

        // Navigate to invoice creation
        setShowProjectDetails(false);
        navigate('/create-invoices', { 
            state: { 
                projectData: project,
                milestoneData: milestone,
                invoiceType: 'milestone'
            } 
        });
    };

    // Handle project progress update
    const handleUpdateProgress = (project) => {
        // Calculate progress based on completed milestones
        const completedMilestones = project.milestones?.filter(m => m.status === 'Completed') || [];
        const totalProgress = completedMilestones.reduce((sum, m) => sum + m.percentage, 0);
        
        const updatedProject = {
            ...project,
            progress: Math.min(totalProgress, 100)
        };

        // Update current projects state
        setCurrentProjects(currentProjects.map(p => 
            p.id === project.id ? updatedProject : p
        ));

        setSelectedProjectDetails(updatedProject);
    };

    return (
        <>
            {/* Professional Fintech Header */}
            <Row>
                <Col xl={12}>
                    <Card className="mb-4">
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-project-diagram text-primary fs-2"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-dark mb-1 fw-bold">Seller Project Hub</h3>
                                        <p className="text-muted mb-0 fs-6">Project management, invoice discounting & funding opportunities</p>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="d-flex align-items-center text-muted mb-2">
                                        <div className="d-flex align-items-center me-4">
                                            <i className="fas fa-circle text-success me-2" style={{fontSize: '8px'}}></i>
                                            <small className="fw-medium">Projects Active</small>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-chart-trending-up text-success me-2"></i>
                                            <small className="fw-medium">High Performance</small>
                                        </div>
                                    </div>
                                    <small className="text-muted">Live data • Updated real-time</small>
                                    {/* <div className="mt-2">
                                        <Button 
                                            variant="outline-info" 
                                            size="sm"
                                            onClick={() => navigate('/buyer-dashboard')}
                                        >
                                            <i className="fas fa-exchange-alt me-1"></i>
                                            Test Buyer View
                                        </Button>
                                    </div> */}
                                </div>
                            </div>
                        </Card.Header>
                    </Card>
                </Col>
            </Row>

            {/* Financial KPI Cards */}
            <Row className="mb-4">
                <Col xl={3} md={6}>
                    <Card className="overflow-hidden">
                        <Card.Header className="border-0">
                            <div className="d-flex">
                                <span className="mt-2">
                                    <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.812 34.64L3.2 39.6C2.594 40.054 1.784 40.128 1.106 39.788C0.428 39.45 0 38.758 0 38V2C0 0.896 0.896 0 2 0H30C31.104 0 32 0.896 32 2V38C32 38.758 31.572 39.45 30.894 39.788C30.216 40.128 29.406 40.054 28.8 39.6L22.188 34.64L17.414 39.414C16.634 40.196 15.366 40.196 14.586 39.414L9.812 34.64ZM28 34V4H4V34L8.8 30.4C9.596 29.802 10.71 29.882 11.414 30.586L16 35.172L20.586 30.586C21.29 29.882 22.404 29.802 23.2 30.4L28 34ZM14 20H18C19.104 20 20 19.104 20 18C20 16.896 19.104 16 18 16H14C12.896 16 12 16.896 12 18C12 19.104 12.896 20 14 20ZM10 12H22C23.104 12 24 11.104 24 10C24 8.896 23.104 8 22 8H10C8.896 8 8 8.896 8 10C8 11.104 8.896 12 10 12Z" fill="#717579" />
                                    </svg>
                                </span>
                                <div className="invoices">
                                    <h4>{financialMetrics.activeProjects.count}</h4>
                                    <span>Active Projects</span>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-6 fw-medium">{financialMetrics.activeProjects.value}</span>
                                    <Badge bg="success" className="fs-7">
                                        {financialMetrics.activeProjects.growth}
                                    </Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="overflow-hidden">
                        <Card.Header className="border-0">
                            <div className="d-flex">
                                <span className="mt-1">
                                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.812 48.64L11.2 53.6C10.594 54.054 9.78401 54.128 9.10602 53.788C8.42802 53.45 8.00002 52.758 8.00002 52V16C8.00002 14.896 8.89602 14 10 14H38C39.104 14 40 14.896 40 16V52C40 52.758 39.572 53.45 38.894 53.788C38.216 54.128 37.406 54.054 36.8 53.6L30.188 48.64L25.414 53.414C24.634 54.196 23.366 54.196 22.586 53.414L17.812 48.64ZM36 48V18H12V48L16.8 44.4C17.596 43.802 18.71 43.882 19.414 44.586L24 49.172L28.586 44.586C29.29 43.882 30.404 43.802 31.2 44.4L36 48ZM22 34H26C27.104 34 28 33.104 28 32C28 30.896 27.104 30 26 30H22C20.896 30 20 30.896 20 32C20 33.104 20.896 34 22 34ZM18 26H30C31.104 26 32 25.104 32 24C32 22.896 31.104 22 30 22H18C16.896 22 16 22.896 16 24C16 25.104 16.896 26 18 26Z" fill="#44814E" />
                                        <circle cx="43.5" cy="14.5" r="12.5" fill="#FD5353" stroke="white" strokeWidth="4" />
                                    </svg>
                                </span>
                                <div className="invoices">
                                    <h4>{currentPendingData.amount}</h4>
                                    <span>Pending Invoices</span>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-6 fw-medium">{currentPendingData.count} invoices</span>
                                    <Badge bg="warning" className="fs-7">
                                        {currentPendingData.avgDiscount}
                                    </Badge>
                                </div>
                                
                                {/* Filter Tabs - Compact Design */}
                                <div className="mt-2">
                                    <div className="d-flex justify-content-between">
                                        <small 
                                            className={`px-2 py-1 rounded cursor-pointer fw-bold ${
                                                pendingInvoiceFilter === 'buyer' ? 'bg-primary text-white' : 'text-primary'
                                            }`}
                                            style={{ cursor: 'pointer', fontSize: '13px' }}
                                            onClick={() => setPendingInvoiceFilter('buyer')}
                                        >
                                            Buyer
                                        </small>
                                        <small 
                                            className={`px-2 py-1 rounded cursor-pointer fw-bold ${
                                                pendingInvoiceFilter === 'financier' ? 'bg-primary text-white' : 'text-primary'
                                            }`}
                                            style={{ cursor: 'pointer', fontSize: '13px' }}
                                            onClick={() => setPendingInvoiceFilter('financier')}
                                        >
                                            Financier
                                        </small>
                                        <small 
                                            className={`px-2 py-1 rounded cursor-pointer fw-bold ${
                                                pendingInvoiceFilter === 'future' ? 'bg-primary text-white' : 'text-primary'
                                            }`}
                                            style={{ cursor: 'pointer', fontSize: '13px' }}
                                            onClick={() => setPendingInvoiceFilter('future')}
                                        >
                                            Future
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="overflow-hidden">
                        <Card.Header className="border-0">
                            <div className="d-flex">
                                <span className="mt-1">
                                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.812 48.64L11.2 53.6C10.594 54.054 9.78401 54.128 9.10602 53.788C8.42802 53.45 8.00002 52.758 8.00002 52V16C8.00002 14.896 8.89602 14 10 14H38C39.104 14 40 14.896 40 16V52C40 52.758 39.572 53.45 38.894 53.788C38.216 54.128 37.406 54.054 36.8 53.6L30.188 48.64L25.414 53.414C24.634 54.196 23.366 54.196 22.586 53.414L17.812 48.64ZM36 48V18H12V48L16.8 44.4C17.596 43.802 18.71 43.882 19.414 44.586L24 49.172L28.586 44.586C29.29 43.882 30.404 43.802 31.2 44.4L36 48ZM22 34H26C27.104 34 28 33.104 28 32C28 30.896 27.104 30 26 30H22C20.896 30 20 30.896 20 32C20 33.104 20.896 34 22 34ZM18 26H30C31.104 26 32 25.104 32 24C32 22.896 31.104 22 30 22H18C16.896 22 16 22.896 16 24C16 25.104 16.896 26 18 26Z" fill="#44814E" />
                                        <circle cx="43.5" cy="14.5" r="12.5" fill="#09BD3C" stroke="white" strokeWidth="4" />
                                    </svg>
                                </span>
                                <div className="invoices">
                                    <h4>{financialMetrics.fundedAmount.total}</h4>
                                    <span>Funded Amount</span>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-6 fw-medium">{financialMetrics.fundedAmount.thisMonth}</span>
                                    <Badge bg="success" className="fs-7">
                                        {financialMetrics.fundedAmount.growth}
                                    </Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6}>
                    <Card className="overflow-hidden">
                        <Card.Header className="border-0">
                            <div className="d-flex">
                                <span className="mt-1">
                                    <svg width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M17.812 48.64L11.2 53.6C10.594 54.054 9.784 54.128 9.106 53.788C8.428 53.45 8 52.758 8 52V16C8 14.896 8.896 14 10 14H38C39.104 14 40 14.896 40 16V52C40 52.758 39.572 53.45 38.894 53.788C38.216 54.128 37.406 54.054 36.8 53.6L30.188 48.64L25.414 53.414C24.634 54.196 23.366 54.196 22.586 53.414L17.812 48.64ZM36 48V18H12V48L16.8 44.4C17.596 43.802 18.71 43.882 19.414 44.586L24 49.172L28.586 44.586C29.29 43.882 30.404 43.802 31.2 44.4L36 48ZM22 34H26C27.104 34 28 33.104 28 32C28 30.896 27.104 30 26 30H22C20.896 30 20 30.896 20 32C20 33.104 20.896 34 22 34ZM18 26H30C31.104 26 32 25.104 32 24C32 22.896 31.104 22 30 22H18C16.896 22 16 22.896 16 24C16 25.104 16.896 26 18 26Z" fill="#44814E" />
                                        <circle cx="43.5" cy="14.5" r="12.5" fill="#FFAA2B" stroke="white" strokeWidth="4" />
                                    </svg>
                                </span>
                                <div className="invoices">
                                    <h4>{financialMetrics.avgProcessingTime.hours}</h4>
                                    <span>Upcoming Settlements</span>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fs-6 fw-medium">{financialMetrics.avgProcessingTime.performance}</span>
                                    <Badge bg="info" className="fs-7">
                                        SLA: {financialMetrics.avgProcessingTime.sla}
                                    </Badge>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Active Clients Module */}
            <Row className="mb-4">
                <Col xl={6}>
                    <Card>
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-users text-success fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-dark fw-bold">
                                            Active Clients 
                                            <Badge bg="primary" className="ms-2 fs-7">
                                                {activeClients.length}
                                            </Badge>
                                        </h4>
                                        <p className="text-muted mb-0">Manage your client relationships</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-success" 
                                        size="sm"
                                        onClick={() => navigate('/add-client')}
                                    >
                                        <i className="fas fa-plus me-1"></i>
                                        Add Client
                                    </Button>
                                    <Button variant="outline-primary" size="sm">
                                        <i className="fas fa-eye me-1"></i>
                                        See All
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="px-4 py-3">
                                {activeClients.length === 0 ? (
                                    <div className="text-center py-4">
                                        <i className="fas fa-users text-muted fs-1 mb-3"></i>
                                        <p className="text-muted mb-3">No clients added yet</p>
                                        <Button 
                                            variant="outline-success" 
                                            size="sm"
                                            onClick={() => navigate('/add-client')}
                                        >
                                            <i className="fas fa-plus me-1"></i>
                                            Add Your First Client
                                        </Button>
                                    </div>
                                ) : (
                                    activeClients.slice(0, 3).map((client, index) => (
                                    <div key={client.id} className="d-flex align-items-center justify-content-between py-3" style={{
                                        borderBottom: index < activeClients.slice(0, 3).length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                                    }}>
                                        <div className="d-flex align-items-center">
                                            <div className="me-3">
                                                <div className="rounded-circle bg-success-light d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                                    <i className="fas fa-building text-success"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{client.name}</div>
                                                <small className="text-muted">{client.email}</small>
                                                {client.lastActivity === 'Just added' && (
                                                    <div className="mt-1">
                                                        <Badge bg="success" className="fs-7">
                                                            <i className="fas fa-sparkles me-1"></i>
                                                            New Client
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold text-success">{client.totalValue}</div>
                                            <small className="text-muted">{client.projects} projects • {client.lastActivity}</small>
                                        </div>
                                    </div>
                                    ))
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={6}>
                    <Card>
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-file-contract text-info fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-dark fw-bold">Active Contracts</h4>
                                        <p className="text-muted mb-0">Track your contract agreements</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-info" 
                                        size="sm" 
                                        onClick={() => navigate('/create-contract')}
                                    >
                                        <i className="fas fa-plus me-1"></i>
                                        Create Contract
                                    </Button>
                                    <Button variant="outline-primary" size="sm" onClick={() => setShowContractManager(true)}>
                                        <i className="fas fa-eye me-1"></i>
                                        See All
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="px-4 py-3">
                                {activeContracts.slice(0, 3).map((contract, index) => (
                                    <div key={index} className="d-flex align-items-center justify-content-between py-3" style={{
                                        borderBottom: index < 2 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                                    }}>
                                        <div className="d-flex align-items-center">
                                            <div className="me-3">
                                                <div className="rounded-circle bg-info-light d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                                    <i className="fas fa-file-alt text-info"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{contract.id}</div>
                                                <small className="text-muted">{contract.client} • {contract.project}</small>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold text-success">{contract.value}</div>
                                            <Badge bg={
                                                contract.status === 'Approved' ? 'success' : 
                                                contract.status === 'Pending' ? 'warning' : 
                                                contract.status === 'Draft' ? 'secondary' :
                                                contract.status === 'Rejected' ? 'danger' :
                                                contract.status === 'Modification Requested' ? 'info' : 'secondary'
                                            }>
                                                {contract.status}
                                            </Badge>
                                            {contract.status === 'Pending' && (
                                                <div className="mt-1">
                                                    <small className="text-muted">
                                                        <i className="fas fa-clock me-1"></i>
                                                        Awaiting buyer approval
                                                    </small>
                                                </div>
                                            )}
                                            {contract.status === 'Approved' && (
                                                <div className="mt-1">
                                                    <small className="text-success">
                                                        <i className="fas fa-check-circle me-1"></i>
                                                        Ready for invoicing
                                                    </small>
                                                </div>
                                            )}
                                            {contract.status === 'Rejected' && (
                                                <div className="mt-1">
                                                    <small className="text-danger">
                                                        <i className="fas fa-times-circle me-1"></i>
                                                        Contract rejected
                                                    </small>
                                                </div>
                                            )}
                                            {contract.status === 'Modification Requested' && (
                                                <div className="mt-1">
                                                    <small className="text-info">
                                                        <i className="fas fa-edit me-1"></i>
                                                        Modifications needed
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Active Projects and Active Invoices */}
            <Row className="mb-4">
                <Col xl={8}>
                    <Card>
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-project-diagram text-primary fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-dark fw-bold">Active Projects</h4>
                                        <p className="text-muted mb-0">Manage your project portfolio</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="outline-success" 
                                        size="sm" 
                                        onClick={() => navigate('/create-project')}
                                    >
                                        <i className="fas fa-project-diagram me-1"></i>
                                        Create Project
                                    </Button>
                                    <Button variant="outline-secondary" size="sm">
                                        <i className="fas fa-eye me-1"></i>
                                        See All
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead>
                                    <tr>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark">
                                            <i className="fas fa-project-diagram me-2 text-primary"></i>
                                            Project Details
                                        </th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark">
                                            <i className="fas fa-building me-2 text-info"></i>
                                            Client
                                        </th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark">
                                            <i className="fas fa-rupee-sign me-2 text-success"></i>
                                            Value
                                        </th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark">
                                            <i className="fas fa-chart-line me-2 text-warning"></i>
                                            Progress
                                        </th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark">
                                            <i className="fas fa-flag me-2 text-secondary"></i>
                                            Status
                                        </th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark">
                                            <i className="fas fa-money-bill-wave me-2 text-primary"></i>
                                            Funding
                                        </th>
                                        <th className="border-0 py-4 px-4 fw-bold text-dark">
                                            <i className="fas fa-cogs me-2 text-secondary"></i>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProjects.map((project, index) => (
                                        <tr key={index}>
                                            <td className="py-4 px-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3">
                                                        <i className="fas fa-code text-primary fs-4"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{project.name}</div>
                                                        <small className="text-muted fw-medium">{project.id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3">
                                                        <i className="fas fa-building text-info"></i>
                                                    </div>
                                                    <div className="fw-bold text-dark">{project.client}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="me-2">
                                                        <i className="fas fa-rupee-sign text-success"></i>
                                                    </div>
                                                    <span className="fw-bold text-success fs-6">{project.value}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="progress flex-grow-1 me-3" style={{ height: '10px' }}>
                                                        <div 
                                                            className="progress-bar" 
                                                            style={{
                                                                width: `${project.progress}%`,
                                                                background: project.progress >= 80 ? '#28a745' :
                                                                          project.progress >= 50 ? '#ffc107' : '#0d6efd'
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="fw-bold text-dark" style={{minWidth: '45px'}}>{project.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge bg={getStatusVariant(project.status)}>
                                                    {project.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="d-flex flex-column">
                                                    <Badge bg={getInvoiceStatusVariant(project.invoiceStatus)} className="mb-2">
                                                        {project.invoiceStatus}
                                                    </Badge>
                                                    <div className="d-flex align-items-center">
                                                        <i className="fas fa-percentage me-1 text-muted" style={{fontSize: '10px'}}></i>
                                                        <small className="text-muted fw-medium">{project.discountRate}% rate</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="d-flex flex-column gap-2">
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => handleViewProjectDetails(project)}
                                                    >
                                                        <i className="fas fa-eye me-1"></i>
                                                        View Details
                                                    </Button>
                                                    {project.status === 'In Progress' && (
                                                        <Button 
                                                            variant="outline-success" 
                                                            size="sm"
                                                            onClick={() => navigate('/create-invoices', { 
                                                                state: { projectData: project } 
                                                            })}
                                                        >
                                                            <i className="fas fa-file-invoice me-1"></i>
                                                            Quick Invoice
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
                </Col>

                <Col xl={4}>
                    <Card>
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-file-invoice text-warning fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-dark fw-bold">Active Invoices</h4>
                                        <p className="text-muted mb-0">Track your invoice status</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => navigate('/invoices-list')}
                                >
                                    <i className="fas fa-eye me-1"></i>
                                    See All
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body style={{maxHeight: '400px', overflowY: 'auto'}}>
                            {[
                                {
                                    id: 'INV-2024-001',
                                    client: 'TechCorp Solutions',
                                    amount: '₹612,500',
                                    status: 'Funded',
                                    dueDate: '2024-12-15',
                                    discountRate: '7.5%',
                                    fundedAmount: '₹566,562'
                                },
                                {
                                    id: 'INV-2024-002',
                                    client: 'RetailMax India',
                                    amount: '₹450,000',
                                    status: 'Pending',
                                    dueDate: '2024-11-30',
                                    discountRate: '8.1%',
                                    fundedAmount: '₹413,550'
                                },
                                {
                                    id: 'INV-2024-003',
                                    client: 'StartupHub Tech',
                                    amount: '₹285,000',
                                    status: 'Approved',
                                    dueDate: '2024-11-25',
                                    discountRate: '7.2%',
                                    fundedAmount: '₹264,480'
                                },
                                {
                                    id: 'INV-2024-004',
                                    client: 'FinanceFirst Ltd',
                                    amount: '₹750,000',
                                    status: 'Under Review',
                                    dueDate: '2024-12-10',
                                    discountRate: '8.5%',
                                    fundedAmount: '₹0'
                                },
                                {
                                    id: 'INV-2024-005',
                                    client: 'DevSolutions Inc',
                                    amount: '₹320,000',
                                    status: 'Funded',
                                    dueDate: '2024-11-28',
                                    discountRate: '7.8%',
                                    fundedAmount: '₹295,040'
                                }
                            ].map((invoice, index) => (
                                <div key={index} className="d-flex align-items-start mb-3 pb-3" style={{
                                    borderBottom: index < 4 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                                }}>
                                    <div className="me-3 mt-1">
                                        <div className="rounded-circle bg-warning-light d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                                            <i className="fas fa-file-invoice text-warning"></i>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="fw-bold text-dark">{invoice.id}</div>
                                            <Badge 
                                                bg={invoice.status === 'Funded' ? 'success' : 
                                                   invoice.status === 'Approved' ? 'info' : 
                                                   invoice.status === 'Pending' ? 'warning' : 'secondary'}
                                            >
                                                {invoice.status}
                                            </Badge>
                                        </div>
                                        <div className="mb-2">
                                            <div className="text-muted small">{invoice.client}</div>
                                            <div className="fw-bold text-success">{invoice.amount}</div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex gap-3">
                                                <small className="text-muted">
                                                    <i className="fas fa-calendar me-1"></i>
                                                    {invoice.dueDate}
                                                </small>
                                                <small className="text-info">
                                                    <i className="fas fa-percentage me-1"></i>
                                                    {invoice.discountRate}
                                                </small>
                                            </div>
                                            {invoice.fundedAmount !== '₹0' && (
                                                <small className="fw-bold text-primary">
                                                    {invoice.fundedAmount}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Recent Activities Section */}
            <Row className="mb-4">
                <Col xl={12}>
                    <Card>
                        <Card.Header className="border-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <i className="fas fa-bell text-warning fs-5"></i>
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-dark fw-bold">Recent Activities</h4>
                                        <p className="text-muted mb-0">Real-time project and business updates</p>
                                    </div>
                                </div>
                                <Badge bg="success">Live</Badge>
                            </div>
                        </Card.Header>
                        <Card.Body style={{maxHeight: '400px', overflowY: 'auto'}}>
                            {recentActivities.map((activity, index) => (
                                <div key={index} className="d-flex align-items-start mb-3 pb-3" style={{
                                    borderBottom: index < recentActivities.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                                }}>
                                    <div className="me-3 mt-1">
                                        <i className={`fas ${getActivityIcon(activity.type)} text-primary`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="fw-bold text-dark mb-1">{activity.title}</div>
                                            <small className="text-muted fw-medium">{activity.time}</small>
                                        </div>
                                        <p className="text-muted mb-2" style={{lineHeight: '1.4'}}>{activity.description}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex gap-2 align-items-center">
                                                {activity.amount && (
                                                    <span className="fw-bold text-success">
                                                        {activity.amount}
                                                    </span>
                                                )}
                                                {activity.contractId && (
                                                    <span className="fw-medium text-primary small">
                                                        {activity.contractId}
                                                    </span>
                                                )}
                                            </div>
                                            <Badge 
                                                bg={activity.status === 'completed' ? 'success' : 
                                                   activity.status === 'approved' ? 'info' : 
                                                   activity.status === 'pending_approval' ? 'warning' :
                                                   activity.status === 'received' ? 'success' : 'secondary'}
                                            >
                                                {activity.status === 'pending_approval' ? 'PENDING' : 
                                                 activity.status === 'completed' ? 'COMPLETED' :
                                                 activity.status === 'approved' ? 'APPROVED' :
                                                 activity.status === 'received' ? 'RECEIVED' :
                                                 activity.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Contract Management Section */}
            {showContractManager && (
                <Row className="mb-4">
                    <Col xl={12}>
                        <Card>
                            <Card.Header className="border-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <i className="fas fa-file-contract text-primary fs-5"></i>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-dark fw-bold">Contract Management Hub</h4>
                                            <p className="text-muted mb-0">Manage all your contracts and agreements</p>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="outline-danger" 
                                        size="sm"
                                        onClick={() => setShowContractManager(false)}
                                    >
                                        <i className="fas fa-times me-1"></i>
                                        Close
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <ContractManager projects={currentProjects} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Project Details Modal */}
            <Modal 
                show={showProjectDetails} 
                onHide={() => setShowProjectDetails(false)}
                size="xl"
                backdrop="static"
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="d-flex align-items-center">
                        <i className="fas fa-project-diagram text-primary me-3 fs-4"></i>
                        <div>
                            <h4 className="mb-1 text-dark fw-bold">Project Details</h4>
                            <p className="text-muted mb-0 fs-6">
                                {selectedProjectDetails?.name || 'Project Management Hub'}
                            </p>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="py-4">
                    {selectedProjectDetails && (
                        <>
                            {/* Project Overview Section */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Card className="h-100 border-primary">
                                        <Card.Header className="bg-#09BD3C text-white">
                                            <h6 className="mb-0 fw-bold">
                                                <i className="fas fa-info-circle me-2"></i>
                                                Project Information
                                            </h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="mb-3">
                                                <strong className="text-dark">Project ID:</strong>
                                                <div className="text-muted">{selectedProjectDetails.id}</div>
                                            </div>
                                            <div className="mb-3">
                                                <strong className="text-dark">Client:</strong>
                                                <div className="text-muted">{selectedProjectDetails.client}</div>
                                            </div>
                                            <div className="mb-3">
                                                <strong className="text-dark">Total Value:</strong>
                                                <div className="text-success fw-bold fs-5">{selectedProjectDetails.value}</div>
                                            </div>
                                            <div className="mb-3">
                                                <strong className="text-dark">Project Status:</strong>
                                                <div>
                                                    <Badge bg={getStatusVariant(selectedProjectDetails.status)} className="fs-6">
                                                        {selectedProjectDetails.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div>
                                                <strong className="text-dark">Deadline:</strong>
                                                <div className="text-muted">{selectedProjectDetails.deadline}</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="h-100 border-success">
                                        <Card.Header className="bg-#09BD3C text-white">
                                            <h6 className="mb-0 fw-bold">
                                                <i className="fas fa-chart-pie me-2"></i>
                                                Progress & Funding
                                            </h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="mb-3">
                                                <strong className="text-dark">Overall Progress:</strong>
                                                <div className="progress mt-2" style={{ height: '12px' }}>
                                                    <div 
                                                        className="progress-bar" 
                                                        style={{
                                                            width: `${selectedProjectDetails.progress}%`,
                                                            background: selectedProjectDetails.progress >= 80 ? '#28a745' :
                                                                      selectedProjectDetails.progress >= 50 ? '#ffc107' : '#0d6efd'
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="mt-1 fw-bold text-end">{selectedProjectDetails.progress}%</div>
                                            </div>
                                            <div className="mb-3">
                                                <strong className="text-dark">Funding Status:</strong>
                                                <div>
                                                    <Badge bg={getInvoiceStatusVariant(selectedProjectDetails.invoiceStatus)} className="fs-6">
                                                        {selectedProjectDetails.invoiceStatus}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <strong className="text-dark">Discount Rate:</strong>
                                                <div className="text-info fw-bold">{selectedProjectDetails.discountRate}%</div>
                                            </div>
                                            <div>
                                                <strong className="text-dark">Funded Amount:</strong>
                                                <div className="text-success fw-bold">{selectedProjectDetails.fundedAmount}</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Milestones Section */}
                            <Card>
                                <Card.Header className="bg-light">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h5 className="mb-0 fw-bold text-dark">
                                            <i className="fas fa-flag me-2 text-warning"></i>
                                            Project Milestones
                                        </h5>
                                        <Badge bg="info" className="fs-6">
                                            {selectedProjectDetails.milestones?.length || 0} Milestones
                                        </Badge>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <Table responsive hover className="mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                    <i className="fas fa-flag me-2 text-primary"></i>
                                                    Milestone
                                                </th>
                                                <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                    <i className="fas fa-info-circle me-2 text-info"></i>
                                                    Description
                                                </th>
                                                <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                    <i className="fas fa-percentage me-2 text-success"></i>
                                                    % of Value
                                                </th>
                                                <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                    <i className="fas fa-calendar me-2 text-warning"></i>
                                                    Due Date
                                                </th>
                                                <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                    <i className="fas fa-signal me-2 text-secondary"></i>
                                                    Status
                                                </th>
                                                <th className="border-0 py-3 px-4 fw-bold text-dark">
                                                    <i className="fas fa-cogs me-2 text-primary"></i>
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedProjectDetails.milestones?.map((milestone, index) => (
                                                <tr key={index}>
                                                    <td className="py-3 px-4">
                                                        <div className="d-flex align-items-center">
                                                            <div className="me-3">
                                                                <i className={`fas ${
                                                                    milestone.status === 'Completed' ? 'fa-check-circle text-success' :
                                                                    milestone.status === 'In Progress' ? 'fa-clock text-warning' :
                                                                    'fa-circle text-muted'
                                                                } fs-5`}></i>
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-dark">{milestone.name}</div>
                                                                <small className="text-muted">{milestone.id}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-muted">{milestone.description}</div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="d-flex align-items-center">
                                                            <div className="me-2">
                                                                <i className="fas fa-percentage text-success"></i>
                                                            </div>
                                                            <span className="fw-bold text-dark">{milestone.percentage}%</span>
                                                        </div>
                                                        <small className="text-success fw-medium">
                                                            ₹{(parseFloat(selectedProjectDetails.value.replace(/[₹,]/g, '')) * milestone.percentage / 100).toLocaleString('en-IN')}
                                                        </small>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="text-muted fw-medium">{milestone.targetDate}</div>
                                                        {milestone.completedOn && (
                                                            <small className="text-success">
                                                                <i className="fas fa-check me-1"></i>
                                                                Completed: {milestone.completedOn}
                                                            </small>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge bg={
                                                            milestone.status === 'Completed' ? 'success' :
                                                            milestone.status === 'In Progress' ? 'warning' :
                                                            'secondary'
                                                        }>
                                                            {milestone.status}
                                                        </Badge>
                                                        {milestone.invoiceId && (
                                                            <div className="mt-1">
                                                                <small className="text-info fw-medium">
                                                                    <i className="fas fa-file-invoice me-1"></i>
                                                                    {milestone.invoiceId}
                                                                </small>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {milestone.status === 'Completed' && !milestone.invoiceId ? (
                                                            <Button 
                                                                variant="success" 
                                                                size="sm"
                                                                onClick={() => handleMilestoneInvoice(selectedProjectDetails, milestone)}
                                                            >
                                                                <i className="fas fa-file-invoice me-1"></i>
                                                                Raise Invoice
                                                            </Button>
                                                        ) : milestone.status === 'In Progress' ? (
                                                            <Button 
                                                                variant="warning" 
                                                                size="sm"
                                                                onClick={() => {
                                                                    const updatedProject = {
                                                                        ...selectedProjectDetails,
                                                                        milestones: selectedProjectDetails.milestones.map(m => 
                                                                            m.id === milestone.id 
                                                                                ? { 
                                                                                    ...m, 
                                                                                    status: 'Completed',
                                                                                    completedOn: new Date().toISOString().slice(0, 10)
                                                                                  }
                                                                                : m
                                                                        )
                                                                    };
                                                                    setSelectedProjectDetails(updatedProject);
                                                                    handleUpdateProgress(updatedProject);
                                                                }}
                                                            >
                                                                <i className="fas fa-check me-1"></i>
                                                                Mark Complete
                                                            </Button>
                                                        ) : milestone.invoiceId ? (
                                                            <Button 
                                                                variant="outline-info" 
                                                                size="sm"
                                                                disabled
                                                            >
                                                                <i className="fas fa-check me-1"></i>
                                                                Invoiced
                                                            </Button>
                                                        ) : (
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm"
                                                                onClick={() => {
                                                                    const updatedProject = {
                                                                        ...selectedProjectDetails,
                                                                        milestones: selectedProjectDetails.milestones.map(m => 
                                                                            m.id === milestone.id 
                                                                                ? { ...m, status: 'In Progress' }
                                                                                : m
                                                                        )
                                                                    };
                                                                    setSelectedProjectDetails(updatedProject);
                                                                }}
                                                            >
                                                                <i className="fas fa-play me-1"></i>
                                                                Start Milestone
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <div className="d-flex justify-content-between w-100">
                        <div className="d-flex gap-2">
                            <Button 
                                variant="outline-success" 
                                onClick={() => {
                                    setShowProjectDetails(false);
                                    navigate('/create-invoices', { 
                                        state: { 
                                            projectData: selectedProjectDetails,
                                            invoiceType: 'project'
                                        } 
                                    });
                                }}
                            >
                                <i className="fas fa-file-invoice me-1"></i>
                                Generate Project Invoice
                            </Button>
                            <Button 
                                variant="outline-info"
                                onClick={() => handleUpdateProgress(selectedProjectDetails)}
                            >
                                <i className="fas fa-edit me-1"></i>
                                Update Progress
                            </Button>
                        </div>
                        <Button 
                            variant="secondary" 
                            onClick={() => setShowProjectDetails(false)}
                        >
                            Close
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>

            {/* Modals */}
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

export default SellerDashboard;