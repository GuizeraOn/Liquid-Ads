import { useEffect, useState } from 'react'
import { getAcompanhamentoSemanal, getDashboardGeral, getLancamentosCompletos, getOfertas } from '@/lib/api'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { KPICards } from '@/components/dashboard/KPICards'
import { PerformanceChart } from '@/components/dashboard/PerformanceChart'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { WeeklyTable } from '@/components/dashboard/WeeklyTable'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { ClientPageWrapper } from '@/components/dashboard/ClientPageWrapper'
import { MetaCostBadge } from '@/components/dashboard/MetaCostBadge'
import { DashboardGeral, LancamentoCompleto, AcompanhamentoSemanal, Oferta } from '@/types'
import { Toaster } from '@/components/ui/sonner'
import { DateRange } from 'react-day-picker'
import { subDays, parseISO } from 'date-fns'

export default function App() {
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [dashboardGeral, setDashboardGeral] = useState<DashboardGeral[]>([])
  const [lancamentos, setLancamentos] = useState<LancamentoCompleto[]>([])
  const [semanal, setSemanal] = useState<AcompanhamentoSemanal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Simple URL parameter reading for SPA
  const [ofertaSlug, setOfertaSlug] = useState<string>('todas')
  const [range, setRange] = useState<DateRange | undefined>({ from: subDays(new Date(), 7), to: new Date() })

  const [refreshCounter, setRefreshCounter] = useState(0)

  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search)
      const slug = params.get('oferta') || 'todas'
      setOfertaSlug(slug)
      
      const from = params.get('from')
      const to = params.get('to')
      if (from && to) {
        setRange({ from: parseISO(from), to: parseISO(to) })
      }
    }

    const handleRefresh = () => {
      setRefreshCounter(prev => prev + 1)
    }

    handleLocationChange() // Initial load
    
    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('refresh-data', handleRefresh)
    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('refresh-data', handleRefresh)
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const from = range?.from ? range.from.toISOString().split('T')[0] : undefined
        const to = range?.to ? range.to.toISOString().split('T')[0] : undefined

        const [ofertasData, dashboardData, lancamentosData, semanalData] = await Promise.all([
          getOfertas(),
          getDashboardGeral(ofertaSlug, from, to),
          getLancamentosCompletos(ofertaSlug, from, to),
          getAcompanhamentoSemanal(ofertaSlug, from, to),
        ])
        setOfertas(ofertasData)
        setDashboardGeral(dashboardData)
        setLancamentos(lancamentosData)
        setSemanal(semanalData)
        setError(null)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Não foi possível conectar ao banco de dados.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ofertaSlug, refreshCounter, range])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50">
          <CardContent className="pt-6 text-center space-y-2">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Erro de Conexão</h2>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            <p className="text-xs text-red-500/80 pt-4">
              Verifique se as tabelas foram criadas corretamente no Supabase.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <main className="container mx-auto py-8 px-4 space-y-8">
        <DashboardHeader ofertas={ofertas} selectedOferta={ofertaSlug} initialRange={range} />
        
        <KPICards data={lancamentos} semanalData={semanal} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PerformanceChart data={lancamentos} />
          <div className="flex flex-col gap-4">
            <WeeklyChart data={semanal} />
            <WeeklyTable data={semanal} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Acompanhamento Diário</h2>
          <ClientPageWrapper 
            ofertas={ofertas} 
            lancamentos={lancamentos} 
          />
        </div>

        <MetaCostBadge lancamentos={lancamentos} />
      </main>
      <Toaster />
    </>
  )
}
