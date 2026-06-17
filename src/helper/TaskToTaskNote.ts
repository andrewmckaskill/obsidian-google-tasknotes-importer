import { moment } from "obsidian";
import type { Task } from "./types";

export const taskToTaskNote = (task: Task): Record<string, unknown> => {
    const elements: Record<string, unknown> = {}
    elements.title = task.title;
    elements.status = "open";
    elements["google-task-id"] = `https://tasks.google.com#id=${task.id}`
    if (task.due) {
        elements["due"] = moment.utc(task.due).local().format("YYYY-MM-DD");
    }

    if (task.links && task.links.length > 0) {
        const links: string[] = []
        for (const link of task.links) {
            links.push(`[${link.description}](${link.link})`);
        }
        elements["links"] = links
    }
    
    if (task.notes) {
        elements["details"] = task.notes
    }

    return elements
}
