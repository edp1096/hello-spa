/* https://www.youtube.com/watch?v=PCWaFLy3VUo , https://codepen.io/bradtraversy/pen/wvaXKoK */
import usercard from "template/user-card.htm"

const template = document.createElement('template')
template.innerHTML = usercard

class UserCard extends HTMLElement {
    showInfo: boolean

    constructor() {
        super()

        this.showInfo = true

        this.attachShadow({ mode: 'open' })
        this.shadowRoot?.appendChild(template.content.cloneNode(true))
        this.shadowRoot!.querySelector('h3')!.innerText = this.getAttribute('name') as string
        this.shadowRoot!.querySelector('img')!.src = this.getAttribute('avatar') as string
    }

    toggleInfo() {
        this.showInfo = !this.showInfo
        const info = this.shadowRoot?.querySelector('.info') as HTMLElement
        const toggleBtn = this.shadowRoot?.querySelector('#toggle-info') as HTMLButtonElement

        if (this.showInfo) {
            info.style.display = 'block'
            toggleBtn.innerText = 'Hide Info'
        } else {
            info.style.display = 'none'
            toggleBtn.innerText = 'Show Info'
        }
    }

    connectedCallback() {
        this.shadowRoot?.querySelector('#toggle-info')?.addEventListener("click", () => this.toggleInfo())
    }

    disconnectedCallback() {
        this.shadowRoot?.querySelector('#toggle-info')?.removeEventListener("", () => { })
    }
}

window.customElements.define('user-card', UserCard)

/* https://youtu.be/6BozpmSjk-Y */
import Dashboard from "page/dashboard.htm"
import Posts from "page/posts.htm"
import PostView from "page/post-view.htm"
import Settings from "page/settings.htm"

interface Route {
    path: string
    view: string
}

interface Match {
    route: Route,
    result: RegExpMatchArray | null
}

const pathToRegex = (path: string) => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$")

const getParams = (match: Match) => {
    const values = match.result!.slice(1)
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1])

    return Object.fromEntries(keys.map((key, i) => { return [key, values[i]] }))
}

const navigateTo = (url: string) => {
    history.pushState(null, "", url)
    router()
}

async function router() {
    const routes: Route[] = [
        { path: "/", view: Dashboard },
        { path: "/posts", view: Posts },
        { path: "/posts/:id", view: PostView },
        { path: "/settings", view: Settings }
    ]

    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        }
    })

    const defaultRoute = { route: routes[0], result: [location.pathname] } as Match
    const match: Match = potentialMatches.find(potentialMatch => potentialMatch.result !== null) ?? defaultRoute

    document.querySelector("#app")!.innerHTML = match.route.view
}

window.addEventListener("popstate", router)

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e: MouseEvent) => {
        const et = e.target as HTMLAnchorElement

        if (et.matches("[data-link]")) {
            e.preventDefault()
            navigateTo(et.href)
        }
    })

    router()
})

class Hello {
    constructor(public name: string) { this.name = name }
    greet() { return "Hello, " + this.name }
}

export default Hello