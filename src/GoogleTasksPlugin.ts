import { Plugin, Notice} from "obsidian";
import { type GoogleTasksSettings } from "./helper/types";
import {
	GoogleTasksSettingTab,
	settingsAreCompleteAndLoggedIn,
} from "./view/GoogleTasksSettingTab";
import { TaskNotesBridge } from "./helper/TaskNotesBridge";
import { importTasks } from "./helper/ImportTasks";


const DEFAULT_SETTINGS: GoogleTasksSettings = {
	googleRefreshToken: "",
	googleClientId: "",
	googleClientSecret: "",
	importTaskList: "",
	completeOnImport: true,
	refreshInterval: 300,
	showNotice: true,
};

export default class GoogleTasks extends Plugin {
	settings!: GoogleTasksSettings;
	plugin!: GoogleTasks;
	taskNotes!: TaskNotesBridge;
	showHidden = false;
	

	async onload() {
		await this.loadSettings();
		this.plugin = this;
		this.taskNotes = new TaskNotesBridge(this.app);
		
		this.addCommand({
			id: "import-google-tasks-to-tasknotes",
			name: "Import Tasks",

			callback: () => {

				if (!settingsAreCompleteAndLoggedIn(this, true))
					return;

				importTasks(this);

			},
		});

		this.addCommand({
			id: "copy-google-refresh-token",
			name: "Copy Google Refresh Token to Clipboard",

			callback: () => {
				const token = this.settings.googleRefreshToken;
				if (!token) {
					new Notice("No Refresh Token. Please Login.")
					return;
				}

				navigator.clipboard.writeText(token).then(() => {
					new Notice("Token copied")
				}, () => {
					new Notice("Could not copy token")
				});

			},
		});

		this.addSettingTab(new GoogleTasksSettingTab(this.app, this));
	}


	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
