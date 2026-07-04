# ☀️🌧️ Clima de Amanhã — Power Automate Flow

Fluxo do **Microsoft Power Automate** que roda diariamente, busca a previsão do
tempo de amanhã para uma lista de cidades, grava os dados numa planilha Excel
Online e envia um resumo formatado no Microsoft Teams para uma lista de
destinatários.

> ⚠️ **Dados sanitizados**: este repositório contém a exportação oficial do
> Power Automate (`.zip` do "Exportar como pacote"), mas todos os e-mails,
> IDs de tenant, grupo, drive e script foram substituídos por placeholders
> genéricos antes da publicação. Antes de importar, troque os placeholders
> pelos seus próprios valores (veja [Configuração](#-configuração)).

## 📋 O que o flow faz

1. **Gatilho (Recorrência)** — dispara todo dia às `16:23` (horário
   `E. South America Standard Time`).
2. **Inicializar variável `Lista_Cidades`** — array com as cidades que terão
   a previsão consultada (por padrão, municípios de Alagoas).
3. **Aplicar a cada cidade**:
   - Consulta a previsão de amanhã via conector **MSN Clima**
     (`TomorrowsForecast`).
   - Adiciona uma linha na tabela do Excel Online (`AddRowV2`) com chuva,
     vento, temperatura, umidade, UV, nascer/pôr do sol, condições em
     português (traduzidas via `replace` de códigos METAR/MSN), etc.
   - Executa um **Office Script** para traduzir/tratar texto na planilha.
   - Monta um resumo em HTML (`Resumo_Teams`) com emojis indicando
     intensidade de chuva e vento.
4. **Postar mensagem no Teams** — envia o resumo consolidado, em chat
   individual, para cada destinatário da lista `E_mails`.

## 🔌 Conectores utilizados

| Conector | Uso |
|---|---|
| MSN Clima (`shared_msnweather`) | Consulta de previsão do tempo (`TomorrowsForecast`) |
| Excel Online (Business) (`shared_excelonlinebusiness`) | Grava histórico numa tabela + executa Office Script |
| Microsoft Teams (`shared_teams`) | Envia resumo diário em chat |

## 📁 Estrutura do repositório

```
.
├── manifest.json                                  # Manifesto do pacote (recursos/dependências)
└── Microsoft.Flow/
    └── flows/
        ├── manifest.json                          # Manifesto interno do flow
        └── c7e8e38a-.../
            ├── definition.json                    # Lógica completa do flow (triggers/actions)
            ├── apisMap.json                        # Mapeamento de APIs usadas
            └── connectionsMap.json                 # Mapeamento de conexões usadas
```

Esta é a estrutura padrão gerada quando você exporta um flow do Power
Automate como **pacote (.zip)**.

## ⚙️ Configuração

Antes de importar este pacote no seu ambiente, substitua os placeholders
abaixo pelos seus próprios valores (busque por eles em `definition.json` e
`manifest.json`):

| Placeholder | O que colocar |
|---|---|
| `usuario1@suaempresa.com` ... `usuario5@suaempresa.com` | E-mails reais dos destinatários no Teams |
| `usuario1.pessoal@gmail.com` | E-mail pessoal, se aplicável |
| `SEU_DRIVE_ID_AQUI` | ID do drive do OneDrive/SharePoint onde está a planilha |
| `SEU_SCRIPT_ID_AQUI` | ID do Office Script usado na etapa de tradução |
| `00000000-0000-0000-0000-000000000001/2/3` | Tenant ID, ID de criador e ID do grupo do SharePoint |
| `suaempresa.com` | Domínio da sua organização |

Você também vai precisar:

- Ter uma planilha Excel Online com uma tabela cujas colunas batam com os
  campos usados em `AddRowV2` (Cidade, Vento, Possibilidade de Chuva, Data,
  Condições, Temperaturas, Umidade, UV, etc.).
- Recriar (ou apontar para) o Office Script referenciado na etapa
  `Executar_script_Traduzir_Texto`.
- Reconectar os 3 conectores (MSN Clima, Excel Online Business, Teams) com
  suas próprias credenciais ao importar o flow.

## 📥 Como importar no Power Automate

1. Acesse [make.powerautomate.com](https://make.powerautomate.com).
2. Vá em **Minhas soluções** (ou **Meus flows**) → **Importar** → **Pacote (.zip)**.
3. Selecione o arquivo `.zip` gerado a partir deste repositório (veja abaixo).
4. Configure/recrie as conexões pedidas e ajuste os parâmetros conforme a
   tabela de configuração acima.
5. Ative o flow.

Para gerar o `.zip` a partir deste repositório:

```bash
cd Microsoft.Flow/.. # raiz do repositório
zip -r clima-de-amanha.zip manifest.json Microsoft.Flow
```

## 🛠️ Personalização

- **Trocar as cidades**: edite o array em `Inicializar_variável` →
  `Lista_Cidades`.
- **Trocar o horário**: edite `hours`/`minutes` no trigger `Recorrência`.
- **Adicionar/remover destinatários**: edite o array `E_mails` e replique (ou
  remova) as ações `Postar_mensagem_em_um_chat_ou_canal_*`.

## 📄 Licença

Distribuído sob a licença MIT — veja [LICENSE](LICENSE).
