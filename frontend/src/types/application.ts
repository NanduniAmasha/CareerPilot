export interface Application {
  id: number;
  company: string;
  position: string;
  status:
    | "SAVED"
    | "APPLIED"
    | "INTERVIEW"
    | "OFFER"
    | "REJECTED";
  appliedDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface ApplicationStats {
  total: number;
  saved: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}