import 'babel-polyfill';
import factory from './factory';
import formValidation from './components/form-validation';

const app = (config) => {
    factory(formValidation, document.getElementsByClassName('js-form-validation'));
};

app(window.config);
