/*jshint esversion: 6 */
import { quests } from "./quests.js";
import { collector } from "./collector.js";

const quest_el = document.getElementById("quest-list");
const quest_counter_el = document.getElementById("quest-counter");
const collector_el = document.getElementById("collector-list");
const collector_counter_el = document.getElementById("collector-counter");
const done_el = document.getElementById("done-list");
const reset_el = document.getElementById('reset');

let questCount = 0;
let doneCount = 0;
let collectorCount = 0;
let collectedCount = 0;

function loadData() {
  const local_quests = JSON.parse(localStorage.getItem("quests"));

  if (local_quests) {
    quests.data = local_quests.data;
  }

  const local_collector = JSON.parse(localStorage.getItem("collector"));

  if (local_collector) {
    collector.data = local_collector.data;
  }
}

function save() {
  localStorage.setItem("quests", JSON.stringify(quests));
  localStorage.setItem("collector", JSON.stringify(collector));
}

function reset() {
  localStorage.removeItem("quests");
  localStorage.removeItem("collector");
  location.reload();
  window.scrollTo(0, 0);
}

function createQuestElement(item) {
  const item_el = document.createElement("div");
  item_el.classList.add("item");
  item_el.classList.add("quest");
  item_el.classList.add(item.trader.toLowerCase());

  const trader_el = document.createElement("p");
  let imageName = item.trader.toLowerCase() + ".webp";
  trader_el.innerHTML = "<img src='" + imageName + "'/>";

  const text_el = document.createElement("p");
  text_el.classList.add("name");
  let linkPrefix = "https://escapefromtarkov.fandom.com/wiki/";
  let linkString = linkPrefix + item.name.replace(/ /g,"_");
  text_el.innerHTML = "<a href='" + linkString + "' target='blank'>" + item.name + "</a>";

  const checkbox_el = document.createElement("input");
  checkbox_el.type = "checkbox";

  if (item.done) {
    item_el.classList.add("done");
    checkbox_el.checked = true;
  }

  item_el.append(trader_el);
  item_el.append(text_el);
  item_el.append(checkbox_el);

  checkbox_el.addEventListener("change", () => {
    item.done = checkbox_el.checked;

    if (item.done) {
      item.completedAt = Date.now();
      item_el.classList.add("done");
      done_el.prepend(item_el)
      doneCount++;
    } else {
      item.completedAt = "";
      item_el.classList.remove("done");
      quest_el.prepend(item_el)
      doneCount--;
    }

    displayQuestCount();

    save();
  });

  return { item_el };
}

function createCollectorElement(item) {
  const item_el = document.createElement("div");
  item_el.classList.add("item");

  const text_el = document.createElement("p");
  text_el.innerHTML = item.name;

  const checkbox_el = document.createElement("input");
  checkbox_el.type = "checkbox";

  if (item.done) {
    item_el.classList.add("done");
    checkbox_el.checked = true;
  }

  item_el.append(text_el);
  item_el.append(checkbox_el);

  checkbox_el.addEventListener("change", () => {
    item.done = checkbox_el.checked;

    if (item.done) {
      item.completedAt = Date.now();
      item_el.classList.add("done");
      collectedCount++;
    } else {
      item.completedAt = "";
      item_el.classList.remove("done");
      collectedCount--;
    }

    displayCollectorCount();

    save();
  });

  return { item_el };
}

function displayQuests() {

  for (let i = 0; i < quests.data.length; i++) {

    questCount++;

    const item = quests.data[i];

    const { item_el } = createQuestElement(item);

    if (item.done) {
      doneCount++;
    }

    item.done ? done_el.append(item_el) : quest_el.append(item_el);

  }

  displayQuestCount();

}

function displayCollector() {

  for (let i = 0; i < collector.data.length; i++) {

    collectorCount++;

    const item = collector.data[i];

    const { item_el } = createCollectorElement(item);

    collector_el.append(item_el);

    if (item.done) {
      collectedCount++;
    }
  }

  displayCollectorCount();

}

function displayQuestCount() {
  const todo_count_el = document.getElementById("done-count");
  todo_count_el.innerHTML = doneCount
    ;

  const quest_count_el = document.getElementById("quest-count");
  quest_count_el.innerHTML = questCount;
}

function displayCollectorCount() {
  const toCollect_count_el = document.getElementById("collected-count");
  toCollect_count_el.innerHTML = collectedCount;

  const collector_count_el = document.getElementById("collector-count");
  collector_count_el.innerHTML = collectorCount;

}

function filterQuests() {
  const trader = this.innerHTML.toLowerCase(); // 'this' being the element that was clicked
  const arrQuests = document.getElementsByClassName("quest");
  const filterButtons = document.getElementById("quest-filters").getElementsByClassName("filter-btn");

  for (let i = 0; i < filterButtons.length; i++) {
    if (filterButtons[i].innerHTML.toLocaleLowerCase() == trader) {
      filterButtons[i].classList.add("chosen");
    } else {
      filterButtons[i].classList.remove("chosen");
    }
  }


  for (let i = 0; i < arrQuests.length; i++) {
    if (trader == 'all') {
      quest_counter_el.classList.remove("hidden");
      arrQuests[i].classList.remove("hidden");
    } else {
      // hide quest counter and quests from all other traders
      quest_counter_el.classList.add("hidden");
      if (!arrQuests[i].classList.contains(trader)) {
        arrQuests[i].classList.add("hidden");
      } else {
        arrQuests[i].classList.remove("hidden");
      }
    }
  }
}

// Events
reset_el.addEventListener('click', reset);

let filterButtons = document.getElementById("quest-filters").getElementsByClassName("filter-btn");
for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", filterQuests);
};

// Run

loadData();

displayQuests();

displayCollector();
