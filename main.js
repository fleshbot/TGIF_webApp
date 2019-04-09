var members = data.results[0].members;
var tableHeaders = ["Senator", "Party Affiliation", "State", "Seniority", "Votes with Party"]
//console.log(members);
//var test = 


function buildTable() {
    var container = document.getElementById("senate-data");
    var tbody = document.createElement("tbody");
    container.appendChild(tbody);
    for (let j = 0; j < tableHeaders.length; j++) {
        var th = document.createElement("th");
        th.append(tableHeaders[j])
        tbody.appendChild(th);
    }
    for (let i = 0; i < members.length; i++) {
        var tr = document.createElement("tr");
        var a = document.createElement("a");
        var fullName = members[i].first_name + " " + (members[i].middle_name || "") + " " + members[i].last_name;
        tr.insertCell().innerHTML = "<a target='blank' href='" + members[i].url + "'>" + fullName + "</a>";
        tr.insertCell().innerHTML = members[i].party;
        tr.insertCell().innerHTML = members[i].state;
        tr.insertCell().innerHTML = members[i].seniority;
        tr.insertCell().innerHTML = members[i].votes_with_party_pct + "&#37";
        tbody.appendChild(tr);
        console.log(fullName)
    }
}

buildTable();
