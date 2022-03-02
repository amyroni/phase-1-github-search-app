let searchKeyword = true;


document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form")
  const btn = document.createElement("button");
  btn.textContent = "Switch to repo search"
  btn.type = "button"
  btn.addEventListener("click", () => {
    if (searchKeyword) {
      btn.textContent = "Switch to keyword search";
      searchKeyword = !searchKeyword
    }
    else {
      btn.textContent = "Switch to repo search";
      searchKeyword = !searchKeyword
    }
  }) 
  form.append(btn);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (searchKeyword) {
      loadUsers(event.target.search.value);
    } else {
      searchRepos(event.target.search.value);
    }
    form.reset();
  }) 
})

function loadUsers(user) {
  fetch(`https://api.github.com/search/users?q=${user}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json"
    }
  })
  .then(response => response.json())
  .then(users => {
    document.querySelector("#repos-list").querySelectorAll("li").forEach(item => item.remove());
    users.items.forEach(user => displayUser(user))
  })
}

function displayUser(user) {
  const container = document.createElement("div");
  container.className = "container";
  const username = document.createElement("li");
  username.textContent = `Username: ${user.login}`;
  username.style.cursor = "pointer";
  username.addEventListener("click", () => fetchRepos(user.login))

  const avatarLi =  document.createElement("li");
  const avatar = document.createElement("img");
  avatar.src = user.avatar_url;
  avatarLi.appendChild(avatar);
  const linkLi = document.createElement("li");
  const profileLink = document.createElement("a");
  profileLink.href = user.html_url;
  profileLink.textContent = "Profile";
  linkLi.append(profileLink);
  container.append(username, avatarLi, linkLi)
  document.querySelector("#user-list").append(container);
}

function searchRepos(repo) {
  fetch(`https://api.github.com/search/repositories?q=${repo}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json"
    }
  })
  .then(response => response.json())
  .then(repos => repos.items.forEach(repo => displayRepo(repo)))
}

function fetchRepos(username) {
  fetch(`https://api.github.com/users/${username}/repos`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json"
    }
  })
  .then(response => response.json())
  .then(repos => {
    document.querySelector("#repos-list").querySelectorAll("li").forEach(item => item.remove());
    repos.forEach(repo => displayRepo(repo))
  })
}

function displayRepo(repo) {
  const li = document.createElement("li");
  li.textContent = repo.name;
  document.querySelector("#repos-list").append(li);
}

