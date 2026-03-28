import { useEffect, useState } from 'react'
import { getConfiguracoes } from '@/lib/api'

export function MetaCostBadge() {
  const [custo, setCusto] = useState('331.87')

  useEffect(() => {
    async function loadCusto() {
      try {
        const config = await getConfiguracoes()
        const found = config.find(c => c.chave === 'custo_fixo_meta')
        if (found) setCusto(found.valor)
      } catch (e) {
        // Ignorar erro silenciosamente para não quebrar a página
      }
    }
    loadCusto()
    
    // Escutar eventos de atualização (quando Settings Dialog salva)
    window.addEventListener('refresh-data', loadCusto)
    return () => window.removeEventListener('refresh-data', loadCusto)
  }, [])

  return (
    <div className="pt-8 flex justify-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium text-muted-foreground shadow-sm transition-all hover:bg-muted/80">
        <span>💰 "pro mark zuckerberg"</span>
        <span className="font-mono text-foreground">— R$ {Number(custo).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mês</span>
      </div>
    </div>
  )
}
