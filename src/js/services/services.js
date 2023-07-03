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

// функция которая помещает данные на страницу из базы данных
// fetch не реагирует на ошибки HTTP запросов 404, 500, 502 ...
// обрабатываем в ручную
// есть два свойства которые помогают в данном деле
// .ok .status (200, 404, 500 ...)
// нам понадобиться конструкция выбрасывающая новую ошибку throw new Error

async function getResource (url) {
    let res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Couldn't fetch ${url}, status ${res.status}`);
    }
    
    return await res.json();
};


    export { postData };
    export { getResource };