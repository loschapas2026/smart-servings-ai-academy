insert into public.contents (type,title,summary,body,category,published,position,thumbnail_url)
select v.type::public.content_type,v.title,v.summary,v.body,v.category,true,v.position,v.thumbnail_url
from (values
('prompt','Mapa completo: sistema de gestão do restaurante','Planeje um sistema de operação por módulos antes de construir cada bloco.',$prompt$Use este prompt para PLANEJAR, não para construir tudo de uma vez.

1. OBJETIVO
Desenhe o mapa de um sistema de gestão para [NOME DO RESTAURANTE], com [QUANTIDADE DE LOJAS] lojas e as operações [TIPOS DE OPERAÇÃO].

2. LEVANTAMENTO
Pergunte e organize: unidades, setores, papéis, menus por papel, produtos, fornecedores, estoque, produção, cozinha, entregas, equipe, financeiro, integrações e relatórios. Considere [DORES PRINCIPAIS] e [SISTEMAS JÁ UTILIZADOS].

3. BLOCOS
Separe em módulos pequenos: cadastros e acessos; estoque e compras; checagem e produção; escala e equipe; pedidos e cozinha; entregas e motoboys; financeiro e folha; integrações; testes e publicação.

4. ENTREGA
Apresente uma tabela com módulo, dor resolvida, usuários, dados necessários, dependências, prioridade e critério de pronto. Depois proponha uma sequência de prompts pequenos, um por módulo. Não escreva código nesta etapa.

5. REGRAS
Não invente integrações nem números. Marque o que depender de chave, fornecedor ou definição do dono. Preveja uso em celular, computador, tablet e telas ligadas.$prompt$,'Briefing e escopo',1,'blocos/estoque-compras.png'),
('prompt','Mapa completo: portal de clientes e vendas','Planeje site, reservas, fidelidade, campanhas e CRM como uma jornada única.',$prompt$Use este prompt para PLANEJAR um portal de relacionamento antes de implementar os módulos.

1. OBJETIVO
Desenhe a jornada digital de [NOME DO RESTAURANTE], com as unidades [UNIDADES], os cardápios [LINKS DOS CARDÁPIOS] e os objetivos [VENDER, RESERVAR, FIDELIZAR OU DIVULGAR].

2. JORNADA
Mapeie entrada no site, escolha da unidade, produtos, pedido, reserva, cadastro com consentimento, cupons, clube, cashback, campanhas de WhatsApp, retorno ao cardápio e medição de conversão.

3. BLOCOS
Separe: site e vendas; reservas e eventos; promoções e fidelidade; clientes e campanhas; analytics; integrações; segurança e testes.

4. ENTREGA
Mostre uma tabela com bloco, público, ação do cliente, dados capturados, destino, evento medido e dependência. Sugira uma ordem de implantação começando pelo menor fluxo que já gera valor.

5. CUIDADOS
Não simule vendas ou resgates. Não repita cadastro sem necessidade. Normalmente o WhatsApp identifica o cliente; preserve múltiplas tags e consentimentos. Não grave segredos no navegador. Não escreva código nesta etapa.$prompt$,'Briefing e escopo',2,'blocos/site-vendas.png'),
('prompt','Site multi-unidades com pedidos por unidade','Crie uma home moderna que leva o cliente ao cardápio certo.',$prompt$1. OBJETIVO
Crie o site de [NOME DO RESTAURANTE] para apresentar [QUANTIDADE DE UNIDADES] negócios ou unidades e levar o cliente ao pedido sem confusão.

2. PERSONALIZE
Logo: [LOGO]. Cores: [CORES]. Unidades e links: [LISTA DE UNIDADES E CARDÁPIOS]. Tom: [TOM DA MARCA]. Fotos reais: [FOTOS DOS PRODUTOS E AMBIENTE].

3. CONSTRUA
Topo com identidade e chamada principal; cartões impactantes por unidade; botões com nomes claros; produtos em destaque; história curta; horários, localização e contato; rodapé com redes sociais. No celular, os botões de pedido não podem cobrir conteúdo.

4. EXPERIÊNCIA
Use fotos reais quando fornecidas, contraste alto, foco no produto e poucos elementos concorrendo com o pedido. Cada unidade abre seu próprio link em nova aba. Configure título, descrição e compartilhamento de cada página.

5. CRITÉRIOS DE PRONTO
Teste em celular, tablet e computador; confira todos os links; não use números, avaliações ou selos inventados; mantenha navegação acessível por teclado e textos legíveis.$prompt$,'Site e vendas',1,'blocos/site-vendas.png'),
('prompt','Vitrine de produtos com cardápio real','Mostre produtos, preços e botões de compra usando dados reais ou um fallback honesto.',$prompt$1. OBJETIVO
Adicione ao site de [NOME DO RESTAURANTE] uma vitrine de produtos que desperte desejo e leve ao cardápio [LINK DO CARDÁPIO].

2. DADOS
Use os produtos [PRODUTOS OU ENDPOINT DO CARDÁPIO], com nome, descrição, preço, imagem, unidade e link. Se houver API, valide o formato e trate paginação, indisponibilidade e cache.

3. TELA
Crie seção “Mais pedidos” ou [NOME DA SEÇÃO], cartões com foto, nome, descrição curta, preço e botão de pedido. Permita escolher manualmente os destaques no admin sem editar código.

4. REGRAS
Nunca invente produto, preço ou disponibilidade. Se a fonte falhar, mostre uma vitrine cadastrada manualmente ou aviso discreto; não finja que o dado é ao vivo. Fotos melhoradas não podem alterar o produto real.

5. VALIDAÇÃO
Confira preços e links com o cardápio, imagens em proporção consistente, carregamento lento e funcionamento no celular. Registre cliques sem coletar dados desnecessários.$prompt$,'Site e vendas',2,'blocos/site-vendas.png'),
('prompt','Status das lojas e avisos operacionais','Abra ou feche unidades e avise o cliente sem apagar os canais de contato.',$prompt$1. OBJETIVO
Crie um controle no admin para cada unidade de [NOME DO RESTAURANTE]: [UNIDADES].

2. CONFIGURAÇÃO
Para cada unidade permita ativa/inativa, mensagem de fechamento, horário de funcionamento e motivo [MANUTENÇÃO, FALTA DE ENERGIA, EVENTO OU OUTRO].

3. COMPORTAMENTO
Quando fechada, mantenha o cartão visível, desabilite o pedido com explicação clara e ofereça [CONTATO OU OUTRA UNIDADE]. Quando ativa, restaure o botão. Aplique a mesma configuração na home, reservas, campanhas e fallback de promoções.

4. SEGURANÇA
Somente admin altera o status. O público lê apenas nome, status e mensagem; não exponha configurações internas. Atualize sem exigir nova publicação do site.

5. TESTES
Teste cada unidade isoladamente, todas fechadas, mudança durante a navegação e retorno à operação. Não deixe botão aparentemente ativo levar a pedido bloqueado sem aviso.$prompt$,'Site e vendas',3,'blocos/site-vendas.png'),
('prompt','Tour, localização e contato do restaurante','Apresente o espaço e facilite visita, rota e conversa com a equipe.',$prompt$1. OBJETIVO
Acrescente ao portal de [NOME DO RESTAURANTE] os recursos de visita e contato.

2. CONTEÚDO
Tour 360: [LINK DO TOUR]. Endereço: [ENDEREÇO]. Mapa: [LINK DO MAPA]. WhatsApp: [WHATSAPP]. Redes sociais: [REDES SOCIAIS]. Horários: [HORÁRIOS].

3. CONSTRUA
Botão de tour próximo às opções de unidade; seção de ambiente com fotos reais; mapa ou link de rota; botões de telefone e WhatsApp com mensagem inicial; horários por unidade.

4. EXPERIÊNCIA
Não deixe botões flutuantes taparem o cardápio no celular. Abra tour e mapa sem perder o site. Informe quando o tour for externo. Meça cliques em tour, rota e WhatsApp como eventos distintos.

5. PRONTO QUANDO
Todos os destinos funcionam em aparelho móvel, os textos estão em pt-BR e os dados de contato são os fornecidos, sem telefone ou endereço inventado.$prompt$,'Site e vendas',4,'blocos/site-vendas.png'),
('prompt','Analytics do site e Meta Pixel','Meça visitas, cliques e conversões por período sem inflar os números.',$prompt$1. OBJETIVO
Implemente analytics no portal de [NOME DO RESTAURANTE] para saber o que gera pedido, reserva e cadastro.

2. EVENTOS
Registre página, data/hora, unidade, botão e campanha para: escolha de cardápio, reserva, cupom, tour, WhatsApp, roleta e clube. Use identificador anônimo sempre que possível.

3. PAINEL
Crie filtros hoje, 7 dias, 30 dias e período personalizado; cartões de visitantes, cliques, cadastros e conversões; gráficos por dia, unidade e origem. Busque todos os registros com paginação, sem limite silencioso de 1.000 linhas.

4. META PIXEL
Permita configurar [PIXEL ID] somente no admin e dispare somente após a política de consentimento [POLÍTICA DE COOKIES]. Não envie telefone, nome ou data de nascimento para o pixel.

5. QUALIDADE
Evite contagem duplicada em recarregamento e deixe claro o que é evento real. Teste períodos sem dados, virada de mês e exportação.$prompt$,'Site e vendas',5,'blocos/clientes-campanhas.png'),
('prompt','Reserva online com confirmação no WhatsApp','Receba reservas com código único e envie o resumo para o atendimento.',$prompt$1. OBJETIVO
Crie uma página pública de reservas para [NOME DO RESTAURANTE].

2. CAMPOS
Nome completo, WhatsApp, data, horário, número de convidados, unidade [UNIDADES], observação e aceite de marketing opcional. Use regras de data e capacidade [REGRAS DE ATENDIMENTO].

3. FLUXO
Valide os dados, salve a reserva, gere código legível único e mostre confirmação. Ofereça botão para WhatsApp [WHATSAPP DO ATENDIMENTO] com código, nome, data, horário, unidade e convidados formatados. Não dependa apenas do WhatsApp para gravar.

4. SEGURANÇA
O envio público deve passar por servidor com validação, limite de tentativas e proteção antirobô. O cliente não pode listar reservas. Admin usa autenticação e papel próprio, nunca senha fixa no código.

5. TESTES
Teste dados inválidos, data passada, duplo clique, nova tentativa e confirmação no celular. O código não pode se repetir e a tela deve informar se a gravação falhar.$prompt$,'Reservas e eventos',1,'blocos/reservas-eventos.png'),
('prompt','Admin de reservas com limite de capacidade','Gerencie reservas confirmadas e coloque excedentes em aprovação manual.',$prompt$1. OBJETIVO
Crie o painel administrativo das reservas de [NOME DO RESTAURANTE].

2. CONFIGURAÇÃO
Permita definir capacidade diária de [CAPACIDADE] pessoas por unidade e alterar esse limite sem código.

3. REGRA PRINCIPAL
Some os convidados das reservas confirmadas na mesma data e unidade. Se a nova reserva ultrapassar a capacidade, salve como pendente e informe que depende de confirmação manual no WhatsApp. Cancelamentos liberam capacidade; confirmar pendente deve revalidar o total para evitar corrida entre duas pessoas.

4. PAINEL
Mostre reservas de hoje, convidados esperados, pendentes e capacidade; gráfico dos próximos 7 dias com alerta; filtros por data, unidade e status; ações confirmar/cancelar; link de WhatsApp.

5. SEGURANÇA E TESTES
Somente papel autorizado lê dados dos clientes. Teste limite exato, um acima, duas reservas simultâneas, cancelamento e confirmação de pendente. Não confirme automaticamente acima do limite.$prompt$,'Reservas e eventos',2,'blocos/reservas-eventos.png'),
('prompt','Relatórios e previsão de reservas','Exporte a agenda e enxergue ocupação, pendentes e evolução mensal.',$prompt$1. OBJETIVO
Crie relatórios de reservas para [NOME DO RESTAURANTE] com dados do período [PERÍODO PADRÃO].

2. RELATÓRIOS
Exporte PDF e CSV com código, cliente, WhatsApp, unidade, data, horário, convidados, status e observação. Respeite os filtros aplicados e informe data de geração.

3. INDICADORES
Mostre reservas por dia e mês, convidados, cancelamentos, pendentes, ocupação versus capacidade e previsão dos próximos 7 dias. Diferencie data de criação da reserva e data da visita.

4. REGRAS
Não conte canceladas como público esperado. Paginação deve buscar toda a base. Datas passadas e meses futuros precisam de filtros coerentes; use o fuso [FUSO HORÁRIO].

5. PRIVACIDADE
Somente admin exporta. No compartilhamento de telas, mascare telefone quando não for necessário. Teste arquivo vazio, grande volume e caracteres acentuados.$prompt$,'Reservas e eventos',3,'blocos/reservas-eventos.png'),
('prompt','Página de evento com inscrições e exportação','Crie landing pages para eventos, casting ou ações especiais com leads organizados.',$prompt$1. OBJETIVO
Crie uma landing page para [NOME DO EVENTO] de [NOME DO RESTAURANTE], com identidade [CORES E ESTILO] e data [DATA].

2. CONTEÚDO
Apresente proposta, benefícios, fotos, regras, vagas ou aviso de vagas ilimitadas, perguntas frequentes e botão de inscrição. Não invente prêmios, marcas ou condições.

3. FORMULÁRIO
Capture [CAMPOS DA INSCRIÇÃO], WhatsApp, data de nascimento quando necessária, consentimento e campo específico do evento, como Instagram, comanda ou número de participantes. Gere código único e impeça duplicidade conforme [REGRA DE DUPLICIDADE].

4. ADMIN
Liste, pesquise, filtre por período, marque acompanhado/selecionado quando fizer sentido, exporte Excel/CSV com tag CRM [TAG CRM] e exclua com confirmação. Eventos diferentes devem ter origens separadas.

5. SEGURANÇA
Valide no servidor, proteja contra spam e limite acesso administrativo. Teste celular, cadastro repetido, exportação e regras da campanha.$prompt$,'Reservas e eventos',4,'blocos/reservas-eventos.png'),
('prompt','Evento com pedidos agendados e limites por horário','Organize uma ação de alta demanda sem prometer capacidade que a cozinha não tem.',$prompt$1. OBJETIVO
Crie uma página para o evento [NOME DO EVENTO], em [DATA], com pedidos exclusivamente por [LINK DO CARDÁPIO].

2. CONFIGURAÇÃO ADMIN
Ative atalho na home ou assuma a home no dia; defina data, metas, horários de retirada [HORÁRIOS], limites por produto e horário [LIMITES], regras de pagamento, atraso, retirada e cancelamento.

3. PÁGINA
Mostre chamada, produtos, botão único de pedido, captura opcional de aniversário, regras claras e disponibilidade por horário. Respeite direitos de reembolso e não use texto que impeça direito legal do consumidor.

4. NÚMEROS REAIS
Integre pedidos pagos e não cancelados, deduplique por identificador e agregue quantidades por horário. Se faltar credencial ou mapeamento, mostre “aguardando dados”; nunca invente contagem.

5. TESTES
Teste virada do evento, limite exato, pedido cancelado, duplicado, fuso horário e home normal antes/depois. O painel público expõe apenas agregados, nunca clientes ou pedidos individuais.$prompt$,'Reservas e eventos',5,'blocos/reservas-eventos.png'),
('prompt','Bolão ou palpite com comanda única','Registre participações em jogos sem repetir telefone ou comanda no mesmo dia.',$prompt$1. OBJETIVO
Crie uma página de palpites para [NOME DA AÇÃO] nos jogos [LISTA DE JOGOS].

2. CADASTRO
Capture nome, WhatsApp, data de nascimento, número da comanda, jogo e palpite [FORMATO DO PALPITE]. Exija consentimento para comunicações separadamente da participação.

3. REGRAS
No mesmo dia, um telefone só participa uma vez e uma comanda só pode ser usada uma vez. Faça essa validação também no banco com chave única, não apenas na tela. Preserve histórico e permita correção por admin.

4. FLUXO
Mostre confirmação e envie resumo pelo WhatsApp usando [PROVEDOR E TEMPLATE]. Não envie novamente ao recarregar a página. Admin pesquisa, exporta e limpa a ação com dupla confirmação, sem apagar outras bases de clientes.

5. TESTES
Teste mesmo telefone, mesma comanda, dias diferentes, erro no envio e duplo clique. O palpite não pode ser tratado como aposta financeira nem cobrar participação sem uma análise legal específica.$prompt$,'Reservas e eventos',6,'blocos/reservas-eventos.png'),
('prompt','Cupons com horário, quantidade e escassez real','Crie ofertas por unidade com ativação programada e estoque controlado.',$prompt$1. OBJETIVO
Crie cupons para as unidades [UNIDADES] de [NOME DO RESTAURANTE].

2. CADASTRO
Cada cupom tem imagem, título, unidade, quantidade total, quantidade usada, início/fim, dias e horários, link de resgate e status inativo/ativo/esgotado. Permita [QUANTIDADE POR UNIDADE] cupons por unidade.

3. COMPORTAMENTO
Fora da janela mostre “aguardando ativação”; dentro e com saldo, permita resgatar; ao esgotar mostre faixa “esgotado”. Admin pode esgotar manualmente. Atualize a disponibilidade sem recarregar toda a página.

4. REGRA DE BAIXA
Só desconte quantidade após resgate confirmado no servidor, com transação e chave de idempotência. Não baixe cupom por clique comum, animação ou prova social simulada.

5. SEGURANÇA E TESTES
Leitura pública só dos campos da oferta; alterações exigem admin. Teste início/fim, virada de horário, última unidade, duas pessoas resgatando juntas e reativação.$prompt$,'Promoções e fidelidade',1,'blocos/promocoes-fidelidade.png'),
('prompt','Captura de leads antes dos cupons','Identifique o cliente uma vez e reaproveite o cadastro com consentimento.',$prompt$1. OBJETIVO
Exija um cadastro curto antes de liberar os cupons de [NOME DO RESTAURANTE].

2. CAMPOS
Nome, WhatsApp, data de nascimento, aceite das regras da promoção e consentimento de marketing separado. Inclua proteção antirobô acessível.

3. REAPROVEITAMENTO
Normalise o telefone e procure nas origens [RESERVAS, WIFI, CLUBE, PROMOÇÕES]. Se já existir, libere sem pedir tudo de novo; complete dados ausentes sem apagar tags ou consentimento anterior.

4. ADMIN E EXPORTAÇÃO
Crie menu de leads com busca, origem, data, filtro e exportação Excel/CSV nas colunas [COLUNAS DE EXPORTAÇÃO], pronta para importar no CRM. Registre origem e data de cada cadastro.

5. PRIVACIDADE E TESTES
Explique o uso dos dados e permita descadastro. Somente admin lê a base completa. Teste telefone com/sem DDI, cliente antigo, novo, sem marketing e inválido. Não armazene senha ou código OTP no navegador.$prompt$,'Promoções e fidelidade',2,'blocos/promocoes-fidelidade.png'),
('prompt','Roleta de prêmios com probabilidade e limite real','Sorteie prêmios com estoque, probabilidades e um giro por participante.',$prompt$1. OBJETIVO
Crie uma roleta de [QUANTIDADE DE PRÊMIOS] prêmios para [NOME DA CAMPANHA].

2. ADMIN
Configure prêmio, descrição, ícone, cor, código, link, probabilidade, quantidade total e sorteados; tempo do giro, música e campanha ativa. A soma das probabilidades deve ser validada e o estoque zero impede o prêmio.

3. SORTEIO
Identifique o participante por WhatsApp verificado ou conta. Garanta um giro por pessoa/campanha com registro único no servidor; localStorage serve só para experiência, nunca como proteção. Faça sorteio ponderado e baixa de estoque em transação.

4. EXPERIÊNCIA
Animação deve revelar o prêmio já definido pelo servidor, com som opcional, confetes e botão de resgate. Registre giro, prêmio, status do envio e resgate sem permitir replay.

5. TESTES
Teste probabilidade zero, estoque esgotado, duas abas, recarregar, tentativa com outro aparelho e falha após sorteio. Não prometa prêmio indisponível nem altere o resultado na animação.$prompt$,'Promoções e fidelidade',3,'blocos/promocoes-fidelidade.png'),
('prompt','Mensagem do dia para compartilhar','Crie um cartão diário com frases cadastradas e imagem para stories.',$prompt$1. OBJETIVO
Crie o recurso “[NOME DO RECURSO]” com uma mensagem positiva por dia para clientes de [NOME DO RESTAURANTE].

2. CONTEÚDO
Admin cadastra frase, subtítulo, tema, data opcional e ativo. Escolha uma mensagem por pessoa/dia sem repetição indevida e mantenha histórico para analytics.

3. EXPERIÊNCIA
Mostre popup apenas uma vez ao dia, com nome opcional do cliente, identidade da marca e botão fechar. Gere imagem vertical para stories com texto legível e compartilhamento nativo; ofereça baixar PNG quando o navegador não suportar.

4. REGRAS
Não afirme sorteio ou prêmio se for apenas mensagem. Não capture a tela com botões ou dados privados. Salve preferência local para experiência, mas mantenha métricas sem dados pessoais desnecessários.

5. TESTES
Teste celular iOS/Android, desktop, texto longo, acentos, nome grande, biblioteca de compartilhamento indisponível e mudança de dia.$prompt$,'Promoções e fidelidade',4,'blocos/promocoes-fidelidade.png')
) as v(type,title,summary,body,category,position,thumbnail_url)
where not exists (select 1 from public.contents c where c.type='prompt' and c.title=v.title);