function closeModal() { 
    document.getElementById('orderModal').style.display = 'none'; 
}

function openOrderModal(order) {
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('modalContent');
    
    const formattedDate = new Date(order.delivery_date).toLocaleDateString('ru-RU');
    
    content.innerHTML = `
        <p><strong>Товар:</strong> ${order.flower_name}</p>
        <p><strong>Дата доставки:</strong> ${formattedDate}</p>
        <p><strong>Получатель:</strong> ${order.recipient_firstname} ${order.recipient_lastname}</p>
        <p><strong>Адрес:</strong> ${order.address}</p>
        <p><strong>Телефон:</strong> ${order.phone}</p>
        <p><strong>Комментарий:</strong> ${order.notes || 'Нет'}</p>
        <p><strong>Цена:</strong> ${order.price}</p>
    `;
    
    modal.style.display = 'flex'; 
}

async function loadOrders() {
    try {
        const res = await fetch('/api/my-orders');
        if (!res.ok) return;
        
        const orders = await res.json();
        const tbody = document.getElementById('ordersTableBody');
        
        tbody.innerHTML = ''; 

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Заказов пока нет</td></tr>';
            return;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.style.cursor = 'pointer'; 
            
            row.innerHTML = `
                <td>${order.flower_name}</td>
                <td>${new Date(order.delivery_date).toLocaleDateString('ru-RU')}</td>
                <td>${order.price}</td>
                <td><span class="badge bg-success">Оформлен</span></td>
            `;
            row.onclick = () => openOrderModal(order);
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error('Ошибка загрузки заказов:', err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/profile');
        if (!res.ok) { 
            window.location.href = '/'; 
            return; 
        }
        
        const user = await res.json();
        
        document.querySelector('#firstname').value = user.firstname || '';
        document.querySelector('#lastname').value = user.lastname || '';
        document.querySelector('#email').value = user.email || '';
        document.querySelector('#phone').value = user.phone || '';
        
        document.querySelector('#userName').textContent = `${user.firstname || ''} ${user.lastname || ''}`;

        loadOrders();
        
    } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
    }
});

document.querySelector('#profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const res = await fetch('/api/profile', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            alert('Данные успешно сохранены!');
            document.querySelector('#userName').textContent = `${data.firstname} ${data.lastname}`;
        } else {
            alert('Ошибка при сохранении.');
        }
    } catch (err) {
        alert('Ошибка соединения с сервером.');
    }
});

document.querySelector('#logoutBtn').addEventListener('click', () => {
    window.location.href = '/logout';
});