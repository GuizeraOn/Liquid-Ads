'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { criarLancamento, editarLancamento, getDolarHoje } from '@/lib/api'
import { lancamentoSchema } from '@/lib/validators'
import { Oferta, LancamentoCompleto } from '@/types'
import { DEFAULT_COTACAO_DOLAR, DEFAULT_TAXA_IMPOSTO } from '@/lib/constants'

type EntryFormData = z.infer<typeof lancamentoSchema>

interface EntryDialogProps {
  ofertas: Oferta[]
  initialData?: LancamentoCompleto | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EntryDialog({ ofertas, initialData, open, onOpenChange }: EntryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<EntryFormData>({
    resolver: zodResolver(lancamentoSchema),
    defaultValues: initialData ? {
      oferta_id: initialData.oferta_id,
      data: initialData.data,
      vendas_front: initialData.vendas_front,
      investimento: initialData.investimento,
      receita_usd: initialData.receita_usd,
      cotacao_dolar: initialData.cotacao_dolar,
      taxa_imposto: initialData.taxa_imposto,
    } : {
      data: new Date().toISOString().split('T')[0],
      vendas_front: 0,
      investimento: 0,
      receita_usd: 0,
      cotacao_dolar: DEFAULT_COTACAO_DOLAR,
      taxa_imposto: DEFAULT_TAXA_IMPOSTO,
    }
  })

  // Reset form when initialData changes
  useEffect(() => {
    async function updateDolar() {
      if (!initialData && open) {
        const dolar = await getDolarHoje()
        setValue('cotacao_dolar', Number(dolar.toFixed(4)))
      }
    }

    if (initialData) {
      reset({
        oferta_id: initialData.oferta_id,
        data: initialData.data,
        vendas_front: initialData.vendas_front,
        investimento: initialData.investimento,
        receita_usd: initialData.receita_usd,
        cotacao_dolar: initialData.cotacao_dolar,
        taxa_imposto: initialData.taxa_imposto,
      })
    } else {
      reset({
        data: new Date().toISOString().split('T')[0],
        vendas_front: 0,
        investimento: 0,
        receita_usd: 0,
        cotacao_dolar: DEFAULT_COTACAO_DOLAR,
        taxa_imposto: DEFAULT_TAXA_IMPOSTO,
      })
      updateDolar()
    }
  }, [initialData, reset, open, setValue])

  async function onSubmit(data: EntryFormData) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString())
      })

      if (initialData) {
        await editarLancamento(initialData.id, formData)
        toast.success('Lançamento atualizado com sucesso!')
      } else {
        await criarLancamento(formData)
        toast.success('Lançamento criado com sucesso!')
      }
      onOpenChange(false)
      if (!initialData) reset()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar lançamento')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Lançamento' : 'Novo Lançamento Diário'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-6 py-4">
            {/* Seção 1: Identificação */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Identificação</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="oferta_id" className="text-xs">Oferta</Label>
                  <Select 
                    value={watch('oferta_id')} 
                    onValueChange={(val) => setValue('oferta_id', val)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ofertas.map(o => (
                        <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.oferta_id && <p className="text-[10px] text-red-500">{errors.oferta_id.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data" className="text-xs">Data</Label>
                  <Input type="date" id="data" className="h-9" {...register('data')} />
                  {errors.data && <p className="text-[10px] text-red-500">{errors.data.message}</p>}
                </div>
              </div>
            </div>

            {/* Seção 2: Desempenho */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Desempenho</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendas_front" className="text-xs">Vendas</Label>
                  <Input type="number" id="vendas_front" className="h-9" {...register('vendas_front', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investimento" className="text-xs">Investimento (R$)</Label>
                  <Input type="number" step="0.01" id="investimento" className="h-9" {...register('investimento', { valueAsNumber: true })} />
                </div>
              </div>
            </div>

            {/* Seção 3: Receita */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Receita</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receita_usd" className="text-xs">Receita (U$)</Label>
                  <Input type="number" step="0.01" id="receita_usd" className="h-9" {...register('receita_usd', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cotacao_dolar" className="text-xs">Cotação do dólar</Label>
                  <div className="space-y-1">
                    <Input type="number" step="0.0001" id="cotacao_dolar" className="h-9" {...register('cotacao_dolar', { valueAsNumber: true })} />
                    <p className="text-[10px] text-muted-foreground italic">atualizado automaticamente</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxa_imposto" className="text-xs">Taxa de imposto</Label>
                <div className="space-y-1">
                  <Input type="number" step="0.01" id="taxa_imposto" className="h-9" {...register('taxa_imposto', { valueAsNumber: true })} />
                  <p className="text-[10px] text-muted-foreground italic">ex: 0,13 = 13%</p>
                </div>
              </div>
            </div>

            {/* Seção 4: Preview de Cálculos */}
            <div className="rounded-xl border bg-accent/30 p-4 space-y-4">
              <div className="grid grid-cols-2 gap-y-4">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Receita bruta (R$)</p>
                  <p className="text-sm font-bold">R$ {((watch('receita_usd') || 0) * (watch('cotacao_dolar') || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">C/ imposto (R$)</p>
                  <p className="text-sm font-bold">R$ {((watch('investimento') || 0) * (1 + (watch('taxa_imposto') || 0))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Lucro (R$)</p>
                  <p className={cn(
                    "text-sm font-bold",
                    ((watch('receita_usd') || 0) * (watch('cotacao_dolar') || 0)) - ((watch('investimento') || 0) * (1 + (watch('taxa_imposto') || 0))) >= 0 
                      ? "text-emerald-500" 
                      : "text-red-500"
                  )}>
                    R$ {(((watch('receita_usd') || 0) * (watch('cotacao_dolar') || 0)) - ((watch('investimento') || 0) * (1 + (watch('taxa_imposto') || 0)))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">ROAS</p>
                  <p className="text-sm font-bold">
                    {(() => {
                      const totalInvest = (watch('investimento') || 0) * (1 + (watch('taxa_imposto') || 0));
                      const totalRec = (watch('receita_usd') || 0) * (watch('cotacao_dolar') || 0);
                      const roas = totalInvest > 0 ? (totalRec - totalInvest) / totalInvest : 0;
                      return roas.toFixed(2);
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar lançamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
