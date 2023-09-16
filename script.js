document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('form_math');

    formulario.addEventListener('submit', function (event) {
        event.preventDefault();
        const textarea = document.querySelector('textarea');
        const formData = {
            dados: textarea.value,
            calcularMedia: document.getElementById('calc_media').checked,
            calcularMediana: document.getElementById('calc_mediana').checked,
            calcularModa: document.getElementById('calc_moda').checked,
            calcularMaximo: document.getElementById('calc_max').checked,
            calcularMinimo: document.getElementById('calc_min').checked,
            calcularPerc: document.getElementById('calc_perc').checked,
            frequency: document.getElementById('frequency').checked,
            arquivo: document.querySelector('input[type="file"]').files[0],
        };
        if (formData.arquivo) {
            const arquivo = formData.arquivo;
            console.log('Nome do arquivo:', arquivo.name);
            console.log('Tipo do arquivo:', arquivo.type);

            const leitor = new FileReader();

            leitor.onload = function (e) {
                const conteudoDoArquivo = e.target.result;
                console.log('Conteúdo do arquivo:', conteudoDoArquivo);

                // Você pode usar bibliotecas como 'csv-parser' para analisar o CSV
            };

            // Lê o arquivo como texto
            leitor.readAsText(arquivo);
            tableResult(formData, dataValues);
        }else if(formData.dados){
            const dataValues = formData.dados.split(';').map(item => parseFloat(item.trim()));
            console.log('Dados do formulário:', formData);      
            tableResult(formData, dataValues);

            if(formData.calcularPerc){
                tablePercentil(dataValues);
            }

            if(formData.frequency){
                let k;
                if(dataValues.length <= 100){
                    k = 1 + 3.322 * Math.log10(dataValues.length);
                }else{
                    k = Math.sqrt(dataValues.length);
                }
                const numClasses = Math.ceil(k);
                frequencyTable(dataValues, numClasses);
            }
        }    
    });
    function tableResult(formData, dataValues) {
        const resultDiv = document.getElementById('result');
        const tabela = document.createElement('table');
        tabela.classList.add('table', 'table-responsive');
    
        const thead = document.createElement('thead');
        const trCabecalho = document.createElement('tr');
        const colunas = ['Média', 'Mediana', 'Moda', 'Máximo', 'Mínimo'];
    
        colunas.forEach(coluna => {
            const th = document.createElement('th');
            th.textContent = coluna;
            trCabecalho.appendChild(th);
        });
    
        thead.appendChild(trCabecalho);
        tabela.appendChild(thead);
    
        const tbody = document.createElement('tbody');
        const trValores = document.createElement('tr');
    
        if (formData.calcularMedia) {
            const tdMedia = document.createElement('td');
            const media = ss.mean(dataValues);
            tdMedia.textContent = media.toFixed(2); // Exibe 2 casas decimais
            trValores.appendChild(tdMedia);
        }
    
        if (formData.calcularMediana) {
            const tdMediana = document.createElement('td');
            const mediana = ss.median(dataValues);
            tdMediana.textContent = mediana.toFixed(2); // Exibe 2 casas decimais
            trValores.appendChild(tdMediana);
        }
    
        if (formData.calcularModa) {
            const tdModa = document.createElement('td');
            const moda = ss.mode(dataValues);
            tdModa.textContent = moda.toFixed(2); // Exibe 2 casas decimais
            trValores.appendChild(tdModa);
        }
    
        if (formData.calcularMaximo) {
            const tdMaximo = document.createElement('td');
            const maximo = ss.max(dataValues);
            tdMaximo.textContent = maximo.toFixed(2); // Exibe 2 casas decimais
            trValores.appendChild(tdMaximo);
        }
    
        if (formData.calcularMinimo) {
            const tdMinimo = document.createElement('td');
            const minimo = ss.min(dataValues);
            tdMinimo.textContent = minimo.toFixed(2); // Exibe 2 casas decimais
            trValores.appendChild(tdMinimo);
        }
    
        tbody.appendChild(trValores);
        tabela.appendChild(tbody);
    
        // Adicione a tabela à div de resultados
        resultDiv.innerHTML = ''; // Limpe qualquer conteúdo existente na div
        resultDiv.appendChild(tabela);
    }

    function tablePercentil(dataValues) {
        const percentDiv = document.getElementById('percentis');
        const tablePerc = document.createElement('table');
        tablePerc.classList.add('table', 'caption-top');
        const captionP = document.createElement('caption');
        captionP.textContent = 'Percentis';
        tablePerc.appendChild(captionP);
    
        const head = document.createElement('thead');
        const trHead = document.createElement('tr');
        const cols = ['Percentil 10', 'Percentil 15', 'Percentil 25', 'Percentil 45', 'Percentil 50', 'Percentil 75', 'Percentil 90'];
    
        cols.forEach(coluna => {
            const th = document.createElement('th');
            th.textContent = coluna;
            trHead.appendChild(th);
        });

        head.appendChild(trHead);
        tablePerc.appendChild(head);
        
        const body = document.createElement('tbody');
        const trValues = document.createElement('tr');
        
        const sortedData = dataValues.sort((a, b) => a - b);      
        console.log('Dados Ordenados:', sortedData);   

        function percentil(arr, q) { // calcule percentils
            const pos = (arr.length - 1) * q;
            const base = Math.floor(pos);
            const rest = pos - base;
            if (arr[base + 1] !== undefined) {
                return arr[base] + rest * (arr[base + 1] - arr[base]);
            } else {
                return arr[base];
            }
        }
       
        const percentis = [0.1, 0.15, 0.25, 0.45, 0.5, 0.75, 0.9];

        percentis.forEach(percentile => {
            const num = percentil(sortedData, percentile);
            const td = document.createElement('td');
            td.textContent = num;
            trValues.appendChild(td);
        });

        body.appendChild(trValues);
        tablePerc.appendChild(body);
    
        // Adicione a tablePerc à div de resultados
        percentDiv.innerHTML = ''; // Limpe qualquer conteúdo existente na div
        percentDiv.appendChild(tablePerc);

        // tableDescPercent();
    }
    /* function tableDescPercent() {
        const descPercent = document.getElementById('desc-percent');
        const tableDesc = document.createElement('table');
        tableDesc.classList.add('table', 'caption-top');
    
        const dHead = document.createElement('thead');
        const headDesc = document.createElement('tr');
        const columns = ['Percentil 45'];
    
        columns.forEach(coluna => {
            const thDesc = document.createElement('th');
            thDesc.textContent = coluna;
            headDesc.appendChild(thDesc);
        });

        dHead.appendChild(headDesc);
        tableDesc.appendChild(dHead);
        
        const bodyDesc = document.createElement('tbody');
        const trVal = document.createElement('tr');
        
        var tdPerc = document.createElement('td');
        tdPerc.textContent = '45% dos elementos estão abaixo de 3.92, ou seja, abaixo da média e da mediana';
        trVal.appendChild(tdPerc);

        bodyDesc.appendChild(trVal);
        tableDesc.appendChild(bodyDesc);
    
        // Adicione a tablePerc à div de resultados
        descPercent.innerHTML = ''; // Limpe qualquer conteúdo existente na div
        descPercent.appendChild(tableDesc);
    } */


    function frequencyTable(dataValues, numClasses) {
        const min = Math.min(...dataValues);
        const max = Math.max(...dataValues);
        const amplitude = (max - min) / numClasses;
    
        const frequenciaAbsoluta = new Array(numClasses).fill(0);
        const classes = [];
    
        // Crie as classes
        for (let i = 0; i < numClasses; i++) {
            const classeMin = min + i * amplitude;
            const classeMax = classeMin + amplitude;
            classes.push(`${classeMin.toFixed(2)} --| ${classeMax.toFixed(2)}`);
        }
    
        // Conte a frequência absoluta
        dataValues.forEach(value => {
            for (let i = 0; i < numClasses; i++) {
                const classeMin = min + i * amplitude;
                const classeMax = classeMin + amplitude;
                if (value >= classeMin && value < classeMax) {
                    frequenciaAbsoluta[i]++;
                    break;
                }
            }
        });
    
        const frequenceDiv = document.getElementById('frequence');
        const tab = document.createElement('table');
        tab.classList.add('table', 'caption-top');
        const caption = document.createElement('caption');
        caption.textContent = 'Tabela de Frequências';
        tab.appendChild(caption);
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        // Cabeçalho da tabela
        const cabecalho = ['Classes', 'Frequência Absoluta', 'Frequência Relativa', 'Frequência Relativa (%)', 'Frequência Acumulativa'];
        const trCabecalho = document.createElement('tr');
        cabecalho.forEach(item => {
            const th = document.createElement('th');
            th.textContent = item;
            trCabecalho.appendChild(th);
        });
        thead.appendChild(trCabecalho);
        
        // Corpo da tabela
        let frequenciaAcumulativa = 0;
        for (let i = 0; i < numClasses; i++) {
            const tr = document.createElement('tr');
            const tdClasse = document.createElement('td');
            tdClasse.textContent = classes[i];
            const tdFreqAbsoluta = document.createElement('td');
            tdFreqAbsoluta.textContent = frequenciaAbsoluta[i];
            const tdFreqRelativa = document.createElement('td');
            const freqRelativa = (frequenciaAbsoluta[i] / dataValues.length) * 100;
            tdFreqRelativa.textContent = freqRelativa.toFixed(2) + '%';
            const tdFreqRel = document.createElement('td');
            const freqRel = (frequenciaAbsoluta[i] / dataValues.length);
            tdFreqRel.textContent = freqRel.toFixed(2) + '%';
            frequenciaAcumulativa += frequenciaAbsoluta[i];
            const tdFreqAcumulativa = document.createElement('td');
            tdFreqAcumulativa.textContent = frequenciaAcumulativa;
    
            tr.appendChild(tdClasse);
            tr.appendChild(tdFreqAbsoluta);
            tr.appendChild(tdFreqRel);
            tr.appendChild(tdFreqRelativa);
            tr.appendChild(tdFreqAcumulativa);
    
            tbody.appendChild(tr);
        }
    
        tab.appendChild(thead);
        tab.appendChild(tbody);
    
        // Adicione a tabela à página
        frequenceDiv.innerHTML = ''; // Limpe qualquer conteúdo existente
        frequenceDiv.appendChild(tab);
    }
    
    // Suponha que você tenha um canvas onde deseja renderizar o gráfico
   /*  const canvas = document.createElement('canvas');
    canvas.id = 'meuGrafico'; // Defina um ID para o canvas

    // Adicione o canvas à página
    document.body.appendChild(canvas);

    // Suponha que você tenha dados para o gráfico (valores e rótulos)
    const dadosGrafico = {
        labels: ['Valor 1', 'Valor 2', 'Valor 3'],
        datasets: [
            {
                label: 'Meu Gráfico de Barras',
                data: [10, 20, 30],
                backgroundColor: ['red', 'green', 'blue'], // Cores das barras
            },
        ],
    };

    // Crie o gráfico usando o Chart.js
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    const meuGrafico = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico (barra)
        data: dadosGrafico,
    }); */

    // Você pode personalizar o gráfico de acordo com suas necessidades

});
