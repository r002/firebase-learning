/**
    Accepts text {content} extracted from HTML.
    Uses regex to parse and transform that content into JSON.
    Returns a JSON object of that content.
*/
export function renderFeed(article) {
    return `
        <div class="title-bar side-header"><a href="javascript:goHome();">${article.datetime}</a></div>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${article.movie}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${article.song}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <br /><br />
    `;
}
export function renderArticle(article) {
    const body = transformTextToHtml(article.content);
    return `
    <span class="category highlight">${article.category.toUpperCase()}</span>
    <div class="title">${article.title}</div>
    <div class="title-date">🕒 ${article.datetime}</div>
    <div class="tags">🏷️ ${article.tagsStr}</div>
    ${body}
  `;
}
/**
 * Examines a subset of the Editor text and returns an object with
 * specific properties to overwrite the Article object.
 * @param editorText
 */
export function parseText(editorText) {
    // console.log(editorText)
    /**
     * Perform the text extraction.
     */
    const patterns = [
        /<id>(?<id>.*)<\/id>/,
        // /<author>(?<author>.*)<\/author>/,
        // /<uid>(?<uid>.*)<\/uid>/,
        // /<email>(?<email>.*)<\/email>/,
        /<song>(?<song>.*)<\/song>/,
        /<movie>(?<movie>.*)<\/movie>/,
        /<title>(?<title>.*)<\/title>/,
        /<category>(?<category>.*)<\/category>/,
        /<tags>(?<tags>.*)<\/tags>/,
        // /<datetime>(?<tags>.*)<\/datetime>/,
        /<\/datetime>(?<body>.*)$/
    ];
    const re = new RegExp(patterns.map(pattern => pattern.source).join('.*'), 'gs');
    const matches = re.exec(editorText);
    return {
        id: matches?.groups?.id?.trim() ?? 'No id.',
        song: matches?.groups?.song?.trim() ?? 'No song.',
        movie: matches?.groups?.movie?.trim() ?? 'No movie.',
        title: matches?.groups?.title?.trim() ?? 'Untitled.',
        content: matches?.groups?.body?.trim() ?? 'No body.'
    };
}
export function calcArticleStats(bodyText) {
    /**
     * Calculate the stats
     */
    const wordCount = bodyText.split(/\s+/).length;
    // console.log('>>>> bodyText split arr:', bodyText.split(/\s+/))
    const headingsCount = (bodyText.match(/###/g) || []).length;
    return {
        wordCount: wordCount,
        headingsCount: headingsCount
    };
}
/**
 * Transform body into HTML markup to render in Renderman.
 * @param bodyText
 */
export function transformTextToHtml(bodyText) {
    /**
     *  Perform the formatting.
    */
    // console.log('>>> BODY BEFORE:', body)
    let body = bodyText.trim();
    body = body.replaceAll(/### .*?\n\n/g, match => `<h3>${match.slice(4, -2)}</h3>`);
    // body = body.replaceAll(/_.*_/g, '<em>$&</em>') // Almost works but doesn't eliminate the underscores. :(
    body = body.replaceAll(/_.*?_/g, match => `<em>${match.slice(1, -1)}</em>`);
    body = body.replaceAll(/\*\*.*?\*\*/g, match => `<strong>${match.slice(2, -2)}</strong>`); // Use RegEx-- but need to escape!
    body = body.replaceAll(/\n/g, '<br />');
    // body = '<br />' + body
    // console.log('>> BODY AFTER:', body)
    return body;
}
