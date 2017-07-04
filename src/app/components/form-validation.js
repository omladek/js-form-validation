/**
 * rules:
 *
 * email: /.+\@.+\..+/
 * number: /^\d+$/
 */

const formValidation = (container) => {
    const form = container;
    const inputsToValidate = Array.from(form.querySelectorAll('[data-validation-format]'));

    /* Utils */
    const hasSuccessClassName = 'has-success';
    const hasDangerClassName = 'has-danger';

    /* State */
    let formIsValid = false;

    /* Listen for submit */
    form.addEventListener('submit', (event) => {
        console.log('submit');
        event.preventDefault();

        validateInputs();

        if (formIsValid) {
            console.log('form valid');
        } else {
            console.log('form invalid');
        }

        // formIsValid && sendData();
    });

    /**
     * Send data
     *
     * TODO: fetch a mockup.
     */
    function sendData() {
        return true;
    }

    function validateInputs() {
        formIsValid = true;

        inputsToValidate.forEach((input) => {
            const formatIsValid = isFormatValid(input);
            const parentElement = input.parentElement;
            const feedback = parentElement.querySelector('.form-control-feedback');
            const formatInvalidMessage = input.dataset.validationMessageFormatInvalid;

            if (formatIsValid) {
                parentElement.classList.add(hasSuccessClassName);
                parentElement.classList.remove(hasDangerClassName);
                feedback.innerText = '';
            } else {
                parentElement.classList.remove(hasSuccessClassName);
                parentElement.classList.add(hasDangerClassName);
                feedback.innerText = formatInvalidMessage;
            }

            if (!formatIsValid) {
                formIsValid = false;
            }
        });
    }

    /**
     * Test input value format. (ie. email)
     *
     * @param  {HTML element} input
     * @return {bool}
     */
    function isFormatValid(input) {
        const format = new RegExp(input.dataset.validationFormat);
        const value = input.value;

        return format.test(value);
    }
};

export default formValidation;
