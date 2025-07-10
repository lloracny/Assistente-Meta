const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')


const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarIA = async (question, game, apiKey) => {
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const perguntaLOL = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas 

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda itens que você não tenha certeza de que existe no patch atual.

        ## Resposta
        - Economize na resposta, seja direto e responda no máximo 500 caracteres. Responda em markdown.
        - Não precisa fazer nenhuma saudação ou despedida. Apenas responda o que o usuário está querendo.

        ## Exemplo de resposta
        Pergunta do usuário: Melhor build rengar jungle
        Resposta: A build mais atual é:\n\n**Itens:**\n\n coloque os itens aqui. \n\n **Runas:**\n\nexemplo de runas\n\n

        ---

        Aqui está a pergunta do usuário: ${question}

    
        `
    
    const perguntaValorant = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, plays, poderes, agentes, skins, dinheiro e dicas 

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre a atualização atual, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda itens que você não tenha certeza de que existe na atualização atual.

        ## Resposta
        - Economize na resposta, seja direto e responda no máximo 500 caracteres. Responda em markdown.
        - Não precisa fazer nenhuma saudação ou despedida. Apenas responda o que o usuário está querendo.

        ## Exemplo de resposta
        Pergunta do usuário: Melhor seleção de agentes para o mapa BIND
        Resposta: Os melhores agentes para o mapa BIND são:\n\n**Agentes:**\n\n coloque os agentes aqui. \n\n**Explicação de cada agente:**\n\nexemplo de agente

        ---

        Aqui está a pergunta do usuário: ${question}

        `

        const perguntaCSGO = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, compra de armas e acessórios, baús, skins

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo
        - Considere a data atual ${new Date().toLocaleDateString()}
        - Faça pesquisas atualizadas sobre a atualização atual, baseado na data atual, para dar uma resposta coerente.
        - Nunca responda itens que você não tenha certeza de que existe na atualização atual.

        ## Resposta
        - Economize na resposta, seja direto e responda no máximo 500 caracteres. Responda em markdown.
        - Não precisa fazer nenhuma saudação ou despedida. Apenas responda o que o usuário está querendo.

        ## Exemplo de resposta
        Pergunta do usuário: Como funciona o tickrate?
        Resposta: O tickrate é a **frequência** com que o servidor atualiza o estado do jogo por segundo, os dois tickrates mais comuns são:\n\n**64 ticks/segundo**\n\n**128 ticks/segundo**

        ---

        Aqui está a pergunta do usuário: ${question}

        `
        let pergunta = ''

        if(game == 'League of Legends'){
            pergunta = perguntaLOL
        } else if(game == 'Valorant'){
            pergunta = perguntaValorant
        } else if(game == 'Counter-Strike: Global Offensive'){
            pergunta = perguntaCSGO
        }
        

    const contents = [
        {
            role: "user",
            parts: [
                { text: pergunta + '\n\nPergunta do usuário: ' + question }
            ]
        }
    ]

    const tools = [{
        google_search: {}
    }]

    console.log(pergunta)
    // chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
        
}

const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if(apiKey == '' || game == '' || question == ''){
        alert('Por favor, complete todos os campos')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try{
        // perguntar para a IA
        const text = await perguntarIA(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')

    } catch(error){
        console.log('Erro: ', error)
    } finally{
        askButton.disabled = false
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }

}
form.addEventListener('submit', enviarFormulario)
