import { User } from '../models/User';
import { UserRole } from '@ai-insurance/shared';

export class UserService {
  async getUsers(queryFilter: any = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const users = await User.find(queryFilter).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await User.countDocuments(queryFilter);
    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async updateUserRole(userId: string, role: UserRole) {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-passwordHash');
    if (!user) throw new Error('User not found');
    return user;
  }

  async toggleUserActive(userId: string, isActive: boolean) {
    const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true }).select('-passwordHash');
    if (!user) throw new Error('User not found');
    return user;
  }
}

export const userService = new UserService();
