let senateUrl = "https://api.propublica.org/congress/v1/113/senate/members.json";
let houseUrl = "https://api.propublica.org/congress/v1/113/house/members.json";





getData(senateUrl)
getData(houseUrl)


function getData(url) {

    fetch(url, {
            method: "GET",
            headers: {
                "X-API-Key": "y4GdOeUJNzi36ye8ISrsV5Fstamv7Ab0NNYJGOEA"
            }
        })
        .then(r => r.json())
        .then(data => {
                console.log(data)
        })
        .catch(err => console.log(err))

}




