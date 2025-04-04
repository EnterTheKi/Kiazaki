document.addEventListener("DOMContentLoaded", () => {
    // Search Functionality
    const searchExpand = document.querySelector(".search-expand");
    const search = document.querySelector(".search");
    const searchForm = document.querySelector(".search-form");

    searchExpand.addEventListener("click", () => {
        search.classList.toggle("focused");
        if (search.classList.contains("focused")) {
            searchForm.querySelector("input").focus();
        }
    });

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchForm.querySelector("input").value;
        alert(`Searching for: ${query}`);
        // Add actual search logic here (e.g., filter posts)
    });

    // Sidebar Toggle
    const hamburger = document.querySelector(".hamburger-menu");
    const sidebar = document.querySelector(".sidebar");
    const sidebarBack = document.querySelector(".sidebar-back");

    hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar-invisible");
        document.body.classList.toggle("sidebar-visible");
    });

    sidebarBack.addEventListener("click", () => {
        sidebar.classList.add("sidebar-invisible");
        document.body.classList.remove("sidebar-visible");
    });

    // Share Button
    document.querySelectorAll(".sharing-button").forEach(button => {
        button.addEventListener("click", () => {
            const shareMenu = button.nextElementSibling;
            shareMenu.classList.toggle("hidden");
        });
    });

    // Ripple Effect
    document.querySelectorAll(".ripple").forEach(element => {
        element.addEventListener("click", (e) => {
            const splash = document.createElement("span");
            splash.classList.add("splash");
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            splash.style.width = splash.style.height = `${size}px`;
            splash.style.left = `${e.clientX - rect.left - size / 2}px`;
            splash.style.top = `${e.clientY - rect.top - size / 2}px`;
            element.appendChild(splash);
            splash.classList.add("animate");
            setTimeout(() => splash.remove(), 400);
        });
    });
});
