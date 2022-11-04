const URL = "https://translate.google.com/translate_a/single?client=at&dt=t&dt=rm&dj=1";

export interface SrcTranslit {
    src_translit: string;
}

export interface Sentence {
    trans: string;
    orig: string;
}

export interface RawResponse {
    sentences: (Sentence | SrcTranslit)[];
    src: string;
    confidence: number;
    ld_result: {
        srclangs: string[];
        srclangs_confidences: number[];
        extended_srclangs: string[];
    }
}

interface TranslateOptions {
    from: string,
    to: string
}

const DEFAULT_OPTION: TranslateOptions = {
    from: "auto",
    to: "en"
}

export class Translator {
    protected options: TranslateOptions;

    constructor(options?: { from?: string, to?: string }) {
        options = (typeof options == "undefined" ? DEFAULT_OPTION : options);
        this.options = {
            from: (typeof options.from == "undefined" ? DEFAULT_OPTION.from : options.from),
            to: (typeof options.to == "undefined" ? DEFAULT_OPTION.to : options.to)
        }
    }

    async translate(input: string) {
        const response = await fetch(URL, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            method: "POST",
            body: new URLSearchParams({
                sl: this.options.from,
                tl: this.options.to,
                q: input
            }).toString()
        });

        return new Translated(await response.json());
    }
}

class Translated {
    raw: RawResponse;

    constructor(raw:  RawResponse) {
        this.raw = raw;
    }

    get text() {
        return this.raw.sentences
            .filter((s): s is Sentence => "trans" in s)
            .map(s => s.trans)
            .join("");
    }
}