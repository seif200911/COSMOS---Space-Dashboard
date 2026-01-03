// Navigation functionality
var navLinks = document.querySelectorAll('.nav-link');
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function (e) {
        e.preventDefault();

        var targetId = this.getAttribute('data-section');

        var allSections = document.querySelectorAll('.app-section');
        for (let j = 0; j < allSections.length; j++) {
            allSections[j].classList.add('hidden');
        }

        var targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        for (let k = 0; k < navLinks.length; k++) {
            navLinks[k].classList.remove('bg-blue-500/10', 'text-blue-400');
            navLinks[k].classList.add('text-slate-300');
        }

        this.classList.remove('text-slate-300');
        this.classList.add('bg-blue-500/10', 'text-blue-400');
    });
}

async function getTodayNews() {
    var response = await fetch("https://api.nasa.gov/planetary/apod?api_key=Fcb02ynSngCNZhDdcxoOAdwMpbO4YIbX92miZA6h")
    var data = await response.json()
    console.log(data);
    replaceTodayNews(data)
}
getTodayNews();

function replaceTodayNews(item) {
    var mainContent = document.getElementById('main-content');

    mainContent.innerHTML = `
        <div class="xl:col-span-2">
            <div id="apod-image-container"
                class="relative rounded-2xl overflow-hidden group h-[300px] md:h-[400px] lg:h-[600px] bg-slate-800/50 flex items-center justify-center">
                <div id="apod-loading" class="text-center hidden">
                    <i class="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
                    <p class="text-slate-400">Loading today's image...</p>
                </div>
                <img id="apod-image" class="w-full h-full object-cover" src="${item.url || 'assets/images/placeholder.webp'}"
                    alt="${item.title || 'Astronomy Picture of the Day'}" />
                <div
                    class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div class="absolute bottom-6 left-6 right-6">
                        <button
                            class="w-full py-3 bg-white/10 backdrop-blur-md rounded-lg font-semibold hover:bg-white/20 transition-colors">
                            <i class="fas fa-expand mr-2"></i>View Full Resolution
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="space-y-4 md:space-y-6">
            <div class="bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6">
                <h3 id="apod-title" class="text-lg md:text-2xl font-semibold mb-3 md:mb-4">
                    ${item.title || 'No title available'}
                </h3>
                <div class="flex items-center space-x-4 mb-4 text-sm text-slate-400">
                    <span id="apod-date-detail"><i class="far fa-calendar mr-2"></i>${item.date || 'No date available'}</span>
                </div>
                <p id="apod-explanation" class="text-slate-300 leading-relaxed mb-4">
                    ${item.explanation || 'No explanation available.'}
                </p>
                <div id="apod-copyright" class="text-xs text-slate-400 italic mb-4">
                    &copy; ${item.copyright || 'Public Domain'}
                </div>
            </div>
            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h4 class="font-semibold mb-3 flex items-center">
                    <i class="fas fa-info-circle text-blue-400 mr-2"></i>
                    Image Details
                </h4>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-slate-400">Date</span>
                        <span id="apod-date-info" class="font-medium">${item.date || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Media Type</span>
                        <span id="apod-media-type" class="font-medium">${item.media_type || 'N/A'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Source</span>
                        <span class="font-medium">NASA APOD</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    var viewFullBtn = document.getElementById('w-full');
    if (viewFullBtn) {
        viewFullBtn.addEventListener('click', function () {
            // Use HD URL if available, otherwise use regular URL
            var fullResolutionUrl = item.hdurl || item.url;
            if (fullResolutionUrl) {
                window.open(fullResolutionUrl, '_blank');
            } else {
                alert('Full resolution image not available');
            }
        });
    }

}


async function getAllLaunches() {
    var response = await fetch("https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10")
    var data = await response.json()
    console.log("All launches data:", data);

    if (data.results && data.results.length > 0) {
        displayLaunches(data.results[0]);
        displayLaunchGrid(data.results.slice(1));
    } else {
        console.log("No launch data available");
    }
}
getAllLaunches();

function displayLaunches(card) {
    var launchDate = new Date(card.net);
    var today = new Date();
    var daysUntil = Math.ceil((launchDate - today) / (1000 * 60 * 60 * 24));

    var launchDateStr = new Date(card.net).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    var launchTimeStr = new Date(card.net).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });

    var firstcard = document.getElementById('featured-launch');
    firstcard.innerHTML = `
        <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
            <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
            </div>
            <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-4">
                            <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                                <i class="fas fa-star"></i>
                                Featured Launch
                            </span>
                            <span class="px-4 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold">
                                ${card.status.abbrev}
                            </span>
                        </div>
                        <h3 class="text-3xl font-bold mb-3 leading-tight">
                            ${card.name || 'Unknown Launch'}
                        </h3>
                        <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-building"></i>
                                <span>${card.launch_service_provider.name}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-rocket"></i>
                                <span>${card.rocket.configuration.full_name}</span>
                            </div>
                        </div>
                        <div class="grid xl:grid-cols-2 gap-4 mb-6">
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-calendar"></i>
                                    Launch Date
                                </p>
                                <p class="font-semibold">${launchDateStr}</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-clock"></i>
                                    Launch Time
                                </p>
                                <p class="font-semibold">${launchTimeStr}</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Location
                                </p>
                                <p class="font-semibold text-sm">${card.pad.location.name}</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-globe"></i>
                                    Country
                                </p>
                                <p class="font-semibold">${card.pad.country.name}</p>
                            </div>
                        </div>
                        <p class="text-slate-300 leading-relaxed mb-6">
                            ${card.mission.description}
                        </p>
                    </div>
                    <div class="flex flex-col md:flex-row gap-3">
                        <button class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                            <i class="fas fa-info-circle"></i>
                            View Full Details
                        </button>
                        <div class="icons self-end md:self-center">
                            <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                                <i class="fas fa-bell"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                        ${card.image && card.image.image_url ? `<img src="${card.image.image_url}" alt="${card.name || 'Launch image'}" class="w-full h-full object-cover">` : `
      <div class="flex items-center justify-center h-full min-h-[400px] bg-slate-800">
                                <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                            </div>`
        }
                        <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
                    </div>
                </div>
            </div>
        </div>`;
}

function displayLaunchGrid(cards) {
    var launchesGrid = document.getElementById('launches-grid');
    var gridHTML = '';
    for (var i = 0; i < cards.length; i++) {
        var card = cards[i];

        var statusClass = 'bg-blue-500/90';
        if (card.status && card.status.abbrev === 'Go') {
            statusClass = 'bg-green-500/90';
        } else if (card.status && (card.status.abbrev === 'TBC' || card.status.abbrev === 'TBD')) {
            statusClass = 'bg-yellow-500/90';
        }

        var launchDate = new Date(card.net);
        var dateStr = launchDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        var timeStr = launchDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        }).replace(' GMT', '');

        gridHTML += `
        <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
            <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
                ${card.image && card.image.image_url ?
                `<img src="${card.image.image_url}" alt="${card.name || 'Launch'}" class="w-full h-full object-cover">` :
                `<i class="fas fa-rocket text-5xl text-slate-700"></i>`
            }
                <div class="absolute top-3 right-3">
                    <span class="px-3 py-1 ${statusClass} text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                        ${card.status.abbrev}
                    </span>
                </div>
            </div>
            <div class="p-5">
                <div class="mb-3">
                    <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        ${card.name || 'Unknown Launch'}
                    </h4>
                    <p class="text-sm text-slate-400 flex items-center gap-2">
                        <i class="fas fa-building text-xs"></i>
                        ${card.launch_service_provider.name}
                    </p>
                </div>
                <div class="space-y-2 mb-4">
                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-calendar text-slate-500 w-4"></i>
                        <span class="text-slate-300">${dateStr}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-clock text-slate-500 w-4"></i>
                        <span class="text-slate-300">${timeStr}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-rocket text-slate-500 w-4"></i>
                        <span class="text-slate-300">${card.rocket.configuration.full_name}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                        <span class="text-slate-300 line-clamp-1">${card.pad.name}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                    <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                        Details
                    </button>
                    <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }

    launchesGrid.innerHTML = gridHTML;
}



setupDateInput();
setupButtons();

function setupDateInput() {
    var dateInput = document.getElementById('apod-date-input');
    if (dateInput) {
        var today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = "1995-06-16";
        dateInput.max = today;
    }
}

function setupButtons() {
    var loadBtn = document.getElementById('load-date-btn');
    var todayBtn = document.getElementById('today-apod-btn');
    var dateInput = document.getElementById('apod-date-input');

    if (loadBtn) {
        loadBtn.addEventListener('click', loadAPODByDate);
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', getTodayNews);
    }

    if (dateInput) {
        dateInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                loadAPODByDate();
            }
        });
    }
}

async function loadAPODByDate() {
    var dateInput = document.getElementById('apod-date-input');
    var selectedDate = dateInput.value;

    var today = new Date().toISOString().split('T')[0];
    if (selectedDate > today) {
        dateInput.value = today;
        return;
    }

    showLoading(true);

    var response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=Fcb02ynSngCNZhDdcxoOAdwMpbO4YIbX92miZA6h&date=${selectedDate}`);
    var data = await response.json();

    if (data.error) {
        alert(data.error.message || 'No image available for this date');
        showLoading(false);
        return;
    }

    replaceTodayNews(data);
    showLoading(false);
}

function showLoading(isLoading) {
    var apodLoading = document.getElementById('apod-loading');
    var apodImage = document.getElementById('apod-image');
    var loadBtn = document.getElementById('load-date-btn');

    if (apodLoading) {
        if (isLoading) {
            apodLoading.classList.remove('hidden');
        } else {
            apodLoading.classList.add('hidden');
        }
    }

    if (apodImage && isLoading) {
        apodImage.classList.add('hidden');
    }

    if (loadBtn) {
        loadBtn.disabled = isLoading;
        if (isLoading) {
            loadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span class="hidden sm:inline ml-2">Loading...</span>';
        } else {
            loadBtn.innerHTML = '<i class="fas fa-search"></i><span class="hidden sm:inline ml-2">Load</span>';
        }
    }
}

async function getAllPlanets() {
    var response = await fetch("https://solar-system-opendata-proxy.vercel.app/api/planets")
    var data = await response.json()
    console.log(data.bodies);
    displayTablePlanets(data.bodies)
    setupPlanetCardClicks();
}
getAllPlanets()

function bgColor(planetName) { 
    var colors = {
        'Mercury': '#eab308',
        'Venus': '#f97316',
        'Earth': '#3b82f6',
        'Mars': '#ef4444',
        'Jupiter': '#fb923c',
        'Saturn': '#facc15',
        'Uranus': '#06b6d4',
        'Neptune': '#2563eb'
    }
    return colors[planetName] || '#6b7280'; 
}

function OrbitalPeriodDisplay(days) {
    if (days < 365) {
        return `${Math.round(days)} days`;
    } else {
        var years = (days / 365.25).toFixed(1);
        return `${years} years`;
    }
}
function displayTablePlanets(planetsArray) {
    var tableBody = document.getElementById('planet-comparison-tbody');


    tableBody.innerHTML = '';


    var planets = planetsArray.filter(body => body.isPlanet);

    for (let i = 0; i < planets.length; i++) {
        var planet = planets[i];


        var distance = (planet.semimajorAxis / 149598023).toFixed(2);
        var diameter = Math.round(planet.meanRadius * 2);


        var mass = 'N/A';

        mass = (planet.mass.massValue * Math.pow(10, planet.mass.massExponent) / 5.97237e24).toFixed(3);

        var date = planet.sideralOrbit ? OrbitalPeriodDisplay(planet.sideralOrbit) : 'N/A';
        var moons = planet.moons ? planet.moons.length : 0;

        var typeBadgeClass = getTypeBadgeClass(planet.type);


        var tr = document.createElement('tr');

        tr.innerHTML = `
            <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
                <div class="flex items-center space-x-2 md:space-x-3">
                    <div class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0" style="background-color: ${bgColor(planet.englishName)}">
                    </div>
                    <span class="font-semibold text-sm md:text-base whitespace-nowrap">${planet.englishName}</span>
                </div>
            </td>
            <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                ${distance}
            </td>
            <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                ${diameter.toLocaleString()}
            </td>
            <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                ${mass}
            </td>
            <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                ${date}
            </td>
            <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
                ${moons}
            </td>
            <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                <span class="px-2 py-1 rounded text-xs ${typeBadgeClass}">${planet.type}</span>
            </td>
        `;

        tableBody.appendChild(tr);
    }
}
function getTypeBadgeClass(planetType) {
    var badgeClasses = {
        'Terrestrial': 'bg-orange-500/50 text-orange-200',
        'Gas Giant': 'bg-purple-500/50 text-purple-200',
        'Ice Giant': 'bg-cyan-500/50 text-cyan-200'
    };
    return badgeClasses[planetType] || 'bg-slate-500/50 text-slate-200';
}






var planetsData = null;
function setupPlanetCardClicks() {
    var planetCards = document.querySelectorAll('.planet-card');

    for (let i = 0; i < planetCards.length; i++) {
        planetCards[i].addEventListener('click', function () {
            var planetId = this.getAttribute('data-planet-id');
            loadPlanetDetails(planetId);
        });
    }
}


async function loadPlanetDetails(planetName) {


    if (!planetsData) {
        var response = await fetch("https://solar-system-opendata-proxy.vercel.app/api/planets");
        var data = await response.json();
        planetsData = data.bodies;
    }

    var planet = null;
    for (let i = 0; i < planetsData.length; i++) {
        if (planetsData[i].englishName.toLowerCase() === planetName.toLowerCase()) {
            planet = planetsData[i];
            break;
        }
    }
    displayPlanetDetails(planet);

}


function displayPlanetDetails(planet) {
    console.log('Displaying planet details for:', planet.englishName);
    console.log('Planet data:', planet);

    var planetImage = document.getElementById('planet-detail-image');
    if (planetImage) {

        if (planet.image) {
            planetImage.src = planet.image;
        } else {
            planetImage.src = `assets/images/${planet.englishName.toLowerCase()}.png`;
        }
        planetImage.alt = planet.englishName;
    }

    // Update planet name
    var planetName = document.getElementById('planet-detail-name');
    if (planetName) {
        planetName.textContent = planet.englishName;
    }

    // Update planet description 
    var planetDesc = document.getElementById('planet-detail-description');
    if (planetDesc) {
        planetDesc.textContent = planet.description || 'No description available.';
    }

    // Update distance 
    var planetDistance = document.getElementById('planet-distance');
    if (planetDistance && planet.semimajorAxis) {
        var distanceInMKm = (planet.semimajorAxis / 1000000).toFixed(1);
        planetDistance.textContent = distanceInMKm + 'M km';
    }

    // Update radius
    var planetRadius = document.getElementById('planet-radius');
    if (planetRadius && planet.meanRadius) {
        planetRadius.textContent = Math.round(planet.meanRadius).toString() + ' km';
    }

    // Update mass
    var planetMass = document.getElementById('planet-mass');
    if (planetMass && planet.mass && planet.mass.massValue && planet.mass.massExponent) {
        var massValue = planet.mass.massValue.toFixed(2);
        var massExp = planet.mass.massExponent;
        planetMass.textContent = massValue + ' × 10^' + massExp + ' kg';
    } else if (planetMass) {
        planetMass.textContent = 'N/A';
    }

    // Update density
    var planetDensity = document.getElementById('planet-density');
    if (planetDensity && planet.density) {
        planetDensity.textContent = planet.density.toFixed(2) + ' g/cm³';
    } else if (planetDensity) {
        planetDensity.textContent = 'N/A';
    }

    // Update orbital period
    var planetOrbital = document.getElementById('planet-orbital-period');
    if (planetOrbital && planet.sideralOrbit) {
        planetOrbital.textContent = OrbitalPeriodDisplay(planet.sideralOrbit);
    } else if (planetOrbital) {
        planetOrbital.textContent = 'N/A';
    }

    // Update rotation period
    var planetRotation = document.getElementById('planet-rotation');
    if (planetRotation && planet.sideralRotation) {
        var rotationHours = Math.abs(planet.sideralRotation);
        if (rotationHours < 24) {
            planetRotation.textContent = rotationHours.toFixed(1) + ' hours';
        } else {
            var rotationDays = (rotationHours / 24).toFixed(1);
            planetRotation.textContent = rotationDays + ' days';
        }
    } else if (planetRotation) {
        planetRotation.textContent = 'N/A';
    }

    // Update moons count
    var planetMoons = document.getElementById('planet-moons');
    if (planetMoons) {
        var moonsCount = planet.moons ? planet.moons.length : 0;
        planetMoons.textContent = moonsCount.toString();
    }

    // Update gravity
    var planetGravity = document.getElementById('planet-gravity');
    if (planetGravity && planet.gravity) {
        planetGravity.textContent = planet.gravity.toFixed(1) + ' m/s²';
    } else if (planetGravity) {
        planetGravity.textContent = 'N/A';
    }

    // Update discoverer
    var planetDiscoverer = document.getElementById('planet-discoverer');
    if (planetDiscoverer) {
        planetDiscoverer.textContent = planet.discoveredBy || 'Known since antiquity';
    }

    // Update discovery date
    var planetDiscoveryDate = document.getElementById('planet-discovery-date');
    if (planetDiscoveryDate) {
        planetDiscoveryDate.textContent = planet.discoveryDate || 'Ancient';
    }

    // Update body type
    var planetBodyType = document.getElementById('planet-body-type');
    if (planetBodyType) {
        planetBodyType.textContent = planet.bodyType || 'Planet';
    }

    // Update volume
    var planetVolume = document.getElementById('planet-volume');
    if (planetVolume && planet.vol) {
        var volValue = planet.vol.volValue.toFixed(2);
        var volExp = planet.vol.volExponent;
        planetVolume.textContent = volValue + ' × 10^' + volExp + ' km³';

    }

    // Update perihelion
    var planetPerihelion = document.getElementById('planet-perihelion');
    if (planetPerihelion && planet.perihelion) {
        planetPerihelion.textContent = (planet.perihelion / 1000000).toFixed(1) + 'M km';
    }

    // Update aphelion
    var planetAphelion = document.getElementById('planet-aphelion');
    if (planetAphelion && planet.aphelion) {
        planetAphelion.textContent = (planet.aphelion / 1000000).toFixed(1) + 'M km';
    }

    // Update eccentricity
    var planetEccentricity = document.getElementById('planet-eccentricity');
    if (planetEccentricity && planet.eccentricity) {
        planetEccentricity.textContent = planet.eccentricity.toFixed(4);
    }

    // Update inclination
    var planetInclination = document.getElementById('planet-inclination');
    if (planetInclination && planet.inclination) {
        planetInclination.textContent = planet.inclination.toFixed(2) + '°';
    }

    // Update axial tilt
    var planetAxialTilt = document.getElementById('planet-axial-tilt');
    if (planetAxialTilt && planet.axialTilt) {
        planetAxialTilt.textContent = planet.axialTilt.toFixed(2) + '°';
    }

    // Update average temperature
    var planetTemp = document.getElementById('planet-temp');
    if (planetTemp && planet.avgTemp) {
        var tempCelsius = planet.avgTemp - 273.15;
        planetTemp.textContent = tempCelsius.toFixed(0) + '°C';
    }

    // Update velocity
    var planetEscape = document.getElementById('planet-escape');
    if (planetEscape && planet.escape) {
        planetEscape.textContent = (planet.escape / 1000).toFixed(1) + ' km/s';
    }

    // Update quick facts based on planet type
    var planetFacts = document.getElementById('planet-facts');
    if (planetFacts && planet.type) {
        var facts = generatePlanetFacts(planet);
        var factsHTML = '';
        for (let i = 0; i < facts.length; i++) {
            factsHTML += `
                <li class="flex items-start">
                    <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
                    <span class="text-slate-300">${facts[i]}</span>
                </li>`;
        }
        planetFacts.innerHTML = factsHTML;
    }
}
function generatePlanetFacts(planet) {
    var facts = [];

    if (planet.mass && planet.mass.massValue && planet.mass.massExponent) {
        var massValue = planet.mass.massValue.toFixed(5);
        var massExp = planet.mass.massExponent;
        facts.push('Mass: ' + massValue + ' × 10^' + massExp + ' kg');
    }

    if (planet.gravity) {
        facts.push('Surface gravity: ' + planet.gravity.toFixed(1) + ' m/s²');
    }

    if (planet.density) {
        facts.push('Density: ' + planet.density.toFixed(4) + ' g/cm³');
    }

    if (planet.axialTilt) {
        facts.push('Axial tilt: ' + planet.axialTilt.toFixed(4) + '°');
    }

    return facts;
}

setupPlanetCardClicks();