import { Zap, Sun, CalendarDays, BellOff } from 'lucide-react'
import { SettingsCard } from '../shared/SettingsCard'
import { ToggleRow } from '../shared/ToggleRow'
import { RadioCardGroup } from '../shared/RadioCardGroup'
import { useSettingsStore } from '../../../store/settingsStore'

export function NotificationsTab() {
  const notifications = useSettingsStore((s) => s.notifications)
  const toggleNotification = useSettingsStore((s) => s.toggleNotification)
  const digestFrequency = useSettingsStore((s) => s.digestFrequency)
  const setDigestFrequency = useSettingsStore((s) => s.setDigestFrequency)

  return (
    <>
      <SettingsCard title="Notification Preferences" subtitle="Choose when and how you get notified">
        <ToggleRow label="All Notifications" description="Master toggle — pause all notifications at once" checked={notifications.all} onChange={() => toggleNotification('all')} />
        <ToggleRow label="Do Not Disturb" description="Mute notifications outside working hours (09:00–18:00)" checked={notifications.dnd} onChange={() => toggleNotification('dnd')} />
      </SettingsCard>

      <SettingsCard title="Email Notifications">
        <ToggleRow label="Task assigned to you" description="When someone assigns a task directly to you" checked={notifications.emailAssigned} onChange={() => toggleNotification('emailAssigned')} />
        <ToggleRow label="Comments & mentions" description="When you're mentioned or replied to in a comment" checked={notifications.emailComments} onChange={() => toggleNotification('emailComments')} />
        <ToggleRow label="Due date reminder (1 day)" description="24-hour reminder before task deadline" checked={notifications.emailDue1} onChange={() => toggleNotification('emailDue1')} />
        <ToggleRow label="Due date reminder (3 days)" description="72-hour early warning before task deadline" checked={notifications.emailDue3} onChange={() => toggleNotification('emailDue3')} />
        <ToggleRow label="Sprint started / completed" description="Alerts when your sprints change status" checked={notifications.emailSprint} onChange={() => toggleNotification('emailSprint')} />
        <ToggleRow label="Project status updates" description="When a project moves to a new phase" checked={notifications.emailProject} onChange={() => toggleNotification('emailProject')} />
        <ToggleRow label="Weekly digest" description="Summary of your week every Friday at 5PM" checked={notifications.emailWeekly} onChange={() => toggleNotification('emailWeekly')} />
      </SettingsCard>

      <SettingsCard title="In-App Notifications">
        <ToggleRow label="Task status changes" description="Real-time updates when task status is updated" checked={notifications.appStatus} onChange={() => toggleNotification('appStatus')} />
        <ToggleRow label="New team member joins" description="When someone accepts a workspace invitation" checked={notifications.appNewMember} onChange={() => toggleNotification('appNewMember')} />
        <ToggleRow label="Integration alerts" description="Sync failures or connection errors from integrations" checked={notifications.appIntegration} onChange={() => toggleNotification('appIntegration')} />
        <ToggleRow label="Overdue task alerts" description="Remind me when I have overdue tasks" checked={notifications.appOverdue} onChange={() => toggleNotification('appOverdue')} />
        <ToggleRow label="@Mentions in comments" description="Instant notification when you're tagged" checked={notifications.appMentions} onChange={() => toggleNotification('appMentions')} />
      </SettingsCard>

      <SettingsCard title="Digest Frequency" subtitle="How often you receive summary emails">
        <RadioCardGroup
          options={[
            { id: 'immediate', icon: <Zap size={17} />, label: 'Immediate' },
            { id: 'daily', icon: <Sun size={17} />, label: 'Daily' },
            { id: 'weekly', icon: <CalendarDays size={17} />, label: 'Weekly' },
            { id: 'never', icon: <BellOff size={17} />, label: 'Never' },
          ]}
          value={digestFrequency}
          onChange={setDigestFrequency}
        />
      </SettingsCard>
    </>
  )
}
