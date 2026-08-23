-- Create sales_agent_configs table
CREATE TABLE IF NOT EXISTS sales_agent_configs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_name VARCHAR(255),
  icp_description TEXT,
  target_personas TEXT[] DEFAULT ARRAY[]::TEXT[],
  prospects_per_day INTEGER DEFAULT 10,
  channels JSONB DEFAULT '{"email": true, "whatsapp": false, "linkedin": false}'::jsonb,
  schedule JSONB DEFAULT '{"monday": true, "tuesday": true, "wednesday": true, "thursday": true, "friday": true, "saturday": false, "sunday": false}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create sales_agent_leads table
CREATE TABLE IF NOT EXISTS sales_agent_leads (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  position VARCHAR(255),
  score INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, contacted, qualified, rejected, converted
  source VARCHAR(50) DEFAULT 'agent',
  notes TEXT,
  contacted_at TIMESTAMP,
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create sales_agent_messages table
CREATE TABLE IF NOT EXISTS sales_agent_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id BIGINT NOT NULL REFERENCES sales_agent_leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  channel VARCHAR(50),
  -- email, whatsapp, linkedin
  status VARCHAR(50) DEFAULT 'sent',
  -- sent, delivered, read, bounced
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create sales_agent_analytics table
CREATE TABLE IF NOT EXISTS sales_agent_analytics (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  leads_generated INTEGER DEFAULT 0,
  leads_qualified INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  messages_opened INTEGER DEFAULT 0,
  avg_response_time INTERVAL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE sales_agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_agent_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_agent_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own agent configs"
  ON sales_agent_configs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agent configs"
  ON sales_agent_configs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agent configs"
  ON sales_agent_configs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own leads"
  ON sales_agent_leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leads"
  ON sales_agent_leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
  ON sales_agent_leads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own messages"
  ON sales_agent_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics"
  ON sales_agent_analytics FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_sales_agent_configs_user_id ON sales_agent_configs(user_id);
CREATE INDEX idx_sales_agent_leads_user_id ON sales_agent_leads(user_id);
CREATE INDEX idx_sales_agent_leads_status ON sales_agent_leads(status);
CREATE INDEX idx_sales_agent_messages_user_id ON sales_agent_messages(user_id);
CREATE INDEX idx_sales_agent_messages_lead_id ON sales_agent_messages(lead_id);
CREATE INDEX idx_sales_agent_analytics_user_id ON sales_agent_analytics(user_id);
CREATE INDEX idx_sales_agent_analytics_date ON sales_agent_analytics(date);
