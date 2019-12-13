/* Apps To Panel GNOME Shell extension
 *
 * Copyright (C) 2019 Leandro Vital <leavitals@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const Main = imports.ui.main;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;
const Atk = imports.gi.Atk;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Prefs = Me.imports.prefs;
const Dash = Me.imports.dash;

let activities;
let applicationsButton;
let activitiesButton;

let applications_overview;
let activities_overview;

const ApplicationsIconMenu = new Lang.Class({
    Name: 'ApplicationsIconMenu',
    Extends: PanelMenu.Button,

    _init()
    {
        this.parent(1, 'ApplicationsIconMenu', false);

        let hbox = new St.BoxLayout({ style_class: 'panel-applications' });

        let pref_applications_view = Prefs.get_applications_view();

        if (pref_applications_view != 'text')
        {
            this._icon = new St.Icon({
                icon_name: 'view-app-grid-symbolic',
                style_class: 'system-status-icon'
            });
            hbox.add_child(this._icon);
        }

        if (pref_applications_view != 'icon')
        {
            this._label = new St.Label({
                text: _('Applications'),
                y_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });
            hbox.add_child(this._label);
        }

        this.add_actor(hbox);

        Main.overview.viewSelector.connect('page-changed', () => {
            if (Main.overview.viewSelector._activePage != Main.overview.viewSelector._workspacesPage) {
                this.add_style_pseudo_class('overview');
            } else {
                this.remove_style_pseudo_class('overview');
            }
        });

        Main.overview.connect('hiding', Lang.bind(this, function() {
            this.remove_style_pseudo_class('overview');
        }));

        this.connect('button-press-event', Lang.bind(this, this._showApplications));

    },

    destroy()
    {
        this.parent();
    },

    _showApplications()
    {
        changePage(true);
    },
});

const ActivitiesIconMenu = new Lang.Class({
    Name: 'ActivitiesIconMenu',
    Extends: PanelMenu.Button,

    _init(labelText)
    {
        this.parent(1, 'ActivitiesIconMenu', false);

        let hbox = new St.BoxLayout({ style_class: 'panel-activities' });

        let pref_activities_view = Prefs.get_activities_view();

        if (pref_activities_view != 'text')
        {
            this._icon = new St.Icon({
                icon_name: 'focus-windows-symbolic',
                style_class: 'system-status-icon'
            });
            hbox.add_child(this._icon);
        }

        if (pref_activities_view != 'icon')
        {
            this._label = new St.Label({
                text: _('Activities'),
                y_expand: true,
                y_align: Clutter.ActorAlign.CENTER,
            });
            hbox.add_child(this._label);
        }

        this.add_actor(hbox);

        Main.overview.viewSelector.connect('page-changed', () => {
            if (Main.overview.viewSelector._activePage == Main.overview.viewSelector._workspacesPage) {
                this.add_style_pseudo_class('overview');
            } else {
                this.remove_style_pseudo_class('overview');
            }
        });

        Main.overview.connect('hiding', Lang.bind(this, function() {
            this.remove_style_pseudo_class('overview');
        }));

        this.connect('button-press-event', Lang.bind(this, this._showWorkspaces));
    },

    destroy()
    {
        this.parent();
    },

    _showWorkspaces()
    {
        changePage(false);
    }
});


function changePage(appsButtonChecked)
{
    // selecting the same view again will hide the overview
    if (Main.overview.visible && appsButtonChecked == Main.overview.viewSelector._showAppsButton.checked) {
        Main.overview.hide();
    } else {
        Main.overview.viewSelector._showAppsButton.checked = appsButtonChecked;
    }

    if (!Main.overview.visible) {
        Main.overview.show();
    }
}

function init()
{
    activities = Main.panel.statusArea['activities'];

    this.dash = new Dash.Dash();

    Prefs.init();
    Prefs.settings.connect('changed', _refresh);
}

function enable()
{
    activities.container.hide();

    if (Prefs.settings.get_boolean('hide-dash')) {
        this.dash.hideDash();
    }
    this.dash.hideShowAppsButton();

    applicationsButton = new ApplicationsIconMenu();
    activitiesButton = new ActivitiesIconMenu();

    Main.panel.addToStatusArea('applicationsiconmenu', applicationsButton, 0, 'left');
    Main.panel.addToStatusArea('activitiesiconmenu', activitiesButton, 1, 'left');
}

function disable()
{
    applicationsButton.destroy();
    activitiesButton.destroy();

    this.dash.showDash();
    this.dash.showShowAppsButton();

    activities.container.show();
}

var _refresh = function ()
{
    disable();
    enable();
}