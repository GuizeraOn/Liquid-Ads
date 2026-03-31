import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { getConfiguracoes, atualizarConfiguracoes } from '@/lib/api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [settings, setSettings] = useState({
    taxa_imposto_padrao: '0.13',
    cotacao_dolar_padrao: '5.25',
    custo_fixo_meta: '331.87'
  })

  useEffect(() => {
    if (open) {
      loadSettings()
    }
  }, [open])

  async function loadSettings() {
    setLoading(true)
    try {
      const data = await getConfiguracoes()
      const newSettings = { ...settings }
      data.forEach(item => {
        if (item.chave in newSettings) {
          newSettings[item.chave as keyof typeof newSettings] = item.valor
        }
      })
      setSettings(newSettings)
    } catch (error) {
      toast.error('Erro ao carregar configurações.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await atualizarConfiguracoes(settings)
      toast.success('Configurações salvas com sucesso!')
      onOpenChange(false)
    } catch (error) {
      toast.error('Erro ao salvar configurações.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações do Dashboard</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="taxa_imposto">Taxa de Imposto Padrão (Decimal)</Label>
              <Input 
                id="taxa_imposto"
                type="number"
                step="0.01"
                min="0"
                value={settings.taxa_imposto_padrao}
                onChange={(e) => setSettings({ ...settings, taxa_imposto_padrao: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Ex: 0.13 para 13%</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cotacao">Cotação do Dólar Padrão (R$)</Label>
              <Input 
                id="cotacao"
                type="number"
                step="0.0001"
                min="0"
                value={settings.cotacao_dolar_padrao}
                onChange={(e) => setSettings({ ...settings, cotacao_dolar_padrao: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custo_meta">Custo Fixo Meta - Mark Zuckerberg (R$)</Label>
              <Input 
                id="custo_meta"
                type="number"
                step="0.01"
                min="0"
                value={settings.custo_fixo_meta}
                onChange={(e) => setSettings({ ...settings, custo_fixo_meta: e.target.value })}
              />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Configurações
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
