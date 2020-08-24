function populateUFs() {
  const ufselect = document.querySelector("[name = Uf]");
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((res) => res.json())
    .then((states) => {
      for (const state of states) {
        ufselect.innerHTML += `<option value = "${state.id}"> ${state.nome} 
        </option>`;
      }
    });
}
//chamando função
populateUFs();

function getCities(event) {
  const citySelect = document.querySelector("[name = city]");
  const stateInput = document.querySelector("[name = state]");

  const ufValue = event.target.value;

  const indexofSelectedState = event.target.selectedIndex;
  stateInput.value = event.target.options[indexofSelectedState].text;

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

  citySelect.innerHTML = "<option value> Selecione a Cidade</option>";
  citySelect.disabled = true;

  fetch(url)
    .then((res) => res.json())
    .then((cities) => {
      for (const city of cities) {
        citySelect.innerHTML += `<option value ="${city.nome}">${city.nome}</option>`;
      }
      citySelect.disabled = false;
    });
}

document
  .querySelector("select[name = Uf]")
  .addEventListener("change", getCities);

//itens de coleta pegar todos o li
const itemsToCollect = document.querySelectorAll(".items-grid li");

for (const item of itemsToCollect) {
  item.addEventListener("click", handleSelectedItem);
}

const collectedItems = document.querySelector("input[name=items]");

let selectedItems = [];

function handleSelectedItem(event) {
  const itemLi = event.target;
  //adicionar ou remover uma classe com js
  itemLi.classList.toggle("selected");
  const itemId = itemLi.dataset.id;

  console.log("Item Id", itemId);

  //verificar se existem itens selecionados, se sim
  //pegar os itens selecionados
  const alreadySelected = selectedItems.findIndex((item) => {
    const itemFound = item == itemId;
    return itemFound;
  });

  // se já estiver selecionados, tirar da seleção
  if (alreadySelected >= 0) {
    //tirar da seleção
    const filteredItems = selectedItems.filter((item) => {
      const itemIsDifferent = item != itemId;
      return itemIsDifferent;
    });
    selectedItems = filteredItems;
  }
  //se não estiver selecionado adicionar a seleção
  else {
    selectedItems.push(itemId);
  }
  console.log(selectedItems);
  console.log("item id", itemId);
  //atualizar o campo escondido com os itens selecionados
  collectedItems.value = selectedItems;
}
