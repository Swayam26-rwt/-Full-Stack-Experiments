const API = "/api";

const contentInput = document.getElementById("content");
const count = document.getElementById("count");

contentInput.addEventListener("input", () => {
  count.textContent = contentInput.value.length;
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(API + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

async function checkApi() {
  const status = document.getElementById("apiStatus");

  try {
    await apiRequest("/health");
    status.textContent = "● API Online";
    status.classList.add("online");
  } catch {
    status.textContent = "● API Offline";
  }
}

async function loadPosts() {
  const container = document.getElementById("posts");

  try {
    const result = await apiRequest("/posts");

    if (result.data.length === 0) {
      container.innerHTML =
        '<div class="empty">No posts yet. Create one above.</div>';
      return;
    }

    container.innerHTML = result.data.map(post => `
      <div class="post">
        <p class="post-content">${escapeHtml(post.content)}</p>
        <div class="meta">
          ID: ${post.id} · Created: ${formatDate(post.createdAt)}
        </div>
        <div class="post-actions">
          <button onclick="editPost(${post.id})">Edit</button>
          <button class="secondary" onclick="deletePost(${post.id})">
            Delete
          </button>
        </div>
      </div>
    `).join("");
  } catch (error) {
    container.innerHTML =
      `<div class="empty">${escapeHtml(error.message)}</div>`;
  }
}

async function savePost() {
  const content = contentInput.value.trim();
  const postId = document.getElementById("postId").value;

  if (!content) {
    showToast("Content cannot be empty");
    return;
  }

  try {
    const url = postId ? `/posts/${postId}` : "/posts";
    const method = postId ? "PUT" : "POST";

    await apiRequest(url, {
      method,
      body: JSON.stringify({ content })
    });

    showToast(postId ? "Post updated" : "Post created");
    clearForm();
    await loadPosts();
  } catch (error) {
    showToast(error.message);
  }
}

async function editPost(id) {
  try {
    const result = await apiRequest(`/posts/${id}`);

    document.getElementById("postId").value = result.data.id;
    contentInput.value = result.data.content;
    count.textContent = result.data.content.length;

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    showToast(error.message);
  }
}

async function deletePost(id) {
  if (!confirm(`Delete post ${id}?`)) return;

  try {
    await apiRequest(`/posts/${id}`, {
      method: "DELETE"
    });

    showToast("Post deleted");
    await loadPosts();
  } catch (error) {
    showToast(error.message);
  }
}

function clearForm() {
  document.getElementById("postId").value = "";
  contentInput.value = "";
  count.textContent = "0";
}

async function scheduleTask() {
  const task = document.getElementById("task").value.trim();
  const delaySeconds = Number(
    document.getElementById("delay").value
  );

  if (!task) {
    showToast("Task cannot be empty");
    return;
  }

  try {
    const result = await apiRequest("/schedule", {
      method: "POST",
      body: JSON.stringify({
        task,
        delaySeconds
      })
    });

    const data = result.data;
    const box = document.getElementById("scheduleResult");

    box.style.display = "block";
    box.innerHTML = `
      <strong>Task scheduled successfully.</strong><br>
      ID: ${escapeHtml(data.scheduleId)}<br>
      Scheduled for: ${formatDate(data.scheduledFor)}
    `;

    showToast("Task scheduled");
  } catch (error) {
    showToast(error.message);
  }
}

function formatDate(value) {
  return new Date(value).toLocaleString();
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

checkApi();
loadPosts();
