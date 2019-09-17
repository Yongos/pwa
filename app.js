
//Inscription service worker
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/sw.js").then(function(){
        console.log("SW inscrit");
    });
};




//Gestion affichage menu
let bouton_menu = document.querySelector(".menu-burger");
let menu = document.querySelector("header nav");
document.addEventListener('click', affichermenu)

bouton_menu.addEventListener("click",menuselect);


function menuselect()
{
    menu.classList.add("active");
}


function affichermenu()
{
    var menu = document.querySelector('header nav');

    //console.log(event.target);
    if (!event.target.matches('.menu-burger') && !event.target.matches('header nav')){
        //console.log("That's not a burgermenu and nav");
        if(menu.classList.contains('active')) {
            menu.classList.remove("active")
        }

        }
    return;
}


