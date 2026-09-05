import {
  IAIProvider,
  IDocumentExtractionResult,
  IDamageAnalysisResult,
} from './AIProvider';
import { ICrossDocMismatch, NaturalLanguageFilter } from '@ai-insurance/shared';

export class MockAIProvider implements IAIProvider {
  name = 'MockAIProvider';

  async extractDocumentData(
    fileBuffer: Buffer,
    mimeType: string,
    fileName: string,
    docType: string
  ): Promise<IDocumentExtractionResult> {
    // Simulate realistic extracted structured output based on docType & filename
    let fields: any[] = [];
    const nameLower = fileName.toLowerCase();

    if (docType === 'POLICE_REPORT' || nameLower.includes('police')) {
      fields = [
        { field: 'incidentDate', value: '2026-09-02', confidence: 94, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'incidentLocation', value: 'MG Road Junction, Bangalore', confidence: 91, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'policeStation', value: 'Central Traffic Police Station', confidence: 95, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'firNumber', value: 'FIR-2026-88192', confidence: 98, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'vehicleRegistration', value: 'KA-01-MJ-9921', confidence: 96, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'thirdPartyVehicle', value: 'KA-05-AB-1234', confidence: 89, sourceDocument: fileName, validationStatus: 'VERIFIED' },
      ];
    } else if (docType === 'REPAIR_ESTIMATE' || nameLower.includes('estimate') || nameLower.includes('bill')) {
      fields = [
        { field: 'repairShop', value: 'Apex Auto Care & Collision Center', confidence: 97, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'estimateAmount', value: 280000, confidence: 96, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'partsReplaced', value: 'Front Bumper, Radiator Grille, Left LED Headlight Assembly', confidence: 92, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'laborHours', value: 18, confidence: 90, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'estimatedCompletionDate', value: '2026-09-12', confidence: 88, sourceDocument: fileName, validationStatus: 'VERIFIED' },
      ];
    } else {
      fields = [
        { field: 'claimantName', value: 'Rajesh Kumar', confidence: 95, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'policyNumber', value: 'POL-2026-8849', confidence: 98, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'incidentDate', value: '2026-09-02', confidence: 93, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'vehicleRegistration', value: 'KA-01-MJ-9921', confidence: 96, sourceDocument: fileName, validationStatus: 'VERIFIED' },
        { field: 'estimatedDamage', value: 280000, confidence: 94, sourceDocument: fileName, validationStatus: 'VERIFIED' },
      ];
    }

    return {
      extractedFields: fields,
      rawText: `DOCUMENT CONTENT [${fileName}]: Processed successfully via Mock OCR Engine. All key fields extracted.`,
    };
  }

  async analyzeDamageImage(fileBuffer: Buffer, mimeType: string): Promise<IDamageAnalysisResult> {
    return {
      damageAreas: [
        { location: 'Front Bumper', description: 'Cracked plastic housing and severe structural denting', severity: 'SEVERE', estimatedCost: 120000 },
        { location: 'Radiator Assembly', description: 'Bent frame and coolant hose dislocation', severity: 'MODERATE', estimatedCost: 85000 },
        { location: 'Left Headlight Unit', description: 'Shattered lens and broken internal LED mount', severity: 'MODERATE', estimatedCost: 75000 },
      ],
      overallSeverity: 'SEVERE',
      estimatedTotalRepair: 280000,
      confidenceScore: 92,
    };
  }

  async performCrossDocValidation(extractions: IDocumentExtractionResult[]): Promise<ICrossDocMismatch[]> {
    // Return sample discrepancies if multiple docs present
    if (extractions.length < 2) return [];

    return [
      {
        field: 'incidentDate',
        doc1Name: 'Claim Submission Form',
        doc1Value: '05/09/2026',
        doc2Name: 'Police Incident Report',
        doc2Value: '03/09/2026',
        severity: 'HIGH',
        status: 'PENDING',
      },
    ];
  }

  async generateClaimAssistantReply(context: string, userMessage: string): Promise<string> {
    const msg = userMessage.toLowerCase();
    if (msg.includes('summarize') || msg.includes('summary')) {
      return `**Claim Summary:**\nThis is a vehicle accident claim filed for vehicle KA-01-MJ-9921 under Policy POL-2026-8849. Estimated damage is ₹2,80,000. Key documents (Claim Form, Police Report, Repair Estimate) have been verified by AI extraction.`;
    }
    if (msg.includes('risk') || msg.includes('high risk')) {
      return `**Risk Overview:**\nThis claim is rated **HIGH RISK (Score: 78/100)** primarily due to a 2-day incident date discrepancy between the Claim Form (05/09/2026) and Police Report (03/09/2026), as well as the claim amount representing over 80% of total policy coverage limit.`;
    }
    if (msg.includes('missing') || msg.includes('inconsistent')) {
      return `**Inconsistencies Identified:**\n- Incident Date mismatch detected between Claim Form and Police Report.\n- All major required documents are attached.`;
    }
    return `Based on claim context:\n${context.substring(0, 150)}...\n\nThe claim is currently in Adjuster Review. You can approve, reject, or request additional information directly from the action panel.`;
  }

  async convertNaturalLanguageToFilter(naturalQuery: string): Promise<NaturalLanguageFilter> {
    const query = naturalQuery.toLowerCase();
    const result: NaturalLanguageFilter = {};

    if (query.includes('high risk') || query.includes('high-risk')) result.riskLevel = 'HIGH';
    if (query.includes('critical')) result.riskLevel = 'CRITICAL';
    if (query.includes('medium')) result.riskLevel = 'MEDIUM';
    if (query.includes('vehicle') || query.includes('car')) result.claimType = 'VEHICLE';
    if (query.includes('property')) result.claimType = 'PROPERTY';
    if (query.includes('health')) result.claimType = 'HEALTH';

    if (query.includes('above 5 lakh') || query.includes('> 500000') || query.includes('500000')) {
      result.minAmount = 500000;
    } else if (query.includes('above 2 lakh') || query.includes('> 200000')) {
      result.minAmount = 200000;
    }

    if (query.includes('30 days') || query.includes('last month')) result.dateRange = 'LAST_30_DAYS';
    if (query.includes('7 days') || query.includes('last week')) result.dateRange = 'LAST_7_DAYS';

    result.searchQuery = naturalQuery;
    return result;
  }
}
