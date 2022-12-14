import {
    IComponent,
    IComponentElement,
    IComponentVars,
    IEventRegister,
} from '@interfaces'
import { replaceInString } from '@utils'

export class ComponentElement implements IComponentElement {
    private creator: HTMLTemplateElement
    private instance!: HTMLElement

    constructor(private template: string) {
        this.creator = document.createElement('template')
        this.setCreator(this.template)
        this.updateMemoryReference()
    }
    private setCreator(stringHTML: string): void {
        this.creator.innerHTML = stringHTML.trim()
    }
    public get self(): HTMLElement {
        return this.instance
    }
    private updateMemoryReference(): void {
        this.instance = this.creator.content.firstElementChild as HTMLElement
    }
    public update(vars: IComponentVars, props: IComponentVars): void {
        let updatedTemplate: string = this.template
        let keys: string[]
        // iterating vars
        keys = Object.keys(vars)
        keys.forEach(key => {
            let variable = `{{this.${key}}}`
            let value = vars[key]
            updatedTemplate = replaceInString(updatedTemplate, variable, value)
        })
        // iterating props
        keys = Object.keys(props)
        keys.forEach(key => {
            let prop = `{{${key}}}`
            let value = props[key]
            updatedTemplate = replaceInString(updatedTemplate, prop, value)
        })
        // updating values
        this.creator.innerHTML = updatedTemplate
        this.updateMemoryReference()
    }
    public querySelector(query: string): HTMLElement[] {
        if (query) {
            return Array.from(this.self.querySelectorAll(query)!)
        } else {
            return [this.self]
        }
    }
    public getAttribute(attr: string): string | null {
        return this.self.getAttribute(attr)
    }
    public setAttribute(attr: string, value: string): void {
        this.self.setAttribute(attr, value)
    }
    public addListeners(
        componentInstance: IComponent,
        listeners: IEventRegister[]
    ): void {
        listeners.forEach(listener => {
            let targets = this.querySelector(listener.targetQuery)
            targets.forEach(target => {
                target.addEventListener(
                    listener.event,
                    () => {
                        listener.callback(componentInstance)
                    },
                    listener.options
                )
            })
        })
    }
    public replace(child: HTMLElement, newComponent: IComponent): void {
        let attributes = Array.from(child.attributes)
        attributes.forEach(attr => {
            newComponent.content.setAttribute(attr.nodeName, attr.nodeValue!)
        })
        newComponent.load()
        child.classList.forEach(iClass =>
            newComponent.content.classList.add(iClass)
        )
        child.replaceWith(newComponent.content)
    }
}
