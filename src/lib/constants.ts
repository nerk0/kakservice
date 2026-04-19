export const PRICE_PER_UNIT = 7500 // öre = 75 SEK
export const PROFIT_PER_UNIT = 3500 // öre = 35 SEK

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Väntar',
  CONFIRMED: 'Bekräftad',
  DELIVERED: 'Levererad',
  CANCELLED: 'Avbruten',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: 'Obetald',
  PAID: 'Betald',
}

export const CATEGORY_LABELS: Record<string, string> = {
  kakor: 'Kakor',
  'knäckesticks': 'Knäckesticks',
  godis: 'Godis',
  övrigt: 'Övrigt',
}
