export interface Oferta {
  id: string
  nome: string
  slug: string
  cor: string
  ativa: boolean
  created_at: string
  updated_at: string
}

export interface LancamentoDiario {
  id: string
  oferta_id: string
  data: string
  vendas_front: number
  investimento: number
  taxa_imposto: number
  receita_usd: number
  cotacao_dolar: number
  created_at: string
  updated_at: string
}

export interface LancamentoCompleto {
  id: string
  data: string
  vendas_front: number
  investimento: number
  taxa_imposto: number
  receita_usd: number
  cotacao_dolar: number
  oferta_id: string
  oferta_nome: string
  oferta_slug: string
  oferta_cor: string
  investimento_com_imposto: number
  receita_brl: number
  cpa: number
  lucro: number
  roas: number
}

export interface AcompanhamentoSemanal {
  oferta_id: string
  oferta_nome: string
  oferta_slug: string
  inicio_semana: string
  numero_semana: number
  investimento_total: number
  receita_total: number
  lucro_total: number
  roas: number
}

export interface DashboardGeral {
  oferta_id: string
  oferta_nome: string
  oferta_slug: string
  investimento_total: number
  receita_usd_total: number
  receita_brl_total: number
  lucro_total: number
  roas: number
  total_vendas: number
  dias_ativos: number
}

export interface Configuracao {
  id: string
  chave: string
  valor: string
  updated_at: string
}
