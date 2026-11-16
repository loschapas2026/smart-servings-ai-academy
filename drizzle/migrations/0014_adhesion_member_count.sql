CREATE OR REPLACE FUNCTION public.adhesion_members_count(_env text)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(DISTINCT pay.user_id)::int FROM public.payments pay
  JOIN public.profiles pr ON pr.id = pay.user_id
  WHERE pay.environment = _env AND pay.status = 'pago'
$$;
REVOKE ALL ON FUNCTION public.adhesion_members_count(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.adhesion_members_count(text) TO anon, authenticated, service_role;