import { githubUser } from "./GithutUser.js"

// Classe que vai conter a lógica dos dados
// Como os dados vão ser estruturados
export class Favorites{
    // Função construtura, construi a base
    constructor(root){
        this.root = document.querySelector(root)

        this.tbody = this.root.querySelector('table tbody')

        this.load()
        this.removedNoList()

        githubUser.search('Jonatank28').then(user => user.user)
    }
        // Vai guardar as informações no localStorage
    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }
    removedNoList(){
        const noList = document.querySelector('.noList')
        let qtd = this.entries.length
        if(qtd > 0){
            noList.classList.add('hidden')
        }else {
            noList.classList.remove('hidden')
        }       
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }
    
    async add(username){
        try{

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usúario já cadastrado!')
            }

            const user = await githubUser.search(username)

            if(user.login === undefined){
                throw new Error('Usúario não encontrado!')
            }
            

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
            this.removedNoList()

        } catch(error){
            alert(error.message)
        }
    }
    // Deleta o úsuario clicado
    delete(user){
        const filtereEntries = this.entries
            .filter( entry => entry.login !== user.login) 

            this.entries = filtereEntries
            this.update()
            this.save()
            this.removedNoList()
        }

}

// Classe que vai criar a visualização e eventos em HTML
export class FavoritesView extends Favorites{
    constructor(root){
        super(root)
        this.update()  
        this.onadd()      
    }
    // Botão que vai adicionar uma nova linha na tabela
    onadd(){
        const addButton = document.querySelector('.search button')
        addButton.onclick = () => {
            const {value} = document.querySelector('.search input')
            this.add(value)
        }
    }
    // Faz a atualização da tabela
    update(){
        this.removeAllTr()

        this.entries.forEach((user) => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').textContent = `Imagem do ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm(`Tem certeza que deseja deletar essa linha`)
                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.appendChild(row)
        })
    }
    // Cria uma nova linha na tabela
    createRow(){
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/Jonatank28.png" alt="Imagem do Jonatan">
                <a href="https://github.com/Jonatank28" target="_blank">
                    <p>Jonatan S Almeida</p>
                    <span>Jonatank28</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `
        return tr
    }
    // Apaga todas as linhas da tabela
    removeAllTr(){
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }
}

