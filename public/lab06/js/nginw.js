/**
    Accepts text {content} extracted from HTML.
    Uses regex to parse and transform that content into JSON.
    Returns a JSON object of that content.
*/
export function renderFeed(entry) {
    return `
        <div class="title-bar side-header"><a href="javascript:goHome();">${entry.dt}</a></div>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${entry.movie}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${entry.song}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <br /><br />
    `;
}
export function renderArticle(entry) {
    return `
    <span class="category highlight">${entry.category.toUpperCase()}</span>
    <div class="title">${entry.title}</div>
    <div class="title-date">🕒 ${entry.dt}</div>
    <div class="tags">🏷️ ${entry.tags}</div>
    ${entry.body}
  `;
}
export function parseText(editorText) {
    console.log(editorText);
    const patterns = [
        // /<id>(?<id>.*)<\/id>/,
        // /<author>(?<author>.*)<\/author>/,
        // /<uid>(?<uid>.*)<\/uid>/,
        // /<email>(?<email>.*)<\/email>/,
        // /<song>(?<song>.*)<\/song>/,
        // /<movie>(?<movie>.*)<\/movie>/,
        /<title>(?<title>.*)<\/title>/,
        // /<category>(?<category>.*)<\/category>/,
        // /<tags>(?<tags>.*)<\/tags>/,
        // /<datetime>(?<tags>.*)<\/datetime>/,
        /<\/datetime>(?<body>.*)$/
    ];
    const re = new RegExp(patterns.map(pattern => pattern.source).join('.*'), 'gs');
    const matches = re.exec(editorText);
    return {
        title: matches?.groups?.title?.trim() ?? 'Untitled.',
        content: matches?.groups?.body?.trim() ?? 'No body.'
    };
}
export function transformText(editorText) {
    const patterns = [
        /<song>(?<song>.*)<\/song>/,
        /<movie>(?<movie>.*)<\/movie>/,
        /<title>(?<title>.*)<\/title>/,
        /<category>(?<category>.*)<\/category>/,
        /<tags>(?<tags>.*)<\/tags>/,
        /<datetime>(?<datetime>.*)<\/datetime>/,
        /(?<body>.*)$/
    ];
    const re = new RegExp(patterns.map(pattern => pattern.source).join('.*?'), 'gs');
    console.log('>> re:', re);
    const matches = re.exec(editorText);
    console.log('>> matches:', matches);
    let body = matches?.groups?.body?.trim() ?? 'No body.';
    /**
     * Get the word count of the body.
    */
    const wordCount = body === 'No body.' ? 0 : body.split(/\s+/).length;
    // console.log('>>>> body split arr:', body.split(/\s+/))
    /**
     *  Perform the formatting.
    */
    // console.log('>>> BODY BEFORE:', body)
    body = body.replaceAll(/### .*?\n\n/g, match => `<h3>${match.slice(4, -2)}</h3>`);
    // body = body.replaceAll(/_.*_/g, '<em>$&</em>') // Almost works but doesn't eliminate the underscores. :(
    body = body.replaceAll(/_.*?_/g, match => `<em>${match.slice(1, -1)}</em>`);
    body = body.replaceAll(/\*\*.*?\*\*/g, match => `<strong>${match.slice(2, -2)}</strong>`); // Use RegEx-- but need to escape!
    body = body.replaceAll(/\n/g, '<br />');
    // body = '<br />' + body
    // console.log('>> BODY:', body)
    const entry = {
        movie: matches?.groups?.movie ?? 'No movie specified.',
        song: matches?.groups?.song ?? 'No song specified.',
        title: matches?.groups?.title ?? 'Untitled',
        category: matches?.groups?.category ?? 'Uncategorized',
        tags: matches?.groups?.tags ?? 'Untagged',
        dt: matches?.groups?.datetime ?? 'Undated.',
        body: body,
        wordCount: wordCount
    };
    // console.log('>> entry', entry)
    return entry;
}
