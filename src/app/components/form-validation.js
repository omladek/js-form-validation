import isEmail from 'is-email';

const formValidation = (container) => {
    const form = container;
    const inputsToValidate = Array.from(form.querySelectorAll('[data-validation]'));
    const requiredInputs = Array.from(form.querySelectorAll('[data-validation-required]'));

    /* State */
    let isValid = false;

    /* Listen for submit */
    form.addEventListener('submit', (event) => {
        console.log('submit');
        event.preventDefault();

        const noEmpty = inputsAreFilled();
        console.log('noEmpty: ', noEmpty);

        const allValid = inputsAreValid();
        console.log('allValid: ', allValid);

        if (noEmpty && allValid) {
            isValid = true;
        } else {
            isValid = false;
        }

        isValid && sendData();
    });

    /**
     * Send data
     *
     * TODO: fetch a mockup.
     */
    function sendData() {
        return true;
    }

    /**
     * Check if all required inputs are filled in.
     *
     * @return {bool}
     */
    function inputsAreFilled() {
        const emptyInputs = requiredInputs.filter((input) => {
            // TODO: checkbox, input, radio
            return input.value === '';
        });

        return emptyInputs.length === 0;
    }

    /**
     * Check if all inputs have correct valude.
     *
     * @return {bool}
     */
    function inputsAreValid() {
        const inputsTotal = inputsToValidate.length;
        const validInputs = [];

        const emptyInputs = inputsToValidate.forEach((input) => {
            const rule = input.dataset.validation;
            let inputIsValid = false;

            switch (rule) {
                case 'email':
                    inputIsValid = isEmail(input.value)
                    break;
                case 'number':
                    inputIsValid = !isNaN(input.value)
                    break;
                default:
                    return true;
            }

            return inputIsValid;
        });

        return emptyInputs.length === 0;
    }
};

export default formValidation;
