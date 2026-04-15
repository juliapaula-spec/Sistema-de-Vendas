


function handleInput(el) {
    el.value = el.value.replace(/[^0-9]/g, '')

    if (el.value.length === 1) {
        let next = el.nextElementSibling;
        if (next) next.focus();
    }
}

function handleBackspace(e, el) {
    if (e.key === "Backspace" && el.value === "") {
        let prev = el.previousElementSibling;
        if (prev) prev.focus();
    }
}


function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            const base64 = reader.result.split(",")[1]; // remove data:image...
            resolve(base64);
        };

        reader.onerror = error => reject(error);
    });
}

function getId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

toggleLimparFiltros = () => {
    const input = document.getElementById("Search");
    const limparBtn = document.getElementById("limparfiltros");

    if (input.value) {
        limparBtn.classList.remove("hide");
    } else {
        limparBtn.classList.add("hide");
    }
};

/*menu lateral */

function toggleMenu() {
    const menu = document.getElementById("menu-lateral-nav");
    const body = document.body;

    menu.classList.toggle("closed");
    body.classList.toggle("menu-fechado");
}




/* API */

/* Endpoints */
const UrlCliente = "https://g22f234c89b2f5c-projetoimpacta.adb.sa-saopaulo-1.oraclecloudapps.com/ords/prjimp/edu/clientes";

const UrlFuncionario = "https://g22f234c89b2f5c-projetoimpacta.adb.sa-saopaulo-1.oraclecloudapps.com/ords/prjimp/edu/funcionarios";

const UrlProduto = "https://g22f234c89b2f5c-projetoimpacta.adb.sa-saopaulo-1.oraclecloudapps.com/ords/prjimp/edu/produtos";

const urlCategorias = "https://g22f234c89b2f5c-projetoimpacta.adb.sa-saopaulo-1.oraclecloudapps.com/ords/prjimp/edu/categorias";

const urlFornecedores = "https://g22f234c89b2f5c-projetoimpacta.adb.sa-saopaulo-1.oraclecloudapps.com/ords/prjimp/edu/fornecedores";

/*PRODUTOS */

//delete produtos

async function excluirProduto() {

    const id = document.getElementById("idProduto").value;

    if (!id) {
        alert("ID do produto não encontrado");
        return;
    }

    const confirmar = confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) return;

    try {
        const res = await fetch(UrlProduto, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ID: id
            })
        });

        if (res.ok) {
            alert("Produto excluído com sucesso!");
            window.location.href = "mercatto-produtos.html";
        } else {
            console.error(await res.text());
            alert("Erro ao excluir");
        }

    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}


// PUT PRODUTOS

async function salvarProduto() {

    const fileInput = document.getElementById("fotoProduto");

    let foto = null;
    let mimetype = null;
    let filename = null;

    // imagem (opcional)
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        foto = await fileToBase64(file);
        mimetype = file.type;
        filename = file.name;
    }

    const body = {
        ID: document.getElementById("idProduto").value,
        NOME: document.getElementById("nome").value,
        PRECO: document.getElementById("valor").value,
        CODIGO_BARRAS: document.getElementById("codigo_barra").value,
        ESTOQUE: document.getElementById("quantidade").value,
        DESCRICAO: document.getElementById("descricao").value,

        ID_CATEGORIA: document.getElementById("Categoria").value,
        ID_FORNECEDOR: document.getElementById("Fornecedor").value
    };

    if (foto) {
        body.FOTO = foto;
        body.MIMETYPE = mimetype;
        body.FILENAME = filename;
    }

    try {
        const res = await fetch(UrlProduto, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert("Produto atualizado com sucesso!");
            window.location.href = "mercatto-produtos.html";
        } else {
            console.error(await res.text());
            alert("Erro ao atualizar produto");
        }

    } catch (erro) {
        console.error("Erro:", erro);
    }
}


/*GET PRODUTOS */

async function carregarProduto() {
    const id = getId();

    const res = await fetch(`${UrlProduto}/${id}`);
    const data = await res.json();

    const produto = data.items[0];

    document.getElementById("idProduto").value = produto.id;
    document.getElementById("nome").value = produto.nome;
    document.getElementById("valor").value = produto.preco;
    document.getElementById("codigo_barra").value = produto.codigo_barras;
    document.getElementById("quantidade").value = produto.estoque;
    document.getElementById("descricao").value = produto.descricao;
    document.getElementById("Categoria").value = produto.id_categoria;
    document.getElementById("Fornecedor").value = produto.id_fornecedor;


    if (produto.foto) {
        document.getElementById("previewFoto").src =
            `data:${produto.mimetype};base64,${produto.foto}`;
    }
}

if (document.getElementById("lista-produtos")) {
    carregarProdutos();
}

async function carregarProdutos() {
    try {
        let url = UrlProduto;

        // evita erro se params não existir
        if (typeof params !== "undefined" && params) {
            url += "?" + new URLSearchParams(params).toString();
        }

        const res = await fetch(url);
        const data = await res.json();

        const tbody = document.getElementById("tabelaProdutos");

        if (!tbody) return; // segurança

        tbody.innerHTML = "";

        data.items.forEach(produto => {

            


            tbody.innerHTML += `
                <tr>
                    <td class="al-center hide" >${produto.id}</td>
                    <td class="al-left" >${produto.categoria ?? ""}</td>
                    <td class="al-left" >${produto.fornecedor ?? ""}</td>
                   
                    <td class="al-left" >${produto.nome_produto ?? ""}</td>
                    
                    <td class="al-left" >R$ ${produto.preco ?? ""}</td>
                    <td class="al-right" >${produto.estoque ?? "0"} unidades</td>
                    <td class="al-right">
                        <a class="btn-r" href="mercatto-produtos-editar.html?id=${produto.id}">
                            <i class="fa fa-pen-to-square"></i>
                        </a>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error("Erro ao carregar produtos:", err);
    }
}

/*POST PRODUTOS */
async function criarProduto() {

    const fileInput = document.getElementById("fotoProduto");

    let foto = null;
    let mimetype = null;
    let filename = null;

    // imagem
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        foto = await fileToBase64(file);
        mimetype = file.type;
        filename = file.name;
    }

    const body = {
       

        NOME: document.getElementById("nome").value,
        PRECO: document.getElementById("valor").value,
        CODIGO_BARRAS: document.getElementById("codigo_barra").value,
        ESTOQUE: document.getElementById("quantidade").value,
        DESCRICAO: document.getElementById("descricao").value,

        ID_CATEGORIA: document.getElementById("Categoria").value,
        ID_FORNECEDOR: document.getElementById("Fornecedor").value
    };

    if (foto) {
        body.FOTO = foto;
        body.MIMETYPE = mimetype;
        body.FILENAME = filename;
    }

    try {
        const res = await fetch(UrlProduto, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert("Produto cadastrado com sucesso!");
            window.location.href = "mercatto-produtos.html";
        } else {
            console.error(await res.text());
            alert("Erro ao cadastrar produto");
        }

    } catch (erro) {
        console.error("Erro:", erro);
    }
}


/*GET CATEGORIAS E GET FORNECEDORES */

async function carregarCategorias() {
    const res = await fetch(urlCategorias);
    const data = await res.json();

    const select = document.getElementById("Categoria");
    select.innerHTML = "<option value=''>Selecione</option>";

    data.items.forEach(cat => {
        select.innerHTML += `
            <option value="${cat.id}">
                ${cat.nome}
            </option>
        `;
        
    });
}

async function carregarFornecedores() {
    const res = await fetch(urlFornecedores);
    const data = await res.json();

    const select = document.getElementById("Fornecedor");
    select.innerHTML = "<option value=''>Selecione</option>";

    data.items.forEach(forn => {
        select.innerHTML += `
            <option value="${forn.id}">
                ${forn.nome}
            </option>
        `;
    });
}
/*delete funcionarios */

async function excluirFuncionario() {

    const id = document.getElementById("idFuncionario").value;

    if (!id) {
        alert("ID do funcionario não encontrado");
        return;
    }

    const confirmar = confirm("Tem certeza que deseja excluir este funcionario?");
    if (!confirmar) return;

    try {
        const res = await fetch(UrlFuncionario, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ID: id
            })
        });

        if (res.ok) {
            alert("Funcionario excluído com sucesso!");
            window.location.href = "mercatto-funcionarios.html";
        } else {
            console.error(await res.text());
            alert("Erro ao excluir");
        }

    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

/* GET FUNCIONARIOS */





async function carregarFuncionarios() {
    //initTelaFuncionario
    try {
        const res = await fetch(UrlFuncionario);
        const data = await res.json();

        const container = document.getElementById("lista-funcionarios");
        container.innerHTML = "";

        let html = "";

        data.items.forEach(funcionario => {
            let foto = funcionario.foto
                ? `data:${funcionario.mimetype};base64,${funcionario.foto}`
                : "img/no-foto.png";

            html += `
        <a href="mercatto-funcionarios-editar.html?id=${funcionario.id}" class="card-pessoa ani-hover-card">
            <div class="header f-center col">
                <div class="container-img">
                    <img class="animation-up" src="${foto}" alt="">
                </div>
                <h1 class="title-card">${funcionario.nome}</h1>
            </div>
        </a>
    `;
        });

        container.innerHTML = html;

    } catch (erro) {
        console.error("Erro ao carregar funcionarios:", erro);
    }
}



/*post funcionarios */
async function criarFuncionario() {

    const cpfInput = document.getElementById("cpf").value;

    if (!validarCPF(cpfInput)) {
        alert("CPF inválido!");
        return;
    }

    const fileInput = document.getElementById("fotoFuncionario");
    let foto = null;
    let mimetype = null;
    let filename = null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        foto = await fileToBase64(file);
        mimetype = file.type;
        filename = file.name;
    }

    const body = {
        NOME: document.getElementById("nome").value,
        CPF: cpfInput,
        TELEFONE: document.getElementById("telefone").value,
        EMAIL: document.getElementById("email").value,
        CARGO: document.getElementById("cargo").value,
        SALARIO: document.getElementById("salario").value,
        DATA_ADMISSAO: document.getElementById("dataAdmissao").value


    };

    if (foto) {
        body.FOTO = foto;
        body.MIMETYPE = mimetype;
        body.FILENAME = filename;
    }



    try {
        const res = await fetch(UrlFuncionario, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert("Funcionario cadastrado com sucesso!");
            window.location.href = "mercatto-funcionarios.html";
        } else {
            console.error(await res.text());
            alert("Erro ao cadastrar");
        }

    } catch (erro) {
        console.error("Erro:", erro);
    }
}
/*PUT funcionarios */

async function salvarFuncionario() {

    const fileInput = document.getElementById("fotoFuncionario");

    let foto = null;
    let mimetype = null;
    let filename = null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        foto = await fileToBase64(file);
        mimetype = file.type;
        filename = file.name;
    }
    const cpfInput = document.getElementById("cpf").value;

    if (!validarCPF(cpfInput)) {
        alert("CPF inválido! Digite um CPF válido no formato XXX.XXX.XXX-XX e tente novamente");
        return;
    }

    const body = {
        ID: document.getElementById("idFuncionario").value,
        NOME: document.getElementById("nome").value,
        CPF_CNPJ: cpfInput,
        TELEFONE: document.getElementById("telefone").value,
        EMAIL: document.getElementById("email").value,
        CARGO: document.getElementById("cargo").value,
        SALARIO: document.getElementById("salario").value,
        DATA_ADMISSAO: document.getElementById("dataAdmissao").value,


    };

    if (foto) {
        body.FOTO = foto;
        body.MIMETYPE = mimetype;
        body.FILENAME = filename;
    }
    console.log(JSON.stringify(body));
    try {
        const res = await fetch(UrlFuncionario, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert("Funcionario atualizado com sucesso!");
            window.location.href = "mercatto-funcionarios.html";
        } else {
            console.error(await res.text());
            alert("Erro ao atualizar");
        }

    } catch (erro) {
        console.error(erro);
    }
}
async function carregarFuncionario() {
    const id = getId();

    const res = await fetch(`${UrlFuncionario}/${id}`);
    const data = await res.json();

    const funcionario = data.items[0];

    document.getElementById("idFuncionario").value = funcionario.id;
    document.getElementById("nome").value = funcionario.nome;
    document.getElementById("cpf").value = funcionario.cpf_cnpj;
    document.getElementById("telefone").value = funcionario.telefone;
    document.getElementById("email").value = funcionario.email;
    document.getElementById("cargo").value = funcionario.cargo;
    document.getElementById("salario").value = funcionario.salario;
    document.getElementById("dataAdmissao").value = funcionario.data_admissao;


    if (funcionario.foto) {
        document.getElementById("previewFoto").src =
            `data:${funcionario.mimetype};base64,${funcionario.foto}`;
    }
}

if (document.getElementById("lista-funcionarios")) {
    carregarFuncionarios();
}


/*Salvar/editar tela funcionario, controle de botões */
function initTelaFuncionario() {
    const id = getId();

    const btnExcluir = document.getElementById("btnExcluir");
    const btnSalvar = document.getElementById("btnSalvar");

    if (id) {
        //  MODO EDIÇÃO
        carregarFuncionario();

        btnExcluir.style.display = "block";
        btnSalvar.innerText = "Salvar Alterações";
        btnSalvar.onclick = salvarFuncionario;

    } else {
        //  MODO CRIAÇÃO
        btnExcluir.style.display = "none";
        btnSalvar.innerText = "Cadastrar Funcionario";
        btnSalvar.onclick = criarFuncionario;
    }
}
function initTelaProduto() {
    const id = getId();


    const btnExcluir = document.getElementById("btnExcluir");
    const btnSalvar = document.getElementById("btnSalvar");

    if (id) {
        //  MODO EDIÇÃO
        carregarProduto();

        btnExcluir.style.display = "block";
        btnSalvar.innerText = "Salvar Alterações";
        btnSalvar.onclick = salvarProduto;

    } else {
        //  MODO CRIAÇÃO
        btnExcluir.style.display = "none";
        btnSalvar.innerText = "Cadastrar Produto";
        btnSalvar.onclick = criarProduto;
    }
}




/*API CLIENTES */
/*delete clientes */

async function excluirCliente() {

    const id = document.getElementById("idCliente").value;

    if (!id) {
        alert("ID do cliente não encontrado");
        return;
    }

    const confirmar = confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirmar) return;

    try {
        const res = await fetch(UrlCliente, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ID: id
            })
        });

        if (res.ok) {
            alert("Cliente excluído com sucesso!");
            window.location.href = "mercatto-clientes.html";
        } else {
            console.error(await res.text());
            alert("Erro ao excluir");
        }

    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

/* GET CLIENTES */





async function carregarClientes() {

    try {
        const res = await fetch(UrlCliente);
        const data = await res.json();

        const container = document.getElementById("lista-clientes");
        container.innerHTML = "";

        let html = "";

        data.items.forEach(cliente => {
            let foto = cliente.foto
                ? `data:${cliente.mimetype};base64,${cliente.foto}`
                : "img/no-foto.png";

            html += `
        <a href="mercatto-clientes-editar.html?id=${cliente.id}" class="card-pessoa ani-hover-card">
            <div class="header f-center col">
                <div class="container-img">
                    <img class="animation-up" src="${foto}" alt="">
                </div>
                <h1 class="title-card">${cliente.nome}</h1>
            </div>
        </a>
    `;
        });

        container.innerHTML = html;

        
        // caso nao encontre nada, exibe html 'nada encontrado'
        if (data.items.length === 0) {
            container.innerHTML = "<div class='no-data-found'><p>Nenhum cliente encontrado.</p></div>";
        }  


    } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
    }
}


/*post clientes */
async function criarCliente() {

    const cpfInput = document.getElementById("cpf").value;

    if (!validarCPF(cpfInput)) {
        alert("CPF inválido!");
        return;
    }

    const fileInput = document.getElementById("fotoCliente");
    let foto = null;
    let mimetype = null;
    let filename = null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        foto = await fileToBase64(file);
        mimetype = file.type;
        filename = file.name;
    }

    const body = {
        NOME: document.getElementById("nome").value,
        CPF_CNPJ: cpfInput,
        TELEFONE: document.getElementById("telefone").value,
        EMAIL: document.getElementById("email").value,
        ENDERECO: document.getElementById("endereco").value,
        CIDADE: document.getElementById("cidade").value,
        ESTADO: document.getElementById("estado").value,
        CEP: document.getElementById("cep").value
    };

    if (foto) {
        body.FOTO = foto;
        body.MIMETYPE = mimetype;
        body.FILENAME = filename;
    }

    console.log(JSON.stringify(body));

    try {
        const res = await fetch(UrlCliente, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert("Cliente cadastrado com sucesso!");
            window.location.href = "mercatto-clientes.html";
        } else {
            console.error(await res.text());
            alert("Erro ao cadastrar");
        }

    } catch (erro) {
        console.error("Erro:", erro);
    }
}
/*PUT CLIENTES */

async function salvarCliente() {

    const fileInput = document.getElementById("fotoCliente");

    let foto = null;
    let mimetype = null;
    let filename = null;

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        foto = await fileToBase64(file);
        mimetype = file.type;
        filename = file.name;
    }
    const cpfInput = document.getElementById("cpf").value;

    if (!validarCPF(cpfInput)) {
        alert("CPF inválido! Digite um CPF válido no formato XXX.XXX.XXX-XX e tente novamente");
        return;
    }

    const body = {
        ID: document.getElementById("idCliente").value,
        NOME: document.getElementById("nome").value,
        CPF_CNPJ: cpfInput,
        TELEFONE: document.getElementById("telefone").value,
        EMAIL: document.getElementById("email").value,
        ENDERECO: document.getElementById("endereco").value,
        CIDADE: document.getElementById("cidade").value,
        ESTADO: document.getElementById("estado").value,
        CEP: document.getElementById("cep").value,


    };

    if (foto) {
        body.FOTO = foto;
        body.MIMETYPE = mimetype;
        body.FILENAME = filename;
    }
    console.log(JSON.stringify(body));
    try {
        const res = await fetch(UrlCliente, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            alert("Cliente atualizado com sucesso!");
            window.location.href = "mercatto-clientes.html";
        } else {
            console.error(await res.text());
            alert("Erro ao atualizar");
        }

    } catch (erro) {
        console.error(erro);
    }
}
async function carregarCliente() {
    const id = getId();

    const res = await fetch(`${UrlCliente}/${id}`);
    const data = await res.json();

    const cliente = data.items[0];

    document.getElementById("idCliente").value = cliente.id;
    document.getElementById("nome").value = cliente.nome;
    document.getElementById("cpf").value = cliente.cpf_cnpj;
    document.getElementById("telefone").value = cliente.telefone;
    document.getElementById("email").value = cliente.email;
    document.getElementById("cep").value = cliente.cep;
    document.getElementById("endereco").value = cliente.endereco;
    document.getElementById("cidade").value = cliente.cidade;
    document.getElementById("estado").value = cliente.estado;


    if (cliente.foto) {
        document.getElementById("previewFoto").src =
            `data:${cliente.mimetype};base64,${cliente.foto}`;
    }
}

if (document.getElementById("lista-clientes")) {
    carregarClientes();
}


/*Salvar/editar tela cliente, controle de botões */
function initTelaCliente() {
    const id = getId();

    const btnExcluir = document.getElementById("btnExcluir");
    const btnSalvar = document.getElementById("btnSalvar");

    if (id) {
        //  MODO EDIÇÃO
        carregarCliente();

        btnExcluir.style.display = "block";
        btnSalvar.innerText = "Salvar Alterações";
        btnSalvar.onclick = salvarCliente;

    } else {
        //  MODO CRIAÇÃO
        btnExcluir.style.display = "none";
        btnSalvar.innerText = "Cadastrar Cliente";
        btnSalvar.onclick = criarCliente;
    }
}


/*
   MÁSCARAS
*/

function aplicarMascaraCPF(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
}

function aplicarMascaraTelefone(valor) {
    valor = valor.replace(/\D/g, "");

    if (valor.length <= 10) {
        // fixo
        valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
        // celular
        valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return valor;
}



/* validações */

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
}

function initMascaras() {

    // CPF
    document.querySelectorAll(".cpf-mask").forEach(input => {

        input.addEventListener("input", (e) => {
            e.target.value = aplicarMascaraCPF(e.target.value);
        });

        input.addEventListener("blur", (e) => {
            if (e.target.value && !validarCPF(e.target.value)) {
                e.target.style.border = "2px solid red";
                alert("CPF inválido");
            } else {
                e.target.style.border = "";
            }
        });

    });

    // TELEFONE
    document.querySelectorAll(".telefone-mask").forEach(input => {

        input.addEventListener("input", (e) => {
            e.target.value = aplicarMascaraTelefone(e.target.value);
        });

    });
}


/*Buscas */

/*
function buscarCliente() {
    const searchInput = document.getElementById("Search");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const cards = document.querySelectorAll("#lista-clientes .card-pessoa");

    let anyVisible = false;

    cards.forEach(card => {
        const title = card.querySelector(".title-card");
        const nome = title ? title.innerText.toLowerCase() : "";
        const match = nome.includes(query);

        card.style.display = match ? "block" : "none";
        if (match) anyVisible = true;
    });

    const container = document.getElementById("lista-clientes");
    if (!container) return;

    let noData = container.querySelector(".no-data-found");

    if (!anyVisible) {
        if (!noData) {
            noData = document.createElement("div");
            noData.className = "no-data-found";
            noData.innerHTML = "<p>Nenhum cliente encontrado.</p>";
            container.appendChild(noData);
        }
        noData.style.display = "block";
    } else if (noData) {
        noData.style.display = "none";
    }
}*/

function BuscarConteudo(searchInputId = "Search", containerId = "lista-busca", itemSelector = ".card-pessoa", noResultsText = "Nada Encontrado.") {
    const searchInput = document.getElementById(searchInputId);
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const container = document.getElementById(containerId);
    if (!container) return;

    const cards = Array.from(container.querySelectorAll(itemSelector));
    let anyVisible = false;

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const match = query === "" || text.includes(query);

        card.style.display = match ? "" : "none";
        if (match) anyVisible = true;
    });

    let noData = container.querySelector(".no-data-found");

    if (!anyVisible) {
        if (!noData) {
            noData = document.createElement("div");
            noData.className = "no-data-found";
            noData.innerHTML = `<p>${noResultsText}</p>`;
            container.appendChild(noData);
        }
        noData.style.display = "block";
    } else if (noData) {
        noData.style.display = "none";
    }
}
// inicia automático
document.addEventListener("DOMContentLoaded", initMascaras);

document.addEventListener("DOMContentLoaded", () => {

    carregarProdutos();
    carregarFornecedores();
    carregarCategorias();
    
   

    if (document.getElementById("lista-funcionarios")) {
        carregarFuncionarios();
    }

    if (document.getElementById("lista-clientes")) {
        carregarClientes();
    }
 
});