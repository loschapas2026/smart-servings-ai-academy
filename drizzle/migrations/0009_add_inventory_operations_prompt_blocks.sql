insert into public.contents (type,title,summary,body,category,published,position,thumbnail_url)
select v.type::public.content_type,v.title,v.summary,v.body,v.category,true,v.position,v.thumbnail_url
from (values
('prompt','Acessos por setor, loja e permissão','Crie usuários individuais com menus e ações limitadas ao trabalho de cada papel.',$prompt$1. OBJETIVO
Crie autenticação e autorização para [NOME DO SISTEMA], com os papéis [PAPÉIS] e unidades [UNIDADES].

2. MATRIZ
Antes das telas, monte tabela papel × menu × ação × loja. Diferencie admin, usuário e funcionário e permissões como estoque, contagem, movimentação, checagem, produção e financeiro.

3. REGRAS
Admin cria e desativa usuários, redefine acesso e encerra sessões. Usuário só acessa lojas vinculadas. Esconder menu não basta: repita autorização nas funções servidor e políticas do banco.

4. ADMIN E MFA
Exija MFA para admin com sessão revalidada e dispositivo confiável por [PRAZO]. Não use senha compartilhada, papel no localStorage ou segredo TOTP salvo no navegador.

5. TESTES
Para cada papel, tente abrir URL e chamar diretamente uma ação proibida. Teste usuário sem loja, perda de permissão durante sessão e falha temporária ao carregar papéis. Registre ações administrativas.$prompt$,'Regras e dados',1,'blocos/integracoes-automacoes.png'),
('prompt','Empresas, lojas e configurações da operação','Estruture uma ou várias empresas sem misturar dados e parâmetros.',$prompt$1. OBJETIVO
Crie a base de empresas e lojas para [NOME DO RESTAURANTE OU GRUPO].

2. ESTRUTURA
Cadastre empresas, lojas, membros, vínculos usuário–loja e configurações chave/valor por escopo. Defina se será [UMA EMPRESA OU MULTIEMPRESA] desde o início.

3. ISOLAMENTO
Toda tabela operacional precisa do identificador da empresa/loja quando aplicável. Não deixe empresa fixa no código. Funções de empresa atual devem derivar do usuário autenticado e ser validadas no servidor.

4. CONFIGURAÇÃO
Admin gerencia parâmetros como contatos, horários, limites e integrações por unidade. Segredos não entram em configurações públicas nem no navegador.

5. TESTES
Crie duas empresas e duas lojas de exemplo; prove que um membro não lê nem altera a outra. Teste mudança de vínculo, ausência de empresa e relatórios agregados sem vazamento.$prompt$,'Regras e dados',2,'blocos/integracoes-automacoes.png'),
('prompt','Cadastro de produtos, categorias e fornecedores','Crie a base de insumos com unidades, contatos, preços e imagens consistentes.',$prompt$1. OBJETIVO
Crie os cadastros de compras e estoque de [NOME DO RESTAURANTE].

2. PRODUTOS
Campos: nome, categoria, unidade [UN, KG, CX, FD, LT E OUTRAS], foto, fornecedor, ativo, estoque mínimo/atual/desejado e último preço. Permita vínculo do produto com várias lojas.

3. FORNECEDORES
Cadastre nome, WhatsApp, contato, observações e condições. Mantenha histórico de preços por data, embalagem e unidade; não sobrescreva o passado ao atualizar preço.

4. REGRAS
Somente admin cadastra e desativa. Produto desativado sai de novas operações sem apagar histórico. Padronize nomes e unidades para evitar duplicidade e conversões erradas.

5. TESTES
Teste nome obrigatório, unidade inválida, produto em duas lojas, desativação e preço por embalagem. Importações devem sinalizar itens não reconhecidos para revisão, sem adivinhar.$prompt$,'Estoque e compras',1,'blocos/estoque-compras.png'),
('prompt','Estoque com entradas, saídas e histórico','Controle saldo, reposição e consumo com movimentos rastreáveis.',$prompt$1. OBJETIVO
Implemente estoque para [NOME DO RESTAURANTE] com os produtos já cadastrados.

2. MOVIMENTOS
Registre entrada/saída, produto, quantidade, preço unitário, fornecedor, observação, usuário e data. Quantidade deve ser maior que zero; entrada pode atualizar último preço sem apagar histórico.

3. SALDO
Calcule saldo em transação no servidor e impeça saída maior que o disponível mesmo com duas pessoas operando juntas. Não confie apenas no saldo carregado na tela.

4. TELAS
Estoque por categoria com mínimo/atual/desejado e alertas; formulário de movimento; histórico por produto, tipo, usuário e período; relatório de conferência para usuário autorizado.

5. TESTES
Teste zero, negativo, saída maior, entradas simultâneas e cancelamento/estorno. Não edite um movimento antigo sem trilha; prefira lançamento de ajuste com motivo.$prompt$,'Estoque e compras',2,'blocos/estoque-compras.png'),
('prompt','Inventário com sessão e revisão de contagem','Faça contagem física guiada e reconcilie o saldo com segurança.',$prompt$1. OBJETIVO
Crie inventário de estoque para [NOME DO RESTAURANTE], otimizado para celular.

2. FLUXO
Abra sessão, liste categorias/produtos, avance item a item, revise e conclua. Guarde saldo anterior, quantidade contada, diferença, usuário e horário.

3. VALIDAÇÃO
Recuse negativo e número inválido. Campo vazio significa “não contado”, nunca zero automático; zero só quando digitado explicitamente. Alterar metas exige admin.

4. GRAVAÇÃO
Salve item e atualização do saldo em uma única transação. Permita retomar sessão sem duplicar efeito e impeça duas conclusões. Histórico deve mostrar quem contou e os ajustes.

5. TESTES
Teste campo vazio, zero real, duplo clique, retomada, duas pessoas na sessão e falha no meio. A contagem altera saldo: exija confirmação final e permissão própria.$prompt$,'Estoque e compras',3,'blocos/estoque-compras.png'),
('prompt','Checagem diária da loja e pedido de reposição','Transforme a contagem da unidade em pedido revisável para produção ou revenda.',$prompt$1. OBJETIVO
Crie checagem diária para as lojas [LOJAS], com operadores vinculados.

2. FLUXO
Etapas contagem → revisão → enviado. Cada produto mostra sugerido do dia, estoque contado e necessidade = max(0, sugerido − contado). Permita ajustar quantidade antes de enviar.

3. EXTRAS
No fim, permita solicitar item não listado e classifique como produzido ou revenda. Preserve ajustes e observações; concluir não pode aumentar estoque automaticamente sem produção/entrada correspondente.

4. DIA OPERACIONAL
Use virada às [HORÁRIO DE VIRADA] e fuso [FUSO] para escolher o dia da sugestão, inclusive na janela após meia-noite. Reivindique a sessão no servidor para evitar envio duplicado.

5. TESTES
Teste sugerido menor que estoque, item extra, ajuste salvo, duas abas e envio após meia-noite. Somente a loja vinculada pode ver e alterar sua checagem.$prompt$,'Estoque e compras',4,'blocos/estoque-compras.png'),
('prompt','Estoque da produção por grupo','Conte itens produzidos por grupo sem perder diferenças e vínculos.',$prompt$1. OBJETIVO
Crie estoque de produção para os grupos [GRUPOS DE PRODUÇÃO].

2. ESTRUTURA
Vincule produtos a cada grupo, com saldo, metas e unidade. Diferencie insumo, item produzido e revenda para não misturar contagens.

3. CONTAGEM
Abra sessão por grupo; registre saldo anterior, contado e diferença = contado − anterior. Item é único por sessão e grupo. Quantidades não podem ser negativas.

4. CONSISTÊNCIA
Gravar item e atualizar o saldo do grupo deve ocorrer na mesma transação. Reabrir ou cancelar produção precisa reverter somente o efeito correspondente, sem apagar histórico.

5. TESTES
Teste grupo com vários produtos, contagem repetida, diferença negativa, falha parcial e retomada. Relatório mostra saldo e diferenças por sessão sem inventar consumo.$prompt$,'Estoque e compras',5,'blocos/estoque-compras.png'),
('prompt','Compra sugerida pelo estoque desejado','Gere lista de reposição e exporte sem incluir itens desnecessários.',$prompt$1. OBJETIVO
Crie a compra sugerida de [NOME DO RESTAURANTE] a partir do estoque atual.

2. CÁLCULO
Para cada produto ativo: sugestão = max(0, estoque desejado − estoque atual). Permita filtros por categoria, loja e fornecedor e ajuste manual com motivo.

3. SAÍDAS
Mostre lista agrupada, valor estimado quando houver preço, itens sem preço e sem fornecedor. Exporte PDF/CSV e versão de impressão 80 mm; não envie lista vazia.

4. INTEGRAÇÃO
Permita transformar a seleção em cotação ou pedido, mantendo quantidades e unidades. A lista não baixa estoque nem confirma compra até recebimento.

5. TESTES
Teste desejado menor que atual, produto sem preço, unidade diferente, ajuste manual e exportação grande. Valores totais devem indicar quando são estimativas.$prompt$,'Estoque e compras',6,'blocos/estoque-compras.png'),
('prompt','Cotação com fornecedores por link','Envie produtos e quantidades para fornecedores responderem sem login complexo.',$prompt$1. OBJETIVO
Crie rodadas de cotação para [NOME DO RESTAURANTE].

2. RODADA
Nome, itens, quantidades, unidades, fotos, observações, fornecedores e prazo. Exija ao menos um produto e um fornecedor. Permita editar antes do envio e importar contatos da cotação anterior.

3. PORTAL
Cada fornecedor recebe link individual com token, vê só seus itens, preenche preço, embalagem e observação e envia. Permita reabrir conforme [REGRA] e registre cada submissão.

4. COBRANÇA
Liste quem respondeu e envie lembrete apenas aos pendentes, manualmente ou por agendamento, sem misturar template de cotação com pedido.

5. SEGURANÇA E TESTES
Token é credencial: use hash, expiração e revogação. Teste link inválido, resposta após prazo, dupla submissão, item sem preço e fornecedor tentando acessar outra rodada.$prompt$,'Estoque e compras',7,'blocos/estoque-compras.png'),
('prompt','Análise de cotação, vencedores e economia','Compare preços por item, troque fornecedor e preserve suas escolhas.',$prompt$1. OBJETIVO
Crie a análise da cotação [NOME DA COTAÇÃO].

2. COMPARAÇÃO
Normalize preço pela mesma unidade antes de comparar. Pré-selecione o menor preço por produto, permita trocar o fornecedor, excluir item ou desconsiderar fornecedor e salve essas escolhas.

3. ECONOMIA
Mostre total pelo menor preço, maior preço, economia em R$ e %, e tabela item a item. Ao desconsiderar fornecedor, seus itens passam ao próximo menor e todos os totais são recalculados.

4. FECHAMENTO
Marque itens sem nenhuma oferta e permita copiar a lista. Gere pedidos separados por fornecedor somente com os itens vencidos; não trate preço de embalagem diferente como equivalente sem conversão.

5. TESTES
Teste empate, unidade incompatível, fornecedor desconsiderado, item sem oferta, atualização da página e dupla geração do pedido. Escolhas manuais não podem voltar ao padrão sozinhas.$prompt$,'Estoque e compras',8,'blocos/estoque-compras.png'),
('prompt','Comparar orçamento em PDF com histórico de preços','Leia orçamentos, associe produtos e mostre aumentos antes de fechar a compra.',$prompt$1. OBJETIVO
Crie importação de orçamento em PDF para [NOME DO RESTAURANTE].

2. LEITURA
Detecte fornecedor, itens, embalagem, quantidade e preço usando parser/IA. Mostre os itens extraídos para revisão antes de salvar; IA não pode inventar produto ou identificador.

3. ASSOCIAÇÃO
Compare com o catálogo e permita confirmar ou corrigir o vínculo. Converta embalagem e unidade somente com regra conhecida; itens ambíguos ficam pendentes.

4. ANÁLISE
Compare preço unitário com última compra, mostre aumento, redução e variação percentual por item e total. Gere pré-pedido apenas após revisão.

5. TESTES
Teste PDF ilegível, produto duplicado, embalagem diferente, preço ausente e fornecedor errado. Guarde documento original e resultado da análise para auditoria.$prompt$,'Estoque e compras',9,'blocos/estoque-compras.png'),
('prompt','Pedidos a fornecedores com confirmação externa','Envie o pedido certo a cada fornecedor e acompanhe entrega da mensagem e retorno.',$prompt$1. OBJETIVO
Crie pedidos aos fornecedores de [NOME DO RESTAURANTE].

2. PEDIDO
Gere por fornecedor os itens, quantidades, preços acordados, observações e link individual. Normalise o WhatsApp e mantenha histórico de criação e alterações.

3. ENVIO
Use [WHATSAPP OU TELEGRAM], template próprio e botão para o fornecedor abrir o pedido. Registre criado, enviado, aceito pelo provedor, entregue, falhou e confirmado pelo fornecedor como estados distintos.

4. RETENTATIVA
Agende retry apenas para falhas elegíveis com chave de idempotência. Timeout exige consulta ao provedor antes de reenviar; nunca duplique pedido por clicar duas vezes.

5. TESTES
Teste telefone inválido, token expirado, falha temporária, retorno sem mensagem e retry simultâneo. O fornecedor só acessa o próprio pedido.$prompt$,'Estoque e compras',10,'blocos/estoque-compras.png'),
('prompt','Notas fiscais com XML, estoque e contas a pagar','Importe a nota, revise produtos e embalagens e destine os dados sem duplicar.',$prompt$1. OBJETIVO
Crie entrada de NF-e para [CNPJ E NOME DA EMPRESA] usando [XML, PDF OU FOCUS NFE].

2. IMPORTAÇÃO
Busque ou envie documento, valide chave da nota e impeça duplicidade. Credenciais e certificados ficam no servidor; consulta sob demanda e downloads de XML/DANFE são registrados.

3. REVISÃO
Associe cada item ao produto e revise destino [UN, FD, CX, KG], tamanho da embalagem, quantidade convertida e preço. PDF exige confirmação humana da extração.

4. DESTINO
Após confirmar, gere entrada de estoque e conta a pagar em transação ou fluxo recuperável. Se a nota tiver parcelas, use-as; senão permita lançamento manual. Não emita nem manifeste fiscalmente sem regra e autorização explícitas.

5. TESTES
Teste nota repetida, item não reconhecido, conversão, parcelas, falha após estoque e cancelamento. Preserve documento e trilha de quem confirmou.$prompt$,'Estoque e compras',11,'blocos/estoque-compras.png'),
('prompt','Linha de produção com conclusão e cancelamento','Execute pedidos internos por item e mantenha o estoque coerente.',$prompt$1. OBJETIVO
Crie a linha de produção para [NOME DO RESTAURANTE], atendendo [LOJAS].

2. FILA
Agrupe pedidos por loja, dia e disparo; mostre item, quantidade, origem e estado. Permita concluir item, cancelar por falta de insumo/excedente, arquivar e reativar com permissão.

3. ESTOQUE
Concluir gera a entrada do item produzido uma única vez. Cancelar não aumenta estoque. Reabrir exige reversão ou ajuste vinculado, sem apagar histórico nem duplicar ao concluir novamente.

4. COMPROVANTE
Gere comprovante de produção e histórico com usuário, horário, quantidade e motivo de alterações. Automatizações usam as mesmas ações da tela.

5. TESTES
Teste concluir duas vezes, cancelar após concluir, reabrir, duas pessoas no mesmo item e falha no estoque. O estado visual só muda após confirmação do servidor.$prompt$,'Produção e equipe',1,'blocos/producao-equipe.png'),
('prompt','Sugerido semanal e análise de produção por IA','Ajuste previsões por dia da semana usando histórico e aprovação humana.',$prompt$1. OBJETIVO
Crie sugerido semanal por loja, produto e dia para [NOME DO RESTAURANTE].

2. BASE
Use checagens e pedidos reais de [JANELA HISTÓRICA]. Mantenha uma linha por produto/dia e permita edição manual da sugestão.

3. IA
Calcule variações e rankings no sistema; envie à IA apenas dados necessários e exija JSON válido. Limite sugestões e não permita identificadores inventados. Antecipações só para itens produzidos, não revenda.

4. APROVAÇÃO
Mostre proposta, motivo, dados usados e confiança; admin seleciona o que aplicar. Poucos dados geram postura conservadora. Nunca altere a tabela sem confirmação.

5. TESTES
Teste histórico vazio, resposta inválida da IA, item removido, proposta duplicada e aplicação parcial. Registre versão aplicada e permita revisão posterior.$prompt$,'Produção e equipe',2,'blocos/producao-equipe.png')
) as v(type,title,summary,body,category,position,thumbnail_url)
where not exists (select 1 from public.contents c where c.type='prompt' and c.title=v.title);