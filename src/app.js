import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./style.css";

window.onload = function () {
  const SUITS = [
    { name: "hearts", symbol: "♥", color: "danger" },
    { name: "diamonds", symbol: "♦", color: "danger" },
    { name: "spades", symbol: "♠", color: "dark" },
    { name: "clubs", symbol: "♣", color: "dark" },
  ];
  const RANKS = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  const suitOrder = { clubs: 0, diamonds: 1, hearts: 2, spades: 3 };
  const rankValue = (r) => ({ A: 1, J: 11, Q: 12, K: 13 }[r] ?? Number(r));

  const $count = document.getElementById("count");
  const $draw = document.getElementById("btnDraw");
  const $sort = document.getElementById("btnSort");
  const $host = document.getElementById("cardHost");
  const $logHost = document.getElementById("logHost");

  let current = [];
  let bubbleLog = [];

  const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  function makeRandomCard() {
    const suit = randomPick(SUITS);
    const rank = randomPick(RANKS);
    return { suit: suit.name, symbol: suit.symbol, color: suit.color, rank };
  }
  function generateCards(n) {
    const k = Math.max(1, Math.min(52, Number(n) || 1));
    return Array.from({ length: k }, makeRandomCard);
  }

  function cardHTML(c) {
    const textColor = `text-${c.color}`;
    return `
    <div class="col">
      <div class="card playing-card border-2">
        <div class="card-body p-2 ${textColor}">
          <div class="d-flex justify-content-between">
            <span class="small fw-semibold">${c.rank}</span>
            <span class="small">${c.symbol}</span>
          </div>
          <div class="mid d-grid justify-content-center align-items-center">
            <span>${c.symbol}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="small">${c.symbol}</span>
            <span class="small fw-semibold">${c.rank}</span>
          </div>
        </div>
      </div>
    </div>
  `.trim();
  }

  function renderCards(arr) {
    $host.innerHTML = arr.map(cardHTML).join("");
  }

  function renderLog(log) {
    if (!log.length) {
      $logHost.innerHTML = `<div class="list-group-item d-flex justify-content-between align-items-center">
      <span class="text-secondary">No swaps yet</span>
    </div>`;
      return;
    }
    $logHost.innerHTML = log
      .map(
        (snapshot, i) => `
      <div class="list-group-item">
        <div class="d-flex align-items-center mb-2 gap-2">
          <span class="badge text-bg-primary">Step ${i + 1}</span>
          <small class="text-secondary">after swap</small>
        </div>
        <div class="row row-cols-auto g-2">
          ${snapshot.map(cardHTML).join("")}
        </div>
      </div>
    `
      )
      .join("");
  }

  function bubbleSortWithLog(cards) {
    const clone = (arr) => arr.map((c) => ({ ...c }));
    const arr = clone(cards);
    const log = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        const left = rankValue(arr[j].rank);
        const right = rankValue(arr[j + 1].rank);
        const needSwap =
          left > right ||
          (left === right &&
            suitOrder[arr[j].suit] > suitOrder[arr[j + 1].suit]);

        if (needSwap) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          log.push(clone(arr));
        }
      }
      if (!swapped) break;
    }
    return { sorted: arr, log };
  }

  function onDraw() {
    current = generateCards($count.value);
    bubbleLog = [];
    renderCards(current);
    renderLog(bubbleLog);
  }
  function onSort() {
    if (!current.length) return;
    const { sorted, log } = bubbleSortWithLog(current);
    current = sorted;
    bubbleLog = log;
    renderCards(current);
    renderLog(bubbleLog);
  }

  $draw.addEventListener("click", onDraw);
  $sort.addEventListener("click", onSort);
  onDraw();
};
