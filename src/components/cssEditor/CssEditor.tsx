import React from 'react'
import styles from './CssEditor.module.scss'

type Props = { inputValue: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }

function CssEditor({ inputValue, onChange }: Props) {
  let lineNumbering
  for (let index = 1; index < 10; index++) {
    lineNumbering = (
      <>
        {lineNumbering}
        <div>{index}</div>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.numberLine}>{lineNumbering}</div>
      <div className={styles.field}>
        <div>
          <code>.field &#123;</code>
        </div>

        <div className={styles.field__parameter}>
          <code> display: flex;</code>
        </div>
        <div className={styles.field__parameter}>
          <input className={styles.field__input} value={inputValue} onChange={onChange} placeholder="Пиши здесь..." />
        </div>

        <div>
          <code>&#125;</code>
        </div>
      </div>
    </div>
  )
}

export default CssEditor
