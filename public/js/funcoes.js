// construindo cards
var perguntasFeitas = 0
var respostasCertas = 0
var respostasErradas = 0
async function mostrarCard(params) {

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
                }else if (respostasCertas == 0) {
                    mensagem = "Não foi dessa vez, quem sabe da próxima você acerta alguma coisa!"
                    titulo = "Poxa"
                    icone = "error"
                }else{
                    mensagem = "Você acertou algumas questões, mas da pra melhorar"
                    titulo = "Acertou algumas"
                    icone = "success"
                }
                Swal.fire({
                    title: titulo,
                    text: mensagem,
                    icon: icone
                })
            } else {
                let card = criandoCard(data[perguntasFeitas])
                document.getElementById("messages").appendChild(card)
                perguntasFeitas++
            }
        })
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
        } else {
            Swal.fire({
                title: "Errada a resposta",
                text: "Errou, vamos para a próxima pergunta",
                icon: "error"
            })
            respostasErradas++
        }
        document.getElementById("card-pergunta").remove()
        document.getElementById("pontuacaoDoJogadoreCerta").innerHTML = "Certa - "+ respostasCertas
        document.getElementById("pontuacaoDoJogadoreErrada").innerHTML = "Errada - "+respostasErradas
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
        } else {
            Swal.fire({
                title: "Errada a resposta",
                text: "Errou, vamos para a próxima pergunta",
                icon: "error"
            })
            respostasErradas++
        }
        document.getElementById("card-pergunta").remove()
        document.getElementById("pontuacaoDoJogadoreCerta").innerHTML = "Certa - "+ respostasCertas
        document.getElementById("pontuacaoDoJogadoreErrada").innerHTML = "Errada - "+respostasErradas
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
        } else {
            Swal.fire({
                title: "Errada a resposta",
                text: "Errou, vamos para a próxima pergunta",
                icon: "error"
            })
            respostasErradas++
        }
        document.getElementById("card-pergunta").remove()
        document.getElementById("pontuacaoDoJogadoreCerta").innerHTML = "Certa - "+ respostasCertas
        document.getElementById("pontuacaoDoJogadoreErrada").innerHTML = "Errada - "+respostasErradas
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
        } else {
            Swal.fire({
                title: "Errada a resposta",
                text: "Errou, vamos para a próxima pergunta",
                icon: "error"
            })
            respostasErradas++
        }
        document.getElementById("card-pergunta").remove()
        document.getElementById("pontuacaoDoJogadoreCerta").innerHTML = "Certa - "+ respostasCertas
        document.getElementById("pontuacaoDoJogadoreErrada").innerHTML = "Errada - "+respostasErradas
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
