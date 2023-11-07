ratingDict = {};

function gridToProf(element){
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);
    profElement = profElement.childNodes[0].childNodes[0];
    profName = profElement.textContent.replace(/[^a-z0-9\s]/gi, '');
    return profName;
}

function addZeroes(num) {

    const dec = num.split('.')[1]
    const len = dec && dec.length > 1 ? dec.length : 1
    return Number(num).toFixed(len)
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
//https://stackoverflow.com/questions/60337528/chrome-extension-cross-origin-requests-in-background-script-blocked
//https://stackoverflow.com/questions/12357485/cors-chrome-extension-with-manifest-version-2

//corproxy.io could be unsafe and should not be used
async function proxyGetRMP(name){
    if(name === "To be Announced" || name === ""){
        return;
    }
    //to-do add subject to pick the correct professor adam lee has two
    const re = await fetch("https://www.ratemyprofessors.com/graphql", {
    //const re = await fetch("https://corsproxy.io/?https://www.ratemyprofessors.com/graphql", {
                           "headers": {
                           "accept": "*/*", 
                           "accept-language": "en-US,en;q=0.9",
                           "authorization": "Basic dGVzdDp0ZXN0",
                           "content-type": "application/json",
                           "sec-fetch-mode": "cors",
                           "sec-fetch-site": "same-origin"
                           },
                           "referrerPolicy": "strict-origin-when-cross-origin",
                           "body": "{\"query\":\"query TeacherSearchResultsPageQuery(\\n  $query: TeacherSearchQuery!\\n  $schoolID: ID\\n) {\\n  search: newSearch {\\n    ...TeacherSearchPagination_search_1ZLmLD\\n  }\\n  school: node(id: $schoolID) {\\n    __typename\\n    ... on School {\\n      name\\n    }\\n    id\\n  }\\n}\\n\\nfragment TeacherSearchPagination_search_1ZLmLD on newSearch {\\n  teachers(query: $query, first: 8, after: \\\"\\\") {\\n    didFallback\\n    edges {\\n      cursor\\n      node {\\n        ...TeacherCard_teacher\\n        id\\n        __typename\\n      }\\n    }\\n    pageInfo {\\n      hasNextPage\\n      endCursor\\n    }\\n    resultCount\\n    filters {\\n      field\\n      options {\\n        value\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment TeacherCard_teacher on Teacher {\\n  id\\n  legacyId\\n  avgRating\\n  numRatings\\n  ...CardFeedback_teacher\\n  ...CardSchool_teacher\\n  ...CardName_teacher\\n  ...TeacherBookmark_teacher\\n}\\n\\nfragment CardFeedback_teacher on Teacher {\\n  wouldTakeAgainPercent\\n  avgDifficulty\\n}\\n\\nfragment CardSchool_teacher on Teacher {\\n  department\\n  school {\\n    name\\n    id\\n  }\\n}\\n\\nfragment CardName_teacher on Teacher {\\n  firstName\\n  lastName\\n}\\n\\nfragment TeacherBookmark_teacher on Teacher {\\n  id\\n  isSaved\\n}\\n\",\"variables\":{\"query\":{\"text\":\""+ name + "\",\"schoolID\":\"U2Nob29sLTEyNDc=\",\"fallback\":true,\"departmentID\":null},\"schoolID\":\"U2Nob29sLTEyNDc=\"}}",
                           "method": "POST",
                           "mode": "cors"
                           });
    
    const data = await re.json();
    return data;
}
//console.log(proxyGetRMP("adam lee"));

function editGridElement(element){
    profName = gridToProf(element);
    console.log(profName);
    if(profName  === "To be Announced" || profName  === ""){
        return;
    }
    else{
        proxyGetRMP(profName).then(rmpData => {

            if(rmpData.data.search.teachers.edges.length > 0){
                profRating = rmpData.data.search.teachers.edges[0].node.avgRating;
                changeProfName(element,profRating);
            }
            else{
                ratingDict[profName] = 0;
                changeProfName(element,0);

            }
            console.log(ratingDict);
        });
    }

}


const observer = new MutationObserver(function (mutations) {
    
    const elements = document.getElementsByClassName("MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-center");
    if(elements.length == 0){
        return;
    }

    const grid = [];
    //construct grid list 
    for (var i = 0; i < elements.length; i++) {
        if(elements.item(i).childNodes.length < 2){
            continue;
        }
        if(elements.item(i).childNodes[1].className === "MuiGrid-root MuiGrid-item"){
            continue;
        }
        //console.log(elements.item(i));
        //gridToProf(elements.item(i));
        //editGridElement(elements.item(i));
        grid.push(elements.item(i));
    }
    //construct set
    const profs = new Set();

    for (var i = 0; i < grid.length; i++){
        profs.add(gridToProf(grid[i]));
    }

    //old method
    //construct dict
    /*
    for (const prof of profs){
        proxyGetRMP(prof).then(rmpData => {

            if(rmpData.data.search.teachers.edges.length > 0){
                profRating = rmpData.data.search.teachers.edges[0].node.avgRating;
                ratingDict[prof] = profRating;
            }
            else{
                ratingDict[prof] = 0;
            }
        });
    }
    
    console.log(profs);
    console.log(ratingDict);

    //edit names

    for (const entry of grid){
        changeProfName(entry, ratingDict[gridToProf(entry)]);
    }*/

    //promise all method
    promises = []
    for (const prof of profs){
        promises.push(proxyGetRMP(prof))
    }
    
    Promise.all(promises).then(rData =>{
        for(var i = 0; i < promises.length; i++){
            if(rData[i].data.search.teachers.edges.length > 0){
                profRating = rmpData.data.search.teachers.edges[0].node.avgRating;
                ratingDict[profs[i]] = profRating;
            }
            else{
                ratingDict[profs[i]] = 0;
            }
        }
        console.log(rData);
        for (const entry of grid){
            changeProfName(entry, ratingDict[gridToProf(entry)]);
        }
    });
    

    

    console.log("mutObs Disconnected");
    observer.disconnect();
});

// send list of unique prof Return dict with rating
observer.observe(document, {
    childList: true,
    subtree:   true
});