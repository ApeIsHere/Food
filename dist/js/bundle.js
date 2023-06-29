/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ (function(module) {

function calc() {
//  ---------------------------------------  Calculator

    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings (selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            } 

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    // если функция натыкается на return то она не выполняет весь последующий код
    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____'
            return;
        } 

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio',+e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();

            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

        
        calcTotal();
        });
    }

    getDynamicInformation("#height");
    getDynamicInformation("#weight");
    getDynamicInformation("#age");

} 

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ (function(module) {

function cards() {
    
//  ---------------------------------------  Classes for cards

class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.classes = classes;
        // передаем родителя в которого нужно помещать нашу карточку
        this.parent = document.querySelector(parentSelector);
        // это наш курс доллора к рублю, а что... все возможно (пока что ставим статическое число)
        this.rate = 30;
        // можем конвертировать цену сразу в конструкторе, а можем и при создании верстки render
        this.convertToRUB();
    }
    // предпологаем что цена придет в доллорах и нам нужно будет конвертировать ее в рубли
    convertToRUB() {
        this.price = this.price * this.rate;
    }

    // классическое название для создания верстки render
    render() {
        const element = document.createElement('div');

        // подставляем дефолтный класс если никакой другой не был передан
        if (this.classes.length === 0) {
            this.element = 'menu__item'
            element.classList.add(this.element);
        } else {
        // перебираем массив classes сформированный rest оператором
        this.classes.forEach(className => element.classList.add(className));
        }

        element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
            </div>
        `;

        // берем нашего родителя и через метод append(который есть у DOM элементов) помещаем в него нашу карточку element
        this.parent.append(element);
    }
}

// создаем новую карточку const div = new MenuCard();
// рендерим ее на страницу div.render();

// однако если мы просто хотим создать элемент и в дальнейшем он нам не понадобится
// нет необходимости помещать его в переменную, просто создаем, делаем нужные манипуляции и забываем про него


// функция которая помещает данные на страницу из базы данных
// fetch не реагирует на ошибки HTTP запросов 404, 500, 502 ...
// обрабатываем в ручную
// есть два свойства которые помогают в данном деле
// .ok .status (200, 404, 500 ...)
// нам понадобиться конструкция выбрасывающая новую ошибку throw new Error

const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Couldn't fetch ${url}, status ${res.status}`);
    }
    
    return await res.json();
};

// ({img, altimg ...}) это мы деструктуризуем объект вытаскиваем из него свойства
// getResource('http://localhost:3000/menu')
//     .then(data => {
        // data.forEach(({img, altimg, title, descr, price}) => {
        //     new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        // });
//     });

// Делаем то же самое, только при помощи библиотеки axios и ее встроенных методов

axios.get('http://localhost:3000/menu')
    .then(data => {            
        data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        });
    });

// Ниже приведен пример того как можно сделать то же самое, только без шаблонизации Classes 
// такой способ вполне можно применять, если нам не нужно постоянно делать какую то верстку

// getResource('http://localhost:3000/menu')
//     .then(data => createCard(data));

// function createCard(data) {
//     data.forEach(({img, altimg, title, descr, price}) => {
//         const element = document.createElement('div');

//         element.classList.add('menu__item');

//         element.innerHTML = `
//             <img src=${img} alt=${altimg}>
//             <h3 class="menu__item-subtitle">${title}</h3>
//             <div class="menu__item-descr">${descr}</div>
//             <div class="menu__item-divider"></div>
//             <div class="menu__item-price">
//                 <div class="menu__item-cost">Цена:</div>
//                 <div class="menu__item-total"><span>${price}</span> руб/день</div>
//             </div>
//         `;

//         document.querySelector('.menu .container').append(element);
//     });
// }

}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ (function(module) {

function forms() {
     //  ---------------------------------------  Forms to server

    // получаем формы с сайта
    const forms = document.querySelectorAll('form');

    // создаем объект с разными сообщениями для разных сценариев
    const message = {
        loading: "img/form/spinner.svg",
        success: "Thanks! We'll contact you soon",
        failure: "Something went wrong..."
    };

    // подвязываем функцию bindPostData к каждой форме
    forms.forEach(item => {
        bindPostData(item);
    });
    
    // Создаем функционал для общения с сервером
    // async await используются чтобы подождать ответа от сервера и он успел записаться в 
    // переменную res прежде чем ее обрабатывать далее. 
    // async ставится перед функцией
    // await ставится перед теми операциями которые мы хотим дождаться

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    // создаем функцию которая обрабатывает форму и отправляет на сервер 
    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData = new FormData(form);

            // переводим FormData массив массивов через entries, а затем обратно в объект через fromEntries
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(()=> {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.add('hide');
            closeModal();
        }, 4000);
    }
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

const { mode } = __webpack_require__(/*! ../../webpack.config */ "./webpack.config.js");

function modal() {
     // --------------------------------------- Modal Windows

     const modalTrigger = document.querySelectorAll('[data-modal]'),
     modal = document.querySelector('.modal');

 function openModal() {
     modal.classList.add('show');
     modal.classList.remove('hide');
     document.body.style.overflow = 'hidden'; // не позволяет скролить страницу с открытым модальным окном
     clearInterval(modalTimerId);
 }

 modalTrigger.forEach(btn => {
     btn.addEventListener('click', openModal);
 });

 function closeModal() {
     modal.classList.add('hide');
     modal.classList.remove('show');
     document.body.style.overflow = '';
 }

 modal.addEventListener('click', (e) => {
     if (e.target === modal || e.target.getAttribute('data-close') == '') {
         closeModal();
     }
 });
 // Закрываем Модальное окно по нажатию на Esacape
 document.addEventListener('keydown', (e) => {
     if (e.code === "Escape" && modal.classList.contains('show')) {
         closeModal();
     }
 });

 const modalTimerId = setTimeout(openModal, 50000);

 function showModalByScroll() {
     if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
         openModal();
         window.removeEventListener('scroll', showModalByScroll);
     }
 }

 window.addEventListener('scroll', showModalByScroll);

}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ (function(module) {

function slider() {
    //  ---------------------------------------  Slider

        // Slider Carousel harder version

        const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;

  let slideIndex = 1,
      offset = 0;

  if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
  } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
  }


  slidesField.style.width = 100 * slides.length + '%';
  slidesField.style.display = 'flex';
  slidesField.style.transition = '0.5s all';

  slidesWrapper.style.overflow = 'hidden';

  slides.forEach(slide => {
      slide.style.width = width;
  });

  slider.style.position = 'relative';

  const indicators = document.createElement('ol'),
        dots = [];
  indicators.classList.add('carousel-indicators');
  indicators.style.cssText = `
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 15;
      display: flex;
      justify-content: center;
      margin-right: 15%;
      margin-left: 15%;
      list-style: none;
  `;
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('li');
      dot.setAttribute('data-slide-to', i + 1);
      dot.style.cssText = `
          box-sizing: content-box;
          flex: 0 1 auto;
          width: 30px;
          height: 6px;
          margin-right: 3px;
          margin-left: 3px;
          cursor: pointer;
          background-color: #fff;
          background-clip: padding-box;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          opacity: .5;
          transition: opacity .6s ease;
       `;
       if (i == 0) {
          dot.style.opacity = 1;
       }
      indicators.append(dot);
      dots.push(dot);
  }

  function deleteNotDigits(str) {
      return +str.replace(/\D/g, '');
  }

  next.addEventListener('click', () => {
      if (offset == deleteNotDigits(width) * (slides.length - 1)){
          offset = 0;
      } else {
          offset += deleteNotDigits(width);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == slides.length) {
          slideIndex = 1;
      } else {
          slideIndex++;
      }

      if (slides.length < 10) {
          current.textContent = `0${slideIndex}`;
      } else {
          current.textContent = slideIndex;
      }

      dots.forEach(dot => dot.style.opacity = '.5');
      dots[slideIndex - 1].style.opacity = 1;
  });

  prev.addEventListener('click', () => {
      if (offset == 0){
          offset = deleteNotDigits(width) * (slides.length - 1);
      } else {
          offset -= deleteNotDigits(width);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == 1) {
          slideIndex = slides.length;
      } else {
          slideIndex--;
      }

      if (slides.length < 10) {
          current.textContent = `0${slideIndex}`;
      } else {
          current.textContent = slideIndex;
      }

      dots.forEach(dot => dot.style.opacity = '.5');
      dots[slideIndex - 1].style.opacity = 1;
  });

  dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
          const slideTo = e.target.getAttribute('data-slide-to');

          slideIndex = slideTo;
          offset = deleteNotDigits(width) * (slideTo - 1);

          slidesField.style.transform = `translateX(-${offset}px)`;

          if (slides.length < 10) {
              current.textContent = `0${slideIndex}`;
          } else {
              current.textContent = slideIndex;
          }

          dots.forEach(dot => dot.style.opacity = '.5');
          dots[slideIndex - 1].style.opacity = 1;
  
      });
  });


  // slider Easier version
  // showSlides(slideIndex);

  // устанавливаем общее количество слайдов
  // делаем это вне функции чтобы при каждом нажатии на кнопку переключения слайда, цифра не моргала
  // if (slides.length < 10) {
  //     total.textContent = `0${slides.length}`;
  // } else {
  //     total.textContent = slides.length;
  // }

  // function showSlides(n) {
  //     if (n > slides.length) {
  //         slideIndex = 1;
  //     }

  //     if (n < 1) {
  //         slideIndex = slides.length;
  //     }

  //     slides.forEach(item => item.style.display = 'none');

  //     slides[slideIndex - 1].style.display = 'block';

  //     if (slides.length < 10) {
  //         current.textContent = `0${slideIndex}`;
  //     } else {
  //         current.textContent = slideIndex;
  //     }
  // }

  // function plusSlides(n) {
  //     showSlides(slideIndex += n)
  // }

  // prev.addEventListener('click', () => {
  //     plusSlides(-1);
  // });

  // next.addEventListener('click', () => {
  //     plusSlides(1);
  // });
      
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ (function(module) {

function tabs() {
    // --------------------------------------- Tabs

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');

        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }
    // передаем параметр по умолчанию 0, то есть если не передать никакой аргумент, то подставится 0
    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target; // просто для сокращения кода

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ (function(module) {

function timer() {
    // --------------------------------------- Timer

    const deadline = '2023-08-10';

    // Вычисляет оставшееся время и возвращает объект с оставшимся временем
    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),      //Date.parse Превращает наш стринг в милисекунды
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),        // % возвращает остаток от деления на число (24)
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {         // эта функция подставляет ноль если число из одной цифры, например 9 = 09
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }


    // по selector находим обертку для таймера внутри которой лежат следующие элементы
    function setClock(selector, endtime) {
        // в endtime передаем нашу дату deadline
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            // запускаем функцию каждую секунду, чтобы обновлялся таймер на странице
            timeInterval = setInterval(updateClock, 1000);

        // вызываем функцию чтобы не ждать 1000мс из timeInterval до первого вызова и избежать моргания при обновление страницы
        updateClock();

        function updateClock() {
            // прямо здесь вызываем нашу функцию которая считает разницу между текущей датой и deadline
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);


            // Удаляем интервал когда наступит deadline
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);
    
}

module.exports = timer;

/***/ }),

/***/ "./webpack.config.js":
/*!***************************!*\
  !*** ./webpack.config.js ***!
  \***************************/
/***/ (function(module) {

"use strict";
var __dirname = "/";


module.exports = {
  mode: 'development',
  entry: './js/script.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/js'
  },
  watch: true,

  devtool: "source-map",

  module: {}
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
// eslint-disable-next-line


document.addEventListener('DOMContentLoaded', () => {
    const calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
          slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
          tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");


    calc();
    cards();
    forms();
    modal();
    slider();
    tabs();
    timer();
});


}();
/******/ })()
;
//# sourceMappingURL=bundle.js.map