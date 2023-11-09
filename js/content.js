//hidden rec var determines if recs and labs are hidden
let hideRec = false;

//global storage for profName and profRating
let globalProf = "";
let globalRating = 0;

//dictionary containing professors and their ratings
var leadDictionary = {};

//takes search grid element as input and returns the prof name
function gridToProf(element){

    //gets the element cotaining the prof element
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);

    //gets the text cotaining the prof name
    profElement = profElement.childNodes[0].childNodes[0];

    //if element contains a rating, return nothing because its not longer a valid name
    //to skip over entries that are already done
    if(profElement.textContent.includes("⭐")){
        return "";
    }

    //remove any non alphanumerical chars
    profName = profElement.textContent.replace(/[^a-z0-9\s]/gi, '');
    
    return profName;
}

//takes search grid element, rating, and legacyid as input
function changeProfName(element,rating,id){

    //gets the element cotaining the prof element
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);

    //if the id is valid
    if(id != 0){

        //add a link to the rmp page to the text
        profElement.setAttribute("onclick", "window.open('https://www.ratemyprofessors.com/professor/" + id +"', '_blank');");
    }

    //gets the text cotaining the prof name
    profTexts = profElement.childNodes[0].childNodes;
    
    //adds a star and rating in front of the name
    for(var i = 0; i < profTexts.length; i++){
        if(rating == 0){
            profTexts[i].textContent = "⭐ N/A " +  profTexts[i].textContent;
        }
        else{
            profTexts[i].textContent = "⭐ "+ rating.toFixed(1) +  " " +  profTexts[i].textContent;
            
        }
    }
}

//runs when hide rec button is toggled
function toggleHideRec(){

    //toggles value
    hideRec = !hideRec;

    //gets all search grid elements
    const elements = document.getElementsByClassName("MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-center");

    //exit if none
    if(elements.length == 0){
        return;
    }

    //iterates through all grid elements
    for (var i = 0; i < elements.length; i++) {

        //skips over irrevelant elements
        if(elements.item(i).childNodes.length < 2){
            continue;
        }
        if(elements.item(i).childNodes[1].className === "MuiGrid-root MuiGrid-item"){
            continue;
        }

        //if not hiding rec
        if(!hideRec){
            //make any hidden elements visible
            if(elements.item(i).parentElement.parentElement.parentElement.style.display == 'none'){
                elements.item(i).parentElement.parentElement.parentElement.style.display = 'block';
            }
        }
        else{
            //gets section name
            secName = elements.item(i).getElementsByClassName("mr-1 css-1o4wo1x").item(0).textContent;

            //checks if it is a rec or lab
            if(secName.includes('REC') || secName.includes('LAB')){

                //makes search result invisible
                elements.item(i).parentElement.parentElement.parentElement.style.display = 'none';
            }
        }
    }
}

//takes a search grid element as input, calls api, and edits the prof name to include
//a rating and link to rmp page
function editGridElement(element){

    //finds prof name within element
    profName = gridToProf(element);

    //if recs are hidden
    if(hideRec){

        //gets section name
        secName = element.getElementsByClassName("mr-1 css-1o4wo1x").item(0).textContent;

        //checks if it is a rec or lab
        if(secName.includes('REC') || secName.includes('LAB')){

            //makes search result invisible
            element.parentElement.parentElement.parentElement.style.display = 'none';
        }
        
    }

    //if the prof name is tba or nothing exit
    if(profName  === "To be Announced" || profName  === ""){
        return;
    }

    //send the profname to the rmp api for the rating
    chrome.runtime.sendMessage(profName, rmpData => {
    
    //check if valid data was returned
    if(rmpData.data?.search.teachers.edges.length > 0){
        
        //from the rmp api response gets the rating and the legacy id used for the link
        profRating = rmpData.data.search.teachers.edges[0].node.avgRating;
        legacyId = rmpData.data.search.teachers.edges[0].node.legacyId;
        //changes profname with rmp data and link
        changeProfName(element,profRating,legacyId);
    }
    else{
        //if no valid rating was return pass 0 which will become n\a
        changeProfName(element,0,0);
    }});

}

//creates the hide rec button
function createRecButton(){

    //gets row where button resides
    div = document.getElementsByClassName("MuiGrid-root d-flex align-items-end pb-sm-2 h-100 MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12")[0].childNodes[0];
    
    //creates button element and css
    button = document.createElement("input");
    button.type = "checkbox";
    button.id = "hpExtRec";
    button.style.transform = "scale(1.5)"; 
    button.style.margin = "15px 15px 15px 15px";

    //adds listen to run function when clicked
    button.addEventListener('click', function() {
        toggleHideRec();
    });

    //creates label element and css
    label = document.createElement("label");
    label.for = "hpExtRec"
    label.innerHTML = "Hide Recitations and Labs";
    label.style.fontFamily = "IBM Plex Sans";
    label.style.fontSize = "15px";

    //make both elements children of the row
    div.appendChild(button);
    div.appendChild(label);
}
createRecButton();

//creates a mutation observer to listen when highpoint creates search results
const observer = new MutationObserver(function (mutations) {

    //checks to see any of the mutations recorded contain a search grid item
    let flag = false;
    for(const mut of mutations){
        if(mut.target.className === "MuiGrid-root px-0 MuiGrid-container MuiGrid-spacing-xs-1"){
            flag = true;
            break;
        }
    }
    //exits function if there were none
    if(!flag){
        return;
    }
    
    //gets all of the search grid elements
    const elements = document.getElementsByClassName("MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-center");

    //if no elements were found exit function
    if(elements.length == 0){
        return;
    }

    //iterates through all grid elements
    for (var i = 0; i < elements.length; i++) {

        //skips over irrevelant elements
        if(elements.item(i).childNodes.length < 2){
            continue;
        }
        if(elements.item(i).childNodes[1].className === "MuiGrid-root MuiGrid-item"){
            continue;
        }

        //sends revelant items to be edited
        editGridElement(elements.item(i));
    }
});

//make observer observe
observer.observe(document, {
    childList: true,
    subtree:   true
});