CREATE TABLE public.prompt_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL UNIQUE,
  description text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompt_categories TO authenticated;
GRANT ALL ON public.prompt_categories TO service_role;
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pcat read" ON public.prompt_categories FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_active_subscription(auth.uid()));
CREATE POLICY "pcat admin" ON public.prompt_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
INSERT INTO public.prompt_categories (label, description, position) VALUES
('Comece por aqui','O primeiro prompt de todos: logo, nome, cores, acessos e integrações. Use antes de qualquer outro.',0),
('Briefing e escopo','Antes de escrever qualquer código: entender o problema, quem usa e o que o sistema precisa fazer.',1),
('Site e vendas','Vitrine digital, cardápios, produtos, unidades e caminhos para o cliente pedir e entrar em contato.',2),
('Reservas e eventos','Reservas, capacidade, eventos, inscrições e ações especiais com regras e painel de acompanhamento.',3),
('Promoções e fidelidade','Cupons, roleta, clube de clientes, cashback e experiências que fazem o cliente voltar.',4),
('Clientes e campanhas','Cadastro único, segmentação, WhatsApp, aniversários, réguas de relacionamento e medição de resultados.',5),
('Estoque e compras','Produtos, fornecedores, contagens, sugestões, cotações, pedidos de compra e entrada de notas.',6),
('Produção e equipe','Cozinha, linha de produção, escalas, folgas, ausências e dimensionamento da operação.',7),
('Entregas e motoboys','Fila, despacho, rotas, fretes, chave Pix e fechamento diário dos entregadores.',8),
('Financeiro e administrativo','Contas a pagar, recorrências, folha, holerites, relatórios e visão gerencial.',9),
('Integrações e automações','Suitable, WhatsApp, Telegram, rotinas agendadas e conexões seguras com outros serviços.',10),
('Regras e dados','O que o sistema guarda, quem pode fazer o quê e as decisões que ele toma sozinho.',11),
('Telas e visual','Como o sistema se organiza na tela e o que a pessoa vê e lê em cada parte.',12),
('Construção','O passo a passo de geração: telas, rotinas e correções, sem quebrar o que já funciona.',13),
('Testes e qualidade','Provar que funciona, que não quebra e que não abre a porta para quem não deve.',14),
('Lançar e evoluir','Publicar com segurança, documentar e decidir o que melhorar depois.',15);