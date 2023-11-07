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

async function getRMP(name){
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
  "body": "{\"query\":\"query TeacherSearchResultsPageQuery(\\n  $query: TeacherSearchQuery!\\n  $schoolID: ID\\n) {\\n  search: newSearch {\\n    ...TeacherSearchPagination_search_1ZLmLD\\n  }\\n  school: node(id: $schoolID) {\\n    __typename\\n    ... on School {\\n      name\\n    }\\n    id\\n  }\\n}\\n\\nfragment TeacherSearchPagination_search_1ZLmLD on newSearch {\\n  teachers(query: $query, first: 8, after: \\\"\\\") {\\n    didFallback\\n    edges {\\n      cursor\\n      node {\\n        ...TeacherCard_teacher\\n        id\\n        __typename\\n      }\\n    }\\n    pageInfo {\\n      hasNextPage\\n      endCursor\\n    }\\n    resultCount\\n    filters {\\n      field\\n      options {\\n        value\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment TeacherCard_teacher on Teacher {\\n  id\\n  legacyId\\n  avgRating\\n  numRatings\\n  ...CardFeedback_teacher\\n  ...CardSchool_teacher\\n  ...CardName_teacher\\n  ...TeacherBookmark_teacher\\n}\\n\\nfragment CardFeedback_teacher on Teacher {\\n  wouldTakeAgainPercent\\n  avgDifficulty\\n}\\n\\nfragment CardSchool_teacher on Teacher {\\n  department\\n  school {\\n    name\\n    id\\n  }\\n}\\n\\nfragment CardName_teacher on Teacher {\\n  firstName\\n  lastName\\n}\\n\\nfragment TeacherBookmark_teacher on Teacher {\\n  id\\n  isSaved\\n}\\n\",\"variables\":{\"query\":{\"text\":\"william garrison\",\"schoolID\":\"U2Nob29sLTEyNDc=\",\"fallback\":true,\"departmentID\":null},\"schoolID\":\"U2Nob29sLTEyNDc=\"}}",
  "method": "POST",
  "mode": "cors"
    });
    const data = await re.json();
    console.log(data);
}
getRMP("brob");

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