import { Badge } from '@/components/ui/badge'
import { ROAS_BG_COLORS, ROAS_COLORS } from '@/lib/constants'
import { formatNumber } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function ROASBadge({ value }: { value: number }) {
  let colorKey: keyof typeof ROAS_COLORS = 'pessimo'
  
  if (value >= 2.5) colorKey = 'excelente'
  else if (value >= 1.5) colorKey = 'bom'
  else if (value >= 1.0) colorKey = 'regular'
  else if (value >= 0.5) colorKey = 'ruim'

  return (
    <Badge variant="outline" className={cn(ROAS_COLORS[colorKey], ROAS_BG_COLORS[colorKey], 'font-mono font-bold')}>
      {formatNumber(value)}
    </Badge>
  )
}
