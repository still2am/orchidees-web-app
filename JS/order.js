document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkoutForm');
    const dateInput = document.getElementById('deliveryDate');
    const priceDisplay = document.getElementById('flowerPrice');
    
    const nameDisplay = document.getElementById('flowerName');
    const imgDisplay = document.getElementById('orderImg');

    const boxImg = localStorage.getItem('box_img');
    const boxName = localStorage.getItem('box_name');
    const boxPriceStr = localStorage.getItem('box_price');

    if (boxImg) imgDisplay.src = boxImg;
    if (boxName) nameDisplay.textContent = boxName;
    
    const basePrice = parseInt(boxPriceStr?.replace(/[^0-9]/g, '') || '0');
    priceDisplay.textContent = `${basePrice} ₽`;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    dateInput.setAttribute('min', minDate.toISOString().split('T')[0]);

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const deliveryDate = dateInput.value;
        const day = new Date(deliveryDate).getDay();
        const deliveryCost = (day === 0 || day === 6) ? 500 : 200;
        const total = basePrice + deliveryCost;

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            date: deliveryDate,
            notes: document.getElementById('notes').value,
            flowerName: nameDisplay.textContent, 
            price: `${total} ₽` 
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Заказ успешно оформлен! Итого к оплате: " + formData.price);
                localStorage.removeItem('box_price');
                localStorage.removeItem('box_name');
                localStorage.removeItem('box_img');
                window.location.href = 'profile.html';
            } else {
                alert("Ошибка при оформлении заказа.");
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка при соединении с сервером.");
        }
    });
});