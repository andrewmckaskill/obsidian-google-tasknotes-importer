import { createNotice } from "../helper/NoticeHelper";
import {
	PluginSettingTab,
	App,
	Setting,
	Notice,
	ButtonComponent,
	Platform,
	DropdownComponent
} from "obsidian";
import { customSetting } from "../helper/CustomSettingElement";
import { LoginGoogle } from "../googleApi/GoogleAuth";
import type GoogleTasks from "../GoogleTasksPlugin";
import { getAllTaskLists } from "../googleApi/ListAllTasks";
import { ClearTokens } from "../helper/LocalStorage";

export class GoogleTasksSettingTab extends PluginSettingTab {
	plugin: GoogleTasks;

	constructor(app: App, plugin: GoogleTasks) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings for Google TaskNotes Importer" });

		new Setting(containerEl)
			.setName("ClientId")
			.setDesc("Google client id")
			.addText((text) =>
				text
					.setPlaceholder("Enter your client id")
					.setValue(this.plugin.settings.googleClientId)
					.onChange(async (value) => {
						this.plugin.settings.googleClientId = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("ClientSecret")
			.setDesc("Google client secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your client secret")
					.setValue(this.plugin.settings.googleClientSecret)
					.onChange(async (value) => {
						this.plugin.settings.googleClientSecret = value;
						await this.plugin.saveSettings();
						refreshTaskLists()
						this.plugin.autoImporter.refresh()
					})
			);

		const AuthSetting = new Setting(containerEl);

		const createLogOutButton = (button: ButtonComponent) => {
			button.setButtonText("Logout");
			button.onClick(async () => {
				this.plugin.settings.googleRefreshToken = "";
				await this.plugin.saveSettings();
				ClearTokens();
				this.plugin.autoImporter.refresh()
				this.display();
			});
		};

		if (Platform.isDesktop) {
			if (this.plugin.settings.googleRefreshToken) {
				AuthSetting.setName("Logout");
				AuthSetting.setDesc("Logout off your Google Account");
				AuthSetting.addButton(createLogOutButton);
			} else {
				AuthSetting.setName("Login");
				AuthSetting.setDesc("Login to your Google Account");
				AuthSetting.addButton((button: ButtonComponent) => {
					button.setButtonText("Login");
					button.onClick(async () => {
						if (settingsAreCorrect(this.plugin)) {
							LoginGoogle(this.plugin)
								.then(refreshTaskLists)
								.then(this.plugin.autoImporter.refresh)

							let count = 0;
							const intId = setInterval(() => {
								count++;

								if (count > 900) {
									clearInterval(intId);
								} else if (this.plugin.settings.googleRefreshToken) {
									clearInterval(intId);
									this.display();
								}
							}, 200);
						}
					});
				});
			}
		} else {
			new Setting(containerEl)
				.setName("Refresh Token")
				.setDesc("Google Refresh Token from OAuth")
				.addText((text) =>
					text
						.setPlaceholder("Enter refresh token")
						.setValue(this.plugin.settings.googleRefreshToken)
						.onChange(async (value) => {
							this.plugin.settings.googleRefreshToken = value;
							await this.plugin.saveSettings()
							this.plugin.autoImporter.refresh()
						})
				);
		}

		
		const taskListSetting = new Setting(containerEl)
			.setName("Task List To Import From")
			.setDesc("Select the task list to import tasks from")
			.addDropdown((dropdown) => {
				dropdown.setValue(this.plugin.settings.importTaskList);
				dropdown.onChange(async (value) => {
					this.plugin.settings.importTaskList = value
					await this.plugin.saveSettings()
				})
				dropdown.addOption("", "Loading...")
			})

		const refreshTaskLists = async () => {
			const ctrl = taskListSetting.components[0] as DropdownComponent

			ctrl.selectEl.empty()

			if (!settingsAreCompleteAndLoggedIn(this.plugin)) {
				ctrl.selectEl.empty();
				ctrl.addOption(this.plugin.settings.importTaskList, "Login first")
				return
			}

			const options: { [index:string]: string } = {};
			const taskLists = await getAllTaskLists(this.plugin)
			for (const taskList of taskLists) {
				options[taskList.id] = taskList.title;
			}
			if (this.plugin.settings.importTaskList === "") {
				this.plugin.settings.importTaskList = taskLists[0].id
			}
			ctrl.selectEl.empty()
			ctrl.addOptions(options)
		}

		new Setting(containerEl)
				.setName("Custom Links Property")
				.setDesc("Custom TaskNotes property (type: list) to store links in (e.g. from gmail, docs, sheets, etc).")
				.addText((text) =>
					text
						.setPlaceholder("Enter links property")
						.setValue(this.plugin.settings.linksProperty)
						.onChange(async (value) => {
							this.plugin.settings.linksProperty = value;
							await this.plugin.saveSettings()
						})
				);
		
		new Setting(containerEl)
				.setName("Custom Google Task Id Property")
				.setDesc("Custom TaskNotes property (type:string) to store a link to the original google task in")
				.addText((text) =>
					text
						.setPlaceholder("Enter google task id property")
						.setValue(this.plugin.settings.googleTaskIdProperty)
						.onChange(async (value) => {
							this.plugin.settings.googleTaskIdProperty = value;
							await this.plugin.saveSettings()
						})
				);

		new Setting(containerEl)
			.setName("Notifications")
			.setDesc("Show notifications of info and errors")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.showNotice);
				toggle.onChange(async (state) => {
					this.plugin.settings.showNotice = state;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName("Auto-Import")
			.setDesc("Automatically import tasks in the background")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.settings.autoImport);
				toggle.onChange(async (state) => {
					this.plugin.settings.autoImport = state;
					await this.plugin.saveSettings();
					this.plugin.autoImporter.refresh();
				});
			});


		const AutoImportInterval = customSetting(
			containerEl,
			"Auto-Import Interval",
			"Time in seconds between auto-import attempts"
		).createEl("input", {
			type: "number",
		});
		AutoImportInterval.value = this.plugin.settings.autoImportInterval + "";
		AutoImportInterval.min = "10";
		AutoImportInterval.step = "1";
		AutoImportInterval.addEventListener("input", async () => {
			this.plugin.settings.autoImportInterval = parseInt(
				AutoImportInterval.value
			);
			
			await this.plugin.saveSettings();
			this.plugin.autoImporter.refresh();
		});

		refreshTaskLists();
	}
}

export function settingsAreComplete(
	plugin: GoogleTasks,
	showNotice = true
): boolean {
	if (
		plugin.settings.googleClientId == "" ||
		plugin.settings.googleClientSecret == ""
	) {
		createNotice(plugin, "Google Tasks missing settings", showNotice);
		return false;
	}
	return true;
}

export function settingsAreCorrect(plugin: GoogleTasks): boolean {
	if (
		!/^[0-9a-zA-z-]*\.apps\.googleusercontent\.com$/.test(
			plugin.settings.googleClientId
		)
	) {
		new Notice("Client ID Token is not the correct format");
		return false;
	} else if (
		!/^[0-9a-zA-z-]*$/.test(plugin.settings.googleClientSecret)
	) {
		new Notice("Client Secret is not the correct format");
		return false;
	}
	return true;
}

export function settingsAreCompleteAndLoggedIn(
	plugin: GoogleTasks,
	showNotice = true
): boolean {
	if (!settingsAreComplete(plugin, false) || plugin.settings.googleRefreshToken == "") {
		createNotice(
			plugin,
			"Google Tasks missing settings or not logged in",
			showNotice
		);

		return false;
	}
	return true;
}
