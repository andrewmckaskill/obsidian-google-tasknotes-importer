export const PLUGIN_ID = "google-tasks-tasknotes" 

export interface GoogleTasksSettings {
	googleRefreshToken: string;
	googleClientId: string;
	googleClientSecret: string;
	importTaskList: string;
	askConfirmation: boolean;
	completeOnImport: boolean;
	refreshInterval: number;
	showNotice: boolean;
	twoWaySync: boolean;
}

export interface TaskList {
	kind: string;
	id: string;
	etag: string;
	title: string;
	updated: string;
	selfLink: string;
}

export interface Task {
	kind: string;
	id: string;
	etag: string;
	title: string;
	updated: string;
	selfLink: string;
	parent?: string;
	position: string;
	notes: string;
	status: string;
	due: string;
	completed?: string;
	deleted: boolean;
	hidden: boolean;
	links: [
		{
			type: string;
			description: string;
			link: string;
		}
	];
	taskListName?: string;
	children?: Task[];
}

export interface TaskListResponse {
	kind: string;
	etag: string;
	items: TaskList[];
}

export interface TaskResponse {
	kind: string;
	etag: string;
	nextPageToken?: string;
	items: Task[];
}

export interface TaskInput {
	title: string;
	details: string;
	taskListId: string;
	due: string;
}

export interface TaskNotesMutationContext {
	source?: string;
	correlationId?: string;
	reason?: string;
}

export interface TaskNotesRuntimeApi {
	apiVersion: number;
	capabilities: readonly string[];
	hasCapability(capability: string): boolean;
	catalog?: {
		statuses(): readonly TaskNotesRuntimeCatalogOption[];
		priorities(): readonly TaskNotesRuntimeCatalogOption[];
		fields(): readonly TaskNotesRuntimeFieldDefinition[];
		writableFields(): readonly TaskNotesRuntimeFieldDefinition[];
		filterProperties(): readonly TaskNotesRuntimeFilterPropertyDefinition[];
		filterOperators(): readonly TaskNotesRuntimeFilterOperatorDefinition[];
		dependencyRelTypes(): readonly TaskNotesRuntimeCatalogOption[];
		events?(): readonly TaskNotesRuntimeEventDefinition[];
	};
	query?: {
		tasks(query?: TaskNotesRuntimeTaskQuery): Promise<TaskNotesRuntimeTaskQueryResult>;
		validate(query: unknown): TaskNotesRuntimeQueryValidationResult;
		normalize(query: unknown): TaskNotesRuntimeNormalizedTaskQuery;
		explain(query: unknown): Promise<TaskNotesRuntimeQueryExplainResult>;
		filterOptions(): Promise<unknown>;
	};
	tasks: {
		get(path: string): Promise<Record<string, unknown> | null>;
		list(query?: TaskNotesRuntimeTaskQuery): Promise<Record<string, unknown>[]>;
		create(input: Record<string, unknown>, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		update(path: string, patch: Record<string, unknown>, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		patch(path: string, patch: Record<string, unknown>, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		delete(path: string, context?: TaskNotesMutationContext): Promise<void>;
		complete(path: string, options?: Record<string, unknown>, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		uncomplete(path: string, options?: Record<string, unknown>, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		setStatus(path: string, status: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		setPriority(path: string, priority: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		setDue(path: string, date: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		clearDue(path: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		setScheduled(path: string, date: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		clearScheduled(path: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		reschedule(path: string, date: string | null, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		archive(path: string, archived: boolean, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		move(path: string, targetFolder: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		addTag(path: string, tag: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		removeTag(path: string, tag: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		addProject(path: string, project: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		removeProject(path: string, project: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		addContext(path: string, contextName: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		removeContext(path: string, contextName: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		addDependency(path: string, dependency: Record<string, unknown>, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		removeDependency(path: string, uid: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
	};
	relationships: {
		parents(path: string): Promise<Record<string, unknown>[]>;
		subtasks(path: string): Promise<Record<string, unknown>[]>;
		dependencies(path: string): Promise<ResolvedTaskDependency[]>;
		blocking(path: string): Promise<Record<string, unknown>[]>;
		all(path: string): Promise<TaskRelationshipSummary>;
	};
	time: {
		start(path: string, options?: Record<string, unknown>, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		stop(path: string, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		append(path: string, entry: Record<string, unknown>, context?: TaskNotesMutationContext): Promise<Record<string, unknown>>;
		active(): Promise<unknown[]>;
	};
	settings?: {
		snapshot(): Record<string, unknown>;
	};
	lifecycle?: {
		ready?(): Promise<void>;
		isReady?(): boolean;
		// on(event: string, handler: (payload: unknown) => void): EventRef;
		// off(ref: EventRef): void;
		list?(): readonly TaskNotesRuntimeLifecycleEventDefinition[];
	};
	errors?: {
		isApiError?(error: unknown): boolean;
		normalize(error: unknown): TaskNotesApiErrorPayload;
		toResult?<T>(operation: () => Promise<T> | T): Promise<TaskNotesApiResult<T>>;
	};
	events: {
		// on(event: string, handler: (payload: WorkflowTriggerPayload) => void): EventRef;
		// off(ref: EventRef): void;
		list?(): readonly TaskNotesRuntimeEventDefinition[];
	};
	extensions?: {
		register<TApi>(extension: {
			id: string;
			namespace: string;
			displayName?: string;
			version?: string;
			capabilities?: readonly string[];
			api: TApi;
		}): { unregister(): void };
	};
}

export interface TaskNotesRuntimeCatalogOption {
	id?: string;
	value?: string;
	label?: string;
	name?: string;
	displayName?: string;
}

export interface TaskNotesRuntimeFieldDefinition {
	id: string;
	label: string;
	valueType: TaskNotesRuntimeFieldValueType;
	source: TaskNotesRuntimeFieldSource;
	writable: boolean;
	queryable?: boolean;
	sortable?: boolean;
	groupable?: boolean;
	supportedOperators?: readonly TaskNotesRuntimeOperator[];
	frontmatterKey?: string;
	description?: string;
}

export type TaskNotesRuntimeFieldSource = "model" | "computed" | "file" | "user";

export type TaskNotesRuntimeFieldValueType =
	| "string"
	| "number"
	| "boolean"
	| "date"
	| "datetime"
	| "string[]"
	| "timeEntry[]"
	| "dependency[]"
	| "reminder[]"
	| "unknown";

export type TaskNotesRuntimeOperator =
	| "eq"
	| "ne"
	| "contains"
	| "notContains"
	| "in"
	| "notIn"
	| "exists"
	| "missing"
	| "lt"
	| "lte"
	| "gt"
	| "gte"
	| "isTrue"
	| "isFalse";

export interface TaskNotesRuntimeFilterOperatorDefinition {
	id: TaskNotesRuntimeOperator;
	label: string;
	valueRequired: boolean;
	appliesTo: readonly TaskNotesRuntimeFieldValueType[];
	aliases?: readonly string[];
}

export interface TaskNotesRuntimeFilterPropertyDefinition {
	id: string;
	label: string;
	category: string;
	valueType: TaskNotesRuntimeFieldValueType;
	source: TaskNotesRuntimeFieldSource;
	queryable: boolean;
	sortable: boolean;
	groupable: boolean;
	supportedOperators: readonly TaskNotesRuntimeOperator[];
	aliases?: readonly string[];
	frontmatterKey?: string;
	valueInputType: string;
}

export interface TaskNotesRuntimeTaskQuery {
	where?: TaskNotesRuntimePredicate;
	sort?: TaskNotesRuntimeSort[];
	limit?: number;
	offset?: number;
	group?: TaskNotesRuntimeGroup[];
	scope?: TaskNotesRuntimeQueryScope;
}

export type TaskNotesRuntimePredicate =
	| { all: TaskNotesRuntimePredicate[] }
	| { any: TaskNotesRuntimePredicate[] }
	| { not: TaskNotesRuntimePredicate }
	| TaskNotesRuntimeCondition;

export interface TaskNotesRuntimeCondition {
	field: string;
	op: TaskNotesRuntimeOperator | (string & {});
	value?: TaskNotesRuntimeValue;
}

export type TaskNotesRuntimeValue =
	| string
	| number
	| boolean
	| null
	| TaskNotesRuntimeValue[]
	| { fn: "today" | "now" }
	| { fn: "date"; value: string }
	| { fn: "dateAdd"; value: TaskNotesRuntimeValue; amount: number; unit: "day" | "week" | "month" };

export interface TaskNotesRuntimeSort {
	field: string;
	direction?: "asc" | "desc";
}

export interface TaskNotesRuntimeGroup {
	field: string;
}

export interface TaskNotesRuntimeQueryScope {
	includeArchived?: boolean;
	folders?: string[];
	excludeFolders?: string[];
}

export interface TaskNotesRuntimeNormalizedTaskQuery {
	where?: TaskNotesRuntimeNormalizedPredicate;
	sort: TaskNotesRuntimeSort[];
	limit?: number;
	offset: number;
	group: TaskNotesRuntimeGroup[];
	scope: Required<Pick<TaskNotesRuntimeQueryScope, "includeArchived">> &
		Omit<TaskNotesRuntimeQueryScope, "includeArchived">;
}

export type TaskNotesRuntimeNormalizedPredicate =
	| { all: TaskNotesRuntimeNormalizedPredicate[] }
	| { any: TaskNotesRuntimeNormalizedPredicate[] }
	| { not: TaskNotesRuntimeNormalizedPredicate }
	| TaskNotesRuntimeNormalizedCondition;

export interface TaskNotesRuntimeNormalizedCondition {
	field: string;
	op: TaskNotesRuntimeOperator;
	value?: TaskNotesRuntimeValue;
}

export interface TaskNotesRuntimeQueryIssue {
	path: string;
	code: string;
	message: string;
}

export interface TaskNotesRuntimeQueryWarning {
	path: string;
	code: string;
	message: string;
}

export interface TaskNotesRuntimeQueryValidationResult {
	valid: boolean;
	issues: TaskNotesRuntimeQueryIssue[];
	warnings: TaskNotesRuntimeQueryWarning[];
	normalized?: TaskNotesRuntimeNormalizedTaskQuery;
}

export interface TaskNotesRuntimeQueryGroup {
	key: string;
	label: string;
	taskPaths: string[];
}

export interface TaskNotesRuntimeQueryExplainResult {
	valid: boolean;
	query?: TaskNotesRuntimeNormalizedTaskQuery;
	issues: TaskNotesRuntimeQueryIssue[];
	warnings: TaskNotesRuntimeQueryWarning[];
	total?: number;
	matched?: number;
	returned?: number;
	groups?: TaskNotesRuntimeQueryGroup[];
	appliedSort?: TaskNotesRuntimeSort[];
	appliedLimit?: number;
	appliedOffset?: number;
	notes: string[];
}

export interface TaskNotesRuntimeTaskQueryResult {
	tasks: Record<string, unknown>[];
	total: number;
	matched: number;
	returned: number;
	groups?: TaskNotesRuntimeQueryGroup[];
	query: TaskNotesRuntimeNormalizedTaskQuery;
	warnings?: TaskNotesRuntimeQueryWarning[];
}

export interface TaskNotesRuntimeLifecycleEventDefinition {
	name: string;
	label: string;
	description?: string;
	category?: string;
}

export interface TaskNotesApiErrorPayload {
	name: "TaskNotesApiError";
	code: string;
	message: string;
	status: number;
	details?: unknown;
}

export type TaskNotesApiResult<T> =
	| { ok: true; value: T }
	| { ok: false; error: TaskNotesApiErrorPayload };

export interface ResolvedTaskDependency {
	dependency: Record<string, unknown>;
	task: Record<string, unknown> | null;
	path: string | null;
}

export interface TaskRelationshipSummary {
	task: Record<string, unknown>;
	parents: Record<string, unknown>[];
	subtasks: Record<string, unknown>[];
	dependencies: ResolvedTaskDependency[];
	blocking: Record<string, unknown>[];
}

export interface TaskNotesRuntimeEventDefinition {
	name: string;
	label: string;
	description?: string;
	category?: string;
}