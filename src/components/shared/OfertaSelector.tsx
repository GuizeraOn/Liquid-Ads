'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Oferta } from '@/types'

interface OfertaSelectorProps {
  ofertas: Oferta[]
  selected: string | null
}

export function OfertaSelector({ ofertas, selected }: OfertaSelectorProps) {
  function handleChange(value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value === 'todas') {
      params.delete('oferta')
    } else {
      params.set('oferta', value)
    }
    // Update URL without reloading
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({ path: newUrl }, '', newUrl)
    // Dispatch a custom event to notify App.tsx
    window.dispatchEvent(new Event('popstate'))
  }

  return (
    <Select value={selected || 'todas'} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px] bg-background">
        <SelectValue placeholder="Todas as Ofertas" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todas">Todas as Ofertas</SelectItem>
        {ofertas.map(o => (
          <SelectItem key={o.slug} value={o.slug}>
            <span className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: o.cor }}
              />
              {o.nome}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
