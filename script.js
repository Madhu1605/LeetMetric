document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const statsCard = document.querySelector(".stats-card");

    const easyCircle = document.querySelector(".easy-progress");
    const mediumCircle = document.querySelector(".medium-progress");
    const hardCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    function validateUsername(username){
        return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
    }

    async function fetchUserDetails(username){
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            if(!res.ok) throw new Error();

            const data = await res.json();
            displayUserData(data);

        }catch{
            statsContainer.style.display = "block";
            statsContainer.innerHTML = "<p>User not found</p>";
        }finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function displayUserData(data){

        statsContainer.style.display = "block";

        const easyPercent = (data.easySolved / data.totalEasy) * 100;
        const mediumPercent = (data.mediumSolved / data.totalMedium) * 100;
        const hardPercent = (data.hardSolved / data.totalHard) * 100;

        easyCircle.style.setProperty("--progress-degree", `${easyPercent}%`);
        mediumCircle.style.setProperty("--progress-degree", `${mediumPercent}%`);
        hardCircle.style.setProperty("--progress-degree", `${hardPercent}%`);

        easyLabel.textContent = `${data.easySolved}/${data.totalEasy}`;
        mediumLabel.textContent = `${data.mediumSolved}/${data.totalMedium}`;
        hardLabel.textContent = `${data.hardSolved}/${data.totalHard}`;

        statsCard.innerHTML = `
            <div class="stat-box">
                <h3>Total Solved</h3>
                <p>${data.totalSolved}</p>
            </div>
            <div class="stat-box">
                <h3>Acceptance Rate</h3>
                <p>${data.acceptanceRate}%</p>
            </div>
            <div class="stat-box">
                <h3>Ranking</h3>
                <p>${data.ranking}</p>
            </div>
            <div class="stat-box">
                <h3>Contribution</h3>
                <p>${data.contributionPoints}</p>
            </div>
        `;
    }

    searchButton.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if(validateUsername(username)){
            fetchUserDetails(username);
        }else{
            alert("Invalid username");
        }
    });

    usernameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});


});
