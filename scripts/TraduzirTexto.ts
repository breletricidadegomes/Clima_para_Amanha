/**
 * TraduzirTexto.ts
 *
 * Office Script executado pela ação "Executar_script_Traduzir_Texto" no flow.
 * Percorre a coluna "Resumo" da tabela "Tabela1" e substitui trechos fixos
 * em inglês (retornados pelo conector MSN Clima) pelas versões em
 * português usadas no restante da planilha e no resumo enviado ao Teams.
 *
 * Este script fica salvo dentro do próprio arquivo Excel (guia Automatizar),
 * não é um arquivo separado — o código abaixo está aqui só para
 * versionamento/consulta.
 *
 * Como usar:
 * 1. Abra a planilha (o mesmo arquivo .xlsx usado pelo flow) no Excel Online.
 * 2. Vá em Automatizar > Novo Script e cole este código.
 * 3. Salve o script com o mesmo nome usado na ação do flow (ex.: "Traduzir Texto").
 * 4. Na ação "Executar um script" do flow, selecione este script na lista.
 */
function main(workbook: ExcelScript.Workbook) {
    // 1. Obtém a tabela pelo nome
    const tabela = workbook.getTable("Tabela1");

    if (!tabela) {
        console.log("Erro: Tabela 'Tabela1' não encontrada.");
        return;
    }

    // 2. Obtém a coluna pelo nome
    const colunaResumo = tabela.getColumnByName("Resumo");

    if (!colunaResumo) {
        console.log("Erro: Coluna 'Resumo' não encontrada na Tabela1.");
        return;
    }

    // 3. Obtém o intervalo de dados da coluna (ignorando o cabeçalho)
    const intervalo = colunaResumo.getRangeBetweenHeaderAndTotal();
    const valores = intervalo.getValues();

    // 4. Percorre as linhas para verificar e substituir os textos
    for (let i = 0; i < valores.length; i++) {
        let valorCelula = valores[i][0];

        // Verifica se o valor da célula é um texto antes de tentar substituir
        if (typeof valorCelula === "string") {

            // Substituição 1: Chuva forte
            valorCelula = valorCelula.replace(
                "Heavy rain is expected in the daytime hours.  The high will be",
                "Espera-se chuva forte durante o dia. A temperatura máxima será de"
            );

            // Substituição 2: Chuva fraca e isolada
            valorCelula = valorCelula.replace(
                "Scattered light rain showers are expected.  The high will be",
                "Espera-se chuva fraca e isolada. A temperatura máxima será de"
            );

            // Substituição 3: Céu predominantemente ensolarado
            valorCelula = valorCelula.replace(
                "There will be mostly sunny skies.  The high will be",
                "O céu ficará predominantemente ensolarado. A temperatura máxima será de"
            );

            // Substituição 4: Céu parcialmente ensolarado
            valorCelula = valorCelula.replace(
                "Expect partly sunny skies.  The high will be",
                "Espera-se céu parcialmente ensolarado. A temperatura máxima será de"
            );

            // Substituição 5: Temperatura máxima de (trecho genérico restante)
            valorCelula = valorCelula.replace(
                "The high will be ",
                "A temperatura máxima será de "
            );

            // Substituição 6: Pancadas de chuva isoladas
            valorCelula = valorCelula.replace(
                "Watch for scattered rain showers",
                "Há previsão de pancadas de chuva em alguns pontos"
            );

            // Substituição 7: Dia úmido
            valorCelula = valorCelula.replace(
                " on this humid day.",
                " neste dia úmido."
            );

            // Atualiza o valor na matriz
            valores[i][0] = valorCelula;
        }
    }

    // 5. Aplica os novos valores de volta na planilha
    intervalo.setValues(valores);
    console.log("Substituições concluídas com sucesso!");
}
