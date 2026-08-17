import { useState } from 'react'
import { Zap, Sun, CalendarDays, BellOff } from 'lucide-react'
import { SettingsCard } from '../shared/SettingsCard'
import { ToggleRow } from '../shared/ToggleRow'
import { RadioCardGroup } from '../shared/RadioCardGroup'

export function NotificationsTab() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    all: true, dnd: false,
    emailAssigned: true, emailComments: true, emailDue1: true, emailDue3: false, emailSprint: true, emailProject: true, emailWeekly: true,
    appStatus: true, appNewMember: true, appIntegration: true, appOverdue: true, appMentions: true,
  })
  const [digest, setDigest] = useState('immediate')

  const toggle = (key: string) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <>
      <SettingsCard title="Notification Preferences" subtitle="Choose when and how you get notified">
        <ToggleRow label="All Notifications" description="Master toggle — pause all notifications at once" checked={toggles.all} onChange={() => toggle('all')} />
        <ToggleRow label="Do Not Disturb" description="Mute notifications outside working hours (09:00–18:00)" checked={toggles.dnd} onChange={() => toggle('dnd')} />
      </SettingsCard>

      <SettingsCard title="Email Notifications">
        <ToggleRow label="Task assigned to you" description="When someone assigns a task directly to you" checked={toggles.emailAssigned} onChange={() => toggle('emailAssigned')} />
        <ToggleRow label="Comments & mentions" description="When you're mentioned or replied to in a comment" checked={toggles.emailComments} onChange={() => toggle('emailComments')} />
        <ToggleRow label="Due date reminder (1 day)" description="24-hour reminder before task deadline" checked={toggles.emailDue1} onChange={() => toggle('emailDue1')} />
        <ToggleRow label="Due date reminder (3 days)" description="72-hour early warning before task deadline" checked={toggles.emailDue3} onChange={() => toggle('emailDue3')} />
        <ToggleRow label="Sprint started / completed" description="Alerts when your sprints change status" checked={toggles.emailSprint} onChange={() => toggle('emailSprint')} />
        <ToggleRow label="Project status updates" description="When a project moves to a new phase" checked={toggles.emailProject} onChange={() => toggle('emailProject')} />
        <ToggleRow label="Weekly digest" description="Summary of your week every Friday at 5PM" checked={toggles.emailWeekly} onChange={() => toggle('emailWeekly')} />
      </SettingsCard>

      <SettingsCard title="In-App Notifications">
        <ToggleRow label="Task status changes" description="Real-time updates when task status is updated" checked={toggles.appStatus} onChange={() => toggle('appStatus')} />
        <ToggleRow label="New team member joins" description="When someone accepts a workspace invitation" checked={toggles.appNewMember} onChange={() => toggle('appNewMember')} />
        <ToggleRow label="Integration alerts" description="Sync failures or connection errors from integrations" checked={toggles.appIntegration} onChange={() => toggle('appIntegration')} />
        <ToggleRow label="Overdue task alerts" description="Remind me when I have overdue tasks" checked={toggles.appOverdue} onChange={() => toggle('appOverdue')} />
        <ToggleRow label="@Mentions in comments" description="Instant notification when you're tagged" checked={toggles.appMentions} onChange={() => toggle('appMentions')} />
      </SettingsCard>

      <SettingsCard title="Digest Frequency" subtitle="How often you receive summary emails">
        <RadioCardGroup
          options={[
            { id: 'immediate', icon: <Zap size={17} />, label: 'Immediate' },
            { id: 'daily', icon: <Sun size={17} />, label: 'Daily' },
            { id: 'weekly', icon: <CalendarDays size={17} />, label: 'Weekly' },
            { id: 'never', icon: <BellOff size={17} />, label: 'Never' },
          ]}
          value={digest}
          onChange={setDigest}
        />
      </SettingsCard>
    </>
  )
}
