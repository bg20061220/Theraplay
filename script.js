window.addEventListener("DOMContentLoaded", () => {
  // Retrieve the user's name from localStorage
  const userName = localStorage.getItem("userName");
  // If userName exists in localStorage, update the "welcome-message" element
  if (userName) {
    const welcomeMessageElement = document.getElementById("welcome-message");
    welcomeMessageElement.textContent = `Welcome, ${userName}!`;
  }

  const storedTags = sessionStorage.getItem("tags");

  // If there are tags stored, parse and add them
  if (storedTags) {
    const parsedTags = JSON.parse(storedTags);

    // Loop through each tag and call addTag
    parsedTags.forEach((tag) => {
      addTags(tag);
    });
  }
  const profileName = localStorage.getItem("profileName");
  const bio = localStorage.getItem("bio-info");
  if (profileName) {
    document.getElementById("profileName").value = profileName;
  }
  if (bio) {
    document.getElementById("bio").textContent = bio;
  }
});
window.addEventListener("beforeunload", function (event) {
  localStorage.removeItem("profileName");
  localStorage.removeItem("bio-info");
});

const addedTags = new Set(); // Use Set to prevent duplicates

// Initialize variables
const suggestions = [
  "anxiety",
  "depression",
  "stress",
  "trauma",
  "relationship",
  "family",
  "career",
  "school",
  "self-esteem",
  "grief",
  "addiction",
  "eating-disorder",
  "abuse",
  "anger",
  "loneliness",
  "parenting",
  "divorce",
  "marriage",
];

// References to elements
const tagInput = document.getElementById("tag-input");
const tagSuggestions = document.getElementById("tag-suggestions");
const tagList = document.getElementById("tag-list");
const findMatchButton = document.getElementById("find-match-button");
const heading = document.getElementById("no-tag-message");
findMatchButton.onclick = function () {
  const profileNameField = document.getElementById("profileName");
  // Get the value (text) entered in the input field
  const profileNameValue = profileNameField.value;
  const bioField = document.getElementById("bio");
  // Get the value (text) entered in the textarea
  const bioValue = bioField.value;

  localStorage.setItem("profileName", profileNameValue);
  localStorage.setItem("bio-info", bioValue);

  window.location.href = "home.html";
};
// Enable "Find a Match" button if at least one tag exists
function enableFindMatchButton() {
  findMatchButton.disabled = addedTags.size === 0;
}

// Function to show dropdown suggestions
function showDropdown() {
  const inputValue = tagInput.value.toLowerCase();

  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter((tag) =>
    tag.startsWith(inputValue)
  );

  if (filteredSuggestions.length > 0) {
    tagSuggestions.innerHTML = filteredSuggestions
      .map((tag) => `<option value="${tag}">${tag}</option>`)
      .join("");
    tagSuggestions.style.visibility = "visible";
  } else if (inputValue) {
    tagSuggestions.innerHTML = `<option value="">Make a new tag</option>`;
    tagSuggestions.style.visibility = "visible";
  } else {
    tagSuggestions.style.visibility = "visible";
  }
}

// Add tag function
document.getElementById("add-tag-button").addEventListener("click", addTag);

function addTag() {
  const tagValue = tagInput.value.trim().toLowerCase();

  if (!tagValue) return;

  if (addedTags.has(tagValue)) {
    alert("This tag has already been added!");
    return;
  }

  // Add tag to the list
  const tagDiv = document.createElement("div");
  tagDiv.classList.add("tag");
  tagDiv.textContent = `#${tagValue}`;

  // Append the tag and update the Set
  tagList.appendChild(tagDiv);
  addedTags.add(tagValue);
  sessionStorage.setItem("tags", JSON.stringify([...addedTags]));
  // Clear input and refresh dropdown
  tagInput.value = "";
  showDropdown();

  // Enable "Find a Match" button
  enableFindMatchButton();
}
function removeTag(tagValue, tagElement) {
  // Remove tag from the Set
  addedTags.delete(tagValue);
  sessionStorage.setItem("tags", JSON.stringify([...addedTags]));

  // Remove tag element from the DOM
  tagList.removeChild(tagElement);

  // Refresh dropdown and button state
  showDropdown();
  enableFindMatchButton();
}

// Event listener for input changes to show dropdown
tagInput.addEventListener("input", showDropdown);

// Event listener for dropdown changes
tagSuggestions.addEventListener("change", () => {
  const selectedOption = tagSuggestions.value;

  if (selectedOption !== "") {
    tagInput.value = selectedOption;
    tagSuggestions.style.visibility = "visible";
  }
});

// Event listener for "+" button

// Initial setup
enableFindMatchButton();
function addTags(tagValue) {
  if (!tagValue) return;

  if (addedTags.has(tagValue)) {
    alert("This tag has already been added!");
    return;
  }

  // Add tag to the list
  const tagDiv = document.createElement("div");
  tagDiv.classList.add("tag");
  tagDiv.textContent = `#${tagValue}`;
  // Add remove button

  // Append the tag and update the Set
  tagList.appendChild(tagDiv);
  addedTags.add(tagValue);
  sessionStorage.setItem("tags", JSON.stringify([...addedTags]));
  // Clear input and refresh dropdown
  tagInput.value = "";
  showDropdown();

  // Enable "Find a Match" button
  enableFindMatchButton();
}
