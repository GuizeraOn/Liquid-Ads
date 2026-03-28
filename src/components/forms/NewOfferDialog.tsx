'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { criarOferta } from '@/lib/api'
import { ofertaSchema } from '@/lib/validators'

type OfferFormData = z.infer<typeof ofertaSchema>

interface NewOfferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewOfferDialog({ open, onOpenChange }: NewOfferDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<OfferFormData>({
    resolver: zodResolver(ofertaSchema) as any,
    defaultValues: {
      cor: '#3b82f6',
      ativa: true
    }
  })

  async function onSubmit(data: OfferFormData) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('nome', data.nome)
      formData.append('cor', data.cor || '#3b82f6')
      formData.append('ativa', 'true')

      await criarOferta(formData)
      toast.success('Oferta criada com sucesso!')
      onOpenChange(false)
      reset()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar oferta')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Nova Oferta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Oferta</Label>
            <Input id="nome" placeholder="Ex: TINNITUS" {...register('nome')} />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cor">Cor de Identificação</Label>
            <div className="flex gap-2">
              <Input type="color" id="cor" className="w-12 h-10 p-1" {...register('cor')} />
              <Input type="text" value={register('cor').name} disabled className="flex-1" />
            </div>
            {errors.cor && <p className="text-sm text-red-500">{errors.cor.message}</p>}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Oferta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
