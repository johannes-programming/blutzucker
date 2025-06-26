async function loadConfigAndBuildUI() {
    const response = await fetch('cfg.json');
    const cfg = await response.json();

    for (const [drug, units] of Object.entries(cfg.conv)) {
        createMedicationBlock(drug, units, cfg);
    }
}


function createMedicationBlock(drug, units, cfg) {
    const calc_dl = document.createElement('dl');
    calc_dl.className = 'medication-block';
    const calc_dt = document.createElement('dt');
    calc_dt.innerHTML = drug.toString();
    const calc_dd = document.createElement('dd');

    const inputs = createUnitInputs(drug, units, calc_dd);
    for (const [unitName, inputEl] of Object.entries(inputs)) {
        setupConversionHandler(drug, unitName, inputEl, inputs, cfg);
    }
    calc_dl.appendChild(calc_dt);
    calc_dl.appendChild(calc_dd);
    
    const container = document.getElementById('container');
    container.appendChild(calc_dl);
}


function createUnitInputs(drug, units, block) {
    const inputs = {};
    for (const unit of Object.keys(units)) {
        inputs[unit] = createLabeledInput(drug, unit, block);
    }
    return inputs;
}


function createLabeledInput(drug, unit, block) {
    const wrapper = document.createElement('div');
    wrapper.className = 'unit-input';

    const label = document.createElement('label');
    label.className = 'med-label';
    label.textContent = unit.toString();
    label.setAttribute('for', `${drug}-${unit}`);

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `${drug}-${unit}`;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    block.appendChild(wrapper);

    return input;
}




function setupConversionHandler(drug, unitName, inputEl, inputs, cfg) {
    inputEl.addEventListener('input', () =>
        listening(drug, unitName, inputEl, inputs, cfg)
    );
}


function listening(drug, unitName, inputEl, inputs, cfg) {
    const val = parseFloat(inputEl.value);
    const fromRatio = cfg.conv[drug][unitName];
    for (const [targetUnit, targetEl] of Object.entries(inputs)) {
        if (targetUnit === unitName) {continue;}
        const toRatio = cfg.conv[drug][targetUnit];
        const converted = (val / fromRatio) * toRatio;
        targetEl.value = floatToStr(converted);
    }
}


function strToFloat(value) {
    const trimmed = value.trim();
    if (trimmed === "") {return 0.0;}
    return parseFloat(trimmed);
}
function floatToStr(value) {
    const rounded = Number.parseFloat(value.toPrecision(4));
    return rounded.toString();
}


function main() {
    addMetaAndLinkTags();
    loadConfigAndBuildUI().catch(console.error);
    addMetaAndLinkTags();
}


main();