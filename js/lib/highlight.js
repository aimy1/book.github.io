mixins.highlight = {
data() {
return { copying: false };
},
created() {
hljs.configure({ ignoreUnescapedHTML: true });
this.renderers.push(this.highlight);
},
methods: {
sleep(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));
},
highlight() {
let codes = document.querySelectorAll("pre");

for (let pre of codes) {
const code = pre.textContent;
const language = [...pre.classList, ...pre.firstChild?.classList || []][0] || "plaintext";

let highlighted;
try {
highlighted = hljs.highlight(code, { language }).value;
} catch (err) {
console.warn(`Highlight failed for language "${language}", fallback used.`);
highlighted = hljs.highlightAuto(code).value;
}

pre.innerHTML = `
<div class="code-content hljs">${highlighted}</div>
<div class="language">${language}</div>
<div class="copycode" title="Copy">
<i class="fa-solid fa-copy fa-fw"></i>
<i class="fa-solid fa-check fa-fw"></i>
</div>
`;

const content = pre.querySelector(".code-content");
hljs.lineNumbersBlock?.(content, { singleLine: true });

const copyBtn = pre.querySelector(".copycode");
copyBtn.addEventListener("click", async () => {
if (this.copying) return;
this.copying = true;

copyBtn.classList.add("copied");
await navigator.clipboard.writeText(code);
await this.sleep(1000);
copyBtn.classList.remove("copied");

this.copying = false;
});
}
},
},
};
.hljs {
overflow-x: auto;
max-width: 100%;
display: block;
}

