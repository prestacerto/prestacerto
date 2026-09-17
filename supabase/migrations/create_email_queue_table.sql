-- Tabela para fila de e-mails automáticos
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  email VARCHAR(254) NOT NULL,
  sequence VARCHAR(20) NOT NULL CHECK (sequence IN ('CLIENTE', 'PRESTADOR')),
  step INTEGER NOT NULL CHECK (step >= 0 AND step <= 4),
  send_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_email_queue_status_send_at ON email_queue(status, send_at)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_user_sequence ON email_queue(user_id, sequence)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON email_queue(created_at DESC);

-- Função pra atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_email_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pra updated_at
DROP TRIGGER IF EXISTS email_queue_updated_at_trigger ON email_queue;
CREATE TRIGGER email_queue_updated_at_trigger
  BEFORE UPDATE ON email_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_email_queue_updated_at();

-- Comentários pra documentação
COMMENT ON TABLE email_queue IS 'Fila de e-mails automáticos pra sequências de onboarding (CLIENTE e PRESTADOR)';
COMMENT ON COLUMN email_queue.sequence IS 'CLIENTE: sequência pra clientes | PRESTADOR: sequência pra prestadores';
COMMENT ON COLUMN email_queue.step IS '0-4: posição na sequência (0=welcome, 1=day1, 2=day3, 3=day5, 4=day7)';
COMMENT ON COLUMN email_queue.status IS 'pending: aguardando envio | sent: enviado com sucesso | failed: erro ao enviar';
