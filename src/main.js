import api from "./api";

class App {
    constructor() {
        this.repositorios = []

        this.formulario = document.querySelector('form')

        this.registrarEventos();
    }

    registrarEventos() {
        this.formulario.onsubmit = e => this.adicionarRepositorio(e)

        this.lista = document.querySelector('.list-group')

    }

    async adicionarRepositorio(e) {
        e.preventDefault()
        // recuperar o valor do input
        let input = this.formulario.querySelector('input[id=repositorio]').value

        if (input.length === 0) {
            return
        }

        this.loading()

        try {

            let response = await api.get(`/repos/${input}`)
            // console.log(response)

            let { name, description, html_url, owner: { avatar_url } } = response.data

            this.repositorios.push({
                nome: name,
                descricao: description,
                avatar_url,
                link: html_url,
            })

            this.renderizarTela()

        } catch (erro) {
            //Limpando busca
         
            this.lista.removeChild(document.querySelector('.list-group-item-warning'))

            let er = this.lista.querySelector('.list-group-item-danger')
            
            if(er !== null) {
                this.lista.removeChild(er)
            }

            let li = document.createElement('li')
            li.setAttribute('class', 'list-group-item list-group-item-danger')
            let txtErro = document.createTextNode(`O repositório ${input} não existe`)
            li.appendChild(txtErro)
            this.lista.appendChild(li)
        }
    }

    loading() {

        let li = document.createElement('li')
        li.setAttribute('class', 'list-group-item list-group-item-warning')
        let txtBusca = document.createTextNode(`Aguarde, buscando o repositório`)
        li.appendChild(txtBusca)
        this.lista.appendChild(li)
    }

    renderizarTela() {
        this.lista.innerHTML = ''

        this.repositorios.forEach((repo) => {
            let li = document.createElement('li')
            li.setAttribute('class', 'list-group-item list-group-item-action')
            let img = document.createElement('img')
            img.setAttribute('src', repo.avatar_url)
            this.lista.appendChild(img)
            console.log(img)
            let strong = document.createElement('strong')
            let txtNome = document.createTextNode(repo.nome)
            strong.appendChild(txtNome)
            li.appendChild(strong)
            let p = document.createElement('p')
            let txtDescricao = document.createTextNode(repo.descricao)
            p.appendChild(txtDescricao)
            li.appendChild(p)
            let a = document.createElement('a')
            a.setAttribute('target', "_blank")
            a.setAttribute('href', repo.link)
            let txtLink = document.createTextNode('Acessar')
            a.appendChild(txtLink)
            li.appendChild(a)

            this.lista.appendChild(li)

            this.formulario.querySelector('input[id=repositorio]').value = "";

            this.formulario.querySelector('input[id=repositorio]').focus()
        })
    }
}
new App();