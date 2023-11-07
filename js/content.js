function gridToProf(element){
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);
    profElement = profElement.childNodes[0].childNodes[0];
    profName = profElement.textContent.replace(/[^a-z0-9\s]/gi, '');
    return profName;
}

function changeProfName(element,rating){
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);
    profTexts = profElement.childNodes[0].childNodes;
    
    for(var i = 0; i < profTexts.length; i++){
        if(rating == 0){
            profTexts[i].textContent = "⭐ N/A " +  profTexts[i].textContent;
        }
        else{
            profTexts[i].textContent = "⭐ "+ rating.toFixed(1) +  " " +  profTexts[i].textContent;
        }
    }
}

function editGridElement(element){
    profName = gridToProf(element);
    if(profName  === "To be Announced" || profName  === ""){
        return;
    }
    else{
        chrome.runtime.sendMessage(profName, rmpData => {

        if(rmpData.data.search.teachers.edges.length > 0){
            profRating = rmpData.data.search.teachers.edges[0].node.avgRating;
            changeProfName(element,profRating);
        }
        else{
            changeProfName(element,0);

        }});
    }

}

const observer = new MutationObserver(function (mutations) {
    let flag = false;
    for(const mut of mutations){
        console.log(mut.target.className);
        console.log(mut.target.className === "MuiGrid-root px-0 MuiGrid-container MuiGrid-spacing-xs-1");
        if(mut.target.className === "MuiGrid-root px-0 MuiGrid-container MuiGrid-spacing-xs-1"){
            flag = true;
            break;
        }
    }
    if(!flag){
        return;
    }
    console.log("done");
    
    const elements = document.getElementsByClassName("MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-center");
    if(elements.length == 0){
        return;
    }

    const grid = [];

    for (var i = 0; i < elements.length; i++) {
        if(elements.item(i).childNodes.length < 2){
            continue;
        }
        if(elements.item(i).childNodes[1].className === "MuiGrid-root MuiGrid-item"){
            continue;
        }
        editGridElement(elements.item(i));
    }
    
    //console.log("mutObs Disconnected");
    //observer.disconnect();
});
observer.observe(document, {
    childList: true,
    subtree:   true
});