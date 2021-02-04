/**
    Accepts text {content} extracted from HTML.
    Uses regex to parse and transform that content into JSON.
    Returns a JSON object of that content.
*/
export function renderFeed(article) {
    return `
        <div class="title-bar side-header"><a href="javascript:goHome();">${article.dt}</a></div>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${article.movie}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${article.song}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <br /><br />
    `;
}
export function renderBody(article) {
    return `
    <span class="category highlight">${article.category.toUpperCase()}</span>
    <div class="title">${article.title}</div>
    <div class="title-date">🕒 ${article.dt}</div>
    ${article.body}
  `;
}
export function transformText(content) {
    // Split the text content into its individual consituient lines.
    const lines = content.split('\n');
    console.log('>> lines', lines);
    // We assume:
    // The first line will always be our movie trailer and
    // the second line will always be our song.
    // let re = /<movie>(.*)<\/movie>.*<song>(.*)<\/song>/gs // "global" and "single line"
    // let matches = re.exec(content)
    // console.log('>> matches', matches)
    // const movie: string = matches?.[1] ?? 'No movie specified.'
    // const song: string = matches?.[2] ?? 'No song specified.'
    // let re = /<movie>(?<movie>.*)<\/movie>.*<song>(?<song>.*)<\/song>/gs // "global" and "single line"
    // let matches = re.exec(content)
    // console.log('>> match', matches)
    // const movie: string = matches?.groups?.movie ?? 'No movie specified.'
    // const song: string = matches?.groups?.song ?? 'No song specified.'
    const patterns = [
        /<movie>(?<movie>.*)<\/movie>/,
        /<song>(?<song>.*)<\/song>/,
        /<title>(?<title>.*)<\/title>/,
        /<category>(?<category>.*)<\/category>/,
        /<\/datetime>(?<body>.*)$/
    ];
    const re = new RegExp(patterns.map(pattern => pattern.source).join('.*'), 'gs');
    console.log('>> re:', re);
    const matches = re.exec(content);
    console.log('>> match', matches);
    const dt = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    let body = matches?.groups?.body?.trim() ?? 'No body.';
    // body = body.replaceAll(/_.*_/g, '<em>$&</em>') // Almost works but doesn't eliminate the underscores. :(
    body = body.replaceAll(/_.*?_/gs, match => `<em>${match.slice(1, -1)}</em>`);
    body = body.replaceAll(/\*\*.*?\*\*/gs, match => `<strong>${match.slice(2, -2)}</strong>`); // Use RegEx-- but need to escape!
    console.log('$$$$$$$$ body', body);
    const article = {
        movie: matches?.groups?.movie ?? 'No movie specified.',
        song: matches?.groups?.song ?? 'No song specified.',
        title: matches?.groups?.title ?? 'Untitled',
        category: matches?.groups?.category ?? 'Uncategorized',
        dt: dt.toLocaleTimeString('en-us', options),
        body: body
    };
    // console.log('>> article', article)
    return article;
}
/// /////////////////////////////////////////
let renderWindow;
function extractText() {
    const text = document.querySelector('#editor_view').value;
    // console.log('>> read text', text)
    const article = transformText(text);
    renderWindow.document.querySelector('#feed').innerHTML = renderFeed(article);
    renderWindow.document.querySelector('#render_view').innerHTML = renderBody(article);
}
// Only runs once upon initial page load.
function openRender() {
    renderWindow =
        window.open('render.html', 'renderTarget', 'height=1600,width=1600,status=yes,toolbar=no,menubar=no,location=no');
}
// This event hander will listen for messages from the child window.
window.addEventListener('message', function () {
    // console.log('child message received!')
    extractText();
}, false);
// Runs on initial page load.
window.onload = () => {
    // console.log('>> Ready!')
    openRender();
};
document.getElementById('editor_view')
    .addEventListener('keyup', e => {
    // console.log(">> key up", e)
    if (e.ctrlKey && e.key === 'Enter') {
        extractText();
    }
});
