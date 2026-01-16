import { smyth_banner } from './ascii';

export function banner(insideTexts: string[], lines: string[]) {
    let _banner = smyth_banner;

    for (let i = 0; i < 7; i++) {
        //replace texts like #111111111111# with the insideTexts[i]
        let template = '';
        for (let j = 0; j < 12; j++) template += i;

        _banner = _banner.replace(`#${template}#`, insideTexts[i] || '              ');
    }

    for (let i = 0; i < 20; i++) {
        _banner = _banner.replace(`{{LINE${(i + 1).toString().padStart(2, '0')}}}`, lines[i] || '');
    }

    return _banner;
}
