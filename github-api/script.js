document.getElementById("githubForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Loading...";

  fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .then(user => {
      if (user.message === "Not Found") {
        resultDiv.innerHTML = `<p>User not found</p>`;
        return;
      }

      return fetch(user.repos_url)
        .then(response => response.json())
        .then(repos => {
          let output = `
            <h3>${user.name} (<a href="${user.html_url}" target="_blank">@${user.login}</a>)</h3>
            <img src="${user.avatar_url}" width="100" />
            <p>Followers: ${user.followers} - Following: ${user.following}</p>
            <p>Repos: ${user.public_repos}</p>
            <h4>Repos List:</h4>
          `;

          repos.forEach(repo => {
            output += `<a href="${repo.html_url}" class="repo" target="_blank">${repo.name}</a>`;
          });

          resultDiv.innerHTML = output;
        });
    })
    .catch(error => {
      resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
});
