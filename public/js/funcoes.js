// construindo cards
var perguntasFeitas = 0
var respostasCertas = 0
var respostasErradas = 0
var perguntasAcertadas = []
async function mostrarCard() {
    
    await fetch("/perguntas")
        .then(response => response.json())
        .then(data => {
            if (data.length == perguntasFeitas) {
                let mensagem
                let titulo
                let icone
                if (respostasCertas == perguntasFeitas) {
                    mensagem = "Parabéns, você acertou todas as questões"
                    titulo = "Parabéns"
                    icone = "success"
                } else if (respostasCertas == 0) {
                    mensagem = "Não foi dessa vez, quem sabe da próxima você acerta alguma coisa!"
                    titulo = "Poxa"
                    icone = "error"
                } else {
                    mensagem = "Você acertou algumas questões, mas da pra melhorar"
                    titulo = "Acertou algumas"
                    icone = "success"
                }
                Swal.fire({
                    title: titulo,
                    text: mensagem,
                    icon: icone
                })
                console.log(perguntasAcertadas)
                pararContagem()
                quaisPerguntasAcertou()

                perguntasAcertadas.pop()
                document.getElementById("abrir-pontuacao").onclick = function () {
                    fazerRank()
                    document.getElementById("pronto").classList.remove("d-none")
                    document.getElementById("pronto").innerHTML = "Recomeçar"
                }
                document.getElementById("abrir-pontuacao").click()

            } else {
                let card = criandoCard(data[perguntasFeitas])
                document.getElementById("messages").appendChild(card)
                perguntasFeitas++
            }
        })
}

async function fazerRank() {
    console.log(document.getElementById("pontuacaoNome").innerHTML.split(" - ")[1])

    let obj = {
        "nome": document.getElementById("pontuacaoNome").innerHTML.split(" - ")[1],
        "acertos": respostasCertas,
        "tempo": document.getElementById("horas").innerHTML+":"+document.getElementById("minuto").innerHTML+":"+document.getElementById("segundo").innerHTML
    }
    await fetch('/addPontuacao', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    })
        .then(response => response.text())
        .then(data => {
            console.log(data)
            let json = JSON.parse(data).sort(compararDados)
            console.log(json)

            
            document.getElementById("lista-de-rank").innerHTML = ""
            json.forEach(jogador => {
                let li = document.createElement("li")
                let div1 = document.createElement("div")
                let div2 = document.createElement("div")

                li.classList = "list-group-item d-flex justify-content-between align-items-start"
                div1.classList = "ms-2 me-auto"
                div2.classList = "fw-bold"
                div1.innerHTML = jogador.nome 
                div2.innerHTML = jogador.acertos +" acertos"+ " - " +jogador.tempo+" tempo"

                div1.appendChild(div2)
                li.appendChild(div1)
                document.getElementById("lista-de-rank").appendChild(li)
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function compararDados(a, b) {
    if (a.acertos > b.acertos) return -1;
    if (a.acertos < b.acertos) return 1;

    var tempoA = a.tempo.split(":").map(Number);
    var tempoB = b.tempo.split(":").map(Number);

    for (var i = 0; i < 3; i++) {
        if (tempoA[i] < tempoB[i]) return -1;
        if (tempoA[i] > tempoB[i]) return 1;
    }

    return 0;
}

function criandoCard(pergunta) {
    let div = document.createElement("div")
    let divImg = document.createElement("div")
    let img = document.createElement("img")
    let divPerguntas = document.createElement("div")
    let divPergunta = document.createElement("div")
    let pPergunta = document.createElement("p")
    let divRespostas = document.createElement("div")
    let buttonA = document.createElement("button")
    let buttonB = document.createElement("button")
    let buttonC = document.createElement("button")
    let buttonD = document.createElement("button")
    let icoA = document.createElement("i")
    let icoB = document.createElement("i")
    let icoC = document.createElement("i")
    let icoD = document.createElement("i")

    div.classList = "container-card row g-3"
    div.id = "card-pergunta"
    divImg.classList = "col-3 img-esquerda"
    img.src = pergunta.imagem
    divPerguntas.classList = "col-8 div-perguntas mx-2 my-4"
    divPergunta.classList = "pergunta"
    pPergunta.innerHTML = pergunta.pergunta
    divRespostas.classList = "respostas row g-3"
    buttonA.type = "button"
    buttonA.classList = "btn btn-primary col-5 respostaA"
    buttonB.classList = "btn btn-primary col-5 respostaB"
    buttonC.classList = "btn btn-primary col-5 respostaC"
    buttonD.classList = "btn btn-primary col-5 respostaD"
    icoA.classList = "bi bi-1-square"
    icoB.classList = "bi bi-2-square"
    icoC.classList = "bi bi-3-square"
    icoD.classList = "bi bi-4-square"

    buttonA.appendChild(icoA)
    buttonB.appendChild(icoB)
    buttonC.appendChild(icoC)
    buttonD.appendChild(icoD)

    buttonA.innerHTML = buttonA.innerHTML + " " + pergunta.respostaA
    buttonB.innerHTML = buttonB.innerHTML + " " + pergunta.respostaB
    buttonC.innerHTML = buttonC.innerHTML + " " + pergunta.respostaC
    buttonD.innerHTML = buttonD.innerHTML + " " + pergunta.respostaD

    buttonA.onclick = function () {

        if (buttonA.classList.contains(pergunta.respostaCerta)) {
            Swal.fire({
                title: "Certa Resposta",
                text: "Acertou, vamos para a próxima pergunta",
                icon: "success"
            })
            respostasCertas++
            perguntasAcertadas.push(respostasCertas)
        } else {
            Swal.fire({
                title: "Errada a resposta",
                text: "Errou, vamos para a próxima pergunta",
                icon: "error"
            })
            respostasErradas++
        }
        document.getElementById("card-pergunta").remove()
        document.getElementById("pontuacaoDoJogadoreCerta").innerHTML = "Certas - " + respostasCertas
        document.getElementById("pontuacaoDoJogadoreErrada").innerHTML = "Erradas - " + respostasErradas
        mostrarCard()
    }
    buttonB.onclick = function () {

        if (buttonB.classList.contains(pergunta.respostaCerta)) {
            Swal.fire({
                title: "Certa Resposta",
                text: "Acertou, vamos para a próxima pergunta",
                icon: "success"
            })
            respostasCertas++
            perguntasAcertadas.push(respostasCertas)
        } else {
            Swal.fire({
                title: "Errada a resposta",
                text: "Errou, vamos para a próxima pergunta",
                icon: "error"
            })
            respostasErradas++
        }
        document.getElementById("card-pergunta").remove()
        document.getElementById("pontuacaoDoJogadoreCerta").innerHTML = "Certas - " + respostasCertas
        document.getElementById("pontuacaoDoJogadoreErrada").innerHTML = "Erradas - " + respostasErradas
        mostrarCard()
    }
    buttonC.onclick = function () {

        if (buttonC.classList.contains(pergunta.respostaCerta)) {
            Swal.fire({
                title: "Certa Resposta",
                text: "Acertou, vamos para a próxima pergunta",
                icon: "success"
            })
            respostasCertas++
            perguntasAcertadas.push(respostasCertas)
        } else {
            Swal.fire({
                title: "Errada a resposta",
                text: "Errou, vamos para a próxima pergunta",
                icon: "error"
            })
            respostasErradas++
        }
        document.getElementById("card-pergunta").remove()
        document.getElementById("pontuacaoDoJogadoreCerta").innerHTML = "Certas - " + respostasCertas
        document.getElementById("pontuacaoDoJogadoreErrada").innerHTML = "Erradas - " + respostasErradas
        mostrarCard()
    }
    buttonD.onclick = function () {

        if (buttonD.classList.contains(pergunta.respostaCerta)) {
            Swal.fire({
                title: "Certa Resposta",
                text: "Acertou, vamos para a próxima pergunta",
                icon: "success"
            })
            respostasCertas++
            perguntasAcertadas.push(respostasCertas)
        } else {
            Swal.fire({
                title: "Errada a resposta",
                text: "Errou, vamos para a próxima pergunta",
                icon: "error"
            })
            respostasErradas++
        }
        document.getElementById("card-pergunta").remove()
        document.getElementById("pontuacaoDoJogadoreCerta").innerHTML = "Certas - " + respostasCertas
        document.getElementById("pontuacaoDoJogadoreErrada").innerHTML = "Erradas - " + respostasErradas
        mostrarCard()
    }

    divRespostas.appendChild(buttonA)
    divRespostas.appendChild(buttonB)
    divRespostas.appendChild(buttonC)
    divRespostas.appendChild(buttonD)

    divPergunta.appendChild(pPergunta)

    divPerguntas.appendChild(divPergunta)
    divPerguntas.appendChild(divRespostas)

    divImg.appendChild(img)

    div.appendChild(divImg)
    div.appendChild(divPerguntas)

    return div
}

function quaisPerguntasAcertou() {
    let radioPerguntas = document.querySelectorAll(".radio-pergunta")

    radioPerguntas.forEach(radios => {

        if (perguntasAcertadas.includes(parseInt(radios.id.split("_")[1]))) {
            radios.checked = true
            radios.classList.add("certa")
            console.log("TRUE")
            return
        } else {
            radios.checked = true
            radios.classList.add("errada")
            return
        }
    });
}