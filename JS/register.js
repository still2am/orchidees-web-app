document.querySelector('#regForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const data = Object.fromEntries(new FormData(e.target).entries());
        const res = await fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (res.ok) {
            window.location.href = '/home.html';
        } else {
            alert('Ошибка регистрации. Проверьте данные.');
        }
    } catch (err) {
        console.error('Ошибка:', err);
    }
});