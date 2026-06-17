import { moment } from "obsidian";
import type { GoogleTasksSettings, Task } from "./types";

export const taskToTaskNote = (settings: GoogleTasksSettings, task: Task): Record<string, unknown> => {
    const elements: Record<string, unknown> = {}
    elements.title = task.title;
    elements.status = "open";
    if (settings.googleTaskIdProperty) {
        elements[settings.googleTaskIdProperty] = task.webViewLink;
    }
    if (task.due) {
        elements["due"] = moment.utc(task.due).local().format("YYYY-MM-DD");
    }

    if (settings.linksProperty && task.links && task.links.length > 0) {
        const links: string[] = []
        for (const link of task.links) {
            links.push(`[${link.description}](${link.link})`);
        }
        elements[settings.linksProperty] = links
    }
    
    if (task.notes) {
        elements["details"] = task.notes
    }

    return elements
}
