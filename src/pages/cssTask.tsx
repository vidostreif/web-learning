import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import imgCharacter from '../img/character.png'
import parse from 'html-react-parser'

type newStyleType = {
  [key: string]: string
}

type answerType = {
  [key: string]: {
    value: string
    chek: boolean
  }
}

interface dataType {
  order: number
  description: string
  answer: { [key: string]: string }
}

function CssTask() {
  let [cssText, setCssText] = useState<string>('')
  let [styleOfTask, setStyleOfTask] = useState<React.CSSProperties>({})
  let [data, setData] = useState<dataType[]>()
  let [win, setWin] = useState<boolean>(false)
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

    // убираем лишние пробелы и разбиваем на объявления стилей
    let stylesArray = e.target.value.split(' ').join('').split(';')
    const newStyles: newStyleType = {}

    // копируем ответ в новый объект для последующей проверки
    let answer: answerType = {}
    if (data && taskNumber && data[taskNumber - 1].answer) {
      for (const [key, value] of Object.entries(data[taskNumber - 1].answer)) {
        answer[key] = { value, chek: false }
      }
    }

    stylesArray.forEach(function (item, index, array) {
      //разбиваем стиль на свойство и значение
      let [property, value] = item.split(':')

      // ищем пару свойство и значение в ответе
      if (property in answer) {
        if (answer[property].value.toLowerCase() === value.toLowerCase()) {
          answer[property].chek = true
        }
      }

      // свойство стиля пределываем под стандарт реакта
      let propArray = property.split('-')
      let propString = propArray[0]
      for (let index = 1; index < propArray.length; index++) {
        if (propArray[index].length > 0) {
          propString += propArray[index][0].toUpperCase() + propArray[index].slice(1)
        }
      }
      property = propString

      //преобразуем в стиль React.CSSProperties
      if (property && value) {
        if (value.slice(-1) === ';') {
          value = value.slice(0, -1)
        }
        newStyles[property] = value
      }
    })

    // проверяем все ли свойства из правильного ответа ввел пользователь
    let pass = true
    if (Object.keys(answer).length !== 0) {
      for (const key in answer) {
        if (!answer[key].chek) {
          pass = false
        }
      }
    }

    console.log(pass)
    console.log(newStyles)
    setStyleOfTask(newStyles)
  }

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
          <p>{parse(data[taskNumber - 1].description)}</p>
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
