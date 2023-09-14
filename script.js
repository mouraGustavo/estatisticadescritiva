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
            if(formData.calcularMedia){
                const media = ss.mean(dataValues);
                console.log('Média:', media);
            }
            if(formData.calcularMediana){
                const mediana = ss.median(dataValues);
                console.log('Mediana:', mediana);
            }
            if(formData.calcularModa){
                const moda = ss.mode(dataValues);
                console.log('Moda:', moda);
            }
            if(formData.calcularMaximo){
                const maximo = ss.max(dataValues);
                console.log('Máximo:', maximo);
            }
            if(formData.calcularMinimo){
                const minimo = ss.min(dataValues);
                console.log('Mínimo:', minimo);
            }
            
            tableResult(formData, dataValues);

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
        tabela.classList.add('table', 'table-striped-columns');
    
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
    
        // Construa a tabela de frequências
        const tab = document.createElement('table');
        tab.classList.add('table', 'table-hover');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        // Cabeçalho da tabela
        const cabecalho = ['Classes', 'Frequência Absoluta', 'Frequência Relativa ', 'Frequência Relativa (%)'];
        const trCabecalho = document.createElement('tr');
        cabecalho.forEach(item => {
            const th = document.createElement('th');
            th.textContent = item;
            trCabecalho.appendChild(th);
        });
        thead.appendChild(trCabecalho);
    
        // Corpo da tabela
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
    
            tr.appendChild(tdClasse);
            tr.appendChild(tdFreqAbsoluta);
            tr.appendChild(tdFreqRel);
            tr.appendChild(tdFreqRelativa);
    
            tbody.appendChild(tr);
        }
    
        tab.appendChild(thead);
        tab.appendChild(tbody);
    
        // Adicione a tabela à página
        const frequenceDiv = document.getElementById('frequence');
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
