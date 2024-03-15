// Ladataan DOM-sisältö täysin ennen kuin suoritetaan skriptit
document.addEventListener('DOMContentLoaded', function(){
  // Määritetääm muuttujat
  const taskInput = document.getElementById('taskInput'); 
  const taskList = document.getElementById('taskList'); 
  const addBtn = document.getElementById('addBtn'); 
  const tasksRemaining = document.getElementById('tasksRemaining'); 
});

// Haetaan tallennetut tehtävät localStoragesta
// Haetaan 'savedTasks' -kohteen arvo localStoragesta ja parsitaan se taulukoksi, ja jos tallennettuja tehtäviä ei ole, alustetaan tyhjä taulukko
const savedTasks = JSON.parse(localStorage.getItem('savedTasks')) || [];
// Käydään läpi jokainen tallennettu tehtävä
savedTasks.forEach(task =>{
// Lisätään jokainen tehtävä tehtävälistaan kutsumalla 'addTaskList' -funktiota. Tehtävän 'content' ja 'checked' -ominaisuudet määrittävät sen tekstin ja suoritustilan
  addTaskList(task.content, task.checked);
});

// Lisää tapahtumakuuntelija lisäyspainikkeelle
addBtn.addEventListener('click', function(event){
  // Estetään lomakkeen lähettäminen
  event.preventDefault();
  // Kutsutaan funktiota 'addTask' uuden tehtävän lisäämiseksi
  addTask();
});

// Funktio uuden tehtävän lisäämiseksi
function addTask(){
  // Poista edeltävät ja jälkeiset välilyönnit
  const taskContent = taskInput.value.trim();
  // Tarkista, onko syöte tyhjä
  if (taskContent === ""){
    // Ilmoitus, jos syöte on tyhjä
    alert("You must write something!");
    // Lisää 'error' -luokka syötekenttään 
    taskInput.classList.add('error');
    // Tarkista, onko syöte liian lyhyt
  } else if (taskContent.length < 3){
    // Ilmoitus, jos syöte on liian lyhyt
    alert("Please enter at least 3 characters."); 
    // Lisää 'error' -luokka syötekenttään 
    taskInput.classList.add('error');
    // Kutsu 'addTaskList' -funktiota lisätäksesi uusi tehtävä tehtävälistaan
  } else{
    // Uusi tehtävä on aluksi merkitsemätön
    addTaskList(taskContent, false);
    // Poista 'error' -luokka syötekentästä, kun validointi onnistuu
    taskInput.classList.remove('error');
    // Tallenna tehtävät localStorageen uuden lisäämisen jälkeen
    SaveToLocalStorage();
  }
  // Tyhjennä syötekenttä tehtävän lisäämisen jälkeen
  taskInput.value = "";
};

// Funktio tehtävän lisäämiseksi tehtävälistaan
function addTaskList(taskContent, isChecked){
  // Luo uusi li-elementti
  let li = document.createElement('li'); 
  // Aseta li-elementin tekstisisältöksi tehtävän sisältö
  li.textContent = taskContent;
  // Jos tehtävä on merkitty
  if (isChecked){
    // lisää li-elementtiin 'checked' -luokka
    li.classList.add('checked');
  }
  // Luo uusi span-elementti
  let span = document.createElement('span');
  // Aseta span-elementin sisältöksi kuvake tehtävän poistamista varten
  span.innerHTML = "<i class='fa-solid fa-trash'></i>";
  // Lisää span-elementti li-elementtiin
  li.appendChild(span);
  // Lisää li-elementti tehtävälistaan
  taskList.appendChild(li);
  // Päivitä jäljellä olevien tehtävien määrä
  updateTasksRemaining();
};

// Lisää tapahtumakuuntelija tehtävälistalle
taskList.addEventListener('click', (e) =>{
  // Jos klikattu elementti on li-elementti (<li>)
  if (e.target.tagName.toUpperCase() === "LI"){
    // Vaihda klikatun li-elementin -luokkaa merkityn/merkitsemättömän välillä
    e.target.classList.toggle("checked") 
    // Jos klikattu elementti on span-elementti (poistopainike)
  } else if (e.target.tagName.toUpperCase() === "SPAN"){
    // Poista tehtävä
    e.target.parentElement.remove();
  }
  // Päivitä jäljellä olevien tehtävien määrä toiminnan jälkeen
  updateTasksRemaining();
  // Tallenna tehtävät localStorageen toiminnan jälkeen
  SaveToLocalStorage();
});

// Funktio jäljellä olevien tehtävien määrän päivittämiseksi
function updateTasksRemaining(){
  // Valitse kaikki li-elementit tehtävälistasta
  const taskItems = taskList.querySelectorAll('li');
  // Laske jäljellä olevien tehtävien määrä vähentämällä merkittyjen tehtävien määrä kaikkien tehtävien määrästä
  const remainingCount = taskItems.length - Array.from(taskItems).filter(li => li.classList.contains("checked")).length;
  // Päivitä 'tasksRemaining' -elementin tekstisisältö näyttämään jäljellä olevien tehtävien määrä
  tasksRemaining.textContent = `Tasks remaining: ${remainingCount}`;
};

// Funktio tehtävien tallentamiseksi localStorageen
function SaveToLocalStorage(){
  // Valitse kaikki li-elementit tehtävälistasta
  const taskItems = taskList.querySelectorAll('li');
  // Alusta tyhjä taulukko datan tallentamista varten
  const tasks = [];
  // Käy läpi jokainen li-elementti
  taskItems.forEach(taskItem =>{
    // Lisätään jokainen tehtävä 'tasks' -taulukkoon
    // Tehtävä sisältää tekstin ja onko se merkitty vai ei
    tasks.push({
      content: taskItem.textContent,
      checked: taskItem.classList.contains("checked")
    });
  });
  // Tallenna 'tasks' -taulukko localStorageen muunnettuna JSON-merkkijonoksi
  localStorage.setItem('savedTasks', JSON.stringify(tasks)); 
};