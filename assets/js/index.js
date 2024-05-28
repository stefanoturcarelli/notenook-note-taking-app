"use strict";

import dragElement from "./draggable-div.js";

console.log(localStorage);

// DOM elements
const centerPlusIcon = document.querySelector("#center-plus-icon");
const headerPlusIcon = document.querySelector("#header-plus-icon");
const form = document.querySelector("#form-container");
const saveButton = document.querySelector("#save-button");
const cancelButton = document.querySelector("#cancel-button");
const notesBody = document.querySelector(".notes-list-body");
const closeButton = document.querySelector("#close");
const emptyRightSide = document.querySelector(".empty-right-side");
const noteDisplayTitle = document.querySelector("#note-display-title");
const noteDisplayBody = document.querySelector(".note-display-body");
const noteDisplayContainer = document.querySelector(".note-display-container");
const noteDisplayDate = document.querySelector("#note-display-date");

// Functions

function CreateNoteElement(note) {
  // Create note div
  const noteDiv = document.createElement("div");
  noteDiv.classList.add("note");
  noteDiv.setAttribute("data-date", note.dateStamp);

  // Create note title
  const noteTitleDiv = document.createElement("p");
  noteTitleDiv.classList.add("note-title");
  noteTitleDiv.textContent = note.title;
  noteDiv.appendChild(noteTitleDiv);

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "x";
  deleteButton.classList.add("delete-button");
  noteDiv.appendChild(deleteButton);

  // Add event listeners
  noteDiv.addEventListener("click", CreateNewNote);
  deleteButton.addEventListener("click", DeleteANote);

  return noteDiv;
}

function HideForm() {
  form.style.display = "none";
  emptyRightSide.style.display = "block";
}

function ClearFormInputs() {
  document.querySelector("#note-title").value = "";
  document.querySelector("#note-content").value = "";
}

function CreateNewNote(e) {
  if (e.target.classList.contains("delete-button")) {
    // If the click event is on the delete button, do nothing here
    return;
  }

  // Get the clicked note element
  const clickedNote = e.currentTarget;

  // Get the data-date attribute of the clicked note
  const clickedNoteDate = clickedNote.getAttribute("data-date");

  // Get the title of the clicked note from its child element
  const clickedNoteTitle = clickedNote.querySelector(".note-title").textContent;

  // Get the content of the clicked note from local storage using the data-date
  const clickedNoteContent = JSON.parse(
    localStorage.getItem(clickedNoteDate)
  ).content;

  // Display the note title and content in the note display area
  noteDisplayTitle.textContent = clickedNoteTitle;
  noteDisplayBody.textContent = clickedNoteContent;
  noteDisplayDate.textContent =
    new Date(parseInt(clickedNoteDate)).toDateString() +
    " - " +
    new Date(parseInt(clickedNoteDate)).toLocaleTimeString();

  // Show the header plus icon and the note display container
  headerPlusIcon.style.visibility = "visible";
  noteDisplayContainer.style.display = "block";
  noteDisplayBody.style.display = "block";
  emptyRightSide.style.display = "none";

  // Highlight the clicked note
  const allNotes = document.querySelectorAll(".note");
  allNotes.forEach(function (note) {
    note.classList.remove("active");
  });

  // Add the 'active' class to the clicked note
  clickedNote.classList.add("active");
}

function DeleteANote(e) {
  e.stopPropagation(); // Prevent the note click event from firing

  const noteDiv = e.currentTarget.parentElement;
  const noteDate = noteDiv.getAttribute("data-date");

  // Remove the note from local storage
  localStorage.removeItem(noteDate);

  // Remove the note from the DOM
  notesBody.removeChild(noteDiv);

  // Clear the note display area if the deleted note was displayed
  if (
    noteDisplayTitle.textContent ===
    noteDiv.querySelector(".note-title").textContent
  ) {
    noteDisplayTitle.textContent = "";
    noteDisplayBody.textContent = "";
    noteDisplayContainer.style.display = "none";
    headerPlusIcon.style.visibility = "hidden";
    emptyRightSide.style.display = "block";
  }
}

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const note = JSON.parse(localStorage.getItem(key));
  const noteDiv = CreateNoteElement(note);
  notesBody.appendChild(noteDiv);
}

// Event listeners

closeButton.addEventListener("click", function () {
  localStorage.clear();
  window.location.reload();
});

centerPlusIcon.addEventListener("click", function () {
  form.style.display = "block";
  emptyRightSide.style.display = "none";
});

headerPlusIcon.addEventListener("click", function () {
  form.style.display = "block";
  emptyRightSide.style.display = "none";
  noteDisplayContainer.style.display = "none";
  headerPlusIcon.style.visibility = "hidden";
});

saveButton.addEventListener("click", function () {
  // Save note to local storage
  const dateStamp = new Date().getTime();
  const noteTitle = document.querySelector("#note-title").value.trim();
  const noteContent = document.querySelector("#note-content").value.trim();

  const note = {
    title: noteTitle,
    content: noteContent,
    dateStamp: dateStamp,
  };

  // Validate note
  if (!noteTitle || !noteContent) {
    // Focus on the empty field
    if (!noteTitle) {
      document.querySelector("#note-title").focus();
    } else {
      document.querySelector("#note-content").focus();
    }
    return;
  }

  localStorage.setItem(dateStamp, JSON.stringify(note));

  // Create and display the new note
  const noteDiv = CreateNoteElement(note);
  notesBody.appendChild(noteDiv);

  headerPlusIcon.style.visibility = "hidden";
  HideForm();
  ClearFormInputs();
});

cancelButton.addEventListener("click", function () {
  headerPlusIcon.style.visibility = "hidden";
  HideForm();
  ClearFormInputs();
});
