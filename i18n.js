import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import {vietnam} from './languages/vi'
import {english} from './languages/en'

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: english, 
  vi: vietnam
};
i18n.locale = Localization.locale;
i18n.fallbacks = true;
export default i18n