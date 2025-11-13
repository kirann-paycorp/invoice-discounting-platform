import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { showNotification, showLoadingNotification, updateLoadingNotification } from '../common/NotificationSystem';

const NotificationDemo = () => {
    const showSuccessNotification = () => {
        showNotification('success', '💰 Transaction completed successfully! Your invoice has been funded with the new fintech green color.');
    };

    const showErrorNotification = () => {
        showNotification('error', 'Something went wrong! Please check your input and try again.');
    };

    const showWarningNotification = () => {
        showNotification('warning', 'Please review your changes before proceeding. Some fields may be missing.');
    };

    const showInfoNotification = () => {
        showNotification('info', 'New features are now available in your dashboard. Check them out!');
    };

    const showLoadingDemo = () => {
        const loadingId = showLoadingNotification('Processing your request...');
        
        setTimeout(() => {
            updateLoadingNotification(loadingId, 'Validating data...');
        }, 1000);

        setTimeout(() => {
            updateLoadingNotification(loadingId, 'Saving changes...');
        }, 2000);

        setTimeout(() => {
            updateLoadingNotification(loadingId, 'Request completed successfully!', true);
        }, 3000);
    };

    const showMultipleNotifications = () => {
        showNotification('info', 'Starting batch operation...');
        
        setTimeout(() => {
            showNotification('success', 'First task completed!');
        }, 1000);

        setTimeout(() => {
            showNotification('warning', 'Second task needs attention.');
        }, 2000);

        setTimeout(() => {
            showNotification('success', 'All tasks completed successfully!');
        }, 3000);
    };

    return (
        <Card className="fintech-card">
            <Card.Header className="bg-fintech-primary-light">
                <h5 className="mb-0">
                    <i className="fas fa-bell me-2 text-fintech-primary"></i>
                    Modern Fintech Notification System
                </h5>
                <small className="text-muted">Showcase of professional fintech notifications with the new color palette</small>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6} className="mb-3">
                        <h6 className="fw-bold mb-3">Basic Notifications</h6>
                        <div className="d-grid gap-2">
                            <Button className="btn-fintech-success" onClick={showSuccessNotification}>
                                <i className="fas fa-check me-2"></i>
                                Show Fintech Success
                            </Button>
                            <Button variant="danger" onClick={showErrorNotification}>
                                <i className="fas fa-times me-2"></i>
                                Show Error
                            </Button>
                            <Button variant="warning" onClick={showWarningNotification}>
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                Show Warning  
                            </Button>
                            <Button className="btn-fintech-primary" onClick={showInfoNotification}>
                                <i className="fas fa-info-circle me-2"></i>
                                Show Info
                            </Button>
                        </div>
                    </Col>
                    <Col md={6} className="mb-3">
                        <h6 className="fw-bold mb-3">Advanced Features</h6>
                        <div className="d-grid gap-2">
                            <Button variant="primary" onClick={showLoadingDemo}>
                                <i className="fas fa-spinner me-2"></i>
                                Loading Animation Demo
                            </Button>
                            <Button variant="secondary" onClick={showMultipleNotifications}>
                                <i className="fas fa-layer-group me-2"></i>
                                Multiple Notifications
                            </Button>
                        </div>
                    </Col>
                </Row>
                
                <hr />
                
                <div className="text-center">
                    <h6 className="fw-bold text-primary mb-2">Features Included:</h6>
                    <div className="row text-sm">
                        <div className="col-md-3">
                            <div className="p-2 bg-light rounded mb-2">
                                <i className="fas fa-magic text-primary"></i>
                                <div className="small fw-medium">Smooth Animations</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="p-2 bg-light rounded mb-2">
                                <i className="fas fa-palette text-success"></i>
                                <div className="small fw-medium">Color-coded Types</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="p-2 bg-light rounded mb-2">
                                <i className="fas fa-mobile-alt text-warning"></i>
                                <div className="small fw-medium">Responsive Design</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="p-2 bg-light rounded mb-2">
                                <i className="fas fa-clock text-info"></i>
                                <div className="small fw-medium">Auto-dismiss</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default NotificationDemo;