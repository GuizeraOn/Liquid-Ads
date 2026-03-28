import { createClient } from '@/lib/supabase/client'
import { DashboardGeral, LancamentoCompleto, AcompanhamentoSemanal, Oferta, Configuracao } from '@/types'
import { lancamentoSchema, ofertaSchema } from '@/lib/validators'

// Queries
export async function getDashboardGeral(ofertaSlug?: string): Promise<DashboardGeral[]> {
  const supabase = createClient()
  let query = supabase.from('vw_dashboard_geral').select('*')
  if (ofertaSlug && ofertaSlug !== 'todas') {
    query = query.eq('oferta_slug', ofertaSlug)
  }
  const { data, error } = await query
  if (error) throw error
  return data as DashboardGeral[]
}

export async function getLancamentosCompletos(ofertaSlug?: string): Promise<LancamentoCompleto[]> {
  const supabase = createClient()
  let query = supabase
    .from('vw_lancamentos_completos')
    .select('*')
    .order('data', { ascending: false })

  if (ofertaSlug && ofertaSlug !== 'todas') {
    query = query.eq('oferta_slug', ofertaSlug)
  }
  query = query.or('investimento.gt.0,vendas_front.gt.0')

  const { data, error } = await query
  if (error) throw error
  return data as LancamentoCompleto[]
}

export async function getAcompanhamentoSemanal(ofertaSlug?: string): Promise<AcompanhamentoSemanal[]> {
  const supabase = createClient()
  let query = supabase
    .from('vw_semanal')
    .select('*')
    .order('inicio_semana', { ascending: true })

  if (ofertaSlug && ofertaSlug !== 'todas') {
    query = query.eq('oferta_slug', ofertaSlug)
  }
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
