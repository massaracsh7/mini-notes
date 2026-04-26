import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import plaintext from 'highlight.js/lib/languages/plaintext';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { marked } from 'marked';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('plaintext', plaintext);

const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  const language = (lang || 'plaintext').toLowerCase();
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  const highlighted = hljs.highlight(text, {
    language: validLanguage,
  }).value;

  return `<pre class="hljs-block"><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
};

marked.setOptions({
  breaks: true,
  gfm: true,
});

marked.use({ renderer });

export function renderMarkdown(value: string) {
  return marked.parse(value) as string;
}
