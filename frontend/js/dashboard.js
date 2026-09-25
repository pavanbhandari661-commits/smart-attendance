const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

if (!token || !userData) {
    window.location.href = "login.html";
}

const user = JSON.parse(userData);

const userName = document.getElementById("userName");
const userRole = document.getElementById("userRole");
const userAvatar = document.querySelector(".user-avatar");

if (userName) {
    userName.textContent = user.name;
}

if (userRole) {
    userRole.textContent = user.role;
}

if (userAvatar) {
    userAvatar.textContent = user.name.charAt(0).toUpperCase();
}

const setupRoleBasedNavigation = () => {
    const role = user.role;

    const classesNav = document.getElementById("classesNav");
    const subjectsNav = document.getElementById("subjectsNav");
    const studentsNav = document.getElementById("studentsNav");
    const attendanceNav = document.getElementById("attendanceNav");
    const reportsNav = document.getElementById("reportsNav");

    if (role === "student") {
        classesNav.style.display = "none";
        subjectsNav.style.display = "none";
        studentsNav.style.display = "none";
        attendanceNav.textContent = "My Attendance";
    }
};

const loadDashboardStats = async () => {
    try {
        const data = await apiRequest("/dashboard/stats");

        document.getElementById("totalClasses").textContent =
            data.stats.totalClasses;

        document.getElementById("totalStudents").textContent =
            data.stats.totalStudents;

        document.getElementById("todaySessions").textContent =
            data.stats.todaySessions;

        document.getElementById("attendanceRate").textContent =
            `${data.stats.attendanceRate}%`;
    } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
    }
};

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
});

setupRoleBasedNavigation();
loadDashboardStats();