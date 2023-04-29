import './style.css';

function localStorageHandle(data){
    if(data.mode == "find"){
        localStorage.getItem("totalvids") ? document.getElementById("totalvids").innerText = localStorage.getItem("totalvids") : document.getElementById("totalvids").innerText = 0;
        localStorage.getItem("vidswatched") ? document.getElementById("vidswatched").innerText = localStorage.getItem("vidswatched") : document.getElementById("vidswatched").innerText = 0;
        localStorage.getItem("percentwatched") ? document.getElementById("percentwatched").setAttribute("data-tip", localStorage.getItem("percentwatched")) : document.getElementById("percentwatched").setAttribute("data-tip", "0");
        localStorage.getItem("percentwatchedvisual") ? document.getElementById("percentwatchedvisual").setAttribute("value", localStorage.getItem("percentwatchedvisual")) : document.getElementById("percentwatchedvisual").setAttribute("value", 0);

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

document.getElementById("drophead").addEventListener("click", e => {
    const body = e.currentTarget.nextElementSibling;
    if(!body.style.maxHeight || body.style.maxHeight === "0px"){
        body.style.maxHeight = `${body.scrollHeight}px`;
        document.getElementsByClassName("fa-pen")[0].classList.remove("fa-fade");
    } else {
        body.style.maxHeight = "0px";
        document.getElementsByClassName("fa-pen")[0].classList.add("fa-fade");
    }  
});

document.getElementById("dropbody").addEventListener("resize", e => {
    if(e.style.maxHeight && e.style.maxHeight !== "0px"){
        e.style.maxHeight = `${e.scrollHeight}px`;
    }
})