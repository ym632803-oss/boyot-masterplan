// =======================================
// Beyout New Mansoura
// Version : 2.0
// =======================================

// =========================
// Elements
// =========================

const popup = document.getElementById("popup");
const closeBtn = document.getElementById("close");
const openDrive = document.getElementById("openDrive");
const buildingName = document.getElementById("buildingName");
const searchBuilding = document.getElementById("searchBuilding");
const searchResults = document.getElementById("searchResults");
const tooltip = document.getElementById("tooltip");
const availableUnits = document.getElementById("availableUnits");

// =========================
// Data
// =========================

let availability = [];
let currentBuilding = null;

// =========================
// Buildings Status
// =========================

function updateBuildingsStatus(){

    document.querySelectorAll(".building").forEach(function(box){

        const buildingCode =
        "BM-" + box.id.substring(1).padStart(2,"0");

        const hasUnits = availability.some(function(item){

            return item.unit.startsWith(buildingCode);

        });

        if(hasUnits){

            box.classList.add("available");

        }else{

            box.classList.remove("available");

        }

    });

}
// =========================
// Load Availability
// =========================

async function loadAvailability(){

    try{

        const response = await fetch("availability.json");

        availability = await response.json();

        console.log("Availability Loaded");

        updateBuildingsStatus();

        if(currentBuilding){
            showBuilding(currentBuilding,false);
        }

    }catch(error){

        console.error(error);

    }

}


// =========================
// Show Building
// =========================

function showBuilding(id,openPopup=true){

    currentBuilding=id;

    const building=buildings[id];

    if(!building) return;

    buildingName.innerText=building.name;

    const buildingCode=
    "BM-"+id.substring(1).padStart(2,"0");

    const units=availability.filter(function(item){

        return item.unit.startsWith(buildingCode);

    });

    availableUnits.innerHTML=
    "<h3>Available Units ("+units.length+")</h3>";

    if(units.length===0){

        availableUnits.innerHTML+="<p>No Available Units</p>";

    }else{

        units.forEach(function(item){

            availableUnits.innerHTML += `

             <div class="unit-number">
                 🏠 ${item.unit}
             </div>

            <div class="unit-status">
                 🟢 Available
              </div>

            </div>

            `;

        });

    }

    openDrive.onclick=function(){

        window.open(building.drive,"_blank");

    };

    if(openPopup){

        popup.style.display="block";

    }

}

// =========================
// Buildings Click
// =========================

document.querySelectorAll(".building").forEach(function(box){

    box.addEventListener("click",function(){

        showBuilding(this.id);

    });

});

// =========================
// Smart Live Search
// =========================

function normalizeSearch(value){

    return value
        .toUpperCase()
        .replace(/[\s-]/g,"");

}

searchBuilding.addEventListener("input",function(){

    const query = normalizeSearch(this.value);

    searchResults.innerHTML = "";

    if(!query){

        searchResults.style.display = "none";

        return;

    }

    const results = [];

    document.querySelectorAll(".building").forEach(function(box){

        const id = box.id;

        const name =
            buildings[id] && buildings[id].name
            ? buildings[id].name
            : id;

        const normalizedID = normalizeSearch(id);
        const normalizedName = normalizeSearch(name);

        if(
            normalizedID.includes(query) ||
            normalizedName.includes(query)
        ){

            const buildingCode =
                "BM-" + id.substring(1).padStart(2,"0");

            const units = availability.filter(function(item){

                return item.unit.startsWith(buildingCode);

            }).length;

            results.push({

                id:id,
                name:name,
                units:units

            });

        }

    });

    if(results.length === 0){

        searchResults.innerHTML = `
            <div class="no-results">
                No buildings found
            </div>
        `;

        searchResults.style.display = "block";

        return;

    }

    results.forEach(function(result){

        const item = document.createElement("div");

        item.className = "search-result";

        item.innerHTML = `

            <div class="search-result-name">
                🏢 ${result.name}
            </div>

            <div class="search-result-info">
                ${
                    result.units > 0
                    ? "🟢 " + result.units + " Available Units"
                    : "No Available Units"
                }
            </div>

        `;

        item.onclick = function(){

            const box =
                document.getElementById(result.id);

            if(box){

                box.classList.add("highlight");

                setTimeout(function(){

                    box.classList.remove("highlight");

                },2000);

            }

            showBuilding(result.id);

            searchBuilding.value = "";

            searchResults.innerHTML = "";

            searchResults.style.display = "none";

        };

        searchResults.appendChild(item);

    });

    searchResults.style.display = "block";

});

// =========================
// Popup
// =========================

closeBtn.onclick=function(){

    popup.style.display="none";

};

// =========================
// Escape
// =========================

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        popup.style.display="none";

    }

});

// =========================
// Tooltip
// =========================

document.querySelectorAll(".building").forEach(function(box){

    box.addEventListener("mouseenter",function(){

        tooltip.style.display="block";

        tooltip.innerText=

        buildings[this.id]

        ? buildings[this.id].name

        : this.id;

    });

    box.addEventListener("mousemove",function(e){

        tooltip.style.left=(e.pageX+15)+"px";

        tooltip.style.top=(e.pageY-35)+"px";

    });

    box.addEventListener("mouseleave",function(){

        tooltip.style.display="none";

    });

});

// =========================
// Loading Screen
// =========================

window.addEventListener("load",function(){

    const loading=document.getElementById("loadingScreen");

    setTimeout(function(){

        loading.style.opacity="0";

        setTimeout(function(){

            loading.style.display="none";

        },600);

    },800);

});

// =========================
// Auto Refresh
// =========================

setInterval(loadAvailability,30000);

// =========================
// Start
// =========================

window.addEventListener("load",loadAvailability);
