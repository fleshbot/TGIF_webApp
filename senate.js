//Copied over
var selectedState = "";
var selectedStateData = [];
buildDropdown();
buildStateTable(members);

//copied over
function filterStateData() {
    selectedState = document.getElementById("state-selector").value;
    selectedStateData = members.filter(member => selectedState == member.state || selectedState == "all");
    buildStateTable(selectedStateData);
    console.log(selectedState);
    console.log(selectedStateData);
}
//copied over
function buildDropdown() {
    var container = document.getElementById("state-selector");
    container.addEventListener("change", filterStateData)
    for (let j = 0; j < members.length; j++) {
        var opt = document.createElement("option");
        opt.append(members[j].state);
        container.appendChild(opt);
    }
}

function buildStateTable(array) {
    var container = document.getElementById("state-table")
    container.innerHTML = "";
    var tbody = document.createElement("tbody");
    for (var j = 0; j < tableHeaders.length; j++) {
        var th = document.createElement("th");
        th.append(tableHeaders[j]);
        tbody.appendChild(th);
    }
    
    for (var i = 0; i < array.length; i++) {
        var tr = document.createElement("tr");
        var a = document.createElement("a");
        var fullName = array[i].first_name + " " + (array[i].middle_name || "") + " " + array[i].last_name;
        tr.insertCell().innerHTML = "<a target='blank' href='" + array[i].url + "'>" + fullName + "</a>";
        tr.insertCell().innerHTML = array[i].party;
        tr.insertCell().innerHTML = array[i].state;
        tr.insertCell().innerHTML = array[i].seniority;
        tr.insertCell().innerHTML = array[i].votes_with_party_pct + "&#37";
        tbody.appendChild(tr);
    }
    container.appendChild(tbody);
}




////var checkBoxes = document.getElementsByClassName("selector");
//for (var k = 0; k < checkBoxes.length; k++) {
//    checkBoxes[k].addEventListener("change", filterData);
//}
