"use strict";

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

headerPlusIcon.style.visibility = "hidden";

// Load notes from local storage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const note = JSON.parse(localStorage.getItem(key));
  const noteDiv = document.createElement("div");
  noteDiv.classList.add("note");
  const noteTitleDiv = document.createElement("p");
  const dateStamp = note.dateStamp;
  noteDiv.setAttribute("data-date", dateStamp);

  noteDiv.addEventListener("click", (e) => {
    const clickedNote = e.currentTarget;
    const clickedNoteDate = clickedNote.getAttribute("data-date");
    const clickedNoteTitle =
      clickedNote.querySelector(".note-title").textContent;
    const clickedNoteContent = JSON.parse(
      localStorage.getItem(clickedNoteDate)
    ).content;

    noteDisplayTitle.textContent = clickedNoteTitle;
    noteDisplayBody.textContent = clickedNoteContent;

    headerPlusIcon.style.visibility = "visible";
    noteDisplayContainer.style.display = "block";
    noteDisplayBody.style.display = "block";
    emptyRightSide.style.display = "none";

    // Highlight the clicked note
    const notes = document.querySelectorAll(".note");
    notes.forEach((note) => {
      note.classList.remove("active");
    });
    clickedNote.classList.add("active");
  });

  noteTitleDiv.classList.add("note-title");
  noteTitleDiv.textContent = note.title;
  noteDiv.appendChild(noteTitleDiv);
  notesBody.appendChild(noteDiv);
}

// Center the div initially
const mydiv = document.getElementById("draggable-div");
mydiv.style.top = `${(window.innerHeight - mydiv.offsetHeight) / 2}px`;
mydiv.style.left = `${(window.innerWidth - mydiv.offsetWidth) / 2}px`;

// Make the DIV element draggable:
dragElement(mydiv);

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "-header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // calculate the new position
    var newTop = elmnt.offsetTop - pos2;
    var newLeft = elmnt.offsetLeft - pos1;

    // boundary checks
    if (newTop < 0) {
      newTop = 0;
    } else if (newTop + elmnt.offsetHeight > window.innerHeight) {
      newTop = window.innerHeight - elmnt.offsetHeight;
    }

    if (newLeft < 0) {
      newLeft = 0;
    } else if (newLeft + elmnt.offsetWidth > window.innerWidth) {
      newLeft = window.innerWidth - elmnt.offsetWidth;
    }

    // set the element's new position:
    elmnt.style.top = newTop + "px";
    elmnt.style.left = newLeft + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Event listeners
closeButton.addEventListener("click", () => {
  localStorage.clear();
  window.location.reload();
});

centerPlusIcon.addEventListener("click", () => {
  form.style.display = "block";
  emptyRightSide.style.display = "none";
});

headerPlusIcon.addEventListener("click", () => {
  form.style.display = "block";
  emptyRightSide.style.display = "none";
  noteDisplayContainer.style.display = "none";
  headerPlusIcon.style.visibility = "hidden";
});

saveButton.addEventListener("click", () => {
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

  // Display note on the page
  const noteDiv = document.createElement("div");
  noteDiv.classList.add("note");
  const noteTitleDiv = document.createElement("p");
  noteTitleDiv.classList.add("note-title");
  noteTitleDiv.textContent = noteTitle;

  // Add data attribute to the note div
  noteDiv.setAttribute("data-date", dateStamp);

  // Append note to the page
  noteDiv.appendChild(noteTitleDiv);
  notesBody.appendChild(noteDiv);

  headerPlusIcon.style.visibility = "hidden";
  HideForm();
  ClearFormInputs();
});

cancelButton.addEventListener("click", () => {
  headerPlusIcon.style.visibility = "hidden";
  HideForm();
  ClearFormInputs();
});

function HideForm() {
  form.style.display = "none";
  emptyRightSide.style.display = "block";
}

function ClearFormInputs() {
  document.querySelector("#note-title").value = "";
  document.querySelector("#note-content").value = "";
}
