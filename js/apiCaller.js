//CORS policies prevent cross site calls being made on the original page
//so a service worker is created and the data is sent back to content.js

//listens for call from content.js
chrome.runtime.onMessage.addListener(
    function(name, sender, onSuccess) {
        //make an api call to the rmp api
        fetch("https://www.ratemyprofessors.com/graphql", {
                               "headers": {
                               "accept": "*/*", 
                               "accept-language": "en-US,en;q=0.9",
                               "authorization": "Basic dGVzdDp0ZXN0",
                               "content-type": "application/json",
                               "sec-fetch-mode": "cors",
                               "sec-fetch-site": "same-origin"
                               },
                               "referrerPolicy": "strict-origin-when-cross-origin",
                               "body": "{\"query\":\"query TeacherSearchResultsPageQuery(\\n  $query: TeacherSearchQuery!\\n  $schoolID: ID\\n) {\\n  search: newSearch {\\n    ...TeacherSearchPagination_search_1ZLmLD\\n  }\\n  school: node(id: $schoolID) {\\n    __typename\\n    ... on School {\\n      name\\n    }\\n    id\\n  }\\n}\\n\\nfragment TeacherSearchPagination_search_1ZLmLD on newSearch {\\n  teachers(query: $query, first: 8, after: \\\"\\\") {\\n    didFallback\\n    edges {\\n      cursor\\n      node {\\n        ...TeacherCard_teacher\\n        id\\n        __typename\\n      }\\n    }\\n    pageInfo {\\n      hasNextPage\\n      endCursor\\n    }\\n    resultCount\\n    filters {\\n      field\\n      options {\\n        value\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment TeacherCard_teacher on Teacher {\\n  id\\n  legacyId\\n  avgRating\\n  numRatings\\n  ...CardFeedback_teacher\\n  ...CardSchool_teacher\\n  ...CardName_teacher\\n  ...TeacherBookmark_teacher\\n}\\n\\nfragment CardFeedback_teacher on Teacher {\\n  wouldTakeAgainPercent\\n  avgDifficulty\\n}\\n\\nfragment CardSchool_teacher on Teacher {\\n  department\\n  school {\\n    name\\n    id\\n  }\\n}\\n\\nfragment CardName_teacher on Teacher {\\n  firstName\\n  lastName\\n}\\n\\nfragment TeacherBookmark_teacher on Teacher {\\n  id\\n  isSaved\\n}\\n\",\"variables\":{\"query\":{\"text\":\""+name+"\",\"schoolID\":\"U2Nob29sLTEyNDc=\",\"fallback\":true,\"departmentID\":null},\"schoolID\":\"U2Nob29sLTEyNDc=\"}}",
                               "method": "POST",
                               "mode": "cors"
                               }).then(re => re.json()).then(data => onSuccess(data)) //returns the data once it succesfully downloads
                              
        return true;
    }
);