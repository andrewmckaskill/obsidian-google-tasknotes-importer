import GoogleTasks from "src/GoogleTasksPlugin";
import { importTasks } from "./ImportTasks";
import { settingsAreCompleteAndLoggedIn } from "src/view/GoogleTasksSettingTab";
import { PLUGIN_ID } from "./types";


export class AutoImporter {
    plugin: GoogleTasks;
    intervalId?: number;

    constructor(plugin: GoogleTasks) {
        this.plugin = plugin;
    }

    start() {
        console.log(`${PLUGIN_ID}: checking auto-import`)
        if (!this.plugin.settings.autoImport ||
            this.plugin.settings.autoImportInterval == 0 ||
            this.intervalId
        )
            return

        console.log(`${PLUGIN_ID}: starting auto-import`)
        this.intervalId = window.setInterval(
            () => {
               this.runImport()
            },
            this.plugin.settings.autoImportInterval * 1000)
    }

    stop() {
        console.log(`${PLUGIN_ID}: stopping auto-import`)
        if (this.intervalId) {
            window.clearInterval(this.intervalId)
            this.intervalId = undefined
        }
    }

    refresh() {
        this.stop()
        this.start()
    }

    runImport() {
        console.log(`${PLUGIN_ID}: auto-import running`)
        if (!settingsAreCompleteAndLoggedIn(this.plugin, true)) {
            console.log(`${PLUGIN_ID}: auto-import cannot run`)
            return;
        }

        importTasks(this.plugin)
    }

}