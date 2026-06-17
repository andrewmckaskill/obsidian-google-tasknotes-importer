import { Editor, MarkdownFileInfo, Plugin, Notice} from "obsidian";
import { type GoogleTasksSettings, PLUGIN_ID } from "./helper/types";
import { getAllTasksFromList } from "./googleApi/ListAllTasks";
import {
	GoogleCompleteTask,
} from "./googleApi/GoogleCompleteTask";
import {
	GoogleTasksSettingTab,
	settingsAreCompleteAndLoggedIn,
} from "./view/GoogleTasksSettingTab";
import { taskToList } from './helper/TaskToList';
import { TaskNotesBridge } from "./helper/TaskNotesBridge";
import { randomUUID } from "crypto";
import { taskToTaskNote } from "./helper/TaskToTaskNote";


const DEFAULT_SETTINGS: GoogleTasksSettings = {
	googleRefreshToken: "",
	googleClientId: "",
	googleClientSecret: "",
	importTaskList: "",
	askConfirmation: true,
	completeOnImport: true,
	refreshInterval: 300,
	showNotice: true,
	twoWaySync: true,
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
		
		const createTaskNotes = async () => {
			if (!this.taskNotes.available) {
				console.log(`${PLUGIN_ID}: tasknotes not available`)
				return
			}

			const tasks = await getAllTasksFromList(this, this.plugin.settings.importTaskList, null, null, false)
			const notes: Record<string, unknown>[] = tasks.map(taskToTaskNote)

			
			for (let index = 0; index < notes.length; index++) {
				const note = notes[index];
				await this.taskNotes.createTask(note, {
						source: PLUGIN_ID,
						correlationId: randomUUID()
				})
			}

			if (this.plugin.settings.completeOnImport) {
				tasks.forEach((task) => {
					console.log(`${PLUGIN_ID}: deleting task ${task.id}: ${task.title}`)
					GoogleCompleteTask(this, task);
				})
			}
			else {
				console.log(`${PLUGIN_ID}: skipping delete`)
			} 

			if (notes.length == 0) {
				new Notice("No tasks to import")
				return;
			}
			else {
				new Notice(`${notes.length} tasks imported`)
				return;
			}
		};

		const writeTodoIntoFile = async (editor: Editor) => {
			const tasks = await getAllTasksFromList(this, this.plugin.settings.importTaskList, null, null, false)
			const taskLines = tasks.map(taskToList)
		
			const importButton = "`" + `BUTTON[import-${PLUGIN_ID}]` + "`"
			const editorContent = editor.getValue();

			if (editorContent.includes(importButton)) {
				console.log(`${PLUGIN_ID}: insert near button`)
				const updatedContent = editorContent.replace(importButton, importButton + "\n" + taskLines.join("").trimEnd());
				editor.setValue(updatedContent);
			} else {
				console.log(`${PLUGIN_ID}: insert at cursor`)
				const cursor = editor.getCursor()
				cursor.ch = 0
				editor.replaceRange(taskLines.join(""), cursor)	
			}

			if (this.plugin.settings.completeOnImport) {
				tasks.forEach((task) => {
					console.log(`${PLUGIN_ID}: deleting task ${task.id}: ${task.title}`)
					GoogleCompleteTask(this, task);
				})
			}
			else {
				console.log(`${PLUGIN_ID}: skipping delete`)
			} 
		};

		this.addCommand({
			id: "import-google-tasks-to-tasknotes",
			name: "Import Google Tasks to TaskNotes",

			callback: () => {

				if (!settingsAreCompleteAndLoggedIn(this, true))
					return;

				createTaskNotes();

			},
		});


		this.addCommand({
			id: "insert-uncompleted-google-tasks",
			name: "Insert Uncompleted Google Tasks",
			editorCheckCallback: (
				checking: boolean,
				editor: Editor,
				_ctx: MarkdownFileInfo
			) => {
				const canRun = settingsAreCompleteAndLoggedIn(this, false);

				if (checking) {
					return canRun;
				}

				if (!canRun) {
					return;
				}

				writeTodoIntoFile(editor);
				return true;
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
