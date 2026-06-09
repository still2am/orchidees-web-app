let productsContainer = document.querySelector(".products .container");
let imgesArr = [];

let names = [
    "Голубая мечта", "Чистая классика", "Яркое очарование", "Цветение лилии",
    "Радостный букет", "Розовая гербера", "Сладкая весна", "Классический шарм",
    "Садовая вечеринка", "Тепло сердца", "Летний коттедж", "Дикая красота"
];

let prices = [1000, 1000, 1200, 1400, 1800, 1300, 1600, 1900, 1500, 900, 1000, 1100];

for (let i = 0; i < names.length; i++) {
    imgesArr[i] = `images/p1 (${i+1}).jpg`;
}

let index = 0;
for (let i = 0; i < 3; i++) {
    let row = document.createElement("div");
    row.className = "row mb-4"; 
    
    for (let j = 0; j < 4; j++) {
        let currentIndex = index; 
        let box = document.createElement("div");
        let image = document.createElement("div");
        let text = document.createElement("div");

        box.className = "box col-md-3 col-sm-6 d-flex flex-column mb-4";
        image.className = "image";
        text.className = "text mt-2 d-flex flex-column justify-content-between flex-grow-1";

        let img = document.createElement("img");
        img.className = "img-fluid w-100"; 
        img.src = imgesArr[currentIndex];
        
        let titleWrapper = document.createElement("div");
        titleWrapper.style.minHeight = "60px"; 
        titleWrapper.style.display = "flex";
        titleWrapper.style.alignItems = "center";
        titleWrapper.style.justifyContent = "center";

        let head2 = document.createElement("h2");
        head2.className = "name m-0";
        head2.innerHTML = names[currentIndex];
        titleWrapper.appendChild(head2);
        
        let para = document.createElement("p");
        para.className = "price mt-2 mb-3";
        para.innerHTML = `${prices[currentIndex]} ₽`;
        
        image.appendChild(img);
        text.appendChild(titleWrapper);
        text.appendChild(para);

        let btn = document.createElement("button");
        btn.className = "w-100 py-2"; 
        btn.innerHTML = "Заказать"; 
        
        btn.onclick = function() {
            localStorage.setItem('box_img', imgesArr[currentIndex]);
            localStorage.setItem('box_name', names[currentIndex]);
            localStorage.setItem('box_price', `${prices[currentIndex]} ₽`);
            window.location.href = 'checkout.html';
        };

        text.appendChild(btn);
        box.appendChild(image);
        box.appendChild(text);
        row.appendChild(box);
        index++;
    }
    productsContainer.appendChild(row);
}