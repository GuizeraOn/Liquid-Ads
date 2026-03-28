import { createClient } from '@/lib/supabase/client'
import { DashboardGeral, LancamentoCompleto, AcompanhamentoSemanal, Oferta, Configuracao } from '@/types'
import { lancamentoSchema, ofertaSchema } from '@/lib/validators'

// Queries
export async function getDashboardGeral(ofertaSlug?: string, start?: string, end?: string): Promise<DashboardGeral[]> {
  const supabase = createClient()
  let query = supabase.from('vw_dashboard_geral').select('*')
  if (ofertaSlug && ofertaSlug !== 'todas') {
    query = query.eq('oferta_slug', ofertaSlug)
  }
  if (start) query = query.gte('data', start)
  if (end) query = query.lte('data', end)
  
  const { data, error } = await query
  if (error) throw error
  return data as DashboardGeral[]
}

export async function getLancamentosCompletos(ofertaSlug?: string, start?: string, end?: string): Promise<LancamentoCompleto[]> {
  const supabase = createClient()
  let query = supabase
    .from('vw_lancamentos_completos')
    .select('*')
    .order('data', { ascending: false })

  if (ofertaSlug && ofertaSlug !== 'todas') {
    query = query.eq('oferta_slug', ofertaSlug)
  }
  if (start) query = query.gte('data', start)
  if (end) query = query.lte('data', end)
  
  query = query.or('investimento.gt.0,vendas_front.gt.0')

  const { data, error } = await query
  if (error) throw error
  return data as LancamentoCompleto[]
}

export async function getAcompanhamentoSemanal(ofertaSlug?: string, start?: string, end?: string): Promise<AcompanhamentoSemanal[]> {
  const supabase = createClient()
  let query = supabase
    .from('vw_semanal')
    .select('*')
    .order('inicio_semana', { ascending: true })

  if (ofertaSlug && ofertaSlug !== 'todas') {
    query = query.eq('oferta_slug', ofertaSlug)
  }
  if (start) query = query.gte('inicio_semana', start)
  if (end) query = query.lte('inicio_semana', end)
  
  const { data, error } = await query
  if (error) throw error
  return data as AcompanhamentoSemanal[]
}

export async function getOfertas(): Promise<Oferta[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ofertas')
    .select('*')
    .eq('ativa', true)
    .order('nome')

  if (error) throw error
  return data as Oferta[]
}

export async function getConfiguracoes(): Promise<Configuracao[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('configuracoes').select('*')
  if (error) throw error
  return data as Configuracao[]
}

export async function getDolarHoje(): Promise<number> {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL')
    const data = await response.json()
    return Number(data.USDBRL.bid)
  } catch (error) {
    console.error('Erro ao buscar dólar:', error)
    return 5.25 // Fallback
  }
}


// Mutations
export async function criarLancamento(formData: FormData) {
  const supabase = createClient()
  const raw = {
    oferta_id: formData.get('oferta_id') as string,
    data: formData.get('data') as string,
    vendas_front: Number(formData.get('vendas_front')),
    investimento: Number(formData.get('investimento')),
    receita_usd: Number(formData.get('receita_usd')),
    cotacao_dolar: Number(formData.get('cotacao_dolar')),
    taxa_imposto: Number(formData.get('taxa_imposto')),
  }
  const validated = lancamentoSchema.parse(raw)
  const { error } = await supabase.from('lancamentos_diarios').insert(validated)
  if (error) throw new Error(error.message)
  window.dispatchEvent(new Event('refresh-data'))
  return { success: true }
}

export async function editarLancamento(id: string, formData: FormData) {
  const supabase = createClient()
  const raw = {
    oferta_id: formData.get('oferta_id') as string,
    data: formData.get('data') as string,
    vendas_front: Number(formData.get('vendas_front')),
    investimento: Number(formData.get('investimento')),
    receita_usd: Number(formData.get('receita_usd')),
    cotacao_dolar: Number(formData.get('cotacao_dolar')),
    taxa_imposto: Number(formData.get('taxa_imposto')),
  }
  const validated = lancamentoSchema.parse(raw)
  const { error } = await supabase.from('lancamentos_diarios').update(validated).eq('id', id)
  if (error) throw new Error(error.message)
  window.dispatchEvent(new Event('refresh-data'))
  return { success: true }
}

export async function deletarLancamento(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from('lancamentos_diarios').delete().eq('id', id)
  if (error) throw new Error(error.message)
  window.dispatchEvent(new Event('refresh-data'))
  return { success: true }
}

export async function criarOferta(formData: FormData) {
  const supabase = createClient()
  const raw = {
    nome: formData.get('nome') as string,
    cor: formData.get('cor') as string || '#3b82f6',
    ativa: formData.get('ativa') === 'true',
  }
  const validated = ofertaSchema.parse(raw)
  const slug = validated.nome.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  const { error } = await supabase.from('ofertas').insert({ ...validated, slug })
  if (error) throw new Error(error.message)
  window.dispatchEvent(new Event('refresh-data'))
  return { success: true }
}

export async function atualizarConfiguracoes(configuracoes: Record<string, string>) {
  const supabase = createClient()
  const promises = Object.entries(configuracoes).map(([chave, valor]) => {
    return supabase.from('configuracoes').update({ valor }).eq('chave', chave)
  })
  
  await Promise.all(promises)
  window.dispatchEvent(new Event('refresh-data'))
  return { success: true }
}

export async function syncAllDolar() {
  const supabase = createClient()
  
  // 1. Pega a cotação real
  const dolar = await getDolarHoje()
  
  if (!dolar || dolar <= 0) {
    throw new Error('Não foi possível obter uma cotação válida do dólar.')
  }

  // 2. Atualiza TODOS os lançamentos de uma vez
  const { error } = await supabase
    .from('lancamentos_diarios')
    .update({ cotacao_dolar: dolar, updated_at: new Date().toISOString() })
    .neq('id', '00000000-0000-0000-0000-000000000000') // Truque para dar update em todos sem filtrar por ID específico

  if (error) throw error
  
  window.dispatchEvent(new Event('refresh-data'))
  return { success: true, valor: dolar }
}
