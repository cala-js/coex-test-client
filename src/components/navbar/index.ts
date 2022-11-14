import { Component } from '@classes'
import { IComponentOptions } from '@interfaces'
import template from './navbar.html?raw'

const options: IComponentOptions = {
    name: 'NavBar',
    template: template,
    vars(self) {
        return {}
    },
    listeners: [],
}

export const NavBar = new Component(options)
