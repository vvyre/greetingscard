import { Word } from './Word'
import { saveCard } from './pdf'
import './style.css'
import { replaceInputWithWord } from './utils/replaceInputWithWord'
import { loadWords } from './words'

const { tier1, tier2, tier3, tier4 } = loadWords()

const app = document.querySelector<HTMLDivElement>('#app')!
const container = document.createElement('div')
container.id = 'card'
container.classList.add('container')
const frag = document.createDocumentFragment()

let selected: Set<string> = new Set()

for (const w of [...tier1, ...tier2, ...tier3]) {
  const { el, onClick } = Word(w)
  onClick(e => {
    console.log(e.target)
    const isSelected = selected.has(w)
    if (isSelected) {
      selected.delete(w)
      delete el.dataset.selected
    } else {
      selected.add(w)
      el.dataset.selected = 'true'
    }
  })
  frag.append(el)
}

const footer = document.createElement('footer')
const input = document.createElement('input')
input.setAttribute('type', 'text')
input.setAttribute('placeholder', '작성자')
input.classList.add('username')

const footerContainerElements = document.createElement('div')
const tier4Refs: Array<{ w: string; el: HTMLElement }> = []

for (const w of tier4) {
  const { el, onClick } = Word(w)
  tier4Refs.push({ w, el })

  onClick(() => {
    if (status !== 'completed') return

    for (const item of tier4Refs) {
      if (item.w === w) {
        item.el.dataset.selected = 'true'
        item.el.classList.remove('excluded')
      } else {
        delete item.el.dataset.selected
        item.el.classList.add('excluded')
      }
    }
  })

  footerContainerElements.append(el)
}
let status = 'editing'
const btn = document.createElement('button')
btn.setAttribute('type', 'button')
btn.classList.add('complete-btn')
btn.innerText = '완성하기'
footer.append(btn)

frag.append(footer)

const loading = document.createElement('div')
loading.classList.add('loading')

btn.onclick = async () => {
  if (status === 'editing') {
    const nodes = document.querySelectorAll('.word')
    nodes.forEach(n => n.getAttribute('data-selected') || n.classList.add('excluded'))

    footer.append(input)
    footer.append(footerContainerElements)
    btn.innerText = '저장하기'
    status = 'completed'
  } else if (status === 'completed') {
    input.setAttribute('disabled', 'true')
    replaceInputWithWord(input)
    btn.style.visibility = 'hidden'
    app.prepend(loading)
    await saveCard()
    loading.remove()
    status = 'finished'
    btn.innerText = '다시 쓰기'
  } else {
    window.location.reload()
  }
}

container.append(frag)
app.replaceChildren(container)
