-- PrestaCerto — retenção de pagamento (escrow via captura manual do Mercado Pago).
--
-- Problema que isso resolve: no fluxo anterior (0002), o dinheiro do cliente
-- ia direto pra conta do freelancer assim que aprovado — nada garantia que o
-- serviço seria entregue depois do pagamento. Aqui o pagamento fica
-- RETIDO pelo próprio Mercado Pago (capture_mode manual) até o cliente
-- confirmar a entrega; só então o valor é capturado e cai pro freelancer.
-- Se o cliente não confirmar em até 5 dias (limite da API do Mercado Pago
-- pra captura manual), a reserva expira e o dinheiro volta pro cliente.
--
-- Rode depois de 0002_reviews_payments_teams.sql.

alter table payments add column mp_order_id text;
alter table payments add column authorized_at timestamptz;
alter table payments add column capture_deadline timestamptz;
alter table payments add column reminder_sent_at timestamptz;

alter table payments drop constraint payments_status_check;
alter table payments add constraint payments_status_check check (
  status in (
    'pending',    -- checkout criado, aguardando o cliente preencher o cartão
    'authorized', -- cartão autorizado, dinheiro RETIDO pelo Mercado Pago
    'approved',   -- capturado — dinheiro liberado pro freelancer
    'rejected',   -- cartão recusado
    'expired',    -- cliente não confirmou em 5 dias — MP cancelou e devolveu
    'refunded'    -- estornado após disputa
  )
);

create index payments_mp_order_id_idx on payments (mp_order_id);
