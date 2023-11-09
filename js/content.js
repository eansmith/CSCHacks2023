let hideRec = false;

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

function toggleHideRec(){
    hideRec = !hideRec;
    if(!hideRec){
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
            if(elements.item(i).parentElement.parentElement.parentElement.style.display == 'none'){
                elements.item(i).parentElement.parentElement.parentElement.style.display = 'block';
            }
        }
    }
    if(hideRec){
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
            secName = elements.item(i).getElementsByClassName("mr-1 css-1o4wo1x").item(0).textContent;
            if(secName.includes('REC') || secName.includes('LAB')){
                elements.item(i).parentElement.parentElement.parentElement.style.display = 'none';
            }
        }
    }
}

function editGridElement(element){
    profName = gridToProf(element);
    if(hideRec){
        secName = element.getElementsByClassName("mr-1 css-1o4wo1x").item(0).textContent;
        if(secName.includes('REC') || secName.includes('LAB')){
            element.parentElement.parentElement.parentElement.style.display = 'none';
        }
        
    }
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

function createRecButton(){
    div = document.getElementsByClassName("MuiGrid-root d-flex align-items-end pb-sm-2 h-100 MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12")[0].childNodes[0];
    
    button = document.createElement("input");
    button.type = "checkbox";
    button.id = "hpExtRec";
    //button.style.borderRadius = "40%";
    button.style.transform = "scale(1.5)"; 
    button.style.margin = "15px 15px 15px 15px";
    button.addEventListener('click', function() {
        toggleHideRec();
    });
    //button.setAttribute("onclick", "toggleHideRec()");

    label = document.createElement("label");
    label.for = "hpExtRec"
    label.innerHTML = "Hide Recitations and Labs";
    label.style.fontFamily = "IBM Plex Sans";
    label.style.fontSize = "15px";

    div.appendChild(button);
    div.appendChild(label);
}
createRecButton();

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