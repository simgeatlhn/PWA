if ("serviceWorker in navigator") {
    navigator.serviceWorker.register("sw.js")
        .then((reg) => console.log("service worker registered", reg))
        .catch((err) => console.log("service worker not registered", err))
}

//if browser supports service worker and we can use it use so we are only going to execute this code