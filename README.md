# PCP Visual — Grupo C-TEC (V106)

Sistema web integrado de **Planejamento e Controle da Produção (PCP)**, **Plano Mestre de Produção (PMP)**, **Programação Semanal**, **Gestão de Embalagens (Bombonas/Caixas)**, **Engenharia de Produto (Fórmulas e Tanques)** e **MRP / Compras de Matérias-Primas** do **Grupo C-TEC**.

---

## Visão Geral e Funcionalidades

O **PCP Visual C-TEC** funciona 100% no navegador (Client-Side SPA), sem necessidade de servidor de banco de dados externo, utilizando persistência local (`localStorage`), importação direta de relatórios PDF do ERP **CIGAM** e exportação de relatórios gerenciais em **Excel (.xlsx)**, **CSV**, **PNG (para WhatsApp)** e **Impressão A4**.

### Módulos do Sistema

1. **Dashboard de Estoques (`#dashboard`)**
   - Indicadores rápidos por criticidade (*Normal*, *Abaixo da Referência*, *Atenção*, *Crítico*).
   - Gráficos dinâmicos de distribuição de estoque e risco por linha de produto (*ANVISA*, *MAPA Veterinário*, *CROP*).
   - Filtros por linha, status, itens sob demanda e marcas terceirizadas.

2. **Base de Estoque (`#estoque`)**
   - Cadastro completo de SKUs (apresentações em Litros, Kg e Amostras 150 mL).
   - Edição de parâmetros por SKU (Estoque de Referência, Ponto de Atenção, Linha/Área, Ajuste Manual auditado e Curva Histórica SVG).
   - **Backup e Restauração em JSON** de toda a base operacional.

3. **Pendências (`#pendencias`)**
   - Auditoria automática de cadastros incompletos, códigos CIGAM ausentes, parâmetros não preenchidos ou itens novos detectados na importação.

4. **Importações CIGAM (`#importacoes`)**
   - Leitor inteligente em JavaScript (`PDF.js`) do relatório PDF **Relação de Pedido/Material** exportado do CIGAM.
   - Reconhecimento automático de produtos próprios, marcas terceirizadas com pedido ativo, SKUs de exportação (`PY` / `BOL`) e amostras de `150 mL`.

5. **PMP — Plano Mestre de Produção (`#mps`)**
   - Planejamento mensal de produção com cálculo automático de necessidade líquida (**MTO** para pedidos negativos e **MTS** para recomposição de estoque de referência).
   - **Gestão de Bateladas**: criação e edição de bateladas vinculadas aos tanques oficiais de fabricação, cálculo de densidade ($\text{kg/L}$), ocupação de tanque e distribuição por apresentação (`5L`, `20L`, `50L`, `200L`, `150mL`).

6. **Programação Semanal (`#semanal`)**
   - Quadro operacional de segunda a sexta-feira (com suporte a sábado opcional) ordenado por linha produtiva.
   - Controle visual de etapas da batelada em tempo real: `Em Fila` → `Produção` → `Análise` → `Envase` → `Apontamento`.
   - Geração instantânea de **Imagem PNG otimizada para WhatsApp** (`html2canvas`) e resumo diário/semanal em texto.

7. **Pedidos de Bombonas (`#bombonas`)**
   - Cálculo de necessidade de bombonas (`5L`, `20L`, `50L`, `200L` por cor e modelo `B`/`C`) e caixas de embarque (`4 × 5L`) para bateladas em aberto.
   - Simulação de cubagem e fechamento de cargas de caminhão ($83\text{ m}^3$ operacional / $84\text{ m}^3$ físico).

8. **Dashboard Executivo de Produção (`#producao`)**
   - Acompanhamento de metas mensais e anuais em toneladas, comparativo *Produção × Vendas (2026)* e histórico *2024 / 2025 / 2026*.

9. **Engenharia (`#engenharia`)**
   - **Fórmulas**: composição percentual de matérias-primas e calculadora de batelada em kg.
   - **Produto × Fórmula**: vínculo editável entre produtos comerciais e fórmulas químicas.
   - **Ficha Completa de Engenharia (V105)**: visão consolidada de tanque, densidade, fórmula, apresentações e embalagens por produto.
   - **Embalagens (V99)**: matriz editável de bombonas e caixas por SKU.

10. **Matérias-Primas (`#materiais`) & Parâmetros MP (`#parametros_mp`)**
    - Importação direta do PDF **Posição de Estoque de Matérias-Primas** do CIGAM.
    - Política de estoque com classificação **Curva ABC**, consumo médio/máximo, *Lead Time*, Estoque Mínimo, Ponto de Pedido e Lote Mínimo de Compra.

11. **MRP / Compras (`#mrp`)**
    - Explosão da necessidade de matérias-primas a partir das bateladas em aberto (não apontadas).
    - Priorização automática de compras (`P1 - Parada`, `P2 - Abaixo do Mínimo`, `P3 - Ponto de Pedido`, `OK`) e exportação em planilha Excel (`.xlsx`).

---

## Estrutura do Projeto

O projeto foi refatorado a partir do arquivo monolítico original para uma arquitetura modular limpa, mantendo **100% de compatibilidade com execução local (`file://`) e GitHub Pages (`https://`)**:

```text
pcp-visual-ctec/
├── index.html                                    # Ponto de entrada principal da aplicação
├── README.md                                     # Documentação do repositório
├── .gitignore                                    # Arquivos ignorados pelo Git
├── assets/
│   └── logo-ctec.png                             # Logo oficial do Grupo C-TEC
├── docs/
│   └── ANALISE_E_ARQUITETURA.md                  # Análise técnica da evolução V9–V106 e arquitetura
├── scripts/
│   └── build-unificado.ps1                       # Gera versão HTML única em dist/ para envio rápido
└── src/
    ├── styles/
    │   ├── main.css                              # Estilos base, variáveis CSS, tabelas e layout responsivo
    │   └── patches.css                           # Estilos específicos de módulos e relatórios (V41–V105)
    ├── data/
    │   ├── logo-base64.js                        # Logo em Base64 para exportação PNG sem bloqueio CORS
    │   ├── packaging-seed.js                     # Catálogo mestre de bombonas, caixas e regras de cubagem
    │   ├── tanks-density-seed.js                 # Catálogo de tanques de produção e densidades (kg/L)
    │   ├── formulas-seed.js                      # Fórmulas químicas e vínculos iniciais Produto × Fórmula
    │   ├── materials-seed.js                     # Saldos iniciais de MP e mapeamento de códigos CIGAM
    │   └── products-seed.js                      # Cadastro inicial de SKUs (SEED) e histórico executivo
    └── js/
        ├── core/
        │   └── state.js                          # Inicialização do localStorage, sanitização e helpers globais
        ├── modules/
        │   ├── pendencias.js                     # Auditoria de pendências e gráfico SVG de estoque
        │   ├── pmp-batches.js                    # Lógica do PMP mensal, tanques e modal de bateladas
        │   ├── engineering-materials.js          # Engenharia, gráficos gerenciais e leitor PDF de MP
        │   ├── mrp-compras.js                    # Cálculo de MRP e exportação Excel (SheetJS)
        │   ├── weekly-bombonas.js                # Programação semanal, PNG WhatsApp e pedido de bombonas
        │   ├── production-dashboard.js           # Indicadores executivos de produção em toneladas
        │   └── stock-import-init.js              # Controle de estoque, leitor PDF de pedidos CIGAM e eventos
        └── patches/
            ├── v41-v52-batches-thirdparty.js     # Regras V41–V52 (PMP, terceiros e peso oficial da batelada)
            ├── v55-v69-weekly-overrides-mrp.js   # Regras V55–V69 (Layout semanal, vínculo fórmula e MRP aberto)
            ├── v71-v89-samples-export-fixes.js   # Regras V71–V89 (Amostras 150mL, SKUs PY, CROP 5L e guardas)
            ├── v90-mp-policy.js                  # Regras V90 (Política de estoque MP e parâmetros ABC)
            └── v99-v106-packaging-sheets-aliases.js # Regras V99–V106 (Cadastro embalagens, Ficha V105 e Protevet)
```

---

## Como Executar

### 1. Uso Direto (Sem Servidor)
Basta abrir o arquivo `index.html` em qualquer navegador moderno (Google Chrome, Microsoft Edge, Firefox).
- **Nota**: Conexão à internet é necessária apenas para carregar as bibliotecas de CDN (`PDF.js`, `html2canvas` e `SheetJS/XLSX`) utilizadas na importação de PDFs e exportação de imagens/planilhas.

### 2. Hospedagem no GitHub Pages
O projeto está pronto para ser publicado diretamente no **GitHub Pages**:
1. Suba o conteúdo desta pasta para um repositório no GitHub.
2. Em **Settings → Pages**, selecione a branch `main` e a pasta `/ (root)`.
3. O sistema ficará acessível via URL web mantendo os dados salvos localmente no navegador de cada usuário (com opção de **Backup JSON / Restaurar Backup** na aba *Estoque*).

### 3. Gerar Versão HTML Única (Opcional)
Caso precise enviar o sistema como um **único arquivo `.html`** (por exemplo, por WhatsApp ou e-mail), execute no PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build-unificado.ps1
```
O arquivo consolidado será gerado em `dist/PCP_Visual_CTEC_V106_UNIFICADO.html`.
