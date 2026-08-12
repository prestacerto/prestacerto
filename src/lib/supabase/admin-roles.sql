-- Admin Roles System
-- Controle granular de quem é admin

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin', -- 'super_admin', 'admin', 'moderator'
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only super admins can view all admins
CREATE POLICY "Super admins can view all admins" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Função para verificar se é admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE email = user_email AND role IN ('super_admin', 'admin')
  );
END;
$$ LANGUAGE plpgsql;

-- Inserir você como super admin (execute isso uma vez)
-- INSERT INTO admin_users (id, email, role, permissions)
-- SELECT id, email, 'super_admin', '["view_dashboard", "view_analytics", "manage_users", "manage_payments"]'
-- FROM auth.users
-- WHERE email = 'seu-email@aqui.com'
-- ON CONFLICT (email) DO NOTHING;
