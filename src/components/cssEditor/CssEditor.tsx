import React from 'react'
import styles from './CssEditor.module.scss'

type Props = { inputValue: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }

function CssEditor({ inputValue, onChange }: Props) {
  return (
    <div className={styles.container}>
      {/* <h2>Редактор</h2> */}
      <div>.person &#123;</div>
      <input value={inputValue} onChange={onChange} />
      <div>&#125;</div>
    </div>
  )
}

export default CssEditor
