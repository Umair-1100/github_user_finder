document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) window.lucide.createIcons();

  // start DOM selection
  const form = document.querySelector(".github-user-form");

  const searchBox = document.querySelector(".search-box");
  const emptyPlaceholder = document.querySelector(".empty-placeholder");
  const errorState = document.querySelector(".error-state");
  const loadingContainer = document.querySelector(".loading");
  const detailsSection = document.querySelector(".details");

  const usernameInput = document.querySelector("#usernameInput");
  const profileImg = document.querySelector(".profile-img img");
  const uiUsername = document.querySelector(".uiUsername");
  const joinDate = document.querySelector(".joining_date");
  const usernameLogin = document.querySelector(".username_login");
  const userBio = document.querySelector(".user_bio");
  const userRepos = document.querySelector(".repos");
  const userFollowers = document.querySelector(".followers");
  const userFollowing = document.querySelector(".following");
  const userLocation = document.querySelector(".location");
  const userCompany = document.querySelector(".company");
  const userBlog = document.querySelector(".link_href");
  const userBlogText = document.querySelector(".link_href span");
  const userType = document.querySelector(".user_type");
  // end DOM selection

  const fetchGitHubUser = async (username) => {
    if (!username) {
      searchBox.classList.add("invalid");
      usernameInput.focus();
      return;
    }

    hideError();
    hideEmptyState();
    hideProfile();
    showLoading();
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);

      if (!res.ok) {
        console.log(res);
        showError(res.status,  res.status === 404 ? "User Not Found" : "API Response error");
        return;
      }

      const data = await res.json();
      searchBox.classList.remove("invalid");
      renderProfile(data);
      showProfile();
    } catch (error) {
      hideProfile();
      hideEmptyState();
      showError("Network", "Please check your internet connection.");
      console.error(error.message);
    } finally {
      hideLoading();
    }
  };

  function renderProfile(data) {
    console.log(data);
    const {
      avatar_url,
      name,
      html_url,
      created_at,
      login,
      bio,
      public_repos,
      followers,
      following,
      location,
      blog,
      company,
      type,
    } = data;
    profileImg.src = avatar_url || "./images/avatar.png";
    uiUsername.innerText = fallback(name);
    uiUsername.href = fallback(html_url);
    joinDate.innerText = fallback(formattedDate(created_at));
    usernameLogin.innerText = `@${fallback(login)}`;
    userBio.innerText = fallback(bio);
    userRepos.innerText = fallback(public_repos);
    userFollowers.innerText = fallback(followers);
    userFollowing.innerText = fallback(following);
    userLocation.innerText = fallback(location);
    if (blog) {
      userBlog.href = blog;
      userBlogText.innerText = blog;
    } else {
      userBlog.removeAttribute("href");
      userBlogText.innerText = "Not available";
    }
    userCompany.innerText = fallback(company);
    userType.innerText = fallback(type);
  }

  function formattedDate(date) {
    let createdDate = new Date(date);
    let formatDate = Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(createdDate);

    return formatDate;
  }

  function fallback(value) {
    return value ?? "Not available";
  }

  function hideEmptyState() {
    return (emptyPlaceholder.style.display = "none");
  }

  function showProfile() {
    return (detailsSection.style.display = "block");
  }

  function hideProfile() {
    return (detailsSection.style.display = "none");
  }

  function showError(status, message) {
    errorState.style.display = "flex";
    errorState.innerHTML = `
    <h3>${status} | ${message}</h3>
  `;
  }

  function hideError() {
    return (errorState.style.display = "none");
  }

  function showLoading() {
    return (loadingContainer.style.display = "flex");
  }

  function hideLoading() {
    return (loadingContainer.style.display = "none");
  }

  usernameInput.addEventListener("input", () => {
    searchBox.classList.remove("invalid");
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let value = usernameInput.value;
    fetchGitHubUser(value.trim());
  });
});
