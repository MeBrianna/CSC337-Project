let leaderboardData = [];
let sortKey = 'wpm';
let sortAsc = false;
let selectedNumWords = 25; // default

async function fetchData() {
  const res = await fetch(`/api/leaderboard?numWords=${selectedNumWords}`);
  const data = await res.json();
  leaderboardData = data.map((row, i) => ({ ...row, _initialIndex: i }));
  renderTable();
}

function renderTable() {
  let displayData;

  if (sortKey === 'rank') {
    displayData = [...leaderboardData].sort((a, b) =>
      sortAsc
        ? a._initialIndex - b._initialIndex
        : b._initialIndex - a._initialIndex
    );
  } else {
    displayData = [...leaderboardData].sort((a, b) => {
      let aVal, bVal;
      if (sortKey === 'accuracy') {
        aVal = (a.accuracy ?? 0);
        bVal = (b.accuracy ?? 0);
        aVal = (aVal <= 1) ? aVal * 100 : aVal;
        bVal = (bVal <= 1) ? bVal * 100 : bVal;
      } else {
        aVal = (a[sortKey] ?? 0);
        bVal = (b[sortKey] ?? 0);
      }
      return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * (sortAsc ? 1 : -1);
    });
  }

  const tbody = document.getElementById('leaderboardBody');
  tbody.classList.remove('fade'); // reset animation
  void tbody.offsetWidth; // force reflow for animation
  tbody.innerHTML = '';

  const maxRows = 10;
  displayData.slice(0, maxRows).forEach((row, i) => {
    const rank = i + 1;
    const wpmDisplay = typeof row.wpm === 'number'
      ? row.wpm.toFixed(1)
      : '–';
    let accDisplay;
    if (typeof row.accuracy === 'number') {
      const rawAcc = row.accuracy <= 1
        ? row.accuracy * 100
        : row.accuracy;
      accDisplay = (rawAcc % 1 === 0
        ? rawAcc.toFixed(0)
        : rawAcc.toFixed(1)
      ) + '%';
    } else {
      accDisplay = '–';
    }

    const tr = document.createElement('tr');

    // 🥇 Medals for top 3
    let rankDisplay = rank;
    if (rank === 1) rankDisplay = '🥇';
    else if (rank === 2) rankDisplay = '🥈';
    else if (rank === 3) rankDisplay = '🥉';

    tr.innerHTML = `
      <td>${rankDisplay}</td>
      <td>${row.username}</td>
      <td>${wpmDisplay}</td>
      <td>${accDisplay}</td>
    `;

    // ✨ Highlight top scorer
    if (rank === 1 && sortKey !== 'rank') {
      tr.classList.add('highlight');
    }

    tbody.appendChild(tr);
  });

  tbody.classList.add('fade'); // trigger fade animation

  document.querySelectorAll('th').forEach(th => {
    th.classList.remove('sorted-asc', 'sorted-desc');
    if (th.dataset.key === sortKey) {
      th.classList.add(sortAsc ? 'sorted-asc' : 'sorted-desc');
    }
  });
}

function setupSorting() {
  document.querySelectorAll('th').forEach(th => {
    const key = th.dataset.key;
    if (!key) return;
    th.addEventListener('click', () => {
      if (sortKey === key) {
        sortAsc = !sortAsc;
      } else {
        sortKey = key;
        sortAsc = (key === 'wpm' || key === 'accuracy') ? false : true;
      }
      renderTable();
    });
  });
}

function setupModeSelector() {
  const modeSelector = document.getElementById('modeSelector');
  modeSelector.addEventListener('change', (e) => {
    selectedNumWords = Number(e.target.value);
    updateModeLabel();
    fetchData();
  });
}

function updateModeLabel() {
  const label = document.getElementById('modeLabel');
  label.innerText = `(${selectedNumWords} Words Leaderboard)`;
}

document.addEventListener('DOMContentLoaded', () => {
  setupSorting();
  setupModeSelector();
  updateModeLabel();
  fetchData();
});