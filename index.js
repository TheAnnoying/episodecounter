import "./style.css";

function localStorageHandle(data){
    if(data.mode == "find"){
        localStorage.getItem("totalvids") ? document.getElementById("totalvids").innerText = localStorage.getItem("totalvids") : document.getElementById("totalvids").innerText = 0;
        localStorage.getItem("vidswatched") ? document.getElementById("vidswatched").innerText = localStorage.getItem("vidswatched") : document.getElementById("vidswatched").innerText = 0;
        localStorage.getItem("percentwatched") ? document.getElementById("percentwatched").setAttribute("data-tip", localStorage.getItem("percentwatched")) : document.getElementById("percentwatched").setAttribute("data-tip", "0");
        localStorage.getItem("percentwatchedvisual") ? document.getElementById("percentwatchedvisual").setAttribute("value", localStorage.getItem("percentwatchedvisual")) : document.getElementById("percentwatchedvisual").setAttribute("value", 0);
        localStorage.getItem("playlisttoggle") === "true" ? document.getElementById("playlisttoggle").checked = true : document.getElementById("playlisttoggle").checked = false;
        localStorage.getItem("playlistform") ? document.getElementById("playlistform").value = localStorage.getItem("playlistform") : null;
        localStorage.getItem("theme") ? document.documentElement.setAttribute("data-theme", localStorage.getItem("theme")) : document.body.setAttribute("data-theme", "garden")

        localStorage.getItem("vidswatched") > localStorage.getItem("totalvids")
            ? document.getElementById("percentwatchedvisual").classList.add("progress-error")
            : null;

        localStorage.getItem("vidswatched") == localStorage.getItem("totalvids")
            ? document.getElementById("percentwatchedvisual").classList.add("progress-success")
            : null;

    } else if(data.mode == "set"){
        localStorage.setItem("totalvids", document.getElementById("totalvids").innerText);
        localStorage.setItem("vidswatched", document.getElementById("vidswatched").innerText);
        localStorage.setItem("percentwatched", document.getElementById("percentwatched").getAttribute("data-tip"));
        localStorage.setItem("percentwatchedvisual", document.getElementById("percentwatchedvisual").getAttribute("value"));
    } else if(data.mode == "reset"){
        localStorage.clear();
        location.reload();
    }
}

localStorageHandle({ mode: "find" });

const totalVideos = document.getElementById("totalvids");
const videosWatched = document.getElementById("vidswatched")

if(document.getElementById("playlisttoggle").checked){
    document.getElementById("plustotal").classList.add("btn-disabled")
    document.getElementById("totalvidsradio").classList.add("hidden");
    document.getElementById("playlistupdate").classList.remove("btn-disabled");
} else {
    document.getElementById("plustotal").classList.remove("btn-disabled");
    document.getElementById("totalvidsradio").classList.remove("hidden");
    document.getElementById("playlistupdate").classList.add("btn-disabled");
};


const addTo = (element, amount, mode) => {
    mode == "add" ? element.innerText = parseInt(element.innerText)+amount : element.innerText = amount;

    const percentage = (parseInt(videosWatched.innerText)/parseInt(totalVideos.innerText))*100;

    document.getElementById("percentwatched").setAttribute("data-tip", `${percentage.toFixed(2)}% Watched`)
    document.getElementById("percentwatchedvisual").setAttribute("value", percentage.toFixed(2));

    +videosWatched.innerText > +totalVideos.innerText
        ? document.getElementById("percentwatchedvisual").classList.add("progress-error")
        : document.getElementById("percentwatchedvisual").classList.remove("progress-error");

    +videosWatched.innerText == +totalVideos.innerText
        ? document.getElementById("percentwatchedvisual").classList.add("progress-success")
        : document.getElementById("percentwatchedvisual").classList.remove("progress-success");

    localStorageHandle({ mode: "set" });
};

document.getElementById("pluswatched").addEventListener("click", () => addTo(videosWatched, 1, "add"));
document.getElementById("plustotal").addEventListener("click", () => addTo(totalVideos, 1, "add"));
document.getElementById("reset").addEventListener("click", () => { localStorageHandle({ mode: "reset" }) });

document.getElementById('custominputform').onkeydown = function(e){
    if(["e", "+", "-"].includes(e.key)) e.preventDefault();
    if(e.key == 'Enter'){
        if(document.getElementById("vidswatchedradio").checked){
            addTo(videosWatched, parseInt(document.getElementById("custominputform").value), "set");
            document.getElementById("custominputform").value = null;
        } else if(document.getElementById("totalvidsradio").checked){
            addTo(totalVideos, parseInt(document.getElementById("custominputform").value), "set");
            document.getElementById("custominputform").value = null;
        }
    }
};

document.getElementById("playlistform").addEventListener("input", e => {
    localStorage.setItem("playlistform", e.target.value);
});

document.querySelectorAll(".drop-button").forEach(e => 
    e.addEventListener("click", e => {
        const clickedIndex = Array.from(e.currentTarget.parentNode.children).indexOf(e.currentTarget);
        const bodies = Array.from(e.currentTarget.parentNode.parentNode.querySelectorAll(".drop-body"));
        const body = bodies.splice(clickedIndex, 1)[0];

        bodies.forEach(e => e.style.maxHeight = "0px");
        if(!body.style.maxHeight || body.style.maxHeight === "0px") {
            body.style.maxHeight = `${body.scrollHeight}px`
            document.getElementsByClassName("fa-pen")[0].classList.remove("fa-fade");
        } else {
            body.style.maxHeight = "0px";
            document.getElementsByClassName("fa-pen")[0].classList.add("fa-fade");
        }
    }
));

document.getElementById("playlisttoggle").addEventListener("click", () => {
    localStorage.setItem("playlisttoggle", document.getElementById("playlisttoggle").checked);
    if(document.getElementById("playlisttoggle").checked){
        document.getElementById("plustotal").classList.add("btn-disabled")
        document.getElementById("totalvidsradio").classList.add("hidden");
        document.getElementById("playlistupdate").classList.remove("btn-disabled");
    } else {
        document.getElementById("plustotal").classList.remove("btn-disabled");
        document.getElementById("totalvidsradio").classList.remove("hidden");
        document.getElementById("playlistupdate").classList.add("btn-disabled");
    };
});

document.getElementById("playlistupdate").addEventListener("click", async e => {
    const match = document.getElementById("playlistform").value.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:playlist\?list=)([a-zA-Z0-9-_]{34})/);
    
    if(match && document.getElementById("playlisttoggle").checked){
        e.target.classList.add("loading");

        document.getElementsByClassName("alert-success")[0].parentElement.classList.remove("opacity-0");
        setTimeout(() => document.getElementsByClassName("toast")[0].classList.add("opacity-0"), 5000);

        addTo(totalVideos, (await (await fetch(`https://inv.riverside.rocks/api/v1/playlists/${match[1]}`)).json()).videoCount, "set");
        e.target.classList.remove("loading");
    } else if(!match && document.getElementById("playlisttoggle").checked) {
        document.getElementsByClassName("alert-error")[0].parentElement.classList.remove("opacity-0");
        setTimeout(() => document.getElementsByClassName("toast")[1].classList.add("opacity-0"), 5000);
    };

});

document.getElementById("themecheckbox").addEventListener("click", (e) => {
    e.target.checked
        ? document.documentElement.setAttribute("data-theme", "dracula")
        : document.documentElement.setAttribute("data-theme", "garden");

    localStorage.setItem("theme", e.target.checked ? "dracula" : "garden");
});