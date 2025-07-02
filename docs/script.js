function createTable(cfg, tableName, tableData){
    const container = document.getElementById("tables-container");

    const columns = Object.keys(tableData);
    const rowsSet = new Set();

    columns.forEach(col => {
      Object.keys(tableData[col]).forEach(row => rowsSet.add(row));
    });

    const rows = Array.from(rowsSet);
    const table = document.createElement("table");

    const tbody = document.createElement("tbody");

    // Title Row
    const titleRow = document.createElement("tr");
    const titleCell = document.createElement("td");
    titleCell.colSpan = columns.length + 1;
    titleCell.textContent = tableName;
    titleCell.classList.add("title");
    titleRow.appendChild(titleCell);
    tbody.appendChild(titleRow);

    // Header Row
    const headerRow = document.createElement("tr");
    const emptyHeader = document.createElement("th");
    headerRow.appendChild(emptyHeader);
    columns.forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        th.classList.add("header-cell");
        headerRow.appendChild(th);
    });
    tbody.appendChild(headerRow);

    const inputs = {};

    // Data Rows
    rows.forEach(row => {
        const tr = document.createElement("tr");
        const indexCell = document.createElement("th");
        indexCell.textContent = row;
        indexCell.classList.add("index-cell");
        tr.appendChild(indexCell);

        columns.forEach(col => {
            const td = document.createElement("td");
            td.classList.add("body-cell");

            const input = document.createElement("input");
            input.type = "number";
            input.step = "any";

            const baseValue = tableData[col][row];
            input.value = baseValue;
            input.dataset.row = row;
            input.dataset.col = col;
            input.dataset.table = tableName;

            inputs[`${row}|${col}`] = input;

            input.addEventListener("input", (e) => {
            const newVal = parseFloat(e.target.value);
            const r = e.target.dataset.row;
            const c = e.target.dataset.col;
            const t = e.target.dataset.table;

            const baseRatio = cfg[t][c][r];
            if (isNaN(baseRatio) || baseRatio === 0 || isNaN(newVal)) return;

            for (const col2 in cfg[t]) {
                for (const row2 in cfg[t][col2]) {
                const ratio = cfg[t][col2][row2];
                const computed = (newVal * ratio) / baseRatio;
                const key = `${row2}|${col2}`;
                if (inputs[key] && inputs[key] !== input) {
                    inputs[key].value = computed.toFixed(2);
                }
                }
            }
            });

            td.appendChild(input);
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);
}

async function build() {
    const response = await fetch('cfg.json');
    const cfg = await response.json();
    for (const [tableName, tableData] of Object.entries(cfg)) {
        createTable(cfg, tableName, tableData);
    }
}

function main() {
    build().catch(console.error);
}


main();
