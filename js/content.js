function gridToProf(element){
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);
    profElement = profElement.childNodes[0].childNodes[0];
    profName = profElement.textContent.replace(/[^a-z0-9\s]/gi, '');
    return profName;
}

function changeProfName(element){
    profElement = element.getElementsByClassName("MuiGrid-root MuiGrid-item MuiGrid-zeroMinWidth MuiGrid-grid-xs-12").item(0);
    profTexts = profElement.childNodes[0].childNodes;
    
    for(var i = 0; i < profTexts.length; i++){
        profTexts[i].textContent = "4.0 " +  profTexts[i].textContent;
    }
}
//https://stackoverflow.com/questions/60337528/chrome-extension-cross-origin-requests-in-background-script-blocked
//https://stackoverflow.com/questions/12357485/cors-chrome-extension-with-manifest-version-2

//corproxy.io could be unsafe and should not be used
async function proxyGetRMP(name){
    //to-do add subject to pick the correct professor adam lee has two
    const re = await fetch("https://corsproxy.io/?https://www.ratemyprofessors.com/graphql", {
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
    if(profName === "To be Announced" || profName === ""){
        return;
    }

    /*proxyGetRMP(profName).then(rmpData => {

        console.log(rmpData);
        profRating = rmpData.data.search.teachers.edges[0].node.avgRating;

        console.log(profRating);
    });*/

    //changeProfName(element);

    

}

const observer = new MutationObserver(function (mutations) {
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
        //console.log(elements.item(i));
        //gridToProf(elements.item(i));
        editGridElement(elements.item(i));
    }
    observer.disconnect();
});


observer.observe(document, {
    childList: true,
    subtree:   true
});