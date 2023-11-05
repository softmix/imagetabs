function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        includedDomains: document.querySelector("#includedDomains").value.split('\n').filter(Boolean),
        excludedDomains: document.querySelector("#excludedDomains").value.split('\n').filter(Boolean),
        includedExtensions: document.querySelector("#includedExtensions").value.split('\n').filter(Boolean),
        excludedExtensions: document.querySelector("#excludedExtensions").value.split('\n').filter(Boolean),
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#includedDomains").value = (result.includedDomains || []).join('\n');
        document.querySelector("#excludedDomains").value = (result.excludedDomains || []).join('\n');
        document.querySelector("#includedExtensions").value = (result.includedExtensions || []).join('\n');
        document.querySelector("#excludedExtensions").value = (result.excludedExtensions || []).join('\n');
    }

    function onError(error) {
        console.error(`Error: ${error}`);
    }

    const getting = browser.storage.sync.get([
        "includedDomains",
        "excludedDomains",
        "includedExtensions",
        "excludedExtensions"
    ]);
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);