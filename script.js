const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

// Unsplash API
let initialCount = 5;
const apiKey = process.env.UNSPLASH_API_KEY;
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${initialCount}`;

// Helper function
function setAttributes(element, attributes) {
    for(const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function updateURLWithNewCount(picCount) {
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

// Check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if(imagesLoaded === totalImages){
        ready = true;
        loader.hidden = true;
        initialLoad = false;
        count = 30;
    }
}

// Create Elements for Links and Photos, Add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    photosArray.forEach((photo) => {
        // Create <a> to link to Unsplash
        const item = document.createElement("a");
        setAttributes(item, {
            href: photo.links.html,
            target: "_blank"
        });

        // Create <img> for photo
        const img = document.createElement("img");
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description
        })
        // Event Listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);
        // Put <img> inside <a>, then put both inside imageContainer element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        photosArray = await response.json();
        displayPhotos();
        if(isInitialLoad) {
            updateURLWithNewCount(30);
            isInitialLoad = false;
        }
    } catch (e) {
        // Catch Error here
    }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener("scroll", () => {
    if(window.innerWidth + window.scrollY > document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
});

// On Load
getPhotos();