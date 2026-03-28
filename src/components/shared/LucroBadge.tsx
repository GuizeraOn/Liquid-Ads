import { Badge } from '@/components/ui/badge'
import { LUCRO_COLORS } from '@/lib/constants'
import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function LucroBadge({ value }: { value: number }) {
  let colorKey: keyof typeof LUCRO_COLORS = 'zero'
  
  if (value > 0) colorKey = 'positivo'
  else if (value < 0) colorKey = 'negativo'

  return (
    <Badge variant="outline" className={cn(LUCRO_COLORS[colorKey], 'font-mono font-bold border-transparent')}>
      {value < 0 ? '-' : ''}{formatCurrency(Math.abs(value), 'BRL')}
    </Badge>
  )
}
