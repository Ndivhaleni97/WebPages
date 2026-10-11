const form = document.getElementById('form');
const firstnameInput = document.getElementById('firstname-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const confirmPasswordInput = document.getElementById('confirm-password-input');
const errorMessage = document.getElementById('error-message');
const isSignupPage = Boolean(firstnameInput);

window.addEventListener('pageshow', () => {
    if (form) {
        form.reset();
    }
});

function markFieldInvalid(input) {
    if (!input) return;

    const fieldWrapper = input.parentElement;
    if (fieldWrapper) {
        fieldWrapper.classList.add('incorrect');
    }
}

function clearFieldError(input) {
    if (!input) return;

    const fieldWrapper = input.parentElement;
    if (fieldWrapper && fieldWrapper.classList.contains('incorrect')) {
        fieldWrapper.classList.remove('incorrect');
    }
}

function clearAllFieldErrors() {
    [firstnameInput, emailInput, passwordInput, confirmPasswordInput].forEach(clearFieldError);

    if (errorMessage) {
        errorMessage.textContent = '';
    }
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearAllFieldErrors();

        const errors = isSignupPage
            ? getSignupFormErrors(
                  firstnameInput.value,
                  emailInput.value,
                  passwordInput.value,
                  confirmPasswordInput.value
              )
            : getLoginFormErrors(emailInput.value, passwordInput.value);

        if (errors.length > 0) {
            if (errorMessage) {
                errorMessage.textContent = errors.join('. ');
            }
            return;
        }

        form.submit();
    });
}

function getSignupFormErrors(firstname, email, password, confirmPassword) {
    const errors = [];

    if (firstname.trim() === '') {
        errors.push('First name is required');
        markFieldInvalid(firstnameInput);
    }

    if (email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please enter a valid email');
        markFieldInvalid(emailInput);
    }

    if (password.trim() === '') {
        errors.push('Password is required');
        markFieldInvalid(passwordInput);
    } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
        markFieldInvalid(passwordInput);
    }

    if (confirmPassword.trim() === '') {
        errors.push('Confirm Password is required');
        markFieldInvalid(confirmPasswordInput);
    }

    if (password !== confirmPassword && confirmPassword !== '') {
        errors.push('Passwords do not match');
        markFieldInvalid(passwordInput);
        markFieldInvalid(confirmPasswordInput);
    }

    return errors;
}

function getLoginFormErrors(email, password) {
    const errors = [];

    if (email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please enter a valid email');
        markFieldInvalid(emailInput);
    }

    if (password.trim() === '') {
        errors.push('Password is required');
        markFieldInvalid(passwordInput);
    }

    return errors;
}

const allInputs = [firstnameInput, emailInput, passwordInput, confirmPasswordInput].filter(Boolean);

allInputs.forEach((input) => {
    input.addEventListener('input', () => {
        clearFieldError(input);

        const hasRemainingErrors = allInputs.some((field) => {
            const wrapper = field.parentElement;
            return wrapper && wrapper.classList.contains('incorrect');
        });

        if (!hasRemainingErrors && errorMessage) {
            errorMessage.textContent = '';
        }
    });
});
