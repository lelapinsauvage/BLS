// Legal Pages CMS Content Loader

// Simple markdown to HTML converter for legal content
function markdownToHtml(markdown) {
  let html = markdown;

  // Convert tables (must be done before other conversions)
  html = html.replace(/\|(.+)\|\n\|[-|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
    const headerCells = header.split('|').filter(c => c.trim()).map(c => `<div class="cookie-table__cell">${c.trim()}</div>`).join('');
    const headerRow = `<div class="cookie-table__row cookie-table__header">${headerCells}</div>`;

    const bodyRows = rows.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<div class="cookie-table__cell">${c.trim()}</div>`).join('');
      return `<div class="cookie-table__row">${cells}</div>`;
    }).join('');

    return `<div class="cookie-table">${headerRow}${bodyRows}</div>`;
  });

  // Convert headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '</section><section class="legal-section"><h2>$1</h2>');

  // Convert bold text
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Convert links
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>');

  // Convert paragraphs (lines that aren't already HTML)
  const lines = html.split('\n');
  html = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<')) return line;
    if (trimmed.startsWith('#')) return line;
    return `<p>${trimmed}</p>`;
  }).join('\n');

  // Clean up empty paragraphs and fix section structure
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/^<\/section>/, ''); // Remove leading </section>
  html = '<section class="legal-section">' + html.substring(html.indexOf('<section class="legal-section">') + 31);

  return html;
}

async function loadLegalContent() {
  try {
    // Determine which policy page we're on
    const isPrivacyPolicy = window.location.pathname.includes('privacy-policy');
    const isCookiePolicy = window.location.pathname.includes('cookie-policy');

    if (!isPrivacyPolicy && !isCookiePolicy) return;

    const policyType = isPrivacyPolicy ? 'privacy-policy' : 'cookie-policy';

    const res = await fetch(`/content/legal/${policyType}.json`);
    const data = await res.json();

    // Update header
    const title = document.querySelector('.legal-page__title');
    const updated = document.querySelector('.legal-page__updated');

    if (title) title.textContent = data.title;
    if (updated) updated.textContent = `Last updated: ${data.last_updated}`;

    // Convert markdown to HTML and update content
    const content = document.querySelector('.legal-page__content');
    if (content && data.body) {
      content.innerHTML = markdownToHtml(data.body);
    }

    console.log(`✅ ${data.title} content loaded from CMS`);
  } catch (error) {
    console.log('Legal content not loaded:', error.message);
  }
}

// Load content when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadLegalContent);
} else {
  loadLegalContent();
}
