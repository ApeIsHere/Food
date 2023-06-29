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