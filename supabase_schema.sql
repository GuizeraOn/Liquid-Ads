-- Supabase Schema for Dashboard de Controle de Mídia Paga

-- 1. Tabela ofertas
CREATE TABLE ofertas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  cor VARCHAR(7) DEFAULT '#3b82f6',
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ofertas_slug ON ofertas(slug);
CREATE INDEX idx_ofertas_ativa ON ofertas(ativa);

-- 2. Tabela lancamentos_diarios
CREATE TABLE lancamentos_diarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  oferta_id UUID NOT NULL REFERENCES ofertas(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  vendas_front INTEGER DEFAULT 0,
  investimento DECIMAL(12,2) DEFAULT 0,
  taxa_imposto DECIMAL(5,4) DEFAULT 0.13,
  receita_usd DECIMAL(12,2) DEFAULT 0,
  cotacao_dolar DECIMAL(8,4) DEFAULT 5.25,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(oferta_id, data)
);

CREATE INDEX idx_lancamentos_data ON lancamentos_diarios(data);
CREATE INDEX idx_lancamentos_oferta ON lancamentos_diarios(oferta_id);
CREATE INDEX idx_lancamentos_oferta_data ON lancamentos_diarios(oferta_id, data);

-- 3. Tabela configuracoes
CREATE TABLE configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave VARCHAR(50) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO configuracoes (chave, valor) VALUES
  ('taxa_imposto_padrao', '0.13'),
  ('cotacao_dolar_padrao', '5.25'),
  ('moeda_investimento', 'BRL'),
  ('moeda_receita', 'USD'),
  ('custo_fixo_meta', '331.87');

-- 4. View: vw_lancamentos_completos
CREATE OR REPLACE VIEW vw_lancamentos_completos AS
SELECT
  ld.id,
  ld.data,
  ld.vendas_front,
  ld.investimento,
  ld.taxa_imposto,
  ld.receita_usd,
  ld.cotacao_dolar,
  o.id AS oferta_id,
  o.nome AS oferta_nome,
  o.slug AS oferta_slug,
  o.cor AS oferta_cor,
  ROUND(ld.investimento * (1 + ld.taxa_imposto), 2) AS investimento_com_imposto,
  ROUND(ld.receita_usd * ld.cotacao_dolar, 2) AS receita_brl,
  CASE
    WHEN ld.vendas_front > 0
    THEN ROUND(ld.investimento * (1 + ld.taxa_imposto) / ld.vendas_front, 2)
    ELSE 0
  END AS cpa,
  ROUND(
    (ld.receita_usd * ld.cotacao_dolar) - (ld.investimento * (1 + ld.taxa_imposto)),
    2
  ) AS lucro,
  CASE
    WHEN ld.investimento > 0
    THEN ROUND(
      (ld.receita_usd * ld.cotacao_dolar) / (ld.investimento * (1 + ld.taxa_imposto)),
      2
    )
    ELSE 0
  END AS roas,
  CASE
    WHEN ld.investimento > 0
    THEN ROUND(
      ((ld.receita_usd * ld.cotacao_dolar) - (ld.investimento * (1 + ld.taxa_imposto)))
      / (ld.investimento * (1 + ld.taxa_imposto)),
      2
    )
    ELSE 0
  END AS roi
FROM lancamentos_diarios ld
JOIN ofertas o ON o.id = ld.oferta_id
ORDER BY ld.data ASC;

-- 5. View: vw_semanal
CREATE OR REPLACE VIEW vw_semanal AS
SELECT
  o.id AS oferta_id,
  o.nome AS oferta_nome,
  o.slug AS oferta_slug,
  DATE_TRUNC('week', ld.data)::DATE AS inicio_semana,
  ROW_NUMBER() OVER (
    PARTITION BY o.id
    ORDER BY DATE_TRUNC('week', ld.data)
  ) AS numero_semana,
  ROUND(SUM(ld.investimento * (1 + ld.taxa_imposto)), 2) AS investimento_total,
  ROUND(SUM(ld.receita_usd * ld.cotacao_dolar), 2) AS receita_total,
  ROUND(
    SUM(ld.receita_usd * ld.cotacao_dolar) -
    SUM(ld.investimento * (1 + ld.taxa_imposto)),
    2
  ) AS lucro_total,
  CASE
    WHEN SUM(ld.investimento * (1 + ld.taxa_imposto)) > 0
    THEN ROUND(
      SUM(ld.receita_usd * ld.cotacao_dolar) / SUM(ld.investimento * (1 + ld.taxa_imposto)),
      2
    )
    ELSE 0
  END AS roas,
  CASE
    WHEN SUM(ld.investimento * (1 + ld.taxa_imposto)) > 0
    THEN ROUND(
      (SUM(ld.receita_usd * ld.cotacao_dolar) -
       SUM(ld.investimento * (1 + ld.taxa_imposto)))
      / SUM(ld.investimento * (1 + ld.taxa_imposto)),
      2
    )
    ELSE 0
  END AS roi
FROM lancamentos_diarios ld
JOIN ofertas o ON o.id = ld.oferta_id
WHERE ld.vendas_front > 0 OR ld.investimento > 0
GROUP BY o.id, o.nome, o.slug, DATE_TRUNC('week', ld.data)
ORDER BY inicio_semana ASC;

-- 6. View: vw_dashboard_geral
CREATE OR REPLACE VIEW vw_dashboard_geral AS
SELECT
  o.id AS oferta_id,
  o.nome AS oferta_nome,
  o.slug AS oferta_slug,
  ROUND(SUM(ld.investimento * (1 + ld.taxa_imposto)), 2) AS investimento_total,
  ROUND(SUM(ld.receita_usd), 2) AS receita_usd_total,
  ROUND(SUM(ld.receita_usd * ld.cotacao_dolar), 2) AS receita_brl_total,
  ROUND(
    SUM(ld.receita_usd * ld.cotacao_dolar) -
    SUM(ld.investimento * (1 + ld.taxa_imposto)),
    2
  ) AS lucro_total,
  CASE
    WHEN SUM(ld.investimento * (1 + ld.taxa_imposto)) > 0
    THEN ROUND(
      SUM(ld.receita_usd * ld.cotacao_dolar) / SUM(ld.investimento * (1 + ld.taxa_imposto)),
      2
    )
    ELSE 0
  END AS roas,
  CASE
    WHEN SUM(ld.investimento * (1 + ld.taxa_imposto)) > 0
    THEN ROUND(
      (SUM(ld.receita_usd * ld.cotacao_dolar) -
       SUM(ld.investimento * (1 + ld.taxa_imposto)))
      / SUM(ld.investimento * (1 + ld.taxa_imposto)),
      2
    )
    ELSE 0
  END AS roi,
  SUM(ld.vendas_front) AS total_vendas,
  COUNT(CASE WHEN ld.vendas_front > 0 THEN 1 END) AS dias_ativos
FROM lancamentos_diarios ld
JOIN ofertas o ON o.id = ld.oferta_id
GROUP BY o.id, o.nome, o.slug;

-- 7. RLS (Row Level Security) - Permite acesso total para uso pessoal
ALTER TABLE ofertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lancamentos_diarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acesso_total_ofertas" ON ofertas FOR ALL USING (true);
CREATE POLICY "acesso_total_lancamentos" ON lancamentos_diarios FOR ALL USING (true);
CREATE POLICY "acesso_total_configuracoes" ON configuracoes FOR ALL USING (true);

-- 8. Seed de Dados Iniciais (Opcional)
INSERT INTO ofertas (nome, slug, cor) VALUES ('TINNITUS', 'tinnitus', '#3b82f6');
