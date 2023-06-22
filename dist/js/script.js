// eslint-disable-next-line
'use strict';

document.addEventListener('DOMContentLoaded', () => {

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

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        21,
        '.menu .container',
        'menu__item'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        '.menu .container',
        'menu__item'
    ).render();

    // теперь убираем те карточки которые были прописаны в HTML вручную.


    //  ---------------------------------------  Forms to server

    // получаем формы с сайта
    const forms = document.querySelectorAll('form');

    // создаем объект с разными сообщениями для разных сценариев
    const message = {
        loading: "img/form/spinner.svg",
        success: "Thanks! We'll contact you soon",
        failure: "Something went wrong..."
    };

    // подвязываем функцию postData к каждой форме
    forms.forEach(item => {
        postData(item);
    });

    // создаем функцию которая обрабатывает форму и отправляет на сервер 
    function postData(form) {
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

            // переводим FormData в обычный объект, который переводим в JSON
            const object = {};
            formData.forEach(function(value, key) {
                object[key] = value;
            });

            fetch('server.php', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(object)
            })
            .then(data => data.text())
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
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


    // подключаемся к dist/db.json
    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
});

