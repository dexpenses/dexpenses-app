export interface ReceiptResult {
  state: 'pending' | 'no-text' | 'unreadable' | 'partial' | 'ready';
  data?: Receipt;
}

export interface Receipt {
  [field: string]: any
}
