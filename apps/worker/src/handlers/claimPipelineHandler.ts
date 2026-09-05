import mongoose from 'mongoose';
import { calculateDeterministicRisk, ClaimStatus, RiskLevel } from '@ai-insurance/shared';

// We import Mongoose models from the api workspace or define inline references if shared
const ClaimSchema = new mongoose.Schema({ status: String, riskScore: Number, riskLevel: String, estimatedAmount: Number }, { strict: false });
const DocumentSchema = new mongoose.Schema({}, { strict: false });
const ExtractionSchema = new mongoose.Schema({}, { strict: false });
const RiskSchema = new mongoose.Schema({}, { strict: false });
const DamageSchema = new mongoose.Schema({}, { strict: false });
const CoverageSchema = new mongoose.Schema({}, { strict: false });

const Claim = mongoose.models.Claim || mongoose.model('Claim', ClaimSchema);
const ClaimDocument = mongoose.models.ClaimDocument || mongoose.model('ClaimDocument', DocumentSchema);
const DocumentExtraction = mongoose.models.DocumentExtraction || mongoose.model('DocumentExtraction', ExtractionSchema);
const RiskAnalysis = mongoose.models.RiskAnalysis || mongoose.model('RiskAnalysis', RiskSchema);
const DamageAnalysis = mongoose.models.DamageAnalysis || mongoose.model('DamageAnalysis', DamageSchema);
const CoverageAnalysis = mongoose.models.CoverageAnalysis || mongoose.model('CoverageAnalysis', CoverageSchema);

export async function processClaimPipeline(claimId: string) {
  console.log(`[Worker] Starting AI Pipeline processing for Claim ID: ${claimId}`);

  const claim = await Claim.findById(claimId);
  if (!claim) {
    console.error(`[Worker] Claim ID ${claimId} not found`);
    return;
  }

  const documents = await ClaimDocument.find({ claimId });

  // 1. Process Document Extractions
  for (const doc of documents) {
    const existing = await DocumentExtraction.findOne({ documentId: doc._id });
    if (!existing) {
      await DocumentExtraction.create({
        documentId: doc._id,
        claimId,
        extractedFields: [
          { field: 'incidentDate', value: '05/09/2026', confidence: 94, sourceDocument: doc.fileName, validationStatus: 'MISMATCH' },
          { field: 'vehicleRegistration', value: claim.vehicleRegistration || 'KA-01-MJ-9921', confidence: 96, sourceDocument: doc.fileName, validationStatus: 'VERIFIED' },
          { field: 'estimatedDamage', value: claim.estimatedAmount, confidence: 95, sourceDocument: doc.fileName, validationStatus: 'VERIFIED' },
        ],
        rawText: `Processed ${doc.fileName} via AI Extraction Pipeline`,
        aiProvider: 'MOCK',
      });
      await ClaimDocument.findByIdAndUpdate(doc._id, { status: 'COMPLETED' });
    }
  }

  // 2. Perform Cross-Doc Mismatch & Risk Engine Calculation
  const mismatches = [
    {
      field: 'incidentDate',
      doc1Name: 'claim_form_signed.pdf',
      doc1Value: '05/09/2026',
      doc2Name: 'police_fir_report.pdf',
      doc2Value: '03/09/2026',
      severity: 'HIGH',
      status: 'PENDING',
    },
  ];

  const riskResult = calculateDeterministicRisk({
    estimatedAmount: claim.estimatedAmount || 280000,
    policyCoverageLimit: 500000,
    mismatches: mismatches as any,
    hasDuplicateMatch: false,
    previousClaimsCountCountInLastYear: 1,
  });

  await RiskAnalysis.findOneAndUpdate(
    { claimId },
    {
      claimId,
      overallScore: riskResult.overallScore,
      riskLevel: riskResult.riskLevel,
      factors: riskResult.factors,
      mismatches,
      aiConfidence: 91,
      aiRecommendation: 'Requires adjuster review due to incident date discrepancy.',
    },
    { upsert: true, new: true }
  );

  // 3. Create/Update Visual Damage Analysis
  await DamageAnalysis.findOneAndUpdate(
    { claimId },
    {
      claimId,
      damageAreas: [
        { location: 'Front Bumper', description: 'Cracked plastic housing and severe structural denting', severity: 'SEVERE', estimatedCost: 120000 },
        { location: 'Radiator Grille', description: 'Bent frame and coolant hose dislocation', severity: 'MODERATE', estimatedCost: 85000 },
      ],
      overallSeverity: 'SEVERE',
      estimatedTotalRepair: claim.estimatedAmount || 280000,
      confidenceScore: 92,
      aiProvider: 'MOCK',
      model: 'mock-vision-v1',
    },
    { upsert: true, new: true }
  );

  // 4. Create/Update Policy Coverage Analysis
  await CoverageAnalysis.findOneAndUpdate(
    { claimId },
    {
      claimId,
      policyId: claim.policyId,
      coverageStatus: 'COVERED',
      coverageLimit: 500000,
      deductible: 15000,
      claimAmount: claim.estimatedAmount,
      estimatedEligibleAmount: Math.max(0, claim.estimatedAmount - 15000),
      appliedExclusions: [],
      notes: 'Eligible under Collision Damage. ₹15,000 deductible applies.',
    },
    { upsert: true, new: true }
  );

  // 5. Update Claim Status & Risk Score
  claim.riskScore = riskResult.overallScore;
  claim.riskLevel = riskResult.riskLevel;
  claim.status = ClaimStatus.ADJUSTER_REVIEW;
  claim.timeline.push({
    stage: ClaimStatus.ADJUSTER_REVIEW,
    title: 'AI Processing Complete',
    description: `Extraction, damage analysis & risk calculation finished (Score: ${riskResult.overallScore}/100 - ${riskResult.riskLevel}). Moved to Adjuster Review.`,
    performedBy: 'System AI Engine',
    userRole: 'SYSTEM',
    timestamp: new Date(),
  });

  await claim.save();
  console.log(`[Worker] Successfully completed AI Pipeline for Claim ID: ${claimId}`);
}
