function handleSomeDiv(someDiv) { 
    console.log("div was handled");
    console.log(someDiv);
}

const observer = new MutationObserver(function (mutations) {
    const someDiv = document.getElementsByClassName("MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-center");
    if (someDiv) {
        handleSomeDiv(someDiv);
    }
});


observer.observe(document, {
    childList: true,
    subtree:   true
});