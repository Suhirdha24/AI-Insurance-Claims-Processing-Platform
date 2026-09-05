import { Policy } from '../models/Policy';
import { CreatePolicyInput } from '@ai-insurance/shared';

export class PolicyService {
  async createPolicy(input: CreatePolicyInput) {
    const existing = await Policy.findOne({ policyNumber: input.policyNumber });
    if (existing) {
      const err: any = new Error('Policy number already exists');
      err.statusCode = 400;
      throw err;
    }

    const policy = await Policy.create({
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
    });

    return policy;
  }

  async getPoliciesByCustomer(customerId: string) {
    return Policy.find({ customerId }).sort({ createdAt: -1 });
  }

  async getAllPolicies(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const policies = await Policy.find().populate('customerId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Policy.countDocuments();
    return { policies, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const policyService = new PolicyService();
