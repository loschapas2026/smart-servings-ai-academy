insert into public.contents (type,title,summary,body,category,published,position,thumbnail_url)
select v.type::public.content_type,v.title,v.summary,v.body,v.category,true,v.position,v.thumbnail_url
from (values
('prompt','Conteúdo da home, banners e modo manutenção','Troque campanhas e avisos do site sem mexer no código.',$prompt$1. OBJETIVO
Crie uma central de conteúdo para a home de [NOME DO RESTAURANTE].

2. CONFIGURAÇÕES
Permita ativar banners, cards informativos, popup de cadastro, ação prioritária, imagens, textos, botões e links. Para cada campanha defina início, fim, dias, horário e prioridade.

3. HOME
Só uma ação assume a home por vez: [REGRA DE PRIORIDADE]. Se uma campanha estiver inativa ou fora da janela, volte à home padrão. Se a configuração demorar, use a home padrão sem deixar tela vazia.

4. MANUTENÇÃO
Crie modo manutenção com mensagem [MENSAGEM] e previsão opcional. O acesso administrativo continua protegido e disponível; nenhum visitante deve editar configurações.

5. TESTES
Teste campanhas simultâneas, virada de horário, fim da ação, backend indisponível e retorno da home. Links e imagens precisam ter fallback e funcionamento no celular.$prompt$,'Site e vendas',6,'blocos/site-vendas.png'),
('prompt','Autoatendimento da reserva pelo link individual','Permita consultar, editar, cancelar ou fazer check-in sem expor outras reservas.',$prompt$1. OBJETIVO
Crie a página “Minha reserva” para clientes de [NOME DO RESTAURANTE].

2. ACESSO
Use token aleatório de alta entropia ligado a uma única reserva; armazene apenas hash quando possível e permita revogação. O link não é senha compartilhada nem identificador sequencial.

3. AÇÕES
Mostre código, unidade, data, horário, convidados e status. Permita alterar convidados até [HORÁRIO LIMITE], cancelar e fazer check-in conforme [REGRAS]. Edição deve recalcular capacidade no servidor.

4. ESTADOS
Bloqueie ações em reserva cancelada, passada ou já finalizada. Explique pendente, confirmada, cancelada e check-in. Não mostre dados de outros clientes.

5. TESTES
Teste token inválido, revogado, limite de horário, aumento acima da capacidade, duplo clique e cancelamento. Registre alterações com data e origem sem expor logs ao cliente.$prompt$,'Reservas e eventos',7,'blocos/reservas-eventos.png'),
('prompt','Cadastro no clube com código OTP no WhatsApp','Confirme a posse do telefone antes de ativar o cliente no clube.',$prompt$1. OBJETIVO
Crie uma página via QR Code para cadastro no clube [NOME DO CLUBE].

2. FLUXO
Em três etapas, capture nome, WhatsApp e nascimento; envie código de 6 dígitos por [PROVEDOR DE WHATSAPP]; valide o código e mostre sucesso. Cliente já cadastrado mantém seus dados e tags.

3. SEGURANÇA
Gere código no servidor, guarde hash, expire em [MINUTOS] minutos, limite [TENTATIVAS] validações e [ENVIOS] envios por janela. Bloqueie números inválidos e use template de autenticação aprovado. Nunca devolva o código na resposta da API.

4. BASE
Ao concluir, faça upsert por telefone normalizado e acrescente a tag [TAG DO CLUBE] sem remover outras tags. Consentimento de promoções deve ficar registrado separadamente.

5. TESTES
Teste código errado, expirado, reenvio, excesso de tentativas, cliente antigo com outra tag e falha do provedor. Não conclua cadastro se a verificação falhar.$prompt$,'Promoções e fidelidade',5,'blocos/promocoes-fidelidade.png'),
('prompt','Clube com benefício por unidade e cupom temporário','Entregue boas-vindas, deixe o cliente escolher a loja e acompanhe o funil.',$prompt$1. OBJETIVO
Crie o resgate de boas-vindas do clube [NOME DO CLUBE] por link individual.

2. CONFIGURAÇÃO
Admin edita textos, atraso do envio, template, unidades, códigos, descrições, validade [MINUTOS] minutos e fallback quando encerrado. Preview não pode consumir benefício.

3. FLUXO
Após [ATRASO] o cliente recebe token; abre a página, escolhe [UNIDADES], vê o cupom e cronômetro e segue ao cardápio correspondente. A escolha da unidade e o início da validade devem ser gravados no servidor.

4. MEDIÇÃO
Registre pendentes, enviados, abriram, escolheram, foram à loja e clicaram no fallback. Ao resgatar, acrescente tag [TAG DE RESGATE] para remarketing sem apagar outras.

5. LIMITES
Abertura não prova compra e mensagem aceita não prova entrega. Impeça reuso após expiração e não exponha o token de outras pessoas. Teste campanha inativa e link antigo.$prompt$,'Promoções e fidelidade',6,'blocos/promocoes-fidelidade.png'),
('prompt','Fila virtual para liberar promoções','Controle picos de acesso com sala de espera e liberação administrativa ou agendada.',$prompt$1. OBJETIVO
Crie uma fila de espera antes da promoção [NOME DA PROMOÇÃO].

2. FLUXO
Ao entrar, o visitante recebe identificador e status aguardando/liberado; mostre posição quando calculável, orientação e atualização em tempo real com polling de contingência. Liberado segue para [DESTINO].

3. CONTROLE
Admin configura quantidade por liberação, intervalo, início/fim, pausa e liberação manual. O agendamento deve rodar no servidor com lock, não depender de uma aba aberta.

4. REGRAS
Uma sessão só entra uma vez; reentrada recupera o estado. Não prometa tempo exato sem cálculo confiável. Fila controla acesso à página, não estoque nem resgate do cupom.

5. TESTES
Teste recarregar, duas abas, liberação em lote, fila vazia, pausa, realtime indisponível e encerramento. O endpoint de liberação exige autorização.$prompt$,'Promoções e fidelidade',7,'blocos/promocoes-fidelidade.png'),
('prompt','Semáforo comercial e níveis promocionais','Alterne estados de campanha por horário sem fingir progressão de fidelidade.',$prompt$1. OBJETIVO
Crie um semáforo comercial para as promoções de [NOME DO RESTAURANTE].

2. ESTADOS
Cadastre [NOMES DOS ESTADOS], cores, benefícios e descrição. Deixe claro se são modos da campanha ou níveis reais do cliente; não chame de nível por gasto sem existir essa regra.

3. AGENDA
Permita programar estado por dias e horários, ativação, abastecimento e reset. Execução automática deve ocorrer no servidor e registrar última troca, falha e próxima ação.

4. INTEGRAÇÃO
Aplique o estado vigente em cupons, roleta e cards. Em conflito, use [PRIORIDADE]. Mudança manual precisa indicar se vale até o próximo agendamento ou exige reset.

5. TESTES
Teste virada de horário, dois agendamentos, reset, ausência de configuração e campanha encerrada. Nenhum cliente deve receber benefício de estado inativo.$prompt$,'Promoções e fidelidade',8,'blocos/promocoes-fidelidade.png'),
('prompt','Cashback com vencimento e réguas de recuperação','Avise sobre saldo a expirar sem duplicar mensagens ou ignorar descadastro.',$prompt$1. OBJETIVO
Crie uma régua de recuperação de cashback para [NOME DO RESTAURANTE].

2. DADOS
Importe saldo por unidade, última compra e validade real de [FONTE DO SALDO]. Se a fonte não fornecer vencimento, deixe explícita a regra [DIAS DE VALIDADE] e valide com o responsável antes de ativar.

3. RÉGUA
Selecione saldo positivo, telefone válido, consentimento e expiração nos dias [DIAS DE AVISO]. Configure horários e templates por etapa, limite por execução e página de retorno [LINK].

4. CONFIABILIDADE
Reserve o destinatário atomicamente antes do envio; deduplique por cliente, unidade, etapa e validade. Em timeout, consulte o provedor antes de reenviar. Respeite opt-out imediatamente.

5. PAINEL E TESTES
Mostre fila, entregues, falhas e dias restantes. Teste saldo zerado entre sincronizações, duas execuções simultâneas, cliente em duas lojas e recuperação de janela. Não invente saldo nem desconto.$prompt$,'Promoções e fidelidade',9,'blocos/promocoes-fidelidade.png'),
('prompt','Campanha sazonal com meta e marcos de prêmio','Crie uma ação temática com progresso real, captação e controle da home.',$prompt$1. OBJETIVO
Crie a campanha sazonal [NOME DA CAMPANHA] para [NOME DO RESTAURANTE].

2. PÁGINA
Use [ARTE E CORES], conteúdo, contador regressivo, vídeo/fotos, regras, formulário de interesse e botão de compra. Permita que a ação vire a home somente durante [VIGÊNCIA].

3. META
Configure meta [META], marcos e prêmios [MARCOS E PRÊMIOS]. Progresso = min(100, total válido/meta × 100). Use pedidos pagos ou dado confirmado; se for valor manual, identifique como atualização manual.

4. ADMIN
Gerencie status, total, meta, marcos, textos, leads e exportação. Não incremente vendas com timer ou animação. Registre origem dos leads para não misturar campanhas.

5. TESTES
Teste meta zero, meta atingida, marco exato, expiração, retorno da home e dados indisponíveis. Exiba “aguardando dados” em vez de números fictícios.$prompt$,'Promoções e fidelidade',10,'blocos/promocoes-fidelidade.png'),
('prompt','CRM unificado por WhatsApp com tags e deduplicação','Una cadastros de várias ações sem apagar histórico nem misturar consentimentos.',$prompt$1. OBJETIVO
Crie uma visão unificada dos clientes de [NOME DO RESTAURANTE] vindos de [FONTES DE CADASTRO].

2. IDENTIDADE
Normalize WhatsApp em uma função única, preservando DDD e país. Mostre nome, nascimento, origens, tags, saldos por unidade e consentimentos. O mesmo cliente pode ter várias origens sem registros duplicados.

3. MERGE
Liste possíveis duplicados e permita revisar antes de mesclar. Preserve todos os históricos transacionais, tags e consentimentos; não apague reservas, pedidos ou apostas. Telefone compartilhado exige revisão manual.

4. ADMIN
Busca por nome/telefone, filtros por tag/origem/nascimento, exportação paginada e exclusão por escopo. Toda mesclagem ou exclusão registra quem fez e quando.

5. TESTES
Teste telefone com/sem DDI, dados complementares, duas pessoas no mesmo telefone e grande volume. Não deduplique apenas pelo nome e não permita acesso público à base.$prompt$,'Clientes e campanhas',1,'blocos/clientes-campanhas.png'),
('prompt','Importação de leads WiFi por planilha','Importe nome, nascimento e WhatsApp com validação e enriquecimento do cadastro.',$prompt$1. OBJETIVO
Crie importação de leads WiFi para o CRM de [NOME DO RESTAURANTE].

2. PLANILHA
Aceite [FORMATO] com colunas Nome, Nascimento e WhatsApp. Mostre prévia, erros por linha e confirmação antes de gravar. Limite tamanho e valide tipos no servidor.

3. DEDUPLICAÇÃO
Normalize telefone e compare com as origens [ORIGENS]. Se já existir sem nascimento e a planilha trouxer a data, enriqueça sem apagar tags. Números inválidos ficam de fora com motivo.

4. RESULTADO
Informe inseridos, atualizados, já existentes e inválidos; associe lote e tags [TAG COM DATA / TAG SEM DATA]. Quando houver nascimento e consentimento compatível, disponibilize para aniversariantes.

5. ADMIN E TESTES
Liste e pesquise o lote, exporte e exclua apenas a origem WiFi. Teste planilha vazia, cabeçalho trocado, telefone repetido, dados incompletos e importação duplicada.$prompt$,'Clientes e campanhas',2,'blocos/clientes-campanhas.png'),
('prompt','Régua de aniversariantes e página personalizada','Envie mensagens D-30, D-15, D-7 e D-0 com acompanhamento de conversão.',$prompt$1. OBJETIVO
Crie campanhas de aniversário para clientes de [NOME DO RESTAURANTE].

2. CONFIGURAÇÃO
Defina etapas [D-30, D-15, D-7, D-0], horários, templates, oferta e página personalizada. Só inclua clientes com nascimento válido e consentimento.

3. EXECUÇÃO
Agende no servidor, evite duplicidade por cliente/ano/etapa, registre aceite, entrega, erro e clique. O link individual abre [CONTEÚDO DA PÁGINA] e registra a interação sem expor outros dados.

4. ANÁLISE
Mostre enviados, únicos, cliques e reservas. Considere conversão somente reserva do mesmo WhatsApp criada entre o envio e [JANELA DE CONVERSÃO]; permita filtrar etapa e período e exportar CSV.

5. TESTES
Teste 29 de fevereiro, virada de ano, fuso [FUSO], cliente sem data, opt-out e reexecução. Clique não é venda; deixe as métricas separadas.$prompt$,'Clientes e campanhas',3,'blocos/clientes-campanhas.png'),
('prompt','Campanhas segmentadas em lotes com descanso global','Crie cards reutilizáveis, agende envios e evite saturar o mesmo cliente.',$prompt$1. OBJETIVO
Crie campanhas de WhatsApp para [NOME DO RESTAURANTE] com páginas próprias.

2. CAMPANHA
Cadastre slug, título, descrição, imagem, cor, tipo [CUPOM, VISITA, ANTECIPAÇÃO, AVISO], CTAs, vigência, dias, horários e fallback. O card respeita ativo e janela.

3. PÚBLICO E LOTES
Escolha origens e tags, exclusões, tamanho do lote, intervalo e limite total. Pré-visualize os alvos. Aplique descanso global [REGRA DE DESCANSO] para não enviar várias campanhas no mesmo ciclo.

4. EXECUÇÃO
Agende no servidor com lock, continuação e registro por destinatário. Não dependa de tela aberta. Deduplique por campanha e ciclo, trate opt-out e reconcilie resultado incerto antes de repetir.

5. MÉTRICAS
Mostre alvos, enviados, faltam, falhas, aberturas e cliques. Não apresente clique como faturamento. Teste lotes simultâneos, campanha pausada e cliente em duas origens.$prompt$,'Clientes e campanhas',4,'blocos/clientes-campanhas.png'),
('prompt','Links curtos e funil de campanhas','Rastreie clique, abertura, resgate e ida à loja com códigos separados.',$prompt$1. OBJETIVO
Implemente rastreamento dos links de campanha de [NOME DO RESTAURANTE].

2. CÓDIGOS
Gere código curto único por envio, separado do token de resgate do clube. O endereço [DOMÍNIO]/[PREFIXO]/[CÓDIGO] resolve o envio, registra o clique e redireciona à campanha correta.

3. EVENTOS
Registre envio, entrega, clique, abertura, escolha da unidade, resgate e ida ao cardápio com timestamps e contadores. Defina uma vez o significado de cada evento e evite duplicar no recarregamento.

4. PAINEL
Monte funil por campanha e lote, com taxas calculadas sobre a etapa anterior e filtros de período. Mostre falhas e pendências; não transforme redirecionamento em pedido pago.

5. SEGURANÇA E TESTES
Código inválido mostra página segura sem dados. Não inclua telefone no URL. Teste link antigo, repetição, campanha inativa e separação entre códigos de marketing e tokens de benefício.$prompt$,'Clientes e campanhas',5,'blocos/clientes-campanhas.png'),
('prompt','Sincronização de clientes e cashback da Suitable','Importe clientes por loja com saldos separados e credenciais protegidas.',$prompt$1. OBJETIVO
Integre os clientes da Suitable ao CRM de [NOME DO RESTAURANTE] para as lojas [LOJAS].

2. CREDENCIAIS
Configure Client ID e Client Secret por loja com escopo CRM. Valide antes de salvar, mantenha segredos somente no servidor e nunca os devolva à tela.

3. IMPORTAÇÃO
Autentique, pagine toda a lista e importe nome, telefone, nascimento, e-mail, pontos, crédito e cashback. Faça upsert por loja + identificador externo e registre log com novos, atualizados e falhas.

4. REGRAS
O mesmo WhatsApp em duas lojas mantém um registro de saldo por loja e as duas tags; não misture os saldos. Marque quem já existia sem sobrescrever outras bases. Ignore contatos inválidos para envio.

5. AGENDA E TESTES
Atualize às [HORÁRIO] no fuso [FUSO], com retry e execução manual. Teste paginação, token expirado, resposta parcial e reexecução sem duplicar. Confirme na documentação qual campo representa cashback antes de usar.$prompt$,'Clientes e campanhas',6,'blocos/clientes-campanhas.png'),
('prompt','Higiene de WhatsApp, inválidos e opt-out','Normalize números e impeça que erros permanentes travem os envios.',$prompt$1. OBJETIVO
Crie uma camada única de higiene de contatos para [NOME DO RESTAURANTE].

2. NORMALIZAÇÃO
Padronize os números em uma única função usada por cadastro, busca e envio. Aceite entrada com/sem DDI, remova duplicação acidental do código do Brasil e preserve o formato canônico [FORMATO].

3. BLOQUEIOS
Antes do envio, valide comprimento e DDD e consulte lista de inválidos e opt-out. Erros permanentes do provedor [CÓDIGOS] marcam o número e o lote segue; erros temporários entram em retry controlado.

4. HISTÓRICO
Guarde motivo, origem, data e contexto do erro sem expor dados em logs públicos. Descadastro vale para marketing, não apague registros fiscais ou operacionais obrigatórios.

5. TESTES
Teste 10/11 dígitos, DDI duplicado, número excessivo, opt-out entre preparo e envio, falha permanente e timeout. Nenhum número inválido pode causar laço infinito de tentativas.$prompt$,'Clientes e campanhas',7,'blocos/clientes-campanhas.png')
) as v(type,title,summary,body,category,position,thumbnail_url)
where not exists (select 1 from public.contents c where c.type='prompt' and c.title=v.title);