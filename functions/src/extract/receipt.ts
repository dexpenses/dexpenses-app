export interface ReceiptResult {
  state: 'pending' | 'unreadable' | 'partial' | 'ready';
  data?: Receipt;
}

export interface Receipt {
  [field: string]: any
}

export const ReceiptResults = {
  Unreadable: {
    state: 'unreadable'
  } as ReceiptResult
}
