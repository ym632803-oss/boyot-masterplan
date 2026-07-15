// =======================================
// Beyout New Mansoura
// Version : 1.1 Sales Release
// Developer : Youseef Mohamed
// =======================================

// =========================
// Elements
// =========================

const popup = document.getElementById("popup");
const closeBtn = document.getElementById("close");
const openDrive = document.getElementById("openDrive");
const buildingName = document.getElementById("buildingName");
const searchBuilding = document.getElementById("searchBuilding");

// =========================
// Open Popup
// =========================

function showBuilding(id) {

    const building = buildings[id];

    if (!building) {
        alert("Building not found: " + id);
        return;
    }

    buildingName.innerText = building.name;

    openDrive.onclick = function () {
        window.open(building.drive, "_blank");
    };

    popup.style.display = "block";
}

// =========================
// Close Popup
// =========================

closeBtn.onclick = function () {

    popup.style.display = "none";

};

// =========================
// Click Buildings
// =========================

document.querySelectorAll(".building").forEach(function (box) {

    box.onclick = function () {

        const building = buildings[this.id];

        if (!building) {
            alert("Building not found");
            return;
        }

        buildingName.innerText = building.name;

        openDrive.onclick = function () {
            window.open(building.drive, "_blank");
        };

        popup.style.display = "block";

    };

});

// =========================
// Tooltip
// =========================

const tooltip = document.getElementById("tooltip");

document.querySelectorAll(".building").forEach(function(box){

    box.addEventListener("mouseenter", function(){

        tooltip.style.display = "block";

        if(buildings[this.id]){
            tooltip.innerText = buildings[this.id].name;
        }else{
            tooltip.innerText = this.id;
        }

    });

    box.addEventListener("mousemove", function(e){

        tooltip.style.left = (e.pageX + 15) + "px";
        tooltip.style.top  = (e.pageY - 35) + "px";

    });

    box.addEventListener("mouseleave", function(){

        tooltip.style.display = "none";

    });

});

// =========================
// Search Building
// =========================

searchBuilding.addEventListener("keydown", function(e){

    if(e.key !== "Enter") return;

    const id = this.value.trim().toUpperCase();

    const building = buildings[id];
    const box = document.getElementById(id);

    if(box){

        box.classList.add("highlight");

        setTimeout(function(){

            box.classList.remove("highlight");

        },2000);

    }

    if(!building){

        alert("Building not found!");

        return;

    }

    buildingName.innerText = building.name;

    openDrive.onclick = function(){

        window.open(building.drive,"_blank");

    };

    popup.style.display = "block";

    this.value = "";

});

// =========================
// Keyboard Shortcuts
// =========================

document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        popup.style.display = "none";

    }

});

// =========================
// Loading Screen
// =========================

window.addEventListener("load", function () {

    const loading = document.getElementById("loadingScreen");

    setTimeout(function () {

        loading.style.opacity = "0";

        setTimeout(function () {

            loading.style.display = "none";

        },600);

    },800);

});