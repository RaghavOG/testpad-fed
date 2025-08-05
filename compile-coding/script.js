const compileBtn = document.getElementById("compileBtn");
const codeEditor = document.getElementById("code");
const outputBox = document.getElementById("output");
const languageSelector = document.getElementById("language");

compileBtn.addEventListener("click", function () {
  const code = codeEditor.value;
  const langId = languageSelector.value;

  if (code.trim() === "") {
    outputBox.textContent = "Please enter some code to compile.";
    return;
  }

  outputBox.textContent = "Compiling... Please wait.";


  fetch("https://codequotient.com/api/executeCode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
      langId: langId,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      if (data.error) {
        outputBox.textContent = "Error: " + data.error;
      } else {
        const codeId = data.codeId;
        let intervalId = setInterval(() => {
          fetch(`https://codequotient.com/api/codeResult/${codeId}`)
            .then((res) => {
              if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
              }
              return res.json();
            })
            .then((resultData) => {
              if (resultData.data) {
                const parsed = JSON.parse(resultData.data);
                if (parsed.output) {
                  outputBox.textContent = "Output:\n" + parsed.output;
                } else if (parsed.errors) {
                  outputBox.textContent = "Error:\n" + parsed.errors;
                } else {
                  outputBox.textContent = "No output.";
                }
                clearInterval(intervalId);
              }
            })
            .catch((err) => {
              console.error("Error fetching result:", err);
              outputBox.textContent = "Error fetching result: " + err.message;
              clearInterval(intervalId);
            });
        }, 2000); // Check every 2 seconds
      }
    })
    .catch((err) => {
      console.error("Error details:", err);
      outputBox.textContent = "Failed to send code. Error: " + err.message + "\nPlease check your internet connection and try again.";
    });
});
