// Navbar buttons
// home button
const homebutton = document.querySelector('#homebutton');
const home = document.querySelector('#home');

homebutton.addEventListener('click', function (e) {
  const homecoords = home.getBoundingClientRect();
  console.log(homecoords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (x/y)', window.scrollX, scrollY);
});
