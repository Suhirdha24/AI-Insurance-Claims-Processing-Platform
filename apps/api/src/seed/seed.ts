import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}
import { config } from '../config/env';
import { User } from '../models/User';
import { Policy } from '../models/Policy';
import { Claim } from '../models/Claim';
import { ClaimDocument } from '../models/ClaimDocument';
import { DocumentExtraction } from '../models/DocumentExtraction';
import { DamageAnalysis } from '../models/DamageAnalysis';
import { RiskAnalysis } from '../models/RiskAnalysis';
import { CoverageAnalysis } from '../models/CoverageAnalysis';
import { AuditLog } from '../models/AuditLog';
import { UserRole, ClaimStatus, ClaimType, RiskLevel, DocumentType } from '@ai-insurance/shared';

async function seedData() {
  console.log('[Seed] Connecting to MongoDB...');
  await mongoose.connect(config.mongoUri);

  console.log('[Seed] Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Policy.deleteMany({}),
    Claim.deleteMany({}),
    ClaimDocument.deleteMany({}),
    DocumentExtraction.deleteMany({}),
    DamageAnalysis.deleteMany({}),
    RiskAnalysis.deleteMany({}),
    CoverageAnalysis.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);

  console.log('[Seed] Creating demo users...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const admin = await User.create({
    name: 'Sarah Jenkins (Admin)',
    email: 'admin@example.com',
    passwordHash,
    role: UserRole.ADMIN,
    phone: '+1-555-0100',
    isActive: true,
  });

  const adjuster = await User.create({
    name: 'David Vance (Senior Adjuster)',
    email: 'adjuster@example.com',
    passwordHash,
    role: UserRole.ADJUSTER,
    phone: '+1-555-0101',
    isActive: true,
  });

  const adjuster2 = await User.create({
    name: 'Priya Sharma (Adjuster)',
    email: 'adjuster2@example.com',
    passwordHash,
    role: UserRole.ADJUSTER,
    phone: '+1-555-0102',
    isActive: true,
  });

  const customer = await User.create({
    name: 'Rajesh Kumar',
    email: 'customer@example.com',
    passwordHash,
    role: UserRole.CUSTOMER,
    phone: '+91-9876543210',
    isActive: true,
  });

  const customerAlias = await User.create({
    name: 'Sarah (Customer)',
    email: 'customer@claimflow.ai',
    passwordHash: await bcrypt.hash('Customer123!', salt),
    role: UserRole.CUSTOMER,
    phone: '+1-555-0188',
    isActive: true,
  });

  const adjusterAlias = await User.create({
    name: 'Michael Vance',
    email: 'adjuster@claimflow.ai',
    passwordHash: await bcrypt.hash('Adjuster123!', salt),
    role: UserRole.ADJUSTER,
    phone: '+1-555-0189',
    isActive: true,
  });

  const adminAlias = await User.create({
    name: 'System Admin',
    email: 'admin@claimflow.ai',
    passwordHash: await bcrypt.hash('Admin123!', salt),
    role: UserRole.ADMIN,
    phone: '+1-555-0190',
    isActive: true,
  });

  const customer2 = await User.create({
    name: 'Elena Rostova',
    email: 'customer2@example.com',
    passwordHash,
    role: UserRole.CUSTOMER,
    phone: '+1-555-0199',
    isActive: true,
  });

  console.log('[Seed] Creating demo policies...');
  const policy1 = await Policy.create({
    policyNumber: 'POL-2026-8849',
    customerId: customer._id,
    policyType: ClaimType.VEHICLE,
    coverageLimit: 500000,
    deductible: 15000,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
    status: 'ACTIVE',
    coverageDetails: ['Collision Damage', 'Third Party Liability', 'Fire & Theft Protection'],
    exclusions: ['Drunk Driving', 'Racing Events', 'Unlicensed Driver Damage'],
    vehicleDetails: {
      make: 'Hyundai',
      model: 'Creta SX',
      year: 2024,
      registrationNumber: 'KA-01-MJ-9921',
    },
  });

  const policy2 = await Policy.create({
    policyNumber: 'POL-2026-9912',
    customerId: customer2._id,
    policyType: ClaimType.PROPERTY,
    coverageLimit: 2500000,
    deductible: 50000,
    startDate: new Date('2026-02-15'),
    endDate: new Date('2027-02-14'),
    status: 'ACTIVE',
    coverageDetails: ['Flood & Fire', 'Structural Damage', 'Burglary Protection'],
    exclusions: ['Earthquake without endorsement', 'Normal wear and tear'],
  });

  console.log('[Seed] Creating demo claims...');
  // Claim 1: HIGH RISK mismatch claim
  const claim1 = await Claim.create({
    claimNumber: 'CLM-2026-00124',
    customerId: customer._id,
    policyId: policy1._id,
    assignedAdjusterId: adjuster._id,
    claimType: ClaimType.VEHICLE,
    incidentDate: new Date('2026-09-02'),
    incidentLocation: 'MG Road Junction, Bangalore',
    description: 'Vehicle struck front radiator grille of stationery truck while reversing at intersection.',
    estimatedAmount: 280000,
    status: ClaimStatus.ADJUSTER_REVIEW,
    riskScore: 78,
    riskLevel: RiskLevel.HIGH,
    vehicleRegistration: 'KA-01-MJ-9921',
    thirdPartyInvolved: true,
    policeReportAvailable: true,
    timeline: [
      {
        stage: ClaimStatus.SUBMITTED,
        title: 'Claim Created & Submitted',
        description: 'Claim submitted by Rajesh Kumar',
        performedBy: 'Rajesh Kumar',
        userRole: 'CUSTOMER',
        timestamp: new Date('2026-09-02T10:00:00Z'),
      },
      {
        stage: ClaimStatus.AI_PROCESSING,
        title: 'AI Processing Completed',
        description: 'Multi-document extraction, damage analysis & risk engine executed',
        performedBy: 'System AI Engine',
        userRole: 'SYSTEM',
        timestamp: new Date('2026-09-02T10:05:00Z'),
      },
      {
        stage: ClaimStatus.ADJUSTER_REVIEW,
        title: 'Assigned to Adjuster Review',
        description: 'Assigned to Senior Adjuster David Vance for manual review due to HIGH risk score',
        performedBy: 'System Dispatcher',
        userRole: 'SYSTEM',
        timestamp: new Date('2026-09-02T10:10:00Z'),
      },
    ],
  });

  // Claim 2: LOW RISK claim
  const claim2 = await Claim.create({
    claimNumber: 'CLM-2026-00125',
    customerId: customer2._id,
    policyId: policy2._id,
    assignedAdjusterId: adjuster2._id,
    claimType: ClaimType.PROPERTY,
    incidentDate: new Date('2026-08-20'),
    incidentLocation: '102 Palm Grove Apartments, Bandra West',
    description: 'Water pipe leak damaged living room wooden flooring and rug.',
    estimatedAmount: 85000,
    approvedAmount: 70000,
    status: ClaimStatus.APPROVED,
    riskScore: 18,
    riskLevel: RiskLevel.LOW,
    thirdPartyInvolved: false,
    policeReportAvailable: false,
    timeline: [
      {
        stage: ClaimStatus.SUBMITTED,
        title: 'Claim Created',
        description: 'Property claim filed',
        performedBy: 'Elena Rostova',
        userRole: 'CUSTOMER',
        timestamp: new Date('2026-08-20T14:00:00Z'),
      },
      {
        stage: ClaimStatus.APPROVED,
        title: 'Claim Approved',
        description: 'Approved for ₹70,000 after deductible adjustment',
        performedBy: 'Priya Sharma (Adjuster)',
        userRole: 'ADJUSTER',
        timestamp: new Date('2026-08-21T09:30:00Z'),
      },
    ],
  });

  console.log('[Seed] Creating demo documents & AI analysis records...');
  const doc1 = await ClaimDocument.create({
    claimId: claim1._id,
    fileName: 'claim_form_signed.pdf',
    fileUrl: '/uploads/demo_claim_form.pdf',
    mimeType: 'application/pdf',
    fileSize: 450000,
    documentType: DocumentType.CLAIM_FORM,
    status: 'COMPLETED',
  });

  const doc2 = await ClaimDocument.create({
    claimId: claim1._id,
    fileName: 'police_fir_report.pdf',
    fileUrl: '/uploads/demo_police_report.pdf',
    mimeType: 'application/pdf',
    fileSize: 620000,
    documentType: DocumentType.POLICE_REPORT,
    status: 'COMPLETED',
  });

  const doc3 = await ClaimDocument.create({
    claimId: claim1._id,
    fileName: 'vehicle_front_damage.jpg',
    fileUrl: '/uploads/demo_damage.jpg',
    mimeType: 'image/jpeg',
    fileSize: 1200000,
    documentType: DocumentType.DAMAGE_PHOTO,
    status: 'COMPLETED',
  });

  await DocumentExtraction.create({
    documentId: doc1._id,
    claimId: claim1._id,
    extractedFields: [
      { field: 'claimantName', value: 'Rajesh Kumar', confidence: 98, sourceDocument: 'claim_form_signed.pdf', validationStatus: 'VERIFIED' },
      { field: 'incidentDate', value: '05/09/2026', confidence: 94, sourceDocument: 'claim_form_signed.pdf', validationStatus: 'MISMATCH' },
      { field: 'vehicleRegistration', value: 'KA-01-MJ-9921', confidence: 96, sourceDocument: 'claim_form_signed.pdf', validationStatus: 'VERIFIED' },
    ],
    aiProvider: 'MOCK',
  });

  await DocumentExtraction.create({
    documentId: doc2._id,
    claimId: claim1._id,
    extractedFields: [
      { field: 'policeStation', value: 'Central Traffic Police Station', confidence: 96, sourceDocument: 'police_fir_report.pdf', validationStatus: 'VERIFIED' },
      { field: 'incidentDate', value: '03/09/2026', confidence: 92, sourceDocument: 'police_fir_report.pdf', validationStatus: 'MISMATCH' },
      { field: 'vehicleRegistration', value: 'KA-01-MJ-9921', confidence: 97, sourceDocument: 'police_fir_report.pdf', validationStatus: 'VERIFIED' },
    ],
    aiProvider: 'MOCK',
  });

  await DamageAnalysis.create({
    claimId: claim1._id,
    documentId: doc3._id,
    damageAreas: [
      { location: 'Front Bumper', description: 'Cracked plastic housing and severe structural denting', severity: 'SEVERE', estimatedCost: 120000 },
      { location: 'Radiator Grille', description: 'Bent frame and coolant hose dislocation', severity: 'MODERATE', estimatedCost: 85000 },
      { location: 'Left Headlight Unit', description: 'Shattered lens and broken internal LED mount', severity: 'MODERATE', estimatedCost: 75000 },
    ],
    overallSeverity: 'SEVERE',
    estimatedTotalRepair: 280000,
    confidenceScore: 92,
    aiProvider: 'MOCK',
    model: 'mock-vision-v1',
  });

  await RiskAnalysis.create({
    claimId: claim1._id,
    overallScore: 78,
    riskLevel: RiskLevel.HIGH,
    factors: [
      { code: 'DOC_DISCREPANCY', name: 'Cross-Document Information Mismatch', score: 30, maxScore: 30, severity: 'HIGH', description: 'Date mismatch between Claim Form (05/09/2026) and Police Report (03/09/2026)' },
      { code: 'AMOUNT_ANOMALY', name: 'High Claim Amount relative to Coverage Limit', score: 28, maxScore: 30, severity: 'HIGH', description: 'Claim amount ₹2,80,000 represents 56% of total policy coverage limit' },
      { code: 'HIGH_FREQUENCY', name: 'Prior Claim in 12 Months', score: 20, maxScore: 20, severity: 'MEDIUM', description: 'Claimant filed 1 prior vehicle claim in last 12 months' },
    ],
    mismatches: [
      {
        field: 'incidentDate',
        doc1Name: 'claim_form_signed.pdf',
        doc1Value: '05/09/2026',
        doc2Name: 'police_fir_report.pdf',
        doc2Value: '03/09/2026',
        severity: 'HIGH',
        status: 'PENDING',
      },
    ],
    duplicateMatches: [],
    aiConfidence: 91,
    aiRecommendation: 'Requires detailed manual review by adjuster due to 2-day date mismatch across official documents.',
  });

  await CoverageAnalysis.create({
    claimId: claim1._id,
    policyId: policy1._id,
    coverageStatus: 'COVERED',
    coverageLimit: 500000,
    deductible: 15000,
    claimAmount: 280000,
    estimatedEligibleAmount: 265000,
    appliedExclusions: [],
    notes: 'Claim is covered under Collision Damage. Deductible of ₹15,000 applies.',
  });

  console.log('[Seed] Seeding completed successfully!');
  console.log('\n-------------------------------------------------');
  console.log('DEMO ACCOUNTS:');
  console.log('  Customer 1: customer@example.com  / password123');
  console.log('  Customer 2: customer2@example.com / password123');
  console.log('  Adjuster 1: adjuster@example.com  / password123');
  console.log('  Adjuster 2: adjuster2@example.com / password123');
  console.log('  Admin:      admin@example.com     / password123');
  console.log('-------------------------------------------------\n');

  await mongoose.disconnect();
}

seedData().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
