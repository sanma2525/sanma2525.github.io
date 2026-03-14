const css = document.getElementById('style');
 function isPhone(){
        if(window.innerWidth < 500){
            css.innerHTML = "<link rel='stylesheet' href='phone.css'>";
        }else{
            css.innerHTML = "<link rel='stylesheet' href='desktop.css'>";
        }
 }