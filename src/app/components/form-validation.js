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
    const isValidClassName = 'is-valid';
    const hasErrorClassName = 'has-error';

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
            const inputIsValid = isFormatvalid(input);

            if (inputIsValid) {
                input.classList.add(isValidClassName);
                input.classList.remove(hasErrorClassName);
            } else {
                input.classList.remove(isValidClassName);
                input.classList.add(hasErrorClassName);
            }

            if (!inputIsValid) {
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
    function isFormatvalid(input) {
        const format = new RegExp(input.dataset.validationFormat);
        const value = input.value;

        return format.test(value);
    }
};

export default formValidation;
