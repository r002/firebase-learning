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
export function renderBody(entry) {
    return `
    <span class="category highlight">${entry.category.toUpperCase()}</span>
    <div class="title">${entry.title}</div>
    <div class="title-date">🕒 ${entry.dt}</div>
    ${entry.body}
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
    // console.log('>> re:', re)
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
    // console.log('>> body', body)
    const entry = {
        movie: matches?.groups?.movie ?? 'No movie specified.',
        song: matches?.groups?.song ?? 'No song specified.',
        title: matches?.groups?.title ?? 'Untitled',
        category: matches?.groups?.category ?? 'Uncategorized',
        dt: dt.toLocaleTimeString('en-us', options),
        body: body
    };
    // console.log('>> article', article)
    return entry;
}
