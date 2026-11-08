
/*
    Author: Adam Smithhisler
    Date: November 8, 2026
    Assignment: 5.4_PA_Launch-Day_SMITHHISLER

    Purpose: Detect whether the Satellite Uplink
    Command Center is opened as a static file or
    through a local server. Update the interface,
    display connection information, provide refresh
    functionality, and track the previous launch
    time using a browser cookie.
*/


// ==========================================
// COOKIE FUNCTIONS
// ==========================================

// Retrieve the value of a previously saved cookie.
function getCookie(name) {

    const cookieName = name + "=";

    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {

        cookie = cookie.trim();

        if (cookie.startsWith(cookieName)) {

            return decodeURIComponent(
                cookie.substring(cookieName.length)
            );

        }
    }

    return null;
}


// Save a cookie for 30 days.
function setCookie(name, value) {

    const days = 30;

    const expirationSeconds =
        days * 24 * 60 * 60;

    document.cookie =
        name + "=" +
        encodeURIComponent(value) +
        "; max-age=" + expirationSeconds +
        "; path=/; SameSite=Lax";
}


// ==========================================
// DETECT THE LAUNCH ENVIRONMENT
// ==========================================

// Live Preview uses HTTP or HTTPS.
// Opening the HTML directly uses FILE.

const isLive =
    window.location.protocol === "http:" ||
    window.location.protocol === "https:";


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const heroTitle =
    document.getElementById("heroTitle");

const heroText =
    document.getElementById("heroText");

const connectionStatus =
    document.getElementById("connectionStatus");

const lastOnline =
    document.getElementById("lastOnline");

const hostInfo =
    document.getElementById("hostInfo");

const portInfo =
    document.getElementById("portInfo");

const protocolInfo =
    document.getElementById("protocolInfo");

const refreshButton =
    document.getElementById("refreshButton");


// ==========================================
// REFRESH TELEMETRY
// ==========================================

// Reload the webpage when the button is clicked.
// In Uplink Mode, reloading also updates the
// saved launch timestamp.

refreshButton.addEventListener("click", function () {

    window.location.reload();

});


// ==========================================
// UPLINK MODE
// ==========================================

if (isLive) {

    // Apply the warm amber Uplink theme.

    document.body.classList.remove("standby-mode");

    document.body.classList.add("uplink-mode");


    // Update the command center heading.

    heroTitle.textContent =
        "SATELLITE UPLINK ESTABLISHED";

    heroText.textContent =
        "Uplink Mode active. Satellite telemetry synchronized.";


    // Update connection information.

    connectionStatus.textContent =
        "UPLINK ACTIVE - SIGNAL CONNECTED";

    hostInfo.textContent =
        window.location.hostname || "Unknown Host";


    // Display the actual server port.

    if (window.location.port) {

        portInfo.textContent = window.location.port;

    } else if (window.location.protocol === "https:") {

        portInfo.textContent = "443 (Default HTTPS)";

    } else {

        portInfo.textContent = "80 (Default HTTP)";

    }


    // Display the current connection protocol.

    protocolInfo.textContent =
        window.location.protocol
            .replace(":", "")
            .toUpperCase();


    // ======================================
    // LAST UPLINK COOKIE
    // ======================================

    // First retrieve the previously saved
    // launch time from the browser cookie.

    const previousLaunch = getCookie("lastUplink");


    // Display the previous launch, if available.

    if (previousLaunch) {

        lastOnline.textContent = previousLaunch;

    } else {

        lastOnline.textContent =
            "First uplink established. Refresh to view the previous launch.";

    }


    // Save the current launch time for the
    // NEXT visit or refresh.

    const currentLaunch =
        new Date().toLocaleString();

    setCookie("lastUplink", currentLaunch);

}


// ==========================================
// GROUND STANDBY MODE
// ==========================================

else {

    // Apply the cool blue-gray Standby theme.

    document.body.classList.remove("uplink-mode");

    document.body.classList.add("standby-mode");


    // Display the offline status.

    heroTitle.textContent =
        "GROUND STANDBY";

    heroText.textContent =
        "Awaiting Uplink Authorization...";

    connectionStatus.textContent =
        "OFFLINE - NO UPLINK";


    // Display offline system information.

    hostInfo.textContent =
        "No Local Web Server";

    portInfo.textContent =
        "No Active Communication Port";

    protocolInfo.textContent =
        "FILE";


    // The static file is not connected
    // to the local server's cookie storage.

    lastOnline.textContent =
        "No uplink records available in offline mode.";

}
