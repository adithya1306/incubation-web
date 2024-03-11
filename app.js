// import { CountUp } from './countUp.min.js';
const nav = document.querySelector(".nav-main-mobile");
const hamburger = document.querySelector(".hamburger");

function menuToggle(e) {
  nav.classList.toggle("nav-main-hide-mobile");
  hamburger.children[0].classList.toggle("x");
  hamburger.children[2].classList.toggle("y");
  hamburger.children[1].classList.toggle("x-fade");
}

const swiper = new Swiper(".main-swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: true,
  spaceBetween: 20,
  autoplay: {
    delay: 5000,
    disableOnInteraction: true,
  },
  keyboard: {
    enabled: true,
  },
  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const projectsSwiper = new Swiper(".projects-swiper", {
  loop: true,
  slidesPerView: "auto",
  centeredSlides: true,
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    clickable: false,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

AOS.init();

var lastScrollTop = 0;

// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
window.addEventListener(
  "scroll",
  function () {
    // or window.addEventListener("scroll"....
    var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"

    if (screen.width >= 575) {
      if (
        window.pageYOffset >= 500 ||
        document.documentElement.scrollTop >= 500
      ) {
        document.querySelector(".underline").classList.add("underline-reveal");
      } else if (
        window.pageYOffset <= 400 ||
        document.documentElement.scrollTop <= 400
      ) {
        document
          .querySelector(".underline")
          .classList.remove("underline-reveal");
      }
      if (
        window.pageYOffset >= 900 ||
        document.documentElement.scrollTop >= 900
      ) {
        document
          .querySelectorAll(".underline-points")
          .forEach((e) => e.classList.add("underline-reveal"));
      } else if (
        window.pageYOffset <= 700 ||
        document.documentElement.scrollTop <= 700
      ) {
        document
          .querySelectorAll(".underline-points")
          .forEach((e) => e.classList.remove("underline-reveal"));
      }

      if (st > lastScrollTop) {
        document.querySelector(".nav-main").classList.add("nav-main-hide");
      } else if (st < lastScrollTop) {
        document.querySelector(".nav-main").classList.remove("nav-main-hide");
      } // else was horizontal scroll
      lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    } else {
      document.querySelector(".underline").classList.add("underline-reveal");
      document
        .querySelectorAll(".underline-points")
        .forEach((e) => e.classList.add("underline-reveal"));
    }
  },
  false
);

const navLinks = document.querySelectorAll('a[href^="#"]');
//console.log(navLinks)
navLinks.forEach((anchor, i) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

if (screen.width < 575)
  document.querySelectorAll(".point-card").forEach((card) => {
    card.setAttribute("data-aos", "fade-right");
  });

//obtain from external JSON file later
let galleryImgs = [
  { imgSrc: "images/1.jpeg", desc: "CIBA MoU" },
  { imgSrc: "images/2.jpeg", desc: "Vanakkam Startups" },
  { imgSrc: "images/3.jpeg", desc: "Tamilnadu Startups" },
  { imgSrc: "images/4.jpeg", desc: "TIEMA EXPO" },
  { imgSrc: "images/Discussion With CIBA.jpg", desc: "Discussion with CIBA" },
  {
    imgSrc: "images/Discussion with Mailswamy annadurai(1).jpeg",
    desc: "Discussion with Dr.Mayilsami",
  },
  {
    imgSrc: "images/Discussion with Mailswamy Sivam.jpeg",
    desc: "Dicussion with Dr.Sivam",
  },
  { imgSrc: "images/11.jpg", desc: "CTS Innovation" },
  { imgSrc: "images/14.jpg", desc: "Underwater Vehicle Team" },
  { imgSrc: "images/caro-2.jpg", desc: "UMAGINE - Sathyabama TBI" },
  { imgSrc: "images/MoU with AIIRF.jpg", desc: "MoU with AIIRF" },
];
let galleryCount = galleryImgs.length - 3;

const gallerySection = document.querySelector(".gallery-images");

galleryImgs.forEach((galImage) => {
  gallerySection.innerHTML += `<div class="gallery-image"><img loading="lazy" src="${galImage.imgSrc}" alt="${galImage.desc}"><div src="${galImage.imgSrc}" alt="${galImage.desc}" class="text-gradient">${galImage.desc}</div></div>`;
});

const opener = (document.querySelector(
  ".gallery-open"
).innerHTML += `<i class="fa fa-angle-down"></i> &nbsp; ${galleryCount} more`);

const openGallery = () => {
  document.querySelector("#gallery").scrollIntoView({ behavior: "smooth" });
  document
    .querySelector(".gallery-images")
    .classList.toggle("gallery-images-show");
  // document.querySelector(".gallery-gradient").classList.toggle("gallery-gradient-hide");
};

document.querySelector(".gallery-gradient").addEventListener("click", (e) => {
  document
    .querySelector(".gallery-gradient")
    .classList.toggle("gallery-gradient-hide");
  openGallery();
});

let galModal = document.querySelector(".gallery-modal");

const modalOpen = () => {
  galModal.classList.toggle("gallery-modal-open");
  document.body.classList.toggle("no-scroll");
  let navCheck = document.querySelector(".nav-main");
  if (navCheck.classList.length == 1 && screen.width > 575) {
    navCheck.classList.toggle("nav-main-hide");
  }
};

const galleryImages = document
  .querySelectorAll(".gallery-image")
  .forEach((element) => {
    element.addEventListener("click", (e) => {
      //console.log(galModal.children[0]); //change to galModal.children
      let galTop = window.pageYOffset || document.documentElement.scrollTop;
      galModal.style.top = `${galTop}px`;
      modalOpen(); //modal ku add a div and then add the images to cover it
      galModal.children[0].children[0].setAttribute(
        "src",
        `${e.target.getAttribute("src")}`
      );
      galModal.children[0].children[0].setAttribute(
        "alt",
        `${e.target.getAttribute("alt")}`
      );
      galModal.children[0].children[1].innerText = `${e.target.getAttribute(
        "alt"
      )}`;
    });
  });

Splitting();
ScrollOut({
  targets: "[data-splitting]",
});

const fundCountUpOptions = {
  decimalPlaces: 2,
  duration: 3,
  enableScrollSpy: true,
  suffix: "  Cr +",
};

var fundsCountUp = new countUp.CountUp(
  "fund-countup",
  1.01,
  fundCountUpOptions
);
if (!fundsCountUp.error) {
  fundsCountUp.start();
} else {
  console.error(fundsCountUp.error);
}

const companyCountUpOptions = {
  duration: 3,
  enableScrollSpy: true,
  suffix: " +",
};

var companyCountUp = new countUp.CountUp(
  "company-countup",
  85,
  companyCountUpOptions
);
if (!companyCountUp.error) {
  companyCountUp.start();
} else {
  console.error(companyCountUp.error);
}

// Fetch DPIIT startups
fetch('http://localhost:9000/getdpiit')
    .then(response => response.json())
    .then(data => {
        const dpiitStartups = document.getElementById('dpiit-startups');
        if (Array.isArray(data.dpiit)) {
            data.dpiit.forEach((startup, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${startup.name}`;
                dpiitStartups.appendChild(listItem);
            });
        } else {
            console.error('Invalid DPIIT startup data:', data);
        }
    })
    .catch(error => console.error('Error fetching DPIIT startups:', error));

// Fetch non-DPIIT startups
fetch('http://localhost:9000/getnondpiit')
    .then(response => response.json())
    .then(data => {
        const nonDpiitStartups = document.getElementById('non-dpiit-startups');
        if (Array.isArray(data.nondpiit)) {
            data.nondpiit.forEach((startup, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${startup.name}`;
                nonDpiitStartups.appendChild(listItem);
            });
        } else {
            console.error('Invalid non-DPIIT startup data:', data);
        }
    })
    .catch(error => console.error('Error fetching non-DPIIT startups:', error));


fetch('http://localhost:9000/carousel-images/')
.then(response => response.json())
.then(data => {
    data.img.forEach(url => {
        console.log(url);
        const swiperWrapper = document.getElementById('swiperWrapper');
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide');

        const img = document.createElement('img');
        img.setAttribute('loading', 'lazy');
        img.setAttribute('src', url);
        img.setAttribute('alt', '');

        const textGradient = document.createElement('div');
        textGradient.classList.add('text-gradient');

        swiperSlide.appendChild(img);
        swiperSlide.appendChild(textGradient);

        swiperWrapper.appendChild(swiperSlide);
    });
})
.catch(error => {
    console.error('Error fetching image URLs:', error);
});
    
    //   fetch('http://localhost:9000/logo-images/')
    //   .then(response => response.json())
    //   .then(data => {
    //     data.forEach(url => {
    //       console.log(url);
    //       const marquee = document.getElementsByClassName("marquee-content");
      
    //       const img = document.createElement('img');
    //       img.setAttribute('loading', 'lazy');
    //     img.setAttribute('src', url);
    //     img.setAttribute('alt', '');
    
    //     marquee.appendChild(img);
    //   })
    // })
    