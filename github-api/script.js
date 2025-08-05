document.getElementById("submit").addEventListener("click", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const userInfoDiv = document.getElementById("user-info");
  const repoListDiv = document.getElementById("repo-list");

  if (username === "") {
    alert("Please enter a GitHub username.");
    return;
  }

  const userUrl = `https://api.github.com/users/${username}`;
  const repoUrl = `https://api.github.com/users/${username}/repos`;

  // Clear previous content
  userInfoDiv.innerHTML = "";
  repoListDiv.innerHTML = "";

  // Get User Info
  fetch(userUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("User not found.");
      }
      return response.json();
    })
    .then((userData) => {
      const userHTML = `
        <div class="user-header">
          <img src="${userData.avatar_url}" alt="Avatar" />
          <div>
            <h2>${userData.name} (<a href="${userData.html_url}" target="_blank">@${userData.login}</a>)</h2>
            <p>Followers: ${userData.followers} - Following: ${userData.following}</p>
            <p>Repos: ${userData.public_repos}</p>
          </div>
        </div>
        <h3>Repos List:</h3>
      `;
      userInfoDiv.innerHTML = userHTML;
    })
    .catch((err) => {
      userInfoDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
    });

  // Get Repos
  fetch(repoUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Repos not found.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        repoListDiv.innerHTML = "<p>No repositories found.</p>";
        return;
      }

      data.forEach((repo) => {
        const link = document.createElement("a");
        link.href = repo.html_url;
        link.target = "_blank";
        link.className = "repo-tag";
        link.textContent = repo.name;
        repoListDiv.appendChild(link);
      });
    })
    .catch((err) => {
      repoListDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
    });
});
