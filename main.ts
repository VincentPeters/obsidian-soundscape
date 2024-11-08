import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface ObsidianSounscapeSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianSounscapeSettings = {
	mySetting: 'default'
}


export default class ObsidianSounscape extends Plugin {
	settings: ObsidianSounscapeSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor('soundscape', (source, el, ctx) => {
			const predefinedOptions = ['youtube', 'loop', 'stop'];
			const options: { [key: string]: string | boolean } = {};

			el.addClass('soundscape');


			source.split('\n').forEach(line => {
				const [key, value] = line.split(':').map(part => part.trim());
				if (predefinedOptions.includes(key)) {
					options[key] = value === 'true' ? true : value === 'false' ? false : value;
				}
			});


			if (options['youtube']) {
				el.setText("youtube");
			}
		});


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ObsidianSounscapeSettingsTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ObsidianSounscapeSettingsTab extends PluginSettingTab {
	plugin: ObsidianSounscape;

	constructor(app: App, plugin: ObsidianSounscape) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
