-- Both legacy functions reference public.user_connects explicitly.
ALTER FUNCTION public.handle_new_user_connects() SET search_path = '';
ALTER FUNCTION public.reset_monthly_connects() SET search_path = '';
