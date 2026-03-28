import { formatCurrency } from '@/lib/formatters'

export function CurrencyDisplay({ value, currency = 'BRL' }: { value: number, currency?: 'BRL' | 'USD' }) {
  return <span>{formatCurrency(value, currency)}</span>
}
