import { useState } from "react"
import { Socket } from "socket.io-client"
import useLocalStorageState from "use-local-storage-state"
import UnderlinedInput from "../ui/UnderlinedInput"
import InsertButton from "../ui/InsertButton"
import { IconTrash } from "@tabler/icons-react"


type Question = {
  question?: string,
  answer?: string,
  alternateAnswers?: string
}

type QuestionProps = {
  index: number,
  question: Question,
  updateQuestion: (index: number, question: Question) => void,
  deleteQuestion: (index: number) => void 
}

const Question = ({ index, question, updateQuestion, deleteQuestion }: QuestionProps) => {
  return (
    <div key={index}>
      <UnderlinedInput
        name="Question"
        value={question.question || ''}
        onChange={e => updateQuestion(index, {
            question: (e.target as HTMLInputElement).value,
            answer: question.answer,
            alternateAnswers: question.alternateAnswers
        })}
      ></UnderlinedInput>

      <UnderlinedInput
        name="Answer"
        value={question.answer || ''}
        onChange={e => updateQuestion(index, {
          question: question.question,
          answer: (e.target as HTMLInputElement).value,
          alternateAnswers: question.alternateAnswers
      })}
      ></UnderlinedInput>

      <UnderlinedInput
        name="Alternate answers (separate with comma)"
        value={question.alternateAnswers || ''}
        onChange={e => updateQuestion(index, {
          question: question.question,
          answer: question.answer,
          alternateAnswers: (e.target as HTMLInputElement).value
      })}
      ></UnderlinedInput>
      <button onClick={() => deleteQuestion(index)}>
        <IconTrash size="18" />
      </button>
    </div>
  )
}

const Questions = ({ socket, roomId }: { socket: Socket, roomId: string }) => {
  const [questions, setQuestions] = useLocalStorageState<Question[]>('questions', {
    defaultValue: []
  })

  return <>
    <h1 className="text-center text-2xl font-bold">Edit Questions</h1>
    
    {questions.map((question, index) => (
      <Question
        index={index}
        question={question}
        updateQuestion={(index, question) => {
          setQuestions(questionsList => (
            questionsList.map((q, i) => i === index ? question : q)
          ))
        }}
        deleteQuestion={(index: number) => {
          setQuestions(questionsList => (
            questionsList.filter((q, i) => i !== index)
          ))
        }}
      ></Question>
    ))}

    <InsertButton text="New Question" onClick={e => {
      setQuestions(questionsList => [...questionsList, {
        question: '',
        answer: '',
        alternateAnswers: ''
      }])
    }}></InsertButton>


  </>
}

export default Questions