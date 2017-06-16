import 'babel-polyfill';
/**
 * https://github.com/Keyamoon/svgxuse
 * If you do not use SVG <use xlink:href="…"> elements, remove svgxuse module
 */
// import 'svgxuse';
// import init from './init';
import factory from './factory';
// import { render, renderFactory } from './render';
import formValidation from './components/form-validation';

const app = (config) => {
    factory(formValidation, document.getElementsByClassName('js-form-validation'));
};

app(window.config);
