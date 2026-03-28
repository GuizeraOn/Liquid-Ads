'use client'

import { useState, useEffect } from 'react'
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oferta_id">Oferta</Label>
              <Select 
                value={watch('oferta_id')} 
                onValueChange={(val) => setValue('oferta_id', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {ofertas.map(o => (
                    <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.oferta_id && <p className="text-sm text-red-500">{errors.oferta_id.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data</Label>
              <Input type="date" id="data" {...register('data')} />
              {errors.data && <p className="text-sm text-red-500">{errors.data.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendas_front">Vendas Front</Label>
              <Input type="number" id="vendas_front" {...register('vendas_front', { valueAsNumber: true })} />
              {errors.vendas_front && <p className="text-sm text-red-500">{errors.vendas_front.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="investimento">Investimento (R$)</Label>
              <Input type="number" step="0.01" id="investimento" {...register('investimento', { valueAsNumber: true })} />
              {errors.investimento && <p className="text-sm text-red-500">{errors.investimento.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receita_usd">Receita (U$)</Label>
              <Input type="number" step="0.01" id="receita_usd" {...register('receita_usd', { valueAsNumber: true })} />
              {errors.receita_usd && <p className="text-sm text-red-500">{errors.receita_usd.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cotacao_dolar">Cotação Dólar (R$)</Label>
              <Input type="number" step="0.0001" id="cotacao_dolar" {...register('cotacao_dolar', { valueAsNumber: true })} />
              {errors.cotacao_dolar && <p className="text-sm text-red-500">{errors.cotacao_dolar.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxa_imposto">Taxa Imposto (ex: 0.13 para 13%)</Label>
            <Input type="number" step="0.01" id="taxa_imposto" {...register('taxa_imposto', { valueAsNumber: true })} />
            {errors.taxa_imposto && <p className="text-sm text-red-500">{errors.taxa_imposto.message}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Lançamento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
