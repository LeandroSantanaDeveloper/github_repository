import api from "./api";

class App {
    constructor() {
        this.repositorios = JSON.parse(localStorage.getItem('repo')) || []

        this.formulario = document.querySelector('form')

        this.registrarEventos();

        this.renderizarTela()
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

            this.salvarDadosNoStorage()

            this.renderizarTela()

        } catch (erro) {
            //Limpando busca

            this.lista.removeChild(document.querySelector('.list-group-item-warning'))

            let er = this.lista.querySelector('.list-group-item-danger')

            if (er !== null) {
                this.lista.removeChild(er)
            }

            let li = document.createElement('li')
            li.setAttribute('class', 'list-group-item list-group-item-danger')
            let txtErro = document.createTextNode(`O repositório ${input} não existe`)
            li.appendChild(txtErro)
            this.lista.prepend(li)
        }
    }

    loading() {

        let li = document.createElement('li')
        li.setAttribute('class', 'list-group-item list-group-item-warning')
        let txtBusca = document.createTextNode(`Aguarde, buscando o repositório`)
        li.appendChild(txtBusca)
        this.lista.prepend(li)
    }

    renderizarTela() {
        this.lista.innerHTML = ''

        this.repositorios.forEach((repo) => {
            let li = document.createElement('li')
            li.setAttribute('class', 'list-group-item list-group-item-action custom-flex-li d-flex align-items-center')

            // li.onclick = () => {
            //     this.deletarRepo(this.repositorios.indexOf(repo));
            // }

            let img = document.createElement('img')
            img.setAttribute('src', repo.avatar_url)
            img.setAttribute('class', 'mr-3')
            li.appendChild(img)

            let divInfo = document.createElement('div');
            let strong = document.createElement('strong')
            let txtNome = document.createTextNode(repo.nome)
            strong.appendChild(txtNome)
            divInfo.appendChild(strong);

            let p = document.createElement('p')
            let txtDescricao = document.createTextNode(repo.descricao)
            p.appendChild(txtDescricao)
            divInfo.appendChild(p)

            let a = document.createElement('a');
            a.setAttribute('target', "_blank");
            a.setAttribute('href', repo.link);
            a.classList.add('btn', 'btn-primary');
            let txtLink = document.createTextNode('Acessar');
            a.appendChild(txtLink);
            divInfo.appendChild(a);

            let remove = document.createElement('button'); 
            remove.setAttribute('class', 'btn btn-danger');
            let txtRemove = document.createTextNode('Remover');
            remove.appendChild(txtRemove);
            divInfo.appendChild(remove);

            remove.addEventListener('click', () => {
                this.deletarRepo(this.repositorios.indexOf(repo));
            });

            li.appendChild(divInfo);

            this.lista.appendChild(li)

            this.formulario.querySelector('input[id=repositorio]').value = "";

            this.formulario.querySelector('input[id=repositorio]').focus()
        })
    }

    salvarDadosNoStorage() {
        localStorage.setItem('repo', JSON.stringify(this.repositorios))
    }

    deletarRepo(index) {
        this.repositorios.splice(index, 1);

        this.salvarDadosNoStorage()
        this.renderizarTela()
    }
}
new App();