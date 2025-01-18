// // Select elements
// const tagInput = document.getElementById("tag-input");
// const addTagButton = document.getElementById("add-tag-button");
// const tagList = document.getElementById("tag-list");
// const findMatchButton = document.getElementById("find-match-button");
// let addedTags = [];

// // Function to add tag
// function addTag() {
//   const tagValue = tagInput.value.trim();
//   if (addedTags.includes(tagValue.toLowerCase())) {
//     alert("This tag has already been added!");
//     tagInput.value = ""; // Clear the input field
//     return;
//   }
//   addedTags.push(tagValue.toLowerCase());
//   if (tagValue) {
//     const tagDiv = document.createElement("div");
//     tagDiv.classList.add("tag");
//     tagDiv.textContent = tagValue;

//     // Append the new tag to the list
//     tagList.appendChild(tagDiv);

//     // Clear the input field
//     tagInput.value = "";

//     // Enable the "Find a Match" button
//     enableFindMatchButton();
//   }
// }

// // Function to enable "Find a Match" button if there is at least one tag
// function enableFindMatchButton() {
//   if (tagList.children.length > 0) {
//     findMatchButton.disabled = false; // Enable the button
//   }
// }

// // Event listener for the "+" button
// addTagButton.addEventListener("click", addTag);

// // Optional: Add tag on pressing 'Enter'
// tagInput.addEventListener("keypress", function (event) {
//   if (event.key === "Enter") {
//     addTag();
//   }
// });

// // Event listener for the "Find a Match" button
// findMatchButton.addEventListener("click", function () {
//   console.log("Find a match clicked!");
//   // Add functionality here (e.g., navigate to another page or perform matching logic)
// });
window.addEventListener("DOMContentLoaded", () => {
  // Retrieve the user's name from localStorage
  const userName = localStorage.getItem("userName");

  // If userName exists in localStorage, update the "welcome-message" element
  if (userName) {
    const welcomeMessageElement = document.getElementById("welcome-message");
    welcomeMessageElement.textContent = `Welcome, ${userName}!`;
  }
});
// // Get the input field and the dropdown
// // Get the input field and the dropdown
// const inputField = document.getElementById("tag-input");
// const tagSuggestions = document.getElementById("tag-suggestions");

// // The list of available tags
// const allTags = [
//   "Anxiety",
//   "Depression",
//   "Stress",
//   "Trauma",
//   "Relationship",
//   "Family",
//   "Career",
//   "School",
//   "Self-Esteem",
//   "Grief",
//   "Addiction",
//   "Eating Disorder",
//   "Abuse",
//   "Anger",
//   "Loneliness",
//   "Parenting",
//   "Divorce",
// ];

// // Listen for input in the text field
// inputField.addEventListener("input", function () {
//   const inputValue = inputField.value.toLowerCase(); // Get input and make it lowercase
//   const filteredTags = allTags.filter((tag) =>
//     tag.toLowerCase().startsWith(inputValue)
//   ); // Filter tags based on input

//   // Clear the current dropdown options
//   tagSuggestions.innerHTML = "";

//   if (inputValue.length > 0 && filteredTags.length > 0) {
//     // Show only matching options
//     filteredTags.forEach((tag) => {
//       const option = document.createElement("option");
//       option.value = tag.toLowerCase();
//       option.textContent = tag;
//       tagSuggestions.appendChild(option);
//     });
//     tagSuggestions.style.display = "block"; // Show the dropdown
//   } else {
//     tagSuggestions.style.display = "none"; // Hide if no match or input empty
//     const heading = (document.getElementById("no-tag-message").style.display =
//       "block");
//   }
// });
// tagSuggestions.addEventListener("change", () => {
//   const selectedOption = tagSuggestions.value;

//   if (selectedOption !== "") {
//     // Populate the input field with the selected option
//     tagInput.value = selectedOption;

//     // Hide the dropdown after a selection
//     tagSuggestions.style.visibility = "hidden";
//   }
// });

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
const addedTags = new Set(); // Use Set to prevent duplicates

// References to elements
const tagInput = document.getElementById("tag-input");
const tagSuggestions = document.getElementById("tag-suggestions");
const tagList = document.getElementById("tag-list");
const findMatchButton = document.getElementById("find-match-button");
const heading = document.getElementById("no-tag-message");
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
    tagSuggestions.style.visibility = "hidden";
  }
}

// Add tag function
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
  // Add remove button
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.textContent = "×";
  removeButton.onclick = () => removeTag(tagValue, tagDiv);
  tagDiv.appendChild(removeButton);

  // Append the tag and update the Set
  tagList.appendChild(tagDiv);
  addedTags.add(tagValue);

  // Clear input and refresh dropdown
  tagInput.value = "";
  showDropdown();

  // Enable "Find a Match" button
  enableFindMatchButton();
}
function removeTag(tagValue, tagElement) {
  // Remove tag from the Set
  addedTags.delete(tagValue);

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
    tagSuggestions.style.visibility = "hidden";
  }
});

// Event listener for "+" button
document.getElementById("add-tag-button").addEventListener("click", addTag);

// Initial setup
enableFindMatchButton();
