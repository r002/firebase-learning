/**
    Accepts text {content} extracted from HTML.
    Uses regex to parse and transform that content into JSON.
    Returns a JSON object of that content.
*/

interface Article {
  movie: string;
  song: string; // | undefined;
  title: string;
  category: string;
  dt: string;
}

export function renderFeed (article: Article) : string {
  return `
        <div class="title-bar side-header"><a href="javascript:goHome();">${article.dt}</a></div>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${article.movie}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <iframe width="100%" height="300px" src="https://www.youtube.com/embed/${article.song}"
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
        <br /><br />
    `
}

export function renderBody (article: Article) : string {
  return `
    <span class="category highlight">${article.category.toUpperCase()}</span>
    <div class="title">${article.title}</div>
    <div class="title-date">🕒 ${article.dt}</div>
  `
}

export function read (content: String) : Article {
// Split the text content into its individual consituient lines.
  const lines = content.split('\n')
  console.log('>> lines', lines)

  // We assume:
  // The first line always be our movie trailer and
  // the second line will always be our song.
  let re = /<movie>(.*)<\/movie>/g
  let matches = re.exec(lines[0])
  console.log('>> matches', matches)
  const movie: string = matches?.[1] ?? 'No movie specified.'
  // const movie = matches != null ? matches[1] : null

  re = /<song>(.*)<\/song>/g
  matches = re.exec(lines[1])
  const song: string = matches?.[1] ?? 'No song specified.'

  re = /<title>(.*)<\/title>/g
  matches = re.exec(lines[2])
  const title: string = matches?.[1] ?? 'Untitled'

  re = /<category>(.*)<\/category>/g
  matches = re.exec(lines[3])
  const category: string = matches?.[1] ?? 'Uncategorized'

  const dt = new Date()
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }

  const article: Article = {
    movie: movie,
    song: song,
    title: title,
    category: category,
    dt: dt.toLocaleTimeString('en-us', options)
  }
  // console.log(article)
  return article

  // let re2 = /(---)/g
  // // let matches2 = re2.exec(text)
  // // console.log(">> matches2", matches2)
  // // let dt = matches2[1]
  // // console.log("dt", dt)
  // let dt = formatDatetime()

  // content = content.replace(re, `${cat}`).
  //             replace(re2, `${dt}`).
  //             replace(/\n/g, "<br />")

// console.log(">> final output:", content)
// return content
}

/// /////////////////////////////////////////

let renderWindow: Window | null

function extractText () : void {
  const text: string = (<HTMLTextAreaElement>document.querySelector('#editor_view')).value
  // console.log('>> read text', text)
  const article: Article = read(text)
  renderWindow!.document.querySelector('#feed')!.innerHTML = renderFeed(article)
  renderWindow!.document.querySelector('#render_view')!.innerHTML = renderBody(article)
}

// Only runs once upon initial page load.
function openRender () : void {
  renderWindow =
    window.open('render.html', 'renderTarget',
      'height=1600,width=1600,status=yes,toolbar=no,menubar=no,location=no')
}

// This event hander will listen for messages from the child window.
window.addEventListener('message', function () {
  // console.log('child message received!')
  extractText()
}, false)

// Runs on initial page load.
window.onload = () => {
  // console.log('>> Ready!')
  openRender()
}

document.getElementById('editor_view')!
  .addEventListener('keyup', e => {
    // console.log(">> key up", e)
    if (e.ctrlKey && e.key === 'Enter') {
      extractText()
    }
  })
