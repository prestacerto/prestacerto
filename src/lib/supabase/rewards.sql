-- Surprise Rewards System
-- Dopamine hits aleatórios para manter usuário viciado

CREATE TABLE IF NOT EXISTS surprise_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL, -- 'bonus_credit', 'streak_multiplier', 'project_boost', 'featured_hour'
  amount integer, -- em centavos
  multiplier numeric DEFAULT 1.0,
  description TEXT,
  claimed_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS smart_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  notification_type TEXT, -- 'project_match', 'reward', 'streak_warning', 'social_proof', 'urgency'
  optimal_send_time TIMESTAMP,
  sent_at TIMESTAMP,
  clicked_at TIMESTAMP,
  priority INTEGER DEFAULT 1, -- 1=low, 5=high
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_proof_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'project_completed', 'milestone_reached', 'rating_increased', 'reward_claimed'
  description TEXT,
  amount_value numeric,
  visibility TEXT DEFAULT 'public', -- 'private', 'friends', 'public'
  created_at TIMESTAMP DEFAULT now()
);

-- Índices
CREATE INDEX idx_rewards_user ON surprise_rewards(user_id);
CREATE INDEX idx_rewards_claimed ON surprise_rewards(claimed_at);
CREATE INDEX idx_notifications_user ON smart_notifications(user_id);
CREATE INDEX idx_notifications_optimal ON smart_notifications(optimal_send_time);
CREATE INDEX idx_social_proof_freelancer ON social_proof_events(freelancer_id);

-- RLS
ALTER TABLE surprise_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_proof_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own rewards" ON surprise_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can claim own rewards" ON surprise_rewards FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON smart_notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own social proof" ON social_proof_events FOR SELECT USING (auth.uid() = freelancer_id OR visibility = 'public');

-- Função para distribuir surprise rewards aleatoriamente
CREATE OR REPLACE FUNCTION distribute_surprise_rewards()
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  v_reward_type TEXT;
  v_amount INTEGER;
BEGIN
  -- A cada 50 logins, distribuir recompensa aleatória
  FOR v_user_id IN
    SELECT DISTINCT user_id FROM daily_activities
    WHERE activity_date = CURRENT_DATE
  LOOP
    -- 10% de chance de receber surprise reward
    IF RANDOM() < 0.10 THEN
      v_reward_type := ARRAY['bonus_credit', 'streak_multiplier', 'project_boost', 'featured_hour'][FLOOR(RANDOM() * 4) + 1];

      CASE v_reward_type
        WHEN 'bonus_credit' THEN v_amount := 2500; -- R$ 25
        WHEN 'streak_multiplier' THEN v_amount := NULL;
        WHEN 'project_boost' THEN v_amount := NULL;
        WHEN 'featured_hour' THEN v_amount := NULL;
      END CASE;

      INSERT INTO surprise_rewards (user_id, reward_type, amount, description, expires_at)
      VALUES (
        v_user_id,
        v_reward_type,
        v_amount,
        '🎁 Você ganhou um ' || v_reward_type || ' por ser incrível!',
        NOW() + INTERVAL '7 days'
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Função para enviar notificações inteligentes em horários ótimos
CREATE OR REPLACE FUNCTION send_smart_notifications()
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  v_optimal_hour INTEGER;
  v_notification_type TEXT;
BEGIN
  -- Enviar notificações em horários ótimos (12h, 17h, 20h, 22h)
  FOR v_user_id IN
    SELECT DISTINCT user_id FROM daily_activities
    WHERE activity_date = CURRENT_DATE - INTERVAL '1 day'
  LOOP
    v_optimal_hour := ARRAY[12, 17, 20, 22][FLOOR(RANDOM() * 4) + 1];
    v_notification_type := ARRAY['project_match', 'reward', 'urgency'][FLOOR(RANDOM() * 3) + 1];

    INSERT INTO smart_notifications (
      user_id,
      title,
      message,
      notification_type,
      optimal_send_time,
      priority
    ) VALUES (
      v_user_id,
      CASE v_notification_type
        WHEN 'project_match' THEN '🎯 Projeto perfeito para você!'
        WHEN 'reward' THEN '🎁 Você tem uma recompensa aguardando!'
        WHEN 'urgency' THEN '⏰ 2 horas para expirar!'
      END,
      CASE v_notification_type
        WHEN 'project_match' THEN 'Encontrei um projeto com 95%+ compatibilidade'
        WHEN 'reward' THEN 'Seu streak ativou um bonus especial'
        WHEN 'urgency' THEN 'Este projeto fecha em breve, corre!'
      END,
      v_notification_type,
      NOW() + INTERVAL '1 day' * v_optimal_hour / 24,
      CASE v_notification_type
        WHEN 'urgency' THEN 5
        WHEN 'reward' THEN 4
        ELSE 2
      END
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- View para social proof em tempo real
CREATE OR REPLACE VIEW social_proof_feed AS
SELECT
  spe.id,
  spe.freelancer_id,
  spe.event_type,
  spe.description,
  spe.amount_value,
  spe.created_at,
  p.full_name as freelancer_name
FROM social_proof_events spe
LEFT JOIN public.profiles p ON p.id = spe.freelancer_id
WHERE spe.visibility = 'public'
AND spe.created_at >= NOW() - INTERVAL '24 hours'
ORDER BY spe.created_at DESC
LIMIT 50;
