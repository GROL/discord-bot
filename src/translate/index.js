import en from './en.json';
import ua from './ua.json';
import ru from './ru.json';
import pl from './pl.json';
import emoji from '../emoji.json';

const langsStore = { en, ua, ru, pl };
export const supportedLangs = {
    en: { icon: emoji.flag_gb, title: 'English' },
    ua: { icon: emoji.flag_ua, title: 'Українська' },
    ru: { icon: emoji.flag_ru, title: 'Русский' },
    pl: { icon: emoji.flag_pl, title: 'Polski'  }
};

/** 
 * Add format functional to all strings
 * Example: test = "text {0} format".format("with");
 */
 String.prototype.format = function(){
	let args = arguments;
	return this.replace(/\{(\d+)\}/g, function(m,n){
		return args[n] ? args[n] : m;
	});
};

/**
 * String translation
 * Exapmle: 'Hello!'.translate('pl');
 */
String.prototype.translate = function(lang){
    // If string is empty   
    if (!this) return '';

    // If languege is not set
    if (!lang) return this;

    // If unsupported language use EN
    const _lang = langsStore.hasOwnProperty(lang) ? lang : 'en';

    // If translate string not exist return original string
    let Result = langsStore[_lang].hasOwnProperty(this)
        ? langsStore[_lang][this]
        : this;

    // Random reply if array
    if (Array.isArray(Result)) {
        Result = Result[Math.floor(Math.random() * Result.length)];
    }

    return Result;
}
