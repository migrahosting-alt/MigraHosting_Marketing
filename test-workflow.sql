-- Get existing tenant or use first one
DO $$
DECLARE
  v_tenant_id UUID;
  v_user_id UUID;
BEGIN
  -- Get first tenant
  SELECT tenant_id INTO v_tenant_id FROM tenants LIMIT 1;
  
  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'No tenants found. Please create a tenant first.';
  END IF;
  
  -- Get first user for this tenant
  SELECT user_id INTO v_user_id FROM users WHERE tenant_id = v_tenant_id LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found for tenant. Please create a user first.';
  END IF;
  
  -- Create workflow
  INSERT INTO workflows (workflow_id, tenant_id, name, description, enabled, trigger, steps, created_by) 
  VALUES (
    gen_random_uuid(), 
    v_tenant_id, 
    'Test Workflow API', 
    'Testing workflows endpoint', 
    true, 
    '{"type":"event","conditions":{}}', 
    '[{"id":"step1","type":"action","config":{"action":"log","message":"Test"}}]', 
    v_user_id
  );
  
  RAISE NOTICE 'Created workflow for tenant: %', v_tenant_id;
END $$;

-- Verify
SELECT w.workflow_id, w.name, w.enabled, w.created_at 
FROM workflows w
LIMIT 5;
