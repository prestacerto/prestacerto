-- Tabela de streaks do usuário
CREATE TABLE IF NOT EXISTS user_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer DEFAULT 0,
  max_streak integer DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  bonus_claimed_at TIMESTAMP,
  bonus_balance integer DEFAULT 0, -- em centavos
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Tabela de atividades diárias
CREATE TABLE IF NOT EXISTS daily_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'login', 'proposal', 'project_created', etc
  activity_date DATE DEFAULT CURRENT_DATE,
  activity_count integer DEFAULT 1,
  bonus_earned integer DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Índices
CREATE INDEX idx_streaks_user ON user_streaks(user_id);
CREATE INDEX idx_activities_user ON daily_activities(user_id, activity_date);

-- RLS
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own streaks"
  ON user_streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = user_id);

-- Função para atualizar streak (executar diariamente)
CREATE OR REPLACE FUNCTION update_user_streaks()
RETURNS void AS $$
DECLARE
  v_user_id uuid;
  v_current_streak integer;
  v_bonus integer;
BEGIN
  FOR v_user_id IN
    SELECT DISTINCT user_id FROM daily_activities
    WHERE activity_date = CURRENT_DATE
  LOOP
    -- Buscar streak atual
    SELECT current_streak INTO v_current_streak
    FROM user_streaks
    WHERE user_id = v_user_id;

    IF v_current_streak IS NULL THEN
      v_current_streak := 0;
    END IF;

    -- Se teve atividade hoje, incrementar streak
    IF EXISTS (
      SELECT 1 FROM daily_activities
      WHERE user_id = v_user_id
      AND activity_date = CURRENT_DATE
    ) THEN
      v_current_streak := v_current_streak + 1;

      -- Calcular bonus (a cada 7 dias)
      IF v_current_streak % 7 = 0 THEN
        v_bonus := 5000; -- R$ 50
      ELSIF v_current_streak % 3 = 0 THEN
        v_bonus := 1000; -- R$ 10
      ELSE
        v_bonus := 0;
      END IF;

      -- Atualizar streak
      UPDATE user_streaks
      SET
        current_streak = v_current_streak,
        max_streak = CASE WHEN v_current_streak > max_streak THEN v_current_streak ELSE max_streak END,
        last_activity_date = CURRENT_DATE,
        bonus_balance = bonus_balance + v_bonus,
        updated_at = now()
      WHERE user_id = v_user_id;
    ELSE
      -- Resetar streak se não teve atividade
      UPDATE user_streaks
      SET current_streak = 0, updated_at = now()
      WHERE user_id = v_user_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Função para registrar atividade
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id uuid,
  p_activity_type TEXT
)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_activities (user_id, activity_type, activity_date)
  VALUES (p_user_id, p_activity_type, CURRENT_DATE)
  ON CONFLICT (user_id, activity_type, activity_date)
  DO UPDATE SET activity_count = activity_count + 1;

  -- Se não tem streak record, criar
  INSERT INTO user_streaks (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- View para obter streak info formatado
CREATE OR REPLACE VIEW user_streak_info AS
SELECT
  s.user_id,
  s.current_streak,
  s.max_streak,
  s.bonus_balance,
  CASE
    WHEN s.current_streak % 7 = 0 THEN 7
    ELSE 7 - (s.current_streak % 7)
  END as days_until_bonus,
  CASE
    WHEN s.current_streak % 7 = 0 THEN 5000
    WHEN s.current_streak % 3 = 0 THEN 1000
    ELSE 0
  END as next_bonus_amount
FROM user_streaks s;
