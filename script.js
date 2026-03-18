
const ApiClientes = "https://g22f234c89b2f5c-projetoimpacta.adb.sa-saopaulo-1.oraclecloudapps.com/ords/prjimp/edu/clientes";

// evento do formulário
document.getElementById("clienteForm").addEventListener("submit", salvarCliente);



// ===============================
// SALVAR CLIENTE (POST / PUT)
// ===============================
async function salvarCliente(e){

e.preventDefault();

let id = document.getElementById("id").value;

let fotoInput = document.getElementById("foto");

let formData = new FormData();

formData.append("NOME", document.getElementById("nome").value);
formData.append("CPF_CNPJ", document.getElementById("cpf_cnpj").value);
formData.append("TELEFONE", document.getElementById("telefone").value);
formData.append("EMAIL", document.getElementById("email").value);
formData.append("ENDERECO", document.getElementById("endereco").value);
formData.append("CIDADE", document.getElementById("cidade").value);
formData.append("ESTADO", document.getElementById("estado").value);
formData.append("CEP", document.getElementById("cep").value);

if(id){
formData.append("ID", id);
}

if(fotoInput.files.length>0){

let file = fotoInput.files[0];

formData.append("FOTO", file);
formData.append("FILENAME", file.name);
formData.append("MIMETYPE", file.type);

}

let metodo = id ? "PUT" : "POST";

await fetch(ApiClientes,{
method: metodo,
body: formData
});

listarClientes();

}



// ===============================
// LISTAR CLIENTES
// ===============================
async function listarClientes() {

try {

let res = await fetch(ApiClientes);

let data = await res.json();

let tabela = document.querySelector("#tabelaClientes tbody");

tabela.innerHTML = "";

data.items.forEach(cliente => {

let foto = "";

if(cliente.foto){
foto = `<img src="data:${cliente.mimetype};base64,${cliente.foto}" width="40">`;
}

tabela.innerHTML += `
<tr>

<td class="hide">${cliente.id}</td>
<td>${cliente.nome}</td>
<td>${cliente.telefone || ""}</td>
<td>${cliente.email || ""}</td>
<td>${foto}</td>

<td>

<button onclick="editar(${cliente.id})">Editar</button>
<button onclick="excluir(${cliente.id})">Excluir</button>

</td>

</tr>
`;

});

} catch (erro) {

console.error("Erro ao listar clientes:", erro);

}

}



// ===============================
// EDITAR CLIENTE
// ===============================
async function editar(id) {

try {

let res = await fetch(ApiClientes + "?ID=" + id);

let data = await res.json();

let c = data.items ? data.items[0] : data;

document.getElementById("id").value = c.id;
document.getElementById("nome").value = c.nome || "";
document.getElementById("cpf_cnpj").value = c.cpf_cnpj || "";
document.getElementById("telefone").value = c.telefone || "";
document.getElementById("email").value = c.email || "";
document.getElementById("endereco").value = c.endereco || "";
document.getElementById("cidade").value = c.cidade || "";
document.getElementById("estado").value = c.estado || "";
document.getElementById("cep").value = c.cep || "";

if (c.foto && c.mimetype) {

document.getElementById("preview").src =
"data:" + c.mimetype + ";base64," + c.foto;

}

} catch (erro) {

console.error("Erro ao carregar cliente:", erro);

}

}



// ===============================
// EXCLUIR CLIENTE
// ===============================
async function excluir(id) {

if (!confirm("Deseja excluir este cliente?")) return;

try {

await fetch(ApiClientes + "?ID=" + id,{
method:"DELETE"
});

listarClientes();

} catch (erro) {

console.error("Erro ao excluir cliente:", erro);

}

}



// ===============================
// LIMPAR FORMULÁRIO
// ===============================
function limpar() {

document.getElementById("clienteForm").reset();

document.getElementById("id").value = "";

document.getElementById("preview").src = "";

}



// ===============================
// PREVIEW FOTO
// ===============================
function previewFoto() {

let file = document.getElementById("foto").files[0];

if (!file) return;

let reader = new FileReader();

reader.onload = function(e) {

document.getElementById("preview").src = e.target.result;

};

reader.readAsDataURL(file);

}

listarClientes();


function maskCpfCnpjInit() {

document.querySelectorAll(".cpfcnpj").forEach(input => {

input.addEventListener("input", function () {

let v = this.value.replace(/\D/g, "");

// limitar 14
v = v.substring(0,14);

// CPF
if (v.length <= 11) {

v = v.replace(/(\d{3})(\d)/, "$1.$2");
v = v.replace(/(\d{3})(\d)/, "$1.$2");
v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

} 
// CNPJ
else {

v = v.replace(/^(\d{2})(\d)/, "$1.$2");
v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
v = v.replace(/(\d{4})(\d)/, "$1-$2");

}

this.value = v;

validarCampo(this);

});

});

}



function validarCampo(input){

let v = input.value.replace(/\D/g,"");

if(v.length === 11){

if(validarCPF(v)){

input.classList.add("valido");
input.classList.remove("invalido");

}else{

input.classList.add("invalido");
input.classList.remove("valido");

}

}

else if(v.length === 14){

if(validarCNPJ(v)){

input.classList.add("valido");
input.classList.remove("invalido");

}else{

input.classList.add("invalido");
input.classList.remove("valido");

}

}else{

input.classList.remove("valido");
input.classList.remove("invalido");

}

}



function validarCPF(cpf){

if (/^(\d)\1+$/.test(cpf)) return false;

let soma = 0;
let resto;

for (let i=1;i<=9;i++)
soma += parseInt(cpf.substring(i-1,i))*(11-i);

resto = (soma*10)%11;

if(resto==10||resto==11) resto=0;

if(resto!=parseInt(cpf.substring(9,10))) return false;

soma=0;

for (let i=1;i<=10;i++)
soma+=parseInt(cpf.substring(i-1,i))*(12-i);

resto=(soma*10)%11;

if(resto==10||resto==11) resto=0;

if(resto!=parseInt(cpf.substring(10,11))) return false;

return true;

}



function validarCNPJ(cnpj){

if (/^(\d)\1+$/.test(cnpj)) return false;

let tamanho = cnpj.length - 2
let numeros = cnpj.substring(0,tamanho)
let digitos = cnpj.substring(tamanho)
let soma = 0
let pos = tamanho - 7

for (let i=tamanho;i>=1;i--){

soma += numeros.charAt(tamanho-i) * pos--;

if (pos < 2) pos = 9;

}

let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

if(resultado != digitos.charAt(0)) return false;

tamanho = tamanho + 1;
numeros = cnpj.substring(0,tamanho);
soma = 0;
pos = tamanho - 7;

for (let i=tamanho;i>=1;i--){

soma += numeros.charAt(tamanho-i) * pos--;

if (pos < 2) pos = 9;

}

resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

if(resultado != digitos.charAt(1)) return false;

return true;

}



// iniciar sistema
maskCpfCnpjInit();
