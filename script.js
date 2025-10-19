const WEBHOOK_URL = 'https://home.igorbraga.com/api/webhooks/whatsapp-form';

const whatsappButton = document.getElementById('wf8731Button');
const chatModal = document.getElementById('wf8731Modal');
const closeBtn = document.getElementById('wf8731CloseBtn');
const contactForm = document.getElementById('wf8731Form');
const submitBtn = document.getElementById('wf8731Submit');
const btnText = submitBtn.querySelector('.wf8731-btn-text');
const typingIndicator = document.getElementById('wf8731Typing');
const errorMessage = document.getElementById('wf8731ErrorMsg');
const successMessage = document.getElementById('wf8731SuccessMsg');
const onlineIndicator = document.getElementById('wf8731OnlineIndicator');
const badge = document.querySelector('.wf8731-badge');
const welcomeMessage = document.getElementById('wf8731WelcomeMsg');

// Elementos de validação
const nameInput = document.getElementById('wf8731Name');
const emailInput = document.getElementById('wf8731Email');
const whatsappInput = document.getElementById('wf8731Phone');
const nameError = document.getElementById('wf8731NameError');
const emailError = document.getElementById('wf8731EmailError');
const whatsappError = document.getElementById('wf8731PhoneError');

const campaignDataInput = document.querySelector('input[name="87_campaign_data_31_waform"]')
const sourceDataInput = document.querySelector('input[name="87_source_data_31_waform"]')

window.openWf8731Modal = function () {
    // Só abre se estiver fechado
    if (!chatModal.classList.contains('wf8731-active')) {
        chatModal.classList.add('wf8731-active');
        badge.style.display = 'none';
        onlineIndicator.style.display = 'none';

        // Resetar mensagem de boas-vindas
        welcomeMessage.classList.remove('wf8731-show');

        if (!successMessage.classList.contains("wf8731-show"))
            setTimeout(() => {
                welcomeMessage.classList.remove('wf8731-show');
                typingIndicator.classList.add('wf8731-show');

                setTimeout(() => {
                    typingIndicator.classList.remove('wf8731-show');
                    welcomeMessage.classList.add('wf8731-show');
                }, 2000);
            }, 500);
    }
}

whatsappButton.addEventListener('click', openWf8731Modal);

// Fechar modal
closeBtn.addEventListener('click', () => {
    chatModal.classList.remove('wf8731-active');
    resetForm();
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
}

// Limpar erro ao digitar
nameInput.addEventListener('input', () => {
    nameInput.classList.remove('wf8731-input-error');
    nameError.classList.remove('wf8731-show');
});

emailInput.addEventListener('input', () => {
    emailInput.classList.remove('wf8731-input-error');
    emailError.classList.remove('wf8731-show');
});

whatsappInput.addEventListener('input', function (e) {
    whatsappInput.classList.remove('wf8731-input-error');
    whatsappError.classList.remove('wf8731-show');

    // Formatar telefone
    let cleaned = e.target.value.replace(/\D/g, '');
    let formatted = '';

    if (!cleaned) formatted = ''
    else if (cleaned.length <= 2) {
        formatted = `(${cleaned.slice(0, 2)}`;
    } else if (cleaned.length <= 6) {

        formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(
            2
        )}`;
    } else if (cleaned.length <= 10) {
        const rest = cleaned.slice(2);

        formatted = `(${cleaned.slice(
            0,
            2
        )}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    } else {
        const firstDigit = cleaned.slice(2, 3);
        const middle = cleaned.slice(3, 7);
        const last = cleaned.slice(7, 11);
        formatted = `(${cleaned.slice(0, 2)}) ${firstDigit}${middle}-${last}`;
    }

    e.target.value = formatted;
});

// Função para resetar o formulário
function resetForm() {
    errorMessage.style.display = null
    nameInput.classList.remove('wf8731-input-error');
    emailInput.classList.remove('wf8731-input-error');
    whatsappInput.classList.remove('wf8731-input-error');
    nameError.classList.remove('wf8731-show');
    emailError.classList.remove('wf8731-show');
    whatsappError.classList.remove('wf8731-show');
    onlineIndicator.style.display = null
    if (!successMessage.classList.contains("wf8731-show")) {
        setTimeout(() => {
            if (!chatModal.classList.contains("wf8731-active")) {
                badge.style.display = 'flex';
                badge.style.animation = 'wf8731-badgePop 0.3s ease-out';
            }
        }, 5000);
        contactForm.reset();
        successMessage.classList.remove('wf8731-show');
        btnText.textContent = 'Enviar';
        submitBtn.disabled = false;
        submitBtn.classList.remove('wf8731-success', 'wf8731-processing');
    }
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let hasError = false;

    if (nameInput.value.length < 2) {
        nameInput.classList.add('wf8731-input-error');
        nameError.classList.add('wf8731-show');
        hasError = true;
    }

    if (!validateEmail(emailInput.value)) {
        emailInput.classList.add('wf8731-input-error');
        emailError.classList.add('wf8731-show');
        hasError = true;
    }

    if (!validatePhone(whatsappInput.value)) {
        whatsappInput.classList.add('wf8731-input-error');
        whatsappError.classList.add('wf8731-show');
        hasError = true;
    }

    if (hasError) return;

    submitBtn.classList.add('wf8731-processing');
    submitBtn.disabled = true;

    errorMessage.style.display = null

    const phone = whatsappInput.value.replace(/\D/g, "")

    const formData = {
        name: nameInput.value,
        email: emailInput.value,
        phone: "55" + phone,
        campaignData: campaignDataInput.value,
        sourceData: sourceDataInput.value
    };

    console.log({ formData })

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const resData = await response.json()

        if (!response.ok)
            throw new Error(resData.error ? resData.error : 'Erro ao enviar dados');

        submitBtn.classList.remove('wf8731-processing');

        welcomeMessage.classList.remove('wf8731-show');
        typingIndicator.classList.remove('wf8731-show');

        submitBtn.classList.add('wf8731-success');

        successMessage.classList.add('wf8731-show');
    } catch (error) {
        console.error('Erro:', error);
        errorMessage.textContent = error.message
        errorMessage.style.display = "block"
        submitBtn.classList.remove('wf8731-processing');
        submitBtn.disabled = false;
        btnText.textContent = 'Tentar novamente';
    }
});

setTimeout(() => {
    if (!chatModal.classList.contains("wf8731-active") && !successMessage.classList.contains("wf8731-show")) {
        badge.style.display = 'flex';
        badge.style.animation = 'wf8731-badgePop 0.3s ease-out';
    }
}, 5000);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && chatModal.classList.contains('wf8731-active')) {
        chatModal.classList.remove('wf8731-active');
        resetForm();
    }
});

const whatsappLinks = document.querySelectorAll('[wf8731="waform_button"]');

whatsappLinks.forEach(link => {
    link.addEventListener("click", () => console.log("Old element"))
    // Verificar se não é o próprio botão flutuante
    if (!link.closest('.wf8731-container')) {
        const newWaButton = link.cloneNode(true)
        link.parentNode.replaceChild(newWaButton, link)
        newWaButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openWf8731Modal();
        });
    }
});
