# Análise Técnica do HTML Original e Reestruturação do Projeto

Este documento apresenta o diagnóstico técnico realizado sobre o arquivo original `PCP_Visual_CTEC_V106_PROTEVET_DESINCRUSTANTE_UNIFICADO.html` e detalha as decisões arquiteturais adotadas na nova estrutura para publicação no GitHub.

---

## 1. Diagnóstico do Arquivo Original

### 1.1. Dimensões e Composição do Monólito
O arquivo original possuía **932.522 bytes (~932 KB)** distribuídos em **6.885 linhas**, contendo em um único documento HTML:
- **30 blocos `<style>`** intercalados ao longo do documento (1 bloco principal nas linhas 3–312 e 29 blocos `<style id="vXX-css">` adicionados entre as linhas 1392 e 6759).
- **48 blocos `<script>`** (3 bibliotecas externas via CDN, 1 bloco principal de ~448 KB nas linhas 579–1391 e **44 scripts de patch** incrementais `v41-patch` até `v106-protevet-desincrustante-alias`).
- **~320 KB de dados embutidos em linhas únicas minificadas** dentro do Script #3 (`SEED` com ~140 KB em uma única linha, `FORMULAS` com ~60 KB, `PACKAGING_MASTER` com ~50 KB, `TANK_MASTER` com ~42 KB, `PROD_FORMULA` com ~19 KB).
- **~48 KB de imagem PNG em Base64** embutida diretamente na linha 315 (`<aside><div class=logo><img src="data:image/png;base64,...">`).

### 1.2. Histórico de Evolução por Camadas (Monkey-Patching)
A análise revelou que o sistema evoluiu da versão **V9/V10 até a V106** por meio de camadas sucessivas de *wrapping* (decoradores de função em tempo de execução). Por exemplo:
- Funções centrais como `render()`, `renderEngineering()`, `renderWeekly()`, `renderBombonas()`, `renderMRP()`, `find()`, `packagingSpec()`, `boxSpec()` e `operationalBatchKg()` são declaradas no núcleo e interceptadas pelos patches posteriores (`const vXXPrev = fn; fn = function() { ... }`).
- **Por que isso é crítico na refatoração?** Converter os scripts para ES Modules (`<script type="module">`) isolaria o escopo de cada arquivo, impedindo que os patches sobrescrevessem as funções globais declaradas nos módulos anteriores e quebrando a execução local via `file://` (bloqueio de CORS do navegador para módulos ES locais).

### 1.3. Correção de Bug Silencioso Identificado na Análise (`V104`)
Durante a inspeção estática das referências globais, foi identificado um problema no bloco `<script id="v104-pro-formula-links">` (linha 6713 do original):
```javascript
function v104ApplyProFormulaLinks(){
  if(!window.OPS || typeof v61Key!=='function' || typeof save!=='function'){
    setTimeout(v104ApplyProFormulaLinks,100);return;
  }
  // ...
}
```
- No arquivo original, `OPS` foi declarado com `let OPS` (que no JavaScript moderno não cria propriedade em `window.OPS`), e `v61Key` foi declarada dentro da IIFE privada do `v61-patch` (não exposta no escopo global).
- Como resultado, a condição `!window.OPS || typeof v61Key !== 'function'` era sempre verdadeira e `v104ApplyProFormulaLinks` ficava em *loop* infinito (`setTimeout` a cada 100 ms) sem aplicar o vínculo de fórmula do `Acid Pro` e `Alca Pro`.
- **Correção aplicada na nova estrutura**: Exposição explícita de `window.OPS = OPS` em `src/js/core/state.js` e `window.v61Key = v61Key` em `src/js/patches/v55-v69-weekly-overrides-mrp.js`.

---

## 2. Mapa de Persistência (`localStorage`)

O sistema armazena o estado operacional do usuário nas seguintes chaves do `localStorage` do navegador:

| Chave `localStorage` | Variável Global | Conteúdo Armazenado |
| :--- | :--- | :--- |
| `ctec_v9` | `D` | Base completa de SKUs, saldos de estoque, referências, status de pedidos ativos e histórico por item |
| `ctec_hist_v9` | `H` | Histórico de relatórios PDF do CIGAM importados |
| `ctec_mps_v11` (e compat. `v10`–`v16`) | `MPS` | Plano Mestre de Produção mensal (`plans`, `masterPlans`), notas por item e lista de bateladas (`batches`) |
| `ctec_ops_v18` | `OPS` | Configurações operacionais, semana selecionada, estoque de bombonas, vínculos customizados Produto × Fórmula (`formulaLinks`), overrides de área/estoque e metas de produção |
| `ctec_mp_v17` | `MP` | Saldos atuais de matérias-primas, códigos CIGAM vinculados e histórico de importações de MP |
| `ctec_batch_refs_v14` | `BATCH_REFS` | Referências customizadas de tamanho de batelada (kg) por produto |
| `pcp_ctec_mp_params_v90` | `V90_PARAMS` | Parâmetros da política de estoque de matérias-primas (Curva ABC, Lead Time, Estoque Mínimo, Lote Mínimo) |
| `pcp_ctec_pack_custom_v99` | `V99_PACK` | Customizações manuais do cadastro de embalagens (cor, modelo de bombona e tipo de caixa 5L) |
| `ctec_show_demand` | `showDemand` | Preferência de exibição de itens sob demanda |
| `ctec_show_third_closed` | `showThirdClosed` | Preferência de exibição de produtos terceirizados sem pedido ativo |

---

## 3. Decisões de Arquitetura para o GitHub

1. **Separação de Preocupações (HTML / CSS / Dados / Lógica / Patches)**
   - O `index.html` caiu de **6.885 linhas (932 KB)** para **~340 linhas (~39 KB)** contendo exclusivamente a marcação HTML das seções, modais e referências ordenadas às folhas de estilo e scripts.
   - Os dados mestres (`SEED`, `FORMULAS`, `PACKAGING_MASTER`, `TANK_MASTER`, `MATERIAL_STOCK_SEED`) foram extraídos para `src/data/*.js`, permitindo fácil manutenção e versionamento no Git.
   - O código-fonte principal foi dividido em **8 módulos funcionais** dentro de `src/js/core/` e `src/js/modules/`.
   - Os 44 patches evolutivos foram organizados cronológica e tematicamente em **5 arquivos** dentro de `src/js/patches/`, preservando rigorosamente a ordem de interceptação de funções.

2. **Compatibilidade Híbrida (`file://` + GitHub Pages)**
   - Todos os scripts são carregados de forma síncrona e ordenada via `<script src="...">`, garantindo que o sistema funcione tanto ao clicar duas vezes no `index.html` no Windows quanto hospedado no GitHub Pages.
   - A logo foi extraída como imagem real em `assets/logo-ctec.png` e mantida em `src/data/logo-base64.js` para evitar erros de *tainted canvas* (`SecurityError`) no `html2canvas` ao exportar o quadro da Programação Semanal em PNG localmente.

3. **Gerador de Arquivo Único (`scripts/build-unificado.ps1`)**
   - Como em operações industriais é comum compartilhar o sistema em arquivo único via WhatsApp ou e-mail, o script `scripts/build-unificado.ps1` recompila automaticamente todos os CSS e JS modulares em um único HTML dentro da pasta `dist/`.
