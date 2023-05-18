import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import imgCharacter from '../img/character.png'
import parse from 'html-react-parser'
import CssEditor from '../components/cssEditor/CssEditor'

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
  let [styleOfPlayingField, setStyleOfPlayingField] = useState<React.CSSProperties>({})
  let [styleOfBackground, setStyleOfBackground] = useState<React.CSSProperties>({})
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
    //определяем стиль ответа
    let answer: newStyleType = {}
    if (data && taskNumber && data[taskNumber - 1].answer) {
      for (const [key, value] of Object.entries(data[taskNumber - 1].answer)) {
        answer[cssToReactStyle(key)] = value
      }
      setStyleOfBackground(answer)
    }
  }, [data, taskNumber])

  useEffect(() => {
    fetch('../data.json')
      .then((response) => response.json())
      .then((json) => setData(json))
  }, [])

  // конвертируем свойство CSS в стандарт реакта
  function cssToReactStyle(property: string) {
    let propArray = property.split('-')
    let propString = propArray[0]
    for (let index = 1; index < propArray.length; index++) {
      if (propArray[index].length > 0) {
        propString += propArray[index][0].toUpperCase() + propArray[index].slice(1)
      }
    }
    return propString
  }

  // проверяем введеный ответ
  function checkAnswer(stylesArray: string[]) {
    // копируем правильный ответ в новый объект для последующей проверки
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
    return pass
  }

  // конвертируем массив строк в React.CSSProperties
  function conversionStringArrayToReactCSSProperties(stylesArray: string[]) {
    const newStyles: newStyleType = {}

    stylesArray.forEach(function (item, index, array) {
      //разбиваем стиль на свойство и значение
      let [property, value] = item.split(':')

      property = cssToReactStyle(property)

      //преобразуем в стиль React.CSSProperties
      if (property && value) {
        if (value.slice(-1) === ';') {
          value = value.slice(0, -1)
        }
        newStyles[property] = value
      }
    })
    return newStyles
  }

  const onChangeCssText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCssText(e.target.value)

    setStyleOfPlayingField({})
    // убираем лишние пробелы и разбиваем на объявления стилей
    let stylesArray = e.target.value.split(' ').join('').split(';')

    const newStyles = conversionStringArrayToReactCSSProperties(stylesArray)
    setStyleOfPlayingField(newStyles)

    setWin(checkAnswer(stylesArray))
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
          <h2>Задание {data[taskNumber - 1].order}</h2>
          <p>{parse(data[taskNumber - 1].description)}</p>
        </div>
        <div className="task__editor">
          <CssEditor inputValue={cssText} onChange={onChangeCssText} />
          {/* <div>{JSON.stringify(data[taskNumber - 1].answer)}</div> */}
        </div>
      </div>
      <div className="board">
        <div id="playingField" className="board__playingField" style={styleOfPlayingField}>
          <img id="rabbit" src={imgCharacter} alt="rabbit" className="rabbit" />
        </div>
        <div id="background" className="board__background" style={styleOfBackground}>
          <img id="carrot" src={imgCharacter} alt="carrot" className="carrot" />
        </div>
      </div>
    </>
  )
}

export default CssTask
