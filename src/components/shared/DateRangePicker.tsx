'use client'

import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  startOfWeek, 
  startOfMonth, 
  endOfMonth,
  differenceInDays 
} from 'date-fns'

interface DateRangePickerProps {
  onRangeChange?: (range: DateRange | undefined) => void
  initialRange?: DateRange
  className?: string
}

export function DateRangePicker({
  className,
  onRangeChange,
  initialRange
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(initialRange || {
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [isOpen, setIsOpen] = React.useState(false)

  const shortcuts = [
    { label: 'Hoje', getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
    { label: 'Ontem', getValue: () => ({ from: startOfDay(subDays(new Date(), 1)), to: endOfDay(subDays(new Date(), 1)) }) },
    { label: 'Esta semana', getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: new Date() }) },
    { label: 'Mês atual', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
    { label: 'Últimos 30d', getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
    { label: 'Todo o período', getValue: () => undefined },
  ]

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'h-10 w-[260px] justify-start text-left font-normal border-dashed bg-background/50',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground/50" />
            <span className="text-sm">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'dd/MM/yy', { locale: ptBR })} - {format(date.to, 'dd/MM/yy', { locale: ptBR })}
                  </>
                ) : (
                  format(date.from, 'dd/MM/yy', { locale: ptBR })
                )
              ) : (
                'Todo o período'
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-4 space-y-4 max-w-[350px]">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Atalhos rápidos</p>
              <div className="flex flex-wrap gap-1.5">
                {shortcuts.map((s) => (
                  <Button 
                    key={s.label} 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-[11px] px-2.5 bg-card"
                    onClick={() => setDate(s.getValue())}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-2 bg-accent/50 rounded-lg text-sm font-medium">
               <div className="flex items-center gap-2">
                 <span>{date?.from ? format(date.from, 'dd/MM/yyyy') : 'Início'}</span>
                 <span className="text-muted-foreground">→</span>
                 <span>{date?.to ? format(date.to, 'dd/MM/yyyy') : 'Hoje'}</span>
               </div>
               {date?.from && date?.to && (
                 <span className="text-[10px] bg-background px-1.5 py-0.5 rounded border">
                   {differenceInDays(date.to, date.from) + 1} dias
                 </span>
               )}
               {!date && (
                 <span className="text-[10px] bg-background px-1.5 py-0.5 rounded border italic">
                   Histórico Completo
                 </span>
               )}
            </div>

            <div className="border rounded-md bg-card">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
                locale={ptBR}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="ghost" className="flex-1 h-9 text-xs" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button 
                className="flex-1 h-9 text-xs bg-primary text-white" 
                onClick={() => {
                  if (onRangeChange) onRangeChange(date)
                  setIsOpen(false)
                }}
              >
                Aplicar período
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
