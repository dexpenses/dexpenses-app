import { configure, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import i18n from '@/i18n';

/* eslint-disable no-underscore-dangle, no-param-reassign */
configure({
  defaultMessage: (field, values) => {
    values._field_ = i18n.t(`fields.${field}`);
    return i18n.t(`validations.${values._rule_}`, values);
  },
});
extend('required', required);
