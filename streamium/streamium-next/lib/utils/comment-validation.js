export function containsUrl(text) {
  const urlPatterns = [
    /https?:\/\/[^\s/$.?#].[^\s]*/i,
    /www\.[^\s/$.?#].[^\s]*/i,
    /[^\s/$.?#]+\.(com|net|org|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum|fr|uk|us|ca|eu|de|it|es)[^\s]/i
  ];

  return urlPatterns.some(pattern => pattern.test(text));
}

export function validateComment(content) {
  if (!content || content.trim().length === 0 || content === '<p></p>') {
    return { isValid: false, error: 'Comment cannot be empty' };
  }

  // Strip HTML for URL check
  const textContent = content.replace(/<[^>]*>/g, '');
  if (containsUrl(textContent)) {
    return { isValid: false, error: 'URLs are not allowed in comments' };
  }

  return { isValid: true };
}
