export const getNewSource = (markdown: string, url: string, portfolio: string) => `Extract the required information from the following markdown to create a 'source' object. This markdown is from the homepage of a Venture Capital firm's website. Set the 'website' and 'portfolio' properties using the provided URLs.

Website URL: ${url}
Portfolio URL: ${portfolio}

Markdown content:
---
${markdown}`;
