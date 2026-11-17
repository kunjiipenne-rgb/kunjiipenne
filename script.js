// Prompt Studio: a local prompt *builder* (not an AI model or API client).
// Inputs remain in your browser; no data is sent to a server.

const form = document.querySelector('#promptForm');
const output = document.querySelector('#output');
const copyButton = document.querySelector('#copyButton');
const resetButton = document.querySelector('#resetButton');
const feedback = document.querySelector('#feedback');

let generatedPrompt = '';

function makePrompt({ task, topic, tone, audience, details }) {
  const parts = [
    `Act as an experienced creative strategist and content specialist.`,
    `Create a ${task} based on this brief: ${topic.trim()}`,
    `Target audience: ${audience}.`,
    `Tone of voice: ${tone.toLowerCase()}.`,
    `Make the result clear, engaging, practical, and suitable for the intended audience.`,
    `Provide a polished final result that is ready to use.`
  ];
  if (details.trim()) parts.push(`Additional requirements: ${details.trim()}`);
  return parts.join('\n\n');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form).entries());
  generatedPrompt = makePrompt(data);
  output.textContent = generatedPrompt; // textContent prevents user input becoming HTML
  output.classList.add('has-prompt');
  copyButton.disabled = false;
  feedback.textContent = 'Prompt generated. Copy it into your preferred AI tool.';
});

copyButton.addEventListener('click', async () => {
  if (!generatedPrompt) return;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(generatedPrompt);
    } else {
      const selection = document.createElement('textarea');
      selection.value = generatedPrompt;
      selection.style.position = 'fixed';
      selection.style.opacity = '0';
      document.body.appendChild(selection);
      selection.select();
      const worked = document.execCommand('copy');
      selection.remove();
      if (!worked) throw new Error('Copy not supported');
    }
    feedback.textContent = 'Copied to clipboard!';
  } catch {
    feedback.textContent = 'Automatic copy failed. Select the prompt text and copy it manually.';
  }
});

resetButton.addEventListener('click', () => {
  form.reset();
  generatedPrompt = '';
  output.classList.remove('has-prompt');
  output.innerHTML = '<span class="placeholder-icon" aria-hidden="true">✦</span><p>Your generated prompt will appear here.</p><small>Fill in the form and click Generate prompt.</small>';
  copyButton.disabled = true;
  feedback.textContent = '';
  document.querySelector('#topic').focus();
});
