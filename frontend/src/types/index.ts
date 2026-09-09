export interface Policy {
  id: string;
  clientId: string;
  clientName: string;
  type: 'INDIVIDUAL' | 'COLECTIVA';
  status: 'ACTIVE' | 'RENOVADA' | 'CANCELLED';
  canonAmount: number;
  premiumAmount: number;
  startDate: string;
  endDate: string;
  ipc: number;
  createdAt: string;
  updatedAt: string;
}

export interface Risk {
  id: string;
  policyId: string;
  description: string;
  status: 'ACTIVE' | 'CANCELLED';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyRequest {
  clientId: string;
  type: 'INDIVIDUAL' | 'COLECTIVA';
  canonAmount: number;
  startDate: string;
  endDate: string;
}

export interface RiskRequest {
  description: string;
  amount: number;
}

export interface RenewalRequest {
  ipc: number;
}