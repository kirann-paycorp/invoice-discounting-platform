import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';

const FinancialCalculator = ({ invoiceValue, paymentTerms, creditScore, annualRevenue, onCalculationUpdate }) => {
    const [calculations, setCalculations] = useState({
        discountRate: 0,
        discountAmount: 0,
        advanceAmount: 0,
        processingFee: 0,
        netAmount: 0,
        totalCost: 0,
        effectiveRate: 0,
        riskPremium: 0,
        advancePercentage: 85,
        processingFeeRate: 2
    });

    useEffect(() => {
        if (invoiceValue && paymentTerms && creditScore) {
            try {
                const newCalculations = calculateFinancials();
                setCalculations(newCalculations);
                if (onCalculationUpdate) {
                    onCalculationUpdate(newCalculations);
                }
            } catch (error) {
                console.error('Error calculating financials:', error);
                // Keep default values if calculation fails
            }
        }
    }, [invoiceValue, paymentTerms, creditScore, annualRevenue]);

    const calculateFinancials = () => {
        const invoice = parseFloat(invoiceValue) || 0;
        const terms = parseInt(paymentTerms) || 30;
        const credit = parseInt(creditScore) || 600;
        const revenue = parseFloat(annualRevenue) || 0;

        // Validate inputs
        if (invoice <= 0 || terms <= 0 || credit <= 0) {
            return {
                discountRate: 0,
                discountAmount: 0,
                advanceAmount: 0,
                processingFee: 0,
                netAmount: 0,
                totalCost: 0,
                effectiveRate: 0,
                riskPremium: 0,
                advancePercentage: 85,
                processingFeeRate: 2
            };
        }

        // Base discount rate calculation
        let baseRate = 12; // Base 12% annually

        // Credit score adjustment
        if (credit >= 750) baseRate -= 3;
        else if (credit >= 700) baseRate -= 2;
        else if (credit >= 650) baseRate -= 1;
        else if (credit < 600) baseRate += 2;

        // Payment terms adjustment
        if (terms <= 30) baseRate -= 1;
        else if (terms <= 60) baseRate += 0;
        else if (terms <= 90) baseRate += 1;
        else baseRate += 2;

        // Invoice size adjustment
        if (invoice > 5000000) baseRate -= 1;
        else if (invoice > 1000000) baseRate -= 0.5;
        else if (invoice < 100000) baseRate += 1;

        // Revenue ratio adjustment
        const revenueRatio = revenue / invoice;
        if (revenueRatio >= 10) baseRate -= 1;
        else if (revenueRatio >= 5) baseRate -= 0.5;
        else if (revenueRatio < 2) baseRate += 1.5;

        // Risk premium calculation
        const riskPremium = Math.max(0, baseRate - 8) * 0.5;

        // Convert annual rate to period rate
        const periodRate = (baseRate / 100) * (terms / 365);
        
        // Calculate discount amount
        const discountAmount = invoice * periodRate;
        
        // Processing fee (0.5% to 2% based on invoice size)
        let processingFeeRate = 0.02; // 2%
        if (invoice > 1000000) processingFeeRate = 0.005; // 0.5%
        else if (invoice > 500000) processingFeeRate = 0.01; // 1%
        else if (invoice > 100000) processingFeeRate = 0.015; // 1.5%
        
        const processingFee = invoice * processingFeeRate;
        
        // Advance percentage (80-95% based on risk)
        let advancePercentage = 0.85; // Base 85%
        if (credit >= 750 && revenueRatio >= 5) advancePercentage = 0.95;
        else if (credit >= 700 && revenueRatio >= 3) advancePercentage = 0.90;
        else if (credit < 600 || revenueRatio < 2) advancePercentage = 0.80;
        
        const advanceAmount = invoice * advancePercentage;
        const netAmount = advanceAmount - discountAmount - processingFee;
        const totalCost = discountAmount + processingFee;
        const effectiveRate = (totalCost / advanceAmount) * (365 / terms) * 100;

        return {
            discountRate: baseRate,
            discountAmount,
            advanceAmount,
            processingFee,
            netAmount,
            totalCost,
            effectiveRate,
            riskPremium,
            advancePercentage: advancePercentage * 100,
            processingFeeRate: processingFeeRate * 100
        };
    };

    const formatCurrency = (amount) => {
        const value = parseFloat(amount) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const getRiskLevel = () => {
        const effectiveRate = calculations.effectiveRate || 0;
        if (effectiveRate <= 15) return { level: 'Low', color: 'success' };
        if (effectiveRate <= 25) return { level: 'Medium', color: 'warning' };
        return { level: 'High', color: 'danger' };
    };

    const risk = getRiskLevel();

    if (!invoiceValue || !paymentTerms || !creditScore) {
        return (
            <Alert variant="info">
                <i className="fas fa-calculator me-2"></i>
                Enter invoice details to see financial calculations
            </Alert>
        );
    }

    return (
        <Card className="mt-3">
            <Card.Header>
                <h6 className="mb-0">
                    <i className="fas fa-chart-line me-2"></i>
                    Financial Calculation Summary
                </h6>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={6}>
                        <div className="financial-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Invoice Value:</span>
                                <strong>{formatCurrency(invoiceValue)}</strong>
                            </div>
                        </div>
                        <div className="financial-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Advance Percentage:</span>
                                <strong>{(calculations.advancePercentage || 0).toFixed(1)}%</strong>
                            </div>
                        </div>
                        <div className="financial-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Advance Amount:</span>
                                <strong className="text-primary">{formatCurrency(calculations.advanceAmount || 0)}</strong>
                            </div>
                        </div>
                        <div className="financial-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Discount Rate (Annual):</span>
                                <strong>{(calculations.discountRate || 0).toFixed(2)}%</strong>
                            </div>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className="financial-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Discount Amount:</span>
                                <strong className="text-danger">-{formatCurrency(calculations.discountAmount || 0)}</strong>
                            </div>
                        </div>
                        <div className="financial-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Processing Fee ({(calculations.processingFeeRate || 0).toFixed(1)}%):</span>
                                <strong className="text-danger">-{formatCurrency(calculations.processingFee || 0)}</strong>
                            </div>
                        </div>
                        <div className="financial-item mb-3">
                            <div className="d-flex justify-content-between border-top pt-2">
                                <span className="text-muted"><strong>Net Amount to Receive:</strong></span>
                                <strong className="text-success fs-5">{formatCurrency(calculations.netAmount || 0)}</strong>
                            </div>
                        </div>
                        <div className="financial-item mb-3">
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Effective Rate (Annual):</span>
                                <strong className={`text-${risk.color}`}>{(calculations.effectiveRate || 0).toFixed(2)}%</strong>
                            </div>
                        </div>
                    </Col>
                </Row>
                
                <Alert variant={risk.color} className="mt-3 mb-0">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Risk Assessment: {risk.level}</strong>
                            <div className="small">
                                Total Cost: {formatCurrency(calculations.totalCost || 0)} | 
                                Payment Terms: {paymentTerms || 0} days | 
                                Credit Score: {creditScore || 0}
                            </div>
                        </div>
                        <div className="text-end">
                            <div className="small text-muted">Expected Processing</div>
                            <strong>2-3 Business Days</strong>
                        </div>
                    </div>
                </Alert>
            </Card.Body>
        </Card>
    );
};

export default FinancialCalculator;