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