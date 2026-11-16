insert into public.contents (type,title,summary,body,category,published,position,thumbnail_url)
select v.type::public.content_type,v.title,v.summary,v.body,v.category,true,v.position,v.thumbnail_url
from (values
('prompt','Contas a pagar com lançamento rápido','Controle descrição, categoria, vencimento e pagamento sem sair do fluxo.',$prompt$1. OBJETIVO
Crie contas a pagar para [NOME DO RESTAURANTE].

2. LANÇAMENTO
Campos descrição, fornecedor/beneficiário, categoria, valor, vencimento, nota fiscal e observação. Permita criar categoria no próprio formulário e marcar “já pago” com data e forma [FORMAS DE PAGAMENTO].

3. VALOR
Aceite expressões simples como =345+22 e =100*1.1 com parser seguro de operações básicas; nunca execute código digitado. Converta para centavos e mostre o resultado antes de salvar.

4. GESTÃO
Filtre por status, categoria, período e fornecedor; permita pagar, desfazer pagamento e excluir com confirmação e trilha. Não apresente a tela como execução bancária se ela apenas controla obrigações.

5. TESTES
Teste valor zero/negativo, expressão inválida, já pago, desfazer e duplo clique. Apenas papel financeiro acessa dados e ações.$prompt$,'Financeiro e administrativo',1,'blocos/financeiro-admin.png'),
('prompt','Contas recorrentes, fluxo semanal e boletos DDA','Gere despesas mensais e reúna boletos e vencimentos em uma visão.',$prompt$1. OBJETIVO
Crie recorrências e fluxo financeiro para [NOME DO RESTAURANTE].

2. RECORRÊNCIAS
Cadastre aluguel, utilidades e outras despesas com valor, dia, categoria e ativo. Gere contas do mês sob confirmação com chave única por recorrência/competência para evitar duplicar.

3. FLUXO
Mostre semana e mês com previsto, pago, vencido e ajuda de custo virtual antes da folha. Diferencie previsão de lançamento definitivo e permita gerar a conta a partir do item.

4. DDA
Integre [PLUGGY OU OUTRO] para consultar boletos, sincronizar e decidir quais viram contas. Tokens ficam no servidor; erro bancário não apaga contas manuais. Não afirme pagamento bancário sem confirmação.

5. TESTES
Teste geração repetida, virada de mês, recorrência inativa, boleto duplicado e desconexão. Alertas usam fuso [FUSO] e deduplicação por conta/etapa.$prompt$,'Financeiro e administrativo',2,'blocos/financeiro-admin.png'),
('prompt','Folha simples e ajuda de custo recorrente','Gere pagamentos de funcionários ativos e benefícios mensais sem duplicar.',$prompt$1. OBJETIVO
Crie folha simples para [NOME DO RESTAURANTE].

2. FUNCIONÁRIOS
Cadastre nome, cargo, salário/base, dia de pagamento, ativo, ajuda de custo ativa e valor [VALOR PADRÃO]. Funcionário inativo não gera novos pagamentos.

3. COMPETÊNCIA
Gere folha mensal sob confirmação com chave única por funcionário/competência/tipo. Ajuda de custo aparece como previsão no fluxo antes da geração e vira lançamento somente na data e regra [DIA].

4. ALTERAÇÕES
Permita revisar antes de confirmar e recalcular somente competência aberta. Pagamento efetuado exige estorno ou novo ajuste, não exclusão silenciosa.

5. TESTES
Teste funcionário ativo/inativo, benefício ligado/desligado, geração duplicada, virada de mês e alteração salarial futura. Não faça cálculo tributário sem regras fornecidas e revisão profissional.$prompt$,'Financeiro e administrativo',3,'blocos/financeiro-admin.png'),
('prompt','Holerites em PDF com portal seguro do funcionário','Divida documentos por pessoa e disponibilize downloads individuais protegidos.',$prompt$1. OBJETIVO
Crie distribuição de holerites para [NOME DO RESTAURANTE].

2. IMPORTAÇÃO
Admin envia PDF único ou lote; o sistema separa páginas por funcionário e mostra associações para revisão. Itens não reconhecidos podem ser vinculados manualmente antes de publicar.

3. ARMAZENAMENTO
Guarde PDFs em bucket privado com caminho por funcionário/competência. Arquivo, registro e notificação precisam de fluxo recuperável para não deixar holerite órfão.

4. PORTAL
Funcionário acessa com [LOGIN INDIVIDUAL OU CPF + CREDENCIAL FORTE], valida no servidor e recebe URL assinada curta. Evite senha de quatro dígitos como única proteção; aplique rate limit e não liste outros funcionários.

5. ENVIO E TESTES
Notifique por [WHATSAPP/TELEGRAM] sem anexar dados salariais na mensagem. Teste nome parecido, CPF inválido, PDF repetido, link expirado e tentativa de acessar documento alheio.$prompt$,'Financeiro e administrativo',4,'blocos/financeiro-admin.png'),
('prompt','Relatórios gerenciais e projeção de vendas','Visualize estoque, compras, vendas, finanças e tempos com cálculos transparentes.',$prompt$1. OBJETIVO
Crie relatórios gerenciais para [NOME DO RESTAURANTE].

2. INDICADORES
Valor de estoque por categoria = saldo × último preço, identificando que não é custo médio contábil. Compras por fornecedor = soma das entradas; mostre total geral separado do ranking top 10.

3. VENDAS
Compare períodos, salão/delivery e produtos por dia. Projeção mensal usa média por dia da semana até ontem; dia sem venda conta zero e feriados usam [REGRA]. Explique que é estimativa simples, não garantia.

4. OPERAÇÃO
Relatórios de tempos separam pedidos completos e incompletos. Exporte PDF/CSV com filtros e paginação de toda a base, sem cortar silenciosamente em 1.000 linhas.

5. TESTES
Teste ausência de dados, fornecedor fora do top 10, virada de mês e feriado. Todo número deve indicar fonte, período e se é realizado ou projetado.$prompt$,'Financeiro e administrativo',5,'blocos/financeiro-admin.png'),
('prompt','Página comercial e gestão de interessados','Apresente o sistema e organize os leads comerciais separadamente dos clientes do restaurante.',$prompt$1. OBJETIVO
Crie uma página “Quero conhecer” para [NOME DO PRODUTO OU SERVIÇO].

2. PÁGINA
Explique a dor [DOR], os módulos [MÓDULOS], para quem é e chamada para [AÇÃO]. Use prova real disponível; não invente clientes, economia ou depoimentos.

3. FORMULÁRIO
Capture [CAMPOS], consentimento e origem. Valide no servidor, proteja contra spam e mostre confirmação sem duplicar envio.

4. ADMIN
Liste interessados com busca, período, status comercial, observação e exportação. Mantenha esses leads separados dos consumidores do restaurante e de suas campanhas.

5. TESTES
Teste cadastro duplicado, consentimento recusado, grande texto e acesso não autorizado. Registre quem alterou o status do lead.$prompt$,'Site e vendas',7,'blocos/site-vendas.png'),
('prompt','Suitable: importação de vendas e produtos','Sincronize histórico de vendas com limites, cache e classificação configurável.',$prompt$1. OBJETIVO
Integre vendas da Suitable para [NOME DO RESTAURANTE], usando [CREDENCIAIS E EMPRESAS].

2. CONEXÃO
Tokens ficam só no servidor. Implemente autenticação, paginação, cache de [SEGUNDOS], limite de [LIMITE] chamadas por minuto e retry com espera; nunca exponha chave no navegador.

3. SINCRONIZAÇÃO
Importe período sob demanda e diariamente, registre dias concluídos e evite duplicar pedidos. Recupere falhas sem pular dados e marque sincronização parcial.

4. INDICADORES
Conte produtos por regras configuráveis de nome/categoria para [TIPOS DE PRODUTO]. Combos e extras precisam de regras explícitas; não classifique silenciosamente por suposição.

5. TESTES
Teste token expirado, limite atingido, pedido repetido, dia sem vendas e item desconhecido. Mostre última atualização e nunca apresente dados antigos como ao vivo sem aviso.$prompt$,'Integrações e automações',1,'blocos/integracoes-automacoes.png'),
('prompt','WhatsApp via Twilio com fila e reconciliação','Envie templates aprovados com idempotência, status e histórico.',$prompt$1. OBJETIVO
Crie mensageria WhatsApp para [NOME DO RESTAURANTE] via Twilio.

2. FILA
Toda mensagem entra em fila com destinatário, template, variáveis, contexto e chave de deduplicação. Valide consentimento quando marketing e número antes do envio.

3. ENVIO
Use credenciais somente no servidor e templates aprovados. Registre SID e estados aceito, enviado, entregue, lido e falha; “aceito” não é “entregue”.

4. CALLBACK E RETRY
Proteja o callback com assinatura/segredo e correlacione pelo SID. Falha temporária tem tentativas limitadas; timeout exige consultar o provedor antes de reenviar. Erro permanente bloqueia o número.

5. TESTES
Teste template inexistente, telefone inválido, callback duplicado/falso, opt-out e timeout. Mantenha logs sem expor conteúdo sensível e informe custo/dependência antes de ativar.$prompt$,'Integrações e automações',2,'blocos/integracoes-automacoes.png'),
('prompt','Telegram para operação e alertas','Consulte estoque, produção, escala, financeiro e motoboys por comandos autorizados.',$prompt$1. OBJETIVO
Crie um bot Telegram para [NOME DO RESTAURANTE].

2. COMANDOS
Ofereça [COMANDOS] para estoque, checagem, produção, escala, holerite, contas e fechamento de motoboys. Responda em conversa privada ou grupo conforme a sensibilidade.

3. AUTORIZAÇÃO
Vincule chat ao usuário e empresa e revalide papel a cada comando sensível. O primeiro /start não pode tornar alguém admin. Financeiro e motoboys exigem permissão própria.

4. WEBHOOK E MENSAGENS
Valide secret token, processe apenas atualizações esperadas e use deduplicação por update. Mensagens longas são divididas sem separar chave Pix do entregador correspondente.

5. TESTES
Teste chat desconhecido, permissão removida, callback duplicado, comando com data e falha de envio. Não registre tokens nem dados pessoais em logs públicos.$prompt$,'Integrações e automações',3,'blocos/integracoes-automacoes.png'),
('prompt','Automações com dia operacional e execução idempotente','Agende rotinas sem depender de tela aberta e sem repetir efeitos.',$prompt$1. OBJETIVO
Crie automações para [ROTINAS] de [NOME DO RESTAURANTE].

2. TEMPO
Use fuso [FUSO] e dia operacional virando às [HORÁRIO]. Documente como datas após meia-noite são classificadas e como cada rotina escolhe o período.

3. EXECUÇÃO
Agende no servidor, proteja endpoint com segredo e limite janela. Cada rotina registra início, fim, período, resultado e próxima execução; nenhuma depende de componente React aberto.

4. IDEMPOTÊNCIA
Use chave por evento/período/destinatário, lock e transação. Retry só para falha elegível; resultado incerto exige reconciliação. Não execute lote antigo fora da regra.

5. OBSERVABILIDADE E TESTES
Mostre histórico e falhas no admin. Teste duas execuções simultâneas, virada do dia/mês, atraso do agendador, segredo errado e recuperação após falha parcial.$prompt$,'Integrações e automações',4,'blocos/integracoes-automacoes.png'),
('prompt','Segurança de dados, RLS e rotas públicas','Revise permissões reais antes de liberar módulos com clientes e pagamentos.',$prompt$1. OBJETIVO
Audite a segurança de [NOME DO SISTEMA] antes da publicação.

2. PAPÉIS
Guarde papéis em tabela própria e valide admin no servidor. Não use senha fixa, sessão inventada no localStorage ou segredo TOTP no cliente. Exija MFA nas ações privilegiadas quando aplicável.

3. BANCO
Para cada tabela, confirme grants, RLS e políticas por operação. Teste anon, usuário comum, outra loja/empresa e admin. Service role só no servidor depois de verificar o chamador.

4. ROTAS PÚBLICAS
Cadastros públicos usam validação, anti-spam e menor privilégio; webhooks verificam assinatura; tokens são aleatórios, com hash, validade e escopo. Nenhuma rota pública lista base privada.

5. EVIDÊNCIA
Entregue matriz de acesso e testes de tentativa proibida. Revise logs, armazenamento privado, consentimento, retenção e exclusão. Não declare seguro apenas porque o menu está escondido.$prompt$,'Testes e qualidade',1,'blocos/integracoes-automacoes.png'),
('prompt','Testes de regras, concorrência e telas operacionais','Prove cálculos e fluxos no celular, desktop e TV antes de usar na operação.',$prompt$1. OBJETIVO
Crie validação de qualidade para [NOME DO MÓDULO].

2. REGRAS
Escreva testes com valores concretos para cada cálculo, limite, vigência, deduplicação e permissão. Inclua casos de fronteira: zero, negativo, última unidade, virada de data e histórico ausente.

3. CONCORRÊNCIA
Simule duplo clique, duas abas e duas execuções da mesma rotina. Prove que não duplica pedido, estoque, prêmio, mensagem ou lançamento financeiro.

4. PONTA A PONTA
Com usuário real de teste, execute o fluxo principal e leia o resultado na interface. Teste celular, tablet, desktop e TV quando houver tela ligada; confira som, tela cheia e reconexão.

5. INTEGRAÇÕES
Use ambiente de teste e não dispare cobrança ou WhatsApp real sem autorização. Registre o que não foi testado e qual credencial ou dado real ainda falta.$prompt$,'Testes e qualidade',2,'blocos/integracoes-automacoes.png'),
('prompt','Checklist de publicação e evolução do sistema','Publique com integrações acessíveis, agendamentos ativos e pendências explícitas.',$prompt$1. OBJETIVO
Prepare a publicação de [NOME DO SISTEMA] em [DOMÍNIO].

2. CONTEÚDO E ACESSO
Revise títulos, descrições, links, contatos e dados de exemplo. Remova usuários e registros de teste sem apagar dados reais; confirme papéis e fluxo de login.

3. INTEGRAÇÕES
Publique antes de testar webhooks externos e confirme que os endereços respondem no domínio público. Cadastre callbacks, templates e agendamentos no ambiente correto; segredos não vão no código.

4. VALIDAÇÃO
Execute compra/cadastro/pedido de teste conforme o módulo, leia o resultado no painel e confirme logs, notificações e permissões. Teste também falha e recuperação.

5. EVOLUÇÃO
Liste pendências com responsável e bloqueador, preserve um roadmap curto e ative automações uma por vez. Não marque integração como ativa se faltar credencial, publicação ou teste real.$prompt$,'Lançar e evoluir',1,'blocos/integracoes-automacoes.png')
) as v(type,title,summary,body,category,position,thumbnail_url)
where not exists (select 1 from public.contents c where c.type='prompt' and c.title=v.title);