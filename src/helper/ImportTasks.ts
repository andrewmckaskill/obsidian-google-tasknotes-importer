import { randomUUID } from "crypto"
import { GoogleCompleteTask } from "src/googleApi/GoogleCompleteTask"
import { getAllTasksFromList } from "src/googleApi/ListAllTasks"
import GoogleTasks from "src/GoogleTasksPlugin"
import { taskToTaskNote } from "./TaskToTaskNote"
import { PLUGIN_ID } from "./types"
import { createNotice } from "./NoticeHelper"

export async function importTasks(
    plugin: GoogleTasks
) {
    if (!plugin.taskNotes.available) {
        console.log(`${PLUGIN_ID}: tasknotes not available`)
        return
    }

    const tasks = await getAllTasksFromList(plugin, plugin.settings.importTaskList, null, null, false)
    const notes: Record<string, unknown>[] = tasks.map(taskToTaskNote)


    for (let index = 0; index < notes.length; index++) {
        const note = notes[index];
        await plugin.taskNotes.createTask(note, {
            source: PLUGIN_ID,
            correlationId: randomUUID()
        })
    }

    if (plugin.settings.completeOnImport) {
        tasks.forEach((task) => {
            console.log(`${PLUGIN_ID}: completing task ${task.id}: ${task.title}`)
            GoogleCompleteTask(plugin, task);
        })
    }
    else {
        console.log(`${PLUGIN_ID}: skipping delete`)
    }

    if (notes.length == 0) {
        createNotice(plugin, "No tasks to import")
        return;
    }
    else {
        createNotice(plugin, `${notes.length} tasks imported`)
        return;
    }
}