function gridToProf(element){
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);
    profElement = profElement.childNodes[0].childNodes[0];
    if(profElement.textContent.includes("⭐")){
        return "";
    }
    profName = profElement.textContent.replace(/[^a-z0-9\s]/gi, '');
    
    return profName;
}

function changeProfName(element,rating,id){
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);

    if(id != 0){
        profElement.setAttribute("onclick", "window.open('https://www.ratemyprofessors.com/professor/" + id +"', '_blank');");
    }
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

        if(rmpData.data?.search.teachers.edges.length > 0){
            
            profRating = rmpData.data.search.teachers.edges[0].node.avgRating;
            legacyId = rmpData.data.search.teachers.edges[0].node.legacyId;
            changeProfName(element,profRating,legacyId);
        }
        else{
            changeProfName(element,0,0);

        }});
    }

}

const observer = new MutationObserver(function (mutations) {
    let flag = false;
    for(const mut of mutations){
        if(mut.target.className === "MuiGrid-root px-0 MuiGrid-container MuiGrid-spacing-xs-1"){
            flag = true;
            break;
        }
    }
    if(!flag){
        return;
    }
    
    const elements = document.getElementsByClassName("MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-center");
    if(elements.length == 0){
        return;
    }

    for (var i = 0; i < elements.length; i++) {
        if(elements.item(i).childNodes.length < 2){
            continue;
        }
        if(elements.item(i).childNodes[1].className === "MuiGrid-root MuiGrid-item"){
            continue;
        }
        editGridElement(elements.item(i));
    }
});
observer.observe(document, {
    childList: true,
    subtree:   true
});