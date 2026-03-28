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
import { Settings } from 'lucide-react'

interface DashboardHeaderProps {
  ofertas: Oferta[]
  selectedOferta: string | null
}

export function DashboardHeader({ ofertas, selectedOferta }: DashboardHeaderProps) {
  const [isEntryOpen, setIsEntryOpen] = useState(false)
  const [isOfferOpen, setIsOfferOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Mídia</h1>
        <p className="text-muted-foreground">Acompanhamento diário de campanhas e ofertas.</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <OfertaSelector ofertas={ofertas} selected={selectedOferta} />
        <DateRangePicker />
        
        <Button onClick={() => setIsEntryOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Lançamento
        </Button>
        
        <Button variant="outline" onClick={() => setIsOfferOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Oferta
        </Button>

        <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>

        <ThemeToggle />
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

