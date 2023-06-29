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