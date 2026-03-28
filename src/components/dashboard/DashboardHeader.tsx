'use client'

import { useState } from 'react'
import { OfertaSelector } from '../shared/OfertaSelector'
import { ThemeToggle } from '../shared/ThemeToggle'
import { DateRangePicker } from '../shared/DateRangePicker'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Oferta } from '@/types'
import { EntryDialog } from '../forms/EntryDialog'
import { NewOfferDialog } from '../forms/NewOfferDialog'
import { SettingsDialog } from '../forms/SettingsDialog'
import { Settings, RefreshCcw, Loader2 } from 'lucide-react'
import { syncAllDolar } from '@/lib/api'
import { toast } from 'sonner'

import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'

interface DashboardHeaderProps {
  ofertas: Oferta[]
  selectedOferta: string | null
  initialRange?: DateRange
}

export function DashboardHeader({ ofertas, selectedOferta, initialRange }: DashboardHeaderProps) {
  const [isEntryOpen, setIsEntryOpen] = useState(false)
  const [isOfferOpen, setIsOfferOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleRangeChange = (range: DateRange | undefined) => {
    const params = new URLSearchParams(window.location.search)
    if (range?.from) {
      params.set('from', format(range.from, 'yyyy-MM-dd'))
    } else {
      params.delete('from')
    }
    if (range?.to) {
      params.set('to', format(range.to, 'yyyy-MM-dd'))
    } else {
      params.delete('to')
    }
    window.history.pushState({}, '', `?${params.toString()}`)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  async function handleSyncDolar() {
    setIsSyncing(true)
    try {
      const result = await syncAllDolar()
      toast.success(`Dólar sincronizado para R$ ${result.valor.toFixed(2)} em todo o histórico!`)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao sincronizar dólar')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Mídia</h1>
        <p className="text-muted-foreground">Acompanhamento diário de campanhas e ofertas.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row w-full items-center justify-between gap-6 bg-accent/20 p-4 rounded-2xl border border-border/50">
        {/* Grupo 1: Filtros */}
        <div className="flex items-center gap-2">
          <OfertaSelector ofertas={ofertas} selected={selectedOferta} />
          <DateRangePicker onRangeChange={handleRangeChange} initialRange={initialRange} />
        </div>
        
        {/* Grupo 2: Ações Centro */}
        <div className="flex items-center gap-3">
          <Button onClick={() => setIsEntryOpen(true)} className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20">
            <Plus className="mr-2 h-4 w-4" />
            Novo Lançamento
          </Button>
          
          <Button variant="secondary" onClick={() => setIsOfferOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Oferta
          </Button>
        </div>

        {/* Grupo 3: Config/Auxiliares */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSyncDolar} 
            disabled={isSyncing}
            className="text-xs border-dashed h-9"
          >
            {isSyncing ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-3 w-3" />
            )}
            Sincronizar Dólar
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <ThemeToggle />
        </div>
      </div>

      <EntryDialog 
        ofertas={ofertas} 
        open={isEntryOpen} 
        onOpenChange={setIsEntryOpen} 
      />
      
      <NewOfferDialog 
        open={isOfferOpen} 
        onOpenChange={setIsOfferOpen} 
      />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  )
}

