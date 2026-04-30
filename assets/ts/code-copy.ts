import * as params from '@params';

function getCodeText(codeBlock: Element) {
    const codeLines = codeBlock.querySelectorAll('.cl');

    if (codeLines.length > 0) {
        return Array.from(codeLines)
            .map(line => line.textContent ?? '')
            .join('');
    }

    const codeOnly = codeBlock.cloneNode(true) as Element;
    codeOnly.querySelectorAll('.ln, .lnt').forEach(lineNumber => lineNumber.remove());

    return codeOnly.textContent ?? '';
}

export function setupCodeCopy() {
    const highlights = document.querySelectorAll('.article-content div.highlight');
    const copyText = params.codeblock.copy,
        copiedText = params.codeblock.copied;

    if (!navigator.clipboard) {
        console.warn('Clipboard API not supported, copy button will not work.');
        return;
    }

    highlights.forEach(highlight => {
        const copyButton = document.createElement('button');
        copyButton.textContent = copyText;
        copyButton.classList.add('copyCodeButton');
        highlight.appendChild(copyButton);

        const codeBlock = highlight.querySelector('code[data-lang]');
        if (!codeBlock) return;

        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(getCodeText(codeBlock))
                .then(() => {
                    copyButton.textContent = copiedText;

                    setTimeout(() => {
                        copyButton.textContent = copyText;
                    }, 1000);
                })
                .catch(err => {
                    alert(err);
                    console.log('Something went wrong', err);
                });
        });
    });
};
