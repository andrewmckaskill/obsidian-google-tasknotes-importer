import type { App } from "obsidian";

import type {
    TaskNotesMutationContext,
	TaskNotesRuntimeApi} from "./types";

interface PluginWithApi {
	api?: TaskNotesRuntimeApi;
}

export class TaskNotesBridge {
	
	constructor(private readonly app: App) {}

	get api(): TaskNotesRuntimeApi | null {
		const app = this.app as App & {
			plugins?: { getPlugin(id: string): unknown };
		};
		const plugin = app.plugins?.getPlugin("tasknotes") as PluginWithApi | null;
		const api = plugin?.api;
		if (!api || typeof api.apiVersion !== "number") return null;
		return api;
	}

	get available(): boolean {
		return this.api !== null;
	}

	get missingReason(): string | null {
		if (this.available) return null;
		return "TaskNotes is not loaded or does not expose the runtime API.";
	}

    createTask(input: Record<string, unknown>, context?: TaskNotesMutationContext): Promise<Record<string, unknown>> {
        const api = this.api;
        if (!api?.tasks?.create) return Promise.reject()
        return api.tasks.create(input, context)
    }
}

