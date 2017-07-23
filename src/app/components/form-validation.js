/**
 * rules:
 *
 * email: /.+\@.+\..+/
 * number: /^\d+$/
 * not empty: /^\s*\S.*$/
 *
 * data attributes:
 * data-validation-format=".+\@.+\..+"
 * data-validation-message-format-invalid="Incorrect email format"
 * data-validation-required
 * data-validation-message-required="Filed password is required"
 */

const formValidation = (container) => {
    const form = container;
    const inputsToValidate = Array.from(form.querySelectorAll('[data-validation-format], [data-validation-required]'));

    /* Utils */
    const hasSuccessClassName = 'has-success';
    const hasDangerClassName = 'has-danger';

    /* State */
    let formIsValid = false;

    /* Listen for submit */
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        validateAll(inputsToValidate);

        formIsValid && sendData();
    });

    /* Listen for blur */
    inputsToValidate.forEach((input) => {
        input.addEventListener('blur', event => validate(input));
    });

    /**
     * Send data
     *
     * TODO: fetch a mockup.
     */
    function sendData() {
        return true;
    }

    function validateAll(inputs) {
        inputs.forEach(input => validate(input));
    }

    /**
     * @param  {HTML element} input
     */
    function validate(input) {
        formIsValid = true;
        const validation = handleValidation(input);

        /* Show/hide validation message */
        if (validation.isValid) {
            handleValid(input);
        } else {
            handleInvalid(input, validation.message);
        }

        /* Update form state */
        if (!validation.isValid) {
            formIsValid = false;
        }
    }

    /**
     * @param  {HTML element} input
     * @return {object}
     */
    function handleValidation(input) {
        let isValid = false;
        let message;

        /* TODO: rewrite without disabling eslint rule */
        /* eslint-disable consistent-return */
        /* Get value format rule (regular expression taken from data-attribute */
        if (input.dataset.validationFormat) {
            const rule = new RegExp(input.dataset.validationFormat);
            isValid = isValidInput(input, rule);
            message = input.dataset.validationMessageFormatInvalid;
        }

        /* Check if input is required without explicit rule of value format */
        if (input.dataset.validationRequired) {
            switch (input.type) {
                case 'text':
                case 'number':
                case 'password':
                case 'textarea':
                    isValid = isValidInput(input, /^\s*\S.*$/);
                    break;
                case 'checkbox':
                    isValid = isValidInput(input, /^\s*\S.*$/);
                    break;
                case 'radio':
                    isValid = isValidInput(input, /^\s*\S.*$/);
                    break;
                case 'select-one':
                    isValid = isValidSelect(input);
                    break;
                default:
                    return;
            }

            message = input.dataset.validationMessageRequired;
        }

        return {
            isValid,
            message
        };
        /* eslint-enable consistent-return */
    }

    /**
     * Don't allow empty value of select element
     * @param  {HTML element}  input
     * @return {Boolean}
     */
    function isValidSelect(input) {
        return input[input.selectedIndex].getAttribute('value');
    }

    /**
     * @param  {HTML element} input
     */
    function handleValid(input) {
        const parentElement = input.parentElement;
        const feedback = parentElement.querySelector('.form-control-feedback');

        parentElement.classList.add(hasSuccessClassName);
        parentElement.classList.remove(hasDangerClassName);
        feedback.innerText = '';
    }

    /**
     * @param  {HTML element} input
     * @param  {string} message
     */
    function handleInvalid(input, message) {
        const parentElement = input.parentElement;
        const feedback = parentElement.querySelector('.form-control-feedback');

        parentElement.classList.remove(hasSuccessClassName);
        parentElement.classList.add(hasDangerClassName);
        feedback.innerText = message;
    }

    /**
     * Test input value format. (ie. email)
     *
     * @param  {HTML element} input
     * @param  {regular expression} rule
     * @return {bool}
     */
    function isValidInput(input, rule) {
        return rule.test(input.value);
    }
};

export default formValidation;
