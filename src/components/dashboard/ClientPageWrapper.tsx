'use client'

import { useState } from 'react'
import { DailyTable } from '@/components/dashboard/DailyTable'
import { EntryDialog } from '@/components/forms/EntryDialog'
import { Oferta, LancamentoCompleto } from '@/types'

interface ClientPageWrapperProps {
  ofertas: Oferta[]
  lancamentos: LancamentoCompleto[]
}

export function ClientPageWrapper({ ofertas, lancamentos }: ClientPageWrapperProps) {
  const [editingEntry, setEditingEntry] = useState<LancamentoCompleto | null>(null)

  return (
    <>
      <DailyTable 
        data={lancamentos} 
        onEdit={(entry) => setEditingEntry(entry)} 
      />
      
      <EntryDialog 
        ofertas={ofertas}
        initialData={editingEntry}
        open={!!editingEntry}
        onOpenChange={(open) => {
          if (!open) setEditingEntry(null)
        }}
      />
    </>
  )
}
