import url from 'url';

/**
 * rules:
 *
 * email: /.+\@.+\..+/
 * number: /^\d+$/
 * not empty: /^\s*\S.*$/
 * min and max length: /.{3,7}$/
 *
 * data attributes:
 * data-validation-format=".+\@.+\..+"
 * data-validation-message-format-invalid="Incorrect email format"
 * data-validation-required
 * data-validation-message-required="Password is required"
 */

const formValidation = (container) => {
    const form = container;
    const inputsToValidate = Array.from(form.querySelectorAll('[data-validation-format], [data-validation-required]'));

    /* Utils */
    const hasSuccessClassName = 'has-success';
    const hasDangerClassName = 'has-danger';

    /* State */
    const formState = {
        invalidFields: [],
        sent: false
    };

    /* Listen for submit */
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        validateAll(inputsToValidate);

        (formState.invalidFields.length === 0 && !formState.sent) && sendData();
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
        const api = 'api/form.json';
        const query = getData();
        const serviceUrl = url.format({
            pathname: api,
            query
        });

        /* Request */
        fetch(serviceUrl)
            .then(response => response.json())
            .then(data => handleSuccess(data))
            .catch(error => handleError(error));
    }

    function getData() {
        const data = {};

        Array.from(form.querySelectorAll('input, textarea, select')).forEach((input) => {
            data[input.name] = input.value;
        });

        return data;
    }

    /**
     * @param  {object} data
     */
    function handleSuccess(data) {
        const html = document.createDocumentFragment();
        const content = document.createElement('p');
        content.textContent = data.message;
        html.appendChild(content);
        form.appendChild(html);

        formState.sent = true;
    }

    /**
     * @param  {string} error
     */
    function handleError(error) {
        const html = document.createDocumentFragment();
        const content = document.createElement('p');
        content.textContent = error;
        html.appendChild(content);
        form.appendChild(html);

        formState.sent = true;
    }

    /**
     * @param  {array} inputs
     */
    function validateAll(inputs) {
        inputs.forEach(input => validate(input));
    }

    /**
     * @param  {HTML element} input
     */
    function validate(input) {
        const validation = handleValidation(input);

        /* Show/hide validation message */
        if (validation.isValid) {
            handleValid(input);
        } else {
            handleInvalid(input, validation.message);
        }

        /* Update state */
        if (validation.isValid) {
            const index = formState.invalidFields.indexOf(input.name);

            if (index !== -1) {
                formState.invalidFields.splice(index, 1);
            }
        } else {
            formState.invalidFields.push(input.name);
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
                    isValid = isValidCheckbox(input);
                    break;
                /* Probably not needed: select the first by default in HTML */
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

        /* Check if input value format is correct (regular expression taken from data-attribute */
        if (input.dataset.validationFormat) {
            const rule = new RegExp(input.dataset.validationFormat);
            isValid = isValidInput(input, rule);
            message = input.dataset.validationMessageFormatInvalid;
        }

        return {
            isValid,
            message
        };
        /* eslint-enable consistent-return */
    }

    /**
     * @param  {HTML element}  input
     * @return {Boolean}
     */
    function isValidCheckbox(input) {
        return input.checked;
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
        const parentElement = getAncestor(input, '.form-group');
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
        const parentElement = getAncestor(input, '.form-group');
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

    /**
     * TODO: IE11 compatibility
     *
     * @param  {HTML element} element
     * @param  {string} selector
     * @return {HTML element}
     */
    function getAncestor(element, selector) {
        return element.closest(selector);
    }
};

export default formValidation;
