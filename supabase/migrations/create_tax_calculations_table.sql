-- Tabela para cálculos de imposto (CERTO TAX)
CREATE TABLE IF NOT EXISTS tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  month DATE NOT NULL,
  gross_income DECIMAL(10, 2) NOT NULL,
  ir_calculated DECIMAL(10, 2) DEFAULT 0,
  inss_calculated DECIMAL(10, 2) DEFAULT 0,
  other_deductions DECIMAL(10, 2) DEFAULT 0,
  liquid_income DECIMAL(10, 2) NOT NULL,
  ir_rate DECIMAL(5, 2) DEFAULT 0,
  tax_status VARCHAR(20) DEFAULT 'pending' CHECK (tax_status IN ('pending', 'calculated', 'paid', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, month)
);

-- Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_tax_user_month ON tax_calculations(user_id, month DESC);
CREATE INDEX IF NOT EXISTS idx_tax_status ON tax_calculations(tax_status) WHERE tax_status = 'pending';

-- Trigger pra updated_at
CREATE OR REPLACE FUNCTION update_tax_calculations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tax_calculations_updated_at_trigger ON tax_calculations;
CREATE TRIGGER tax_calculations_updated_at_trigger
  BEFORE UPDATE ON tax_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_tax_calculations_updated_at();

-- Tabela para armazenar histórico de cálculos
CREATE TABLE IF NOT EXISTS tax_calculation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  calculation_id UUID NOT NULL REFERENCES tax_calculations(id) ON DELETE CASCADE,
  gross_income DECIMAL(10, 2),
  ir_calculated DECIMAL(10, 2),
  inss_calculated DECIMAL(10, 2),
  liquid_income DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tax_calculations IS 'Cálculos mensais de imposto (IR + INSS) para freelancers';
COMMENT ON COLUMN tax_calculations.ir_calculated IS 'Imposto de Renda calculado (progressivo)';
COMMENT ON COLUMN tax_calculations.inss_calculated IS 'Contribuição INSS (11%)';
COMMENT ON COLUMN tax_calculations.liquid_income IS 'Renda líquida (gross - IR - INSS - deduções)';
