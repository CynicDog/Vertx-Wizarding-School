export const displayErrorMessage = (input, message) => {
    input.classList.add('is-invalid');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;

    const parentDiv = input.parentElement;
    parentDiv.appendChild(errorDiv);
};

export const removeErrorMessage = (input) => {
    input.classList.remove('is-invalid');

    const parentDiv = input.parentElement;
    const errorDiv = parentDiv.querySelector('.invalid-feedback');
    if (errorDiv) {
        parentDiv.removeChild(errorDiv);
    }
};

export const displaySuccessMessage = (input) => {
    input.classList.add('is-valid');
}

export const removeSuccessMessage = (input) => {
    input.classList.remove('is-valid');
}