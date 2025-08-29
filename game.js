let money = 50;
let inventory = {};
let pot = false;

const dishes = {
    "Жареный рис": {"Рис":1,"Морковь":1,"Яйцо":1},
    "Суп кимчи": {"Кимчи":1,"Вода":1,"Тофу":1},
    "Бибимбап": {"Рис":1,"Мясо":1,"Морковь":1,"Яйцо":1},
    "Пульгоги": {"Мясо":2,"Соевый соус":1},
    "Кимчи пицца": {"Кимчи":1,"Тесто":1,"Сыр":1},
    "Десерт рисовый": {"Рис":1,"Сахар":1,"Молоко":1},
    "Токпокки": {"Рисовые клецки":1,"Соус чили":1},
    "Салат из моркови": {"Морковь":2,"Масло":1},
    "Рамен": {"Лапша":1,"Бульон":1,"Яйцо":1},
    "Кимчи рис": {"Рис":1,"Кимчи":1}
};

const store = {
    "Рис":5,"Морковь":3,"Яйцо":2,"Кимчи":7,
    "Мясо":10,"Соевый соус":4,"Тесто":5,"Сыр":4,
    "Сахар":2,"Молоко":3,"Рисовые клецки":4,
    "Соус чили":3,"Масло":2,"Лапша":3,"Бульон":4,"Тофу":5
};

// Обновление статуса
function updateStatus() {
    let invText = Object.keys(inventory).length
        ? Object.entries(inventory).map(([k,v])=>${k}: ${v}).join("\n")
        : "Пусто";
    document.getElementById("status").innerText = 
        Деньги: ${money}₩\nИнвентарь:\n${invText}\nЕсть кастрюля: ${pot ? 'Да' : 'Нет'};
}

// Сообщения
function updateMessages(text, delay=3000) {
    const msg = document.getElementById("messages");
    msg.innerText = text;
    if(delay>0) setTimeout(()=>msg.innerText="", delay);
}

// Работа
function work() {
    const earnings = Math.floor(Math.random()*11)+5;
    money += earnings;
    updateMessages(Вы заработали ${earnings}₩);
    updateStatus();
}

// Магазин
function showShop() {
    let shopText = "=== Магазин ===\n";
    for(const item in store) shopText += ${item}: ${store[item]}₩\n;
    updateMessages(shopText);
}

// Купить продукт
function buyProduct() {
    let product = prompt("Введите название продукта:");
    if(!product || !store[product]) {
        updateMessages("Неверный продукт");
        return;
    }
    let amount = parseInt(prompt(Сколько ${product} купить?));
    if(isNaN(amount)||amount<1){updateMessages("Покупка отменена");return;}
    let total = store[product]*amount;
    if(money>=total){
        money-=total;
        inventory[product]=(inventory[product]||0)+amount;
        updateMessages(Вы купили ${amount} ${product});
    } else updateMessages("Недостаточно денег!");
    updateStatus();
}

// Купить кастрюлю
function buyPot() {
    if(pot){updateMessages("У вас уже есть кастрюля");return;}
    if(money>=20){money-=20;pot=true;updateMessages("Вы купили кастрюлю!");}
    else updateMessages("Недостаточно денег!");
    updateStatus();
}

// Готовка
function cook() {
    if(!pot){updateMessages("У вас нет кастрюли!");return;}
    let dish = prompt("Введите название блюда:");
    if(!dish || !dishes[dish]){updateMessages("Неверное блюдо");return;}
    let missing=[];
    for(const ing in dishes[dish]){
        let need=dishes[dish][ing]- (inventory[ing]||0);
        if(need>0) missing.push(${ing} x${need});
    }
    if(missing.length>0){updateMessages(Недостаточно ингредиентов: ${missing.join(", ")});return;}
    let confirm = prompt(Готовим ${dish}? Напишите 'да' чтобы продолжить);
    if(!confirm || confirm.toLowerCase()!=="да"){updateMessages("Готовка отменена");return;}
    for(const ing in dishes[dish]) inventory[ing]-=dishes[dish][ing];
    inventory[dish]=(inventory[dish]||0)+1;
    updateMessages(Вы приготовили ${dish});
    updateStatus();
}

// Продажа
function sell() {
    let sellable = Object.keys(inventory).filter(item=>dishes[item]);
    if(sellable.length===0){updateMessages("Нет блюд для продажи");return;}
    let item = sellable[Math.floor(Math.random()*sellable.length)];
    let price = Math.floor(Math.random()*21)+10;
    if(Math.random()<0.2){money-=10;updateMessages("Вас поймали и выписали штраф 10₩!");}
    else {inventory[item]-=1;money+=price;updateMessages(Вы продали ${item} за ${price}₩);}
    updateStatus();
}

// Кулинарная книга
function showCookbook() {
    let text = "=== Кулинарная книга ===\n";
    for(const dish in dishes){
        let ing = Object.entries(dishes[dish]).map(([k,v])=>${k} x${v}).join(", ");
        text += ${dish}: ${ing}\n;
    }
    updateMessages(text, 5000);
}

// Инициализация
updateStatus();