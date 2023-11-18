

function openNav() {
    document.getElementById("full_SideBar").style.width = "250px";
    document.getElementById('pagecontent').style.marginLeft='250px';
    document.getElementsByClassName('sidebar_text')[0].style.visibility = 'visible';
    document.getElementsByClassName('sidebar_text')[1].style.visibility = 'visible';
    document.getElementsByClassName('sidebar_text')[2].style.visibility = 'visible';
    document.getElementsByClassName('sidebar_text')[3].style.visibility = 'visible';
    document.getElementsByClassName('sidebar_text')[4].style.visibility = 'visible';
    document.getElementById('sidebar_close').style.visibility = 'visible';
    document.getElementById('sidebar_open').style.visibility = 'hidden';


  }
  
  function closeNav() {
    document.getElementById("full_SideBar").style.width = "";
    document.getElementById('pagecontent').style.marginLeft='';
    document.getElementsByClassName('sidebar_text')[0].style.visibility = 'hidden';
    document.getElementsByClassName('sidebar_text')[1].style.visibility = 'hidden';
    document.getElementsByClassName('sidebar_text')[2].style.visibility = 'hidden';
    document.getElementsByClassName('sidebar_text')[3].style.visibility = 'hidden';
    document.getElementsByClassName('sidebar_text')[4].style.visibility = 'hidden';
    document.getElementById('sidebar_open').style.visibility = 'visible';
    document.getElementById('sidebar_close').style.visibility = 'hidden';


  }