import { z } from 'zod'

export const lancamentoSchema = z.object({
  oferta_id: z.string().uuid('Selecione uma oferta'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  vendas_front: z.number().int().min(0, 'Vendas não pode ser negativo'),
  investimento: z.number().min(0, 'Investimento não pode ser negativo'),
  receita_usd: z.number().min(0, 'Receita não pode ser negativa'),
  cotacao_dolar: z.number().positive('Cotação deve ser positiva'),
  taxa_imposto: z.number().min(0).max(1, 'Taxa entre 0 e 1 (ex: 0.13)'),
})

export const ofertaSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto').max(100),
  cor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor hex inválida').optional().default('#3b82f6'),
  ativa: z.boolean().default(true),
})
