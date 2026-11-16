insert into public.contents (type,title,summary,body,category,published,position,thumbnail_url)
select v.type::public.content_type,v.title,v.summary,v.body,v.category,true,v.position,v.thumbnail_url
from (values
('prompt','Escala mensal com folgas e regras de domingo','Monte a escala por colaborador com folgas automáticas e edição manual.',$prompt$1. OBJETIVO
Crie escalas para [NOME DO RESTAURANTE] com colaboradores e áreas [ÁREAS].

2. CADASTRO
Nome, função, área, folga semanal, regra de domingo [NENHUM, TODOS, ALTERNADOS, A CADA 4 SEMANAS], domingo de referência, contatos e ativo. Não use gênero como atalho para regra individual configurável.

3. VISÕES
Admin vê semana e mês, ordena colaboradores e altera folga no calendário. Funcionário vê apenas seu calendário, com folga, trabalho, férias/atestado e lista dos próximos dias livres.

4. REGRAS
Domingo segue a regra e a referência escolhidas; exceções do dia podem adicionar ou retirar folga. Alterações não reescrevem histórico. Não trate o algoritmo como conformidade trabalhista universal.

5. TESTES
Teste virada de mês, domingo de referência, regra alternada, colaborador inativo e exceção. O funcionário não pode editar a própria escala nem ver dados privados de colegas.$prompt$,'Produção e equipe',3,'blocos/producao-equipe.png'),
('prompt','Férias, atestados, freelancers e lembretes de escala','Registre ausências e avise apenas quem realmente trabalha no dia.',$prompt$1. OBJETIVO
Complemente a escala de [NOME DO RESTAURANTE] com ausências e comunicação.

2. AUSÊNCIAS
Cadastre férias/atestado com tipo, início, fim e observação; permita excluir por admin e mostre o período no calendário sem transformar os dias em folga comum.

3. FREELANCERS
Inclua profissionais por data e área, sem criar vínculo permanente. Considere essas pessoas na cobertura do dia e diferencie no mapa.

4. NOTIFICAÇÕES
Envie escala individual ou mensal por [WHATSAPP/TELEGRAM]. Antes de lembretes de contagem ou produção, consulte escala e ausências e pule quem está de folga; registre destinatário, evento e resultado.

5. TESTES
Teste ausência atravessando semanas, freelancer no mesmo dia, funcionário de folga, reenvio e falha em um canal. Falha no WhatsApp não impede Telegram e vice-versa.$prompt$,'Produção e equipe',4,'blocos/producao-equipe.png'),
('prompt','Mapa de operação e colaboradores por área','Compare cobertura planejada e necessária por dia e receba sugestões de ajuste.',$prompt$1. OBJETIVO
Crie um mapa de operação para as lojas e áreas [LOJAS E ÁREAS].

2. REQUISITOS
Admin define quantidade necessária por área para dias de semana e fim de semana, com detalhamento por função. Não deixe padrões escondidos no código.

3. MAPA
Cruze escala, folgas, ausências, freelancers e tags de área. Mostre nomes, quantidade planejada, necessária e diferença por dia; no celular, use detalhe ao tocar em vez de tooltip exclusivo de mouse.

4. IA
Sugira remanejamento com base apenas nos dados exibidos, explicando motivo e impacto. Toda sugestão exige aprovação do admin; não mude escala automaticamente.

5. TESTES
Teste área sem requisito, cobertura acima/abaixo, ausência, freelancer e dados insuficientes. Não invente disponibilidade nem apresente sugestão como decisão final.$prompt$,'Produção e equipe',5,'blocos/producao-equipe.png'),
('prompt','Monitor de pedidos e capacidade das cozinhas','Controle admissão por cozinha sem sobrecarregar a produção.',$prompt$1. OBJETIVO
Crie um monitor dos pedidos importados de [FONTE DOS PEDIDOS] para as cozinhas [COZINHAS].

2. CLASSIFICAÇÃO
Configure quais produtos pertencem a cada cozinha, inclusive pedidos mistos e itens livres. Pedido sem itens carregados fica pendente de classificação, não entra como completo.

3. CAPACIDADE
Defina limite [LIMITE] por cozinha, estados aceito/preparo/finalização e janela operacional. Libere novos pedidos apenas com vaga e preserve a ordem justa; urgência fora do prazo pode ter prioridade explícita.

4. INDICADORES
Mostre fila, ocupação, tempos e alertas. Métricas devem separar pedidos incompletos e histórico insuficiente. Falhas consecutivas pausam a automação com aviso.

5. TESTES
Teste cozinha lotada, pedido misto, item desconhecido, vaga liberada e duas execuções do monitor. Não altere status externo sem confirmação e idempotência.$prompt$,'Produção e equipe',6,'blocos/producao-equipe.png'),
('prompt','Tela de cozinha com preparo e finalização','Alterne automaticamente as filas na TV apenas quando houver finalização.',$prompt$1. OBJETIVO
Crie telas de acompanhamento para as cozinhas [COZINHAS].

2. EXIBIÇÃO
Normalmente mostre aceitos e preparo. Quando houver pedidos em finalização, alterne entre essa fila e “Finalização” a cada [SEGUNDOS] segundos, sincronizando as telas e destacando números grandes.

3. FINALIZAÇÃO
Identifique acompanhamentos e molhos configurados, conferência por item e alerta sonoro apenas uma vez por evento. Sem finalização, a tela permanece em aceitos.

4. LIMITES
A alternância é visual e não altera status nem avança produção. Tela pública mostra apenas o necessário, sem nome, endereço ou telefone do cliente.

5. TESTES
Teste sem finalização, entrada/saída de item, várias cozinhas, som bloqueado pelo navegador e TV sem toque. Ofereça ação manual acessível quando áudio não iniciar.$prompt$,'Produção e equipe',7,'blocos/producao-equipe.png'),
('prompt','Fila de fichas para atendimento no salão','Chame clientes por número ou modo livre com tela e áudio.',$prompt$1. OBJETIVO
Crie uma fila de atendimento para [NOME DO RESTAURANTE].

2. MODOS
Permita ficha numerada de 1 a 9999 e modo livre. Ações: próxima, chamar ficha, repetir e alterar modo. Exiba número com zeros à esquerda e espera estimada [MINUTOS].

3. TELA
Mostre chamada atual em tela cheia e texto “Ficha número … Próximo, por gentileza.” Use áudio curto com botão para liberar som quando o navegador exigir.

4. CONTROLE
Compartilhe estado por empresa e impeça que duas ações concorrentes escolham números diferentes. Revisar permissões das ações públicas; idealmente só atendimento controla.

5. TESTES
Teste limite de número, repetir, mudança de modo, espera manual e duas telas abertas. Não exponha dados pessoais do cliente na TV.$prompt$,'Produção e equipe',8,'blocos/producao-equipe.png'),
('prompt','Rotas inteligentes com mapa e fila justa','Agrupe entregas compatíveis sem furar a fila nem estourar a cozinha.',$prompt$1. OBJETIVO
Crie rotas inteligentes para pedidos de [NOME DO RESTAURANTE], usando [MAPA E OPENROUTESERVICE].

2. AGRUPAMENTO
Valide coordenadas e considere distância, direção, desvio, zonas, tamanho do lote, espera máxima e promessa de entrega. Cacheie rotas e trate endereços sem coordenada.

3. PRIORIDADE
Quando uma cozinha saturar, ordene planos por urgência e folga temporal. Se o primeiro não puder avançar, reserve a vaga das cozinhas que ele usa; não deixe pedido posterior furar essa fila. Cozinhas livres continuam fluindo.

4. FINALIZAÇÃO
Permita pré-visualizar preparo e finalização e casar rotas já prontas sem alterar pedidos antes da confirmação. Aprendizado com rotas anteriores só usa amostras compatíveis e nunca amplia limites sozinho.

5. TESTES
Teste pedido atrasado, rota parceira ausente, lote que não cabe, coordenada ausente e duas execuções. Mostre motivo de bloqueio e nunca invente estimativa.$prompt$,'Entregas e motoboys',1,'blocos/entregas-motoboys.png'),
('prompt','Central de despacho em tela cheia','Una fila de motoboys, últimos despachos, cozinhas e monitor de impressão.',$prompt$1. OBJETIVO
Crie uma central de despacho para [NOME DO RESTAURANTE] em tela cheia.

2. ÁREAS
Esquerda: fila de motoboys e total do dia, botão remover primeiro; abaixo, últimos 3 despachos. Centro: ocupação e tempos das cozinhas, chaves de rotas. Direita: [MONITOR DE IMPRESSÃO OU OUTRO PAINEL].

3. DESPACHOS
Agrupe pedidos do mesmo entregador saídos em até [MINUTOS] minutos; mostre número, saída e previsão. Alerte últimos 5 minutos, atraso e entregue com cores e texto.

4. CONTROLES
Atualize em intervalo, mantenha configurações avançadas recolhidas e permita abrir limites quando necessário. Toda ação operacional exige permissão e confirmação do servidor.

5. TESTES
Teste monitor grande, celular para operador, duas viagens próximas, mais de 3 grupos, atraso e fila vazia. Não duplique pedidos ao agrupar viagens.$prompt$,'Entregas e motoboys',2,'blocos/entregas-motoboys.png'),
('prompt','Cadastro e fila de motoboys','Faça check-in, ordene atendimento e mantenha duas visões operacionais.',$prompt$1. OBJETIVO
Crie cadastro e fila de entregadores para [NOME DO RESTAURANTE].

2. CHECK-IN
Cadastre nome e contato; permita check-in uma única vez por período, remover, mover e limpar fila com confirmação. Sincronize entregadores importados sem duplicar identidade.

3. VISÕES
Tela completa com contador e fila; versão simplificada sem contadores extras e com botão grande para remover o primeiro. Mantenha ambas usando a mesma fonte de dados.

4. CONCORRÊNCIA
Movimentações devem ser transações ordenadas no servidor. Remover o primeiro sempre reavalia a fila atual; não dependa da posição guardada na tela.

5. TESTES
Teste check-in repetido, dois atendentes removendo juntos, cadastro importado, fila vazia e atualização em tempo real. Ações públicas precisam de proteção adequada.$prompt$,'Entregas e motoboys',3,'blocos/entregas-motoboys.png'),
('prompt','Frete de motoboys com vigências, extras e descontos','Calcule valores em centavos e preserve regras antigas nos fechamentos.',$prompt$1. OBJETIVO
Crie o cálculo de fretes de [NOME DO RESTAURANTE].

2. REGRAS
Considere apenas pedidos despachados/entregues, deduplique por pedido e use faixas [FAIXAS POR TIPO DE COZINHA]. Calcule tudo em centavos; pedido sem taxa ou itens fica pendente.

3. VIGÊNCIA
Admin cadastra novas regras a partir de uma data; fechamentos anteriores mantêm a regra vigente naquele dia. Não altere retroativamente sem recálculo explícito e log.

4. AJUSTES
Extras e descontos têm tipo, valor, motivo, pedido quando obrigatório e autor. Líquido = fretes + extras − descontos. Permita editar e excluir logicamente, recalculando o total e mantendo trilha.

5. TESTES E SAÍDA
Teste limite da faixa, taxa ausente, pedido duplicado, exclusão de ajuste e virada de vigência. Exporte CSV com pendências separadas do total confirmado.$prompt$,'Entregas e motoboys',4,'blocos/entregas-motoboys.png'),
('prompt','Cadastro de motoboys com Pix e aprovação de troca','Guarde contato e chave Pix sem permitir alteração direta pelo link do entregador.',$prompt$1. OBJETIVO
Crie o cadastro permanente dos entregadores importados e locais de [NOME DO RESTAURANTE].

2. CADASTRO
Guarde identificador externo, nome, WhatsApp, tipo e chave Pix, data e autor da última alteração. Mostre a chave no painel interno apenas a quem tem permissão.

3. SOLICITAÇÃO
No fechamento individual, o entregador pode pedir troca da chave e informar erro pelo WhatsApp [CONTATO]. A chave vigente não muda até admin aprovar; recusa mantém a anterior e nova solicitação substitui pendente.

4. SEGURANÇA
Valide tipo/chave no servidor, autentique admin e registre revisão. Não mostre dados dos clientes das entregas nem afirme pagamento realizado.

5. TESTES
Teste chave inválida, duas solicitações, aprovação, recusa, revogação do link e permissão comum tentando aprovar. Consulta no Telegram só mostra botão copiar para chave válida.$prompt$,'Entregas e motoboys',5,'blocos/entregas-motoboys.png'),
('prompt','Fechamento individual e envio automático aos motoboys','Envie demonstrativo seguro apenas quando houver valor líquido positivo.',$prompt$1. OBJETIVO
Crie o fechamento diário dos motoboys de [NOME DO RESTAURANTE].

2. DEMONSTRATIVO
Liste entregas, fretes, extras, descontos, pendências e líquido. Gere link com token aleatório armazenado como hash, válido por [7 DIAS], revogável e sem dados pessoais dos clientes. O aviso confirma fechamento, não pagamento.

3. ENVIO
Manual e automático só incluem fechamento completo e líquido > 0. Automático envia somente o dia operacional anterior, após importação, no horário configurável [HORÁRIO] e fuso [FUSO].

4. IDEMPOTÊNCIA
Envio manual ou automático do mesmo dia bloqueia novo automático; falha confirmada pode tentar de novo, resultado incerto exige reconciliação. Não envie dias antigos em lote.

5. FINANCEIRO E TESTES
Lance o total por empresa/dia na categoria [CATEGORIA] com chave única e recálculo controlado, sem duplicar. Teste saldo zero, pedido pendente, revogação, retry e virada de mês.$prompt$,'Entregas e motoboys',6,'blocos/entregas-motoboys.png')
) as v(type,title,summary,body,category,position,thumbnail_url)
where not exists (select 1 from public.contents c where c.type='prompt' and c.title=v.title);