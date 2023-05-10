import React, { useEffect, useState } from 'react'
import './App.css'

type newStyleType = {
  [key: string]: string
}

interface dataType {
  order: number
  description: string
  answer: React.CSSProperties
}

function App() {
  let [cssText, setCssText] = useState<string>('')
  let [styleOfTask, setStyleOfTask] = useState<React.CSSProperties>({})
  let [data, setData] = useState<dataType[]>()

  useEffect(() => {
    fetch('./data.json')
      .then((response) => response.json())
      .then((json) => setData(json))
  }, [])

  // Проверяем введенные данные пользователя
  const onChangeCssText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCssText(e.target.value)

    let array = e.target.value.split(' ').join('').split(':')
    let newStyle: newStyleType = {}
    if (array.length === 2) {
      if (array[1].slice(-1) === ';') {
        array[1] = array[1].slice(0, -1)
      }
      newStyle[array[0]] = array[1]
      setStyleOfTask(newStyle)
    }
  }

  return (
    <div className="App">
      <header className="App-header"></header>
      <section className="main">
        {data ? (
          <>
            <div className="task">
              <div className="task__description">
                <h2>Задание {data[0].order}</h2>
                <p>{data[0].description}</p>
              </div>
              <div className="task__editor">
                <h2>Редактор</h2>
                <div>.text &#123;</div>
                <input value={cssText} onChange={onChangeCssText} />
                <div>&#125;</div>
              </div>
            </div>
            <div className="player">
              <h2>Визуальное отображение</h2>

              <div style={styleOfTask}>тектст теста</div>
            </div>
          </>
        ) : (
          'Загрузка...'
        )}
      </section>
      <footer></footer>
    </div>
  )
}

export default App
