// ---- Types ----

export interface IntFeature {
  icon: string
  color: string
  bg: string
  title: string
  desc: string
}

export interface IntStep {
  t: string
  d: string
}

export interface IntConfig {
  label: string
  sub: string
  type: 'text' | 'select' | 'toggle'
  val: string | boolean
  opts?: string[]
}

export interface IntSyncLogEntry {
  dot: string
  text: string
  time: string
}

export interface IntAppData {
  features: IntFeature[]
  steps: IntStep[]
  reqs: string[]
  workspace: string | null
  connectedBy: string | null
  connectedDate: string | null
  syncLog: IntSyncLogEntry[]
  config: IntConfig[]
}

export type IntAppStatus = 'connected' | 'available' | 'beta' | 'error'

export interface IntApp {
  id: string
  name: string
  category: string
  emoji: string
  logoColor: string
  status: IntAppStatus
  users: number
  syncedAt: string | null
  calls: number
  perms: string[]
}

export interface IntActivityItem {
  dot: string
  text: string
  time: string
}

export interface IntApiKey {
  id: string
  label: string
  val: string
  scope: string
  created: string
  expires: string
}

export interface IntUsageRow {
  name: string
  count: number
  color: string
  max: number
}

export interface IntWebhook {
  active: boolean
  url: string
  event: string
}

export interface IntSyncRule {
  name: string
  detail: string
  on: boolean
}

// ---- Data ----

export const INT_APPS: IntApp[] = [
  { id: 'slack', name: 'Slack', category: 'Communication', emoji: '\u{1F4AC}', logoColor: '#4A154B', status: 'connected', users: 12, syncedAt: '2 min ago', calls: 847, perms: ['Read channel messages', 'Post messages to channels', 'Manage webhooks'] },
  { id: 'github', name: 'GitHub', category: 'Development', emoji: '\u{1F419}', logoColor: '#24292e', status: 'connected', users: 8, syncedAt: '5 min ago', calls: 2341, perms: ['Read repository data', 'Create issues', 'Receive push events'] },
  { id: 'figma', name: 'Figma', category: 'Design', emoji: '\u{1F3A8}', logoColor: '#F24E1E', status: 'connected', users: 5, syncedAt: '12 min ago', calls: 412, perms: ['Read file contents', 'List projects', 'Access design tokens'] },
  { id: 'notion', name: 'Notion', category: 'Productivity', emoji: '\u{1F4DD}', logoColor: '#000000', status: 'connected', users: 9, syncedAt: '18 min ago', calls: 619, perms: ['Read database items', 'Create & update pages', 'Search workspace'] },
  { id: 'google-drive', name: 'Google Drive', category: 'Storage', emoji: '\u{1F4C1}', logoColor: '#1DA462', status: 'available', users: 0, syncedAt: null, calls: 0, perms: ['Read files you select', 'Upload files', 'Create shared folders'] },
  { id: 'jira', name: 'Jira', category: 'Development', emoji: '\u{1F535}', logoColor: '#0052CC', status: 'available', users: 0, syncedAt: null, calls: 0, perms: ['Read issues & projects', 'Create & update issues', 'Manage sprints'] },
  { id: 'linear', name: 'Linear', category: 'Development', emoji: '\u26A1', logoColor: '#5E6AD2', status: 'beta', users: 0, syncedAt: null, calls: 0, perms: ['Read teams & issues', 'Create issues', 'Receive webhook events'] },
  { id: 'zoom', name: 'Zoom', category: 'Communication', emoji: '\u{1F4F9}', logoColor: '#2D8CFF', status: 'available', users: 0, syncedAt: null, calls: 0, perms: ['Create meetings', 'Read scheduled meetings', 'Access recordings'] },
  { id: 'google-calendar', name: 'Google Calendar', category: 'Productivity', emoji: '\u{1F4C5}', logoColor: '#4285F4', status: 'connected', users: 14, syncedAt: '1 hr ago', calls: 288, perms: ['Read calendar events', 'Create & update events', 'Manage reminders'] },
  { id: 'datadog', name: 'Datadog', category: 'Analytics', emoji: '\u{1F4CA}', logoColor: '#774AA4', status: 'connected', users: 3, syncedAt: '12 min ago', calls: 94, perms: ['Read metrics & logs', 'Create monitors', 'Receive alert webhooks'] },
  { id: 'dropbox', name: 'Dropbox', category: 'Storage', emoji: '\u{1F4E6}', logoColor: '#0061FF', status: 'available', users: 0, syncedAt: null, calls: 0, perms: ['Read shared folders', 'Upload files', 'Create shared links'] },
  { id: 'zapier', name: 'Zapier', category: 'Productivity', emoji: '\u26A1', logoColor: '#FF4A00', status: 'available', users: 0, syncedAt: null, calls: 0, perms: ['Trigger zap events', 'Read task & project data', 'Create tasks via webhooks'] },
]

export const INT_APP_DATA: Record<string, IntAppData> = {
  slack: {
    features: [
      { icon: 'bell', color: '#4A154B', bg: 'rgba(74,21,75,0.15)', title: 'Real-time Notifications', desc: 'Get task updates, completions, and mentions sent instantly to any channel.' },
      { icon: 'calendar', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Sprint Digests', desc: 'Daily and weekly digest of progress, blockers, and team velocity.' },
      { icon: 'git-branch', color: '#00D4AA', bg: 'rgba(0,212,170,0.12)', title: 'GitHub Round-trips', desc: 'PR status and code review reminders loop back to the right Slack thread.' },
    ],
    steps: [
      { t: 'Authorize with Slack OAuth', d: 'Click Connect and grant ChronoLoop permission to post in your workspace.' },
      { t: 'Pick your notification channel', d: 'Choose #dev-team or any channel to receive task updates.' },
      { t: 'Configure digest schedule', d: "Set daily/weekly summaries. You're live within 30 seconds." },
    ],
    reqs: ['Slack workspace admin or channel manager role', 'Slack plan: Free, Pro, or Business+'],
    workspace: 'chronoloop-team.slack.com', connectedBy: 'Aspen Herwitz', connectedDate: 'Jan 8, 2025',
    syncLog: [
      { dot: '#22C55E', text: 'Sprint digest delivered to #dev-team', time: '2m' },
      { dot: '#22C55E', text: 'Task "Auth Flow" marked complete \u2014 posted to #general', time: '4h' },
      { dot: '#22C55E', text: 'Daily standup digest sent to 12 members', time: 'Yesterday' },
      { dot: '#FF4D4D', text: 'Rate limit hit \u2014 1 message queued', time: '2 days ago' },
    ],
    config: [
      { label: 'Notification Channel', sub: 'Where task updates are posted', type: 'text', val: '#dev-team' },
      { label: 'Digest Schedule', sub: 'Frequency of summary messages', type: 'select', val: 'Daily', opts: ['Off', 'Daily', 'Weekly'] },
      { label: '@mention on overdue', sub: 'Ping assignee when task goes overdue', type: 'toggle', val: true },
    ],
  },
  github: {
    features: [
      { icon: 'git-pull-request', color: '#24292e', bg: 'rgba(255,255,255,0.06)', title: 'PR \u2192 Task Linking', desc: 'Pull requests are automatically linked to tasks by branch name or commit message.' },
      { icon: 'git-commit', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Commit Tracking', desc: 'Every push event records progress on the linked task timeline.' },
      { icon: 'check-circle', color: '#22C55E', bg: 'rgba(34,197,94,0.12)', title: 'Auto-close Tasks', desc: 'Merging a PR can automatically mark its linked task as completed.' },
    ],
    steps: [
      { t: 'Install the GitHub App', d: 'Authorize ChronoLoop as a GitHub App in your organization settings.' },
      { t: 'Select repositories', d: 'Choose which repos to monitor \u2014 you can add more later.' },
      { t: 'Set branch naming convention', d: 'Use pattern task/TASK-ID or configure a custom prefix.' },
    ],
    reqs: ['GitHub organization owner or repo admin', 'Public or private repos on any plan'],
    workspace: 'github.com/chronoloop-org', connectedBy: 'Roger Dokidis', connectedDate: 'Dec 14, 2024',
    syncLog: [
      { dot: '#4A90FF', text: 'PR #412 "feat/auth-flow" linked to task', time: '6m' },
      { dot: '#22C55E', text: 'Branch "feat/reports" merged \u2014 3 tasks closed', time: '5h' },
      { dot: '#4A90FF', text: 'Commit 8f3c pushed to "fix/calendar-bug"', time: 'Yesterday' },
      { dot: '#22C55E', text: 'PR #408 merged \u2014 task auto-completed', time: '2 days ago' },
    ],
    config: [
      { label: 'Org / Username', sub: 'GitHub org or personal account', type: 'text', val: 'chronoloop-org' },
      { label: 'Branch prefix', sub: 'Pattern to match task branches', type: 'text', val: 'task/' },
      { label: 'Auto-close on merge', sub: 'Complete task when PR is merged', type: 'toggle', val: true },
    ],
  },
  figma: {
    features: [
      { icon: 'image', color: '#F24E1E', bg: 'rgba(242,78,30,0.12)', title: 'Frame Previews', desc: 'Latest Figma frame thumbnails appear inline on task cards.' },
      { icon: 'link', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Design Linking', desc: "Paste any Figma URL and it's embedded with live preview in the task." },
      { icon: 'palette', color: '#A855F7', bg: 'rgba(168,85,247,0.12)', title: 'Token Sync', desc: 'Design tokens (colors, spacing) can be exported as a JSON snapshot.' },
    ],
    steps: [
      { t: 'Authorize Figma OAuth', d: 'Grant ChronoLoop read access to your Figma projects and files.' },
      { t: 'Select team workspace', d: "Pick which Figma team's files to enable for linking." },
      { t: 'Paste Figma URLs in tasks', d: 'Any figma.com link in a task description auto-embeds the frame.' },
    ],
    reqs: ['Figma account (Starter, Professional, or Organization)', 'Edit access to target files'],
    workspace: 'figma.com/team/chronoloop-design', connectedBy: 'Marley Vaccaro', connectedDate: 'Jan 20, 2025',
    syncLog: [
      { dot: '#F24E1E', text: 'Frame "Landing Hero v3" synced to task', time: '12m' },
      { dot: '#F24E1E', text: 'Component library exported \u2014 42 tokens', time: '3h' },
      { dot: '#22C55E', text: 'Design review approved \u2014 task updated', time: 'Yesterday' },
    ],
    config: [
      { label: 'Team Workspace', sub: 'Which Figma team to pull files from', type: 'text', val: 'ChronoLoop Design' },
      { label: 'Auto-refresh', sub: 'Re-sync frame thumbnails every hour', type: 'toggle', val: true },
      { label: 'Token export', sub: 'Include design tokens in task exports', type: 'toggle', val: false },
    ],
  },
  notion: {
    features: [
      { icon: 'database', color: '#000000', bg: 'rgba(255,255,255,0.06)', title: 'Database Sync', desc: 'Mirror tasks to a Notion database \u2014 status, assignee, and due date stay in sync.' },
      { icon: 'file-text', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Doc Embedding', desc: 'Notion pages are embedded directly inside project detail panels.' },
      { icon: 'search', color: '#00D4AA', bg: 'rgba(0,212,170,0.12)', title: 'Workspace Search', desc: "Search Notion from ChronoLoop's universal search bar." },
    ],
    steps: [
      { t: 'Connect Notion workspace', d: "Authorize ChronoLoop via Notion's official OAuth integration page." },
      { t: 'Select your task database', d: 'Pick the Notion database that maps to ChronoLoop tasks.' },
      { t: 'Map properties', d: 'Align Notion properties (Status, Owner, Due) to ChronoLoop fields.' },
    ],
    reqs: ['Notion workspace member (Guest access is insufficient)', 'Notion plan: Free or above'],
    workspace: 'chronoloop.notion.site', connectedBy: 'Aspen Herwitz', connectedDate: 'Feb 2, 2025',
    syncLog: [
      { dot: '#22C55E', text: 'Sprint 5 retro page updated in Notion', time: '22m' },
      { dot: '#22C55E', text: '14 task statuses synced to "Active Tasks" DB', time: '1h' },
      { dot: '#22C55E', text: 'New project "Web 3 App" created in Notion', time: 'Yesterday' },
    ],
    config: [
      { label: 'Task Database', sub: 'Notion DB to mirror tasks into', type: 'text', val: 'Active Tasks' },
      { label: 'Two-way sync', sub: 'Changes in Notion update ChronoLoop too', type: 'toggle', val: true },
      { label: 'Auto-archive', sub: 'Archive Notion page when task is closed', type: 'toggle', val: false },
    ],
  },
  'google-calendar': {
    features: [
      { icon: 'calendar', color: '#4285F4', bg: 'rgba(66,133,244,0.12)', title: 'Sprint Events', desc: 'Sprint start and end dates automatically appear as calendar events.' },
      { icon: 'clock', color: '#00D4AA', bg: 'rgba(0,212,170,0.12)', title: 'Deadline Alerts', desc: 'Task due dates create reminders visible across the whole team.' },
      { icon: 'users', color: '#EAB308', bg: 'rgba(234,179,8,0.12)', title: 'Shared Calendars', desc: 'Events sync to a shared ChronoLoop calendar your whole team can subscribe to.' },
    ],
    steps: [
      { t: 'Sign in with Google', d: 'Authorize ChronoLoop to create and update Google Calendar events.' },
      { t: 'Choose target calendar', d: 'Select or create a "ChronoLoop" calendar in your Google account.' },
      { t: 'Enable event types', d: 'Choose which events to sync: sprints, milestones, task deadlines.' },
    ],
    reqs: ['Google account', 'Google Workspace or personal Google Calendar'],
    workspace: 'calendar.google.com (jacob@chronoloop)', connectedBy: 'Jacob Solayinka', connectedDate: 'Mar 1, 2025',
    syncLog: [
      { dot: '#4285F4', text: 'Milestone "QA Sign-off" event created', time: '1h' },
      { dot: '#4285F4', text: 'Sprint 5 end event updated to Dec 6', time: '3h' },
      { dot: '#22C55E', text: 'Sprint 6 kickoff event sent to 14 attendees', time: '2 days ago' },
    ],
    config: [
      { label: 'Target Calendar', sub: 'Calendar to write events into', type: 'text', val: 'ChronoLoop' },
      { label: 'Include weekends', sub: 'Show sprint events on weekend days', type: 'toggle', val: false },
      { label: 'Reminders', sub: 'Minutes before due date to alert', type: 'text', val: '30' },
    ],
  },
  datadog: {
    features: [
      { icon: 'activity', color: '#774AA4', bg: 'rgba(119,74,164,0.12)', title: 'Incident \u2192 Tasks', desc: 'Critical Datadog alerts auto-create tasks assigned to the on-call engineer.' },
      { icon: 'bar-chart-2', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Deploy Tracking', desc: 'Deployment markers link to the sprint task that triggered the deploy.' },
      { icon: 'bell', color: '#FF8C42', bg: 'rgba(255,140,66,0.12)', title: 'Alert Webhooks', desc: 'Datadog monitor alerts appear in the ChronoLoop activity feed.' },
    ],
    steps: [
      { t: 'Generate a Datadog API key', d: 'In Datadog, go to Organization Settings \u2192 API Keys and create a new key.' },
      { t: 'Paste key in ChronoLoop', d: 'Enter the API key and Application key below to authenticate.' },
      { t: 'Configure alert thresholds', d: 'Choose which monitor priorities trigger task creation.' },
    ],
    reqs: ['Datadog account (any plan)', 'Datadog API Key + Application Key'],
    workspace: 'app.datadoghq.com/chronoloop', connectedBy: 'Roger Dokidis', connectedDate: 'Nov 28, 2024',
    syncLog: [
      { dot: '#22C55E', text: 'Token refreshed \u2014 sync resumed successfully', time: '12 min ago' },
      { dot: '#22C55E', text: 'Monitor "High CPU" alert \u2192 task created', time: '1 day ago' },
      { dot: '#22C55E', text: 'Deploy v2.4.1 linked to sprint task', time: '2 days ago' },
    ],
    config: [
      { label: 'API Key', sub: 'Datadog API key for read access', type: 'text', val: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20229e40' },
      { label: 'App Key', sub: 'Datadog Application key', type: 'text', val: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022b1c2' },
      { label: 'Min alert level', sub: 'Minimum priority to create tasks', type: 'select', val: 'Critical', opts: ['Warning', 'Error', 'Critical'] },
    ],
  },
  'google-drive': {
    features: [
      { icon: 'folder', color: '#1DA462', bg: 'rgba(29,164,98,0.12)', title: 'File Attachments', desc: 'Attach any Drive file to a task or project \u2014 team members see a live preview.' },
      { icon: 'upload', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Auto-upload', desc: 'Exported reports and sprint summaries are automatically saved to a Drive folder.' },
      { icon: 'share-2', color: '#EAB308', bg: 'rgba(234,179,8,0.12)', title: 'Shared Folders', desc: 'Create shared project folders in Drive directly from the Projects page.' },
    ],
    steps: [
      { t: 'Sign in with Google', d: 'Authorize ChronoLoop to access Drive files you select.' },
      { t: 'Pick a root folder', d: 'Choose or create a "ChronoLoop" folder where exports will be saved.' },
      { t: 'Start attaching files', d: 'Use the paperclip icon on any task card to browse and attach Drive files.' },
    ],
    reqs: ['Google account', 'Google Drive (free 15 GB or Workspace storage)'],
    workspace: null, connectedBy: null, connectedDate: null, syncLog: [], config: [],
  },
  jira: {
    features: [
      { icon: 'refresh-cw', color: '#0052CC', bg: 'rgba(0,82,204,0.12)', title: 'Two-way Issue Sync', desc: 'Issues created in Jira appear as tasks in ChronoLoop \u2014 and vice versa.' },
      { icon: 'layout', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Sprint Mirroring', desc: 'Jira sprints mirror to ChronoLoop sprint boards with full status visibility.' },
      { icon: 'sliders', color: '#00D4AA', bg: 'rgba(0,212,170,0.12)', title: 'Custom Field Map', desc: "Map Jira's custom fields to ChronoLoop properties with point-and-click config." },
    ],
    steps: [
      { t: 'Enter your Jira domain', d: 'Provide your company.atlassian.net URL to start the OAuth flow.' },
      { t: 'Authorize Atlassian OAuth', d: 'Grant ChronoLoop access to your Jira projects and issues.' },
      { t: 'Select projects to sync', d: 'Pick which Jira projects map to ChronoLoop. Others remain unlinked.' },
    ],
    reqs: ['Jira Software account (Cloud or Server)', 'Project Admin role on target projects'],
    workspace: null, connectedBy: null, connectedDate: null, syncLog: [], config: [],
  },
  linear: {
    features: [
      { icon: 'zap', color: '#5E6AD2', bg: 'rgba(94,106,210,0.12)', title: 'Cycle Sync', desc: 'Linear cycles sync as ChronoLoop sprints \u2014 velocity and points included.' },
      { icon: 'tag', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Label Mapping', desc: 'Linear labels translate to ChronoLoop priority and category tags.' },
      { icon: 'git-merge', color: '#00D4AA', bg: 'rgba(0,212,170,0.12)', title: 'Team Import', desc: 'Linear teams map to ChronoLoop project groups with member access preserved.' },
    ],
    steps: [
      { t: 'Connect Linear workspace', d: "Authorize ChronoLoop via Linear's OAuth \u2014 no API key needed." },
      { t: 'Map teams to projects', d: 'Align Linear teams with ChronoLoop projects in the mapping UI.' },
      { t: 'Import existing issues', d: 'Optionally import open issues from the last 30 days.' },
    ],
    reqs: ['Linear workspace (Member role or above)', 'Beta feature \u2014 submit feedback to improve it'],
    workspace: null, connectedBy: null, connectedDate: null, syncLog: [], config: [],
  },
  zoom: {
    features: [
      { icon: 'video', color: '#2D8CFF', bg: 'rgba(45,140,255,0.12)', title: 'Meeting Scheduler', desc: 'Schedule standups and reviews directly from task cards \u2014 invite links auto-added.' },
      { icon: 'mic', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Recordings', desc: 'Meeting recordings are linked to the task or sprint they were scheduled from.' },
      { icon: 'clock', color: '#00D4AA', bg: 'rgba(0,212,170,0.12)', title: 'Calendar Sync', desc: 'Zoom meetings appear in Google Calendar integration events automatically.' },
    ],
    steps: [
      { t: 'Sign in with Zoom', d: 'OAuth handshake grants ChronoLoop permission to schedule meetings.' },
      { t: 'Set default meeting settings', d: 'Choose recurrence, waiting room, and recording preferences.' },
      { t: 'Add meetings to tasks', d: 'Use the camera icon on any task to schedule or join a Zoom call.' },
    ],
    reqs: ['Zoom account (Basic, Pro, or Business)', 'Host role in Zoom account'],
    workspace: null, connectedBy: null, connectedDate: null, syncLog: [], config: [],
  },
  dropbox: {
    features: [
      { icon: 'folder', color: '#0061FF', bg: 'rgba(0,97,255,0.12)', title: 'File Browsing', desc: 'Browse your Dropbox folders from the file picker inside tasks and projects.' },
      { icon: 'share-2', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Shared Links', desc: 'Generate Dropbox shared links from ChronoLoop without switching tabs.' },
      { icon: 'download', color: '#EAB308', bg: 'rgba(234,179,8,0.12)', title: 'Bulk Downloads', desc: 'Download all files attached to a completed sprint as a single Dropbox ZIP.' },
    ],
    steps: [
      { t: 'Connect Dropbox account', d: 'Authorize ChronoLoop to read selected files and create shared links.' },
      { t: 'Set root folder', d: 'Pick a "ChronoLoop" folder in Dropbox as the default for uploads.' },
      { t: 'Attach files to tasks', d: 'Use the attachment menu on any task to browse and link Dropbox files.' },
    ],
    reqs: ['Dropbox account (Basic or Business)', 'Folder sharing enabled in account settings'],
    workspace: null, connectedBy: null, connectedDate: null, syncLog: [], config: [],
  },
  zapier: {
    features: [
      { icon: 'zap', color: '#FF4A00', bg: 'rgba(255,74,0,0.12)', title: '5,000+ Apps', desc: "Connect ChronoLoop to any app in Zapier's catalog \u2014 no code required." },
      { icon: 'settings', color: '#4A90FF', bg: 'rgba(74,144,255,0.12)', title: 'Trigger Events', desc: 'Task created, status changed, sprint started \u2014 all available as Zap triggers.' },
      { icon: 'plus', color: '#22C55E', bg: 'rgba(34,197,94,0.12)', title: 'Action Support', desc: 'Create tasks, update statuses, and add comments from external Zaps.' },
    ],
    steps: [
      { t: 'Get your Zapier API key', d: 'Copy the ChronoLoop API key and paste it into the Zapier app setup.' },
      { t: 'Create a Zap', d: 'In Zapier, search for "ChronoLoop" and choose a trigger or action.' },
      { t: 'Test and activate', d: 'Run a test event, verify it works, then switch the Zap to live.' },
    ],
    reqs: ['Zapier account (Free tier supports 5 Zaps)', 'ChronoLoop API key (available in API Keys panel)'],
    workspace: null, connectedBy: null, connectedDate: null, syncLog: [], config: [],
  },
}

export const INT_ACTIVITY: IntActivityItem[] = [
  { dot: '#22C55E', text: '<strong>Slack</strong> delivered sprint digest to #dev-team', time: '2m' },
  { dot: '#4A90FF', text: '<strong>GitHub</strong> PR #412 linked to task "Auth Flow"', time: '6m' },
  { dot: '#F24E1E', text: '<strong>Figma</strong> design synced for "Landing Page Redesign"', time: '14m' },
  { dot: '#555555', text: '<strong>Notion</strong> page updated \u2014 Sprint 5 retrospective', time: '22m' },
  { dot: '#4285F4', text: '<strong>Google Calendar</strong> milestone "QA Sign-off" added', time: '1h' },
  { dot: '#774AA4', text: '<strong>Datadog</strong> metrics synced \u2014 94 API calls logged', time: '12m' },
  { dot: '#22C55E', text: '<strong>Slack</strong> task completion posted to #general', time: '4h' },
  { dot: '#4A90FF', text: '<strong>GitHub</strong> branch "feat/reports" merged \u2014 3 tasks closed', time: '5h' },
]

export const INT_KEYS: IntApiKey[] = [
  { id: 'k1', label: 'Production Key', val: 'ck_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20224f9a', scope: 'Full Access', created: 'Jan 12', expires: 'Jul 12' },
  { id: 'k2', label: 'Staging Key', val: 'ck_test_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022b2c1', scope: 'Read Only', created: 'Feb 3', expires: 'May 3' },
  { id: 'k3', label: 'CI/CD Key', val: 'ck_ci_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20229e40', scope: 'Write Only', created: 'Apr 18', expires: 'Oct 18' },
]

export const INT_USAGE: IntUsageRow[] = [
  { name: 'GitHub', count: 2341, color: 'var(--accent-blue)', max: 3000 },
  { name: 'Slack', count: 847, color: '#9E6BA4', max: 3000 },
  { name: 'Figma', count: 412, color: '#F24E1E', max: 3000 },
  { name: 'Notion', count: 619, color: 'var(--text-secondary)', max: 3000 },
  { name: 'Calendar', count: 288, color: '#4285F4', max: 3000 },
  { name: 'Datadog', count: 94, color: 'var(--accent-purple)', max: 3000 },
]

export const INT_WEBHOOKS: IntWebhook[] = [
  { active: true, url: 'https://hooks.slack.com/services/T01\u2026XYZ', event: 'task.completed' },
  { active: true, url: 'https://api.chronoloop.io/wh/github-push', event: 'sprint.started' },
  { active: false, url: 'https://notify.zapier.com/hooks/catch/\u2026', event: 'project.created' },
  { active: true, url: 'https://datadog.intake.app/api/v1/events', event: 'task.overdue' },
]

export const INT_SYNC_ROWS: IntSyncRule[] = [
  { name: 'Task status \u2192 Slack', detail: 'Post message on every status change', on: true },
  { name: 'GitHub commits \u2192 Tasks', detail: 'Auto-link commits by branch name', on: true },
  { name: 'Sprint start/end \u2192 Calendar', detail: 'Create calendar events for sprint dates', on: true },
  { name: 'Notion docs \u2192 Projects', detail: 'Embed Notion pages in project detail', on: false },
  { name: 'Figma frames \u2192 Tasks', detail: 'Attach latest frame thumbnail to task', on: true },
  { name: 'Datadog alerts \u2192 Tasks', detail: 'Create tasks from critical monitors', on: false },
]
