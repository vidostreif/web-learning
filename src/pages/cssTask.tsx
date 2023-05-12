import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import imgCharacter from '../img/character.png'
import { forEachChild } from 'typescript'

type newStyleType = {
  [key: string]: string
}

interface dataType {
  order: number
  description: string
  answer: React.CSSProperties
}

function CssTask() {
  let [cssText, setCssText] = useState<string>('')
  let [styleOfTask, setStyleOfTask] = useState<React.CSSProperties>({})
  let [data, setData] = useState<dataType[]>()
  let [taskNumber, setTaskNumber] = useState<number>()
  let url = useLocation()

  useEffect(() => {
    let pathnameArray = url.pathname.split('/')
    const newTaskNumber = parseInt(pathnameArray[pathnameArray.length - 1])
    if (newTaskNumber) {
      setTaskNumber(newTaskNumber)
    }
  }, [url])

  useEffect(() => {
    fetch('../data.json')
      .then((response) => response.json())
      .then((json) => setData(json))
  }, [])

  // Проверяем введенные данные пользователя
  const onChangeCssText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCssText(e.target.value)

    // убираем лишние пробелы и разбиваем стиль на свойство и значение
    let array = e.target.value.split(' ').join('').split(':')

    // свойство стиля пределываем под стандарт реакта
    let propArray = array[0].split('-')
    let propString = propArray[0]
    for (let index = 1; index < propArray.length; index++) {
      propString += propArray[index][0].toUpperCase() + propArray[index].slice(1)
    }
    array[0] = propString

    //преобразуем в стиль React.CSSProperties
    let newStyle: newStyleType = {}
    if (array.length === 2) {
      if (array[1].slice(-1) === ';') {
        array[1] = array[1].slice(0, -1)
      }
      newStyle[array[0]] = array[1]
      setStyleOfTask(newStyle)
    }
  }

  console.log(styleOfTask)

  if (!data) {
    return <>Загрузка...</>
  }

  if (!taskNumber) {
    return <>Неизвестный номер задания</>
  }

  if (taskNumber < 0 || taskNumber > data.length) {
    return <>Задания под номером {taskNumber} нет</>
  }

  return (
    <>
      <div className="task">
        <div className="task__description">
          <h1>{url.pathname}</h1>
          <h2>Задание {data[taskNumber - 1].order}</h2>
          <p>{data[taskNumber - 1].description}</p>
        </div>
        <div className="task__editor">
          <h2>Редактор</h2>
          <div>.text &#123;</div>
          <input value={cssText} onChange={onChangeCssText} />
          <div>&#125;</div>
        </div>
      </div>
      <div className="player" style={styleOfTask}>
        {/* <h2>Визуальное отображение</h2> */}

        <img src={imgCharacter} alt="character" className="character" />
      </div>
    </>
  )
}

export default CssTask
