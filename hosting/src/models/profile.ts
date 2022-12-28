export interface AssetTrackerProfile {
  created: Date;
  updated: Date;
  id: string;
  owner: {
    name: string;
    email: string;
    photoURL?: string;
  };
  accounts?: {
    [accountID: string]: Account;
  };
}

export type AccountType = 'bank' | 'investment' | 'other';

export type AccountSubtype =
  | 'savings'
  | 'chequing'
  | 'non-reg'
  | 'TFSA'
  | 'RRSP'
  | 'other';

export interface Account {
  created: Date;
  updated: Date;
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  subtype: AccountSubtype;
  currency: string;
  transactions: Transaction[];
}

export type TransactionType = 'purchase' | 'sale' | 'withdrawal' | 'deposit';

export interface Transaction {
  timestamp: Date;
  type: TransactionType;
  amount: number;
  currency: string;
  assetName: '_CASH' | '_MIXED' | string;
  assetQuantity: number;
  note?: string;
}
