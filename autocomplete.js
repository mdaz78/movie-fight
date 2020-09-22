"use strict";

const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchResponse,
}) => {
  root.innerHTML = `
    <label class="bold">Search</label>
    <input class="input" />
    <div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
    </div>
  `;

  const input = root.querySelector(".input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    const searchTerm = event.target.value;
    const items = await fetchResponse(searchTerm);

    if (items.length === 0) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");

    items.forEach((item) => {
      const option = document.createElement("a");
      option.innerHTML = renderOption(item);
      option.classList.add("dropdown-item");

      option.addEventListener("click", () => {
        dropdown.classList.add("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });

      resultsWrapper.append(option);
    });
  };

  input.addEventListener("input", debounce(onInput, 500));

  // TODO: Re think the logic to hide the dropdown
  document.addEventListener("click", (event) => {
    if (!root.contains(event.target.value)) {
      dropdown.classList.remove("is-active");
    }
  });
};
