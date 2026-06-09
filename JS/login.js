document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorDiv = document.querySelector('#errorMessage');
    errorDiv.style.display = 'none';

    try {
        const data = Object.fromEntries(new FormData(e.target).entries());
        const res = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        if (res.ok) {
            window.location.href = '/home.html';
        } else {
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        console.error('Ошибка входа:', err);
    }
});