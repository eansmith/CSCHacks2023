function handleSomeDiv(someDiv) { 
    console.log("div was handled");
    console.log(someDiv);
}

function gridToProf(element){
    //1 0 0 0 3 0 0 0 4 0
    //profElement = element.childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[3].childNodes[0].childNodes[0].childNodes[0].childNodes[4].childNodes[0];
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);

    profElement = profElement.childNodes[0].childNodes[0];
    console.log(profElement.textContent);
}
const observer = new MutationObserver(function (mutations) {
    const elements = document.getElementsByClassName("MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-center");

    for (var i = 0; i < elements.length; i++) {
        if(elements.item(i).childNodes.length < 2){
            continue;
        }
        if(elements.item(i).childNodes[1].className === "MuiGrid-root MuiGrid-item"){
            continue;
        }
        //console.log(elements.item(i));
        gridToProf(elements.item(i));
    }

    if (elements) {
        handleSomeDiv(elements);
    }
});


observer.observe(document, {
    childList: true,
    subtree:   true
});