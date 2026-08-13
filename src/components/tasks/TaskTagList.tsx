import styles from './TaskTagList.module.css'

interface TaskTagListProps {
  tags: string[]
  max?: number
}

export function TaskTagList({ tags, max = 2 }: TaskTagListProps) {
  return (
    <div className={styles.list}>
      {tags.slice(0, max).map((tag) => (
        <span key={tag} className={styles.tag}>{tag}</span>
      ))}
    </div>
  )
}
