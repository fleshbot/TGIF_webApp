var members = data.results[0].members;

//JSON paths
var senateD = statistics[0].stats[0];
var senateR = statistics[0].stats[1];
var senateI = statistics[0].stats[2];
var senateTot = statistics[0].stats[3];

var checkedParty = [];
var selectedState = "";
var headers_allMembers = ["Senator", "Party Affiliation", "State", "Seniority", "Votes with Party"];
var headers_atGlanceTable = ["Party", "No. of Reps", "Voted with Party (%)"];
var headers_engagementTable = ["Name", "No. Missed Votes", "Missed (%)"];
var headers_LoyaltyTable = ["Name", "No. Party Votes", "Party votes (%)"];
var filteredArray = [];
var selectedStateData = [];
buildDropdown();
buildTable(members);

//Data variables- Exercise 3
var democrats = [];
var republicans = [];
var independents = [];

//Least Loyal 10%
var members_LeastLoyal = [];
senateTot.leastLoyal = members_LeastLoyal;

//Most Loyal 10%
var members_MostLoyal = [];
senateTot.mostLoyal = members_MostLoyal;

//Missed least votes
var members_MostEngaged = [];
senateTot.mostEngaged = members_MostEngaged;

//Missed most votes
var members_LeastEngaged = [];
senateTot.leastEngaged = members_LeastEngaged;

splitByParty();
numberOfMembers();

//Generate array: partyArray, outArray bottom 10% (numerical), outArray top 10% (numerical), key Value that top/bottom is calculated on. "Pass as string"
calcLoyalty(members, members_LeastLoyal, members_MostLoyal, "votes_with_party_pct");
calcLoyalty(members, members_MostEngaged, members_LeastEngaged, "missed_votes");

//Pushing avg votes into data object
senateD.avgVoteswithParty = calcAvgVotes(democrats);
senateR.avgVoteswithParty = calcAvgVotes(republicans);
senateI.avgVoteswithParty = calcAvgVotes(independents);

//build atGlanceTable
build_atGlanceTable("atGlanceTable", headers_atGlanceTable, statistics[0].stats);

//build tables for Senate Attendance Page
if (location.pathname == "/senate_attendance.html" || location.pathname == "/house_attendance.html") {
    table_loyalAndEngagement("leastEngagedTable", headers_LoyaltyTable, statistics[0].stats[3].leastLoyal, "total_votes", "votes_with_party_pct");
    table_loyalAndEngagement("mostEngagedTable", headers_LoyaltyTable, statistics[0].stats[3].mostLoyal, "total_votes", "votes_with_party_pct");
}
//Loyalty page
if (location.pathname == "/senate_loyalty.html" || location.pathname == "/house_loyalty.html") {
    table_loyalAndEngagement("leastLoyalTable", headers_engagementTable, statistics[0].stats[3].leastEngaged, "missed_votes", "missed_votes_pct");
    table_loyalAndEngagement("mostLoyalTable", headers_engagementTable, statistics[0].stats[3].mostEngaged, "missed_votes", "missed_votes_pct");
}
//Creates checkboxes- applies event listeners
var checkBoxes = document.getElementsByClassName("selector");
for (var i = 0; i < checkBoxes.length; i++) {
    checkBoxes[i].addEventListener("change", filterData);
}

//Creates dropdown menu- applies event listeners
function buildDropdown() {
    var container = document.getElementById("state-selector");
    if (container) {
        container.addEventListener("change", filterData)
        for (var i = 0; i < members.length; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", members[i].state)
            opt.append(members[i].state);
            container.appendChild(opt);
        }
    }
}

//Filters table data based on 2 inputs
function filterData() {
    var checkedParty = Array.from(document.querySelectorAll('input[name=party]:checked')).map(elt => elt.value);
    selectedState = document.getElementById("state-selector").value;
    var filteredArray = members.filter(member => (checkedParty.includes(member.party) || checkedParty == "") && (selectedState == member.state || selectedState == "all"));
    buildTable(filteredArray)
}

//Builds table
function buildTable(array) {
    var checkboxContainer = document.getElementById("senate-data");
    if (checkboxContainer) {
        checkboxContainer.innerHTML = "";
        var tbody = document.createElement("tbody");
        for (var j = 0; j < headers_allMembers.length; j++) {
            var th = document.createElement("th");
            th.append(headers_allMembers[j]);
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
        checkboxContainer.appendChild(tbody);
    }
}

//Splitting members array into three parties (D,R,I)
function splitByParty() {
    for (let i = 0; i < members.length; i++) {
        if (members[i].party == "D") {
            democrats.push(members[i]);
        } else if (members[i].party == "R") {
            republicans.push(members[i]);
        } else {
            independents.push(members[i]);
        }
    }
}

//Number of members per party and push to array
function numberOfMembers() {
    senateD.memberCount = democrats.length;
    senateR.memberCount = republicans.length;
    senateI.memberCount = independents.length;
    senateTot.memberCount = members.length;
}

///Calculate average votes w/party
function calcAvgVotes(arr) {
    var votesWithPartySum = arr.reduce(function (sum, d) {
        return (sum + d.votes_with_party_pct / arr.length)
    }, 0);
    return votesWithPartySum;
}

//Identify and create a new array of top and bottom 10%
function calcLoyalty(arrIn, arrOutLeast, arrOutMost, keyValue) {
    arrIn.sort((a, b) => a[keyValue] - b[keyValue])
    for (let i = 0; i < arrIn.length; i++) {
        if (arrIn[i][keyValue] <= arrIn[Math.floor(arrIn.length * 0.1)][keyValue]) {
            arrOutLeast.push(arrIn[i]);
        } else {
            break;
        }
    }
    for (let j = arrIn.length - 1; j > 0; j--) {
        if (arrIn[j][keyValue] >= arrIn[Math.floor(arrIn.length * 0.9)][keyValue]) {
            arrOutMost.push(arrIn[j]);
        } else {
            break;
        }
    }
}

//Build and populate atGlanceTable
function build_atGlanceTable(tableId, headersArray, data) {
    var table = document.getElementById("atGlanceTable")
    if (table) {
        var tb = document.createElement("tbody")
        table.appendChild(tb)
        var th = document.createElement("th");
        for (var i = 0; i < headersArray.length; i++) {
            var th = document.createElement("th");
            th.append(headersArray[i]);
            tb.appendChild(th);
        }
        for (let k = 0; k < 4; k++) {
            var tr = document.createElement("tr");
            tr.insertCell().innerHTML = data[k].name;
            tr.insertCell().innerHTML = Math.round(data[k].memberCount);
            if (data[k].name == "Total") {
                tr.insertCell().innerHTML =
                    Math.round(((data[0].memberCount * (data[0].avgVoteswithParty / 100)) +
                        (data[1].memberCount * (data[1].avgVoteswithParty / 100)) +
                        (data[2].memberCount * (data[2].avgVoteswithParty / 100)))) + "%";
            } else {
                tr.insertCell().innerHTML = Math.round(data[k].avgVoteswithParty) + "%";
            }
            tb.appendChild(tr);
        }
    }
}

//Build and populate top and bottom 10% tables
function table_loyalAndEngagement(tableID, headersArray, data, col2, col3) {
    var table = document.getElementById(tableID)
    var tb = document.createElement("tbody")
    table.appendChild(tb)
    for (var i = 0; i < headersArray.length; i++) {
        var th = document.createElement("th");
        th.append(headersArray[i]);
        tb.appendChild(th);
    }
    for (let k = 0; k < data.length; k++) {
        var tr = document.createElement("tr");
        var fullName = data[k].first_name + " " + (data[k].middle_name || "") + " " + data[k].last_name;
        
        tr.insertCell().innerHTML = "<a target='blank' href='" + data[k].url + "'>" + fullName + "</a>";
        tr.setAttribute("class", "leftCol")
        if (col2 == "total_votes") {
            tr.insertCell().innerHTML = Math.round((data[k][col2]) * (data[k][col3] / 100));
        } else {
            tr.insertCell().innerHTML = Math.round(data[k][col2]);
        }
        tr.insertCell().innerHTML = Math.round(data[k][col3]) + "%";
        tb.appendChild(tr);

    }
}
