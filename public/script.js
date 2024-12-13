let isChordPlaying = false;

fetch("/chords")
    .then((response) => response.json())
    .then((chords) => {
        const tableBody = document.querySelector("#chordTable tbody");

        chords.forEach((chord) => {
            const row = document.createElement("tr");

            // Major Chords: Name
            const majorNameCell = document.createElement("td");
            majorNameCell.textContent = chord.majorName || "";
            row.appendChild(majorNameCell);

            // Major Chords: Notes
            const majorNotesCell = document.createElement("td");
            majorNotesCell.textContent = chord.majorNotes.join(", ");
            row.appendChild(majorNotesCell);

            // Details
            const detailsCell = document.createElement("td");
            detailsCell.textContent = chord.details || "";
            row.appendChild(detailsCell);

            // Minor Chords: Name
            const minorNameCell = document.createElement("td");
            minorNameCell.textContent = chord.minorName || "";
            row.appendChild(minorNameCell);

            // Minor Chords: Notes
            const minorNotesCell = document.createElement("td");
            minorNotesCell.textContent = chord.minorNotes.join(", ");
            row.appendChild(minorNotesCell);

            // Play Button
            const playCell = document.createElement("td");
            const playButton = document.createElement("button");
            playButton.textContent = "Play";
            // playButton.addEventListener("click", () => {
            //     if (!isChordPlaying) {
            //         isChordPlaying = true;
            //         playSound(chord.audio, () => {
            //             isChordPlaying = false;
            //         });
            //     }
            // });
            playCell.appendChild(playButton);
            row.appendChild(playCell);

            // Highlight on hover
            row.addEventListener("mouseover", () => row.classList.add("highlight"));
            row.addEventListener("mouseout", () => row.classList.remove("highlight"));
            row.addEventListener("click", () => {
                if (!isChordPlaying) {
                    isChordPlaying = true;
                    playSound(chord.audio, () => {
                        isChordPlaying = false;
                    });
                }
            });

            tableBody.appendChild(row);
        });
    });

function playSound(audioPath, callback) {
    const audio = new Audio(audioPath);
    audio.play();
    audio.addEventListener("ended", callback); // Reset after playing
}
